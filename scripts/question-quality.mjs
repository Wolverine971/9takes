// scripts/question-quality.mjs
/** @typedef {{ code: string, message: string }} QuestionIssue */

export const QUESTION_SCENE_SEEDS = [
	'A friend reads your text, does not reply, and keeps posting online.',
	'Plans get canceled after you already rearranged your day.',
	'Someone gives you advice when you only wanted them to listen.',
	'A coworker repeats your idea and gets the credit for it.',
	'You find out you were the last person invited.',
	'Someone compliments you, but you do not quite believe them.',
	'You need help with something you usually handle alone.',
	'A friend makes a joke about you in front of other people.',
	'Someone apologizes, but you do not feel any better.',
	'You share good news and the other person changes the subject.',
	'You say yes to a favor and regret it almost immediately.',
	'Someone close to you forgets a detail that mattered to you.',
	'You notice tension in a room before anyone says anything.',
	'You send a text that feels more honest than you intended.',
	'Someone offers to take over something you normally do yourself.',
	'A person you trust remembers the same argument very differently.',
	'Everyone praises what you did. Later, someone tells you what went wrong.',
	'A group makes a decision that affects you without asking you.',
	'You realize you have been doing a chore no one notices.',
	'Someone asks why you are upset before you are ready to explain it.'
];

export const RESPONSE_PROVEN_EXAMPLES = [
	{
		question:
			"What's something you do every day to seem fine that nobody knows is costing you effort?",
		lesson: 'A familiar behavior, a hidden cost, and room for a one-sentence confession.'
	},
	{
		question: 'What were you like as a kid in three words?',
		lesson: 'Immediate recall and a clear answer shape; no analysis is required.'
	},
	{
		question: "What would you tell your parents if you knew they wouldn't get angry or upset?",
		lesson: 'A recognizable relationship and a constraint that opens honest answers.'
	},
	{
		question: "What's something you overresearched that no one asked about?",
		lesson: 'Specific, lightly exposing, and easy to answer with an actual example.'
	}
];

export const FAILED_PATTERN_EXAMPLES = [
	{
		question:
			'When you have worked hard to build a certain image, how do you react when that image is suddenly challenged or broken?',
		reason: 'It assigns the reader an Achiever premise and asks for abstract self-analysis.'
	},
	{
		question:
			'What is the true cost of pursuing profound understanding and knowledge above all other things?',
		reason: 'Grand language, an extreme premise, and an obvious Investigator answer.'
	},
	{
		question:
			'When you have built something significant, how do you decide what parts of it are truly yours to defend and what you let go of?',
		reason:
			'Inflated stakes, several abstractions, and a decision framework instead of a lived moment.'
	},
	{
		question:
			'When someone feels deeply out of line with your principles, how do you decide whether to speak up or let it go?',
		reason: 'It codes the reader as principle-led and supplies a false binary.'
	},
	{
		question:
			'When people misunderstand who you are, do you try to correct them or let their opinion stand?',
		reason:
			'Cleaner wording does not fix the forced choice or the request for a generalized personality rule.'
	}
];

const HARD_FAILURES = [
	{
		code: 'decision_calculus',
		pattern: /\b(?:how do you decide|what guides your decision|what determines whether)\b/i,
		message: 'Ask for a reaction, memory, or example instead of a decision-making framework.'
	},
	{
		code: 'grand_abstraction',
		pattern:
			/\b(?:true cost|profound understanding|above all (?:else|other things)|something significant|truly yours|authentic self|core values|navigate this|life journey)\b/i,
		message: 'Replace grand or therapeutic language with an ordinary moment.'
	},
	{
		code: 'editorial_jargon',
		pattern:
			/\b(?:critique|perspective|framework|trade-?off|public praise|private criticism|tough feedback|meaningful tension)\b/i,
		message: 'Use words people use with friends, not editorial, coaching, or workplace jargon.'
	},
	{
		code: 'inflated_premise',
		pattern: /\bwhen you have (?:worked hard|built|achieved|sacrificed|devoted)\b/i,
		message: 'Do not assign the reader a biography in the setup.'
	},
	{
		code: 'forced_choice',
		pattern: /\b(?:whether to|would you rather|or)\b/i,
		message: 'Do not hand the reader a menu of acceptable answers.'
	},
	{
		code: 'advice_prompt',
		pattern: /\b(?:should you|should someone|what should)\b/i,
		message: 'Ask for the reader’s experience, not advice or a correct answer.'
	},
	{
		code: 'type_leak',
		pattern:
			/\b(?:enneagram|the achiever|the helper|the investigator|the reformer|the loyalist|the enthusiast|the challenger|the peacemaker|the individualist|type\s*[1-9](?:w[1-9])?)\b/i,
		message: 'The premise cannot name or signal an Enneagram type.'
	},
	{
		code: 'ai_template',
		pattern:
			/\b(?:in what ways|what does .+ look like|how do you navigate|what is the nature of)\b/i,
		message: 'This reads like an AI or coaching template.'
	}
];

