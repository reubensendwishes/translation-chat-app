<template>
	<AuthPanel
		feature="signUp"
		:auth-cta="authCta"
		:input-datas="inputDatas"
		:validation-datas="validationDatas"
		:is-loading="isLoading"
		:form-error="formError"
		@blur="validateField"
		@submit="handleSubmit"
	/>
</template>

<script setup lang="ts">
	import { onMounted, ref, computed } from 'vue'
	import axios from 'axios'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'

	import AuthPanel from '@/components/auth/Panel.vue'
	import type { ValidationDatas } from '@/components/auth/Panel.vue'
	import type { InputData } from '@/components/ui/FloatLabelInput.vue'
	import { removePrefix, kebabToCamel } from '@/utils/helpers'
	import { useAuth } from '@/composables/useAuth'

	// types
	type Validator = Record<string, (value: string) => string | Promise<string>>

	// router
	const router = useRouter()

	// composables
	const { signUp } = useAuth()

	// vue-i18n
	const { t } = useI18n()

	const authCta = computed(() => {
		return {
			content: t('auth.ctn.alreadyAccount'),
			linkAdviceName: 'login',
			linkAdviceText: t('auth.login'),
		}
	})
	const inputDatas: InputData[] = [
		{ type: 'text', id: 'sign-up-email', label: 'email' },
		{ type: 'password', id: 'sign-up-password', label: 'password' },
		{
			type: 'text',
			id: 'sign-up-full-name',
			label: 'fullName',
		},
		{
			type: 'text',
			id: 'sign-up-username',
			label: 'username',
		},
	]
	const validator: Validator = {
		common: (value) => {
			if (!value) {
				return t('validation.common.required')
			}
			return ''
		},
		email: (value) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
			return emailRegex.test(value) ? '' : t('validation.email.invalid')
		},
		password: (value) => {
			if (value.length < 6) return t('validation.password.minLength')
			if (!/[a-z]/.test(value)) return t('validation.password.requireLowercase')
			if (!/[A-Z]/.test(value)) return t('validation.password.requireUppercase')
			if (!/[0-9]/.test(value)) return t('validation.password.requireNumber')
			return ''
		},
		fullName: (value) => {
			if (value.length > 64) return t('validation.fullName.maxLength')
			return ''
		},
		username: async (value) => {
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
	const validationDatas = ref<ValidationDatas>({})
	const validateField = async (id: InputData['id'], value: string) => {
		validationDatas.value[id].invalidFeedback = ''
		const validatorType = kebabToCamel(removePrefix(id, 'sign-up-'))
		const commonError = await validator.common(value)
		if (commonError !== '') {
			validationDatas.value[id].invalidFeedback = commonError
			validationDatas.value[id].state = 'invalid'
			return
		}
		const specificError = await validator[validatorType](value)
		validationDatas.value[id].invalidFeedback = specificError
		if (specificError) {
			validationDatas.value[id].state = 'invalid'
		} else {
			validationDatas.value[id].state = 'valid'
		}
	}
	const isLoading = ref<boolean>(false)
	const formError = ref<string>('')
	const handleSubmit = async (formData: Record<string, string>) => {
		if (isLoading.value) return
		isLoading.value = true
		formError.value = ''
		try {
			if (Object.values(validationDatas.value).some((item) => item.state === 'unverified')) {
				Object.keys(formData).forEach((id) => {
					validateField(id, formData[id])
				})
				return
			}
			const result = await signUp(
				formData['sign-up-email'],
				formData['sign-up-password'],
				formData['sign-up-full-name'],
				formData['sign-up-username'],
			)

			if (result.success) {
				router.push(`/profile/${formData['sign-up-username']}`)
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				formError.value = error.response.data.detail || 'Registration failed'
			} else {
				formError.value = 'Internal server error'
			}
		} finally {
			isLoading.value = false
		}
	}
	onMounted(() => {
		inputDatas.forEach((inputData) => {
			validationDatas.value[inputData.id] = { state: 'unverified', invalidFeedback: '' }
		})
	})
</script>
