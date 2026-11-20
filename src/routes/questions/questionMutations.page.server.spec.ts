// src/routes/questions/questionMutations.page.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	checkDemoTimeMock,
	mapDemoValuesMock,
	rpcMock,
	recordGiveFirstEventMock,
	runBestEffortTelemetryMock,
	consumeApiRateLimitMock
} = vi.hoisted(() => ({
	checkDemoTimeMock: vi.fn(),
	mapDemoValuesMock: vi.fn((value: unknown) => value),
	rpcMock: vi.fn(),
	recordGiveFirstEventMock: vi.fn(),
	runBestEffortTelemetryMock: vi.fn(),
	consumeApiRateLimitMock: vi.fn()
}));

vi.mock('$lib/server/supabaseAdmin', () => ({ getSupabaseAdminClient: () => ({ rpc: rpcMock }) }));

vi.mock('$lib/supabase', () => ({
	supabase: {
		rpc: rpcMock,
		from: vi.fn()
	}
}));

vi.mock('$lib/server/apiRateLimit', () => ({
	consumeApiRateLimit: consumeApiRateLimitMock,
	resolveRateLimitSubject: ({
		userId,
		clientAddress
	}: {
		userId?: string | null;
		clientAddress: string;
	}) => (userId ? `user:${userId}` : `ip:${clientAddress}`)
}));

vi.mock('$lib/server/giveFirstFunnel', () => ({
	recordGiveFirstEvent: recordGiveFirstEventMock
}));

vi.mock('$lib/server/bestEffortTelemetry', () => ({
	logBestEffortTelemetryFailure: vi.fn(),
	runBestEffortTelemetry: runBestEffortTelemetryMock
}));

vi.mock('../../utils/api', () => ({
	checkDemoTime: checkDemoTimeMock
}));

vi.mock('../../utils/demo', () => ({
	mapDemoValues: mapDemoValuesMock
}));

import { actions } from './[slug]/+page.server';

const USER_ID = '123e4567-e89b-12d3-a456-426614174000';
const OTHER_USER_ID = '123e4567-e89b-12d3-a456-426614174999';

function buildCommentRequest(authorId: string | null = null) {
	const formData = new FormData();
	formData.append('comment', 'This is my first take.');
	formData.append('parent_id', '42');
	formData.append('parent_type', 'question');
	if (authorId !== null) {
		formData.append('author_id', authorId);
	} else {
		formData.append('author_id', '');
	}
	formData.append('question_id', '42');
	formData.append('fingerprint', 'visitor-1');

	return new Request('http://localhost/questions/example?/createCommentRando', {
		method: 'POST',
		body: formData
	});
}

function buildReplyRequest() {
	const formData = new FormData();
	formData.append('comment', 'Anonymous reply attempt.');
	formData.append('parent_id', '77');
	formData.append('parent_type', 'comment');
	formData.append('author_id', '');
	formData.append('question_id', '42');
	formData.append('fingerprint', 'visitor-1');

	return new Request('http://localhost/questions/example?/createCommentRando', {
		method: 'POST',
		body: formData
	});
}

function buildReplyOptInRequest(email = 'reader@example.com') {
	const formData = new FormData();
	formData.append('comment_id', '123');
	formData.append('question_id', '42');
	formData.append('fingerprint', 'visitor-1');
	formData.append('email', email);

	return new Request('http://localhost/questions/example?/subscribeToCommentReplies', {
		method: 'POST',
		body: formData
	});
}

function buildLikeRequest(userId: string) {
	const formData = new FormData();
	formData.append('parent_id', '77');
	formData.append('user_id', userId);
	formData.append('operation', 'add');

	return new Request('http://localhost/questions/example?/likeComment', {
		method: 'POST',
		body: formData
	});
}

function buildActionEvent(request: Request, sessionUserId: string | null = null) {
	return {
		request,
		url: new URL('https://9takes.com/questions/what-do-you-need'),
		getClientAddress: () => '127.0.0.1',
		locals: {
			session: sessionUserId ? { user: { id: sessionUserId } } : null,
			supabase: {
				rpc: rpcMock,
				from: vi.fn()
			}
		}
	};
}

