// src/lib/server/questionAnswerSummary.spec.ts
//
// All take text below is invented for the test. Real takes never belong in
// this (public) repo.
import { describe, expect, it, vi } from 'vitest';
import {
	ANSWER_SUMMARY_TABLE,
	buildSummaryUserPrompt,
	findCopiedProperNoun,
	findVerbatimSpan,
	generateAnswerSummary,
	getQuestionAnswerSummary,
	hasQuestionAnswerSummary,
	loadHumanTakes,
	refreshQuestionSummaries,
	validateSummary,
	type SummaryLlm,
	type SummaryQuestion,
	type SummaryTake
} from './questionAnswerSummary';

// ---------------------------------------------------------------------------
// In-memory stand-in for the slice of supabase-js this module uses
// ---------------------------------------------------------------------------
type Row = Record<string, any>;

function fakeDb(tables: Record<string, Row[]>, options: { missing?: string[] } = {}) {
	const writes: Array<{ table: string; op: string; payload?: Row; filters: string[] }> = [];
	const selects: Array<{ table: string; columns: string }> = [];

	function from(table: string) {
		const filters: Array<(row: Row) => boolean> = [];
		const filterNames: string[] = [];
		let op: 'select' | 'delete' | 'upsert' = 'select';
		let payload: Row | undefined;
		let single = false;
		let range: [number, number] | null = null;

		const builder: any = {
			select(columns: string) {
				selects.push({ table, columns });
				return builder;
			},
			eq(column: string, value: unknown) {
				filters.push((row) => row[column] === value);
				filterNames.push(`${column}=${value}`);
				return builder;
			},
			not(column: string, _operator: string, value: unknown) {
				filters.push((row) => row[column] !== value);
				return builder;
			},
			in(column: string, values: unknown[]) {
				filters.push((row) => values.includes(row[column]));
				return builder;
			},
			order() {
				return builder;
			},
			range(start: number, end: number) {
				range = [start, end];
				return builder;
			},
			maybeSingle() {
				single = true;
				return builder;
			},
			delete() {
				op = 'delete';
				return builder;
			},
			upsert(row: Row) {
				op = 'upsert';
				payload = row;
				return builder;
			},
			then(resolve: (value: unknown) => void, reject: (reason: unknown) => void) {
				return Promise.resolve()
					.then(() => {
						if (options.missing?.includes(table)) {
							return { data: null, error: { message: `relation "${table}" does not exist` } };
						}
						const rows = tables[table] ?? (tables[table] = []);
						if (op === 'delete') {
							writes.push({ table, op, filters: filterNames });
							tables[table] = rows.filter((row) => !filters.every((test) => test(row)));
							return { data: null, error: null };
						}
						if (op === 'upsert') {
							writes.push({ table, op, payload, filters: filterNames });
							// PostgREST merge-duplicates: only the sent columns change;
							// a new row takes the column defaults.
							const current = rows.find((row) => row.question_id === payload?.question_id);
							tables[table] = [
								...rows.filter((row) => row.question_id !== payload?.question_id),
								{
									summary: null,
									source_comment_count: 0,
									failed_comment_count: null,
									...current,
									...payload
								}
							];
							return { data: null, error: null };
						}
						let result = rows.filter((row) => filters.every((test) => test(row)));
						if (range) result = result.slice(range[0], range[1] + 1);
						if (single) return { data: result[0] ?? null, error: null };
						return { data: result, error: null };
					})
					.then(resolve, reject);
			}
		};
		return builder;
	}

	return { db: { from }, writes, selects, tables };
}

const QUESTION: SummaryQuestion = {
	id: 1,
	url: 'kid-in-3-words',
	text: 'What were you like as a kid, in three words?',
	context: null
};

const take = (id: number, text: string, extra: Partial<SummaryTake> = {}): SummaryTake => ({
	id,
	text,
	personKey: `f:${id}`,
	type: null,
	createdAt: `2026-09-${String(10 + id).padStart(2, '0')}T00:00:00.000Z`,
	...extra
});

