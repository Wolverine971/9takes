#!/usr/bin/env node
// scripts/audit-superlative-queries.mjs

/**
 * Find pages that rank for "which Enneagram type is most X" searches (worst, most
 * manipulative, most likely to cheat, most likely to be autistic…) but never ask
 * or answer that question in a QuickAnswer, heading or FAQ.
 *
 * Reads the latest GSC drop (docs/data/gsc/latest.json → page-query CSV), folds
 * #fragment rows (largest row per page+query, never summed), maps each URL to its
 * markdown source, clusters the superlative queries by concept, and writes a
 * ranked report to docs/seo/superlative-query-gaps.md.
 *
 * Usage:
 *   pnpm audit:superlatives
 *   pnpm audit:superlatives -- --min-impressions 30
 *   pnpm audit:superlatives -- --json            # machine-readable output on stdout
 *   pnpm audit:superlatives -- --no-write        # don't rewrite the report
 *   pnpm audit:superlatives -- --ref HEAD --no-write
 *       # judge the page text as of a git ref (before/after a content pass);
 *       # URL → file mapping still comes from the working tree; never writes the report
 *
 * Rules live in scripts/lib/superlativeQueries.mjs (specs alongside).
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
	GSC_DIR,
	PEOPLE_DRAFTS_DIR,
	REPO_ROOT,
	loadBlogCorpus,
	loadEnneagramRedirects,
	normalizeInternalHref,
	normalizePersonalitySlug
} from './lib/blogLinkGraph.js';
import {
	classifyQuery,
	clusterPageQueries,
	extractAnswerSurface,
	foldFragments,
	parseGscCsv
} from './lib/superlativeQueries.mjs';

const REPORT_REL = 'docs/seo/superlative-query-gaps.md';
// "Spread thin" concepts below this many summed impressions are noise.
const ORPHAN_FLOOR = 10;
const CONTROL_URL = '/enneagram-corner/enneagram-and-adhd-which-types-struggle-most';
const POP_CULTURE_REDIRECTS = path.join(REPO_ROOT, 'src/lib/data/popCultureRedirects.ts');
const PEOPLE_PREFIX = '/personality-analysis/';
const NON_PERSON_PEOPLE = /^\/personality-analysis\/(type|categories|map)(\/|$)/;

// Pages that allow additive edits only (no retitle, restructure or new QuickAnswer).
// A FAQ answer is their ceiling, so "asked only in the FAQ" isn't flagged there.
const FROZEN_PAGES = new Map([
	[
		'/enneagram-corner/enneagram-and-mental-illness',
		'top-traffic page, additive edits only; an unanswered cluster needs its own page'
	]
]);

function parseArgs(argv) {
	const args = { minImpressions: 50, json: false, write: true, ref: null };
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === '--json') args.json = true;
		else if (arg === '--no-write') args.write = false;
		else if (arg.startsWith('--ref')) {
			args.ref = arg.includes('=') ? arg.split('=')[1] : argv[++i];
			if (!args.ref || args.ref.startsWith('-')) {
				console.error('--ref needs a git ref, e.g. --ref HEAD');
				process.exit(1);
			}
		} else if (arg.startsWith('--min-impressions')) {
			const value = arg.includes('=') ? arg.split('=')[1] : argv[++i];
			const n = Number(value);
			if (!Number.isFinite(n) || n < 0) {
				console.error(`--min-impressions needs a number, got "${value}"`);
				process.exit(1);
			}
			args.minImpressions = n;
		} else if (arg === '--help' || arg === '-h') {
			console.log(
				'Usage: node scripts/audit-superlative-queries.mjs [--min-impressions N] [--json] [--no-write] [--ref <git-ref>]'
			);
			process.exit(0);
		}
	}
	// The report always describes the working tree; a --ref run is a comparison.
	if (args.ref) args.write = false;
	return args;
}

function loadRedirects() {
	const redirects = loadEnneagramRedirects();
	if (fs.existsSync(POP_CULTURE_REDIRECTS)) {
		const source = fs.readFileSync(POP_CULTURE_REDIRECTS, 'utf8');
		for (const m of source.matchAll(/'([a-z0-9-]+)'\s*:\s*'([^']+)'/g)) {
			redirects.set(`/pop-culture/${m[1]}`, m[2]);
		}
	}
	return redirects;
}

/** URL path → markdown source (repo-relative), plus live status. */
function buildSourceMap() {
	const byUrl = new Map();
	const enneagramBySlug = new Map();
	for (const post of loadBlogCorpus()) {
		const file = path.posix.join('src/blog', post.rel);
		if (post.url) byUrl.set(post.url, { file, live: post.live, status: post.status });
		// The enneagram-corner route resolves a slug against every file under
		// src/blog/enneagram (mental-health included), so old flat URLs still map.
		if (post.url && post.url.startsWith('/enneagram-corner/') && !enneagramBySlug.has(post.slug)) {
			enneagramBySlug.set(post.slug, { file, live: post.live, status: post.status });
		}
	}
	const people = new Map();
	if (fs.existsSync(PEOPLE_DRAFTS_DIR)) {
		for (const name of fs.readdirSync(PEOPLE_DRAFTS_DIR).filter((f) => f.endsWith('.md'))) {
			const full = path.join(PEOPLE_DRAFTS_DIR, name);
			const file = path.relative(REPO_ROOT, full).split(path.sep).join('/');
			const head = fs.readFileSync(full, 'utf8').slice(0, 4000);
			const published = /^published:\s*true\b/m.test(head);
			const entry = { file, live: published, status: published ? 'live (DB)' : 'draft' };
			const loc = head.match(/^loc:\s*['"]?([^'"\n]+)/m);
			const fromLoc = loc ? normalizeInternalHref(loc[1]) : null;
			if (fromLoc && fromLoc.startsWith(PEOPLE_PREFIX)) people.set(fromLoc, entry);
			const bySlug = `${PEOPLE_PREFIX}${normalizePersonalitySlug(name.replace(/\.md$/, ''))}`;
			if (!people.has(bySlug)) people.set(bySlug, entry);
		}
	}
	return (url) => {
		if (byUrl.has(url)) return byUrl.get(url);
		if (url.startsWith(PEOPLE_PREFIX) && !NON_PERSON_PEOPLE.test(url)) {
			return people.get(url) ?? people.get(url.toLowerCase()) ?? null;
		}
		const flat = url.match(/^\/enneagram-corner\/([^/]+)$/);
		if (flat && enneagramBySlug.has(flat[1])) return enneagramBySlug.get(flat[1]);
		return null;
	};
}

function loadRows() {
	const pointer = path.join(GSC_DIR, 'latest.json');
	if (!fs.existsSync(pointer))
		throw new Error(`No GSC pointer at ${path.relative(REPO_ROOT, pointer)}`);
	const latest = JSON.parse(fs.readFileSync(pointer, 'utf8'));
	const file = path.join(GSC_DIR, latest.files.pageQuery);
	if (!latest.files.pageQuery || !fs.existsSync(file)) {
		throw new Error('latest.json has no page-query CSV; run scripts/fetch-gsc-data.mjs');
	}
	return {
		latest,
		csv: path.relative(REPO_ROOT, file),
		rows: parseGscCsv(fs.readFileSync(file, 'utf8'))
	};
}

/** Page text from the working tree, or as of a git ref. Null when absent. */
function readSource(file, ref) {
	if (!ref) {
		const full = path.join(REPO_ROOT, file);
		return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
	}
	try {
		return execFileSync('git', ['show', `${ref}:${file}`], {
			cwd: REPO_ROOT,
			encoding: 'utf8',
			maxBuffer: 32 * 1024 * 1024,
			stdio: ['ignore', 'pipe', 'ignore']
		});
	} catch {
		return null;
	}
}

/**
 * Concepts that several pages pick up in small slices and none answers up top:
 * the signal for a dedicated page rather than a fix to any one of them.
 * Impressions are summed across pages (different SERP entries), deduped per page.
 */
function orphanConcepts(clusters) {
	const byKey = new Map();
	for (const c of clusters) {
		if (c.answered === null) continue;
		if (!byKey.has(c.key))
			byKey.set(c.key, { key: c.key, impressions: 0, pages: [], answeredUpTop: [] });
		const entry = byKey.get(c.key);
		entry.impressions += c.impressions;
		entry.pages.push(c.url);
		if (c.placement === 'lead') entry.answeredUpTop.push(c.url);
	}
	return [...byKey.values()]
		.filter((e) => e.pages.length >= 2 && e.answeredUpTop.length === 0)
		.sort((a, b) => b.impressions - a.impressions);
}

function runAudit({ minImpressions, ref }) {
	const { latest, csv, rows } = loadRows();
	const redirects = loadRedirects();
	const canonicalize = (page) => {
		let url = normalizeInternalHref(page);
		if (url == null) return null;
		for (let hop = 0; hop < 3 && redirects.has(url); hop++) url = redirects.get(url);
		return url;
	};
	const folded = foldFragments(rows, { canonicalize });
	const sourceFor = buildSourceMap();

	const byPage = new Map();
	let superlativeRows = 0;
	for (const row of folded) {
		if (!classifyQuery(row.query, { page: row.page }).superlative) continue;
		superlativeRows++;
		if (!byPage.has(row.page)) byPage.set(row.page, []);
		byPage.get(row.page).push(row);
	}

	const clusters = [];
	for (const [url, pageRows] of byPage) {
		const source = sourceFor(url);
		const text = source ? readSource(source.file, ref) : null;
		const surface = text == null ? null : extractAnswerSurface(text);
		const viaRedirect = [
			...new Set(
				pageRows
					.flatMap((r) => r.pages.map((p) => normalizeInternalHref(p)))
					.filter((p) => p && p !== url)
			)
		].filter((p) => redirects.has(p));
		for (const cluster of clusterPageQueries(pageRows, surface)) {
			clusters.push({
				url,
				source_file: source?.file ?? null,
				status: source?.status ?? 'no markdown source',
				frozen: FROZEN_PAGES.get(url) ?? null,
				via_redirect: viaRedirect,
				kind: classifyQuery(cluster.queries[0].query, { page: url }).kind,
				...cluster
			});
		}
	}
	clusters.sort((a, b) => b.impressions - a.impressions);

	const big = clusters.filter((c) => c.impressions >= minImpressions);
	const needsWork = (c) => c.answered === false || (c.placement === 'buried' && !c.frozen);
	return {
		runDate: latest.runDate,
		window: latest.window,
		csv,
		ref,
		minImpressions,
		totals: {
			superlativeQueries: superlativeRows,
			pages: byPage.size,
			clusters: clusters.length
		},
		missing: big.filter((c) => c.answered === false),
		buried: big.filter((c) => c.answered === true && c.placement === 'buried' && !c.frozen),
		frozenBuried: big.filter((c) => c.answered === true && c.placement === 'buried' && c.frozen),
		lead: big.filter((c) => c.answered === true && c.placement === 'lead'),
		unmapped: big.filter((c) => c.answered === null),
		watch: clusters.filter((c) => c.impressions < minImpressions && needsWork(c)),
		orphans: orphanConcepts(clusters)
	};
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const cell = (text) =>
	String(text ?? '')
		.replace(/\|/g, '\\|')
		.replace(/\n/g, ' ');
const ctr = (c) => (c.impressions ? `${((c.clicks / c.impressions) * 100).toFixed(2)}%` : '0%');
const topQueries = (c, n = 3) =>
	c.queries
		.slice(0, n)
		.map((q) => `"${q.query}" ${q.impressions} @ ${q.position}`)
		.join('; ') + (c.queries.length > n ? `; +${c.queries.length - n} more` : '');
const pageCell = (c) =>
	[
		`\`${c.url}\``,
		c.source_file ? `\`${c.source_file}\`${c.status !== 'live' ? ` (${c.status})` : ''}` : null,
		c.via_redirect.length
			? `incl. 301 from ${c.via_redirect.map((u) => `\`${u}\``).join(', ')}`
			: null,
		c.frozen ? `**Frozen:** ${c.frozen}` : null
	]
		.filter(Boolean)
		.join('<br>');

function gapTable(lines, rows) {
	lines.push(
		"| # | Page | Cluster | Impr | Clicks | Pos | SERP title asks it? | Top queries (deduped impr @ pos) | What's missing | Ask this |",
		'| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
	);
	rows.forEach((c, i) => {
		lines.push(
			`| ${i + 1} | ${cell(pageCell(c))} | ${cell(c.key)} | ${c.impressions} | ${c.clicks} | ${c.position} | ${c.titleAsks ? 'yes' : 'no'} | ${cell(topQueries(c))} | ${cell(c.gap)} | ${cell(c.suggestion)} |`
		);
	});
	lines.push('');
}

function renderReport(result) {
	const { missing, buried, frozenBuried, lead, unmapped, watch, window } = result;
	const min = result.minImpressions;
	const lines = [];
	lines.push(`<!-- ${REPORT_REL} -->`, '');
	lines.push('# Superlative query gaps', '');
	lines.push(
		`Generated by \`pnpm audit:superlatives\` from \`${result.csv}\` (GSC ${window?.startDate} to ${window?.endDate}, ${window?.days} days), judged against the working tree. Regenerate after each GSC pull or content pass; don't edit by hand.`,
		''
	);
	lines.push(
		'**What this finds:** pages that show up for "which Enneagram type is most X" searches but never ask or answer that question where a searcher looks first. The searcher wants a pick. When the snippet and the top of the page don\'t offer one, the click goes elsewhere. In the 90 days to 2026-10-02, toxic-traits earned 1 click on 393 "worst type" impressions at position ~10, and the manipulation, depression and autism pages asked their question only in the FAQ and sat at 0 to 2 clicks on page 1. The control is the ADHD page: its QuickAnswer asks "Which Enneagram type is most likely to have ADHD?" and the page earns 5.87% CTR at position 5.2.',
		''
	);
	lines.push(
		'**Fix recipe:** make the QuickAnswer question (or an H2) match the query, mirror it as a FAQ entry plus FAQPage JSON-LD, and give an honest, hedged pick. "No type is X, but these patterns get described that way" counts as an answer. Putting the question in `meta_title` helps the SERP match too.',
		''
	);
	const control = [...result.lead, ...result.watch, ...result.missing, ...result.buried].find(
		(c) => c.url === CONTROL_URL && c.key === 'adhd'
	);
	lines.push(
		`**Read the CTR column with care.** GSC discloses only a sample of queries, and the ADHD control earns most of its clicks on head terms ("adhd enneagram", "enneagram and adhd").${control ? ` Its own superlative cluster shows ${control.clicks} clicks on ${control.impressions} impressions at position ${control.position} in this window.` : ''} Answering the pick fixes the mismatch; measure each page at 2 and 4 weeks before assuming it lifts clicks.`,
		''
	);
	lines.push(
		`**Summary:** ${result.totals.superlativeQueries} superlative query rows (deduped) on ${result.totals.pages} pages, in ${result.totals.clusters} concept clusters. At ${min}+ impressions: **${missing.length} not answered**, **${buried.length} asked only in an H3 or the FAQ**, ${lead.length} answered up top, ${frozenBuried.length} on frozen pages where the FAQ is the ceiling, ${unmapped.length} on pages with no markdown source.`,
		''
	);

	lines.push(`## Not answered (${min}+ impressions)`, '');
	if (missing.length) gapTable(lines, missing);
	else lines.push('None.', '');

	lines.push(`## Asked only in an H3 or the FAQ (${min}+ impressions)`, '');
	lines.push(
		'The page asks the question, but below the fold. Promote it to the QuickAnswer question or an H2.',
		''
	);
	if (buried.length) gapTable(lines, buried);
	else lines.push('None.', '');

	lines.push(`## Answered up top (${min}+ impressions)`, '');
	lines.push(
		'The QuickAnswer question or an H2 asks the pick. Use these rows as the before/after baseline.',
		''
	);
	if (lead.length) {
		lines.push(
			'| Page | Cluster | Impr | Clicks | CTR | Pos | SERP title asks it? | Answered in | Text |',
			'| --- | --- | --- | --- | --- | --- | --- | --- | --- |'
		);
		for (const c of lead) {
			lines.push(
				`| \`${cell(c.url)}\` | ${cell(c.key)} | ${c.impressions} | ${c.clicks} | ${ctr(c)} | ${c.position} | ${c.titleAsks ? 'yes' : 'no'} | ${cell(c.via)} | ${cell(c.where)} |`
			);
		}
		lines.push('');
	} else lines.push('None.', '');

	if (frozenBuried.length) {
		lines.push(
			`## Frozen pages: answered in the FAQ, which is the ceiling (${min}+ impressions)`,
			''
		);
		lines.push(
			'These pages allow additive edits only, so a FAQ answer is as far as they go. If a cluster stays at 0 clicks, give it a dedicated page.',
			''
		);
		lines.push(
			'| Page | Cluster | Impr | Clicks | Pos | Answered in | Text |',
			'| --- | --- | --- | --- | --- | --- | --- |'
		);
		for (const c of frozenBuried) {
			lines.push(
				`| \`${cell(c.url)}\` | ${cell(c.key)} | ${c.impressions} | ${c.clicks} | ${c.position} | ${cell(c.via)} | ${cell(c.where)} |`
			);
		}
		lines.push('');
	}

	if (unmapped.length) {
		lines.push(`## Pages with no markdown source (${min}+ impressions)`, '');
		lines.push(
			"Route or database pages (homepage, `/questions/*`, type hubs). The auditor can't read them, so check these by hand.",
			''
		);
		lines.push(
			'| Page | Cluster | Impr | Clicks | Pos | Top queries |',
			'| --- | --- | --- | --- | --- | --- |'
		);
		for (const c of unmapped) {
			lines.push(
				`| \`${cell(c.url)}\` | ${cell(c.key)} | ${c.impressions} | ${c.clicks} | ${c.position} | ${cell(topQueries(c))} |`
			);
		}
		lines.push('');
	}

	if (watch.length) {
		const shown = watch.slice(0, 15);
		lines.push(`## Watch list: under ${min} impressions`, '');
		lines.push(
			`${watch.length} smaller clusters are unanswered or asked only in the FAQ. The largest ${shown.length}:`,
			''
		);
		for (const c of shown) {
			const tier = c.answered ? `asked only in the ${c.via}` : 'not answered';
			lines.push(
				`- \`${c.url}\`: **${c.key}**, ${c.impressions} impr @ ${c.position}, ${tier}. ${topQueries(c, 2)}`
			);
		}
		lines.push('');
	}

	const orphans = result.orphans.filter((o) => o.impressions >= ORPHAN_FLOOR).slice(0, 10);
	if (orphans.length) {
		lines.push('## Spread thin: no page owns these', '');
		lines.push(
			`Each of these concepts surfaces on 2+ pages in small slices (${ORPHAN_FLOOR}+ impressions summed), and no page asks it up top. If one keeps growing, it wants its own page (or one clear owner) instead of a fix on each.`,
			''
		);
		lines.push('| Cluster | Impr (summed across pages) | Pages |', '| --- | --- | --- |');
		for (const o of orphans) {
			lines.push(
				`| ${cell(o.key)} | ${o.impressions} | ${o.pages.map((u) => `\`${u}\``).join(', ')} |`
			);
		}
		lines.push('');
	}

	lines.push('## How the auditor decides', '');
	lines.push(
		'- **Superlative query:** about types (Enneagram and its misspellings, "personality type", MBTI, "type N", wings) and asking for a pick: most, least, worst, best, rarest, any -est word, "likely to", or "which/what enneagram is/are" + an attribute. "what enneagram is tina fey" is a person lookup and doesn\'t count.',
		'- **Excluded on purpose:** product searches ("best enneagram test", "most accurate enneagram quiz") ask which product, not which type. They count only on a page whose URL contains the product word, such as the test comparison page, where that superlative is the head term. Searches about one named type ("enneagram 3 biggest fear", "best jobs for enneagram 4") ask about that type, not for a pick across types, unless they ask for a match ("most compatible with 4").',
		'- **Counting:** GSC #fragment rows and person-slug case variants are the same SERP entry, so the auditor keeps the largest row per page+query and never sums them. Old URLs that 301 (the enneagram-corner and pop-culture redirect maps) fold into their target the same way.',
		'- **Cluster:** queries with the same concept terms once the Enneagram words and the pick scaffolding are removed. "which enneagram is most likely to be a narcissist" and "most narcissistic enneagram" are both `narcissist`. Synonyms: autistic/autism, depressed/depression, cheat/infidelity, match/pairing/compatible, and a few more. "best" drops out when it modifies another concept, so "best enneagram pairings" = `compatible`.',
		"- **Answered:** every concept term appears in one QuickAnswer question, heading or FAQ question (visible, FAQPage JSON-LD, or a people `faqs` entry) that is itself phrased as a pick (which, most, least, -est, likely). Body prose and the title alone don't count. **Up top** = the QuickAnswer question or an H2. **Below the fold** = only an H3 or the FAQ.",
		'- **People pages** are read from `src/blog/people/drafts/`. The live copy is in Supabase, so a draft fix counts only once it is pushed (`pnpm push:people -- <Person> --sync`).',
		'- **Before/after:** `pnpm audit:superlatives -- --ref HEAD` judges the page text as of a git ref without rewriting this report.',
		''
	);
	return lines.join('\n');
}

function printSummary(result, reportPath) {
	const { missing, buried, frozenBuried, lead, unmapped } = result;
	const row = (c) =>
		`  ${String(c.impressions).padStart(5)} impr  ${String(c.clicks).padStart(3)} clk  pos ${String(c.position).padEnd(4)}  ${c.url}  [${c.key}]`;
	console.log(
		`Superlative queries: ${result.totals.superlativeQueries} rows, ${result.totals.pages} pages, ${result.totals.clusters} clusters (GSC ${result.window?.startDate}..${result.window?.endDate})`
	);
	console.log(`Threshold: ${result.minImpressions}+ impressions per cluster`);
	if (result.ref) console.log(`Page text as of git ref: ${result.ref}`);
	console.log(`\nNOT ANSWERED (${missing.length}):`);
	for (const c of missing) console.log(`${row(c)}\n         ${c.gap}`);
	console.log(`\nASKED ONLY IN AN H3 OR THE FAQ (${buried.length}):`);
	for (const c of buried) console.log(`${row(c)}\n         ${c.gap}`);
	console.log(`\nANSWERED UP TOP (${lead.length}):`);
	for (const c of lead) console.log(`${row(c)}  ${ctr(c)} CTR, via ${c.via}`);
	if (frozenBuried.length) {
		console.log(`\nFROZEN, FAQ IS THE CEILING (${frozenBuried.length}):`);
		for (const c of frozenBuried) console.log(`${row(c)}  via ${c.via}`);
	}
	if (unmapped.length) {
		console.log(`\nNO MARKDOWN SOURCE (${unmapped.length}):`);
		for (const c of unmapped) console.log(row(c));
	}
	if (reportPath) console.log(`\nReport: ${reportPath}`);
}

function toJson(result, reportPath) {
	const slim = (c) => ({
		url: c.url,
		source_file: c.source_file,
		status: c.status,
		cluster: c.key,
		kind: c.kind,
		total_impressions: c.impressions,
		clicks: c.clicks,
		position: c.position,
		queries: c.queries.map((q) => ({
			query: q.query,
			impressions: q.impressions,
			clicks: q.clicks,
			position: q.position
		})),
		answered: c.answered,
		placement: c.placement,
		via: c.via,
		where: c.where,
		title_asks: c.titleAsks,
		frozen: c.frozen,
		gap_reason: c.gap,
		suggestion: c.suggestion,
		via_redirect: c.via_redirect
	});
	return {
		report_path: reportPath,
		runDate: result.runDate,
		window: result.window,
		ref: result.ref,
		minImpressions: result.minImpressions,
		totals: result.totals,
		flagged: [...result.missing, ...result.buried]
			.sort((a, b) => b.impressions - a.impressions)
			.map(slim),
		lead: result.lead.map(slim),
		frozen_buried: result.frozenBuried.map(slim),
		unmapped: result.unmapped.map(slim)
	};
}

const args = parseArgs(process.argv.slice(2));
const result = runAudit(args);
let reportPath = null;
if (args.write) {
	const full = path.join(REPO_ROOT, REPORT_REL);
	let report = renderReport(result);
	// The report lives under docs/, which `pnpm lint` runs prettier --check on.
	try {
		const prettier = await import('prettier');
		const config = (await prettier.resolveConfig(full)) ?? {};
		report = await prettier.format(report, { ...config, filepath: full });
	} catch (error) {
		console.warn(`prettier skipped (${error.message}); run pnpm format before committing`);
	}
	fs.mkdirSync(path.dirname(full), { recursive: true });
	fs.writeFileSync(full, report);
	reportPath = REPORT_REL;
}
if (args.json) console.log(JSON.stringify(toJson(result, reportPath), null, 2));
else printSummary(result, reportPath);
