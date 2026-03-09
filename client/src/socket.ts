import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useFriendStore } from '@/stores/FriendStore'
import { useMessageStore } from './stores/MessageStore'
import { storeToRefs } from 'pinia'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
	socket = io('http://localhost:5000', {
		auth: { token },
	})

	const friendStore = useFriendStore()
	const { friends } = storeToRefs(friendStore)
	const {
		addFriendship,
		updateStatusToAccepted,
		removeFriendship,
		setOnlineFriends,
		addOnlineFriend,
		removeOnlineFriend,
	} = friendStore

	const messageStore = useMessageStore()
	const { getMessageCache } = messageStore

	socket.on('connect', () => {
		console.log('Socket connected')

		const friendIds = friends.value.map((friend) => {
			return friend.friendData._id
		})
		socket!.emit('get-online-friends', friendIds, (onlineFriends: string[]) => {
			setOnlineFriends(onlineFriends)
		})
	})
	socket.on('user-online', (userId) => {
		addOnlineFriend(userId)
	})
	socket.on('user-offline', (userId) => {
		removeOnlineFriend(userId)
	})
	socket.on('message-received', (message) => {
		const messageCache = getMessageCache(message.conversationId)
		if (messageCache) {
			if (messageCache.length > 200) messageCache.shift()
			messageCache.push(message)
		}
	})

	socket.on('connect_error', (err) => {
		console.log('Socket connection error:', err.message)
	})
	socket.on('friend-request', (friendship) => {
		addFriendship(friendship)
	})
	socket.on('friend-request-accepted', (requestId) => {
		updateStatusToAccepted(requestId)
	})
	socket.on('friend-request-rejected', (requestId) => {
		removeFriendship(requestId)
	})
	return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
	socket?.disconnect()
	socket = null
}