/**
 * @param {unknown} key
 * @returns {string}
 */
export function sceneSeedFor(key) {
	const value = String(key || 'question');
	let hash = 0;
	for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	return QUESTION_SCENE_SEEDS[hash % QUESTION_SCENE_SEEDS.length];
}

/**
 * @param {unknown} key
 * @param {number} [count]
 * @returns {string[]}
 */
export function sceneSeedsFor(key, count = 8) {
	const total = QUESTION_SCENE_SEEDS.length;
	const limit = Math.min(Math.max(Number(count) || 1, 1), total);
	const first = QUESTION_SCENE_SEEDS.indexOf(sceneSeedFor(key));

	// This used to take `count` CONSECUTIVE seeds from the hashed offset, which
	// gave only `total` distinct decks — 20. Across 87 people that put roughly
	// four subjects on an identical deck, and because the model deliberately
	// never sees who the subject is, identical decks produced word-for-word
	// identical questions: a 2026-09-01 batch of 87 came back with 22 exact
	// duplicates. Walking the ring by a coprime stride turns the deck into a
	// combination rather than a window, so distinct decks scale with
	// total × (number of valid strides) instead of total.
	const value = String(key || 'question');
	let strideHash = 7;
	for (const character of value) strideHash = (strideHash * 131 + character.charCodeAt(0)) >>> 0;

	const coprimeStrides = [];
	for (let candidate = 1; candidate < total; candidate += 1) {
		if (greatestCommonDivisor(candidate, total) === 1) coprimeStrides.push(candidate);
	}
	const stride = coprimeStrides[strideHash % coprimeStrides.length];

	return Array.from(
		{ length: limit },
		(_, index) => QUESTION_SCENE_SEEDS[(first + index * stride) % total]
	);
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function greatestCommonDivisor(a, b) {
	return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

/**
 * @param {unknown} rawQuestion
 */
export function inspectQuestion(rawQuestion) {
	const question = String(rawQuestion || '')
		.replace(/\s+/g, ' ')
		.trim();
	const words = question.match(/[A-Za-z0-9’']+(?:-[A-Za-z0-9’']+)*/g) || [];
	/** @type {QuestionIssue[]} */
	const errors = [];
	/** @type {QuestionIssue[]} */
	const warnings = [];

	if (!question) {
		errors.push({ code: 'empty', message: 'Question is empty.' });
		return { question, wordCount: 0, errors, warnings, passed: false };
	}

	const questionMarks = (question.match(/\?/g) || []).length;
	if (questionMarks !== 1 || !question.endsWith('?')) {
		errors.push({ code: 'one_clean_question', message: 'Use exactly one question ending in “?”.' });
	}
	if (words.length < 7 || words.length > 22) {
		errors.push({ code: 'word_count', message: 'Use 7 to 22 words.' });
	}
	if (!/\b(?:you|your|yourself)\b/i.test(question)) {
		errors.push({
			code: 'reader_missing',
			message: 'The question must clearly turn toward the reader.'
		});
	}
	if (/\b(?:always|never)\b/i.test(question)) {
		errors.push({ code: 'absolute', message: 'Avoid absolute claims about the reader.' });
	}

	for (const failure of HARD_FAILURES) {
		if (failure.pattern.test(question))
			errors.push({ code: failure.code, message: failure.message });
	}

	if (/^how do you\b/i.test(question)) {
		errors.push({
			code: 'generalized_how',
			message:
				'“How do you…” usually produces a generalized explanation instead of a revealing answer.'
		});
	}
	if (/^if you could\b/i.test(question)) {
		warnings.push({
			code: 'hypothetical',
			message: 'Prefer something the reader has actually experienced over an imaginary scenario.'
		});
	}
	if (/^why\b/i.test(question)) {
		warnings.push({
			code: 'why_explanation',
			message: '“Why” can invite a thesis; check that an example still comes to mind immediately.'
		});
	}
	if (words.length > 18) {
		warnings.push({
			code: 'long',
			message: 'Read it aloud; shorter questions usually feel more human.'
		});
	}
	if ((question.match(/,/g) || []).length > 1 || /[;:]/.test(question)) {
		warnings.push({
			code: 'constructed_sentence',
			message: 'The sentence may be carrying too much setup.'
		});
	}

	return { question, wordCount: words.length, errors, warnings, passed: errors.length === 0 };
}

/**
 * @param {unknown} question
 */
export function assertQuestionQuality(question) {
	const report = inspectQuestion(question);
	if (!report.passed) {
		throw new Error(report.errors.map((issue) => issue.message).join(' '));
	}
	return report;
}
