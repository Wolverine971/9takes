// src/lib/peopleTaxonomy.ts
// People taxonomy v3: Field → Niche → optional Sub. Jev (or DJ) labels facts per person in
// data/personClassifications.json; pages compute every grouping from those facts.
// The vocabulary lives in data/peopleTaxonomy.json so scripts can read it too.
import taxonomy from './data/peopleTaxonomy.json';
import classifications from './data/personClassifications.json';
import { getTypeHubGroupSlug, type GroupablePerson } from './personNiches';
import { normalizePersonalitySlug } from './utils/personalityAnalysis';

export type TaxonomySub = { key: string; label: string };
export type TaxonomyNiche = { key: string; label: string; subs?: TaxonomySub[] };
export type TaxonomyField = {
	key: string;
	label: string;
	shortLabel: string;
	accent: string;
	description: string;
	niches: TaxonomyNiche[];
};

/** [field, niche] or [field, niche, sub]. */
export type TaxonomyPath = [string, string] | [string, string, string];

export type PersonClassification = {
	/** Null when no slot is honest yet; the person folds into "More". */
	home: TaxonomyPath | null;
	also: Array<{ path: TaxonomyPath; evidence: string }>;
	platforms: string[];
	roles: string[];
	/** [year, the work that first made them widely known]. */
	breakout: [number, string] | null;
	born: number | null;
	era: { period: string; place: string } | null;
	confidence: 'high' | 'medium' | 'low';
	why: string;
};

export const PEOPLE_TAXONOMY = taxonomy as {
	version: number;
	fields: TaxonomyField[];
	platforms: string[];
	roles: string[];
};
export const TAXONOMY_FIELDS: TaxonomyField[] = PEOPLE_TAXONOMY.fields;
export const FIELD_BY_KEY = new Map(TAXONOMY_FIELDS.map((field) => [field.key, field]));
export const FIELD_ORDER = new Map(TAXONOMY_FIELDS.map((field, index) => [field.key, index]));

const CLASSIFICATIONS = classifications as unknown as Record<string, PersonClassification>;

/** Old type-hub groups, used only for people Jev hasn't labeled yet. */
const LEGACY_FIELD: Record<string, string> = {
	'film-tv': 'screen',
	'creator-media': 'creators',
	music: 'music',
	'politics-public': 'politics',
	technology: 'tech',
	'tech-business': 'tech',
	business: 'business',
	fashion: 'style',
	comedy: 'comedy',
	'authors-thinkers': 'ideas',
	athletes: 'sports',
	history: 'politics'
};

export function getPersonClassification(slug: string): PersonClassification | null {
	const key = normalizePersonalitySlug(slug);
	return Object.hasOwn(CLASSIFICATIONS, key) ? CLASSIFICATIONS[key] : null;
}

export function isClassified(slug: string): boolean {
	return getPersonClassification(slug) !== null;
}

/** Home path for grouping: Jev's label, else a field-only guess from legacy tags. */
export function homePathFor(person: GroupablePerson): string[] | null {
	const classification = getPersonClassification(person.slug);
	if (classification) return classification.home;
	const legacy = LEGACY_FIELD[getTypeHubGroupSlug(person)];
	return legacy ? [legacy] : null;
}

/** Fields of each sustained second career, excluding the home field. */
export function alsoFieldsFor(slug: string): string[] {
	const classification = getPersonClassification(slug);
	if (!classification) return [];
	const home = classification.home?.[0];
	return [
		...new Set(classification.also.map(({ path }) => path[0]).filter((field) => field !== home))
	];
}

export function nicheOf(path: readonly string[]): TaxonomyNiche | null {
	return FIELD_BY_KEY.get(path[0])?.niches.find((niche) => niche.key === path[1]) ?? null;
}

export function subOf(path: readonly string[]): TaxonomySub | null {
	if (path.length < 3) return null;
	return nicheOf(path)?.subs?.find((sub) => sub.key === path[2]) ?? null;
}

/** The most specific label on a path ("Pro wrestling", else "Combat sports", else "Sports"). */
export function pathLabel(path: readonly string[]): string {
	return subOf(path)?.label ?? nicheOf(path)?.label ?? FIELD_BY_KEY.get(path[0])?.label ?? '';
}

export type Generation = { key: string; label: string; from: number; to: number };

/** Pew-style cohorts. Anyone born before 1901 counts as "History". */
export const GENERATIONS: Generation[] = [
	{ key: 'history', label: 'Before 1901', from: -10000, to: 1900 },
	{ key: 'greatest', label: 'Greatest Generation', from: 1901, to: 1927 },
	{ key: 'silent', label: 'Silent Generation', from: 1928, to: 1945 },
	{ key: 'boomers', label: 'Boomers', from: 1946, to: 1964 },
	{ key: 'gen-x', label: 'Gen X', from: 1965, to: 1980 },
	{ key: 'millennials', label: 'Millennials', from: 1981, to: 1996 },
	{ key: 'gen-z', label: 'Gen Z', from: 1997, to: 2012 },
	{ key: 'gen-alpha', label: 'Gen Alpha', from: 2013, to: 9999 }
];

export function generationOf(year: number | null | undefined): Generation | null {
	if (year == null) return null;
	return GENERATIONS.find((generation) => year >= generation.from && year <= generation.to) ?? null;
}

export function bornYearFor(slug: string): number | null {
	return getPersonClassification(slug)?.born ?? null;
}
