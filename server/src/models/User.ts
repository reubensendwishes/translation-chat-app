import { Schema, model } from "mongoose";
import type { Document } from "mongoose";
interface User extends Document {
  fullName: string;
  username: string;
  email: string;
  hashedPassword: string;
  avatar?: string;
  description?: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<User>(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: { type: String, required: true },
    description: { type: String, maxlength: 150 },
    avatar: { type: String },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<User>("User", UserSchema);
