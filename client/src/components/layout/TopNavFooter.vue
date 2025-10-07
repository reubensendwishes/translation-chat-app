<template>
	<footer class="text-muted bg-inverse d-flex">
		<div class="footer-logo">
			<LogoText logo-text-color="inverse" logo-bg-color="transparent" logo-height="44px" />
		</div>
		<div class="footer-wrapper">
			<ul class="footer-info d-flex">
				<li v-for="item in infoItems" :key="item.key">
					<span class="info-key shadow-muted">{{ item.key }}</span>
					<span class="info-value">{{ item.value }}</span>
				</li>
			</ul>
			<small class="copyright">{{
				`Copyright © 2025 ${t('website.name')} All Rights Reserved.`
			}}</small>
		</div>
		<div class="footer-social d-flex">
			<p class="footer-social-title">{{ t('footer.followUs') }}</p>
			<ul class="footer-social-links d-flex">
				<li v-for="item in linkItems" :key="item.name">
					<a href="#" :aria-label="item.name"
						><Component :is="item.icon" class="text-inverse" />
					</a>
				</li>
			</ul>
		</div>
	</footer>
</template>
<script setup lang="ts">
	import { computed, type Component } from 'vue'
	import { useI18n } from 'vue-i18n'

	import LogoText from '@/components/icons/LogoText.vue'
	import FacebookIcon from '@/components/icons/FacebookIcon.vue'
	import InstagramIcon from '@/components/icons/InstagramIcon.vue'
	import YoutubeIcon from '@/components/icons/YoutubeIcon.vue'

	// types
	type LinkName = 'facebook' | 'instagram' | 'youtube'
	type LinkItem = {
		name: LinkName
		icon: Component
	}

	// vue-i18n
	const { t } = useI18n()

	const infoItems = computed(() => [
		{ key: t('footer.phone'), value: '+886400000000' },
		{ key: t('footer.fax'), value: '+886400000000' },
		{ key: t('footer.email'), value: '**@**.***' },
		{ key: t('footer.address.label'), value: t('footer.address.value') },
	])

	const linkItems: LinkItem[] = [
		{ name: 'facebook', icon: FacebookIcon },
		{ name: 'instagram', icon: InstagramIcon },
		{ name: 'youtube', icon: YoutubeIcon },
	]
</script>
<style scoped>
	footer {
		flex-direction: column;
		align-items: start;
		gap: 20px;
		padding: 30px 20px;
	}
	.footer-logo {
		text-align: center;
	}
	.footer-info {
		flex-direction: column;
		gap: 6px;
		margin-bottom: 10px;
	}
	.info-key {
		padding-right: 9px;
		margin-right: 8px;
		position: relative;
	}
	.info-key::after {
		content: '';
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
		width: 1px;
		height: 10px;
	}
	.footer-social {
		gap: 10px;
	}
	.footer-social-links {
		gap: 20px;
	}
	@media (min-width: 744px) {
		footer {
			flex-direction: row;
			flex-wrap: wrap;
		}
		.footer-logo {
			flex: 1 1 100%;
		}
		.footer-wrapper {
			flex: 1;
		}
		.footer-social {
			flex: 1;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
