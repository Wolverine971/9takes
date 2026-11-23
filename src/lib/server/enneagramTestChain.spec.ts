// src/lib/server/enneagramTestChain.spec.ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('$lib/server/homepageLiveTake', () => ({ loadLiveTake: vi.fn() }));
vi.mock('$lib/server/homepageLiveTypes', () => ({ getLiveTakeTypes: vi.fn() }));
vi.mock('$lib/server/hostIdentity', () => ({ resolveHostUserId: () => 'host-dj' }));
vi.mock('$lib/email/sender', () => ({ sendEmail: vi.fn() }));
vi.mock('$lib/server/apiRateLimit', () => ({
	GLOBAL_RATE_LIMIT_SUBJECT: 'global',
	consumeApiRateLimit: vi.fn()
}));
vi.mock('$lib/utils/logger', () => ({ logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() } }));

import {
	buildTakeDigestEmail,
	describeDigestQuestion,
	pickChainQuestions,
	processTakeDigests
} from './enneagramTestChain';

const q = (id: number) => ({ id, url: `q-${id}`, question: `Question ${id}?` });
const POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(q);

describe('pickChainQuestions', () => {
	it('starts with the type’s own question, then walks the pool from that type', () => {
		const chain = pickChainQuestions([4], { 4: POOL[3] }, POOL);
		expect(chain.map((item) => item.url)).toEqual(['q-4', 'q-5', 'q-6']);
		expect(chain.every((item) => item.answeredAs === 4)).toBe(true);
	});

	it('asks a split result each type’s question, then a shared one with no type', () => {
		const chain = pickChainQuestions([5, 6], { 5: POOL[4], 6: POOL[5] }, POOL);
		expect(chain.map((item) => [item.url, item.answeredAs])).toEqual([
			['q-5', 5],
			['q-6', 6],
			['q-7', null]
		]);
	});

	it('never repeats a question and wraps around a short pool', () => {
		const chain = pickChainQuestions([9], { 9: POOL[0] }, POOL.slice(0, 3));
		expect(chain.map((item) => item.url)).toEqual(['q-1', 'q-3', 'q-2']);
	});

	it('returns what it can when there are fewer than three questions', () => {
		expect(pickChainQuestions([2], {}, POOL.slice(0, 1))).toHaveLength(1);
		expect(pickChainQuestions([2], {}, [])).toEqual([]);
	});
});

describe('digest wording', () => {
	it('names the types that answered and counts the rest', () => {
		expect(
			describeDigestQuestion({
				title: 'T',
				newTakes: 4,
				types: [4, 8],
				untyped: 2,
				replies: 0,
				hostReplied: false
			})
		).toBe("4 new takes from a 4, an 8 and 2 people who didn't pick a type.");
	});

	it('calls out DJ’s reply over a generic reply count', () => {
		expect(
			describeDigestQuestion({
				title: 'T',
				newTakes: 0,
				types: [],
				untyped: 0,
				replies: 2,
				hostReplied: true
			})
		).toBe('DJ replied to your take.');
	});

	it('links back to the result page, never carries take text, and offers a stop link', () => {
		const email = buildTakeDigestEmail({
			resultToken: 'r'.repeat(24),
			questions: [
				{
					title: 'What makes <you> quit?',
					newTakes: 1,
					types: [7],
					untyped: 0,
					replies: 0,
					hostReplied: false
				}
			]
		});
		expect(email.subject).toBe('New takes on “What makes <you> quit?”');
		expect(email.resultUrl).toBe(
			`https://9takes.com/enneagram-test/result/${'r'.repeat(24)}#answer-as`
		);
		expect(email.htmlContent).toContain('What makes &lt;you&gt; quit?');
		expect(email.htmlContent).toContain(email.stopUrl);
		expect(email.preheader).toBe('a 7 answered after you.');
	});
});

// ---------------------------------------------------------------------------
// processTakeDigests against a fake Supabase client
// ---------------------------------------------------------------------------

type Op = [string, ...unknown[]];

function fakeDb(handler: (table: string, ops: Op[]) => unknown) {
	const updates: { table: string; values: unknown; ops: Op[] }[] = [];
	const db = {
		from(table: string) {
			const ops: Op[] = [];
			let update: unknown = null;
			const builder: Record<string, unknown> = {};
			for (const method of ['select', 'eq', 'in', 'gt', 'not', 'order', 'limit']) {
				builder[method] = (...args: unknown[]) => {
					ops.push([method, ...args]);
					return builder;
				};
			}
			builder.update = (values: unknown) => {
				update = values;
				return builder;
			};
			builder.then = (resolve: (value: unknown) => void) => {
				if (update !== null) {
					updates.push({ table, values: update, ops });
					return resolve({ data: null, error: null });
				}
				return resolve({ data: handler(table, ops), error: null });
			};
			return builder;
		}
	};
	return { db, updates };
}

