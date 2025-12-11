import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  version: number;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("缺少環境變數：ACCESS_TOKEN_SECRET");
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        errorCode: "NO_TOKEN",
        message: "未提供token",
      });
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        errorCode: "TOKEN_EXPIRED",
        message: "accessToken已過期",
      });
    }

    return res.status(401).json({
      errorCode: "INVALID_TOKEN",
      message: "無效的token",
    });
  }
};
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
