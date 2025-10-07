<template>
	<ProfileInfo :profile-data="profileData" :profile-username="profileUsername">
		<RouterLink class="btn text-inverse bg-inverse" to="/editProfile"
			>{{ t('profile.editProfile') }}
		</RouterLink>
	</ProfileInfo>
	<PostsPanel
		default-tab="all"
		:post-tabs="postTabs"
		:post-api-url="postApiUrl"
		:profile-username="profileUsername"
		:profile-avatar="profileData?.avatar ?? ''"
	/>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useI18n } from 'vue-i18n'

	import type { PostTab, ProfileData } from '@/types'
	import PostsPanel from '@/views/profile/PostsPanel.vue'
	import ProfileInfo from '@/views/profile/ProfileInfo.vue'

	// types
	type Props = {
		profileData: ProfileData | null
		profileUsername: string
	}

	// props
	const { profileData, profileUsername } = defineProps<Props>()

	// vue-i18n
	const { t } = useI18n()

	const postTabs = ref<PostTab[]>([
		{ name: 'all', icon: 'post' },
		{ name: 'saved', icon: 'bookmark' },
	])
	const postApiUrl = {
		all: `/api/posts/users/${profileUsername}`,
		saved: '/api/posts/saved',
	}
</script>

<style scoped>
	.btn {
		font-size: 15px;
		padding: 6px 12px;
		border-radius: 8px;
	}
</style>
