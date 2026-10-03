// src/lib/admin/honestPulse.spec.ts
import { describe, expect, it } from 'vitest';
import type {
	GrowthTrendWeek,
	GrowthTrendsPayload
} from '$lib/components/charts/GrowthTrends.svelte';
import { formatPulseDelta, honestPulse } from './honestPulse';

const week = (weekStart: string, overrides: Partial<GrowthTrendWeek> = {}): GrowthTrendWeek => ({
	weekStart,
	humanVisitors: 0,
	returningHumanVisitors: 0,
	rawVisitors: 0,
	humanComments: 0,
	rawComments: 0,
	contributors: 0,
	returningContributors: 0,
	realSignups: 0,
	rawSignups: 0,
	registrations: 0,
	rawRegistrations: 0,
	bookings: 0,
	rawBookings: 0,
	waitlistAdds: 0,
	talkNotes: 0,
	consultingSessions: 0,
	...overrides
});

const payload = (
	weeks: GrowthTrendWeek[],
	status: GrowthTrendsPayload['status'] = 'ready'
): GrowthTrendsPayload => ({
	status,
	weeks,
	currentWeekDays: 5,
	migration: 'supabase/migrations/20261002120000_admin_engagement_trends_weekly_v2.sql'
});

describe('honestPulse', () => {
	it('uses the last full week, not the partial current week', () => {
		const pulse = honestPulse(
			payload([
				week('2026-09-14', { humanVisitors: 600, rawVisitors: 4000 }),
				week('2026-09-21', { humanVisitors: 640, rawVisitors: 4300 }),
				week('2026-09-28', { humanVisitors: 90, rawVisitors: 700 })
			])
		);
		const visitors = pulse?.tiles.find((tile) => tile.key === 'humanVisitors');
		expect(pulse?.weekStart).toBe('2026-09-21');
		expect(pulse?.currentWeekDays).toBe(5);
		expect(visitors).toMatchObject({ value: 640, delta: 40, thisWeek: 90 });
		expect(visitors?.meta).toBe('+40 vs prior wk');
	});

	it('never surfaces raw, bot-inclusive counts', () => {
		const pulse = honestPulse(
			payload([
				week('2026-09-14', { humanComments: 3, rawComments: 20 }),
				week('2026-09-21', { humanComments: 1, rawComments: 18, realSignups: 0, rawSignups: 9 }),
				week('2026-09-28')
			])
		);
		expect(pulse?.tiles.find((tile) => tile.key === 'humanComments')?.value).toBe(1);
		expect(pulse?.tiles.find((tile) => tile.key === 'realSignups')?.value).toBe(0);
	});

	it('adds returning contributors to the contributors tile', () => {
		const pulse = honestPulse(
			payload([
				week('2026-09-14', { contributors: 4 }),
				week('2026-09-21', { contributors: 2, returningContributors: 1 }),
				week('2026-09-28')
			])
		);
		expect(pulse?.tiles.find((tile) => tile.key === 'contributors')?.meta).toBe(
			'1 returning · −2 vs prior wk'
		);
	});

	it('has no delta when only one full week exists', () => {
		const pulse = honestPulse(
			payload([week('2026-09-21', { contributors: 3 }), week('2026-09-28')])
		);
		const contributors = pulse?.tiles.find((tile) => tile.key === 'contributors');
		expect(contributors?.delta).toBeNull();
		expect(contributors?.meta).toBe('0 returning · first full week');
	});

	it('returns null whenever GrowthTrends shows its unavailable notice', () => {
		const weeks = [week('2026-09-21'), week('2026-09-28')];
		expect(honestPulse(payload(weeks, 'migration_pending'))).toBeNull();
		expect(honestPulse(payload(weeks, 'unavailable'))).toBeNull();
		expect(honestPulse(payload([week('2026-09-28')]))).toBeNull();
		expect(honestPulse(undefined)).toBeNull();
	});
});

describe('formatPulseDelta', () => {
	it('formats signed changes', () => {
		expect(formatPulseDelta(0)).toBe('same as prior wk');
		expect(formatPulseDelta(-3)).toBe('−3 vs prior wk');
		expect(formatPulseDelta(1200)).toBe('+1,200 vs prior wk');
		expect(formatPulseDelta(null)).toBe('first full week');
	});
});
