// src/routes/personality-analysis/celebrityHub.spec.ts
import { describe, expect, it } from 'vitest';
import { buildCelebrityHub, CELEBRITY_HUB_NAMES_PER_TYPE } from './celebrityHub';

const posts = [
	{ slug: 'taylor-swift', enneagram: '3', date: '2024-01-15' },
	{ slug: 'tom-cruise', enneagram: '3', date: '2025-05-01' },
	{ slug: 'new-streamer', enneagram: '3', date: '2026-09-30' },
	{ slug: 'elon-musk', enneagram: '5', date: '2024-03-01' },
	{ slug: 'conan-obrien', enneagram: '9', date: '2025-02-01' },
	{ slug: 'no-type', enneagram: null, date: '2025-02-01' },
	{ slug: 'bad-type', enneagram: '10', date: '2025-02-01' }
];

const views = {
	'taylor-swift': 1_489_652,
	'tom-cruise': 1_698_765,
	'elon-musk': 8_000_000
};

describe('buildCelebrityHub', () => {
	it('returns all nine types in order, even when a type has no one yet', () => {
		const hub = buildCelebrityHub(posts, views);
		expect(hub.map((group) => group.type)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
		expect(hub[0]).toEqual({ type: '1', count: 0, sharePct: '0.0%', people: [] });
	});

	it('orders names like the type hubs: best-known first, then newest', () => {
		const type3 = buildCelebrityHub(posts, views).find((group) => group.type === '3')!;
		expect(type3.people.map((person) => person.slug)).toEqual([
			'tom-cruise',
			'taylor-swift',
			'new-streamer'
		]);
		expect(type3.people[0].name).toBe('Tom Cruise');
	});

	it('uses display-name overrides for names the slug cannot spell', () => {
		const type9 = buildCelebrityHub(posts, views).find((group) => group.type === '9')!;
		expect(type9.people).toEqual([{ slug: 'conan-obrien', name: "Conan O'Brien" }]);
	});

	it('counts live posts per type and shares them over the typed total', () => {
		const hub = buildCelebrityHub(posts, views);
		// 5 typed posts; the untyped and out-of-range rows are ignored.
		expect(hub.find((group) => group.type === '3')).toMatchObject({ count: 3, sharePct: '60.0%' });
		expect(hub.find((group) => group.type === '5')).toMatchObject({ count: 1, sharePct: '20.0%' });
	});

	it('reports override counts (the corpus snapshot) when given them', () => {
		const counts = {
			'1': 29,
			'2': 29,
			'3': 81,
			'4': 65,
			'5': 38,
			'6': 54,
			'7': 62,
			'8': 48,
			'9': 45
		};
		const hub = buildCelebrityHub(posts, views, { counts });
		expect(hub.find((group) => group.type === '3')).toMatchObject({
			count: 81,
			sharePct: '18.0%'
		});
		// Names still come from the posts that were passed in.
		expect(hub.find((group) => group.type === '3')!.people).toHaveLength(3);
	});

	it(`caps each type at ${CELEBRITY_HUB_NAMES_PER_TYPE} names`, () => {
		const many = Array.from({ length: 25 }, (_, i) => ({
			slug: `person-${i}`,
			enneagram: '7',
			date: `2025-01-${String((i % 28) + 1).padStart(2, '0')}`
		}));
		const type7 = buildCelebrityHub(many, {}).find((group) => group.type === '7')!;
		expect(type7.count).toBe(25);
		expect(type7.people).toHaveLength(CELEBRITY_HUB_NAMES_PER_TYPE);
	});
});
