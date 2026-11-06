// src/lib/data/homepageLiveTypes.ts
// Who has answered the homepage's live question, by self-picked Enneagram type.
// Types and timestamps only, never take text, so the locked card can show it pre-post.

/** How many locked preview rows the homepage card shows. */
export const LIVE_TYPE_PREVIEW_ROWS = 4;

export type LiveTakeTypes = {
	/** Self-picked types for the locked preview rows: typed takes first, newest first. null = no type. */
	recent: (number | null)[];
	/** Distinct types (1-9) with at least one take on the question, ascending. */
	answered: number[];
	/** ISO timestamp of the newest take, or null when there are none. */
	newestAt: string | null;
};

/** "1, 5, 6 or 7" */
export function listTypes(types: number[]): string {
	if (types.length <= 1) return types.join('');
	return `${types.slice(0, -1).join(', ')} or ${types[types.length - 1]}`;
}

/** Types 1-9 nobody has answered as yet. */
export function missingTypes(answered: number[]): number[] {
	const seen = new Set(answered);
	return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((type) => !seen.has(type));
}
