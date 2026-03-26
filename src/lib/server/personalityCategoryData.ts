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

const CREATOR_MEDIA_PODCASTER_SLUGS = createNormalizedSlugSet([
	'Alex-Cooper',
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
	'Saagar-Enjeti',
	'Taylor-Lorenz'
]);

const CREATOR_MEDIA_BUSINESS_SLUGS = createNormalizedSlugSet([
	'Ali-Abdaal',
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
	'Druski',
	'Logan-Paul',
	'Mr-Beast'
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
	'Madison-Beer'
]);

const CREATOR_MEDIA_GROUP_DEFINITIONS: PersonalityCategoryGroupDefinition[] = [
	{
		slug: 'podcasters-interviewers',
		label: 'Podcasters & Interviewers',
		description:
			'Long-form hosts built around conversation, chemistry, and the ability to keep attention for an hour instead of a clip.',
		matches: (person) => CREATOR_MEDIA_PODCASTER_SLUGS.has(person.slug)
	},
	{
		slug: 'news-commentary',
		label: 'News & Commentary',
		description:
			'Personalities whose output revolves around politics, media narratives, reporting, or real-time cultural interpretation.',
		matches: (person) =>
			CREATOR_MEDIA_COMMENTARY_SLUGS.has(person.slug) || person.types.includes('journalist')
	},
	{
		slug: 'business-self-improvement',
		label: 'Business & Self-Improvement',
		description:
			'Creators selling frameworks, advice, and aspirational operating systems rather than pure entertainment.',
		matches: (person) =>
			CREATOR_MEDIA_BUSINESS_SLUGS.has(person.slug) || person.types.includes('entrepreneur')
	},
	{
		slug: 'streamers-live',
		label: 'Streamers & Live Personalities',
		description:
			'Internet figures whose appeal depends on spontaneity, volume, parasocial energy, and what happens when the camera never really turns off.',
		matches: (person) => CREATOR_MEDIA_STREAMER_SLUGS.has(person.slug)
	},
	{
		slug: 'viral-entertainers',
		label: 'Viral Entertainers & Platform Giants',
		description:
			'Big-internet personalities who win through scale, spectacle, bits, and repeatable attention mechanics.',
		matches: (person) => CREATOR_MEDIA_ENTERTAINER_SLUGS.has(person.slug)
	},
	{
		slug: 'lifestyle-brand-builders',
		label: 'Lifestyle & Celebrity Brand Builders',
		description:
			'Image-first creators whose leverage comes from taste, status, beauty, aspiration, and turning personal identity into a product line.',
		matches: (person) =>
			CREATOR_MEDIA_LIFESTYLE_SLUGS.has(person.slug) ||
			person.types.includes('lifestyleInfluencer') ||
			person.types.includes('influencer') ||
			person.types.includes('tiktoker')
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

export function getPersonalityCategoryGroups(
	categorySlug: PersonalityCategorySlug,
	people: PersonalityCategoryPerson[]
): PersonalityCategoryGroup[] {
	if (categorySlug === 'creator-media') {
		return buildCategoryGroups(people, CREATOR_MEDIA_GROUP_DEFINITIONS, {
			slug: 'other-internet-personalities',
			label: 'Other Internet Personalities',
			description:
				'Useful profiles that still belong in this category, but do not yet fit one of the tighter creator clusters.'
		});
	}

	return [];
}
