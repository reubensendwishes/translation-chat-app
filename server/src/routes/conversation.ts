import { Router } from 'express'
import type { Response, Request } from 'express'
import { verifyToken } from '../middleware/auth'
import Friendship from '../models/Friendship'
import Conversation from '../models/Conversation'

const router = Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
	const conversations = await Conversation.find({ 'members.userId': req.userId })

	const result = conversations.map((conversation) => {
		return {
			_id: conversation._id,
			recipientId: conversation.members.find((member) => member.toString() !== req.userId),
			createdAt: conversation.createdAt,
		}
	})
	res.json(result)
})
router.post('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const { conversationTarget } = req.body
		if (!conversationTarget) return res.status(400).json({ message: '缺少對話對象' })

		if (conversationTarget === req.userId)
			return res.status(400).json({ message: '不能與自己建立對話' })

		const friendship = await Friendship.findOne({
			$or: [
				{ requester: conversationTarget, recipient: req.userId },
				{ requester: req.userId, recipient: conversationTarget },
			],
			status: 'accepted',
		})

		if (!friendship) {
			return res.status(403).json({ message: '只能與好友建立對話' })
		}

		const existing = await Conversation.findOne({
			$and: [{ 'member.userId': conversationTarget }, { 'member.userId': req.userId }],
		})

		if (existing) {
			return res.json(existing)
		}

		const conversation = new Conversation({
			members: [{ userId: conversationTarget }, { userId: req.userId }],
		})
		await conversation.save()

		res.status(201).json(conversation)
	} catch {
		res.status(500).json({ message: '無法建立對話' })
	}
})

export default router
