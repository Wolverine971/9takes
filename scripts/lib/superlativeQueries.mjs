// scripts/lib/superlativeQueries.mjs
/**
 * Pure helpers for the superlative-query auditor (scripts/audit-superlative-queries.mjs).
 *
 * The bug class: a page ranks for "which Enneagram type is most X" searches
 * (worst, most manipulative, most likely to cheat, most likely to be autistic…)
 * but never asks or answers that question, so the SERP snippet doesn't match
 * the search and the click goes elsewhere. The in-site control is the ADHD page:
 * its QuickAnswer asks "Which Enneagram type is most likely to have ADHD?" and it
 * earns 5.87% CTR at position 5.2.
 *
 * Rules, kept simple so every flag can be explained in one sentence:
 *
 * 1. isSuperlativeQuery: the query is about personality types (Enneagram and its
 *    misspellings, "personality type", MBTI, "type N", wings) AND asks for a pick:
 *    a superlative (most, least, worst, best, rarest, any -est word), a likelihood
 *    ("likely to"), or a selection frame ("which/what enneagram is/are" + the/a/an
 *    or an attribute). "what enneagram is tina fey" is a person lookup: excluded.
 *    Product searches ("best enneagram test", "most accurate enneagram quiz") ask
 *    which product, not which type. They count ONLY on a page whose URL contains
 *    the product word (a test page), where that superlative is the head term.
 *    Searches about one named type ("enneagram 3 biggest fear", "best jobs for
 *    enneagram 4") are excluded unless they ask for a match ("most compatible with 4").
 * 2. foldFragments: GSC reports #fragment jump links (and person-slug case
 *    variants) as separate rows of the same SERP entry. Keep the single largest
 *    row per page+query. Never sum: summing inflated some counts 3x to 7x.
 * 3. extractAnswerSurface: the parts of a page that can answer a search at a
 *    glance: QuickAnswer question + body, H2/H3 headings, FAQ questions (visible,
 *    JSON-LD and people `faqs` frontmatter), title/meta_title/description.
 * 4. isAnswered: the query's concept terms (what is left after removing the
 *    Enneagram words and the pick scaffolding: "cheat", "narcissist", "worst") all
 *    appear in ONE QuickAnswer question, heading or FAQ question that is itself
 *    phrased as a pick (which / most / least / -est / likely).
 *    placement 'lead' = the QuickAnswer question or an H2 asks it (the ADHD
 *    control). 'buried' = only an H3 or the FAQ asks it, which is how the
 *    manipulation, depression and autism pages sat at 0-2 clicks on page 1.
 */

import matter from 'gray-matter';

const list = (text) => text.trim().split(/\s+/);

// enneagram, enneagrams, eneagram, ennegram, ennagram (spellings seen in GSC)
const ENNEAGRAM_WORD = 'en+e*a*gr?a*ms?';
const ENNEAGRAM_RE = new RegExp(`\\b${ENNEAGRAM_WORD}\\b`, 'g');
const ENNEAGRAM_TOKEN_RE = new RegExp(`^${ENNEAGRAM_WORD}$`);

const DOMAIN_RE = new RegExp(
	[
		`\\b${ENNEAGRAM_WORD}\\b`,
		'\\bpersonality types?\\b',
		'\\bmbti\\b',
		'\\btype [1-9]s?\\b',
		'\\b[1-9]w[1-9]\\b',
		'\\binstinctual\\b',
		'\\btritypes?\\b'
	].join('|')
);

// Words ending in -est that are not superlatives.
const EST_STOPLIST = new Set(
	list(`arrest attest behest bequest chest conquest contest crest detest digest divest
	earnest fest forest guest harvest honest infest ingest inquest interest invest jest
	latest lest manifest modest molest nest pest pretest priest protest quest request
	rest retest suggest test unrest vest west zest`)
);

const TYPE_NUMBER_RE = /^[1-9](w[1-9])?$/;
const ONE_TYPE_RE = /\b(?:[1-9](?:w[1-9])?|(?:sp|so|sx)[1-9])\b/;

