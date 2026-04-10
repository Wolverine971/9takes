// src/routes/resetPassword/resetPassword.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { actions } from './+page.server';

function buildResetPasswordRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('password', overrides.password ?? 'new-password');

	return new Request('http://localhost/resetPassword', {
		method: 'POST',
		body: formData
	});
}

function buildEvent(updateResult?: { data?: unknown; error?: { message: string } | null }) {
	const updateUser = vi.fn().mockResolvedValue(
		updateResult ?? {
			data: {},
			error: null
		}
	);

	return {
		request: buildResetPasswordRequest(),
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
		const event = buildEvent();

		const result = await actions.resetPass(event as any);

		expect(result).toEqual({
			success: true,
			message: 'Password has been reset successfully!'
		});
		expect(event._updateUser).toHaveBeenCalledWith({
			password: 'new-password'
		});
	});

	it('rejects passwords that are too short', async () => {
		const event = {
			...buildEvent(),
			request: buildResetPasswordRequest({ password: 'short' })
		};

		const result = await actions.resetPass(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({
				error: 'Password must be at least 6 characters long'
			})
		});
		expect(event._updateUser).not.toHaveBeenCalled();
	});
});
