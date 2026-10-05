// src/lib/utils/betaInvite.ts
//
// Shared pieces of the beta card ("Want to try experimental therapy, 9takes
// style?"): where it can appear, the viewport split between the desktop side
// card and the in-article card, and which heading the in-article card sits in
// front of. Browser-safe; the server half is $lib/server/betaSignups.

export const BETA_SURFACES = [
	'celebrity',
	'enneagram',
	'community',
	'guides',
	'pop_culture',
	'book_session'
] as const;
export type BetaSurface = (typeof BETA_SURFACES)[number];

export const BETA_PLACEMENTS = ['rail', 'inline'] as const;
export type BetaPlacement = (typeof BETA_PLACEMENTS)[number];

/** Where "What is this?" and the thank-you link point. */
export const BETA_DETAILS_HREF = '/book-session#experimental-therapy';

/**
 * At this width and up, the card rides in a side rail; below it, it sits in
 * the article. 1360px is where a 200px rail clears the 896px article column
 * on both sides (the personality pages' "More Personalities" rail geometry).
 */
export const BETA_RAIL_MEDIA_QUERY = '(min-width: 1360px)';

/** Per-browser memory that this visitor already asked, so the card stops asking. */
export const BETA_SIGNED_UP_STORAGE_KEY = '9takes:beta-invite:signed-up';

/**
 * Index of the heading the in-article card goes in front of: the one closest
 * to `fraction` of the way through, never the first heading (the card should
 * interrupt the middle, not the intro). -1 means the article is too short to
 * split, so the card goes at the end instead.
 */
export function pickInlineAnchorIndex(headingCount: number, fraction: number): number {
	if (!Number.isInteger(headingCount) || headingCount < 3) return -1;
	const clamped = Math.min(Math.max(fraction, 0), 1);
	const index = Math.round((headingCount - 1) * clamped);
	return Math.min(Math.max(index, 1), headingCount - 1);
}

export function readBetaSignedUp(): boolean {
	try {
		return localStorage.getItem(BETA_SIGNED_UP_STORAGE_KEY) !== null;
	} catch {
		return false;
	}
}

export function rememberBetaSignedUp(): void {
	try {
		localStorage.setItem(BETA_SIGNED_UP_STORAGE_KEY, new Date().toISOString());
	} catch {
		// Private mode or blocked storage: the card just asks again next page.
	}
}
