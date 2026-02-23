import { Schema, model, Types } from 'mongoose'
import type { Document } from 'mongoose'

type ConversationMember = {
  userId: Types.ObjectId
  joinedAt?: Date
}

interface Conversation extends Document {
  type: 'direct' | 'group'
  members: ConversationMember[]
  name?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new Schema<Conversation>(
  {
    type: { type: String, enum: ['direct', 'group'], required: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    name: { type: String },
    avatar: { type: String },
  },
  { timestamps: true },
)

export default model<Conversation>('Conversation', ConversationSchema)
