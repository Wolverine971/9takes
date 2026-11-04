// src/lib/personClusterTags.js
// Cluster tags are the specific labels in a person's frontmatter `type` array
// ('screen-icon', 'pop-star', ...) that place them in a lane inside their field:
// the sub-groups on the category pages and on the type hub's Spotlight cards.
//
// Plain JS with no imports so node scripts (the blog pipeline's draft checks,
// audits) and the SvelteKit app share one list. personClusterTags.spec.ts keeps
// it in step with PERSONALITY_CATEGORY_DEFINITIONS and the lane matchers in
// $lib/server/personalityCategoryData.ts; docs/writing-system/people-profile-standard.md
// carries the same table for the pipeline's writers.

/**
 * @typedef {{ tag: string, lane: string, short: string, meaning: string }} ClusterTag
 * @typedef {{ field: string, rawTypes: string[], excludeSlugs: string[], tags: ClusterTag[] }} ClusterField
 */

/** Fields in category order; tags in each field's lane-match order. @type {ClusterField[]} */
export const CLUSTER_FIELDS = [
	{
		field: 'film-tv',
		rawTypes: ['movieStar', 'newMovieStar', 'celebrity'],
		excludeSlugs: [],
		tags: [
			{
				tag: 'tv-comedy-crossover',
				lane: 'tv-comedy-crossovers',
				short: 'TV & comedy crossovers',
				meaning:
					'Hosts and comic performers whose screen identity is personality, not film-star mystique'
			},
			{
				tag: 'rising-star',
				lane: 'rising-stars-franchise-leads',
				short: 'Rising stars',
				meaning: 'Breakout actors still building their public image'
			},
			{
				tag: 'screen-icon',
				lane: 'screen-icons-leading-actors',
				short: 'Screen icons',
				meaning: 'Established movie stars and prestige actors'
			},
			{
				tag: 'celebrity-image',
				lane: 'celebrity-image-public-fascination',
				short: 'Celebrity image',
				meaning: 'Fame built on image, royalty, beauty, scandal or spectacle more than acting craft'
			}
		]
	},
	{
		field: 'creator-media',
		rawTypes: ['creator', 'influencer', 'tiktoker', 'lifestyleInfluencer', 'journalist'],
		excludeSlugs: ['Brene-Brown', 'Dolly-Parton', 'Neil-Strauss'],
		tags: [
			{
				tag: 'podcaster',
				lane: 'podcasters-interviewers',
				short: 'Podcasters',
				meaning: 'Long-form hosts built on conversation'
			},
			{
				tag: 'news-commentator',
				lane: 'news-commentary',
				short: 'News & commentary',
				meaning: 'Politics, media narratives, reporting or real-time cultural commentary'
			},
			{
				tag: 'business-creator',
				lane: 'business-self-improvement',
				short: 'Business & self-help',
				meaning: 'Creators selling frameworks, advice and self-improvement'
			},
			{
				tag: 'streamer',
				lane: 'streamers-live',
				short: 'Streamers',
				meaning: 'Live streamers whose appeal is spontaneity and parasocial energy'
			},
			{
				tag: 'viral-entertainer',
				lane: 'viral-entertainers',
				short: 'Viral entertainers',
				meaning: 'Big-internet personalities who win through scale, spectacle and bits'
			},
			{
				tag: 'lifestyle-builder',
				lane: 'lifestyle-brand-builders',
				short: 'Lifestyle brands',
				meaning: 'Image-first creators turning taste, beauty or status into a brand'
			}
		]
	},
	{
		field: 'music',
		rawTypes: ['musician'],
		excludeSlugs: [],
		tags: [
			{
				tag: 'pop-star',
				lane: 'pop-stars-hitmakers',
				short: 'Pop stars',
				meaning: 'Chart-level pop stars living under image and hit pressure'
			},
			{
				tag: 'rapper',
				lane: 'rappers-genre-disruptors',
				short: 'Rappers',
				meaning: 'Rappers and genre disruptors built on force, edge and provocation'
			},
			{
				tag: 'alternative-artist',
				lane: 'alternative-art-pop-voices',
				short: 'Alt & art-pop',
				meaning: 'Alternative and art-pop artists centered on outsider identity or experimentation'
			},
			{
				tag: 'singer-songwriter',
				lane: 'singer-songwriters-roots',
				short: 'Singer-songwriters',
				meaning: 'Writers and roots performers where the draw is voice, confession and craft'
			},
			{
				tag: 'music-crossover',
				lane: 'crossovers-multi-hyphenates',
				short: 'Crossovers',
				meaning:
					'Musicians whose career overlaps heavily with acting, creator culture or celebrity branding'
			}
		]
	},
	{
		field: 'politics-public',
		rawTypes: ['politician', 'historical', 'activist'],
		excludeSlugs: ['Shailene-Woodley', 'Lupita-Nyongo'],
		tags: [
			{
				tag: 'modern-leader',
				lane: 'modern-heads-of-state-world-leaders',
				short: 'World leaders',
				meaning: 'Post-WWII presidents, prime ministers and rulers'
			},
			{
				tag: 'historical-leader',
				lane: 'historical-leaders-power-holders',
				short: 'Historical leaders',
				meaning: 'Pre-WWII rulers, emperors and regime-defining figures'
			},
			{
				tag: 'movement-leader',
				lane: 'activists-movement-leaders',
				short: 'Movement leaders',
				meaning: 'Activists and movement leaders defined by moral urgency, not office'
			},
			{
				tag: 'royalty',
				lane: 'royalty-symbolic-public-duty',
				short: 'Royals',
				meaning: 'Royals and figures of symbolic public duty'
			},
			{
				tag: 'political-spouse',
				lane: 'first-ladies-political-spouses',
				short: 'Political spouses',
				meaning: 'First ladies and partners of power figures'
			},
			{
				tag: 'campaign-politician',
				lane: 'campaign-politicians-public-persuaders',
				short: 'Campaign politicians',
				meaning: 'Elected officials, party figures and judges who are not heads of state'
			},
			{
				tag: 'historical-scientist',
				lane: 'historical-scientists-thinkers',
				short: 'Scientists & thinkers',
				meaning: 'Historical scientists, inventors, mathematicians and philosophers'
			},
			{
				tag: 'historical-artist',
				lane: 'historical-artists-writers',
				short: 'Artists & writers',
				meaning: 'Historical painters, novelists, poets and cultural figures'
			}
		]
	},
	{
		field: 'tech-business',
		rawTypes: ['techie', 'entrepreneur', 'business'],
		excludeSlugs: [],
		tags: [
			{
				tag: 'big-tech-founder',
				lane: 'big-tech-founders-ceos',
				short: 'Big Tech founders',
				meaning: 'Founders and CEOs of companies operating at massive scale'
			},
			{
				tag: 'investor',
				lane: 'investors-strategists-power-brokers',
				short: 'Investors',
				meaning: 'Investors, strategists and power brokers'
			},
			{
				tag: 'frontier-builder',
				lane: 'frontier-builders-ai-defense',
				short: 'AI & frontier builders',
				meaning: 'Builders in AI, defense and other high-stakes frontier tech'
			},
			{
				tag: 'business-operator',
				lane: 'operators-business-builders',
				short: 'Operators',
				meaning: 'Entrepreneurs and executives focused on execution and sales'
			},
			{
				tag: 'tech-interpreter',
				lane: 'tech-media-interpreters',
				short: 'Tech interpreters',
				meaning: 'Media figures who explain tech power rather than build it'
			}
		]
	},
	{
		field: 'comedy',
		rawTypes: ['comedian'],
		excludeSlugs: [],
		tags: [
			{
				tag: 'stand-up',
				lane: 'stand-up-headliners',
				short: 'Stand-up',
				meaning: 'Stand-up comics built on live timing and a single voice'
			},
			{
				tag: 'sketch-comic',
				lane: 'sketch-tv-character-comics',
				short: 'Sketch & TV',
				meaning: 'Sketch, sitcom and character comedians'
			},
			{
				tag: 'satire-host',
				lane: 'satire-hosts-political-comedy',
				short: 'Satire hosts',
				meaning: 'Comedians who fuse humor with political or cultural commentary'
			},
			{
				tag: 'internet-comic',
				lane: 'internet-podcast-comics',
				short: 'Internet comics',
				meaning: 'Comedians who grew through clips, podcasts and internet-native momentum'
			}
		]
	},
	{
		field: 'authors-thinkers',
		rawTypes: ['author', 'psychology', 'essay'],
		excludeSlugs: [],
		tags: [
			{
				tag: 'novelist',
				lane: 'novelists-world-builders',
				short: 'Novelists',
				meaning: 'Novelists and world-builders'
			},
			{
				tag: 'strategy-writer',
				lane: 'strategy-psychology-writers',
				short: 'Strategy & psychology',
				meaning: 'Authors of frameworks on strategy, psychology, motives or self-help'
			},
			{
				tag: 'business-interpreter',
				lane: 'business-media-interpreters',
				short: 'Business interpreters',
				meaning: 'Writers who translate markets, power and media for a general audience'
			}
		]
	}
];

