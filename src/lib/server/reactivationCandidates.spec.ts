import { describe, expect, it, vi } from 'vitest';

import {
	loadReactivationCandidateSummary,
	parseReactivationCandidateSummary,
	type ReactivationCandidateClient
} from './reactivationCandidates';

const summary = {
	limit: 200,
	candidates: [
		{
			userId: '00000000-0000-0000-0000-000000000003',
			email: 'ada@example.com',
			name: 'Ada',
			bucket: 'dormant',
			createdAt: '2025-12-01T00:00:00+00:00',
			ageDays: 220
		}
	],
	counts: { cold: 0, dormant: 1, zombies: 0 },
	skipped: [{ reason: 'suppressed', count: 2 }],
	totalEligible: 1,
	totalProfilesChecked: 3
};

describe('reactivation candidate summary', () => {
	it('validates the database summary contract', () => {
		expect(parseReactivationCandidateSummary(summary)).toEqual(summary);
		expect(() =>
			parseReactivationCandidateSummary({
				...summary,
				candidates: [{ ...summary.candidates[0], bucket: 'recent' }]
			})
		).toThrow();
	});

	it('bounds the RPC page size and deduplicates requested buckets', async () => {
		const rpc = vi.fn().mockResolvedValue({ data: { ...summary, limit: 1000 }, error: null });

		await expect(
			loadReactivationCandidateSummary({ rpc } as unknown as ReactivationCandidateClient, {
				limit: 5000,
				buckets: ['dormant', 'dormant', 'cold']
			})
		).resolves.toMatchObject({ limit: 1000, totalEligible: 1 });

		expect(rpc).toHaveBeenCalledWith('get_reactivation_candidate_summary', {
			p_limit: 1000,
			p_buckets: ['dormant', 'cold']
		});
	});

	it('does not silently accept RPC failures', async () => {
		const databaseError = { message: 'permission denied' };
		const rpc = vi.fn().mockResolvedValue({ data: null, error: databaseError });

		await expect(
			loadReactivationCandidateSummary({ rpc } as unknown as ReactivationCandidateClient, {
				limit: 50
			})
		).rejects.toBe(databaseError);
	});
});
