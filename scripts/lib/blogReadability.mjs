// scripts/lib/blogReadability.mjs
/**
 * Pure helpers for the readability auditor (scripts/audit-blog-readability.mjs).
 *
 * The bug class: a post that is accurate and still reads as machine-written,
 * because every paragraph is the same heavy block, no quote is set off, the
 * verdict sits 3,000 words down under the wrong heading, and the page keeps
 * narrating its own method. Doja Cat (2026-10-12) was the worked case: median
 * paragraph 74 words against 41 on the 438 older people pages, an 833-word
 * stretch with no break, no quote set off, "this profile" eight times.
 *
 * Everything here measures the page. Nothing here judges whether a claim is
 * true or an argument is good; that half is the read-through in
 * docs/writing-system/05-blog-quality-check.md.
 *
 * Rules, kept simple so every flag can be explained in one sentence:
 *
 * 1. splitBlocks: the body is split on blank lines into paragraphs, headings,
 *    set-off quotes, lists, tables, media (iframe/img/video) and components.
 *    Frontmatter, HTML comments and <script>/<style> are dropped first.
 * 2. Shape is counted on paragraphs only. A "break" is any block that is not a
 *    paragraph, a heading included. The longest unbroken stretch is the most
 *    words a reader meets between two breaks.
 * 3. Voice is counted on author prose: paragraph and list text with every
 *    quoted span removed, so the subject's own "I'm not" never counts against
 *    the writer.
 * 4. LIMITS are flags, not gates. Each sits near the 90th percentile of the 438
 *    older, hand-shaped people pages (calibrated 2026-10-12), so a flag means
 *    "this page is an outlier here, look", never "this is wrong". Tighter limits
 *    flagged a third of the corpus and ranked nothing.
 * 5. A section ends at the next H2 or H3. The set-off quote check only runs on
 *    pages with ten or more quotes of eight words or longer.
 *
 * Not checked on purpose: FAQ `anchor` values. An anchor is the FAQ item's own
 * id (FAQSection.svelte) and its structured-data URL, so one that matches no
 * heading still resolves.
 */

import matter from 'gray-matter';

export const LONG_PARAGRAPH = 70;
export const SHORT_PARAGRAPH = 25;

/** Each limit: the value at which a page is flagged, and which side is bad. */
export const LIMITS = {
	medianParagraph: { max: 60 },
	longPct: { max: 40 },
	shortPct: { min: 10 },
	oneSentencePct: { max: 60 },
	maxParagraph: { max: 170 },
	longRun: { max: 3 },
	unbrokenStretch: { max: 700 },
	heaviestSection: { max: 900 },
	setOffQuotePct: { min: 1 },
	selfReference: { max: 4 },
	negativeEndingPct: { max: 20 },
	colonQuotePer1000: { max: 6 },
	emDashes: { max: 40 },
	stockPhrases: { max: 0 }
};

const NEGATION =
	/\b(does not|do not|did not|cannot|can not|is not|are not|was not|were not|has not|have not|will not|would not|doesn['’]t|don['’]t|didn['’]t|can['’]t|isn['’]t|aren['’]t|wasn['’]t|weren['’]t|hasn['’]t|haven['’]t|won['’]t|wouldn['’]t|never|nor|neither|no longer)\b/i;

const SELF_REFERENCE =
	/\bthis (profile|article|piece|post|page|blog post|blog|analysis|essay|guide|write-up)\b/gi;

// The unambiguous subset of docs/writing-system/ai-detection-patterns.md. Words
// with honest uses in a profile ("legacy", "essential", "transform") are left out.
export const STOCK_PHRASES = [
	'delve',
	'tapestry',
	'testament to',
	'multifaceted',
	'pivotal',
	'paramount',
	'game-changer',
	'paradigm shift',
	'seamlessly',
	'at its core',
	'at the end of the day',
	'in conclusion',
	'in summary',
	'to summarize',
	'furthermore',
	'moreover',
	'it is worth noting',
	"it's worth noting",
	'it is important to note',
	"it's important to note",
	'when it comes to',
	"in today's",
	'more than ever',
	'it goes without saying',
	'plays a crucial role',
	'a treasure trove',
	'rich tapestry',
	'navigate the complexities',
	'shed light on',
	'deep dive'
];

export function stripFrontmatter(markdown) {
	try {
		const parsed = matter(markdown);
		return { data: parsed.data ?? {}, body: parsed.content };
	} catch {
		// One bad YAML line should not hide a page from the audit.
		const match = markdown.match(/^---\n[\s\S]*?\n---\n/);
		return { data: {}, body: match ? markdown.slice(match[0].length) : markdown };
	}
}

