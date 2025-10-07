<template>
	<button
		@click="toggleMenu"
		type="button"
		class="btn text-inverse bg-inverse pill"
		:style="{ width: hamburgerRadius, height: hamburgerRadius }"
	>
		<div
			:class="{ expanded: isMenuOpen }"
			class="hamburger-icon bg-default shadow-default"
		></div>
		<Teleport to="#app">
			<FadeTranslate :transition-direction="transitionDirection">
				<ul class="hamburger-menu d-flex text-primary bg-default" v-if="isMenuOpen">
					<li
						v-for="(hamburgerItem, index) in hamburgerItems"
						:key="index"
						class="text-primary hamburger-item"
					>
						<RouterLink
							class="hamburger-link"
							:to="hamburgerItem.path"
							@click="closeMenu"
							>{{ hamburgerItem.name }}</RouterLink
						>
					</li>
				</ul>
			</FadeTranslate>
		</Teleport>
	</button>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	import FadeTranslate from '@/components/transitions/FadeTranslate.vue'
	import type { HamburgerItem } from '@/types'

	// types
	type Props = {
		hamburgerItems: HamburgerItem[]
		hamburgerRadius: string
		transitionDirection?: 'up' | 'down' | 'left' | 'right'
	}

	// Props
	const { hamburgerItems, hamburgerRadius, transitionDirection = 'down' } = defineProps<Props>()

	const isMenuOpen = ref(false)
	const toggleMenu = () => {
		isMenuOpen.value = !isMenuOpen.value
	}
	const closeMenu = () => {
		isMenuOpen.value = false
	}
</script>

<style scoped>
	.hamburger-icon {
		position: relative;
		height: 1px;
		width: 20px;
		transition: 1s;
		line-height: 1;
		margin: 0 auto;
	}
	.hamburger-icon::before {
		content: '';
		position: absolute;
		height: 1px;
		width: 20px;
		left: 0px;
		top: -6px;
		transition: 1s;
	}
	.hamburger-icon::after {
		content: '';
		position: absolute;
		height: 1px;
		width: 20px;
		left: 0px;
		bottom: -6px;
		transition: 1s;
	}
	.hamburger-icon.expanded {
		background-color: transparent;
	}
	.hamburger-icon.expanded::before {
		top: 0;
		rotate: 45deg;
	}
	.hamburger-icon.expanded::after {
		bottom: 0;
		rotate: -45deg;
	}
	.hamburger-menu {
		position: absolute;
		inset: 0;
		width: 100%;
		padding-top: 60px;
		flex-direction: column;
		z-index: 50;
	}
	.hamburger-item {
		text-align: center;
		padding: 20px 0;
	}
	.hamburger-link {
		display: block;
		width: 100%;
	}
</style>
