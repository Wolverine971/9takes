// src/lib/server/hostDigest.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	buildHostDigestEmail,
	draftHostReplies,
	HOST_DESK_TOKEN_MAX_AGE_MS,
	isLowEffortText,
	runHostDigest,
	signHostDeskToken,
	validateHostDraft,
	verifyHostDeskToken,
	type HostDigestCandidate
} from './hostDigest';
import type { JSONRequestOptions } from '../../utils/server/smart-llm-service';

const SECRET = 'test-secret';

const candidate: HostDigestCandidate = {
	comment_id: 501,
	comment_text: 'Fake being happy. <b>every day</b>',
	author_type_key: '6',
	is_anonymous: false,
	question_id: 42,
	question_text:
		'Whats something you do every day to seem fine that nobody knows is costing you effort',
	question_url: 'whats-something-you-do-every-day',
	parent_comment_text: null,
	low_effort: false,
	created_at: '2026-09-05T14:00:00.000Z'
};

const lowEffortCandidate: HostDigestCandidate = {
	...candidate,
	comment_id: 502,
	comment_text: 'Nothing',
	author_type_key: 'rando',
	is_anonymous: true,
	low_effort: true,
	created_at: '2026-09-05T15:00:00.000Z'
};

function fakeLlm(responses: unknown[]) {
	const queue = [...responses];
	const getJSONResponse = vi.fn(async (_options: JSONRequestOptions) => {
		const next = queue.shift();
		if (next instanceof Error) throw next;
		return next as any;
	});
	return { llm: { getJSONResponse }, getJSONResponse };
}

describe('validateHostDraft', () => {
	it('accepts a short plain reply', () => {
		expect(validateHostDraft('dang. what happened?')).toEqual({
			ok: true,
			text: 'dang. what happened?'
		});
	});

	it('rejects empty, dashes, lists, emojis, therapy-speak and AI tells', () => {
		expect(validateHostDraft('')).toMatchObject({ ok: false });
		expect(validateHostDraft('yep — checks out')).toMatchObject({
			ok: false,
			reason: 'contains a dash'
		});
		expect(validateHostDraft('two things:\n- one\n- two')).toMatchObject({ ok: false });
		expect(validateHostDraft('nice 🔥')).toMatchObject({ ok: false, reason: 'contains an emoji' });
		expect(validateHostDraft('I hear you, that is hard')).toMatchObject({ ok: false });
		expect(validateHostDraft('Thank you for sharing this')).toMatchObject({ ok: false });
		expect(validateHostDraft('As an AI I cannot')).toMatchObject({ ok: false });
		expect(validateHostDraft('x'.repeat(601))).toMatchObject({ ok: false, reason: 'too long' });
	});
});

