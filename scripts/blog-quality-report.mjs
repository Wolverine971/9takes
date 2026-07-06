#!/usr/bin/env node
// scripts/blog-quality-report.mjs
//
// Deterministic QUALITY-SIGNAL report for a single 9takes people draft.
// Sibling to scripts/blog-lint.sh — but where blog-lint enforces hard structural
// rules (and enforces hard failures), this script MEASURES the soft
// quality signals the 2026-07-04 pipeline audit found were being self-reported
// (and drifting): negative-parallelism "contrast pairs", searchable head-terms,
// and hand-keyed corpus counts. It is READ-ONLY; the pipeline logs it as a report
// stage, while hard contrast gating lives in scripts/blog-lint.sh. Phase 3 prompt
// changes cite these readings as their exit condition instead of asking an LLM
// stage to grade itself.
//
// Checks:
//   2.1  contrast-pair / negative-parallelism counter   (ground truth: Steve-Martin >= 5)
//   2.4  head-term + answer-block lint on meta_title     (ground truth: 5 of 6 recent fail; Zac passes)
//   1.4  hand-keyed corpus-count drift detector          (ground truth: Goldblum "373" != corpus 378)
//
// Usage:
//   node scripts/blog-quality-report.mjs <Person-Name | path/to/draft.md> [--json]
//
// Exit code is always 0 (report tool, not a gate).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ── args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const target = args.find((a) => !a.startsWith('--'));
if (!target) {
	console.error(
		'Usage: node scripts/blog-quality-report.mjs <Person-Name | path/to/draft.md> [--json]'
	);
	process.exit(2);
}

function resolveDraft(arg) {
	const candidates = [
		arg,
		path.join(REPO_ROOT, arg),
		path.join(REPO_ROOT, 'src/blog/people/drafts', `${arg}.md`)
	];
	for (const c of candidates) {
		if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
	}
	console.error(`Draft not found: ${arg}`);
	process.exit(2);
}

const FILE = resolveDraft(target);
const raw = fs.readFileSync(FILE, 'utf8');
const base = path.basename(FILE, '.md');

// ── split frontmatter / body; strip HTML comments for body analysis ─────────
// Mirrors the awk transform proven in scripts/blog-lint.sh.
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
const frontmatter = fmMatch ? fmMatch[1] : '';
const bodyRaw = fmMatch ? raw.slice(fmMatch[0].length) : raw;
const body = bodyRaw.replace(/<!--[\s\S]*?-->/g, ' ');

// Map a character offset in the *whitespace-collapsed* body back to a source
// line number so findings are clickable. We keep an un-collapsed body for lines.
const bodyLines = bodyRaw.split('\n');
function lineForSnippet(snippet) {
	const needle = snippet.replace(/\s+/g, ' ').trim().slice(0, 40);
	if (!needle) return null;
	for (let i = 0; i < bodyLines.length; i++) {
		if (bodyLines[i].replace(/\s+/g, ' ').includes(needle)) {
			// +offset: body starts after the frontmatter block in the source file
			const fmLines = fmMatch ? fmMatch[0].split('\n').length - 1 : 0;
			return fmLines + i + 1;
		}
	}
	return null;
}

