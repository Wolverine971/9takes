// scripts/lib/linkOnlyChange.js
//
// Is an edit to a people page nothing but internal links added or removed?
// The perspective gate (personBlogParser.js) re-opens review whenever a live
// page's content changes. Wrapping an existing name in a link to another 9takes
// page changes no claim, so the gate lets exactly that through, and nothing else.

const INTERNAL_MD_LINK = /\[([^\]\n]*)\]\((\/[^)\s]*)\)/g;
const INTERNAL_HTML_LINK = /<a\s+href="(\/[^"]*)"(?:\s+[a-z-]+="[^"]*")*\s*>([\s\S]*?)<\/a>/gi;

/** Replace every root-relative link with its anchor text. External links stay. */
export function stripInternalLinks(text) {
	return String(text ?? '')
		.replace(INTERNAL_MD_LINK, '$1')
		.replace(INTERNAL_HTML_LINK, '$2');
}

/**
 * True when `before` and `after` differ, and only by internal link markup:
 * same words, same order, same external links and citations.
 */
export function isInternalLinkOnlyChange(before, after) {
	if (before === after) return false;
	return stripInternalLinks(before) === stripInternalLinks(after);
}
