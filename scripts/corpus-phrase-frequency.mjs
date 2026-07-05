#!/usr/bin/env node
// scripts/corpus-phrase-frequency.mjs
//
// Plan item 2.5 — Corpus phrase-frequency-by-type report + dynamic avoid-list.
//
// The 2026-07-04 fingerprint audit proved the people-pipeline has type-specific
// "Mad Libs" tics: e.g. "core wound" appears in ~44% of all Type-4 drafts, "the
// tell" in ~29% of Type-9. Those tics leak because the creator prompt has no
// live, per-type list of what is already overused. This script scans the whole
// draft corpus, measures phrase concentration by Enneagram type, and writes a
// machine-readable avoid-list the creator command (Phase 3.1) points at.
//
// Two signals per type:
//   1. curated  — hand-listed known tics, % of that type's drafts using each.
//   2. surfaced — n-grams (2-5 words) that are BOTH frequent in the type and
//                 concentrated there (document-frequency lift vs corpus-wide),
//                 appearing across >=3 different drafts (so it's a shared tic,
//                 not one subject's phrase). This catches NEW tics automatically.
//
// Output:
//   docs/data/blog-avoid-list.json   (consumed by the creator command per-type)
//   docs/data/blog-avoid-list.md     (human-readable)
//   stdout summary
//
// Usage:  node scripts/corpus-phrase-frequency.mjs [--dry]   (--dry = stdout only)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');
const dry = process.argv.includes('--dry');

// Known tics from the fingerprint audit — the curated watch-list.
const CURATED = [
	'core wound',
	'the tell',
	'the mask',
	'the machinery',
	'scar tissue',
	'sit with that',
	'sit with it',
	'hypervigilan',
	'earned every',
	'cut to black',
	'escape artist',
	'the wound',
	'read that',
	'the body keeps'
];

const STOP = new Set(
	(
		"a an the and or but of to in on at for with as is was were are be been being it its it's he she they them his her their this that these those not no so than then very just only into from by about over under out up down off then once " +
		"him who what when where why how which whom whose you your we our i me my his her he's she's there here more most less least own same other such can will would could should"
	).split(/\s+/)
);

