<template>
	<footer class="text-muted bg-inverse d-flex">
		<div class="footer-logo">
			<LogoText class="text-inverse" logo-height="44px" />
		</div>
		<div class="footer-wrapper">
			<ul class="footer-info d-flex">
				<li v-for="item in infoItems" :key="item.key">
					<span class="info-key shadow-muted">{{ item.key }}</span>
					<span class="info-value">{{ item.value }}</span>
				</li>
			</ul>
			<small class="copyright">Copyright © 2025 悄悄龍 All Rights Reserved.</small>
		</div>
		<div class="footer-social d-flex">
			<p class="footer-social-title">Follow Us</p>
			<ul class="footer-social-links d-flex">
				<li v-for="item in linkItems" :key="item.name">
					<a href="#" :aria-label="item.name"
						><component :is="item.icon" class="text-inverse"
					/></a>
				</li>
			</ul>
		</div>
	</footer>
</template>
<script setup lang="ts">
	import LogoText from '@/components/icons/LogoText.vue'
	import FacebookIcon from '@/components/icons/FacebookIcon.vue'
	import InstagramIcon from '@/components/icons/InstagramIcon.vue'
	import YoutubeIcon from '@/components/icons/YoutubeIcon.vue'
	import type { Component } from 'vue'
	type InfoKey = '電話' | '傳真' | '信箱' | '地址'
	interface InfoItem {
		key: InfoKey
		value: string
	}
	const infoItems: InfoItem[] = [
		{ key: '電話', value: '000000000' },
		{ key: '傳真', value: '000000000' },
		{ key: '信箱', value: 'vcismygoal@gmail.com' },
		{ key: '地址', value: 'OO市OO區OO路O段OOO巷O號' },
	]
	type LinkName = 'facebook' | 'instagram' | 'youtube'
	interface LinkItem {
		name: LinkName
		icon: Component
	}
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
