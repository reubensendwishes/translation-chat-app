<template>
	<AuthPanel
		feature="login"
		:auth-cta="authCta"
		:input-datas="inputDatas"
		:is-loading="isLoading"
		:form-error="formError"
		@submit="handleSubmit"
	/>
</template>

<script setup lang="ts">
	import axios from 'axios'
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'
	import AuthPanel from '@/components/ui/auth/AuthPanel.vue'
	import type { AuthCta } from '@/components/ui/auth/AuthPanel.vue'
	import type { InputData } from '@/components/ui/auth/FloatLabelInput.vue'

	const router = useRouter()
	const authCta: AuthCta = {
		content: '沒有帳號嗎？',
		linkAdviceName: 'signUp',
		linkAdviceText: '註冊',
	}
	const inputDatas: InputData[] = [
		{ type: 'text', id: 'login-username-email', label: '用戶名稱或電子郵件地址' },
		{
			type: 'password',
			id: 'login-password',
			label: '密碼',
		},
	]
	const isLoading = ref<boolean>(false)
	const formError = ref<string>('')

	const handleSubmit = async (formData: Record<string, string>) => {
		if (isLoading.value) return
		isLoading.value = true
		formError.value = ''
		try {
			await axios.post('/api/auth/login', formData)
			router.push({ name: 'home' })
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				formError.value = error.response.data.message || '登入失敗'
			} else {
				console.error('提交失敗:', error)
				formError.value = '網路錯誤，請稍後重試'
			}
		} finally {
			isLoading.value = false
		}
	}
</script>
