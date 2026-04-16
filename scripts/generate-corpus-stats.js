// scripts/generate-corpus-stats.js
//
// Generates the 9takes Corpus Stats data file from Supabase.
// Writes docs/data/corpus-stats.json (machine-readable, for blog commands
// + automation) and docs/data/corpus-stats.md (human-readable, with
// ready-to-cite phrasings).
//
// Run: pnpm gen:corpus-stats
// Refresh cadence: monthly (see 9takes-strat.md, Tier 1 task #4).

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, '..', 'docs', 'data');
const JSON_OUT = path.join(OUT_DIR, 'corpus-stats.json');
const MD_OUT = path.join(OUT_DIR, 'corpus-stats.md');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.error('❌ Missing Supabase environment variables');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Group the raw `type` labels stored in blogs_famous_people into readable
// domain buckets. Only domains with ≥ MIN_DOMAIN_SIZE profiles are
// reported to avoid small-sample noise in over-/under-representation
// claims.
const DOMAIN_MAP = {
	Actors: ['movieStar', 'newMovieStar', 'actor'],
	Musicians: ['musician'],
	'Creators & Influencers': ['creator', 'tiktoker', 'influencer', 'lifestyleInfluencer'],
	Politicians: ['politician'],
	'Tech & Business Founders': ['techie', 'entrepreneur', 'business'],
	Comedians: ['comedian'],
	'Authors & Journalists': ['author', 'writer', 'journalist'],
	Athletes: ['athlete', 'sports'],
	'Historical Figures': ['historical'],
	Activists: ['activist']
};
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
	const { data, error } = await supabase
		.from('blogs_famous_people')
		.select(
			'person, enneagram, type, content_quality, published, lastmod, first_published_at, published_at'
		);
	if (error) {
		console.error('❌ Supabase fetch failed:', error.message);
		process.exit(1);
	}
	return data || [];
}

