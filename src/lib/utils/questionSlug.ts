// src/lib/utils/questionSlug.ts
const WORD_PATTERN = /[A-Za-z0-9]+/g;
export const QUESTION_URL_MAX_LENGTH = 80;
const QUESTION_URL_FALLBACK = 'question';

export function buildQuestionSlug(input: string): string {
	const tokens = tokenizeQuestion(input);

	if (tokens.length === 0) {
		return QUESTION_URL_FALLBACK;
	}

	const keywords = removeStopwords(tokens);
	const baseTokens = selectSlugTokens(tokens, keywords);

	const slug = clampQuestionSlug(baseTokens.join('-').toLowerCase(), QUESTION_URL_MAX_LENGTH);

	return slug || QUESTION_URL_FALLBACK;
}

export function appendQuestionSlugSuffix(baseSlug: string, suffix: number | string): string {
	const normalizedBase =
		clampQuestionSlug(baseSlug, QUESTION_URL_MAX_LENGTH) || QUESTION_URL_FALLBACK;
	const suffixPart = `-${String(suffix).toLowerCase()}`;
	const maxBaseLength = Math.max(1, QUESTION_URL_MAX_LENGTH - suffixPart.length);

	return `${clampQuestionSlug(normalizedBase, maxBaseLength)}${suffixPart}`;
}

function tokenizeQuestion(input: string): string[] {
	return input.trim().match(WORD_PATTERN) ?? [];
}

function selectSlugTokens(tokens: string[], keywords: string[]): string[] {
	if (keywords.length === 0) {
		return tokens;
	}

	if (keywords.length <= 3) {
		const loweredTokens = tokens.map((token) => token.toLowerCase());
		const lastKeyword = keywords[keywords.length - 1]?.toLowerCase();
		const lastKeywordIndex = loweredTokens.lastIndexOf(lastKeyword);

		if (lastKeywordIndex >= 0) {
			return tokens.slice(0, lastKeywordIndex + 1);
		}
	}

	return keywords;
}

function clampQuestionSlug(slug: string, maxLength: number): string {
	const normalized = slug
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '');

	if (normalized.length <= maxLength) {
		return normalized;
	}

	let truncated = normalized.slice(0, maxLength).replace(/-+$/g, '');
	const lastHyphenIndex = truncated.lastIndexOf('-');

	if (lastHyphenIndex >= Math.max(12, Math.floor(maxLength * 0.6))) {
		truncated = truncated.slice(0, lastHyphenIndex);
	}

	return truncated.replace(/-+$/g, '');
}

function removeStopwords(tokens: string[]): string[] {
	return tokens.filter((token) => !STOPWORDS.includes(token.toLowerCase()));
}

const STOPWORDS = [
	'a',
	'about',
	'after',
	'all',
	'also',
	'am',
	'an',
	'and',
	'another',
	'any',
	'are',
	'as',
	'at',
	'be',
	'because',
	'been',
	'before',
	'being',
	'between',
	'both',
	'but',
	'by',
	'came',
	'can',
	'come',
	'could',
	'did',
	'do',
	'each',
	'for',
	'from',
	'get',
	'got',
	'has',
	'had',
	'he',
	'have',
	'her',
	'here',
	'him',
	'himself',
	'his',
	'how',
	'i',
	'if',
	'in',
	'into',
	'is',
	'it',
	'like',
	'make',
	'many',
	'me',
	'might',
	'more',
	'most',
	'much',
	'must',
	'my',
	'never',
	'now',
	'of',
	'on',
	'only',
	'or',
	'other',
	'our',
	'out',
	'over',
	'said',
	'same',
	'see',
	'should',
	'since',
	'some',
	'still',
	'such',
	'take',
	'than',
	'that',
	'the',
	'their',
	'them',
	'then',
	'there',
	'these',
	'they',
	'this',
	'those',
	'through',
	'to',
	'too',
	'under',
	'up',
	'very',
	'was',
	'way',
	'we',
	'well',
	'were',
	'what',
	'where',
	'which',
	'while',
	'who',
	'with',
	'would',
	'you',
	'your'
];
