// src/routes/api/cron/send-scheduled-emails/send-scheduled-emails.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock, fromMock, sendBatchEmailsMock, getSupabaseAdminClientMock } = vi.hoisted(() => ({
	rpcMock: vi.fn(),
	fromMock: vi.fn(),
	sendBatchEmailsMock: vi.fn(),
	getSupabaseAdminClientMock: vi.fn()
}));

vi.mock('$env/static/private', () => ({ CRON_SECRET: 'cron-secret' }));
vi.mock('$lib/email/sender', () => ({ sendBatchEmails: sendBatchEmailsMock }));
vi.mock('$lib/email/suppression', () => ({
	getSuppressedEmailSet: vi.fn().mockResolvedValue(new Set()),
	normalizeEmail: (email: string) => email.trim().toLowerCase()
}));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: getSupabaseAdminClientMock
}));

import { GET } from './+server';

describe('scheduled email cron', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		rpcMock.mockResolvedValue({
			data: [
				{
					id: '30000000-0000-4000-8000-000000000001',
					recipients: [
						{
							id: 'recipient-1',
							email: 'person@example.com',
							source: 'signups',
							source_id: null
						}
					],
					subject: 'Scheduled message',
					html_content: '<p>Body</p>',
					campaign_id: null,
					created_by: null,
					claim_token: '40000000-0000-4000-8000-000000000001'
				}
			],
			error: null
		});

		fromMock.mockImplementation(() => ({
			update: vi.fn(() => ({
				eq: vi.fn(() => ({
					eq: vi.fn().mockResolvedValue({ error: null })
				}))
			}))
		}));
		getSupabaseAdminClientMock.mockReturnValue({ rpc: rpcMock, from: fromMock });
		sendBatchEmailsMock.mockResolvedValue({
			sent: 1,
			failed: 0,
			results: [{ email: 'person@example.com', success: true }]
		});
	});

	it('uses an atomic claim and a stable recipient idempotency scope', async () => {
		const request = new Request('https://9takes.com/api/cron/send-scheduled-emails', {
			headers: { authorization: 'Bearer cron-secret' }
		});

		const response = await GET({ request } as never);

		expect(response.status).toBe(200);
		expect(rpcMock).toHaveBeenCalledWith('claim_due_scheduled_emails', { p_limit: 5 });
		expect(sendBatchEmailsMock).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				idempotencyScope: 'scheduled-email/30000000-0000-4000-8000-000000000001',
				emailKind: 'marketing',
				recipients: [expect.objectContaining({ id: 'recipient-1', source_id: 'recipient-1' })]
			})
		);
	});
});
