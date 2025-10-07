<template>
	<component :is="layout">
		<RouterView />
	</component>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { RouterView, useRoute } from 'vue-router'
	import type { RouteLocationNormalizedLoaded } from 'vue-router'
	import { layouts } from './types'

	const route: RouteLocationNormalizedLoaded = useRoute()
	const layout = computed(() => {
		return layouts[route.meta.layout ?? 'TopNavLayout']
	})
</script>
