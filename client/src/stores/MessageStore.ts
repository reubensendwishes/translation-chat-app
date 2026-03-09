import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Message } from '@/types'

export const useMessageStore = defineStore('message', () => {
	const messageCacheMap = ref(new Map<string, Message[]>())
	const getMessageCache = (conversationId: string) => {
		return messageCacheMap.value.get(conversationId)
	}
	const setMessageCache = (conversationId: string, messages: Message[]) => {
		messageCacheMap.value.set(conversationId, messages)
	}

	return { messageCacheMap, getMessageCache, setMessageCache }
})
