import 'vue-router'
import TopNavLayout from './components/layout/TopNavLayout.vue'
import BottomNavLayout from './components/layout/BottomNavLayout.vue'
import NoNavLayout from './components/layout/NoNavLayout.vue'

export const layouts = {
	TopNavLayout,
	BottomNavLayout,
	NoNavLayout,
} as const

declare module 'vue-router' {
	interface RouteMeta {
		layout?: keyof typeof layouts
	}
}

export interface Image {
	name: string
	src: string
}

export interface Contact {
	_id: string
	username: string
	avatar: string
	fullName: string
}

export interface BaseField {
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
	avatar: string
}
export type Friend = {
	requestId: string
	friendData: UserData
}
export type ReceivedRequest = {
	requestId: string
	requesterData: UserData
	createdAt: Date
}

export type SentRequest = {
	requestId: string
	recipientId: string
}