/** Broad tags sort after specific ones when choosing a person's main field. */
const BROAD_TYPES = new Set(['celebrity', 'historical']);

/** @param {string} value */
const typeKey = (value) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

/** @param {string} value */
const slugKey = (value) =>
	value
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]/gi, '')
		.toLowerCase();

const TAG_KEYS = new Set(CLUSTER_FIELDS.flatMap(({ tags }) => tags.map(({ tag }) => typeKey(tag))));

/** @param {unknown} value */
export function isClusterTag(value) {
	return typeof value === 'string' && TAG_KEYS.has(typeKey(value));
}

/** @param {string} laneSlug */
export function getClusterLaneShortLabel(laneSlug) {
	for (const { tags } of CLUSTER_FIELDS) {
		const match = tags.find(({ lane }) => lane === laneSlug);
		if (match) return match.short;
	}
	return null;
}

/**
 * The single field a person is filed under on the type hub: specific tags in
 * authored order first, then broad ones (celebrity, historical). 'athletes' and
 * 'other' have no lanes.
 * @param {string[]} types
 * @param {string} [personSlug]
 * @returns {string}
 */
export function getPrimaryField(types, personSlug = '') {
	const person = personSlug ? slugKey(personSlug) : '';
	const ordered = [
		...types.filter((type) => !BROAD_TYPES.has(typeKey(type))),
		...types.filter((type) => BROAD_TYPES.has(typeKey(type)))
	];
	for (const type of ordered) {
		const key = typeKey(type);
		if (key === 'athlete') return 'athletes';
		const field = CLUSTER_FIELDS.find(
			({ rawTypes, excludeSlugs }) =>
				rawTypes.some((raw) => typeKey(raw) === key) &&
				!(person && excludeSlugs.some((slug) => slugKey(slug) === person))
		);
		if (field) return field.field;
	}
	return 'other';
}

/**
 * The field whose cluster tag a person still needs, or null when they have one
 * (or their field has no lanes).
 * @param {unknown} types frontmatter `type`
 * @param {string} [personSlug]
 * @returns {string | null}
 */
export function getMissingClusterField(types, personSlug = '') {
	const list = /** @type {string[]} */ (
		Array.isArray(types) ? types.filter((t) => typeof t === 'string') : []
	);
	const field = CLUSTER_FIELDS.find(({ field }) => field === getPrimaryField(list, personSlug));
	if (!field) return null;
	const keys = new Set(list.map(typeKey));
	return field.tags.some(({ tag }) => keys.has(typeKey(tag))) ? null : field.field;
}
