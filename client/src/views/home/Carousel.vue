<template>
	<div class="carousel-wrapper">
		<ul
			class="carousel"
			:style="{
				'--carousel-interval': `${interval / 2}ms`,
				'font-size': fontSize,
			}"
		>
			<li
				v-for="(image, index) in images"
				:key="index"
				class="carousel-item"
				:class="images.length > 1 && itemClass(index)"
			>
				<img :src="image.src" :alt="image.name" :style="{ width, height }" />
				<div class="carousel-text-group">
					<p :class="locale === 'zh-TW' && 'nospace'" class="carousel-text">
						{{ t(`home.slide${index + 1}.verse1`) }}
					</p>
					<p class="carousel-text">
						{{ t(`home.slide${index + 1}.verse2`) }}
					</p>
					<p class="carousel-text">
						{{ t(`home.slide${index + 1}.verse3`) }}
					</p>
					<div class="carousel-text-bg text-transparent">
						{{
							t(`home.slide${index + 1}.verse1`) + t(`home.slide${index + 1}.verse2`)
						}}
					</div>
					<div class="carousel-text-bg"></div>
				</div>
			</li>
		</ul>
		<div class="carousel-progress d-flex">
			<span class="text-primary">{{ (currentIndex % images.length) + 1 }}</span>
			<svg width="60" height="2">
				<rect class="text-default" fill="currentColor" x="0" y="0" width="60" height="2" />
				<rect
					ref="progress"
					class="text-primary"
					fill="currentColor"
					x="0"
					y="0"
					width="0"
					height="2"
				/>
			</svg>
			<span class="text-default">{{ images.length }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
	import { gsap } from 'gsap'
	import { useI18n } from 'vue-i18n'

	import type { Image } from '@/types'

	// types
	type Props = {
		images: Image[]
		width?: number | string
		height?: number | string
		interval?: number
		fontSize?: string
	}

	// props
	const {
		images,
		width = '100%',
		height = '500px',
		interval = 6000,
		fontSize = '20px',
	} = defineProps<Props>()

	// vue-i18n
	const { t, locale } = useI18n({ useScope: 'global' })

	const itemClass = (index: number) => {
		return {
			active: index === currentIndex.value,
			prev: index === prevIndex.value,
			next: index === nextIndex.value,
			fade: index === fadeIndex.value,
		}
	}
	const progressRef = useTemplateRef('progress')
	let progressTween: GSAPTween | null = null
	const resetAndStartProgress = () => {
		if (!progressRef.value) return
		if (progressTween) {
			progressTween.kill()
		}
		gsap.set(progressRef.value, { attr: { width: 0 } })

		progressTween = gsap.to(progressRef.value, {
			duration: interval / 1000,
			attr: { width: 60 },
			ease: 'none',
		})
	}
	const prevIndex = ref(images.length - 1)
	const currentIndex = ref(0)
	const fadeIndex = ref(0)
	const nextIndex = ref(-1)
	let animationPhase = 'phase1'
	let start: number | undefined
	const playCarousel = (timestamp: number) => {
		if (start === undefined) {
			start = timestamp
			resetAndStartProgress()
		}
		const elapsed = timestamp - start

		if (elapsed >= interval && animationPhase === 'phase1') {
			prevIndex.value = currentIndex.value
			currentIndex.value = (currentIndex.value + 1) % images.length
			nextIndex.value = -1
			animationPhase = 'phase2'
			start = timestamp
			resetAndStartProgress()
		} else if (elapsed >= interval / 2 && animationPhase === 'phase2') {
			fadeIndex.value = currentIndex.value
			animationPhase = 'phase3'
		} else if (elapsed >= (interval * 7) / 8 && animationPhase === 'phase3') {
			prevIndex.value = -1
			nextIndex.value = (currentIndex.value + 1) % images.length
			animationPhase = 'phase1'
		}
		requestAnimationFrame(playCarousel)
	}
	onMounted(() => {
		// startAutoPlay()
		requestAnimationFrame(playCarousel)
	})
	onUnmounted(() => {
		// stopAutoPlay()
		if (progressTween) {
			progressTween.revert()
		}
	})
</script>

<style scoped>
	@keyframes scale-image {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.2);
		}
	}
	.carousel-wrapper {
		position: relative;
	}
	.carousel {
		overflow: hidden;
		display: grid;
	}
	.carousel-item {
		opacity: 0;
		grid-column: 1 / 2;
		grid-row: 1 / 2;
		position: relative;
		line-height: 0;
	}
	.fade {
		transition: opacity var(--carousel-interval) linear;
	}
	.carousel-item.next {
		opacity: 1;
		z-index: -1;
	}
	.carousel-item.active {
		opacity: 1;
	}
	.carousel-item.prev {
		opacity: 0;
		z-index: 2;
	}
	.carousel-item img {
		object-position: top;
		object-fit: cover;
		width: var(--carousel-width);
		height: var(--carousel-height);
	}
	.carousel-item.active img {
		animation: scale-image var(--carousel-interval) ease var(--carousel-interval) 1 forwards;
	}
	.carousel-item.prev img {
		transform: scale(1.2);
	}
	.carousel-text-group {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		line-height: 1.5;
		display: grid;
		grid-template-columns: max-content max-content;
		grid-template-rows: 1fr 1fr;
		row-gap: 10px;
	}

	.carousel-text-bg,
	.carousel-text {
		justify-self: start;
		white-space: pre;
	}
	.carousel-text-bg {
		background-color: rgba(242, 242, 242, 0.1);
		backdrop-filter: blur(2px);
		z-index: -1;
	}
	.carousel-text-bg:first-of-type {
		grid-row: 1;
		grid-column: 1/3;
		padding: 0 0.45em;
	}
	.carousel-text-bg:last-of-type {
		grid-row: 2;
		grid-column: 2;
		justify-self: stretch;
		padding: 0 0.3em;
		margin-left: -0.3em;
	}
	.carousel-text-bg {
		border-radius: 10px;
	}
	.carousel-text:first-of-type {
		grid-row: 1;
		grid-column: 1;
		padding: 0 0.3em;
	}
	.carousel-text:first-of-type.nospace {
		padding-right: 0px;
	}
	.carousel-text:nth-of-type(2) {
		grid-row: 1;
		grid-column: 2;
	}
	.carousel-text:last-of-type {
		grid-row: 2;
		grid-column: 2;
		padding: 0 0.3em;
		margin-left: -0.3em;
	}

	.carousel-progress {
		position: absolute;
		left: 50%;
		bottom: 5%;
		transform: translateX(-50%);
		z-index: 3;
		align-items: center;
		width: 120px;
		justify-content: space-between;
	}
</style>
