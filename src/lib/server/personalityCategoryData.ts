// src/lib/server/personalityCategoryData.ts
// Category pages are one v3 taxonomy field each (see personalityCategories.ts). Groups on a
// page are the field's niches, computed from the people labels; nothing is hand-listed here.
import type { Database, Json } from '../../../database.types';
import {
	categorySlugForField,
	formatPersonName,
	getPersonalityCategoryBySlug,
	type PersonalityCategorySlug
} from '$lib/personalityCategories';
import { FIELD_BY_KEY, getPersonClassification, nicheOf, subOf } from '$lib/peopleTaxonomy';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { getReviewedPersonTypes } from '$lib/reviewedPersonTypes';
import { bucketByGeneration, generationLabel } from '$lib/peopleTimeline';

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
	/** v3 home path: [field, niche, sub?]. */
	home: string[] | null;
	/** Birth year, for the timeline. */
	born: number | null;
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

/** Every category page a person appears on: home field first, then second careers. */
export function getPersonalityCategorySlugs(personSlug: string): PersonalityCategorySlug[] {
	const classification = getPersonClassification(personSlug);
	if (!classification) return [];
	const fields = [
		classification.home?.[0],
		...classification.also.map(({ path }) => path[0])
	].filter((field): field is string => Boolean(field));
	return [...new Set(fields.map(categorySlugForField))].filter(
		(slug): slug is PersonalityCategorySlug => slug !== null
	);
}

/** The page for a person's home field (where their profile links back to). */
export function getPrimaryPersonalityCategorySlug(
	personSlug: string
): PersonalityCategorySlug | null {
	const home = getPersonClassification(personSlug)?.home?.[0];
	return home ? categorySlugForField(home) : null;
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
	const classification = getPersonClassification(normalizedSlug);

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
		categorySlugs: getPersonalityCategorySlugs(normalizedSlug),
		primaryCategorySlug: getPrimaryPersonalityCategorySlug(normalizedSlug),
		contentQualityScore: extractContentQualityScore(row.content_quality),
		home: classification?.home ?? null,
		born: classification?.born ?? null
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

/** A niche (or sub-niche) becomes its own group only with this many people. */
export const MIN_GROUP_SIZE = 3;
/** Groups bigger than this split by generation ("Actors · Gen X"), each part 3+. */
export const BIG_GROUP_SIZE = 24;

type Lane = { slug: string; label: string; people: PersonalityCategoryPerson[] };

/** Splits an oversized lane by generation, oldest first; unknown birth years join the
 * biggest part. Lanes that can't split (one generation) come back whole. */
function splitBigLane(lane: Lane): Lane[] {
	if (lane.people.length <= BIG_GROUP_SIZE) return [lane];
	const { buckets, unknown } = bucketByGeneration(
		lane.people,
		(person) => person.born,
		MIN_GROUP_SIZE
	);
	if (buckets.length < 2) return [lane];
	const biggest = buckets.reduce((a, b) => (b.people.length > a.people.length ? b : a));
	biggest.people.push(...unknown);
	return buckets.map(({ keys, people }) => ({
		slug: `${lane.slug}-${keys.join('-')}`,
		label: `${lane.label} · ${generationLabel(keys)}`,
		people
	}));
}

/** Lanes for people whose home is one field: niches in taxonomy order, a sub-niche splits
 * out of its niche when it has 3+ people, and niches under 3 pool into "More <field>". */
function fieldLanes(field: string, people: PersonalityCategoryPerson[]): Lane[] {
	const definition = FIELD_BY_KEY.get(field);
	if (!definition || !people.length) return [];
	const subCounts = new Map<string, number>();
	for (const person of people) {
		const path = person.home ?? [];
		if (path[2]) subCounts.set(path.join('/'), (subCounts.get(path.join('/')) ?? 0) + 1);
	}
	const laneKey = (person: PersonalityCategoryPerson) => {
		const path = person.home ?? [];
		const sub = path.slice(0, 3).join('/');
		return path[2] && (subCounts.get(sub) ?? 0) >= MIN_GROUP_SIZE
			? sub
			: path.slice(0, 2).join('/');
	};
	const byLane = Map.groupBy(people, laneKey);
	const order = definition.niches.flatMap((niche) => [
		`${field}/${niche.key}`,
		...(niche.subs ?? []).map((sub) => `${field}/${niche.key}/${sub.key}`)
	]);
	const lanes: Lane[] = [];
	const leftovers: PersonalityCategoryPerson[] = [];
	for (const key of order) {
		const members = byLane.get(key) ?? [];
		if (members.length >= MIN_GROUP_SIZE) {
			const path = key.split('/');
			lanes.push(
				...splitBigLane({
					slug: path.join('-'),
					label: (subOf(path) ?? nicheOf(path))?.label ?? key,
					people: members
				})
			);
		} else leftovers.push(...members);
	}
	if (leftovers.length) {
		lanes.push({
			slug: `${field}-more`,
			label: lanes.length ? `More ${definition.shortLabel}` : definition.label,
			people: leftovers
		});
	}
	return lanes;
}

export function getPersonalityCategoryGroups(
	categorySlug: PersonalityCategorySlug,
	people: PersonalityCategoryPerson[],
	{ includeSecondary = false } = {}
): PersonalityCategoryGroup[] {
	const category = getPersonalityCategoryBySlug(categorySlug);
	if (!category) return [];
	const fields = new Set(category.fields);
	const lanes = category.fields.flatMap((field) =>
		fieldLanes(
			field,
			people.filter((person) => person.home?.[0] === field)
		)
	);
	const groups: PersonalityCategoryGroup[] = lanes.map((lane) => ({
		...lane,
		description: '',
		people: sortPeopleForCategory(lane.people),
		alsoInLane: []
	}));
	const crossovers = people.filter((person) => !fields.has(person.home?.[0] ?? ''));
	if (includeSecondary && crossovers.length) {
		groups.push({
			slug: 'second-careers',
			label: `Also in ${category.shortLabel}`,
			description: `Filed under another field, with a real second career in ${category.shortLabel.toLowerCase()}.`,
			people: sortPeopleForCategory(crossovers),
			alsoInLane: []
		});
	}
	return groups;
}
