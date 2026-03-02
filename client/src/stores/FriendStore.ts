import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Friend, ReceivedRequest, SentRequest, UserData } from '@/types'
export const useFriendStore = defineStore('friend', () => {
	const friends = ref<Friend[]>([])
	const receivedRequests = ref<ReceivedRequest[]>([])
	const sentRequests = ref<SentRequest[]>([])

	const addFriend = (requestId: string, friendData: UserData) => {
		friends.value.unshift({
			requestId,
			friendData,
		})
	}
	const addSentRequest = (request: SentRequest) => {
		sentRequests.value.unshift(request)
	}
	const addReceivedRequest = (request: ReceivedRequest) => {
		receivedRequests.value.unshift(request)
	}

	const removeSentRequest = (requestId: string) => {
		const index = sentRequests.value.findIndex(
			(sentRequest) => sentRequest.requestId === requestId,
		)
		sentRequests.value.splice(index, 1)
	}
	const removeReceivedRequest = (requestId: string) => {
		const index = receivedRequests.value.findIndex(
			(receivedRequest) => receivedRequest.requestId === requestId,
		)
		receivedRequests.value.splice(index, 1)
	}

	const setFriendshipData = (
		newFriends: Friend[],
		newReceivedRequests: ReceivedRequest[],
		newSentRequests: SentRequest[],
	) => {
		friends.value = newFriends
		receivedRequests.value = newReceivedRequests
		sentRequests.value = newSentRequests
	}
	return {
		friends,
		receivedRequests,
		sentRequests,
		addFriend,
		addSentRequest,
		addReceivedRequest,
		setFriendshipData,
		removeSentRequest,
		removeReceivedRequest,
	}
})
