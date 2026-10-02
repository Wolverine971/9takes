// src/routes/forgotPassword/forgotPassword.page.server.spec.ts
import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	getAuthProtectionStateMock,
	recordAuthProtectionEventMock,
	verifyRecaptchaMock,
	isHoneypotTriggeredMock,
	loggerMocks
} = vi.hoisted(() => ({
	getAuthProtectionStateMock: vi.fn(),
	recordAuthProtectionEventMock: vi.fn(),
	verifyRecaptchaMock: vi.fn(),
	isHoneypotTriggeredMock: vi.fn(),
	loggerMocks: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
}));

vi.mock('$lib/server/authProtection', () => ({
	getAuthProtectionState: getAuthProtectionStateMock,
	recordAuthProtectionEvent: recordAuthProtectionEventMock
}));

vi.mock('$lib/utils/recaptcha', () => ({
	verifyRecaptcha: verifyRecaptchaMock,
	isHoneypotTriggered: isHoneypotTriggeredMock
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { actions } from './+page.server';

const RESET_REQUESTED =
	'If that email has a 9takes account, a reset link is on its way. Check your inbox and spam folder.';

function buildForgotPasswordRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('email', overrides.email ?? 'user@example.com');
	formData.append('form_extra', overrides.form_extra ?? '');
	formData.append('g-recaptcha-response', overrides['g-recaptcha-response'] ?? 'token');

	return new Request('http://localhost/forgotPassword', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(
	resetResult?: { error?: unknown },
	requestOverrides: Record<string, string> = {}
) {
	const resetPasswordForEmail = vi.fn().mockResolvedValue(
		resetResult ?? {
			error: null
		}
	);

	return {
		request: buildForgotPasswordRequest(requestOverrides),
		locals: {
			supabase: {
				auth: {
					resetPasswordForEmail
				}
			}
		},
		url: new URL('http://localhost/forgotPassword'),
		getClientAddress: () => '127.0.0.1',
		_resetPasswordForEmail: resetPasswordForEmail
	};
}

describe('forgot password action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getAuthProtectionStateMock.mockResolvedValue({
			captchaRequired: true,
			rateLimited: false
		});
		verifyRecaptchaMock.mockResolvedValue(true);
		isHoneypotTriggeredMock.mockReturnValue(false);
	});

	it('keeps password reset working when under the abuse threshold', async () => {
		const event = buildEvent();

		const result = await actions.forgotPass(event as any);

		expect(result).toEqual({
			success: true,
			message: RESET_REQUESTED
		});
		expect(event._resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
			redirectTo: 'http://localhost/resetPassword'
		});
	});

	it('returns a 429 when password reset requests are being flooded', async () => {
		getAuthProtectionStateMock.mockResolvedValueOnce({
			captchaRequired: true,
			rateLimited: true
		});
		const event = buildEvent();

		const result = await actions.forgotPass(event as any);

		expect(result).toMatchObject({
			status: 429,
			data: expect.objectContaining({
				error: 'Too many password reset requests. Please try again later.'
			})
		});
		expect(event._resetPasswordForEmail).not.toHaveBeenCalled();
	});

	it('short-circuits reset emails when the honeypot field is filled', async () => {
		isHoneypotTriggeredMock.mockImplementation((value: string | null) => Boolean(value?.trim()));
		const event = buildEvent(undefined, { form_extra: 'bot filled this' });

		const result = await actions.forgotPass(event as any);

		expect(result).toEqual({
			success: true,
			message: RESET_REQUESTED
		});
		expect(event._resetPasswordForEmail).not.toHaveBeenCalled();
		expect(verifyRecaptchaMock).not.toHaveBeenCalled();
		expect(recordAuthProtectionEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				flow: 'forgot_password',
				outcome: 'honeypot',
				identifier: 'user@example.com'
			})
		);
	});

	it('records a failed captcha with whether a token was sent at all', async () => {
		verifyRecaptchaMock.mockResolvedValueOnce(false);
		const event = buildEvent(undefined, { 'g-recaptcha-response': '' });

		const result = await actions.forgotPass(event as any);

		expect(result).toMatchObject({ status: 400 });
		expect(event._resetPasswordForEmail).not.toHaveBeenCalled();
		expect(recordAuthProtectionEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'captcha_failed',
				identifier: 'user@example.com',
				context: { tokenPresent: false }
			})
		);
	});

	it('logs an invalid email instead of failing silently', async () => {
		const event = buildEvent(undefined, { email: 'name@' });

		const result = await actions.forgotPass(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({ error: 'Invalid email address' })
		});
		expect(event._resetPasswordForEmail).not.toHaveBeenCalled();
		expect(recordAuthProtectionEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				flow: 'forgot_password',
				outcome: 'failed',
				context: { reason: 'invalid_email' }
			})
		);
	});

	it('accepts an email with stray spaces and sends the normalized address', async () => {
		const event = buildEvent(undefined, { email: '  User@Example.com ' });

		const result = await actions.forgotPass(event as any);

		expect(result).toMatchObject({ success: true });
		expect(event._resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
			redirectTo: 'http://localhost/resetPassword'
		});
	});

	it('surfaces and records a Supabase email rate limit instead of a generic error', async () => {
		const event = buildEvent({
			error: new AuthApiError('email rate limit exceeded', 429, 'over_email_send_rate_limit')
		});

		const result = await actions.forgotPass(event as any);

		expect(result).toMatchObject({
			status: 429,
			data: expect.objectContaining({
				error: expect.stringContaining('Wait a few minutes')
			})
		});
		expect(loggerMocks.error).toHaveBeenCalledWith(
			'resetPasswordForEmail failed',
			expect.any(AuthApiError),
			{ status: 429, code: 'over_email_send_rate_limit' }
		);
		expect(recordAuthProtectionEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'failed',
				context: { reason: 'supabase_error', status: 429, code: 'over_email_send_rate_limit' }
			})
		);
		expect(recordAuthProtectionEventMock).not.toHaveBeenCalledWith(
			expect.objectContaining({ outcome: 'success' })
		);
	});

	it('logs other Supabase failures and never reports success', async () => {
		const event = buildEvent({
			error: new AuthApiError('Error sending recovery email', 500, 'unexpected_failure')
		});

		const result = await actions.forgotPass(event as any);

		expect(result).toMatchObject({
			status: 500,
			data: expect.objectContaining({ error: 'Server error. Please try again later.' })
		});
		expect(loggerMocks.error).toHaveBeenCalledTimes(1);
		expect(recordAuthProtectionEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'failed',
				context: { reason: 'supabase_error', status: 500, code: 'unexpected_failure' }
			})
		);
	});
});
