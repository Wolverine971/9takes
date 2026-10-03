// src/lib/admin/honestPulse.ts
// Honest "Pulse" tiles for the mobile admin command center: the last full week of
// human-filtered counts from admin_engagement_trends_weekly_v2 (the same payload
// GrowthTrends.svelte renders), each compared with the week before it.
import type {
	GrowthTrendWeek,
	GrowthTrendsPayload
} from '$lib/components/charts/GrowthTrends.svelte';

export type HonestPulseKey =
	'humanVisitors' | 'contributors' | 'humanComments' | 'realSignups' | 'registrations';

export type HonestPulseTile = {
	key: HonestPulseKey;
	label: string;
	value: number;
	/** Change vs the previous full week; null when there is no previous full week. */
	delta: number | null;
	/** Partial current week, so far. */
	thisWeek: number;
	meta: string;
};

export type HonestPulse = {
	weekStart: string;
	currentWeekDays: number;
	tiles: HonestPulseTile[];
};

const TILES: Array<{
	key: HonestPulseKey;
	label: string;
	extra?: (week: GrowthTrendWeek) => string;
}> = [
	{ key: 'humanVisitors', label: 'Engaged visitors · last wk' },
	{
		key: 'contributors',
		label: 'Contributors · last wk',
		extra: (week) => `${week.returningContributors.toLocaleString()} returning`
	},
	{ key: 'humanComments', label: 'Human comments · last wk' },
	{ key: 'realSignups', label: 'Real signups · last wk' },
	{ key: 'registrations', label: 'Registrations · last wk' }
];

export function formatPulseDelta(delta: number | null): string {
	if (delta === null) return 'first full week';
	if (delta === 0) return 'same as prior wk';
	const sign = delta > 0 ? '+' : '−';
	return `${sign}${Math.abs(delta).toLocaleString()} vs prior wk`;
}

/**
 * Null whenever GrowthTrends would show its "honest numbers unavailable" notice
 * (RPC missing or failed, or fewer than two weeks), so callers fall back to raw
 * tiles that are labelled as raw.
 */
export function honestPulse(trends: GrowthTrendsPayload | null | undefined): HonestPulse | null {
	if (!trends || trends.status !== 'ready' || trends.weeks.length < 2) return null;

	const currentWeek = trends.weeks[trends.weeks.length - 1];
	const lastFull = trends.weeks[trends.weeks.length - 2];
	const previousFull = trends.weeks.length >= 3 ? trends.weeks[trends.weeks.length - 3] : null;

	return {
		weekStart: lastFull.weekStart,
		currentWeekDays: trends.currentWeekDays,
		tiles: TILES.map(({ key, label, extra }) => {
			const value = lastFull[key];
			const delta = previousFull ? value - previousFull[key] : null;
			const deltaText = formatPulseDelta(delta);
			return {
				key,
				label,
				value,
				delta,
				thisWeek: currentWeek[key],
				meta: extra ? `${extra(lastFull)} · ${deltaText}` : deltaText
			};
		})
	};
}