function fmField(name) {
	const m = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
	if (!m) return null;
	return m[1].trim().replace(/^['"]/, '').replace(/['"]$/, '');
}

// Normalize body to a single spaced string + a sentence list.
const flat = body.replace(/\s+/g, ' ').trim();
const sentences = flat.match(/[^.!?]+[.!?]+(?:["')\]]+)?/g) || [];

// ════════════════════════════════════════════════════════════════════════════
// 2.1 — Contrast-pair / negative-parallelism counter
// ════════════════════════════════════════════════════════════════════════════
// Two categories. "strong" = the antithesis engine the pipeline is actively
// (and unsuccessfully) trying to suppress. "comparative" = the weaker cousin
// (more X than Y / looked like) reported separately so the editor exit target
// can choose its strictness.
const STRONG = [
	// not X , but / it was / rather / instead Y
	{
		name: 'not…but/it-was',
		re: /\bnot\b[^.,;:!?]{2,70}[,;:—-]+\s*(?:but|it was|it['’]s|they were|he was|she was|rather|instead)\b/i
	},
	// X, not Y  (antithesis) — exclude quantifier/intensifier tails that aren't a contrasting alternative
	{
		name: 'X,-not-Y',
		re: /,\s*not\s+(?!enough\b|yet\b|even\b|quite\b|necessarily\b|anymore\b|really\b|at all\b|that\b|so\b|because\b|as\b|until\b)[a-z]/i
	},
	// not so much X as Y  /  not X so much as Y
	{ name: 'not-so-much-as', re: /\bnot\b[^.!?]{0,50}\bso much as\b/i }
];
const STRONG_CROSS =
	/\b(?:wasn['’]t|weren['’]t|isn['’]t|aren['’]t|didn['’]t)\b[^.!?]{2,80}[.!?]\s+(?:it|he|she|they|that|this)\s+(?:was|is|were|are)\b/i;
const COMPARATIVE = [
	{ name: 'more/less-than', re: /\b(?:more|less)\b[^.,;:!?]{2,45}\bthan\b/i },
	{ name: 'looked-like', re: /\blooked like\b/i }
];

const contrastHits = { strong: [], comparative: [] };
for (const s of sentences) {
	const t = s.trim();
	let matched = null;
	for (const p of STRONG)
		if (p.re.test(t)) {
			matched = p.name;
			break;
		}
	if (!matched && STRONG_CROSS.test(t)) matched = 'wasn’t-X.-It-was-Y';
	if (matched) {
		contrastHits.strong.push({
			pattern: matched,
			sentence: t.slice(0, 140),
			line: lineForSnippet(t)
		});
		continue;
	}
	for (const p of COMPARATIVE)
		if (p.re.test(t)) {
			contrastHits.comparative.push({
				pattern: p.name,
				sentence: t.slice(0, 140),
				line: lineForSnippet(t)
			});
			break;
		}
}
// cross-sentence "wasn't X. It was Y" can straddle the naive sentence split — also scan flat.
{
	const re = new RegExp(STRONG_CROSS, 'gi');
	let m;
	while ((m = re.exec(flat))) {
		const snap = flat.slice(m.index, m.index + 90);
		if (!contrastHits.strong.some((h) => h.sentence.startsWith(snap.slice(0, 30)))) {
			contrastHits.strong.push({
				pattern: 'wasn’t-X.-It-was-Y',
				sentence: snap,
				line: lineForSnippet(snap)
			});
		}
	}
}
const contrastTotal = contrastHits.strong.length + contrastHits.comparative.length;

// ════════════════════════════════════════════════════════════════════════════
// 2.4 — Head-term + answer-block lint
// ════════════════════════════════════════════════════════════════════════════
const metaTitle = fmField('meta_title') || '';
const headTermException = fmField('head_term_exception');
const HEAD_TERM = /\benneagram\b|\btype\s*[1-9]\b|\bpersonality type\b/i;
const headTermOk = HEAD_TERM.test(metaTitle) || !!headTermException;

// name token check (lenient; accents/apostrophes tolerated) — WARN only
const personSlug = fmField('person') || base;
const nameTokens = personSlug
	.replace(/[-_]/g, ' ')
	.split(/\s+/)
	.filter((w) => w.length >= 3)
	.map((w) => w.toLowerCase());
const mtNorm = metaTitle.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
const nameOk =
	nameTokens.length === 0 ||
	nameTokens.some((tk) => mtNorm.includes(tk.normalize('NFKD').replace(/[̀-ͯ]/g, '')));

// answer-block: first paragraph under the type-verdict H2/H3, <= 60 words is snippet-friendly
function answerBlock() {
	const h = body.search(/^###?\s+.*(?:personality type\?|is an Enneagram Type\s*[1-9])/im);
	if (h < 0) return { found: false };
	const after = body.slice(h);
	const paras = after
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
	// paras[0] is the heading line; first real paragraph is the next non-heading block
	const firstPara = paras.slice(1).find((p) => !/^#{1,6}\s/.test(p) && !/^</.test(p));
	if (!firstPara) return { found: false };
	const words = firstPara.replace(/\s+/g, ' ').split(' ').filter(Boolean).length;
	return {
		found: true,
		words,
		ok: words <= 60,
		preview: firstPara.replace(/\s+/g, ' ').slice(0, 90)
	};
}
const answer = answerBlock();

// ════════════════════════════════════════════════════════════════════════════
// 1.4 — Hand-keyed corpus-count drift detector
// ════════════════════════════════════════════════════════════════════════════
let corpus = null;
try {
	corpus = JSON.parse(
		fs.readFileSync(path.join(REPO_ROOT, 'src/lib/data/corpus-stats.json'), 'utf8')
	);
} catch {
	/* corpus stats unavailable — skip this check */
}
const corpusTotal = corpus?.totals?.published ?? null;
const typeDist = corpus?.enneagram_distribution?.counts ?? corpus?.enneagram_distribution ?? null;
function typeCount(n) {
	if (!typeDist) return null;
	const v = typeDist[String(n)] ?? typeDist[n];
	if (v == null) return null;
	return typeof v === 'number' ? v : (v.count ?? v.n ?? null);
}
const corpusFindings = [];
if (corpusTotal != null) {
	// "the 373 people we have profiled" / "369 personality analyses" / "N figures profiled"
	const totalRe =
		/\b(\d{2,4})\b\s+(?:people|figures|celebrities|public figures|personality analyses|profiles)\b[^.]{0,40}\b(?:profil|analys|we have|we['’]ve|on 9takes|in the (?:9takes )?corpus)/gi;
	let m;
	while ((m = totalRe.exec(flat))) {
		const n = parseInt(m[1], 10);
		if (n >= 40 && n !== corpusTotal) {
			corpusFindings.push({
				kind: 'total',
				stated: n,
				correct: corpusTotal,
				snippet: flat.slice(m.index, m.index + 70).trim(),
				line: lineForSnippet(flat.slice(m.index, m.index + 40))
			});
		}
	}
	// per-type: "one of 56 Sevens" / "54 Type 7s" / "49 Type Sevens" / "21 read as Type 9"
	const WORDNUM = {
		ones: 1,
		twos: 2,
		threes: 3,
		fours: 4,
		fives: 5,
		sixes: 6,
		sevens: 7,
		eights: 8,
		nines: 9
	};
	const typeRe =
		/\b(\d{2,4})\s+(?:Type\s*)?(Ones|Twos|Threes|Fours|Fives|Sixes|Sevens|Eights|Nines|Type\s*[1-9]s?)\b/gi;
	while ((m = typeRe.exec(flat))) {
		const stated = parseInt(m[1], 10);
		const label = m[2].toLowerCase();
		let typeNum =
			WORDNUM[label] ?? (label.match(/[1-9]/) ? parseInt(label.match(/[1-9]/)[0], 10) : null);
		if (typeNum == null) continue;
		const correct = typeCount(typeNum);
		if (correct != null && stated !== correct) {
			corpusFindings.push({
				kind: `type-${typeNum}`,
				stated,
				correct,
				snippet: flat.slice(m.index, m.index + 60).trim(),
				line: lineForSnippet(flat.slice(m.index, m.index + 40))
			});
		}
	}
}

// ════════════════════════════════════════════════════════════════════════════
// output
// ════════════════════════════════════════════════════════════════════════════
const report = {
	draft: base,
	contrast_pairs: {
		strong: contrastHits.strong.length,
		comparative: contrastHits.comparative.length,
		total: contrastTotal,
		hits: contrastHits
	},
	head_term: {
		meta_title: metaTitle,
		ok: headTermOk,
		exception: headTermException || null,
		name_present: nameOk
	},
	answer_block: answer,
	corpus_count_drift: { corpus_total: corpusTotal, findings: corpusFindings }
};

if (asJson) {
	console.log(JSON.stringify(report, null, 2));
	process.exit(0);
}

console.log(`blog-quality-report: ${base}`);
console.log('─'.repeat(60));
console.log(
	`2.1 Contrast pairs: ${contrastTotal} total  (strong ${contrastHits.strong.length}, comparative ${contrastHits.comparative.length})`
);
for (const h of contrastHits.strong)
	console.log(`   strong  [${h.pattern}] L${h.line ?? '?'}: ${h.sentence}`);
for (const h of contrastHits.comparative)
	console.log(`   compar. [${h.pattern}] L${h.line ?? '?'}: ${h.sentence}`);
console.log('');
console.log(`2.4 Head-term: ${headTermOk ? 'PASS' : 'FAIL'}  meta_title=${metaTitle}`);
if (!headTermOk)
	console.log(
		'   → add enneagram / "type N" / "personality type" to meta_title, or set head_term_exception'
	);
if (!nameOk) console.log('   WARN: person name token not detected in meta_title');
if (answer.found)
	console.log(
		`   answer-block: ${answer.ok ? 'ok' : 'WARN'} (${answer.words} words; ${answer.ok ? '<=60' : '>60, not snippet-friendly'})`
	);
else console.log('   answer-block: WARN not found under the type-verdict heading');
console.log('');
if (corpusTotal != null) {
	if (corpusFindings.length === 0)
		console.log(`1.4 Corpus-count drift: none (corpus total = ${corpusTotal})`);
	else {
		console.log(
			`1.4 Corpus-count drift: ${corpusFindings.length} stale hand-keyed count(s) (corpus total = ${corpusTotal})`
		);
		for (const f of corpusFindings)
			console.log(
				`   ${f.kind}: stated ${f.stated}, correct ${f.correct}  L${f.line ?? '?'}: "${f.snippet}"`
			);
	}
} else {
	console.log('1.4 Corpus-count drift: skipped (corpus-stats.json unavailable)');
}
process.exit(0);
