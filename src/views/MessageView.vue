<template>
	<main class="text-primary">
		<ul class="contact-list bg-default">
			<li v-for="contact in contactList" :key="contact.id">
				<img class="pill" :src="contact.avatar" :alt="contact.name" />
			</li>
		</ul>
		<div class="chat-box">
			<div class="chat-header bg-default">
				<div class="chat-header-left">
					<img
						class="contact-avatar pill"
						:src="currentContact.avatar"
						:alt="currentContact.name"
					/>
					<div class="contact-info">
						<div class="contact-name">{{ currentContact.name }}</div>
						<div class="contact-state text-muted">{{ currentContact.state }}</div>
					</div>
				</div>
				<div class="chat-header-right"><GSymbol>info</GSymbol></div>
			</div>
			<div class="chat-content">
				<div
					class="message text-inverse pill"
					v-for="(message, index) in currentContact.messages"
					:class="!message.fromMe ? ['from-me', 'bg-inverse'] : 'bg-secondary'"
					:key="index"
				>
					{{ message.content }}
				</div>
			</div>
			<div class="chat-input-wrapper pill">
				<div
					class="chat-input"
					role="textbox"
					contenteditable="true"
					data-placeholder="訊息......"
				></div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { Contact } from '@/types'
	import ContactTest from '@/assets/contact-test.png'
	import GSymbol from '@/components/icons/GSymbol.vue'
	const contactList = ref<Contact[]>([{ avatar: ContactTest, id: '123', name: 'test' }])

	const currentContact = ref({
		avatar: ContactTest,
		name: 'reuben',
		state: '在線中',
		messages: [
			{ content: 'eresr', fromMe: true },
			{ content: 'eresqwer', fromMe: false },
		],
	})
</script>

<style scoped>
	main {
		padding-bottom: 60px;
		display: flex;
		height: calc(100vh);
	}
	.contact-list {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		width: 90px;
		border-right: 1px var(--color-text-muted) solid;
		padding: 16px 0;
		gap: 16px;
		vertical-align: top;
	}
	.contact-list img {
		width: 44px;
		height: 44px;
	}
	.chat-box {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.chat-box img {
		width: 44px;
		height: 44px;
	}
	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
		height: 76px;
		border-bottom: 1px var(--color-text-muted) solid;
	}
	.chat-header-left {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.contact-name {
		font-size: 17px;
		margin-bottom: 5px;
	}
	.contact-state {
		font-size: 13px;
		margin-bottom: 5px;
	}
	.chat-content {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: start;
		margin-left: 10px;
	}
	.message {
		padding: 4px 12px;
	}
	.message.from-me {
		align-self: end;
		margin-left: 0px;
		margin-right: 10px;
	}
	.message:first-of-type {
		margin-top: 3px;
	}
	.message:not(:last-of-type) {
		margin-bottom: 3px;
	}
	.chat-input-wrapper {
		width: calc(100% - 32px);
		border: 1px var(--color-text-muted) solid;
		margin: 16px;
		padding: 10px 20px;
	}
	.chat-input {
		padding: 10px;
	}

	.chat-input:empty::before {
		content: attr(data-placeholder);
		color: var(--color-text-muted);
		pointer-events: none;
	}
</style>
