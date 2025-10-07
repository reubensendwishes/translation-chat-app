<template>
	<button type="button" class="btn text-primary" @click="toggleModal">
		<slot name="button"></slot>
		<Teleport :to="teleportTo">
			<div
				@focusin.stop
				@keydown.escape="isModalOpen = false"
				v-focus
				ref="modal"
				tabindex="-1"
				v-if="isModalOpen"
				class="modal text-primary"
			>
				<div class="modal-backdrop"></div>
				<div class="modal-content bg-default d-flex" :style="{ width }">
					<div class="modal-header">
						<h2 class="modal-title">
							<slot name="header"></slot>
						</h2>
						<button @click="isModalOpen = false" class="close-btn btn text-primary">
							<GSymbol style="font-size: 30px">close</GSymbol>
						</button>
					</div>
					<div class="modal-body">
						<slot></slot>
					</div>
				</div>
				<div @focus="focusModal" tabindex="0" class="prevent-tab"></div>
			</div>
		</Teleport>
	</button>
</template>

<script setup lang="ts">
	import { ref, computed, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'

	import GSymbol from '@/components/icons/GSymbol.vue'

	// types
	type Props = {
		teleportTo?: string
		width?: string
	}

	// props
	const { teleportTo = 'body', width = 'min(393px, 100%)' } = defineProps<Props>()

	// models
	const model = defineModel<boolean | undefined>()

	const modalRef = useTemplateRef('modal')
	const internalOpen = ref(false)
	const isControlled = computed(() => {
		return model.value !== undefined
	})
	const isModalOpen = computed({
		get: () => (isControlled.value ? model.value! : internalOpen.value),
		set: (val: boolean) => {
			if (isControlled.value) {
				model.value = val
			} else {
				internalOpen.value = val
			}
		},
	})
	const toggleModal = async () => {
		isModalOpen.value = !isModalOpen.value
	}

	const focusModal = () => {
		modalRef.value?.focus()
	}

	onMounted(() => {
		document.body.addEventListener('focusin', focusModal)
	})
	onBeforeUnmount(() => {
		document.body.removeEventListener('focusin', focusModal)
	})

	// directives
	const vFocus = {
		mounted: (el: HTMLElement) => el.focus(),
	}
</script>

<style scoped>
	.modal {
		position: fixed;
		inset: 0;
		z-index: 1000;
	}
	.modal-backdrop {
		width: 100%;
		height: 100%;
		background-color: rgba(133, 133, 133, 0.5);
		backdrop-filter: blur(1px);
	}
	.modal-content {
		max-height: 90dvh;
		position: absolute;
		inset: 50% auto auto 50%;
		transform: translate(-50%, -50%);
		border-radius: 20px;
		padding: 10px 0px 16px;
		flex-direction: column;
	}
	.modal-header {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		border-bottom: 1px var(--color-text-muted) solid;
		padding: 0 16px 8px;
		align-items: center;
	}
	.modal-title {
		flex: 1 0 auto;
		text-align: center;
		font-size: 20px;
		grid-column: 1/2;
		grid-row: 1;
	}
	.close-btn {
		grid-column: 1/2;
		grid-row: 1;
		justify-self: end;
	}
	.modal-body {
		overflow-y: auto;
	}
</style>
