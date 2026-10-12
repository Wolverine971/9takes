#!/usr/bin/env node
// scripts/audit-blog-generic.mjs

/**
 * Which sentences in a post could sit in any other post? Scores every
 * published post section by section and lists the sentences to replace when
 * the post gets a new direction: boilerplate wording, claims with nothing
 * behind them, and (on people pages) type talk with no evidence attached.
 *
 * Runs locally on the markdown. It calls no AI detector and no paid API.
 * Read-only: prints to stdout, writes nothing.
 *
 * Usage:
 *   pnpm audit:generic                                   # every published post, most generic first
 *   pnpm audit:generic -- src/blog/enneagram/<post>.md   # one post: sections, reasons, sentences
 *   pnpm audit:generic -- --serve                        # the picker page at http://localhost:4319
 *   pnpm audit:generic -- --blogs                        # everything except people pages
 *   pnpm audit:generic -- --people                       # people pages only
 *   pnpm audit:generic -- --by clicks --min 15           # 15%+ generic, most search clicks first
 *   pnpm audit:generic -- --top 50
 *   pnpm audit:generic -- --drafts                       # include unpublished files
 *   pnpm audit:generic -- --phrases                      # the wording most posts share
 *   pnpm audit:generic -- --json
 *
 * Rules and thresholds live in scripts/lib/blogGeneric.mjs (specs alongside).
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	BLOG_DIR,
	PEOPLE_DRAFTS_DIR,
	REPO_ROOT,
	displayNameFromTitle,
	loadBlogCorpus,
	loadGsc,
	loadPeople
} from './lib/blogLinkGraph.js';
import {
	FAMILIES,
	REASONS,
	REASON_KEYS,
	buildIndex,
	parsePost,
	scorePost,
	sharedPhrases
} from './lib/blogGeneric.mjs';

const MIN_WORDS = 300;
const PAGE_FILE = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'lib/blogGenericPage.html'
);

const args = process.argv.slice(2);
const VALUE_OPTIONS = ['--top', '--by', '--min', '--port'];
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
	const index = args.indexOf(name);
	return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const files = args.filter(
	(arg, index) => !arg.startsWith('--') && !VALUE_OPTIONS.includes(args[index - 1])
);
const top = Number(option('--top', 30));
const sortBy = option('--by', 'generic');
const minPct = Number(option('--min', 0));

const relative = (file) => path.relative(REPO_ROOT, path.resolve(file)).split(path.sep).join('/');

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full);
		return entry.name.endsWith('.md') ? [full] : [];
	});
}

function titleOf(markdown) {
	return markdown.match(/^title:\s*(['"]?)(.+?)\1\s*$/m)?.[2] ?? '';
}

/** Every markdown file under src/blog: where it lives on the site and whether it is live. */
function loadCorpus() {
	const known = new Map();
	for (const post of loadBlogCorpus()) {
		if (!post.url) continue;
		known.set(`src/blog/${post.rel}`, { kind: 'blog', url: post.url, live: post.live, name: '' });
	}
	for (const person of loadPeople().values()) {
		if (!person.draftFile) continue;
		known.set(person.draftFile, { kind: 'person', url: person.url, live: true, name: person.name });
	}

	const entries = new Map();
	for (const full of walk(BLOG_DIR)) {
		const file = relative(full);
		const markdown = fs.readFileSync(full, 'utf8');
		const isPerson = full.startsWith(PEOPLE_DRAFTS_DIR);
		const meta = known.get(file) ?? {
			kind: isPerson ? 'person' : 'blog',
			url: null,
			live: false,
			name: isPerson ? (displayNameFromTitle(titleOf(markdown)) ?? '') : ''
		};
		entries.set(file, { file, ...meta, parsed: parsePost(markdown, { name: meta.name }) });
	}
	const live = [...entries.values()].filter((entry) => entry.live);
	const index = buildIndex(live.map((entry) => ({ id: entry.file, parsed: entry.parsed })));
	return { entries, live, index, gsc: loadGsc() };
}

