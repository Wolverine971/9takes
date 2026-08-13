// src/routes/admin/question-distribution/question-distribution.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock('$lib/server/adminAuth', () => ({
	requireAdmin: vi.fn(),
	guardAdminActions: <T>(handlers: T) => handlers
}));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: rpcMock })
}));

import { actions } from './+page.server';

function actionEvent(body: Record<string, string>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(body)) formData.set(key, value);

	return {
		request: { formData: vi.fn().mockResolvedValue(formData) },
		locals: { session: { user: { id: '00000000-0000-4000-8000-000000000001' } } }
	} as any;
}

describe('/admin/question-distribution actions', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		rpcMock.mockResolvedValue({ data: 44, error: null });
	});

	it('starts only a manual feature run with bounded operator inputs', async () => {
		const result = await actions.start?.(
			actionEvent({
				questionId: '812',
				reason: 'Needs a fair first-response test',
				notes: 'Review after the first 30 qualified views.',
				targetUniqueImpressions: '30',
				maxDurationDays: '7'
			})
		);

		expect(result).toEqual(expect.objectContaining({ success: true, action: 'start' }));
		expect(rpcMock).toHaveBeenCalledWith('start_question_feature_run', {
			p_question_id: 812,
			p_reason_selected: 'Needs a fair first-response test',
			p_selection_mode: 'manual',
			p_target_unique_impressions: 30,
			p_max_duration_days: 7,
			p_operator_notes: 'Review after the first 30 qualified views.',
			p_created_by: '00000000-0000-4000-8000-000000000001'
		});
	});

	it('rejects an invalid control action before touching the database', async () => {
		const result = await actions.control?.(
			actionEvent({ runId: '44', controlAction: 'auto-advance' })
		);

		expect(result).toMatchObject({ status: 400, data: { action: 'control' } });
		expect(rpcMock).not.toHaveBeenCalled();
	});
});
