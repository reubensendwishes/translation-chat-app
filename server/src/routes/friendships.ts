import type { Request, Response } from 'express'
import { Router } from 'express'
import { verifyToken } from '../middleware/auth'
import User from '../models/User'
import Friendship from '../models/Friendship'

const router = Router()

router.post('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const requesterId = req.userId
		const { recipientId } = req.body

		if (requesterId === recipientId) {
			return res.status(400).json({ detail: 'Validation error' })
		}

		const recipient = await User.findById(recipientId)
		if (!recipient) {
			return res.status(404).json({ detail: 'User not found' })
		}

		const existing = await Friendship.findOne({
			$or: [
				{ requester: requesterId, recipient: recipientId },
				{ requester: recipientId, recipient: requesterId },
			],
		})

		if (existing) {
			return res.status(409).json({ detail: 'Friend request already exists' })
		}
		const rawFriendship = new Friendship({
			requester: requesterId,
			recipient: recipientId,
			status: 'pending',
		})
		await rawFriendship.save()

		await rawFriendship.populate([
			{ path: 'requester', select: 'username fullName avatar' },
			{ path: 'recipient', select: 'username fullName avatar' },
		])

		const friendship = {
			_id: rawFriendship._id,
			friendData: rawFriendship.recipient,
			myRole: 'requester',
			status: rawFriendship.status,
			updatedAt: rawFriendship.updatedAt,
		}
		const io = req.app.get('io')
		io.to(recipientId).emit('friend-request', {
			_id: rawFriendship._id,
			friendData: rawFriendship.requester,
			myRole: 'recipient',
			status: rawFriendship.status,
			updatedAt: rawFriendship.updatedAt,
		})
		res.status(201).json({ friendship })
	} catch {
		res.status(500).json({ datail: 'Internal Server Error' })
	}
})

router.patch('/:id', verifyToken, async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const friendship = await Friendship.findById(id)

		if (!friendship) {
			return res.status(404).json({ detail: 'Friend request not found' })
		}

		if (friendship.recipient.toString() !== req.userId) {
			return res.status(403).json({ detail: 'Permission denied' })
		}

		friendship.status = 'accepted'

		await friendship.save()

		const io = req.app.get('io')
		io.to(friendship.requester.toString()).emit('friend-request-accepted', friendship._id)

		res.sendStatus(200)
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const friendship = await Friendship.findById(id)

		if (!friendship) {
			return res.status(404).json({ detail: 'Friend request not found' })
		}

		if (friendship.recipient.toString() !== req.userId) {
			return res.status(403).json({ detail: 'Validation error' })
		}

		await friendship.deleteOne()

		const io = req.app.get('io')
		io.to(friendship.requester.toString()).emit('friend-request-rejected', id)

		res.sendStatus(200)
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})

router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const userId = req.userId
		const rawFriendships = await Friendship.find({
			$or: [{ requester: userId }, { recipient: userId }],
		}).populate([
			{ path: 'requester', select: 'username fullName avatar' },
			{ path: 'recipient', select: 'username fullName avatar' },
		])

		const friendships = rawFriendships.map((rawFriendship) => {
			const isRequester = rawFriendship.requester._id.toString() === userId
			return {
				_id: rawFriendship._id,
				friendData: isRequester ? rawFriendship.recipient : rawFriendship.requester,
				myRole: isRequester ? 'requester' : 'recipient',
				status: rawFriendship.status,
				updatedAt: rawFriendship.updatedAt,
			}
		})
		res.json({ friendships })
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})

export default router
