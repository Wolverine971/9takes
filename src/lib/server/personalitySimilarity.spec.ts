// src/lib/server/personalitySimilarity.spec.ts
import { describe, expect, it } from 'vitest';

import {
	rankSimilarPeople,
	scorePersonalitySimilarity,
	type PersonalitySimilarityRow
} from './personalitySimilarity';

function makeRow(overrides: Partial<PersonalitySimilarityRow>): PersonalitySimilarityRow {
	return {
		person: 'sample-person',
		enneagram: '3',
		title: 'Sample',
		description: null,
		persona_title: null,
		lastmod: '2026-03-01',
		date: '2026-02-01',
		type: ['creator'],
		published: true,
		content_quality: { overall: 8.5 },
		...overrides
	};
}

describe('personalitySimilarity', () => {
	it('scores shared raw types above category-only matches', () => {
		const rawMatch = scorePersonalitySimilarity(['creator', 'entrepreneur'], ['creator']);
		const categoryMatch = scorePersonalitySimilarity(['creator', 'entrepreneur'], ['business']);

		expect(rawMatch.sharedTypes).toEqual(['creator']);
		expect(rawMatch.score).toBeGreaterThan(categoryMatch.score);
		expect(categoryMatch.sharedCategories).toEqual(['tech-business']);
	});

	it('ranks same-category founders ahead of unrelated creators', () => {
		const ranked = rankSimilarPeople({
			currentSlug: 'Tony-Robbins',
			currentTypes: ['creator', 'entrepreneur'],
			currentEnneagram: 3,
			rows: [
				makeRow({ person: 'Alex-Hormozi', type: ['entrepreneur'], enneagram: '3' }),
				makeRow({ person: 'Gary-Vee', type: ['business'], enneagram: '3' }),
				makeRow({ person: 'Joe-Rogan', type: ['creator'], enneagram: '8' }),
				makeRow({ person: 'Billie-Eilish', type: ['musician'], enneagram: '4' })
			],
			limit: 3
		});

		expect(ranked.map((entry) => entry.row.person)).toEqual([
			'Alex-Hormozi',
			'Joe-Rogan',
			'Gary-Vee'
		]);
	});

	it('boosts same-enneagram matches when requested', () => {
		const ranked = rankSimilarPeople({
			currentSlug: 'Tony-Robbins',
			currentTypes: ['creator', 'entrepreneur'],
			currentEnneagram: 3,
			requireSameEnneagram: true,
			rows: [
				makeRow({ person: 'Alex-Hormozi', type: ['entrepreneur'], enneagram: '3' }),
				makeRow({ person: 'Bill-Gates', type: ['techie'], enneagram: '5' }),
				makeRow({
					person: 'Taylor-Swift',
					type: ['musician', 'entrepreneur'],
					enneagram: '3'
				})
			]
		});

		expect(ranked.map((entry) => entry.row.person)).toEqual(['Alex-Hormozi', 'Taylor-Swift']);
	});
});
