<template>
	<div class="create-post-panel d-flex">
		<div class="image-picker d-flex">
			<template v-if="!hasSelectedImage">
				<span>{{ t('navbar.post.pickerHint') }}</span>
				<GSymbol font-size="30px"> keyboard_double_arrow_down</GSymbol>
				<label
					tabindex="0"
					class="image-picker-label image-picker-btn btn text-inverse bg-inverse"
				>
					<GSymbol font-size="24px">image_arrow_up</GSymbol>
					<span>{{ t('navbar.post.pickerBtn') }}</span>
					<input
						ref="fileInput"
						class="image-picker-input"
						type="file"
						hidden
						accept="image/jpeg,image/png,image/webp"
						@change="handleFileChange"
					/>
				</label>
			</template>
			<img v-else :src="previewUrl" :alt="t('navbar.post.img')" />
		</div>
		<div v-if="isInTextStep" class="text-editor-wrapper">
			<div class="text-editor d-flex" :class="isTextareaFocused && 'active'">
				<textarea
					@focus="isTextareaFocused = true"
					@blur="isTextareaFocused = false"
					:aria-label="t('navbar.post.text')"
					class="text-editor-input text-primary"
					v-model="postText"
					:placeholder="t('navbar.post.placeholder')"
					maxLength="500"
				>
				</textarea>
				<span class="text-count text-muted">{{ postText.length + '/500' }}</span>
			</div>
		</div>
		<div class="post-btn-wrapper">
			<button
				v-if="!isInTextStep"
				@click="isInTextStep = true"
				type="button"
				:disabled="!hasSelectedImage"
				:class="!hasSelectedImage ? 'bg-muted' : 'bg-inverse'"
				class="btn post-btn text-inverse"
			>
				{{ t('common.nextStep') }}
			</button>
			<button
				v-else
				:disabled="isLoadingUploadPost || postText === ''"
				@click="publishPost"
				type="button"
				:class="isLoadingUploadPost || postText === '' ? 'bg-muted' : 'bg-inverse'"
				class="btn post-btn text-inverse"
			>
				<span v-if="!isLoadingUploadPost">{{ t('navbar.post.publish') }}</span>
				<SpinnerIcon v-else spinner-width="18px" spinner-height="18px" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useI18n } from 'vue-i18n'
	import axios from 'axios'

	import GSymbol from '../icons/GSymbol.vue'
	import { handleRequestError } from '@/utils/helpers'
	import SpinnerIcon from '../icons/SpinnerIcon.vue'

	// types
	type Emits = {
		closeModal: []
	}

	// emits
	const emit = defineEmits<Emits>()

	//  vue-i18n
	const { t } = useI18n()

	const formData = new FormData()
	const hasSelectedImage = ref(false)
	const postText = ref('')
	const previewUrl = ref('')
	const isLoadingUploadPost = ref(false)
	const handleFileChange = async (event: Event) => {
		if (formData.has('image')) return
		const { target } = event
		const file = (target as HTMLInputElement).files?.[0]
		if (!file) return
		previewUrl.value = URL.createObjectURL(file)
		formData.append('image', file)
		hasSelectedImage.value = true
	}
	const isInTextStep = ref(false)
	const publishPost = async () => {
		if (isLoadingUploadPost.value) return
		isLoadingUploadPost.value = true
		formData.append('text', postText.value)
		try {
			await axios.post('api/posts', formData)
			emit('closeModal')
			return { success: true }
		} catch (error) {
			handleRequestError(error)
		} finally {
			isLoadingUploadPost.value = false
		}
	}
	const isTextareaFocused = ref(false)
</script>

<style scoped>
	.create-post-panel {
		padding: 16px 16px 0px;
		flex-wrap: wrap;
		justify-content: center;
		gap: 16px;
		text-align: center;
	}
	.btn {
		font-size: 16px;
		padding: 10px;
		border-radius: 5px;
	}
	.image-picker {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		border: solid var(--color-text-primary) 1px;
		border-radius: 10px;
		width: clamp(200px, 50%, 280px);
		aspect-ratio: 3/4;
		overflow: hidden;
	}
	.image-picker img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.image-picker-btn {
		gap: 6px;
	}
	.text-editor-wrapper {
		flex-grow: 1;
	}
	.text-editor {
		border: solid 1px var(--color-text-muted);
		border-radius: 10px;
		padding: 10px;
		height: 100%;
		flex-direction: column;
	}
	.text-editor.active {
		border: solid 2px var(--color-text-primary);
		padding: 8.8px;
	}
	.text-editor-input {
		padding: 0;
		border: none;
		outline: none;
		flex-grow: 1;
		min-height: 100px;
	}
	.text-count {
		font-size: 13px;
		align-self: end;
	}
	.post-btn-wrapper {
		padding-top: 16px;
		border-top: 1px solid var(--color-text-muted);
		flex-grow: 1;
		flex-basis: 100%;
	}
	.post-btn {
		width: 100%;
	}
</style>
