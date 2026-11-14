// src/lib/utils/keepThisPage.ts
// Placement rules for the in-article "Email me this page" card (KeepThisPage).

const DONE_STORAGE_KEY = '9t-keep-page-done';

/** Articles with fewer sections than this are too short to interrupt. */
export const KEEP_PAGE_MIN_HEADINGS = 5;

/**
 * Which heading the card goes in front of: about `fraction` of the way through,
 * never before the second section, and never the heading another in-article
 * card (the beta card) already claimed. -1 means the article gets no card.
 */
export function pickKeepPageAnchorIndex(
	headingCount: number,
	fraction: number,
	takenIndex: number | null = null
): number {
	if (!Number.isInteger(headingCount) || headingCount < KEEP_PAGE_MIN_HEADINGS) return -1;
	const clamped = Math.min(Math.max(fraction, 0), 1);
	let index = Math.min(Math.max(Math.round((headingCount - 1) * clamped), 1), headingCount - 2);
	if (index === takenIndex) index = index > 1 ? index - 1 : index + 1;
	return index;
}

/** A reader who already used the card (or is already subscribed) isn't asked again. */
export function readKeepPageDone(): boolean {
	try {
		return localStorage.getItem(DONE_STORAGE_KEY) !== null;
	} catch {
		return false;
	}
}

export function markKeepPageDone(): void {
	try {
		localStorage.setItem(DONE_STORAGE_KEY, new Date().toISOString());
	} catch {
		/* storage unavailable: the card simply shows again */
	}
}
