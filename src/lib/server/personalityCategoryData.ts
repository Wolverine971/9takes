// src/lib/server/personalityCategoryData.ts
import type { Database, Json } from '../../../database.types';
import {
	formatPersonName,
	getPersonalityCategorySlugs,
	getPrimaryPersonalityCategorySlug,
	type PersonalityCategorySlug
} from '$lib/personalityCategories';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { getReviewedPersonTypes } from '$lib/reviewedPersonTypes';
import {
	CLUSTER_FIELDS,
	MUSIC_CLUSTER_TAGS,
	getLegacyMusicClusterTag
} from '$lib/personClusterTags.js';

const CLUSTER_LANE_BY_TAG = new Map(
	CLUSTER_FIELDS.flatMap(({ tags }) => tags.map(({ lane, tag }) => [tag, lane] as const))
);

export type PersonalityCategoryRow = Pick<
	Database['public']['Tables']['blogs_famous_people']['Row'],
	| 'person'
	| 'enneagram'
	| 'title'
	| 'description'
	| 'persona_title'
	| 'lastmod'
	| 'date'
	| 'type'
	| 'content_quality'
>;

export interface PersonalityCategoryPerson {
	slug: string;
	name: string;
	enneagram: string | null;
	title: string | null;
	description: string | null;
	personaTitle: string | null;
	lastmod: string | null;
	date: string | null;
	types: string[];
	categorySlugs: PersonalityCategorySlug[];
	primaryCategorySlug: PersonalityCategorySlug | null;
	contentQualityScore: number | null;
}

export interface EnneagramDistributionItem {
	enneagram: string;
	count: number;
}

export interface PersonalityCategoryGroup {
	slug: string;
	label: string;
	description: string;
	people: PersonalityCategoryPerson[];
	alsoInLane: Pick<PersonalityCategoryPerson, 'slug' | 'name'>[];
}

interface PersonalityCategoryGroupDefinition {
	slug: string;
	label: string;
	description: string;
	matches: (person: PersonalityCategoryPerson) => boolean;
}

// Most new lanes use the catalog's tag, label and description directly.
// Older lanes can additionally recognize profiles from before cluster tags existed.
function taggedLanes(field: string, ...selected: string[]): PersonalityCategoryGroupDefinition[] {
	return CLUSTER_FIELDS.find((entry) => entry.field === field)!
		.tags.filter((tag) => !selected.length || selected.includes(tag.tag))
		.map((tag) => ({
			slug: tag.lane,
			label: tag.short,
			description: tag.meaning,
			matches: (person) => hasClusterTag(person, tag.tag)
		}));
}

export function extractContentQualityScore(value: Json | null): number | null {
	if (value === null || value === undefined) return null;

	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : null;
	}

	if (typeof value === 'string') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}

	if (typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	const overall = (value as Record<string, unknown>).overall;
	if (typeof overall === 'number') {
		return Number.isFinite(overall) ? overall : null;
	}

	if (typeof overall === 'string') {
		const parsed = Number(overall);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
}

function getSortTimestamp(person: Pick<PersonalityCategoryPerson, 'lastmod' | 'date'>): number {
	const dateValue = person.lastmod ?? person.date;
	const timestamp = dateValue ? new Date(dateValue).getTime() : 0;
	return Number.isFinite(timestamp) ? timestamp : 0;
}

export function mapPersonalityCategoryRow(
	row: PersonalityCategoryRow
): PersonalityCategoryPerson | null {
	if (!row.person) return null;

	const normalizedSlug = normalizePersonalitySlug(row.person);
	const types = getReviewedPersonTypes(normalizedSlug, row.type);
	const categorySlugs = getPersonalityCategorySlugs(types, normalizedSlug);

	return {
		slug: normalizedSlug,
		name: formatPersonName(normalizedSlug),
		enneagram: row.enneagram ? String(row.enneagram) : null,
		title: row.title,
		description: row.description,
		personaTitle: row.persona_title,
		lastmod: row.lastmod,
		date: row.date,
		types,
		categorySlugs,
		primaryCategorySlug: getPrimaryPersonalityCategorySlug(types, normalizedSlug),
		contentQualityScore: extractContentQualityScore(row.content_quality)
	};
}

export function mapPersonalityCategoryRows(
	rows: PersonalityCategoryRow[]
): PersonalityCategoryPerson[] {
	// One card per slug. Duplicate DB rows that normalize to the same slug would otherwise
	// repeat the person, and the slug-keyed {#each} lists throw on duplicate keys.
	const seen = new Set<string>();
	return rows
		.map((row) => mapPersonalityCategoryRow(row))
		.filter((row): row is PersonalityCategoryPerson => {
			if (row === null || seen.has(row.slug)) return false;
			seen.add(row.slug);
			return true;
		});
}

export function sortPeopleForCategory(
	people: PersonalityCategoryPerson[]
): PersonalityCategoryPerson[] {
	return [...people].sort((a, b) => {
		const qualityDiff = (b.contentQualityScore ?? -1) - (a.contentQualityScore ?? -1);
		if (qualityDiff !== 0) return qualityDiff;

		const freshnessDiff = getSortTimestamp(b) - getSortTimestamp(a);
		if (freshnessDiff !== 0) return freshnessDiff;

		return a.name.localeCompare(b.name);
	});
}

export function getLatestCategoryDate(people: PersonalityCategoryPerson[]): string | null {
	return (
		[...people]
			.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a))
			.map((person) => person.lastmod ?? person.date)
			.find((value): value is string => Boolean(value)) ?? null
	);
}