function listDrafts() {
	return fs
		.readdirSync(DRAFTS_DIR)
		.filter((f) => f.endsWith('.md'))
		.map((f) => path.join(DRAFTS_DIR, f));
}
function parse(file) {
	const raw = fs.readFileSync(file, 'utf8');
	const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
	const frontmatter = fm ? fm[1] : '';
	let body = (fm ? raw.slice(fm[0].length) : raw).replace(/<!--[\s\S]*?-->/g, ' ');
	// Reduce to PROSE only so n-gram surfacing sees writing, not template scaffolding.
	body = body.replace(/^#{1,6}\s.*$/gm, ' '); // drop heading lines (incl. required H2/H3)
	body = body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // markdown links -> anchor text
	body = body.replace(/<[^>]+>/g, ' '); // strip HTML tags (TL;DR / rabbit-hole markup)
	body = body.replace(/https?:\/\/\S+/g, ' '); // bare URLs
	const et = frontmatter.match(/^enneagram:\s*['"]?([1-9])/m);
	return { type: et ? et[1] : null, body: body.replace(/\s+/g, ' ').trim().toLowerCase() };
}

const drafts = listDrafts().map(parse);
const byType = {};
for (const d of drafts) {
	if (!d.type) continue;
	(byType[d.type] ??= []).push(d.body);
}
const typeTotals = Object.fromEntries(Object.entries(byType).map(([t, arr]) => [t, arr.length]));

// ── curated concentration: % of each type's drafts containing the phrase ──
function pctByType(phrase) {
	const out = {};
	for (const [t, arr] of Object.entries(byType)) {
		const hits = arr.filter((b) => b.includes(phrase)).length;
		out[t] = { count: hits, pct: arr.length ? +((hits / arr.length) * 100).toFixed(1) : 0 };
	}
	return out;
}
const curatedReport = CURATED.map((p) => ({ phrase: p, byType: pctByType(p) }));

// ── surfaced tics: n-gram document-frequency with type-concentration lift ──
// corpus document frequency of each n-gram (count of drafts containing it)
const corpusDf = new Map();
const typeDf = {}; // type -> Map(ngram -> df)
// Structural / typology vocabulary — surfacing these is noise (every draft of a
// type shares the scaffolding by design). We want PROSE tics, not the framework.
const STRUCT = new Set(
	(
		'enneagram summary div panel accordion rabbit hole subtype subtypes ' +
		'wing wings tldr corner personality instinctual counterarguments arrows stress growth ' +
		'peacemaker investigator enthusiast achiever individualist loyalist challenger reformer helper'
	).split(/\s+/)
);
function ngrams(body) {
	const words = body
		.replace(/[^a-z' ]/g, ' ')
		.split(/\s+/)
		.filter(Boolean);
	const set = new Set();
	for (let n = 2; n <= 5; n++) {
		for (let i = 0; i + n <= words.length; i++) {
			const g = words.slice(i, i + n);
			if (g.some((w) => STRUCT.has(w))) continue; // skip typology scaffolding
			const contentful = g.filter((w) => !STOP.has(w) && w.length > 2).length;
			if (contentful < 2) continue; // need >=2 real content words
			set.add(g.join(' '));
		}
	}
	return set;
}
for (const d of drafts) {
	if (!d.type) continue;
	const grams = ngrams(d.body);
	typeDf[d.type] ??= new Map();
	for (const g of grams) {
		corpusDf.set(g, (corpusDf.get(g) || 0) + 1);
		typeDf[d.type].set(g, (typeDf[d.type].get(g) || 0) + 1);
	}
}
const TOTAL_DRAFTS = drafts.filter((d) => d.type).length;
const surfaced = {};
for (const [t, arr] of Object.entries(byType)) {
	const n = arr.length;
	const cands = [];
	for (const [g, df] of typeDf[t]) {
		if (df < 3) continue; // shared across >=3 drafts of the type
		const typePct = df / n;
		if (typePct < 0.12) continue; // in >=12% of the type's drafts
		const corpusPct = corpusDf.get(g) / TOTAL_DRAFTS;
		const lift = corpusPct > 0 ? typePct / corpusPct : 0;
		if (lift < 1.6) continue; // meaningfully concentrated in this type
		cands.push({ phrase: g, df, typePct: +(typePct * 100).toFixed(1), lift: +lift.toFixed(2) });
	}
	cands.sort((a, b) => b.lift * b.df - a.lift * a.df);
	// de-dup overlapping n-grams (prefer the longer, keep top 12)
	const kept = [];
	for (const c of cands) {
		if (kept.some((k) => k.phrase.includes(c.phrase) || c.phrase.includes(k.phrase))) continue;
		kept.push(c);
		if (kept.length >= 12) break;
	}
	surfaced[t] = kept;
}

const avoidList = {
	generated_at_note: 'regenerate with: node scripts/corpus-phrase-frequency.mjs',
	type_totals: typeTotals,
	curated: curatedReport,
	surfaced_by_type: surfaced
};

// ── write ──
if (!dry) {
	const jsonPath = path.join(REPO_ROOT, 'docs/data/blog-avoid-list.json');
	fs.writeFileSync(jsonPath, JSON.stringify(avoidList, null, 2) + '\n');
	let md =
		'<!-- docs/data/blog-avoid-list.md -->\n\n# People-Pipeline Avoid-List (per Enneagram type)\n\n';
	md +=
		"Auto-generated by `scripts/corpus-phrase-frequency.mjs`. The creator command (`blog_content_creator_people_v2`) should read the block for the subject's type and avoid reusing these phrases. Do not hand-edit — regenerate.\n\n";
	md +=
		`Corpus: ${TOTAL_DRAFTS} typed drafts. Per-type counts: ` +
		Object.entries(typeTotals)
			.sort()
			.map(([t, c]) => `T${t}=${c}`)
			.join(', ') +
		'.\n\n';
	md +=
		"## Curated known tics (share of each type's drafts)\n\n| phrase | " +
		Object.keys(typeTotals)
			.sort()
			.map((t) => `T${t}`)
			.join(' | ') +
		' |\n';
	md +=
		'| --- | ' +
		Object.keys(typeTotals)
			.sort()
			.map(() => '---')
			.join(' | ') +
		' |\n';
	for (const c of curatedReport) {
		md +=
			`| ${c.phrase} | ` +
			Object.keys(typeTotals)
				.sort()
				.map((t) => `${c.byType[t]?.pct ?? 0}%`)
				.join(' | ') +
			' |\n';
	}
	md += '\n## Auto-surfaced concentrated tics (by type)\n\n';
	for (const t of Object.keys(surfaced).sort()) {
		md += `### Type ${t} (n=${typeTotals[t]})\n\n`;
		if (!surfaced[t].length) {
			md += '_none above threshold_\n\n';
			continue;
		}
		for (const s of surfaced[t])
			md += `- "${s.phrase}" — ${s.typePct}% of T${t} drafts, ${s.lift}× corpus lift\n`;
		md += '\n';
	}
	fs.writeFileSync(path.join(REPO_ROOT, 'docs/data/blog-avoid-list.md'), md);
	console.log(`wrote docs/data/blog-avoid-list.json and .md`);
}

// ── stdout summary + ground-truth line ──
const t4 = curatedReport.find((c) => c.phrase === 'core wound').byType['4'];
console.log(`\ncorpus: ${TOTAL_DRAFTS} typed drafts`);
console.log(
	`GROUND TRUTH check — "core wound" in Type 4: ${t4.count}/${typeTotals['4']} = ${t4.pct}%  (expect ~44%)`
);
const tell9 = curatedReport.find((c) => c.phrase === 'the tell').byType['9'];
console.log(`cross-check — "the tell" in Type 9: ${tell9.pct}%  (fingerprint report: ~29%)`);
for (const t of Object.keys(surfaced).sort()) {
	console.log(
		`  T${t}: ${
			surfaced[t]
				.slice(0, 4)
				.map((s) => `"${s.phrase}"(${s.lift}x)`)
				.join(', ') || '(none)'
		}`
	);
}
