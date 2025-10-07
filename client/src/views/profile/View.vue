<template>
	<main class="text-primary">
		<!-- <strong  >{{ t('profile.alert.loadFailed') }}</strong> -->
		<component
			:is="user?.username === profileUsername ? MyProfile : UserProfile"
			:profile-data="profileData"
			:profile-username="profileUsername"
		/>
	</main>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useRoute } from 'vue-router'
	import axios from 'axios'

	import { useAuthStore } from '@/stores/AuthStore'
	import { handleRequestError } from '@/utils/helpers'
	import MyProfile from '@/views/profile/MyProfile.vue'
	import UserProfile from '@/views/profile/UserProfile.vue'
	import type { ProfileData } from '@/types'

	// types
	type Props = {
		profileUsername: string
	}

	// props
	const { profileUsername } = defineProps<Props>()

	// stores
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	// vue-router
	const route = useRoute()

	const profileData = ref<ProfileData | null>(null)
	const fetchUser = async () => {
		try {
			const res = await axios.get(`/api/user/${route.params.username}`)
			profileData.value = res.data
		} catch (error) {
			handleRequestError(error)
		}
	}

	onMounted(async () => {
		await fetchUser()
	})
</script>

<style scoped>
	main {
		padding-bottom: 60px;
	}
</style>
