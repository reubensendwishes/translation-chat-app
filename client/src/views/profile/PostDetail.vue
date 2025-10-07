<template>
	<div class="post-detail d-flex">
		<img
			class="post-img"
			:srcset="getImgSrcset(postData.imageStoragePaths)"
			:alt="postData.content"
		/>
		<div class="post-content d-flex">
			<div class="post-author d-flex">
				<img :src="getAvatarUrl(profileAvatar)" :alt="profileUsername" class="avatar" />
				<span class="username">{{ profileUsername }}</span>
			</div>
			<div class="post-text-wrapper">
				<span v-if="!isTranslating && !postData.isTranslated" class="post-text">{{
					postData.content
				}}</span>
				<span v-else-if="isTranslating"
					><SpinnerIcon spinner-width="40px" spinner-height="40px"
				/></span>
				<span v-else>{{ postData.translation }}</span>
				<button @click="translatePost" type="button" class="btn text-primary">
					<GSymbol font-size="16px">g_translate</GSymbol>
				</button>
			</div>
			<div class="post-actions">
				<button @click="toggleSavePost" type="button" class="btn text-primary">
					<GSymbol font-size="30px" :fill="isPostSaved ? 1 : 0">bookmark</GSymbol>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue'

	import GSymbol from '@/components/icons/GSymbol.vue'
	import type { Post } from '@/types'
	import { getAvatarUrl, handleRequestError } from '@/utils/helpers'
	import axios from 'axios'
	import { useAuthStore } from '@/stores/AuthStore'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

	// types
	type Props = {
		postData: Post
		getImgSrcset: (paths: Post['imageStoragePaths']) => string
		profileUsername: string
		profileAvatar: string
	}

	type Emits = {
		translate: [resolve: (value?: void) => void, id: string, translation?: string]
	}

	// props
	const { postData, getImgSrcset, profileUsername, profileAvatar } = defineProps<Props>()

	// emits
	const emit = defineEmits<Emits>()

	// store
	const authStore = useAuthStore()
	const { savedPostIds } = storeToRefs(authStore)

	// vue-i18n
	const { locale } = useI18n()

	const isPostSaved = computed(() => {
		return savedPostIds.value.has(postData._id)
	})
	const isPostSaving = ref(false)
	const toggleSavePost = async () => {
		isPostSaving.value = true
		try {
			if (isPostSaved.value) {
				await axios.delete(`/api/posts/${postData._id}/save`)
				savedPostIds.value.delete(postData._id)
			} else {
				await axios.post(`/api/posts/${postData._id}/save`)
				savedPostIds.value.add(postData._id)
			}
		} catch (error) {
			handleRequestError(error)
		} finally {
			isPostSaving.value = false
		}
	}
	const isTranslating = ref(false)

	const translatePost = async () => {
		if (isTranslating.value) return
		isTranslating.value = true
		try {
			let translation: string | undefined
			if (!postData.translation) {
				const res = await axios.get(`/api/posts/${postData._id}/translate`, {
					params: { targetLang: locale.value },
				})
				translation = res.data.translation
			}
			await new Promise((resolve) => {
				emit('translate', resolve, postData._id, translation)
			})
		} catch (error) {
			handleRequestError(error)
		} finally {
			isTranslating.value = false
		}
	}
</script>

<style scoped>
	.post-detail {
		width: 100dvw;
		flex-wrap: wrap;
		column-gap: 4%;
		justify-content: center;
	}
	.post-img {
		width: 100%;
		aspect-ratio: 3/4;
	}
	.post-content {
		width: 100%;
		flex-direction: column;
		gap: 10px;
		padding: 10px 0;
	}
	.post-content > *:not(:last-child) {
		padding-bottom: 10px;
		border-bottom: 1px solid var(--color-text-muted);
	}
	.post-author {
		align-items: center;
		gap: 8px;
	}
	.avatar {
		width: 44px;
		height: 44px;
	}
	.post-text-wrapper {
		flex-grow: 1;
	}

	@media (min-width: 393px) {
		.post-detail {
			width: 80dvw;
		}

		.post-img {
			width: min(48%, 400px);
		}
		.post-content {
			width: min(48%, 400px);
		}
	}
</style>
