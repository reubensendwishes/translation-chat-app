<template>
	<div class="float-label-group text-muted">
		<div :class="validationData?.state === 'invalid' && 'invalid'" class="input-wrapper d-flex">
			<input
				class="float-input text-muted"
				:id="fieldData.id"
				:type="fieldType"
				v-model="model"
				@[inputEvent]="emit('blur')"
				@input="emit('input')"
			/>
			<label class="float-label" :class="model && 'floating'" :for="fieldData.id">{{
				t('auth.' + fieldData.label)
			}}</label>

			<div class="status-icon-wrapper">
				<GSymbol
					v-if="validationData?.state === 'valid'"
					class="status-icon"
					font-size="20px"
				>
					check_circle
				</GSymbol>
				<GSymbol
					v-else-if="validationData?.state === 'invalid'"
					class="status-icon text-warning"
					font-size="20px"
				>
					cancel
				</GSymbol>
			</div>

			<button
				v-if="fieldData.type === 'password'"
				@click="isPasswordVisible = !isPasswordVisible"
				class="visibility-toggle-btn text-muted"
				type="button"
			>
				<GSymbol v-show="isPasswordVisible">visibility</GSymbol>
				<GSymbol v-show="!isPasswordVisible">visibility_off</GSymbol>
			</button>
		</div>

		<span v-if="validationData?.state === 'invalid'" class="field-error text-warning">
			{{ validationData?.error }}
		</span>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useI18n } from 'vue-i18n'

	import GSymbol from '@/components/icons/GSymbol.vue'
	import type { FieldData, ValidationData } from '../../types.ts'

	// types
	type Props = {
		fieldData: FieldData
		validationData?: ValidationData
	}
	type Emits = {
		blur: []
		input: []
	}

	// props
	const { fieldData, validationData } = defineProps<Props>()

	// emits
	const emit = defineEmits<Emits>()

	// models
	const model = defineModel<string>({})

	// vue-i18n
	const { t } = useI18n()

	const inputEvent = computed(() => {
		return validationData ? 'blur' : null
	})

	const isPasswordVisible = ref(false)

	const fieldType = computed(() => {
		if (isPasswordVisible.value) return 'text'
		return fieldData.type
	})
</script>

<style>
	.float-label-group {
		font-size: 16px;
	}
	.float-label-group > .input-wrapper {
		position: relative;
		gap: 8px;
		border-radius: 3px;
		border: 1px solid var(--color-text-muted);
	}
	.float-label-group > .input-wrapper.invalid-input {
		border-color: var(--color-text-warning);
	}
	.float-label-group > .input-wrapper > *:last-child {
		margin-right: 8px;
	}
	.float-input {
		width: 100%;
		height: 38px;
		outline: none;
		border: none;
		padding: 15px 8px 1px;
		font: inherit;
	}
	.float-input:-webkit-autofill {
		-webkit-text-fill-color: var(--color-text-muted);
		-webkit-box-shadow: 0 0 0 1000px var(--color-bg-default) inset;
	}
	.float-label {
		position: absolute;
		transform-origin: top left;
		line-height: 38px;
		left: 8px;
		transition: transform 0.2s ease;
		pointer-events: none;
	}
	.float-input:focus + .float-label,
	.float-label.floating {
		transform: scale(0.75) translateY(-8px);
	}
	.status-icon-wrapper {
		width: 30px;
	}
	.float-label-group .status-icon {
		line-height: 38px;
	}
	.float-label-group > .field-error {
		font-size: 12px;
	}
</style>
