// src/lib/server/provenChorusQuestions.spec.ts
import { describe, expect, it } from 'vitest';
import {
	PROVEN_CHORUS_QUESTION_URLS,
	orderProvenChorusCandidates,
	stableSlugHash
} from './provenChorusQuestions';

describe('PROVEN_CHORUS_QUESTION_URLS', () => {
	it('holds a short list of distinct question slugs', () => {
		expect(PROVEN_CHORUS_QUESTION_URLS.length).toBeGreaterThanOrEqual(2);
		expect(PROVEN_CHORUS_QUESTION_URLS.length).toBeLessThanOrEqual(4);
		expect(new Set(PROVEN_CHORUS_QUESTION_URLS).size).toBe(PROVEN_CHORUS_QUESTION_URLS.length);
		for (const url of PROVEN_CHORUS_QUESTION_URLS) expect(url).toMatch(/^[a-z0-9-]+$/);
	});
});

describe('stableSlugHash', () => {
	it('is a stable unsigned 32-bit hash', () => {
		expect(stableSlugHash('zendaya')).toBe(stableSlugHash('zendaya'));
		expect(stableSlugHash('')).toBe(0x811c9dc5);
		for (const slug of ['zendaya', 'robert-pattinson', 'jordi-hays']) {
			const hash = stableSlugHash(slug);
			expect(Number.isInteger(hash)).toBe(true);
			expect(hash).toBeGreaterThanOrEqual(0);
			expect(hash).toBeLessThan(2 ** 32);
		}
	});
});

describe('orderProvenChorusCandidates', () => {
	const pool = ['a', 'b', 'c'];

	it('returns the whole pool, rotated to a per-person start', () => {
		for (const slug of ['zendaya', 'robert-pattinson', 'jordi-hays', 'taylor-swift']) {
			const order = orderProvenChorusCandidates(slug, pool);
			expect([...order].sort()).toEqual(pool);
			const start = pool.indexOf(order[0]);
			expect(order).toEqual([...pool.slice(start), ...pool.slice(0, start)]);
			expect(order[0]).toBe(pool[stableSlugHash(slug) % pool.length]);
		}
	});

	it('is stable for a slug and varies across slugs', () => {
		expect(orderProvenChorusCandidates('zendaya', pool)).toEqual(
			orderProvenChorusCandidates('zendaya', pool)
		);

		const starts = new Set(
			Array.from({ length: 60 }, (_, i) => orderProvenChorusCandidates(`person-${i}`, pool)[0])
		);
		expect(starts).toEqual(new Set(pool));
	});

	it('handles an empty pool', () => {
		expect(orderProvenChorusCandidates('zendaya', [])).toEqual([]);
	});
});
