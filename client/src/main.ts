import { createApp } from 'vue'
import { createPinia, storeToRefs } from 'pinia'
import axios from 'axios'

import './assets/main.scss'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useAuthStore } from '@/stores/AuthStore'
import { useAuth } from './composables/useAuth'
import { useFriend } from './composables/useFriend'
import { setupAxiosInterceptors } from './utils/axiosConfig'
import { connectSocket } from './socket'
import { usePost } from './composables/usePost'

const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_URL

app.use(createPinia())
app.use(router)
app.use(i18n)

const authStore = useAuthStore()
const { accessToken, isLoggedIn } = storeToRefs(authStore)
const { initAuth } = authStore

const { fetchFriendshipData } = useFriend()
const { refreshAccessToken } = useAuth()
const { fetchSavedPostIds } = usePost()

async function init() {
	initAuth()

	if (accessToken.value) {
		await refreshAccessToken()
		await Promise.all([fetchFriendshipData(), fetchSavedPostIds()])
		connectSocket(accessToken.value)
	}

	setInterval(
		async () => {
			if (isLoggedIn.value) {
				await refreshAccessToken()
			}
		},
		10 * 60 * 1000,
	)

	setupAxiosInterceptors()
}
init()

app.mount('#app')
