// src/lib/corpusTokens.js
//
// Live corpus numbers in prose. Posts write `{{corpus.domain.music.type.4.share}}` instead of a
// hand-typed "35.6%", and every consumer swaps the token for the current value from
// src/lib/data/corpus-stats.json (regenerated on every Vercel deploy by `pnpm gen:corpus-stats`):
//   - MDsvex posts: the `corpus-tokens` preprocessor in svelte.config.js (body, frontmatter, JSON-LD)
//   - People pages (DB content): src/routes/personality-analysis/[slug]/+page.server.ts
//   - Blog search index: scripts/index-blogs-to-supabase.js
// `pnpm lint` (scripts/check-corpus-figures.mjs) fails on unknown tokens, on hand-typed corpus
// figures, and on `<!-- corpus-assert: ... -->` claims the data no longer supports.
//
// Plain JS (not TS) because svelte.config.js and node scripts import it directly.
// Token reference with current values: docs/data/corpus-stats.md ("Live tokens").

/** Matches `{{corpus.some.path}}`, capturing `some.path`. */
export const CORPUS_TOKEN_RE = /\{\{\s*corpus\.([a-z0-9.-]+)\s*\}\}/gi;

/** Matches `<!-- corpus-assert: domain.music.top.type = 4 -->`. */
export const CORPUS_ASSERT_RE = /<!--\s*corpus-assert:\s*([a-z0-9.-]+)\s*=\s*([^\s]+?)\s*-->/gi;

/** @type {Record<number, string>} */
export const TYPE_NAMES = {
	1: 'Reformer',
	2: 'Helper',
	3: 'Achiever',
	4: 'Individualist',
	5: 'Investigator',
	6: 'Loyalist',
	7: 'Enthusiast',
	8: 'Challenger',
	9: 'Peacemaker'
};

const TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

/** @param {number} share */
const pct = (share) => `${(share * 100).toFixed(1)}%`;
/** @param {number} pp */
const signed = (pp) => `${pp >= 0 ? '+' : '−'}${Math.abs(pp).toFixed(1)}`;

/**
 * Fields every "type slot" exposes: `type`, `short`, `name`, `label`, `count`, `share`.
 * @param {number | string} type
 * @param {number} count
 * @param {number} share
 * @returns {Record<string, string>}
 */
function typeSlot(type, count, share) {
	const name = TYPE_NAMES[Number(type)];
	return {
		type: String(type),
		short: `Type ${type}`,
		name: `Type ${type} (${name})`,
		label: name,
		count: String(count),
		share: pct(share)
	};
}

/**
 * Types ordered by count, largest first; ties go to the lower type number.
 * @param {Record<string | number, number>} counts
 */
function ranked(counts) {
	return [...TYPES].sort((a, b) => counts[b] - counts[a] || a - b);
}

/**
 * Flattens corpus-stats.json into `path -> display string`, e.g.
 * `domain.music.type.4.share -> "35.6%"`. Paths are what posts write after `corpus.`.
 *
 * @param {any} stats parsed corpus-stats.json
 * @returns {Map<string, string>}
 */
