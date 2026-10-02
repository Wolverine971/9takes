// src/lib/server/hostDigest.spec.ts
import { describe, expect, it, vi } from 'vitest';
import {
	buildHostDigestEmail,
	createOpenRouterDraftLlm,
	draftHostReplies,
	HOST_DESK_TOKEN_MAX_AGE_MS,
	HOST_DRAFT_MODELS,
	hostDigestSince,
	isLowEffortText,
	parseDraftJson,
	runHostDigest,
	signHostDeskToken,
	validateHostDraft,
	verifyHostDeskToken,
	type DraftLlmRequest,
	type HostDigestCandidate
} from './hostDigest';

const SECRET = 'test-secret';
const DAY_MS = 24 * 60 * 60 * 1000;

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

/** A drafting LLM that replays canned replies; an Error entry is thrown. */
function fakeLlm(responses: unknown[], model = 'anthropic/claude-haiku-4.5') {
	const queue = [...responses];
	const draft = vi.fn(async (_request: DraftLlmRequest) => {
		const next = queue.shift();
		if (next instanceof Error) throw next;
		return { raw: next, model };
	});
	return { llm: { draft }, draft };
}

function goodDrafts(a = 'dang', b = 'what does the fake version look like?') {
	return { drafts: [{ text: a }, { text: b }] };
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
	it('returns two validated drafts and records the model that wrote them', async () => {
		const { llm, draft } = fakeLlm([
			goodDrafts('dang', 'the every day part is the brutal part. how long you been doing that?')
		]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(drafts.usedFallback).toBe(false);
		expect(drafts.draftA).toBe('dang');
		expect(drafts.draftB).toContain('every day');
		expect(drafts.usable).toHaveLength(2);
		expect(drafts.model).toBe('anthropic/claude-haiku-4.5');
		expect(drafts.failureReason).toBeNull();
		expect(draft).toHaveBeenCalledTimes(1);
		const call = draft.mock.calls[0][0];
		expect(call.systemPrompt).toContain('Never diagnose');
		expect(call.userPrompt).toContain('THEIR TAKE: Fake being happy.');
		expect(call.attempt).toBe(0);
		expect(call.timeoutMs).toBeLessThanOrEqual(25_000);
	});

	it('retries once when a draft fails validation, then keeps the good one', async () => {
		const { llm, draft } = fakeLlm([
			goodDrafts('I hear you — that is a lot', 'I hear you'),
			goodDrafts('oooofff', 'what does fake happy look like for you day to day?')
		]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(draft).toHaveBeenCalledTimes(2);
		expect(draft.mock.calls[1][0].attempt).toBe(1);
		expect(drafts.usedFallback).toBe(false);
		expect(drafts.draftA).toBe('oooofff');
	});

	it('falls back to safe templates and says why when the model keeps failing', async () => {
		const { llm } = fakeLlm([new Error('Request timeout after 25000ms'), { drafts: 'nope' }]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(drafts.usedFallback).toBe(true);
		expect(drafts.model).toBeNull();
		expect(drafts.usable).toEqual([]);
		expect(drafts.draftA).toBe('what made you go with that one?');
		expect(drafts.draftB).not.toBe(drafts.draftA);
		expect(drafts.failureReason).toContain('drafts rejected');
	});

	it('keeps the error message when every attempt throws', async () => {
		const { llm } = fakeLlm([new Error('x'), new Error('provider down')]);
		const drafts = await draftHostReplies(lowEffortCandidate, { llm });
		expect(drafts.draftA).toBe("lol what's the real one?");
		expect(drafts.draftB).toBe('nice');
		expect(drafts.failureReason).toBe('provider down');
	});

	it('marks a half-drafted take as fallback but keeps the real draft usable', async () => {
		const { llm } = fakeLlm([
			goodDrafts('dang that tracks', 'I hear you'),
			goodDrafts('dang that tracks', 'thank you for sharing')
		]);
		const drafts = await draftHostReplies(candidate, { llm });
		expect(drafts.usedFallback).toBe(true);
		expect(drafts.usable).toEqual(['dang that tracks']);
		expect(drafts.draftA).toBe('dang that tracks');
		expect(drafts.model).toBe('anthropic/claude-haiku-4.5');
	});

	it('makes no model call once the deadline has passed', async () => {
		const { llm, draft } = fakeLlm([goodDrafts()]);
		const drafts = await draftHostReplies(candidate, { llm, clock: () => 1_000, deadline: 1_500 });
		expect(draft).not.toHaveBeenCalled();
		expect(drafts.usable).toEqual([]);
		expect(drafts.failureReason).toContain('ran out of time');
	});

	it('caps each call at the time left before the deadline', async () => {
		const { llm, draft } = fakeLlm([goodDrafts()]);
		await draftHostReplies(candidate, { llm, clock: () => 0, deadline: 7_000 });
		expect(draft.mock.calls[0][0].timeoutMs).toBe(7_000);
	});
});

describe('parseDraftJson', () => {
	it('parses plain, fenced and padded JSON', () => {
		const expected = { drafts: [{ text: 'a' }, { text: 'b' }] };
		expect(parseDraftJson('{"drafts":[{"text":"a"},{"text":"b"}]}')).toEqual(expected);
		expect(parseDraftJson('```json\n{"drafts":[{"text":"a"},{"text":"b"}]}\n```')).toEqual(
			expected
		);
		expect(parseDraftJson('Sure!\n{"drafts":[{"text":"a"},{"text":"b"}]}')).toEqual(expected);
	});

	it('throws on replies that are not JSON', () => {
		expect(() => parseDraftJson('')).toThrow('no JSON object');
		// gemini-2.5-flash produced exactly this shape: unescaped inner quotes.
		expect(() => parseDraftJson('{"drafts":[{"text":"so "real" right"}]}')).toThrow(
			'not valid JSON'
		);
	});
});

describe('createOpenRouterDraftLlm', () => {
	const request: DraftLlmRequest = {
		systemPrompt: 'system',
		userPrompt: 'user',
		temperature: 0.8,
		attempt: 0,
		timeoutMs: 5_000,
		commentId: 501
	};

	function fakeFetch(body: unknown, init: { status?: number; raw?: string } = {}) {
		return vi.fn(
			async (_url: string | URL | Request, _init?: RequestInit) =>
				new Response(init.raw ?? JSON.stringify(body), { status: init.status ?? 200 })
		);
	}

	it('sends a non-reasoning model list with reasoning off and parses fenced replies', async () => {
		const fetchImpl = fakeFetch({
			model: 'anthropic/claude-haiku-4.5',
			choices: [
				{
					finish_reason: 'stop',
					message: { content: '```json\n{"drafts":[{"text":"dang"},{"text":"lol"}]}\n```' }
				}
			]
		});
		const llm = createOpenRouterDraftLlm({ apiKey: 'test-key', fetchImpl: fetchImpl as never });
		const result = await llm.draft(request);

		expect(result).toEqual({
			raw: { drafts: [{ text: 'dang' }, { text: 'lol' }] },
			model: 'anthropic/claude-haiku-4.5'
		});
		const [url, init] = fetchImpl.mock.calls[0];
		expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
		const body = JSON.parse(String(init?.body));
		expect(body.models).toEqual([...HOST_DRAFT_MODELS]);
		expect(body.models.join(',')).not.toContain('kimi');
		expect(body.reasoning).toEqual({ enabled: false });
		expect(body.response_format).toEqual({ type: 'json_object' });
		expect(init?.signal).toBeInstanceOf(AbortSignal);
		expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
	});

	it('leads with the other model on the retry', async () => {
		const fetchImpl = fakeFetch({
			model: 'openai/gpt-4.1-mini',
			choices: [{ message: { content: '{"drafts":[{"text":"a"},{"text":"b"}]}' } }]
		});
		const llm = createOpenRouterDraftLlm({ apiKey: 'k', fetchImpl: fetchImpl as never });
		await llm.draft({ ...request, attempt: 1 });
		const body = JSON.parse(String(fetchImpl.mock.calls[0][1]?.body));
		expect(body.models[0]).toBe(HOST_DRAFT_MODELS[1]);
	});

	it('throws on empty content, provider errors and HTTP failures', async () => {
		const empty = createOpenRouterDraftLlm({
			apiKey: 'k',
			fetchImpl: fakeFetch({
				model: 'moonshotai/kimi-k2.5',
				choices: [{ finish_reason: 'length', message: { content: '' } }]
			}) as never
		});
		await expect(empty.draft(request)).rejects.toThrow(
			'moonshotai/kimi-k2.5 returned empty content (finish_reason length)'
		);

		const providerError = createOpenRouterDraftLlm({
			apiKey: 'k',
			// OpenRouter can answer 200 with whitespace padding and an error body.
			fetchImpl: fakeFetch(null, {
				raw: '\n   \n{"error":{"message":"No endpoints found","code":404}}'
			}) as never
		});
		await expect(providerError.draft(request)).rejects.toThrow('No endpoints found');

		const httpError = createOpenRouterDraftLlm({
			apiKey: 'k',
			fetchImpl: fakeFetch(null, { status: 429, raw: 'rate limited' }) as never
		});
		await expect(httpError.draft(request)).rejects.toThrow('OpenRouter 429: rate limited');

		const noKey = createOpenRouterDraftLlm({ apiKey: '', fetchImpl: fakeFetch({}) as never });
		await expect(noKey.draft(request)).rejects.toThrow('PRIVATE_OPENROUTER_API_KEY');
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

function hostDeskLinks(html: string) {
	return [...html.matchAll(/href="(https:\/\/9takes\.test\/host-desk\/[^"]+)"/g)].map(
		(match) => match[1]
	);
}

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
		expect(email.htmlContent).not.toContain('Drafts failed');

		const variants = hostDeskLinks(email.htmlContent).map((link) => {
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

	it('still lists takes whose drafts failed, loudly, with no one-tap template', () => {
		const now = Date.parse('2026-09-06T13:00:00.000Z');
		const email = buildHostDigestEmail(
			[
				{ draftId: 21, candidate, draftA: null, draftB: null, failureReason: 'OpenRouter 503' },
				{ draftId: 22, candidate: lowEffortCandidate, draftA: 'lol', draftB: null }
			],
			{
				now,
				secret: SECRET,
				baseUrl: 'https://9takes.test',
				notices: ['The digest run that started 2026-09-05 13:00 UTC never finished']
			}
		);

		expect(email.subject).toBe('Host desk: 2 new takes to answer (drafts failed for 1)');
		expect(email.preheader).toContain('Drafting failed for 1 of 2 takes');
		expect(email.htmlContent).toContain('Drafting failed for 1 of 2 takes (OpenRouter 503)');
		expect(email.htmlContent).toContain('Drafts failed for this take.');
		expect(email.htmlContent).toContain('never finished');
		expect(email.htmlContent).toContain('Fake being happy.');
		expect(email.htmlContent).not.toContain('what made you go with that one?');

		const variants = hostDeskLinks(email.htmlContent).map((link) => {
			const token = decodeURIComponent(link.split('/host-desk/')[1]);
			const payload = verifyHostDeskToken(token, { now, secret: SECRET });
			return `${payload?.draftId}:${payload?.variant}`;
		});
		// The failed take offers only Write my own and Skip; the half-drafted one
		// offers its one real draft.
		expect(variants).toEqual(['21:custom', '21:skip', '22:a', '22:custom', '22:skip']);
		expect(email.plainTextContent).toContain('DRAFTS FAILED for this take: OpenRouter 503');
		expect(email.plainTextContent).toContain('!! Drafting failed for 1 of 2 takes');
	});

	it('says all takes failed in the subject when nothing drafted', () => {
		const email = buildHostDigestEmail(
			[{ draftId: 1, candidate, draftA: null, draftB: null, failureReason: 'timeout' }],
			{ now: Date.now(), secret: SECRET }
		);
		expect(email.subject).toBe('Host desk: 1 new take to answer (drafts failed)');
		expect(email.htmlContent).toContain('Drafting failed for this take (timeout)');
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

describe('hostDigestSince', () => {
	const now = Date.parse('2026-10-03T13:00:00.000Z');

	it('starts a day before the last digest', () => {
		expect(hostDigestSince(now, now - DAY_MS)).toBe('2026-10-01T13:00:00.000Z');
	});

	it('catches up across missed runs but never past 14 days', () => {
		// Last real digest went out 2026-09-13; the window stops at 09-19.
		expect(hostDigestSince(now, Date.parse('2026-09-13T13:00:14.354Z'))).toBe(
			'2026-09-19T13:00:00.000Z'
		);
		expect(hostDigestSince(now, null)).toBe('2026-09-19T13:00:00.000Z');
	});
});

type FakeSupabaseOptions = {
	candidates?: HostDigestCandidate[];
	lastDigestSentAt?: string | null;
	previousRun?: { id: number; created_at: string; context: Record<string, unknown> } | null;
	runLogFails?: boolean;
	candidatesError?: { message: string } | null;
	insertError?: (commentId: number) => { code?: string; message: string } | null;
};

function fakeSupabase({
	candidates = [],
	lastDigestSentAt = null,
	previousRun = null,
	runLogFails = false,
	candidatesError = null,
	insertError = () => null
}: FakeSupabaseOptions = {}) {
	const inserted: any[] = [];
	const updates: any[] = [];
	const runLog: any[] = [];
	let nextId = 100;
	let nextRunId = 900;

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

	const runLogError = { message: 'permission denied for table app_error_events' };

	const tables: Record<string, () => any> = {
		host_reply_drafts: () => ({
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
				const failure = insertError(value.comment_id);
				if (failure) return chain({ data: null, error: failure });
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
		}),
		app_error_events: () => ({
			select: vi.fn(() =>
				chain(runLogFails ? { data: null, error: runLogError } : { data: previousRun, error: null })
			),
			insert: vi.fn((value: any) => {
				if (runLogFails) return chain({ data: null, error: runLogError });
				const id = nextRunId++;
				runLog.push({ id, ...value });
				return chain({ data: { id }, error: null });
			}),
			update: vi.fn((value: any) => {
				const c = chain(runLogFails ? { error: runLogError } : { error: null });
				c.eq = vi.fn((_column: string, id: number) => {
					const row = runLog.find((entry) => entry.id === id);
					if (row && !runLogFails) Object.assign(row, value);
					return c;
				});
				return c;
			})
		})
	};

	const from = vi.fn((table: string) => {
		const factory = tables[table];
		if (!factory) throw new Error(`Unexpected table ${table}`);
		return factory();
	});

	const rpc = vi.fn(async (name: string, args: any) => {
		if (name === 'get_host_digest_candidates') {
			return { data: candidatesError ? null : candidates, error: candidatesError, args };
		}
		throw new Error(`Unexpected RPC ${name}`);
	});

	return { supabase: { from, rpc }, from, rpc, inserted, updates, runLog };
}

function okSend() {
	return vi.fn(async (_options: any) => ({
		success: true,
		providerAttempted: true,
		retrySafe: false
	}));
}

describe('runHostDigest', () => {
	const now = () => new Date('2026-09-06T13:00:00.000Z');
	const base = {
		now,
		hostUserId: 'host-id',
		recipient: 'dj@example.com',
		secret: SECRET
	};

	it('sends nothing when there are no candidates, and logs a healthy run', async () => {
		const db = fakeSupabase();
		const send = vi.fn();
		const { llm } = fakeLlm([]);
		const summary = await runHostDigest({ ...base, supabase: db.supabase, send, llm });
		expect(summary.candidates).toBe(0);
		expect(summary.status).toBe('no_takes');
		expect(summary.sent).toBe(false);
		expect(summary.alarm).toBe(false);
		expect(send).not.toHaveBeenCalled();
		expect(db.inserted).toHaveLength(0);
		// No digest has ever gone out: look back the full 14 days.
		expect(db.rpc).toHaveBeenCalledWith('get_host_digest_candidates', {
			p_host_user_id: 'host-id',
			p_since: '2026-08-23T13:00:00.000Z'
		});
		expect(db.runLog).toHaveLength(1);
		expect(db.runLog[0]).toMatchObject({
			source: 'host_digest',
			level: 'INFO',
			route: '/api/cron/host-digest'
		});
		expect(db.runLog[0].context).toMatchObject({ status: 'no_takes', trigger: 'manual' });
		expect(db.runLog[0].message).toContain('host digest no_takes');
	});

	it('drafts two candidates, sends one email, stamps digest_sent_at and logs the run', async () => {
		const db = fakeSupabase({
			candidates: [candidate, lowEffortCandidate],
			lastDigestSentAt: '2026-09-05T13:00:00.000Z'
		});
		const send = okSend();
		const { llm } = fakeLlm([goodDrafts(), goodDrafts('lol', "what's the real one?")]);

		const summary = await runHostDigest({
			...base,
			supabase: db.supabase,
			send,
			llm,
			trigger: 'cron'
		});

		expect(summary).toMatchObject({
			status: 'sent',
			candidates: 2,
			drafted: 2,
			modelDrafts: 2,
			failedDrafts: 0,
			sent: true,
			alarm: false
		});
		// Window starts a day before the last digest so nothing falls in a gap.
		expect(summary.since).toBe('2026-09-04T13:00:00.000Z');
		expect(send).toHaveBeenCalledTimes(1);
		const sent = send.mock.calls[0][0];
		expect(sent.to).toBe('dj@example.com');
		expect(sent.subject).toBe('Host desk: 2 new takes to answer');
		expect(sent.emailKind).toBe('transactional');
		expect(sent.includeFooter).toBe(false);
		expect(sent.htmlContent).toContain('/host-desk/');
		expect(db.inserted.map((row) => row.comment_id)).toEqual([501, 502]);
		expect(db.inserted.map((row) => row.model)).toEqual([
			'anthropic/claude-haiku-4.5',
			'anthropic/claude-haiku-4.5'
		]);
		expect(db.updates).toHaveLength(1);
		expect(db.updates[0].ids).toEqual([100, 101]);
		expect(db.updates[0].value.digest_sent_at).toBe('2026-09-06T13:00:00.000Z');
		expect(db.runLog).toHaveLength(1);
		expect(db.runLog[0].level).toBe('INFO');
		expect(db.runLog[0].context).toMatchObject({
			status: 'sent',
			trigger: 'cron',
			modelDrafts: 2,
			recipient: 'configured'
		});
	});

	it('still emails the takes when every draft fails, and raises the alarm', async () => {
		const db = fakeSupabase({ candidates: [candidate, lowEffortCandidate] });
		const send = okSend();
		const { llm } = fakeLlm([
			new Error('Request timeout after 25000ms'),
			new Error('Request timeout after 25000ms'),
			new Error('Request timeout after 25000ms'),
			new Error('Request timeout after 25000ms')
		]);

		const summary = await runHostDigest({ ...base, supabase: db.supabase, send, llm });

		expect(summary).toMatchObject({
			status: 'sent',
			candidates: 2,
			drafted: 2,
			modelDrafts: 0,
			failedDrafts: 2,
			sent: true,
			alarm: true
		});
		expect(summary.alarmReasons).toEqual(['2 new takes and 0 drafted']);
		expect(send).toHaveBeenCalledTimes(1);
		const sent = send.mock.calls[0][0];
		expect(sent.subject).toBe('Host desk: 2 new takes to answer (drafts failed)');
		expect(sent.htmlContent).toContain('Drafting failed for all 2 takes');
		expect(sent.htmlContent).toContain('Request timeout after 25000ms');
		expect(sent.htmlContent).toContain('Fake being happy.');
		expect(sent.htmlContent).not.toContain('Open &amp; post A');
		// Rows exist (fallback text, no model) so the takes are never re-offered.
		expect(db.inserted.map((row) => row.model)).toEqual([null, null]);
		expect(db.updates[0].ids).toEqual([100, 101]);
		expect(db.runLog[0].level).toBe('ERROR');
		expect(db.runLog[0].message).toContain('ALARM: 2 new takes and 0 drafted');
	});

	it('ships remaining takes undrafted when the drafting budget is spent', async () => {
		const db = fakeSupabase({ candidates: [candidate, lowEffortCandidate] });
		const send = okSend();
		const { llm, draft } = fakeLlm([goodDrafts(), goodDrafts()]);

		const summary = await runHostDigest({
			...base,
			supabase: db.supabase,
			send,
			llm,
			draftBudgetMs: 0
		});

		expect(draft).not.toHaveBeenCalled();
		expect(summary.failedDrafts).toBe(2);
		expect(summary.sent).toBe(true);
		expect(send.mock.calls[0][0].htmlContent).toContain('ran out of time');
	});

	it('keeps drafts unstamped and alarms when the send fails', async () => {
		const db = fakeSupabase({ candidates: [candidate] });
		const send = vi.fn(async () => ({
			success: false,
			error: 'boom',
			providerAttempted: true,
			retrySafe: true
		}));
		const { llm } = fakeLlm([goodDrafts()]);
		const summary = await runHostDigest({ ...base, supabase: db.supabase, send, llm });
		expect(summary.sent).toBe(false);
		expect(summary.status).toBe('send_failed');
		expect(summary.error).toBe('boom');
		expect(summary.alarm).toBe(true);
		expect(summary.alarmReasons).toEqual(['email failed: boom']);
		expect(db.updates).toHaveLength(0);
		expect(db.runLog[0].level).toBe('ERROR');
	});

	it('alarms when there are takes but no recipient', async () => {
		const db = fakeSupabase({ candidates: [candidate] });
		const send = okSend();
		const { llm } = fakeLlm([goodDrafts()]);
		const summary = await runHostDigest({
			...base,
			recipient: null,
			supabase: db.supabase,
			send,
			llm
		});
		expect(summary.status).toBe('no_recipient');
		expect(summary.alarm).toBe(true);
		expect(send).not.toHaveBeenCalled();
	});

	it('flags an earlier run that never finished, in the email and the log', async () => {
		const db = fakeSupabase({
			candidates: [candidate],
			previousRun: {
				id: 899,
				created_at: '2026-09-05T13:00:02.000Z',
				context: { status: 'running', trigger: 'cron' }
			}
		});
		const send = okSend();
		const { llm } = fakeLlm([goodDrafts()]);
		const summary = await runHostDigest({ ...base, supabase: db.supabase, send, llm });
		expect(summary.previousRunDied).toBe('2026-09-05T13:00:02.000Z');
		expect(send.mock.calls[0][0].htmlContent).toContain(
			'The digest run that started 2026-09-05 13:00 UTC never finished'
		);
		expect(db.runLog[0].level).toBe('WARN');
	});

	it('does not treat a recent running row (a concurrent run) as dead', async () => {
		const db = fakeSupabase({
			previousRun: {
				id: 899,
				created_at: '2026-09-06T12:58:00.000Z',
				context: { status: 'running' }
			}
		});
		const { llm } = fakeLlm([]);
		const summary = await runHostDigest({ ...base, supabase: db.supabase, send: okSend(), llm });
		expect(summary.previousRunDied).toBeNull();
	});

	it('keeps working when the run log cannot be written', async () => {
		const db = fakeSupabase({ candidates: [candidate], runLogFails: true });
		const send = okSend();
		const { llm } = fakeLlm([goodDrafts()]);
		const summary = await runHostDigest({ ...base, supabase: db.supabase, send, llm });
		expect(summary.sent).toBe(true);
		expect(db.runLog).toHaveLength(0);
	});

	it('counts real insert failures but not a concurrent run’s duplicate', async () => {
		const db = fakeSupabase({
			candidates: [candidate, lowEffortCandidate],
			insertError: (commentId) =>
				commentId === 501
					? { code: '23505', message: 'duplicate key' }
					: { code: '57014', message: 'statement timeout' }
		});
		const send = okSend();
		const { llm } = fakeLlm([goodDrafts(), goodDrafts()]);
		const summary = await runHostDigest({ ...base, supabase: db.supabase, send, llm });
		expect(summary.insertFailures).toBe(1);
		expect(summary.drafted).toBe(0);
		expect(summary.alarm).toBe(true);
		expect(summary.alarmReasons).toEqual(['1 take could not be saved to the desk']);
		expect(send).not.toHaveBeenCalled();
	});

	it('records a crashed run and rethrows', async () => {
		const db = fakeSupabase({ candidatesError: { message: 'function does not exist' } });
		const { llm } = fakeLlm([]);
		await expect(
			runHostDigest({ ...base, supabase: db.supabase, send: okSend(), llm })
		).rejects.toThrow('Failed to load host digest candidates: function does not exist');
		expect(db.runLog[0].level).toBe('ERROR');
		expect(db.runLog[0].context).toMatchObject({ status: 'crashed', alarm: true });
		expect(db.runLog[0].error_message).toContain('function does not exist');
	});
});
