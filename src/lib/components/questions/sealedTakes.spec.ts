// src/lib/components/questions/sealedTakes.spec.ts
import { describe, expect, it } from 'vitest';
import { relativeAge, shortDate } from './sealedTakes';

const NOW = '2026-11-05T12:00:00.000Z';

describe('relativeAge', () => {
	it.each([
		['2026-11-05T11:59:30.000Z', 'now'],
		['2026-11-05T11:55:00.000Z', '5m'],
		['2026-11-05T09:00:00.000Z', '3h'],
		['2026-11-01T12:00:00.000Z', '4d'],
		['2026-10-20T12:00:00.000Z', '2w'],
		['2026-06-01T12:00:00.000Z', '5mo'],
		['2024-10-01T12:00:00.000Z', '2y']
	])('%s -> %s', (at, expected) => {
		expect(relativeAge(at, NOW)).toBe(expected);
	});

	it('treats unparseable or future times as now', () => {
		expect(relativeAge('nope', NOW)).toBe('now');
		expect(relativeAge('2026-11-06T12:00:00.000Z', NOW)).toBe('now');
	});
});

describe('shortDate', () => {
	it('formats in the site time zone', () => {
		// 02:00 UTC on Nov 4 is still Nov 3 in New York.
		expect(shortDate('2026-11-04T02:00:00.000Z')).toBe('Nov 3');
	});

	it('returns an empty string for missing or bad input', () => {
		expect(shortDate(null)).toBe('');
		expect(shortDate('nope')).toBe('');
	});
});
