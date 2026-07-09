#!/usr/bin/env node
// scripts/same-type-similarity.mjs
//
// Same-type argument-similarity scan for 9takes people-pipeline drafts (plan item 2.3).
//
// Read-only. Given ONE target draft, compare its counter-typing (tiebreaker) and
// diagnosis sentences against the last N (default 8) OTHER drafts of the SAME
// Enneagram type, and report the most similar sentence pairs. The corpus's known
// failure mode is "type-colored Mad Libs": two different subjects of the same type
// get the same argument with the nouns swapped (Zac Efron and Mira Murati both run
// the same 3-vs-9 tiebreaker and the same "merges so completely with what's asked
// ... loses what he wants" diagnosis). This scan catches that near-verbatim reuse.
//
// METHOD (and why): sentence/clause-level similarity combining
//   (a) cosine over stemmed CONTENT unigrams  -> shared argument / vocabulary
//   (b) Jaccard over stemmed word BIGRAMS      -> shared PHRASING (the real tell)
//   score = 0.6*(a) + 0.4*(b)
// Same-type drafts share heavy thematic vocabulary (nine, peace, merge, calm), so
// unigram overlap alone is elevated for *every* same-type pair. Bigram overlap is
// what separates genuine phrasing reuse from mere thematic kinship: independently
// written same-type sentences share words but rarely share 2-word shingles, while
// reused constructions share both. Extra normalization — light suffix stemming
// (merges->merge, wants->want), subject-name -> `subj`, and type refs (Type 3 /
// Threes / 3w1) -> `typeN` — strips the swapped nouns so the shared skeleton shows.
// Clause-level units (split on , ; :) keep a short reused span from being diluted
// by the rest of a long sentence. This reliably lifts the Zac<->Mira pair well
// clear of the same-type noise floor (see the run in the handoff report).
//
// Usage:
//   node scripts/same-type-similarity.mjs <Person-Name | path/to/draft.md> [--n 8] [--json] [--fail-on-trip]
//
// Exit codes: 0 = ran/clear, 1 = --fail-on-trip and similarity tripped, 2 = usage / file error.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src', 'blog', 'people', 'drafts');

function canonicalPath(filePath) {
	try {
		return fs.realpathSync.native(filePath);
	} catch {
		return path.resolve(filePath);
	}
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const failOnTrip = argv.includes('--fail-on-trip');
let n = 8;
const nIdx = argv.indexOf('--n');
if (nIdx >= 0 && argv[nIdx + 1]) n = Math.max(1, parseInt(argv[nIdx + 1], 10) || 8);
const positional = argv.filter((a, i) => !a.startsWith('--') && !(nIdx >= 0 && i === nIdx + 1));
const target = positional[0];

if (!target) {
	process.stderr.write(
		'Usage: node scripts/same-type-similarity.mjs <Person-Name | path/to/draft.md> [--n 8] [--json] [--fail-on-trip]\n'
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
			if (fs.statSync(c).isFile()) return canonicalPath(c);
		} catch {
			/* keep looking */
		}
	}
	return null;
}

const targetPath = resolveDraftPath(target);
if (!targetPath) {
	process.stderr.write(`Draft not found: ${target}\n`);
	process.exit(2);
}

