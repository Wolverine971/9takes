import { describe, expect, it } from 'vitest';
import {
	endOfUtcDay,
	getCompletedUtcWeeksRange,
	startOfUtcMonth,
	startOfUtcWeek,
	toUtcDateString
} from './adminAnalyticsDates';

describe('admin analytics UTC date boundaries', () => {
	it('formats the UTC calendar date instead of the runtime-local date', () => {
		expect(toUtcDateString(new Date('2026-07-10T00:30:00.000Z'))).toBe('2026-07-10');
	});

	it('uses Monday as the start of a UTC reporting week', () => {
		expect(startOfUtcWeek(new Date('2026-07-12T23:30:00.000Z')).toISOString()).toBe(
			'2026-07-06T00:00:00.000Z'
		);
	});

	it('uses the first UTC day for monthly reporting', () => {
		expect(startOfUtcMonth(new Date('2026-07-31T23:30:00.000Z')).toISOString()).toBe(
			'2026-07-01T00:00:00.000Z'
		);
	});

	it('constructs an inclusive UTC end-of-day timestamp', () => {
		expect(endOfUtcDay('2026-07-09').toISOString()).toBe('2026-07-09T23:59:59.999Z');
	});

	it('returns only completed UTC weeks', () => {
		expect(getCompletedUtcWeeksRange(new Date('2026-07-09T16:00:00.000Z'), 2)).toEqual({
			from: '2026-06-22',
			to: '2026-07-05'
		});
	});
});