describe('question mutation identity binding', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		checkDemoTimeMock.mockResolvedValue(false);
		mapDemoValuesMock.mockImplementation((value: unknown) => value);
		recordGiveFirstEventMock.mockResolvedValue(undefined);
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: true,
			retryAfterSeconds: 60,
			degraded: false
		});
		rpcMock.mockImplementation((name: string) => {
			if (name === 'check_comment_rate_limit') {
				return Promise.resolve({ data: true, error: null });
			}
			if (name === 'can_see_comments_3') {
				return Promise.resolve({ data: false, error: null });
			}
			if (name === 'create_comment_atomic') {
				return Promise.resolve({
					data: {
						id: 123,
						comment: 'This is my first take.',
						author_id: null,
						_analytics: {
							is_first_comment_ever: true,
							is_first_comment_on_question: true,
							is_reply: false,
							question_age_hours: 2,
							responses_before_comment: 0
						}
					},
					error: null
				});
			}
			if (name === 'create_comment_reply_subscription') {
				return Promise.resolve({ data: { status: 'subscribed' }, error: null });
			}
			if (name === 'increment_clicks') {
				return Promise.resolve({ data: null, error: null });
			}

			throw new Error(`Unexpected rpc ${name}`);
		});
	});

	it('allows an anonymous first top-level comment without an author id', async () => {
		const event = buildActionEvent(buildCommentRequest());

		const result = await actions.createCommentRando(event as any);

		expect(result).toEqual(
			expect.objectContaining({
				id: 123,
				_analytics: expect.objectContaining({
					is_first_comment_ever: true,
					is_first_comment_on_question: true
				})
			})
		);
		expect(rpcMock).toHaveBeenCalledWith(
			'create_comment_atomic',
			expect.objectContaining({
				p_author_id: null,
				p_parent_id: 42,
				p_parent_type: 'question'
			})
		);
		expect(recordGiveFirstEventMock).toHaveBeenCalledWith({
			fingerprint: 'visitor-1',
			eventType: 'contribution',
			questionId: 42,
			path: '/questions/what-do-you-need',
			userId: null
		});
		expect(runBestEffortTelemetryMock).toHaveBeenCalledTimes(1);
	});

	it('keeps registered contributors in the welcome sequence', async () => {
		const event = buildActionEvent(buildCommentRequest(USER_ID), USER_ID);

		const result = await actions.createCommentRando(event as any);

		expect(result).toEqual(expect.objectContaining({ id: 123, _analytics: expect.any(Object) }));
		expect(rpcMock).not.toHaveBeenCalledWith('exit_user_from_sequence', expect.anything());
	});

	it('keeps the legacy and current action names on the same implementation path', () => {
		expect(actions.createComment).toBe(actions.createCommentRando);
	});

	it('charges the atomic pace limit, keyed on the client IP or the signed-in user', async () => {
		await actions.createCommentRando(buildActionEvent(buildCommentRequest()) as any);
		expect(consumeApiRateLimitMock).toHaveBeenLastCalledWith({
			bucket: 'question_comment',
			subject: 'ip:127.0.0.1'
		});

		await actions.createCommentRando(
			buildActionEvent(buildCommentRequest(USER_ID), USER_ID) as any
		);
		expect(consumeApiRateLimitMock).toHaveBeenLastCalledWith({
			bucket: 'question_comment',
			subject: `user:${USER_ID}`
		});
	});

	it('refuses a take with 429 once the pace limit is spent, before anything is saved', async () => {
		consumeApiRateLimitMock.mockResolvedValueOnce({
			allowed: false,
			retryAfterSeconds: 60,
			degraded: false
		});

		await expect(
			actions.createCommentRando(buildActionEvent(buildCommentRequest()) as any)
		).rejects.toMatchObject({ status: 429 });
		expect(rpcMock.mock.calls.some(([name]) => name === 'create_comment_atomic')).toBe(false);
	});

	it('rejects an anonymous comment that claims a registered user id', async () => {
		const event = buildActionEvent(buildCommentRequest(USER_ID));

		await expect(actions.createCommentRando(event as any)).rejects.toMatchObject({
			status: 403
		});
		expect(rpcMock.mock.calls.some(([name]) => name === 'create_comment_atomic')).toBe(false);
	});

	it('requires registration before replying to another comment', async () => {
		const event = buildActionEvent(buildReplyRequest());

		await expect(actions.createCommentRando(event as any)).rejects.toMatchObject({
			status: 401
		});
		expect(rpcMock.mock.calls.some(([name]) => name === 'create_comment_atomic')).toBe(false);
	});

	it('persists reply consent through the validated RPC without returning private fields', async () => {
		const event = buildActionEvent(buildReplyOptInRequest());

		const result = await actions.subscribeToCommentReplies(event as any);

		expect(result).toEqual({ replyOptIn: { status: 'subscribed' } });
		expect(rpcMock).toHaveBeenCalledWith('create_comment_reply_subscription', {
			p_comment_id: 123,
			p_question_id: 42,
			p_fingerprint: 'visitor-1',
			p_email: 'reader@example.com'
		});
		expect(JSON.stringify(result)).not.toMatch(/email|fingerprint|token/i);
	});

	it('rejects invalid reply email without touching the persistence RPC', async () => {
		const event = buildActionEvent(buildReplyOptInRequest('not-an-email'));

		const result = await actions.subscribeToCommentReplies(event as any);

		expect(result).toMatchObject({ status: 400, data: { replyOptIn: { status: 'invalid' } } });
		expect(rpcMock.mock.calls.some(([name]) => name === 'create_comment_reply_subscription')).toBe(
			false
		);
	});

	it.each([
		['already_subscribed', 200],
		['suppressed', 422]
	] as const)('returns the privacy-safe %s reply opt-in result', async (status, httpStatus) => {
		rpcMock.mockResolvedValueOnce({ data: { status }, error: null });
		const event = buildActionEvent(buildReplyOptInRequest());

		const result = await actions.subscribeToCommentReplies(event as any);

		if (httpStatus === 200) {
			expect(result).toEqual({ replyOptIn: { status } });
		} else {
			expect(result).toMatchObject({ status: httpStatus, data: { replyOptIn: { status } } });
		}
		expect(JSON.stringify(result)).not.toMatch(/reader@example|fingerprint|token/i);
	});

	it('rejects likes submitted for a different user id', async () => {
		const event = buildActionEvent(buildLikeRequest(OTHER_USER_ID), USER_ID);

		await expect(actions.likeComment(event as any)).rejects.toMatchObject({
			status: 403
		});
	});
});