const GOOD_SUMMARY =
	'Twelve answers so far, and the room splits cleanly between kids who watched and kids who acted. ' +
	'The watchers describe hanging back at parties, reading the mood of a room before stepping in, and ' +
	'keeping a running tally of who was upset with whom. The actors describe climbing things they were ' +
	'told to leave alone and talking their way out of trouble afterward. Typed answers cluster: the Fours ' +
	'lean toward private worlds and invented games, while the Sevens list adventures and broken rules. ' +
	'Almost nobody brought the duty lens a One usually brings, the kid who kept score of the rules ' +
	'themselves. Read the takes below and see which side you landed on.';

// ---------------------------------------------------------------------------

describe('verbatim guard', () => {
	const source = 'I was the kid who hid under the porch reading comics all summer long';

	it('catches a 6-word run regardless of case and punctuation', () => {
		const summary = 'Several said they Hid, under the porch reading comics, every chance they got.';
		expect(findVerbatimSpan(summary, [source])).toBe('hid under the porch reading comics');
	});

	it('allows 5-word overlaps', () => {
		expect(findVerbatimSpan('Some hid under the porch reading at night.', [source])).toBeNull();
	});

	it('ignores runs that also appear in the public question text', () => {
		const question = 'What were you like as a kid in three words';
		const takeEchoingQuestion = 'what were you like as a kid in three words? loud';
		const summary = 'Asked what were you like as a kid in three words, most went loud.';
		expect(
			findVerbatimSpan(summary, [takeEchoingQuestion], { allowedTexts: [question] })
		).toBeNull();
	});
});

describe('proper noun guard', () => {
	it('catches a name or place copied from a take', () => {
		const sources = ['grew up near Dayton and my sister Marisol ran everything'];
		expect(findCopiedProperNoun('A few answers name Marisol as the boss.', sources)).toBe(
			'Marisol'
		);
		expect(findCopiedProperNoun('A few grew up around Dayton.', sources)).toBe('Dayton');
	});

	it('ignores sentence-initial words and common capitalized words', () => {
		const sources = ['Curious, Quiet, Stubborn', 'went to church because God and Mom said so'];
		expect(findCopiedProperNoun('Quiet came up a lot. Curious too.', sources)).toBeNull();
		expect(
			findCopiedProperNoun('Several mention God and a Mom who set the rules.', sources)
		).toBeNull();
	});
});

describe('validateSummary', () => {
	const takes = ['I was the kid who hid under the porch reading comics all summer long'];

	it('accepts a clean paraphrase and scrubs dashes', () => {
		const result = validateSummary(GOOD_SUMMARY.replace('acted. ', 'acted — '), {
			takes,
			question: QUESTION
		});
		expect(result.ok).toBe(true);
		if (result.ok) expect(result.text).not.toMatch(/[—–]/);
	});

	it('rejects quotes, links, handles, lists, banned phrases and length', () => {
		const check = (text: string) => validateSummary(text, { takes, question: QUESTION });
		expect(check(`${GOOD_SUMMARY} One said "never".`).ok).toBe(false);
		expect(check(`${GOOD_SUMMARY} See https://example.com`).ok).toBe(false);
		expect(check(`${GOOD_SUMMARY} Shout out to @kiddo.`).ok).toBe(false);
		expect(check(`- ${GOOD_SUMMARY}`).ok).toBe(false);
		expect(check(`${GOOD_SUMMARY} Let us delve into it.`).ok).toBe(false);
		expect(check('Too short to be useful.').ok).toBe(false);
		expect(check(Array(240).fill('word').join(' ')).ok).toBe(false);
	});

	it('rejects singling out one answer once a thread has 3+ takes', () => {
		const three = ['first invented take', 'second invented take', 'third invented take'];
		for (const tail of [
			'The outlier wanted a cabin.',
			'Only one answer treats leaving as a gift.',
			'One answer pointed at the sea.',
			'Some want quiet, while another wants company.'
		]) {
			expect(
				validateSummary(`${GOOD_SUMMARY} ${tail}`, { takes: three, question: QUESTION })
			).toMatchObject({ ok: false, reason: 'singled out one answer' });
		}
		expect(
			validateSummary(`${GOOD_SUMMARY} Another split runs between quiet and loud.`, {
				takes: three,
				question: QUESTION
			}).ok
		).toBe(true);
		// On a one-take thread, "one answer" is just the count.
		const thin = `${GOOD_SUMMARY} One answer so far.`;
		expect(validateSummary(thin, { takes: ['only take'], question: QUESTION }).ok).toBe(true);
	});

	it('rejects verbatim reuse, keeping the user words out of the loggable reason', () => {
		const result = validateSummary(`${GOOD_SUMMARY} One kid hid under the porch reading comics.`, {
			takes,
			question: QUESTION
		});
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.reason).not.toMatch(/porch/);
			expect(result.feedback).toMatch(/hid under the porch reading comics/);
		}
	});
});