function audit(corpus, entry) {
	const result = scorePost(entry.parsed, corpus.index, { id: entry.file });
	const search = entry.url ? corpus.gsc?.pages.get(entry.url) : null;
	const worst = [...result.sections]
		.filter((section) => section.words >= 80)
		.sort((a, b) => b.genericPct - a.genericPct)[0];
	return {
		file: entry.file,
		kind: entry.kind,
		url: entry.url,
		live: entry.live,
		clicks: search?.clicks ?? 0,
		impressions: search?.impressions ?? 0,
		worst: worst ? { name: worst.name, genericPct: worst.genericPct, words: worst.words } : null,
		...result
	};
}

/** One file, read fresh from disk so edits show up without rebuilding the corpus. */
function auditFile(corpus, file) {
	const known = corpus.entries.get(file);
	const markdown = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8');
	const isPerson = path.join(REPO_ROOT, file).startsWith(PEOPLE_DRAFTS_DIR);
	const name = known?.name ?? (isPerson ? (displayNameFromTitle(titleOf(markdown)) ?? '') : '');
	return audit(corpus, {
		file,
		kind: known?.kind ?? (isPerson ? 'person' : 'blog'),
		url: known?.url ?? null,
		live: known?.live ?? false,
		name,
		parsed: parsePost(markdown, { name })
	});
}

const SORTS = {
	generic: (a, b) => b.genericPct - a.genericPct,
	words: (a, b) => b.genericWords - a.genericWords,
	clicks: (a, b) => b.clicks - a.clicks || b.genericPct - a.genericPct
};

function auditAll(corpus, { drafts = false } = {}) {
	return [...corpus.entries.values()]
		.filter((entry) => drafts || entry.live)
		.map((entry) => audit(corpus, entry))
		.filter((result) => result.words >= MIN_WORDS);
}

const summaryOf = (result) => ({ ...result, blocks: undefined });
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 0;
const short = (text, length) => (text.length > length ? `${text.slice(0, length - 1)}…` : text);

function printCard(result) {
	const { specifics } = result;
	console.log(`\n${result.file}${result.live ? '' : ' (not published)'}`);
	console.log(
		`${result.words.toLocaleString()} words. ${result.genericPct}% reads as generic ` +
			`(${result.genericWords.toLocaleString()} words in ${result.flagged} sentences).`
	);
	console.log(
		`Specific material: ${specifics.quote} sentences with a quotation, ${specifics.number} with a ` +
			`number or date, ${specifics.name} naming someone, ${specifics['first-person']} in first person.`
	);
	if (!result.flagged) return;

	console.log('\nWhy sentences were flagged');
	for (const key of REASON_KEYS) {
		const { sentences } = result.reasons[key];
		if (!sentences) continue;
		const [label, , fix] = REASONS[key];
		console.log(`  ${String(sentences).padStart(4)}  ${label.padEnd(34)} ${fix}`);
	}

	console.log('\nSection by section, most generic first');
	console.log(`  ${'generic'.padEnd(9)}${'words'.padEnd(8)}section`);
	const sections = [...result.sections].sort((a, b) => b.genericPct - a.genericPct);
	for (const section of sections) {
		console.log(
			`  ${`${section.genericPct}%`.padEnd(9)}${String(section.words).padEnd(8)}${section.name}`
		);
	}

	console.log('\nWhere to look');
	let section = null;
	for (const block of result.blocks) {
		for (const sentence of block.sentences ?? []) {
			if (!sentence.reasons.length) continue;
			if (block.section !== section) {
				section = block.section;
				console.log(`  [${section}]`);
			}
			const why = sentence.reasons.map((key) => REASONS[key][3]).join(', ');
			console.log(`    - ${short(sentence.text, 150)}\n        ${why}`);
		}
	}
}

