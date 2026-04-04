import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verifyRecaptchaMock, sendEmailMock } = vi.hoisted(() => ({
	verifyRecaptchaMock: vi.fn(),
	sendEmailMock: vi.fn()
}));

vi.mock('$lib/utils/recaptcha', () => ({
	verifyRecaptcha: verifyRecaptchaMock
}));

vi.mock('$lib/email/sender', () => ({
	sendEmail: sendEmailMock
}));

vi.mock('$env/static/private', () => ({
	PRIVATE_ADMIN_EMAIL: 'admin@9takes.com'
}));

import { actions } from './+page.server';

function buildRequest(overrides: Record<string, string> = {}) {
	const formData = new FormData();
	formData.append('name', overrides.name ?? 'DJ');
	formData.append('email', overrides.email ?? 'dj@example.com');
	formData.append('enneagramType', overrides.enneagramType ?? '5');
	formData.append('sessionGoal', overrides.sessionGoal ?? '');
	formData.append('website', overrides.website ?? '');
	formData.append('g-recaptcha-response', overrides['g-recaptcha-response'] ?? 'token');
	formData.append('_timeToken', overrides._timeToken ?? '4000');

	return new Request('http://localhost/book-session', {
		method: 'POST',
		body: formData,
		headers: {
			'user-agent':
				overrides.userAgent ??
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
			referer: 'https://9takes.com/questions'
		}
	});
}

function buildSupabaseMocks(options?: {
	waitlistError?: { code?: string } | null;
	waitlistId?: number;
	rateLimitCount?: number;
}) {
	const metadataCountChain = {
		eq: vi.fn().mockReturnThis(),
		gte: vi.fn().mockResolvedValue({
			count: options?.rateLimitCount ?? 0,
			error: null
		})
	};

	const waitlistInsertChain = {
		select: vi.fn().mockReturnThis(),
		single: vi.fn().mockResolvedValue({
			data: options?.waitlistError ? null : { id: options?.waitlistId ?? 123 },
			error: options?.waitlistError ?? null
		})
	};

	const metadataInsert = vi.fn().mockResolvedValue({ data: null, error: null });
	const waitlistInsert = vi.fn().mockReturnValue(waitlistInsertChain);

	const from = vi.fn((table: string) => {
		if (table === 'coaching_waitlist_metadata') {
			return {
				select: vi.fn().mockReturnValue(metadataCountChain),
				insert: metadataInsert
			};
		}

		if (table === 'coaching_waitlist') {
			return {
				insert: waitlistInsert
			};
		}

		throw new Error(`Unexpected table: ${table}`);
	});

	return {
		supabase: { from },
		waitlistInsert,
		metadataInsert
	};
}

function buildEvent(
	overrides: Record<string, string> = {},
	supabaseOptions?: {
		waitlistError?: { code?: string } | null;
		waitlistId?: number;
		rateLimitCount?: number;
	}
) {
	const supabaseMocks = buildSupabaseMocks(supabaseOptions);
	const cookies = { set: vi.fn() };

	return {
		request: buildRequest(overrides),
		getClientAddress: () => '127.0.0.1',
		url: new URL('https://9takes.com/book-session?utm_source=homepage&utm_medium=cta'),
		cookies,
		locals: {
			supabase: supabaseMocks.supabase
		},
		_cookies: cookies,
		_supabase: supabaseMocks
	};
}

describe('book-session action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		verifyRecaptchaMock.mockResolvedValue(true);
		sendEmailMock.mockResolvedValue(undefined);
	});

	it('accepts a waitlist signup without a session note', async () => {
		const event = buildEvent({ sessionGoal: '' });

		const result = await actions.coachSub(event as any);

		expect(result).toEqual({
			success: true,
			message: 'You have been added to our waitlist!',
			email: 'dj@example.com'
		});
		expect(event._supabase.waitlistInsert).toHaveBeenCalledWith([
			expect.objectContaining({
				name: 'DJ',
				email: 'dj@example.com',
				enneagram_type: '5',
				session_goal: null
			})
		]);
		expect(event._cookies.set).toHaveBeenCalledTimes(1);
	});

	it('still rejects notes longer than 600 characters', async () => {
		const event = buildEvent({ sessionGoal: 'a'.repeat(601) });

		const result = await actions.coachSub(event as any);

		expect(result).toMatchObject({
			status: 400,
			data: expect.objectContaining({
				message: 'Please keep your note under 600 characters'
			})
		});
		expect(event._supabase.waitlistInsert).not.toHaveBeenCalled();
	});
});
