<template>
	<div
		class="float-label-group text-muted"
		:style="{
			'--input-padding-x': inputStyle.paddingX + 'px',
			'--input-padding-top': paddingTop + 'px',
			'--input-height': inputStyle.height + 'px',
			'--input-font-size': inputStyle.fontSize + 'px',
			'--label-translate-y': labelTranslateY + 'px',
			'--label-scale': labelScale,
		}"
	>
		<input
			class="float-input text-muted"
			:class="{ 'invalid-input': validationData?.state === 'invalid' }"
			:id="inputData.id"
			:type="inputData.type"
			v-model="model"
			@[inputEvent]="inputBlurAction"
		/>
		<label class="float-label" :class="{ floating: isFloating }" :for="inputData.id">{{
			inputData.label
		}}</label>
		<GSymbol
			v-show="validationData && validationData?.state !== 'unverified'"
			class="status-icon"
			:class="statusIconClass"
			>{{ statusIconType }}</GSymbol
		>
		<span v-if="validationData?.state === 'invalid'" class="invalid-feedback text-warning">
			{{ validationData?.invalidFeedback }}
		</span>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue'
	import GSymbol from '@/components/icons/GSymbol.vue'

	export type InputData = {
		type: 'text' | 'email' | 'password'
		id: string
		label: string
	}
	export type InputStyle = {
		paddingX: number
		fontSize: number
		height: number
	}

	export type ValidationData = {
		state: 'valid' | 'invalid' | 'unverified'
		invalidFeedback: string
	}
	type Emits = {
		blur: []
	}
	type Props = {
		inputData: InputData
		inputStyle: InputStyle
		validationData?: ValidationData
	}

	const emit = defineEmits<Emits>()
	const { inputData, inputStyle, validationData } = defineProps<Props>()
	const model = defineModel<string>({})

	const labelTranslateY = computed(() => {
		return (-(inputStyle.height - inputStyle.fontSize) / 2) * labelScale
	})
	const paddingTop = computed(() => {
		return (
			(inputStyle.height - inputStyle.fontSize) / 2 +
			labelTranslateY.value +
			inputStyle.fontSize * labelScale
		)
	})

	const labelScale: number = 0.8

	const isFloating = computed<boolean>(() => {
		return model.value !== ''
	})
	const statusIconClass = computed(() => {
		if (validationData?.state === 'invalid') {
			return 'text-warning'
		}
		return ''
	})
	const inputEvent = computed(() => {
		return validationData ? 'blur' : null
	})
	const showStatusIcon = ref<boolean>(false)
	const inputBlurAction = () => {
		emit('blur')
		showStatusIcon.value = true
	}
	const statusIconType = computed(() => {
		if (validationData?.state === 'invalid') {
			return 'cancel'
		} else if (validationData?.state === 'valid') {
			return 'check_circle'
		}
		return ''
	})
</script>

<style scoped>
	.float-label-group {
		position: relative;

		font-size: var(--input-font-size);
	}
	.float-input {
		width: 100%;
		height: var(--input-height);
		outline: none;
		border: 1px solid var(--color-text-muted);
		border-radius: 3px;
		font-size: inherit;
		padding-top: var(--input-padding-top);
		padding-left: var(--input-padding-x);
		padding-right: var(--input-padding-x);
	}
	.float-input.invalid-input {
		border-color: var(--color-text-warning);
	}
	.float-label {
		position: absolute;
		transform-origin: left;
		line-height: var(--input-height);
		left: var(--input-padding-x);
		transition: transform 0.2s ease;
	}
	.float-input:focus + .float-label,
	.float-label.floating {
		transform: translateY(var(--label-translate-y)) scale(var(--label-scale));
	}
	.status-icon {
		position: absolute;
		right: var(--input-padding-x);
		line-height: var(--input-height);
	}
	.invalid-feedback {
		font-size: calc(var(--input-font-size) - 3px);
	}
</style>
