import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useFriendStore } from '@/stores/FriendStore'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
	socket = io('http://localhost:5000', {
		auth: { token },
	})

	socket.on('connect', () => {
		console.log('Socket connected')
	})

	socket.on('connect_error', (err) => {
		console.log('Socket connection error:', err.message)
	})
	socket.on('friend-request', (receivedRequest) => {
		const friendStore = useFriendStore()
		const { addReceivedRequest } = friendStore
		addReceivedRequest(receivedRequest)
	})

	socket.on('friend-request-accepted', (friendship) => {
		const friendStore = useFriendStore()
		const { addFriend, removeSentRequest } = friendStore
		const { requestId, friendData } = friendship
		addFriend(requestId, friendData)
		removeSentRequest(friendship.requestId)
	})

	socket.on('friend-request-rejected', (friendship) => {
		const friendStore = useFriendStore()
		const { removeSentRequest } = friendStore
		removeSentRequest(friendship.requestId)
	})
	return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
	socket?.disconnect()
	socket = null
}
