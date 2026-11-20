// src/lib/peopleTimeline.spec.ts
import { describe, expect, it } from 'vitest';
import { buildTimeline, formatYearSpan } from './peopleTimeline';

type P = { slug: string; born: number | null };
const people = (rows: Record<string, number | null>): P[] =>
	Object.entries(rows).map(([slug, born]) => ({ slug, born }));
const view = (timeline: ReturnType<typeof buildTimeline<P>>) => ({
	groups: timeline.groups.map((group) => [
		group.label,
		group.startYear,
		group.endYear,
		group.people.map((person) => person.slug)
	]),
	unknown: timeline.unknown.map((person) => person.slug)
});

describe('buildTimeline', () => {
	it('orders generations oldest-left to youngest-right and people by birth year', () => {
		const timeline = buildTimeline(
			people({ a: 1999, b: 1970, c: 1985, d: 1975, e: 2001, f: 1968, g: 1990, h: 2000, i: 1983 }),
			(person) => person.born
		);
		expect(view(timeline)).toEqual({
			groups: [
				['Gen X', 1968, 1975, ['f', 'b', 'd']],
				['Millennials', 1983, 1990, ['i', 'c', 'g']],
				['Gen Z', 1999, 2001, ['a', 'h', 'e']]
			],
			unknown: []
		});
	});

	it('merges a generation under 3 into its smaller neighbour and spans the merged years', () => {
		const timeline = buildTimeline(
			people({ a: 1950, b: 1970, c: 1972, d: 1985, e: 1986, f: 1990, g: 1991, h: null }),
			(person) => person.born
		);
		expect(view(timeline)).toEqual({
			groups: [
				['Boomers–Gen X', 1950, 1972, ['a', 'b', 'c']],
				['Millennials', 1985, 1991, ['d', 'e', 'f', 'g']]
			],
			unknown: ['h']
		});
	});

	it('keeps one group when everyone shares a generation, and handles nobody born', () => {
		expect(view(buildTimeline(people({ a: 1990, b: 1985 }), (p) => p.born)).groups).toEqual([
			['Millennials', 1985, 1990, ['b', 'a']]
		]);
		expect(view(buildTimeline(people({ a: null }), (p) => p.born))).toEqual({
			groups: [],
			unknown: ['a']
		});
	});

	it('keeps input (fame) order for people born the same year', () => {
		const timeline = buildTimeline(people({ z: 1980, y: 1980, x: 1980 }), (p) => p.born);
		expect(timeline.groups[0].people.map((person) => person.slug)).toEqual(['z', 'y', 'x']);
	});
});

describe('formatYearSpan', () => {
	it('formats single years, ranges and BC years', () => {
		expect(formatYearSpan(1965, 1965)).toBe('1965');
		expect(formatYearSpan(1965, 1979)).toBe('1965–1979');
		expect(formatYearSpan(-100, 1821)).toBe('100 BC–1821');
	});
});
