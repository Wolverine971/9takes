// src/routes/api/cron/process-sequences/process-sequences.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { processPendingSequenceSendsMock, loadEmailDeliveryHealthMock } = vi.hoisted(() => ({
	processPendingSequenceSendsMock: vi.fn(),
	loadEmailDeliveryHealthMock: vi.fn()
}));

vi.mock('$env/static/private', () => ({ CRON_SECRET: 'cron-test-secret' }));
vi.mock('$lib/server/emailSequences', () => ({
	processPendingSequenceSends: processPendingSequenceSendsMock
}));
vi.mock('$lib/server/emailDeliveryHealth', () => ({
	loadEmailDeliveryHealth: loadEmailDeliveryHealthMock
}));
vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({}) }));

import { GET } from './+server';

describe('/api/cron/process-sequences', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		loadEmailDeliveryHealthMock.mockResolvedValue({
			configured: true,
			provider: 'gmail',
			blockers: [],
			stoppedEnrollments: 0
		});
		processPendingSequenceSendsMock.mockResolvedValue({
			claimed: 1,
			sent: 1,
			skipped: 0,
			errors: 0
		});
	});

	it('returns success when all claimed sequence sends are handled', async () => {
		const response = await GET({
			request: new Request('https://9takes.com/api/cron/process-sequences', {
				headers: { authorization: 'Bearer cron-test-secret' }
			})
		} as never);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ processed: 1, sent: 1, errors: 0 });
		expect(processPendingSequenceSendsMock).toHaveBeenCalledWith(10);
	});

	it('returns a server error when one or more sequence sends fail', async () => {
		processPendingSequenceSendsMock.mockResolvedValue({
			claimed: 1,
			sent: 0,
			skipped: 0,
			errors: 1
		});

		const response = await GET({
			request: new Request('https://9takes.com/api/cron/process-sequences', {
				headers: { authorization: 'Bearer cron-test-secret' }
			})
		} as never);

		expect(response.status).toBe(500);
		expect(await response.json()).toMatchObject({ processed: 1, sent: 0, errors: 1 });
	});

	it('does not claim or exhaust enrollments while sender configuration is missing', async () => {
		loadEmailDeliveryHealthMock.mockResolvedValue({
			configured: false,
			provider: 'gmail',
			blockers: ['Mailing address required'],
			stoppedEnrollments: 4
		});
		const response = await GET({
			request: new Request('https://9takes.com/api/cron/process-sequences', {
				headers: { authorization: 'Bearer cron-test-secret' }
			})
		} as never);
		expect(response.status).toBe(503);
		expect(await response.json()).toMatchObject({
			processed: 0,
			delivery: { stoppedEnrollments: 4 }
		});
		expect(processPendingSequenceSendsMock).not.toHaveBeenCalled();
	});

	it('surfaces stopped enrollments even when there is no new work', async () => {
		loadEmailDeliveryHealthMock.mockResolvedValue({
			configured: true,
			provider: 'gmail',
			blockers: [],
			stoppedEnrollments: 4
		});
		processPendingSequenceSendsMock.mockResolvedValue({
			claimed: 0,
			sent: 0,
			skipped: 0,
			errors: 0
		});
		const response = await GET({
			request: new Request('https://9takes.com/api/cron/process-sequences', {
				headers: { authorization: 'Bearer cron-test-secret' }
			})
		} as never);
		expect(response.status).toBe(500);
		expect(await response.json()).toMatchObject({ delivery: { stoppedEnrollments: 4 } });
	});
});
