<template>
	<div class="summary">
		<div class="summary-text" :style="{ order: textPosition === 'right' ? 1 : 0 }">
			<div class="summary-header">
				<h2 class="summary-title text-primary">{{ title }}</h2>
				<h3 class="summary-subtitle text-secondary">
					<ZhSpaces class="show-md" :spaces-count="2" />{{ subtitle }}
				</h3>
			</div>
			<p class="summary-description text-muted">{{ description }}</p>
			<RouterLink to="/about" class="btn summary-btn text-muted"
				>了解更多<svg width="60" height="20" xmlns="http://www.w3.org/2000/svg">
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
	</div>
</template>

<script setup lang="ts">
	import ZhSpaces from './ZhSpaces.vue'

	export interface SummaryProps {
		title: string
		subtitle: string
		description: string
		textPosition: 'left' | 'right'
	}

	const { title, subtitle, description, textPosition = 'left' } = defineProps<SummaryProps>()
</script>

<style scoped>
	.summary {
		display: flex;
		flex-direction: column;
	}
	.summary:not(:last-of-type) {
		margin-bottom: 30px;
	}
	.summary-text {
		margin-bottom: 20px;
		text-align: center;
	}
	.summary-header {
		display: flex;
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
	.summary-btn {
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
		.summary-text {
			width: 30%;
			max-width: 400px;
			margin-right: 20px;
			text-align: start;
		}
		.summary-header {
			flex-direction: row;
			align-items: start;
			margin-bottom: 80px;
		}
		.summary-title,
		.summary-subtitle {
			writing-mode: vertical-lr;
		}
		.summary-extra {
			flex-grow: 1;
		}
	}
</style>