function normalizeRows(rows) {
	return rows
		.map((r) => ({
			person: r.person,
			enneagram: parseInt(r.enneagram, 10),
			types: Array.isArray(r.type) ? r.type : [],
			cq: r.content_quality || null,
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
	for (const [domainName, rawLabels] of Object.entries(DOMAIN_MAP)) {
		const matches = published.filter((r) => r.types.some((t) => rawLabels.includes(t)));
		if (matches.length < MIN_DOMAIN_SIZE) continue;

		const { counts, shares } = typeDistribution(matches);

		const diffs = {};
		for (let t = 1; t <= 9; t++) diffs[t] = shares[t] - baselineShares[t];

		const rankedOver = rankEntries(diffs, { desc: true });
		const rankedUnder = rankEntries(diffs, { desc: false });
		const topOverType = Number(rankedOver[0][0]);
		const topUnderType = Number(rankedUnder[0][0]);

		domains[domainName] = {
			raw_labels: rawLabels,
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

function buildQualityStats(published) {
	const graded = published.filter((r) => r.cq && typeof r.cq.overall === 'number');
	const overall = graded.map((r) => r.cq.overall);
	const avg = overall.length ? overall.reduce((a, b) => a + b, 0) / overall.length : null;

	const letters = {};
	for (const r of graded) {
		const l = r.cq.letter;
		if (l) letters[l] = (letters[l] || 0) + 1;
	}

	const aOrHigher = graded.filter((r) => /^A/.test(r.cq.letter || '')).length;

	return {
		graded_count: graded.length,
		ungraded_count: published.length - graded.length,
		average_overall: avg !== null ? round(avg, 2) : null,
		letter_distribution: letters,
		grade_a_or_higher_count: aOrHigher,
		grade_a_or_higher_share: graded.length ? round(aOrHigher / graded.length, 4) : null
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
		const domainCounts = {};
		for (const [domainName, rawLabels] of Object.entries(DOMAIN_MAP)) {
			domainCounts[domainName] = matches.filter((r) =>
				r.types.some((x) => rawLabels.includes(x))
			).length;
		}
		const ranked = rankEntries(domainCounts).filter(([, v]) => v > 0);
		perType[t] = {
			total: matches.length,
			top_domains: ranked.slice(0, 3).map(([domain, count]) => ({
				domain,
				count,
				share: matches.length ? round(count / matches.length, 4) : 0
			}))
		};
	}
	return perType;
}

function buildCitableClaims(stats) {
	const { totals, enneagram_distribution, domains, content_quality, freshness } = stats;
	const claims = [];

	claims.push(
		`Across ${totals.published} published personality profiles on 9takes, Enneagram types are not evenly distributed — ${TYPE_NAMES[mostCommonType(enneagram_distribution.counts)]} is the most common at ${pct(
			enneagram_distribution.shares[mostCommonType(enneagram_distribution.counts)]
		)}% of the corpus.`
	);

	// Per-domain over-representation
	for (const [domainName, d] of Object.entries(domains)) {
		if (Math.abs(d.top_over_represented.delta_pp) < OVER_REP_THRESHOLD_PP) continue;
		claims.push(
			`Among ${d.total} ${domainName.toLowerCase()} profiled on 9takes, ${TYPE_NAMES[d.top_over_represented.type]} is over-represented at ${pct(
				d.top_over_represented.share
			)}% — ${d.top_over_represented.delta_pp >= 0 ? '+' : ''}${d.top_over_represented.delta_pp} percentage points above the corpus baseline.`
		);
	}

	// Grade
	if (content_quality.average_overall !== null) {
		claims.push(
			`The ${content_quality.graded_count} graded profiles on 9takes average ${content_quality.average_overall}/10 on our internal quality rubric (originality, evidence, writing, hook).`
		);
	}

	// Freshness
	if (freshness.share_updated_last_90_days !== null) {
		claims.push(
			`${pct(freshness.share_updated_last_90_days)}% of our published profiles have been refreshed in the last 90 days (${freshness.updated_last_90_days} of ${totals.published}).`
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
		content_quality,
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
	lines.push(`- **Total profiles in database:** ${totals.total_in_db}`);
	lines.push(`- **Published:** ${totals.published}`);
	lines.push(`- **Unpublished drafts:** ${totals.unpublished_drafts}`);
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

	for (const [domainName, d] of Object.entries(domains)) {
		lines.push(`### ${domainName} (n=${d.total})`);
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
	lines.push('## Most Common Professions per Enneagram Type');
	lines.push('');
	for (let t = 1; t <= 9; t++) {
		const entry = per_type_domains[t];
		const rank = entry.top_domains
			.map((d) => `${d.domain} (${d.count}, ${pct(d.share)}%)`)
			.join(', ');
		lines.push(`- **${TYPE_NAMES[t]}** (n=${entry.total}): ${rank || '—'}`);
	}
	lines.push('');

	// Quality
	lines.push('## Content Quality');
	lines.push('');
	lines.push(`- **Graded profiles:** ${content_quality.graded_count} of ${totals.published}`);
	lines.push(`- **Average overall grade:** ${content_quality.average_overall ?? 'n/a'} / 10`);
	if (content_quality.grade_a_or_higher_share !== null) {
		lines.push(
			`- **Grade A or higher:** ${content_quality.grade_a_or_higher_count} (${pct(content_quality.grade_a_or_higher_share)}% of graded)`
		);
	}
	lines.push('- **Letter distribution:**');
	const letterOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
	const known = new Set(letterOrder);
	for (const l of letterOrder) {
		if (content_quality.letter_distribution[l]) {
			lines.push(`  - ${l}: ${content_quality.letter_distribution[l]}`);
		}
	}
	for (const [l, n] of Object.entries(content_quality.letter_distribution)) {
		if (!known.has(l)) lines.push(`  - ${l}: ${n}`);
	}
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
	lines.push(
		'- **Source:** `blogs_famous_people` Supabase table. One row per profiled public figure.'
	);
	lines.push(
		'- **Scope of public-facing stats:** `published = true` rows only. Unpublished drafts are excluded from all percentages and over/under-representation deltas.'
	);
	lines.push(
		`- **Domain buckets:** Raw \`type\` labels are grouped into readable categories (e.g. \`movieStar\` + \`newMovieStar\` + \`actor\` → Actors). Domains with fewer than ${MIN_DOMAIN_SIZE} profiled figures are omitted to avoid small-sample noise.`
	);
	lines.push(
		"- **Over/under-representation:** Each domain's type share minus the corpus-wide baseline share, in percentage points. Positive means over-represented vs. the 9takes corpus average, not vs. general population."
	);
	lines.push(
		"- **Grading:** `content_quality.overall` is 9takes' internal 10-point rubric covering originality, evidence, writing, and hook. Not all profiles are graded."
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
	const quality = buildQualityStats(published);
	const freshness = buildFreshnessStats(published);

	const stats = {
		generated_at: new Date().toISOString(),
		source: 'blogs_famous_people',
		totals: {
			total_in_db: rows.length,
			normalized_rows: normalized.length,
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
		content_quality: quality,
		freshness,
		min_domain_size: MIN_DOMAIN_SIZE
	};
	stats.citable_claims = buildCitableClaims(stats);

	await fs.mkdir(OUT_DIR, { recursive: true });
	await fs.writeFile(JSON_OUT, JSON.stringify(stats, null, 2) + '\n', 'utf-8');
	await fs.writeFile(MD_OUT, buildMarkdown(stats), 'utf-8');

	console.log(`✅ Wrote ${path.relative(process.cwd(), JSON_OUT)}`);
	console.log(`✅ Wrote ${path.relative(process.cwd(), MD_OUT)}`);
	console.log(
		`   Published: ${published.length}  |  Domains reported: ${Object.keys(domains).length}  |  Claims: ${stats.citable_claims.length}`
	);
}

main().catch((err) => {
	console.error('❌ Error generating corpus stats:', err);
	process.exit(1);
});
