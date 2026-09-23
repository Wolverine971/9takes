<!-- src/lib/components/questions/RankedComments.svelte -->
<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import Comment from '$lib/components/molecules/Comment.svelte';
	import SortComments from '$lib/components/molecules/SortComments.svelte';
	import { Button } from '$lib/components/atoms';
	import Skeleton from '$lib/components/atoms/Skeleton.svelte';
	import { getExistingVisitorId } from '$lib/analytics/visitorIdentity';
	import { isOwnTake, rankTakes, sortTakes } from './commentRanking';
	import type { Comment as Take, QuestionPageData, User } from '$lib/types/questions';

	type SortOrder = 'ranked' | 'newest' | 'oldest' | 'likes';
	interface Props {
		data: QuestionPageData;
		user: User | null;
		excludeIds?: number[];
		active?: boolean;
		oncommentAdded?: () => void;
		/** Rendered directly under "Your take" (post-answer handoff: host line, reply tray). */
		afterOwnTakes?: Snippet;
		/** Rendered once, after the first few community takes (share invite). */
		interstitial?: Snippet;
		/** The optimistic unlock's server confirmation failed; offer a retry. */
		revealFailed?: boolean;
		onretryReveal?: () => void;
	}

	let {
		data,
		user,
		excludeIds = [],
		active = true,
		oncommentAdded,
		afterOwnTakes,
		interstitial,
		revealFailed = false,
		onretryReveal
	}: Props = $props();
	const PAGE_SIZE = 10;
	const SORT_STORAGE_KEY = '9takes:comment-sort';
	const ALL_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'unknown', 'rando'];
	const INTERSTITIAL_AFTER = 3;
	// Long enough for the last staggered card (see .is-revealing below) to land.
	const REVEAL_CLASS_MS = 900;

	function captureVisit() {
		const latest: Take[] = JSON.parse(JSON.stringify(data.comments ?? []));
		const own: Take[] = JSON.parse(JSON.stringify(data.ownComments ?? []));
		const takes = Array.from(new Map([...latest, ...own].map((take) => [take.id, take])).values());
		const viewer = {
			viewerId: user?.id ?? null,
			viewerFingerprint: typeof window === 'undefined' ? null : getExistingVisitorId()
		};
		const ownIds = takes.filter((take) => isOwnTake(take, viewer)).map((take) => take.id);
		const community = latest.filter((take) => !ownIds.includes(take.id));
		const boostedIds = data.pinnedCommentIds ?? [];
		const boosts = new Map(boostedIds.map((id, index) => [id, index]));
		const ranked = data.commentRankingEnabled
			? rankTakes(community, { boostedIds, totalCount: data.comment_count, viewerId: user?.id })
			: [...community].sort((a, b) => {
					const boost = (boosts.get(a.id) ?? Infinity) - (boosts.get(b.id) ?? Infinity);
					return boost || b.created_at.localeCompare(a.created_at) || b.id - a.id;
				});
		const oldest = [...latest].sort(
			(a, b) => a.created_at.localeCompare(b.created_at) || a.id - b.id
		)[0];
		return {
			takes,
			ownIds,
			rankedIds: ranked.map((take) => take.id),
			oldest,
			latestCount: latest.length
		};
	}

	// Capture once per visit: likes, replies and tab changes must never rerun the
	// ranking. The one exception is the give-first unlock: an optimistic snapshot
	// (only your own take) is replaced exactly once when the server's takes arrive.
	// Doing that in place, rather than remounting, keeps "Your take" and the
	// handoff under it steady while the other takes animate in.
	const visit = untrack(captureVisit);
	let ready = untrack(() => data.commentsReady !== false);
	let pending = $derived(data.commentsReady === false);
	let revealing = $state(false);
	let takes = $state.raw<Take[]>(visit.takes);
	let ownIds = $state.raw<number[]>(visit.ownIds);
	let rankedIds = visit.rankedIds;
	let overflowIds = $state.raw<number[]>([]);
	let orderedIds = $state.raw<number[]>(rankedIds);
	let sort = $state<SortOrder>('ranked');
	let selectedTypes = $state.raw<string[]>(ALL_TYPES);
	let visibleCount = $state(PAGE_SIZE);
	let cursor = visit.oldest;
	let exhausted = $state(
		untrack(() => visit.latestCount < 100 || visit.latestCount >= data.comment_count)
	);
	let loading = $state(false);
	let loadError = $state('');
	let disposed = false;
	let pendingRequest: AbortController | undefined;

	$effect.pre(() => {
		if (ready || data.commentsReady === false) return;
		ready = true;
		untrack(() => {
			const next = captureVisit();
			takes = next.takes;
			ownIds = next.ownIds;
			rankedIds = next.rankedIds;
			overflowIds = [];
			orderedIds = next.rankedIds;
			sort = 'ranked';
			selectedTypes = ALL_TYPES;
			visibleCount = PAGE_SIZE;
			cursor = next.oldest;
			exhausted = next.latestCount < 100 || next.latestCount >= data.comment_count;
			restoreSavedSort();
			revealing = true;
		});
	});

	$effect(() => {
		if (!revealing) return;
		const timer = setTimeout(() => (revealing = false), REVEAL_CLASS_MS);
		return () => clearTimeout(timer);
	});

	let takeById = $derived(new Map(takes.map((take) => [take.id, take])));
	let excluded = $derived(new Set(excludeIds));
	let ownTakes = $derived.by(() => {
		const viewer = {
			viewerId: user?.id,
			viewerFingerprint: typeof window === 'undefined' ? null : getExistingVisitorId()
		};
		const currentOwn = [...(data.ownComments ?? []), ...(data.comments ?? [])].filter((take) =>
			isOwnTake(take, viewer)
		);
		const storedOwn = ownIds.flatMap((id) => {
			const take = takeById.get(id);
			return take ? [take] : [];
		});
		const unique = new Map([...currentOwn, ...storedOwn].map((take) => [take.id, take]));
		return [...unique.values()].filter((take) => !take.removed && !excluded.has(take.id));
	});
	let filteredTakes = $derived(
		orderedIds.flatMap((id) => {
			const take = takeById.get(id);
			if (!take || take.removed || excluded.has(id)) return [];
			const profile = take.profiles ?? take.profiles_demo;
			const type = !take.author_id
				? 'rando'
				: profile?.enneagram && profile.enneagram >= 1 && profile.enneagram <= 9
					? String(profile.enneagram)
					: 'unknown';
			return selectedTypes.includes(type) ? [take] : [];
		})
	);
	let visibleTakes = $derived(filteredTakes.slice(0, visibleCount));
	// Split around the interstitial so it stays mounted through sorts and paging.
	let leadTakes = $derived(visibleTakes.slice(0, INTERSTITIAL_AFTER));
	let restTakes = $derived(visibleTakes.slice(INTERSTITIAL_AFTER));
	let hasMore = $derived(visibleCount < filteredTakes.length || !exhausted);
	let communityCount = $derived(
		takes.filter((take) => !take.removed && !ownIds.includes(take.id)).length
	);
	let revealStatus = $derived(
		pending
			? revealFailed
				? ''
				: 'Loading the other takes…'
			: revealing
				? `${communityCount} other ${communityCount === 1 ? 'take' : 'takes'} revealed.`
				: ''
	);

	function applyFilters(filters: { sort: SortOrder; types: string[] }, remember = true) {
		sort = filters.sort;
		selectedTypes = [...filters.types];
		const base = [...rankedIds, ...overflowIds].flatMap((id) => {
			const take = takeById.get(id);
			return take ? [take] : [];
		});
		// Explicit sort changes may use the current like count; card updates never
		// recompute this ID order, even while the Likes option is selected.
		orderedIds = sortTakes(base, sort).map((take) => take.id);
		visibleCount = PAGE_SIZE;
		if (remember) {
			try {
				window.sessionStorage.setItem(SORT_STORAGE_KEY, sort);
			} catch {
				// Sorting still works when browser storage is unavailable.
			}
		}
	}

	function updateTake(updated: Take) {
		if (takeById.has(updated.id)) {
			takes = takes.map((take) => (take.id === updated.id ? updated : take));
		} else {
			takes = [...takes, updated];
			ownIds = [...ownIds, updated.id];
		}
	}

	async function loadMore() {
		if (!active || loading) return;
		if (visibleCount < filteredTakes.length) {
			visibleCount += PAGE_SIZE;
			return;
		}
		if (exhausted || !cursor) return;
		loading = true;
		loadError = '';
		pendingRequest = new AbortController();
		try {
			const params = new URLSearchParams({
				type: 'question',
				parentId: String(data.question.id),
				before: cursor.created_at,
				beforeId: String(cursor.id)
			});
			const response = await fetch(`/comments?${params}`, { signal: pendingRequest.signal });
			if (!response.ok) throw new Error('Could not load more takes');
			const page: Take[] = await response.json();
			if (!Array.isArray(page)) throw new Error('Invalid takes response');
			if (disposed) return;
			exhausted = page.length < PAGE_SIZE;
			if (page.length) cursor = page[page.length - 1];
			const uniquePage = new Map(page.map((take) => [take.id, take]));
			const fresh = [...uniquePage.values()].filter((take) => !takeById.has(take.id));
			const viewer = { viewerId: user?.id, viewerFingerprint: getExistingVisitorId() };
			const freshOwn = fresh.filter((take) => isOwnTake(take, viewer));
			const freshCommunity = fresh.filter((take) => !isOwnTake(take, viewer));
			takes = [...takes, ...fresh];
			ownIds = [...ownIds, ...freshOwn.map((take) => take.id)];
			overflowIds = [...overflowIds, ...freshCommunity.map((take) => take.id)];
			orderedIds = [...orderedIds, ...freshCommunity.map((take) => take.id)];
			visibleCount += PAGE_SIZE;
		} catch (error) {
			if (!disposed && !(error instanceof DOMException && error.name === 'AbortError')) {
				loadError = 'More takes could not load. Try again.';
			}
		} finally {
			if (!disposed) loading = false;
		}
	}

	function observeMore(node: Element) {
		if (!active || typeof IntersectionObserver === 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting) && !loadError) void loadMore();
			},
			{ rootMargin: '200px' }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}

	function restoreSavedSort() {
		try {
			const savedSort = window.sessionStorage.getItem(SORT_STORAGE_KEY);
			if (
				savedSort === 'ranked' ||
				savedSort === 'newest' ||
				savedSort === 'oldest' ||
				savedSort === 'likes'
			) {
				applyFilters({ sort: savedSort, types: ALL_TYPES }, false);
			}
		} catch {
			// The visit falls back to the default when storage is unavailable.
		}
	}

	onMount(() => {
		restoreSavedSort();
		return () => {
			disposed = true;
			pendingRequest?.abort();
		};
	});
