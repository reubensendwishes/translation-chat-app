import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { FriendShip } from '@/types'
export const useFriendStore = defineStore('friend', () => {
	const friendships = ref<FriendShip[]>([])

	const friends = computed(() => {
		return friendships.value
			.filter((friendship) => friendship.status === 'accepted')
			.map((friendship) => {
				return { requestId: friendship._id, friendData: friendship.friendData }
			})
	})
	const receivedRequests = computed(() => {
		return friendships.value
			.filter(
				(friendship) =>
					friendship.status === 'pending' && friendship.myRole === 'recipient',
			)
			.map((friendship) => {
				return {
					requestId: friendship._id,
					requesterData: friendship.friendData,
					updatedAt: friendship.updatedAt,
				}
			})
	})
	const sentRequests = computed(() => {
		return friendships.value
			.filter(
				(friendship) =>
					friendship.status === 'pending' && friendship.myRole === 'requester',
			)
			.map((friendship) => {
				return {
					requestId: friendship._id,
					recipientId: friendship.friendData._id,
				}
			})
	})
	// const friendMap = computed(
	// 	() => new Map(friends.value.map((friend) => [friend.friendData._id, friend.friendData])),
	// )

	const addFriendship = (friendship: FriendShip) => {
		friendships.value.unshift(friendship)
	}
	const removeFriendship = (requestId: string) => {
		const index = friendships.value.findIndex((friendship) => friendship._id === requestId)
		if (index !== -1) friendships.value.splice(index, 1)
	}
	const updateStatusToAccepted = (requestId: string) => {
		const friendship = friendships.value.find((friendship) => friendship._id === requestId)
		if (friendship) {
			friendship.status = 'accepted'
		}
	}
	const setFriendshipData = (newFriendships: FriendShip[]) => {
		friendships.value = newFriendships
	}
	return {
		friends,
		receivedRequests,
		sentRequests,
		updateStatusToAccepted,
		addFriendship,
		setFriendshipData,
		removeFriendship,
	}
})
