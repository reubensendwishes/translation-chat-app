<template>
	<Transition name="expand-menu">
		<slot></slot>
	</Transition>
</template>

<style scoped>
	.expand-menu-enter-from,
	.expand-menu-leave-to {
		opacity: 0;
		transform: translateY(-100%);
	}
	.expand-menu-enter-to,
	.expand-menu-leave-from {
		opacity: 1;
		transform: translateY(0);
	}
	.expand-menu-enter-active,
	.expand-menu-leave-active {
		transition:
			opacity 0.8s ease,
			transform 0.8s ease;
	}
</style>
