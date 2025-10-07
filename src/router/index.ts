import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: {
				layout: 'MarketingLayout',
			},
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('../views/AboutView.vue'),
			meta: {
				layout: 'MarketingLayout',
			},
		},
		{
			path: '/profile/:userId',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
			meta: {
				layout: 'AppLayout',
			},
		},
		{
			path: '/editProfile',
			name: 'editProfile',
			component: () => import('../views/EditProfileView.vue'),
			meta: {
				layout: 'AppLayout',
			},
		},
		{
			path: '/message',
			name: 'message',
			component: () => import('../views/MessageView.vue'),
			meta: {
				layout: 'AppLayout',
			},
		},
	],
})

export default router
