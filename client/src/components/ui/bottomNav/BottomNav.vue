<template>
	<nav class="d-flex bg-default text-primary">
		<div class="nav-left">
			<RouterLink to="/"><LogoText /></RouterLink>
		</div>
		<div class="nav-right">
			<button class="btn text-primary" @click="$emit('toggleOffcanvas')" type="button">
				<GSymbol style="font-size: 30px">notifications</GSymbol>
			</button>
			<RouterLink to="/message"><GSymbol style="font-size: 30px">chat</GSymbol></RouterLink>
			<RouterLink :to="`/profile/${user?.username}`"
				><GSymbol style="font-size: 30px">account_circle</GSymbol></RouterLink
			>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import LogoText from '@/components/icons/LogoText.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import { useAuthStore } from '@/stores/AuthStore'
	import { storeToRefs } from 'pinia'

	type Emit = {
		toggleOffcanvas: []
	}

	defineEmits<Emit>()

	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)
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
	.nav-right a:not(:last-child),
	.nav-right button:not(:last-child) {
		margin-right: 10px;
	}
</style>
