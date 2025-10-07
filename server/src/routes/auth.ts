import type { Request, Response } from 'express'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import User from '../models/User'

const router = Router()

interface TokenPayload {
	userId: string
	email: string
	version: number
}

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

const generateTokens = (userId: string, email: string, version: number) => {
	const payload: TokenPayload = { userId, email, version }

	const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
	})

	const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	})
	return { accessToken, refreshToken }
}

router.get('/check-username', async (req: Request, res: Response) => {
	try {
		const { username } = req.query
		if (!username || typeof username !== 'string') {
			return res.status(400).json({ available: false })
		}
		const existingUser = await User.findOne({ username })
		res.json({ available: !existingUser })
	} catch (error) {
		console.error('檢查username錯誤', error)
		res.status(500).json({ available: false })
	}
})

router.post('/signup', async (req: Request, res: Response) => {
	try {
		const { email, password, fullName, username } = req.body

		if (!email || !password || !fullName || !username) {
			console.error(email, fullName, username)
			return res.status(400).json({ detail: 'Validation error' })
		}

		const [existingEmail, existingUsername] = await Promise.all([
			User.findOne({ email }),
			User.findOne({ username }),
		])

		if (existingEmail || existingUsername) {
			return res.status(409).json({ detail: 'Email or username already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = new User({
			username,
			fullName,
			email,
			hashedPassword,
		})

		await newUser.save()

		const { accessToken, refreshToken } = generateTokens(
			newUser._id.toString(),
			newUser.email,
			newUser.tokenVersion,
		)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		return res.status(201).json({
			accessToken,
			user: {
				_id: newUser._id,
				email: newUser.email,
				username: newUser.username,
				fullName: newUser.fullName,
			},
		})
	} catch (error) {
		console.error('註冊錯誤', error)
		res.status(500).json({ detail: 'Internal server error' })
	}
})

router.post('/login', async (req: Request, res: Response) => {
	try {
		const { identifier, password } = req.body

		if (!identifier || !password) {
			return res.status(400).json({ detail: 'Validation error' })
		}

		let query
		const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]{2,}$/
		const usernameRegex = /^[a-zA-Z0-9_-]+$/
		if (emailRegex.test(identifier)) {
			query = { email: identifier }
		} else if (usernameRegex.test(identifier)) {
			query = { username: identifier }
		} else {
			return res.status(401).json({
				detail: 'Invalid credentials',
			})
		}
		const user = await User.findOne(query)

		if (!user) {
			return res.status(401).json({
				detail: 'Invalid credentials',
			})
		}

		const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

		if (!isPasswordValid) {
			return res.status(401).json({
				detail: 'Invalid credentials',
			})
		}

		const { accessToken, refreshToken } = generateTokens(
			user._id.toString(),
			user.email,
			user.tokenVersion,
		)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.json({
			accessToken,
			user: {
				_id: user._id,
				email: user.email,
				username: user.username,
				fullName: user.fullName,
			},
		})
	} catch (error) {
		console.error('登入錯誤', error)
		res.status(500).json({ detail: 'Internal server error' })
	}
})

router.post('/refresh', async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies.refreshToken

		if (!refreshToken) {
			return res.status(401).json({
				detail: 'Invalid token',
			})
		}

		const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET) as TokenPayload

		const user = await User.findById(decoded.userId)
		if (!user || decoded.version !== user.tokenVersion) {
			return res.status(401).json({
				detail: 'Invalid token',
			})
		}

		user.tokenVersion += 1
		await user.save()

		const { accessToken, refreshToken: newRefreshToken } = generateTokens(
			decoded.userId,
			decoded.email,
			user.tokenVersion,
		)
		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.json({
			accessToken,
		})
	} catch (error) {
		console.error('刷新token錯誤:', error)
		res.status(401).json({
			detail: 'Invalid token',
		})
	}
})

export default router
