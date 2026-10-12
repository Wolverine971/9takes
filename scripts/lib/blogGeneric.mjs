// scripts/lib/blogGeneric.mjs
/**
 * Pure helpers for the generic-content auditor (scripts/audit-blog-generic.mjs).
 *
 * The question it answers: which sentences in this post could sit in any other
 * post? A sentence is generic when swapping in a different person, type or
 * topic would leave it just as true. Those are the sentences to replace when a
 * post gets a new direction.
 *
 * Where the rules came from: on 2026-10-12, 23 posts went through four AI
 * detectors. What got flagged sentence by sentence was not rhythm or
 * punctuation. It was stock vocabulary, hedged claims about whole groups,
 * sentences aimed at "you" with no case behind them, and scaffolding repeated
 * type after type. Sentences carrying a quote, a date or a name were mostly left alone.
 * This file checks for those same things locally. It calls no detector and
 * makes no claim about what a detector would say.
 *
 * Rules, kept simple so every flag can be explained in one sentence:
 *
 * 1. A unit is one sentence of the writer's own prose (paragraphs, list items,
 *    component text). Set-off quote blocks are the subject's words: they count
 *    toward the post's length and are never flagged.
 * 2. Shared wording is measured, not listed. Every sentence is reduced to
 *    lowercase words with the subject's name, type numbers, type nouns and
 *    she/he swapped for placeholders, then cut into four-word phrases. A phrase
 *    is shared when SHARED_POSTS other published posts use it, and repeated
 *    when this post uses it REPEATS_IN_POST times. A sentence is flagged when
 *    at least SHARED_SHARE of its phrases are shared or repeated.
 * 3. An anchor ties a sentence to something checkable: a quotation, a number or
 *    date, a named person or place other than the subject, or the writer's own
 *    "I". The weaker rules only fire on sentences of MIN_WORDS or more that
 *    have no anchor. Three of them (generalization, advice, abstract) also skip
 *    any sentence about one particular person. The fourth (typeTalk) runs on
 *    people pages only, where a sentence about the type is not about the person.
 *    The wording rules skip sentences with a quotation, number or name, so
 *    "She was born in 1979" is never flagged for being phrased like a fact.
 * 4. Scores are shares of words. A section's score is the words in its flagged
 *    sentences over all its prose words; the post's score is the same sum over
 *    the whole post. A section ends at the next H2 or H3.
 * 5. Thresholds are flags for where to look, not gates. They were set on the
 *    published corpus so that pages built on reported detail sit near the
 *    bottom and type-by-type template pages sit at the top.
 */

import {
	STOCK_PHRASES,
	countWords,
	plainText,
	splitBlocks,
	splitSentences,
	stripFrontmatter
} from './blogReadability.mjs';

export const PHRASE_WORDS = 4;
export const SHARED_POSTS = 12;
export const REPEATS_IN_POST = 4;
export const SHARED_SHARE = 0.5;
export const SHARED_SENTENCE_POSTS = 3;
export const MIN_WORDS = 9;

/** Each reason: label, what it means, what to do about it, and a two-word tag. */
export const REASONS = {
	stock: [
		'Stock phrase',
		'Uses a phrase from the stock AI list.',
		'Say the specific thing the phrase is standing in for.',
		'stock phrase'
	],
	shared: [
		'Wording shared across posts',
		'Most of this sentence is wording other posts on the site also use, once the name and type are swapped out.',
		'Keep it only if this post needs it. Otherwise say what only this post can say.',
		'shared wording'
	],
	repeated: [
		'Same frame repeated in this post',
		'The post reuses this sentence frame again and again, usually once per type.',
		'Break the template: give each entry its own shape and its own detail.',
		'repeated frame'
	],
	generalization: [
		'Hedged claim about a group',
		'Describes a whole group with a hedge (often, may, tend to) and no person, number, date or source.',
		'Show one case: who, when, what they said or did.',
		'group claim'
	],
	advice: [
		'Talks to "you", no case behind it',
		'Tells or describes "you" in general terms, with no situation or example.',
		'Tie it to a real moment, or cut it.',
		'to you'
	],
	abstract: [
		'Abstract claim',
		'Built from abstract nouns with nothing concrete attached.',
		'Swap in the concrete thing: a scene, a quote, a number.',
		'abstract'
	],
	typeTalk: [
		'Type description, no evidence',
		'On a people page: describes the type, or the person through the type, with no quote, date, number or source.',
		'Attach the moment that shows it, or keep one line and cut the rest.',
		'type talk'
	]
};
export const REASON_KEYS = Object.keys(REASONS);

