// src/lib/admin/dashboardFormat.spec.ts
import { describe, expect, it } from 'vitest';
import { fullDate, shortDate, unsubscribeReasonLabel } from './dashboardFormat';

// 2026-10-03 15:00 Eastern.
const NOW = new Date('2026-10-03T19:00:00Z');

describe('shortDate', () => {
	it('shows the time for today in Eastern time, even when UTC has rolled over', () => {
		expect(shortDate('2026-10-03T13:05:00Z', NOW)).toBe('9:05 AM');
		// 11:30 PM Eastern on Oct 3 is already Oct 4 in UTC.
		expect(shortDate('2026-10-04T03:30:00Z', new Date('2026-10-04T03:45:00Z'))).toBe('11:30 PM');
	});

	it('shows month and day this year, with the year before that', () => {
		expect(shortDate('2026-09-28T16:00:00Z', NOW)).toBe('Sep 28');
		expect(shortDate('2025-11-02T16:00:00Z', NOW)).toBe('Nov 2, 2025');
	});

	it('keeps date-only values on their calendar day', () => {
		expect(shortDate('2026-09-01', NOW)).toBe('Sep 1');
	});

	it('handles missing and invalid values', () => {
		expect(shortDate(null, NOW)).toBe('—');
		expect(shortDate('not a date', NOW)).toBe('—');
		expect(fullDate(null)).toBe('');
	});
});

describe('unsubscribeReasonLabel', () => {
	it('translates known machine codes', () => {
		expect(unsubscribeReasonLabel('bot_submitted_quarantine_2026-06-19')).toBe('Bot quarantine');
		expect(unsubscribeReasonLabel('tracking_unsubscribe')).toBe('Clicked unsubscribe');
		expect(unsubscribeReasonLabel('hard_bounce_reactivation_2026-08-03')).toBe('Hard bounce');
	});

	it('falls back to readable text', () => {
		expect(unsubscribeReasonLabel('manual_admin_removal_2026-01-02')).toBe('manual admin removal');
		expect(unsubscribeReasonLabel(null)).toBe('');
	});
});
