// scripts/lib/blogGeneric.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	SHARED_POSTS,
	SHARED_SENTENCE_POSTS,
	buildIndex,
	maskedTokens,
	parsePost,
	scorePost,
	sharedPhrases
} from './blogGeneric.mjs';

const post = (body, options) =>
	parsePost(`---\ntitle: T\npublished: true\n---\n\n${body}\n`, options);
const corpus = (bodies, options) =>
	bodies.map((body, i) => ({ id: `post-${i}`, parsed: post(body, options) }));
const emptyIndex = buildIndex([]);
const reasonsOf = (result) =>
	result.blocks.flatMap((block) => block.sentences ?? []).map((sentence) => sentence.reasons);
const score = (body, options, index = emptyIndex) => scorePost(post(body, options), index);

describe('maskedTokens', () => {
	it('swaps out the name, numbers, type words and she/he', () => {
		const tokens = maskedTokens(
			"Dakota Johnson's Type 6 loyalty shows: she is like most Sixes, a Loyalist at 35.",
			new Set(['dakota', 'johnson'])
		);
		expect(tokens.join(' ')).toBe(
			'PERSON type # loyalty shows he is like most TYPES a TYPENAME at #'
		);
	});
});

describe('parsePost', () => {
	it('keeps a quotation that runs across sentences out of the writer’s prose', () => {
		const parsed = post('She said, "I was scared. You would be too." Then she left.');
		const units = parsed.blocks[0].units;
		expect(units.map((unit) => unit.author)).toEqual(['She said,', '', 'Then she left.']);
		expect(units[0].anchors).toContain('quote');
	});

	it('treats set-off quote blocks as the subject’s words', () => {
		const parsed = post('## One\n\n> "You should always try your best in life, people."');
		const result = scorePost(parsed, emptyIndex);
		expect(result.words).toBeGreaterThan(0);
		expect(result.genericWords).toBe(0);
	});
});

describe('scorePost: weaker rules', () => {
	it('flags a hedged claim about a group, and leaves it alone once it has an anchor', () => {
		const bare = 'People often struggle to say what they need from the ones closest to them.';
		expect(reasonsOf(score(bare))[0]).toContain('generalization');
		const dated =
			'In 2019 people often struggled to say what they needed from the ones closest to them.';
		expect(reasonsOf(score(dated))[0]).toEqual([]);
	});

	it('flags advice and abstract claims with nothing behind them', () => {
		const advice = 'Try to notice the moment the conversation starts to slide away from the point.';
		expect(reasonsOf(score(advice))[0]).toContain('advice');
		const abstract =
			'Real growth comes from building awareness and a deeper understanding of patterns.';
		expect(reasonsOf(score(abstract))[0]).toContain('abstract');
	});

	it('flags a stock phrase, but not a name that happens to match one', () => {
		expect(reasonsOf(score('That meeting was a pivotal moment for the whole team.'))[0]).toEqual([
			'stock'
		]);
		expect(reasonsOf(score('The company renamed itself Pivotal a year later.'))[0]).toEqual([]);
	});

	it('does not read a sentence about one person as a generalization', () => {
		const line = 'He can often be found rebuilding the same engine he rebuilt the week before.';
		expect(reasonsOf(score(line))[0]).toEqual([]);
	});

	it('skips short sentences and "can’t"', () => {
		expect(reasonsOf(score('People often struggle.'))[0]).toEqual([]);
		const line = 'A person who cannot say it out loud can’t be helped by anyone around them.';
		expect(reasonsOf(score(line))[0]).not.toContain('generalization');
	});

	it('flags type description only on people pages', () => {
		const line = 'The Six wing pulls the whole pattern toward caution and second guessing.';
		expect(reasonsOf(score(line, { name: 'Dakota Johnson' }))[0]).toEqual(['typeTalk']);
		expect(reasonsOf(score(line))[0]).toEqual([]);
	});
});

describe('scorePost: shared and repeated wording', () => {
	const template = 'The rest of the analysis stands on its own without that detail.';
	const others = corpus(
		Array.from(
			{ length: SHARED_POSTS + 1 },
			(_, i) => `${template}\n\nUnique line number ${i} about a lighthouse keeper named Odalys.`
		)
	);

	it('flags wording that enough other posts use', () => {
		const index = buildIndex(others);
		expect(reasonsOf(score(template, undefined, index))[0]).toEqual(['shared']);
		const few = buildIndex(others.slice(0, SHARED_SENTENCE_POSTS - 1));
		expect(reasonsOf(score(template, undefined, few))[0]).toEqual([]);
	});

	it('does not count a post’s own wording against it', () => {
		const index = buildIndex(others.slice(0, SHARED_SENTENCE_POSTS));
		const asDraft = scorePost(others[0].parsed, index);
		expect(reasonsOf(asDraft)[0]).toEqual(['shared']);
		const asMember = scorePost(others[0].parsed, index, { id: others[0].id });
		expect(reasonsOf(asMember)[0]).toEqual([]);
	});

	it('leaves facts alone however plainly they are phrased', () => {
		const born = corpus(
			Array.from({ length: SHARED_POSTS + 1 }, () => 'Kate was born in 1979 in the city.'),
			{ name: 'Kate Hudson' }
		);
		const index = buildIndex(born);
		const result = score('Kate was born in 1979 in the city.', { name: 'Kate Hudson' }, index);
		expect(reasonsOf(result)[0]).toEqual([]);
	});

	it('flags a frame the post repeats type after type', () => {
		const body = [1, 2, 3, 4, 5]
			.map(
				(n) =>
					`What they bring to a team is the thing nobody else on it wants, entry ${'x'.repeat(n)}.`
			)
			.join('\n\n');
		expect(reasonsOf(score(body)).every((reasons) => reasons.includes('repeated'))).toBe(true);
	});

	it('lists the wording most posts share', () => {
		const index = buildIndex(others);
		const top = sharedPhrases(others, index, SHARED_POSTS);
		expect(top[0].posts).toBe(SHARED_POSTS + 1);
		expect(top.map((row) => row.phrase)).toContain('the rest of the');
	});
});

describe('scorePost: scores', () => {
	it('scores each section by the share of words in flagged sentences', () => {
		const generic = 'People often struggle to say what they need from the ones closest to them.';
		const specific = 'On March 3, 2021 she told Vogue the whole thing took nine days to film.';
		const result = score(`## Generic\n\n${generic}\n\n## Specific\n\n${specific}\n\n${generic}`);
		const [first, second] = result.sections;
		expect(first).toMatchObject({ name: 'Generic', genericPct: 100, flagged: 1 });
		expect(second.name).toBe('Specific');
		expect(second.genericPct).toBeGreaterThan(40);
		expect(second.genericPct).toBeLessThan(60);
		expect(result.genericWords).toBe(first.genericWords + second.genericWords);
		expect(result.specifics.number).toBe(1);
	});
});