describe('saveLinkClick', () => {
	function buildLinkClickEvent(linkId: string | null, sessionUserId: string | null = null) {
		const formData = new FormData();
		if (linkId !== null) formData.append('linkId', linkId);
		return buildActionEvent(
			new Request('http://localhost/questions/example?/saveLinkClick', {
				method: 'POST',
				body: formData
			}),
			sessionUserId
		);
	}

	beforeEach(() => {
		vi.clearAllMocks();
		consumeApiRateLimitMock.mockResolvedValue({
			allowed: true,
			retryAfterSeconds: 60,
			degraded: false
		});
		rpcMock.mockResolvedValue({ data: null, error: null });
	});

	it('counts a click on a valid link id', async () => {
		const result = await actions.saveLinkClick(buildLinkClickEvent('37') as any);

		expect(result).toBe(true);
		expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
			bucket: 'link_click',
			subject: 'ip:127.0.0.1'
		});
		expect(rpcMock).toHaveBeenCalledWith('increment_clicks', { link_id: 37 });
	});

	it.each([null, '', '0', '-4', '1.5', '37abc', '99999999999', USER_ID])(
		'rejects link id %j without counting or charging the limit',
		async (linkId) => {
			const result = await actions.saveLinkClick(buildLinkClickEvent(linkId) as any);

			expect(result).toMatchObject({ status: 400 });
			expect(consumeApiRateLimitMock).not.toHaveBeenCalled();
			expect(rpcMock).not.toHaveBeenCalled();
		}
	);

	it('skips the count quietly once the click limit is spent', async () => {
		consumeApiRateLimitMock.mockResolvedValueOnce({
			allowed: false,
			retryAfterSeconds: 60,
			degraded: false
		});
		const result = await actions.saveLinkClick(buildLinkClickEvent('37', USER_ID) as any);

		expect(result).toBe(true);
		expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
			bucket: 'link_click',
			subject: `user:${USER_ID}`
		});
		expect(rpcMock).not.toHaveBeenCalled();
	});
});
