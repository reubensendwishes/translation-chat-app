<template>
	<ul class="conversation-list bg-default d-inline-flex">
		<AppModal v-model="isModalOpen">
			<template #header>新訊息</template>
			<template #button>
				<GSymbol class="text-primary" style="font-size: 30px">edit_square</GSymbol>
			</template>
			<NewChatPanel @open-conversation="openConversation" />
		</AppModal>
		<li v-for="conversation in conversationList" :key="conversation.conversationId">
			<img
				class="pill"
				:src="conversation.recipientData.avatar"
				:alt="conversation.recipientData.username"
			/>
		</li>
	</ul>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import AppModal from '@/components/ui/AppModal.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import NewChatPanel from './NewChatPanel.vue'
	import type { Conversation } from '@/types'
	import { handleRequestError } from '@/utils/helpers'
	import axios from 'axios'
	import { useFriendStore } from '@/stores/FriendStore'
	import { storeToRefs } from 'pinia'

	const friendStore = useFriendStore()
	const { friendMap } = storeToRefs(friendStore)

	const conversationList = ref<Conversation[]>([])
	const isModalOpen = ref(false)

	const openConversation = async (conversationTarget: string) => {
		try {
			const res = await axios.post('/api/conversation', { conversationTarget })
			isModalOpen.value = false
			return { success: true, message: res.data.message }
		} catch (error) {
			handleRequestError(error)
		}
	}

	// 			onMounted(async () => {
	// 			try {
	// 				const res = await axios.get('/api/conversation')
	// 				conversationList.value= res.data.map((conversation)=>{

	// 					const {_id,recipientId,createdAt} = conversation
	// const {}
	// 					return {
	// 						conversationId : _id,
	// 						recipientData: {userId:recipientId,username:,avatar:}
	// 	,createdAt
	// 					}

	// 				})
	// 			} catch (error) {
	// 				console.error(error)
	// 			}
	// 		})
</script>

<style scoped>
	.conversation-list {
		flex-direction: column;
		align-items: center;
		width: 90px;
		border-right: 1px var(--color-text-muted) solid;
		padding: 16px 0;
		gap: 16px;
		vertical-align: top;
	}
	.conversation-list img {
		width: 44px;
		height: 44px;
	}
</style>
