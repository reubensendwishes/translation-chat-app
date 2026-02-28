<!-- eslint-disable-next-line vue/valid-attribute-name -->
<template>
	<div class="notification-list d-flex">
		<div
			class="notification-item d-flex"
			v-for="request in receivedRequests"
			:key="request.requestId"
		>
			<div class="notification-image pill">{{ request.requesterData.avatar }}</div>
			<div class="notification-text-wrapper d-flex">
				<div class="notification-text">
					{{ request.requesterData.username + '向你發出好友邀請' }}
				</div>
				<button
					@click="acceptFriendRequest(request)"
					type="button"
					class="friendship-btn text-secondary btn"
				>
					接受
				</button>
				<button
					@click="refuseFriendRequest(request)"
					type="button"
					class="friendship-btn text-secondary btn"
				>
					拒絕
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useFriend } from '@/composables/useFriend'
	import { useFriendStore } from '@/stores/FriendStore'
	import { storeToRefs } from 'pinia'

	const friendStore = useFriendStore()
	const { receivedRequests } = storeToRefs(friendStore)
	const { acceptFriendRequest, refuseFriendRequest } = useFriend()
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
	.notification-text-wrapper {
		flex-wrap: wrap;
		justify-content: center;
		text-align: center;
		row-gap: 6px;
		column-gap: 10px;
	}
	.notification-text {
		margin-top: 8px;
		flex: 1 0 100%;
	}
	.friendship-btn {
		padding: 4px 8px;
		border-bottom: 1px var(--color-text-muted) solid;
		font-size: 13px;
	}
	.friendship-btn:hover {
		color: var(--color-secondary-darken);
		border-bottom: 1px var(--color-secondary-darken) solid;
	}
</style>
