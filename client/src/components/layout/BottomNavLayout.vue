<template>
	<slot></slot>
	<BottomNav @toggle-offcanvas="toggleNotificationPanel" />
	<OffCanvas v-if="isNotificationPanelOpen" @close-offcanvas="closeNotificationPanel">
		<template #header>通知</template>
		<NotificationList />
	</OffCanvas>
</template>

<script setup lang="ts">
	import BottomNav from '@/components/ui/bottomNav/BottomNav.vue'
	import OffCanvas from '../ui/OffCanvas.vue'
	import NotificationList from '../ui/NotificationList.vue'
	import { ref } from 'vue'

	const isNotificationPanelOpen = ref(false)
	const toggleNotificationPanel = () => {
		isNotificationPanelOpen.value = !isNotificationPanelOpen.value
	}
	const closeNotificationPanel = () => {
		isNotificationPanelOpen.value = false
	}
</script>
