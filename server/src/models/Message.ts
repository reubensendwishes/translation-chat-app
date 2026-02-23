import { Schema, model, Types } from 'mongoose'
import type { Document } from 'mongoose'
interface Message extends Document {
  conversationId: Types.ObjectId
  senderId: Types.ObjectId
  text: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<Message>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    attachments: { type: [String], default: [] },
  },
  { timestamps: true },
)

export default model<Message>('Message', MessageSchema)
