// src/lib/utils/seoBudget.ts
// SEO snippet budgets and safe-truncation helpers.
//
// Source: 2026-04-07 SEO audit (Bucket 1) flagged 269 over-length titles and
// 125 over-length descriptions. These helpers cap the SERP-facing tags so an
// unreviewed-frontmatter blog never bleeds past Google's snippet limit.
//
// Hand-edited frontmatter still wins; this is a safety net.

/** Google desktop SERP title pixel-budget — safe character cap. */
export const TITLE_SNIPPET_BUDGET = 60;

/** Google desktop SERP meta-description character cap. */
export const DESCRIPTION_SNIPPET_BUDGET = 155;

/**
 * Truncate a string to a max length, breaking on the last whitespace before
 * the cap and appending an ellipsis. Strings within budget are returned
 * unchanged. Empty / nullish input returns an empty string.
 */
export function truncateForSnippet(value: string | null | undefined, maxLength: number): string {
	if (!value) return '';
	const trimmed = value.trim();
	if (trimmed.length <= maxLength) return trimmed;

	// Reserve one char for the ellipsis.
	const sliceTo = maxLength - 1;
	const head = trimmed.slice(0, sliceTo);
	const lastSpace = head.lastIndexOf(' ');

	// Prefer breaking on whitespace when the break point isn't crammed at the
	// very start of the string (avoid producing "A…").
	const cut = lastSpace > sliceTo * 0.6 ? head.slice(0, lastSpace) : head;
	// Strip trailing punctuation/whitespace before the ellipsis so we don't
	// emit awkward sequences like ",…" or " —…".
	return `${cut.replace(/[\s.,;:—–-]+$/u, '')}…`;
}

/** Convenience: cap a title to the SERP budget. */
export function capTitleForSnippet(value: string | null | undefined): string {
	return truncateForSnippet(value, TITLE_SNIPPET_BUDGET);
}

/** Convenience: cap a meta description to the SERP budget. */
export function capDescriptionForSnippet(value: string | null | undefined): string {
	return truncateForSnippet(value, DESCRIPTION_SNIPPET_BUDGET);
}
