// src/lib/server/personTypeAnswer.ts

/**
 * The direct answer at the top of a person page: "X's Enneagram type: 9 (wing 1)",
 * one line on the tell, and three people of the same type.
 *
 * Searchers ask "what is X's personality type" and our pages answered it only
 * deep in the FAQ. Pages that answer up top rank higher for that question, and
 * at position ~8 these searches click at 0.5% vs 1.2% at 3-6 (search-term
 * analysis, 2026-11-21). Everything here is read from data the page already
 * has: the type FAQ the pipeline writes for every profile, and the body text.
 */

export type PersonFaq = { question?: string | null; answer?: string | null } | null;

export type PersonTypeAnswer = {
	typeNum: number;
	/** e.g. "9w1"; null when the page never commits to a wing. */
	wing: string | null;
	/** One or two sentences on why, lifted from the type FAQ; null if none fits. */
	tell: string | null;
};

const TELL_MAX = 300;
const TYPE_QUESTION = /(personality|enneagram)\s+type/i;

/** Sentences, splitting only where a sentence clearly ends. */
const ABBREVIATION = /\b(Dr|Mr|Mrs|Ms|Jr|Sr|St|vs|Vol|No|U\.S|e\.g|i\.e)\.$/;

export function splitSentences(text: string): string[] {
	const pieces = text
		.replace(/\s+/g, ' ')
		.trim()
		.split(/(?<=[.!?][”"’)]?)\s+(?=[A-Z“"‘'(])/);
	const sentences: string[] = [];
	for (const piece of pieces) {
		const last = sentences.at(-1);
		if (last && ABBREVIATION.test(last)) sentences[sentences.length - 1] = `${last} ${piece}`;
		else sentences.push(piece);
	}
	return sentences.map((sentence) => sentence.trim()).filter(Boolean);
}

function adjacentWings(typeNum: number): [number, number] {
	return [typeNum === 1 ? 9 : typeNum - 1, typeNum === 9 ? 1 : typeNum + 1];
}

/** The wing the page commits to: the FAQ's, else the body's most frequent valid one. */
export function findWing(typeNum: number, faqAnswer: string, content: string): string | null {
	const valid = new Set(adjacentWings(typeNum).map((wing) => `${typeNum}w${wing}`));
	const pattern = new RegExp(`\\b${typeNum}w([1-9])\\b`, 'g');

	const fromFaq = [...faqAnswer.matchAll(pattern)].map((m) => m[0]).find((w) => valid.has(w));
	if (fromFaq) return fromFaq;
	// "with a 3 wing" / "wing 3" spelled out in the FAQ.
	const spelled = faqAnswer.match(/\b(?:with an?|a)\s+([1-9])\s+wing\b|\bwing\s+([1-9])\b/i);
	const spelledWing = spelled && `${typeNum}w${spelled[1] ?? spelled[2]}`;
	if (spelledWing && valid.has(spelledWing)) return spelledWing;

	const counts = new Map<string, number>();
	for (const match of content.matchAll(pattern)) {
		if (valid.has(match[0])) counts.set(match[0], (counts.get(match[0]) ?? 0) + 1);
	}
	const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
	// Both wings named about equally means the page weighs them; don't pick one.
	if (!ranked.length || (ranked[1] && ranked[1][1] === ranked[0][1])) return null;
	return ranked[0][0];
}

/** Drop the sentence that only restates the type; keep the evidence after it. */
export function findTell(typeNum: number, faqAnswer: string): string | null {
	const sentences = splitSentences(faqAnswer);
	const restatesType = (s: string) =>
		new RegExp(`\\bType\\s*${typeNum}\\b`, 'i').test(s) &&
		/\b(is|was|reads as|best understood|fits)\b/i.test(s) &&
		s.length < 220;
	const body = sentences.filter((sentence, index) => !(index < 2 && restatesType(sentence)));
	if (!body.length) return null;

	let tell = body[0];
	if (tell.length > TELL_MAX) {
		// Long evidence lists: keep whole clauses up to the limit.
		const cut = tell.slice(0, TELL_MAX);
		const stop = Math.max(cut.lastIndexOf(', '), cut.lastIndexOf('; '), cut.lastIndexOf(' — '));
		if (stop < 120) return null;
		tell = `${cut.slice(0, stop).trimEnd()}…`;
	} else if (body[1] && tell.length + body[1].length < 200) {
		tell = `${tell} ${body[1]}`;
	}
	return tell;
}

export function buildPersonTypeAnswer({
	enneagram,
	faqs,
	content,
	isOpenCase
}: {
	enneagram: number | null;
	faqs: unknown;
	content: string;
	isOpenCase: boolean;
}): PersonTypeAnswer | null {
	// Open cases weigh two or more types on purpose; their TL;DR box says so.
	if (isOpenCase || !enneagram || enneagram < 1 || enneagram > 9) return null;

	const list = Array.isArray(faqs) ? (faqs as PersonFaq[]) : [];
	const typeFaq = list.find((faq) => faq?.question && TYPE_QUESTION.test(faq.question));
	const answer = typeof typeFaq?.answer === 'string' ? typeFaq.answer : '';

	return {
		typeNum: enneagram,
		wing: findWing(enneagram, answer, content),
		tell: answer ? findTell(enneagram, answer) : null
	};
}