const RESULT = {
	id: 7,
	result_token: 't'.repeat(24),
	notify_email: 'me@example.com',
	notify_sent_count: 1
};

function follow(overrides: Record<string, unknown> = {}) {
	return {
		id: 70,
		result_id: 7,
		question_id: 40,
		comment_id: 100,
		fingerprint: 'fp-me',
		user_id: null,
		step: 1,
		last_seen_comment_id: 100,
		last_notified_at: null,
		enneagram_test_results: RESULT,
		...overrides
	};
}

function hasOp(ops: Op[], ...expected: unknown[]) {
	return ops.some((op) => JSON.stringify(op) === JSON.stringify(expected));
}

describe('processTakeDigests', () => {
	const send = vi.fn().mockResolvedValue({ success: true });
	const dependencies = {
		send,
		suppressedEmails: async () => new Set<string>(),
		emailBudget: async () => true
	};

	function world(comments: Record<string, unknown>[], follows = [follow()]) {
		return fakeDb((table, ops) => {
			if (table === 'enneagram_test_follows') return follows;
			if (table === 'questions')
				return [{ id: 40, url: 'q-40', question: 'Question 40?', question_formatted: null }];
			if (table === 'comments') {
				const kind = hasOp(ops, 'eq', 'parent_type', 'comment') ? 'comment' : 'question';
				return comments.filter((row) => row.parent_type === kind);
			}
			if (table === 'profiles') return [{ id: 'user-4', enneagram: 4 }];
			if (table === 'nine_user_takes')
				return [{ subject_slug: 'q-40', fingerprint: 'fp-eight', self_reported_type: 8 }];
			return [];
		});
	}

	it('emails new takes after the person’s own, with types, and advances the cursor', async () => {
		send.mockClear();
		const { db, updates } = world([
			{ id: 101, parent_type: 'question', parent_id: 40, author_id: 'user-4', fingerprint: null },
			{ id: 102, parent_type: 'question', parent_id: 40, author_id: null, fingerprint: 'fp-eight' },
			{ id: 103, parent_type: 'question', parent_id: 40, author_id: null, fingerprint: 'fp-x' },
			// Their own second take from the same device never counts.
			{ id: 104, parent_type: 'question', parent_id: 40, author_id: null, fingerprint: 'fp-me' },
			{ id: 105, parent_type: 'comment', parent_id: 100, author_id: 'host-dj', fingerprint: null }
		]);

		const summary = await processTakeDigests(db, dependencies);
		expect(summary).toMatchObject({ results: 1, sent: 1 });
		const message = send.mock.calls[0][0];
		expect(message.to).toBe('me@example.com');
		expect(message.plainTextContent).toContain(
			"3 new takes from a 4, an 8 and 1 person who didn't pick a type. DJ replied to your take."
		);
		expect(updates).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					table: 'enneagram_test_results',
					values: { notify_sent_count: 2 }
				}),
				expect.objectContaining({
					table: 'enneagram_test_follows',
					values: expect.objectContaining({ last_seen_comment_id: 105 })
				})
			])
		);
	});

	it('stays quiet when nothing is new', async () => {
		send.mockClear();
		const { db, updates } = world([
			{ id: 104, parent_type: 'question', parent_id: 40, author_id: null, fingerprint: 'fp-me' }
		]);
		const summary = await processTakeDigests(db, dependencies);
		expect(summary).toMatchObject({ results: 1, quiet: 1, sent: 0 });
		expect(send).not.toHaveBeenCalled();
		expect(updates).toEqual([]);
	});

	it('respects the per-result cap and leaves the cursor for later', async () => {
		send.mockClear();
		const capped = follow({ enneagram_test_results: { ...RESULT, notify_sent_count: 20 } });
		const { db, updates } = world(
			[{ id: 101, parent_type: 'question', parent_id: 40, author_id: null, fingerprint: 'fp-x' }],
			[capped]
		);
		const summary = await processTakeDigests(db, dependencies);
		expect(summary).toMatchObject({ skipped: 1, sent: 0 });
		expect(send).not.toHaveBeenCalled();
		expect(updates).toEqual([]);
	});
});
