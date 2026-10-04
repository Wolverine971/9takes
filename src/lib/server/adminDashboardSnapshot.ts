// src/lib/server/adminDashboardSnapshot.ts
//
// Reads the admin dashboard's precomputed aggregates. pg_cron refreshes
// private.admin_dashboard_snapshot every 10 minutes (migration
// 20261003140000_admin_dashboard_snapshot.sql) so /admin no longer waits on
// four slow RPCs per visit. A row older than ADMIN_SNAPSHOT_MAX_AGE_MS, a
// missing row, or a missing function (migration not applied) all mean "load
// live", so a stalled job degrades to the old behaviour, never to stale data.
import { logger } from '$lib/utils/logger';

// Three missed 10-minute runs.
export const ADMIN_SNAPSHOT_MAX_AGE_MS = 30 * 60 * 1000;

// Keys must match the refresh function in the migration, parameters included.
export const adminSnapshotKeys = {
	weeklyGrowth: (weeks: number) => `admin_engagement_trends_weekly_v2:${weeks}`,
	engagement30Days: 'admin_engagement_trends_30_days',
	trendingPages: (options: {
		scope: string;
		baselineDays: number;
		minVisits: number;
		minUnique: number;
		limit: number;
	}) =>
		`get_page_analytics_trending_pages:${options.scope}:${options.baselineDays}:${options.minVisits}:${options.minUnique}:${options.limit}`,
	retentionSummary: 'get_admin_retention_summary'
} as const;

export type AdminSnapshotEntry = { payload: unknown; refreshedAt: string };
export type AdminDashboardSnapshot = Map<string, AdminSnapshotEntry>;

type SnapshotRow = { key: string; payload: unknown; refreshed_at: string };
type RpcClient = {
	rpc: (fn: string) => PromiseLike<{ data: unknown; error: unknown }>;
};

function isMissingRpc(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const { code, message } = err as { code?: unknown; message?: unknown };
	return (
		code === 'PGRST202' ||
		code === '42883' ||
		String(message ?? '').includes('Could not find the function')
	);
}

/** Never throws: any failure returns an empty snapshot, which means "load live". */
export async function loadAdminDashboardSnapshot(
	client: RpcClient
): Promise<AdminDashboardSnapshot> {
	try {
		const { data, error } = await client.rpc('get_admin_dashboard_snapshot');
		if (error) {
			if (!isMissingRpc(error)) logger.warn('Failed to load admin dashboard snapshot', { error });
			return new Map();
		}

		return new Map(
			((data ?? []) as SnapshotRow[]).map((row) => [
				row.key,
				{ payload: row.payload, refreshedAt: row.refreshed_at }
			])
		);
	} catch (error) {
		logger.warn('Failed to load admin dashboard snapshot', { error });
		return new Map();
	}
}

/** The entry for `key` if it is young enough to show, else undefined. */
export function freshSnapshotEntry(
	snapshot: AdminDashboardSnapshot,
	key: string,
	now = Date.now(),
	maxAgeMs = ADMIN_SNAPSHOT_MAX_AGE_MS
): AdminSnapshotEntry | undefined {
	const entry = snapshot.get(key);
	if (!entry || entry.payload === null || entry.payload === undefined) return undefined;

	const refreshedAt = Date.parse(entry.refreshedAt);
	if (!Number.isFinite(refreshedAt) || now - refreshedAt > maxAgeMs) return undefined;

	return entry;
}
