// src/routes/api/nine/type/type.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fromMock, loggerMocks } = vi.hoisted(() => ({
	fromMock: vi.fn(),
	loggerMocks: {
		warn: vi.fn()
	}
}));

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ from: fromMock })
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { POST } from './+server';

function updateQuery(rows: { id: number | string }[]) {
	const query = {
		update: vi.fn(),
		eq: vi.fn(),
		select: vi.fn()
	};
	query.update.mockReturnValue(query);
	query.eq.mockReturnValue(query);
	query.select.mockResolvedValue({ data: rows, error: null });
	return query;
}

function buildEvent({
	body = { enneagramType: 5, questionUrl: 'a-good-question', fingerprint: 'visitor-1' },
	userId = null,
	cookieFingerprint = null
}: {
	body?: Record<string, unknown>;
	userId?: string | null;
	cookieFingerprint?: string | null;
} = {}) {
	return {
		request: new Request('https://9takes.test/api/nine/type', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		}),
		locals: {
			user: userId ? { id: userId } : null,
			session: userId ? { user: { id: userId } } : null
		},
		cookies: {
			get: vi.fn((name: string) =>
				name === '9tfingerprint' ? (cookieFingerprint ?? undefined) : undefined
			)
		}
	};
}

describe('POST /api/nine/type', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('persists an anonymous selection against the matching Chorus take', async () => {
		const takes = updateQuery([{ id: 42 }]);
		fromMock.mockImplementation((table: string) => {
			if (table === 'nine_user_takes') return takes;
			throw new Error(`Unexpected table: ${table}`);
		});

		const response = await POST(buildEvent() as never);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			ok: true,
			savedToTake: true,
			savedToProfile: false
		});
		expect(takes.update).toHaveBeenCalledWith({ self_reported_type: 5 });
		expect(takes.eq).toHaveBeenCalledWith('subject_type', 'question');
		expect(takes.eq).toHaveBeenCalledWith('subject_slug', 'a-good-question');
		expect(takes.eq).toHaveBeenCalledWith('fingerprint', 'visitor-1');
	});

	it('also updates the authenticated contributor profile', async () => {
		const takes = updateQuery([{ id: 42 }]);
		const profiles = updateQuery([{ id: 'user-1' }]);
		fromMock.mockImplementation((table: string) => {
			if (table === 'nine_user_takes') return takes;
			if (table === 'profiles') return profiles;
			throw new Error(`Unexpected table: ${table}`);
		});

		const response = await POST(buildEvent({ userId: 'user-1' }) as never);

		expect(await response.json()).toEqual({
			ok: true,
			savedToTake: true,
			savedToProfile: true
		});
		expect(profiles.update).toHaveBeenCalledWith({ enneagram: '5' });
		expect(profiles.eq).toHaveBeenCalledWith('id', 'user-1');
	});

	it('rejects invalid type values before touching storage', async () => {
		const response = await POST(
			buildEvent({ body: { enneagramType: 10, questionUrl: 'a-good-question' } }) as never
		);

		expect(response.status).toBe(400);
		expect(fromMock).not.toHaveBeenCalled();
	});
});
