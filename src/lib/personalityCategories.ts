// src/lib/personalityCategories.ts
import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';

export const PERSONALITY_CATEGORY_SLUGS = [
	'film-tv',
	'creator-media',
	'music',
	'politics-public',
	'tech-business',
	'comedy',
	'authors-thinkers'
] as const;

export type PersonalityCategorySlug = (typeof PERSONALITY_CATEGORY_SLUGS)[number];

export interface PersonalityCategoryDefinition {
	slug: PersonalityCategorySlug;
	label: string;
	shortLabel: string;
	summary: string;
	intro: string;
	groupingDescription: string;
	seoTitle: string;
	seoDescription: string;
	seoKeywords: string[];
	seoFaqs: Array<{ question: string; answer: string }>;
	accent: string;
	accentSoft: string;
	rawTypes: string[];
	related: PersonalityCategorySlug[];
}

export const PERSONALITY_CATEGORY_DEFINITIONS: PersonalityCategoryDefinition[] = [
	{
		slug: 'film-tv',
		label: 'Film & TV',
		shortLabel: 'Film & TV',
		summary:
			'Actors, TV personalities, celebrities, and crossover figures whose public identity is built on performance and image.',
		intro:
			'Actors, television personalities, and celebrity figures reveal how personality handles image pressure, reinvention, romantic projection, and the tension between public myth and private self.',
		groupingDescription:
			'Split into screen icons, rising stars, TV/comedy crossovers, and celebrity-image figures so actors are not mixed together with pure fame personalities.',
		seoTitle: 'Film & TV Personality Types: Actors, Celebrities & Rising Stars | 9takes',
		seoDescription:
			'Browse film and TV personality analysis for actors, celebrities, and rising stars through the Enneagram. Compare screen icons, breakout performers, and public-fascination figures.',
		seoKeywords: [
			'film and tv personality types',
			'actor enneagram types',
			'celebrity personality analysis',
			'movie star enneagram',
			'film and television enneagram'
		],
		seoFaqs: [
			{
				question: 'What is included in the Film & TV category?',
				answer:
					'This category groups actors, television personalities, celebrities, and breakout performers analyzed through the Enneagram. It separates screen icons, rising stars, comedy/TV crossovers, and pure celebrity-image figures.'
			},
			{
				question: 'Why compare actors and celebrities by category?',
				answer:
					'Comparing people inside the same entertainment lane makes image pressure, reinvention, fame strategy, charisma, and public-myth management easier to see.'
			},
			{
				question: 'Can someone appear in Film & TV and another category?',
				answer:
					'Yes. A person can also appear in music, comedy, creators, or politics when the public profile genuinely overlaps those domains.'
			}
		],
		accent: '#f59e0b',
		accentSoft: 'rgba(245, 158, 11, 0.18)',
		rawTypes: ['movieStar', 'newMovieStar', 'celebrity'],
		related: ['music', 'creator-media', 'comedy']
	},
	{
		slug: 'creator-media',
		label: 'Creators & Internet Personalities',
		shortLabel: 'Creators',
		summary:
			'YouTubers, podcasters, influencers, and media figures living inside the feedback loop.',
		intro:
			'Internet personalities make status, attention, audience trust, and identity management visible in real time. This category is where personality meets algorithms, parasociality, and platform economics.',
		groupingDescription:
			'Split into podcasters, commentators, business/self-improvement creators, streamers, viral entertainers, and lifestyle brand builders.',
		seoTitle:
			'Creators & Internet Personalities: Enneagram Types of YouTubers, Podcasters & Influencers | 9takes',
		seoDescription:
			'Explore creator personality analysis for YouTubers, podcasters, streamers, commentators, and influencers. See how internet fame, parasociality, and platform pressure shape personality.',
		seoKeywords: [
			'creator personality analysis',
			'youtuber enneagram types',
			'influencer personality types',
			'podcaster enneagram',
			'internet personalities enneagram'
		],
		seoFaqs: [
			{
				question: 'What kinds of creators are included here?',
				answer:
					'The page includes YouTubers, podcasters, interviewers, commentators, live streamers, viral entertainers, and lifestyle brand builders analyzed through the Enneagram.'
			},
			{
				question: 'Why are internet personalities useful for personality analysis?',
				answer:
					'Creators live inside constant audience feedback, algorithmic pressure, and identity performance, which makes personality patterns unusually visible in public.'
			},
			{
				question: 'How is the creator category organized?',
				answer:
					'It is split into podcasters, commentary personalities, business and self-improvement creators, streamers, viral entertainers, and lifestyle-driven internet figures.'
			}
		],
		accent: '#38bdf8',
		accentSoft: 'rgba(56, 189, 248, 0.18)',
		rawTypes: ['creator', 'influencer', 'tiktoker', 'lifestyleInfluencer', 'journalist'],
		related: ['tech-business', 'music', 'film-tv']
	},
	{
		slug: 'music',
		label: 'Musicians & Artists',
		shortLabel: 'Music',
		summary:
			'Pop stars, rappers, singer-songwriters, and crossover performers whose psychology shows up through style, voice, ambition, and artistic identity.',
		intro:
			'Musicians are often where personality becomes the most theatrical: authenticity versus performance, creative obsession versus commercial pressure, vulnerability versus persona.',
		groupingDescription:
			'Split into pop stars, rappers, alternative voices, singer-songwriters, and crossovers so the music page feels like real lanes instead of one pile.',
		seoTitle:
			'Musicians & Artists Personality Types: Enneagram Analysis of Singers, Rappers & Pop Stars | 9takes',
		seoDescription:
			'Browse musician personality analysis through the Enneagram, including pop stars, rappers, alternative artists, singer-songwriters, and crossover performers.',
		seoKeywords: [
			'musician personality types',
			'singer enneagram types',
			'rapper personality analysis',
			'pop star enneagram',
			'artist personality analysis'
		],
		seoFaqs: [
			{
				question: 'What kinds of artists are in the music category?',
				answer:
					'The music page includes pop stars, rappers, alternative artists, singer-songwriters, and crossover performers whose public identity is tied to music.'
			},
			{
				question: 'Why compare musicians by Enneagram type?',
				answer:
					'Music makes the tension between authenticity, persona, ambition, vulnerability, and performance unusually easy to compare across artists.'
			},
			{
				question: 'How is the music category subdivided?',
				answer:
					'It breaks the library into pop stars, rappers and genre disruptors, alternative voices, singer-songwriters, and multi-hyphenate crossover figures.'
			}
		],
		accent: '#f472b6',
		accentSoft: 'rgba(244, 114, 182, 0.18)',
		rawTypes: ['musician'],
		related: ['film-tv', 'creator-media', 'comedy']
	},
	{
		slug: 'politics-public',
		label: 'Politics & Public Figures',
		shortLabel: 'Politics',
		summary:
			'Politicians, activists, royals, and historical leaders operating in power, ideology, and public duty.',
		intro:
			'Public leadership makes power style visible. These profiles are useful for seeing how fear, conviction, charisma, duty, ambition, and symbolic responsibility scale under pressure.',
		groupingDescription:
			'Splits leaders into heads of state, campaign politicians, activists, and royals/public-duty figures so power styles are easier to compare.',
		seoTitle:
			'Politics & Public Figures Personality Types: Politicians, Activists & Leaders | 9takes',
		seoDescription:
			'Explore political personality analysis through the Enneagram, including presidents, campaign politicians, activists, royals, and historical leaders.',
		seoKeywords: [
			'politician personality types',
			'political enneagram',
			'leader personality analysis',
			'activist enneagram types',
			'public figures personality types'
		],
		seoFaqs: [
			{
				question: 'Who appears in the Politics & Public Figures category?',
				answer:
					'This page includes elected politicians, heads of state, activists, royals, and historically important public leaders analyzed through the Enneagram.'
			},
			{
				question: 'Why is politics useful for personality analysis?',
				answer:
					'Politics exposes how conviction, fear, duty, charisma, ambition, and power style behave under public pressure and institutional stakes.'
			},
			{
				question: 'How is the politics category organized?',
				answer:
					'The page separates heads of state, activists and movement leaders, royals and symbolic-duty figures, and campaign politicians or public persuaders.'
			}
		],
		accent: '#fb7185',
		accentSoft: 'rgba(251, 113, 133, 0.18)',
		rawTypes: ['politician', 'historical', 'activist'],
		related: ['tech-business', 'creator-media', 'film-tv']
	},
	{
		slug: 'tech-business',
		label: 'Tech, Founders & Business',
		shortLabel: 'Tech & Business',
		summary:
			'Founders, CEOs, investors, and operators whose psychology shapes products, companies, and strategy.',
		intro:
			'Founders and operators reveal how personality handles leverage, risk, optimization, control, long-term strategy, and the pressure to turn identity into systems.',
		groupingDescription:
			'Splits the category into big-tech CEOs, investors, frontier builders, operators, and tech interpreters.',
		seoTitle: 'Tech, Founders & Business Personality Types: CEOs, Investors & Builders | 9takes',
		seoDescription:
			'Browse Enneagram personality analysis of tech founders, CEOs, investors, operators, and business builders. Compare ambition, control, leverage, and strategy across high-agency leaders.',
		seoKeywords: [
			'founder personality types',
			'tech ceo enneagram',
			'startup founder personality analysis',
			'investor enneagram',
			'business leader personality types'
		],
		seoFaqs: [
			{
				question: 'What people are included in Tech, Founders & Business?',
				answer:
					'The category covers tech founders, public-company CEOs, investors, operators, frontier builders, and business personalities whose psychology shapes systems, products, and strategy.'
			},
			{
				question: 'Why compare founders and operators together?',
				answer:
					'Putting builders, capital allocators, and operators side by side makes it easier to compare how different personalities handle leverage, risk, power, and long-term control.'
			},
			{
				question: 'How is the tech category subdivided?',
				answer:
					'It separates big-tech founders and CEOs, investors and strategists, frontier builders in AI or defense, operators and business builders, and tech-media interpreters.'
			}
		],
		accent: '#34d399',
		accentSoft: 'rgba(52, 211, 153, 0.18)',
		rawTypes: ['techie', 'entrepreneur', 'business'],
		related: ['creator-media', 'politics-public', 'authors-thinkers']
	},
	{
		slug: 'comedy',
		label: 'Comedians',
		shortLabel: 'Comedy',
		summary:
			'Stand-ups, sketch comics, satirists, and crossover comedians where insecurity, aggression, absurdity, and social radar all sit close to the surface.',
		intro:
			'Comedy is a strong personality laboratory because the coping style is part of the performance. These profiles often expose shame, status games, intimacy avoidance, and honesty through humor.',
		groupingDescription:
			'Splits the library into stand-up headliners, sketch/TV comics, satire hosts, and internet-native comedians.',
		seoTitle: 'Comedians Personality Types: Stand-Up, Sketch & Satire Enneagram Analysis | 9takes',
		seoDescription:
			'Explore comedian personality analysis through the Enneagram, from stand-up headliners to sketch performers, satire hosts, and internet-native comics.',
		seoKeywords: [
			'comedian personality types',
			'stand up comedian enneagram',
			'comedy personality analysis',
			'satire host enneagram',
			'sketch comedian personality'
		],
		seoFaqs: [
			{
				question: 'What kinds of comedians are included on this page?',
				answer:
					'The comedy category covers stand-up comics, sketch performers, satire hosts, and internet-native comedians analyzed through the Enneagram.'
			},
			{
				question: 'Why is comedy useful for personality analysis?',
				answer:
					'Comedy often turns coping style into performance, which makes insecurity, aggression, honesty, shame management, and social radar easier to spot.'
			},
			{
				question: 'How is the comedy category organized?',
				answer:
					'The page separates stand-up headliners, sketch and TV comics, satire hosts, and internet or podcast-driven comedy personalities.'
			}
		],
		accent: '#facc15',
		accentSoft: 'rgba(250, 204, 21, 0.18)',
		rawTypes: ['comedian'],
		related: ['film-tv', 'creator-media', 'music']
	},
	{
		slug: 'authors-thinkers',
		label: 'Authors & Thinkers',
		shortLabel: 'Authors',
		summary:
			'Writers, psychologists, strategists, and interpreters where inner structure matters more than spectacle.',
		intro:
			'This group is less about fame performance and more about world-building. These profiles are useful for seeing how personality shapes ideas, frameworks, obsession, and narrative control.',
		groupingDescription:
			'Splits the page into novelists, strategy/psychology writers, and business/media interpreters.',
		seoTitle: 'Authors & Thinkers Personality Types: Writers, Psychologists & Strategists | 9takes',
		seoDescription:
			'Browse Enneagram personality analysis of authors, psychologists, essayists, strategists, and interpreters. Compare how different thinkers build frameworks, narratives, and ideas.',
		seoKeywords: [
			'author personality types',
			'writer enneagram',
			'psychologist personality analysis',
			'thinker enneagram types',
			'author enneagram analysis'
		],
		seoFaqs: [
			{
				question: 'Who appears in Authors & Thinkers?',
				answer:
					'This page includes novelists, essayists, psychology writers, strategists, and public interpreters whose work is built around ideas more than spectacle.'
			},
			{
				question: 'Why compare writers and thinkers together?',
				answer:
					'This category is useful because it shows how personality shapes frameworks, narrative control, obsession, explanatory style, and the way people build worlds in language.'
			},
			{
				question: 'How is the page subdivided?',
				answer:
					'The library is organized into novelists and world-builders, strategy or psychology writers, and business or media interpreters.'
			}
		],
		accent: '#818cf8',
		accentSoft: 'rgba(129, 140, 248, 0.18)',
		rawTypes: ['author', 'psychology', 'essay'],
		related: ['tech-business', 'politics-public', 'creator-media']
	}
] as const;

