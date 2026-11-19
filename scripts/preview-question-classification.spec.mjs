import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createJevClient } from './lib/jevClient.js';
import { classifyQuestion, readTaxonomy } from './preview-question-classification.mjs';

const header = 'key\tparent\tlabel\tscope';
const taxonomy = readTaxonomy(
	[
		header,
		'relationships\t\tRelationships\tHuman connections',
		'family\trelationships\tFamily\tFamily life',
		'parenting\tfamily\tParenting\tRaising children',
		'pressure\tparenting\tParental expectations\tA parent pushing a child',
		'culture\t\tCulture\tCultural activities',
		'sports\tculture\tSports\tOrganized sports',
		'youth\tsports\tYouth sports\tChildren playing sports'
	].join('\n')
);

function clientWith(scores) {
	return {
		decide: vi.fn(async (_state, batch) => ({
			answers: Object.fromEntries(
				Object.keys(batch).map((key) => [key, { type: 'score', score: scores[key] ?? 0 }])
			)
		}))
	};
}

describe('hierarchical question preview', () => {
	it('scores both upper levels together and descends each qualifying path independently', async () => {
		const client = clientWith({ family: 2.8, parenting: 2.8, pressure: 2.5, sports: 2, youth: 2 });
		const result = await classifyQuestion('Should my child keep playing soccer?', taxonomy, client);
		expect(client.decide.mock.calls.map(([, batch]) => Object.keys(batch))).toEqual([
			['relationships', 'family', 'culture', 'sports'],
			['parenting', 'youth'],
			['pressure']
		]);
		expect(result.matches.map(({ key }) => key)).toEqual(['pressure', 'youth']);
		expect(result.scores.culture.fit).toBe(0);
	});

	it('stops at a broad topic and leaves unvisited niches unscored', async () => {
		const client = clientWith({ family: 2, parenting: 1, culture: 3 });
		const result = await classifyQuestion('What is family life like?', taxonomy, client);
		expect(result.matches.map(({ key }) => key)).toEqual(['family']);
		expect(result.scores.pressure).toBeUndefined();
		expect(result.scores.youth).toBeUndefined();
	});

	it('can abstain and distinguishes missing judgments from low relevance', async () => {
		const { matches } = await classifyQuestion('Hi?', taxonomy, clientWith({}));
		expect(matches).toEqual([]);
		await expect(
			classifyQuestion('Hi?', taxonomy, {
				decide: async () => ({ answers: { relationships: { type: 'refusal' } } })
			})
		).rejects.toThrow('Missing or invalid Jev score');
	});

	it('rejects malformed hierarchies before sending questions', () => {
		expect(() => readTaxonomy(header + '\na\tb\tA\tA')).toThrow('Unknown parent');
		expect(() => readTaxonomy(header + '\na\tb\tA\tA\nb\ta\tB\tB')).toThrow('cycle');
		expect(() => readTaxonomy(header + '\na\t\tA\tA\na\t\tB\tB')).toThrow('duplicate');
	});

	it('retries an uncacheable decision and reuses a complete answer', async () => {
		const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-question-cache-'));
		const fetchImpl = vi
			.fn()
			.mockResolvedValueOnce(Response.json({ answers: { topic: { type: 'refusal' } } }))
			.mockResolvedValueOnce(Response.json({ answers: { topic: { type: 'score', score: 2 } } }));
		const client = createJevClient({
			apiKey: 'test',
			cacheDir,
			fetchImpl,
			isCacheable: (response) => response.answers.topic.type === 'score'
		});
		const batch = {
			topic: { type: 'score', instructions: 'Topic fit', criteria: ['Low', 'Medium', 'High'] }
		};
		try {
			expect((await client.decide('Question', batch)).answers.topic.type).toBe('refusal');
			expect((await client.decide('Question', batch)).cached).toBe(false);
			expect((await client.decide('Question', batch)).cached).toBe(true);
			expect(fetchImpl).toHaveBeenCalledTimes(2);
		} finally {
			fs.rmSync(cacheDir, { recursive: true, force: true });
		}
	});
});
