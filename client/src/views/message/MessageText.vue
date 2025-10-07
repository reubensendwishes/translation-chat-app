<template>
	<div
		v-for="message in messages"
		:class="message.senderId === user!._id && 'from-me'"
		class="message d-flex"
		:key="message.localKey ?? message._id"
	>
		<div
			class="message-text text-inverse pill"
			:class="message.senderId === user!._id ? 'bg-inverse' : 'bg-secondary'"
		>
			<span v-if="!isTranslating && !message.isTranslated">{{ message.text }}</span>
			<span v-else-if="isTranslating"
				><SpinnerIcon spinner-color="inverse" spinner-width="18px" spinner-height="18px" />
			</span>
			<span v-else>{{ message.translation }}</span>
		</div>
		<button
			v-if="message._id"
			type="button"
			@click="translateMessage(message)"
			:class="message.senderId === user!._id ? 'text-primary' : 'text-secondary'"
			class="btn"
		>
			<GSymbol style="font-size: 20px">g_translate</GSymbol>
		</button>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'
	import axios from 'axios'

	import { useAuthStore } from '@/stores/AuthStore'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import type { Message } from '@/types'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
	import { handleRequestError } from '@/utils/helpers'

	// types
	type Props = {
		messages: Message[]
	}
	type Emits = {
		translate: [resolve: (value: void) => void, id: string, translation?: string]
	}

	// props
	const { messages } = defineProps<Props>()

	// emits
	const emit = defineEmits<Emits>()

	// stores
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	// vue-i18n
	const { locale } = useI18n()

	const isTranslating = ref(false)

	const translateMessage = async (message: Message) => {
		if (isTranslating.value || !message._id) return
		console.log(message._id)
		isTranslating.value = true
		try {
			let translation: string | undefined
			console.log(message.translation)
			if (!message.translation) {
				const res = await axios.get(`/api/message/${message._id}/translate`, {
					params: { targetLang: locale.value },
				})
				translation = res.data.translation
				console.log(translation)
			}
			console.log('test')
			await new Promise((resolve) => {
				emit('translate', resolve, message._id!, translation)
			})
			console.log('test')
		} catch (error) {
			handleRequestError(error)
		} finally {
			isTranslating.value = false
		}
	}
</script>

<style scoped>
	.message {
		gap: 4px;
	}

	.message.from-me {
		align-self: end;
		margin-right: 10px;
	}
	.message.from-me .btn {
		order: -1;
	}
	.message:not(:last-of-type) {
		margin-bottom: 3px;
	}
	.message-text {
		padding: 4px 12px;
		width: fit-content;
	}
</style>