export function buildCorpusTokenTable(stats) {
	/** @type {Map<string, string>} */
	const table = new Map();
	/** @type {(prefix: string, obj: Record<string, string>) => void} */
	const put = (prefix, obj) => {
		for (const [key, value] of Object.entries(obj)) table.set(`${prefix}.${key}`, value);
	};

	const dist = stats.enneagram_distribution;
	const total = stats.totals.published;
	table.set('total', String(total));
	table.set('drafts', String(stats.totals.unpublished_drafts ?? stats.pipeline?.in_draft ?? ''));
	table.set('per-month', String(stats.pipeline?.avg_new_per_month ?? ''));
	table.set('published-30', String(stats.pipeline?.published_last_30_days ?? ''));
	table.set('published-90', String(stats.pipeline?.published_last_90_days ?? ''));
	table.set('updated-90', String(stats.freshness?.updated_last_90_days ?? ''));
	table.set('updated-90-share', pct(stats.freshness?.share_updated_last_90_days ?? 0));
	const generated = new Date(stats.generated_at);
	table.set('as-of', `${MONTHS[generated.getUTCMonth()]} ${generated.getUTCFullYear()}`);

	for (const t of TYPES) {
		put(`type.${t}`, typeSlot(t, dist.counts[t], dist.shares[t]));
		// The field holding the biggest share of this type ("Music is where Type 4 lives").
		const home = stats.per_type_domains?.[t]?.top_domains?.[0];
		if (home) {
			table.set(`type.${t}.top-domain`, home.slug);
			table.set(`type.${t}.top-domain-label`, home.label);
			table.set(`type.${t}.top-domain-share`, pct(home.share));
		}
	}
	ranked(dist.counts).forEach((t, i) => {
		put(`rank.${i + 1}`, typeSlot(t, dist.counts[t], dist.shares[t]));
	});

	for (const d of Object.values(stats.domains)) {
		const base = `domain.${d.slug}`;
		table.set(`${base}.total`, String(d.total));
		table.set(`${base}.label`, d.label);
		table.set(`${base}.url`, d.url);
		for (const t of TYPES) {
			const count = d.counts_by_type[t];
			put(`${base}.type.${t}`, {
				...typeSlot(t, count, d.share_by_type[t]),
				delta: signed(d.diff_vs_baseline_pp[t]),
				// Share of ALL profiles of this type that sit in this domain.
				'of-type': pct(dist.counts[t] ? count / dist.counts[t] : 0)
			});
		}
		ranked(d.counts_by_type).forEach((t, i) => {
			put(`${base}.rank.${i + 1}`, {
				...typeSlot(t, d.counts_by_type[t], d.share_by_type[t]),
				delta: signed(d.diff_vs_baseline_pp[t])
			});
		});
		for (const [key, slot] of [
			['top', d.top_over_represented],
			['under', d.top_under_represented]
		]) {
			put(`${base}.${key}`, {
				...typeSlot(slot.type, slot.count, slot.share),
				delta: signed(slot.delta_pp)
			});
		}
	}
	// Fields ranked by their biggest over-representation: `skew.1.domain` = the field with the
	// strongest single-type lean ("the largest skew in any field" claims assert on this).
	Object.values(stats.domains)
		.filter((d) => d.slug !== 'tech-business') // combined view, not a field
		.sort((a, b) => b.top_over_represented.delta_pp - a.top_over_represented.delta_pp)
		.forEach((d, i) => {
			const slot = d.top_over_represented;
			put(`skew.${i + 1}`, {
				...typeSlot(slot.type, slot.count, slot.share),
				delta: signed(slot.delta_pp),
				domain: d.slug,
				'domain-label': d.label
			});
		});
	return table;
}

/**
 * Replaces every `{{corpus.*}}` token in `text`. Unknown tokens go to `onMissing` (default:
 * throw, so a build never ships a broken sentence); whatever it returns is used instead.
 *
 * @param {string} text
 * @param {Map<string, string>} table from buildCorpusTokenTable
 * @param {{ onMissing?: (path: string) => string, source?: string }} [options]
 */
export function resolveCorpusTokens(text, table, options = {}) {
	if (!text || !text.includes('{{')) return text;
	const onMissing =
		options.onMissing ??
		((path) => {
			throw new Error(
				`Unknown corpus token {{corpus.${path}}}${options.source ? ` in ${options.source}` : ''}. ` +
					'See "Live tokens" in docs/data/corpus-stats.md for valid paths.'
			);
		});
	return text.replace(CORPUS_TOKEN_RE, (_match, path) => {
		const value = table.get(path.toLowerCase());
		return value === undefined ? onMissing(path) : value;
	});
}

/**
 * Every `corpus.*` path referenced in `text`.
 * @param {string | null | undefined} text
 */
export function findCorpusTokens(text) {
	return [...(text ?? '').matchAll(CORPUS_TOKEN_RE)].map((m) => m[1].toLowerCase());
}

/**
 * Checks `<!-- corpus-assert: path = value -->` comments, the prose claims a token can't carry
 * ("Type 4 leads music"). `value` may list alternatives: `rank.9.type = 1|2`. Returns one
 * message per claim the data no longer supports.
 *
 * @param {string} text
 * @param {Map<string, string>} table
 */
export function checkCorpusAssertions(text, table) {
	const failures = [];
	for (const [, path, expected] of (text ?? '').matchAll(CORPUS_ASSERT_RE)) {
		const actual = table.get(path.toLowerCase());
		if (actual === undefined) failures.push(`corpus-assert on unknown path "${path}"`);
		else if (!expected.toLowerCase().split('|').includes(actual.toLowerCase()))
			failures.push(`claims ${path} = ${expected}, data now says ${actual}`);
	}
	return failures;
}
