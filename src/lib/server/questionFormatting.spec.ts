// src/lib/server/questionFormatting.spec.ts
import { describe, expect, it } from 'vitest';
import {
	isFaithfulFormatting,
	isSelfPunctuated,
	resolveFormattedQuestion,
	tidyQuestionText
} from './questionFormatting';

describe('isFaithfulFormatting', () => {
	it('accepts punctuation and capitalization changes', () => {
		expect(
			isFaithfulFormatting(
				'i need date ideas what would you do',
				'I need date ideas, what would you do?'
			)
		).toBe(true);
	});

	it('accepts a restored apostrophe', () => {
		expect(
			isFaithfulFormatting(
				'Whats your criteria for considering someone a friend',
				"What's your criteria for considering someone a friend?"
			)
		).toBe(true);
	});

	it('accepts corrected misspellings and a split word', () => {
		expect(
			isFaithfulFormatting(
				'What is the best parenting advice you ever recieved',
				'What is the best parenting advice you ever received?'
			)
		).toBe(true);
		expect(
			isFaithfulFormatting(
				'What tips do you have for a recent highschool grad',
				'What tips do you have for a recent high school grad?'
			)
		).toBe(true);
	});

	it('rejects a reworded question', () => {
		expect(
			isFaithfulFormatting(
				'Whats your criteria for considering someone a friend',
				'What are your criteria for considering someone a friend?'
			)
		).toBe(false);
	});

	it('rejects dropped or added words', () => {
		expect(
			isFaithfulFormatting(
				'Why do some people have 2 phones Trying to find an answer without assuming bf anything negative',
				'Why do some people have 2 phones? Trying to find an answer without assuming anything negative.'
			)
		).toBe(false);
		expect(isFaithfulFormatting('how do you rest', 'How do you actually rest?')).toBe(false);
	});

	it('rejects a short word swapped for another', () => {
		expect(isFaithfulFormatting('how does it help me', 'How does it help we?')).toBe(false);
	});

	it('rejects a changed number', () => {
		expect(isFaithfulFormatting('why have 2 phones', 'Why have 3 phones?')).toBe(false);
	});
});

describe('isSelfPunctuated', () => {
	it('recognizes a question the asker already punctuated', () => {
		expect(isSelfPunctuated('What’s something you say “I don’t mind” about?')).toBe(true);
		expect(isSelfPunctuated('He asked, "Are you fine?"')).toBe(true);
	});

	it('is false without a capital or an ending mark', () => {
		expect(isSelfPunctuated('what do you do?')).toBe(false);
		expect(isSelfPunctuated('What do you provide so that you never have to ask')).toBe(false);
	});
});

describe('tidyQuestionText', () => {
	it('capitalizes and closes an obvious question', () => {
		expect(tidyQuestionText('whats your   criteria for a friend')).toBe(
			'Whats your criteria for a friend?'
		);
	});

	it('leaves a statement without an invented question mark', () => {
		expect(tidyQuestionText('I need date ideas')).toBe('I need date ideas');
	});
});

describe('resolveFormattedQuestion', () => {
	it('keeps a punctuated question exactly as typed, whatever the model proposes', () => {
		const typed = 'What’s something you say “I don’t mind” about when you actually do?';
		expect(
			resolveFormattedQuestion(
				typed,
				"What's something you say 'I don't mind' about when you actually do?"
			)
		).toEqual({ text: typed, source: 'as_typed' });
	});

	it('uses the model version when it only punctuates', () => {
		expect(
			resolveFormattedQuestion(
				'What do you provide so that you never have to ask',
				'What do you provide so that you never have to ask?'
			)
		).toEqual({ text: 'What do you provide so that you never have to ask?', source: 'ai' });
	});

	it('falls back to the asker’s words when the model rewrites them', () => {
		expect(
			resolveFormattedQuestion(
				'Whats your criteria for considering someone a friend',
				'What are your criteria for considering someone a friend?'
			)
		).toEqual({
			text: 'Whats your criteria for considering someone a friend?',
			source: 'tidied'
		});
	});

	it('falls back when the model returns nothing', () => {
		expect(resolveFormattedQuestion('how do you rest', undefined)).toEqual({
			text: 'How do you rest?',
			source: 'tidied'
		});
	});
});
