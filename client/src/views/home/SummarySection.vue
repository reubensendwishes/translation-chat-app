<template>
	<section class="summary d-flex">
		<div class="summary-content" :style="{ order: textPosition === 'right' ? 1 : 0 }">
			<div :class="locale === 'zh-TW' && 'vertical'" class="summary-header d-flex">
				<h2 class="summary-title text-primary">{{ title }}</h2>
				<h3 class="summary-subtitle text-secondary">
					{{ subtitle }}
				</h3>
			</div>
			<p class="summary-description text-muted">{{ description }}</p>
			<RouterLink to="/about" class="btn text-muted">
				<span>{{ t('home.summary.learnMore') }}</span>
				<svg width="60" height="20" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M2 11 L58 11 L48 6 "
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						fill="none"
					/>
				</svg>
			</RouterLink>
		</div>
		<div class="summary-extra"><slot></slot></div>
	</section>
</template>

<script setup lang="ts">
	import { useI18n } from 'vue-i18n'

	// types
	type Props = {
		title: string
		subtitle: string
		description: string
		textPosition: 'left' | 'right'
	}

	// props
	const { title, subtitle, description, textPosition = 'left' } = defineProps<Props>()

	// vue-i18n
	const { t, locale } = useI18n()
</script>

<style scoped>
	.summary {
		flex-direction: column;
	}
	.summary:not(:last-of-type) {
		margin-bottom: 30px;
	}
	.summary-content {
		margin-bottom: 20px;
		text-align: center;
	}
	.summary-header {
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	.summary-title {
		margin: 0;
		font-size: 35px;
	}
	.summary-subtitle {
		margin: 0;
		font-size: 20px;
	}
	.summary-description {
		margin-bottom: 40px;
	}
	.btn {
		padding: 12px;
		border: 1px var(--color-text-muted) solid;
		border-radius: 50rem;
		gap: 10px;
	}
	.summary-extra {
		position: relative;
		flex-basis: 0;
	}
	@media (min-width: 744px) {
		.summary {
			flex-direction: row;
		}
		.summary-content {
			width: 30%;
			max-width: 400px;
			margin-right: 20px;
			text-align: start;
		}
		.summary-header {
			align-items: start;
			margin-bottom: 60px;
		}
		.summary-header.vertical {
			flex-direction: row;
			align-items: center;
		}
		.vertical .summary-title,
		.vertical .summary-subtitle {
			writing-mode: vertical-lr;
		}
		.summary-extra {
			flex-grow: 1;
		}
	}
</style>
