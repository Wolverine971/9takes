#!/usr/bin/env node
// scripts/blog-source-audit.mjs
//
// Load-bearing source audit for 9takes people-pipeline drafts (plan item 2.2).
//
// Read-only. For a SINGLE draft, extract the quotes/claims that sit in the five
// "load-bearing" narrative slots and classify each quote's attribution quality.
// The thesis of a personality analysis stands or falls on these five slots, so a
// skeptic must be able to trace the quotes in them:
//
//   1. Epigraph      the opening `> "quote" — Name, _Source_, Year` blockquote.
//   2. Cold open     the `<p class="firstLetter">` scene + the paragraphs that
//                    continue it up to the TL;DR / first H2 (the attribution for a
//                    cold-open quote frequently lands one paragraph below the scene).
//   3. Diagnosis     the paragraphs under `## What Is/is X's Personality Type?`
//                    and `### X is an Enneagram Type N`, where the verdict is argued.
//   4. Empathy turn  the negative-parallelism reframe sentence
//                    (`[behavior] was not [cruelty/vanity/evasion], it was [armor/reflex]`).
//   5. Close         the final one to two paragraphs of the body.
//
// Attribution tiers (traceability, not politeness):
//   inline    a named outlet/publication AND a year adjacent to the quote.
//   vague     attributed but incomplete: exactly one of {outlet, year}, OR a
//             source-venue word ("in an interview", "in his memoir") with no
//             outlet+year pinned.
//   untagged  a quote (or hard factual claim) with NO outlet, NO year, and NO
//             venue reference. A bare speech verb ("he explained decades later",
//             "he once said") counts as untagged: it names no traceable source.
//
// NOTE on the taxonomy: the plan text lists "he once said" as a *vague* example,
// but the ground-truth requirement (Goldblum's cold-open spine quote, attributed
// only "he explained decades later", must classify UNTAGGED) forces the sharper
// line drawn above: a bare attributive verb with zero source anchor is untagged,
// because that is exactly the untraceable failure mode this audit exists to catch.
// A *venue* reference ("in an interview") is what earns the vague tier.
//
// Usage:
//   node scripts/blog-source-audit.mjs <Person-Name | path/to/draft.md> [--json] [--fail-on-untagged-load-bearing]
//
// Exit codes: 0 = ran/clear, 1 = --fail-on-untagged-load-bearing and an untagged load-bearing slot was found, 2 = usage / file error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src', 'blog', 'people', 'drafts');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const failOnUntaggedLoadBearing = args.includes('--fail-on-untagged-load-bearing');
const positional = args.filter((a) => !a.startsWith('--'));
const target = positional[0];

if (!target) {
	process.stderr.write(
		'Usage: node scripts/blog-source-audit.mjs <Person-Name | path/to/draft.md> [--json] [--fail-on-untagged-load-bearing]\n'
	);
	process.exit(2);
}

function resolveDraftPath(arg) {
	const candidates = [
		arg,
		path.join(REPO_ROOT, arg),
		path.join(DRAFTS_DIR, arg.endsWith('.md') ? arg : `${arg}.md`)
	];
	for (const c of candidates) {
		try {
			if (fs.statSync(c).isFile()) return c;
		} catch {
			/* keep looking */
		}
	}
	return null;
}

const filePath = resolveDraftPath(target);
if (!filePath) {
	process.stderr.write(`Draft not found: ${target}\n`);
	process.exit(2);
}

// ---------------------------------------------------------------------------
// Parsing helpers (mirror scripts/blog-lint.sh: split FM/body, strip comments)
// ---------------------------------------------------------------------------
function splitFrontmatter(raw) {
	// Frontmatter lives between the first two lines that are exactly `---`.
	const lines = raw.split('\n');
	let first = -1;
	let second = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === '---') {
			if (first === -1) first = i;
			else {
				second = i;
				break;
			}
		}
	}
	if (first === -1 || second === -1) return { fm: '', body: raw };
	return {
		fm: lines.slice(first + 1, second).join('\n'),
		body: lines.slice(second + 1).join('\n')
	};
}

// Remove HTML comment blocks (ledgers, review notes) — multiline safe.
// Equivalent in intent to blog-lint.sh's line-based awk strip, but correct for
// inline and multi-line comments.
function stripComments(body) {
	return body.replace(/<!--[\s\S]*?-->/g, '');
}

