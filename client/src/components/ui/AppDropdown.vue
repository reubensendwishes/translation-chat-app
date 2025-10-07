<template>
	<button
		@click="isDropdownOpen = !isDropdownOpen"
		@blur="isDropdownOpen = false"
		class="btn text-primary"
		type="button"
	>
		<slot name="button"></slot>
		<FadeTranslate :transition-direction="transitionDirection">
			<ul
				v-show="isDropdownOpen"
				:style="{ [reference]: '100%' }"
				class="dropdown-menu bg-default d-flex"
			>
				<li
					@click="$emit('selectItem', dropdownItem.value)"
					v-for="(dropdownItem, index) in dropdownItems"
					:key="index"
					class="dropdown-item text-muted"
				>
					{{ dropdownItem.text }}
				</li>
			</ul>
		</FadeTranslate>
	</button>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'

	import type { DropdownItem } from '@/types'
	import FadeTranslate from '../transitions/FadeTranslate.vue'

	// types
	type Props = {
		dropdownItems: DropdownItem[]
		placement: 'top' | 'bottom' | 'right' | 'left'
		transitionDirection?: 'up' | 'down' | 'left' | 'right'
	}
	type Emits = {
		selectItem: [value: string]
	}

	// props
	const {
		dropdownItems,
		placement = 'bottom',
		transitionDirection = 'down',
	} = defineProps<Props>()

	// emits
	defineEmits<Emits>()

	const reference = computed(() => {
		switch (placement) {
			case 'bottom':
				return 'top'
			case 'top':
				return 'bottom'
			case 'right':
				return 'left'
			case 'left':
				return 'right'
			default:
				return 'top'
		}
	})

	const isDropdownOpen = ref(false)
</script>

<style scoped>
	.btn {
		position: relative;
	}
	.dropdown-menu {
		flex-direction: column;
		position: absolute;
		border: solid 1px var(--color-text-primary);
		padding: 10px 0;
		gap: 10px;
		width: 100%;
		min-width: max-content;
		border-radius: 10px;
	}
	.dropdown-item {
		padding: 0 10px;
		line-height: 1;
	}
	.dropdown-item:hover {
		color: var(--color-text-primary);
	}
</style>
