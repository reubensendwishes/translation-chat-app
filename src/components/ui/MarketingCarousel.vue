<template>
	<div class="carousel-wrapper">
		<ul
			class="carousel"
			:style="`--carousel-width:${width};--carousel-height:${height};--carousel-interval:${interval / 2}ms;--carousel-min-height:${minHeight};--carousel-font-size:${fontSize}`"
		>
			<li
				v-for="(image, index) in normalizedImages"
				:key="index"
				class="carousel-item"
				:class="normalizedImages.length > 1 ? itemClass(index) : undefined"
			>
				<img :src="image.src" :alt="image.name" />
				<p>
					{{ image.descriptions[0] }}
					<template v-if="image.descriptions[1]"
						><br />
						<ZhSpaces :spaces-count="2" />{{ image.descriptions[1] }}</template
					>
				</p>
			</li>
		</ul>
		<div class="carousel-progress">
			<span class="text-primary">{{ (currentIndex % images.length) + 1 }}</span>
			<svg width="60" height="2">
				<rect class="text-inverse" fill="currentColor" x="0" y="0" width="60" height="2" />
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
			<span>{{ images.length }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed, useTemplateRef } from 'vue'
	import { gsap } from 'gsap'
	import ZhSpaces from './ZhSpaces.vue'
	import type { Image } from '@/types'
	export interface CarouselImage extends Image {
		descriptions: [string] | [string, string]
	}
	interface Props {
		images: CarouselImage[]
		width?: number | string
		height?: number | string
		minHeight?: number | string
		interval?: number
		fontSize?: string
	}
	const {
		images,
		width = '100%',
		height = '500px',
		minHeight = '500px',
		interval = 1000,
		fontSize = '20px',
	} = defineProps<Props>()

	const normalizedImages = computed(() => {
		if (images.length === 2) {
			return [...images, ...images]
		}
		return images
	})

	const currentIndex = ref<number>(0)
	const prevIndex = computed(() => {
		const imageLength = normalizedImages.value.length
		return (currentIndex.value - 1 + imageLength) % imageLength
	})
	const itemClass = (index: number) => {
		return { active: index === currentIndex.value, prev: index === prevIndex.value }
	}
	const progressRef = useTemplateRef('progress')
	let progressTween: GSAPTween | null = null
	let timer: ReturnType<typeof setInterval> | null = null

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
	const next = () => {
		currentIndex.value = (currentIndex.value + 1) % normalizedImages.value.length
		resetAndStartProgress()
	}

	const stopAutoPlay = () => {
		if (timer !== null) {
			clearInterval(timer)
			timer = null
		}
	}
	const startAutoPlay = () => {
		stopAutoPlay()
		timer = window.setInterval(next, interval)
	}

	onMounted(() => {
		startAutoPlay()
	})
	onUnmounted(() => {
		stopAutoPlay()
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
		font-size: var(--carousel-font-size);
	}
	li {
		opacity: 0;
		transition: opacity var(--carousel-interval) linear;
		grid-column: 1 / 2;
		grid-row: 1 / 2;
		position: relative;
		line-height: 0;
	}
	li.active {
		z-index: 2;
		opacity: 1;
	}
	li.prev {
		z-index: 1;
		opacity: 1;
	}
	li img {
		object-position: top;
		object-fit: cover;
		width: var(--carousel-width);
		height: var(--carousel-height);
		min-height: var(--carousel-min-height);
	}
	li.active img {
		animation: scale-image var(--carousel-interval) ease var(--carousel-interval) 1 forwards;
	}
	li.prev img {
		transform: scale(1.2);
	}
	p {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		writing-mode: vertical-lr;
		line-height: 1.1;
	}
	.carousel-progress {
		position: absolute;
		left: 50%;
		bottom: 5%;
		transform: translateX(-50%);
		z-index: 3;
		display: flex;
		align-items: center;
		width: 120px;
		justify-content: space-between;
	}
</style>
