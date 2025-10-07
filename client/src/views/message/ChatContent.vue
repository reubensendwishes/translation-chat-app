<template>
	<div
		ref="chat-content"
		class="chat-content d-flex"
		:style="{ visibility: isReady ? 'visible' : 'hidden' }"
	>
		<div ref="loadMoreTrigger" class="load-more-trigger"></div>
		<div v-if="isLoadingMessages" class="messages-loading">
			<SpinnerIcon
				spinner-color="primary"
				spinner-width="50px"
				spinner-height="50px"
			></SpinnerIcon>
		</div>
		<MessageText @translate="translateMessage" :messages="messages" />
		<div ref="messageBottom" class="message-bottom"></div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted, useTemplateRef, nextTick, onBeforeUnmount } from 'vue'
	import axios from 'axios'

	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
	import type { Conversation, Message } from '@/types'
	import { handleRequestError } from '@/utils/helpers'
	import { useMessageStore } from '@/stores/MessageStore'
	import MessageText from './MessageText.vue'

	// types
	type Props = {
		isReady: boolean
		currentConversation: Conversation
	}

	// props
	const { isReady, currentConversation } = defineProps<Props>()

	// model
	const isLoadingMessages = defineModel<boolean>('loading', { required: true })
	const hasMore = defineModel<boolean>('hasMore', { required: true })

	const messages = defineModel<Message[]>('messages', { required: true })

	// stores
	const messageStore = useMessageStore()
	const { getMessageCache, setHasMoreMessages } = messageStore

	const translateMessage = (
		resolve: (value?: void) => void,
		id: string,
		translation?: string,
	) => {
		const target = messages.value.find((message) => {
			return message._id === id
		})
		if (!target) {
			resolve()
			return
		}
		if (translation) {
			target.translation = translation
			target.isTranslated = true
		} else {
			target.isTranslated = !target.isTranslated
		}
		resolve()
	}

	const chatContentRef = useTemplateRef('chat-content')
	const loadMoreTriggerRef = useTemplateRef('loadMoreTrigger')
	const messagesBottomRef = useTemplateRef('messageBottom')
	let observer: IntersectionObserver | null = null
	const setupIntersectionObserver = () => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting && hasMore && !isLoadingMessages.value) {
						isLoadingMessages.value = true
						const { _id } = currentConversation
						const cursor = messages.value[0]?.createdAt
						const prevScrollHeight = chatContentRef.value!.scrollHeight

						try {
							const res = await axios.get('/api/message', {
								params: { _id, cursor, limit: 50 },
							})

							hasMore.value = res.data.hasMore
							setHasMoreMessages(_id, res.data.hasMore)

							messages.value?.unshift(...res.data.messages)
							getMessageCache(_id)?.unshift(...res.data.messages)

							await nextTick()
							const newScrollHeight = chatContentRef.value!.scrollHeight
							chatContentRef.value!.scrollTop = newScrollHeight - prevScrollHeight

							return { success: true }
						} catch (error) {
							handleRequestError(error)
						} finally {
							isLoadingMessages.value = false
						}
					}
				})
			},
			{ root: chatContentRef.value },
		)
		if (loadMoreTriggerRef.value) {
			observer.observe(loadMoreTriggerRef.value)
		}
	}
	const scrollToBottom = () => {
		messagesBottomRef.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}

	onMounted(() => {
		setupIntersectionObserver()
	})
	onBeforeUnmount(() => {
		observer?.disconnect()
	})

	// expose
	defineExpose({
		scrollToBottom,
	})
</script>

<style scoped>
	.chat-content {
		flex: 1;
		overflow-y: auto;
		flex-direction: column;
		align-items: start;
		margin-left: 10px;
	}
	.load-more-trigger {
		height: 1px;
	}

	.message-bottom {
		height: 5px;
		width: 1px;
	}
	.messages-loading {
		align-self: center;
		padding: 20px;
	}
</style>
