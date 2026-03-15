// src/lib/server/personalitySimilarity.ts
import type { Database } from '../../../database.types';
import {
	getPersonalityCategorySlugs,
	normalizePeopleTypes,
	type PersonalityCategorySlug
} from '$lib/personalityCategories';
import { extractContentQualityScore } from '$lib/server/personalityCategoryData';

export type PersonalitySimilarityRow = Pick<
	Database['public']['Tables']['blogs_famous_people']['Row'],
	| 'person'
	| 'enneagram'
	| 'title'
	| 'description'
	| 'persona_title'
	| 'lastmod'
	| 'date'
	| 'type'
	| 'published'
	| 'content_quality'
>;

export interface PersonalitySimilarityResult {
	row: PersonalitySimilarityRow;
	score: number;
	sharedTypes: string[];
	sharedCategories: PersonalityCategorySlug[];
}

const RAW_TYPE_WEIGHT = 12;
const CATEGORY_WEIGHT = 8;
const BASE_ENNEAGRAM_MATCH_SCORE = 10;

function normalizeTypeKey(value: string): string {
	return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function getSortTimestamp(person: Pick<PersonalitySimilarityRow, 'lastmod' | 'date'>): number {
	const dateValue = person.lastmod ?? person.date;
	const timestamp = dateValue ? new Date(dateValue).getTime() : 0;
	return Number.isFinite(timestamp) ? timestamp : 0;
}

export function scorePersonalitySimilarity(
	currentTypesInput: unknown,
	candidateTypesInput: unknown
): Omit<PersonalitySimilarityResult, 'row'> {
	const currentTypes = normalizePeopleTypes(currentTypesInput);
	const candidateTypes = normalizePeopleTypes(candidateTypesInput);

	const currentTypeLookup = new Map(currentTypes.map((type) => [normalizeTypeKey(type), type]));
	const candidateTypeKeys = new Set(candidateTypes.map((type) => normalizeTypeKey(type)));

	const sharedTypes = [...currentTypeLookup.entries()]
		.filter(([normalized]) => candidateTypeKeys.has(normalized))
		.map(([, original]) => original);

	const currentCategories = getPersonalityCategorySlugs(currentTypes);
	const candidateCategoryKeys = new Set(getPersonalityCategorySlugs(candidateTypes));
	const sharedCategories = currentCategories.filter((category) =>
		candidateCategoryKeys.has(category)
	);

	return {
		score: sharedTypes.length * RAW_TYPE_WEIGHT + sharedCategories.length * CATEGORY_WEIGHT,
		sharedTypes,
		sharedCategories
	};
}

interface RankSimilarPeopleOptions {
	currentSlug: string;
	currentTypes: unknown;
	currentEnneagram?: number | string | null;
	rows: PersonalitySimilarityRow[];
	limit?: number;
	requireSameEnneagram?: boolean;
}

export function rankSimilarPeople({
	currentSlug,
	currentTypes,
	currentEnneagram = null,
	rows,
	limit = 4,
	requireSameEnneagram = false
}: RankSimilarPeopleOptions): PersonalitySimilarityResult[] {
	const currentEnneagramValue =
		currentEnneagram === null || currentEnneagram === undefined ? null : String(currentEnneagram);

	return rows
		.filter((row) => {
			if (!row.person || row.person === currentSlug || row.published !== true) return false;
			if (!requireSameEnneagram) return true;
			if (!currentEnneagramValue) return false;
			return row.enneagram !== null && String(row.enneagram) === currentEnneagramValue;
		})
		.map((row) => {
			const similarity = scorePersonalitySimilarity(currentTypes, row.type);
			const sameEnneagram =
				currentEnneagramValue !== null &&
				row.enneagram !== null &&
				String(row.enneagram) === currentEnneagramValue;
			const enneagramScore = requireSameEnneagram && sameEnneagram ? BASE_ENNEAGRAM_MATCH_SCORE : 0;

			return {
				row,
				score: similarity.score + enneagramScore,
				sharedTypes: similarity.sharedTypes,
				sharedCategories: similarity.sharedCategories
			};
		})
		.filter((entry) => entry.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			if (b.sharedTypes.length !== a.sharedTypes.length) {
				return b.sharedTypes.length - a.sharedTypes.length;
			}
			if (b.sharedCategories.length !== a.sharedCategories.length) {
				return b.sharedCategories.length - a.sharedCategories.length;
			}

			const qualityDiff =
				(extractContentQualityScore(b.row.content_quality) ?? -1) -
				(extractContentQualityScore(a.row.content_quality) ?? -1);
			if (qualityDiff !== 0) return qualityDiff;

			const freshnessDiff = getSortTimestamp(b.row) - getSortTimestamp(a.row);
			if (freshnessDiff !== 0) return freshnessDiff;

			return (a.row.person ?? '').localeCompare(b.row.person ?? '');
		})
		.slice(0, limit);
}