describe('draftHostReplies', () => {
	it('returns two validated drafts from the model', async () => {
		const { llm, getJSONResponse } = fakeLlm([
			{
				drafts: [
					{ text: 'dang' },
					{ text: 'the every day part is the brutal part. how long you been doing that?' }
				]
			}
		]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(drafts.usedFallback).toBe(false);
		expect(drafts.draftA).toBe('dang');
		expect(drafts.draftB).toContain('every day');
		expect(getJSONResponse).toHaveBeenCalledTimes(1);
		const call = getJSONResponse.mock.calls[0][0];
		expect(call.systemPrompt).toContain('Never diagnose');
		expect(call.userPrompt).toContain('THEIR TAKE: Fake being happy.');
	});

	it('retries once when a draft fails validation, then keeps the good one', async () => {
		const { llm, getJSONResponse } = fakeLlm([
			{ drafts: [{ text: 'I hear you — that is a lot' }, { text: 'I hear you' }] },
			{
				drafts: [
					{ text: 'oooofff' },
					{ text: 'what does fake happy look like for you day to day?' }
				]
			}
		]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(getJSONResponse).toHaveBeenCalledTimes(2);
		expect(drafts.usedFallback).toBe(false);
		expect(drafts.draftA).toBe('oooofff');
	});

	it('falls back to safe templates when the model keeps failing', async () => {
		const { llm } = fakeLlm([new Error('provider down'), { drafts: 'nope' }]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(drafts.usedFallback).toBe(true);
		expect(drafts.model).toBeNull();
		expect(drafts.draftA).toBe('what made you go with that one?');
		expect(drafts.draftB).not.toBe(drafts.draftA);
	});

	it('uses one-line fallbacks for low-effort takes', async () => {
		const { llm } = fakeLlm([new Error('x'), new Error('y')]);
		const drafts = await draftHostReplies(lowEffortCandidate, { llm });
		expect(drafts.draftA).toBe("lol what's the real one?");
		expect(drafts.draftB).toBe('nice');
	});
});

describe('host desk tokens', () => {
	it('round-trips a signed payload and rejects tampering', () => {
		const now = Date.parse('2026-09-06T13:00:00.000Z');
		const token = signHostDeskToken({ draftId: 7, variant: 'b' }, { now, secret: SECRET });
		expect(verifyHostDeskToken(token, { now, secret: SECRET })).toEqual({
			draftId: 7,
			variant: 'b',
			expiresAt: now + HOST_DESK_TOKEN_MAX_AGE_MS
		});
		expect(verifyHostDeskToken(token, { now, secret: 'other' })).toBeNull();
		const [encoded, signature] = token.split('.');
		const forged = Buffer.from(
			JSON.stringify({ v: 1, draftId: 8, variant: 'a', expiresAt: now + 1000 })
		).toString('base64url');
		expect(verifyHostDeskToken(`${forged}.${signature}`, { now, secret: SECRET })).toBeNull();
		expect(verifyHostDeskToken(`${encoded}`, { now, secret: SECRET })).toBeNull();
		expect(verifyHostDeskToken(undefined, { now, secret: SECRET })).toBeNull();
	});

	it('expires after seven days', () => {
		const now = Date.parse('2026-09-06T13:00:00.000Z');
		const token = signHostDeskToken({ draftId: 7, variant: 'skip' }, { now, secret: SECRET });
		expect(
			verifyHostDeskToken(token, { now: now + HOST_DESK_TOKEN_MAX_AGE_MS - 1, secret: SECRET })
		).not.toBeNull();
		expect(
			verifyHostDeskToken(token, { now: now + HOST_DESK_TOKEN_MAX_AGE_MS + 1, secret: SECRET })
		).toBeNull();
	});
});

describe('buildHostDigestEmail', () => {
	it('escapes user text and links every action for each item', () => {
		const now = Date.parse('2026-09-06T13:00:00.000Z');
		const email = buildHostDigestEmail(
			[
				{ draftId: 11, candidate, draftA: 'dang <3', draftB: 'the "every day" part' },
				{
					draftId: 12,
					candidate: lowEffortCandidate,
					draftA: "lol what's the real one?",
					draftB: 'nice'
				}
			],
			{ now, secret: SECRET, baseUrl: 'https://9takes.test', olderPending: 3 }
		);

		expect(email.subject).toBe('Host desk: 2 new takes to answer');
		expect(email.htmlContent).toContain('Fake being happy. &lt;b&gt;every day&lt;/b&gt;');
		expect(email.htmlContent).not.toContain('<b>every day</b>');
		expect(email.htmlContent).toContain('dang &lt;3');
		expect(email.htmlContent).toContain('Type 6');
		expect(email.htmlContent).toContain('anonymous');
		expect(email.htmlContent).toContain('low effort');
		expect(email.htmlContent).toContain('3 older drafts still pending');
		expect(email.htmlContent).toContain('https://9takes.test/admin/host-desk');
		expect(email.htmlContent).toContain(
			'https://9takes.test/questions/whats-something-you-do-every-day'
		);

		const links = [
			...email.htmlContent.matchAll(/href="(https:\/\/9takes\.test\/host-desk\/[^"]+)"/g)
		].map((match) => match[1]);
		expect(links).toHaveLength(8);
		const variants = links.map((link) => {
			const token = decodeURIComponent(link.split('/host-desk/')[1]);
			return verifyHostDeskToken(token, { now, secret: SECRET });
		});
		expect(variants.map((v) => `${v?.draftId}:${v?.variant}`)).toEqual([
			'11:a',
			'11:b',
			'11:custom',
			'11:skip',
			'12:a',
			'12:b',
			'12:custom',
			'12:skip'
		]);

		expect(email.plainTextContent).toContain('Open & post A: https://9takes.test/host-desk/');
		expect(email.plainTextContent).toContain('Skip: https://9takes.test/host-desk/');
		expect(email.plainTextContent).toContain('Fake being happy. <b>every day</b>');
	});

	it('uses singular wording for one take', () => {
		const email = buildHostDigestEmail([{ draftId: 1, candidate, draftA: 'a', draftB: 'b' }], {
			now: Date.now(),
			secret: SECRET
		});
		expect(email.subject).toBe('Host desk: 1 new take to answer');
		expect(email.preheader).toContain('Fake being happy');
	});
});

describe('isLowEffortText', () => {
	it('flags tiny, punctuation-only and single-word takes', () => {
		expect(isLowEffortText('..')).toBe(true);
		expect(isLowEffortText('!!!')).toBe(true);
		expect(isLowEffortText('Nothing')).toBe(true);
		expect(isLowEffortText('Pooopin')).toBe(true);
		expect(isLowEffortText('Talking to my wife')).toBe(false);
		expect(isLowEffortText('Antidisestablishment')).toBe(false);
	});
});

type FakeSupabaseOptions = {
	candidates?: HostDigestCandidate[];
	lastDigestSentAt?: string | null;
	sendSucceeds?: boolean;
};

function fakeSupabase({ candidates = [], lastDigestSentAt = null }: FakeSupabaseOptions = {}) {
	const inserted: any[] = [];
	const updates: any[] = [];
	let nextId = 100;

	function chain(result: any) {
		const builder: any = {};
		const passthrough = ['select', 'eq', 'is', 'not', 'in', 'order', 'limit', 'insert', 'update'];
		for (const method of passthrough) {
			builder[method] = vi.fn(() => builder);
		}
		builder.maybeSingle = vi.fn(async () => result);
		builder.single = vi.fn(async () => result);
		builder.then = (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject);
		return builder;
	}

	const from = vi.fn((table: string) => {
		if (table !== 'host_reply_drafts') throw new Error(`Unexpected table ${table}`);
		const builder: any = {
			select: vi.fn((columns: string, opts?: { count?: string; head?: boolean }) => {
				if (opts?.head) return chain({ count: 0, error: null });
				if (columns === 'digest_sent_at') {
					return chain({
						data: lastDigestSentAt ? { digest_sent_at: lastDigestSentAt } : null,
						error: null
					});
				}
				return chain({ data: [], error: null });
			}),
			insert: vi.fn((value: any) => {
				const id = nextId++;
				inserted.push({ id, ...value });
				return chain({ data: { id }, error: null });
			}),
			update: vi.fn((value: any) => {
				const c = chain({ error: null });
				c.in = vi.fn((_column: string, ids: number[]) => {
					updates.push({ value, ids });
					return c;
				});
				return c;
			})
		};
		return builder;
	});

	const rpc = vi.fn(async (name: string, args: any) => {
		if (name === 'get_host_digest_candidates') {
			return { data: candidates, error: null, args };
		}
		throw new Error(`Unexpected RPC ${name}`);
	});

	return { supabase: { from, rpc }, from, rpc, inserted, updates };
}

describe('runHostDigest', () => {
	const now = () => new Date('2026-09-06T13:00:00.000Z');

	it('sends nothing when there are no candidates', async () => {
		const db = fakeSupabase();
		const send = vi.fn();
		const { llm } = fakeLlm([]);
		const summary = await runHostDigest({
			supabase: db.supabase,
			send,
			llm,
			now,
			hostUserId: 'host-id',
			recipient: 'dj@example.com',
			secret: SECRET
		});
		expect(summary.candidates).toBe(0);
		expect(summary.sent).toBe(false);
		expect(send).not.toHaveBeenCalled();
		expect(db.inserted).toHaveLength(0);
		expect(db.rpc).toHaveBeenCalledWith('get_host_digest_candidates', {
			p_host_user_id: 'host-id',
			p_since: '2026-09-04T13:00:00.000Z'
		});
	});

	it('drafts two candidates, sends one email, and stamps digest_sent_at', async () => {
		const db = fakeSupabase({
			candidates: [candidate, lowEffortCandidate],
			lastDigestSentAt: '2026-09-05T13:00:00.000Z'
		});
		const send = vi.fn(async () => ({ success: true, providerAttempted: true, retrySafe: false }));
		const { llm } = fakeLlm([
			{ drafts: [{ text: 'dang' }, { text: 'what does the fake version look like?' }] },
			{ drafts: [{ text: 'lol' }, { text: "what's the real one?" }] }
		]);

		const summary = await runHostDigest({
			supabase: db.supabase,
			send,
			llm,
			now,
			hostUserId: 'host-id',
			recipient: 'dj@example.com',
			secret: SECRET
		});

		expect(summary.candidates).toBe(2);
		expect(summary.drafted).toBe(2);
		expect(summary.sent).toBe(true);
		// Window starts an hour before the last digest so nothing falls in a gap.
		expect(summary.since).toBe('2026-09-05T12:00:00.000Z');
		expect(send).toHaveBeenCalledTimes(1);
		const sent = (send.mock.calls[0] as any[])[0];
		expect(sent.to).toBe('dj@example.com');
		expect(sent.subject).toBe('Host desk: 2 new takes to answer');
		expect(sent.emailKind).toBe('transactional');
		expect(sent.includeFooter).toBe(false);
		expect(sent.htmlContent).toContain('/host-desk/');
		expect(db.inserted.map((row) => row.comment_id)).toEqual([501, 502]);
		expect(db.updates).toHaveLength(1);
		expect(db.updates[0].ids).toEqual([100, 101]);
		expect(db.updates[0].value.digest_sent_at).toBe('2026-09-06T13:00:00.000Z');
	});

	it('keeps drafts unstamped when the send fails', async () => {
		const db = fakeSupabase({ candidates: [candidate] });
		const send = vi.fn(async () => ({
			success: false,
			error: 'boom',
			providerAttempted: true,
			retrySafe: true
		}));
		const { llm } = fakeLlm([{ drafts: [{ text: 'dang' }, { text: 'what happened?' }] }]);
		const summary = await runHostDigest({
			supabase: db.supabase,
			send,
			llm,
			now,
			hostUserId: 'host-id',
			recipient: 'dj@example.com',
			secret: SECRET
		});
		expect(summary.sent).toBe(false);
		expect(summary.error).toBe('boom');
		expect(db.updates).toHaveLength(0);
	});
});
