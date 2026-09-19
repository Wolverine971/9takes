// src/lib/rehype-internal-links.js
/**
 * Rehype plugin that normalizes links back to 9takes.com.
 *
 * mdsvex hard-wires remark-external-links with `rel: ['nofollow']` for every
 * absolute URL, so a markdown link written as `https://9takes.com/...` ships as
 * a nofollow internal link (flagged by the 2026-09-14 Ahrefs audit, including
 * 10 links on the top-traffic mental-illness post). This plugin:
 *
 * - rewrites absolute 9takes.com hrefs to root-relative paths
 * - drops `nofollow` from those links
 * - strips a trailing slash from internal paths (the site 308s `/foo/` -> `/foo`)
 */

/**
 * @typedef {{ type: string, tagName?: string, properties?: Record<string, any>, children?: HastNode[] }} HastNode
 */

const SITE_ORIGIN_PATTERN = /^https?:\/\/(?:www\.)?9takes\.com(?=[/?#]|$)/i;

/**
 * @param {string} href
 * @returns {string | null} normalized root-relative href, or null when not internal
 */
export function normalizeInternalHref(href) {
	let path;
	if (SITE_ORIGIN_PATTERN.test(href)) {
		path = href.replace(SITE_ORIGIN_PATTERN, '') || '/';
		if (!path.startsWith('/')) path = `/${path}`;
	} else if (href.startsWith('/') && !href.startsWith('//')) {
		path = href;
	} else {
		return null;
	}

	const match = path.match(/^([^?#]*)(.*)$/);
	const pathname = match?.[1] ?? path;
	const suffix = match?.[2] ?? '';
	const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
	return `${trimmed || '/'}${suffix}`;
}

/** @returns {(tree: HastNode) => void} */
export default function rehypeInternalLinks() {
	return (tree) => {
		walk(tree);

		/** @param {HastNode} node */
		function walk(node) {
			if (node.type === 'element' && node.tagName === 'a' && node.properties) {
				const href = node.properties.href;
				const normalized = typeof href === 'string' ? normalizeInternalHref(href) : null;
				if (normalized !== null) {
					node.properties.href = normalized;
					const rel = node.properties.rel;
					const relTokens = Array.isArray(rel)
						? rel
						: typeof rel === 'string'
							? rel.split(/\s+/)
							: [];
					const kept = relTokens.filter((token) => token && token !== 'nofollow');
					if (kept.length) node.properties.rel = kept;
					else delete node.properties.rel;
				}
			}
			if (node.children) {
				for (const child of node.children) walk(child);
			}
		}
	};
}
