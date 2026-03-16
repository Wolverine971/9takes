import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyRecaptchaMock, isHoneypotTriggeredMock, safelyEnrollMock, loggerMocks } =
	vi.hoisted(() => ({
		verifyRecaptchaMock: vi.fn(),
		isHoneypotTriggeredMock: vi.fn(),
		safelyEnrollMock: vi.fn(),
		loggerMocks: {
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn()
		}
	}));

vi.mock('$lib/utils/recaptcha', () => ({
	verifyRecaptcha: verifyRecaptchaMock,
	isHoneypotTriggered: isHoneypotTriggeredMock
}));

vi.mock('$lib/server/welcomeSequenceGuards', () => ({
	safelyEnrollUserInWelcomeSequence: safelyEnrollMock
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { actions } from './+page.server';

function buildRegisterRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('email', overrides.email ?? 'user@example.com');
	formData.append('password', overrides.password ?? 'Password1');
	formData.append('website', overrides.website ?? '');
	formData.append('g-recaptcha-response', overrides['g-recaptcha-response'] ?? 'token');

	return new Request('http://localhost/register', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(signUpResult?: {
	data?: { user?: { id: string } | null };
	error?: unknown;
}) {
	const signUp = vi.fn().mockResolvedValue(
		signUpResult ?? {
			data: { user: { id: 'user-123' } },
			error: null
		}
	);

	return {
		request: buildRegisterRequest(),
		locals: {
			supabase: {
				auth: {
					signUp
				}
			}
		},
		getClientAddress: () => '127.0.0.1',
		_signUp: signUp
	};
}

describe('register action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		verifyRecaptchaMock.mockResolvedValue(true);
		isHoneypotTriggeredMock.mockReturnValue(false);
		safelyEnrollMock.mockResolvedValue(true);
	});

	it('keeps successful registration working while enrolling in the welcome sequence', async () => {
		const event = buildEvent();

		const result = await actions.register(event as any);

		expect(result).toEqual({ success: true });
		expect(event._signUp).toHaveBeenCalledTimes(1);
		expect(safelyEnrollMock).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: 'user-123',
				email: 'user@example.com'
			})
		);
	});

	it('still returns success when welcome-sequence enrollment fails internally', async () => {
		safelyEnrollMock.mockResolvedValue(false);
		const event = buildEvent();

		const result = await actions.register(event as any);

		expect(result).toEqual({ success: true });
		expect(event._signUp).toHaveBeenCalledTimes(1);
		expect(safelyEnrollMock).toHaveBeenCalledTimes(1);
	});
});
