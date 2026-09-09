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

import { actions, load } from './+page.server';

function buildLoginRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('email', overrides.email ?? 'user@example.com');
	formData.append('password', overrides.password ?? 'Password1');
	formData.append('g-recaptcha-response', overrides['g-recaptcha-response'] ?? 'token');
	if (overrides.returnTo) formData.append('returnTo', overrides.returnTo);

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

	it('returns an email recipient to their account after successful login', async () => {
		const event = buildEvent();
		event.request = buildLoginRequest({ returnTo: '/account?utm_source=email' });
		await expect(actions.login(event as any)).rejects.toMatchObject({
			status: 303,
			location: '/account?utm_source=email'
		});
	});

	it.each([
		'https://evil.example/account',
		'//evil.example/account',
		'/account/../logout',
		'/account\\evil',
		'/login',
		'/account\n'
	])('rejects an unsafe return destination: %s', async (returnTo) => {
		const event = buildEvent();
		event.request = buildLoginRequest({ returnTo });
		await expect(actions.login(event as any)).rejects.toMatchObject({
			status: 303,
			location: '/questions'
		});
	});

	it('retains the account destination when showing the login form again', async () => {
		const event = {
			...buildEvent(),
			url: new URL('http://localhost/login?/login&returnTo=%2Faccount%3Futm_source%3Demail')
		};
		await expect(load(event as any)).resolves.toMatchObject({
			returnTo: '/account?utm_source=email'
		});
	});

	it('returns an already signed-in visitor directly to their account', async () => {
		const event = buildEvent();
		await expect(
			load({
				...event,
				url: new URL('http://localhost/login?returnTo=%2Faccount'),
				locals: { ...event.locals, user: { id: 'user-123' } }
			} as any)
		).rejects.toMatchObject({ status: 303, location: '/account' });
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
