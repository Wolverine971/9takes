// src/lib/server/personTypeAnswer.spec.ts
import { describe, expect, it } from 'vitest';
import { buildPersonTypeAnswer, findTell, findWing, splitSentences } from './personTypeAnswer';

const GOSLING =
	"Ryan Gosling is an Enneagram Type 9 (The Peacemaker). The pattern shows in his total merging with roles, building The Notebook's kitchen table by hand.";

describe('splitSentences', () => {
	it('splits on sentence ends only', () => {
		expect(splitSentences('He is a 9. He builds tables. Dr. No stays.')).toHaveLength(3);
	});
});

describe('findTell', () => {
	it('drops the sentence that only restates the type', () => {
		expect(findTell(9, GOSLING)).toBe(
			"The pattern shows in his total merging with roles, building The Notebook's kitchen table by hand."
		);
	});

	it('keeps a first sentence that carries evidence', () => {
		const answer =
			'He turns attention into a measurable product: daily broadcasts and visible audience feedback.';
		expect(findTell(3, answer)).toBe(answer);
	});

	it('cuts long evidence lists at a clause, never mid-word', () => {
		const long = `Type 3 is his type. The pattern shows in ${Array.from({ length: 30 }, (_, i) => `move number ${i}`).join(', ')}.`;
		const tell = findTell(3, long);
		expect(tell?.endsWith('…')).toBe(true);
		expect(tell!.length).toBeLessThanOrEqual(301);
		expect(tell).not.toMatch(/,…$/);
	});

	it('returns null when nothing follows the restatement', () => {
		expect(findTell(9, 'Ryan Gosling is an Enneagram Type 9.')).toBeNull();
	});
});

describe('findWing', () => {
	it('takes the wing the FAQ names', () => {
		expect(findWing(3, 'specifically a 3w4 with a social instinct', '3w2 3w2 3w2')).toBe('3w4');
	});

	it('reads a wing spelled out in words', () => {
		expect(findWing(4, 'an Enneagram Type 4 with a 3 wing', '')).toBe('4w3');
	});

	it('ignores impossible wings', () => {
		expect(findWing(3, 'a 3w7', '')).toBeNull();
	});

	it('wraps around the circle for 1 and 9', () => {
		expect(findWing(9, '', 'a classic 9w1, a 9w1 through and through')).toBe('9w1');
		expect(findWing(1, '', 'reads as 1w9')).toBe('1w9');
	});

	it('declines to pick when the body weighs both wings equally', () => {
		expect(findWing(4, '', '4w3 or 4w5? 4w3 vs 4w5')).toBeNull();
	});
});

describe('buildPersonTypeAnswer', () => {
	const faqs = [
		{ question: 'Who is Ryan Gosling?', answer: 'An actor.' },
		{ question: "What is Ryan Gosling's personality type?", answer: GOSLING }
	];

	it('builds the answer from the type FAQ', () => {
		expect(
			buildPersonTypeAnswer({ enneagram: 9, faqs, content: 'a 9w1', isOpenCase: false })
		).toEqual({
			typeNum: 9,
			wing: '9w1',
			tell: expect.stringContaining('merging with roles')
		});
	});

	it('stays out of open cases and untyped pages', () => {
		expect(buildPersonTypeAnswer({ enneagram: 9, faqs, content: '', isOpenCase: true })).toBeNull();
		expect(
			buildPersonTypeAnswer({ enneagram: null, faqs, content: '', isOpenCase: false })
		).toBeNull();
	});

	it('still answers the type when there is no FAQ', () => {
		expect(
			buildPersonTypeAnswer({ enneagram: 5, faqs: null, content: '', isOpenCase: false })
		).toEqual({ typeNum: 5, wing: null, tell: null });
	});
});
