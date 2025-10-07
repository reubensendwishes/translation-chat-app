<template>
	<template v-if="errorMessage">
		<div class="error-message-wrapper">
			<strong class="text-warning">{{ errorMessage }}</strong>
		</div>
	</template>
	<template v-else>
		<header class="text-primary d-flex">
			<RouterLink :to="backRoute">
				<GSymbol font-size="30px">arrow_back_ios</GSymbol>
			</RouterLink>
			<h1 class="header-title">{{ t('editProfile.title') }}</h1>
		</header>
		<main class="text-primary">
			<div class="page-header">
				<h2 class="page-title">{{ t('editProfile.title') }}</h2>
				<div class="user-info d-flex">
					<img
						class="user-avatar pill"
						:src="getAvatarUrl(editProfileData?.avatar)"
						:alt="editProfileData?.username"
					/>
					<div class="wrapper">
						<div class="user-username">{{ editProfileData?.username }}</div>
						<div class="user-full-name">{{ editProfileData?.fullName }}</div>
					</div>
					<label
						:class="isLoadingUploadAvatar && 'disabled'"
						class="change-avatar-btn btn text-inverse bg-inverse"
					>
						<input
							ref="fileInput"
							type="file"
							hidden
							accept="image/jpeg,image/png,image/webp"
							@change="handleFileChange"
							:disabled="isLoadingUploadAvatar"
						/>
						<span v-if="!isLoadingUploadAvatar">{{
							t('editProfile.changeAvatar')
						}}</span>
						<span v-else>
							<SpinnerIcon
								spinner-color="inverse"
								spinner-height="18px"
								spinner-width="18px"
							/>
						</span>
					</label>
				</div>
			</div>
			<form class="profile-form" @submit.prevent="handleSubmit">
				<ProfileField
					v-for="(field, fieldName) in profileFields"
					:field="field"
					v-model="field.value"
					:key="fieldName"
				/>
				<button
					type="submit"
					class="submit-btn btn pill text-inverse bg-inverse"
					:disabled="!hasChanged || isLoadingSubmit"
				>
					<span v-if="!isLoadingSubmit">{{ t('common.submit') }}</span>
					<span v-else class="profile-loading">
						<SpinnerIcon
							spinner-color="inverse"
							spinner-height="18px"
							spinner-width="18px"
						/>
					</span>
				</button>
			</form>
		</main>
	</template>
</template>

<script setup lang="ts">
	import axios from 'axios'
	import { ref, computed, onMounted } from 'vue'
	import { RouterLink } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import { getAvatarUrl, handleRequestError } from '@/utils/helpers'
	import { useNavigationStore } from '@/stores/NavigationStore'
	import type { EditProfileData, Field } from '@/types'
	import ProfileField from '@/views/edit-profile/ProfileField.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

	// stores
	const navigationStore = useNavigationStore()
	const { unprocessedPrevRoute } = storeToRefs(navigationStore)

	// vue-i18n
	const { t } = useI18n()

	const backRoute = computed(() => {
		return unprocessedPrevRoute.value ?? '/'
	})
	const isLoadingUploadAvatar = ref(false)
	const handleFileChange = async (event: Event) => {
		if (isLoadingUploadAvatar.value) return
		isLoadingUploadAvatar.value = true
		const { target } = event
		const file = (target as HTMLInputElement).files?.[0]
		if (!file) return
		const formData = new FormData()
		formData.append('avatar', file)
		try {
			await axios.put('api/user/me/avatar', formData)
			return { success: true }
		} catch (error) {
			handleRequestError(error)
		} finally {
			isLoadingUploadAvatar.value = false
		}
	}
	const editProfileData = ref<EditProfileData | null>(null)

	const profileFields = ref<Record<string, Field>>({
		pepBio: {
			label: t('editProfile.bio'),
			type: 'textarea',
			value: '',
			maxLength: 150,
		},
	})
	const originalFieldValues = ref<Record<string, string>>({})
	const errorMessage = ref<null | string>(null)
	const isLoadingSubmit = ref<boolean>(false)
	const handleSubmit = async () => {
		if (isLoadingSubmit.value) return
		isLoadingSubmit.value = true
		try {
			const res = await axios.put('/api/user/me', {
				description: profileFields.value.pepBio.value,
			})
			originalFieldValues.value.pepBio = res.data.description
		} catch (error) {
			console.error(error)
		} finally {
			isLoadingSubmit.value = false
		}
	}
	const hasChanged = computed(() => {
		return profileFields.value.pepBio.value !== originalFieldValues.value.pepBio
	})

	onMounted(async () => {
		try {
			const res = await axios.get(`/api/user/me`)
			editProfileData.value = res.data
			if (res.data.description) {
				profileFields.value.pepBio.value = res.data.description
			}
			Object.entries(profileFields.value).forEach(([key, value]) => {
				originalFieldValues.value[key] = value.value
			})
		} catch (error) {
			handleRequestError(error)
		}
	})
</script>

<style scoped>
	.error-message-wrapper {
		padding: 30px 0px;
		text-align: center;
	}
	header {
		align-items: center;
		padding: 0 16px;
	}
	main {
		padding: 40px 16px 60px;
	}
	.page-header {
		margin-bottom: 30px;
	}
	.header-title {
		font-size: 17px;
		flex-grow: 1;
		text-align: center;
	}
	.page-title {
		font-size: 21px;
		margin-bottom: 40px;
	}
	.user-info {
		gap: 12px;
		align-items: center;
		font-size: 17px;
		background-color: var(--color-bg-muted);
		padding: 10px;
		border-radius: 10px;
	}
	.user-avatar {
		width: 56px;
		height: 56px;
	}
	.user-username {
		margin-bottom: 6px;
	}
	.change-avatar-btn {
		margin-left: auto;
		padding: 6px 10px;
		border-radius: 8px;
		font-size: 16px;
	}

	.change-avatar-btn.disabled {
		cursor: default;
		line-height: 0;
	}
	.profile-form {
		text-align: center;
	}
	.profile-form button[type='submit'] {
		width: 30%;
		height: 32px;
	}
	.profile-form button[type='submit']:disabled,
	.profile-form button[type='submit']:disabled:hover {
		background-color: var(--color-text-muted);
		cursor: default;
	}
	.profile-form button[type='submit']:hover {
		background-color: var(--color-primary-darken);
	}
	.profile-field:last-of-type {
		margin-bottom: 30px;
	}
	.submit-btn {
		font-size: 18px;
	}
</style>
