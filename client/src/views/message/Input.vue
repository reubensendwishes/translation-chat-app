<template>
	<div class="chat-input-wrapper pill">
		<div
			ref="chatInput"
			class="chat-input"
			role="textbox"
			contenteditable="true"
			:data-placeholder="`${t('message.message')}......`"
			@keydown.enter.exact.prevent="sendMessage"
			@input="updateMessageContent"
		></div>
	</div>
</template>

<script setup lang="ts">
	import { ref, useTemplateRef, nextTick } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import type { Conversation, Message } from '@/types'
	import { getSocket } from '@/socket'
	import { useMessageStore } from '@/stores/MessageStore'
	import { useAuthStore } from '@/stores/AuthStore'

	// types
	type Props = {
		currentConversation: Conversation
	}
	type Emits = {
		scrollToBottom: []
		sendMessage: [message: Message]
		updateIdAndCreatedAt: [_id: string, createdAt: string, localKey: string]
	}

	// props
	const { currentConversation } = defineProps<Props>()

	// emits
	const emit = defineEmits<Emits>()

	// stores
	const messageStore = useMessageStore()
	const { getMessageCache } = messageStore
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	// socket
	const socket = getSocket()

	// vue-i18n
	const { t } = useI18n()

	const chatInputRef = useTemplateRef('chatInput')

	const messageContent = ref<string>('')

	const getInputValue = () => {
		return chatInputRef.value?.innerText || ''
	}
	const updateMessageContent = () => {
		messageContent.value = chatInputRef.value?.textContent || ''
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
			emit('sendMessage', message)

			socket?.emit(
				'send-message',
				{ conversationId, text },
				(ack: { success: boolean; message: { _id: string; createdAt: string } }) => {
					emit(
						'updateIdAndCreatedAt',
						ack.message._id,
						ack.message.createdAt,
						message.localKey!,
					)
					const messageCache = getMessageCache(conversationId)
					if (!messageCache) return
					messageCache.push(message)
					if (messageCache.length > 200) messageCache.shift()
				},
			)
			clearInput()
			chatInputRef.value?.focus()
			await nextTick()
			emit('scrollToBottom')
		}
	}
</script>

<style scoped>
	.chat-input-wrapper {
		width: calc(100% - 32px);
		border: 1px var(--color-text-muted) solid;
		margin: 16px;
		padding: 10px 20px;
	}
	.chat-input {
		padding: 10px;
		max-height: calc(4em + 20px);
		overflow: auto;
	}
	.chat-input:empty::before {
		content: attr(data-placeholder);
		color: var(--color-text-muted);
		pointer-events: none;
	}
</style>
