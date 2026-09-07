// src/lib/components/questions/curatedReveal.ts
//
// Pure helpers for the curated question surfaces:
//   * the "Start here" starter block on /questions
//   * the pinned "takes that don't agree" trio rendered first after the
//     give-first reveal on /questions/[slug]
//
// Kept free of Supabase/DOM so both the server loads and the Svelte
// components can share them and they stay unit-testable.

export type StarterQuestionRow = {
	id: number;
	url: string;
	question: string;
	question_formatted?: string;
	comment_count: number;
	created_at: string;
	tag_id?: number;
	tag_name?: string;
	starter_rank?: number | null;
};

export type NextStarterLink = {
	id: number;
	url: string;
	question: string;
	starter_rank: number;
};

export const MAX_PINNED_COMMENTS = 3;

/**
 * The index RPC only returns `starters` on page 1 with no category filter,
 * and deployments still running the older function return no key at all.
 * Normalise whatever came back into a de-duplicated, rank-ordered array so
 * the page can render the block unconditionally.
 */
export function parseStarterQuestions(raw: unknown): StarterQuestionRow[] {
	if (!Array.isArray(raw)) return [];
	const seen = new Set<number>();
	const rows: StarterQuestionRow[] = [];

	for (const candidate of raw) {
		if (!candidate || typeof candidate !== 'object') continue;
		const row = candidate as Partial<StarterQuestionRow>;
		if (typeof row.id !== 'number' || !Number.isFinite(row.id)) continue;
		if (typeof row.url !== 'string' || !row.url) continue;
		if (seen.has(row.id)) continue;
		seen.add(row.id);
		rows.push(row as StarterQuestionRow);
	}

	return rows.sort((a, b) => {
		const rankA = starterRankValue(a.starter_rank);
		const rankB = starterRankValue(b.starter_rank);
		return rankA !== rankB ? rankA - rankB : a.id - b.id;
	});
}

function starterRankValue(rank: number | null | undefined): number {
	return typeof rank === 'number' && Number.isFinite(rank) ? rank : Number.MAX_SAFE_INTEGER;
}

/** Coerce a `pinned_comment_ids` column value (bigint[]) into clean numeric ids. */
export function normalizePinnedCommentIds(raw: unknown): number[] {
	if (!Array.isArray(raw)) return [];
	const ids: number[] = [];
	for (const value of raw) {
		const id = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
		if (!Number.isFinite(id) || id <= 0 || ids.includes(id)) continue;
		ids.push(id);
	}
	return ids.slice(0, MAX_PINNED_COMMENTS);
}

/**
 * Order fetched comment rows by the pinned id array, dropping ids that did
 * not come back (removed, wrong question, deleted) and anything removed.
 */
export function orderPinnedComments<T extends { id: number; removed?: boolean | null }>(
	pinnedIds: readonly number[],
	rows: readonly T[] | null | undefined
): T[] {
	if (!pinnedIds.length || !rows?.length) return [];
	const byId = new Map<number, T>();
	for (const row of rows) {
		if (row?.removed === true) continue;
		byId.set(row.id, row);
	}
	const ordered: T[] = [];
	for (const id of pinnedIds) {
		const row = byId.get(id);
		if (row && !ordered.includes(row)) ordered.push(row);
		if (ordered.length >= MAX_PINNED_COMMENTS) break;
	}
	return ordered;
}

/** Remove pinned comments from the community list so nothing renders twice. */
export function excludePinnedComments<T extends { id: number }>(
	comments: readonly T[] | null | undefined,
	pinnedIds: readonly number[]
): T[] {
	if (!comments?.length) return [];
	if (!pinnedIds.length) return [...comments];
	const excluded = new Set(pinnedIds);
	return comments.filter((comment) => !excluded.has(comment.id));
}
