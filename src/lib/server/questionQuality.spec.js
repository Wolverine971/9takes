// src/lib/server/questionQuality.spec.js
import { describe, expect, it } from 'vitest';
import {
	inspectQuestion,
	sceneSeedFor,
	sceneSeedsFor
} from '../../../scripts/question-quality.mjs';

describe('question quality gate', () => {
	it('accepts questions with an immediate answer shape and no prescribed interpretation', () => {
		const questions = [
			"What's something you do every day to seem fine that nobody knows is costing you effort?",
			"What's something you rehearse before saying, even to someone you trust?",
			'What kind of compliment is hardest for you to believe?'
		];

		for (const question of questions) expect(inspectQuestion(question).errors).toEqual([]);
	});

	it('rejects the abstract and type-coded structures from the failed batch', () => {
		const questions = [
			'When you have worked hard to build a certain image, how do you react when that image is suddenly challenged or broken?',
			'What is the true cost of pursuing profound understanding and knowledge above all other things?',
			'When someone feels deeply out of line with your principles, how do you decide whether to speak up or let it go?',
			'When people misunderstand who you are, do you try to correct them or let their opinion stand?'
		];

		for (const question of questions) expect(inspectQuestion(question).passed).toBe(false);
	});

	it('chooses stable scene seeds without exposing the source personality to the model', () => {
		expect(sceneSeedFor('will-smith')).toBe(sceneSeedFor('will-smith'));
		expect(sceneSeedFor('will-smith')).not.toBe('will-smith');
		expect(new Set(sceneSeedsFor('will-smith')).size).toBe(8);
	});
});
