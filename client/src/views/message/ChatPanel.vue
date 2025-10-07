<template>
	<div class="chat-panel d-flex">
		<div class="chat-header d-flex bg-default">
			<div class="chat-header-left d-flex">
				<img
					class="contact-avatar pill"
					:src="getAvatarUrl(currentConversation.avatar)"
					:alt="currentConversation.username"
				/>
				<div class="contact-info">
					<div class="contact-name">{{ currentConversation.username }}</div>
					<div class="contact-state" :class="isContactOnline ? null : 'text-warning'">
						{{ isContactOnline ? t('message.online') : t('message.offline') }}
					</div>
				</div>
			</div>
			<div class="chat-header-right">
				<RouterLink :to="`/profile/${currentConversation.username}`">
					<GSymbol font-size="24px">info</GSymbol>
				</RouterLink>
			</div>
		</div>
		<ChatContent
			ref="chatContent"
			v-model:loading="isLoadingMessages"
			v-model:has-more="hasMore"
			v-model:messages="messages"
			:is-ready="isReady"
			:current-conversation="currentConversation"
		/>
		<MessageInput
			@scroll-to-bottom="scrollToBottom"
			@send-message="sendMessage"
			@update-id-and-created-at="updateIdAndCreatedAt"
			:current-conversation="currentConversation"
		/>
	</div>
</template>

<script setup lang="ts">
	import axios from 'axios'
	import { storeToRefs } from 'pinia'
	import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
	import { useI18n } from 'vue-i18n'

	import GSymbol from '@/components/icons/GSymbol.vue'
	import MessageInput from '@/views/message/Input.vue'
	import { getSocket } from '@/socket'
	import { useAuthStore } from '@/stores/AuthStore'
	import { useFriendStore } from '@/stores/FriendStore'
	import { useMessageStore } from '@/stores/MessageStore'
	import type { Conversation, Message } from '@/types'
	import { getAvatarUrl, handleRequestError } from '@/utils/helpers'
	import ChatContent from '@/views/message/ChatContent.vue'

	// types
	type Props = {
		currentConversation: Conversation
	}

	// props
	const { currentConversation } = defineProps<Props>()

	// stores
	const friendStore = useFriendStore()
	const { onlineFriends } = storeToRefs(friendStore)
	const messageStore = useMessageStore()
	const { getMessageCache, setMessageCache, getHasMoreMessages, setHasMoreMessages } =
		messageStore
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	// socket
	const socket = getSocket()

	// vue-i18n
	const { t } = useI18n()
	const isContactOnline = computed(() => {
		return onlineFriends.value.has(currentConversation.recipientId)
	})
	const hasMore = ref(true)
	const messages = ref<Message[]>([])

	const sendMessage = async (message: Message) => {
		messages.value.push(message)
	}

	const updateIdAndCreatedAt = (_id: string, createdAt: string, localKey: string) => {
		const target = messages.value.find((message) => message.localKey === localKey)
		if (!target) return

		target._id = _id
		target.createdAt = createdAt
	}
	const chatContentRef = useTemplateRef('chatContent')
	const handleMessage = async (message: Message) => {
		if (
			message.conversationId !== currentConversation._id ||
			message.senderId === user.value!._id
		)
			return

		messages.value.push(message)

		await nextTick()
		chatContentRef.value?.scrollToBottom()
		const messageCache = getMessageCache(message.conversationId)
		if (!messageCache) return
		messageCache.push(message)
		if (messageCache.length > 200) messageCache.shift()
	}
	const isLoadingMessages = ref(false)
	const isReady = ref(false)

	watch(
		() => currentConversation,
		async (newVal) => {
			isLoadingMessages.value = true
			isReady.value = false

			const { _id: conversationId } = newVal
			const cachedMessages = getMessageCache(conversationId)
			if (cachedMessages) {
				messages.value = [...cachedMessages]
				const cachedHasMore = getHasMoreMessages(conversationId)
				if (cachedHasMore !== undefined) {
					hasMore.value = cachedHasMore
				}
			}

			try {
				const res = await axios.get('/api/message', {
					params: {
						conversationId,
						limit: 50,
					},
				})
				hasMore.value = res.data.hasMore
				setHasMoreMessages(conversationId, res.data.hasMore)
				messages.value = [...res.data.messages]
				setMessageCache(conversationId, res.data.messages)

				await nextTick()
				chatContentRef.value?.scrollToBottom()

				return { success: true }
			} catch (error) {
				handleRequestError(error)
			} finally {
				isLoadingMessages.value = false
				isReady.value = true
			}
		},
		{ immediate: true },
	)

	const scrollToBottom = () => {
		chatContentRef.value?.scrollToBottom()
	}
	onMounted(() => {
		scrollToBottom()
		socket?.on('message-received', handleMessage)
	})
	onUnmounted(() => {
		socket?.off('message-received', handleMessage)
	})
</script>

<style scoped>
	.chat-panel {
		flex: 1;
		flex-direction: column;
	}
	.chat-panel img {
		width: 44px;
		height: 44px;
	}
	.chat-header {
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
		height: 76px;
		border-bottom: 1px var(--color-text-muted) solid;
	}
	.chat-header-left {
		align-items: center;
		gap: 10px;
	}
	.contact-name {
		font-size: 17px;
		margin-bottom: 5px;
	}
	.contact-state {
		font-size: 13px;
		margin-bottom: 5px;
	}
</style>
