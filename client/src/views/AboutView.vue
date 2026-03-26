<template>
	<div class="about-page">
		<div class="banner-wrapper d-flex">
			<ul class="social-list text-primary">
				<li class="social-item" v-for="(item, index) in socialItems" :key="index">
					<a :href="item.path">
						<component :is="item.name" icon-height="20px" />
					</a>
				</li>
			</ul>
			<div class="banner">
				<img :src="bannerImg" alt="banner" />
				<h2 class="page-title text-inverse">{{ t('about.title') }}</h2>
			</div>
		</div>
		<div class="content text-primary">
			<div class="content-header">
				<h3 class="content-title">{{ t('about.contentTitle') }}</h3>
				<p class="content-description">{{ t('about.description') }}</p>
			</div>
			<div class="content-body">
				<div class="feature d-flex">
					<AppCard
						v-for="(item, index) in featureItems"
						:key="index"
						:card-data="item"
						image-width="40%"
						title-size="20px"
						description-size="16px"
						card-inner-gap="10px"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useI18n } from 'vue-i18n'

	import bannerImg from '@/assets/about-banner.jpg'
	import FacebookIcon from '@/components/icons/FacebookIcon.vue'
	import InstagramIcon from '@/components/icons/InstagramIcon.vue'
	import YoutubeIcon from '@/components/icons/YoutubeIcon.vue'
	import AppCard from '@/components/ui/AppCard.vue'
	import type { CardData } from '@/types'
	import aboutCardImg1 from '@/assets/about-card-img1.svg'
	import aboutCardImg2 from '@/assets/about-card-img2.svg'
	import aboutCardImg3 from '@/assets/about-card-img3.svg'

	// vue-i18n
	const { t } = useI18n()

	const socialItems = [
		{ name: InstagramIcon, path: '' },
		{ name: FacebookIcon, path: '' },
		{ name: YoutubeIcon, path: '' },
	]

	const featureItems = computed<CardData[]>(() => {
		return [
			{
				imageUrl: aboutCardImg1,
				title: t('about.feature1.title'),
				description: t('about.feature1.description'),
			},
			{
				imageUrl: aboutCardImg2,
				title: t('about.feature2.title'),
				description: t('about.feature2.description'),
			},
			{
				imageUrl: aboutCardImg3,
				title: t('about.feature3.title'),
				description: t('about.feature3.description'),
			},
		]
	})
</script>

<style scoped>
	.about-page {
		padding: 0 20px;
	}
	.banner-wrapper {
		gap: 20px;
		align-items: end;
		margin-bottom: 20px;
	}
	.social-item:not(:last-child) {
		margin-bottom: 10px;
	}
	.banner {
		height: 400px;
		flex-grow: 1;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
	.page-title,
	.banner img {
		grid-column: 1;
		grid-row: 1;
	}
	.page-title {
		font-size: 30px;
		align-self: center;
		justify-self: center;
	}
	.banner img {
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: cover;
	}
	.content {
		width: min(393px, 100%);
		margin: 0 auto 20px;
	}

	.content-header {
		margin-bottom: 20px;
	}
	.content-title {
		font-size: 24px;
		margin-bottom: 10px;
		text-align: center;
	}

	.feature {
		flex-wrap: wrap;
		column-gap: 1%;
		row-gap: 10px;
		justify-content: center;
	}
	.feature .card {
		flex-basis: 100%;
	}
	@media (min-width: 768px) {
		.content {
			width: 80%;
		}
		.feature .card {
			flex-basis: 32%;
		}
	}
</style>