export function plainText(text) {
	return text
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/^(>\s?|[-*+]\s|\d+\.\s)/gm, '')
		.replace(/[*_`]/g, '');
}

export function countWords(text) {
	return (plainText(text).match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? []).length;
}

export function splitSentences(text) {
	return plainText(text)
		.replace(/\s+/g, ' ')
		.trim()
		.split(/(?<=[.!?]["”’)]?)\s+(?=["“‘(\[]?[A-Z0-9])/)
		.filter(Boolean);
}

/** Author prose: the text with every quoted span removed. */
export function withoutQuotes(text) {
	return plainText(text)
		.replace(/"[^"]*"/g, ' ')
		.replace(/“[^”]*”/g, ' ');
}

export function quotedSpans(text) {
	const plain = plainText(text);
	return [...plain.matchAll(/"([^"]+)"|“([^”]+)”/g)].map((m) => m[1] ?? m[2]);
}

function kindOf(block) {
	const first = block.split('\n')[0];
	if (/^#{1,6}\s/.test(first)) return 'heading';
	if (/^>/.test(first)) return 'quote';
	if (/^(\s*[-*+]\s|\s*\d+\.\s)/.test(first)) return 'list';
	if (/^\|/.test(first)) return 'table';
	if (/^```/.test(first)) return 'code';
	if (/<iframe|<img|<video|<enhanced:img|<PopCard|^!\[/.test(block)) return 'media';
	if (/^<\/?(p|span|a|strong|em|b|i)[\s>]/.test(first)) return 'paragraph';
	if (/^<\/?[A-Za-z]/.test(first)) return 'component';
	return 'paragraph';
}

export function splitBlocks(body) {
	const cleaned = body
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<script[\s\S]*?<\/script>/g, '')
		.replace(/<style[\s\S]*?<\/style>/g, '');
	const blocks = [];
	let section = '(opening)';
	for (const raw of cleaned.split(/\n\s*\n/)) {
		const text = raw.trim();
		if (!text) continue;
		const kind = kindOf(text);
		if (kind === 'heading') {
			const level = text.match(/^#+/)[0].length;
			const title = text.split('\n')[0].replace(/^#+\s*/, '');
			if (level <= 3) section = title;
			blocks.push({ kind, text, level, title, section, words: 0 });
			continue;
		}
		const words = kind === 'media' || kind === 'code' ? 0 : countWords(text);
		if (kind === 'component' && words === 0) continue; // a bare opening or closing tag
		blocks.push({ kind, text, section, words });
	}
	return blocks;
}

const median = (values) => {
	if (!values.length) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)];
};
const pct = (part, whole) => (whole ? Math.round((100 * part) / whole) : 0);
const preview = (text, length = 70) => {
	const flat = plainText(text).replace(/\s+/g, ' ').trim();
	return flat.length > length ? `${flat.slice(0, length).trimEnd()}…` : flat;
};

