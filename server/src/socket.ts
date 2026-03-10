import { Server as SocketIOServer } from 'socket.io'
import type { Socket } from 'socket.io'
import type { Server } from 'http'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { config } from './config'
import Message from './models/Message'
import Conversation from './models/Conversation'
import Friendship from './models/Friendship'

type TokenPayload = {
	userId: string
	email: string
	version: number
}
interface AuthenticatedSocket extends Socket {
	userId?: string
	email?: string
}

type SendMessageResponse =
	| { success: false; detail: string }
	| { success: true; message: { _id: Types.ObjectId; createdAt: Date } }

export const onlineUsers = new Set<string>()

export const initializeSocket = (server: Server) => {
	const io = new SocketIOServer(server, {
		cors: {
			origin: config.CLIENT_URL,
			credentials: true,
		},
	})

	io.use((socket: AuthenticatedSocket, next) => {
		try {
			const token = socket.handshake.auth.token
			if (!token) {
				return next(new Error('No token provided'))
			}

			const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET) as TokenPayload
			socket.userId = decoded.userId
			socket.email = decoded.email
			next()
		} catch {
			next(new Error('Invalid token'))
		}
	})

	io.on('connection', async (socket: AuthenticatedSocket) => {
		socket.on('get-online-friends', async (friendIds: string[], callback) => {
			const onlineFriends = friendIds.filter((friendId) => onlineUsers.has(friendId))
			callback(onlineFriends)
		})

		socket.on(
			'send-message',
			async (
				data: { conversationId: string; text: string },
				callback: (response: SendMessageResponse) => void,
			) => {
				try {
					const { conversationId, text } = data

					const conversation = await Conversation.findById(conversationId)
					if (
						!conversation ||
						!conversation.members.some((member) => member.toString() === socket.userId)
					) {
						callback({
							success: false,
							detail: 'Unauthorized or conversation not found',
						})
						return
					}

					const message = new Message({
						conversationId,
						senderId: socket.userId,
						text,
					})

					await message.save()

					io.to(conversationId).emit('message-received', {
						_id: message._id,
						conversationId: message.conversationId,
						senderId: message.senderId,
						text: message.text,
						createdAt: message.createdAt,
					})

					callback({
						success: true,
						message: {
							_id: message._id,
							createdAt: message.createdAt,
						},
					})
				} catch (error) {
					console.error('發生訊息失敗', error)
					callback({
						success: false,
						detail: 'Failed to send message',
					})
				}
			},
		)
		socket.on('disconnect', async () => {
			const friendships = await Friendship.find({
				$or: [{ requester: socket.userId }, { recipient: socket.userId }],
				status: 'accepted',
			})

			const friendIds = friendships.map((friendship) => {
				if (friendship.recipient.toString() === socket.userId) {
					return friendship.requester.toString()
				}
				return friendship.recipient.toString()
			})
			for (const friendId of friendIds) {
				io.to(friendId).emit('user-offline', socket.userId)
			}
			if (socket.userId) {
				onlineUsers.delete(socket.userId)
			}
			console.log(`User ${socket.userId} disconnected`)
		})
		socket.emit('server-ready')

		if (socket.userId) {
			socket.join(socket.userId)
			onlineUsers.add(socket.userId)

			const conversations = await Conversation.find({ members: socket.userId })
			conversations.forEach((conversation) => {
				socket.join(conversation._id.toString())
			})

			const friendships = await Friendship.find({
				$or: [{ requester: socket.userId }, { recipient: socket.userId }],
				status: 'accepted',
			})
			const friendIds = friendships.map((friendship) => {
				if (friendship.requester.toString() === socket.userId) {
					return friendship.recipient.toString()
				}
				return friendship.requester.toString()
			})
			for (const friendId of friendIds) {
				io.to(friendId).emit('user-online', socket.userId)
			}
		}
	})
	return io
}
