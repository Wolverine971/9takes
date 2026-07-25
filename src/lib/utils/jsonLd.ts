// src/lib/utils/jsonLd.ts
//
// JSON-LD is emitted into the document with `{@html}`, which means the
// serialized payload lands inside a raw <script> element. `JSON.stringify`
// escapes quotes and backslashes but leaves `<` alone, so any string value
// containing `</script>` closes the tag early and everything after it parses
// as markup. Question text is reader-submitted, so that is a live XSS sink.
//
// Escaping to `\uXXXX` keeps the output valid JSON (parsers decode the escapes
// back to the original characters), so Google and friends still read the
// structured data unchanged.

// `<` `>` `&` break out of the script element. U+2028/U+2029 are legal inside
// a JSON string but are line terminators in JavaScript, so they break any
// consumer that evals the payload. Listed as code points to keep this file
// free of invisible characters.
const ESCAPED_CODE_POINTS = new Set([0x3c, 0x3e, 0x26, 0x2028, 0x2029]);

/**
 * Escape an already-serialized JSON string for safe embedding in a
 * `<script type="application/ld+json">` element.
 *
 * `<`, `>` and `&` never appear in JSON syntax itself — only inside string
 * literals — so replacing them across the whole payload cannot corrupt it.
 */
export function escapeJsonLd(json: string): string {
	let out = '';

	for (const char of json) {
		const code = char.codePointAt(0) ?? 0;
		out += ESCAPED_CODE_POINTS.has(code) ? `\\u${code.toString(16).padStart(4, '0')}` : char;
	}

	return out;
}

/**
 * Serialize a JSON-LD value for `{@html}` embedding.
 *
 * Accepts either a plain value (stringified here) or a payload that was
 * already run through `JSON.stringify` upstream. Returns `''` for nullish
 * input so callers can guard with `{#if}`.
 */
export function serializeJsonLd(value: unknown): string {
	if (value === null || value === undefined) return '';

	const json = typeof value === 'string' ? value : JSON.stringify(value);
	if (!json) return '';

	return escapeJsonLd(json);
}
