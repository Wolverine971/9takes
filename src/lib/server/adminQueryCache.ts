// src/lib/server/adminQueryCache.ts
//
// Per-instance cache for slow aggregate admin queries (weekly growth, trending
// pages, retention). On the small Postgres instance these take 0.7-2s each and
// spike past 5s under load, while the numbers they return move hourly at most.
// The admin dashboard fires them together, so the slowest one used to set the
// page's load time on every visit.
//
//   age < freshMs     served from memory
//   age < maxStaleMs  served from memory, refreshed in the background
//   older / missing   loaded inline
//
// Only values `shouldCache` accepts are stored, so a failed query never sticks.
import { waitUntil as vercelWaitUntil } from '@vercel/functions';
import { logger } from '$lib/utils/logger';

export const ADMIN_QUERY_FRESH_MS = 5 * 60 * 1000;
export const ADMIN_QUERY_MAX_STALE_MS = 60 * 60 * 1000;

export type AdminQueryCacheOptions<T> = {
	freshMs?: number;
	maxStaleMs?: number;
	shouldCache?: (value: T) => boolean;
	now?: () => number;
	runInBackground?: (promise: Promise<unknown>) => void;
};

type Entry = { value: unknown; storedAt: number };

const entries = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

export function cachedAdminQuery<T>(
	key: string,
	load: () => Promise<T>,
	options: AdminQueryCacheOptions<T> = {}
): Promise<T> {
	const now = options.now ?? Date.now;
	const freshMs = options.freshMs ?? ADMIN_QUERY_FRESH_MS;
	const maxStaleMs = options.maxStaleMs ?? ADMIN_QUERY_MAX_STALE_MS;
	const shouldCache = options.shouldCache ?? (() => true);

	const refresh = (): Promise<T> => {
		const pending = inflight.get(key);
		if (pending) return pending as Promise<T>;

		const promise = load()
			.then((value) => {
				if (shouldCache(value)) entries.set(key, { value, storedAt: now() });
				return value;
			})
			.finally(() => inflight.delete(key));
		inflight.set(key, promise);
		return promise;
	};

	const entry = entries.get(key);
	const age = entry ? now() - entry.storedAt : Infinity;

	if (entry && age < freshMs) return Promise.resolve(entry.value as T);

	if (entry && age < maxStaleMs) {
		const background = refresh().catch((error) => {
			logger.warn('Admin query background refresh failed', { key, error });
		});
		(options.runInBackground ?? vercelWaitUntil)(background);
		return Promise.resolve(entry.value as T);
	}

	return refresh();
}

/** Test helper. */
export function clearAdminQueryCache() {
	entries.clear();
	inflight.clear();
}
