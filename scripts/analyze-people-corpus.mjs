#!/usr/bin/env node
// scripts/analyze-people-corpus.mjs
//
// Joins the published people corpus against the newest Google Search Console
// drop and reports what to refresh, what to publish, and what to leave alone.
//
// Written 2026-07-25 to make that analysis reproducible. The first pass was a
// pile of inline `node -e` one-liners, which is how two published people
// (Charli D'Amelio, J.K. Rowling) got reported as "never pushed to the
// database": the draft-to-row join matched filenames exactly, so the apostrophe
// and the periods broke it. This script uses the canonical
// normalizePersonalitySlug() from scripts/lib/personalitySeo.js everywhere, so
// that class of bug cannot come back.
//
// What it measures:
//   1. Corpus totals: impressions, clicks, CTR, position bands
//   2. Concentration: how few pages carry most of the demand
//   3. Staleness x traffic: the refresh queue, ranked
//   4. Category yield: median impressions per page by type tag (the finding that
//      matters most, because it says who to write about next)
//   5. The unpublished backlog, bucketed by category yield and image readiness
//   6. Orphan drafts: written but never loaded into the database
//   7. Optional: the title-keyword CTR test (needs DB access, see --with-titles)
//
// Usage:
//   node scripts/analyze-people-corpus.mjs                  # console summary
//   node scripts/analyze-people-corpus.mjs --json           # machine-readable
//   node scripts/analyze-people-corpus.mjs --markdown       # report body to stdout
//   node scripts/analyze-people-corpus.mjs --with-titles    # + SERP-title CTR test
//   node scripts/analyze-people-corpus.mjs --out docs/content-analysis/DATE_people-corpus-triage.json
//
// Read-only. Touches no blog content and writes nothing unless --out is passed.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { normalizePersonalitySlug } from './lib/personalitySeo.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FAMOUS_TYPES = path.join(REPO_ROOT, 'src/lib/components/molecules/famousTypes.ts');
const DRAFTS_DIR = path.join(REPO_ROOT, 'src/blog/people/drafts');
const GSC_DIR = path.join(REPO_ROOT, 'docs/data/gsc');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const asMarkdown = args.includes('--markdown');
const withTitles = args.includes('--with-titles');
const outArg = args.find((a) => a.startsWith('--out'));
const outPath = outArg?.includes('=')
	? outArg.split('=')[1]
	: outArg
		? args[args.indexOf(outArg) + 1]
		: null;

// Category tags with fewer than this many published pages are too thin to trust.
const MIN_TAG_SAMPLE = 5;
// A tag whose median lands at or below this earns effectively nothing.
const DEAD_TAG_MEDIAN = 10;
// A draft whose BEST category signal is still under this is a grade trap: even
// the optimistic read says it will not earn. Set from observed yield, not taste.
const WEAK_PROJECTION = 50;
// Only worth flagging when the draft is good enough that someone would ship it.
const TRAP_MIN_GRADE = 8.0;

// ── helpers ─────────────────────────────────────────────────────────────────

/** RFC4180-ish split: GSC queries legitimately contain commas. */
function splitCsvLine(line) {
	const out = [];
	let cur = '';
	let quoted = false;
	for (let i = 0; i < line.length; i += 1) {
		const ch = line[i];
		if (quoted) {
			if (ch === '"' && line[i + 1] === '"') {
				cur += '"';
				i += 1;
			} else if (ch === '"') quoted = false;
			else cur += ch;
		} else if (ch === '"') quoted = true;
		else if (ch === ',') {
			out.push(cur);
			cur = '';
		} else cur += ch;
	}
	out.push(cur);
	return out;
}