function parseFrontmatter(fm) {
	const get = (key) => {
		const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
		if (!m) return null;
		return m[1].trim().replace(/^['"]/, '').replace(/['"]$/, '');
	};
	return {
		enneagram: (get('enneagram') || '').replace(/[^0-9]/g, '') || null,
		person: get('person'),
		title: get('title'),
		meta_title: get('meta_title'),
		date: get('date')
	};
}

// ---------------------------------------------------------------------------
// Attribution signal detection
// ---------------------------------------------------------------------------
// Unambiguous outlet names (multi-word or non-dictionary): matched case-sensitively.
const OUTLETS = [
	'The Guardian',
	'Guardian',
	'Rolling Stone',
	'New Statesman',
	'IndieWire',
	"Men's Health",
	"Men's Journal",
	'Men’s Health',
	'Men’s Journal',
	'The Rake',
	'NPR',
	'WSJ',
	'Wall Street Journal',
	'CNN',
	'Entertainment Weekly',
	'Esquire',
	'V Magazine',
	'W Magazine',
	'Billboard',
	'Forbes',
	'Vanity Fair',
	'GQ',
	'Vulture',
	'Hollywood Reporter',
	'The Hollywood Reporter',
	'THR',
	'New York Times',
	'NYT',
	'The New Yorker',
	'New Yorker',
	'The Atlantic',
	'BBC',
	'Playboy',
	'Deadline',
	'Interview Magazine',
	'PAPER',
	'Hot Ones',
	'Hollywood Authentic',
	'SmartLess',
	'So True',
	'Lipstick on the Rim',
	"Dinner's on Me",
	'Dinner’s on Me',
	'Bustle',
	'Howard Stern Show',
	'Behind the Wall',
	'TODAY',
	'Nielsen',
	'Cosmopolitan',
	'Detroit News',
	'Gizmodo',
	'Futurism',
	'Associated Press',
	'Bloomberg',
	'Sunday Times',
	'Rotten Tomatoes',
	'Pitchfork',
	'AV Club',
	'The Verge',
	'TechCrunch',
	'Business Insider',
	'Variety'
];

// Common dictionary words that are ALSO outlets: only counted as an outlet when
// an attribution cue sits right next to them (kills "people we have profiled").
const AMBIGUOUS_OUTLETS = [
	'People',
	'Time',
	'Us',
	'Empire',
	'Insider',
	'Fortune',
	'Paper',
	'Vogue',
	'Elle',
	'Wired',
	'Slate',
	'Salon',
	'Collider',
	'IGN',
	'NME',
	'CBS',
	'Reuters',
	'Axios',
	'Politico',
	'Atlantic',
	'Harper'
];
const ATTR_CUE = '(?:told|to|in|for|on|per|via|according to|wrote (?:in|for)|said (?:in|to)|[—-])';

// Publication-shaped names (suffix heuristic), e.g. "Xyz Magazine", "Xyz Times".
const OUTLET_SUFFIX =
	/\b[A-Z][A-Za-z'’&.]+(?:\s+[A-Z][A-Za-z'’&.]+)?\s+(Magazine|Times|Journal|Post|News|Weekly|Reporter|Herald|Tribune|Review|Quarterly|Gazette|Chronicle|Digest|Wire)\b/;

const VENUE_WORDS =
	/\b(interview|memoir|documentary|docuseries|podcast|testimony|deposition|trial|profile|essay|column|newsletter|autobiography|book|statement|tweeted?|tweet|instagram|youtube|episode|press\s+conference|red\s+carpet|on\s+stage|onstage|speech|op-?ed|q&a|liner\s+notes)\b/i;

// A bare attributive speech verb (no source anchoring it).
const SPEECH_VERB =
	/\b(said|says|told|explained|recalled|admitted|wrote|writes|noted|added|reflected|remembered|confessed|insisted|put it|described)\b/i;

function hasOutlet(text) {
	// Case-SENSITIVE: outlets are proper nouns and are always capitalized in the
	// drafts. Matching case-insensitively turned "people we have profiled" into
	// the magazine "People". Multi-word names ("The Guardian") stay unambiguous.
	for (const o of OUTLETS) {
		const re = new RegExp(`(^|[^A-Za-z])${o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`);
		if (re.test(text)) return o;
	}
	for (const o of AMBIGUOUS_OUTLETS) {
		const esc = o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const re = new RegExp(
			`${ATTR_CUE}\\s+${esc}\\b|\\b${esc}\\s+(?:magazine|reported|wrote|said)\\b|,\\s*${esc}\\s*,\\s*(?:19|20)\\d{2}`
		);
		if (re.test(text)) return o;
	}
	// Epigraph / pull-quote structure "— Person, Source, Year": treat the middle
	// comma-token as the source (catches book/album/film titles like a memoir).
	const emAttr = text.match(
		/[—–-]\s*[A-Z][^,]{1,45},\s*([A-Za-z“"'’][^,]{1,55}?),\s*(?:19|20)\d{2}/
	);
	if (emAttr) return emAttr[1].trim();
	const m = text.match(OUTLET_SUFFIX);
	if (m) return m[0];
	return null;
}

function hasYear(text) {
	const m = text.match(/\b(?:19|20)\d{2}\b/);
	return m ? m[0] : null;
}

function hasVenue(text) {
	const m = text.match(VENUE_WORDS);
	return m ? m[0].toLowerCase() : null;
}

function hasSpeechVerb(text) {
	return SPEECH_VERB.test(text);
}

// Primary sources (a dated court record, memoir, deposition) are the gold
// standard — a quote from one + a year is traceable, so it rates inline even
// without a third-party outlet name.
const PRIMARY_VENUE =
	/\b(memoir|autobiography|testimony|testified|deposition|sworn|under\s+oath|court|trial|liner\s+notes)\b/i;

function classifyAttribution(windowText) {
	const outlet = hasOutlet(windowText);
	const year = hasYear(windowText);
	const venue = hasVenue(windowText);
	const primary = PRIMARY_VENUE.test(windowText);
	let cls;
	if ((outlet && year) || (primary && year)) cls = 'inline';
	else if (outlet || year || venue) cls = 'vague';
	else cls = 'untagged';
	return {
		classification: cls,
		signals: { outlet: outlet || null, year: year || null, venue: venue || null }
	};
}

// ---------------------------------------------------------------------------
// Text utilities
// ---------------------------------------------------------------------------
function normalizeQuotes(s) {
	return s.replace(/[“”]/g, '"');
}

function stripInlineMarkup(s) {
	return s
		.replace(/<\/?[^>]+>/g, ' ') // html tags
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // md links -> text
		.replace(/[*_]{1,3}/g, '') // md emphasis
		.replace(/\s+/g, ' ')
		.trim();
}

// Strip HTML tags + markdown links but KEEP prose and its double-quotes, so
// attribute values like class="firstLetter" never masquerade as quoted material.
function stripTagsKeepText(s) {
	return s
		.replace(/<\/?[^>]+>/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[_*]{1,3}/g, '') // md emphasis (so _Born Standing Up_ -> Born Standing Up)
		.replace(/\s+/g, ' ')
		.trim();
}

function splitSentences(text) {
	// Keep it simple and deterministic. Split on sentence-final punctuation
	// followed by whitespace + capital / quote.
	const cleaned = text.replace(/\s+/g, ' ').trim();
	if (!cleaned) return [];
	const parts = cleaned.split(/(?<=[.!?])\s+(?=["“'A-Z])/);
	return parts.map((p) => p.trim()).filter(Boolean);
}

// Given a slot's text, return quote units with attribution windows.
// Quotes are matched against the WHOLE slot string (so multi-sentence quotes
// survive), split quotes ("...," he said, "...") are merged, and the attribution
// window looks both backward (leading "As X told IndieWire in 2023, ...") and
// forward (trailing "— Name, _Source_, Year" / "he told Rolling Stone in 2021").
function quoteUnitsInSlot(slotText) {
	const text = normalizeQuotes(stripTagsKeepText(slotText || ''));
	const spans = [];
	const re = /"([^"]{3,600})"/g;
	let m;
	while ((m = re.exec(text)) !== null) {
		const frag = m[1].trim();
		// Drop single-word scare-quotes / emphasis ("fun", "stuck"); the audit is
		// about sourced claims, and a lone word is almost never the load-bearing one.
		if (frag.split(/\s+/).length < 2) continue;
		spans.push({ start: m.index, end: re.lastIndex, frag });
	}
	// Merge adjacent spans (split quotes) separated by a short interjection.
	const units = [];
	for (const sp of spans) {
		const last = units[units.length - 1];
		if (last && sp.start - last.end <= 50) {
			last.frags.push(sp.frag);
			last.end = sp.end;
		} else {
			units.push({ start: sp.start, end: sp.end, frags: [sp.frag] });
		}
	}
	return units.map((u) => {
		const window = text.slice(Math.max(0, u.start - 120), Math.min(text.length, u.end + 180));
		return { quote: u.frags.join(' … '), window, hasSpeechVerb: hasSpeechVerb(window) };
	});
}

// ---------------------------------------------------------------------------
// Slot extraction
// ---------------------------------------------------------------------------
function extractSlots(body) {
	const slots = {};

	// --- Epigraph: first `>` blockquote before the firstLetter paragraph ---
	const firstLetterIdx = body.search(/<p[^>]*class=["']firstLetter["']/i);
	const preLetter = firstLetterIdx >= 0 ? body.slice(0, firstLetterIdx) : body;
	const epiMatch = preLetter.match(/^>\s?.*(?:\n>.*)*$/m);
	slots.epigraph = epiMatch ? epiMatch[0].replace(/^>\s?/gm, '').trim() : '';

	// --- Cold open: firstLetter paragraph THROUGH paragraphs up to TL;DR / H2 ---
	if (firstLetterIdx >= 0) {
		const rest = body.slice(firstLetterIdx);
		const stopMatch = rest.match(/(<details|^\s*##\s+|<summary)/m);
		const stopIdx = stopMatch ? stopMatch.index : rest.length;
		slots.coldOpen = rest.slice(0, stopIdx);
	} else {
		slots.coldOpen = '';
	}

	// --- Diagnosis: `## What Is/is ... personality type?` -> next `## ` ---
	const diagHeadingRe = /^##\s+What\s+is\s+.*personality\s+type\??\s*$/im;
	const dh = body.match(diagHeadingRe);
	if (dh) {
		const start = dh.index;
		const after = body.slice(start + dh[0].length);
		const nextH2 = after.search(/^##\s+/m);
		slots.diagnosis = body.slice(start, nextH2 >= 0 ? start + dh[0].length + nextH2 : body.length);
	} else {
		slots.diagnosis = '';
	}

	// --- Close: last 1-2 non-empty paragraph blocks of the body ---
	// Drop the rabbit-hole details block from close consideration if it is last.
	let closeSource = body;
	// Ignore trailing whitespace; split into paragraph blocks on blank lines.
	const blocks = closeSource
		.split(/\n\s*\n/)
		.map((b) => b.trim())
		.filter((b) => b.length > 0)
		// keep only prose-ish blocks (skip closing tags / details wrappers)
		.filter(
			(b) =>
				!/^<\/?(details|div|ul|li|summary|p class="inner-thought")/i.test(b) ||
				/[a-z]{4,}/.test(stripInlineMarkup(b))
		);
	const proseBlocks = blocks.filter((b) => {
		const t = stripInlineMarkup(b);
		return t.split(/\s+/).length >= 6 && !/^#{1,6}\s/.test(b) && !/^>/.test(b);
	});
	slots.close = proseBlocks.slice(-2).join('\n\n');

	// --- Empathy turn: negative-parallelism reframe sentence(s) ---
	slots.empathyTurn = findEmpathyTurn(body);

	return slots;
}

const EMPATHY_PATTERNS = [
	/\b(?:is|was|are|were)\s+not\s+[^.,;:]{2,70}[,;.]\s*(?:it|he|she|they|that)\s+(?:is|was|were|are)\b/i,
	/\bwas\s?n[’']?t\b[^.]{2,70}\.\s*[Ii]t\s+was\b/i,
	/\bdoes\s+not\s+(?:make|excuse)\b[^.]{2,60}\.\s*[Ii]t\b/i,
	/\bnot\s+[a-z][^.,;:]{2,50},\s+it\s+(?:is|was)\b/i
];
const REFRAME_VOCAB =
	/\b(armor|wound|fear|protect|proof|reflex|cruelty|vanity|evasion|scar|survival|mask|defen[cs]e|kind|legible|love|shame|hurt|grief|avoidance)\b/i;

function findEmpathyTurn(body) {
	const prose = stripComments(body);
	const sentences = splitSentences(stripInlineMarkup(prose));
	const scored = [];
	for (const s of sentences) {
		if (s.split(/\s+/).length < 5) continue;
		const matched = EMPATHY_PATTERNS.some((re) => re.test(s));
		if (!matched) continue;
		const score = (REFRAME_VOCAB.test(s) ? 2 : 0) + 1;
		scored.push({ s, score });
	}
	scored.sort((a, b) => b.score - a.score);
	return scored
		.slice(0, 2)
		.map((x) => x.s)
		.join(' / ');
}

// ---------------------------------------------------------------------------
// Audit a slot's quotes
// ---------------------------------------------------------------------------
function auditSlot(name, slotText) {
	const units = quoteUnitsInSlot(stripComments(slotText || ''));
	const items = units.map((u) => {
		const { classification, signals } = classifyAttribution(u.window);
		return {
			quote: stripInlineMarkup(u.quote).slice(0, 240),
			classification,
			signals,
			note:
				classification === 'untagged' && u.hasSpeechVerb
					? 'bare speech verb, no outlet/year/venue'
					: classification === 'untagged'
						? 'no attribution found'
						: undefined
		};
	});
	return { slot: name, hasQuotedMaterial: items.length > 0, items };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const raw = fs.readFileSync(filePath, 'utf8');
const { fm, body: bodyRaw } = splitFrontmatter(raw);
const body = stripComments(bodyRaw);
const meta = parseFrontmatter(fm);
const slots = extractSlots(body);

const report = {
	file: filePath,
	person: meta.person || path.basename(filePath, '.md'),
	enneagram: meta.enneagram,
	slots: {
		epigraph: auditSlot('epigraph', slots.epigraph),
		coldOpen: auditSlot('cold open', slots.coldOpen),
		diagnosis: auditSlot('diagnosis', slots.diagnosis),
		empathyTurn: {
			slot: 'empathy turn',
			reframeSentence: slots.empathyTurn || null,
			...auditSlot('empathy turn', slots.empathyTurn)
		},
		close: auditSlot('close', slots.close)
	}
};

// Summary counts + B+/A gate flags (per editorial-report Deliverable #6).
const allItems = Object.values(report.slots).flatMap((s) => s.items || []);
const counts = { inline: 0, vague: 0, untagged: 0 };
for (const it of allItems) counts[it.classification]++;
const epigraphUntagged = (report.slots.epigraph.items || []).some(
	(i) => i.classification === 'untagged'
);
const coldOpenUntagged = (report.slots.coldOpen.items || []).some(
	(i) => i.classification === 'untagged'
);
report.summary = {
	quotes_total: allItems.length,
	...counts,
	untagged_in_epigraph_or_cold_open: epigraphUntagged || coldOpenUntagged,
	any_untagged_load_bearing_slot: counts.untagged > 0
};

if (asJson) {
	process.stdout.write(JSON.stringify(report, null, 2) + '\n');
	process.exit(failOnUntaggedLoadBearing && report.summary.any_untagged_load_bearing_slot ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Human report
// ---------------------------------------------------------------------------
const CLS_LABEL = { inline: 'INLINE  ', vague: 'VAGUE   ', untagged: 'UNTAGGED' };
function line(s = '') {
	process.stdout.write(s + '\n');
}

line('='.repeat(72));
line(`LOAD-BEARING SOURCE AUDIT — ${report.person}  (Type ${report.enneagram || '?'})`);
line(filePath);
line('='.repeat(72));

const order = [
	['epigraph', report.slots.epigraph],
	['cold open', report.slots.coldOpen],
	['diagnosis', report.slots.diagnosis],
	['empathy turn', report.slots.empathyTurn],
	['close', report.slots.close]
];

for (const [label, slot] of order) {
	line('');
	line(`### ${label.toUpperCase()}`);
	if (label === 'empathy turn' && slot.reframeSentence) {
		line(`  reframe: ${slot.reframeSentence.slice(0, 220)}`);
	}
	if (!slot.items || slot.items.length === 0) {
		line('  (no quoted material in slot)');
		continue;
	}
	for (const it of slot.items) {
		const sig = [];
		if (it.signals.outlet) sig.push(`outlet="${it.signals.outlet}"`);
		if (it.signals.year) sig.push(`year=${it.signals.year}`);
		if (it.signals.venue) sig.push(`venue="${it.signals.venue}"`);
		line(`  [${CLS_LABEL[it.classification]}] "${it.quote}"`);
		line(
			`             ${sig.length ? sig.join('  ') : '— no outlet / year / venue —'}${it.note ? '  (' + it.note + ')' : ''}`
		);
	}
}

line('');
line('-'.repeat(72));
line(
	`SUMMARY: ${report.summary.quotes_total} load-bearing quote(s) — ` +
		`${counts.inline} inline, ${counts.vague} vague, ${counts.untagged} untagged`
);
line(
	`  untagged quote in epigraph OR cold open: ${report.summary.untagged_in_epigraph_or_cold_open ? 'YES (blocks A/B+ per source standard)' : 'no'}`
);
line(
	`  any untagged load-bearing quote:         ${report.summary.any_untagged_load_bearing_slot ? 'YES' : 'no'}`
);
line('-'.repeat(72));
process.exit(failOnUntaggedLoadBearing && report.summary.any_untagged_load_bearing_slot ? 1 : 0);