export function getEarliestCategoryDate(people: PersonalityCategoryPerson[]): string | null {
	let earliest: string | null = null;
	let earliestTimestamp = Number.POSITIVE_INFINITY;

	for (const person of people) {
		const candidate = person.date ?? person.lastmod;
		if (!candidate) continue;

		const timestamp = new Date(candidate).getTime();
		if (!Number.isFinite(timestamp) || timestamp >= earliestTimestamp) continue;

		earliest = candidate;
		earliestTimestamp = timestamp;
	}

	return earliest;
}

export function getEnneagramDistribution(
	people: PersonalityCategoryPerson[]
): EnneagramDistributionItem[] {
	const counts = new Map<string, number>();

	for (const person of people) {
		if (!person.enneagram) continue;
		counts.set(person.enneagram, (counts.get(person.enneagram) ?? 0) + 1);
	}

	return [...counts.entries()]
		.sort((a, b) => Number(a[0]) - Number(b[0]))
		.map(([enneagram, count]) => ({ enneagram, count }));
}

function createNormalizedSlugSet(slugs: string[]): Set<string> {
	return new Set(slugs.map((slug) => normalizePersonalitySlug(slug)));
}

function personInSlugSet(
	person: Pick<PersonalityCategoryPerson, 'slug'>,
	slugs: Set<string>
): boolean {
	return slugs.has(normalizePersonalitySlug(person.slug));
}

