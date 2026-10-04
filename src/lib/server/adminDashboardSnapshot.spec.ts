// src/lib/server/adminDashboardSnapshot.spec.ts
import { describe, expect, it } from 'vitest';
import {
	ADMIN_SNAPSHOT_MAX_AGE_MS,
	adminSnapshotKeys,
	freshSnapshotEntry,
	loadAdminDashboardSnapshot
} from './adminDashboardSnapshot';

const NOW = Date.parse('2026-10-03T20:30:00Z');

const clientReturning = (result: { data: unknown; error: unknown }) => ({
	rpc: async () => result
});

describe('loadAdminDashboardSnapshot', () => {
	it('maps rows by key', async () => {
		const snapshot = await loadAdminDashboardSnapshot(
			clientReturning({
				data: [{ key: 'a', payload: [1], refreshed_at: '2026-10-03T20:28:00Z' }],
				error: null
			})
		);

		expect(snapshot.get('a')).toEqual({ payload: [1], refreshedAt: '2026-10-03T20:28:00Z' });
	});

	it('returns an empty snapshot when the function is missing or errors', async () => {
		const missing = await loadAdminDashboardSnapshot(
			clientReturning({ data: null, error: { code: 'PGRST202', message: 'missing' } })
		);
		const failed = await loadAdminDashboardSnapshot({
			rpc: async () => {
				throw new Error('network');
			}
		});

		expect(missing.size).toBe(0);
		expect(failed.size).toBe(0);
	});
});

describe('freshSnapshotEntry', () => {
	const snapshot = new Map([
		['fresh', { payload: [1], refreshedAt: '2026-10-03T20:20:00Z' }],
		[
			'old',
			{
				payload: [1],
				refreshedAt: new Date(NOW - ADMIN_SNAPSHOT_MAX_AGE_MS - 1000).toISOString()
			}
		],
		['empty', { payload: null, refreshedAt: '2026-10-03T20:20:00Z' }]
	]);

	it('serves young rows and rejects old, empty and missing ones', () => {
		expect(freshSnapshotEntry(snapshot, 'fresh', NOW)?.payload).toEqual([1]);
		expect(freshSnapshotEntry(snapshot, 'old', NOW)).toBeUndefined();
		expect(freshSnapshotEntry(snapshot, 'empty', NOW)).toBeUndefined();
		expect(freshSnapshotEntry(snapshot, 'missing', NOW)).toBeUndefined();
	});
});

describe('adminSnapshotKeys', () => {
	it('matches the keys written by the refresh migration', () => {
		expect(adminSnapshotKeys.weeklyGrowth(27)).toBe('admin_engagement_trends_weekly_v2:27');
		expect(
			adminSnapshotKeys.trendingPages({
				scope: 'all',
				baselineDays: 7,
				minVisits: 3,
				minUnique: 3,
				limit: 10
			})
		).toBe('get_page_analytics_trending_pages:all:7:3:3:10');
	});
});
