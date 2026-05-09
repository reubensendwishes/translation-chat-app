<template>
	<AppHeader />
	<main>
		<slot />
	</main>
	<AppFooter />
</template>

<script setup lang="ts">
	import AppFooter from '@/components/layout/AppFooter.vue'
	import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<style scoped>
	header {
		position: sticky;
		top: 0;
		width: 100%;
		z-index: 100;
		box-shadow: 0 2px 5px rgba(var(--color-text-primary-rgb) / 0.5);
	}
	main {
		flex-grow: 1;
	}
</style>
