<template>
	<template v-if="errorMessage">
		<div class="error-message-wrapper">
			<strong class="text-warning">{{ errorMessage }}</strong>
		</div>
	</template>
	<template v-else>
		<header class="text-primary d-flex">
			<RouterLink :to="backRoute"
				><GSymbol style="font-size: 30px">arrow_back_ios</GSymbol></RouterLink
			>
			<h1 class="header-title">編輯個人檔案</h1>
		</header>
		<main class="text-primary">
			<div class="page-header">
				<h2 class="page-title">編輯個人檔案</h2>
				<div class="user-info d-flex">
					<img
						class="user-avatar pill"
						:src="myUserData?.avatar ?? ''"
						:alt="myUserData?.username"
					/>
					<div class="wrapper">
						<div class="user-username">{{ myUserData?.username }}</div>
						<div class="user-full-name">{{ myUserData?.fullName }}</div>
					</div>
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
					class="btn pill text-inverse bg-inverse"
					:disabled="!hasChanged || isLoadingSubmit"
				>
					<span v-if="!isLoadingSubmit">提交</span
					><span v-else class="profile-loading"
						><SpinnerIcon spinner-color="inverse"
					/></span>
				</button>
			</form>
		</main>
	</template>
</template>

<script setup lang="ts">
	import GSymbol from '@/components/icons/GSymbol.vue'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
	import axios from 'axios'
	import { ref, computed, onMounted } from 'vue'
	import { RouterLink } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useNavigationStore } from '@/stores/NavigationStore'
	import type { Field } from '@/types'
	import ProfileField from '@/views/edit-profile/ProfileField.vue'

	type MyUserData = {
		fullName: string
		username: string
		avatar?: string
		email: string
		description?: string
	}
	const navigationStore = useNavigationStore()
	const { unprocessedPrevRoute } = storeToRefs(navigationStore)

	const backRoute = computed(() => {
		return unprocessedPrevRoute.value ?? '/'
	})

	const myUserData = ref<MyUserData | null>(null)

	const profileFields = ref<Record<string, Field>>({
		pepBio: {
			label: '個人簡介',
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
			myUserData.value = res.data
			if (res.data.description) {
				profileFields.value.pepBio.value = res.data.description
			}
			Object.entries(profileFields.value).forEach(([key, value]) => {
				originalFieldValues.value[key] = value.value
			})
		} catch (error) {
			if (axios.isAxiosError(error)) {
				errorMessage.value = error.response?.data?.message ?? '伺服器錯誤'
			} else {
				errorMessage.value = '非預期錯誤'
			}
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
	.profile-loading {
		width: 18px;
		height: 18px;
	}
	.profile-field:last-of-type {
		margin-bottom: 30px;
	}
</style>
