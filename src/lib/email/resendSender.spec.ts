// src/lib/email/resendSender.spec.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { resendSend, privateEnv } = vi.hoisted(() => ({
	resendSend: vi.fn(),
	privateEnv: {
		EMAIL_MARKETING_PROVIDER: 'resend',
		RESEND_API_KEY: 're_test',
		RESEND_MARKETING_FROM: 'DJ at 9takes <usersup@9takes.com>'
	}
}));

vi.mock('$env/dynamic/private', () => ({ env: privateEnv }));
vi.mock('resend', () => ({
	Resend: class MockResend {
		emails = { send: resendSend };
	}
}));

import { isResendMarketingProviderEnabled, sendMarketingEmailWithResend } from './resendSender';

const request = {
	to: 'delivered@resend.dev',
	subject: 'Test',
	html: '<p>Test</p>',
	text: 'Test',
	idempotencyKey: 'email-send/550e8400-e29b-41d4-a716-446655440000',
	emailSendId: '550e8400-e29b-41d4-a716-446655440000'
};

describe('Resend marketing provider', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		privateEnv.EMAIL_MARKETING_PROVIDER = 'resend';
		privateEnv.RESEND_API_KEY = 're_test';
		privateEnv.RESEND_MARKETING_FROM = 'DJ at 9takes <usersup@9takes.com>';
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('sends with the stable idempotency key and configured marketing subdomain', async () => {
		resendSend.mockResolvedValue({ data: { id: 'resend-message-1' }, error: null });

		expect(isResendMarketingProviderEnabled()).toBe(true);
		await expect(sendMarketingEmailWithResend(request)).resolves.toEqual({
			success: true,
			messageId: 'resend-message-1'
		});
		expect(resendSend).toHaveBeenCalledWith(
			expect.objectContaining({
				from: 'DJ at 9takes <usersup@9takes.com>',
				to: ['delivered@resend.dev'],
				tags: expect.arrayContaining([{ name: 'email_send_id', value: request.emailSendId }])
			}),
			{ idempotencyKey: request.idempotencyKey }
		);
	});

	it('fails before an API request when provider configuration is incomplete', async () => {
		privateEnv.RESEND_API_KEY = '';

		await expect(sendMarketingEmailWithResend(request)).resolves.toMatchObject({
			success: false,
			name: 'configuration_error',
			retryable: false
		});
		expect(resendSend).not.toHaveBeenCalled();
	});

	it('retries transient provider failures without changing the idempotency key', async () => {
		vi.useFakeTimers();
		resendSend
			.mockResolvedValueOnce({
				data: null,
				error: { statusCode: 429, name: 'rate_limit_exceeded', message: 'Slow down' }
			})
			.mockResolvedValueOnce({
				data: null,
				error: { statusCode: 503, name: 'api_error', message: 'Unavailable' }
			})
			.mockResolvedValueOnce({ data: { id: 'resend-message-1' }, error: null });

		const resultPromise = sendMarketingEmailWithResend(request);
		await vi.runAllTimersAsync();

		await expect(resultPromise).resolves.toEqual({
			success: true,
			messageId: 'resend-message-1'
		});
		expect(resendSend).toHaveBeenCalledTimes(3);
		for (const call of resendSend.mock.calls) {
			expect(call[1]).toEqual({ idempotencyKey: request.idempotencyKey });
		}
	});
});
