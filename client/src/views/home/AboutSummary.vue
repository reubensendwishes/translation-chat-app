<template>
	<SummarySection
		:title="t('home.aboutSummary.title')"
		:subtitle="t('home.aboutSummary.subtitle')"
		:description="t('home.aboutSummary.description')"
		:text-position="'left'"
	>
		<img class="about-img1" :src="aboutImgs[0].src" :alt="aboutImgs[0].name" />
		<img class="about-img2" :src="aboutImgs[1].src" :alt="aboutImgs[1].name" />
	</SummarySection>
</template>

<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	import SummarySection from '@/views/home/SummarySection.vue'
	import type { Image } from '@/types'
	import aboutImg1 from '@/assets/about-img1.jpg'
	import aboutImg2 from '@/assets/about-img2.jpg'

	// vue-i18n
	const { t } = useI18n()

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
