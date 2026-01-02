import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { config } from "./config";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Backend is working!" });
});

// MongoDB connection
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// start server
const server = app.listen(config.PORT, () => {
  console.log(`Server running at http://localhost:${config.PORT}`);
});

// shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Closing server and MongoDB connection...`);
  server.close(async (err) => {
    if (err) process.exit(1);
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  });
};
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
