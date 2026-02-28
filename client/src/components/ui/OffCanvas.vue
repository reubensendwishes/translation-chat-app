<template>
	<div class="offcanvas text-primary bg-default">
		<div class="offcanvas-header d-flex">
			<h2 class="offcavas-title">
				<slot name="header"></slot>
			</h2>
			<button
				type="button"
				@click="$emit('closeOffcanvas')"
				class="text-primary btn close-button"
			>
				<GSymbol style="font-size: 30px">close</GSymbol>
			</button>
		</div>
		<div class="offcanvas-body">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	import GSymbol from '../icons/GSymbol.vue'

	type Emit = {
		closeOffcanvas: []
	}
	defineEmits<Emit>()
</script>

<style scoped>
	.offcanvas {
		width: 393px;
		height: 100dvh;
		position: absolute;
		top: 0;
		border-right: 1px var(--color-text-muted) solid;
	}
	.offcanvas-header {
		padding: 0px 16px;
		align-items: center;
		border-bottom: 1px var(--color-text-muted) solid;
	}
	.offcavas-title {
		font-size: 17px;
		flex-grow: 1;
		text-align: center;
	}
	.offcanvas-body {
		height: calc(100% - 60px);
		padding: 0 16px;
	}
</style>
