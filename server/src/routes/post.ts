import type { Request, Response } from 'express'
import { Router } from 'express'
import Post from '../models/Post'
import User from '../models/User'

const router = Router()

router.get('/users/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ message: '用戶不存在' })

    const tab = (req.query.tab as string) || 'all'
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 12
    const skip = (page - 1) * limit

    let query: any = { author: user._id }

    if (tab === 'marked') {
      query.isMarked = true
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Post.countDocuments(query)
    const hasMore = skip + limit < total

    res.json({
      posts,
      hasMore,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('獲取 posts 失敗', error)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})
export default router
