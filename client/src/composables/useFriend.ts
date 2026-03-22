import { useFriendStore } from '@/stores/FriendStore'
import axios from 'axios'
import { handleRequestError } from '@/utils/helpers'

export const useFriend = () => {
	const friendStore = useFriendStore()
	const { setFriendshipData, updateStatusToAccepted, addFriendship, removeFriendship } =
		friendStore

	const fetchFriendshipData = async () => {
		try {
			const res = await axios.get('/api/friendships')
			const { friendships } = res.data
			setFriendshipData(friendships)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const acceptFriendRequest = async (requestId: string) => {
		try {
			await axios.patch(`/api/friendships/${requestId}`)
			updateStatusToAccepted(requestId)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const sendFriendRequest = async (recipientId: string) => {
		try {
			const res = await axios.post('/api/friendships', { recipientId })
			const { friendship } = res.data
			addFriendship(friendship)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}
	const refuseFriendRequest = async (requestId: string) => {
		try {
			await axios.delete(`/api/friendships/${requestId}`)
			removeFriendship(requestId)
			return { success: true }
		} catch (error) {
			return handleRequestError(error)
		}
	}

	return { fetchFriendshipData, acceptFriendRequest, sendFriendRequest, refuseFriendRequest }
}
