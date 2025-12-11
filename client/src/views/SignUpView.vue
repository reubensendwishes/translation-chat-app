<template>
	<AuthPanel
		feature="signUp"
		:auth-cta="authCta"
		:input-datas="inputDatas"
		:validation-datas="validationDatas"
		:is-loading="isLoading"
		:error-message="errorMessage"
		@blur="validateField"
		@submit="handleSubmit"
	/>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import axios from 'axios'
	import AuthPanel from '@/components/ui/auth/AuthPanel.vue'
	import type { AuthCta, ValidationDatas } from '@/components/ui/auth/AuthPanel.vue'
	import type { InputData } from '@/components/ui/auth/FloatLabelInput.vue'
	import { useRouter } from 'vue-router'

	type Validator = Record<string, (value: string) => string | Promise<string>>

	const router = useRouter()

	const authCta: AuthCta = {
		content: '已經有帳號嗎？',
		linkAdviceName: 'login',
		linkAdviceText: '登入',
	}
	const inputDatas: InputData[] = [
		{ type: 'text', id: 'sign-up-email', label: '電子郵件地址' },
		{ type: 'password', id: 'sign-up-password', label: '密碼' },
		{
			type: 'text',
			id: 'sign-up-full-name',
			label: '全名',
		},
		{
			type: 'text',
			id: 'sign-up-username',
			label: '用戶名稱',
		},
	]
	const validator: Validator = {
		common: (value) => {
			if (!value) {
				return '此欄位必填'
			}
			return ''
		},
		email: (value) => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
			return emailRegex.test(value) ? '' : '請輸入有效的email'
		},
		password: (value) => {
			if (value.length < 6) return '密碼至少需要6個字元'
			if (!/[a-z]/.test(value)) return '密碼至少需要1個小寫字母'
			if (!/[A-Z]/.test(value)) return '密碼至少需要1個大寫字母'
			if (!/[0-9]/.test(value)) return '密碼至少需要1個數字'
			return ''
		},
		fullName: (value) => {
			if (value.length > 64) return '全名不能超過64個字元'
			return ''
		},
		username: async (value) => {
			if (value.length > 30) return '用戶名稱不能超過30個字元'
			try {
				const res = await axios.get('/api/auth/check-username', {
					params: { username: value },
				})
				if (!res.data.available) {
					return '用戶名稱已被使用'
				}
				return ''
			} catch (error) {
				console.error('檢查username失敗', error)
				return ''
			}
		},
	}
	const validationDatas = ref<ValidationDatas>({})
	const validateField = async (id: InputData['id'], value: string) => {
		validationDatas.value[id].invalidFeedback = ''

		const validatorType = id.replace(/^[^-]+-[^-]+-/, '').replace(/-(.)/g, (_, char) => {
			return char.toUpperCase()
		})

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
	const errorMessage = ref<string>('')
	const handleSubmit = async (formData: Record<string, string>) => {
		if (isLoading.value) return
		isLoading.value = true
		errorMessage.value = ''
		try {
			await axios.post('/api/auth/signup', formData)
			router.push({ name: 'login' })
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				errorMessage.value = error.response.data.message || '註冊失敗'
			} else {
				console.error('提交失敗:', error)
				errorMessage.value = '網路錯誤，請稍後重試'
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