function normalizeClusterTagKey(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

/**
 * Check if a person's `type` array contains a specific cluster tag.
 * Cluster tags are kebab-case strings (e.g. 'screen-icon', 'business-operator')
 * that map 1:1 to a sub-cluster on a category page. They live alongside
 * top-level category types (movieStar, entrepreneur, ...) in the same array.
 *
 * Frontmatter is the source of truth; pnpm push:people syncs to DB.
 */
function hasClusterTag(person: Pick<PersonalityCategoryPerson, 'types'>, tag: string): boolean {
	const target = normalizeClusterTagKey(tag);
	return person.types.some((t) => normalizeClusterTagKey(t) === target);
}

const CREATOR_MEDIA_PODCASTER_SLUGS = createNormalizedSlugSet([
	'Alex-Cooper',
	'Andrew-Huberman',
	'Bobby-Lee',
	'Caleb-Hearon',
	'Chris-Williamson',
	'Conan-OBrien',
	'Dax-Shepard',
	'Joe-Rogan',
	'Lex-Fridman',
	'Shawn-Ryan',
	'Theo-Von',
	'Tim-Ferriss'
]);

const CREATOR_MEDIA_COMMENTARY_SLUGS = createNormalizedSlugSet([
	'Andrew-Callaghan',
	'Andrew-Ross-Sorkin',
	'Hasan-Piker',
	'Krystal-Ball',
	'Piers-Morgan',
	'Ryan-Grim',
	'Saagar-Enjeti',
	'Stephen-A-Smith',
	'Taylor-Lorenz'
]);

const CREATOR_MEDIA_BUSINESS_SLUGS = createNormalizedSlugSet([
	'Ali-Abdaal',
	'Andrew-Huberman',
	'Andrew-Tate',
	'John-Coogan',
	'Shaan-Puri',
	'Steven-Bartlett',
	'Tony-Robbins'
]);

const CREATOR_MEDIA_STREAMER_SLUGS = createNormalizedSlugSet([
	'Adin-Ross',
	'Asmongold',
	'Clavicular',
	'IShowSpeed',
	'Kai-Cenat',
	'Pokimane',
	'TFue',
	'xQc'
]);

const CREATOR_MEDIA_ENTERTAINER_SLUGS = createNormalizedSlugSet([
	'Brittany-Broski',
	'Casey-Neistat',
	'David-Dobrik',
	'Dave-Portnoy',
	'Druski',
	'JackSepticeye',
	'Jake-Paul',
	'Jake-Shane',
	'KSI',
	'Kyle-Forgeard',
	'Logan-Paul',
	'Markiplier',
	'Mike-Majlak',
	'Mr-Beast',
	'PewDiePie',
	'Sean-Evans',
	'Trisha-Paytas'
]);

const CREATOR_MEDIA_LIFESTYLE_SLUGS = createNormalizedSlugSet([
	'Addison-Rae',
	'Alix-Earle',
	'Ashby',
	'Bobbi-Althoff',
	'Emma-Chamberlain',
	'James-Charles',
	'Kim-Kardashian',
	'Kylie-Jenner',
	'Madison-Beer',
	'Tara-Yummy'
]);

const CREATOR_MEDIA_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	{
		slug: 'podcasters-interviewers',
		label: 'Podcasters & Interview Hosts',
		description: 'Hosts of podcasts, video interview series, and online talk shows.',
		matches: (person) =>
			hasClusterTag(person, 'podcaster') || personInSlugSet(person, CREATOR_MEDIA_PODCASTER_SLUGS)
	},
	{
		slug: 'educational-youtubers',
		label: 'Educational YouTubers',
		description: 'Video creators who teach through tutorials, demonstrations, and explainers.',
		matches: (person) => hasClusterTag(person, 'educational-youtuber')
	},
	{
		slug: 'news-commentary',
		label: 'News & Commentary',
		description:
			'Personalities whose output revolves around politics, media narratives, reporting, or real-time cultural interpretation.',
		matches: (person) =>
			hasClusterTag(person, 'news-commentator') ||
			personInSlugSet(person, CREATOR_MEDIA_COMMENTARY_SLUGS) ||
			person.types.includes('journalist')
	},
	{
		slug: 'business-self-improvement',
		label: 'Business & Self-Improvement',
		description:
			'Creators selling frameworks, advice, and aspirational operating systems rather than pure entertainment.',
		matches: (person) =>
			hasClusterTag(person, 'business-creator') ||
			personInSlugSet(person, CREATOR_MEDIA_BUSINESS_SLUGS) ||
			person.types.includes('entrepreneur')
	},
	{
		slug: 'streamers-live',
		label: 'Streamers & Live Personalities',
		description:
			'Internet figures whose appeal depends on spontaneity, volume, parasocial energy, and what happens when the camera never really turns off.',
		matches: (person) =>
			hasClusterTag(person, 'streamer') || personInSlugSet(person, CREATOR_MEDIA_STREAMER_SLUGS)
	},
	{
		slug: 'viral-entertainers',
		label: 'Viral Entertainers & Platform Giants',
		description:
			'Big-internet personalities who win through scale, spectacle, bits, and repeatable attention mechanics.',
		matches: (person) =>
			hasClusterTag(person, 'viral-entertainer') ||
			personInSlugSet(person, CREATOR_MEDIA_ENTERTAINER_SLUGS)
	},
	{
		slug: 'lifestyle-brand-builders',
		label: 'Lifestyle & Celebrity Brand Builders',
		description:
			'Image-first creators whose leverage comes from taste, status, beauty, aspiration, and turning personal identity into a product line.',
		matches: (person) =>
			hasClusterTag(person, 'lifestyle-builder') ||
			personInSlugSet(person, CREATOR_MEDIA_LIFESTYLE_SLUGS) ||
			person.types.includes('lifestyleInfluencer') ||
			person.types.includes('influencer') ||
			person.types.includes('tiktoker')
	}
];

const FILM_TV_CROSSOVER_SLUGS = createNormalizedSlugSet([
	'Amy-Poehler',
	'Aubrey-Plaza',
	'Dave-Chappelle',
	'Howard-Stern',
	'Jack-Black',
	'Jon-Stewart',
	'Keke-Palmer',
	'Kevin-Hart',
	'Mindy-Kaling',
	'Oprah-Winfrey',
	'Pete-Davidson',
	'Stephen-Colbert',
	'Trevor-Noah'
]);