</script>

{#snippet communityTake(take: Take, index: number)}
	<div class="ranked-comments__item" data-take-id={take.id} style:--reveal-i={index}>
		<Comment
			questionId={data.question.id}
			comment={take}
			{user}
			parentData={data}
			on:commentUpdated={(event) => updateTake(event.detail)}
			on:commentAdded={() => oncommentAdded?.()}
		/>
	</div>
{/snippet}

{#if data.flags.userHasAnswered}
	<p class="sr-only" role="status">{revealStatus}</p>
	{#if ownTakes.length}
		<section class="own-takes" aria-label={ownTakes.length === 1 ? 'Your take' : 'Your takes'}>
			<h4>{ownTakes.length === 1 ? 'Your take' : 'Your takes'}</h4>
			{#each ownTakes as take (take.id)}
				<Comment
					questionId={data.question.id}
					comment={take}
					{user}
					parentData={data}
					on:commentUpdated={(event) => updateTake(event.detail)}
					on:commentAdded={() => oncommentAdded?.()}
				/>
			{/each}
		</section>
	{/if}
	{#if afterOwnTakes}
		<div class="after-own-takes">{@render afterOwnTakes()}</div>
	{/if}
	<!-- Rendered in both states so the list does not shift when the takes land. -->
	<div class="content-toolbar">
		<SortComments
			{data}
			value={sort}
			types={selectedTypes}
			onfilterChange={applyFilters}
			size="medium"
		/>
	</div>
	{#if pending}
		<!-- Optimistic unlock: the server is confirming the answer and sending the
		     room. Card-shaped placeholders hold the space so nothing jumps. -->
		<div class="ranked-comments takes-pending" aria-busy="true">
			{#if revealFailed}
				<div class="reveal-failed" role="alert">
					<p>Your take is posted, but the other takes didn't load.</p>
					<Button variant="secondary" size="md" onclick={() => onretryReveal?.()}>Try again</Button>
				</div>
			{:else}
				{#each [0.92, 0.84, 0.9] as width, i (i)}
					<div class="take-skeleton" aria-hidden="true">
						<Skeleton decorative variant="text" width="100%" />
						<Skeleton decorative variant="text" width={`${Math.round(width * 100)}%`} />
						<Skeleton decorative variant="text" width="46%" />
						<Skeleton decorative variant="text" width="5.5rem" class="take-skeleton__meta" />
					</div>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="ranked-comments" class:is-revealing={revealing} aria-label="Community takes">
			{#each leadTakes as take, index (take.id)}
				{@render communityTake(take, index)}
			{/each}
			{#if !visibleTakes.length}
				<p class="empty-takes">
					{communityCount
						? 'No other takes match these filters.'
						: "You're first. Other takes will land here as people answer."}
				</p>
			{/if}
			{#if interstitial}
				<div class="ranked-comments__interstitial">{@render interstitial()}</div>
			{/if}
			{#each restTakes as take, index (take.id)}
				{@render communityTake(take, index + INTERSTITIAL_AFTER)}
			{/each}
		</div>
	{/if}
	{#if hasMore && !pending}
		{#key `${visibleCount}:${takes.length}:${active}:${selectedTypes.join(',')}`}
			<div class="load-more" {@attach observeMore}>
				{#if loadError}<p role="alert">{loadError}</p>{/if}
				<button type="button" onclick={loadMore} disabled={loading}>
					{loading ? 'Loading more…' : 'Show more takes'}
				</button>
			</div>
		{/key}
	{/if}
{/if}

<style>
	.ranked-comments,
	.own-takes {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-width: 0;
		margin-inline: 1rem;
	}
	.own-takes {
		margin-bottom: 1.25rem;
	}
	.own-takes h4 {
		margin: 0;
		font-size: 0.8rem;
		color: var(--ink-mid);
	}
	.ranked-comments__item {
		min-width: 0;
	}
	.after-own-takes {
		display: grid;
		gap: 0.75rem;
		min-width: 0;
		margin: -0.5rem 1rem 1.25rem;
	}
	.after-own-takes:empty {
		display: none;
	}
	.ranked-comments__interstitial {
		min-width: 0;
	}
	.ranked-comments__interstitial:empty {
		display: none;
	}

	/* Same geometry as a comment card, so the takes land where the
	   placeholders already were. */
	.take-skeleton {
		display: grid;
		gap: 0.7rem;
		padding: 1.25rem 1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--stone-edge) 52%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--stone-warm) 72%, transparent);
	}
	.take-skeleton :global(.take-skeleton__meta) {
		margin-top: 0.45rem;
	}
	.reveal-failed {
		display: grid;
		justify-items: center;
		gap: 0.75rem;
		padding: 1.5rem 1rem;
		border: 1px dashed var(--stone-edge);
		border-radius: 1rem;
		color: var(--ink-mid);
		font-size: 0.9rem;
		text-align: center;
	}
	.reveal-failed p {
		margin: 0;
	}

	/* The give-first payoff: the room comes into focus once, right after your
	   first answer. The lock copy promises blurred answers, so they arrive by
	   un-blurring. Never replays on sort, filter or paging. */
	@media (prefers-reduced-motion: no-preference) {
		.ranked-comments.is-revealing .ranked-comments__item {
			animation: take-reveal 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
			animation-delay: calc(min(var(--reveal-i, 0), 6) * 60ms);
		}
	}
	@keyframes take-reveal {
		from {
			opacity: 0;
			transform: translateY(10px);
			filter: blur(6px);
		}
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
	.content-toolbar {
		margin: 0 1rem 1rem;
	}
	.empty-takes,
	.load-more {
		padding: 1.25rem 0;
		text-align: center;
		color: var(--ink-mid);
		font-size: 0.875rem;
	}
	.load-more button {
		min-height: 2.75rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--stone-warm);
		color: var(--ink-bright);
		cursor: pointer;
	}
	.load-more button:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}
	.load-more button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	@media (max-width: 520px) {
		.ranked-comments,
		.own-takes,
		.after-own-takes,
		.content-toolbar {
			margin-inline: 0.75rem;
		}
		.take-skeleton {
			padding: 1rem 0.875rem 0.875rem;
		}
	}
</style>
