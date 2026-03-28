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
