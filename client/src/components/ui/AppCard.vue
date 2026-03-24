<template>
	<div class="card d-flex" :style="{ gap: cardInnerGap }">
		<img
			v-if="cardData.imageUrl"
			:src="cardData.imageUrl"
			:alt="cardData.title"
			:style="{ width: imageWidth }"
		/>
		<div class="title" :style="{ fontSize: titleSize }">{{ cardData.title }}</div>
		<div class="description" :style="{ fontSize: descriptionSize }">
			{{ cardData.description }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { CardData } from '@/types'

	// types
	type Props = {
		cardData: CardData
		imageWidth: string
		titleSize: string
		descriptionSize: string
		cardInnerGap: string
	}

	// props
	const { cardData, imageWidth, titleSize, descriptionSize, cardInnerGap } = defineProps<Props>()
</script>

<style scoped>
	.card {
		flex-direction: column;
		align-items: center;
		border-radius: 20px;
		border: 1px var(--color-text-primary) solid;
		padding: 20px;
	}
</style>