const FILM_TV_SCREEN_ACTOR_SLUGS = createNormalizedSlugSet([
	'Alexis-Bledel',
	'Amber-Heard',
	'Blake-Lively',
	'Cillian-Murphy',
	'Shia-LaBeouf',
	'Tom-Hardy'
]);

const FILM_TV_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	...taggedLanes('film-tv', 'tv-host'),
	{
		slug: 'reality-tv',
		label: 'Reality TV',
		description: 'Cast members and hosts of unscripted television series.',
		matches: (person) => hasClusterTag(person, 'reality-tv')
	},
	{
		slug: 'filmmakers',
		label: 'Filmmakers',
		description: 'Directors, screenwriters, and producers whose work shapes the films on screen.',
		matches: (person) => hasClusterTag(person, 'filmmaker') || hasClusterTag(person, 'director')
	},
	{
		slug: 'tv-comedy-crossovers',
		label: 'TV, Hosts & Comedy Crossovers',
		description:
			'People whose screen identity is built as much on hosting, sketch, stand-up, or broad personality as on classic film-star mystique.',
		matches: (person) =>
			hasClusterTag(person, 'tv-comedy-crossover') ||
			personInSlugSet(person, FILM_TV_CROSSOVER_SLUGS)
	},
	{
		slug: 'rising-stars-franchise-leads',
		label: 'Rising Stars & Franchise Leads',
		description:
			'Breakout actors and next-generation names still building the long arc of their public image.',
		matches: (person) =>
			hasClusterTag(person, 'rising-star') || person.types.includes('newMovieStar')
	},
	{
		slug: 'screen-icons-leading-actors',
		label: 'Screen Icons & Leading Actors',
		description:
			'Established movie stars, prestige actors, and marquee performers whose psychology shows up through craft, magnetism, and reinvention.',
		matches: (person) =>
			hasClusterTag(person, 'screen-icon') ||
			person.types.includes('movieStar') ||
			personInSlugSet(person, FILM_TV_SCREEN_ACTOR_SLUGS)
	},
	{
		slug: 'celebrity-image-public-fascination',
		label: 'Celebrity, Royalty & Public Fascination',
		description:
			'Profiles driven less by acting craft and more by image, tabloid gravity, royalty, beauty, scandal, and the machinery of fame.',
		matches: (person) =>
			hasClusterTag(person, 'celebrity-image') || person.types.includes('celebrity')
	}
];

const MUSIC_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = MUSIC_CLUSTER_TAGS.map(
	({ tag, lane, short, meaning }) => ({
		slug: lane,
		label: short,
		description: meaning,
		matches: (person) => getLegacyMusicClusterTag(person.slug) === tag
	})
);

const POLITICS_MODERN_LEADERS_SLUGS = createNormalizedSlugSet([
	'Barack-Obama',
	'Bill-Clinton',
	'Donald-Trump',
	'George-H-W-Bush',
	'George-W-Bush',
	'Jacinda-Ardern',
	'Jimmy-Carter',
	'Joe-Biden',
	'John-F-Kennedy',
	'Justin-Trudeau',
	'Ronald-Reagan',
	'Vladimir-Putin',
	'Volodymyr-Zelensky',
	'Winston-Churchill',
	'Xi-Jinping'
]);

const POLITICS_HISTORICAL_LEADERS_SLUGS = createNormalizedSlugSet([
	'Abraham-Lincoln',
	'Cleopatra',
	'Joseph-Stalin',
	'Julius-Caesar',
	'Marie-Antoinette',
	'Napoleon-Bonaparte'
]);

const POLITICS_ACTIVIST_SLUGS = createNormalizedSlugSet([
	'Greta-Thunberg',
	'Mahatma-Gandhi',
	'Malcolm-X',
	'Martin-Luther-King-Jr',
	'Mother-Teresa',
	'Nelson-Mandela',
	'Noam-Chomsky'
]);

const POLITICS_ROYALTY_SLUGS = createNormalizedSlugSet([
	'Meghan-Markle',
	'Prince-Harry',
	'Princess-Diana',
	'Queen-Elizabeth-II'
]);

const POLITICS_POLITICAL_SPOUSES_SLUGS = createNormalizedSlugSet([
	'Jackie-Kennedy',
	'Michelle-Obama',
	'Nancy-Reagan'
]);

