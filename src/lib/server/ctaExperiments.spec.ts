// src/lib/server/ctaExperiments.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: { error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));

import { loadCtaExperimentResults, recordCtaExperimentEvent } from './ctaExperiments';

beforeEach(() => vi.clearAllMocks());

describe('recordCtaExperimentEvent', () => {
	it('writes one row per event', async () => {
		const insert = vi.fn(async () => ({ error: null }));
		await recordCtaExperimentEvent(
			{
				experiment: 'beta_card_v1',
				variant: 'a',
				event: 'opened',
				surface: 'enneagram',
				placement: 'rail',
				path: '/x',
				fingerprint: 'fp'
			},
			{ supabase: { from: () => ({ insert }) } }
		);

		expect(insert).toHaveBeenCalledWith({
			experiment: 'beta_card_v1',
			variant: 'a',
			event: 'opened',
			surface: 'enneagram',
			placement: 'rail',
			path: '/x',
			fingerprint: 'fp'
		});
	});

	it('swallows a failed write so instrumentation never breaks a page', async () => {
		const insert = vi.fn(async () => ({
			error: { code: '42P01', message: 'relation does not exist', details: 'private visitor data' }
		}));
		await expect(
			recordCtaExperimentEvent(
				{ experiment: 'beta_card_v1', variant: 'a', event: 'viewed' },
				{ supabase: { from: () => ({ insert }) } }
			)
		).resolves.toBeUndefined();
		expect(loggerMocks.warn).toHaveBeenCalledWith('CTA experiment event not recorded', {
			experiment: 'beta_card_v1',
			event: 'viewed',
			error: { code: '42P01', message: 'CTA experiment events table is unavailable' }
		});
	});
});

describe('loadCtaExperimentResults', () => {
	function countingClient(
		counts: Record<string, number | null>,
		error: unknown = null,
		status = 200
	) {
		return {
			from: () => {
				const filters: Record<string, string> = {};
				const builder = {
					select: () => builder,
					eq: (column: string, value: string) => {
						filters[column] = value;
						if (column === 'event') {
							return Promise.resolve({
								count:
									counts[`${filters.variant}:${filters.event}`] === undefined
										? 0
										: counts[`${filters.variant}:${filters.event}`],
								error,
								status
							});
						}
						return builder;
					}
				};
				return builder;
			}
		};
	}

	it('counts views, opens, and submits per variant', async () => {
		const results = await loadCtaExperimentResults(
			countingClient({ 'a:viewed': 40, 'a:opened': 6, 'a:submitted': 2, 'b:viewed': 38 }),
			'beta_card_v1',
			[
				{ id: 'a', headline: 'A' },
				{ id: 'b', headline: 'B' }
			]
		);

		expect(results).toEqual([
			{ variant: 'a', headline: 'A', viewed: 40, opened: 6, submitted: 2 },
			{ variant: 'b', headline: 'B', viewed: 38, opened: 0, submitted: 0 }
		]);
	});

	it('returns null instead of throwing when the table is unreadable', async () => {
		const results = await loadCtaExperimentResults(
			countingClient({}, { message: 'permission denied' }),
			'beta_card_v1',
			[{ id: 'a', headline: 'A' }]
		);
		expect(results).toBeNull();
	});

	it('logs a permission code without database details, hints, or visitor data', async () => {
		const results = await loadCtaExperimentResults(
			countingClient(
				{},
				{
					code: '42501',
					message: 'permission denied: secret token',
					details: 'private visitor data',
					hint: 'sensitive query'
				},
				403
			),
			'beta_card_v1',
			[{ id: 'a', headline: 'A' }]
		);
		expect(results).toBeNull();
		expect(loggerMocks.warn).toHaveBeenCalledExactlyOnceWith('CTA experiment results unavailable', {
			experiment: 'beta_card_v1',
			error: { code: '42501', message: 'Permission denied for CTA experiment events', status: 403 }
		});
	});

	it('preserves HTTP status when a failed HEAD request has no JSON error body', async () => {
		await loadCtaExperimentResults(countingClient({}, { message: '' }, 403), 'beta_card_v1', [
			{ id: 'a', headline: 'A' }
		]);
		expect(loggerMocks.warn).toHaveBeenCalledWith('CTA experiment results unavailable', {
			experiment: 'beta_card_v1',
			error: { code: 'HTTP_403', message: 'CTA experiment request was not authorized', status: 403 }
		});
	});

	it.each([null, -1, NaN])(
		'does not report a missing or invalid count (%s) as zero',
		async (count) => {
			const results = await loadCtaExperimentResults(
				countingClient({ 'a:viewed': count }),
				'beta_card_v1',
				[{ id: 'a', headline: 'A' }]
			);
			expect(results).toBeNull();
			expect(loggerMocks.warn).toHaveBeenCalledWith('CTA experiment results unavailable', {
				experiment: 'beta_card_v1',
				error: {
					code: 'CTA_COUNT_UNAVAILABLE',
					message: 'CTA experiment exact count was not returned'
				}
			});
		}
	);

	it('sanitizes unexpected exceptions without losing the unavailable state', async () => {
		const results = await loadCtaExperimentResults(
			{
				from: () => {
					throw new Error('https://private.example?token=secret');
				}
			},
			'beta_card_v1',
			[{ id: 'a', headline: 'A' }]
		);
		expect(results).toBeNull();
		expect(loggerMocks.warn).toHaveBeenCalledWith('CTA experiment results unavailable', {
			experiment: 'beta_card_v1',
			error: { code: 'UNKNOWN', message: 'CTA experiment database request failed' }
		});
	});
});
