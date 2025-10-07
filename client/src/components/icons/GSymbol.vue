<template>
	<span
		:style="{
			'font-variation-settings': `'FILL' ${fill},'wght' ${wght}`,
			'font-size': fontSize,
		}"
		class="material-symbols-rounded"
	>
		<slot></slot>
	</span>
</template>

<script setup lang="ts">
	// types
	interface Props {
		fontSize?: string
		wght?: number | string
		fill?: 0 | 1
	}

	// props
	const { fontSize = '16px', wght = 400, fill = 0 } = defineProps<Props>()
</script>

<style scoped>
	.material-symbols-rounded {
		line-height: 1;
		user-select: none;
	}
</style>
