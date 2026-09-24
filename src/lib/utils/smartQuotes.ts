// src/lib/utils/smartQuotes.ts
// Typographic ("curly") quotes for rendered article HTML.
//
// Runs on the final, sanitized HTML string so it covers markdown prose AND the
// raw-HTML furniture blocks (contrast panels, pull quotes, TL;DR panels) that a
// markdown-level extension would never see. Only text between tags changes:
// tag names, attributes, comments, and code/pre/script/style contents are
// passed through untouched, so hrefs, alt text, and heading ids are stable.

const SKIP_TAGS = new Set(['code', 'pre', 'kbd', 'samp', 'script', 'style', 'textarea', 'svg']);

// Crossing one of these resets the "previous character" to a boundary, so a
// quote that opens a new paragraph, list item, or cell is read as opening.
// Inline tags (em, strong, a, span) carry context across them instead, which
// is what makes `"<em>Loki</em>"` and `<em>Loki</em>'s` come out right.
const BLOCK_TAGS = new Set([
	'address',
	'article',
	'aside',
	'blockquote',
	'br',
	'dd',
	'details',
	'div',
	'dl',
	'dt',
	'figcaption',
	'figure',
	'footer',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'header',
	'hr',
	'li',
	'ol',
	'p',
	'section',
	'summary',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr',
	'ul'
]);

const TOKEN = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+|</g;
const TAG_NAME = /^<\/?([a-zA-Z][a-zA-Z0-9-]*)/;
const CHAR_OR_ENTITY = /&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);|[\s\S]/giu;

const NAMED_ENTITIES: Record<string, string> = {
	quot: '"',
	apos: "'",
	amp: '&',
	nbsp: ' ',
	lt: '<',
	gt: '>',
	mdash: '—',
	ndash: '–',
	hellip: '…',
	lsquo: '‘',
	rsquo: '’',
	ldquo: '“',
	rdquo: '”'
};

// Words that start with an elided letter take an apostrophe, not an opening
// single quote: 'em, 'cause, 'til, rock 'n' roll, '90s, class of '05.
const LEADING_ELISION = /^(?:em|cause|cos|til|bout|tis|twas|round)\b|^n['’]|^\d\ds?\b/i;

const BOUNDARY = ' ';

function decodeEntity(token: string): string {
	if (token.length === 1 || !token.startsWith('&')) return token;
	const body = token.slice(1, -1);
	if (body[0] === '#') {
		const code =
			body[1] === 'x' || body[1] === 'X'
				? Number.parseInt(body.slice(2), 16)
				: Number.parseInt(body.slice(1), 10);
		return Number.isFinite(code) ? String.fromCodePoint(code) : token;
	}
	return NAMED_ENTITIES[body.toLowerCase()] ?? token;
}

// '' means "end of this text run" (an inline tag or the end of the string).
function isWhitespace(char: string): boolean {
	return char !== '' && /\s/u.test(char);
}

// Characters after which a quote opens rather than closes.
function opensAfter(prev: string): boolean {
	return isWhitespace(prev) || /[([{\u2014\u2013\-/“‘]/u.test(prev);
}

function isWordChar(char: string): boolean {
	return /[\p{L}\p{N}]/u.test(char);
}

type QuoteState = { prev: string };

function convertText(text: string, state: QuoteState): string {
	const tokens = text.match(CHAR_OR_ENTITY) ?? [];
	const decoded = tokens.map(decodeEntity);
	let out = '';

	for (let i = 0; i < tokens.length; i++) {
		const char = decoded[i];
		const next = decoded[i + 1] ?? '';

		if (char === '"') {
			if (/\d'\d{1,2}$/u.test(out.slice(-4))) {
				// Feet and inches (6'2") keep straight marks.
				out += '"';
			} else {
				// A quote at the end of a run after a space wraps an inline tag
				// (`"<em>Loki</em>"`), so it opens too.
				out += opensAfter(state.prev) && !isWhitespace(next) ? '“' : '”';
			}
		} else if (char === "'") {
			const rest = decoded.slice(i + 1, i + 8).join('');
			if (/\d/u.test(state.prev) && /\d/u.test(next)) {
				out += "'"; // 6'2 — foot mark
			} else if (isWordChar(state.prev) || /[.,!?;:)\]”’…]/u.test(state.prev)) {
				out += '’'; // don’t, Loki’s, 'no.’
			} else if (LEADING_ELISION.test(rest)) {
				out += '’'; // ’em, ’90s
			} else {
				out += opensAfter(state.prev) && !isWhitespace(next) ? '‘' : '’';
			}
		} else {
			out += tokens[i];
			state.prev = char;
			continue;
		}

		state.prev = out.slice(-1);
	}

	return out;
}

/**
 * Convert straight quotes to typographic quotes in an HTML string.
 * Idempotent: already-curly quotes pass through unchanged.
 */
export function smartQuotesHtml(html: string): string {
	if (!html || !/["']|&(?:quot|apos|#0*3[49]|#x0*2[27]);/i.test(html)) return html;

	const state: QuoteState = { prev: BOUNDARY };
	let skipDepth = 0;
	let out = '';

	for (const match of html.matchAll(TOKEN)) {
		const token = match[0];

		if (token.startsWith('<!--')) {
			out += token;
			continue;
		}

		const tagMatch = token.length > 1 && token[0] === '<' ? TAG_NAME.exec(token) : null;
		if (tagMatch) {
			const name = tagMatch[1].toLowerCase();
			const closing = token[1] === '/';
			const selfClosing = token.endsWith('/>');
			if (SKIP_TAGS.has(name) && !selfClosing) {
				skipDepth = Math.max(0, skipDepth + (closing ? -1 : 1));
			}
			if (BLOCK_TAGS.has(name)) state.prev = BOUNDARY;
			out += token;
			continue;
		}

		if (skipDepth > 0) {
			out += token;
			continue;
		}

		out += convertText(token, state);
	}

	return out;
}

/** Plain-text variant (headings, component props). Same rules, no tags. */
export function smartQuotesText(text: string): string {
	return smartQuotesHtml(text);
}