export const PRIMARY_PERSONALITY_CATEGORY_SLUGS: PersonalityCategorySlug[] = [
	'film-tv',
	'creator-media',
	'music',
	'politics-public',
	'tech-business'
];

export const SECONDARY_PERSONALITY_CATEGORY_SLUGS: PersonalityCategorySlug[] = [
	'comedy',
	'authors-thinkers'
];

const PERSONALITY_CATEGORY_MAP = new Map(
	PERSONALITY_CATEGORY_DEFINITIONS.map((category) => [category.slug, category])
);

const RAW_TYPE_LABELS: Record<string, string> = {
	creator: 'Creator',
	influencer: 'Influencer',
	tiktoker: 'TikToker',
	journalist: 'Journalist',
	lifestyleInfluencer: 'Lifestyle Influencer',
	entrepreneur: 'Entrepreneur',
	techie: 'Tech',
	business: 'Business',
	politician: 'Politician',
	historical: 'Historical Figure',
	activist: 'Activist',
	musician: 'Musician',
	movieStar: 'Movie Star',
	newMovieStar: 'Rising Movie Star',
	celebrity: 'Celebrity',
	comedian: 'Comedian',
	author: 'Author',
	athlete: 'Athlete',
	sports: 'Sports Figure',
	psychology: 'Psychology',
	other: 'Other',
	essay: 'Essay Subject',
	'cultural icon': 'Cultural Icon'
};

