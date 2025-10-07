import axios from 'axios'

import { useAuthStore } from '@/stores/AuthStore'
import { connectSocket, disconnectSocket } from '@/socket'
import { useFriend } from './useFriend'
import { usePost } from './usePost'

export const useAuth = () => {
	const authStore = useAuthStore()
	const { setAuth, clearAuth, updateAccessToken } = authStore

	const { fetchFriendshipData } = useFriend()
	const { fetchSavedPostIds } = usePost()

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
	): Promise<{ success: boolean; detail?: string }> => {
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
			connectSocket(accessToken)
			await Promise.all([fetchFriendshipData(), fetchSavedPostIds()])
			return { success: true }
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				return { success: false, detail: error.response.data.detail }
			}
			return { success: false, detail: 'Internal server error' }
		}
	}

	const login = async (
		identifier: string,
		password: string,
	): Promise<{ success: boolean; detail?: string }> => {
		try {
			const res = await axios.post('/api/auth/login', { identifier, password })
			const { accessToken, user } = res.data
			authStore.setAuth(accessToken, user)
			setAxiosToken(accessToken)
			connectSocket(accessToken)
			await Promise.all([fetchFriendshipData(), fetchSavedPostIds()])
			return { success: true }
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				return { success: false, detail: error.response.data.detail }
			}
			return { success: false, detail: 'Internal server error' }
		}
	}

	const logout = () => {
		console.log(123)
		clearAuth()
		clearAxiosToken()
		disconnectSocket()
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
