// src/lib/server/enneagramTest.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { consumeApiRateLimitMock } = vi.hoisted(() => ({ consumeApiRateLimitMock: vi.fn() }));

vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));
vi.mock('$lib/server/apiRateLimit', () => ({
	GLOBAL_RATE_LIMIT_SUBJECT: 'global',
	consumeApiRateLimit: consumeApiRateLimitMock
}));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import {
	NOTIFY_EMAIL_CAP,
	assignQuestionsToTypes,
	buildFriendReadEmail,
	buildResultEmail,
	consumeTestEmailBudget,
	createTestResult,
	friendReadInputSchema,
	generateToken,
	getReadContext,
	getTestResult,
	getTestResultTypes,
	isReadToken,
	isResultToken,
	safeReaderDisplayName,
	sendTestResultEmail,
	submitFriendRead,
	testResultInputSchema,
	testResultUpdateSchema,
	updateTestResult
} from './enneagramTest';

type Query = {
	table: string;
	action: 'select' | 'insert' | 'update';
	payload: unknown;
	filters: Array<[string, string, unknown]>;
};
type Handler = (query: Query) => { data?: unknown; error?: { code?: string; message?: string } };

/** Minimal chainable stand-in for the supabase-js query builder. */
function fakeDb(handler: Handler) {
	const queries: Query[] = [];
	const db = {
		from(table: string) {
			const query: Query = { table, action: 'select', payload: null, filters: [] };
			queries.push(query);
			const builder: Record<string, unknown> = {};
			const chain = () => builder;
			builder.select = chain;
			builder.insert = (payload: unknown) => (
				(query.action = 'insert'),
				(query.payload = payload),
				builder
			);
			builder.update = (payload: unknown) => (
				(query.action = 'update'),
				(query.payload = payload),
				builder
			);
			builder.eq = (column: string, value: unknown) => (
				query.filters.push(['eq', column, value]),
				builder
			);
			builder.in = (column: string, value: unknown) => (
				query.filters.push(['in', column, value]),
				builder
			);
			builder.not = (column: string, op: string, value: unknown) => (
				query.filters.push([`not.${op}`, column, value]),
				builder
			);
			builder.order = chain;
			builder.limit = chain;
			builder.maybeSingle = chain;
			builder.single = chain;
			builder.then = (
				resolve: (value: unknown) => unknown,
				reject?: (reason: unknown) => unknown
			) =>
				Promise.resolve()
					.then(() => {
						const response = handler(query);
						return { data: response.data ?? null, error: response.error ?? null };
					})
					.then(resolve, reject);
			return builder;
		}
	};
	return { db, queries };
}

const validInput = {
	types: [6],
	emotion: 'fear' as const,
	strength: 'fear' as const,
	path: { altPrompt: false, mismatch: null, noneFit: false, tiebreak: null }
};

const allowed = { allowed: true, retryAfterSeconds: 86400, degraded: false };
const denied = { allowed: false, retryAfterSeconds: 86400, degraded: false };

beforeEach(() => {
	consumeApiRateLimitMock.mockReset();
	consumeApiRateLimitMock.mockResolvedValue(allowed);
});

describe('tokens', () => {
	it('generates URL-safe tokens that pass their own patterns', () => {
		const result = generateToken(18);
		const read = generateToken(9);
		expect(result).toHaveLength(24);
		expect(read).toHaveLength(12);
		expect(isResultToken(result)).toBe(true);
		expect(isReadToken(read)).toBe(true);
	});

	it('rejects short or unsafe tokens', () => {
		expect(isResultToken('short')).toBe(false);
		expect(isReadToken('abc/def?ghi=jk')).toBe(false);
	});
});

