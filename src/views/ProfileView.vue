<template>
	<main class="text-primary">
		<div class="user-info">
			<img class="user-avatar pill" :src="user.avatar" :alt="user.id" />
			<div class="wrapper">
				<div class="user-id">{{ user.id }}</div>
				<RouterLink class="edit-btn btn pill text-inverse bg-inverse" to="/editProfile"
					>編輯個人檔案</RouterLink
				>
			</div>
			<div class="user-description text-secondary">{{ user.description }}</div>
		</div>
		<div class="profile-stats">
			<div v-for="(stat, index) in profileStats" :key="index" class="profile-stat">
				<span>{{ stat.count }}</span
				><br /><span class="text-muted">{{ stat.name }}</span>
			</div>
		</div>
		<div class="profile-tabs">
			<button
				type="button"
				v-for="(profileTab, index) in profileTabs"
				:key="index"
				class="text-muted"
			>
				<GSymbol style="font-size: 30px">{{ profileTab }}</GSymbol>
			</button>
		</div>
		<div class="post-list">
			<img
				class="post"
				v-for="(post, index) in posts"
				:key="index"
				:src="post.src"
				:alt="post.name"
			/>
		</div>
	</main>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import ContactTest from '@/assets/contact-test.png'
	import GSymbol from '@/components/icons/GSymbol.vue'
	const user = {
		avatar: ContactTest,
		id: '123',
		description: '呱'.repeat(60),
		posts: ['123', '123'],
		friends: ['123', '123'],
	}

	interface Stat {
		name: string
		count: number
	}
	const profileStats = ref<Stat[]>([
		{ name: 'post', count: user.posts.length },
		{ name: 'friend', count: user.friends.length },
	])

	const profileTabs = ref<string[]>(['post', 'bookmark'])

	interface Post {
		name: string
		src: string
	}
	const posts = ref<Post[]>([
		{ name: 'trts', src: ContactTest },
		{ name: 'trts', src: ContactTest },
		{ name: 'trts', src: ContactTest },
		{ name: 'trts', src: ContactTest },
	])
</script>

<style scoped>
	main {
		padding-bottom: 60px;
	}
	.user-info {
		display: flex;
		flex-wrap: wrap;
		padding: 40px 16px 10px;
		gap: 10px;
	}
	.user-id {
		font-size: 21px;
		margin-bottom: 10px;
	}
	.edit-btn {
		padding: 4px 12px;
	}
	.user-description {
		flex-basis: 100%;
	}
	.profile-stats {
		display: flex;
		padding: 11px 16px 10px;
		border-top: 1px var(--color-text-muted) solid;
		text-align: center;
		justify-content: space-around;
	}

	.profile-tabs {
		display: flex;
		padding: 10px 16px 11px;
		border-bottom: 1px var(--color-text-muted) solid;
		text-align: center;
		justify-content: space-around;
	}
	.post-list {
		display: grid;
		justify-items: stretch;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
	}
	.post {
		aspect-ratio: 3/4;
	}
</style>
