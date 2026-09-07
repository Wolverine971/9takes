import { beforeEach, describe, expect, it, vi } from 'vitest';
const { rpc, env } = vi.hoisted(() => ({
	rpc: vi.fn(),
	env: { PRIVATE_COMMENT_RANKING_ENABLED: '', PRIVATE_HOST_USER_ID: '' }
}));
vi.mock('$env/dynamic/private', () => ({ env }));
vi.mock('./supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({ rpc }) }));
import { getQuestionTakes, isCommentRankingEnabled } from './questionTakes';
beforeEach(() => {
	vi.clearAllMocks();
	env.PRIVATE_COMMENT_RANKING_ENABLED = '';
});
describe('question take snapshot', () => {
	it('fetches one capped projection with server-bound identities and returns own takes outside the cap', async () => {
		rpc.mockResolvedValue({
			data: { takes: [{ id: 2 }], own_takes: [{ id: 1, is_own: true }], total_count: 101 },
			error: null
		});
		expect(await getQuestionTakes(118, { viewerId: 'reader', fingerprint: 'browser' })).toEqual({
			data: [{ id: 2 }],
			ownComments: [{ id: 1, is_own: true }],
			count: 101
		});
		expect(rpc).toHaveBeenCalledOnce();
		expect(rpc).toHaveBeenCalledWith(
			'get_question_take_data',
			expect.objectContaining({
				p_limit: 100,
				p_question_id: 118,
				p_viewer_id: 'reader',
				p_fingerprint: 'browser',
				p_before: null,
				p_before_id: null
			})
		);
	});
	it('passes date and ID together for stable overflow', async () => {
		rpc.mockResolvedValue({ data: { takes: [], total_count: 100 }, error: null });
		await getQuestionTakes(118, { limit: 10, before: '2026-09-01T00:00:00Z', beforeId: 2 });
		expect(rpc).toHaveBeenCalledWith(
			'get_question_take_data',
			expect.objectContaining({ p_limit: 10, p_before: '2026-09-01T00:00:00Z', p_before_id: 2 })
		);
	});
	it('fails visibly if the required migration or query is unavailable', async () => {
		rpc.mockResolvedValue({ error: { code: 'PGRST202' } });
		await expect(getQuestionTakes(118)).rejects.toThrow('Could not load question takes');
	});
	it('collects views before explicit activation of Ranked', () => {
		expect(isCommentRankingEnabled()).toBe(false);
		env.PRIVATE_COMMENT_RANKING_ENABLED = 'true';
		expect(isCommentRankingEnabled()).toBe(true);
	});
});
