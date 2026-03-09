<template>
	<div class="chat-box d-flex">
		<div class="chat-header d-flex bg-default">
			<div class="chat-header-left d-flex">
				<img
					class="contact-avatar pill"
					:src="currentConversation.avatar"
					:alt="currentConversation.username"
				/>
				<div class="contact-info">
					<div class="contact-name">{{ currentConversation.username }}</div>
					<div class="contact-state" :class="isContactOnline ? null : 'text-warning'">
						{{ isContactOnline ? '上線中' : '離線中' }}
					</div>
				</div>
			</div>
			<div class="chat-header-right"><GSymbol>info</GSymbol></div>
		</div>
		<div class="chat-content d-flex">
			<div
				class="message text-inverse pill"
				v-for="message in messages"
				:class="message.senderId === user!.id ? ['from-me', 'bg-inverse'] : 'bg-secondary'"
				:key="message.localKey ?? message._id"
			>
				{{ message.text }}
			</div>
		</div>
		<div class="chat-input-wrapper pill">
			<div
				ref="chatInput"
				class="chat-input"
				role="textbox"
				contenteditable="true"
				data-placeholder="訊息......"
				@keydown.enter.exact.prevent="sendMessage"
				@input="updateMessageContent"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
	import type { Conversation, Message } from '@/types'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import { useFriendStore } from '@/stores/FriendStore'
	import { storeToRefs } from 'pinia'
	import { getSocket } from '@/socket'
	import { useMessageStore } from '@/stores/MessageStore'
	import { handleRequestError } from '@/utils/helpers'
	import axios from 'axios'
	import { useAuthStore } from '@/stores/AuthStore'
	type Props = {
		currentConversation: Conversation
	}
	const socket = getSocket()

	const { currentConversation } = defineProps<Props>()

	const friendStore = useFriendStore()
	const { onlineFriends } = storeToRefs(friendStore)

	const messageStore = useMessageStore()
	const { getMessageCache } = messageStore

	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	const isContactOnline = computed(() => {
		if (!currentConversation.conversationId) {
			return null
		}
		return onlineFriends.value.has(currentConversation.recipientId)
	})

	const messages = ref<Message[]>([])
	const hasMore = ref(true)
	const chatInputRef = useTemplateRef('chatInput')
	const messageContent = ref<string>('')
	const updateMessageContent = () => {
		messageContent.value = chatInputRef.value?.textContent || ''
	}
	const getInputValue = () => {
		return chatInputRef.value?.innerText || ''
	}
	const clearInput = () => {
		if (chatInputRef.value) {
			chatInputRef.value.textContent = ''
			messageContent.value = ''
		}
	}
	const sendMessage = () => {
		const text = getInputValue().trim()
		const { conversationId } = currentConversation
		if (text) {
			const message: Message = {
				localKey: crypto.randomUUID(),
				conversationId,
				senderId: user.value!.id,
				text,
			}
			messages.value.push(message)
			socket?.emit(
				'send-message',
				{ conversationId, text },
				(ack: { success: boolean; message: { _id: string; createdAt: string } }) => {
					message._id = ack.message._id
					message.createdAt = ack.message.createdAt

					const messageCache = getMessageCache(conversationId)
					if (!messageCache) return
					if (messageCache.length > 200) messageCache.shift()
				},
			)

			clearInput()
			chatInputRef.value?.focus()
		}
	}

	watch(
		() => currentConversation,
		async (newVal) => {
			try {
				const { conversationId } = newVal
				const cached = getMessageCache(conversationId)
				if (cached) {
					messages.value = cached
					return
				}
				const res = await axios.get('/api/message', {
					params: {
						conversationId,
						limit: 50,
					},
				})
				messages.value = res.data.messages
				hasMore.value = res.data.hasmore
				return { success: true }
			} catch (error) {
				handleRequestError(error)
			}
		},
		{ immediate: true },
	)
	const handleMessage = (message: Message) => {
		if (
			message.conversationId !== currentConversation.conversationId ||
			message.senderId === user.value!.id
		)
			return
		const messageCache = getMessageCache(message.conversationId)

		if (!messageCache) return

		messageCache.push(message)
		if (messageCache.length > 200) messageCache.shift()
	}
	onMounted(() => {
		socket?.on('message-received', handleMessage)
	})
	onUnmounted(() => {
		socket?.off('message-received', handleMessage)
	})
</script>

<style scoped>
	.chat-box {
		flex: 1;
		flex-direction: column;
	}
	.chat-box img {
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
	.chat-content {
		flex: 1;
		overflow-y: auto;
		flex-direction: column;
		align-items: start;
		margin-left: 10px;
	}
	.message {
		padding: 4px 12px;
	}
	.message.from-me {
		align-self: end;
		margin-left: 0px;
		margin-right: 10px;
	}
	.message:first-of-type {
		margin-top: 3px;
	}
	.message:not(:last-of-type) {
		margin-bottom: 3px;
	}
	.chat-input-wrapper {
		width: calc(100% - 32px);
		border: 1px var(--color-text-muted) solid;
		margin: 16px;
		padding: 10px 20px;
	}
	.chat-input {
		padding: 10px;
	}
	.chat-input:empty::before {
		content: attr(data-placeholder);
		color: var(--color-text-muted);
		pointer-events: none;
	}
</style>
