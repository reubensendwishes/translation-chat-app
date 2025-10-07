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
			const { friendships } = res.data
			setFriendshipData(friendships)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const acceptFriendRequest = async (requestId: string) => {
		try {
			await axios.patch(`/api/friendship/${requestId}`)
			updateStatusToAccepted(requestId)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const sendFriendRequest = async (recipientId: string) => {
		try {
			const res = await axios.post('/api/friendship', { recipientId })
			const { friendship } = res.data
			addFriendship(friendship)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const refuseFriendRequest = async (requestId: string) => {
		try {
			await axios.delete(`/api/friendship/${requestId}`)
			removeFriendship(requestId)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}

	return { fetchFriendshipData, acceptFriendRequest, sendFriendRequest, refuseFriendRequest }
}
