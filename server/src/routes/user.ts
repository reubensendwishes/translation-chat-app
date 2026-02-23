import type { Request, Response } from 'express'
import { Router } from 'express'
import { verifyToken } from '../middleware/auth'
import User from '../models/User'
import Friendship from '../models/Friendship'

const router = Router()
router.get('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select('fullName username email avatar description')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '無法取得user資料' })
  }
})
router.get('/friends', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' },
      ],
    }).populate([
      { path: 'requester', select: 'username fullName avatar' },
      { path: 'recipient', select: 'username fullName avatar' },
    ])

    const friends = friendships.map((friendship) => {
      const friendData =
        friendship.requester._id.toString() === userId ? friendship.recipient : friendship.requester
      return friendData
    })

    res.json(friends)
  } catch (error) {
    res.status(500).json({ message: '無法取得好友清單' })
  }
})
router.get('/:username', verifyToken, async (req: Request, res: Response) => {
  try {
    const { username: paramUsername } = req.params
    const currentUserId = req.userId
    const user = await User.findOne({
      username: paramUsername,
    })

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' })
    }
    const friendCount = await Friendship.countDocuments({
      $or: [
        { requester: user._id, status: 'accepted' },
        { recipient: user._id, status: 'accepted' },
      ],
    })
    const isOwner = currentUserId === user._id.toString()
    const userData = {
      fullName: user.fullName,
      description: user.description,
      avatar: user.avatar,
      friendCount,
      isOwner,
    }
    res.json(userData)
  } catch (error) {
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

router.put('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const { description } = req.body
    console.log(description)
    if (description && description.length > 150) {
      return res.status(400).json({ message: '個人簡介不能超過150個字元' })
    }
    const user = await User.findByIdAndUpdate(userId, { description }, { new: true }).select(
      'fullName username email avatar description',
    )
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '無法更新user資料' })
  }
})

export default router
