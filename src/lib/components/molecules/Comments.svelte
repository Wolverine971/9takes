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
					<div class="comment-skeleton__lines">
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
		<div {@attach observeBottom} class="comment-list__sentinel">
			{#if loading && !initialLoading}
				<div class="comment-list__loading">
					<span class="comment-list__spinner" aria-hidden="true"></span>
					<span>Loading more…</span>
				</div>
			{/if}
		</div>
	{/if}
{:else if userHasAnswered && !_comments.length}
	<div class="comment-empty">
		<p class="comment-empty__title">No comments yet</p>
		<p class="comment-empty__copy">Be the first to share your thoughts</p>
	</div>
{/if}

<style>
	/* Flat conversation: each take draws its own rule (see Comment.svelte). */
	.comment-list {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.comment-list--root,
	.comment-skeleton-list {
		margin-inline: 1rem;
	}

	.comment-list--nested > .comment-list__item:last-child :global(.comment-card) {
		border-bottom: 0;
	}

	.comment-skeleton-list {
		display: flex;
		flex-direction: column;
	}

	.comment-list__item,
	.comment-skeleton {
		min-width: 0;
	}

	.comment-skeleton {
		display: flex;
		padding: 20px 0;
		border-bottom: 1px solid var(--rule);
	}

	.comment-skeleton__lines {
		flex: 1;
	}

	.comment-list__sentinel {
		margin: 24px 0;
	}

	.comment-list__loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 24px 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	.comment-list__spinner {
		width: 16px;
		height: 16px;
		border: 2px solid color-mix(in srgb, var(--highlight) 25%, transparent);
		border-top-color: var(--highlight);
		border-radius: 50%;
		animation: comment-list-spin 0.7s linear infinite;
	}

	@keyframes comment-list-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.comment-empty {
		padding: 48px 0;
		text-align: center;
	}

	.comment-empty__title {
		margin: 0;
		color: var(--text);
		font-size: var(--font-size-lg);
		font-weight: 600;
	}

	.comment-empty__copy {
		margin: 4px 0 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
	}

	@media (max-width: 520px) {
		.comment-list--root,
		.comment-skeleton-list {
			margin-inline: 0.75rem;
		}
	}
</style>
