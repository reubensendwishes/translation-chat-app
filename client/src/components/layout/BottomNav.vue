<template>
	<nav class="d-flex bg-default text-primary">
		<div class="nav-left">
			<RouterLink to="/"><LogoText /></RouterLink>
		</div>
		<div class="nav-right d-flex">
			<AppDropdown
				class="btn"
				placement="top"
				@select-item="
					(value) => {
						locale = value
					}
				"
				:dropdown-items="languageItems"
				transition-direction="up"
			>
				<template #button>
					<GSymbol font-size="30px">language</GSymbol>
				</template>
			</AppDropdown>
			<OffCanvas class="btn" :teleport-to="'#app'">
				<template #button>
					<GSymbol style="font-size: 30px">notifications</GSymbol>
				</template>
				<template #header>{{ t('navbar.notification.title') }}</template>
				<NotificationList />
			</OffCanvas>
			<AppModal class="btn" v-model="isModalOpen">
				<template #button>
					<GSymbol style="font-size: 30px">add_2</GSymbol>
				</template>
				<template #header>{{ t('navbar.post.title') }}</template>
				<CreatePostPanel @close-modal="isModalOpen = false" />
			</AppModal>
			<RouterLink class="btn" to="/message">
				<GSymbol style="font-size: 30px">chat</GSymbol>
			</RouterLink>
			<RouterLink class="btn" :to="`/profile/${user?.username}`">
				<GSymbol style="font-size: 30px">account_circle</GSymbol>
			</RouterLink>
			<button @click="handleLogout" type="button" class="btn text-btn text-primary">
				log out
			</button>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import LogoText from '@/components/icons/LogoText.vue'
	import GSymbol from '../icons/GSymbol.vue'
	import { useAuthStore } from '@/stores/AuthStore'
	import OffCanvas from '@/components/ui/OffCanvas.vue'
	import NotificationList from '@/components/layout/NotificationList.vue'
	import AppDropdown from '@/components/ui/AppDropdown.vue'
	import type { DropdownItem } from '@/types'
	import AppModal from '../ui/AppModal.vue'
	import CreatePostPanel from './CreatePostPanel.vue'
	import { useAuth } from '@/composables/useAuth'
	import { useRouter } from 'vue-router'

	// stores
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	// composables
	const { logout } = useAuth()

	// router
	const router = useRouter()

	// vue-i18n
	const { t, locale } = useI18n()

	const languageItems: DropdownItem[] = [
		{ text: 'Tiếng Việt', value: 'vi' },
		{ text: '繁體中文', value: 'zh-TW' },
	]

	const isModalOpen = ref(false)

	const handleLogout = () => {
		logout()
		router.push('/login')
	}
</script>

<style scoped>
	nav {
		width: 100%;
		height: 60px;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		z-index: 100;
		bottom: 0;
		box-shadow: 0px -2px 5px rgba(var(--color-text-primary-rgb) / 0.5);
		padding: 0 10px;
		font-size: 30px;
	}
	.nav-right {
		gap: 10px;
	}
	.nav-right > .btn:not(:last-child) {
		margin-right: 10px;
	}
	.btn {
		line-height: 0;
	}
	.btn:hover {
		color: var(--color-primary-darken);
	}
	.btn.text-btn {
		font-size: 18px;
		line-height: 1;
	}
</style>