/**
 * Reasons grouped by what kind of fix they ask for. A flagged sentence counts
 * toward one family only (the first that applies, in this order), so the
 * families add up to the post's score.
 */
export const FAMILIES = {
	wording: ['Boilerplate wording', ['stock', 'shared', 'repeated']],
	type: ['Type talk without evidence', ['typeTalk']],
	claims: ['Claims with nothing behind them', ['generalization', 'advice', 'abstract']]
};
export const FAMILY_KEYS = Object.keys(FAMILIES);
export const familyOf = (reasons) =>
	FAMILY_KEYS.find((key) => FAMILIES[key][1].some((reason) => reasons.includes(reason))) ?? null;
const noFamilies = () => Object.fromEntries(FAMILY_KEYS.map((key) => [key, 0]));

// Extra stock wording the detector run kept flagging in body prose. The shared
// list in blogReadability.mjs stays the source of truth; these are additions.
const EXTRA_STOCK = [
	'strong sense of',
	'known for their',
	'a number of',
	'a variety of',
	'wide range of',
	'crucial',
	'valuable insights',
	'unique perspective',
	'personal growth journey',
	'fosters',
	'fostering',
	'embark',
	'realm of',
	'underscores',
	'resonates with',
	'transformative'
];
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const STOCK = new RegExp(`\\b(${[...STOCK_PHRASES, ...EXTRA_STOCK].map(escape).join('|')})`, 'gi');
// Capitalized mid-sentence ("the company renamed itself Pivotal") is a name.
const hasStock = (text) =>
	[...text.matchAll(STOCK)].some((match) => match.index === 0 || /^[a-z]/.test(match[0]));

const GROUP =
	/\b(people|individuals|everyone|anyone|someone|we all|humans|most of us|many|others|those who|types?|ones|twos|threes|fours|fives|sixes|sevens|eights|nines|they|their)\b/i;
