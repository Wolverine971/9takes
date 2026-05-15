// src/lib/personalityCategories.ts
import {
	formatPersonalityDisplayName,
	normalizePersonalitySlug
} from '$lib/utils/personalityAnalysis';

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
	/**
	 * 100–150 word paragraph rendered visibly under the hero lede.
	 * Should organically include 2–3 seoKeywords and read like value-dense
	 * editorial copy, not a meta description rephrase.
	 */
	seoIntro: string;
	seoFaqs: Array<{ question: string; answer: string }>;
	/**
	 * Optional absolute URL to a per-category OG/Twitter card.
	 * Falls back to the brand-wide social card when omitted.
	 * Should be a 1200×628 image hosted under https://9takes.com/.
	 */
	ogImage?: string;
	accent: string;
	accentSoft: string;
	rawTypes: string[];
	related: PersonalityCategorySlug[];
	/**
	 * Person slugs that should NOT appear under this category even when their
	 * type tags would otherwise qualify them. Use for celebrities tagged with
	 * a peripheral type (e.g., activist actresses) who really belong on their
	 * primary category page.
	 */
	excludeSlugs?: string[];
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
		seoIntro:
			'Film and TV personality analysis on 9takes maps how actors, celebrities, and rising stars actually behave under image pressure — not how their PR teams describe them. Movie star Enneagram types make image management, romantic projection, reinvention, and the gap between public myth and private self unusually easy to read. By comparing actor Enneagram types side by side — screen icons against breakout performers, A-list celebrities against TV crossovers — you can see which patterns repeat and why some careers stall while others compound. Each profile is built from interviews, public behavior, and consistent emotional signals across years of footage. Use this category as a lens, not a label: the goal is sharper pattern recognition, not box-checking a personality.',
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
		seoIntro:
			'Creator personality analysis is where Enneagram patterns become visible in real time. YouTubers, podcasters, streamers, and influencer personality types live inside constant audience feedback, so the trade-offs between authenticity and persona, ambition and burnout, intimacy and parasociality show up faster than in any other domain. The internet personalities Enneagram lens is useful precisely because the work itself is identity work — every upload reinforces or contradicts a public self. This category compares podcaster Enneagram patterns alongside commentary creators, business and self-improvement personalities, viral entertainers, and lifestyle brand builders. Read across lanes to see which traits scale on platform pressure, which collapse under it, and which Enneagram types shift their tone the moment the camera turns on.',
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
		related: ['tech-business', 'music', 'film-tv'],
		excludeSlugs: ['Brene-Brown', 'Dolly-Parton', 'Neil-Strauss']
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
		seoIntro:
			'Musician personality types reveal where authenticity, persona, and ambition collide. Pop star Enneagram analysis on this page covers singers, rappers, alternative voices, and singer-songwriters whose public identity is inseparable from their music. Comparing rapper personality analysis next to indie songwriters and crossover artists makes the tension between commercial scale and creative obsession visible — and often shows why two artists with identical résumés have completely different relationships with fame. Each musician Enneagram profile is built around recurring patterns in lyrics, interviews, performance choices, and public conflict, not single moments. Use this category to ask why a given artist sounds like themselves, where the persona ends and the person begins, and which Enneagram types cope by writing.',
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
			'Splits the library into modern world leaders, historical power holders, activists, royals, political spouses, campaign politicians, and historical cultural icons so power styles, eras, and roles stay legible side by side.',
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
		seoIntro:
			'Political personality analysis exposes how conviction, fear, charisma, and duty actually behave under stakes. Politician personality types in this category include presidents, campaign politicians, activists, royals, and historical leaders — all settings where personality has to operate in public, on the record, with consequences. Political Enneagram comparisons make power style legible: which leaders run on conviction, which on grievance, which on duty, and which on optimism. The activist Enneagram lens is especially useful when the work is movement-building rather than office-holding, because moral clarity and strategic patience pull in different directions. Use this page to compare leader personality analysis across eras, ideologies, and institutions, and see which Enneagram patterns repeat — even across centuries.',
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
					'The page separates modern heads of state and world leaders, historical leaders and power holders, activists and movement leaders, royals and symbolic-duty figures, first ladies and political spouses, campaign politicians and public persuaders, and historical cultural icons (scientists, thinkers, artists, and writers).'
			}
		],
		accent: '#fb7185',
		accentSoft: 'rgba(251, 113, 133, 0.18)',
		rawTypes: ['politician', 'historical', 'activist'],
		related: ['tech-business', 'creator-media', 'film-tv'],
		excludeSlugs: ['Shailene-Woodley', 'Lupita-Nyongo']
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
		seoIntro:
			'Founder personality types reveal how leverage, control, and long-term strategy actually operate. The tech CEO Enneagram lens on this page covers public-company chiefs, frontier builders in AI and defense, operators, investors, and tech-media interpreters — high-agency people whose psychology gets compounded by capital, distribution, and time. Comparing startup founder personality analysis side by side with public-company operators makes one thing obvious: the same trait that builds a company can wreck the next stage of it. Investor Enneagram profiles add the capital-allocator angle — pattern matching, conviction, contrarianism, and risk tolerance — so you can see how money and operating styles map differently. Read this category for business leader personality types whose decisions ripple far beyond the org chart.',
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
		seoIntro:
			'Comedian personality types are a working laboratory for the Enneagram, because the coping style is the act. Stand-up comedian Enneagram analysis on this page includes headliners, sketch and TV comics, satire hosts, and internet-native comedians — performers whose insecurities, aggressions, status games, and honesty mechanisms are built into the material. Compare comedy personality analysis across lanes and the patterns get sharper: which comics use shame as fuel, which use absurdity as armor, which weaponize charm, and which use the stage as the only safe room they have. Each satire host Enneagram profile and sketch comedian personality breakdown is grounded in repeated behavior across specials, interviews, and persona shifts, not single jokes — because the long arc is where the type shows up.',
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
		seoIntro:
			'Author personality types reveal a different shape of psychology than fame-based profiles, because the work happens in private and the output is structure. Writer Enneagram analysis here covers novelists, essayists, strategy and psychology writers, and public interpreters — people whose careers are built around frameworks, ideas, and narrative control rather than spectacle. Psychologist personality analysis shows how internal models become public-facing tools, while thinker Enneagram types make explanatory style and intellectual obsession easy to compare across disciplines. Read this category to see how different personalities build worlds in language: which authors compress, which expand, which moralize, which categorize, and which use writing to manage their own type. The author Enneagram analysis on each profile traces patterns across decades of work.',
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
	psychology: 'Psychology',
	other: 'Other',
	essay: 'Essay Subject'
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

export function getPersonalityCategorySlugs(
	types: string[],
	personSlug?: string | null
): PersonalityCategorySlug[] {
	const typeKeys = new Set(types.map((type) => normalizeTypeKey(type)));
	const normalizedPersonSlug = personSlug ? normalizePersonalitySlug(personSlug) : '';

	return PERSONALITY_CATEGORY_DEFINITIONS.filter((category) => {
		if (!category.rawTypes.some((rawType) => typeKeys.has(normalizeTypeKey(rawType)))) {
			return false;
		}

		if (normalizedPersonSlug && category.excludeSlugs?.length) {
			const excluded = category.excludeSlugs.some(
				(slug) => normalizePersonalitySlug(slug) === normalizedPersonSlug
			);
			if (excluded) return false;
		}

		return true;
	}).map((category) => category.slug);
}

export function getPrimaryPersonalityCategorySlug(
	types: string[],
	personSlug?: string | null
): PersonalityCategorySlug | null {
	return getPersonalityCategorySlugs(types, personSlug)[0] ?? null;
}

export function formatPersonalityRawType(type: string): string {
	return RAW_TYPE_LABELS[type] ?? type;
}

export function formatPersonName(slug: string): string {
	return formatPersonalityDisplayName(slug);
}