const POLITICS_HISTORICAL_SCIENTISTS_SLUGS = createNormalizedSlugSet([
	'Albert-Einstein',
	'Friedrich-Nietzsche',
	'Leonardo-da-Vinci',
	'Marie-Curie',
	'Nikola-Tesla',
	'Robert-Oppenheimer',
	'Stephen-Hawking'
]);

const POLITICS_HISTORICAL_ARTISTS_SLUGS = createNormalizedSlugSet([
	'Agatha-Christie',
	'Edgar-Allan-Poe',
	'Ernest-Hemingway',
	'Frank-Lloyd-Wright',
	'Frida-Kahlo',
	'John-D-Rockefeller',
	'John-Lennon',
	'Mark-Twain',
	'Vincent-Van-Gogh'
]);

const POLITICS_PUBLIC_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	...taggedLanes('politics-public', 'political-family'),
	{
		slug: 'modern-heads-of-state-world-leaders',
		label: 'Modern Heads of State & World Leaders',
		description:
			'Post-WWII presidents, prime ministers, and rulers operating inside contemporary politics — coalition-building, media warfare, public scrutiny, and modern statecraft.',
		matches: (person) =>
			hasClusterTag(person, 'modern-leader') ||
			personInSlugSet(person, POLITICS_MODERN_LEADERS_SLUGS)
	},
	{
		slug: 'historical-leaders-power-holders',
		label: 'Historical Leaders & Power Holders',
		description:
			'Pre-WWII rulers, emperors, and regime-defining figures whose personalities shaped wars, dynasties, and the institutions that came after them.',
		matches: (person) =>
			hasClusterTag(person, 'historical-leader') ||
			personInSlugSet(person, POLITICS_HISTORICAL_LEADERS_SLUGS)
	},
	{
		slug: 'activists-movement-leaders',
		label: 'Activists & Movement Leaders',
		description:
			'People defined less by office and more by moral urgency, persuasion, sacrifice, movement energy, or symbolic resistance.',
		matches: (person) =>
			hasClusterTag(person, 'movement-leader') || personInSlugSet(person, POLITICS_ACTIVIST_SLUGS)
	},
	{
		slug: 'royalty-symbolic-public-duty',
		label: 'Royals & Symbolic Public Duty',
		description:
			'Figures whose public life revolves around symbolic service, inherited expectations, diplomacy, image, and the burden of representing something larger than themselves.',
		matches: (person) =>
			hasClusterTag(person, 'royalty') || personInSlugSet(person, POLITICS_ROYALTY_SLUGS)
	},
	{
		slug: 'first-ladies-political-spouses',
		label: 'First Ladies & Political Spouses',
		description:
			'Partners of presidents and power figures who built their own public identities through proximity to office — image discipline, advocacy, and the strange role of representing without being elected.',
		matches: (person) =>
			hasClusterTag(person, 'political-spouse') ||
			personInSlugSet(person, POLITICS_POLITICAL_SPOUSES_SLUGS)
	},
	{
		slug: 'campaign-politicians-public-persuaders',
		label: 'Campaign Politicians & Public Persuaders',
		description:
			'Elected officials, rising party figures, judges, and influence-heavy public actors navigating coalitions, messaging, ambition, and permanent visibility.',
		matches: (person) =>
			hasClusterTag(person, 'campaign-politician') || person.types.includes('politician')
	},
	{
		slug: 'historical-scientists-thinkers',
		label: 'Historical Scientists & Thinkers',
		description:
			'Scientists, inventors, mathematicians, and philosophers whose personalities shaped how we understand reality — obsession, isolation, cognitive style, and the cost of seeing further than peers.',
		matches: (person) =>
			hasClusterTag(person, 'historical-scientist') ||
			personInSlugSet(person, POLITICS_HISTORICAL_SCIENTISTS_SLUGS)
	},
	{
		slug: 'historical-artists-writers',
		label: 'Historical Artists & Writers',
		description:
			'Painters, novelists, poets, architects, and cultural figures whose interior lives shaped Western art and literature — temperament, suffering, craft, and the link between personality and aesthetic vision.',
		matches: (person) =>
			hasClusterTag(person, 'historical-artist') ||
			personInSlugSet(person, POLITICS_HISTORICAL_ARTISTS_SLUGS)
	}
];

const TECH_BIG_TECH_SLUGS = createNormalizedSlugSet([
	'Bill-Gates',
	'Elon-Musk',
	'Jack-Dorsey',
	'Jeff-Bezos',
	'Mark-Zuckerberg',
	'Reed-Hastings',
	'Satya-Nadella',
	'Sundar-Pichai',
	'Tim-Cook',
	'Travis-Kalanick'
]);

