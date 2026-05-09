// src/lib/data/popCultureTaxonomy.ts

export interface PopCultureSubcategoryMeta {
	slug: string;
	title: string;
	descriptor: string;
}

export interface PopCultureCategoryMeta {
	slug: string;
	title: string;
	descriptor: string;
	subcategories: PopCultureSubcategoryMeta[];
}

export interface PopCultureTaxonomy {
	category: string;
	subcategory?: string;
	series?: string;
}

export const POP_CULTURE_CATEGORIES: PopCultureCategoryMeta[] = [
	{
		slug: 'tech-business',
		title: 'Tech & Silicon Valley',
		descriptor: 'Founders, platforms, AI power, and the personality of modern empires.',
		subcategories: [
			{
				slug: 'tech-titans',
				title: 'Tech Titans',
				descriptor: 'Founder archetypes and the types shaping the future.'
			},
			{
				slug: 'ai-power',
				title: 'AI Power',
				descriptor: 'The personality dynamics behind the AI race.'
			},
			{
				slug: 'founders-stewards',
				title: 'Founders & Stewards',
				descriptor: 'What happens when founder psychology becomes company infrastructure.'
			},
			{
				slug: 'founder-failure',
				title: 'Founder Failure',
				descriptor: 'Collapse patterns in high-status startup psychology.'
			},
			{
				slug: 'platform-builders',
				title: 'Platform Builders',
				descriptor: 'The people whose wiring became the products billions use.'
			},
			{
				slug: 'leadership-styles',
				title: 'Leadership Styles',
				descriptor: 'How each type leads, scales, and distorts organizations.'
			},
			{
				slug: 'paypal-mafia',
				title: 'PayPal Mafia',
				descriptor: 'The personality pressure cooker behind a generation of tech power.'
			},
			{
				slug: 'venture-media',
				title: 'Venture Media',
				descriptor: 'Tech operators, investors, and media personalities in the same room.'
			}
		]
	},
	{
		slug: 'politics-power',
		title: 'Politics & Power',
		descriptor: 'Politicians, presidents, media coalitions, and the psychology of authority.',
		subcategories: [
			{
				slug: 'presidents',
				title: 'Presidents',
				descriptor: 'Presidential personalities and the emotional logic of the office.'
			},
			{
				slug: 'world-leaders',
				title: 'World Leaders',
				descriptor: 'How national leaders misread, mirror, and pressure each other.'
			},
			{
				slug: 'political-media',
				title: 'Political Media',
				descriptor: 'The odd-couple dynamics behind public persuasion.'
			},
			{
				slug: 'political-groups',
				title: 'Political Groups',
				descriptor: 'Coalitions, factions, and the personalities that hold them together.'
			}
		]
	},
	{
		slug: 'internet-culture',
		title: 'Internet Culture',
		descriptor: 'Creators, platforms, parasocial bonds, online status, and digital conflict.',
		subcategories: [
			{
				slug: 'creator-economy',
				title: 'Creator Economy',
				descriptor: 'Influencers, streaming empires, gurus, and the attention economy.'
			},
			{
				slug: 'podcasting-media',
				title: 'Podcasting & Media',
				descriptor: 'Hosts, niches, and the intimacy engines replacing old media.'
			},
			{
				slug: 'platform-conflict',
				title: 'Platform Conflict',
				descriptor: 'Where moderation, outrage, cancellation, and status games collide.'
			},
			{
				slug: 'platform-power',
				title: 'Platform Power',
				descriptor: 'The people who enforce norms inside online spaces.'
			},
			{
				slug: 'digital-intimacy',
				title: 'Digital Intimacy',
				descriptor: 'Sex, fantasy, attachment, and monetized closeness online.'
			},
			{
				slug: 'parasociality',
				title: 'Parasociality',
				descriptor: 'Why strangers start to feel emotionally necessary.'
			},
			{
				slug: 'masculinity-internet',
				title: 'Masculinity Online',
				descriptor: 'Status, shame, strength, resentment, and male identity in public.'
			},
			{
				slug: 'radicalization',
				title: 'Radicalization',
				descriptor: 'How shame and belonging harden into ideology.'
			}
		]
	},
	{
		slug: 'entertainment-media',
		title: 'Entertainment & Media',
		descriptor: 'Hollywood, television, fictional casts, celebrity trials, and public performance.',
		subcategories: [
			{
				slug: 'comedy',
				title: 'Comedy',
				descriptor: 'The different ways comedians turn pain into control, connection, or escape.'
			},
			{
				slug: 'hollywood-fame',
				title: 'Hollywood Fame',
				descriptor: 'Actors, awards, heartthrobs, and the machinery of public desire.'
			},
			{
				slug: 'fictional-worlds',
				title: 'Fictional Worlds',
				descriptor: 'Shows, casts, and character systems mapped through type.'
			},
			{
				slug: 'celebrity-conflict',
				title: 'Celebrity Conflict',
				descriptor:
					'Public breakups, trials, and relationship narratives as personality collisions.'
			},
			{
				slug: 'awards-season',
				title: 'Awards Season',
				descriptor: 'The status rituals and personality patterns behind industry recognition.'
			}
		]
	},
	{
		slug: 'celebrity-dynasties',
		title: 'Families & Dynasties',
		descriptor: 'Public families, royal systems, and inherited fame through type.',
		subcategories: [
			{
				slug: 'famous-families',
				title: 'Famous Families',
				descriptor: 'When every family role becomes a public brand.'
			},
			{
				slug: 'royal-family',
				title: 'Royal Family',
				descriptor: 'Duty, image, rebellion, and institution-level family psychology.'
			}
		]
	},
	{
		slug: 'dark-psychology',
		title: 'Dark Psychology',
		descriptor: 'Criminal networks, shadow patterns, manipulation, and power used badly.',
		subcategories: [
			{
				slug: 'shadow-types',
				title: 'Shadow Types',
				descriptor: 'How each Enneagram pattern goes wrong when conscience drops out.'
			},
			{
				slug: 'epstein-network',
				title: 'Epstein Network',
				descriptor: 'The manipulation system around Epstein, Maxwell, and elite dependency.'
			}
		]
	},
	{
		slug: 'music-fame',
		title: 'Music & Fame',
		descriptor: 'Pop stars, music dynasties, fandom, and performance identity.',
		subcategories: [
			{
				slug: 'pop-stars',
				title: 'Pop Stars',
				descriptor: 'How singers build identities big enough for mass projection.'
			}
		]
	}
];

