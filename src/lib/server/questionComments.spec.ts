// src/lib/server/questionComments.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { anonRpc, adminRpc, adminFrom, demoInsertSingle } = vi.hoisted(() => ({
	anonRpc: vi.fn(),
	adminRpc: vi.fn(),
	adminFrom: vi.fn(),
	demoInsertSingle: vi.fn()
}));

vi.mock('$lib/supabase', () => ({ supabase: { rpc: anonRpc } }));
vi.mock('$lib/server/supabaseAdmin', () => ({
	getSupabaseAdminClient: () => ({ rpc: adminRpc, from: adminFrom })
}));
vi.mock('$lib/server/safeExternalFetch', () => ({ fetchPublicHtml: vi.fn() }));

import {
	RATE_LIMIT_MAX_COMMENTS,
	RATE_LIMIT_WINDOW_SECONDS,
	assertCommentAccess,
	checkRateLimit,
	checkUserAnswered,
	createCommentData,
	getQuestion,
	handleCommentCreation,
	insertCommentAtomic,
	isOncePerQuestionError,
	resolveCommentAuthorId,
	type CreateCommentInput
} from './questionComments';

const USER_ID = '123e4567-e89b-12d3-a456-426614174000';

function takeInput(overrides: Partial<CreateCommentInput> = {}): CreateCommentInput {
	return {
		comment: 'Someone who shows up.',
		parent_id: '203',
		parent_type: 'question',
		question_id: '203',
		fingerprint: 'visitor-1',
		...overrides
	};
}