const TECH_INVESTOR_SLUGS = createNormalizedSlugSet([
	'Chamath-Palihapitiya',
	'David-Friedberg',
	'David-Sacks',
	'Jason-Calacanis',
	'Marc-Andreessen',
	'Paul-Graham',
	'Peter-Thiel',
	'Reid-Hoffman'
]);

const TECH_FRONTIER_SLUGS = createNormalizedSlugSet([
	'Alex-Karp',
	'Dario-Amodei',
	'Palmer-Luckey',
	'Sam-Altman'
]);

const TECH_OPERATOR_SLUGS = createNormalizedSlugSet([
	'Alex-Hormozi',
	'Gary-Vee',
	'John-Coogan',
	'Jordi-Hays',
	'Leila-Hormozi',
	'Sam-Parr',
	'Shaan-Puri',
	'Steven-Bartlett',
	'Taylor-Swift',
	'Tony-Robbins',
	'Tyler-Perry'
]);

const TECH_INTERPRETER_SLUGS = createNormalizedSlugSet([
	'Kara-Swisher',
	'Lex-Fridman',
	'Scott-Galloway'
]);

const TECH_BUSINESS_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	...taggedLanes('technology', 'startup-advisor'),
	{
		slug: 'big-tech-founders-ceos',
		label: 'Tech founders & executives',
		description:
			'Company-defining builders managing scale, products, public scrutiny, and the pressure of running systems that affect millions.',
		matches: (person) =>
			hasClusterTag(person, 'big-tech-founder') || personInSlugSet(person, TECH_BIG_TECH_SLUGS)
	},
	{
		slug: 'investors-strategists-power-brokers',
		label: 'Investors, Strategists & Power Brokers',
		description:
			'People whose edge comes from narrative control, contrarian bets, leverage, and seeing second-order effects before everyone else does.',
		matches: (person) =>
			hasClusterTag(person, 'investor') || personInSlugSet(person, TECH_INVESTOR_SLUGS)
	},
	{
		slug: 'frontier-builders-ai-defense',
		label: 'Frontier Builders: AI & Defense',
		description:
			'Builders working in the highest-stakes corners of technology where existential ambition, security, and world-modeling all get amplified.',
		matches: (person) =>
			hasClusterTag(person, 'frontier-builder') || personInSlugSet(person, TECH_FRONTIER_SLUGS)
	},
	{
		slug: 'inventors-engineers',
		label: 'Inventors & engineers',
		description: 'People who design, engineer and bring new products to market.',
		matches: (person) => hasClusterTag(person, 'inventor')
	},
	{
		slug: 'talent-managers',
		label: 'Talent managers',
		description: 'Managers who represent performers and develop their careers.',
		matches: (person) => hasClusterTag(person, 'talent-manager')
	},
	{
		slug: 'operators-business-builders',
		label: 'Founders & operators',
		description:
			'Entrepreneurial personalities focused on execution, sales, operating systems, and turning a personal philosophy into a business engine.',
		matches: (person) =>
			hasClusterTag(person, 'business-operator') ||
			personInSlugSet(person, TECH_OPERATOR_SLUGS) ||
			person.types.includes('entrepreneur') ||
			person.types.includes('business')
	},
	{
		slug: 'tech-media-interpreters',
		label: 'Tech Media & Interpreter Types',
		description:
			'Media figures and public intellectuals who translate tech power for an audience instead of only building behind the scenes.',
		matches: (person) =>
			hasClusterTag(person, 'tech-interpreter') || personInSlugSet(person, TECH_INTERPRETER_SLUGS)
	}
];

const COMEDY_STANDUP_SLUGS = createNormalizedSlugSet([
	'Andrew-Schulz',
	'Dave-Chappelle',
	'Joe-Rogan',
	'Shane-Gillis',
	'Theo-Von',
	'Tim-Dillon'
]);

const COMEDY_SKETCH_SLUGS = createNormalizedSlugSet([
	'Amy-Poehler',
	'Aubrey-Plaza',
	'Jack-Black',
	'Kevin-Hart',
	'Marcello-Hernandez',
	'Mindy-Kaling',
	'Pete-Davidson',
	'Tim-Robinson'
]);

const COMEDY_SATIRE_SLUGS = createNormalizedSlugSet([
	'Jon-Stewart',
	'Stephen-Colbert',
	'Trevor-Noah'
]);

