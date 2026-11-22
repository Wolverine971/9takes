// src/lib/data/noindexPeople.js

/**
 * Person pages kept live on 9takes but out of Google (robots noindex + no
 * sitemap entry). They stay reachable from links on the site.
 *
 * A page belongs here when its search traffic is almost entirely the wrong
 * crowd: searches about the person's life that never become personality
 * readers. That traffic is what the Nov 2026 core update cut hardest (see
 * ~/.cache/9takes-research/search-terms-2026-11-21/SYNTHESIS.md). Plain JS so
 * scripts/generate-sitemap.js can import it.
 *
 * @type {ReadonlyMap<string, string>} slug -> why (with the date DJ decided)
 */
export const NOINDEX_PEOPLE = new Map([
	[
		'sky-bri',
		'2026-11-21 (DJ): 3 of 25,843 impressions in 90 days were personality searches; the rest were adult-content and "did she retire" searches.'
	]
]);

/** @param {string | null | undefined} slug */
export function isNoindexPerson(slug) {
	return Boolean(slug) && NOINDEX_PEOPLE.has(String(slug).toLowerCase());
}
