// src/routes/login/login.page.server.spec.ts
import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	getAuthProtectionStateMock,
	recordAuthProtectionEventMock,
	verifyRecaptchaMock,
	loggerMocks
} = vi.hoisted(() => ({
	getAuthProtectionStateMock: vi.fn(),
	recordAuthProtectionEventMock: vi.fn(),
	verifyRecaptchaMock: vi.fn(),
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
	verifyRecaptcha: verifyRecaptchaMock
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { actions } from './+page.server';

function buildLoginRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('email', overrides.email ?? 'user@example.com');
	formData.append('password', overrides.password ?? 'Password1');
	formData.append('g-recaptcha-response', overrides['g-recaptcha-response'] ?? 'token');

	return new Request('http://localhost/login', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(signInResult?: { data?: { user?: { id: string } | null }; error?: unknown }) {
	const signInWithPassword = vi.fn().mockResolvedValue(
		signInResult ?? {
			data: { user: { id: 'user-123' } },
			error: null
		}
	);

	return {
		request: buildLoginRequest(),
		locals: {
			supabase: {
				auth: {
					signInWithPassword
				}
			}
		},
		getClientAddress: () => '127.0.0.1',
		_signIn: signInWithPassword
	};
}

describe('login action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getAuthProtectionStateMock.mockResolvedValue({
			captchaRequired: false,
			rateLimited: false
		});
		verifyRecaptchaMock.mockResolvedValue(true);
	});

	it('steps up to CAPTCHA after repeated failed logins', async () => {
		getAuthProtectionStateMock
			.mockResolvedValueOnce({
				captchaRequired: false,
				rateLimited: false
			})
			.mockResolvedValueOnce({
				captchaRequired: true,
				rateLimited: false
			});

		const event = buildEvent({
			data: { user: null },
			error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials')
		});

		const result = await actions.login(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({
				error: 'Invalid credentials',
				captchaRequired: true
			})
		});
		expect(verifyRecaptchaMock).not.toHaveBeenCalled();
	});

	it('blocks login attempts when the rate limit is exceeded', async () => {
		getAuthProtectionStateMock.mockResolvedValueOnce({
			captchaRequired: true,
			rateLimited: true
		});
		const event = buildEvent();

		const result = await actions.login(event as any);

		expect(result).toMatchObject({
			status: 429,
			data: expect.objectContaining({
				error: 'Too many login attempts. Please wait a few minutes and try again.',
				captchaRequired: true
			})
		});
		expect(event._signIn).not.toHaveBeenCalled();
	});

	it('requires a valid CAPTCHA before a risky login attempt can proceed', async () => {
		getAuthProtectionStateMock.mockResolvedValueOnce({
			captchaRequired: true,
			rateLimited: false
		});
		verifyRecaptchaMock.mockResolvedValueOnce(false);
		const event = buildEvent();

		const result = await actions.login(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({
				error: 'Please complete the CAPTCHA and try again.',
				captchaRequired: true
			})
		});
		expect(event._signIn).not.toHaveBeenCalled();
	});
});