const COMEDY_INTERNET_SLUGS = createNormalizedSlugSet(['Caleb-Hearon', 'Druski']);

const COMEDY_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	{
		slug: 'stand-up-headliners',
		label: 'Stand-Up Headliners',
		description:
			'Comics built on live energy, provocation, timing, and the need to dominate a room with a single voice.',
		matches: (person) =>
			hasClusterTag(person, 'stand-up') || personInSlugSet(person, COMEDY_STANDUP_SLUGS)
	},
	{
		slug: 'sketch-tv-character-comics',
		label: 'Sketch, TV & Character Comics',
		description:
			'Performers whose comedy depends on ensemble instincts, recurring personas, writing rooms, or long-form character work.',
		matches: (person) =>
			hasClusterTag(person, 'sketch-comic') || personInSlugSet(person, COMEDY_SKETCH_SLUGS)
	},
	{
		slug: 'satire-hosts-political-comedy',
		label: 'Satire Hosts & Political Comedy',
		description:
			'Comedians who merge humor with commentary, making cultural interpretation part of the act.',
		matches: (person) =>
			hasClusterTag(person, 'satire-host') || personInSlugSet(person, COMEDY_SATIRE_SLUGS)
	},
	{
		slug: 'internet-podcast-comics',
		label: 'Internet & Podcast Comics',
		description:
			'Comedians whose appeal grows through clips, audience intimacy, personality-first content, and internet-native momentum.',
		matches: (person) =>
			hasClusterTag(person, 'internet-comic') || personInSlugSet(person, COMEDY_INTERNET_SLUGS)
	}
];

const AUTHOR_NOVELIST_SLUGS = createNormalizedSlugSet([
	'George-RR-Martin',
	'J.K.-Rowling',
	'Sarah-J-Maas'
]);

const AUTHOR_STRATEGY_SLUGS = createNormalizedSlugSet([
	'Jordan-Peterson',
	'Malcolm-Gladwell',
	'Robert-Greene',
	'david-perrel-thiel-essay'
]);

const AUTHOR_INTERPRETER_SLUGS = createNormalizedSlugSet(['Kara-Swisher', 'Scott-Galloway']);

const AUTHOR_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	...taggedLanes('authors-thinkers', 'memoirist', 'science-writer'),
	{
		slug: 'novelists-world-builders',
		label: 'Novelists & World-Builders',
		description:
			'Writers whose inner structure shows up through narrative architecture, myth-making, and the desire to build complete worlds.',
		matches: (person) =>
			hasClusterTag(person, 'novelist') || personInSlugSet(person, AUTHOR_NOVELIST_SLUGS)
	},
	{
		slug: 'strategy-psychology-writers',
		label: 'Strategy & Psychology Writers',
		description:
			'Authors and essayists whose work is built around frameworks, motives, social dynamics, and explanatory power.',
		matches: (person) =>
			hasClusterTag(person, 'strategy-writer') ||
			personInSlugSet(person, AUTHOR_STRATEGY_SLUGS) ||
			person.types.includes('psychology') ||
			person.types.includes('essay')
	},
	{
		slug: 'business-media-interpreters',
		label: 'Business & Media Interpreters',
		description:
			'Writers and commentators translating power, markets, media, and elite behavior into digestible narratives for an audience.',
		matches: (person) =>
			hasClusterTag(person, 'business-interpreter') ||
			personInSlugSet(person, AUTHOR_INTERPRETER_SLUGS)
	}
];

