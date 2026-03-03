import { Schema, model, Types } from 'mongoose'
import type { Document } from 'mongoose'

interface Conversation extends Document {
	members: Types.ObjectId[]
	createdAt: Date
	updatedAt: Date
}

const ConversationSchema = new Schema<Conversation>(
	{
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true },
)
ConversationSchema.index({ 'member.userId': 1 })

export default model<Conversation>('Conversation', ConversationSchema)
