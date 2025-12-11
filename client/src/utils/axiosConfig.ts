import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: Error) => void }> = []

const processQueue = (error: Error | null, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else if (token) {
			prom.resolve(token)
		}
	})
	isRefreshing = false
	failedQueue = []
}
export const setupAxiosInterceptors = () => {
	axios.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config
			const authStore = useAuthStore()
			const { accessToken } = storeToRefs(authStore)

			if (
				error.response?.status === 401 &&
				!originalRequest._retry &&
				error.response?.data?.errorCode === 'TOKEN_EXPIRED'
			) {
				if (isRefreshing) {
					return new Promise((resolve, reject) => {
						failedQueue.push({ resolve, reject })
					}).then(() => axios(originalRequest))
				}
				originalRequest._retry = true
				isRefreshing = true
				try {
					const { refreshAccessToken } = useAuth()
					const success = await refreshAccessToken()
					if (success && accessToken.value) {
						processQueue(null, accessToken.value)
						return axios(originalRequest)
					} else {
						processQueue(new Error('刷新失敗'), null)
						return Promise.reject(error)
					}
				} catch (err) {
					processQueue(err as Error, null)
					return Promise.reject(error)
				}
			}
			return Promise.reject(error)
		},
	)
}
