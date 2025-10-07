<template>
	<ul class="conversation-list bg-default d-inline-flex">
		<AppModal v-model="isModalOpen">
			<template #header>{{ t('message.newMessage') }}</template>
			<template #button>
				<GSymbol class="text-primary" style="font-size: 30px">edit_square</GSymbol>
			</template>
			<CreateChatPanel @open-conversation="openConversation" />
		</AppModal>
		<li
			@click="selectConversation(conversation)"
			v-for="conversation in conversationList"
			class="conversation-item"
			:class="selectedConversationId === conversation._id ? 'active' : null"
			:key="conversation._id"
		>
			<img
				@click="selectedConversationId = conversation._id"
				class="pill"
				:src="getAvatarUrl(conversation.avatar)"
				:alt="conversation.username"
			/>
		</li>
	</ul>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import axios from 'axios'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import AppModal from '@/components/ui/AppModal.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import CreateChatPanel from '@/views/message/CreateChatPanel.vue'
	import type { Conversation } from '@/types'
	import { handleRequestError, getAvatarUrl } from '@/utils/helpers'
	import { useFriendStore } from '@/stores/FriendStore'

	// types
	type Emit = {
		select: [conversation: Conversation]
	}

	// emits
	const emit = defineEmits<Emit>()

	// stores
	const friendStore = useFriendStore()
	const { friendMap } = storeToRefs(friendStore)

	// vue-i18n
	const { t } = useI18n()

	const conversationList = ref<Conversation[]>([])
	const isModalOpen = ref(false)
	const selectedConversationId = ref<string | null>(null)

	const selectConversation = (conversation: Conversation) => {
		selectedConversationId.value = conversation._id
		emit('select', conversation)
	}
	const openConversation = async (friendId: string) => {
		try {
			const existing = conversationList.value.find(
				(conversation) => conversation.recipientId === friendId,
			)
			if (existing) {
				selectedConversationId.value = existing._id
				emit('select', existing)
				return { success: true }
			}
			const res = await axios.post('/api/conversation', { friendId })
			const { _id, recipientId, updatedAt } = res.data
			const friendData = friendMap.value.get(recipientId)
			if (!friendData) return
			conversationList.value.push({
				_id,
				recipientId,
				avatar: friendData.avatar,
				username: friendData.username,
				updatedAt,
			})
			selectedConversationId.value = _id
			emit('select', {
				_id,
				recipientId,
				avatar: friendData.avatar,
				username: friendData.username,
				updatedAt,
			})
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
					_id,
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
