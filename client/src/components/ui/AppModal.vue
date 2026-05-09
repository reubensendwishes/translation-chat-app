<template>
	<Teleport :to="teleportTo">
		<div
			@focusin.stop
			@keydown.esc="emit('close')"
			v-bind="$attrs"
			v-focus
			ref="modal"
			tabindex="-1"
			class="modal text-primary"
		>
			<div v-if="hasBackdrop" class="modal-backdrop" @click="emit('close')"></div>
			<div class="modal-content bg-default d-flex" :style="{ width }">
				<div class="modal-header">
					<h2 class="modal-title">
						<slot name="title"></slot>
					</h2>
					<button @click="emit('close')" class="close-btn btn text-primary">
						<GSymbol style="font-size: 30px">close</GSymbol>
					</button>
				</div>
				<div class="modal-body">
					<slot></slot>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
	import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue'

	import GSymbol from '@/components/icons/GSymbol.vue'

	// types
	type Props = {
		teleportTo?: string
		width?: string
		hasBackdrop?: boolean
	}
	type Emits = {
		close: []
	}

	// props
	const {
		teleportTo = 'body',
		width = 'min(393px, 100%)',
		hasBackdrop = true,
	} = defineProps<Props>()

	// emits
	const emit = defineEmits<Emits>()

	// options
	defineOptions({
		inheritAttrs: false,
	})

	const modalRef = useTemplateRef('modal')
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

<style>
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
		max-width: 100dvw;
		max-height: 90dvh;
		position: absolute;
		inset: 50% auto auto 50%;
		transform: translate(-50%, -50%);
		border-radius: 16px;
		flex-direction: column;
	}
	.modal-header {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		border-bottom: 1px var(--color-text-muted) solid;
		padding: 16px;
		align-items: center;
	}
	.modal-title {
		flex: 1 0 auto;
		text-align: center;
		font-size: 20px;
		grid-column: 1/2;
		grid-row: 1;
	}
	.modal-header > .close-btn {
		overflow: hidden;
		height: 20px;
		width: 20px;
		grid-column: 1/2;
		grid-row: 1;
		justify-self: end;
	}
	.modal-body {
		padding: 16px;
		overflow-y: auto;
	}
</style>
