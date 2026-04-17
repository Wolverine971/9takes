// scripts/generate-corpus-stats.js
//
// Generates the 9takes Corpus Stats data file from Supabase.
// Writes src/lib/data/corpus-stats.json (machine-readable, imported at
// build time by the homepage panel + /corpus-stats page) and
// docs/data/corpus-stats.md (human-readable, for DJ + blog commands).
//
// Run: pnpm gen:corpus-stats
// Refresh cadence: every Vercel deploy (wired into build:vercel).

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_OUT_DIR = path.join(__dirname, '..', 'src', 'lib', 'data');
const JSON_OUT = path.join(JSON_OUT_DIR, 'corpus-stats.json');
const MD_OUT_DIR = path.join(__dirname, '..', 'docs', 'data');
const MD_OUT = path.join(MD_OUT_DIR, 'corpus-stats.md');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function warnAndSkip(reason) {
	console.warn(`⚠️  ${reason}`);
	if (fs.existsSync(JSON_OUT)) {
		console.warn(`   Keeping previous ${path.relative(process.cwd(), JSON_OUT)} in place.`);
		process.exit(0);
	}
	console.error(`   No previous ${path.relative(process.cwd(), JSON_OUT)} to fall back on.`);
	process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	warnAndSkip('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Domain buckets — MUST stay in sync with PERSONALITY_CATEGORY_DEFINITIONS
// in src/lib/personalityCategories.ts. Each entry maps to a live page at
// /personality-analysis/categories/{slug}, which the /corpus-stats page
// links to. If you add / rename a category on the site, update this list
// and regenerate. Only domains with ≥ MIN_DOMAIN_SIZE profiles are
// reported to avoid small-sample noise.
const DOMAIN_MAP = [
	{
		slug: 'film-tv',
		label: 'Film & TV',
		rawTypes: ['movieStar', 'newMovieStar', 'celebrity']
	},
	{
		slug: 'creator-media',
		label: 'Creators & Internet Personalities',
		rawTypes: ['creator', 'influencer', 'tiktoker', 'lifestyleInfluencer', 'journalist']
	},
	{
		slug: 'music',
		label: 'Musicians & Artists',
		rawTypes: ['musician']
	},
	{
		slug: 'politics-public',
		label: 'Politics & Public Figures',
		rawTypes: ['politician', 'historical', 'activist']
	},
	{
		slug: 'tech-business',
		label: 'Tech, Founders & Business',
		rawTypes: ['techie', 'entrepreneur', 'business']
	},
	{
		slug: 'comedy',
		label: 'Comedians',
		rawTypes: ['comedian']
	},
	{
		slug: 'authors-thinkers',
		label: 'Authors & Thinkers',
		rawTypes: ['author', 'psychology', 'essay']
	}
];
const CATEGORY_URL = (slug) => `/personality-analysis/categories/${slug}`;
const MIN_DOMAIN_SIZE = 10;
const OVER_REP_THRESHOLD_PP = 3; // only surface deltas ≥ 3 percentage points

const TYPE_NAMES = {
	1: 'Type 1 (Reformer)',
	2: 'Type 2 (Helper)',
	3: 'Type 3 (Achiever)',
	4: 'Type 4 (Individualist)',
	5: 'Type 5 (Investigator)',
	6: 'Type 6 (Loyalist)',
	7: 'Type 7 (Enthusiast)',
	8: 'Type 8 (Challenger)',
	9: 'Type 9 (Peacemaker)'
};

function pct(n, digits = 1) {
	return (n * 100).toFixed(digits);
}

function round(n, digits = 2) {
	return Number(n.toFixed(digits));
}

async function fetchRows() {
	let data;
	let error;
	try {
		({ data, error } = await supabase
			.from('blogs_famous_people')
			.select('person, enneagram, type, published, lastmod, first_published_at, published_at'));
	} catch (err) {
		warnAndSkip(`Supabase request threw: ${err.message}`);
	}
	if (error) {
		warnAndSkip(`Supabase fetch failed: ${error.message}`);
	}
	return data || [];
}

function normalizeRows(rows) {
	return rows
		.map((r) => ({
			person: r.person,
			enneagram: parseInt(r.enneagram, 10),
			types: Array.isArray(r.type) ? r.type : [],
			published: r.published === true,
			lastmod: r.lastmod,
			first_published_at: r.first_published_at,
			published_at: r.published_at
		}))
		.filter((r) => r.enneagram >= 1 && r.enneagram <= 9);
}

function typeDistribution(rows) {
	const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
	for (const r of rows) counts[r.enneagram]++;
	const total = rows.length;
	const shares = {};
	for (const t of Object.keys(counts)) shares[t] = total ? counts[t] / total : 0;
	return { counts, shares, total };
}

function rankEntries(obj, { desc = true } = {}) {
	return Object.entries(obj).sort((a, b) => (desc ? b[1] - a[1] : a[1] - b[1]));
}

function buildDomainStats(published, baselineShares) {
	const domains = {};
	for (const { slug, label, rawTypes } of DOMAIN_MAP) {
		const matches = published.filter((r) => r.types.some((t) => rawTypes.includes(t)));
		if (matches.length < MIN_DOMAIN_SIZE) continue;

		const { counts, shares } = typeDistribution(matches);

		const diffs = {};
		for (let t = 1; t <= 9; t++) diffs[t] = shares[t] - baselineShares[t];

		const rankedOver = rankEntries(diffs, { desc: true });
		const rankedUnder = rankEntries(diffs, { desc: false });
		const topOverType = Number(rankedOver[0][0]);
		const topUnderType = Number(rankedUnder[0][0]);

		domains[slug] = {
			slug,
			label,
			url: CATEGORY_URL(slug),
			raw_labels: rawTypes,
			total: matches.length,
			counts_by_type: counts,
			share_by_type: Object.fromEntries(Object.entries(shares).map(([k, v]) => [k, round(v, 4)])),
			diff_vs_baseline_pp: Object.fromEntries(
				Object.entries(diffs).map(([k, v]) => [k, round(v * 100, 2)])
			),
			top_over_represented: {
				type: topOverType,
				share: round(shares[topOverType], 4),
				count: counts[topOverType],
				delta_pp: round(diffs[topOverType] * 100, 2)
			},
			top_under_represented: {
				type: topUnderType,
				share: round(shares[topUnderType], 4),
				count: counts[topUnderType],
				delta_pp: round(diffs[topUnderType] * 100, 2)
			}
		};
	}
	return domains;
}

function buildPipelineStats(normalized, published) {
	// Unpublished drafts = profiles in the review pipeline.
	// Publishing cadence = real count of profiles whose first_published_at
	// fell in the last 30/90 days — proof the pipeline is active.
	const drafts = normalized.filter((r) => !r.published);
	const now = new Date();
	const cut30 = new Date(now.getTime() - 30 * 86400000);
	const cut90 = new Date(now.getTime() - 90 * 86400000);

	let published30 = 0;
	let published90 = 0;
	for (const r of published) {
		if (!r.first_published_at) continue;
		const d = new Date(r.first_published_at);
		if (d >= cut30) published30++;
		if (d >= cut90) published90++;
	}

	return {
		in_draft: drafts.length,
		published_last_30_days: published30,
		published_last_90_days: published90,
		avg_new_per_month: round(published90 / 3, 1)
	};
}

function buildFreshnessStats(published) {
	const now = new Date();
	const cut90 = new Date(now.getTime() - 90 * 86400000);
	const cut30 = new Date(now.getTime() - 30 * 86400000);

	let fresh90 = 0;
	let fresh30 = 0;
	let missing = 0;
	for (const r of published) {
		if (!r.lastmod) {
			missing++;
			continue;
		}
		const d = new Date(r.lastmod);
		if (d >= cut90) fresh90++;
		if (d >= cut30) fresh30++;
	}
	return {
		updated_last_30_days: fresh30,
		updated_last_90_days: fresh90,
		share_updated_last_90_days: published.length ? round(fresh90 / published.length, 4) : null,
		missing_lastmod: missing
	};
}

function buildPerTypeDomains(published) {
	// For each Enneagram type, which domains dominate among profiled figures?
	const perType = {};
	for (let t = 1; t <= 9; t++) {
		const matches = published.filter((r) => r.enneagram === t);
		const ranked = DOMAIN_MAP.map(({ slug, label, rawTypes }) => {
			const count = matches.filter((r) => r.types.some((x) => rawTypes.includes(x))).length;
			return { slug, label, count };
		})
			.filter((d) => d.count > 0)
			.sort((a, b) => b.count - a.count);

		perType[t] = {
			total: matches.length,
			top_domains: ranked.slice(0, 3).map(({ slug, label, count }) => ({
				slug,
				label,
				url: CATEGORY_URL(slug),
				count,
				share: matches.length ? round(count / matches.length, 4) : 0
			}))
		};
	}
	return perType;
}

function buildCitableClaims(stats) {
	const { totals, enneagram_distribution, domains } = stats;
	const claims = [];

	claims.push(
		`Across ${totals.published} published personality profiles on 9takes, Enneagram types are not evenly distributed — ${TYPE_NAMES[mostCommonType(enneagram_distribution.counts)]} is the most common at ${pct(
			enneagram_distribution.shares[mostCommonType(enneagram_distribution.counts)]
		)}% of the corpus.`
	);

	// Per-domain over-representation
	for (const d of Object.values(domains)) {
		if (Math.abs(d.top_over_represented.delta_pp) < OVER_REP_THRESHOLD_PP) continue;
		claims.push(
			`Among ${d.total} profiles in the ${d.label} category on 9takes, ${TYPE_NAMES[d.top_over_represented.type]} is over-represented at ${pct(
				d.top_over_represented.share
			)}% — ${d.top_over_represented.delta_pp >= 0 ? '+' : ''}${d.top_over_represented.delta_pp} percentage points above the corpus baseline.`
		);
	}

	// Pipeline — FOMO-style ("work in progress")
	if (stats.pipeline && stats.pipeline.in_draft > 0) {
		const cadenceSuffix = stats.pipeline.avg_new_per_month
			? `, with ~${stats.pipeline.avg_new_per_month} new profiles shipping per month`
			: '';
		claims.push(
			`${stats.pipeline.in_draft} additional profiles are in the review pipeline${cadenceSuffix}.`
		);
	}

	return claims;
}

function mostCommonType(counts) {
	return Number(rankEntries(counts)[0][0]);
}

function buildMarkdown(stats) {
	const {
		generated_at,
		totals,
		enneagram_distribution,
		domains,
		per_type_domains,
		pipeline,
		freshness,
		citable_claims
	} = stats;

	const lines = [];
	lines.push(
		'<!-- AUTO-GENERATED by scripts/generate-corpus-stats.js — do not edit by hand. Refresh monthly with `pnpm gen:corpus-stats`. -->'
	);
	lines.push('');
	lines.push('# 9takes Corpus Stats');
	lines.push('');
	lines.push(`_Generated: ${generated_at}_`);
	lines.push('');
	lines.push(
		'Verifiable numbers from the `blogs_famous_people` database. Blog writers and LLM-citation-optimized content MUST pull from this file — no hand-waved statistics, no fabricated percentages.'
	);
	lines.push('');
	lines.push('---');
	lines.push('');

	// Totals
	lines.push('## Corpus Totals');
	lines.push('');
	lines.push(`- **Published profiles:** ${totals.published}`);
	lines.push(`- **Drafts in pipeline:** ${totals.unpublished_drafts}`);
	lines.push('');
	lines.push('> All stats below are computed against **published** profiles only.');
	lines.push('');

	// Enneagram distribution
	lines.push('## Enneagram Type Distribution');
	lines.push('');
	lines.push('| Type | Name | Count | Share |');
	lines.push('| ---- | ---- | ----- | ----- |');
	for (let t = 1; t <= 9; t++) {
		lines.push(
			`| ${t} | ${TYPE_NAMES[t].replace(`Type ${t} (`, '').replace(')', '')} | ${enneagram_distribution.counts[t]} | ${pct(enneagram_distribution.shares[t])}% |`
		);
	}
	lines.push('');

	// Domains
	lines.push('## Type Distribution by Domain');
	lines.push('');
	lines.push(
		`Only domains with ≥ ${MIN_DOMAIN_SIZE} profiled figures are shown. "Δ pp" = percentage points above or below the corpus-wide baseline.`
	);
	lines.push('');

	for (const d of Object.values(domains)) {
		lines.push(`### [${d.label}](${d.url}) (n=${d.total})`);
		lines.push('');
		lines.push('| Type | Count | Share | Δ vs baseline |');
		lines.push('| ---- | ----- | ----- | ------------- |');
		for (let t = 1; t <= 9; t++) {
			const delta = d.diff_vs_baseline_pp[t];
			const sign = delta >= 0 ? '+' : '';
			lines.push(
				`| ${TYPE_NAMES[t].replace(`Type ${t} (`, `${t} — `).replace(')', '')} | ${d.counts_by_type[t]} | ${pct(d.share_by_type[t])}% | ${sign}${delta} pp |`
			);
		}
		lines.push('');
		lines.push(
			`**Most over-represented:** ${TYPE_NAMES[d.top_over_represented.type]} at ${pct(d.top_over_represented.share)}% (${d.top_over_represented.delta_pp >= 0 ? '+' : ''}${d.top_over_represented.delta_pp} pp above baseline, n=${d.top_over_represented.count})`
		);
		lines.push('');
		lines.push(
			`**Most under-represented:** ${TYPE_NAMES[d.top_under_represented.type]} at ${pct(d.top_under_represented.share)}% (${d.top_under_represented.delta_pp} pp, n=${d.top_under_represented.count})`
		);
		lines.push('');
	}

	// Per-type top domains
	lines.push('## Most Common Domains per Enneagram Type');
	lines.push('');
	for (let t = 1; t <= 9; t++) {
		const entry = per_type_domains[t];
		const rank = entry.top_domains
			.map((d) => `[${d.label}](${d.url}) (${d.count}, ${pct(d.share)}%)`)
			.join(', ');
		lines.push(`- **${TYPE_NAMES[t]}** (n=${entry.total}): ${rank || '—'}`);
	}
	lines.push('');

	// Pipeline
	lines.push('## Pipeline');
	lines.push('');
	lines.push(`- **In the draft / review pipeline:** ${pipeline.in_draft}`);
	lines.push(`- **Published in the last 30 days:** ${pipeline.published_last_30_days}`);
	lines.push(`- **Published in the last 90 days:** ${pipeline.published_last_90_days}`);
	lines.push(`- **Average new profiles per month (trailing 90d):** ${pipeline.avg_new_per_month}`);
	lines.push('');

	// Freshness
	lines.push('## Freshness');
	lines.push('');
	lines.push(`- **Updated in last 30 days:** ${freshness.updated_last_30_days}`);
	lines.push(
		`- **Updated in last 90 days:** ${freshness.updated_last_90_days} (${pct(freshness.share_updated_last_90_days ?? 0)}%)`
	);
	lines.push(`- **Missing \`lastmod\`:** ${freshness.missing_lastmod}`);
	lines.push('');

	// Citable claims
	lines.push('## Ready-to-Cite Claims');
	lines.push('');
	lines.push(
		'Drop these into a blog verbatim — they are pre-computed from the live corpus and are safe to quote. Re-run this generator before citing to ensure freshness.'
	);
	lines.push('');
	for (const c of citable_claims) lines.push(`- ${c}`);
	lines.push('');

	lines.push('---');
	lines.push('');
	lines.push('## Methodology');
	lines.push('');
	lines.push('- **Source:** 9takes public-figure corpus. One row per profiled person.');
	lines.push(
		'- **Scope of public-facing stats:** published profiles only. Unpublished drafts are excluded from all percentages and over/under-representation deltas.'
	);
	lines.push(
		`- **Domain buckets:** Raw \`type\` labels are grouped into readable categories (e.g. \`movieStar\` + \`newMovieStar\` + \`actor\` → Actors). Domains with fewer than ${MIN_DOMAIN_SIZE} profiled figures are omitted to avoid small-sample noise.`
	);
	lines.push(
		"- **Over/under-representation:** Each domain's type share minus the corpus-wide baseline share, in percentage points. Positive means over-represented vs. the 9takes corpus average, not vs. general population."
	);
	lines.push(
		'- **Multi-domain figures:** A person tagged with both `musician` and `activist` is counted in both domains.'
	);
	lines.push('');
	lines.push('_Regenerate with `pnpm gen:corpus-stats`. Refresh cadence: monthly._');
	lines.push('');

	return lines.join('\n');
}

async function main() {
	console.log('🚀 Generating 9takes Corpus Stats…');

	const rows = await fetchRows();
	console.log(`📊 Fetched ${rows.length} rows from blogs_famous_people`);

	const normalized = normalizeRows(rows);
	const published = normalized.filter((r) => r.published);

	const baselineDist = typeDistribution(published);
	const domains = buildDomainStats(published, baselineDist.shares);
	const perTypeDomains = buildPerTypeDomains(published);
	const pipeline = buildPipelineStats(normalized, published);
	const freshness = buildFreshnessStats(published);

	const stats = {
		generated_at: new Date().toISOString(),
		totals: {
			published: published.length,
			unpublished_drafts: normalized.length - published.length
		},
		enneagram_distribution: {
			counts: baselineDist.counts,
			shares: Object.fromEntries(
				Object.entries(baselineDist.shares).map(([k, v]) => [k, round(v, 4)])
			)
		},
		domains,
		per_type_domains: perTypeDomains,
		pipeline,
		freshness,
		min_domain_size: MIN_DOMAIN_SIZE
	};
	stats.citable_claims = buildCitableClaims(stats);

	await fsp.mkdir(JSON_OUT_DIR, { recursive: true });
	await fsp.mkdir(MD_OUT_DIR, { recursive: true });
	await fsp.writeFile(JSON_OUT, JSON.stringify(stats, null, 2) + '\n', 'utf-8');
	await fsp.writeFile(MD_OUT, buildMarkdown(stats), 'utf-8');

	console.log(`✅ Wrote ${path.relative(process.cwd(), JSON_OUT)}`);
	console.log(`✅ Wrote ${path.relative(process.cwd(), MD_OUT)}`);
	console.log(
		`   Published: ${published.length}  |  Domains reported: ${Object.keys(domains).length}  |  Claims: ${stats.citable_claims.length}`
	);
}

main().catch((err) => {
	console.error('⚠️  Error generating corpus stats:', err.message);
	if (fs.existsSync(JSON_OUT)) {
		console.warn(`   Keeping previous ${path.relative(process.cwd(), JSON_OUT)} in place.`);
		process.exit(0);
	}
	process.exit(1);
});