const PRODUCT_RE =
	/\b(tests?|quiz(?:zes)?|assessments?|books?|apps?|courses?|trainings?|certifications?|podcasts?|websites?|sites?|tools?|workshops?|inventor(?:y|ies)|ieq9|riso|truity)\b/;

// After "which/what enneagram (type) is/are", these first words mark an attribute
// ("is the most…", "is a narcissist", "are compatible"), not a person's name.
const FRAME_TAIL_WORDS = new Set(
	list('the a an more less most least likely prone compatible incompatible best worst')
);
const FRAME_RE = new RegExp(
	`\\b(?:which|what|whats|what's)\\s+(?:${ENNEAGRAM_WORD}|personality|mbti)(?:\\s+(?:types?|numbers?))?\\s+(is|are|has|have|gets?|tends? to)\\s+(\\S+)`
);

function normalizeQuery(query) {
	return String(query ?? '')
		.toLowerCase()
		.replace(/[‘’]/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

function words(text) {
	return normalizeQuery(text)
		.split(/[^a-z0-9']+/)
		.map((w) => w.replace(/^'+|'+$/g, '').replace(/'s$/, ''))
		.filter(Boolean);
}

function isSuperlativeWord(word) {
	if (word === 'most' || word === 'least' || word === 'worst' || word === 'best') return true;
	return /^[a-z]{3,}est$/.test(word) && !EST_STOPLIST.has(word);
}

/** Superlative (most, least, worst, best, -est) or likelihood marker. */
function hasPickMarker(text) {
	const q = normalizeQuery(text);
	return words(q).some(isSuperlativeWord) || /\b(?:likely|likeliest)\b/.test(q);
}

/** Path part of a URL (no origin, query or fragment), lowercased. */
function pathOf(page) {
	return String(page ?? '')
		.replace(/^https?:\/\/[^/]+/i, '')
		.split('#')[0]
		.split('?')[0]
		.toLowerCase();
}

function singular(noun) {
	if (noun === 'quizzes') return 'quiz';
	if (noun === 'inventories') return 'inventory';
	return noun.replace(/s$/, '');
}

/**
 * Classify a search query.
 * @param {string} query
 * @param {{ page?: string }} [opts] landing page URL or path (decides product queries)
 * @returns {{ superlative: boolean, kind: 'type'|'product'|'one-type'|null, reason: string }}
 */
export function classifyQuery(query, { page } = {}) {
	const q = normalizeQuery(query);
	if (!q) return { superlative: false, kind: null, reason: 'empty' };
	if (!DOMAIN_RE.test(q)) return { superlative: false, kind: null, reason: 'not about types' };

	let marker = hasPickMarker(q);
	if (!marker) {
		const frame = q.match(FRAME_RE);
		if (frame) {
			const [, verb, next] = frame;
			marker = /^(is|are)$/.test(verb)
				? FRAME_TAIL_WORDS.has(next) || isSuperlativeWord(next)
				: !/^(i|you|we|he|she|they|it|my|your)$/.test(next);
		}
	}
	if (!marker) return { superlative: false, kind: null, reason: 'no pick marker' };

	// "free" only describes products ("best free enneagram" is a truncated test search).
	const product = q.match(PRODUCT_RE) ?? (/\bfree\b/.test(q) ? [null, 'test'] : null);
	if (product) {
		const noun = singular(product[1]);
		return page && pathOf(page).includes(noun)
			? { superlative: true, kind: 'product', reason: `product superlative on a ${noun} page` }
			: { superlative: false, kind: 'product', reason: `product query (${noun}), not a type pick` };
	}
	// "enneagram 3 biggest fear", "best jobs for enneagram 4": the superlative is
	// about one named type. A match question ("most compatible with 4") is a pick.
	if (ONE_TYPE_RE.test(q) && !conceptTerms(q).includes('compatible')) {
		return { superlative: false, kind: 'one-type', reason: 'about one named type, not a pick' };
	}
	return { superlative: true, kind: 'type', reason: 'type pick' };
}

/** True when a query asks which type is most/least/worst/likeliest… (see classifyQuery). */
export function isSuperlativeQuery(query, opts = {}) {
	return classifyQuery(query, opts).superlative;
}

// ---------------------------------------------------------------------------
// Concept terms
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(
	list(`a about all am an and are be being by can do does each for free get gets has
	have having how i in is it its likeliest likely list me more most mbti my number
	numbers of on one online or people person personality prone reddit result results
	tend tends that the to type types was were what whats what's which who whos will
	with would you your`)
);

// Words that answer the same search, keyed by the canonical concept term.
const SYNONYM_GROUPS = {
	adhd: 'adhd add',
	autism: 'autism autistic autist autists asd asperger aspergers',
	bpd: 'bpd borderline',
	cheat: 'cheat cheats cheating cheater cheaters unfaithful infidelity',
	common: 'common popular',
	compatible: `compatible compatibility match matches pairing pairings pair pairs partner
		partners couple couples relationship relationships`,
	depression: 'depression depressed depressive',
	job: 'job jobs career careers',
	manipulative: `manipulative manipulate manipulates manipulation manipulator
		manipulators manipulating`,
	narcissist: 'narcissist narcissists narcissistic narcissism npd',
	psychopath: `psychopath psychopaths psychopathic psychopathy sociopath sociopaths
		sociopathic`,
	rare: 'rare rarest rarer rarity',
	toxic: 'toxic toxicity'
};
const SYNONYMS = new Map();
for (const [canonical, group] of Object.entries(SYNONYM_GROUPS)) {
	for (const word of list(group)) SYNONYMS.set(word, canonical);
}

const SUFFIXES = list(
	'ically ical ness ings ing ists ist isms ism ions ion ies ied ers er ed es s ly y'
);

function stem(word) {
	if (word.length <= 4) return word;
	// meanest → mean, smartest → smart, happiest → happy, biggest → big
	if (isSuperlativeWord(word) && !['worst', 'best', 'least'].includes(word)) {
		const base = word.endsWith('iest') ? `${word.slice(0, -4)}y` : word.slice(0, -3);
		return /([b-df-hj-np-tv-z])\1$/.test(base) ? base.slice(0, -1) : base;
	}
	if (/(?:ous|ss|us|is)$/.test(word)) return word;
	const suffix = SUFFIXES.find((s) => word.endsWith(s) && word.length - s.length >= 4);
	return suffix ? word.slice(0, -suffix.length) : word;
}

function canon(word) {
	return SYNONYMS.get(word) ?? stem(word);
}

/** Same concept? Terms under 5 letters must match exactly; longer ones may differ in the last 2. */
function termMatch(a, b) {
	if (a === b) return true;
	if (a.length < 5 || b.length < 5) return false;
	let i = 0;
	while (i < a.length && i < b.length && a[i] === b[i]) i++;
	return i >= Math.max(5, Math.min(a.length, b.length) - 2);
}

/**
 * What the query asks about once the Enneagram words and the pick scaffolding are
 * removed: "which enneagram is most likely to be a narcissist" → ["narcissist"],
 * "worst enneagram type" → ["worst"], "most likely to cheat" → ["cheat"].
 * Type numbers (1-9) and wings (4w5) stay; other numbers (years) are dropped.
 * "best" is dropped when it modifies another concept: "best enneagram pairings"
 * asks the same thing as "most compatible enneagram types".
 */
export function conceptTerms(query) {
	const out = [];
	for (const word of words(query)) {
		if (STOPWORDS.has(word) || ENNEAGRAM_TOKEN_RE.test(word)) continue;
		if (/^\d/.test(word) && !TYPE_NUMBER_RE.test(word)) continue;
		const term = canon(word);
		if (!out.includes(term)) out.push(term);
	}
	if (out.includes('best') && out.some((t) => t !== 'best' && !TYPE_NUMBER_RE.test(t))) {
		out.splice(out.indexOf('best'), 1);
	}
	return out;
}

/** Stable cluster key for a query: its concept terms, sorted. */
export function clusterKey(query) {
	return [...conceptTerms(query)].sort().join(' + ');
}

function covers(text, concept) {
	const tokens = words(text).map(canon);
	return concept.every((term) => tokens.some((token) => termMatch(term, token)));
}

/** A heading or question phrased as a pick: which…, most…, least…, -est, likely. */
export function isPickPhrased(text) {
	return hasPickMarker(text) || /\bwhich\b/.test(normalizeQuery(text));
}

// ---------------------------------------------------------------------------
// Answer surface
// ---------------------------------------------------------------------------

function stripInline(text) {
	return String(text ?? '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\{#[^}]*\}/g, '')
		.replace(/[*_`]/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&#39;|&rsquo;|&apos;/g, "'")
		.replace(/&quot;|&ldquo;|&rdquo;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();
}

const unquote = (value) => value.trim().replace(/^(['"])([\s\S]*)\1$/, '$2');

/** Regex fallback for frontmatter that YAML can't parse (see the people-pipeline `\'` bug). */
function looseFrontmatter(block) {
	const field = (name) => {
		const m = block.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
		return m ? unquote(m[1]) : null;
	};
	return {
		title: field('title'),
		meta_title: field('meta_title'),
		description: field('description'),
		faqs: [...block.matchAll(/^\s*-\s*question:\s*(.+)$/gm)].map((m) => ({
			question: unquote(m[1])
		}))
	};
}

function splitFrontmatter(markdown) {
	try {
		const parsed = matter(markdown);
		return { data: parsed.data ?? {}, body: parsed.content };
	} catch {
		const m = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
		if (!m) return { data: {}, body: markdown };
		return { data: looseFrontmatter(m[1]), body: markdown.slice(m[0].length) };
	}
}

function jsonLdQuestions(body) {
	const out = [];
	for (const block of body.matchAll(
		/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi
	)) {
		let parsed;
		try {
			parsed = JSON.parse(block[1]);
		} catch {
			parsed = null;
		}
		if (!parsed) {
			for (const m of block[1].matchAll(
				/"@type"\s*:\s*"Question"[\s\S]*?"name"\s*:\s*"((?:[^"\\]|\\.)*)"/g
			)) {
				out.push(m[1].replace(/\\"/g, '"'));
			}
			continue;
		}
		const walk = (node) => {
			if (Array.isArray(node)) return node.forEach(walk);
			if (!node || typeof node !== 'object') return;
			const type = node['@type'];
			const isQuestion = Array.isArray(type) ? type.includes('Question') : type === 'Question';
			if (isQuestion && typeof node.name === 'string') out.push(node.name);
			Object.values(node).forEach(walk);
		};
		walk(parsed);
	}
	return out;
}

/**
 * The parts of a markdown page that can answer a search at a glance.
 * @param {string} markdown full file text, frontmatter included
 * @returns {{
 *   title: string|null, metaTitle: string|null, description: string|null,
 *   quickAnswers: {question: string, body: string}[],
 *   headings: {level: number, text: string}[],
 *   faqQuestions: {text: string, source: 'visible'|'jsonld'|'frontmatter'}[],
 *   bodyText: string
 * }}
 */
export function extractAnswerSurface(markdown) {
	const { data, body } = splitFrontmatter(String(markdown ?? ''));
	const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);

	const quickAnswers = [];
	for (const m of body.matchAll(/<QuickAnswer\b([^>]*)>([\s\S]*?)<\/QuickAnswer>/g)) {
		const attr = m[1].match(/\bquestion\s*=\s*\{?\s*(["'`])([\s\S]*?)\1/);
		quickAnswers.push({ question: attr ? stripInline(attr[2]) : '', body: stripInline(m[2]) });
	}

	const faqQuestions = jsonLdQuestions(body).map((name) => ({
		text: stripInline(name),
		source: 'jsonld'
	}));
	for (const faq of Array.isArray(data.faqs) ? data.faqs : []) {
		const q = str(faq?.question);
		if (q) faqQuestions.push({ text: stripInline(q), source: 'frontmatter' });
	}

	// Rendered prose only: no scripts, styles, head tags, comments or code fences.
	const visible = body
		.replace(/<!--[\s\S]*?-->/g, '\n')
		.replace(/<script[\s\S]*?<\/script>/gi, '\n')
		.replace(/<style[\s\S]*?<\/style>/gi, '\n')
		.replace(/<svelte:head>[\s\S]*?<\/svelte:head>/gi, '\n')
		.replace(/```[\s\S]*?```/g, '\n');

	const headings = [];
	const addHeading = (level, raw) => {
		const text = stripInline(raw);
		if (level <= 3) headings.push({ level, text });
		else if (text.endsWith('?')) faqQuestions.push({ text, source: 'visible' });
	};
	for (const line of visible.split('\n')) {
		const atx = line.match(/^\s{0,3}(#{2,6})\s+(.+?)\s*#*\s*$/);
		if (atx) {
			addHeading(atx[1].length, atx[2]);
			continue;
		}
		const bold = line.match(/^\s*(?:\*\*|__)(.+?\?)(?:\*\*|__)\s*$/);
		if (bold) faqQuestions.push({ text: stripInline(bold[1]), source: 'visible' });
	}
	for (const m of visible.matchAll(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
		addHeading(Number(m[1]), m[2]);
	}
	for (const m of visible.matchAll(/<(summary|strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
		const text = stripInline(m[2]);
		if (text.endsWith('?') && text.length > 8) faqQuestions.push({ text, source: 'visible' });
	}

	return {
		title: str(data.title),
		metaTitle: str(data.meta_title),
		description: str(data.description),
		quickAnswers,
		headings,
		faqQuestions,
		bodyText: stripInline(visible.replace(/^\s*#{1,6}\s+/gm, ''))
	};
}

// ---------------------------------------------------------------------------
// Answered?
// ---------------------------------------------------------------------------

/**
 * Does the page's answer surface answer this superlative query?
 * Answered = every concept term appears in ONE QuickAnswer question, H2/H3
 * heading or FAQ question (visible, JSON-LD or people `faqs`) that is phrased as
 * a pick (which / most / least / -est / likely).
 * placement: 'lead' when the QuickAnswer question or an H2 asks it, 'buried'
 * when only an H3 or the FAQ does.
 * @returns {{ answered: boolean, placement: 'lead'|'buried'|null, concept: string[],
 *   via: string|null, where: string|null }}
 */
export function isAnswered(query, surface) {
	const concept = conceptTerms(query);
	const result = (placement, via, where) => ({
		answered: placement !== null,
		placement,
		concept,
		via,
		where
	});
	if (!concept.length) return result('lead', 'no-concept', null);
	const hit = (text) => Boolean(text) && isPickPhrased(text) && covers(text, concept);

	const qa = (surface.quickAnswers ?? []).find((q) => hit(q.question));
	if (qa) return result('lead', 'quickanswer', qa.question);
	const h2 = (surface.headings ?? []).find((h) => h.level === 2 && hit(h.text));
	if (h2) return result('lead', 'h2', h2.text);
	const h3 = (surface.headings ?? []).find((h) => h.level > 2 && hit(h.text));
	if (h3) return result('buried', `h${h3.level}`, h3.text);
	const faqOrder = { visible: 0, frontmatter: 1, jsonld: 2 };
	const faq = [...(surface.faqQuestions ?? [])]
		.sort((a, b) => (faqOrder[a.source] ?? 3) - (faqOrder[b.source] ?? 3))
		.find((f) => hit(f.text));
	if (faq)
		return result('buried', faq.source === 'visible' ? 'faq' : `faq (${faq.source})`, faq.text);
	return result(null, null, null);
}

/** Does the SERP title (meta_title, else title) ask this pick? */
export function titleAsks(query, surface) {
	const concept = conceptTerms(query);
	const title = surface.metaTitle ?? surface.title;
	return Boolean(title) && concept.length > 0 && isPickPhrased(title) && covers(title, concept);
}

function countMentions(text, concept) {
	const primary = concept.find((t) => !TYPE_NUMBER_RE.test(t)) ?? concept[0];
	return words(text)
		.map(canon)
		.filter((token) => termMatch(primary, token)).length;
}

/**
 * One-line explanation of why a cluster is flagged: where the question is (or
 * isn't) asked, how often the concept shows up in the body, and what the
 * QuickAnswer asks instead.
 */
export function describeGap(query, surface, verdict = isAnswered(query, surface)) {
	const concept = conceptTerms(query);
	const label = concept.join(' + ');
	const parts = [];
	if (verdict.answered && verdict.placement === 'buried') {
		parts.push(
			`asked only in the ${verdict.via} ("${verdict.where}"), not in the QuickAnswer question or an H2`
		);
	} else {
		const near = [
			...(surface.quickAnswers ?? []).map((q) => q.question),
			...(surface.headings ?? []).map((h) => h.text),
			...(surface.faqQuestions ?? []).map((f) => f.text)
		].filter((text) => text && covers(text, concept));
		const inSnippet = [surface.metaTitle, surface.title, surface.description].some(
			(text) => text && covers(text, concept)
		);
		if (near.length) {
			parts.push(
				`"${label}" is in ${near.length} heading/question(s) but none asks for a pick (e.g. "${near[0]}")`
			);
		} else if (inSnippet) {
			parts.push(
				`"${label}" is in the title/description, but no QuickAnswer, heading or FAQ asks it`
			);
		} else {
			parts.push(`no QuickAnswer, heading or FAQ mentions "${label}"`);
		}
	}
	parts.push(`body mentions: ${countMentions(surface.bodyText ?? '', concept)}`);
	const qa = (surface.quickAnswers ?? []).find((q) => q.question)?.question;
	parts.push(qa ? `QuickAnswer asks "${qa}"` : 'no QuickAnswer');
	return parts.join('; ');
}

/** "most manipulative enneagram" → "Which Enneagram type is the most manipulative?" */
export function suggestQuestion(query) {
	let q = normalizeQuery(query).replace(ENNEAGRAM_RE, 'Enneagram');
	if (PRODUCT_RE.test(q)) {
		// "most accurate enneagram test" → "What is the most accurate Enneagram test?"
		if (!/^(which|what|whats|what's)\b/.test(q)) q = `what is the ${q.replace(/^the /, '')}`;
		q = q.replace(/^(?:whats|what's)\b/, 'what is');
	} else if (/^(which|what|whats|what's)\b/.test(q)) {
		q = q.replace(/^(?:whats|what's)\b/, 'what is');
		if (!/\bEnneagram types?\b/.test(q)) q = q.replace(/\bEnneagram\b/, 'Enneagram type');
	} else {
		const rest = q
			.replace(/\bEnneagram\b/, '')
			.replace(/\btypes?\b/, '')
			.replace(/\s+/g, ' ')
			.trim();
		if (/^(most|least) likely\b/.test(rest)) q = `which Enneagram type is ${rest}`;
		else if (/^(most|least)\b/.test(rest)) q = `which Enneagram type is the ${rest}`;
		else if (/^(the )?([a-z]+est|worst|best)\b/.test(rest)) {
			q = `what is the ${rest.replace(/^the /, '')} Enneagram type`;
		} else q = `which Enneagram type is ${rest}`;
	}
	q = q.replace(/\s+/g, ' ').trim().replace(/\?+$/, '');
	return `${q.charAt(0).toUpperCase()}${q.slice(1)}?`;
}

// ---------------------------------------------------------------------------
// GSC rows
// ---------------------------------------------------------------------------

const NUMERIC_COLUMNS = new Set(['clicks', 'impressions', 'ctr_pct', 'position']);

function parseCsvLine(line) {
	const cells = [];
	let cell = '';
	let quoted = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (quoted) {
			if (ch === '"' && line[i + 1] === '"') {
				cell += '"';
				i++;
			} else if (ch === '"') quoted = false;
			else cell += ch;
		} else if (ch === '"') quoted = true;
		else if (ch === ',') {
			cells.push(cell);
			cell = '';
		} else cell += ch;
	}
	cells.push(cell);
	return cells;
}

/** Parse a GSC export CSV (page,query,clicks,impressions,ctr_pct,position). */
export function parseGscCsv(text) {
	const lines = String(text ?? '')
		.split(/\r?\n/)
		.filter((line) => line.trim());
	if (!lines.length) return [];
	const header = parseCsvLine(lines.shift());
	return lines.map((line) => {
		const cells = parseCsvLine(line);
		const row = {};
		header.forEach((col, idx) => {
			const value = cells[idx] ?? '';
			row[col] = NUMERIC_COLUMNS.has(col) ? Number(value) : value;
		});
		return row;
	});
}

/** Default page canonicalizer: drop #fragment, ?query and a trailing slash. */
export function baseUrl(page) {
	const value = String(page ?? '')
		.split('#')[0]
		.split('?')[0];
	return /^https?:\/\/[^/]+\/?$/i.test(value) || value === '/' ? value : value.replace(/\/+$/, '');
}

/**
 * Fold GSC #fragment rows onto their base URL, keeping the single largest row
 * per page+query (most impressions, then most clicks, then best position).
 * Never sums: fragment rows are the same SERP entry counted again.
 * @param {object[]} rows {page, query, clicks, impressions, position, …}
 * @param {{ canonicalize?: (page: string) => string|null }} [opts]
 *        canonicalize maps a GSC page to its key; null drops the row.
 * @returns {object[]} one row per key+query; `page` = key, `pages` = GSC URLs folded in
 */
export function foldFragments(rows, { canonicalize = baseUrl } = {}) {
	const best = new Map();
	for (const row of rows) {
		const page = canonicalize(row.page);
		if (page == null) continue;
		const key = `${page}\u0000${row.query}`;
		const prev = best.get(key);
		const pages = prev ? prev.pages : [];
		if (!pages.includes(row.page)) pages.push(row.page);
		const better =
			!prev ||
			row.impressions > prev.impressions ||
			(row.impressions === prev.impressions && row.clicks > prev.clicks) ||
			(row.impressions === prev.impressions &&
				row.clicks === prev.clicks &&
				row.position < prev.position);
		best.set(key, better ? { ...row, page, pages } : prev);
	}
	return [...best.values()];
}

/**
 * Group one page's superlative query rows into concept clusters and judge each
 * against the page's answer surface (null surface = page couldn't be read).
 * @returns clusters ranked by impressions (desc)
 */
export function clusterPageQueries(rows, surface) {
	const groups = new Map();
	for (const row of rows) {
		const key = clusterKey(row.query);
		if (!key) continue;
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(row);
	}
	return [...groups]
		.map(([key, group]) => {
			const queries = [...group].sort((a, b) => b.impressions - a.impressions);
			const impressions = queries.reduce((sum, q) => sum + q.impressions, 0);
			const clicks = queries.reduce((sum, q) => sum + q.clicks, 0);
			const position = impressions
				? queries.reduce((sum, q) => sum + q.position * q.impressions, 0) / impressions
				: 0;
			const top = queries[0].query;
			const verdict = surface ? isAnswered(top, surface) : null;
			const needsWork = verdict && (!verdict.answered || verdict.placement === 'buried');
			return {
				key,
				concept: conceptTerms(top),
				impressions,
				clicks,
				position: Math.round(position * 10) / 10,
				queries,
				answered: verdict ? verdict.answered : null,
				placement: verdict?.placement ?? null,
				via: verdict?.via ?? null,
				where: verdict?.where ?? null,
				titleAsks: surface ? titleAsks(top, surface) : null,
				gap: needsWork ? describeGap(top, surface, verdict) : null,
				suggestion: needsWork ? suggestQuestion(top) : null
			};
		})
		.sort((a, b) => b.impressions - a.impressions);
}
