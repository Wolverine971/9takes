/** Deterministic, immutable visit ordering. See docs/product/comment-ranking-spec.md. */
export const TAKE_FETCH_LIMIT = 100;
export const TAKE_PAGE_SIZE = 10;
export const RANKING_THRESHOLD = 9;
export const TURN_SIZE = 5;
export const LIKE_WEIGHT = 3;

export type TakeSort = 'ranked' | 'newest' | 'oldest' | 'likes';
export interface RankableTake {
	id: number;
	comment?: string | null;
	created_at?: string | null;
	author_id?: string | null;
	fingerprint?: string | null;
	is_own?: boolean;
	view_count?: number | null;
	like_count?: number | null;
	comment_count?: number | null;
	ranking_low_effort?: boolean;
}
export interface RankingOptions {
	boostedIds?: readonly number[];
	totalCount?: number;
	viewerId?: string | null;
	viewerFingerprint?: string | null;
}

export function isOwnTake(take: RankableTake, viewer: RankingOptions = {}): boolean {
	return Boolean(
		take.is_own ||
		(viewer.viewerId && take.author_id === viewer.viewerId) ||
		(viewer.viewerFingerprint && take.fingerprint === viewer.viewerFingerprint)
	);
}

function count(value: number | null | undefined): number {
	return Number.isFinite(value) ? Math.max(0, Math.floor(value!)) : 0;
}

export function isBelowTextFloor(value?: string | null): boolean {
	const text = (value ?? '').trim();
	const length = [...text].length;
	return length < 3 || !/[\p{L}\p{N}]/u.test(text) || (!/\s/u.test(text) && length <= 12);
}

export function takeRankingMetrics(take: RankableTake, options: RankingOptions = {}) {
	const boosted = Boolean(options.boostedIds?.includes(take.id));
	const views = count(take.view_count);
	const likes = count(take.like_count);
	const replies = count(take.comment_count);
	const effectiveViews = views + LIKE_WEIGHT * likes;
	return {
		views,
		likes,
		replies,
		boosted,
		effectiveViews,
		round: Math.floor(effectiveViews / TURN_SIZE),
		quality: (boosted ? 1 : 0) + (likes + 1) / (views + 6) + Math.min(replies, 3) * 0.05,
		belowFloor: !boosted && (isBelowTextFloor(take.comment) || Boolean(take.ranking_low_effort))
	};
}

function time(take: RankableTake): number {
	return Date.parse(take.created_at ?? '') || 0;
}

export function rankTakes<T extends RankableTake>(
	takes: readonly T[],
	options: RankingOptions = {}
): T[] {
	const total = options.totalCount ?? takes.length;
	const boosts = new Map((options.boostedIds ?? []).map((id, index) => [id, index]));
	return takes
		.filter((take) => !isOwnTake(take, options))
		.map((take) => ({ take, metrics: takeRankingMetrics(take, options) }))
		.sort((a, b) => {
			if (total <= RANKING_THRESHOLD) {
				return (
					(boosts.get(a.take.id) ?? Infinity) - (boosts.get(b.take.id) ?? Infinity) ||
					b.metrics.likes - a.metrics.likes ||
					time(b.take) - time(a.take) ||
					b.take.id - a.take.id
				);
			}
			return (
				Number(a.metrics.belowFloor) - Number(b.metrics.belowFloor) ||
				a.metrics.round - b.metrics.round ||
				b.metrics.quality - a.metrics.quality ||
				time(a.take) - time(b.take) ||
				a.take.id - b.take.id
			);
		})
		.map(({ take }) => take);
}

/** Stable sort preserves ranked order for equal likes, without mutating the snapshot. */
export function sortTakes<T extends RankableTake>(ranked: readonly T[], sort: TakeSort): T[] {
	return [...ranked].sort((a, b) => {
		if (sort === 'likes') return count(b.like_count) - count(a.like_count);
		if (sort === 'oldest') return time(a) - time(b) || a.id - b.id;
		if (sort === 'newest') return time(b) - time(a) || b.id - a.id;
		return 0;
	});
}
