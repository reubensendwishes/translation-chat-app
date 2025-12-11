import { useAuthStore } from '@/stores/AuthStore'
import axios from 'axios'

export const useAuth = () => {
	const authStore = useAuthStore()
	const { setAuth, clearAuth, updateAccessToken } = authStore

	const setAxiosToken = (token: string) => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	}

	const clearAxiosToken = () => {
		delete axios.defaults.headers.common['Authorization']
	}

	const signUp = async (
		email: string,
		password: string,
		fullName: string,
		username: string,
	): Promise<{ success: boolean; message?: string }> => {
		try {
			const res = await axios.post('/api/auth/signup', {
				email,
				password,
				fullName,
				username,
			})

			const { accessToken, user } = res.data
			setAuth(accessToken, user)
			setAxiosToken(accessToken)

			return { success: true }
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				return { success: false, message: error.response.data.message }
			}
			return { success: false, message: '網路錯誤' }
		}
	}

	const login = async (
		email: string,
		password: string,
	): Promise<{ success: boolean; message?: string }> => {
		try {
			const res = await axios.post('/api/auth/login', { email, password })

			const { accessToken, user } = res.data
			authStore.setAuth(accessToken, user)
			setAxiosToken(accessToken)
			return { success: true }
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				return { success: false, message: error.response.data.message }
			}
			return { success: false, message: '網路錯誤' }
		}
	}

	const logout = () => {
		clearAuth()
		clearAxiosToken()
	}

	const refreshAccessToken = async (): Promise<boolean> => {
		try {
			const res = await axios.post('/api/auth/refresh')

			const { accessToken } = res.data
			updateAccessToken(accessToken)
			setAxiosToken(accessToken)
			return true
		} catch (error) {
			console.error('刷新token失敗', error)
			logout()
			return false
		}
	}

	return { signUp, login, logout, refreshAccessToken, setAxiosToken }
}
