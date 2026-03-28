// src/lib/server/personalityCategoryData.ts
import type { Database, Json } from '../../../database.types';
import {
	formatPersonName,
	getPersonalityCategorySlugs,
	getPrimaryPersonalityCategorySlug,
	normalizePeopleTypes,
	type PersonalityCategorySlug
} from '$lib/personalityCategories';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';

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
}

interface PersonalityCategoryGroupDefinition {
	slug: string;
	label: string;
	description: string;
	matches: (person: PersonalityCategoryPerson) => boolean;
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
	const types = normalizePeopleTypes(row.type);
	const categorySlugs = getPersonalityCategorySlugs(types);

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
		primaryCategorySlug: getPrimaryPersonalityCategorySlug(types),
		contentQualityScore: extractContentQualityScore(row.content_quality)
	};
}

export function mapPersonalityCategoryRows(
	rows: PersonalityCategoryRow[]
): PersonalityCategoryPerson[] {
	return rows
		.map((row) => mapPersonalityCategoryRow(row))
		.filter((row): row is PersonalityCategoryPerson => row !== null);
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

const CREATOR_MEDIA_PODCASTER_SLUGS = createNormalizedSlugSet([
	'Alex-Cooper',
	'Andrew-Huberman',
	'Chris-Williamson',
	'Dax-Shepard',
	'Joe-Rogan',
	'Lex-Fridman',
	'Shawn-Ryan',
	'Theo-Von',
	'Tim-Ferriss'
]);

const CREATOR_MEDIA_COMMENTARY_SLUGS = createNormalizedSlugSet([
	'Andrew-Callaghan',
	'Hasan-Piker',
	'Krystal-Ball',
	'Saagar-Enjeti',
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
	'Clavicular',
	'IShowSpeed',
	'Kai-Cenat',
	'Pokimane',
	'xQc'
]);

const CREATOR_MEDIA_ENTERTAINER_SLUGS = createNormalizedSlugSet([
	'Brittany-Broski',
	'Casey-Neistat',
	'Dave-Portnoy',
	'Druski',
	'Jake-Shane',
	'Logan-Paul',
	'Mr-Beast',
	'PewDiePie'
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
		label: 'Podcasters & Interviewers',
		description:
			'Long-form hosts built around conversation, chemistry, and the ability to keep attention for an hour instead of a clip.',
		matches: (person) => personInSlugSet(person, CREATOR_MEDIA_PODCASTER_SLUGS)
	},
	{
		slug: 'news-commentary',
		label: 'News & Commentary',
		description:
			'Personalities whose output revolves around politics, media narratives, reporting, or real-time cultural interpretation.',
		matches: (person) =>
			personInSlugSet(person, CREATOR_MEDIA_COMMENTARY_SLUGS) || person.types.includes('journalist')
	},
	{
		slug: 'business-self-improvement',
		label: 'Business & Self-Improvement',
		description:
			'Creators selling frameworks, advice, and aspirational operating systems rather than pure entertainment.',
		matches: (person) =>
			personInSlugSet(person, CREATOR_MEDIA_BUSINESS_SLUGS) || person.types.includes('entrepreneur')
	},
	{
		slug: 'streamers-live',
		label: 'Streamers & Live Personalities',
		description:
			'Internet figures whose appeal depends on spontaneity, volume, parasocial energy, and what happens when the camera never really turns off.',
		matches: (person) => personInSlugSet(person, CREATOR_MEDIA_STREAMER_SLUGS)
	},
	{
		slug: 'viral-entertainers',
		label: 'Viral Entertainers & Platform Giants',
		description:
			'Big-internet personalities who win through scale, spectacle, bits, and repeatable attention mechanics.',
		matches: (person) => personInSlugSet(person, CREATOR_MEDIA_ENTERTAINER_SLUGS)
	},
	{
		slug: 'lifestyle-brand-builders',
		label: 'Lifestyle & Celebrity Brand Builders',
		description:
			'Image-first creators whose leverage comes from taste, status, beauty, aspiration, and turning personal identity into a product line.',
		matches: (person) =>
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
	{
		slug: 'tv-comedy-crossovers',
		label: 'TV, Hosts & Comedy Crossovers',
		description:
			'People whose screen identity is built as much on hosting, sketch, stand-up, or broad personality as on classic film-star mystique.',
		matches: (person) => personInSlugSet(person, FILM_TV_CROSSOVER_SLUGS)
	},
	{
		slug: 'rising-stars-franchise-leads',
		label: 'Rising Stars & Franchise Leads',
		description:
			'Breakout actors and next-generation names still building the long arc of their public image.',
		matches: (person) => person.types.includes('newMovieStar')
	},
	{
		slug: 'screen-icons-leading-actors',
		label: 'Screen Icons & Leading Actors',
		description:
			'Established movie stars, prestige actors, and marquee performers whose psychology shows up through craft, magnetism, and reinvention.',
		matches: (person) =>
			person.types.includes('movieStar') || personInSlugSet(person, FILM_TV_SCREEN_ACTOR_SLUGS)
	},
	{
		slug: 'celebrity-image-public-fascination',
		label: 'Celebrity, Royalty & Public Fascination',
		description:
			'Profiles driven less by acting craft and more by image, tabloid gravity, royalty, beauty, scandal, and the machinery of fame.',
		matches: (person) => person.types.includes('celebrity')
	}
];

const MUSIC_POP_STAR_SLUGS = createNormalizedSlugSet([
	'Ariana-Grande',
	'Beyonce-Knowles',
	'Billie-Eilish',
	'Harry-Styles',
	'Miley-Cyrus',
	'Olivia-Rodrigo',
	'Rihanna',
	'Sabrina-Carpenter',
	'Taylor-Swift',
	'Troye-Sivan',
	'Zayn-Malik'
]);

const MUSIC_RAP_GENRE_SLUGS = createNormalizedSlugSet([
	'Bad-Bunny',
	'Drake',
	'Doechii',
	'Doja-Cat',
	'Eminem',
	'Post-Malone',
	'Travis-Scott',
	'Tyler-The-Creator'
]);

const MUSIC_ALTERNATIVE_SLUGS = createNormalizedSlugSet([
	'Chappell-Roan',
	'Charli-xcx',
	'Grimes',
	'Halsey'
]);

const MUSIC_SINGER_SONGWRITER_SLUGS = createNormalizedSlugSet([
	'Benson-Boone',
	'Dolly-Parton',
	'Hozier',
	'Jelly-Roll',
	'John-Mayer'
]);

const MUSIC_CROSSOVER_SLUGS = createNormalizedSlugSet([
	'Addison-Rae',
	'Jack-Black',
	'Jared-Leto',
	'Keke-Palmer',
	'Madison-Beer'
]);

const MUSIC_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	{
		slug: 'pop-stars-hitmakers',
		label: 'Pop Stars & Global Hitmakers',
		description:
			'High-visibility stars whose psychology plays out through image management, chart pressure, and the need to stay culturally central.',
		matches: (person) => personInSlugSet(person, MUSIC_POP_STAR_SLUGS)
	},
	{
		slug: 'rappers-genre-disruptors',
		label: 'Rappers & Genre Disruptors',
		description:
			'Artists whose public persona is inseparable from force, edge, provocation, reinvention, and the need to dominate a lane.',
		matches: (person) => personInSlugSet(person, MUSIC_RAP_GENRE_SLUGS)
	},
	{
		slug: 'alternative-art-pop-voices',
		label: 'Alternative & Art-Pop Voices',
		description:
			'Performers who turn alienation, experimentation, aesthetics, or outsider identity into the center of the project.',
		matches: (person) => personInSlugSet(person, MUSIC_ALTERNATIVE_SLUGS)
	},
	{
		slug: 'singer-songwriters-roots',
		label: 'Singer-Songwriters & Roots Performers',
		description:
			'Writers and emotionally direct performers where the draw is voice, confession, craft, and a stronger sense of personal songwriting.',
		matches: (person) => personInSlugSet(person, MUSIC_SINGER_SONGWRITER_SLUGS)
	},
	{
		slug: 'crossovers-multi-hyphenates',
		label: 'Crossovers & Multi-Hyphenates',
		description:
			'People whose music career overlaps heavily with acting, creator culture, celebrity branding, or another public lane.',
		matches: (person) =>
			personInSlugSet(person, MUSIC_CROSSOVER_SLUGS) ||
			person.types.includes('creator') ||
			person.types.includes('celebrity') ||
			person.types.includes('lifestyleInfluencer')
	}
];

const POLITICS_HEADS_OF_STATE_SLUGS = createNormalizedSlugSet([
	'Abraham-Lincoln',
	'Donald-Trump',
	'George-H-W-Bush',
	'Joe-Biden',
	'Joseph-Stalin',
	'Julius-Caesar',
	'Justin-Trudeau',
	'Napoleon-Bonaparte',
	'Ronald-Reagan',
	'Vladimir-Putin',
	'Winston-Churchill',
	'Xi-Jinping'
]);

const POLITICS_ACTIVIST_SLUGS = createNormalizedSlugSet([
	'Greta-Thunberg',
	'Lupita-Nyongo',
	'Malcolm-X',
	'Martin-Luther-King-Jr'
]);

const POLITICS_ROYALTY_SLUGS = createNormalizedSlugSet([
	'Meghan-Markle',
	'Prince-Harry',
	'Princess-Diana'
]);

const POLITICS_PUBLIC_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	{
		slug: 'heads-of-state-power-holders',
		label: 'Heads of State & Power Holders',
		description:
			'Presidents, prime ministers, rulers, and regime-level leaders whose personality shapes institutions, war, loyalty, and large-scale power.',
		matches: (person) => personInSlugSet(person, POLITICS_HEADS_OF_STATE_SLUGS)
	},
	{
		slug: 'activists-movement-leaders',
		label: 'Activists & Movement Leaders',
		description:
			'People defined less by office and more by moral urgency, persuasion, sacrifice, movement energy, or symbolic resistance.',
		matches: (person) =>
			person.types.includes('activist') || personInSlugSet(person, POLITICS_ACTIVIST_SLUGS)
	},
	{
		slug: 'royalty-symbolic-public-duty',
		label: 'Royals & Symbolic Public Duty',
		description:
			'Figures whose public life revolves around symbolic service, inherited expectations, diplomacy, image, and the burden of representing something larger than themselves.',
		matches: (person) => personInSlugSet(person, POLITICS_ROYALTY_SLUGS)
	},
	{
		slug: 'campaign-politicians-public-persuaders',
		label: 'Campaign Politicians & Public Persuaders',
		description:
			'Elected officials, rising party figures, and influence-heavy public actors navigating coalitions, messaging, ambition, and permanent visibility.',
		matches: (person) => person.types.includes('politician')
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
	{
		slug: 'big-tech-founders-ceos',
		label: 'Big Tech Founders & CEOs',
		description:
			'Company-defining builders managing scale, products, public scrutiny, and the pressure of running systems that affect millions.',
		matches: (person) => personInSlugSet(person, TECH_BIG_TECH_SLUGS)
	},
	{
		slug: 'investors-strategists-power-brokers',
		label: 'Investors, Strategists & Power Brokers',
		description:
			'People whose edge comes from narrative control, contrarian bets, leverage, and seeing second-order effects before everyone else does.',
		matches: (person) => personInSlugSet(person, TECH_INVESTOR_SLUGS)
	},
	{
		slug: 'frontier-builders-ai-defense',
		label: 'Frontier Builders: AI & Defense',
		description:
			'Builders working in the highest-stakes corners of technology where existential ambition, security, and world-modeling all get amplified.',
		matches: (person) => personInSlugSet(person, TECH_FRONTIER_SLUGS)
	},
	{
		slug: 'operators-business-builders',
		label: 'Operators & Business Builders',
		description:
			'Entrepreneurial personalities focused on execution, sales, operating systems, and turning a personal philosophy into a business engine.',
		matches: (person) =>
			personInSlugSet(person, TECH_OPERATOR_SLUGS) ||
			person.types.includes('entrepreneur') ||
			person.types.includes('business')
	},
	{
		slug: 'tech-media-interpreters',
		label: 'Tech Media & Interpreter Types',
		description:
			'Media figures and public intellectuals who translate tech power for an audience instead of only building behind the scenes.',
		matches: (person) => personInSlugSet(person, TECH_INTERPRETER_SLUGS)
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
		matches: (person) => personInSlugSet(person, COMEDY_STANDUP_SLUGS)
	},
	{
		slug: 'sketch-tv-character-comics',
		label: 'Sketch, TV & Character Comics',
		description:
			'Performers whose comedy depends on ensemble instincts, recurring personas, writing rooms, or long-form character work.',
		matches: (person) => personInSlugSet(person, COMEDY_SKETCH_SLUGS)
	},
	{
		slug: 'satire-hosts-political-comedy',
		label: 'Satire Hosts & Political Comedy',
		description:
			'Comedians who merge humor with commentary, making cultural interpretation part of the act.',
		matches: (person) => personInSlugSet(person, COMEDY_SATIRE_SLUGS)
	},
	{
		slug: 'internet-podcast-comics',
		label: 'Internet & Podcast Comics',
		description:
			'Comedians whose appeal grows through clips, audience intimacy, personality-first content, and internet-native momentum.',
		matches: (person) => personInSlugSet(person, COMEDY_INTERNET_SLUGS)
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
	{
		slug: 'novelists-world-builders',
		label: 'Novelists & World-Builders',
		description:
			'Writers whose inner structure shows up through narrative architecture, myth-making, and the desire to build complete worlds.',
		matches: (person) => personInSlugSet(person, AUTHOR_NOVELIST_SLUGS)
	},
	{
		slug: 'strategy-psychology-writers',
		label: 'Strategy & Psychology Writers',
		description:
			'Authors and essayists whose work is built around frameworks, motives, social dynamics, and explanatory power.',
		matches: (person) =>
			personInSlugSet(person, AUTHOR_STRATEGY_SLUGS) ||
			person.types.includes('psychology') ||
			person.types.includes('essay')
	},
	{
		slug: 'business-media-interpreters',
		label: 'Business & Media Interpreters',
		description:
			'Writers and commentators translating power, markets, media, and elite behavior into digestible narratives for an audience.',
		matches: (person) => personInSlugSet(person, AUTHOR_INTERPRETER_SLUGS)
	}
];

function buildCategoryGroups(
	people: PersonalityCategoryPerson[],
	definitions: PersonalityCategoryGroupDefinition[],
	fallback: Pick<PersonalityCategoryGroup, 'slug' | 'label' | 'description'>
): PersonalityCategoryGroup[] {
	const grouped = new Map<string, PersonalityCategoryPerson[]>();
	const unassigned: PersonalityCategoryPerson[] = [];

	for (const definition of definitions) {
		grouped.set(definition.slug, []);
	}

	for (const person of people) {
		const definition = definitions.find((candidate) => candidate.matches(person));

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
			people: sortPeopleForCategory(grouped.get(definition.slug) ?? [])
		}))
		.filter((group) => group.people.length > 0);

	if (unassigned.length > 0) {
		results.push({
			...fallback,
			people: sortPeopleForCategory(unassigned)
		});
	}

	return results;
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
	'tech-business': {
		definitions: TECH_BUSINESS_GROUP_DEFINITIONS,
		fallback: {
			slug: 'other-tech-business-figures',
			label: 'Other Tech & Business Figures',
			description:
				'Profiles that clearly belong in this category, but do not yet fit one of the tighter founder, investor, or operator lanes.'
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
	people: PersonalityCategoryPerson[]
): PersonalityCategoryGroup[] {
	const config = CATEGORY_GROUP_CONFIGS[categorySlug];
	return buildCategoryGroups(people, config.definitions, config.fallback);
}
