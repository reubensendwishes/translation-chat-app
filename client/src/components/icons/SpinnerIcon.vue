<template>
	<svg
		class="spinner"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 100 100"
		fill="currentColor"
		:style="{
			color: `var(--color-text-${spinnerColor})`,
			width: spinnerWidth,
			height: spinnerHeight,
		}"
	>
		<rect
			v-for="n in 8"
			:key="n"
			class="rect-fill"
			width="28"
			height="10"
			:transform="`rotate(${45 * (n - 1) - 90} 50 50)`"
			:opacity="(n - 1) / 8"
			rx="5"
			ry="5"
			x="67"
			y="45"
		></rect>
	</svg>
</template>
<script setup lang="ts">
	// types
	type Props = {
		spinnerColor?: 'primary' | 'inverse'
		spinnerWidth?: string
		spinnerHeight?: string
	}

	// props
	const {
		spinnerColor = 'primary',
		spinnerWidth = '16px',
		spinnerHeight = '16px',
	} = defineProps<Props>()
</script>
<style scoped>
	.spinner {
		animation: spin 1s steps(8) infinite;
	}
	@keyframes spin {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}
</style>
