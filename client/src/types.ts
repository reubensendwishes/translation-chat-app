import 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import TabBarLayout from './layouts/TabBarLayout.vue'
import BlankLayout from './layouts/BlankLayout.vue'

export const layouts = {
	DefaultLayout,
	TabBarLayout,
	BlankLayout,
} as const

declare module 'vue-router' {
	interface RouteMeta {
		layout?: keyof typeof layouts
	}
}

export type Image = {
	name: string
	src: string
}

export type BaseField = {
	label: string
	value: string
}

export interface TextAreaField extends BaseField {
	type: 'textarea'
	maxLength: number
}

export type Field = TextAreaField

export type UserData = {
	_id: string
	username: string
	fullName: string
	avatar?: string
}
export type FriendShip = {
	_id: string
	friendData: UserData
	myRole: 'requester' | 'recipient'
	status: 'accepted' | 'pending'
	updatedAt: string
}
export type Conversation = {
	_id: string
	recipientId: string
	avatar?: string
	username: string
	updatedAt: string
}

export type Message = {
	_id?: string
	localKey?: string
	conversationId: string
	senderId: string
	text: string
	createdAt?: string
	translation?: string
	isTranslated?: boolean
}

export type DropdownItem = {
	text: string
	value: string
}

export type HamburgerItem = {
	name: string
	path: string
}

export type Post = {
	_id: string
	author: string
	content: string
	imageStoragePaths: { small: string; large: string }
	translation?: string
	isTranslated?: boolean
	createdAt: string
}

export type ProfileData = {
	userId: string
	fullName: string
	description?: string
	avatar?: string
	isOwner: boolean
	friendCount: number
	postCount: number
}

export type PostTab = {
	name: string
	icon: string
}

export type EditProfileData = {
	_id: string
	fullName: string
	username: string
	avatar?: string
	description?: string
}

export type CardData = {
	imageUrl?: string
	title: string
	description: string
}
