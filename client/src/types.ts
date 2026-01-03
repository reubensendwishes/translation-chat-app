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
	id: string
	avatar: string
	name: string
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
