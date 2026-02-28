<template>
	<SummarySection
		:title="aboutSummary.title"
		:subtitle="aboutSummary.subtitle"
		:description="aboutSummary.description"
		:text-position="aboutSummary.textPosition"
	>
		<img class="about-img1" :src="aboutImgs[0].src" :alt="aboutImgs[0].name" />
		<img class="about-img2" :src="aboutImgs[1].src" :alt="aboutImgs[1].name" />
	</SummarySection>
</template>

<script setup lang="ts">
	import SummarySection, { type SummaryProps } from '@/views/home/SummarySection.vue'
	import type { Image } from '@/types'
	import aboutImg1 from '@/assets/about-img1.jpg'
	import aboutImg2 from '@/assets/about-img2.jpg'

	const aboutSummary: SummaryProps = {
		title: '關於悄悄龍',
		subtitle: '傳說中的龍',
		description: '呱'.repeat(70),
		textPosition: 'left',
	}
	const aboutImgs: Image[] = [
		{
			name: 'speaking',
			src: aboutImg1,
		},
		{
			name: 'listen',
			src: aboutImg2,
		},
	]
</script>

<style scoped>
	.about-img1 {
		width: 100%;
		padding-right: 30px;
	}
	.about-img2 {
		position: absolute;
		width: 30%;
		top: 30%;
		right: 0;
	}
</style>
