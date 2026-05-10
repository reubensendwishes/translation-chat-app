<template>
	<div class="offcanvas text-primary bg-default">
		<div class="offcanvas-header">
			<h2 class="offcavas-title">
				<slot name="title"></slot>
			</h2>
			<button type="button" @click="emit('close')" class="text-primary btn close-btn">
				<GSymbol style="font-size: 30px">close</GSymbol>
			</button>
		</div>
		<div class="offcanvas-body">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	import GSymbol from '@/components/icons/GSymbol.vue'

	type Emit = {
		close: []
	}

	// emits
	const emit = defineEmits<Emit>()
</script>

<style>
	.offcanvas {
		width: min(393px, 100%);
		height: 100dvh;
		position: absolute;
		top: 0;
		border-right: 1px var(--color-text-muted) solid;
	}
	.offcanvas-header {
		padding: 8px 16px;
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
	.offcanvas-header > .close-btn {
		overflow: hidden;
		padding: 0;
		height: 20px;
		width: 20px;
		grid-row: 1;
		grid-column: 1;
		justify-self: end;
	}
	.offcanvas-body {
		height: calc(100% - 60px);
		padding: 0 16px;
	}
</style>
