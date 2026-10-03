// src/lib/data/popCultureRedirects.ts
// Permanent (301) redirects for renamed /pop-culture posts, checked at the top of
// src/routes/pop-culture/[slug]/+page.ts. Keys are old slugs. Values are absolute
// paths to the final destination: never point at another key (no redirect chains).
// The spec next to the route fails if a target is missing, unpublished, or chained.
export const popCultureRedirects: Record<string, string> = {
	// 2026-10-03 (T-38): Trump retyped from 8 to 3 to match his analysis page
	'trump-type-8-vs-biden-type-2': '/pop-culture/trump-type-3-vs-biden-type-2'
};
