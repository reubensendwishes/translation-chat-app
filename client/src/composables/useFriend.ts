import { useFriendStore } from '@/stores/FriendStore'
import axios from 'axios'
import { handleRequestError } from '@/utils/helpers'

export const useFriend = () => {
	const friendStore = useFriendStore()
	const { setFriendshipData, updateStatusToAccepted, addFriendship, removeFriendship } =
		friendStore

	const fetchFriendshipData = async () => {
		try {
			const res = await axios.get('/api/friendship')
			const { friendships, message } = res.data
			setFriendshipData(friendships)
			return { success: true, message }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const acceptFriendRequest = async (requestId: string) => {
		try {
			const res = await axios.put(`/api/friendship/request/${requestId}`)
			updateStatusToAccepted(requestId)
			const { message } = res.data
			return { success: true, message }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const sendFriendRequest = async (recipientId: string) => {
		try {
			const res = await axios.post('/api/friendship/request', { recipientId })
			const { friendship, message } = res.data
			addFriendship(friendship)
			return { success: true, message }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const refuseFriendRequest = async (requestId: string) => {
		try {
			const res = await axios.delete(`/api/friendship/request/${requestId}`)
			removeFriendship(requestId)
			const { message } = res.data
			return { success: true, message }
		} catch (error) {
			return handleRequestError(error)
		}
	}

	return { fetchFriendshipData, acceptFriendRequest, sendFriendRequest, refuseFriendRequest }
}
