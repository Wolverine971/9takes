#!/usr/bin/env node
// scripts/audit-core-update.mjs

/**
 * Which pages survived a Google core update, and what do the survivors have in
 * common? Pulls each page's Search Console numbers for a window before and
 * after the update, joins them to what we already measure about the page
 * (generic-sentence share, paragraph shape, pipeline version, age, edit
 * recency, quality grade, internal links, the kind of searches it ranked for),
 * and ranks which traits go with keeping impressions.
 *
 * Read-only against Google, Supabase and the repo. Writes two files:
 *   docs/data/gsc/core-update/<label>.json   the joined dataset (feeds the explainer page)
 *   docs/data/gsc/core-update/<label>.md     the ranked findings
 *
 * Usage:
 *   pnpm audit:core-update                    # Nov 2026 update, default windows
 *   pnpm audit:core-update -- --before 2026-11-03:2026-11-09 --after 2026-11-25:2026-12-01
 *       # the post-rollout comparison Google recommends (week before vs week after)
 *   pnpm audit:core-update -- --cached        # reuse the last Google pull (no API calls)
 *   pnpm audit:core-update -- --min 5         # include pages with 5+ impressions/day before
 *
 * Correlation is not cause: a trait that goes with survival is a lead to test,
 * not a ruling. Trending people also lose search demand on their own; the
 * "momentum" feature is there so that decay is visible rather than hidden.
 */

import { google } from 'googleapis';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPO_ROOT, buildLinkGraph, loadBlogCorpus, loadPeople } from './lib/blogLinkGraph.js';

const SITE = 'sc-domain:9takes.com';
const ORIGIN = 'https://9takes.com';
const SERVICE_ACCOUNT_EMAIL =
	'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com';
const OUT_DIR = path.join(REPO_ROOT, 'docs/data/gsc/core-update');
const CACHE_DIR = path.join(REPO_ROOT, 'node_modules/.cache/core-update');

