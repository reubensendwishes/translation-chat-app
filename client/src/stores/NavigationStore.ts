import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
	const unprocessedPrevRoute = ref<string | null>(null)
	return {
		unprocessedPrevRoute,
	}
})
