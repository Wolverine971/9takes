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
});