describe('schemas', () => {
	it('accepts a finished result with one or two distinct types', () => {
		expect(testResultInputSchema.safeParse(validInput).success).toBe(true);
		expect(testResultInputSchema.safeParse({ ...validInput, types: [5, 6] }).success).toBe(true);
	});

	it('rejects duplicate, out-of-range, too many, or unknown fields', () => {
		expect(testResultInputSchema.safeParse({ ...validInput, types: [6, 6] }).success).toBe(false);
		expect(testResultInputSchema.safeParse({ ...validInput, types: [10] }).success).toBe(false);
		expect(testResultInputSchema.safeParse({ ...validInput, types: [1, 2, 3] }).success).toBe(
			false
		);
		expect(testResultInputSchema.safeParse({ ...validInput, email: 'x@y.z' }).success).toBe(false);
	});

	it('cleans names and notes to one line and caps them', () => {
		const parsed = friendReadInputSchema.parse({
			pickedType: 6,
			emotion: 'fear',
			strength: 'fear',
			readerName: '  Mom\n\t ',
			note: 'You  plan\nfor everything'
		});
		expect(parsed.readerName).toBe('Mom');
		expect(parsed.note).toBe('You plan for everything');
		expect(
			friendReadInputSchema.safeParse({
				pickedType: 6,
				emotion: 'fear',
				strength: 'fear',
				note: 'x'.repeat(281)
			}).success
		).toBe(false);
	});

	it('needs something to update and a real email', () => {
		expect(testResultUpdateSchema.safeParse({}).success).toBe(false);
		expect(testResultUpdateSchema.safeParse({ notifyEmail: 'nope' }).success).toBe(false);
		expect(testResultUpdateSchema.parse({ notifyEmail: ' Me@Example.com ' }).notifyEmail).toBe(
			'me@example.com'
		);
		expect(testResultUpdateSchema.safeParse({ notifyEmail: '' }).success).toBe(true);
	});

	it('sends the result only with an email, and saves to a profile on its own', () => {
		expect(testResultUpdateSchema.safeParse({ sendResult: true }).success).toBe(false);
		expect(testResultUpdateSchema.safeParse({ notifyEmail: '', sendResult: true }).success).toBe(
			false
		);
		expect(
			testResultUpdateSchema.safeParse({ notifyEmail: 'me@example.com', sendResult: true }).success
		).toBe(true);
		expect(testResultUpdateSchema.safeParse({ saveToProfile: true }).success).toBe(true);
		expect(testResultUpdateSchema.safeParse({ saveToProfile: false }).success).toBe(false);
	});
});

describe('createTestResult', () => {
	it('stores the picks with fresh tokens', async () => {
		const { db, queries } = fakeDb(() => ({}));
		const tokens = await createTestResult(db, testResultInputSchema.parse(validInput));
		expect(isResultToken(tokens.resultToken)).toBe(true);
		expect(isReadToken(tokens.readToken)).toBe(true);
		expect(queries[0].payload).toMatchObject({ types: [6], emotion: 'fear', strength: 'fear' });
	});

	it('retries once when a token collides', async () => {
		let calls = 0;
		const { db } = fakeDb(() => (++calls === 1 ? { error: { code: '23505' } } : {}));
		await expect(
			createTestResult(db, testResultInputSchema.parse(validInput))
		).resolves.toBeTruthy();
		expect(calls).toBe(2);
	});
});

describe('getTestResult', () => {
	it('returns null for a malformed token without querying', async () => {
		const { db, queries } = fakeDb(() => ({}));
		expect(await getTestResult(db, 'bad')).toBeNull();
		expect(queries).toHaveLength(0);
	});

	it('returns picks, the friend link token, and reads in order', async () => {
		const { db } = fakeDb((query) =>
			query.table === 'enneagram_test_results'
				? {
						data: {
							id: 7,
							created_at: '2026-10-06T00:00:00Z',
							read_token: 'readtoken123',
							types: [5, 6],
							emotion: 'fear',
							strength: 'fear',
							display_name: ' Jordan ',
							notify_email: 'me@example.com',
							notify_sent_count: 0
						}
					}
				: {
						data: [
							{ picked_type: 6, reader_name: 'Mom', note: '', created_at: '2026-10-06T01:00:00Z' },
							{ picked_type: 99, reader_name: null, note: null, created_at: '2026-10-06T02:00:00Z' }
						]
					}
		);
		const view = await getTestResult(db, generateToken(18));
		expect(view).toMatchObject({
			types: [5, 6],
			displayName: 'Jordan',
			readToken: 'readtoken123',
			notifyOn: true
		});
		expect(view?.reads).toEqual([
			{ pickedType: 6, readerName: 'Mom', note: null, createdAt: '2026-10-06T01:00:00Z' }
		]);
	});
});