function buildCategoryGroups(
	people: PersonalityCategoryPerson[],
	definitions: PersonalityCategoryGroupDefinition[],
	fallback: Pick<PersonalityCategoryGroup, 'slug' | 'label' | 'description'>,
	includeSecondary: boolean
): PersonalityCategoryGroup[] {
	const grouped = new Map<string, PersonalityCategoryPerson[]>();
	const unassigned: PersonalityCategoryPerson[] = [];
	const secondary = new Map<string, PersonalityCategoryGroup['alsoInLane']>();

	for (const definition of definitions) {
		grouped.set(definition.slug, []);
	}

	for (const person of people) {
		// An explicit cluster tag decides the lane. Broad fallbacks (movieStar,
		// celebrity, politician...) only place people who have no tag for this field,
		// so a 'celebrity-image' movie star isn't pulled into Screen Icons first.
		const lanes = person.types
			.map((tag) => CLUSTER_LANE_BY_TAG.get(normalizeClusterTagKey(tag)))
			.filter((lane): lane is string => lane !== undefined && grouped.has(lane));
		const definition =
			definitions.find((candidate) => candidate.slug === lanes[0]) ??
			definitions.find((candidate) => candidate.matches(person));
		if (includeSecondary) {
			for (const lane of new Set(lanes.slice(1))) {
				const members = secondary.get(lane) ?? [];
				members.push({ slug: person.slug, name: person.name });
				secondary.set(lane, members);
			}
		}

		if (!definition) {
			unassigned.push(person);
			continue;
		}

		grouped.get(definition.slug)?.push(person);
	}

	const results = definitions
		.map((definition) => ({
			slug: definition.slug,
			label: definition.label,
			description: definition.description,
			people: sortPeopleForCategory(grouped.get(definition.slug) ?? []),
			alsoInLane: secondary.get(definition.slug) ?? []
		}))
		.filter((group) => group.people.length > 0 || group.alsoInLane.length > 0);

	if (unassigned.length > 0) {
		results.push({
			...fallback,
			people: sortPeopleForCategory(unassigned),
			alsoInLane: []
		});
	}

	return results;
}

function lanesForField(field: 'technology' | 'business') {
	const slugs = new Set(
		CLUSTER_FIELDS.find((entry) => entry.field === field)!.tags.map((tag) => tag.lane)
	);
	return TECH_BUSINESS_GROUP_DEFINITIONS.filter((lane) => slugs.has(lane.slug));
}

const CATEGORY_GROUP_CONFIGS: Record<
	PersonalityCategorySlug,
	{
		definitions: PersonalityCategoryGroupDefinition[];
		fallback: Pick<PersonalityCategoryGroup, 'slug' | 'label' | 'description'>;
	}
> = {
	'film-tv': {
		definitions: FILM_TV_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-screen-personalities',
			label: 'Other Screen Personalities',
			description:
				'Useful profiles that belong in the film and TV orbit, but do not yet fit one of the tighter screen or celebrity clusters.'
		}
	},
	'creator-media': {
		definitions: CREATOR_MEDIA_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-internet-personalities',
			label: 'Other Internet Personalities',
			description:
				'Useful profiles that still belong in this category, but do not yet fit one of the tighter creator clusters.'
		}
	},
	music: {
		definitions: MUSIC_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-music-personalities',
			label: 'Other Music Personalities',
			description:
				'Useful musician profiles that belong here, but do not yet fit one of the tighter genre or crossover sections.'
		}
	},
	'politics-public': {
		definitions: POLITICS_PUBLIC_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-public-figures',
			label: 'Other Public Figures',
			description:
				'Useful profiles tied to politics or public life that still need a more specific lane as the library grows.'
		}
	},
	technology: {
		definitions: lanesForField('technology'),
		fallback: {
			slug: 'other-technology',
			label: 'Other technology figures',
			description: 'More people working in technology.'
		}
	},
	business: {
		definitions: lanesForField('business'),
		fallback: {
			slug: 'other-business',
			label: 'Other business figures',
			description: 'More people working in business.'
		}
	},
	'tech-business': {
		definitions: TECH_BUSINESS_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-tech-business-figures',
			label: 'Other Tech & Business Figures',
			description:
				'Profiles that clearly belong in this category, but do not yet fit one of the tighter founder, investor, or operator lanes.'
		}
	},
	fashion: {
		definitions: taggedLanes('fashion'),
		fallback: {
			slug: 'other-fashion',
			label: 'Other fashion figures',
			description: 'More people working in fashion and beauty.'
		}
	},
	comedy: {
		definitions: COMEDY_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-comedians',
			label: 'Other Comedians',
			description:
				'Useful comedy profiles that still belong on this page, but do not yet fit one of the tighter stand-up, satire, or crossover groupings.'
		}
	},
	'authors-thinkers': {
		definitions: AUTHOR_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-authors-thinkers',
			label: 'Other Authors & Thinkers',
			description:
				'Writers and interpreters that belong here, but do not yet fit one of the tighter author or thinker sections.'
		}
	}
};

export function getPersonalityCategoryGroups(
	categorySlug: PersonalityCategorySlug,
	people: PersonalityCategoryPerson[],
	{ includeSecondary = false } = {}
): PersonalityCategoryGroup[] {
	const config = CATEGORY_GROUP_CONFIGS[categorySlug];
	return buildCategoryGroups(people, config.definitions, config.fallback, includeSecondary);
}
