// src/lib/data/popCultureBridges.ts
//
// Internal-linking bridges for /pop-culture/[slug] pages.
//
// Bucket 3 — Internal linking & graph bridging.
// The cross-link report flagged 28 pop-culture posts with zero outgoing
// links to the rest of the 9takes graph. These maps wire each published
// pop-culture page to:
//   1. The most relevant Enneagram type pillar (/enneagram-corner/...)
//   2. The relevant /corpus-stats anchor for the topical domain
//   3. The matching /personality-analysis/categories/[slug] page
//
// Coverage is the 22 currently-published files. Add new entries when more
// pop-culture pages flip to published. Slugs that are not in the map fall
// back to a sensible default (Type 3 pillar + tech-business stats).

import type { PersonalityCategorySlug } from '$lib/personalityCategories';

export interface PopCultureBridges {
	/** Primary Enneagram type to bridge to. 1-9. */
	type: number;
	/** /corpus-stats anchor — must match a domain.slug shipped on /corpus-stats. */
	corpusAnchor: string;
	/** Personality-analysis category slug. */
	category: PersonalityCategorySlug;
	/** Optional secondary type pillar (e.g., "Type 5 vs Type 4" pieces). */
	secondaryType?: number;
}

/**
 * Per-slug bridge map. Keys are the file slug (without `.md`). All published
 * pop-culture posts as of 2026-05-07 are covered.
 */
export const POP_CULTURE_BRIDGES: Record<string, PopCultureBridges> = {
	// Krystal/Saagar (Type 1 + Type 7 framing)
	'breaking-points-enneagram-analysis': {
		type: 1,
		secondaryType: 7,
		corpusAnchor: 'politics-public',
		category: 'politics-public'
	},
	// Comedians — Comedy Kings is broad (Type 7-leaning)
	'comedy-kings-enneagram-analysis': {
		type: 7,
		corpusAnchor: 'comedy',
		category: 'comedy'
	},
	// Dark triad spans all types but Type 8 dark side is the closest single pillar
	'dark-triad-meets-enneagram': {
		type: 8,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	// Epstein analyses — Type 2 dark "helper" framing
	'epstein-psychology-part-1': {
		type: 2,
		corpusAnchor: 'politics-public',
		category: 'politics-public'
	},
	'epstein-psychology-part-2': {
		type: 2,
		corpusAnchor: 'politics-public',
		category: 'politics-public'
	},
	// Fallen founders (Holmes/Neumann/SBF) — Type 3 dominant
	'fallen-founders-enneagram-analysis': {
		type: 3,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	// Maxwell — Type 3 / loyal-to-power adjacent
	'ghislaine-maxwell-psychology': {
		type: 3,
		corpusAnchor: 'politics-public',
		category: 'politics-public'
	},
	// Google leadership evolution — Type 5 founder vs Type 9 steward
	'google-leadership-evolution': {
		type: 5,
		secondaryType: 9,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	// Hollywood heartthrobs — Type 3 image management
	'hollywood-heartthrobs-enneagram-analysis': {
		type: 3,
		corpusAnchor: 'film-tv',
		category: 'film-tv'
	},
	// Blackpill / incel radicalization — Type 6 fear / Type 4 envy framing
	'incel-blackpill-radicalization-enneagram': {
		type: 6,
		secondaryType: 4,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Influencers (Instagram, Type 3 dominant)
	'influencer-enneagram-types-instagram': {
		type: 3,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Masculinity / strength — Type 8 framing
	'masculinity-strength-and-the-enneagram': {
		type: 8,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Musk vs Altman — Type 5 + Type 4 explicit
	'musk-vs-altman-trial-personality-dynamics': {
		type: 5,
		secondaryType: 4,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	// Parasocial relationships — Type 4 longing / Type 2 attachment
	'parasocial-relationships-enneagram-type': {
		type: 4,
		secondaryType: 2,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Podcast Bros — Type 7 / Type 8 framing
	'podcast-bros-enneagram-analysis': {
		type: 7,
		secondaryType: 8,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Podcaster personality map — broad creator
	'podcaster-personality-map': {
		type: 5,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Reddit moderators — explicit Type 1
	'reddit-moderators-type-1-internet': {
		type: 1,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	},
	// Tech titans series — Type 5 / Type 8 across pieces
	'tech-titans-ai-wars': {
		type: 5,
		secondaryType: 8,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	'tech-titans-disruptors': {
		type: 8,
		secondaryType: 5,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	'tech-titans-enneagram-analysis': {
		type: 5,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	'tech-titans-founders-vs-stewards': {
		type: 5,
		secondaryType: 9,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	'tech-titans-leadership-styles': {
		type: 8,
		secondaryType: 3,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	'tech-titans-platform-emperors': {
		type: 8,
		corpusAnchor: 'tech-business',
		category: 'tech-business'
	},
	// Trump vs Biden
	'trump-type-8-vs-biden-type-2': {
		type: 8,
		secondaryType: 2,
		corpusAnchor: 'politics-public',
		category: 'politics-public'
	},
	// Twitter / X toxicity — Type 8 / Type 6 conflict-seeking
	'twitter-x-personality-types-toxic': {
		type: 8,
		secondaryType: 6,
		corpusAnchor: 'creator-media',
		category: 'creator-media'
	}
};

/**
 * Resolve bridge metadata for a pop-culture slug. Returns null if the slug
 * has no entry — the caller should hide the bridge block in that case
 * rather than emitting a default that could be wrong.
 */
export function getPopCultureBridges(slug: string): PopCultureBridges | null {
	return POP_CULTURE_BRIDGES[slug] ?? null;
}
