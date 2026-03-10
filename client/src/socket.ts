import { useFriendStore } from '@/stores/FriendStore'
import { storeToRefs } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { useMessageStore } from './stores/MessageStore'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
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
	const { currentConversationId } = storeToRefs(messageStore)
	const { getMessageCache } = messageStore

	socket = io('http://localhost:5000', {
		auth: { token },
	})

	// socket.on('connect', () => {
	// })
	socket.on('server-ready', () => {
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
		if (message.conversationId === currentConversationId.value) return
		const messageCache = getMessageCache(message.conversationId)
		if (!messageCache) return
		messageCache.push(message)
		if (messageCache.length > 200) messageCache.shift()
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