describe('generateAnswerSummary', () => {
	const takes = [take(1, 'I was the kid who hid under the porch reading comics all summer long')];

	it('retries once with feedback when the first draft copies an answer', async () => {
		const llm = vi
			.fn<SummaryLlm>()
			.mockResolvedValueOnce({
				content: JSON.stringify({
					summary: `${GOOD_SUMMARY} Someone hid under the porch reading comics.`
				}),
				model: 'm1'
			})
			.mockResolvedValueOnce({
				content: `\`\`\`json\n{"summary": ${JSON.stringify(GOOD_SUMMARY)}}\n\`\`\``,
				model: 'm2'
			});

		const result = await generateAnswerSummary({ question: QUESTION, takes, aiTakes: [], llm });

		expect(result).toMatchObject({ ok: true, model: 'm2', attempts: 2 });
		expect(llm.mock.calls[1][0].userPrompt).toMatch(/YOUR LAST DRAFT WAS REJECTED/);
		expect(llm.mock.calls[0][0].userPrompt).not.toMatch(/REJECTED/);
	});

	it('gives up after the retries and returns a reason without user text', async () => {
		const llm = vi.fn<SummaryLlm>().mockResolvedValue({
			content: JSON.stringify({
				summary: `${GOOD_SUMMARY} Someone hid under the porch reading comics.`
			}),
			model: 'm1'
		});
		const result = await generateAnswerSummary({ question: QUESTION, takes, aiTakes: [], llm });
		expect(result.ok).toBe(false);
		expect(llm).toHaveBeenCalledTimes(3);
		if (!result.ok) expect(result.reason).not.toMatch(/porch/);
	});

	it('survives a transport error on the first attempt', async () => {
		const llm = vi
			.fn<SummaryLlm>()
			.mockRejectedValueOnce(new Error('OpenRouter 502'))
			.mockResolvedValueOnce({ content: JSON.stringify({ summary: GOOD_SUMMARY }), model: 'm1' });
		await expect(
			generateAnswerSummary({ question: QUESTION, takes, aiTakes: [], llm })
		).resolves.toMatchObject({ ok: true });
	});
});

