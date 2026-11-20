// src/lib/server/recoverySession.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createClientMock, signInWithPasswordMock, signOutMock } = vi.hoisted(() => ({
	createClientMock: vi.fn(),
	signInWithPasswordMock: vi.fn(),
	signOutMock: vi.fn()
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://project.example',
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key'
}));

vi.mock('@supabase/supabase-js', () => ({
	createClient: createClientMock
}));

import {
	RECOVERY_SESSION_MAX_AGE_SECONDS,
	hasRecentEmailLinkSignIn,
	isRecoverySession,
	verifyCurrentPassword
} from './recoverySession';

const NOW = 1_800_000_000;

describe('hasRecentEmailLinkSignIn', () => {
	it.each(['recovery', 'otp', 'magiclink'])('accepts a recent %s sign-in', (method) => {
		expect(hasRecentEmailLinkSignIn([{ method, timestamp: NOW - 120 }], NOW)).toBe(true);
	});

	it('accepts a recovery sign-in next to later entries', () => {
		expect(
			hasRecentEmailLinkSignIn(
				[
					{ method: 'password', timestamp: NOW - 90_000 },
					{ method: 'recovery', timestamp: NOW - 30 }
				],
				NOW
			)
		).toBe(true);
	});

	it.each(['password', 'email/signup', 'oauth', 'totp', 'anonymous'])(
		'rejects a %s sign-in',
		(method) => {
			expect(hasRecentEmailLinkSignIn([{ method, timestamp: NOW - 10 }], NOW)).toBe(false);
		}
	);

	it('rejects a recovery sign-in older than the window', () => {
		const timestamp = NOW - RECOVERY_SESSION_MAX_AGE_SECONDS - 1;
		expect(hasRecentEmailLinkSignIn([{ method: 'recovery', timestamp }], NOW)).toBe(false);
	});

	it('rejects a recovery sign-in dated in the future', () => {
		expect(hasRecentEmailLinkSignIn([{ method: 'recovery', timestamp: NOW + 3600 }], NOW)).toBe(
			false
		);
	});

	it.each([
		['a missing claim', undefined],
		['a non-array claim', 'recovery'],
		['entries without a time', ['recovery']],
		['entries with a text time', [{ method: 'recovery', timestamp: String(NOW) }]],
		['an empty list', []]
	])('rejects %s', (_label, amr) => {
		expect(hasRecentEmailLinkSignIn(amr, NOW)).toBe(false);
	});
});

describe('isRecoverySession', () => {
	const nowSeconds = () => Math.floor(Date.now() / 1000);

	it('reads the sign-in history from the verified claims', async () => {
		const getClaims = vi.fn().mockResolvedValue({
			data: { claims: { amr: [{ method: 'recovery', timestamp: nowSeconds() - 5 }] } },
			error: null
		});

		await expect(isRecoverySession({ getClaims } as any)).resolves.toBe(true);
	});

	it('is false for a password session', async () => {
		const getClaims = vi.fn().mockResolvedValue({
			data: { claims: { amr: [{ method: 'password', timestamp: nowSeconds() - 5 }] } },
			error: null
		});

		await expect(isRecoverySession({ getClaims } as any)).resolves.toBe(false);
	});

	it('is false when the claims cannot be verified', async () => {
		await expect(
			isRecoverySession({
				getClaims: vi.fn().mockResolvedValue({ data: null, error: { message: 'bad token' } })
			} as any)
		).resolves.toBe(false);
		await expect(
			isRecoverySession({ getClaims: vi.fn().mockRejectedValue(new Error('offline')) } as any)
		).resolves.toBe(false);
	});
});

describe('verifyCurrentPassword', () => {
	const input = { userId: 'user-1', email: 'user@example.com', password: 'OldPassword1' };

	beforeEach(() => {
		vi.clearAllMocks();
		signOutMock.mockResolvedValue({ error: null });
		createClientMock.mockReturnValue({
			auth: { signInWithPassword: signInWithPasswordMock, signOut: signOutMock }
		});
	});

	it('confirms the password on a client that stores no session, then ends that session', async () => {
		signInWithPasswordMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });

		await expect(verifyCurrentPassword(input)).resolves.toBe(true);
		expect(createClientMock).toHaveBeenCalledWith(
			'https://project.example',
			'publishable-key',
			expect.objectContaining({
				auth: expect.objectContaining({ persistSession: false, autoRefreshToken: false })
			})
		);
		expect(signInWithPasswordMock).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'OldPassword1'
		});
		expect(signOutMock).toHaveBeenCalledWith({ scope: 'local' });
	});

	it('rejects a wrong password', async () => {
		signInWithPasswordMock.mockResolvedValue({
			data: { user: null },
			error: { message: 'Invalid login credentials' }
		});

		await expect(verifyCurrentPassword(input)).resolves.toBe(false);
		expect(signOutMock).not.toHaveBeenCalled();
	});

	it('rejects a password that belongs to a different account', async () => {
		signInWithPasswordMock.mockResolvedValue({ data: { user: { id: 'user-2' } }, error: null });

		await expect(verifyCurrentPassword(input)).resolves.toBe(false);
		expect(signOutMock).toHaveBeenCalledWith({ scope: 'local' });
	});

	it('fails closed when the check cannot run', async () => {
		signInWithPasswordMock.mockRejectedValue(new Error('offline'));

		await expect(verifyCurrentPassword(input)).resolves.toBe(false);
	});
});
