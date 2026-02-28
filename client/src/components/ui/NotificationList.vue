<!-- eslint-disable-next-line vue/valid-attribute-name -->
<template>
	<div class="notification-list d-flex">
		<div
			class="notification-item d-flex"
			v-for="request in receivedRequests"
			:key="request.requestId"
		>
			<div class="notification-image pill">{{ request.requesterData.avatar }}</div>
			<div class="notification-text-wrapper">
				<div class="notifiaction-text">
					{{ request.requesterData.username + '發出好友邀請' }}
				</div>
				<button type="button">123</button>
				<button type="button">123</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useFriendStore } from '@/stores/FriendStore'
	import { storeToRefs } from 'pinia'

	const friendStore = useFriendStore()
	const { receivedRequests } = storeToRefs(friendStore)
</script>
<style scoped>
	.notification-list {
		flex-direction: column;
	}
	.notification-item {
		padding: 10px 12px;
		align-items: center;
		gap: 10px;
	}
	.notification-item:not(:last-of-type) {
		border-bottom: 1px var(--color-text-muted) solid;
	}
	.notification-image {
		background-color: red;
		width: 56px;
		height: 56px;
	}
	.notification-text {
		font-size: 17px;
	}
</style>
