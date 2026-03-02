import type { Request, Response } from 'express'
import { Router } from 'express'
import { verifyToken } from '../middleware/auth'
import User from '../models/User'
import Friendship from '../models/Friendship'

const router = Router()

router.post('/request', verifyToken, async (req: Request, res: Response) => {
	try {
		const requesterId = req.userId
		const { recipientId } = req.body

		if (requesterId === recipientId) {
			return res.status(400).json({ message: '不能對自己發送好友請求' })
		}

		const recipient = await User.findById(recipientId)
		if (!recipient) {
			return res.status(404).json({ message: '找不到該使用者' })
		}

		const existing = await Friendship.findOne({
			$or: [
				{ requester: requesterId, recipient: recipientId },
				{ requester: recipientId, recipient: requesterId },
			],
		})

		if (existing) {
			return res.status(409).json({ message: '已發送過好友請求' })
		}
		const friendship = new Friendship({
			requester: requesterId,
			recipient: recipientId,
			status: 'pending',
		})
		await friendship.save()

		const populated = await friendship.populate('requester', 'username fullName avatar')

		const io = req.app.get('io')
		io.to(recipientId).emit('friend-request', {
			requestId: populated._id,
			requesterData: populated.requester,
			createdAt: populated.createdAt,
		})

		res.status(201).json({ message: '好友請求已發送', requestId: populated._id })
	} catch {
		res.status(500).json({ message: '無法發送好友請求' })
	}
})

router.put('/request/:requestId', verifyToken, async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params

		const friendship = await Friendship.findById(requestId)

		if (!friendship) {
			return res.status(404).json({ message: '找不到該好友請求' })
		}

		if (friendship.recipient.toString() !== req.userId) {
			return res.status(403).json({ message: '沒有操作權限' })
		}

		friendship.status = 'accepted'

		await friendship.save()

		const populated = await friendship.populate('recipient', 'username fullName avatar')

		const io = req.app.get('io')
		io.to(populated.requester._id.toString()).emit('friend-request-accepted', {
			requestId: populated._id,
			friendData: populated.recipient,
		})

		res.json({ message: '成功接受好友邀請' })
	} catch {
		res.status(500).json({ message: '無法同意好友邀請' })
	}
})

router.delete('/request/:requestId', verifyToken, async (req: Request, res: Response) => {
	try {
		const { requestId } = req.params
		const friendship = await Friendship.findById(requestId)

		if (!friendship) {
			return res.status(404).json({ message: '找不到該好友請求' })
		}

		if (friendship.recipient.toString() !== req.userId) {
			return res.status(403).json({ message: '沒有操作權限' })
		}

		await friendship.deleteOne()

		const io = req.app.get('io')
		io.to(friendship.requester.toString()).emit('friend-request-rejected', {
			requestId,
			recipientId: req.userId,
		})

		res.json({ message: '成功拒絕好友邀請' })
	} catch {
		res.status(500).json({ message: '無法拒絕好友邀請' })
	}
})

router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const userId = req.userId
		const friendships = await Friendship.find({
			$or: [{ requester: userId }, { recipient: userId }],
		}).populate([
			{ path: 'requester', select: 'username fullName avatar' },
			{ path: 'recipient', select: 'username fullName avatar' },
		])

		const friends = friendships
			.filter((friendship) => {
				return friendship.status === 'accepted'
			})
			.map((friendship) => {
				const friendData =
					friendship.requester._id.toString() === userId
						? friendship.recipient
						: friendship.requester
				return { requestId: friendship._id, friendData }
			})

		const receivedRequests = friendships
			.filter((friendship) => {
				return (
					friendship.status === 'pending' &&
					friendship.recipient._id.toString() === userId
				)
			})
			.map((friendship) => ({
				requestId: friendship._id,
				requesterData: friendship.requester,
				createdAt: friendship.createdAt,
			}))

		const sentRequests = friendships
			.filter((friendship) => {
				return (
					friendship.status === 'pending' &&
					friendship.requester._id.toString() === userId
				)
			})
			.map((friendship) => ({
				requestId: friendship._id,
				recipientId: friendship.recipient._id,
			}))

		res.json({ friends, receivedRequests, sentRequests })
	} catch {
		res.status(500).json({ message: '無法取得好友資料' })
	}
})

export default router
