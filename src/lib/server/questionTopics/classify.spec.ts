// src/lib/server/questionTopics/classify.spec.ts
import { describe, expect, it, vi } from 'vitest';
import taxonomyFile from '$lib/data/questionTaxonomy.json';
import {
	TOPIC_RUBRIC,
	buildTaxonomy,
	classifyQuestion,
	questionInputHash,
	selectTopics,
	taxonomyHash
} from './classify.js';

const sources = [
	{ key: 'relationships', parent: null, label: 'Relationships', scope: 'Human connections' },
	{ key: 'family', parent: 'relationships', label: 'Family', scope: 'Family life' },
	{ key: 'parenting', parent: 'family', label: 'Parenting', scope: 'Raising children' },
	{ key: 'pressure', parent: 'parenting', label: 'Parental pressure', scope: 'Pushing a child' },
	{ key: 'romance', parent: 'relationships', label: 'Dating', scope: 'Partners' },
	{ key: 'marriage', parent: 'romance', label: 'Marriage', scope: 'Being married' },
	{ key: 'friends', parent: 'relationships', label: 'Friendship', scope: 'Friends' },
	{ key: 'talk', parent: 'relationships', label: 'Communication', scope: 'Speaking up' },
	{ key: 'culture', parent: null, label: 'Culture', scope: 'Cultural activities' },
	{ key: 'sports', parent: 'culture', label: 'Sports', scope: 'Organized sports' },
	{ key: 'youth', parent: 'sports', label: 'Youth sports', scope: 'Children playing sports' },
	{ key: 'media', parent: 'culture', label: 'Media', scope: 'Online culture' }
];
const taxonomy = buildTaxonomy(sources);

/** Scores are given on the 0-100 fit scale; unlisted topics score 0. */
const scores = (fits: Record<string, number>) =>
	Object.fromEntries(
		sources.map(({ key }) => [key, { fit: fits[key] ?? 0, confidence: null }])
	) as Record<string, { fit: number; confidence: number | null }>;
const keys = (fits: Record<string, number>) =>
	selectTopics(scores(fits), taxonomy).topics.map((topic) => topic.key);

function clientWith(raw: Record<string, number>) {
	return {
		decide: vi.fn(async (_state: string, batch: Record<string, unknown>) => ({
			answers: Object.fromEntries(
				Object.keys(batch).map((key) => [key, { type: 'score', score: raw[key] ?? 0 }])
			)
		}))
	};
}

describe('question topic directory', () => {
	it('ships a valid directory whose headings all have topics', () => {
		const shipped = buildTaxonomy(taxonomyFile.topics);
		const roots = shipped.filter((topic) => topic.depth === 1);
		expect(roots.length).toBeGreaterThan(0);
		for (const root of roots) {
			expect(shipped.some((topic) => topic.parent === root.key)).toBe(true);
		}
		expect(shipped.find((topic) => topic.key === 'parent_pressure')?.path).toBe(
			'Relationships & belonging > Family & upbringing > Parenting & caregiving > Parental expectations'
		);
	});

	it('rejects malformed directories before any question is sent', () => {
		const topic = (key: string, parent: string | null) => ({ key, parent, label: key, scope: key });
		expect(() => buildTaxonomy([])).toThrow('Empty taxonomy');
		expect(() => buildTaxonomy([topic('a', 'b')])).toThrow('Unknown parent');
		expect(() => buildTaxonomy([topic('a', 'b'), topic('b', 'a')])).toThrow('cycle');
		expect(() => buildTaxonomy([topic('a', null), topic('a', null)])).toThrow('duplicate');
		expect(() =>
			buildTaxonomy([
				topic('a', null),
				topic('b', 'a'),
				topic('c', 'b'),
				topic('d', 'c'),
				topic('e', 'd')
			])
		).toThrow('Too many levels');
	});

	it('changes its hash when a topic changes, and hashes question text after trimming', () => {
		const renamed = sources.map((topic) =>
			topic.key === 'family' ? { ...topic, scope: 'Relatives' } : topic
		);
		expect(taxonomyHash(sources)).toBe(taxonomyHash([...sources]));
		expect(taxonomyHash(renamed)).not.toBe(taxonomyHash(sources));
		expect(questionInputHash('  How do you do  ')).toBe(questionInputHash('How do you do'));
		expect(questionInputHash('How do you do?')).not.toBe(questionInputHash('How do you do'));
	});
});