const args = process.argv.slice(2);
const option = (name, fallback) => {
	const i = args.indexOf(name);
	return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(name);
const span = (value) => {
	const [startDate, endDate] = value.split(':');
	return { startDate, endDate, days: dayDiff(startDate, endDate) + 1 };
};
function dayDiff(a, b) {
	return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

const UPDATE_START = option('--update-start', '2026-11-10');
const UPDATE_NAME = option('--update-name', 'November 2026 core update');
const BEFORE = span(option('--before', '2026-11-03:2026-11-12'));
const AFTER = span(option('--after', '2026-11-14:2026-11-20'));
const EARLY = span(option('--early', '2026-10-17:2026-10-31'));
const DAILY = span(option('--daily', '2026-10-01:' + new Date().toISOString().slice(0, 10)));
const MIN_PER_DAY = Number(option('--min', 10));
const LABEL = option('--label', `${BEFORE.startDate}_vs_${AFTER.startDate}`);

// ---------------------------------------------------------------- Google pull

function unwrapKey(raw) {
	let v = raw.trim();
	if (v.startsWith('"') && v.endsWith('"') && !v.startsWith('"{')) v = v.slice(1, -1);
	if (v.startsWith('"{') && v.endsWith('}"')) v = v.slice(1, -1);
	if (v.startsWith('{')) return JSON.parse(v).privateKey;
	return v.replace(/\\n/g, '\n');
}

function loadPrivateKey() {
	if (process.env.PRIVATE_gmail_private_key)
		return unwrapKey(process.env.PRIVATE_gmail_private_key);
	for (const f of ['.env.local', '.env']) {
		try {
			const m = fs
				.readFileSync(path.join(REPO_ROOT, f), 'utf8')
				.match(/^PRIVATE_gmail_private_key=(.*)$/m);
			if (m) return unwrapKey(m[1]);
		} catch {
			/* try next */
		}
	}
	throw new Error('PRIVATE_gmail_private_key not found in env, .env.local, or .env');
}

async function pullGsc() {
	const cacheFile = path.join(CACHE_DIR, `${LABEL}.json`);
	if (flag('--cached') && fs.existsSync(cacheFile)) {
		console.log(`Using cached Google pull: ${path.relative(REPO_ROOT, cacheFile)}`);
		return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
	}
	const auth = new google.auth.JWT({
		email: SERVICE_ACCOUNT_EMAIL,
		key: loadPrivateKey(),
		scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
	});
	const sc = google.searchconsole({ version: 'v1', auth });
	const query = async ({ startDate, endDate }, dimensions, extra = {}) => {
		const rows = [];
		for (;;) {
			const { data } = await sc.searchanalytics.query({
				siteUrl: SITE,
				requestBody: {
					startDate,
					endDate,
					dimensions,
					rowLimit: 25000,
					startRow: rows.length,
					dataState: 'all',
					...extra
				}
			});
			const batch = data.rows ?? [];
			rows.push(...batch);
			if (batch.length < 25000) break;
		}
		return rows;
	};
	console.log('Pulling Search Console data…');
	const raw = {
		daily: await query(DAILY, ['date']),
		pagesBefore: await query(BEFORE, ['page']),
		pagesAfter: await query(AFTER, ['page']),
		pagesEarly: await query(EARLY, ['page']),
		pqBefore: await query(BEFORE, ['page', 'query']),
		pqAfter: await query(AFTER, ['page', 'query']),
		pageDaily: await query({ startDate: EARLY.startDate, endDate: DAILY.endDate }, ['date', 'page'])
	};
	fs.mkdirSync(CACHE_DIR, { recursive: true });
	fs.writeFileSync(cacheFile, JSON.stringify(raw));
	return raw;
}

// ---------------------------------------------------------------- local data

function dbJson(sql) {
	const out = execFileSync(
		path.join(REPO_ROOT, 'scripts/db-query.sh'),
		[`select coalesce(json_agg(t), '[]'::json) from (${sql}) t`],
		{ encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
	);
	const body = out.split('\n').slice(1).join('\n').trim();
	const unquoted = body.startsWith('"') ? body.slice(1, -1).replace(/""/g, '"') : body;
	return JSON.parse(unquoted);
}

// Written through a file: audit-blog-readability.mjs calls process.exit() right
// after printing, which truncates a piped stdout at 128 KB but not a file.
function auditJson(script) {
	fs.mkdirSync(CACHE_DIR, { recursive: true });
	const file = path.join(CACHE_DIR, `${script}.json`);
	const fd = fs.openSync(file, 'w');
	try {
		execFileSync('node', [path.join(REPO_ROOT, 'scripts', script), '--json', '--top', '100000'], {
			cwd: REPO_ROOT,
			stdio: ['ignore', fd, 'inherit']
		});
	} finally {
		fs.closeSync(fd);
	}
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function frontmatterField(file, field) {
	try {
		const head = fs.readFileSync(path.join(REPO_ROOT, file), 'utf8').slice(0, 4000);
		return head.match(new RegExp(`^${field}:\\s*['"]?([^'"\\n]+)`, 'm'))?.[1]?.trim() ?? null;
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------- query intent

// Searches that ask about personality, typing or psychology. Everything else
// on a person page is a bio lookup (age, wife, net worth, "who is"); on a blog
// it is a topic search that happens to land on us (e.g. "7 love languages").
const PERSONALITY_TERMS =
	/enneagram|personality|mbti|myers|briggs|16 ?personalit|\b(i|e)(n|s)(t|f)(j|p)\b|\btype\s*\d|\b\d\s*w\s*\d|\btypes?\b|tritype|instinct|subtype|\bwing|zodiac|astrolog|horoscope|\bsign\b|traits?\b|psycholog|narciss|attachment|introvert|extrovert|temperament|archetype|big five|\bocean\b|neurotic|psychopath|sociopath|\badhd\b|autis|mental (health|illness)|disorder|\bocd\b|bipolar|depress|anxi/i;

function queryClass(query, kind) {
	if (PERSONALITY_TERMS.test(query)) return 'personality';
	return kind === 'person' ? 'person-bio' : 'topic-other';
}

// ---------------------------------------------------------------- stats

const median = (xs) => {
	const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
	if (!s.length) return null;
	const m = Math.floor(s.length / 2);
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function ranks(xs) {
	const idx = xs.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
	const r = new Array(xs.length);
	for (let i = 0; i < idx.length;) {
		let j = i;
		while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
		for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
		i = j + 1;
	}
	return r;
}

function pearson(a, b) {
	const n = a.length;
	const ma = a.reduce((s, x) => s + x, 0) / n;
	const mb = b.reduce((s, x) => s + x, 0) / n;
	let num = 0,
		da = 0,
		db = 0;
	for (let i = 0; i < n; i++) {
		num += (a[i] - ma) * (b[i] - mb);
		da += (a[i] - ma) ** 2;
		db += (b[i] - mb) ** 2;
	}
	return da && db ? num / Math.sqrt(da * db) : 0;
}

const spearman = (a, b) => pearson(ranks(a), ranks(b));

// Permutation p-value for Spearman: how often shuffled data correlates this strongly.
function permutationP(a, b, rho, iterations = 2000) {
	const ra = ranks(a);
	const rb = ranks(b);
	let seed = 42;
	const rand = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
	let hits = 0;
	const shuffled = [...rb];
	for (let it = 0; it < iterations; it++) {
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		if (Math.abs(pearson(ra, shuffled)) >= Math.abs(rho)) hits++;
	}
	return (hits + 1) / (iterations + 1);
}

// Ordinary least squares on standardized predictors (Gaussian elimination).
function ols(rows, features, target) {
	const usable = rows.filter((r) => features.every((f) => Number.isFinite(r[f])));
	const n = usable.length;
	if (n < features.length + 10) return null;
	const stats = features.map((f) => {
		const xs = usable.map((r) => r[f]);
		const mean = xs.reduce((s, x) => s + x, 0) / n;
		const sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / n) || 1;
		return { mean, sd };
	});
	const X = usable.map((r) => [1, ...features.map((f, j) => (r[f] - stats[j].mean) / stats[j].sd)]);
	const y = usable.map((r) => r[target]);
	const k = features.length + 1;
	const A = Array.from({ length: k }, (_, i) =>
		Array.from({ length: k + 1 }, (_, j) =>
			j < k
				? X.reduce((s, row) => s + row[i] * row[j], 0)
				: X.reduce((s, row, t) => s + row[i] * y[t], 0)
		)
	);
	for (let i = 0; i < k; i++) A[i][i] += i ? 1e-6 : 0;
	for (let c = 0; c < k; c++) {
		let p = c;
		for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
		[A[c], A[p]] = [A[p], A[c]];
		for (let r = 0; r < k; r++) {
			if (r === c || !A[c][c]) continue;
			const f = A[r][c] / A[c][c];
			for (let j = c; j <= k; j++) A[r][j] -= f * A[c][j];
		}
	}
	const beta = A.map((row, i) => row[k] / row[i]);
	const yMean = y.reduce((s, v) => s + v, 0) / n;
	const fitted = X.map((row) => row.reduce((s, x, j) => s + x * beta[j], 0));
	const ssRes = y.reduce((s, v, i) => s + (v - fitted[i]) ** 2, 0);
	const ssTot = y.reduce((s, v) => s + (v - yMean) ** 2, 0);
	return {
		n,
		r2: 1 - ssRes / ssTot,
		coefficients: features.map((f, j) => ({ feature: f, beta: beta[j + 1] }))
	};
}

// ---------------------------------------------------------------- features

const FEATURES = [
	// [key, label, what higher means, group]
	[
		'personalityShare',
		'Share of searches about personality',
		'more personality-intent searches',
		'search'
	],
	[
		'bioShare',
		'Share of searches that are bio lookups',
		'more "age / wife / who is" searches',
		'search'
	],
	[
		'topQueryShare',
		'Traffic concentrated in one search',
		'more reliant on a single query',
		'search'
	],
	['queryCount', 'Distinct searches it showed for', 'more distinct searches', 'search'],
	['prePosition', 'Average position before', 'ranked lower on the page', 'search'],
	['momentum', 'Search momentum before the update', 'impressions were already rising', 'search'],
	[
		'serpTitlePersonality',
		'Search title mentions personality/type',
		'title names the typology',
		'page'
	],
	['words', 'Word count', 'longer', 'content'],
	['genericPct', 'Generic sentences (%)', 'more could-sit-anywhere sentences', 'content'],
	['quotesPer1k', 'Sentences with quotes /1k words', 'more quoted material', 'content'],
	['numbersPer1k', 'Sentences with numbers or dates /1k words', 'more specifics', 'content'],
	['namesPer1k', 'Sentences naming someone /1k words', 'more named people', 'content'],
	['firstPersonPer1k', 'First-person sentences /1k words', 'more first person', 'content'],
	['medianParagraph', 'Median paragraph length', 'longer paragraphs', 'content'],
	['longParagraphPct', 'Long paragraphs (%)', 'more wall-of-text paragraphs', 'content'],
	['emDashesPer1k', 'Em dashes /1k words', 'more em dashes', 'content'],
	['stockPhrases', 'Stock phrases', 'more stock phrasing', 'content'],
	['pipelineVersion', 'People pipeline version', 'newer pipeline', 'content'],
	['qualityOverall', 'Internal quality grade', 'higher graded', 'content'],
	['faqs', 'FAQ count', 'more FAQs', 'content'],
	['citations', 'Citations', 'more citations', 'content'],
	['preCtr', 'Click-through rate before', 'searchers picked it more often', 'satisfaction'],
	[
		'googleEngagedSec',
		'Median engaged seconds (Google visitors)',
		'Google visitors stayed longer',
		'satisfaction'
	],
	[
		'googleQuickExitPct',
		'Quick exits under 10s (Google visitors)',
		'more Google visitors left fast',
		'satisfaction'
	],
	[
		'googleScrollPct',
		'Average scroll depth (Google visitors)',
		'Google visitors scrolled further',
		'satisfaction'
	],
	['inLinks', 'Internal links pointing in', 'better linked', 'site'],
	['outLinks', 'Internal links pointing out', 'links out more', 'site'],
	['ageDays', 'Days since first published', 'older page', 'freshness'],
	['daysSinceEdit', 'Days since last edit (at update start)', 'edited longer ago', 'freshness'],
	['editedLast30', 'Edited in the 30 days before the update', 'recently edited', 'freshness']
];

const pathOf = (url) =>
	url
		.replace(/^https?:\/\/[^/]+/, '')
		.split('#')[0]
		.replace(/\/$/, '') || '/';
const perDay = (rows, days) => {
	const m = new Map();
	for (const r of rows) {
		const p = pathOf(r.keys[r.keys.length === 2 ? 1 : 0]);
		const cur = m.get(p) ?? { clicks: 0, impressions: 0, posImpr: 0 };
		cur.clicks += r.clicks;
		cur.impressions += r.impressions;
		cur.posImpr += r.position * r.impressions;
		m.set(p, cur);
	}
	for (const v of m.values()) {
		v.position = v.impressions ? v.posImpr / v.impressions : null;
		v.clicks /= days;
		v.impressions /= days;
		delete v.posImpr;
	}
	return m;
};
const round = (x, d = 2) => (Number.isFinite(x) ? Math.round(x * 10 ** d) / 10 ** d : null);

function kindOf(url) {
	if (url === '/') return 'home';
	if (/^\/personality-analysis\/type\//.test(url)) return 'type-page';
	if (/^\/personality-analysis\/[^/]+$/.test(url)) return 'person';
	if (/^\/(enneagram-corner|pop-culture|community|how-to-guides)\/.+/.test(url)) return 'blog';
	return 'other';
}

async function main() {
	const raw = await pullGsc();

	console.log('Loading local audits (generic, readability, link graph) and people rows…');
	const generic = auditJson('audit-blog-generic.mjs');
	const readability = auditJson('audit-blog-readability.mjs');
	const readByFile = new Map(readability.map((r) => [r.file, r.metrics]));
	const posts = loadBlogCorpus();
	const people = loadPeople();
	const graph = buildLinkGraph({ posts, people });
	const peopleRows = dbJson(`select person, title, meta_title, enneagram, type,
		(content_quality->>'overall')::numeric quality_overall,
		coalesce(first_published_at, published_at, created_at) first_published,
		lastmod, length(content) content_len,
		jsonb_array_length(coalesce(faqs,'[]'::jsonb)) faqs,
		coalesce(array_length(citations,1),0) citations
		from blogs_famous_people where published`);
	const personBySlug = new Map(peopleRows.map((p) => [p.person, p]));
	// How Google visitors behaved on each page in the 100 days before the update:
	// the closest thing we have to the satisfaction signal a core update reads.
	const engagementStart = new Date(Date.parse(UPDATE_START) - 100 * 86400000)
		.toISOString()
		.slice(0, 10);
	const engagementRows = dbJson(`select path, count(*) visits,
		percentile_cont(0.5) within group (order by engaged_ms) median_ms,
		avg((engaged_ms < 10000)::int) quick_exit,
		avg(max_scroll_pct) scroll
		from page_analytics_visits
		where referrer_host ilike '%google.%' and started_at >= '${engagementStart}' and started_at < '${UPDATE_START}'
		group by path having count(*) >= 5`);
	const engagementByPath = new Map(
		engagementRows.map((r) => [r.path.replace(/\/$/, '') || '/', r])
	);

	const contentByUrl = new Map();
	for (const g of generic) {
		if (!g.url) continue;
		const per1k = (n) => (g.words ? (n / g.words) * 1000 : null);
		const m = readByFile.get(g.file) ?? {};
		contentByUrl.set(g.url, {
			file: g.file,
			title: g.title,
			words: g.words,
			genericPct: g.genericPct,
			quotesPer1k: per1k(g.specifics?.quote ?? 0),
			numbersPer1k: per1k(g.specifics?.number ?? 0),
			namesPer1k: per1k(g.specifics?.name ?? 0),
			firstPersonPer1k: per1k(g.specifics?.['first-person'] ?? 0),
			medianParagraph: m.medianParagraph ?? null,
			longParagraphPct: m.longPct ?? null,
			emDashesPer1k: m.emDashes != null && g.words ? (m.emDashes / g.words) * 1000 : null,
			stockPhrases: m.stockPhrases ?? null,
			pipelineVersion: m.pipelineVersion ?? null
		});
	}

	const before = perDay(raw.pagesBefore, BEFORE.days);
	const after = perDay(raw.pagesAfter, AFTER.days);
	const early = perDay(raw.pagesEarly, EARLY.days);

	// Query mix per page, and site-wide retention by query class.
	const mixBefore = new Map();
	const classTotals = {};
	const addClass = (cls, field, impr, clicks) => {
		classTotals[cls] ??= {
			beforeImpr: 0,
			afterImpr: 0,
			beforeClicks: 0,
			afterClicks: 0,
			beforeQueries: 0,
			afterQueries: 0
		};
		classTotals[cls][`${field}Impr`] += impr;
		classTotals[cls][`${field}Clicks`] += clicks;
		classTotals[cls][`${field}Queries`] += 1;
	};
	for (const [rows, field, days] of [
		[raw.pqBefore, 'before', BEFORE.days],
		[raw.pqAfter, 'after', AFTER.days]
	]) {
		for (const r of rows) {
			const url = pathOf(r.keys[0]);
			const cls = queryClass(r.keys[1], kindOf(url));
			addClass(cls, field, r.impressions / days, r.clicks / days);
			if (field !== 'before') continue;
			const m = mixBefore.get(url) ?? { total: 0, personality: 0, bio: 0, top: 0, queries: 0 };
			m.total += r.impressions;
			m.queries += 1;
			m.top = Math.max(m.top, r.impressions);
			if (cls === 'personality') m.personality += r.impressions;
			if (cls === 'person-bio') m.bio += r.impressions;
			mixBefore.set(url, m);
		}
	}
	// Top queries per class, for the report.
	const queryAgg = new Map();
	for (const [rows, field, days] of [
		[raw.pqBefore, 'before', BEFORE.days],
		[raw.pqAfter, 'after', AFTER.days]
	]) {
		for (const r of rows) {
			const url = pathOf(r.keys[0]);
			const key = r.keys[1];
			const q = queryAgg.get(key) ?? {
				query: key,
				cls: queryClass(key, kindOf(url)),
				page: url,
				before: 0,
				after: 0,
				posBefore: null,
				posAfter: null
			};
			q[field] += r.impressions / days;
			if (field === 'before') q.posBefore = r.position;
			else q.posAfter = r.position;
			queryAgg.set(key, q);
		}
	}

	const updateStart = Date.parse(UPDATE_START);
	const pages = [];
	for (const [url, b] of before) {
		if (b.impressions < MIN_PER_DAY) continue;
		const a = after.get(url) ?? { clicks: 0, impressions: 0, position: null };
		const kind = kindOf(url);
		const c = contentByUrl.get(url) ?? {};
		const node = graph.get(url);
		const slug = url.split('/').pop();
		const person = kind === 'person' ? personBySlug.get(slug) : null;
		const mix = mixBefore.get(url);
		const e = early.get(url);
		const serpTitle = person
			? (person.meta_title ?? person.title)
			: c.file
				? (frontmatterField(c.file, 'meta_title') ?? c.title)
				: null;
		const firstPublished =
			person?.first_published ?? (c.file ? frontmatterField(c.file, 'date') : null);
		const lastmod = person?.lastmod ?? (c.file ? frontmatterField(c.file, 'lastmod') : null);
		const days = (d) =>
			d && Number.isFinite(Date.parse(d)) ? (updateStart - Date.parse(d)) / 86400000 : null;
		const sinceEdit = days(lastmod);
		const eng = engagementByPath.get(url);
		pages.push({
			url,
			kind,
			section: url.split('/')[1] || 'home',
			title: serpTitle ?? c.title ?? slug,
			enneagram: person?.enneagram ?? null,
			field: Array.isArray(person?.type) ? (person.type[0] ?? null) : null,
			preImpr: round(b.impressions, 1),
			postImpr: round(a.impressions, 1),
			preClicks: round(b.clicks, 2),
			postClicks: round(a.clicks, 2),
			prePosition: round(b.position, 1),
			preCtr: b.impressions ? round(b.clicks / b.impressions, 4) : null,
			googleVisits: eng ? eng.visits : 0,
			googleEngagedSec: eng ? round(eng.median_ms / 1000, 1) : null,
			googleQuickExitPct: eng ? round(eng.quick_exit * 100, 1) : null,
			googleScrollPct: eng ? round(eng.scroll, 1) : null,
			postPosition: round(a.position, 1),
			retained: round(a.impressions / b.impressions, 3),
			logRetained: round(Math.log2((a.impressions + 0.5) / (b.impressions + 0.5)), 3),
			personalityShare: mix ? round(mix.personality / mix.total, 3) : null,
			bioShare: mix && kind === 'person' ? round(mix.bio / mix.total, 3) : null,
			topQueryShare: mix ? round(mix.top / mix.total, 3) : null,
			queryCount: mix?.queries ?? 0,
			momentum: e ? round(Math.log2((b.impressions + 0.5) / (e.impressions + 0.5)), 3) : null,
			serpTitlePersonality: serpTitle
				? /enneagram|personality|type|mbti/i.test(serpTitle)
					? 1
					: 0
				: null,
			words: c.words ?? (person ? Math.round(person.content_len / 6) : null),
			genericPct: c.genericPct ?? null,
			quotesPer1k: round(c.quotesPer1k, 2),
			numbersPer1k: round(c.numbersPer1k, 2),
			namesPer1k: round(c.namesPer1k, 2),
			firstPersonPer1k: round(c.firstPersonPer1k, 2),
			medianParagraph: c.medianParagraph ?? null,
			longParagraphPct: c.longParagraphPct ?? null,
			emDashesPer1k: round(c.emDashesPer1k, 2),
			stockPhrases: c.stockPhrases ?? null,
			pipelineVersion: kind === 'person' ? (c.pipelineVersion ?? null) : null,
			qualityOverall: person?.quality_overall != null ? Number(person.quality_overall) : null,
			faqs: person ? person.faqs : null,
			citations: person ? person.citations : null,
			inLinks: node?.inCount ?? null,
			outLinks: node?.outCount ?? null,
			ageDays: round(days(firstPublished), 0),
			daysSinceEdit: round(sinceEdit, 0),
			editedLast30: sinceEdit == null ? null : sinceEdit >= 0 && sinceEdit <= 30 ? 1 : 0,
			lastmod,
			firstPublished: firstPublished ? String(firstPublished).slice(0, 10) : null
		});
	}

	// Feature ranking.
	const featureStats = [];
	for (const [key, label, higher, group] of FEATURES) {
		const rows = pages.filter((p) => Number.isFinite(p[key]));
		if (rows.length < 20) continue;
		const xs = rows.map((p) => p[key]);
		const ys = rows.map((p) => p.logRetained);
		if (new Set(xs).size < 2) continue;
		const rho = spearman(xs, ys);
		const sorted = [...rows].sort((a, b) => a[key] - b[key]);
		const third = Math.floor(sorted.length / 3);
		const low = sorted.slice(0, third);
		const high = sorted.slice(sorted.length - third);
		featureStats.push({
			key,
			label,
			higher,
			group,
			n: rows.length,
			rho: round(rho, 3),
			p: round(permutationP(xs, ys, rho), 4),
			lowThird: {
				range: [low[0][key], low.at(-1)[key]],
				medianRetained: round(median(low.map((p) => p.retained)), 3)
			},
			highThird: {
				range: [high[0][key], high.at(-1)[key]],
				medianRetained: round(median(high.map((p) => p.retained)), 3)
			}
		});
	}
	featureStats.sort((a, b) => Math.abs(b.rho) - Math.abs(a.rho));

	const groupBy = (key) => {
		const m = new Map();
		for (const p of pages) {
			const k = p[key] ?? '(none)';
			const g = m.get(k) ?? { value: k, n: 0, pre: 0, post: 0, retained: [] };
			g.n++;
			g.pre += p.preImpr;
			g.post += p.postImpr;
			g.retained.push(p.retained);
			m.set(k, g);
		}
		return [...m.values()]
			.map((g) => ({
				value: g.value,
				n: g.n,
				medianRetained: round(median(g.retained), 3),
				weightedRetained: round(g.post / g.pre, 3)
			}))
			.sort((a, b) => b.n - a.n);
	};

	const personPages = pages.filter((p) => p.kind === 'person');
	const modelFeatures = [
		'personalityShare',
		'momentum',
		'prePosition',
		'preCtr',
		'genericPct',
		'words',
		'inLinks',
		'ageDays',
		'editedLast30',
		'serpTitlePersonality'
	];
	const regression = {
		all: ols(pages, modelFeatures, 'logRetained'),
		people: ols(
			personPages,
			[...modelFeatures, 'qualityOverall', 'citations', 'namesPer1k'],
			'logRetained'
		)
	};

	const sum = (rows) =>
		rows.reduce(
			(s, r) => ({ clicks: s.clicks + r.clicks, impressions: s.impressions + r.impressions }),
			{ clicks: 0, impressions: 0 }
		);
	const siteBefore = sum(
		raw.daily.filter((r) => r.keys[0] >= BEFORE.startDate && r.keys[0] <= BEFORE.endDate)
	);
	const siteAfter = sum(
		raw.daily.filter((r) => r.keys[0] >= AFTER.startDate && r.keys[0] <= AFTER.endDate)
	);

	const pageDaily = {};
	const keep = new Set(pages.map((p) => p.url));
	for (const r of raw.pageDaily) {
		const url = pathOf(r.keys[1]);
		if (!keep.has(url)) continue;
		(pageDaily[url] ??= {})[r.keys[0]] = ((pageDaily[url] ??= {})[r.keys[0]] ?? 0) + r.impressions;
	}

	const queries = [...queryAgg.values()]
		.filter((q) => q.before >= 2)
		.map((q) => ({
			...q,
			before: round(q.before, 1),
			after: round(q.after, 1),
			posBefore: round(q.posBefore, 1),
			posAfter: round(q.posAfter, 1)
		}))
		.sort((a, b) => b.before - a.before)
		.slice(0, 400);

	const dataset = {
		generatedAt: new Date().toISOString(),
		update: { name: UPDATE_NAME, start: UPDATE_START },
		windows: { before: BEFORE, after: AFTER, early: EARLY },
		minPerDay: MIN_PER_DAY,
		site: {
			before: {
				clicks: round(siteBefore.clicks / BEFORE.days, 1),
				impressions: round(siteBefore.impressions / BEFORE.days, 0)
			},
			after: {
				clicks: round(siteAfter.clicks / AFTER.days, 1),
				impressions: round(siteAfter.impressions / AFTER.days, 0)
			}
		},
		daily: raw.daily.map((r) => ({
			date: r.keys[0],
			clicks: r.clicks,
			impressions: r.impressions,
			position: round(r.position, 1)
		})),
		queryClasses: Object.entries(classTotals).map(([cls, t]) => ({
			cls,
			beforeImpr: round(t.beforeImpr, 0),
			afterImpr: round(t.afterImpr, 0),
			retained: round(t.afterImpr / t.beforeImpr, 3),
			ctrBefore: round(t.beforeClicks / t.beforeImpr, 4),
			beforeQueries: t.beforeQueries,
			afterQueries: t.afterQueries
		})),
		groups: {
			kind: groupBy('kind'),
			section: groupBy('section'),
			field: groupBy('field'),
			enneagram: groupBy('enneagram'),
			pipelineVersion: groupBy('pipelineVersion')
		},
		features: featureStats,
		regression,
		pages: pages.sort((a, b) => b.preImpr - a.preImpr),
		pageDaily,
		queries
	};

	fs.mkdirSync(OUT_DIR, { recursive: true });
	const jsonFile = path.join(OUT_DIR, `${LABEL}.json`);
	fs.writeFileSync(jsonFile, JSON.stringify(dataset));
	const mdFile = path.join(OUT_DIR, `${LABEL}.md`);
	fs.writeFileSync(mdFile, report(dataset));
	console.log(
		`\nWrote ${path.relative(REPO_ROOT, jsonFile)} and ${path.relative(REPO_ROOT, mdFile)}`
	);
	console.log(report(dataset).split('\n').slice(0, 60).join('\n'));
}

function pct(x) {
	return x == null ? '–' : `${Math.round(x * 100)}%`;
}

function report(d) {
	const L = [];
	const { before, after } = d.windows;
	L.push(
		`<!-- docs/data/gsc/core-update/${LABEL}.md (generated by pnpm audit:core-update) -->`,
		''
	);
	L.push(`# ${d.update.name}: who survived`, '');
	L.push(
		`Before: ${before.startDate} to ${before.endDate}. After: ${after.startDate} to ${after.endDate}. Update started ${d.update.start}.`
	);
	L.push(
		`Site: ${d.site.before.impressions} → ${d.site.after.impressions} impressions/day (${pct(d.site.after.impressions / d.site.before.impressions)} kept), ${d.site.before.clicks} → ${d.site.after.clicks} clicks/day.`
	);
	L.push(
		`Pages analyzed: ${d.pages.length} (${d.minPerDay}+ impressions/day before). Median page kept ${pct(median(d.pages.map((p) => p.retained)))}.`,
		''
	);
	L.push(
		'## By search intent (site-wide, page+query rows)',
		'',
		'| Intent | Impr/day before | After | Kept | CTR before |',
		'| --- | --- | --- | --- | --- |'
	);
	for (const c of d.queryClasses)
		L.push(
			`| ${c.cls} | ${c.beforeImpr} | ${c.afterImpr} | ${pct(c.retained)} | ${round(c.ctrBefore * 100, 2)}% |`
		);
	L.push('', '## Traits ranked by how strongly they track survival', '');
	L.push(
		'Spearman correlation with log retention. p = permutation test. Positive = more of the trait, more impressions kept.',
		''
	);
	L.push(
		'| Trait | ρ | p | n | Bottom third kept | Top third kept |',
		'| --- | --- | --- | --- | --- | --- |'
	);
	for (const f of d.features)
		L.push(
			`| ${f.label} | ${f.rho} | ${f.p} | ${f.n} | ${pct(f.lowThird.medianRetained)} | ${pct(f.highThird.medianRetained)} |`
		);
	for (const [name, g] of Object.entries(d.groups)) {
		L.push(
			'',
			`## By ${name}`,
			'',
			'| Value | Pages | Median kept | Weighted kept |',
			'| --- | --- | --- | --- |'
		);
		for (const row of g)
			L.push(
				`| ${row.value} | ${row.n} | ${pct(row.medianRetained)} | ${pct(row.weightedRetained)} |`
			);
	}
	for (const [name, r] of Object.entries(d.regression)) {
		if (!r) continue;
		L.push(
			'',
			`## Combined model: ${name} (n=${r.n}, R²=${round(r.r2, 3)})`,
			'',
			'Standardized coefficients on log2 retention (1.0 = doubling per standard deviation).',
			''
		);
		for (const c of [...r.coefficients].sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta)))
			L.push(`- ${c.feature}: ${round(c.beta, 3)}`);
	}
	const sorted = [...d.pages].sort((a, b) => b.retained - a.retained);
	const line = (p) =>
		`| ${p.url} | ${p.preImpr} → ${p.postImpr} | ${pct(p.retained)} | ${pct(p.personalityShare)} | ${p.genericPct ?? '–'} |`;
	L.push(
		'',
		'## Survivors',
		'',
		'| Page | Impr/day | Kept | Personality searches | Generic % |',
		'| --- | --- | --- | --- | --- |',
		...sorted.slice(0, 25).map(line)
	);
	L.push(
		'',
		'## Hit hardest',
		'',
		'| Page | Impr/day | Kept | Personality searches | Generic % |',
		'| --- | --- | --- | --- | --- |',
		...sorted.slice(-25).reverse().map(line)
	);
	return L.join('\n') + '\n';
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
