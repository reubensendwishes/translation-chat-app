import 'vue-router'
import MarketingLayout from './components/layout/MarketingLayout.vue'
import AppLayout from './components/layout/AppLayout.vue'

export const layouts = {
	MarketingLayout,
	AppLayout,
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
