#!/usr/bin/env node
// scripts/check-corpus-figures.mjs
//
// Keeps corpus numbers in posts live. Corpus figures ("Type 4 is 35.6% of the 90 musicians
// profiled on 9takes") go stale every time a profile ships or people are reclassified, so posts
// write tokens instead (`{{corpus.domain.music.type.4.share}}`, see src/lib/corpusTokens.js and
// "Live tokens" in docs/data/corpus-stats.md). This check fails on:
//   1. unknown tokens (the build would throw on them anyway),
//   2. `<!-- corpus-assert: path = value -->` claims the data no longer supports
//      ("Type 4 leads music" stopped being true: rewrite the sentence),
//   3. hand-typed figures in a sentence that cites the 9takes corpus,
//   4. tokens in people-page title/description fields (listing cards show those raw).
// A figure that is not a corpus number (an external study, a sub-sample counted by hand) gets
// `<!-- corpus-ok: reason -->` in the same paragraph; a whole post frozen at a dated pull sets
// `corpus_snapshot: 'YYYY-MM-DD'` in frontmatter.
//
// Scope: published posts in src/blog/** (people drafts mirror the DB rows).
// Usage: node scripts/check-corpus-figures.mjs [--warn] [files...]
//   --warn  print problems but exit 0 (the corpus-stats generator uses this at deploy time)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import corpusStats from '../src/lib/data/corpus-stats.json' with { type: 'json' };
import {
	CORPUS_TOKEN_RE,
	buildCorpusTokenTable,
	checkCorpusAssertions,
	findCorpusTokens
} from '../src/lib/corpusTokens.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'src', 'blog');

// A sentence "cites the corpus" when it points at 9takes' own profile counts.
const CORPUS_CLAIM_RE =
	/\bcorpus\b|\/corpus-stats|profiled on 9takes|9takes (?:has )?(?:profiled|typed)|profiles? (?:on|in) (?:the )?9takes|published (?:personality )?profiles\b|our \[?\d* ?(?:personality )?profiles\b|9takes(?:'s?)? (?:data|shelf|profiles)|our (?:own )?(?:profiles|shelf)/i;
// ...and carries a number of the kind the corpus produces.
const FIGURE_RE =
	/\d+(?:\.\d+)?\s?%|\b\d{2,4}\s+(?:[a-z-]+\s+){0,2}(?:profiles|musicians|comedians|creators|founders|figures|people|politicians|actors|artists)\b|\bof (?:the |all )?\d{2,4}\b|\bn\s?=\s?\d+|[+−-]\d+(?:\.\d+)?\s?(?:pp|percentage points)\b/i;
const OK_MARKER_RE = /<!--\s*corpus-ok\b/i;
const PEOPLE_RAW_FIELDS = ['title', 'description', 'meta_title', 'persona_title'];

function listMarkdown(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return listMarkdown(full);
		return /\.(?:md|svx)$/.test(entry.name) ? [full] : [];
	});
}

/**
 * @param {string} file
 * @param {Map<string, string>} table
 * @returns {string[]} problems, prefixed with file:line
 */
export function checkFile(file, table) {
	const raw = fs.readFileSync(file, 'utf8');
	const rel = path.relative(ROOT, file);
	let parsed;
	try {
		parsed = matter(raw);
	} catch {
		return [];
	}
	if (parsed.data.published !== true) return [];

	const problems = [];
	const lineOf = (index) => raw.slice(0, index).split('\n').length;

	for (const match of raw.matchAll(CORPUS_TOKEN_RE)) {
		if (!table.has(match[1].toLowerCase())) {
			problems.push(`${rel}:${lineOf(match.index)}  unknown token ${match[0]}`);
		}
	}
	// A line that STARTS with an HTML comment is an HTML block in markdown: the rest of that line
	// renders as raw text ("[link](/x)" shows literally). Guards go on their own line or at the end.
	for (const match of raw.matchAll(/^[ \t]*<!--\s*corpus-(?:assert|ok)\b[^>]*-->[ \t]*\S.*$/gm)) {
		problems.push(
			`${rel}:${lineOf(match.index)}  corpus comment starts a line with text after it (breaks markdown): move it to its own line or the line end`
		);
	}
	for (const failure of checkCorpusAssertions(raw, table)) {
		problems.push(`${rel}  corpus-assert failed: ${failure}`);
	}

	if (rel.includes(`people${path.sep}`)) {
		for (const field of PEOPLE_RAW_FIELDS) {
			const value = parsed.data[field];
			if (typeof value === 'string' && findCorpusTokens(value).length) {
				problems.push(
					`${rel}  token in frontmatter "${field}" (people listings show it raw): use a literal or move it to the body/FAQs`
				);
			}
		}
	}

	// A post built on a dated, hand-counted subset the stats file doesn't carry (the CEO post's
	// 46 company leaders) declares `corpus_snapshot: 'YYYY-MM-DD'` and says so in its copy.
	if (parsed.data.corpus_snapshot) return problems;

	// Hand-typed figures. HTML comments (editor notes, corpus-assert) and code fences are blanked
	// out with newlines kept, so line numbers still match; a corpus-ok marker exempts its paragraph.
	const masked = raw
		.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
		.replace(/^\s*```[\s\S]*?^\s*```/gm, (c) => c.replace(/[^\n]/g, ' '));
	let offset = 0;
	for (const block of masked.split(/\n\s*\n/)) {
		const start = masked.indexOf(block, offset);
		offset = start + block.length;
		if (OK_MARKER_RE.test(raw.slice(start, start + block.length))) continue;
		let lineStart = start;
		for (const line of block.split('\n')) {
			// A markdown paragraph is one line, so a line that cites the corpus anywhere owns
			// every figure in it ("…the 9takes corpus is 450 people. Type 3 is 18.0%.").
			if (CORPUS_CLAIM_RE.test(line)) {
				const untokened = line.replace(CORPUS_TOKEN_RE, 'TOKEN');
				const figure = untokened.match(FIGURE_RE);
				if (figure) {
					const at = Math.max(0, (figure.index ?? 0) - 70);
					const context = untokened.slice(at, at + 160).trim();
					problems.push(
						`${rel}:${lineOf(lineStart)}  hand-typed corpus figure "${figure[0].trim()}": …${context}…`
					);
				}
			}
			lineStart += line.length + 1;
		}
	}
	return problems;
}

function main() {
	const args = process.argv.slice(2);
	const warnOnly = args.includes('--warn');
	const explicit = args.filter((a) => !a.startsWith('--')).map((f) => path.resolve(f));
	const files = explicit.length ? explicit : listMarkdown(BLOG_DIR);
	const table = buildCorpusTokenTable(corpusStats);

	const problems = files.flatMap((file) => checkFile(file, table));
	if (!problems.length) {
		console.log(`✓ corpus figures: ${files.length} files, every corpus number is a live token.`);
		return;
	}
	const log = warnOnly ? console.warn : console.error;
	log(`${warnOnly ? '⚠️ ' : '✗'} corpus figures: ${problems.length} problem(s)\n`);
	for (const p of problems) log(`  ${p}`);
	log(
		'\nWrite corpus numbers as {{corpus.*}} tokens (paths: "Live tokens" in docs/data/corpus-stats.md).' +
			'\nNot a corpus number? Add <!-- corpus-ok: reason --> to that paragraph.'
	);
	if (!warnOnly) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
