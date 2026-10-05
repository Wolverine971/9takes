// src/lib/server/ctaExperiments.spec.ts
import { describe, expect, it, vi } from 'vitest';

const { loggerMocks } = vi.hoisted(() => ({
	loggerMocks: { error: vi.fn(), warn: vi.fn(), info: vi.fn() }
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: vi.fn() }));
vi.mock('$lib/utils/logger', () => ({ logger: loggerMocks }));

import { loadCtaExperimentResults, recordCtaExperimentEvent } from './ctaExperiments';

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
		const insert = vi.fn(async () => ({ error: { message: 'relation does not exist' } }));
		await expect(
			recordCtaExperimentEvent(
				{ experiment: 'beta_card_v1', variant: 'a', event: 'viewed' },
				{ supabase: { from: () => ({ insert }) } }
			)
		).resolves.toBeUndefined();
		expect(loggerMocks.warn).toHaveBeenCalled();
	});
});

describe('loadCtaExperimentResults', () => {
	function countingClient(counts: Record<string, number>, error: unknown = null) {
		return {
			from: () => {
				const filters: Record<string, string> = {};
				const builder = {
					select: () => builder,
					eq: (column: string, value: string) => {
						filters[column] = value;
						if (column === 'event') {
							return Promise.resolve({
								count: counts[`${filters.variant}:${filters.event}`] ?? 0,
								error
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
});
