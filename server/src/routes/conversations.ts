import { Router } from 'express'
import type { Response, Request } from 'express'
import { verifyToken } from '../middleware/auth'
import Friendship from '../models/Friendship'
import Conversation from '../models/Conversation'

const router = Router()

router.get('/', verifyToken, async (req: Request, res: Response) => {
	const conversations = await Conversation.find({ members: req.userId })

	const result = conversations.map((conversation) => {
		return {
			_id: conversation._id,
			recipientId: conversation.members.find((member) => member.toString() !== req.userId),
			updatedAt: conversation.updatedAt,
		}
	})
	res.json(result)
})
router.post('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const { friendId } = req.body
		if (!friendId) return res.status(400).json({ detail: 'Validation error' })

		if (friendId === req.userId) return res.status(400).json({ detail: 'Validation error' })

		const friendship = await Friendship.findOne({
			$or: [
				{ requester: friendId, recipient: req.userId },
				{ requester: req.userId, recipient: friendId },
			],
			status: 'accepted',
		})

		if (!friendship) {
			return res.status(403).json({ detail: 'Permission denied' })
		}

		const existing = await Conversation.findOne({
			members: { $all: [friendId, req.userId] },
		})

		if (existing) {
			return res.status(200).json({
				_id: existing._id,
				recipientId: existing.members
					.find((member) => member.toString() !== req.userId)
					?.toString(),
				updatedAt: existing.updatedAt,
			})
		}

		const conversation = new Conversation({
			members: [friendId, req.userId],
		})
		await conversation.save()

		const io = req.app.get('io')

		for (const member of conversation.members) {
			const sockets = await io.in(member.toString()).fetchSockets()
			for (const socket of sockets) {
				socket.join(conversation._id.toString())
			}
		}
		res.status(201).json({
			_id: conversation._id,
			recipientId: conversation.members.find((member) => member.toString() !== req.userId),
			updatedAt: conversation.updatedAt,
		})
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})

export default router
