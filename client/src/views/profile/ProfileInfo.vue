<template>
	<div class="profile-info d-flex">
		<img
			class="profile-avatar pill"
			:src="getAvatarUrl(profileData?.avatar)"
			:alt="profileUsername"
		/>
		<div class="wrapper">
			<div class="username-wrapper d-flex">
				<span class="profile-username">
					{{ profileUsername }}
				</span>
			</div>
			<div class="profile-stats d-flex">
				<div v-for="(stat, index) in profileStats" :key="index" class="profile-stat">
					<span>{{ stat.count }}</span>
					<br />
					<span>{{ stat.name }}</span>
				</div>
			</div>
		</div>
		<div class="profile-description text-secondary">{{ profileData?.description }}</div>
		<div class="profile-btn">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useI18n } from 'vue-i18n'

	import { getAvatarUrl } from '@/utils/helpers'
	import type { ProfileData } from '@/types'

	// types
	type Props = {
		profileData: ProfileData | null
		profileUsername: string
	}

	// props
	const { profileData, profileUsername } = defineProps<Props>()

	// vue-i18n
	const { t } = useI18n()

	const profileStats = computed(() => [
		{ name: t('profile.post'), count: profileData?.postCount ?? 0 },
		{ name: t('profile.friend'), count: profileData?.friendCount ?? 0 },
	])
</script>

<style scoped>
	.profile-info {
		flex-wrap: wrap;
		padding: 40px 16px 10px;
		gap: 20px;
	}
	.profile-info .wrapper {
		align-self: center;
	}
	.profile-avatar {
		width: 77px;
	}
	.username-wrapper {
		margin-bottom: 10px;
		align-items: center;
	}
	.profile-username {
		margin-right: 4px;
	}
	.setting-btn {
		line-height: 0;
		padding: 2px;
	}
	.profile-stats {
		text-align: center;
		gap: 32px;
	}
	.profile-stat {
		line-height: 1.1;
	}
	.profile-description {
		flex-basis: 100%;
	}
</style>