export function profile(markdown) {
	const { data, body } = stripFrontmatter(markdown);
	const blocks = splitBlocks(body);
	const paragraphs = blocks.filter((b) => b.kind === 'paragraph');
	const prose = blocks.filter((b) => b.kind === 'paragraph' || b.kind === 'list');
	const words = blocks.reduce((sum, b) => sum + b.words, 0);
	const lengths = paragraphs.map((p) => p.words);

	// longest run of long paragraphs, and longest stretch between breaks
	let run = 0;
	let longRun = 0;
	let stretch = { words: 0, start: null };
	let unbroken = { words: 0, start: '', section: '' };
	for (const block of blocks) {
		if (block.kind !== 'paragraph') {
			run = 0;
			stretch = { words: 0, start: null };
			continue;
		}
		run = block.words >= LONG_PARAGRAPH ? run + 1 : 0;
		longRun = Math.max(longRun, run);
		if (!stretch.start) stretch.start = block;
		stretch.words += block.words;
		if (stretch.words > unbroken.words) {
			unbroken = {
				words: stretch.words,
				start: preview(stretch.start.text),
				section: stretch.start.section
			};
		}
	}

	const sectionWords = new Map();
	for (const block of blocks) {
		sectionWords.set(block.section, (sectionWords.get(block.section) ?? 0) + block.words);
	}
	const [heaviestName, heaviestWords] = [...sectionWords.entries()].sort(
		(a, b) => b[1] - a[1]
	)[0] ?? ['', 0];

	const longest = [...paragraphs].sort((a, b) => b.words - a.words)[0];
	const oneSentence = paragraphs.filter((p) => splitSentences(p.text).length <= 1).length;

	// quotes: how many of the subject's longer lines get their own block
	const setOffQuotes = blocks.filter((b) => b.kind === 'quote' && /["“]/.test(b.text)).length;
	const inlineQuotes = prose
		.flatMap((b) => quotedSpans(b.text))
		.filter((q) => countWords(q) >= 8).length;

	// voice, on author prose only
	const author = prose.map((b) => withoutQuotes(b.text)).join('\n');
	const negativeEndings = paragraphs
		.filter((p) => splitSentences(p.text).length > 1 || p.words > SHORT_PARAGRAPH)
		.map((p) => splitSentences(p.text).at(-1) ?? '')
		.filter((last) => NEGATION.test(withoutQuotes(last)));
	const lowered = author.toLowerCase();
	const stockPhrases = STOCK_PHRASES.filter((phrase) =>
		new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(lowered)
	);
	const colonQuotes = prose.reduce(
		(sum, b) => sum + (plainText(b.text).match(/:\s*["“]/g) ?? []).length,
		0
	);

	return {
		title: data.title ?? '',
		published: data.published === true,
		pipelineVersion: data.editorial_workflow?.version ?? null,
		words,
		paragraphs: paragraphs.length,
		medianParagraph: median(lengths),
		longPct: pct(lengths.filter((w) => w >= LONG_PARAGRAPH).length, lengths.length),
		shortPct: pct(lengths.filter((w) => w <= SHORT_PARAGRAPH).length, lengths.length),
		oneSentencePct: pct(oneSentence, lengths.length),
		maxParagraph: longest?.words ?? 0,
		longRun,
		unbrokenStretch: unbroken.words,
		heaviestSection: heaviestWords,
		breaks: {
			quotes: blocks.filter((b) => b.kind === 'quote').length,
			lists: blocks.filter((b) => b.kind === 'list').length,
			media: blocks.filter((b) => b.kind === 'media').length,
			other: blocks.filter((b) => b.kind === 'table' || b.kind === 'component').length
		},
		setOffQuotes,
		inlineQuotes,
		setOffQuotePct:
			setOffQuotes + inlineQuotes >= 10 ? pct(setOffQuotes, setOffQuotes + inlineQuotes) : null,
		selfReference: (author.match(SELF_REFERENCE) ?? []).length,
		negativeEndingPct: pct(negativeEndings.length, lengths.length),
		colonQuotePer1000: words ? Math.round((1000 * colonQuotes) / words) : 0,
		emDashes: (author.match(/—/g) ?? []).length,
		stockPhrases: stockPhrases.length,
		where: {
			longestParagraph: longest ? { words: longest.words, start: preview(longest.text) } : null,
			unbrokenStretch: unbroken,
			heaviestSection: { name: heaviestName, words: heaviestWords },
			longParagraphs: paragraphs
				.filter((p) => p.words >= LONG_PARAGRAPH)
				.sort((a, b) => b.words - a.words)
				.map((p) => ({ words: p.words, section: p.section, start: preview(p.text, 50) })),
			negativeEndings: negativeEndings.map((s) => preview(s, 90)),
			stockPhrases
		}
	};
}

const FLAG_TEXT = {
	medianParagraph: [
		'Typical paragraph is heavy',
		'Cut paragraphs where the thought turns. Most should fit one phone screen.'
	],
	longPct: [
		'Too many long paragraphs',
		'Keep a few solid blocks; break the rest at their natural turn.'
	],
	shortPct: [
		'Almost no short paragraphs',
		'Promote sentences that already land to their own line. Do not write new punchlines.'
	],
	oneSentencePct: [
		'Choppy: mostly one-sentence paragraphs',
		'Merge neighbours that share one thought. Short lines only work next to full ones.'
	],
	maxParagraph: ['One paragraph is a wall', 'Split it, or turn its run of items into a list.'],
	longRun: [
		'Long paragraphs back to back',
		'Put a short line, a set-off quote or a list between them.'
	],
	unbrokenStretch: [
		'Long stretch with nothing but paragraphs',
		'Add a heading, a set-off quote, a list or a clip inside it.'
	],
	heaviestSection: [
		'One section carries too much',
		'Check the heading still describes everything under it; split where the subject changes.'
	],
	setOffQuotePct: [
		'Quotes are buried in paragraphs',
		'Give the strongest line in each section its own quote block.'
	],
	selfReference: [
		'The page keeps talking about itself',
		'Say the thing. Keep "this profile" for where the page states its scope.'
	],
	negativeEndingPct: [
		'Paragraphs keep ending on a disclaimer',
		'State each limit once, in a fixed place, and end paragraphs on what is true.'
	],
	colonQuotePer1000: [
		'Same quote intro over and over ("Label: quote")',
		'Vary it: lead with the words, or fold the quote into the sentence.'
	],
	emDashes: [
		'Heavy em-dash use in the writer’s own sentences',
		'New pages use none outside quotations. On older pages, thin them out.'
	],
	stockPhrases: [
		'Stock AI phrases',
		'Replace each one. Full list: docs/writing-system/ai-detection-patterns.md.'
	]
};

export function findFlags(metrics, limits = LIMITS) {
	const flags = [];
	for (const [key, limit] of Object.entries(limits)) {
		const value = metrics[key];
		if (value === null || value === undefined) continue;
		const over = limit.max !== undefined && value > limit.max;
		const under = limit.min !== undefined && value < limit.min;
		if (!over && !under) continue;
		const [label, fix] = FLAG_TEXT[key];
		flags.push({ key, label, fix, value, limit: limit.max ?? limit.min });
	}
	return flags;
}
