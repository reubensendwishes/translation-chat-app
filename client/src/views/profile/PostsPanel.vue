<template>
	<div class="posts-panel">
		<div class="profile-tabs d-flex">
			<div
				class="profile-tab-wrapper"
				v-for="({ name, icon }, index) in postTabs"
				:key="index"
			>
				<button
					type="button"
					class="profile-tab btn"
					:class="postTabClasses(name)"
					@click="handleTabChange(name)"
				>
					<GSymbol style="font-size: 30px">{{ icon }}</GSymbol>
				</button>
			</div>
		</div>
		<div class="post-list">
			<AppModal v-for="post in displayedPosts" :key="post._id" width="fit-content">
				<template #button>
					<img
						class="post-img"
						:srcset="getImgSrcset(post.imageStoragePaths)"
						sizes="(max-width: 400px) 100vw,250px"
						:alt="post.content"
					/>
				</template>
				<template #header>{{
					t('profile.detail.title', { username: profileUsername })
				}}</template>
				<PostDetail
					@translate="translatePost"
					:profile-avatar="profileAvatar"
					:post-data="post"
					:profile-username="profileUsername"
					:get-img-srcset="getImgSrcset"
				/>
			</AppModal>
		</div>
		<div ref="loadMoreTrigger" class="load-more-trigger"></div>
		<div v-if="isLoadingPosts" class="post-loading">
			<SpinnerIcon spinner-color="primary" spinner-width="50px" spinner-height="50px" />
		</div>
		<div v-if="displayedPosts?.length === 0 && !isLoadingPosts" class="no-posts-wrapper">
			<strong>{{ `${t('profile.noPost')}` }}</strong>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, nextTick, useTemplateRef, onMounted, onBeforeUnmount } from 'vue'
	import axios from 'axios'
	import { useI18n } from 'vue-i18n'

	import GSymbol from '@/components/icons/GSymbol.vue'
	import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
	import type { Post, PostTab } from '@/types'
	import { handleRequestError } from '@/utils/helpers'
	import AppModal from '@/components/ui/AppModal.vue'
	import PostDetail from './PostDetail.vue'

	// types
	type Props = {
		postTabs: PostTab[]
		defaultTab: string
		postApiUrl: Record<PostTab['name'], string>
		profileUsername: string
		profileAvatar: string
	}

	// props
	const { postTabs, defaultTab, postApiUrl, profileUsername, profileAvatar } =
		defineProps<Props>()

	// vue-i18n
	const { t } = useI18n()

	const activeTab = ref<PostTab['name']>(defaultTab)
	const postsByTab = ref<Record<PostTab['name'], Post[]>>({})
	const displayedPosts = computed(() => {
		return postsByTab.value[activeTab.value]
	})
	const loadedTabs = ref<Set<string>>(new Set())
	const isLoadingPosts = ref<boolean>(false)
	const limit = 12
	const cursor = ref<Record<PostTab['name'], string>>({})
	const fetchPosts = async (tabName: PostTab['name']) => {
		if (isLoadingPosts.value) return
		if (!cursor.value[tabName] && loadedTabs.value.has(tabName)) return
		isLoadingPosts.value = true
		try {
			const res = await axios.get(postApiUrl[activeTab.value], {
				params: { cursor: cursor.value[tabName], limit },
			})
			const newPosts = res.data.posts
			if (!cursor.value[tabName]) {
				postsByTab.value[tabName] = newPosts
				loadedTabs.value.add(tabName)
			} else {
				postsByTab.value[tabName].push(...newPosts)
			}
			cursor.value[tabName] = res.data.nextCursor
		} catch (error) {
			handleRequestError(error)
		} finally {
			isLoadingPosts.value = false
		}
	}
	const loadMoreTriggerRef = useTemplateRef('loadMoreTrigger')
	let observer: IntersectionObserver | null = null
	const setupIntersectionObserver = () => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.isIntersecting &&
						cursor.value[activeTab.value] &&
						!isLoadingPosts.value
					) {
						fetchPosts(activeTab.value)
					}
				})
			},
			{ rootMargin: '0px 0px -60px 0px' },
		)

		if (loadMoreTriggerRef.value) {
			observer.observe(loadMoreTriggerRef.value)
		}
	}
	const postTabClasses = (tabName: PostTab['name']) => {
		if (activeTab.value === tabName) {
			return ['text-primary', 'active']
		} else {
			return ['text-muted']
		}
	}
	const handleTabChange = (tabName: PostTab['name']) => {
		activeTab.value = tabName
		if (!loadedTabs.value.has(tabName)) {
			fetchPosts(tabName)
		}
		window.scrollTo(0, 0)
	}
	const getImageUrl = (path: string) => {
		return `https://storage.googleapis.com/translatation-chat-app.firebasestorage.app/${path}`
	}
	const getImgSrcset = (paths: Post['imageStoragePaths']) => {
		return `${getImageUrl(paths.small)} 600w,${getImageUrl(paths.large)} 1200w`
	}

	const translatePost = (
		resolve: (value?: void) => void,
		postId: string,
		translation?: string,
	) => {
		const targetPost = postsByTab.value[activeTab.value].find((post) => {
			return post._id === postId
		})
		if (!targetPost) {
			resolve()
			return
		}
		if (translation) {
			targetPost.translation = translation
			targetPost.isTranslated = true
		} else {
			targetPost.isTranslated = !targetPost.isTranslated
		}

		resolve()
	}
	onMounted(async () => {
		await fetchPosts('all')
		await nextTick()
		setupIntersectionObserver()
	})
	onBeforeUnmount(() => {
		observer?.disconnect()
	})
</script>

<style scoped>
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
		width: min(100dvw, 900px);
		margin: 0 auto;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
	}
	@media (min-width: 744px) {
		.post-list {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		}
	}
	.post-img {
		width: 100%;
		aspect-ratio: 3/4;
	}
	.load-more-trigger {
		height: 1px;
	}
	.post-loading {
		text-align: center;
		padding: 20px;
	}
	.no-posts-wrapper {
		font-size: 30px;
		text-align: center;
		padding-top: 20px;
	}
</style>
