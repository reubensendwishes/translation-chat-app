import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { useFriendStore } from '@/stores/FriendStore'

let socket: Socket | null = null

export const connectSocket = (token: string) => {
	socket = io('http://localhost:5000', {
		auth: { token },
	})

	const friendStore = useFriendStore()
	const { addFriendship, updateStatusToAccepted, removeFriendship } = friendStore

	socket.on('connect', () => {
		console.log('Socket connected')
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
