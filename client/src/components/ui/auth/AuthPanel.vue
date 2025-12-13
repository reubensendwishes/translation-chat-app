<template>
	<div class="auth-panel text-primary d-flex">
		<form
			@submit.prevent="!submitDisabled && $emit('submit', formData)"
			class="d-flex auth-form"
		>
			<LogoText class="auth-logo" logo-height="50px" />
			<FloatLabelInput
				v-for="inputData in inputDatas"
				:key="inputData.id"
				:input-data="inputData"
				:input-style="inputStyle"
				:validation-data="validationDatas?.[inputData.id]"
				v-model="formData[inputData.id]"
				@[inputEvent]="$emit('blur', inputData.id, formData[inputData.id])"
				class="auth-input-group"
			/>
			<button
				:disabled="submitDisabled"
				class="btn text-inverse"
				:class="isLoading ? 'bg-muted' : 'bg-inverse'"
				type="submit"
			>
				<span v-if="!isLoading">{{ buttonText }}</span>
				<span v-else class="auth-loading"><SpinnerIcon /></span>
			</button>
			<div class="auth-divider d-flex">
				<span class="auth-divider-line bg-muted"></span>
				<span class="text-muted">或</span>
				<span class="auth-divider-line bg-muted"></span>
			</div>
			<div class="auth-feedback text-warning">{{ formError }}</div>
		</form>
		<div class="auth-cta text-muted">
			{{ authCta.content }}
			<RouterLink class="text-primary" :to="{ name: authCta.linkAdviceName }">
				{{ authCta.linkAdviceText }}
			</RouterLink>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue'
	import LogoText from '@/components/icons/LogoText.vue'
	import type {
		InputData,
		InputStyle,
		ValidationData,
	} from '@/components/ui/auth/FloatLabelInput.vue'
	import FloatLabelInput from '@/components/ui/auth/FloatLabelInput.vue'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

	type AuthFeature = 'login' | 'signUp'
	export type AuthCta = {
		content: string
		linkAdviceName: string
		linkAdviceText: string
	}
	export type ValidationDatas = Record<string, ValidationData>
	type Props = {
		feature: AuthFeature
		authCta: AuthCta
		inputDatas: InputData[]
		validationDatas?: ValidationDatas
		isLoading: boolean
		formError: string
	}
	type Emits = {
		blur: [id: string, value: string]
		submit: [formData: Record<string, string>]
	}

	const { authCta, feature, inputDatas, validationDatas, isLoading, formError } =
		defineProps<Props>()
	defineEmits<Emits>()

	const buttonText = computed(() => (feature === 'login' ? '登入' : '註冊'))
	const inputStyle: InputStyle = {
		paddingX: 8,
		fontSize: 15,
		height: 40,
	}
	const formData = ref<Record<string, string>>({})
	const inputEvent = computed(() => {
		return validationDatas ? 'blur' : null
	})

	const submitDisabled = computed(() => {
		if (validationDatas) {
			return (
				Object.values(validationDatas).some((item) => item.state === 'invalid') ||
				isLoading ||
				Object.values(formData.value).some((item) => item === '')
			)
		}
		return isLoading || Object.values(formData.value).some((item) => item === '')
	})

	onMounted(() => {
		inputDatas.forEach((inputData) => {
			formData.value[inputData.id] = ''
		})
	})
</script>

<style scoped>
	.auth-panel {
		width: 350px;
		margin: 0 auto;
		flex-direction: column;
		justify-content: center;
		height: 100dvh;
		font-size: 15px;
	}
	.auth-form {
		flex-direction: column;
		border: 1px solid var(--color-text-muted);
		padding: 50px 40px 20px;
		margin-bottom: 10px;
	}
	.auth-logo {
		align-self: center;
		margin-bottom: 30px;
	}

	.auth-input-group:not(:last-of-type) {
		margin-bottom: 6px;
	}
	.auth-input-group:last-of-type {
		margin-bottom: 12px;
	}
	.auth-form button[type='submit'] {
		border-radius: 8px;
		margin-bottom: 6px;
		height: 32px;
	}
	.auth-form button[type='submit']:disabled,
	.auth-form button[type='submit']:disabled:hover {
		background-color: var(--color-text-muted);
		cursor: default;
	}
	.auth-form button[type='submit']:hover {
		background-color: var(--color-primary-darken);
	}
	.auth-loading {
		width: 18px;
		height: 18px;
	}
	.auth-divider {
		justify-content: space-between;
		align-items: center;
	}
	.auth-divider-line {
		width: 110px;
		height: 1px;
	}
	.auth-feedback {
		font-size: 13px;
	}
	.auth-cta {
		padding: 20px 40px;
		text-align: center;
		border: 1px solid var(--color-text-muted);
	}
</style>