const CATEGORY_MAP = new Map(POP_CULTURE_CATEGORIES.map((category) => [category.slug, category]));

const SUBCATEGORY_MAP = new Map(
	POP_CULTURE_CATEGORIES.flatMap((category) =>
		category.subcategories.map((subcategory) => [subcategory.slug, subcategory] as const)
	)
);

export const FALLBACK_POP_CULTURE_CATEGORY: PopCultureCategoryMeta = {
	slug: 'uncategorized',
	title: 'Pop Culture',
	descriptor: 'Pop culture analysis that still needs a tighter taxonomy assignment.',
	subcategories: [
		{
			slug: 'general',
			title: 'General',
			descriptor: 'General pop culture psychology.'
		}
	]
};

export const FALLBACK_POP_CULTURE_SUBCATEGORY = FALLBACK_POP_CULTURE_CATEGORY.subcategories[0];

export function getPopCultureCategory(slug: string | null | undefined): PopCultureCategoryMeta {
	return CATEGORY_MAP.get(slug ?? '') ?? FALLBACK_POP_CULTURE_CATEGORY;
}

export function getPopCultureSubcategory(
	slug: string | null | undefined
): PopCultureSubcategoryMeta {
	return SUBCATEGORY_MAP.get(slug ?? '') ?? FALLBACK_POP_CULTURE_SUBCATEGORY;
}

export function normalizePopCultureTaxonomy(
	value: App.BlogPost['popCulture'] | null | undefined
): PopCultureTaxonomy {
	if (!value?.category) {
		return {
			category: FALLBACK_POP_CULTURE_CATEGORY.slug,
			subcategory: FALLBACK_POP_CULTURE_SUBCATEGORY.slug
		};
	}

	return {
		category: value.category,
		subcategory: value.subcategory ?? FALLBACK_POP_CULTURE_SUBCATEGORY.slug,
		series: value.series
	};
}

export function getPopCultureSimilarityScore(
	base: App.BlogPost['popCulture'] | null | undefined,
	candidate: App.BlogPost['popCulture'] | null | undefined
): number {
	const a = normalizePopCultureTaxonomy(base);
	const b = normalizePopCultureTaxonomy(candidate);
	let score = 0;

	if (a.category === b.category) score += 4;
	if (a.subcategory && a.subcategory === b.subcategory) score += 10;
	if (a.series && b.series && a.series === b.series) score += 6;

	return score;
}