describe('buildSummaryUserPrompt', () => {
	it('counts people per type and only marks types with 2+ people as nameable', () => {
		const prompt = buildSummaryUserPrompt({
			question: QUESTION,
			takes: [
				take(1, 'loud', { type: 8, personKey: 'a:x' }),
				take(2, 'bossy', { type: 8, personKey: 'a:x' }),
				take(3, 'quiet', { type: 4, personKey: 'a:y' }),
				take(4, 'dreamy', { type: 4, personKey: 'a:z' }),
				take(5, 'curious')
			],
			aiTakes: [{ type: 6, text: 'Always checking the exits.' }]
		});
		expect(prompt).toMatch(/Type 8: 2 answers from 1 person \(only one person: never name/);
		expect(prompt).toMatch(/Type 4: 2 answers from 2 people \(name freely\)/);
		expect(prompt).toMatch(/No type on profile: 1 answer/);
		expect(prompt).toMatch(/5 answers from 4 different people/);
		expect(prompt).toMatch(/AI REFERENCE TAKES \(not answers/);
		expect(prompt).not.toMatch(/a:x|a:y|f:5/);
	});

	it('tells the model not to retell a thin thread', () => {
		const prompt = buildSummaryUserPrompt({
			question: QUESTION,
			takes: [take(1, 'loud')],
			aiTakes: []
		});
		expect(prompt).toMatch(/THIN THREAD/);
	});
});

describe('page reads', () => {
	it('returns the stored summary, or null when the table is missing', async () => {
		const { db } = fakeDb({
			[ANSWER_SUMMARY_TABLE]: [
				{
					question_id: 1,
					summary: 'Gist.',
					source_comment_count: 4,
					model: 'm',
					generated_at: '2026-10-07T00:00:00Z'
				}
			]
		});
		await expect(getQuestionAnswerSummary(db, 1)).resolves.toEqual({
			summary: 'Gist.',
			sourceCommentCount: 4,
			generatedAt: '2026-10-07T00:00:00Z'
		});
		await expect(getQuestionAnswerSummary(db, 2)).resolves.toBeNull();
		await expect(hasQuestionAnswerSummary(db, 1)).resolves.toBe(true);

		const missing = fakeDb({}, { missing: [ANSWER_SUMMARY_TABLE] }).db;
		await expect(getQuestionAnswerSummary(missing, 1)).resolves.toBeNull();
		await expect(hasQuestionAnswerSummary(missing, 1)).resolves.toBe(false);
	});

	it('existence check never selects the summary text', async () => {
		const { db, selects } = fakeDb({ [ANSWER_SUMMARY_TABLE]: [] });
		await hasQuestionAnswerSummary(db, 1);
		expect(selects).toEqual([{ table: ANSWER_SUMMARY_TABLE, columns: 'question_id' }]);
	});
});

// ---------------------------------------------------------------------------
// Source data + refresh run
// ---------------------------------------------------------------------------
function seedTables(): Record<string, Row[]> {
	const comment = (id: number, parentId: number, extra: Row = {}) => ({
		id,
		parent_id: parentId,
		parent_type: 'question',
		comment: `invented take number ${id}`,
		author_id: null,
		fingerprint: `fp-${id}`,
		created_at: `2026-09-${String(id).padStart(2, '0')}T00:00:00.000Z`,
		removed: false,
		...extra
	});
	return {
		questions: [
			{
				id: 1,
				url: 'q-one',
				question: 'q one',
				question_formatted: 'Question one?',
				context: 'ctx',
				data: { userProvidedContext: true },
				flagged: false,
				removed: false
			},
			{
				id: 2,
				url: 'q-two',
				question: 'q two',
				question_formatted: null,
				context: null,
				data: {},
				flagged: null,
				removed: null
			},
			{
				id: 3,
				url: 'q-three',
				question: 'q three',
				question_formatted: null,
				context: null,
				data: {},
				flagged: false,
				removed: false
			},
			{
				id: 4,
				url: 'q-flagged',
				question: 'flagged',
				question_formatted: null,
				context: null,
				data: {},
				flagged: true,
				removed: false
			}
		],
		comments: [
			comment(1, 1, { author_id: 'u1' }),
			comment(2, 1, { author_id: 'u2' }),
			comment(3, 1, { removed: true }),
			comment(4, 1, { comment: '   ' }),
			comment(5, 1),
			comment(6, 1, { parent_type: 'comment' }),
			comment(7, 2),
			comment(8, 2),
			comment(9, 4)
		],
		flagged_comments: [
			{ comment_id: 5, cleared_at: null },
			{ comment_id: 2, cleared_at: '2026-09-20T00:00:00Z' }
		],
		profiles: [
			{ id: 'u1', enneagram: '4' },
			{ id: 'u2', enneagram: 'unknown' },
			{ id: 'host-a', enneagram: '8', admin: true },
			{ id: 'host-b', enneagram: '8', admin: true }
		],
		comments_ai: [
			{ question_id: 1, enneagram_type: '6', comment: 'AI six take' },
			{ question_id: 1, enneagram_type: 'x', comment: 'bad type' }
		],
		[ANSWER_SUMMARY_TABLE]: [
			// Up to date: question 2 still has 2 human takes.
			{
				question_id: 2,
				summary: 'old two',
				source_comment_count: 2,
				model: 'm',
				generated_at: 'x'
			},
			// Question 3 has no human takes left: must be deleted.
			{
				question_id: 3,
				summary: 'old three',
				source_comment_count: 1,
				model: 'm',
				generated_at: 'x'
			}
		]
	};
}

describe('loadHumanTakes', () => {
	it('keeps top-level, unremoved, non-empty, unreported takes and their profile types', async () => {
		const { db } = fakeDb(seedTables());
		const takes = await loadHumanTakes(db, [1, 2]);
		expect(takes.get(1)?.map((row) => row.id)).toEqual([1, 2]);
		expect(takes.get(1)?.map((row) => row.type)).toEqual([4, null]);
		expect(takes.get(1)?.[0].personKey).toBe('a:u1');
		expect(takes.get(2)?.map((row) => row.personKey)).toEqual(['f:fp-7', 'f:fp-8']);
	});

	it('treats every admin account as one person (the host)', async () => {
		const tables = seedTables();
		tables.comments.push(
			{
				id: 40,
				parent_id: 3,
				parent_type: 'question',
				comment: 'invented host take a',
				author_id: 'host-a',
				fingerprint: null,
				created_at: '2026-09-28T00:00:00.000Z',
				removed: false
			},
			{
				id: 41,
				parent_id: 3,
				parent_type: 'question',
				comment: 'invented host take b',
				author_id: 'host-b',
				fingerprint: null,
				created_at: '2026-09-29T00:00:00.000Z',
				removed: false
			}
		);
		const takes = (await loadHumanTakes(fakeDb(tables).db, [3])).get(3) ?? [];
		expect(takes.map((row) => [row.personKey, row.type])).toEqual([
			['host', 8],
			['host', 8]
		]);
		const prompt = buildSummaryUserPrompt({ question: QUESTION, takes, aiTakes: [] });
		expect(prompt).toMatch(/Type 8: 2 answers from 1 person \(only one person: never name/);
	});
});

describe('refreshQuestionSummaries', () => {
	const goodLlm = () =>
		vi.fn<SummaryLlm>().mockResolvedValue({
			content: JSON.stringify({ summary: GOOD_SUMMARY }),
			model: 'test-model'
		});

	it('regenerates only changed questions, deletes empty ones, skips flagged ones', async () => {
		const { db, writes, tables } = fakeDb(seedTables());
		const llm = goodLlm();
		const report = await refreshQuestionSummaries({
			db,
			llm,
			now: () => Date.parse('2026-10-07T12:00:00Z')
		});

		expect(report.liveQuestions).toBe(3);
		expect(report.generated).toEqual([
			{ questionId: 1, sourceCommentCount: 2, model: 'test-model' }
		]);
		expect(report.deleted).toEqual([3]);
		expect(llm).toHaveBeenCalledTimes(1);
		expect(llm.mock.calls[0][0].userPrompt).toMatch(/AI six take/);
		const stored = tables[ANSWER_SUMMARY_TABLE].find((row) => row.question_id === 1);
		expect(stored).toMatchObject({
			source_comment_count: 2,
			model: 'test-model',
			generated_at: '2026-10-07T12:00:00.000Z'
		});
		expect(writes.map((write) => write.op)).toEqual(['delete', 'upsert']);
	});

	it('dry run writes nothing and tolerates a missing table', async () => {
		const { db, writes } = fakeDb(seedTables(), { missing: [ANSWER_SUMMARY_TABLE] });
		const seen: number[] = [];
		const report = await refreshQuestionSummaries({
			db,
			llm: goodLlm(),
			dryRun: true,
			onGenerated: (result) => {
				seen.push(result.question.id);
			}
		});
		expect(writes).toEqual([]);
		expect(seen.sort()).toEqual([1, 2]);
		expect(report.dryRun).toBe(true);
	});

	it('a real run refuses to regenerate blindly when the table is missing', async () => {
		const { db } = fakeDb(seedTables(), { missing: [ANSWER_SUMMARY_TABLE] });
		await expect(refreshQuestionSummaries({ db, llm: goodLlm() })).rejects.toThrow(
			/existing summaries/
		);
	});

	it('respects the per-run limit and the time budget', async () => {
		const { db } = fakeDb(seedTables());
		const llm = goodLlm();
		const limited = await refreshQuestionSummaries({ db, llm, limit: 0, force: true });
		expect(limited.attempted).toBe(0);
		expect(limited.deferred).toBe(2);

		let clock = 0;
		const budgeted = await refreshQuestionSummaries({
			db: fakeDb(seedTables()).db,
			llm: vi.fn<SummaryLlm>().mockImplementation(async () => {
				clock += 10_000;
				return { content: JSON.stringify({ summary: GOOD_SUMMARY }), model: 'm' };
			}),
			force: true,
			budgetMs: 5_000,
			now: () => clock
		});
		expect(budgeted.attempted).toBe(1);
		expect(budgeted.deferred).toBe(1);
	});

	it('records a failure and does not retry until the take count changes', async () => {
		const tables = seedTables();
		// Question 2 had a good summary at 1 take; it now has 2.
		tables[ANSWER_SUMMARY_TABLE][0].source_comment_count = 1;
		const failing = vi.fn<SummaryLlm>().mockRejectedValue(new Error('OpenRouter 500'));
		const first = await refreshQuestionSummaries({
			db: fakeDb(tables).db,
			llm: failing,
			now: () => Date.parse('2026-10-07T12:00:00Z')
		});
		expect(first.failed.map((failure) => failure.questionId).sort()).toEqual([1, 2]);
		const row2 = tables[ANSWER_SUMMARY_TABLE].find((row) => row.question_id === 2);
		// The older summary stays up; the failure is remembered beside it.
		expect(row2).toMatchObject({
			summary: 'old two',
			source_comment_count: 1,
			failed_comment_count: 2
		});
		const row1 = tables[ANSWER_SUMMARY_TABLE].find((row) => row.question_id === 1);
		expect(row1).toMatchObject({ summary: null, failed_comment_count: 2 });
		// A failure-only row is not a gist.
		await expect(getQuestionAnswerSummary(fakeDb(tables).db, 1)).resolves.toBeNull();
		await expect(hasQuestionAnswerSummary(fakeDb(tables).db, 1)).resolves.toBe(false);

		const callsAfterFirst = failing.mock.calls.length;
		const second = await refreshQuestionSummaries({ db: fakeDb(tables).db, llm: failing });
		expect(second.needingWork).toBe(0);
		expect(failing.mock.calls.length).toBe(callsAfterFirst);

		// A new take changes the count: try again, and clear the failure on success.
		tables.comments.push({
			id: 30,
			parent_id: 1,
			parent_type: 'question',
			comment: 'another invented take',
			author_id: null,
			fingerprint: 'fp-30',
			created_at: '2026-09-30T00:00:00.000Z',
			removed: false
		});
		const third = await refreshQuestionSummaries({ db: fakeDb(tables).db, llm: goodLlm() });
		expect(third.generated.map((item) => item.questionId)).toEqual([1]);
		expect(tables[ANSWER_SUMMARY_TABLE].find((row) => row.question_id === 1)).toMatchObject({
			source_comment_count: 3,
			failed_comment_count: null
		});
	});

	it('deletes the old summary when a take was removed and regeneration fails', async () => {
		const tables = seedTables();
		tables[ANSWER_SUMMARY_TABLE].push({
			question_id: 1,
			summary: 'old one',
			source_comment_count: 3,
			model: 'm',
			generated_at: 'x'
		});
		const { db } = fakeDb(tables);
		const report = await refreshQuestionSummaries({
			db,
			llm: vi.fn<SummaryLlm>().mockRejectedValue(new Error('OpenRouter 500'))
		});
		expect(report.failed.map((failure) => failure.questionId)).toEqual([1]);
		expect(report.deleted).toContain(1);
	});
});
