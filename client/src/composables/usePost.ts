import { useAuthStore } from '@/stores/AuthStore'
import { handleRequestError } from '@/utils/helpers'
import axios from 'axios'
import { storeToRefs } from 'pinia'

export const usePost = () => {
	const authStore = useAuthStore()
	const { savedPostIds } = storeToRefs(authStore)

	const fetchSavedPostIds = async () => {
		try {
			const res = await axios.get('api/posts/saved/ids')
			savedPostIds.value = new Set(res.data)
		} catch (error) {
			handleRequestError(error)
		}
	}
	return { fetchSavedPostIds }
}
