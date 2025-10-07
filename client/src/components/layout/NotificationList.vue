<!-- eslint-disable-next-line vue/valid-attribute-name -->
<template>
	<div class="notification-list d-flex">
		<div
			class="notification-item d-flex"
			v-for="request in receivedRequests"
			:key="request.requestId"
		>
			<img
				class="notification-image pill"
				:src="getAvatarUrl(request.requesterData.avatar)"
				:alt="request.requesterData.username"
			/>
			<div class="notification-text-wrapper d-flex">
				<div class="notification-text">
					{{ request.requesterData.username + t('navbar.notification.friendRequest') }}
				</div>
				<button
					@click="acceptFriendRequest(request.requestId)"
					type="button"
					class="text-secondary btn"
				>
					{{ t('common.accept') }}
				</button>
				<button
					@click="refuseFriendRequest(request.requestId)"
					type="button"
					class="text-secondary btn"
				>
					{{ t('common.refuse') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import { useFriend } from '@/composables/useFriend'
	import { useFriendStore } from '@/stores/FriendStore'
	import { getAvatarUrl } from '@/utils/helpers'

	// stores
	const friendStore = useFriendStore()
	const { receivedRequests } = storeToRefs(friendStore)

	// composables
	const { acceptFriendRequest, refuseFriendRequest } = useFriend()

	// vue-i18n
	const { t } = useI18n()
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
	.btn {
		padding: 4px 8px;
		border-bottom: 1px var(--color-text-muted) solid;
		font-size: 13px;
	}
	.btn:hover {
		color: var(--color-secondary-darken);
		border-bottom: 1px var(--color-secondary-darken) solid;
	}
</style>
