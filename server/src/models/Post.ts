import { Schema, model } from "mongoose";
import type { Document } from "mongoose";

interface Post extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  imageUrl: string;
  imageStoragePath?: string;
  createdAt: Date;
  updateAt: Date;
}

const PostSchema = new Schema<Post>(
  {
    content: { type: String, required: true, maxLength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
    imageStoragePath: { type: String },
  },
  { timestamps: true }
);

export default model<Post>("Post", PostSchema);
