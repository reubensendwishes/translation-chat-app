import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Friend, ReceivedRequest, SentRequest } from '@/types'
export const useFriendStore = defineStore('friend', () => {
	const friends = ref<Friend[]>([])
	const receivedRequests = ref<ReceivedRequest[]>([])
	const sentRequests = ref<SentRequest[]>([])

	const addFriend = (request: ReceivedRequest) => {
		const index = receivedRequests.value.findIndex(
			(receivedRequest) => receivedRequest === request,
		)
		receivedRequests.value.splice(index, 1)
		friends.value.unshift({
			requestId: request.requestId,
			friendData: request.requesterData,
		})
	}
	const addSentRequest = (request: SentRequest) => {
		sentRequests.value.unshift(request)
	}
	const addReceivedRequest = (request: ReceivedRequest) => {
		receivedRequests.value.unshift(request)
	}

	const removeSentRequest = (request: SentRequest) => {
		const index = sentRequests.value.findIndex((sentRequest) => sentRequest === request)
		sentRequests.value.splice(index, 1)
	}
	const removeReceivedRequest = (request: ReceivedRequest) => {
		const index = receivedRequests.value.findIndex(
			(receivedRequest) => receivedRequest === request,
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
