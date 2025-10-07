<template>
	<ProfileInfo :profile-data="profileData" :profile-username="profileUsername">
		<AppDropdown
			v-if="hasReceivedRequest"
			@select-item="handleFriendRequest"
			:dropdown-items="responses"
			placement="bottom"
			transition-direction="down"
			class="text-inverse bg-inverse"
		>
			<template #button>{{ t('profile.receivedRequest') }}</template>
		</AppDropdown>
		<div v-else-if="hasSentRequest" class="badge text-inverse bg-inverse">
			{{ t('profile.requestSent') }}
		</div>
		<AppDropdown
			v-else-if="isFriend"
			@select-item="handleFriendAction"
			:dropdown-items="friendActions"
			placement="bottom"
			transition-direction="down"
			class="text-inverse bg-inverse"
		>
			<template #button>{{ t('profile.friend') }}</template>
		</AppDropdown>
		<button
			type="button"
			v-else
			@click="handleSendFriendRequest"
			class="btn text-inverse bg-inverse"
		>
			{{ t('profile.addFriend') }}
		</button>
	</ProfileInfo>
	<PostsPanel
		default-tab="all"
		:post-tabs="postTabs"
		:post-api-url="postApiUrl"
		:profile-username="profileUsername"
		:profile-avatar="profileData?.avatar ?? ''"
	/>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import type { ProfileData, PostTab } from '@/types'
	import { useFriendStore } from '@/stores/FriendStore'
	import { useFriend } from '@/composables/useFriend'
	import PostsPanel from '@/views/profile/PostsPanel.vue'
	import ProfileInfo from '@/views/profile/ProfileInfo.vue'
	import AppDropdown from '@/components/ui/AppDropdown.vue'

	// types
	type Props = {
		profileData: ProfileData | null
		profileUsername: string
	}

	// props
	const { profileData, profileUsername } = defineProps<Props>()

	// stores
	const friendStore = useFriendStore()
	const { friends, sentRequests, receivedRequests } = storeToRefs(friendStore)

	// composables
	const { sendFriendRequest, acceptFriendRequest, refuseFriendRequest } = useFriend()

	// vue-i18n
	const { t } = useI18n()

	const isFriend = computed(() => {
		if (!profileData) {
			return false
		}
		return friends.value.some((friend) => friend.friendData._id === profileData.userId)
	})
	const hasSentRequest = computed(() => {
		if (!profileData) {
			return false
		}
		return sentRequests.value.some((request) => request.recipientId === profileData.userId)
	})

	const handleSendFriendRequest = async () => {
		if (!profileData) return
		const result = await sendFriendRequest(profileData.userId)
		if (result?.success) {
		}
	}

	const postTabs = ref<PostTab[]>([{ name: 'all', icon: 'post' }])
	const postApiUrl = { all: `/api/posts/users/${profileUsername}` }

	const hasReceivedRequest = computed(() => {
		return receivedRequests.value.some((request) => {
			return request.requesterData._id === profileData?.userId
		})
	})

	const responses = ref([
		{ text: t('common.accept'), value: 'accept' },
		{ text: t('common.refuse'), value: 'refuse' },
	])

	const handleFriendRequest = (value: string) => {
		const requestId = receivedRequests.value.find((request) => {
			return request.requesterData._id === profileData?.userId
		})?.requestId
		if (!requestId) return
		if (value === 'accept') {
			acceptFriendRequest(requestId)
		} else {
			refuseFriendRequest(requestId)
		}
	}

	const friendActions = ref([{ text: t('profile.deleteFriend'), value: 'delete' }])

	const handleFriendAction = (value: string) => {
		const requestId = friends.value.find((request) => {
			return request.friendData._id === profileData?.userId
		})?.requestId
		if (!requestId) return
		if (value === 'delete') {
			refuseFriendRequest(requestId)
		}
	}
</script>

<style scoped>
	.btn,
	.badge {
		font-size: 15px;
		padding: 6px 12px;
		border-radius: 8px;
	}
</style>
