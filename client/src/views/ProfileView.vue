<template>
	<main class="text-primary">
		<template v-if="hasProfile">
			<div class="user-info d-flex">
				<img class="user-avatar pill" :src="userData?.avatar" :alt="profileUsername" />
				<div class="wrapper">
					<div class="user-username">{{ profileUsername }}</div>
					<div class="profile-stats d-flex">
						<div
							v-for="(stat, index) in profileStats"
							:key="index"
							class="profile-stat"
						>
							<span>{{ stat.count }}</span
							><br /><span>{{ stat.name }}</span>
						</div>
					</div>
				</div>
				<div class="user-description text-secondary">{{ userData?.description }}</div>
				<RouterLink
					v-if="isOwner"
					class="profile-btn btn text-inverse bg-inverse"
					to="/editProfile"
					>編輯個人檔案</RouterLink
				>
				<button v-else class="profile-btn btn text-inverse bg-inverse">添加好友</button>
			</div>
			<div class="profile-tabs d-flex">
				<div
					class="profile-tab-wrapper"
					v-for="(postTabIcon, postTab, index) in postTabIcons"
					:key="index"
				>
					<button
						type="button"
						class="profile-tab btn"
						:class="profileTabClass(postTab)"
						@click="handleTabChange(postTab)"
					>
						<GSymbol style="font-size: 30px">{{ postTabIcon }}</GSymbol>
					</button>
				</div>
			</div>
			<div class="post-list">
				<img
					class="post"
					v-for="post in displayedPosts"
					:key="post._id"
					:src="post.imageUrl"
					:alt="post.content"
				/>
			</div>
			<div ref="loadMoreTrigger" class="load-more-trigger"></div>
			<div v-if="isLoadingPosts" class="post-loading-wrapper">
				<SpinnerIcon class="post-loading" spinner-color="primary" />
			</div>
			<div v-if="displayedPosts.length === 0 && !isLoadingPosts" class="no-posts-wrapper">
				<strong>沒有posts</strong>
			</div>
		</template>
		<template v-else><strong>Profile無法顯示</strong> </template>
	</main>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, onBeforeUnmount, useTemplateRef, nextTick } from 'vue'
	import { useRoute } from 'vue-router'
	import axios from 'axios'
	import GSymbol from '@/components/icons/GSymbol.vue'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'

	type UserData = {
		fullName: string
		description?: string
		avatar?: string
		isOwner: boolean
		friendCount: number
	}
	type Stat = {
		name: string
		count: number
	}
	type Post = {
		_id: string
		author: string
		content: string
		imageUrl: string
		createdAt: string
	}
	type PostTab = 'all' | 'marked'
	const route = useRoute()
	const hasProfile = ref<boolean>(false)
	const userData = ref<UserData | null>(null)
	const profileUsername = route.params.username as string
	const isOwner = ref(false)
	const activeTab = ref<PostTab>('all')
	const profileTabClass = (profileTab: string) => {
		if (activeTab.value === profileTab) {
			return ['text-primary', 'active']
		} else {
			return ['text-muted']
		}
	}
	const isLoadingPosts = ref<boolean>(false)
	const allPosts = ref<Post[]>([])
	const markedPosts = ref<Post[]>([])
	const totalPosts = ref<number>(0)
	const loadedTabs = ref<Set<string>>(new Set())
	const page = ref<Record<PostTab, number>>({ all: 1, marked: 1 })
	const hasMore = ref<Record<PostTab, boolean>>({ all: true, marked: true })
	const limit = 12
	const displayedPosts = computed(() => {
		return activeTab.value === 'all' ? allPosts.value : markedPosts.value
	})
	const loadMoreTriggerRef = useTemplateRef('loadMoreTrigger')
	let observer: IntersectionObserver | null = null

	const fetchPosts = async (tab: PostTab, pageNum: number = 1) => {
		if (isLoadingPosts.value) return
		if (pageNum === 1 && loadedTabs.value.has(tab)) return
		isLoadingPosts.value = true
		try {
			const res = await axios.get(
				`/api/posts/users/${profileUsername}?tab=${tab}&page=${pageNum}&limit=${limit}`,
			)
			const newPosts = res.data.posts

			if (pageNum === 1) {
				if (tab === 'all') {
					allPosts.value = newPosts
					totalPosts.value = res.data.pagination.totalPosts
				} else {
					markedPosts.value = newPosts
				}
				loadedTabs.value.add(tab)
			} else {
				if (tab === 'all') {
					allPosts.value.push(...newPosts)
				} else {
					markedPosts.value.push(...newPosts)
				}
			}

			hasMore.value[tab] = res.data.hasMore
			page.value[tab] = pageNum
		} catch (error) {
			console.error(`獲取${tab} posts 失敗`, error)
		} finally {
			isLoadingPosts.value = false
		}
	}

	const setupIntersectionObserver = () => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.isIntersecting &&
						hasMore.value[activeTab.value] &&
						!isLoadingPosts.value
					) {
						fetchPosts(activeTab.value, page.value[activeTab.value] + 1)
					}
				})
			},
			{ rootMargin: '0px 0px -60px 0px' },
		)

		if (loadMoreTriggerRef.value) {
			observer.observe(loadMoreTriggerRef.value)
		}
	}

	const handleTabChange = (tab: 'all' | 'marked') => {
		activeTab.value = tab
		if (!loadedTabs.value.has(tab)) {
			fetchPosts(tab, 1)
		}
		window.scrollTo(0, 0)
	}
	const profileStats = ref<Stat[]>([
		{ name: 'post', count: totalPosts.value },
		{ name: 'friend', count: userData.value?.friendCount ?? 0 },
	])

	const postTabIcons = ref<Record<PostTab, string>>({ all: 'post', marked: 'bookmark' })

	onMounted(async () => {
		try {
			const res = await axios.get(`/api/user/${route.params.username}`)
			hasProfile.value = true
			userData.value = res.data
			isOwner.value = res.data.isOwner
		} catch {
			hasProfile.value = false
		}
		await fetchPosts('all', 1)
		await nextTick()

		setupIntersectionObserver()
	})
	onBeforeUnmount(() => {
		observer?.disconnect()
	})
</script>

<style scoped>
	main {
		padding-bottom: 60px;
	}
	.user-info {
		flex-wrap: wrap;
		padding: 40px 16px 10px;
		gap: 20px;
	}
	.user-info .wrapper {
		align-self: center;
	}
	.user-avatar {
		width: 77px;
	}
	.user-username {
		margin-bottom: 10px;
	}
	.profile-stats {
		text-align: center;
		gap: 32px;
	}
	.user-description {
		flex-basis: 100%;
	}

	.profile-btn {
		font-size: 15px;
		padding: 6px 12px;
		border-radius: 8px;
	}
	.profile-tabs {
		padding: 10px 0px 0px;
		border-bottom: 1px var(--color-text-muted) solid;
		text-align: center;
		justify-content: space-around;
	}
	.profile-tab {
		padding: 10px 20px;
	}
	.profile-tab.active {
		border-bottom: 2px var(--color-text-primary) solid;
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
	.load-more-trigger {
		height: 1px;
	}
	.post-loading-wrapper {
		text-align: center;
		padding: 20px;
	}
	.post-loading {
		height: 50px;
		width: 50px;
	}
	.no-posts-wrapper {
		font-size: 30px;
		text-align: center;
		padding-top: 20px;
	}
</style>
