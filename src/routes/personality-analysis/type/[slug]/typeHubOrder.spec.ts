// src/routes/personality-analysis/type/[slug]/typeHubOrder.spec.ts
import { describe, expect, it } from 'vitest';
import { sortPeopleByFame } from './typeHubOrder';

const people = [
	{ slug: 'new-streamer', date: '2026-09-30' },
	{ slug: 'taylor-swift', date: '2024-01-15' },
	{ slug: 'no-article', date: '2026-10-01' },
	{ slug: 'tom-cruise', date: '2025-05-01' },
	{ slug: 'older-no-data', date: '2023-02-01' },
	{ slug: 'lastmod-only', date: null, lastmod: '2026-09-15' }
];

const views = {
	'taylor-swift': 1_489_652,
	'tom-cruise': 1_698_765,
	'new-streamer': 12_000,
	'no-article': 0
};

describe('sortPeopleByFame', () => {
	it('puts the best-known people first, then falls back to newest first', () => {
		expect(sortPeopleByFame(people, views).map((p) => p.slug)).toEqual([
			'tom-cruise',
			'taylor-swift',
			'new-streamer',
			'no-article',
			'lastmod-only',
			'older-no-data'
		]);
	});

	it('treats 0 views and missing slugs the same (no fame data)', () => {
		const sorted = sortPeopleByFame(people, {}).map((p) => p.slug);
		expect(sorted).toEqual([
			'no-article',
			'new-streamer',
			'lastmod-only',
			'tom-cruise',
			'taylor-swift',
			'older-no-data'
		]);
	});

	it('breaks fame ties by date, then slug, and does not mutate the input', () => {
		const input = [
			{ slug: 'b', date: '2025-01-01' },
			{ slug: 'a', date: '2025-01-01' },
			{ slug: 'c', date: '2026-01-01' }
		];
		const sorted = sortPeopleByFame(input, { a: 5, b: 5, c: 5 });
		expect(sorted.map((p) => p.slug)).toEqual(['c', 'a', 'b']);
		expect(input.map((p) => p.slug)).toEqual(['b', 'a', 'c']);
	});
});
