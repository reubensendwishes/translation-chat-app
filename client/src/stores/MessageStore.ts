import type { Message } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageStore = defineStore('message', () => {
	const messageCacheMap = ref(new Map<string, Message[]>())
	const getMessageCache = (conversationId: string) => {
		return messageCacheMap.value.get(conversationId)
	}
	const setMessageCache = (conversationId: string, messages: Message[]) => {
		messageCacheMap.value.set(conversationId, messages)
	}
	const hasMoreMessagesMap = ref(new Map<string, boolean>())

	const getHasMoreMessages = (conversationId: string) => {
		return hasMoreMessagesMap.value.get(conversationId)
	}
	const setHasMoreMessages = (conversationId: string, hasMore: boolean) => {
		hasMoreMessagesMap.value.set(conversationId, hasMore)
	}

	const currentConversationId = ref<string | null>(null)
	return {
		messageCacheMap,
		getMessageCache,
		setMessageCache,
		hasMoreMessagesMap,
		getHasMoreMessages,
		setHasMoreMessages,
		currentConversationId,
	}
})