describe('getReadContext', () => {
	it('shows the friend only the name, never the picks', async () => {
		const { db, queries } = fakeDb(() => ({ data: { display_name: 'Jordan' } }));
		expect(await getReadContext(db, 'readtoken123')).toEqual({ displayName: 'Jordan' });
		expect(queries[0].filters).toContainEqual(['eq', 'read_token', 'readtoken123']);
	});
});

describe('updateTestResult', () => {
	it('opts in with a normalized email and opts out with an empty one', async () => {
		const { db, queries } = fakeDb(() => ({ data: { id: 1 } }));
		const token = generateToken(18);
		expect(await updateTestResult(db, token, { notifyEmail: 'me@example.com' })).toBe(true);
		expect(queries[0].payload).toMatchObject({ notify_email: 'me@example.com' });
		await updateTestResult(db, token, { notifyEmail: '' });
		expect(queries[1].payload).toMatchObject({ notify_email: null, notify_opted_in_at: null });
	});

	it('reports a missing result', async () => {
		const { db } = fakeDb(() => ({ data: null }));
		expect(await updateTestResult(db, generateToken(18), { displayName: 'Jo' })).toBe(false);
	});
});

describe('submitFriendRead', () => {
	const read = friendReadInputSchema.parse({
		pickedType: 6,
		emotion: 'fear',
		strength: 'fear',
		readerName: 'Mom',
		note: 'You plan for everything'
	});

	function resultRow(overrides: Record<string, unknown> = {}) {
		return {
			id: 7,
			result_token: 'r'.repeat(24),
			types: [5, 6],
			display_name: 'Jordan',
			notify_email: 'me@example.com',
			notify_sent_count: 0,
			...overrides
		};
	}

	it('saves the read, reveals the picks, and emails an opted-in test-taker', async () => {
		const { db, queries } = fakeDb((query) => {
			if (query.table === 'enneagram_test_results' && query.action === 'select') {
				return { data: resultRow() };
			}
			if (query.table === 'enneagram_test_reads' && query.action === 'insert') {
				return { data: { id: 11 } };
			}
			return {};
		});
		const send = vi
			.fn()
			.mockResolvedValue({ success: true, providerAttempted: true, retrySafe: false });
		const outcome = await submitFriendRead(db, 'readtoken123', read, {
			send,
			suppressedEmails: async () => new Set()
		});

		expect(outcome).toEqual({ types: [5, 6], displayName: 'Jordan', notified: true });
		expect(queries.find((q) => q.action === 'insert')?.payload).toMatchObject({
			result_id: 7,
			picked_type: 6,
			reader_name: 'Mom'
		});
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({ to: 'me@example.com', subject: 'Mom read you as a 6' })
		);
		expect(queries.some((q) => q.action === 'update' && q.table === 'enneagram_test_results')).toBe(
			true
		);
	});

	it('does not email suppressed, capped, or opted-out addresses', async () => {
		for (const [row, suppressed] of [
			[resultRow(), new Set(['me@example.com'])],
			[resultRow({ notify_sent_count: NOTIFY_EMAIL_CAP }), new Set<string>()],
			[resultRow({ notify_email: null }), new Set<string>()]
		] as const) {
			const { db } = fakeDb((query) =>
				query.action === 'select' ? { data: row } : { data: { id: 1 } }
			);
			const send = vi.fn();
			const outcome = await submitFriendRead(db, 'readtoken123', read, {
				send,
				suppressedEmails: async () => suppressed
			});
			expect(outcome?.notified).toBe(false);
			expect(send).not.toHaveBeenCalled();
		}
	});

	it('saves the read and skips the email quietly once the daily send budget is spent', async () => {
		const { db, queries } = fakeDb((query) =>
			query.action === 'select' ? { data: resultRow() } : { data: { id: 1 } }
		);
		const send = vi.fn();
		const outcome = await submitFriendRead(db, 'readtoken123', read, {
			send,
			suppressedEmails: async () => new Set(),
			emailBudget: async () => false
		});

		expect(outcome).toEqual({ types: [5, 6], displayName: 'Jordan', notified: false });
		expect(queries.some((q) => q.action === 'insert' && q.table === 'enneagram_test_reads')).toBe(
			true
		);
		expect(send).not.toHaveBeenCalled();
		expect(queries.some((q) => q.action === 'update')).toBe(false);
	});

	it('charges the default budget to the recipient address, not to the result', async () => {
		const { db } = fakeDb((query) =>
			query.action === 'select' ? { data: resultRow() } : { data: { id: 1 } }
		);
		consumeApiRateLimitMock.mockResolvedValueOnce(denied);
		const send = vi.fn();
		const outcome = await submitFriendRead(db, 'readtoken123', read, {
			send,
			suppressedEmails: async () => new Set()
		});

		expect(outcome?.notified).toBe(false);
		expect(send).not.toHaveBeenCalled();
		expect(consumeApiRateLimitMock).toHaveBeenCalledTimes(1);
		expect(consumeApiRateLimitMock).toHaveBeenCalledWith({
			bucket: 'enneagram_test_email_recipient',
			subject: 'email:me@example.com'
		});
	});

	it('never puts the friend’s note or raw name in the email', async () => {
		const { db } = fakeDb((query) =>
			query.action === 'select' ? { data: resultRow() } : { data: { id: 1 } }
		);
		const send = vi
			.fn()
			.mockResolvedValue({ success: true, providerAttempted: true, retrySafe: false });
		const loud = friendReadInputSchema.parse({
			pickedType: 6,
			emotion: 'fear',
			strength: 'fear',
			readerName: 'Visit promo.example now',
			note: 'Claim it at https://promo.example/win today'
		});
		await submitFriendRead(db, 'readtoken123', loud, {
			send,
			suppressedEmails: async () => new Set(),
			emailBudget: async () => true
		});

		const message = send.mock.calls[0][0];
		expect(message.subject).toBe('A friend read you as a 6');
		for (const part of [message.subject, message.htmlContent, message.plainTextContent]) {
			expect(part).not.toContain('promo');
			expect(part).not.toContain('Claim');
		}
		expect(message.plainTextContent).toContain('They left you a note. It’s on your result page.');
	});

	it('keeps the read when the email fails', async () => {
		const { db } = fakeDb((query) =>
			query.action === 'select' ? { data: resultRow() } : { data: { id: 1 } }
		);
		const send = vi.fn().mockRejectedValue(new Error('smtp down'));
		const outcome = await submitFriendRead(db, 'readtoken123', read, {
			send,
			suppressedEmails: async () => new Set()
		});
		expect(outcome).toMatchObject({ types: [5, 6], notified: false });
	});

	it('returns null for an unknown link', async () => {
		const { db } = fakeDb(() => ({ data: null }));
		expect(await submitFriendRead(db, 'readtoken123', read)).toBeNull();
	});
});

