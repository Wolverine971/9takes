// src/lib/utils/takeDate.spec.ts

import { describe, expect, it } from 'vitest';
import { formatTakeDate, formatTakeDateFull } from './takeDate';

const NOW = new Date('2026-11-21T21:00:00Z');
const ZONE = 'America/New_York';

function ago(ms: number): string {
	return new Date(NOW.getTime() - ms).toISOString();
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('formatTakeDate', () => {
	it('reads as time passed for the first week', () => {
		expect(formatTakeDate(ago(20_000), NOW, ZONE)).toBe('just now');
		expect(formatTakeDate(ago(4 * MINUTE), NOW, ZONE)).toBe('4m ago');
		expect(formatTakeDate(ago(59 * MINUTE + 59_000), NOW, ZONE)).toBe('59m ago');
		expect(formatTakeDate(ago(6 * HOUR), NOW, ZONE)).toBe('6h ago');
		expect(formatTakeDate(ago(DAY), NOW, ZONE)).toBe('1d ago');
		expect(formatTakeDate(ago(7 * DAY - 1), NOW, ZONE)).toBe('6d ago');
	});

	it('switches to the date after a week, and to month + year before this year', () => {
		expect(formatTakeDate(ago(7 * DAY), NOW, ZONE)).toBe('Nov 14');
		expect(formatTakeDate('2026-03-14T15:00:00Z', NOW, ZONE)).toBe('Mar 14');
		expect(formatTakeDate('2023-07-31T15:00:00Z', NOW, ZONE)).toBe('Jul 2023');
	});

	it('uses the reader’s calendar day and year, not UTC’s', () => {
		// 01:11 UTC on Nov 9 is still the evening of Nov 8 in New York.
		expect(formatTakeDate('2026-11-09T01:11:40Z', NOW, ZONE)).toBe('Nov 8');
		expect(formatTakeDate('2026-11-09T01:11:40Z', NOW, 'UTC')).toBe('Nov 9');
		// 02:00 UTC on Jan 1 2026 is still 2025 in New York.
		expect(formatTakeDate('2026-01-01T02:00:00Z', NOW, ZONE)).toBe('Dec 2025');
	});

	it('treats a take from the "future" (reader clock behind) as just now', () => {
		expect(formatTakeDate(ago(-5 * MINUTE), NOW, ZONE)).toBe('just now');
	});

	it('returns null for a missing or unreadable timestamp', () => {
		expect(formatTakeDate(null, NOW, ZONE)).toBeNull();
		expect(formatTakeDate('', NOW, ZONE)).toBeNull();
		expect(formatTakeDate('not a date', NOW, ZONE)).toBeNull();
	});
});

describe('formatTakeDateFull', () => {
	it('gives the exact date and time', () => {
		expect(formatTakeDateFull('2026-11-07T18:36:53Z', ZONE)).toBe('Nov 7, 2026, 1:36 PM');
	});

	it('returns null for a missing or unreadable timestamp', () => {
		expect(formatTakeDateFull(undefined, ZONE)).toBeNull();
		expect(formatTakeDateFull('not a date', ZONE)).toBeNull();
	});
});
