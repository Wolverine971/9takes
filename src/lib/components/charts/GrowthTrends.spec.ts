// src/lib/components/charts/GrowthTrends.spec.ts
import { describe, expect, it } from 'vitest';
import { trendVerdict } from './GrowthTrends.svelte';

const weeks = (count: number, value: number) => Array.from({ length: count }, () => value);

describe('trendVerdict', () => {
	it('calls an all-zero series "never moved", not a drop', () => {
		expect(trendVerdict(weeks(26, 0)).tone).toBe('flat');
	});

	it('calls a sub-one-per-week series rare (real signups: 8 in 26 weeks)', () => {
		const realSignups = [...weeks(12, 0), 2, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1];
		const verdict = trendVerdict(realSignups);
		expect(verdict.tone).toBe('rare');
		expect(verdict.activeWeeks).toBe(7);
	});

	it('flags a raw series inflated by a one-off bot wave as below usual', () => {
		// Raw signup rows: an 83-row bot week inflates the baseline.
		const rawSignups = [...weeks(10, 0), 2, 83, 1, 1, ...weeks(8, 0), 1, 0, 1, 1];
		expect(trendVerdict(rawSignups).tone).toBe('down');
	});

	it('flags a real, sustained drop', () => {
		expect(trendVerdict([...weeks(22, 600), 300, 280, 310, 290]).tone).toBe('down');
	});

	it('flags a real, sustained rise', () => {
		expect(trendVerdict([...weeks(22, 4), 9, 11, 10, 12]).tone).toBe('up');
	});

	it('keeps a small-count wobble steady (registrations: 3 in 4 weeks vs ~5 expected)', () => {
		const registrations = [
			4, 5, 0, 2, 0, 1, 0, 1, 3, 2, 1, 0, 0, 0, 1, 1, 1, 3, 1, 2, 0, 3, 2, 0, 1, 0
		];
		expect(trendVerdict(registrations).tone).toBe('steady');
	});

	it('keeps one quiet week inside a normal month steady (comments: 0 last week)', () => {
		const comments = [
			4, 1, 0, 0, 2, 0, 1, 0, 2, 0, 0, 5, 1, 1, 0, 8, 11, 13, 4, 17, 3, 7, 4, 6, 9, 0
		];
		const verdict = trendVerdict(comments);
		expect(verdict.tone).toBe('steady');
		expect(verdict.recent).toBeCloseTo(4.75);
	});
});
