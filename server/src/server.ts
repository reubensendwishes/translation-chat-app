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

import authRouter from "./routes/auth";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// routes
app.use("/api/auth", authRouter);

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Backend is working!" });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb:127.0.0.1:27017/myproject";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// start server
const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
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
