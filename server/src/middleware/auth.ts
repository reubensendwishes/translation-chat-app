import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
	userId: string
	email: string
	version: number
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

if (!ACCESS_TOKEN_SECRET) {
	throw new Error('缺少環境變數：ACCESS_TOKEN_SECRET')
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization
		const token = authHeader?.split(' ')[1]

		if (!token) {
			return res.status(401).json({
				datail: 'Invalid token',
			})
		}

		const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload

		req.userId = decoded.userId
		next()
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({
				datail: 'Token has expired',
			})
		}

		return res.status(401).json({
			datail: 'Invalid token',
		})
	}
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			userId?: string
		}
	}
}
