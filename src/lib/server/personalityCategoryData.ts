// src/lib/server/personalityCategoryData.ts
import type { Database, Json } from '../../../database.types';
import {
	formatPersonName,
	getPersonalityCategorySlugs,
	getPrimaryPersonalityCategorySlug,
	normalizePeopleTypes,
	type PersonalityCategorySlug
} from '$lib/personalityCategories';

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

	const types = normalizePeopleTypes(row.type);
	const categorySlugs = getPersonalityCategorySlugs(types);

	return {
		slug: row.person,
		name: formatPersonName(row.person),
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
