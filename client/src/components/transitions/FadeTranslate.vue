<template>
	<Transition :name="transitionDirection">
		<slot></slot>
	</Transition>
</template>
<script setup lang="ts">
	// types
	type Props = {
		transitionDirection?: 'up' | 'down' | 'left' | 'right'
	}

	// props
	const { transitionDirection = 'down' } = defineProps<Props>()
</script>
<style scoped>
	.up-enter-from,
	.up-leave-to,
	.down-enter-from,
	.down-leave-to,
	.left-enter-from,
	.left-leave-to,
	.right-enter-from,
	.right-leave-to {
		opacity: 0;
	}
	.up-enter-from,
	.up-leave-to {
		transform: translateY(100%);
	}
	.down-enter-from,
	.down-leave-to {
		transform: translateY(-100%);
	}
	.left-enter-from,
	.left-leave-to {
		transform: translateX(100%);
	}
	.right-enter-from,
	.right-leave-to {
		transform: translateX(-100%);
	}
	.up-enter-to,
	.up-leave-from,
	.down-enter-to,
	.down-leave-from,
	.left-enter-to,
	.left-leave-from,
	.right-enter-to,
	.right-leave-from {
		opacity: 1;
	}
	.up-enter-to,
	.up-leave-from,
	.down-enter-to,
	.down-leave-from {
		transform: translateY(0);
	}
	.left-enter-to,
	.left-leave-from,
	.right-enter-to,
	.right-leave-from {
		transform: translateY(0);
	}
	.up-enter-active,
	.up-leave-active,
	.down-enter-active,
	.down-leave-active,
	.left-enter-active,
	.left-leave-active,
	.right-enter-active,
	.right-leave-active {
		transition:
			opacity 0.8s ease-out,
			transform 0.8s ease-out;
	}
</style>
