<!-- lib/components/molecules/Comments.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import Comment from './Comment.svelte';
	import SkeletonLoader from '../atoms/SkeletonLoader.svelte';
	import Spinner from '../atoms/Spinner.svelte';
	import { debounce } from '../../utils/debounce';

	const dispatch = createEventDispatcher();

	export let parentType: string = 'comment';
	export let user: any;
	export let questionId: number;
	export let comments: any[] = [];
	export let comment_count: number = 0;
	export let parentData: any;
	export let key: number = 0; // Used to force re-render

	// Track the date of last comment for pagination
	$: lastDate = comments?.length ? comments[comments.length - 1]?.created_at || null : null;

	// Create a reactive deep copy to avoid mutation issues
	$: _comments = comments ? JSON.parse(JSON.stringify(comments)) : [];

	let loading = false;
	let initialLoading = false;
	let observer: IntersectionObserver | null = null;
	let bottomSentinel: HTMLDivElement;

	// Load more comments when scrolling to the bottom
	const loadMore = debounce(async () => {
		if (loading || _comments.length >= comment_count) return;
		loading = true;

		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${
					parentType === 'question' ? questionId : parentData.id
				}&lastDate=${lastDate}&range=${_comments.length || 0}`
			);

			const newComments = await response.json();

			if (Array.isArray(newComments) && newComments.length) {
				_comments = [..._comments, ...newComments];
				comments = _comments; // Update parent array reference
			}
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			loading = false;
		}
	}, 300);

	// Refresh comments after new comment is added
	const refreshComments = async () => {
		if (parentType !== 'question') return;

		dispatch('commentAdded');
		initialLoading = _comments.length === 0;
		loading = true;

		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${questionId}&lastDate=${lastDate}`
			);

			const newComments = await response.json();

			if (Array.isArray(newComments) && newComments.length) {
				_comments = newComments;
				comments = _comments; // Update parent array reference
				comment_count += 1;
			}
		} catch (error) {
			console.error('Error refreshing comments:', error);
		} finally {
			loading = false;
		}
	};

	// Update a single comment in the array
	function handleCommentUpdate(comment: any, index: number) {
		_comments[index] = comment;
		_comments = [..._comments]; // Create new array to trigger reactivity
		comments = _comments; // Update parent
	}

	// Set up infinite scroll using Intersection Observer
	onMount(() => {
		if (browser) {
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadMore();
					}
				},
				{ rootMargin: '200px' } // Load more before reaching the very bottom
			);

			if (bottomSentinel) {
				observer.observe(bottomSentinel);
			}
		}
	});

	// Clean up observer on component destruction
	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

{#key key}
	{#if browser && ((comments.length && parentType === 'question' && parentData?.flags?.userHasAnswered) || (comments.length && parentType === 'comment'))}
		<div class="flex flex-col md:gap-4">
			{#each _comments as comment, index (comment.id)}
				<div in:fade={{ duration: 300, delay: index * 50 }}>
					<Comment
						{questionId}
						{comment}
						{user}
						{parentData}
						on:commentAdded={refreshComments}
						on:commentUpdated={(e) => handleCommentUpdate(e.detail, index)}
					/>
				</div>
			{/each}

			<!-- Initial loading state -->
			{#if initialLoading && _comments.length === 0}
				<div class="space-y-4 py-4">
					{#each Array(3) as _, i}
						<div
							class="rounded-lg bg-white/80 p-4 shadow-sm"
							in:fade={{ duration: 300, delay: i * 100 }}
						>
							<div class="flex gap-4">
								<SkeletonLoader variant="circular" width={32} height={32} />
								<div class="flex-1">
									<SkeletonLoader variant="text" width="30%" className="mb-2" />
									<SkeletonLoader variant="text" count={2} />
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Infinite scroll sentinel -->
			{#if _comments.length < comment_count && parentData?.flags?.userHasAnswered}
				<div bind:this={bottomSentinel} class="my-4">
					{#if loading && !initialLoading}
						<div class="flex justify-center py-4">
							<Spinner size="md" color="primary">Loading more comments...</Spinner>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{:else if parentData?.flags?.userHasAnswered && !comments.length}
		<div class="py-8 text-center text-neutral-600">
			<p>No comments yet. Be the first to share your thoughts!</p>
		</div>
	{/if}
{/key}

<style>
	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
	:global(.skeleton) {
		--skeleton-bg: #f3f4f6;
		--skeleton-bg-dark: #374151;
	}
</style>
