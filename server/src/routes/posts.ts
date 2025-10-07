import type { Request, Response } from 'express'
import { Router } from 'express'
import type { Types } from 'mongoose'
import sharp from 'sharp'

import Post from '../models/Post'
import User from '../models/User'
import { verifyToken } from '../middleware/auth'
import upload from '../middleware/upload'
import { bucket } from '../firebase'
import translate from '../translateService'

type ImageSize = {
	width: number
	height: number
	name: 'small' | 'large'
}
type PostsQuery = {
	author: Types.ObjectId
	createdAt?: { $lt: Date }
}
const router = Router()

router.post('/', verifyToken, upload.single('image'), async (req: Request, res: Response) => {
	const { file, userId } = req
	const { text } = req.body
	if (!file) return res.status(400).json({ detail: 'Validation error' })

	const post = new Post({ author: userId, content: text })
	await post.save()

	const sizes: ImageSize[] = [
		{ width: 600, height: 800, name: 'small' },
		{ width: 1200, height: 1600, name: 'large' },
	]
	for (const size of sizes) {
		const processedBuffer = await sharp(file.buffer)
			.resize(size.width, size.height, {
				fit: 'cover',
				position: 'center',
			})
			.webp({ quality: 80 })
			.toBuffer()
		const filePath = `posts/${post._id}/${size.name}.webp`
		const storageFile = bucket.file(filePath)
		await storageFile.save(processedBuffer, { metadata: { contentType: 'image/webp' } })
		await storageFile.makePublic()
		post.imageStoragePaths[size.name] = filePath
	}
	await post.save()
	res.sendStatus(201)
})
router.post('/:postId/save', verifyToken, async (req: Request, res: Response) => {
	try {
		const { postId } = req.params
		if (!postId) return res.status(400).json({ detail: 'Validation error' })
		const post = await Post.findById(postId)
		if (!post) {
			return res.status(404).json({ detail: 'Post not found' })
		}
		const user = await User.findByIdAndUpdate(req.userId, {
			$push: { savedPosts: { post: post._id, savedAt: new Date() } },
		})

		if (!user) return res.status(404).json({ detail: 'Not found user' })

		res.sendStatus(200)
	} catch {
		return res.status(500).json({ detail: 'Internal server error' })
	}
})
router.delete('/:postId/save', verifyToken, async (req: Request, res: Response) => {
	try {
		const { postId } = req.params
		if (!postId) return res.status(400).json({ detail: 'Validation error' })
		const post = await Post.findById(postId)
		if (!post) {
			return res.status(404).json({ detail: 'Post not found' })
		}
		const user = await User.findByIdAndUpdate(req.userId, {
			$pull: { savedPosts: { post: post._id } },
		})

		if (!user) return res.status(404).json({ detail: 'Not found user' })

		res.sendStatus(200)
	} catch {
		return res.status(500).json({ detail: 'Internal server error' })
	}
})
router.get('/saved/ids', verifyToken, async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.userId).select('savedPosts')
		if (!user) return res.status(404).json({ datail: 'Not found User' })
		const postIds = user.savedPosts.map((postData) => {
			return postData.post
		})
		res.json(postIds)
	} catch {
		res.status(500).json({ detail: 'Interval server error' })
	}
})
router.get('/saved', verifyToken, async (req: Request, res: Response) => {
	try {
		const limit = parseInt(req.query.limit as string) | 12
		const cursor = req.query.cursor as string
		const user = await User.findById({ _id: req.userId }).select('savedPosts')
		if (!user) return res.status(404).json({ detail: 'Not found user' })

		let nextCursor
		let targetPostIds = []
		const allSavedPosts = user.savedPosts.reverse()
		if (cursor) {
			for (let i = 0; targetPostIds.length < limit && i <= allSavedPosts.length - 1; i++) {
				if (allSavedPosts[i]!.savedAt < new Date(cursor)) {
					targetPostIds.push(allSavedPosts[i]!.post)
				}
				if (i === limit - 1 && allSavedPosts.length - 1 > i) {
					nextCursor = allSavedPosts[i]?.savedAt
				}
			}
		} else {
			targetPostIds = allSavedPosts.map((post) => post.post).slice(0, limit)
		}

		const targetPosts = await Post.find({ _id: { $in: targetPostIds } })
		if (!targetPosts) return res.status(404).json({ detail: 'Not found posts' })
		res.json({ nextCursor, posts: targetPosts })
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})
router.get('/:postId/translate', verifyToken, async (req: Request, res: Response) => {
	try {
		const { postId } = req.params
		const { targetLang } = req.query

		if (!targetLang || !postId) return res.status(400).json({ detail: 'Validation error' })

		const post = await Post.findById(postId).select('content')

		if (!post) return res.status(404).json({ detail: 'Post not found' })

		const [translation] = await translate.translate(post?.content, targetLang as string)

		res.json({ translation })
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})
router.get('/users/:username', verifyToken, async (req: Request, res: Response) => {
	try {
		const { username } = req.params

		const user = await User.findOne({ username })
		if (!user) return res.status(404).json({ detail: 'User not found' })

		const limit = parseInt(req.query.limit as string) || 12
		const cursor = parseInt(req.query.cursor as string)

		const query: PostsQuery = { author: user._id }

		if (cursor) {
			query.createdAt = { $lt: new Date(cursor) }
		}

		const posts = await Post.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1)
		const hasMore = posts.length > limit
		if (hasMore) posts.pop()
		const nextCursor = posts[posts.length - 1]?.createdAt

		res.json({
			nextCursor,
			posts,
		})
	} catch {
		res.status(500).json({ detail: 'Internal server error' })
	}
})
export default router