describe('scoring a question', () => {
	it('scores every topic in one request with the shared rubric', async () => {
		const client = clientWith({ family: 3, parenting: 3, sports: 2, youth: 2.6 });
		const result = await classifyQuestion(
			' Should my child keep playing soccer? ',
			taxonomy,
			client
		);

		expect(client.decide).toHaveBeenCalledTimes(1);
		const [state, batch] = client.decide.mock.calls[0];
		expect(JSON.parse(state)).toEqual({
			discussion_question: 'Should my child keep playing soccer?'
		});
		expect(Object.keys(batch)).toEqual(sources.map((topic) => topic.key));
		expect((batch.pressure as any).criteria).toBe(TOPIC_RUBRIC);
		expect((batch.pressure as any).instructions).toContain(
			'Relationships > Family > Parenting > Parental pressure'
		);
		expect(result.topics.map((topic) => topic.key)).toEqual(['parenting', 'youth']);
		expect(result.scores.culture.fit).toBe(0);
	});

	it('fails loudly on a missing or unusable judgment instead of treating it as low fit', async () => {
		await expect(
			classifyQuestion('Hi?', taxonomy, {
				decide: async () => ({ answers: { relationships: { type: 'refusal' } } })
			})
		).rejects.toThrow('Missing or invalid Jev score');
		await expect(classifyQuestion('   ', taxonomy, clientWith({}))).rejects.toThrow(
			'Question text is empty'
		);
	});
});

describe('choosing topics from scores', () => {
	it('files nothing when nothing reaches the substantial anchor, or only a heading does', () => {
		expect(keys({})).toEqual([]);
		expect(keys({ family: 66, talk: 50 })).toEqual([]);
		expect(keys({ relationships: 100, culture: 100 })).toEqual([]);
	});

	it('files under independent paths and keeps the broad topic when no niche fits', () => {
		expect(keys({ family: 70, parenting: 30, sports: 100 })).toEqual(['sports', 'family']);
	});

	it('lets a niche replace its broader topic only when it is strong or fits at least as well', () => {
		// "partner" is not "marriage": a 76% niche does not displace a 100% topic.
		expect(keys({ romance: 100, marriage: 76 })).toEqual(['romance']);
		expect(keys({ romance: 100, marriage: 95 })).toEqual(['marriage']);
		expect(keys({ romance: 70, marriage: 75 })).toEqual(['marriage']);
		// A weak child of a kept topic does not sneak in as its own path.
		expect(keys({ family: 100, parenting: 80, pressure: 99 })).toEqual(['family']);
		expect(keys({ family: 100, parenting: 95, pressure: 99 })).toEqual(['pressure']);
	});

	it('files a fitting niche even when its broader topic does not fit', () => {
		expect(keys({ sports: 20, youth: 90 })).toEqual(['youth']);
	});

	it('keeps strong topics and lets weaker ones only fill to three', () => {
		// Three strong topics: the 83% phone-as-setting topic is left out.
		const phone = { media: 99, talk: 97, friends: 96, sports: 83, family: 81 };
		expect(keys(phone)).toEqual(['media', 'talk', 'friends']);
		expect(selectTopics(scores(phone), taxonomy).candidates.map((topic) => topic.key)).toEqual([
			'media',
			'talk',
			'friends',
			'sports',
			'family'
		]);
		// One strong topic: both named relationships fill in behind it.
		expect(keys({ talk: 100, friends: 71, family: 70, media: 68 })).toEqual([
			'talk',
			'friends',
			'family'
		]);
		// Four strong topics are all kept; a fifth is not.
		expect(keys({ romance: 100, talk: 99, friends: 98, media: 97, sports: 96 })).toEqual([
			'romance',
			'talk',
			'friends',
			'media'
		]);
	});

	it('labels each topic strong or secondary', () => {
		const { topics } = selectTopics(scores({ talk: 90, friends: 89.9 }), taxonomy);
		expect(topics.map(({ key, band }) => [key, band])).toEqual([
			['talk', 'strong'],
			['friends', 'secondary']
		]);
	});
});
