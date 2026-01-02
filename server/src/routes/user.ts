import type { Request, Response } from "express";
import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import User from "../models/User";
import Friendship from "../models/Friendship";

const router = Router();

router.get("/:username", verifyToken, async (req: Request, res: Response) => {
  try {
    const { username: paramUsername } = req.params;
    const currentUserId = req.userId;
    const user = await User.findOne({
      username: paramUsername,
    });

    if (!user) {
      return res.status(404).json({ message: "用戶不存在" });
    }
    const friendCount = await Friendship.countDocuments({
      $or: [
        { requester: user._id, status: "accepted" },
        { recipient: user._id, status: "accepted" },
      ],
    });
    const isOwner = currentUserId === user._id.toString();
    const userData = {
      fullName: user.fullName,
      description: user.description,
      avatar: user.avatar,
      friendCount,
      isOwner,
    };
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

export default router;
