<template>
	<AuthPanel
		feature="signUp"
		:auth-prompt="authPrompt"
		:field-datas="fieldDatas"
		:validation-datas="validationDatas"
		:is-submitting="isSubmitting"
		:form-error="formError"
		@validate:field="validateField"
		@submit="handleSubmit"
		@input="resetError"
	/>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import axios from 'axios'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'

	import AuthPanel from '@/components/auth/Panel.vue'
	import type { FieldData, ValidationDatas } from '../types.ts'
	import { useAuth } from '@/composables/useAuth'

	// types
	type Validator = Record<string, (value: string) => string | Promise<string>>

	// router
	const router = useRouter()

	// composables
	const { signUp } = useAuth()

	// vue-i18n
	const { t } = useI18n()

	const authPrompt = computed(() => {
		return {
			content: t('auth.prompt.alreadyAccount'),
			linkAdviceName: 'login',
			linkAdviceText: t('auth.login'),
		}
	})
	const fieldDatas: FieldData[] = [
		{ type: 'text', id: 'signup-email', label: 'email' },
		{ type: 'password', id: 'signup-password', label: 'password' },
		{
			type: 'text',
			id: 'signup-full-name',
			label: 'fullName',
		},
		{
			type: 'text',
			id: 'signup-username',
			label: 'username',
		},
	]
	const validator: Validator = {
		'signup-common': (value) => {
			if (!value) {
				return t('validation.common.required')
			}
			return ''
		},
		'signup-email': (value) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
			return emailRegex.test(value) ? '' : t('validation.email.invalid')
		},
		'signup-password': (value) => {
			if (value.length < 6) return t('validation.password.minLength')
			if (!/[a-z]/.test(value)) return t('validation.password.requireLowercase')
			if (!/[A-Z]/.test(value)) return t('validation.password.requireUppercase')
			if (!/[0-9]/.test(value)) return t('validation.password.requireNumber')
			if (!/^[\x21-\x7E]+$/.test(value)) return '只能包含英文字母、數字與常見符號'

			return ''
		},
		'signup-full-name': (value) => {
			if (value.length > 64) return t('validation.fullName.maxLength')
			return ''
		},
		'signup-username': async (value) => {
			if (value.length > 30) return t('validation.username.maxLength')
			if (!/^[a-zA-Z0-9_-]+$/.test(value)) return t('username.invalidCharacters')
			try {
				const res = await axios.get('/api/auth/check-username', {
					params: { username: value },
				})
				if (!res.data.available) {
					return t('validation.username.alreadyTaken')
				}
				return ''
			} catch {
				return ''
			}
		},
	}
	const validationDatas = ref<ValidationDatas>(
		Object.fromEntries(
			fieldDatas.map((fieldData) => [fieldData.id, { state: 'unverified', error: '' }]),
		),
	)
	const validateField = async (id: FieldData['id'], value: string) => {
		const commonError = await validator['signup-common'](value)
		if (commonError) {
			validationDatas.value[id].error = commonError
			validationDatas.value[id].state = 'invalid'
			return
		}
		const specificError = await validator[id](value)
		validationDatas.value[id].error = specificError
		if (specificError) {
			validationDatas.value[id].state = 'invalid'
			return
		}
		validationDatas.value[id].state = 'valid'
		validationDatas.value[id].error = ''
	}
	const isSubmitting = ref<boolean>(false)
	const formError = ref<string>('')
	const handleSubmit = async (formData: Record<string, string>) => {
		if (isSubmitting.value) return
		isSubmitting.value = true
		formError.value = ''
		if (Object.values(validationDatas.value).some((item) => item.state === 'unverified')) {
			Object.keys(formData).forEach((id) => {
				validateField(id, formData[id])
			})
			return
		}
		try {
			const result = await signUp(
				formData['signup-email'],
				formData['signup-password'],
				formData['signup-full-name'],
				formData['signup-username'],
			)

			if (result.success) {
				router.push(`/profile/${formData['signup-username']}`)
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				formError.value = error.response.data.detail || 'Registration failed'
			} else {
				formError.value = 'Internal server error'
			}
		} finally {
			isSubmitting.value = false
		}
	}

	const resetError = (id: string) => {
		validationDatas.value[id].error = ''
		validationDatas.value[id].state = 'unverified'
	}
</script>
