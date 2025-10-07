import { Router } from 'express'
import type { Response, Request } from 'express'

import Conversation from '../models/Conversation'
import Message from '../models/Message'
import { verifyToken } from '../middleware/auth'
import translate from '../translateService'

type MessageQuery = {
	conversationId: string
	createdAt?: { $lt: Date }
}

const router = Router()

router.get('/:messageId/translate', verifyToken, async (req: Request, res: Response) => {
	try {
		const { messageId } = req.params
		const { targetLang } = req.query

		if (!targetLang || !messageId) return res.status(400).json({ detail: 'Validation error' })
		const message = await Message.findById(messageId).select('text')
		if (!message) return res.status(404).json({ detail: 'Message not found' })

		const [translation] = await translate.translate(message.text, targetLang as string)

		res.json({ translation })
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})
router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const conversationId = req.query.conversationId as string
		const cursor = req.query.cursor as string
		const limit = parseInt(req.query.limit as string) || 50

		const conversation = await Conversation.findById(conversationId)

		if (
			!conversation ||
			!conversation.members.some((member) => {
				return req.userId === member.toString()
			})
		) {
			return res.status(403).json({ detail: 'Permission denied' })
		}
		const query: MessageQuery = { conversationId }
		if (cursor) {
			query.createdAt = { $lt: new Date(cursor) }
		}

		const messages = await Message.find(query)
			.select('conversationId senderId text createdAt')
			.sort({ createdAt: -1 })
			.limit(limit + 1)

		const hasMore = messages.length > limit
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