describe('consumeTestEmailBudget', () => {
	it('charges the recipient address, then the site-wide total', async () => {
		expect(await consumeTestEmailBudget('me@example.com')).toBe(true);
		expect(consumeApiRateLimitMock.mock.calls.map(([args]) => args)).toEqual([
			{ bucket: 'enneagram_test_email_recipient', subject: 'email:me@example.com' },
			{ bucket: 'enneagram_test_email_global', subject: 'global' }
		]);
	});

	it('stops at a spent recipient budget without touching the site-wide total', async () => {
		consumeApiRateLimitMock.mockResolvedValueOnce(denied);
		expect(await consumeTestEmailBudget('me@example.com')).toBe(false);
		expect(consumeApiRateLimitMock).toHaveBeenCalledTimes(1);
	});

	it('refuses when the site-wide total is spent', async () => {
		consumeApiRateLimitMock.mockResolvedValueOnce(allowed).mockResolvedValueOnce(denied);
		expect(await consumeTestEmailBudget('me@example.com')).toBe(false);
	});
});

describe('safeReaderDisplayName', () => {
	it('keeps ordinary names', () => {
		for (const name of [
			'Mom',
			'Mary-Jane O’Neil',
			"D'Angelo",
			'José Núñez',
			'李小龍',
			'St. John'
		]) {
			expect(safeReaderDisplayName(name)).toBe(name.replace('.', ''));
		}
	});

	it('drops everything but letters, spaces, apostrophes and hyphens', () => {
		expect(safeReaderDisplayName('<b>Sam</b>')).toBe('b Sam b');
		expect(safeReaderDisplayName('Sam 💥 #1!!')).toBe('Sam');
		expect(safeReaderDisplayName('  Sam \n  Lee ')).toBe('Sam Lee');
	});

	it('caps the name at 30 characters', () => {
		expect(safeReaderDisplayName('a'.repeat(40))).toBe('a'.repeat(30));
	});

	it('falls back to "A friend" for empty or link-shaped names', () => {
		for (const name of [
			null,
			'',
			'   ',
			'12345',
			'!!!',
			'promo.example',
			'Visit promo.example now',
			'https://promo.example/win',
			'www.promo',
			'sam@example.com',
			'ｐｒｏｍｏ．ｅｘａｍｐｌｅ'
		]) {
			expect(safeReaderDisplayName(name)).toBe('A friend');
		}
	});
});

