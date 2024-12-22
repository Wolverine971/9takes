<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Comment from './Comment.svelte';
	import { debounce } from '../../utils/debounce';
	import { deserialize } from '$app/forms';

	const dispatch = createEventDispatcher();

	export let parentType: string = 'comment';
	export let user: any;
	export let questionId: number;
	export let comments: any[];
	export let comment_count: number;
	export let parentData: any;
	export let key: number = 0; // Add this to force re-render
	export let onCommentsUpdate = () => {};

	$: lastDate = comments?.length ? comments[comments.length - 1]?.created_at || null : null;
	$: _comments = comments ? JSON.parse(JSON.stringify(comments)) : [];

	let loading = false;
	let observer: IntersectionObserver;
	let bottomSentinel: HTMLDivElement;

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
				comments = _comments; // Update parent
			}
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			loading = false;
		}
	}, 300);

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
				comments = _comments; // Update parent
				comment_count += 1;
			}
		} catch (error) {
			console.error('Error refreshing comments:', error);
		} finally {
			loading = false;
		}
	};

	onMount(() => {
		if (browser) {
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadMore();
					}
				},
				{ rootMargin: '100px' }
			);

			if (bottomSentinel) {
				observer.observe(bottomSentinel);
			}
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	function handleCommentUpdate(comment: any, index: number) {
		_comments[index] = comment;
		_comments = [..._comments];
		comments = _comments; // Update parent
	}
</script>

{#key key}
	<!-- Force re-render when key changes -->
	{#if browser && ((comments.length && parentType === 'question' && parentData?.flags?.userHasAnswered) || (comments.length && parentType === 'comment'))}
		{#each _comments as comment, index (comment.id)}
			<div transition:fade>
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
		{#if _comments.length < comment_count && parentData?.flags?.userHasAnswered}
			<div bind:this={bottomSentinel} class="sentinel">
				{#if loading}
					<div class="loading-skeleton">
						{#each Array(3) as _}
							<div class="skeleton-comment">
								<div class="skeleton-avatar"></div>
								<div class="skeleton-content">
									<div class="skeleton-line"></div>
									<div class="skeleton-line"></div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
{/key}

<style lang="scss">
	.sentinel {
		height: 20px;
		margin-top: 20px;
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
		}

		.skeleton-avatar {
			width: 78px;
			height: 30px;
			background: linear-gradient(
				90deg,
				var(--base-grey-1) 25%,
				var(--base-grey-2) 50%,
				var(--base-grey-1) 75%
			);
			background-size: 200% 100%;
			animation: shimmer 1.5s infinite;
			border-radius: var(--base-border-radius);
		}

		.skeleton-content {
			flex: 1;
		}

		.skeleton-line {
			height: 12px;
			margin: 0.5rem 0;
			background: linear-gradient(
				90deg,
				var(--base-grey-1) 25%,
				var(--base-grey-2) 50%,
				var(--base-grey-1) 75%
			);
			background-size: 200% 100%;
			animation: shimmer 1.5s infinite;
			border-radius: 4px;
		}
	}
</style>
