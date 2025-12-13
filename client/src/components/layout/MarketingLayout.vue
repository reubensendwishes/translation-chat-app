<template>
	<header class="bg-default">
		<MarketingNav />
	</header>
	<main>
		<slot></slot>
	</main>
	<MarketingFooter />
</template>

<script setup lang="ts">
	import MarketingFooter from '@/components/ui/marketing/MarketingFooter.vue'
	import MarketingNav from '@/components/ui/marketing/MarketingNav.vue'
</script>

<style scoped>
	header {
		position: sticky;
		top: 0;
		width: 100%;
		z-index: 100;
		box-shadow: 0 2px 5px rgba(var(--color-text-primary-rgb) / 0.5);
	}
</style>
