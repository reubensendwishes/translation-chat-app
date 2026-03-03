<template>
	<form class="new-chat-panel" @submit.prevent>
		<ul class="friend-list">
			<li class="friend-item" v-for="friend in friends" :key="friend.requestId">
				<label class="friend-label d-flex">
					<img
						class="friend-avatar pill"
						:src="friend.friendData.avatar"
						:alt="friend.friendData.username"
					/>
					<div class="friend-info d-flex">
						<div class="friend-username">{{ friend.friendData.username }}</div>
						<div class="friend-full-name">{{ friend.friendData.fullName }}</div>
					</div>
					<input
						@click="
							selectedFriend === friend.friendData.username && (selectedFriend = null)
						"
						class="friend-radio pill"
						v-model="selectedFriend"
						:value="friend.friendData.username"
						type="radio"
					/>
				</label>
			</li>
		</ul>

		<button
			@click="selectedFriend && openConversation()"
			:disabled="!selectedFriend"
			type="button"
			:class="selectedFriend ? 'bg-inverse' : 'bg-muted'"
			class="btn select-btn text-inverse"
		>
			聊天
		</button>
	</form>
</template>

<script setup lang="ts">
	import { useFriendStore } from '@/stores/FriendStore'
	import { storeToRefs } from 'pinia'
	import { onMounted, ref } from 'vue'

	type Emits = {
		openConversation: [conversationTarget: string]
	}
	const emit = defineEmits<Emits>()
	const friendStore = useFriendStore()
	const { friends } = storeToRefs(friendStore)

	const selectedFriend = ref(null)
	const openConversation = () => {
		if (!selectedFriend.value) return
		emit('openConversation', selectedFriend.value!)
	}
	onMounted(() => {
		console.log(selectedFriend.value)
	})
</script>

<style scoped>
	.new-chat-panel {
		padding: 16px 16px 0;
	}
	.friend-item {
		width: 100%;
		padding: 10px 0;
		margin-bottom: 8px;
	}
	.friend-item:not(:last-child) {
		margin-bottom: 10px;
		border-bottom: 1px var(--color-text-muted) solid;
	}
	.friend-label {
		align-items: center;
	}
	.friend-avatar {
		width: 44px;
		height: 44px;
		margin-right: 10px;
	}
	.friend-info {
		flex-direction: column;
		gap: 4px;
	}
	.friend-radio {
		margin-left: auto;
		border: 1px var(--color-text-primary) solid;
		width: 20px;
		height: 20px;
		appearance: none;
	}

	.friend-radio:checked {
		border: 7px var(--color-text-primary) solid;
	}
	.new-chat-panel .select-btn {
		width: 100%;
		padding: 10px 0;
		border-radius: 10px;
	}
</style>
