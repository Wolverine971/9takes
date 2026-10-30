// src/routes/api/signups/signups.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	adminSupabaseMock,
	sendEmailWithTrackingMock,
	loggerMocks,
	getNewsletterSignupProtectionStateMock,
	recordNewsletterSignupSecurityEventMock,
	captureEmailSignupCompletedMock
} = vi.hoisted(() => ({
	adminSupabaseMock: {
		from: vi.fn(),
		rpc: vi.fn()
	},
	sendEmailWithTrackingMock: vi.fn(),
	loggerMocks: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	},
	getNewsletterSignupProtectionStateMock: vi.fn(),
	recordNewsletterSignupSecurityEventMock: vi.fn(),
	captureEmailSignupCompletedMock: vi.fn()
}));

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: vi.fn(() => adminSupabaseMock)
}));

vi.mock('$lib/email/sender', () => ({
	sendEmailWithTracking: sendEmailWithTrackingMock
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

vi.mock('$lib/server/newsletterSignupProtection', () => ({
	getNewsletterSignupProtectionState: getNewsletterSignupProtectionStateMock,
	recordNewsletterSignupSecurityEvent: recordNewsletterSignupSecurityEventMock
}));

vi.mock('../../../emails', () => ({
	signupWelcomeEmail: vi.fn(() => '<p>welcome</p>')
}));

vi.mock('$lib/server/posthogCapture', () => ({
	captureEmailSignupCompleted: captureEmailSignupCompletedMock
}));

import { POST } from './+server';

function buildRequest(
	email: string,
	options: { honeypot?: string; timeToken?: string; userAgent?: string; analytics?: unknown } = {}
) {
	const formData = new FormData();
	formData.append('email', email);
	if (options.analytics) formData.append('analytics', JSON.stringify(options.analytics));
	if (options.honeypot !== undefined) {
		formData.append('form_extra', options.honeypot);
	}
	if (options.timeToken !== undefined) {
		formData.append('_timeToken', options.timeToken);
	}

	return new Request('http://localhost/api/signups', {
		method: 'POST',
		body: formData,
		headers: {
			'user-agent':
				options.userAgent ??
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36'
		}
	});
}

function buildSignupTable(options?: {
	existing?: { id: number } | null;
	insertError?: unknown;
	insertedId?: number;
}) {
	const maybeSingle = vi.fn().mockResolvedValue({
		data: options?.existing ?? null,
		error: null
	});
	const duplicateQuery = {
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		maybeSingle
	};

	const single = vi.fn().mockResolvedValue({
		data: options?.insertError ? null : { id: options?.insertedId ?? 123 },
		error: options?.insertError ?? null
	});
	const insertQuery = {
		insert: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		single
	};

	adminSupabaseMock.from.mockImplementation((table: string) => {
		if (table !== 'signups') {
			throw new Error(`Unexpected admin table: ${table}`);
		}

		if (adminSupabaseMock.from.mock.calls.length === 1) {
			return duplicateQuery;
		}

		return insertQuery;
	});

	return { duplicateQuery, insertQuery };
}

function buildEvent(
	email = 'NewUser@Example.com',
	options: { honeypot?: string; timeToken?: string; userAgent?: string; analytics?: unknown } = {}
) {
	return {
		request: buildRequest(email, options),
		cookies: {
			get: vi.fn((name: string) => (name === '9tfingerprint' ? 'visitor-123' : undefined))
		},
		getClientAddress: vi.fn(() => '127.0.0.1')
	};
}

describe('POST /api/signups', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		captureEmailSignupCompletedMock.mockResolvedValue(true);
		adminSupabaseMock.rpc.mockResolvedValue({ data: true, error: null });
		sendEmailWithTrackingMock.mockResolvedValue({ success: true });
		getNewsletterSignupProtectionStateMock.mockResolvedValue({
			authAbuse: false,
			rateLimited: false
		});
		recordNewsletterSignupSecurityEventMock.mockResolvedValue(undefined);
	});

	it('uses the admin client for anonymous signup inserts and attaches first-touch metadata', async () => {
		const tableMocks = buildSignupTable({ insertedId: 456 });
		const event = buildEvent(undefined, {
			analytics: { distinctId: '019a0000-0000-7000-8000-000000000001', surface: 'email_signup' }
		});

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });
		expect(adminSupabaseMock.from).toHaveBeenCalledWith('signups');
		expect(tableMocks.duplicateQuery.eq).toHaveBeenCalledWith('email', 'newuser@example.com');
		expect(tableMocks.insertQuery.insert).toHaveBeenCalledWith([{ email: 'newuser@example.com' }]);
		expect(captureEmailSignupCompletedMock).toHaveBeenCalledTimes(1);
		expect(captureEmailSignupCompletedMock).toHaveBeenCalledWith(
			expect.objectContaining({
				signupId: '456',
				host: 'localhost',
				analytics: JSON.stringify({
					distinctId: '019a0000-0000-7000-8000-000000000001',
					surface: 'email_signup'
				})
			})
		);
		expect(tableMocks.insertQuery.single.mock.invocationCallOrder[0]).toBeLessThan(
			captureEmailSignupCompletedMock.mock.invocationCallOrder[0]
		);
		expect(adminSupabaseMock.rpc).toHaveBeenCalledWith('attach_signup_first_touch', {
			p_signup_id: 456,
			p_fingerprint: 'visitor-123'
		});
		expect(recordNewsletterSignupSecurityEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				supabase: adminSupabaseMock,
				outcome: 'success',
				identifier: 'newuser@example.com',
				ipAddress: '127.0.0.1'
			})
		);
		expect(sendEmailWithTrackingMock).toHaveBeenCalledWith(
			adminSupabaseMock,
			expect.objectContaining({
				recipient: expect.objectContaining({
					email: 'newuser@example.com',
					source: 'signups',
					source_id: '456'
				}),
				subject: 'You are in for 9takes updates'
			})
		);
	});

	it('does not insert when the normalized email already exists', async () => {
		const tableMocks = buildSignupTable({ existing: { id: 123 } });
		const event = buildEvent('existing@example.com');

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({
			ok: false,
			code: 'already_exists',
			message: 'Email already exists'
		});
		expect(tableMocks.insertQuery.insert).not.toHaveBeenCalled();
		expect(adminSupabaseMock.rpc).not.toHaveBeenCalled();
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
		expect(recordNewsletterSignupSecurityEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'already_exists',
				identifier: 'existing@example.com'
			})
		);
	});

	it('returns fake success without inserting when the honeypot is filled', async () => {
		const event = buildEvent('bot@example.com', { honeypot: 'filled' });

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });
		expect(adminSupabaseMock.from).not.toHaveBeenCalled();
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
		expect(recordNewsletterSignupSecurityEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'honeypot',
				identifier: 'bot@example.com'
			})
		);
	});

	it('returns fake success without inserting after recent auth abuse', async () => {
		getNewsletterSignupProtectionStateMock.mockResolvedValueOnce({
			authAbuse: true,
			rateLimited: false,
			reason: 'identifier_auth_abuse'
		});
		const event = buildEvent('attacked@example.com');

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });
		expect(adminSupabaseMock.from).not.toHaveBeenCalled();
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
		expect(recordNewsletterSignupSecurityEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'auth_abuse',
				identifier: 'attacked@example.com',
				context: { reason: 'identifier_auth_abuse' }
			})
		);
	});

	it.each([{ timeToken: '100' }, { userAgent: 'HeadlessChrome bot' }])(
		'does not capture blocked submissions (%j)',
		async (options) => {
			const response = await POST(buildEvent('bot@example.com', options) as any);
			expect(await response.json()).toEqual({ ok: true });
			expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
		}
	);

	it('does not capture failed inserts', async () => {
		buildSignupTable({ insertError: { message: 'database unavailable' } });
		const response = await POST(buildEvent() as any);
		expect(response.status).toBe(500);
		expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
	});

	it('does not capture rate-limited fake successes', async () => {
		getNewsletterSignupProtectionStateMock.mockResolvedValueOnce({
			authAbuse: false,
			rateLimited: true,
			reason: 'ip_rate_limit'
		});
		const response = await POST(buildEvent() as any);
		expect(await response.json()).toEqual({ ok: true });
		expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
		expect(adminSupabaseMock.from).not.toHaveBeenCalled();
	});

	it('keeps a saved signup successful when analytics delivery fails', async () => {
		buildSignupTable();
		captureEmailSignupCompletedMock.mockResolvedValueOnce(false);
		const response = await POST(buildEvent() as any);
		expect(await response.json()).toEqual({ ok: true });
	});

	it('rejects local parts with consecutive dots before inserting', async () => {
		const event = buildEvent('bad..local@example.com');

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body).toEqual({
			ok: false,
			code: 'invalid_email',
			message: 'Invalid email address'
		});
		expect(adminSupabaseMock.from).not.toHaveBeenCalled();
		expect(sendEmailWithTrackingMock).not.toHaveBeenCalled();
		expect(captureEmailSignupCompletedMock).not.toHaveBeenCalled();
		expect(recordNewsletterSignupSecurityEventMock).toHaveBeenCalledWith(
			expect.objectContaining({
				outcome: 'blocked_email_pattern',
				identifier: 'bad..local@example.com'
			})
		);
	});
});
