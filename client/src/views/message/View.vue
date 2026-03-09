<template>
	<main class="text-primary d-flex">
		<ConversationList @select="handleSelect" />
		<ChatBox v-if="currentConversation" :current-conversation="currentConversation" />
	</main>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	import { useMessageStore } from '@/stores/MessageStore'
	import type { Conversation } from '@/types'
	import ChatBox from '@/views/message/ChatBox.vue'
	import ConversationList from '@/views/message/ConversationList.vue'
	import { storeToRefs } from 'pinia'

	const messageStore = useMessageStore()
	const { currentConversationId } = storeToRefs(messageStore)
	const handleSelect = (conversation: Conversation) => {
		currentConversation.value = conversation
		currentConversationId.value = conversation.conversationId
	}
	const currentConversation = ref<Conversation | null>(null)
</script>

<style scoped>
	main {
		padding-bottom: 60px;
		height: calc(100vh);
	}
</style>
