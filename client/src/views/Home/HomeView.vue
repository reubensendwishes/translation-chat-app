<template>
	<div>
		<MarketingCarousel
			class="text-inverse"
			:images="images"
			width="100%"
			:height="carouselHeight"
			min-height="calc(100vw * 7 / 12)"
			:interval="4000"
			:font-size="carouselFontSize"
		/>
		<div class="section-wrapper">
			<AboutSummary />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from 'vue'
	import MarketingCarousel from '@/components/ui/marketing/MarketingCarousel.vue'
	import type { CarouselImage } from '@/components/ui/marketing/MarketingCarousel.vue'
	import carouselImg1 from '@/assets/carousel-img1.jpg'
	import carouselImg2 from '@/assets/carousel-img2.jpg'
	import { debounce } from '@/utils/helpers'
	import AboutSummary from './AboutSummary.vue'

	const images = ref<CarouselImage[]>([
		{
			name: 'cloud-1',
			src: carouselImg1,
			descriptions: ['綿綿思念凝結天上雲，', '乘風過海為撫佳人心。'],
		},
		{
			name: 'cloud-2',
			src: carouselImg2,
			descriptions: ['佔位符佔位符佔位符，', '佔位符佔位符佔位符。'],
		},
	])
	const carouselHeight = ref('500px')
	const carouselFontSize = ref('16px')
	const updateCarouselStyle = () => {
		const width = window.innerWidth
		if (width < 744) {
			carouselHeight.value = '500px'
			carouselFontSize.value = '20px'
		} else if (width < 1280) {
			carouselHeight.value = `600px`
			carouselFontSize.value = '20px'
		} else {
			carouselHeight.value = `700px`
			carouselFontSize.value = '32px'
		}
	}

	const debounceUpdateCarousel = debounce(updateCarouselStyle, 500)

	onMounted(() => {
		updateCarouselStyle()
		window.addEventListener('resize', debounceUpdateCarousel)
	})
	onUnmounted(() => {
		window.removeEventListener('resize', debounceUpdateCarousel)
	})
</script>

<style scoped>
	.section-wrapper {
		padding: 20px 20px;
	}
</style>
