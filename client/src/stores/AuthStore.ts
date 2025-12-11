import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type User = {
	id: string
	email: string
	username: string
	fullName: string
}

export const useAuthStore = defineStore('auth', () => {
	const user = ref<User | null>(null)
	const accessToken = ref<string | null>(null)

	const isLoggedIn = computed(() => !!user.value)

	const initAuth = () => {
		const storedAccessToken = localStorage.getItem('accessToken')
		const storedUser = localStorage.getItem('user')

		if (storedAccessToken && storedUser) {
			accessToken.value = storedAccessToken
			user.value = JSON.parse(storedUser)
		}
	}

	const setAuth = (newAccessToken: string, newUser: User) => {
		accessToken.value = newAccessToken
		user.value = newUser

		localStorage.setItem('accessToken', newAccessToken)
		localStorage.setItem('user', JSON.stringify(newUser))
	}

	const clearAuth = () => {
		user.value = null
		accessToken.value = null

		localStorage.removeItem('accessToken')
		localStorage.removeItem('user')
	}

	const updateAccessToken = (newAccessToken: string) => {
		accessToken.value = newAccessToken
		localStorage.setItem('accessToken', newAccessToken)
	}

	return {
		user,
		accessToken,
		isLoggedIn,
		initAuth,
		setAuth,
		clearAuth,
		updateAccessToken,
	}
})
