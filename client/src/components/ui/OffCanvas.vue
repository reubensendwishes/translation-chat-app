<template>
	<button class="btn text-primary" @click="toggleOffcanvas">
		<slot name="button"></slot>
		<Teleport :to="teleportTo">
			<FadeTranslate transition-direction="right">
				<div v-if="isOffcanvasOpen" class="offcanvas text-primary bg-default">
					<div class="offcanvas-header">
						<h2 class="offcavas-title">
							<slot name="header"></slot>
						</h2>
						<button
							type="button"
							@click="isOffcanvasOpen = false"
							class="text-primary btn close-btn"
						>
							<GSymbol style="font-size: 30px">close</GSymbol>
						</button>
					</div>
					<div class="offcanvas-body">
						<slot></slot>
					</div>
				</div>
			</FadeTranslate>
		</Teleport>
	</button>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	import GSymbol from '@/components/icons/GSymbol.vue'
	import FadeTranslate from '../transitions/FadeTranslate.vue'

	// types
	type Props = {
		teleportTo: string
	}
	type Emit = {
		closeOffcanvas: []
	}

	// props
	const { teleportTo } = defineProps<Props>()

	// emits
	defineEmits<Emit>()

	const isOffcanvasOpen = ref(false)
	const toggleOffcanvas = () => {
		isOffcanvasOpen.value = !isOffcanvasOpen.value
	}
</script>

<style scoped>
	.offcanvas {
		width: min(393px, 100%);
		height: 100dvh;
		position: absolute;
		top: 0;
		border-right: 1px var(--color-text-muted) solid;
	}
	.offcanvas-header {
		padding: 0px 16px;
		align-items: center;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		border-bottom: 1px var(--color-text-muted) solid;
	}
	.offcavas-title {
		font-size: 16px;
		text-align: center;
		grid-row: 1;
		grid-column: 1;
	}
	.close-btn {
		grid-row: 1;
		grid-column: 1;
		justify-self: end;
	}
	.offcanvas-body {
		height: calc(100% - 60px);
		padding: 0 16px;
	}
</style>