function questionQuery(result: { data: unknown; error: unknown }) {
	const calls: [string, ...unknown[]][] = [];
	const query: Record<string, unknown> = {};
	for (const method of ['select', 'eq', 'not']) {
		query[method] = (...args: unknown[]) => {
			calls.push([method, ...args]);
			return query;
		};
	}
	query.single = () => Promise.resolve(result);
	const db = {
		from: vi.fn((table: string) => {
			calls.push(['from', table]);
			return query;
		})
	};
	return { db, calls };
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('checkRateLimit', () => {
	it('asks check_comment_rate_limit for 5 takes per 60 seconds by fingerprint or IP', async () => {
		anonRpc.mockResolvedValueOnce({ data: true, error: null });
		await expect(checkRateLimit('visitor-1', '203.0.113.7')).resolves.toBe(true);
		expect(anonRpc).toHaveBeenCalledWith('check_comment_rate_limit', {
			p_fingerprint: 'visitor-1',
			p_ip: '203.0.113.7',
			p_max_comments: RATE_LIMIT_MAX_COMMENTS,
			p_window_seconds: RATE_LIMIT_WINDOW_SECONDS
		});
		expect([RATE_LIMIT_MAX_COMMENTS, RATE_LIMIT_WINDOW_SECONDS]).toEqual([5, 60]);
	});

	it('blocks when the limit is reached, and fails closed when the check errors', async () => {
		anonRpc.mockResolvedValueOnce({ data: false, error: null });
		await expect(checkRateLimit(undefined, '203.0.113.7')).resolves.toBe(false);
		expect(anonRpc.mock.calls[0][1]).toMatchObject({ p_fingerprint: null });

		anonRpc.mockResolvedValueOnce({ data: null, error: { message: 'down' } });
		await expect(checkRateLimit('visitor-1', 'ip')).resolves.toBe(false);

		anonRpc.mockRejectedValueOnce(new Error('network'));
		await expect(checkRateLimit('visitor-1', 'ip')).resolves.toBe(false);
	});
});

describe('resolveCommentAuthorId', () => {
	it('binds the author to the session and rejects claimed identities', () => {
		expect(resolveCommentAuthorId(undefined, null)).toBeNull();
		expect(resolveCommentAuthorId(undefined, USER_ID)).toBe(USER_ID);
		expect(resolveCommentAuthorId(USER_ID, USER_ID)).toBe(USER_ID);
		expect(() => resolveCommentAuthorId(USER_ID, null)).toThrow(
			expect.objectContaining({ status: 403 })
		);
		expect(() => resolveCommentAuthorId(USER_ID, 'someone-else')).toThrow(
			expect.objectContaining({ status: 403 })
		);
	});
});

describe('assertCommentAccess', () => {
	it('lets signed-in users through without a gate check', async () => {
		await expect(assertCommentAccess(takeInput(), USER_ID, false)).resolves.toBeUndefined();
		expect(anonRpc).not.toHaveBeenCalled();
	});

	it('keeps anonymous replies and fingerprint-less takes out', async () => {
		await expect(
			assertCommentAccess(takeInput({ parent_type: 'comment' }), null, false)
		).rejects.toMatchObject({ status: 401 });
		await expect(
			assertCommentAccess(takeInput({ fingerprint: undefined }), null, false)
		).rejects.toMatchObject({ status: 400 });
	});

	it('allows one anonymous take per question through can_see_comments_3', async () => {
		anonRpc.mockResolvedValueOnce({ data: false, error: null });
		await expect(assertCommentAccess(takeInput(), null, false)).resolves.toBeUndefined();
		expect(anonRpc).toHaveBeenCalledWith('can_see_comments_3', {
			userfingerprint: 'visitor-1',
			questionid: 203,
			userid: null
		});

		anonRpc.mockResolvedValueOnce({ data: true, error: null });
		await expect(assertCommentAccess(takeInput(), null, false)).rejects.toMatchObject({
			status: 403
		});
	});

	it('skips the gate lookup in demo mode', async () => {
		await expect(assertCommentAccess(takeInput(), null, true)).resolves.toBeUndefined();
		expect(anonRpc).not.toHaveBeenCalled();
	});
});

describe('createCommentData', () => {
	it('maps validated input to the insert row with a session-bound author', async () => {
		await expect(createCommentData(takeInput(), '203.0.113.7', null)).resolves.toEqual({
			comment: 'Someone who shows up.',
			parent_id: 203,
			author_id: null,
			comment_count: 0,
			ip: '203.0.113.7',
			parent_type: 'question',
			fingerprint: 'visitor-1'
		});
		await expect(
			createCommentData(takeInput({ fingerprint: '' }), 'ip', USER_ID)
		).resolves.toMatchObject({ author_id: USER_ID, fingerprint: null });
	});
});

describe('comment insert', () => {
	const row = {
		comment: 'Someone who shows up.',
		parent_id: 203,
		author_id: null,
		comment_count: 0,
		ip: '203.0.113.7',
		parent_type: 'question',
		fingerprint: 'visitor-1'
	};

	it('creates production takes with create_comment_atomic', async () => {
		adminRpc.mockResolvedValueOnce({ data: { id: 9 }, error: null });
		await expect(handleCommentCreation({}, row, 'question', false)).resolves.toEqual({ id: 9 });
		expect(adminRpc).toHaveBeenCalledWith('create_comment_atomic', {
			p_comment: 'Someone who shows up.',
			p_parent_id: 203,
			p_author_id: null,
			p_parent_type: 'question',
			p_fingerprint: 'visitor-1',
			p_ip: '203.0.113.7'
		});
	});

	it('turns any production insert failure into a 500, as the question page always has', async () => {
		adminRpc.mockResolvedValueOnce({
			data: null,
			error: { message: 'Anonymous visitors can only comment once per question' }
		});
		await expect(handleCommentCreation({}, row, 'question', false)).rejects.toMatchObject({
			status: 500
		});
	});

	it('returns the raw RPC result from insertCommentAtomic for callers that map the guard', async () => {
		const failure = { message: 'Anonymous visitors can only comment once per question' };
		adminRpc.mockResolvedValueOnce({ data: null, error: failure });
		await expect(insertCommentAtomic(row, 'question')).resolves.toEqual({
			data: null,
			error: failure
		});
		expect(isOncePerQuestionError(failure)).toBe(true);
		expect(isOncePerQuestionError('Anonymous visitors can only comment once per question')).toBe(
			true
		);
		expect(isOncePerQuestionError({ message: 'duplicate key value' })).toBe(false);
		expect(isOncePerQuestionError(null)).toBe(false);
	});

	it('writes demo takes to comments_demo', async () => {
		const select = vi.fn(() => ({ single: demoInsertSingle }));
		const insert = vi.fn(() => ({ select }));
		adminFrom.mockReturnValueOnce({ insert });
		demoInsertSingle.mockResolvedValueOnce({ data: { id: 1 }, error: null });
		await expect(handleCommentCreation({}, row, 'question', true)).resolves.toEqual({ id: 1 });
		expect(adminFrom).toHaveBeenCalledWith('comments_demo');
		expect(insert).toHaveBeenCalledWith(row);
		expect(adminRpc).not.toHaveBeenCalled();
	});
});

describe('getQuestion', () => {
	it('resolves a slug, never returning removed or flagged questions', async () => {
		const { db, calls } = questionQuery({ data: { id: 203, url: 'friend' }, error: null });
		await expect(getQuestion('friend', false, db)).resolves.toEqual({ id: 203, url: 'friend' });
		expect(calls).toEqual(
			expect.arrayContaining([
				['from', 'questions'],
				['eq', 'url', 'friend'],
				['not', 'removed', 'is', true],
				['not', 'flagged', 'is', true]
			])
		);
	});

	it('resolves numeric ids and demo tables, and returns null when nothing matches', async () => {
		const byId = questionQuery({ data: { id: 203 }, error: null });
		await getQuestion('203', true, byId.db);
		expect(byId.calls).toEqual(
			expect.arrayContaining([
				['from', 'questions_demo'],
				['eq', 'id', '203']
			])
		);

		const missing = questionQuery({ data: null, error: { code: 'PGRST116' } });
		await expect(getQuestion('gone', false, missing.db)).resolves.toBeNull();
	});
});

describe('checkUserAnswered', () => {
	it('asks the give-first gate with the given client so auth.uid() resolves', async () => {
		const db = { rpc: vi.fn().mockResolvedValue({ data: true }) };
		await expect(checkUserAnswered(undefined, 203, USER_ID, db)).resolves.toBe(true);
		expect(db.rpc).toHaveBeenCalledWith('can_see_comments_3', {
			userfingerprint: null,
			questionid: 203,
			userid: USER_ID
		});
	});
});