function normalizeTypeKey(value: string): string {
	return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

export function normalizePeopleTypes(value: unknown): string[] {
	let raw: string[] = [];

	if (Array.isArray(value)) {
		raw = value.map(String);
	} else if (value && typeof value === 'object') {
		raw = Object.values(value as Record<string, unknown>).map(String);
	} else if (typeof value === 'string' && value.trim().length > 0) {
		raw = value
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean);
	}

	const seen = new Set<string>();

	return raw.filter((item) => {
		const normalized = normalizeTypeKey(item);
		if (!normalized || seen.has(normalized)) return false;
		seen.add(normalized);
		return true;
	});
}

export function getPersonalityCategoryBySlug(
	slug: string
): PersonalityCategoryDefinition | undefined {
	return PERSONALITY_CATEGORY_MAP.get(slug as PersonalityCategorySlug);
}

export function getPersonalityCategorySlugs(types: string[]): PersonalityCategorySlug[] {
	const typeKeys = new Set(types.map((type) => normalizeTypeKey(type)));

	return PERSONALITY_CATEGORY_DEFINITIONS.filter((category) =>
		category.rawTypes.some((rawType) => typeKeys.has(normalizeTypeKey(rawType)))
	).map((category) => category.slug);
}

export function getPrimaryPersonalityCategorySlug(types: string[]): PersonalityCategorySlug | null {
	return getPersonalityCategorySlugs(types)[0] ?? null;
}

export function formatPersonalityRawType(type: string): string {
	return RAW_TYPE_LABELS[type] ?? type;
}

export function formatPersonName(slug: string): string {
	return formatPersonalityDisplayName(slug);
}
