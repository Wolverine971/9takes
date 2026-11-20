// src/lib/server/authProtection.spec.ts
import { describe, expect, it, vi } from 'vitest';

const { loggerErrorMock, fromMock } = vi.hoisted(() => ({
	loggerErrorMock: vi.fn(),
	fromMock: vi.fn()
}));

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({
		from: fromMock
	})
}));

vi.mock('$lib/utils/logger', () => ({
	logger: {
		error: loggerErrorMock
	}
}));

import { getAuthProtectionState } from './authProtection';

describe('authProtection', () => {
	it('fails closed if the abuse counter is unavailable', async () => {
		fromMock.mockImplementation(() => {
			throw new Error('Unavailable');
		});
		const result = await getAuthProtectionState({ flow: 'login', ipAddress: '192.0.2.1' });
		expect(result).toEqual({ captchaRequired: true, rateLimited: true, retryAfterSeconds: 60 });
		loggerErrorMock.mockClear();
	});
	it('does not count rate_limited outcomes toward fresh threshold checks', async () => {
		fromMock.mockImplementation(() => {
			const builder = {
				select: vi.fn(() => builder),
				eq: vi.fn(() => builder),
				gte: vi.fn(() => builder),
				in: vi.fn((_column: string, outcomes: string[]) => {
					return Promise.resolve({
						count: outcomes.includes('rate_limited') ? 999 : 0,
						error: null
					});
				})
			};
			return builder;
		});

		const result = await getAuthProtectionState({
			flow: 'login',
			ipAddress: '127.0.0.1',
			identifier: 'user@example.com'
		});

		expect(result.rateLimited).toBe(false);
		expect(result.captchaRequired).toBe(false);
		expect(loggerErrorMock).not.toHaveBeenCalled();
	});

	/** Counter stub: `ip` failures for the address, `identifier` failures for the email. */
	function mockRecentFailures(counts: { ip: number; identifier: number }) {
		fromMock.mockImplementation(() => {
			let column = '';
			const builder = {
				select: vi.fn(() => builder),
				eq: vi.fn((name: string) => {
					if (name === 'ip_hash' || name === 'identifier_hash') column = name;
					return builder;
				}),
				gte: vi.fn(() => builder),
				in: vi.fn(() =>
					Promise.resolve({
						count: column === 'ip_hash' ? counts.ip : counts.identifier,
						error: null
					})
				)
			};
			return builder;
		});
	}

	it('requires a CAPTCHA, never a block, however many logins failed for one email', async () => {
		mockRecentFailures({ ip: 0, identifier: 500 });

		const result = await getAuthProtectionState({
			flow: 'login',
			ipAddress: '192.0.2.10',
			identifier: 'user@example.com'
		});

		expect(result.rateLimited).toBe(false);
		expect(result.captchaRequired).toBe(true);
	});

	it('blocks an address after repeated failed logins', async () => {
		mockRecentFailures({ ip: 10, identifier: 0 });

		const result = await getAuthProtectionState({
			flow: 'login',
			ipAddress: '192.0.2.10',
			identifier: 'user@example.com'
		});

		expect(result.rateLimited).toBe(true);
	});

	it('still caps registrations and reset emails per email address', async () => {
		mockRecentFailures({ ip: 0, identifier: 3 });

		for (const flow of ['register', 'forgot_password'] as const) {
			const result = await getAuthProtectionState({
				flow,
				ipAddress: '192.0.2.10',
				identifier: 'user@example.com'
			});
			expect(result.rateLimited).toBe(true);
		}
	});
});
