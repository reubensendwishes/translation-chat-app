import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'

interface Post extends Document {
	content: string
	author: Schema.Types.ObjectId
	imageStoragePaths: Record<'large' | 'small', string>
	createdAt: Date
	updatedAt: Date
}

const PostSchema = new Schema<Post>(
	{
		content: { type: String, required: true, maxLength: 1000 },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		imageStoragePaths: {
			type: {
				small: String,
				large: String,
			},
			default: {},
		},
	},
	{ timestamps: true },
)

export default model<Post>('Post', PostSchema)
