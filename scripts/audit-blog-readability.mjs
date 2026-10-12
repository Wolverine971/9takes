#!/usr/bin/env node
// scripts/audit-blog-readability.mjs

/**
 * Does this post read like a person wrote it? Measures the things a reader
 * feels before they read a word (paragraph shape, breaks, buried quotes) and
 * the voice tics that make a page sound like a committee cleared it.
 *
 * It is the measurable half of docs/writing-system/05-blog-quality-check.md.
 * It never judges whether a claim is true; the read-through in that doc does.
 * Read-only: prints to stdout, writes nothing.
 *
 * Usage:
 *   pnpm audit:readability -- src/blog/people/drafts/Doja-Cat.md   # one post, with where to look
 *   pnpm audit:readability                                         # every published post, worst first
 *   pnpm audit:readability -- --people                             # people pages only
 *   pnpm audit:readability -- --blogs                              # everything except people pages
 *   pnpm audit:readability -- --top 50
 *   pnpm audit:readability -- --drafts                             # include unpublished files
 *   pnpm audit:readability -- --json
 *   pnpm audit:readability -- <file> --ref HEAD
 *       # judge the file as of a git ref, to compare before and after an edit
 *
 * Rules and limits live in scripts/lib/blogReadability.mjs (specs alongside).
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { BLOG_DIR, PEOPLE_DRAFTS_DIR, REPO_ROOT } from './lib/blogLinkGraph.js';
import { LIMITS, findFlags, profile } from './lib/blogReadability.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
	const index = args.indexOf(name);
	return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const files = args.filter(
	(arg, index) => !arg.startsWith('--') && !['--top', '--ref'].includes(args[index - 1])
);
const ref = option('--ref', null);
const top = Number(option('--top', 30));

function read(file) {
	const relative = path.relative(REPO_ROOT, path.resolve(file));
	if (!ref) return fs.readFileSync(path.resolve(file), 'utf8');
	return execFileSync('git', ['show', `${ref}:${relative}`], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full);
		return entry.name.endsWith('.md') ? [full] : [];
	});
}

function audit(file) {
	const metrics = profile(read(file));
	return { file: path.relative(REPO_ROOT, path.resolve(file)), metrics, flags: findFlags(metrics) };
}

const ROWS = [
	['Typical paragraph', 'medianParagraph', ' words'],
	['Long paragraphs (70+ words)', 'longPct', '%'],
	['Short paragraphs (25 or fewer)', 'shortPct', '%'],
	['One-sentence paragraphs', 'oneSentencePct', '%'],
	['Longest paragraph', 'maxParagraph', ' words'],
	['Long paragraphs in a row', 'longRun', ''],
	['Longest stretch with no break', 'unbrokenStretch', ' words'],
	['Heaviest section', 'heaviestSection', ' words'],
	['Quotes given their own block', 'setOffQuotePct', '%'],
	['"This profile" and the like', 'selfReference', ''],
	['Paragraphs ending on a negative', 'negativeEndingPct', '%'],
	['"Label: quote" intros per 1,000 words', 'colonQuotePer1000', ''],
	['Em dashes outside quotes', 'emDashes', ''],
	['Stock AI phrases', 'stockPhrases', '']
];

function limitText(key) {
	const limit = LIMITS[key];
	return limit.max !== undefined ? `at most ${limit.max}` : `at least ${limit.min}`;
}

function printCard({ file, metrics, flags }) {
	const flagged = new Set(flags.map((f) => f.key));
	const { where, breaks } = metrics;
	console.log(`\n${file}${ref ? ` @ ${ref}` : ''}`);
	console.log(
		`${metrics.words.toLocaleString()} words, ${metrics.paragraphs} paragraphs, ` +
			`${breaks.quotes} quote blocks, ${breaks.lists} lists, ${breaks.media} clips or images` +
			`${metrics.published ? '' : ' (not published)'}`
	);
	console.log(`${flags.length ? `${flags.length} to look at` : 'Nothing flagged'}\n`);
	for (const [label, key, unit] of ROWS) {
		const value = metrics[key];
		const shown = value === null ? 'n/a (few quotes)' : `${value}${unit}`;
		const mark = flagged.has(key) ? 'LOOK' : '  ok';
		console.log(`  ${mark}  ${label.padEnd(38)} ${shown.padEnd(18)} ${limitText(key)}`);
	}
	if (!flags.length) return;
	console.log('\nWhat to do');
	for (const f of flags) console.log(`  - ${f.label}. ${f.fix}`);
	console.log('\nWhere to look');
	if (where.longestParagraph) {
		console.log(
			`  Longest paragraph (${where.longestParagraph.words} words): "${where.longestParagraph.start}"`
		);
	}
	console.log(
		`  Longest stretch with no break (${where.unbrokenStretch.words} words), ` +
			`under "${where.unbrokenStretch.section}", starts: "${where.unbrokenStretch.start}"`
	);
	console.log(
		`  Heaviest section: "${where.heaviestSection.name}" (${where.heaviestSection.words} words)`
	);
	if (flagged.has('longPct') || flagged.has('longRun') || flagged.has('medianParagraph')) {
		console.log('  Longest paragraphs:');
		for (const p of where.longParagraphs.slice(0, 8)) {
			console.log(`    ${String(p.words).padStart(4)}  [${p.section}] ${p.start}`);
		}
	}
	if (flagged.has('negativeEndingPct')) {
		console.log('  Paragraphs that end on a negative:');
		for (const s of where.negativeEndings.slice(0, 8)) console.log(`    - ${s}`);
	}
	if (where.stockPhrases.length) console.log(`  Stock phrases: ${where.stockPhrases.join(', ')}`);
}

if (files.length) {
	const results = files.map(audit);
	if (flag('--json')) console.log(JSON.stringify(results, null, 2));
	else results.forEach(printCard);
	process.exit(0);
}

const isPerson = (file) => file.startsWith(PEOPLE_DRAFTS_DIR);
const results = walk(BLOG_DIR)
	.filter((file) => (flag('--people') ? isPerson(file) : flag('--blogs') ? !isPerson(file) : true))
	.map((file) => {
		try {
			return audit(file);
		} catch (error) {
			return { file: path.relative(REPO_ROOT, file), error: error.message };
		}
	})
	.filter((r) => !r.error && r.metrics.words >= 600)
	.filter((r) => flag('--drafts') || r.metrics.published)
	.sort((a, b) => b.flags.length - a.flags.length || b.metrics.longPct - a.metrics.longPct);

if (flag('--json')) {
	console.log(JSON.stringify(results.slice(0, top), null, 2));
	process.exit(0);
}

const clean = results.filter((r) => !r.flags.length).length;
console.log(
	`${results.length} posts checked. ${clean} with nothing flagged, ` +
		`${results.filter((r) => r.flags.length >= 4).length} with four or more.`
);
console.log(`\nWorst ${Math.min(top, results.length)} first:\n`);
console.log(
	`${'flags'.padEnd(6)}${'typical'.padEnd(9)}${'long %'.padEnd(8)}${'short %'.padEnd(9)}` +
		`${'stretch'.padEnd(9)}${'quotes set off'.padEnd(16)}post`
);
for (const { file, metrics, flags } of results.slice(0, top)) {
	console.log(
		`${String(flags.length).padEnd(6)}${String(metrics.medianParagraph).padEnd(9)}` +
			`${String(metrics.longPct).padEnd(8)}${String(metrics.shortPct).padEnd(9)}` +
			`${String(metrics.unbrokenStretch).padEnd(9)}` +
			`${String(metrics.setOffQuotePct ?? 'n/a').padEnd(16)}${file.replace('src/blog/', '')}`
	);
}
console.log('\nRun it on one file for the full card and where to look:');
console.log('  pnpm audit:readability -- src/blog/<folder>/<post>.md');
