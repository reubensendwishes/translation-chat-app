import { Server as SocketIOServer } from 'socket.io'
import type { Socket } from 'socket.io'
import type { Server } from 'http'
import jwt from 'jsonwebtoken'
import { config } from './config'
import Message from './models/Message'
import Conversation from './models/Conversation'

type TokenPayload = {
	userId: string
	email: string
	version: number
}
interface AuthenticatedSocket extends Socket {
	userId?: string
	email?: string
}
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

	io.on('connection', (socket: AuthenticatedSocket) => {
		console.log(`User ${socket.userId} connected`)

		socket.on('join-conversation', async (conversationId: string) => {
			try {
				const conversation = await Conversation.findById(conversationId)

				if (
					!conversation ||
					!conversation.members.some(
						(member) => member.userId.toString() === socket.userId,
					)
				) {
					socket.emit('error', { message: 'Unauthorized' })
					return
				}
			} catch (error) {
				console.error('加入對話失敗', error)
				socket.emit('error', { message: 'Failed to join conversation' })
			}
		})
		socket.on('leave-conversation', (conversationId: string) => {
			socket.leave(conversationId)
			console.log(`User ${socket.userId} left conversation ${conversationId}`)
			socket.to(conversationId).emit('user-left', {
				userId: socket.userId,
				timestamp: new Date(),
			})
		})
		socket.on(
			'send-message',
			async (
				data: { conversationId: string; text: string },
				callback: (response: any) => void,
			) => {
				try {
					const { conversationId, text } = data

					const conversation = await Conversation.findById(conversationId)
					if (
						!conversation ||
						!conversation.members.some((m) => m.userId.toString() === socket.userId)
					) {
						callback({
							success: false,
							message: 'Unauthorized or conversation not found',
						})
						return
					}

					const message = new Message({
						conversationId,
						senderId: socket.userId,
						text,
					})

					await message.save()

					const populatedMessage = await message.populate('senderId', 'username avatar')

					io.to(conversationId).emit('message-received', {
						_id: populatedMessage._id,
						conversationId: populatedMessage.conversationId,
						senderId: populatedMessage.senderId,
						text: populatedMessage.text,
						createdAt: populatedMessage.createdAt,
					})

					callback({
						success: true,
						message: {
							_id: populatedMessage._id,
							text: populatedMessage.text,
							createdAt: populatedMessage.createdAt,
						},
					})
				} catch (error) {
					console.error('發生訊息失敗', error)
					callback({
						success: false,
						message: 'Failed to send message',
					})
				}
			},
		)
		socket.on(
			'get-messages',
			async (
				data: { conversationId: string; page?: number; limit?: number },
				callback: (response: any) => void,
			) => {
				try {
					const { conversationId, page = 1, limit = 50 } = data
					const skip = (page - 1) * limit

					// 驗證對話存在且使用者屬於該對話
					const conversation = await Conversation.findById(conversationId)

					if (
						!conversation ||
						!conversation.members.some((m) => m.userId.toString() === socket.userId)
					) {
						callback({ success: false, message: 'Unauthorized' })
						return
					}

					// 取得訊息
					const messages = await Message.find({
						conversationId,
					})
						.populate('senderId', 'username avatar')
						.sort({ createdAt: -1 })
						.skip(skip)
						.limit(limit)

					const total = await Message.countDocuments({ conversationId })

					callback({
						success: true,
						messages: messages.reverse(),
						pagination: {
							total,
							page,
							limit,
							pages: Math.ceil(total / limit),
						},
					})
				} catch (error) {
					console.error('取得訊息失敗', error)
					callback({
						success: false,
						message: 'Failed to fetch messages',
					})
				}
			},
		)
		// 打字中的狀態
		socket.on('user-typing', (data: { conversationId: string; username: string }) => {
			socket
				.to(data.conversationId)
				.emit('user-typing', { userId: socket.userId, username: data.username })
		})
		// 停止打字
		socket.on('user-stop-typing', (conversationId: string) => {
			socket.to(conversationId).emit('user-stop-typing', { userId: socket.userId })
		})
		// 斷線事件
		socket.on('disconnect', () => {
			console.log(`User ${socket.userId} disconnected`)
		})
	})
	return io
}