function printList(checked, results, corpus) {
	const shown = results.slice(0, top);
	const all = checked.map((r) => r.genericPct);
	console.log(
		`${checked.length} posts checked. Typical post: ${median(all)}% generic. ` +
			`${checked.filter((r) => r.genericPct >= 15).length} are 15% or more.`
	);
	const window = corpus.gsc?.window;
	const clicksNote = window
		? ` Clicks: Google Search, ${window.startDate} to ${window.endDate}.`
		: '';
	const floor = minPct ? ` of the ${results.length} at ${minPct}% or more` : '';
	console.log(`\n${shown.length} shown${floor}, sorted by ${sortBy}.${clicksNote}\n`);
	console.log(
		`${'generic'.padEnd(9)}${'words'.padEnd(8)}${'clicks'.padEnd(8)}${'worst section'.padEnd(44)}post`
	);
	for (const result of shown) {
		const worst = result.worst
			? `${short(result.worst.name, 34)} (${Math.round(result.worst.genericPct)}%)`
			: '';
		console.log(
			`${`${result.genericPct}%`.padEnd(9)}${String(result.words).padEnd(8)}` +
				`${String(result.clicks).padEnd(8)}${worst.padEnd(44)}${result.file.replace('src/blog/', '')}`
		);
	}
	console.log('\nFor the sentences, run it on one file, or open the picker page:');
	console.log('  pnpm audit:generic -- src/blog/<folder>/<post>.md');
	console.log('  pnpm audit:generic -- --serve');
}

function serve(initial) {
	let corpus = initial;
	const port = Number(option('--port', 4319));
	const send = (res, status, body, type = 'application/json') => {
		res.writeHead(status, {
			'content-type': `${type}; charset=utf-8`,
			'cache-control': 'no-store'
		});
		res.end(type === 'application/json' ? JSON.stringify(body) : body);
	};
	const handle = (req, res) => {
		const url = new URL(req.url, `http://localhost:${port}`);
		try {
			if (url.pathname === '/')
				return send(res, 200, fs.readFileSync(PAGE_FILE, 'utf8'), 'text/html');
			if (url.pathname === '/api/posts') {
				if (url.searchParams.has('refresh')) corpus = loadCorpus();
				return send(res, 200, {
					checkedAt: new Date().toISOString(),
					searchWindow: corpus.gsc?.window ?? null,
					reasons: REASONS,
					families: FAMILIES,
					posts: auditAll(corpus, { drafts: url.searchParams.has('drafts') }).map(summaryOf)
				});
			}
			if (url.pathname === '/api/post') {
				// Only markdown inside src/blog, whatever the query string asks for.
				const file = relative(path.join(REPO_ROOT, url.searchParams.get('file') ?? ''));
				if (!file.startsWith('src/blog/') || !file.endsWith('.md')) {
					return send(res, 400, { error: 'Not a blog file.' });
				}
				const result = auditFile(corpus, file);
				return send(res, 200, { ...result, path: path.join(REPO_ROOT, file) });
			}
			return send(res, 404, { error: 'Not found.' });
		} catch (error) {
			return send(res, 500, { error: error.message });
		}
	};
	// Both loopback addresses, so localhost and 127.0.0.1 open the same page.
	http.createServer(handle).listen(port, '127.0.0.1', () => {
		console.log(`Generic audit: http://localhost:${port}`);
		console.log('Each post is re-read from disk when you open it. Ctrl+C to stop.');
	});
	http
		.createServer(handle)
		.on('error', () => {})
		.listen(port, '::1');
}

const corpus = loadCorpus();

if (flag('--serve')) {
	serve(corpus);
} else if (flag('--phrases')) {
	const live = corpus.live.map((entry) => ({ id: entry.file, parsed: entry.parsed }));
	const rows = sharedPhrases(live, corpus.index).slice(0, top);
	if (flag('--json')) console.log(JSON.stringify(rows, null, 2));
	else {
		console.log(`Wording shared by the most posts (${corpus.live.length} published).`);
		console.log('PERSON, #, TYPES and TYPENAME stand in for the name, numbers and type words.\n');
		for (const row of rows) console.log(`${String(row.posts).padStart(5)}  ${row.phrase}`);
	}
} else if (files.length) {
	const results = files.map((file) => auditFile(corpus, relative(file)));
	if (flag('--json')) console.log(JSON.stringify(results, null, 2));
	else results.forEach(printCard);
} else {
	const checked = auditAll(corpus, { drafts: flag('--drafts') }).filter((r) =>
		flag('--people') ? r.kind === 'person' : flag('--blogs') ? r.kind === 'blog' : true
	);
	const results = checked
		.filter((r) => r.genericPct >= minPct)
		.sort(SORTS[sortBy] ?? SORTS.generic);
	if (flag('--json')) console.log(JSON.stringify(results.slice(0, top).map(summaryOf), null, 2));
	else printList(checked, results, corpus);
}
