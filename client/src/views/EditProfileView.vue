<template>
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
				<img class="user-avatar pill" :src="user.avatar" alt="user avatar" />
				<div class="wrapper">
					<div class="user-id">{{ user.id }}</div>
					<div class="user-name">{{ user.name }}</div>
				</div>
			</div>
		</div>
		<form>
			<ProfileField
				v-for="field in profileFields"
				:field="field"
				v-model="field.value"
				:key="field.label"
			/>
		</form>
	</main>
</template>

<script setup lang="ts">
	import GSymbol from '@/components/icons/GSymbol.vue'
	import ContactTest from '@/assets/contact-test.png'
	import { ref, computed, type ComputedRef } from 'vue'
	import { RouterLink } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useNavigationStore } from '@/stores/NavigationStore'
	import type { Field } from '@/types'
	import ProfileField from '@/components/ui/ProfileField.vue'

	const user = {
		avatar: ContactTest,
		id: '123',
		name: 'User Name',
	}
	const navigationStore = useNavigationStore()
	const { unprocessedPrevRoute } = storeToRefs(navigationStore)
	const backRoute: ComputedRef<string> = computed(() => {
		return unprocessedPrevRoute.value ?? '/'
	})

	const profileFields = ref<Field[]>([
		{
			id: 'pepBio',
			label: '個人簡介',
			type: 'textarea',
			value: '',
			maxLength: 150,
		},
	])
</script>

<style scoped>
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
	}
	.user-id {
		margin-bottom: 6px;
	}
</style>
