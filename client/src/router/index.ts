import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import { useNavigationStore } from '@/stores/NavigationStore'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/AuthStore'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: {
				layout: 'TopNavLayout',
			},
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
			meta: {
				layout: 'NoNavLayout',
				requiresGuest: true,
			},
		},
		{
			path: '/signup',
			name: 'signUp',
			component: () => import('../views/SignUpView.vue'),
			meta: {
				layout: 'NoNavLayout',
				requiresGuest: true,
			},
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('../views/AboutView.vue'),
			meta: {
				layout: 'TopNavLayout',
			},
		},
		{
			path: '/profile/:username',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
			meta: {
				layout: 'BottomNavLayout',
				requiresAuth: true,
			},
		},
		{
			path: '/editProfile',
			name: 'editProfile',
			component: () => import('../views/EditProfileView.vue'),
			meta: {
				layout: 'BottomNavLayout',
				requiresAuth: true,
			},
		},
		{
			path: '/message',
			name: 'message',
			component: () => import('../views/MessageView.vue'),
			meta: {
				layout: 'BottomNavLayout',
				requiresAuth: true,
			},
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('../views/NotFoundView.vue'),
			meta: {
				layout: 'NoNavLayout',
			},
		},
	],
})
router.beforeEach((to, from) => {
	const navigationStore = useNavigationStore()
	const { unprocessedPrevRoute } = storeToRefs(navigationStore)
	unprocessedPrevRoute.value = from.fullPath

	const authStore = useAuthStore()
	const { isLoggedIn, user } = storeToRefs(authStore)

	if (to.meta.requiresAuth && !isLoggedIn.value) {
		return {
			name: 'login',
			query: {
				next: to.fullPath,
			},
		}
	}
	if (to.meta.requiresGuest && isLoggedIn.value) {
		return `/profile/${user.value?.username}`
	}
	return
})

export default router
