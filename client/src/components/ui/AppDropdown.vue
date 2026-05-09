<template>
	<div class="dropdown">
		<div :class="placementClass" class="dropdown-menu-wrapper">
			<FadeTranslate :transition-direction="transitionDirection">
				<ul v-show="isDropdownOpen" class="dropdown-menu bg-default d-flex">
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
		</div>
		<button
			v-bind="$attrs"
			class="btn text-primary"
			type="button"
			@click="isDropdownOpen = !isDropdownOpen"
			@blur="isDropdownOpen = false"
		>
			<slot name="button-name"></slot>
		</button>
	</div>
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

	// options
	defineOptions({
		inheritAttrs: false,
	})

	const placementClass = computed(() => {
		return 'placement-' + placement
	})
	const isDropdownOpen = ref(false)
</script>

<style>
	.dropdown {
		position: relative;
		font-size: 18px;
	}
	.dropdown-menu-wrapper {
		position: absolute;
		overflow: hidden;
	}
	.dropdown-menu-wrapper.placement-top {
		bottom: 100%;
		transform: translateX(-50%);
		left: 50%;
	}
	.dropdown-menu-wrapper.placement-left {
		right: 100%;
		transform: translateY(-50%);
		top: 50%;
	}
	.dropdown-menu-wrapper.placement-bottom {
		top: 100%;
		transform: translateX(-50%);
		left: 50%;
	}
	.dropdown-menu-wrapper.placement-right {
		left: 100%;
		transform: translateY(-50%);
		top: 50%;
	}
	.dropdown-menu {
		flex-direction: column;
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
