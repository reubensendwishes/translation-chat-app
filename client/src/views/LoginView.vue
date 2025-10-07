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
	import { onMounted, ref, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import type { LocationQueryValue } from 'vue-router'
	import { storeToRefs } from 'pinia'
	import { useI18n } from 'vue-i18n'

	import AuthPanel from '@/components/auth/Panel.vue'
	import type { InputData } from '@/components/ui/FloatLabelInput.vue'
	import { useAuth } from '@/composables/useAuth'
	import { useAuthStore } from '@/stores/AuthStore'

	// router
	const route = useRoute()
	const router = useRouter()

	// stores
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)

	// composables
	const { login } = useAuth()

	// vue-i18n
	const { t } = useI18n()

	const authCta = computed(() => {
		return {
			content: t('auth.ctn.noAccount'),
			linkAdviceName: 'signUp',
			linkAdviceText: t('auth.signUp'),
		}
	})
	const inputDatas: InputData[] = [
		{ type: 'text', id: 'login-identifier', label: 'usernameOrEmail' },
		{
			type: 'password',
			id: 'login-password',
			label: 'password',
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
			const nextPath = validateRedirect(route.query.next)
			if (nextPath) {
				router.push(nextPath)
			} else if (user.value) {
				router.push(`/profile/${user.value.username}`)
			} else {
				router.push('/')
			}
		} else {
			formError.value = result.detail || 'Login failed'
		}

		isLoading.value = false
	}
	onMounted(() => {
		validateRedirect()
	})
</script>
