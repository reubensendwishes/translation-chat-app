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

	const currentConversationId = ref<string | null>(null)
	return { messageCacheMap, getMessageCache, setMessageCache, currentConversationId }
})
