// src/lib/utils/corpusTypeRanking.spec.ts
import { describe, expect, it } from 'vitest';
import { describeTypeRank, joinList, ordinal, rankTypes, typeExtremes } from './corpusTypeRanking';

// Live corpus shape on 2026-10-06: Types 1 and 2 tie at the bottom.
const COUNTS = { '1': 29, '2': 29, '3': 81, '4': 65, '5': 38, '6': 54, '7': 62, '8': 48, '9': 45 };

describe('rankTypes', () => {
	it('uses competition ranking so tied types share a rank', () => {
		const ranked = rankTypes(COUNTS);
		expect(ranked.map((entry) => [entry.type, entry.rank])).toEqual([
			['3', 1],
			['4', 2],
			['7', 3],
			['6', 4],
			['8', 5],
			['9', 6],
			['5', 7],
			['1', 8],
			['2', 8]
		]);
		expect(ranked.find((entry) => entry.type === '1')?.tiedWith).toEqual(['2']);
	});
});

describe('typeExtremes', () => {
	it('returns every type sharing the top or bottom value', () => {
		expect(typeExtremes(COUNTS)).toEqual({
			most: ['3'],
			mostValue: 81,
			least: ['1', '2'],
			leastValue: 29
		});
	});

	it('returns null for empty input', () => {
		expect(typeExtremes({})).toBeNull();
	});
});

describe('describeTypeRank', () => {
	it('describes the leader, a middle rank, and a tie at the bottom', () => {
		expect(describeTypeRank(COUNTS, '3')).toBe('the most common of the nine types');
		expect(describeTypeRank(COUNTS, '9')).toBe('the 6th most common of the nine types');
		expect(describeTypeRank(COUNTS, '1')).toBe(
			'tied with Type 2 for the least common of the nine types'
		);
	});

	it('handles ties at the top and in the middle', () => {
		const counts = { ...COUNTS, '4': 81, '8': 45 };
		expect(describeTypeRank(counts, '3')).toBe(
			'tied with Type 4 for the most common of the nine types'
		);
		expect(describeTypeRank(counts, '9')).toBe(
			'tied with Type 8 as the 5th most common of the nine types'
		);
	});

	it('returns an empty string for an unknown type', () => {
		expect(describeTypeRank(COUNTS, '10')).toBe('');
	});
});

describe('formatting helpers', () => {
	it('builds ordinals and lists', () => {
		expect([1, 2, 3, 4, 11, 12, 13, 21].map(ordinal)).toEqual([
			'1st',
			'2nd',
			'3rd',
			'4th',
			'11th',
			'12th',
			'13th',
			'21st'
		]);
		expect(joinList(['A'])).toBe('A');
		expect(joinList(['A', 'B'])).toBe('A and B');
		expect(joinList(['A', 'B', 'C'])).toBe('A, B, and C');
	});
});