describe('buildFriendReadEmail', () => {
	it('shows a cleaned name and the pick, and none of the friend’s own words', () => {
		const email = buildFriendReadEmail({
			resultToken: 'r'.repeat(24),
			readerName: '<b>Sam</b>',
			pickedType: 8,
			types: [5, 6],
			hasNote: true
		});
		expect(email.subject).toBe('b Sam b read you as an 8');
		expect(email.htmlContent).not.toContain('<b>');
		expect(email.htmlContent).toContain('an 8 (The Challenger)');
		expect(email.htmlContent).toContain('They left you a note.');
		expect(email.plainTextContent).toContain('You picked a 5 or a 6.');
		expect(email.stopUrl).toContain('/api/enneagram-test/stop/');
	});

	it('says nothing about a note when there is none, and names a nameless friend', () => {
		const email = buildFriendReadEmail({
			resultToken: 'r'.repeat(24),
			readerName: null,
			pickedType: 8,
			types: [5],
			hasNote: false
		});
		expect(email.subject).toBe('A friend read you as an 8');
		expect(email.htmlContent).not.toContain('note');
		expect(email.plainTextContent).not.toContain('note');
	});
});

describe('assignQuestionsToTypes', () => {
	const fallback = [1, 2, 3].map((n) => ({ url: `q-${n}`, question: `Question ${n}?` }));

	it('prefers DJ’s curated pick, then spreads types across the fallback list', () => {
		const assigned = assignQuestionsToTypes(
			[5, 6],
			{ 6: { url: 'curated', question: 'C?' } },
			fallback
		);
		expect(assigned[6]?.url).toBe('curated');
		expect(assigned[5]?.url).toBe('q-2');
	});

	it('returns nothing when there are no questions', () => {
		expect(assignQuestionsToTypes([6], {}, [])).toEqual({});
	});
});

