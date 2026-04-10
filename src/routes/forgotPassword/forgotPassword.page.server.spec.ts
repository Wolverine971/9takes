// src/routes/forgotPassword/forgotPassword.page.server.spec.ts
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

function buildForgotPasswordRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('email', overrides.email ?? 'user@example.com');
	formData.append('company', overrides.company ?? '');
	formData.append('g-recaptcha-response', overrides['g-recaptcha-response'] ?? 'token');

	return new Request('http://localhost/forgotPassword', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(resetResult?: { error?: unknown }) {
	const resetPasswordForEmail = vi.fn().mockResolvedValue(
		resetResult ?? {
			error: null
		}
	);

	return {
		request: buildForgotPasswordRequest(),
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
			message: 'Password reset email sent. Please check your inbox.'
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
});