const HEDGE =
	/\b(often|tend to|tends to|may|might|can(?!['’]t)|typically|usually|sometimes|generally|commonly|frequently|naturally|likely)\b/i;
const ADVICE =
	/^(try|start|notice|ask|remember|consider|practice|take|make|give|let|use|set|keep|stop|pay|focus|build|create|find|learn|be|do|don['’]t|avoid|schedule|write|share|tell|listen|look|pick|choose|allow|embrace|recognize|acknowledge)\b|\byou (should|can|need|must|might|may|will|could|have to|want)\b|\byou['’]ll\b|\byour\b/i;
// Abstractions that carry a sentence when nothing concrete does. A list, not a
// suffix rule: "witness", "question" and "city" end like abstractions and are not.
const ABSTRACT = new RegExp(
	`\\b(${'ability abilities approach authenticity awareness balance behaviors? beliefs? boundaries capabilities challenges clarity communication confidence connection desires? development dynamics emotions? environment expectations experiences? fears? fulfillment goals growth harmony identity insights? intimacy journey mastery mindset motivations? needs opportunities outcomes patterns perspectives? potential process purpose relationships? resilience security self-awareness skills stability strategies strengths success tendencies tension understanding validation values vulnerability well-being'
		.split(' ')
		.join('|')})\\b`,
	'gi'
);
// Words that mean the sentence is about the type system rather than a person.
const TYPE_TALK = new Set(
	'TYPES TYPENAME enneagram type types wing wings subtype subtypes instinctual triad arrow integration disintegration tritype'.split(
		' '
	)
);

const TOKEN = /[a-z0-9]+(?:['’][a-z]+)?/g;
const NUMBER_WORDS = new Set('one two three four five six seven eight nine'.split(' '));
const TYPE_NOUNS = new Set('ones twos threes fours fives sixes sevens eights nines'.split(' '));
const TYPE_NAMES = new Set(
	'reformer perfectionist helper giver achiever performer individualist romantic investigator observer loyalist skeptic enthusiast adventurer challenger protector peacemaker mediator'.split(
		' '
	)
);
const PRONOUNS = new Map([
	['she', 'he'],
	['her', 'his'],
	['hers', 'his'],
	['herself', 'himself']
]);
// Capitalized words that are vocabulary, not a named person or place.
const NOT_A_NAME = new Set(
	[
		'I',
		'Enneagram',
		'Type',
		'Types',
		'One',
		'Two',
		'Three',
		'Four',
		'Five',
		'Six',
		'Seven',
		'Eight',
		'Nine',
		...[...TYPE_NOUNS, ...TYPE_NAMES].map((w) => w[0].toUpperCase() + w.slice(1))
	].flatMap((w) => [w, `${w}s`])
);

/** Lowercase words with the name, numbers, type words and she/he swapped out. */
export function maskedTokens(text, nameTokens = new Set()) {
	const out = [];
	for (const raw of text.toLowerCase().match(TOKEN) ?? []) {
		let token = raw;
		if (nameTokens.has(raw.replace(/['’]s$/, ''))) token = 'PERSON';
		else if (/^\d/.test(raw) || NUMBER_WORDS.has(raw)) token = '#';
		else if (TYPE_NOUNS.has(raw)) token = 'TYPES';
		else if (TYPE_NAMES.has(raw)) token = 'TYPENAME';
		else if (PRONOUNS.has(raw)) token = PRONOUNS.get(raw);
		if (token === 'PERSON' && out.at(-1) === 'PERSON') continue;
		out.push(token);
	}
	return out;
}

export function phrases(tokens, size = PHRASE_WORDS) {
	const out = [];
	for (let i = 0; i + size <= tokens.length; i++) out.push(tokens.slice(i, i + size).join(' '));
	return out;
}

// Counts live in a fixed table of hashed slots, so memory stays flat however
// large the corpus gets. A rare collision can only nudge a count up by one.
const PHRASE_BITS = 24;
const SENTENCE_BITS = 22;
function slot(text, bits) {
	let h = 0x811c9dc5;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return ((h >>> 0) ^ (h >>> bits)) & ((1 << bits) - 1);
}
const phraseSlot = (phrase) => slot(phrase, PHRASE_BITS);
const sentenceSlot = (tokens) => slot(tokens.join(' '), SENTENCE_BITS);

/**
 * The writer's own words in each sentence. A quotation that runs across
 * several sentences stays a quotation, so the subject's "I" and "you" are
 * never read as the writer's.
 */
function authorProse(sentences) {
	let open = false;
	return sentences.map((sentence) => {
		let author = '';
		let quoted = 0;
		let previous = '';
		for (const ch of sentence) {
			if (ch === '“') open = true;
			else if (ch === '”') open = false;
			else if (ch === '"' && !/\d/.test(previous)) open = !open;
			else if (open) quoted++;
			else author += ch;
			previous = ch;
		}
		return { author: author.replace(/\s+/g, ' ').trim(), quoted };
	});
}

function anchorsOf(author, quoted, nameTokens) {
	const anchors = [];
	if (quoted >= 12) anchors.push('quote');
	if (/\d/.test(author.replace(/\btypes?\s+\d\b/gi, '').replace(/\b\dw\d\b/gi, ''))) {
		anchors.push('number');
	}
	const words = author.match(/[A-Za-z][A-Za-z'’-]*/g) ?? [];
	const named = words.some(
		(word, index) =>
			index > 0 &&
			/^[A-Z][a-z]{2,}/.test(word) &&
			!NOT_A_NAME.has(word) &&
			!nameTokens.has(word.toLowerCase().replace(/['’]s$/, ''))
	);
	if (named) anchors.push('name');
	if (/\b(I|I['’](m|ve|d|ll)|[Mm]y|me|mine)\b/.test(author)) anchors.push('first-person');
	return anchors;
}

function unitsOf(block, nameTokens) {
	const lines =
		block.kind === 'list' || block.kind === 'quote' ? block.text.split('\n') : [block.text];
	return lines.flatMap((line) => {
		const sentences = splitSentences(line);
		const prose = authorProse(sentences);
		return sentences
			.map((text, i) => {
				const { author, quoted } = prose[i];
				const tokens = block.kind === 'quote' ? [] : maskedTokens(author, nameTokens);
				return {
					text,
					words: countWords(text),
					quoted: block.kind === 'quote',
					author,
					tokens,
					anchors: anchorsOf(author, quoted, nameTokens),
					// about the page's subject, or about one particular person
					aboutSomeone: tokens.some((t) => t === 'PERSON' || t === 'he' || t === 'his')
				};
			})
			.filter((unit) => unit.words > 0);
	});
}

const PROSE_KINDS = new Set(['paragraph', 'list', 'quote', 'component']);

/**
 * Read a post once into sections of sentences. `name` is the subject of a
 * people page ("Dakota Johnson"); leave it empty for every other post.
 */
export function parsePost(markdown, { name = '' } = {}) {
	const { data, body } = stripFrontmatter(markdown);
	const nameTokens = new Set(name.toLowerCase().match(/[a-z]{3,}/g) ?? []);
	const blocks = [];
	for (const block of splitBlocks(body)) {
		// Headings carry links and emphasis; a section is named by its plain text.
		const section = plainText(block.section).trim();
		if (block.kind === 'heading') {
			const title = plainText(block.title).trim();
			blocks.push({ kind: 'heading', level: block.level, title, section, units: [] });
			continue;
		}
		if (!PROSE_KINDS.has(block.kind)) continue;
		const units = unitsOf(block, nameTokens);
		if (units.length) blocks.push({ kind: block.kind, section, units });
	}
	return {
		title: typeof data.title === 'string' ? data.title : '',
		published: data.published === true,
		name,
		blocks
	};
}

const unitsIn = (parsed) => parsed.blocks.flatMap((block) => block.units);

/** Count, for every phrase and whole sentence, how many posts use it. */
export function buildIndex(posts) {
	const table = new Uint16Array(1 << PHRASE_BITS);
	const sentences = new Uint16Array(1 << SENTENCE_BITS);
	const members = new Set();
	for (const { id, parsed } of posts) {
		const seen = new Set();
		const seenSentences = new Set();
		for (const unit of unitsIn(parsed)) {
			for (const phrase of phrases(unit.tokens)) seen.add(phraseSlot(phrase));
			if (unit.tokens.length >= 3) seenSentences.add(sentenceSlot(unit.tokens));
		}
		for (const s of seen) if (table[s] < 65535) table[s]++;
		for (const s of seenSentences) if (sentences[s] < 65535) sentences[s]++;
		members.add(id);
	}
	return { table, sentences, members, posts: posts.length };
}

const pct = (part, whole) => (whole ? Math.round((1000 * part) / whole) / 10 : 0);

/**
 * Flag the generic sentences in one parsed post. `id` is the key the post was
 * indexed under, so its own wording is not counted against it.
 */
export function scorePost(parsed, index, { id = null } = {}) {
	const own = id !== null && index.members.has(id) ? 1 : 0;
	const inPost = new Map();
	for (const unit of unitsIn(parsed)) {
		for (const phrase of phrases(unit.tokens)) {
			const s = phraseSlot(phrase);
			inPost.set(s, (inPost.get(s) ?? 0) + 1);
		}
	}

	const sections = new Map();
	const reasons = Object.fromEntries(REASON_KEYS.map((key) => [key, { sentences: 0, words: 0 }]));
	const specifics = { quote: 0, number: 0, name: 0, 'first-person': 0 };
	const families = noFamilies();
	let words = 0;
	let genericWords = 0;

	const blocks = parsed.blocks.map((block) => {
		if (block.kind === 'heading') {
			return { kind: 'heading', level: block.level, title: block.title, section: block.section };
		}
		if (!sections.has(block.section)) {
			sections.set(block.section, {
				name: block.section,
				words: 0,
				genericWords: 0,
				flagged: 0,
				families: noFamilies()
			});
		}
		const section = sections.get(block.section);
		const sentences = block.units.map((unit) => {
			const found = unit.quoted ? [] : reasonsFor(unit, index, own, inPost, Boolean(parsed.name));
			words += unit.words;
			section.words += unit.words;
			if (unit.quoted && !unit.anchors.includes('quote')) specifics.quote++;
			for (const anchor of unit.anchors) specifics[anchor]++;
			const family = familyOf(found);
			if (family) {
				genericWords += unit.words;
				section.genericWords += unit.words;
				section.flagged++;
				families[family] += unit.words;
				section.families[family] += unit.words;
				for (const key of found) {
					reasons[key].sentences++;
					reasons[key].words += unit.words;
				}
			}
			return { text: unit.text, words: unit.words, reasons: found, family, anchors: unit.anchors };
		});
		return { kind: block.kind, section: block.section, sentences };
	});

	return {
		title: parsed.title,
		published: parsed.published,
		words,
		genericWords,
		genericPct: pct(genericWords, words),
		flagged: [...sections.values()].reduce((sum, section) => sum + section.flagged, 0),
		families,
		reasons,
		specifics,
		sections: [...sections.values()].map((section) => ({
			...section,
			genericPct: pct(section.genericWords, section.words)
		})),
		blocks
	};
}

function reasonsFor(unit, index, own, inPost, peoplePage) {
	const found = [];
	if (hasStock(unit.author)) found.push('stock');

	// A sentence that carries a quotation, a number or a name is tied to
	// something, however common the "she told the magazine in" around it.
	if (!unit.anchors.some((anchor) => anchor !== 'first-person')) {
		const list = phrases(unit.tokens);
		let shared = 0;
		let repeated = 0;
		for (const phrase of list) {
			const s = phraseSlot(phrase);
			if (index.table[s] - own >= SHARED_POSTS) shared++;
			else if ((inPost.get(s) ?? 0) >= REPEATS_IN_POST) repeated++;
		}
		const wholeSentence =
			unit.tokens.length >= 3 &&
			index.sentences[sentenceSlot(unit.tokens)] - own >= SHARED_SENTENCE_POSTS;
		if (wholeSentence || (list.length >= 3 && shared / list.length >= SHARED_SHARE)) {
			found.push('shared');
		} else if (list.length >= 3 && repeated && (shared + repeated) / list.length >= SHARED_SHARE) {
			found.push('repeated');
		}
	}

	if (unit.words >= MIN_WORDS && !unit.anchors.length) {
		if (!unit.aboutSomeone) {
			if (GROUP.test(unit.author) && HEDGE.test(unit.author)) found.push('generalization');
			if (ADVICE.test(unit.author)) found.push('advice');
			if ((unit.author.match(ABSTRACT) ?? []).length >= 2) found.push('abstract');
		}
		if (peoplePage && unit.tokens.some((token) => TYPE_TALK.has(token))) found.push('typeTalk');
	}
	return found;
}

/** The wording most posts share: every phrase used by `min` or more posts. */
export function sharedPhrases(posts, index, min = SHARED_POSTS * 2) {
	const counts = new Map();
	for (const { parsed } of posts) {
		const seen = new Set();
		for (const unit of unitsIn(parsed)) {
			for (const phrase of phrases(unit.tokens)) {
				if (index.table[phraseSlot(phrase)] >= min) seen.add(phrase);
			}
		}
		for (const phrase of seen) counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
	}
	return [...counts.entries()]
		.filter(([, posts]) => posts >= min)
		.sort((a, b) => b[1] - a[1])
		.map(([phrase, posts]) => ({ phrase, posts }));
}
