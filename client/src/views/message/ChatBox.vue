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
			<div ref="loadMoreTrigger" class="load-more-trigger"></div>
			<div
				class="message text-inverse pill"
				:style="{ visibility: isReady ? 'visible' : 'hidden' }"
				v-for="message in messages"
				:class="message.senderId === user!.id ? ['from-me', 'bg-inverse'] : 'bg-secondary'"
				:key="message.localKey ?? message._id"
			>
				{{ message.text }}
			</div>
			<div ref="messageBottom" class="message-bottom"></div>
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
	import GSymbol from '@/components/icons/GSymbol.vue'
	import { getSocket } from '@/socket'
	import { useAuthStore } from '@/stores/AuthStore'
	import { useFriendStore } from '@/stores/FriendStore'
	import { useMessageStore } from '@/stores/MessageStore'
	import type { Conversation, Message } from '@/types'
	import { handleRequestError } from '@/utils/helpers'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'
	import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
	type Props = {
		currentConversation: Conversation
	}
	const socket = getSocket()

	const { currentConversation } = defineProps<Props>()

	const friendStore = useFriendStore()
	const { onlineFriends } = storeToRefs(friendStore)

	const messageStore = useMessageStore()
	const { getMessageCache, setMessageCache, getHasMoreMessages, setHasMoreMessages } =
		messageStore

	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	const loadMoreTriggerRef = useTemplateRef('loadMoreTrigger')
	const isLoadingMessages = ref(false)

	let observer: IntersectionObserver | null = null

	const setupIntersectionObserver = () => {
		observer = new IntersectionObserver((entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting && hasMore.value && !isLoadingMessages.value) {
					try {
						isLoadingMessages.value = true
						const { conversationId } = currentConversation
						const before = messages.value[0].createdAt
						const res = await axios.get('/api/message', {
							params: { conversationId, before, limit: 50 },
						})

						hasMore.value = res.data.hasmore
						setHasMoreMessages(conversationId, res.data.hasMore)
						messages.value = [...res.data.messages]
						getMessageCache(conversationId)?.unshift(...res.data.message)
						return { success: true }
					} catch (error) {
						handleRequestError(error)
					} finally {
						isLoadingMessages.value = false
					}
				}
			})
		}, {})
		if (loadMoreTriggerRef.value) {
			observer.observe(loadMoreTriggerRef.value)
		}
	}
	const isContactOnline = computed(() => {
		if (!currentConversation.conversationId) {
			return null
		}
		return onlineFriends.value.has(currentConversation.recipientId)
	})

	const messages = ref<Message[]>([])
	const messagesBottomRef = useTemplateRef('messageBottom')

	const scrollToBottom = () => {
		messagesBottomRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}
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
	const sendMessage = async (e: KeyboardEvent) => {
		if (e.isComposing) return
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
					messageCache.push(message)
					if (messageCache.length > 200) messageCache.shift()
				},
			)
			clearInput()
			chatInputRef.value?.focus()
			await nextTick()
			scrollToBottom()
		}
	}
	const isReady = ref(true)
	watch(
		() => currentConversation,
		async (newVal) => {
			isLoadingMessages.value = true
			isReady.value = false
			const { conversationId } = newVal

			const cachedMessages = getMessageCache(conversationId)
			if (cachedMessages) {
				messages.value = [...cachedMessages]
				const cachedHasMore = getHasMoreMessages(conversationId)
				if (cachedHasMore) {
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

				hasMore.value = res.data.hasmore
				setHasMoreMessages(conversationId, res.data.hasMore)
				messages.value = [...res.data.messages]
				setMessageCache(conversationId, res.data.messages)
				return { success: true }
			} catch (error) {
				handleRequestError(error)
			} finally {
				isLoadingMessages.value = false
				await nextTick()
				messagesBottomRef.value?.scrollIntoView({ behavior: 'instant' })
				console.log(messagesBottomRef.value)
				isReady.value = true
			}
		},
		{ immediate: true },
	)
	const handleMessage = async (message: Message) => {
		if (
			message.conversationId !== currentConversation.conversationId ||
			message.senderId === user.value!.id
		)
			return

		messages.value.push(message)
		await nextTick()
		messagesBottomRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
		const messageCache = getMessageCache(message.conversationId)
		if (!messageCache) return
		messageCache.push(message)
		if (messageCache.length > 200) messageCache.shift()
	}

	onMounted(() => {
		messagesBottomRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
		socket?.on('message-received', handleMessage)
		setupIntersectionObserver()
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
	.message-bottom {
		height: 5px;
		width: 1px;
	}
	.load-more-trigger {
		height: 1px;
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
