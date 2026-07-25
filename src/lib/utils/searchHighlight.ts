// src/lib/utils/searchHighlight.ts
//
// Search results are rendered with `{@html}` so Elasticsearch's <mark> tags
// survive. Everything around those tags is reader-submitted question text, so
// it has to be escaped first — otherwise a question containing markup executes
// in whoever searches for it.
//
// The sentinel round-trip lets us escape the whole string and then restore only
// the two tags we intend to emit.

const NUL = String.fromCharCode(0);
const MARK_OPEN = `${NUL}MARK_OPEN${NUL}`;
const MARK_CLOSE = `${NUL}MARK_CLOSE${NUL}`;

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * Escape a search headline for `{@html}` rendering while preserving the
 * `<mark>` tags the search backend injected.
 *
 * Safe to call on un-highlighted text too — it simply escapes everything.
 */
export function renderSearchHighlight(value: string | null | undefined): string {
	if (!value) return '';

	// Strip any NUL the caller's text already contains so it cannot forge a
	// sentinel and smuggle a <mark> tag through the escape step.
	const withSentinels = value
		.split(NUL)
		.join('')
		.replace(/<mark>/gi, MARK_OPEN)
		.replace(/<\/mark>/gi, MARK_CLOSE);

	return escapeHtml(withSentinels)
		.split(MARK_OPEN)
		.join('<mark>')
		.split(MARK_CLOSE)
		.join('</mark>');
}
