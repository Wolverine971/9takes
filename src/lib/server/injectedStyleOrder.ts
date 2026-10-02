// src/lib/server/injectedStyleOrder.ts

// Blog posts compile with `css: 'injected'` (see svelte.config.js), so SSR renders each
// post's styles as `<style id="svelte-…">` inside %sveltekit.head%. SvelteKit places that
// rendered head *before* the page's `<link rel="stylesheet">` tags, which would let
// equal-specificity rules in blog.css / the [slug] page CSS beat the post's own rules.
// Post CSS used to load after those stylesheets (and Svelte appends injected styles at the
// end of <head> on client-side navigation), so move them back to the end of <head>.
const INJECTED_STYLE = /<style id="svelte-[a-z0-9]+">[\s\S]*?<\/style>/g;

export function moveInjectedStylesAfterStylesheets(html: string): string {
	if (!html.includes('<style id="svelte-')) return html;

	const headEnd = html.indexOf('</head>');
	if (headEnd === -1) return html;

	const head = html.slice(0, headEnd);
	const styles = head.match(INJECTED_STYLE);
	if (!styles) return html;

	return head.replace(INJECTED_STYLE, '') + styles.join('') + html.slice(headEnd);
}