function median(nums) {
	if (!nums.length) return 0;
	const s = [...nums].sort((a, b) => a - b);
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

const pct = (num, den) => (den ? Number(((100 * num) / den).toFixed(3)) : 0);
const slugFromUrl = (url) => {
	const m = url.match(/\/personality-analysis\/([^/?#,]+)\/?$/);
	return m ? normalizePersonalitySlug(m[1]) : null;
};

// ── 1. the corpus ───────────────────────────────────────────────────────────

function readCorpus() {
	const src = fs.readFileSync(FAMOUS_TYPES, 'utf8');
	const people = [];
	let currentType = null;
	for (const line of src.split('\n')) {
		const typeHeader = line.match(/^\t(\d):\s*\[/);
		if (typeHeader) {
			currentType = Number(typeHeader[1]);
			continue;
		}
		const row = line.match(
			/name: '([^']+)', link: (true|false), hasImage: (true|false), lastmod: (null|'[^']*'), personaTitle: (?:null|.*?), contentGrade: (null|[\d.]+), types: \[([^\]]*)\]/
		);
		if (!row) continue;
		people.push({
			slug: normalizePersonalitySlug(row[1]),
			rawName: row[1],
			type: currentType,
			published: row[2] === 'true',
			hasImage: row[3] === 'true',
			lastmod: row[4] === 'null' ? null : row[4].slice(1, -1),
			grade: row[5] === 'null' ? null : Number(row[5]),
			tags: row[6]
				.split(',')
				.map((t) => t.trim().replace(/'/g, ''))
				.filter(Boolean)
		});
	}
	if (!people.length)
		throw new Error(`Parsed 0 people from ${FAMOUS_TYPES}. Did the format change?`);
	return people;
}

// ── 2. the search data ──────────────────────────────────────────────────────

function readGsc() {
	const latest = JSON.parse(fs.readFileSync(path.join(GSC_DIR, 'latest.json'), 'utf8'));
	const read = (file) =>
		fs.readFileSync(path.join(GSC_DIR, file), 'utf8').trim().split('\n').slice(1).map(splitCsvLine);

	// One page can appear as several GSC rows: a mixed-case URL variant
	// (/David-Friedberg), an anchor row (/agatha-christie#how-did-...), or both.
	// They must be SUMMED into the canonical slug, not overwritten, or the page
	// silently reports whichever variant happened to be read last.
	const pages = new Map();
	for (const cols of read(latest.files.pages)) {
		const slug = slugFromUrl(cols[0]);
		if (!slug) continue;
		const clicks = Number(cols[1]);
		const impressions = Number(cols[2]);
		const position = Number(cols[4]);
		const prev = pages.get(slug);
		if (!prev) {
			pages.set(slug, { clicks, impressions, position, urlVariants: 1 });
			continue;
		}
		// Impression-weighted position, so a 3-impression anchor row cannot drag
		// the page's reported rank around.
		const totalImpressions = prev.impressions + impressions;
		prev.position = totalImpressions
			? (prev.position * prev.impressions + position * impressions) / totalImpressions
			: prev.position;
		prev.clicks += clicks;
		prev.impressions = totalImpressions;
		prev.urlVariants += 1;
	}
	for (const row of pages.values()) {
		row.position = Number(row.position.toFixed(1));
		row.ctr = pct(row.clicks, row.impressions);
	}

	const queries = new Map();
	for (const cols of read(latest.files.pageQuery)) {
		const slug = slugFromUrl(cols[0]);
		if (!slug) continue;
		if (!queries.has(slug)) queries.set(slug, []);
		queries.get(slug).push({
			query: cols[1],
			clicks: Number(cols[2]),
			impressions: Number(cols[3]),
			position: Number(cols[5])
		});
	}

	return { latest, pages, queries };
}

// ── 3. optional SERP-title test ─────────────────────────────────────────────
// Hypothesis: pages whose SERP title contains the searched keyword convert
// better. It was tested on 2026-07-25 and REFUTED, so this stays opt-in: it
// needs DB access and exists to let the result be re-checked, not re-assumed.

function titleKeywordTest(joined) {
	let rows;
	try {
		rows = execFileSync(
			path.join(REPO_ROOT, 'scripts/db-query.sh'),
			[
				'SELECT person, coalesce(meta_title, title) AS serp_title FROM blogs_famous_people WHERE published = true'
			],
			{ encoding: 'utf8', cwd: REPO_ROOT }
		);
	} catch (err) {
		return { error: `db-query.sh failed: ${err.message.split('\n')[0]}` };
	}

	const byslug = new Map(joined.map((p) => [p.slug, p]));
	const bucket = {
		withKeyword: { pages: 0, impressions: 0, clicks: 0 },
		withoutKeyword: { pages: 0, impressions: 0, clicks: 0 }
	};
	for (const line of rows.trim().split('\n').slice(1)) {
		const cols = splitCsvLine(line);
		const person = byslug.get(normalizePersonalitySlug(cols[0]));
		if (!person) continue;
		const hit = /personality|enneagram|type \d|mbti/i.test(cols[1] ?? '');
		const b = hit ? bucket.withKeyword : bucket.withoutKeyword;
		b.pages += 1;
		b.impressions += person.impressions;
		b.clicks += person.clicks;
	}
	const ctrOf = (b) => pct(b.clicks, b.impressions);
	return {
		withKeyword: { ...bucket.withKeyword, ctr: ctrOf(bucket.withKeyword) },
		withoutKeyword: { ...bucket.withoutKeyword, ctr: ctrOf(bucket.withoutKeyword) },
		verdict:
			ctrOf(bucket.withKeyword) > ctrOf(bucket.withoutKeyword)
				? 'keyword titles convert BETTER'
				: 'keyword titles convert WORSE (hypothesis refuted)'
	};
}

// ── 4. analysis ─────────────────────────────────────────────────────────────

function analyze({ asOf }) {
	const people = readCorpus();
	const { latest, pages, queries } = readGsc();
	const today = new Date(asOf);

	const joined = people.map((p) => {
		const gsc = pages.get(p.slug) ?? { clicks: 0, impressions: 0, ctr: 0, position: null };
		const ageDays = p.lastmod ? Math.round((today - new Date(p.lastmod)) / 86_400_000) : null;
		return {
			...p,
			...gsc,
			ageDays,
			topQueries: (queries.get(p.slug) ?? [])
				.sort((a, b) => b.impressions - a.impressions)
				.slice(0, 5)
		};
	});

	const published = joined.filter((p) => p.published);
	const unpublished = joined.filter((p) => !p.published);
	const totalImpressions = published.reduce((s, p) => s + p.impressions, 0);
	const totalClicks = published.reduce((s, p) => s + p.clicks, 0);

	// Concentration: what share of demand the top N pages carry.
	const byImpressions = [...published].sort((a, b) => b.impressions - a.impressions);
	const concentration = [12, 25, 50].map((n) => {
		const impressions = byImpressions.slice(0, n).reduce((s, p) => s + p.impressions, 0);
		return {
			topPages: n,
			impressions,
			shareOfImpressions: pct(impressions, totalImpressions),
			shareOfCorpus: pct(n, published.length)
		};
	});

	// Category yield. Median, not mean: one breakout must not carry a tag.
	const byTag = new Map();
	for (const p of published) {
		for (const tag of p.tags) {
			if (!byTag.has(tag)) byTag.set(tag, []);
			byTag.get(tag).push(p);
		}
	}
	const categories = [...byTag.entries()]
		.filter(([, rows]) => rows.length >= MIN_TAG_SAMPLE)
		.map(([tag, rows]) => {
			const imps = rows.map((r) => r.impressions);
			return {
				tag,
				pages: rows.length,
				medianImpressions: median(imps),
				meanImpressions: Math.round(imps.reduce((s, n) => s + n, 0) / rows.length),
				maxImpressions: Math.max(...imps)
			};
		})
		.sort((a, b) => b.medianImpressions - a.medianImpressions);

	const categoryMedian = new Map(categories.map((c) => [c.tag, c.medianImpressions]));
	const deadTags = new Set(
		categories.filter((c) => c.medianImpressions <= DEAD_TAG_MEDIAN).map((c) => c.tag)
	);

	// Refresh queue: demand x staleness. News weighting is a human judgement and
	// deliberately not modelled here; this ranks the candidates to research.
	const refreshQueue = published
		.filter((p) => p.impressions > 0 && p.ageDays !== null)
		.map((p) => ({
			slug: p.slug,
			type: p.type,
			impressions: p.impressions,
			clicks: p.clicks,
			position: p.position,
			ageDays: p.ageDays,
			ctr: pct(p.clicks, p.impressions),
			score: Math.round(p.impressions * Math.min(p.ageDays / 90, 2.5)),
			topQuery: p.topQueries[0]?.query ?? null
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, 30);

	// Publish backlog, bucketed by the category signal and image readiness.
	const backlog = unpublished
		.map((p) => {
			const scores = p.tags.map((t) => categoryMedian.get(t)).filter((n) => n !== undefined);
			const projected = scores.length ? Math.max(...scores) : null;
			const allDead =
				p.tags.length > 0 && p.tags.every((t) => !categoryMedian.has(t) || deadTags.has(t));
			return {
				slug: p.slug,
				type: p.type,
				grade: p.grade,
				hasImage: p.hasImage,
				tags: p.tags,
				projectedImpressions: projected,
				bucket: allDead ? 'dead-category' : projected === null ? 'unknown' : 'viable'
			};
		})
		.sort((a, b) => (b.projectedImpressions ?? -1) - (a.projectedImpressions ?? -1));

	// Highest-graded drafts that sit in categories which earn nothing. These are
	// the ones most likely to get published for the wrong reason.
	const gradeTraps = backlog
		.filter(
			(b) =>
				b.grade !== null &&
				b.grade >= TRAP_MIN_GRADE &&
				b.projectedImpressions !== null &&
				b.projectedImpressions <= WEAK_PROJECTION
		)
		.sort((a, b) => b.grade - a.grade)
		.slice(0, 15);

	// Orphan drafts: on disk, never loaded. Uses the canonical slug normaliser.
	const knownSlugs = new Set(people.map((p) => p.slug));
	const orphanDrafts = fs
		.readdirSync(DRAFTS_DIR)
		.filter((f) => f.endsWith('.md'))
		.map((f) => f.replace(/\.md$/, ''))
		.filter((name) => !knownSlugs.has(normalizePersonalitySlug(name)))
		.filter((name) => !/research|report|essay|updated-sections/i.test(name));

	const result = {
		generatedFor: asOf,
		gscWindow: latest.window,
		gscRunDate: latest.runDate,
		totals: {
			people: people.length,
			published: published.length,
			unpublished: unpublished.length,
			unpublishedWithImage: unpublished.filter((p) => p.hasImage).length,
			impressions: totalImpressions,
			clicks: totalClicks,
			ctr: pct(totalClicks, totalImpressions),
			pagesWithZeroImpressions: published.filter((p) => p.impressions === 0).length,
			medianPositionOfRankingPages: median(
				published.filter((p) => p.position !== null).map((p) => p.position)
			)
		},
		concentration,
		categories,
		refreshQueue,
		backlogTop: backlog.slice(0, 40),
		gradeTraps,
		orphanDrafts
	};

	if (withTitles) result.titleKeywordTest = titleKeywordTest(published);
	return result;
}

// ── 5. output ───────────────────────────────────────────────────────────────

function toMarkdown(r) {
	const L = [];
	L.push(
		`**GSC window:** ${r.gscWindow.startDate} to ${r.gscWindow.endDate} (${r.gscWindow.days} days, pulled ${r.gscRunDate})`
	);
	L.push('');
	L.push(
		`- ${r.totals.published} published analyses, **${r.totals.impressions.toLocaleString()} impressions, ${r.totals.clicks} clicks** (${r.totals.ctr}% CTR)`
	);
	L.push(`- Median position of ranking pages: **${r.totals.medianPositionOfRankingPages}**`);
	L.push(`- ${r.totals.pagesWithZeroImpressions} published pages drew zero impressions`);
	L.push(
		`- ${r.totals.unpublished} unpublished, ${r.totals.unpublishedWithImage} of them with an image already made`
	);
	L.push('');
	L.push('### Concentration');
	L.push('');
	L.push('| Top pages | Impressions | Share of demand | Share of corpus |');
	L.push('| --- | --- | --- | --- |');
	for (const c of r.concentration)
		L.push(
			`| ${c.topPages} | ${c.impressions.toLocaleString()} | ${c.shareOfImpressions}% | ${c.shareOfCorpus}% |`
		);
	L.push('');
	L.push('### Category yield (median impressions per published page)');
	L.push('');
	L.push('| Tag | Pages | Median | Mean | Max |');
	L.push('| --- | --- | --- | --- | --- |');
	for (const c of r.categories)
		L.push(
			`| ${c.tag} | ${c.pages} | **${c.medianImpressions}** | ${c.meanImpressions} | ${c.maxImpressions} |`
		);
	L.push('');
	L.push('### Refresh queue (impressions x staleness, top 15)');
	L.push('');
	L.push('| Slug | Type | Impr | Clicks | CTR | Pos | Age | Top query |');
	L.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
	for (const p of r.refreshQueue.slice(0, 15))
		L.push(
			`| ${p.slug} | ${p.type} | ${p.impressions.toLocaleString()} | ${p.clicks} | ${p.ctr}% | ${p.position ?? '-'} | ${p.ageDays}d | ${p.topQuery ?? '-'} |`
		);
	L.push('');
	if (r.gradeTraps.length) {
		L.push('### Grade traps: strong grade, weak category');
		L.push('');
		L.push('| Slug | Grade | Projected impr | Image | Tags |');
		L.push('| --- | --- | --- | --- | --- |');
		for (const g of r.gradeTraps)
			L.push(
				`| ${g.slug} | ${g.grade} | ${g.projectedImpressions} | ${g.hasImage ? 'yes' : 'no'} | ${g.tags.join(', ')} |`
			);
		L.push('');
	}
	if (r.orphanDrafts.length) {
		L.push('### Orphan drafts (written, never loaded into the database)');
		L.push('');
		L.push(r.orphanDrafts.join(', '));
		L.push('');
	}
	if (r.titleKeywordTest && !r.titleKeywordTest.error) {
		const t = r.titleKeywordTest;
		L.push('### SERP-title keyword test');
		L.push('');
		L.push(
			`- Title contains personality/enneagram/type/mbti: ${t.withKeyword.pages} pages, **${t.withKeyword.ctr}% CTR**`
		);
		L.push(`- Title does not: ${t.withoutKeyword.pages} pages, **${t.withoutKeyword.ctr}% CTR**`);
		L.push(`- Verdict: **${t.verdict}**`);
		L.push('');
	}
	return L.join('\n');
}

const asOf = new Date().toISOString().slice(0, 10);
const report = analyze({ asOf });

if (outPath) {
	fs.writeFileSync(path.resolve(REPO_ROOT, outPath), `${JSON.stringify(report, null, '\t')}\n`);
	console.log(`wrote ${outPath}`);
} else if (asJson) {
	console.log(JSON.stringify(report, null, '\t'));
} else if (asMarkdown) {
	console.log(toMarkdown(report));
} else {
	console.log(toMarkdown(report));
}
