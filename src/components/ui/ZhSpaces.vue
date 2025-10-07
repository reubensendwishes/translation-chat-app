<template>
	<span class="text-transparent">{{ '空'.repeat(spacesCount) }}</span>
</template>

<script setup lang="ts">
	interface Props {
		spacesCount?: number
	}
	const { spacesCount = 1 } = defineProps<Props>()
</script>
