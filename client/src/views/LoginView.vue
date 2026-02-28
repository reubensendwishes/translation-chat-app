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
	import { onMounted, ref } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import type { LocationQueryValue } from 'vue-router'
	import AuthPanel from '@/components/auth/Panel.vue'
	import type { AuthCta } from '@/components/auth/Panel.vue'
	import type { InputData } from '@/components/ui/FloatLabelInput.vue'
	import { useAuth } from '@/composables/useAuth'
	import { useAuthStore } from '@/stores/AuthStore'
	import { storeToRefs } from 'pinia'
	import { useFriend } from '@/composables/useFriend'

	const { login } = useAuth()
	const { fetchFriendshipData } = useFriend()

	const route = useRoute()
	const router = useRouter()
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	const authCta: AuthCta = {
		content: '沒有帳號嗎？',
		linkAdviceName: 'signUp',
		linkAdviceText: '註冊',
	}
	const inputDatas: InputData[] = [
		{ type: 'text', id: 'login-identifier', label: '用戶名稱或電子郵件地址' },
		{
			type: 'password',
			id: 'login-password',
			label: '密碼',
		},
	]
	const isLoading = ref<boolean>(false)
	const formError = ref<string>('')

	const validateRedirect = (path?: LocationQueryValue | LocationQueryValue[]): string | null => {
		if (!path || typeof path !== 'string') {
			return null
		}
		const resolved = router.resolve(path)
		if (resolved.matched.length === 0) {
			return null
		}
		return path
	}

	const handleSubmit = async (formData: Record<string, string>) => {
		if (isLoading.value) return
		isLoading.value = true
		formError.value = ''

		const result = await login(formData['login-identifier'], formData['login-password'])
		if (result.success) {
			await fetchFriendshipData()
			const nextPath = validateRedirect(route.query.next)
			if (nextPath) {
				router.push(nextPath)
			} else if (user.value) {
				router.push(`/profile/${user.value.username}`)
			} else {
				router.push('/')
			}
		} else {
			formError.value = result.message || '登入失敗'
		}

		isLoading.value = false
	}
	onMounted(() => {
		validateRedirect()
	})
</script>
