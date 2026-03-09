<template>
	<main class="text-primary d-flex">
		<ConversationList @select="handleSelect" />
		<ChatBox v-if="currentConversation" :current-conversation="currentConversation" />
	</main>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	import ConversationList from '@/views/message/ConversationList.vue'
	import ChatBox from '@/views/message/ChatBox.vue'
	import type { Conversation } from '@/types'

	const handleSelect = (conversation: Conversation) => {
		currentConversation.value = conversation
	}
	const currentConversation = ref<Conversation | null>(null)
</script>

<style scoped>
	main {
		padding-bottom: 60px;
		height: calc(100vh);
	}
</style>
