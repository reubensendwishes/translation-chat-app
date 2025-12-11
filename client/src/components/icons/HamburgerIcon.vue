<template>
	<div class="hamburger-icon"></div>
</template>
<style scoped>
	.hamburger-icon {
		position: relative;
		height: 1px;
		width: 20px;
		transition: 1s;
		line-height: 1;
		margin: 0 auto;
	}
	.hamburger-icon::before {
		content: '';
		position: absolute;
		height: 1px;
		width: 20px;
		left: 0px;
		top: -6px;
		transition: 1s;
	}
	.hamburger-icon::after {
		content: '';
		position: absolute;
		height: 1px;
		width: 20px;
		left: 0px;
		bottom: -6px;
		transition: 1s;
	}
	.hamburger-icon.expanded {
		background-color: transparent;
	}
	.hamburger-icon.expanded::before {
		top: 0;
		rotate: 45deg;
	}
	.hamburger-icon.expanded::after {
		bottom: 0;
		rotate: -45deg;
	}
</style>
