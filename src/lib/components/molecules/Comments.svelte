<!-- src/lib/components/molecules/Comments.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';
	import Comment from './Comment.svelte';
	import Skeleton from '../atoms/Skeleton.svelte';
	import { debounce } from '../../utils/debounce';
	import type { User, Comment as CommentType, QuestionPageData } from '$lib/types/questions';

	interface Props {
		parentType?: 'question' | 'comment';
		user: User | null;
		questionId: number;
		comments?: CommentType[];
		comment_count?: number;
		parentData: QuestionPageData | CommentType;
		onCommentsUpdate?: (comments: CommentType[]) => void;
		/** A reply was posted on one of these comments and the list refreshed. */
		oncommentAdded?: () => void;
		// Ids rendered elsewhere (the pinned reveal trio). They stay in `_comments`
		// so pagination offsets and counts are untouched; they are only hidden here.
		excludeIds?: number[];
	}

	let {
		parentType = 'comment',
		user,
		questionId,
		comments = [],
		comment_count = 0,
		parentData,
		onCommentsUpdate,
		oncommentAdded,
		excludeIds = []
	}: Props = $props();

	// Local copy of the list: pages and updates replace it here (and report up
	// through onCommentsUpdate); a new `comments` prop resets it.
	let _comments = $derived<CommentType[]>(comments ?? []);
	let commentCount = $derived(comment_count);

	// Track the date of last comment for pagination
	let lastDate = $derived(
		_comments.length ? _comments[_comments.length - 1]?.created_at || null : null
	);
	let questionParentData = $derived(
		parentType === 'question' ? (parentData as QuestionPageData) : null
	);
	let parentId = $derived(parentType === 'question' ? questionId : (parentData as CommentType).id);
	let userHasAnswered = $derived(
		parentType === 'comment' ? true : !!questionParentData?.flags?.userHasAnswered
	);

	let excludedIdSet = $derived(new Set(excludeIds ?? []));
	let filteredComments = $derived(_comments.filter((comment) => !excludedIdSet.has(comment.id)));
	let visibleComments = $derived(
		parentType === 'comment'
			? [...filteredComments].sort(
					(a, b) => a.created_at.localeCompare(b.created_at) || a.id - b.id
				)
			: filteredComments
	);

	let loading = $state(false);
	let initialLoading = $state(false);

	// Load more comments when scrolling to the bottom
	const loadMore = debounce(async () => {
		if (loading || _comments.length >= commentCount) return;
		loading = true;

		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${parentId}&lastDate=${lastDate}&range=${
					_comments.length || 0
				}`
			);

			const newComments = await response.json();

			if (Array.isArray(newComments) && newComments.length) {
				// Boosted takes are already at the head of the list; skip them when
				// the date-keyed page reaches them so nothing renders twice.
				const seen = new Set(_comments.map((c) => c.id));
				const fresh = newComments.filter((c: CommentType) => !seen.has(c.id));
				_comments = [..._comments, ...fresh];
				onCommentsUpdate?.(_comments);
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

		oncommentAdded?.();
		initialLoading = _comments.length === 0;
		loading = true;

		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${questionId}&lastDate=${lastDate}`
			);

			const newComments = await response.json();

			if (Array.isArray(newComments) && newComments.length) {
				_comments = newComments;
				commentCount += 1;
				onCommentsUpdate?.(_comments);
			}
		} catch (error) {
			console.error('Error refreshing comments:', error);
		} finally {
			loading = false;
			initialLoading = false;
		}
	};

	// Update a single comment in the array (matched by id: the rendered list
	// can be a filtered view of `_comments`, so indexes are not stable).
	function handleCommentUpdate(comment: CommentType) {
		if (!_comments.some((existing) => existing.id === comment?.id)) return;
		_comments = _comments.map((existing) => (existing.id === comment.id ? comment : existing));
		onCommentsUpdate?.(_comments);
	}

	// Infinite scroll: load more as the bottom sentinel nears the viewport.
	function observeBottom(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ rootMargin: '200px' } // Load more before reaching the very bottom
		);
		observer.observe(node);
		return () => observer.disconnect();
	}
</script>

{#if browser && (_comments.length || initialLoading) && userHasAnswered}
	<div
		class="comment-list"
		class:comment-list--root={parentType === 'question'}
		class:comment-list--nested={parentType === 'comment'}
	>
		{#each visibleComments as comment, index (comment.id)}
			<div class="comment-list__item" in:fade={{ duration: 300, delay: Math.min(index * 20, 100) }}>
				<Comment
					{questionId}
					{comment}
					{user}
					{parentData}
					oncommentAdded={refreshComments}
					oncommentUpdated={handleCommentUpdate}
				/>
			</div>
		{/each}
	</div>

	<!-- Initial loading state -->
	{#if initialLoading && _comments.length === 0}
		<div class="comment-skeleton-list" role="status" aria-label="Loading comments">
			{#each [0, 1, 2] as i (i)}
				<div class="comment-skeleton" in:fade={{ duration: 300, delay: i * 50 }}>
					<div class="flex-1">
						<Skeleton decorative variant="text" />
						<Skeleton decorative variant="text" />
						<Skeleton decorative variant="text" width="25%" class="mt-3" />
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Infinite scroll sentinel -->
	{#if _comments.length < commentCount && userHasAnswered}
		<div {@attach observeBottom} class="my-6">
			{#if loading && !initialLoading}
				<div class="flex justify-center py-6">
					<div class="flex items-center gap-3 px-4 py-2">
						<div
							class="h-4 w-4 animate-spin rounded-full border-2 border-[var(--lamp-soft)] border-t-[var(--lamp-glow)]"
						></div>
						<span class="text-sm font-medium text-[var(--ink-mid)]">Loading more…</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{:else if userHasAnswered && !_comments.length}
	<div class="flex flex-col items-center justify-center py-12">
		<div class="mb-4 flex h-14 w-14 items-center justify-center text-[var(--ink-mid)]">
			<svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
		</div>
		<p class="text-center text-lg font-medium text-[var(--ink-bright)]">No comments yet</p>
		<p class="mt-1 text-center text-sm text-[var(--ink-mid)]">
			Be the first to share your thoughts
		</p>
	</div>
{/if}

<style>
	.comment-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 0;
	}

	.comment-list--root,
	.comment-skeleton-list {
		margin-inline: 1rem;
	}

	.comment-list--nested {
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.comment-skeleton-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.comment-list__item,
	.comment-skeleton {
		min-width: 0;
	}

	.comment-skeleton {
		display: flex;
		padding: 1.25rem 1rem;
		border: 1px solid color-mix(in srgb, var(--stone-edge) 52%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--stone-warm) 72%, transparent);
	}

	@media (max-width: 520px) {
		.comment-list--root,
		.comment-skeleton-list {
			margin-inline: 0.75rem;
		}

		.comment-skeleton {
			padding-inline: 0.875rem;
		}
	}
</style>
