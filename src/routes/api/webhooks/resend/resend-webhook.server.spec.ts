// src/routes/api/webhooks/resend/resend-webhook.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyMock, rpcMock, getSupabaseAdminClientMock, privateEnv } = vi.hoisted(() => ({
	verifyMock: vi.fn(),
	rpcMock: vi.fn(),
	getSupabaseAdminClientMock: vi.fn(),
	privateEnv: {
		RESEND_API_KEY: 're_test',
		RESEND_WEBHOOK_SECRET: 'whsec_test'
	}
}));

vi.mock('$env/dynamic/private', () => ({ env: privateEnv }));
vi.mock('resend', () => ({
	Resend: class MockResend {
		webhooks = { verify: verifyMock };
	}
}));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: getSupabaseAdminClientMock
}));

import { POST } from './+server';

const EVENT = {
	type: 'email.bounced',
	created_at: '2026-09-01T20:00:00.000Z',
	data: {
		email_id: 'resend-message-1',
		message_id: 'smtp-message-1',
		created_at: '2026-09-01T19:59:59.000Z',
		from: 'DJ at 9takes <usersup@9takes.com>',
		to: ['bounced@resend.dev'],
		subject: 'Test',
		bounce: { message: 'Mailbox unavailable', subType: 'NoEmail', type: 'Permanent' }
	}
} as const;

function requestFor(body = JSON.stringify(EVENT)) {
	return new Request('https://9takes.com/api/webhooks/resend', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'svix-id': 'msg_webhook_1',
			'svix-timestamp': '1788292800',
			'svix-signature': 'v1,test'
		},
		body
	});
}

describe('POST /api/webhooks/resend', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		verifyMock.mockReturnValue(EVENT);
		rpcMock.mockResolvedValue({ data: { status: 'processed' }, error: null });
		getSupabaseAdminClientMock.mockReturnValue({ rpc: rpcMock });
	});

	it('verifies the raw payload and forwards the provider event idempotently', async () => {
		const rawPayload = JSON.stringify(EVENT);
		const response = await POST({ request: requestFor(rawPayload) } as never);

		expect(response.status).toBe(200);
		expect(verifyMock).toHaveBeenCalledWith({
			payload: rawPayload,
			headers: {
				id: 'msg_webhook_1',
				timestamp: '1788292800',
				signature: 'v1,test'
			},
			webhookSecret: 'whsec_test'
		});
		expect(rpcMock).toHaveBeenCalledWith('process_email_provider_event', {
			p_provider: 'resend',
			p_event_id: 'msg_webhook_1',
			p_provider_message_id: 'resend-message-1',
			p_event_type: 'email.bounced',
			p_occurred_at: '2026-09-01T20:00:00.000Z',
			p_payload: EVENT
		});
	});

	it('rejects invalid signatures before touching the database', async () => {
		verifyMock.mockImplementation(() => {
			throw new Error('Invalid signature');
		});

		await expect(POST({ request: requestFor() } as never)).rejects.toMatchObject({ status: 400 });
		expect(rpcMock).not.toHaveBeenCalled();
	});
});
