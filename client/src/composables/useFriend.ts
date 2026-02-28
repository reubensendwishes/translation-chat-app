import { useFriendStore } from '@/stores/FriendStore'
import axios from 'axios'
import type { ReceivedRequest } from '@/types'

export const useFriend = () => {
	const friendStore = useFriendStore()
	const { setFriendshipData, addFriend, addSentRequest } = friendStore

	const errorHandler = (error: unknown) => {
		if (axios.isAxiosError(error) && error.response) {
			return { success: false, message: error.response.data.message }
		}
		return { success: false, message: '網絡錯誤' }
	}
	const fetchFriendshipData = async () => {
		try {
			const res = await axios.get('/api/friendship')
			setFriendshipData(res.data.friends, res.data.receivedRequests, res.data.sentRequests)

			return { success: true }
		} catch (error) {
			return errorHandler(error)
		}
	}
	const acceptFriendRequest = async (request: ReceivedRequest) => {
		try {
			const { requestId } = request
			const res = await axios.put(`/api/friendship/request/${requestId}`)
			addFriend(request)

			return { success: true, message: res.data.message }
		} catch (error) {
			return errorHandler(error)
		}
	}
	const sendFriendRequest = async (recipientId: string) => {
		try {
			console.log(recipientId)
			const res = await axios.post('/api/friendship/request', { recipientId })
			const { requestId } = res.data

			addSentRequest({ requestId, recipientId })

			return { success: true, message: res.data.message }
		} catch (error) {
			return errorHandler(error)
		}
	}
	const refuseFriendRequest = async (request: ReceivedRequest) => {
		const { requestId } = request
		try {
			const res = await axios.delete(`/api/friendship/request/${requestId}`)

			return { success: true, message: res.data.message }
		} catch (error) {
			return errorHandler(error)
		}
	}

	return { fetchFriendshipData, acceptFriendRequest, sendFriendRequest, refuseFriendRequest }
}
