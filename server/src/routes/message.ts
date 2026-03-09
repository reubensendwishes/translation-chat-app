import { Router } from 'express'
import type { Response, Request } from 'express'
import Conversation from '../models/Conversation'
import Message from '../models/Message'
import { verifyToken } from '../middleware/auth'

const router = Router()

type MessageQuery = {
	conversationId: string
	createdAt?: { $lt: Date }
}

router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const { conversationId, before, limit } = req.query as {
			conversationId: string
			before: string
			limit: string
		}
		const limitNum = Number(limit) || 50

		const conversation = await Conversation.findById(conversationId)

		if (
			!conversation ||
			!conversation.members.some((member) => {
				console.log(member, req.userId)
				return req.userId === member.toString()
			})
		) {
			return res.status(403).json({ detail: 'Permission denied' })
		}
		const query: MessageQuery = { conversationId }
		if (before) {
			query.createdAt = { $lt: new Date(before) }
		}

		const messages = await Message.find(query)
			.select('conversationId senderId text createdAt')
			.sort({ createdAt: -1 })
			.limit(limitNum + 1)

		const hasMore = messages.length > limitNum
		if (hasMore) messages.pop()

		return res.json({
			messages: messages.reverse(),
			hasMore,
		})
	} catch (error) {
		console.error('取得訊息失敗', error)
		res.status(500).json({
			detail: 'Internal server error',
		})
	}
})

export default router
