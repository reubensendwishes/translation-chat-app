<template>
	<main class="auth-panel text-primary d-flex">
		<form
			@submit.prevent="!submitDisabled && $emit('submit', formData)"
			class="d-flex auth-form"
		>
			<div class="logo-wrapper d-flex">
				<LogoText class="auth-logo" logo-height="50px" />
				<AppDropdown
					class="language-btn"
					placement="right"
					@select-item="
						(value) => {
							locale = value
						}
					"
					:dropdown-items="languageItems"
					transition-direction="right"
				>
					<template #button-name>
						<GSymbol font-size="30px">language</GSymbol>
					</template>
				</AppDropdown>
			</div>

			<FloatLabelInput
				v-for="fieldData in fieldDatas"
				:key="fieldData.id"
				:field-data="fieldData"
				:validation-data="validationDatas?.[fieldData.id]"
				v-model="formData[fieldData.id]"
				@blur="$emit('validate:field', fieldData.id, formData[fieldData.id])"
				@input="$emit('input', fieldData.id)"
				class="auth-input-group"
			/>
			<button
				:disabled="submitDisabled"
				class="btn submit-btn text-inverse"
				:class="isSubmitting ? 'bg-muted' : 'bg-inverse'"
				type="submit"
			>
				<span v-if="!isSubmitting">{{ buttonText }}</span>
				<span v-else>
					<SpinnerIcon
						spinner-color="inverse"
						spinner-height="18px"
						spinner-width="18px"
					/>
				</span>
			</button>
			<div class="auth-divider d-flex">
				<span class="auth-divider-line bg-muted"></span>
				<span class="text-muted">{{ t('auth.or') }}</span>
				<span class="auth-divider-line bg-muted"></span>
			</div>
			<div class="auth-feedback text-warning">{{ formError }}</div>
		</form>
		<div class="auth-prompt text-muted">
			{{ authPrompt.content }}
			<RouterLink class="text-primary" :to="{ name: authPrompt.linkAdviceName }">
				{{ authPrompt.linkAdviceText }}
			</RouterLink>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { useI18n } from 'vue-i18n'

	import LogoText from '@/components/icons/LogoText.vue'
	import FloatLabelInput from '@/components/ui/FloatLabelInput.vue'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import AppDropdown from '@/components/ui/AppDropdown.vue'
	import type { DropdownItem, FieldData, ValidationDatas } from '@/types'

	// types
	type AuthFeature = 'login' | 'signUp'
	export type AuthPrompt = {
		content: string
		linkAdviceName: string
		linkAdviceText: string
	}

	type Props = {
		feature: AuthFeature
		authPrompt: AuthPrompt
		fieldDatas: FieldData[]
		validationDatas?: ValidationDatas
		isSubmitting: boolean
		formError: string
	}
	type Emits = {
		'validate:field': [id: string, value: string]
		submit: [formData: Record<string, string>]
		input: [id: string]
	}

	// props
	const { authPrompt, feature, fieldDatas, validationDatas, isSubmitting, formError } =
		defineProps<Props>()

	// emits
	defineEmits<Emits>()

	// vue-i18n
	const { t, locale } = useI18n()

	const buttonText = computed(() => {
		return t('auth.' + feature)
	})
	const formData = ref<Record<string, string>>(
		Object.fromEntries(fieldDatas.map((fieldData) => [fieldData.id, ''])),
	)
	const submitDisabled = computed(() => {
		if (validationDatas) {
			return (
				Object.values(validationDatas).some((item) => item.state === 'invalid') ||
				isSubmitting ||
				Object.values(formData.value).some((item) => item)
			)
		}
		return isSubmitting || Object.values(formData.value).some((item) => item === '')
	})

	const languageItems: DropdownItem[] = [
		{ text: 'Tiếng Việt', value: 'vi' },
		{ text: '繁體中文', value: 'zh-TW' },
	]
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
	.auth-form > .logo-wrapper {
		align-self: center;
		margin-bottom: 30px;
		gap: 10px;
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
		font-size: 16px;
	}
	.auth-form .submit-btn:disabled,
	.auth-form .submit-btn:disabled:hover {
		background-color: var(--color-text-muted);
	}
	.auth-form .submit-btn:hover {
		background-color: var(--color-primary-darken);
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
	.auth-prompt {
		padding: 20px 40px;
		text-align: center;
		border: 1px solid var(--color-text-muted);
	}
</style>