describe('sendTestResultEmail', () => {
	const token = 'r'.repeat(24);
	const sentOk = { success: true, providerAttempted: true, retrySafe: false };

	function row(overrides: Record<string, unknown> = {}) {
		return {
			id: 7,
			result_token: token,
			types: [4],
			notify_email: 'Me@Example.com',
			notify_sent_count: 0,
			...overrides
		};
	}

	it('emails the private link once and counts it against the per-result cap', async () => {
		const { db, queries } = fakeDb((query) => (query.action === 'select' ? { data: row() } : {}));
		const send = vi.fn().mockResolvedValue(sentOk);
		const outcome = await sendTestResultEmail(db, token, {
			send,
			suppressedEmails: async () => new Set()
		});

		expect(outcome).toBe('sent');
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'me@example.com',
				subject: 'Your Enneagram result: most likely a 4',
				emailKind: 'transactional'
			})
		);
		expect(queries.find((q) => q.action === 'update')?.payload).toEqual({ notify_sent_count: 1 });
	});

	it('sends nothing to suppressed, capped, missing, or unknown results', async () => {
		for (const [data, suppressed, expected] of [
			[row(), new Set(['me@example.com']), 'suppressed'],
			[row({ notify_sent_count: NOTIFY_EMAIL_CAP }), new Set<string>(), 'capped'],
			[row({ notify_email: null }), new Set<string>(), 'no_email'],
			[null, new Set<string>(), 'no_email']
		] as const) {
			const { db, queries } = fakeDb(() => ({ data }));
			const send = vi.fn();
			const outcome = await sendTestResultEmail(db, token, {
				send,
				suppressedEmails: async () => suppressed
			});
			expect(outcome).toBe(expected);
			expect(send).not.toHaveBeenCalled();
			expect(queries.some((q) => q.action === 'update')).toBe(false);
		}
	});

	it('reports a spent daily send budget as capped and sends nothing', async () => {
		const { db, queries } = fakeDb((query) => (query.action === 'select' ? { data: row() } : {}));
		const send = vi.fn();
		const emailBudget = vi.fn().mockResolvedValue(false);
		const outcome = await sendTestResultEmail(db, token, {
			send,
			suppressedEmails: async () => new Set(),
			emailBudget
		});

		expect(outcome).toBe('capped');
		expect(emailBudget).toHaveBeenCalledWith('me@example.com');
		expect(send).not.toHaveBeenCalled();
		expect(queries.some((q) => q.action === 'update')).toBe(false);
	});

	it('reports a failed send without counting it', async () => {
		const { db, queries } = fakeDb((query) => (query.action === 'select' ? { data: row() } : {}));
		const send = vi.fn().mockResolvedValue({ success: false, error: 'smtp down' });
		expect(
			await sendTestResultEmail(db, token, { send, suppressedEmails: async () => new Set() })
		).toBe('failed');
		expect(queries.some((q) => q.action === 'update')).toBe(false);
	});
});

describe('buildResultEmail', () => {
	it('names one type and links only to the private result and the stop link', () => {
		const email = buildResultEmail({ resultToken: 'r'.repeat(24), types: [8] });
		expect(email.subject).toBe('Your Enneagram result: most likely an 8');
		expect(email.htmlContent).toContain('landed on an 8 (The Challenger).');
		expect(email.htmlContent).toContain(`href="${email.resultUrl}"`);
		expect(email.resultUrl).toBe(`https://9takes.com/enneagram-test/result/${'r'.repeat(24)}`);
		expect(email.plainTextContent).toContain('3. Read the Type 8 page.');
		expect(email.stopUrl).toContain('/api/enneagram-test/stop/');
	});

	it('keeps a two-type result as two types', () => {
		const email = buildResultEmail({ resultToken: 'r'.repeat(24), types: [5, 6] });
		expect(email.subject).toBe('Your Enneagram result: between a 5 and a 6');
		expect(email.plainTextContent).toContain(
			'landed between a 5 (The Investigator) and a 6 (The Loyalist).'
		);
		expect(email.plainTextContent).toContain('1. Answer one question as a 5 or a 6,');
	});
});

describe('getTestResultTypes', () => {
	it('returns the picks for a real token and null otherwise', async () => {
		const { db } = fakeDb(() => ({ data: { types: [5, 6] } }));
		expect(await getTestResultTypes(db, 'r'.repeat(24))).toEqual([5, 6]);
		expect(await getTestResultTypes(db, 'nope')).toBeNull();
		const { db: empty } = fakeDb(() => ({ data: null }));
		expect(await getTestResultTypes(empty, 'r'.repeat(24))).toBeNull();
	});
});
