<template>
	<ul class="conversation-list bg-default d-inline-flex">
		<AppModal v-model="isModalOpen">
			<template #header>新訊息</template>
			<template #button>
				<GSymbol class="text-primary" style="font-size: 30px">edit_square</GSymbol>
			</template>
			<NewChatPanel @open-conversation="openConversation" />
		</AppModal>
		<li
			@click="selectConversation(conversation)"
			v-for="conversation in conversationList"
			class="conversation-item"
			:class="selectedConversationId === conversation.conversationId ? 'active' : null"
			:key="conversation.conversationId"
		>
			<div class="pill bg-muted" style="width: 44px; height: 44px; margin: auto"></div>
			<!-- <img
				@click="selectedConversationId = conversation.conversationId"
				class="pill"
				:src="conversation.avatar"
				:alt="conversation.username"
			/> -->
		</li>
	</ul>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import AppModal from '@/components/ui/AppModal.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import NewChatPanel from './NewChatPanel.vue'
	import type { Conversation } from '@/types'
	import { handleRequestError } from '@/utils/helpers'
	import axios from 'axios'
	import { useFriendStore } from '@/stores/FriendStore'
	import { storeToRefs } from 'pinia'

	type Emit = {
		select: [conversation: Conversation]
	}
	const emit = defineEmits<Emit>()
	const friendStore = useFriendStore()
	const { friendMap } = storeToRefs(friendStore)

	const conversationList = ref<Conversation[]>([])
	const isModalOpen = ref(false)
	const selectedConversationId = ref<string | null>(null)

	const selectConversation = (conversation: Conversation) => {
		selectedConversationId.value = conversation.conversationId
		emit('select', conversation)
	}
	const openConversation = async (friendId: string) => {
		try {
			const existing = conversationList.value.find(
				(conversation) => conversation.recipientId === friendId,
			)
			if (existing) {
				selectedConversationId.value = existing.conversationId
				emit('select', existing)
				return { success: true }
			}

			const res = await axios.post('/api/conversation', { friendId })
			selectedConversationId.value = res.data.conversation
			return { success: true }
		} catch (error) {
			handleRequestError(error)
		} finally {
			isModalOpen.value = false
		}
	}

	onMounted(async () => {
		try {
			const res = await axios.get('/api/conversation')
			const rawConversations = res.data

			for (const rawConversation of rawConversations) {
				const { _id, recipientId, updatedAt } = rawConversation
				const friendData = friendMap.value.get(recipientId)
				if (!friendData) continue
				conversationList.value.push({
					conversationId: _id,
					recipientId,
					avatar: friendData.avatar,
					username: friendData.username,
					updatedAt,
				})
			}
		} catch (error) {
			console.error(error)
		}
	})
</script>

<style scoped>
	.conversation-list {
		flex-direction: column;
		align-items: stretch;
		width: 90px;
		border-right: 1px var(--color-text-muted) solid;
		padding: 16px 0;
		vertical-align: top;
	}
	.conversation-list :deep(button) {
		margin-bottom: 8px;
	}

	.conversation-item {
		text-align: center;
		cursor: pointer;
		padding: 8px 0;
	}
	.conversation-item.active {
		background-color: #f2f2f2;
	}
	.conversation-item img {
		width: 44px;
		height: 44px;
	}
</style>
