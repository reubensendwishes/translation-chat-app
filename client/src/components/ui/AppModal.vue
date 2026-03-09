<template>
	<button type="button" class="btn" @click="toggleModal">
		<slot name="button"></slot>
	</button>
	<Teleport :to="teleportTo">
		<div v-if="isModalOpen" class="modal text-primary">
			<div class="modal-backdrop"></div>
			<div class="modal-content">
				<div class="modal-header d-flex">
					<h2 class="modal-title"><slot name="header"></slot></h2>
					<button @click="isModalOpen = false" class="btn text-primary">
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
	import GSymbol from '@/components/icons/GSymbol.vue'
	import { ref, computed } from 'vue'

	type Props = {
		teleportTo?: string
	}

	const { teleportTo = 'body' } = defineProps<Props>()

	const internalOpen = ref(false)

	const model = defineModel<boolean | undefined>()
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
	const toggleModal = () => {
		isModalOpen.value = !isModalOpen.value
	}
</script>

<style scoped>
	.modal {
		position: absolute;
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
		background-color: white;
		position: absolute;
		inset: 50% auto auto 50%;
		transform: translate(-50%, -50%);
		width: max(393px, 50%);
		border-radius: 20px;
		padding: 20px 0px;
	}
	.modal-header {
		border-bottom: 1px var(--color-text-muted) solid;
		padding: 0 16px 8px;
		align-items: center;
	}
	.modal-title {
		flex: 1 0 auto;
		text-align: center;
		font-size: 20px;
	}
</style>
