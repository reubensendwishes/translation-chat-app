import type { Request, Response } from 'express'
import { Router } from 'express'
import sharp from 'sharp'
import { verifyToken } from '../middleware/auth'
import User from '../models/User'
import Friendship from '../models/Friendship'
import upload from '../middleware/upload'
import { bucket } from '../firebase'
import Post from '../models/Post'

const router = Router()
router.get('/me', verifyToken, async (req: Request, res: Response) => {
	try {
		const userId = req.userId
		const user = await User.findById(userId).select('fullName username avatar description')
		res.json(user)
	} catch {
		res.status(500).json({ message: '無法取得user資料' })
	}
})

router.get('/:username', verifyToken, async (req: Request, res: Response) => {
	try {
		const { username } = req.params
		const user = await User.findOne({
			username,
		})

		if (!user) {
			return res.status(404).json({ message: 'User Not Found' })
		}
		const friendCount = await Friendship.countDocuments({
			$or: [
				{ requester: user._id, status: 'accepted' },
				{ recipient: user._id, status: 'accepted' },
			],
		})

		const postCount = await Post.countDocuments({ _id: user._id })
		const profileData = {
			userId: user._id,
			fullName: user.fullName,
			description: user.description,
			avatar: user.avatar,
			friendCount,
			postCount,
		}
		res.json(profileData)
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})
router.put(
	'/me/avatar',
	verifyToken,
	upload.single('avatar'),
	async (req: Request, res: Response) => {
		try {
			const { userId, file } = req

			if (!file) return res.status(400).json({ detail: 'Validation error' })

			const processedBuffer = await sharp(file.buffer)
				.resize(400, 400, { fit: 'cover', position: 'center' })
				.webp({ quality: 80 })
				.toBuffer()
			const filePath = `avatars/${userId}.webp`
			const storageFile = bucket.file(filePath)
			await storageFile.save(processedBuffer, { metadata: { contentType: 'image/webp' } })
			await storageFile.makePublic()
			const avatarUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

			await User.findByIdAndUpdate(userId, { avatar: avatarUrl })

			res.json({ avatar: avatarUrl })
		} catch (error) {
			console.log(error)
			res.status(500).json({ detail: 'Internal server error' })
		}
	},
)
router.put('/me', verifyToken, async (req: Request, res: Response) => {
	try {
		const userId = req.userId
		const { description } = req.body
		if (description && description.length > 150) {
			return res.status(400).json({ detail: 'Validation error' })
		}
		const user = await User.findByIdAndUpdate(userId, { description }, { new: true }).select(
			'fullName username email avatar description',
		)
		res.json(user)
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})

export default router
