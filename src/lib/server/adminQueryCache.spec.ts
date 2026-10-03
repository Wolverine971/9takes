// src/lib/server/adminQueryCache.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cachedAdminQuery, clearAdminQueryCache } from './adminQueryCache';

const MIN = 60 * 1000;

describe('cachedAdminQuery', () => {
	let clock = 0;
	const now = () => clock;
	const background: Promise<unknown>[] = [];
	const runInBackground = (promise: Promise<unknown>) => {
		background.push(promise);
	};

	beforeEach(() => {
		clearAdminQueryCache();
		clock = 0;
		background.length = 0;
	});

	it('serves a fresh value from memory without reloading', async () => {
		const load = vi.fn().mockResolvedValue('a');

		expect(await cachedAdminQuery('k', load, { now, runInBackground })).toBe('a');
		clock = 4 * MIN;
		expect(await cachedAdminQuery('k', load, { now, runInBackground })).toBe('a');
		expect(load).toHaveBeenCalledTimes(1);
	});

	it('serves a stale value immediately and refreshes it in the background', async () => {
		const load = vi.fn().mockResolvedValueOnce('old').mockResolvedValueOnce('new');

		await cachedAdminQuery('k', load, { now, runInBackground });
		clock = 10 * MIN;

		expect(await cachedAdminQuery('k', load, { now, runInBackground })).toBe('old');
		expect(background).toHaveLength(1);
		await Promise.all(background);

		expect(await cachedAdminQuery('k', load, { now, runInBackground })).toBe('new');
		expect(load).toHaveBeenCalledTimes(2);
	});

	it('loads inline once the value is older than the stale window', async () => {
		const load = vi.fn().mockResolvedValueOnce('old').mockResolvedValueOnce('new');

		await cachedAdminQuery('k', load, { now, runInBackground });
		clock = 61 * MIN;

		expect(await cachedAdminQuery('k', load, { now, runInBackground })).toBe('new');
		expect(background).toHaveLength(0);
	});

	it('does not store values that shouldCache rejects', async () => {
		const load = vi
			.fn()
			.mockResolvedValueOnce({ error: 'boom' })
			.mockResolvedValueOnce({ error: null });
		const shouldCache = (value: { error: string | null }) => !value.error;

		expect(await cachedAdminQuery('k', load, { now, runInBackground, shouldCache })).toEqual({
			error: 'boom'
		});
		expect(await cachedAdminQuery('k', load, { now, runInBackground, shouldCache })).toEqual({
			error: null
		});
		expect(load).toHaveBeenCalledTimes(2);
	});

	it('shares one in-flight load between concurrent callers', async () => {
		let resolve!: (value: string) => void;
		const load = vi.fn(() => new Promise<string>((r) => (resolve = r)));

		const first = cachedAdminQuery('k', load, { now, runInBackground });
		const second = cachedAdminQuery('k', load, { now, runInBackground });
		resolve('a');

		expect(await Promise.all([first, second])).toEqual(['a', 'a']);
		expect(load).toHaveBeenCalledTimes(1);
	});

	it('does not cache a rejected load', async () => {
		const load = vi.fn().mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce('a');

		await expect(cachedAdminQuery('k', load, { now, runInBackground })).rejects.toThrow('down');
		expect(await cachedAdminQuery('k', load, { now, runInBackground })).toBe('a');
	});
});
