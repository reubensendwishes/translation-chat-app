<template>
	<nav class="d-flex bg-default text-primary">
		<div class="nav-left">
			<RouterLink to="/"><LogoText /></RouterLink>
		</div>
		<div class="nav-right">
			<RouterLink to="/message"><GSymbol style="font-size: 30px">chat</GSymbol></RouterLink>
			<RouterLink :to="`/profile/${userId}`"
				><GSymbol style="font-size: 30px">account_circle</GSymbol></RouterLink
			>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import LogoText from '../icons/LogoText.vue'
	import GSymbol from '../icons/GSymbol.vue'
	const userId = '123'
</script>

<style scoped>
	nav {
		width: 100%;
		height: 60px;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		box-shadow: 0px -2px 5px rgba(var(--color-text-primary-rgb) / 0.5);
		padding: 0 10px;
		font-size: 30px;
	}
	.nav-right a:not(:last-of-type) {
		margin-right: 10px;
	}
</style>
