// src/routes/resetPassword/resetPassword.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { isRecoverySessionMock, verifyCurrentPasswordMock, consumeApiRateLimitMock } = vi.hoisted(
	() => ({
		isRecoverySessionMock: vi.fn(),
		verifyCurrentPasswordMock: vi.fn(),
		consumeApiRateLimitMock: vi.fn()
	})
);

vi.mock('$lib/server/recoverySession', () => ({
	isRecoverySession: isRecoverySessionMock,
	verifyCurrentPassword: verifyCurrentPasswordMock
}));

vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({ userId }: { userId: string }) => `user:${userId}`
}));

vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

import { actions, load } from './+page.server';

const VALID_PASSWORD = 'NewPassword1';

function buildResetPasswordRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('password', overrides.password ?? VALID_PASSWORD);
	if (overrides.confirmPassword !== undefined) {
		formData.append('confirmPassword', overrides.confirmPassword);
	}
	if (overrides.currentPassword !== undefined) {
		formData.append('currentPassword', overrides.currentPassword);
	}

	return new Request('http://localhost/resetPassword', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(
	request: Request,
	updateResult?: { data?: unknown; error?: { message: string } | null },
	session: { user: { id: string; email?: string } } | null = {
		user: { id: 'user-1', email: 'user@example.com' }
	}
) {
	const updateUser = vi.fn().mockResolvedValue(
		updateResult ?? {
			data: {},
			error: null
		}
	);

	return {
		request,
		getClientAddress: () => '127.0.0.1',
		locals: {
			session,
			supabase: {
				auth: {
					updateUser
				}
			}
		},
		_updateUser: updateUser
	};
}

describe('reset password action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		isRecoverySessionMock.mockResolvedValue(true);
		verifyCurrentPasswordMock.mockResolvedValue(true);
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: true,
			retryAfterSeconds: 900,
			degraded: false
		});
	});

	it('updates the password when the reset token session is valid', async () => {
		const event = buildEvent(buildResetPasswordRequest());

		const result = await actions.resetPass(event as any);

		expect(result).toEqual({
			success: true,
			message: 'Password has been reset successfully!'
		});
		expect(event._updateUser).toHaveBeenCalledWith({
			password: VALID_PASSWORD
		});
	});

	it('rejects passwords that are too short', async () => {
		const event = buildEvent(buildResetPasswordRequest({ password: 'Short1' }));

		const result = await actions.resetPass(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({
				error:
					'Password must be at least 8 characters with an uppercase letter, a lowercase letter, and a number'
			})
		});
		expect(event._updateUser).not.toHaveBeenCalled();
	});

	it('rejects passwords missing the required character classes', async () => {
		const event = buildEvent(buildResetPasswordRequest({ password: 'alllowercase' }));

		const result = await actions.resetPass(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({
				error:
					'Password must be at least 8 characters with an uppercase letter, a lowercase letter, and a number'
			})
		});
		expect(event._updateUser).not.toHaveBeenCalled();
	});

	it('rejects when the confirmation password does not match', async () => {
		const event = buildEvent(
			buildResetPasswordRequest({ password: VALID_PASSWORD, confirmPassword: 'Different1' })
		);

		const result = await actions.resetPass(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({ error: 'Passwords do not match' })
		});
		expect(event._updateUser).not.toHaveBeenCalled();
	});

	it('surfaces a friendly error when Supabase rejects the update', async () => {
		const event = buildEvent(buildResetPasswordRequest(), {
			data: null,
			error: { message: 'Auth session missing!' }
		});

		const result = await actions.resetPass(event as any);

		expect(result).toMatchObject({
			status: 500,
			data: expect.objectContaining({
				error: 'Failed to reset password. The reset link may have expired.'
			})
		});
		expect(JSON.stringify(result)).not.toContain('Auth session missing');
	});

	it('does not ask a reset-link session for the current password', async () => {
		const event = buildEvent(buildResetPasswordRequest());

		await actions.resetPass(event as any);

		expect(verifyCurrentPasswordMock).not.toHaveBeenCalled();
		expect(consumeApiRateLimitMock).not.toHaveBeenCalled();
	});

	it('rejects a request with no session', async () => {
		const event = buildEvent(buildResetPasswordRequest(), undefined, null);

		const result = await actions.resetPass(event as any);

		expect(result).toMatchObject({ status: 401 });
		expect(event._updateUser).not.toHaveBeenCalled();
	});

	describe('for a session that did not come from a reset link', () => {
		beforeEach(() => {
			isRecoverySessionMock.mockResolvedValue(false);
		});

		it('asks for the current password', async () => {
			const event = buildEvent(buildResetPasswordRequest());

			const result = await actions.resetPass(event as any);

			expect(result).toMatchObject({
				status: 400,
				data: expect.objectContaining({ requiresCurrentPassword: true })
			});
			expect(verifyCurrentPasswordMock).not.toHaveBeenCalled();
			expect(event._updateUser).not.toHaveBeenCalled();
		});

		it('rejects a wrong current password', async () => {
			verifyCurrentPasswordMock.mockResolvedValue(false);
			const event = buildEvent(buildResetPasswordRequest({ currentPassword: 'WrongOne1' }));

			const result = await actions.resetPass(event as any);

			expect(verifyCurrentPasswordMock).toHaveBeenCalledWith({
				userId: 'user-1',
				email: 'user@example.com',
				password: 'WrongOne1'
			});
			expect(result).toMatchObject({
				status: 400,
				data: expect.objectContaining({
					error: 'Your current password is incorrect.',
					requiresCurrentPassword: true
				})
			});
			expect(event._updateUser).not.toHaveBeenCalled();
		});

		it('limits how often the current password can be tried', async () => {
			consumeApiRateLimitMock.mockResolvedValue({
				allowed: false,
				retryAfterSeconds: 900,
				degraded: false
			});
			const event = buildEvent(buildResetPasswordRequest({ currentPassword: 'OldPassword1' }));

			const result = await actions.resetPass(event as any);

			expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
				bucket: 'password_change',
				subject: 'user:user-1'
			});
			expect(result).toMatchObject({ status: 429 });
			expect(verifyCurrentPasswordMock).not.toHaveBeenCalled();
			expect(event._updateUser).not.toHaveBeenCalled();
		});

		it('updates the password once the current one is confirmed', async () => {
			const event = buildEvent(buildResetPasswordRequest({ currentPassword: 'OldPassword1' }));

			const result = await actions.resetPass(event as any);

			expect(result).toMatchObject({ success: true });
			expect(event._updateUser).toHaveBeenCalledWith({
				password: VALID_PASSWORD,
				current_password: 'OldPassword1'
			});
		});
	});
});

describe('reset password load', () => {
	function buildLoadEvent(session: { user: { id: string } } | null, search = '') {
		return {
			url: new URL(`http://localhost/resetPassword${search}`),
			locals: {
				safeGetSession: vi.fn().mockResolvedValue({ session, user: session?.user ?? null }),
				supabase: { auth: {} }
			}
		};
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('shows the plain new-password form to a reset-link session', async () => {
		isRecoverySessionMock.mockResolvedValue(true);

		await expect(load(buildLoadEvent({ user: { id: 'user-1' } }) as any)).resolves.toMatchObject({
			linkError: false,
			requiresCurrentPassword: false
		});
	});

	it('asks any other signed-in session for the current password', async () => {
		isRecoverySessionMock.mockResolvedValue(false);

		await expect(load(buildLoadEvent({ user: { id: 'user-1' } }) as any)).resolves.toMatchObject({
			linkError: false,
			requiresCurrentPassword: true
		});
	});

	it('reports a dead link when there is no session', async () => {
		await expect(load(buildLoadEvent(null) as any)).resolves.toMatchObject({
			linkError: true,
			requiresCurrentPassword: false
		});
		expect(isRecoverySessionMock).not.toHaveBeenCalled();
	});
});
