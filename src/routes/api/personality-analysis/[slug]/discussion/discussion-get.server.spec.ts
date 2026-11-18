// src/routes/api/personality-analysis/[slug]/discussion/discussion-get.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { adminFrom, visitorFrom, gateResult, readComments } = vi.hoisted(() => ({
	adminFrom: vi.fn(),
	visitorFrom: vi.fn(),
	gateResult: vi.fn(),
	readComments: vi.fn()
}));

vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ from: adminFrom })
}));

import { GET } from './+server';

const comments = [{ id: 19, comment: 'A revealed take', author_id: 'another-reader' }];

function query() {
	const builder = {
		select: vi.fn().mockReturnThis(),
		in: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		order: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		abortSignal: vi.fn().mockReturnThis(),
		maybeSingle: gateResult,
		then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
			readComments().then(resolve, reject)
	};
	return builder;
}

function event(userId: string | null = null, fingerprint: string | null = 'visitor-1') {
	return {
		params: { slug: 'robert-greene' },
		locals: {
			session: userId ? { user: { id: userId } } : null,
			supabase: { from: visitorFrom }
		},
		cookies: { get: () => fingerprint ?? undefined },
		setHeaders: vi.fn()
	} as unknown as Parameters<typeof GET>[0];
}

describe('GET /api/personality-analysis/[slug]/discussion', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		adminFrom.mockImplementation(query);
		visitorFrom.mockImplementation(query);
		gateResult.mockResolvedValue({ data: null, error: null });
		readComments.mockResolvedValue({ data: comments, error: null });
	});

	it('returns no comments and skips the database for a visitor without an identity', async () => {
		const request = event(null, null);
		const response = await GET(request);

		expect(await response.json()).toEqual({ userHasAnswered: false, comments: [] });
		expect(adminFrom).not.toHaveBeenCalled();
		expect(visitorFrom).not.toHaveBeenCalled();
		expect(request.setHeaders).toHaveBeenCalledWith({ 'Cache-Control': 'private, no-store' });
	});

	it.each([
		['an account has not answered', 'reader-1', { data: null, error: null }],
		['an anonymous visitor has not answered', null, { data: null, error: null }],
		[
			'an account lookup fails',
			'reader-1',
			{ data: null, error: { message: 'Database unavailable' } }
		],
		['an anonymous lookup fails', null, { data: null, error: { message: 'Database unavailable' } }]
	] as const)('does not read comment text when %s', async (_label, userId, result) => {
		gateResult.mockResolvedValue(result);
		const request = event(userId);
		const response = await GET(request);

		expect(await response.json()).toEqual({ userHasAnswered: false, comments: [] });
		expect(gateResult).toHaveBeenCalledOnce();
		expect(readComments).not.toHaveBeenCalled();
		if (userId) expect(adminFrom).not.toHaveBeenCalled();
		expect(request.setHeaders).toHaveBeenCalledWith({ 'Cache-Control': 'private, no-store' });
	});

	it.each([
		['an account', 'reader-1', null],
		['an anonymous visitor', null, 'visitor-1']
	])(
		'reveals comments after %s has answered and keeps the response private',
		async (_, userId, fingerprint) => {
			gateResult.mockResolvedValue({ data: { id: 7 }, error: null });
			const request = event(userId, fingerprint);
			const response = await GET(request);

			expect(await response.json()).toEqual({ userHasAnswered: true, comments });
			expect(readComments).toHaveBeenCalledOnce();
			const gateQuery = (userId ? visitorFrom : adminFrom).mock.results[0].value;
			expect(gateQuery.in).toHaveBeenCalledWith('blog_link', ['robert-greene']);
			expect(gateQuery.eq).toHaveBeenCalledWith(
				userId ? 'author_id' : 'fingerprint',
				userId ?? fingerprint
			);
			expect(request.setHeaders).toHaveBeenCalledWith({ 'Cache-Control': 'private, no-store' });
		}
	);
});
