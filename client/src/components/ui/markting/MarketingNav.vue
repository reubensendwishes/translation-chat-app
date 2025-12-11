<template>
	<nav class="d-flex">
		<div class="nav-left">
			<RouterLink to="/">
				<LogoText class="text-primary" text-height="40px" />
			</RouterLink>
		</div>
		<div class="nav-right d-flex">
			<RouterLink to="/message" class="btn text-inverse bg-inverse pill"
				><GSymbol class="show-lg" fontStyle="normal" weight="400">chat</GSymbol
				><span>開始聊天</span>
			</RouterLink>
			<button class="hamburger text-inverse bg-inverse pill" @click="toggleMenu">
				<HamburgerIcon
					class="bg-default shadow-default"
					:class="{ expanded: isMenuOpen }"
				/>
			</button>
		</div>
	</nav>
	<Teleport to="#menu-container">
		<ExpandMenuTransition
			><ul class="menu d-flex text-primary bg-default" v-if="isMenuOpen">
				<li v-for="item in menuItems" :key="item.name" class="text-primary">
					<RouterLink :to="item.path" @click="closeMenu">{{ item.name }}</RouterLink>
				</li>
			</ul></ExpandMenuTransition
		>
	</Teleport>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import LogoText from '../icons/LogoText.vue'
	import GSymbol from '../icons/GSymbol.vue'
	import HamburgerIcon from '../icons/HamburgerIcon.vue'
	import ExpandMenuTransition from '../transitions/ExpandMenuTransition.vue'

	interface MenuItem {
		name: string
		path: string
	}

	const isMenuOpen = ref(false)
	const toggleMenu = () => {
		isMenuOpen.value = !isMenuOpen.value
		console.log(isMenuOpen.value)
	}
	const closeMenu = () => {
		isMenuOpen.value = false
	}
	const menuItems: MenuItem[] = [{ name: '關於悄悄龍', path: '/about' }]
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
		align-items: center;
	}
	.nav-right > a {
		font-size: 16px;
		height: 42px;
		padding: 0 13px;
	}
	.nav-right > a:not(:last-child) {
		margin-right: 20px;
	}
	.nav-right > a > span:not(:last-child) {
		margin-right: 8px;
	}
	button {
		font-size: 16px;
		height: 42px;
		width: 42px;
	}
	.menu {
		position: absolute;
		inset: 0;
		width: 100%;
		padding-top: 60px;
		flex-direction: column;
		align-items: center;
		z-index: 50;
	}
	.menu li {
		padding: 20px 0;
	}
</style>
