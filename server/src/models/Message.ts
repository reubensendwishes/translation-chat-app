import { Schema, model, Types } from "mongoose";
import type { Document } from "mongoose";
interface Message extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  attachments?: string[];
  createdAt: Date;
  editedAt?: Date;
}

const MessageSchema = new Schema<Message>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: { type: Schema.Types.ObjectId, ref: "User", requires: true },
  text: { type: String, required: true },
  attachments: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
});

export const Message = model<Message>("Message", MessageSchema);
