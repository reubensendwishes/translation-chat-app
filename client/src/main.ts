import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia, storeToRefs } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from '@/stores/AuthStore'
import { useAuth } from './composables/useAuth'
import { useFriend } from './composables/useFriend'
import { setupAxiosInterceptors } from './utils/axiosConfig'

const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:5000'

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
const { accessToken, isLoggedIn } = storeToRefs(authStore)
const { initAuth } = authStore
const { fetchFriendshipData } = useFriend()

initAuth()

const { refreshAccessToken } = useAuth()
if (accessToken.value) {
	await refreshAccessToken()
	await fetchFriendshipData()
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
