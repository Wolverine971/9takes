// src/lib/server/questionFormatting.ts
//
// Decides what a question displays as (`questions.question_formatted`).
//
// The asker's words are theirs. A model proposes a punctuated version during
// tagging, and this module accepts it only when it changed punctuation,
// capitalization or an obvious misspelling. A proposal that adds, drops or
// swaps a word is thrown away and the asker's own text is shown instead.
//
// Background: until 2026-07-16 the create form stripped every punctuation mark
// before saving, and the model was then asked to put it back. It did more than
// that ("Whats your criteria" came back as "What are your criteria"), and a
// user noticed.

export type FormattedQuestionSource = 'as_typed' | 'ai' | 'tidied';

export interface FormattedQuestion {
	text: string;
	/** `as_typed`: the asker punctuated it. `ai`: the model's version passed. `tidied`: fallback. */
	source: FormattedQuestionSource;
}

const TERMINAL_PUNCTUATION = /[.?!…]["'”’)\]]*$/u;
const DANGLING_PUNCTUATION = /[,;:\-–—]$/u;
const WORD = /[\p{L}\p{N}]+/gu;

const QUESTION_STARTERS = new Set([
	'who',
	'whos',
	'whom',
	'whose',
	'what',
	'whats',
	'when',
	'whens',
	'where',
	'wheres',
	'why',
	'whys',
	'how',
	'hows',
	'which',
	'is',
	'isnt',
	'are',
	'arent',
	'am',
	'was',
	'wasnt',
	'were',
	'werent',
	'do',
	'dont',
	'does',
	'doesnt',
	'did',
	'didnt',
	'can',
	'cant',
	'could',
	'couldnt',
	'would',
	'wouldnt',
	'should',
	'shouldnt',
	'will',
	'wont',
	'have',
	'havent',
	'has',
	'hasnt',
	'had'
]);

function collapseWhitespace(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

/** Lowercased words with apostrophes folded away, so "whats" equals "what's". */
function wordsOf(value: string): string[] {
	return (
		value
			.toLowerCase()
			.replace(/['’‘`]/g, '')
			.match(WORD) ?? []
	);
}

/** Edit distance where swapping two neighbouring letters counts as one edit. */
function editDistance(a: string, b: string): number {
	const rows = a.length + 1;
	const cols = b.length + 1;
	const d: number[][] = Array.from({ length: rows }, (_, i) => {
		const row = new Array<number>(cols).fill(0);
		row[0] = i;
		return row;
	});
	for (let j = 0; j < cols; j++) d[0][j] = j;

	for (let i = 1; i < rows; i++) {
		for (let j = 1; j < cols; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
				d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
			}
		}
	}
	return d[rows - 1][cols - 1];
}

/**
 * A spelling correction, not a different word: "recieved" → "received".
 * Short words are excluded because one letter turns "me" into "we".
 */
function isSpellingFix(typed: string, proposed: string): boolean {
	const shortest = Math.min(typed.length, proposed.length);
	if (shortest < 4) return false;
	if (/\p{N}/u.test(typed) || /\p{N}/u.test(proposed)) return false;
	if (typed[0] !== proposed[0]) return false;
	return editDistance(typed, proposed) <= (shortest >= 6 ? 2 : 1);
}

/**
 * True when `candidate` says the same words as `raw` in the same order.
 * Allowed differences: punctuation, capitalization, a corrected misspelling,
 * and one word split in two or two joined ("highschool" → "high school").
 */
export function isFaithfulFormatting(raw: string, candidate: string): boolean {
	const typed = wordsOf(raw);
	const proposed = wordsOf(candidate);
	if (!typed.length || !proposed.length) return false;

	let i = 0;
	let j = 0;
	while (i < typed.length && j < proposed.length) {
		if (typed[i] === proposed[j]) {
			i++;
			j++;
		} else if (j + 1 < proposed.length && typed[i] === proposed[j] + proposed[j + 1]) {
			i++;
			j += 2;
		} else if (i + 1 < typed.length && typed[i] + typed[i + 1] === proposed[j]) {
			i += 2;
			j++;
		} else if (isSpellingFix(typed[i], proposed[j])) {
			i++;
			j++;
		} else {
			return false;
		}
	}
	return i === typed.length && j === proposed.length;
}

/** The asker already wrote a sentence: opens with a capital or digit, ends with . ? ! */
export function isSelfPunctuated(raw: string): boolean {
	const text = collapseWhitespace(raw);
	const firstWordChar = text.match(/[\p{L}\p{N}]/u)?.[0];
	if (!firstWordChar) return false;
	if (firstWordChar !== firstWordChar.toUpperCase()) return false;
	return TERMINAL_PUNCTUATION.test(text);
}

/**
 * The no-model cleanup: capitalize the first letter and close an obvious
 * question with a question mark. Never touches a word.
 */
export function tidyQuestionText(raw: string): string {
	let text = collapseWhitespace(raw);
	if (!text) return text;

	const firstWordIndex = text.search(/[\p{L}\p{N}]/u);
	if (firstWordIndex >= 0) {
		const first = text[firstWordIndex];
		if (first !== first.toUpperCase()) {
			text = text.slice(0, firstWordIndex) + first.toUpperCase() + text.slice(firstWordIndex + 1);
		}
	}

	if (!TERMINAL_PUNCTUATION.test(text) && !DANGLING_PUNCTUATION.test(text)) {
		const [firstWord] = wordsOf(text);
		if (firstWord && QUESTION_STARTERS.has(firstWord)) text += '?';
	}
	return text;
}

/**
 * Pick the display text for a question from what the asker typed and what the
 * model proposed.
 */
export function resolveFormattedQuestion(
	raw: string,
	candidate: string | null | undefined
): FormattedQuestion {
	const typed = collapseWhitespace(raw);
	if (isSelfPunctuated(typed)) return { text: typed, source: 'as_typed' };

	const proposed = collapseWhitespace(candidate ?? '');
	if (proposed && isFaithfulFormatting(typed, proposed)) {
		return { text: proposed, source: 'ai' };
	}

	return { text: tidyQuestionText(typed), source: 'tidied' };
}
