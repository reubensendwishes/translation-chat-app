<template>
	<div class="profile-field d-flex">
		<label class="field-label" :for="field.label">{{ field.label }}</label>
		<template v-if="field.type">
			<textarea
				class="field-content"
				v-model="model"
				:name="field.label"
				:id="field.label"
				:placeholder="field.label"
				:maxLength="field.maxLength"
			></textarea>
			<span class="field-counter text-muted">{{ model.length + '/' + field.maxLength }}</span>
		</template>
	</div>
</template>

<script setup lang="ts">
	import type { Field } from '@/types'

	interface Props {
		field: Field
	}

	const { field } = defineProps<Props>()

	const model = defineModel<Field['value']>({ required: true })
</script>

<style scoped>
	.profile-field {
		position: relative;
		flex-direction: column;
		font-size: 17px;
	}
	.field-label {
		padding-bottom: 20px;
	}
	.field-content {
		border: solid 1px var(--color-text-muted);
		border-radius: 10px;
		padding: 10px;
		font-size: 17px;
	}
	.field-counter {
		position: absolute;
		inset: auto 10px 10px auto;
		font-size: 13px;
	}
</style>
