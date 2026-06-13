// src/routes/api/signups/signups.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { adminSupabaseMock, sendEmailWithTrackingMock, loggerMocks } = vi.hoisted(() => ({
	adminSupabaseMock: {
		from: vi.fn(),
		rpc: vi.fn()
	},
	sendEmailWithTrackingMock: vi.fn(),
	loggerMocks: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
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

vi.mock('../../../emails', () => ({
	signupWelcomeEmail: vi.fn(() => '<p>welcome</p>')
}));

import { POST } from './+server';

function buildRequest(email: string) {
	const formData = new FormData();
	formData.append('email', email);

	return new Request('http://localhost/api/signups', {
		method: 'POST',
		body: formData
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

function buildEvent(email = 'NewUser@Example.com') {
	return {
		request: buildRequest(email),
		cookies: {
			get: vi.fn((name: string) => (name === '9tfingerprint' ? 'visitor-123' : undefined))
		}
	};
}

describe('POST /api/signups', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		adminSupabaseMock.rpc.mockResolvedValue({ data: true, error: null });
		sendEmailWithTrackingMock.mockResolvedValue({ success: true });
	});

	it('uses the admin client for anonymous signup inserts and attaches first-touch metadata', async () => {
		const tableMocks = buildSignupTable({ insertedId: 456 });
		const event = buildEvent();

		const response = await POST(event as any);
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ ok: true });
		expect(adminSupabaseMock.from).toHaveBeenCalledWith('signups');
		expect(tableMocks.duplicateQuery.eq).toHaveBeenCalledWith('email', 'newuser@example.com');
		expect(tableMocks.insertQuery.insert).toHaveBeenCalledWith([{ email: 'newuser@example.com' }]);
		expect(adminSupabaseMock.rpc).toHaveBeenCalledWith('attach_signup_first_touch', {
			p_signup_id: 456,
			p_fingerprint: 'visitor-123'
		});
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
	});
});
