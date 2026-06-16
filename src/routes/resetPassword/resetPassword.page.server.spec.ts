// src/routes/resetPassword/resetPassword.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { actions } from './+page.server';

const VALID_PASSWORD = 'NewPassword1';

function buildResetPasswordRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('password', overrides.password ?? VALID_PASSWORD);
	if (overrides.confirmPassword !== undefined) {
		formData.append('confirmPassword', overrides.confirmPassword);
	}

	return new Request('http://localhost/resetPassword', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(
	request: Request,
	updateResult?: { data?: unknown; error?: { message: string } | null }
) {
	const updateUser = vi.fn().mockResolvedValue(
		updateResult ?? {
			data: {},
			error: null
		}
	);

	return {
		request,
		locals: {
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
	});
});
