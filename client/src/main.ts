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
axios.defaults.baseURL = 'http://localhost:5000'

app.use(createPinia())
app.use(router)
app.use(i18n)

const authStore = useAuthStore()
const { accessToken, isLoggedIn } = storeToRefs(authStore)
const { initAuth } = authStore

const { fetchFriendshipData } = useFriend()
const { refreshAccessToken } = useAuth()
const { fetchSavedPostIds } = usePost()

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

app.mount('#app')
