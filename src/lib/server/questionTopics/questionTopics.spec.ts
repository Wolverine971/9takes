// src/lib/server/questionTopics/questionTopics.spec.ts
import { describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/private', () => ({ PRIVATE_OPENROUTER_API_KEY: 'or-test-key' }));
vi.mock('$lib/utils/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

import {
	QUESTION_TAXONOMY_HASH,
	createJevDecisionClient,
	fileQuestionUnderTopics,
	fileQuestionsNeedingTopics,
	listQuestionsNeedingTopics,
	questionTaxonomy,
	setQuestionTopics
} from './index';
import { TOPIC_MODEL, questionInputHash } from './classify.js';

/** A Jev stand-in: raw 0-3 scores by topic key, everything else 0. */
function jev(raw: Record<string, number>) {
	return {
		decide: vi.fn(async (_state: string, batch: Record<string, unknown>) => ({
			answers: Object.fromEntries(
				Object.keys(batch).map((key) => [key, { type: 'score', score: raw[key] ?? 0 }])
			)
		}))
	};
}

/** Minimal Supabase stand-in: canned table rows, recorded rpc calls. */
function database(tables: Record<string, unknown[]> = {}, rpcResult: unknown = { data: {} }) {
	const rpc = vi.fn(async () => ({ error: null, ...(rpcResult as object) }));
	const from = vi.fn((table: string) => {
		const rows = tables[table] ?? [];
		const chain: any = {
			select: () => chain,
			eq: () => chain,
			order: () => chain,
			range: async (start: number, end: number) => ({
				data: rows.slice(start, end + 1),
				error: null
			}),
			then: (resolve: (value: unknown) => unknown) => resolve({ data: rows, error: null })
		};
		return chain;
	});
	return { rpc, from };
}

describe('filing a question with Jev', () => {
	it('sends the topics, scores and hashes through the one writer', async () => {
		const db = database({}, { data: { applied: true, kept_manual: false } });
		const result = await fileQuestionUnderTopics(
			db,
			42,
			'How do you handle disagreements with close friends?',
			jev({ communication: 3, friends: 2.2, relationships: 3 })
		);

		expect(result.status).toBe('applied');
		expect(result.topics.map((topic) => topic.key)).toEqual(['communication', 'friends']);
		expect(db.rpc).toHaveBeenCalledTimes(1);
		const [name, args] = db.rpc.mock.calls[0] as unknown as [string, any];
		expect(name).toBe('apply_question_topics');
		expect(args.p_question_id).toBe(42);
		expect(args.p_source).toBe('jev');
		expect(args.p_topics).toEqual([
			{ key: 'communication', fit: 100 },
			{ key: 'friends', fit: 73 }
		]);
		expect(args.p_classification).toMatchObject({
			input_hash: questionInputHash('How do you handle disagreements with close friends?'),
			taxonomy_hash: QUESTION_TAXONOMY_HASH,
			model: TOPIC_MODEL
		});
		expect(Object.keys(args.p_classification.scores)).toHaveLength(questionTaxonomy.length);
	});

	it('records an abstention instead of guessing when nothing fits', async () => {
		const db = database({}, { data: { applied: true, kept_manual: false } });
		const result = await fileQuestionUnderTopics(db, 7, 'How do you do', jev({}));
		expect(result).toEqual({ status: 'abstained', topics: [] });
		expect((db.rpc.mock.calls[0] as unknown as [string, any])[1].p_topics).toEqual([]);
	});

	it('reports hand-picked topics as kept', async () => {
		const db = database({}, { data: { applied: false, kept_manual: true } });
		const result = await fileQuestionUnderTopics(db, 7, 'Who is your friend?', jev({ friends: 3 }));
		expect(result.status).toBe('kept_manual');
	});

	it('throws when saving fails or Jev gives no usable score, so the cron retries', async () => {
		const failing = database({}, { data: null, error: { message: 'function missing' } });
		await expect(
			fileQuestionUnderTopics(failing, 7, 'Who is your friend?', jev({ friends: 3 }))
		).rejects.toThrow('Failed to save question topics: function missing');

		const db = database();
		await expect(
			fileQuestionUnderTopics(db, 7, 'Who is your friend?', {
				decide: async () => ({ answers: {} })
			})
		).rejects.toThrow('Missing or invalid Jev score');
		expect(db.rpc).not.toHaveBeenCalled();
	});
});

describe('a hand-picked topic change', () => {
	it('writes through the same function with the picker as the source', async () => {
		const db = database({ question_category_tags: [{ tag_id: 1004 }] });
		expect(await setQuestionTopics(db, 42, [1010, 1004, 1010], 'owner')).toBe(true);
		expect(db.rpc).toHaveBeenCalledWith('apply_question_topics', {
			p_question_id: 42,
			p_topics: [{ id: 1004 }, { id: 1010 }],
			p_source: 'owner'
		});
	});

	it('does nothing when the picks match what is filed, so Jev topics stay Jev topics', async () => {
		const db = database({ question_category_tags: [{ tag_id: 1010 }, { tag_id: 1004 }] });
		expect(await setQuestionTopics(db, 42, [1004, 1010], 'admin')).toBe(false);
		expect(db.rpc).not.toHaveBeenCalled();
	});
});

describe('finding questions that need topics', () => {
	const current = (id: number, text: string) => ({
		question_id: id,
		input_hash: questionInputHash(text),
		taxonomy_hash: QUESTION_TAXONOMY_HASH
	});
	const tables = {
		questions: [
			{ id: 5, question: 'Hidden and new', question_formatted: null, flagged: true },
			{ id: 4, question: 'Edited since it was filed', question_formatted: null, flagged: false },
			{
				id: 3,
				question: 'Filed under an older directory',
				question_formatted: null,
				flagged: null
			},
			{ id: 2, question: 'Already current', question_formatted: null, flagged: false },
			{ id: 1, question: null, question_formatted: '  Only a formatted copy  ', flagged: false },
			{ id: 0, question: '   ', question_formatted: null, flagged: false }
		],
		question_classifications: [
			current(4, 'The wording before the edit'),
			{ ...current(3, 'Filed under an older directory'), taxonomy_hash: 'older' },
			current(2, 'Already current')
		]
	};

	it('lists missing and stale ones, visible questions first, newest first', async () => {
		expect(await listQuestionsNeedingTopics(database(tables), 10)).toEqual([
			{ id: 4, text: 'Edited since it was filed' },
			{ id: 3, text: 'Filed under an older directory' },
			{ id: 1, text: 'Only a formatted copy' },
			{ id: 5, text: 'Hidden and new' }
		]);
		expect(await listQuestionsNeedingTopics(database(tables), 2)).toHaveLength(2);
	});

	it('keeps going past a question that fails', async () => {
		const db = database(tables, { data: { applied: true } });
		const client = jev({ friends: 3 });
		client.decide.mockRejectedValueOnce(new Error('Jev 503'));
		const result = await fileQuestionsNeedingTopics(db, 3, client);
		expect(result.candidates).toBe(3);
		expect(result.errors).toEqual([{ id: 4, error: 'Jev 503' }]);
		expect(result.filed.map((row) => row.id)).toEqual([3, 1]);
	});
});

describe('the Jev client', () => {
	const batch = { topic: { type: 'score', instructions: 'Fit', criteria: ['Low', 'High'] } };

	it('posts a Decisions request and retries a server error', async () => {
		const fetchImpl = vi
			.fn()
			.mockResolvedValueOnce(new Response('busy', { status: 503 }))
			.mockResolvedValueOnce(Response.json({ answers: { topic: { type: 'score', score: 2 } } }));
		const client = createJevDecisionClient('key', fetchImpl as unknown as typeof fetch);
		const result = await client.decide('{"discussion_question":"Hi"}', batch);

		expect(result.answers?.topic.score).toBe(2);
		expect(fetchImpl).toHaveBeenCalledTimes(2);
		const [url, init] = fetchImpl.mock.calls[0];
		expect(url).toBe('https://openrouter.ai/api/alpha/decisions');
		expect(init.headers.Authorization).toBe('Bearer key');
		expect(JSON.parse(init.body)).toEqual({
			model: TOPIC_MODEL,
			state: '{"discussion_question":"Hi"}',
			questions: batch
		});
	});

	it('does not retry a request the API rejects outright', async () => {
		const fetchImpl = vi.fn().mockResolvedValue(new Response('bad model', { status: 400 }));
		const client = createJevDecisionClient('key', fetchImpl as unknown as typeof fetch);
		await expect(client.decide('state', batch)).rejects.toThrow('Jev 400: bad model');
		expect(fetchImpl).toHaveBeenCalledTimes(1);
	});
});