// ---------------------------------------------------------------------------
// Parsing (mirror blog-lint.sh: split FM/body, strip HTML comments)
// ---------------------------------------------------------------------------
function splitFrontmatter(raw) {
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

function stripComments(body) {
	return body.replace(/<!--[\s\S]*?-->/g, '');
}

function fmField(fm, key) {
	const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
	if (!m) return null;
	return m[1].trim().replace(/^['"]/, '').replace(/['"]$/, '');
}

function personName(fm, file) {
	return fmField(fm, 'person') || path.basename(file, '.md');
}

function enneagramType(fm) {
	const raw = fmField(fm, 'enneagram');
	return raw ? raw.replace(/[^0-9]/g, '') : null;
}

// ---------------------------------------------------------------------------
// Region + sentence extraction
// ---------------------------------------------------------------------------
function extractRegions(body) {
	const clean = stripComments(body);

	// Diagnosis: `## What Is/is ... personality type?` -> next `## `.
	let diagnosis = '';
	const dh = clean.match(/^##\s+What\s+is\s+.*personality\s+type\??\s*$/im);
	if (dh) {
		const start = dh.index;
		const after = clean.slice(start + dh[0].length);
		const nextH2 = after.search(/^##\s+/m);
		diagnosis = clean.slice(start, nextH2 >= 0 ? start + dh[0].length + nextH2 : clean.length);
	}

	// Counter-typing: the Rabbit Hole "Counterarguments" / "Might Not Be" H3.
	let counter = '';
	const ch = clean.match(/^###\s+(?:Counterarguments|.*[Mm]ight\s+[Nn]ot\s+[Bb]e).*$/m);
	if (ch) {
		const start = ch.index;
		const after = clean.slice(start + ch[0].length);
		const stop = after.search(/^###\s+|^##\s+|<\/details>/m);
		counter = clean.slice(start, stop >= 0 ? start + ch[0].length + stop : clean.length);
	}

	return { diagnosis, counter };
}

function stripMarkup(s) {
	return s
		.replace(/<\/?[^>]+>/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[_*`>#]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function splitSentences(text) {
	const cleaned = text.replace(/\s+/g, ' ').trim();
	if (!cleaned) return [];
	return cleaned
		.split(/(?<=[.!?])\s+(?=["“'A-Z])/)
		.map((s) => s.trim())
		.filter(Boolean);
}

const SKIP_UNIT =
	/(read more|skip if|enneagram nerds|the rest of the analysis|learn how|more on how|strongest alternate case|alternate case is type|type [1-9]s are the|type[1-9]s are the)/i;

// A "unit" is a clause: split sentences on , ; : so a short reused span is not
// diluted by the rest of a long sentence.
function sentencesToUnits(regionText, kind) {
	const units = [];
	// Drop markdown heading LINES: the `## What Is X's Personality Type?` H2 and
	// the `### Why X Might Not Be Type N` H3 are mandated structural furniture,
	// identical across every draft. Comparing them just re-discovers the template
	// and buries the actual argument reuse. Remove them before splitting.
	const noHeadings = regionText.replace(/^\s{0,3}#{1,6}\s.*$/gm, ' ');
	for (const sent of splitSentences(stripMarkup(noHeadings))) {
		if (SKIP_UNIT.test(sent)) continue;
		for (const clause of sent.split(/[,;:]/)) {
			const c = clause.trim();
			if (c.split(/\s+/).length < 5) continue; // too short to be a meaningful argument unit
			units.push({ text: c, sentence: sent, kind });
		}
	}
	return units;
}

// ---------------------------------------------------------------------------
// Normalization + tokenization
// ---------------------------------------------------------------------------
const STOP = new Set(
	(
		'a an the of to in on for and but or as at by with from into is are was were be been being that this it its ' +
		'he she they them his her their him who whom what which so than then not no do does did done has have had ' +
		'i you we me my your our will would can could should about out up down over under again more most very just ' +
		'there here how when where why all any each both because if while these those such own off other one everyone ' +
		'everybody someone somebody anyone anybody nobody noone else thing things'
	).split(/\s+/)
);

const NUMWORD = {
	ones: 'type1',
	twos: 'type2',
	threes: 'type3',
	fours: 'type4',
	fives: 'type5',
	sixes: 'type6',
	sevens: 'type7',
	eights: 'type8',
	nines: 'type9'
};

function canonicalizeTypes(text, subjectTokens) {
	let t = text;
	// subject name -> subj
	for (const name of subjectTokens) {
		if (name.length < 3) continue;
		t = t.replace(
			new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'),
			' subj '
		);
	}
	// "Type 3", "type-3", "a 3", wings "3w1"
	t = t.replace(/\btype[\s-]?([1-9])\b/gi, ' type$1 ');
	t = t.replace(/\b([1-9])w[1-9]\b/gi, ' type$1 ');
	// plural type names
	t = t.replace(
		/\b(ones|twos|threes|fours|fives|sixes|sevens|eights|nines)\b/gi,
		(m) => ' ' + NUMWORD[m.toLowerCase()] + ' '
	);
	return t;
}

function stem(w) {
	w = w.replace(/[’']s$/, '');
	if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + 'y';
	if (/ing$/.test(w) && w.length > 5) return w.slice(0, -3);
	if (/ed$/.test(w) && w.length > 4) return w.slice(0, -2);
	if (/s$/.test(w) && !/ss$/.test(w) && w.length > 3) return w.slice(0, -1);
	return w;
}

// Feature set for a clause = stemmed content unigrams (phrasing-agnostic argument
// vocabulary) PLUS stemmed word bigrams with stopwords kept (verbatim phrasing).
// Scoring is TF-IDF cosine (idf computed at draft level, below), so a feature that
// shows up in many same-type drafts — mandated boilerplate ("strongest alternate
// case is type N") or generic Type-9 vocab ("everyone else") — is automatically
// discounted, and a rare shared phrase ("merge so completely") dominates. That is
// what separates true argument reuse from mere same-type thematic kinship.
function featureSet(text, subjectTokens) {
	const canon = canonicalizeTypes(text.toLowerCase(), subjectTokens);
	const rawTokens = canon
		.replace(/[^a-z0-9\s]/g, ' ')
		.split(/\s+/)
		.filter(Boolean)
		.map(stem);
	const features = new Set();
	let nContent = 0;
	for (const t of rawTokens) {
		if (!STOP.has(t) && t.length > 1) {
			features.add('u:' + t);
			nContent++;
		}
	}
	// Bigrams + trigrams (stopwords kept) capture verbatim PHRASING — a shared
	// 3-gram like "merge so completely" is the fingerprint of reuse, where a shared
	// unigram like "everyone" is just shared theme. Weighted heavier than unigrams.
	for (let i = 0; i < rawTokens.length - 1; i++)
		features.add('b:' + rawTokens[i] + ' ' + rawTokens[i + 1]);
	for (let i = 0; i < rawTokens.length - 2; i++)
		features.add('t:' + rawTokens[i] + ' ' + rawTokens[i + 1] + ' ' + rawTokens[i + 2]);
	return { features, nContent };
}

// ---------------------------------------------------------------------------
// Build unit sets for a draft
// ---------------------------------------------------------------------------
function subjectTokensFor(person) {
	// "Zac-Efron" -> ["zac","efron"]
	return person.split(/[-\s]+/).filter(Boolean);
}

function draftUnits(file) {
	const raw = fs.readFileSync(file, 'utf8');
	const { fm, body } = splitFrontmatter(raw);
	const person = personName(fm, file);
	const type = enneagramType(fm);
	const date = fmField(fm, 'date') || '';
	const { diagnosis, counter } = extractRegions(body);
	const subjTok = subjectTokensFor(person);
	const rawUnits = [
		...sentencesToUnits(diagnosis, 'diagnosis'),
		...sentencesToUnits(counter, 'counter-typing')
	];
	// de-dupe identical clause text; attach token vectors
	const seen = new Set();
	const units = [];
	for (const u of rawUnits) {
		const key = u.text.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		const vec = featureSet(u.text, subjTok);
		if (vec.nContent < 4) continue; // needs enough content to avoid generic type truisms
		units.push({ ...u, features: vec.features });
	}
	return { person, type, date, file, units };
}

// ---------------------------------------------------------------------------
// Assemble comparison set + score
// ---------------------------------------------------------------------------
const targetDraft = draftUnits(targetPath);
if (!targetDraft.type) {
	process.stderr.write(`Could not read enneagram type from ${targetPath}\n`);
	process.exit(2);
}

// Gather same-type OTHER drafts, most recent by date first.
const allFiles = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.md'));
const sameType = [];
for (const f of allFiles) {
	const full = path.join(DRAFTS_DIR, f);
	if (canonicalPath(full) === targetPath) continue;
	const raw = fs.readFileSync(full, 'utf8');
	const { fm } = splitFrontmatter(raw);
	if (enneagramType(fm) !== targetDraft.type) continue;
	sameType.push({ file: full, person: personName(fm, full), date: fmField(fm, 'date') || '' });
}
sameType.sort((a, b) =>
	b.date < a.date ? -1 : b.date > a.date ? 1 : a.person < b.person ? -1 : 1
);
const comparisonSet = sameType.slice(0, n).map((c) => draftUnits(c.file));

// --- TF-IDF: idf over drafts (target + comparisons) -------------------------
const allDrafts = [targetDraft, ...comparisonSet];
const D = allDrafts.length;
const df = new Map();
for (const d of allDrafts) {
	const draftFeatures = new Set();
	for (const u of d.units) for (const f of u.features) draftFeatures.add(f);
	for (const f of draftFeatures) df.set(f, (df.get(f) || 0) + 1);
}
// Classic idf = ln(D/df): a feature present in EVERY same-type draft (mandated
// boilerplate / generic type vocab) collapses to 0 and drops out; a feature in
// one or two drafts (distinctive reuse) is weighted heavily. This is what makes
// the scan measure argument reuse rather than re-measuring the house template.
const PHRASE_MULT = { u: 1, b: 1.6, t: 2.2 }; // reward phrasing over lone words
const wOf = (f) => Math.log(D / (df.get(f) || 1)) * (PHRASE_MULT[f[0]] || 1);
// Precompute each unit's L2 norm over the weighted features.
for (const d of allDrafts) {
	for (const u of d.units) {
		let sq = 0;
		for (const f of u.features) {
			const w = wOf(f);
			sq += w * w;
		}
		u.norm = Math.sqrt(sq) || 1;
	}
}
function similarity(a, b) {
	const [small, big] = a.features.size <= b.features.size ? [a, b] : [b, a];
	let dot = 0;
	for (const f of small.features) {
		if (big.features.has(f)) {
			const w = wOf(f);
			dot += w * w;
		}
	}
	return dot / (a.norm * b.norm);
}

function informativePhraseFeature(f) {
	if (!f.startsWith('b:') && !f.startsWith('t:')) return false;
	const terms = f.slice(2).split(' ');
	const contentTerms = terms.filter((t) => !STOP.has(t) && !/^type[1-9]$/.test(t) && t.length > 1);
	return contentTerms.length >= 2;
}

function sharedInformativePhrases(a, b) {
	const [small, big] = a.features.size <= b.features.size ? [a, b] : [b, a];
	const shared = [];
	for (const f of small.features) {
		if (big.features.has(f) && informativePhraseFeature(f)) shared.push(f.slice(2));
	}
	return shared;
}

// Score every cross-draft unit pair.
const pairs = [];
const allScores = [];
for (const cmp of comparisonSet) {
	for (const t of targetDraft.units) {
		for (const s of cmp.units) {
			const score = similarity(t, s);
			allScores.push(score);
			pairs.push({
				score,
				targetText: t.text,
				targetKind: t.kind,
				otherText: s.text,
				otherKind: s.kind,
				otherPerson: cmp.person,
				sharedPhrases: sharedInformativePhrases(t, s)
			});
		}
	}
}
pairs.sort((a, b) => b.score - a.score);

// Per-draft aggregate (max unit-pair score).
const perDraft = comparisonSet.map((cmp) => {
	const rel = pairs.filter((p) => p.otherPerson === cmp.person);
	const max = rel.length ? rel[0].score : 0;
	return { person: cmp.person, date: cmp.date, units: cmp.units.length, maxScore: max };
});
perDraft.sort((a, b) => b.maxScore - a.maxScore);

// Noise floor stats over the full pairwise distribution.
allScores.sort((a, b) => a - b);
function quantile(arr, q) {
	if (!arr.length) return 0;
	const pos = (arr.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	return arr[base] + (arr[base + 1] !== undefined ? rest * (arr[base + 1] - arr[base]) : 0);
}
const floor = {
	pairs_compared: allScores.length,
	median: +quantile(allScores, 0.5).toFixed(3),
	p90: +quantile(allScores, 0.9).toFixed(3),
	p99: +quantile(allScores, 0.99).toFixed(3),
	max: +(allScores[allScores.length - 1] || 0).toFixed(3)
};

const topPairs = pairs.slice(0, 12).map((p) => ({
	score: +p.score.toFixed(3),
	other_person: p.otherPerson,
	shared_phrases: p.sharedPhrases,
	target: `[${p.targetKind}] ${p.targetText}`,
	other: `[${p.otherKind}] ${p.otherText}`
}));
const tripThreshold = Math.max(0.04, floor.p99 * 4);
const tripPairs = pairs
	.filter((p) => p.score >= tripThreshold && p.sharedPhrases.length > 0)
	.slice(0, 12)
	.map((p) => ({
		score: +p.score.toFixed(3),
		other_person: p.otherPerson,
		shared_phrases: p.sharedPhrases,
		target: `[${p.targetKind}] ${p.targetText}`,
		other: `[${p.otherKind}] ${p.otherText}`
	}));

const report = {
	target: {
		person: targetDraft.person,
		type: targetDraft.type,
		units: targetDraft.units.length,
		file: targetPath
	},
	comparison_set: comparisonSet.map((c) => ({
		person: c.person,
		date: c.date,
		units: c.units.length
	})),
	n_requested: n,
	noise_floor: floor,
	trip_threshold: +tripThreshold.toFixed(3),
	tripped: tripPairs.length > 0,
	trip_pairs: tripPairs,
	per_draft_max: perDraft.map((d) => ({ ...d, maxScore: +d.maxScore.toFixed(3) })),
	top_pairs: topPairs
};

if (asJson) {
	process.stdout.write(JSON.stringify(report, null, 2) + '\n');
	process.exit(failOnTrip && report.tripped ? 1 : 0);
}

// ---------------------------------------------------------------------------
// Human report
// ---------------------------------------------------------------------------
const w = (s = '') => process.stdout.write(s + '\n');
w('='.repeat(78));
w(`SAME-TYPE ARGUMENT-SIMILARITY SCAN — ${report.target.person} (Type ${report.target.type})`);
w(targetPath);
w('='.repeat(78));
w('');
w(`Target diagnosis+counter-typing units: ${report.target.units}`);
w(`Comparison set (last ${n} other Type-${report.target.type} drafts by date):`);
for (const c of report.comparison_set) w(`  - ${c.person}  (${c.date}, ${c.units} units)`);
w('');
w(
	`Noise floor over ${floor.pairs_compared} unit pairs:  median=${floor.median}  p90=${floor.p90}  p99=${floor.p99}  max=${floor.max}`
);
w(`Trip threshold: ${report.trip_threshold}  →  ${report.tripped ? 'TRIPPED' : 'clear'}`);
w('');
if (report.trip_pairs.length) {
	w('TRIP PAIRS:');
	w('-'.repeat(78));
	for (const p of report.trip_pairs) {
		w(`score ${p.score.toFixed(3)}   ${report.target.person}  <->  ${p.other_person}`);
		w(`   TARGET ${p.target}`);
		w(`   OTHER  ${p.other}`);
		w('');
	}
}
w('');
w('Most similar drafts (max unit-pair score):');
for (const d of report.per_draft_max) {
	const bar = '#'.repeat(Math.round(d.maxScore * 40));
	w(`  ${d.maxScore.toFixed(3)} ${bar.padEnd(20)} ${d.person}`);
}
w('');
w('TOP SIMILAR SENTENCE/CLAUSE PAIRS:');
w('-'.repeat(78));
for (const p of report.top_pairs) {
	w(`score ${p.score.toFixed(3)}   ${report.target.person}  <->  ${p.other_person}`);
	w(`   TARGET ${p.target}`);
	w(`   OTHER  ${p.other}`);
	w('');
}
w('-'.repeat(78));
const topOther = report.top_pairs[0];
if (topOther) {
	const aboveFloor = floor.median > 0 ? (topOther.score / floor.median).toFixed(1) : '∞';
	w(
		`Top pair scores ${topOther.score} vs median ${floor.median}  (~${aboveFloor}x the noise floor).`
	);
}
process.exit(failOnTrip && report.tripped ? 1 : 0);
