import 'vue-router'
import MarketingLayout from './components/layout/MarketingLayout.vue'
import SocialLayout from './components/layout/SocialLayout.vue'
import AuthLayout from './components/layout/AuthLayout.vue'

export const layouts = {
	MarketingLayout,
	SocialLayout,
	AuthLayout,
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
	id: string
	avatar: string
	name: string
}

export interface BaseField {
	id: string
	label: string
	value: string
}

export interface TextAreaField extends BaseField {
	type: 'textarea'
	maxLength: number
}

export type Field = TextAreaField
