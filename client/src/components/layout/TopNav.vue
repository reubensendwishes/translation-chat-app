<template>
	<nav class="d-flex">
		<div class="nav-left">
			<RouterLink to="/">
				<LogoText class="text-primary" text-height="40px" />
			</RouterLink>
		</div>
		<div class="nav-right d-flex">
			<AppDropdown
				@select-item="
					(value) => {
						locale = value
					}
				"
				:dropdown-items="languageItems"
				transition-direction="down"
				placement="bottom"
			>
				<template #button>
					<GSymbol font-size="24px">language</GSymbol>
				</template>
			</AppDropdown>
			<RouterLink to="/message" class="start-chat-btn btn text-inverse bg-inverse pill">
				<GSymbol class="show-lg" weight="400" font-size="24px">chat</GSymbol>
				<span>{{ t('navbar.start') }}</span>
			</RouterLink>

			<AppHamburger :hamburger-items="linkItems" hamburger-radius="42px" />
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	import LogoText from '@/components/icons/LogoText.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import AppDropdown from '@/components/ui/AppDropdown.vue'
	import type { DropdownItem, HamburgerItem } from '@/types'
	import AppHamburger from '@/components/ui/AppHamburger.vue'

	// vue-i18n
	const { t, locale } = useI18n()

	const linkItems: HamburgerItem[] = [{ name: t('navbar.about'), path: '/about' }]

	const languageItems: DropdownItem[] = [
		{ text: 'Tiếng Việt', value: 'vi' },
		{ text: '繁體中文', value: 'zh-TW' },
	]
</script>

<style scoped>
	nav {
		width: 100%;
		height: 60px;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}
	.nav-right {
		align-items: stretch;
		column-gap: 10px;
	}
	.start-chat-btn {
		height: 42px;
		padding: 0 13px;
		gap: 8px;
	}
</style>
