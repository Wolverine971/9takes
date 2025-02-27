<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import Comment from './Comment.svelte';
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
		<div class="comments-container">
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

			<!-- Infinite scroll sentinel -->
			{#if _comments.length < comment_count && parentData?.flags?.userHasAnswered}
				<div bind:this={bottomSentinel} class="load-more-sentinel">
					{#if loading}
						<div class="loading-skeleton">
							{#each Array(2) as _, i}
								<div class="skeleton-comment" in:fade={{ duration: 300, delay: i * 100 }}>
									<div class="skeleton-avatar"></div>
									<div class="skeleton-content">
										<div class="skeleton-line" style="width: 95%"></div>
										<div class="skeleton-line" style="width: 80%"></div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{:else if parentData?.flags?.userHasAnswered && !comments.length}
		<div class="empty-comments">
			<p>No comments yet. Be the first to share your thoughts!</p>
		</div>
	{/if}
{/key}

<style lang="scss">
	.comments-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.load-more-sentinel {
		height: 10px;
		margin: 1rem 0;
	}

	.empty-comments {
		text-align: center;
		padding: 2rem 0;
		color: var(--dark-gray);
	}

	.loading-skeleton {
		@keyframes shimmer {
			0% {
				background-position: -200% 0;
			}
			100% {
				background-position: 200% 0;
			}
		}

		.skeleton-comment {
			display: flex;
			gap: 1rem;
			padding: 1rem;
			margin: 0.5rem 0;
			background: rgba(255, 255, 255, 0.8);
			border-radius: var(--base-border-radius);
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		}

		.skeleton-avatar {
			width: 80px;
			height: 32px;
			background: linear-gradient(
				90deg,
				var(--light-gray) 25%,
				var(--medium-gray) 50%,
				var(--light-gray) 75%
			);
			background-size: 200% 100%;
			animation: shimmer 1.5s infinite;
			border-radius: var(--base-border-radius);
		}

		.skeleton-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.skeleton-line {
			height: 12px;
			background: linear-gradient(
				90deg,
				var(--light-gray) 25%,
				var(--medium-gray) 50%,
				var(--light-gray) 75%
			);
			background-size: 200% 100%;
			animation: shimmer 1.5s infinite;
			border-radius: 4px;
		}
	}
</style>
