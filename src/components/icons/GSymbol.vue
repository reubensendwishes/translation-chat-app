<template>
	<span
		:style="{
			fontStyle,
			'--font-wght': weight,
		}"
		class="material-symbols-rounded"
	>
		<slot></slot>
	</span>
</template>

<script setup lang="ts">
	interface Props {
		fontStyle?: 'normal' | 'italic' | 'oblique'
		weight?: number | string
	}
	const { fontStyle = undefined, weight = 400 } = defineProps<Props>()
</script>

<style scoped>
	.material-symbols-rounded {
		--font-wght: 400;
		font-variation-settings: 'wght' var(--font-wght);
		line-height: 1;
		user-select: none;
	}
</style>
