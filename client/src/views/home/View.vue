<template>
	<div>
		<HomeCarousel
			class="text-inverse"
			:images="images"
			width="100%"
			:height="carouselHeight"
			:interval="6000"
			:font-size="carouselFontSize"
		/>
		<div class="section-wrapper">
			<AboutSummary />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from 'vue'

	import HomeCarousel from '@/views/home/Carousel.vue'
	import type { Image } from '@/types'
	import carouselImg1 from '@/assets/carousel-img1.jpg'
	import carouselImg2 from '@/assets/carousel-img2.jpg'
	import { debounce } from '@/utils/helpers'
	import AboutSummary from '@/views/home/AboutSummary.vue'

	const images = ref<Image[]>([
		{
			name: 'cloud-1',
			src: carouselImg1,
		},
		{
			name: 'cloud-2',
			src: carouselImg2,
		},
	])
	const carouselHeight = ref('500px')
	const carouselFontSize = ref('16px')
	const updateCarouselStyle = () => {
		const width = window.innerWidth
		if (width < 744) {
			carouselHeight.value = 'calc(100dvh - 155px)'
			carouselFontSize.value = '20px'
		} else if (width < 1280) {
			carouselHeight.value = 'calc(100dvh - 60px)'
			carouselFontSize.value = '20px'
		} else {
			carouselHeight.value = 'calc(100dvh - 60px)'
			carouselFontSize.value = '28px'
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
