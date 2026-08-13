// src/lib/server/questionDistribution.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: rpcMock })
}));

import {
	EMERGENCY_HOMEPAGE_QUESTION,
	getHomepageFeaturedQuestion,
	recordHomepageFeatureImpression
} from './questionDistribution';

describe('question distribution server helpers', () => {
	beforeEach(() => vi.clearAllMocks());

	it('maps the active database run into the homepage contract', async () => {
		rpcMock.mockResolvedValueOnce({
			data: [
				{
					run_id: '44',
					question_id: '812',
					question_text: 'What would feel like a fair first response?',
					question_url: 'what-would-feel-like-a-fair-first-response',
					started_at: '2026-08-12T12:00:00Z',
					ends_at: '2026-08-19T12:00:00Z',
					target_unique_impressions: 30,
					qualified_unique_impressions: 8,
					selection_mode: 'manual',
					is_fallback: false
				}
			],
			error: null
		});

		await expect(getHomepageFeaturedQuestion()).resolves.toEqual(
			expect.objectContaining({
				id: 812,
				featureRunId: 44,
				qualifiedUniqueImpressions: 8,
				isFallback: false
			})
		);
		expect(rpcMock).toHaveBeenCalledWith('get_current_homepage_feature');
	});

	it('uses the emergency question only when the database selector is unavailable', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		rpcMock.mockResolvedValueOnce({ data: null, error: { message: 'not deployed' } });

		await expect(getHomepageFeaturedQuestion()).resolves.toBe(EMERGENCY_HOMEPAGE_QUESTION);
		consoleError.mockRestore();
	});

	it('hashes the browser fingerprint before recording an impression', async () => {
		rpcMock.mockResolvedValueOnce({ data: true, error: null });

		await expect(
			recordHomepageFeatureImpression({
				featureRunId: 44,
				questionId: 812,
				fingerprint: 'private-browser-fingerprint'
			})
		).resolves.toBe(true);

		expect(rpcMock).toHaveBeenCalledWith('record_question_feature_impression', {
			p_run_id: 44,
			p_question_id: 812,
			p_fingerprint_hash: expect.stringMatching(/^[0-9a-f]{64}$/)
		});
		expect(JSON.stringify(rpcMock.mock.calls)).not.toContain('private-browser-fingerprint');
	});
});
