import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import { useNavigationStore } from '@/stores/NavigationStore'
import { storeToRefs } from 'pinia'

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
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
			meta: {
				layout: 'AuthLayout',
			},
		},
		{
			path: '/signup',
			name: 'signUp',
			component: () => import('../views/SignUpView.vue'),
			meta: {
				layout: 'AuthLayout',
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
				layout: 'SocialLayout',
			},
		},
		{
			path: '/editProfile',
			name: 'editProfile',
			component: () => import('../views/EditProfileView.vue'),
			meta: {
				layout: 'SocialLayout',
			},
		},
		{
			path: '/message',
			name: 'message',
			component: () => import('../views/MessageView.vue'),
			meta: {
				layout: 'SocialLayout',
			},
		},
	],
})
router.beforeEach((to, from) => {
	const navigationStore = useNavigationStore()
	const { unprocessedPrevRoute } = storeToRefs(navigationStore)
	unprocessedPrevRoute.value = from.fullPath
})

export default router
