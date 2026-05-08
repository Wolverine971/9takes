// src/lib/server/typeCorpusStats.ts
// Surfaces the strongest citation-grade stat for each Enneagram type page.
// Pulls from the auto-generated /Users/djwayne/9takes/src/lib/data/corpus-stats.json
// so every claim matches the live corpus exactly. Never hand-code numbers here.
//
// Two stat shapes are supported:
//   - 'domain-overrep' — "Type 4 = 35.1% of musicians (+21pp vs baseline)"
//                       Best when there is a domain with a strong over-rep delta.
//   - 'type-share'    — "X% of profiled Type Ns are in [domain]"
//                       Fallback when no domain has a meaningful over-rep delta
//                       for this type (e.g. Type 1, 6, 8 in the current corpus).

import corpusStats from '$lib/data/corpus-stats.json';

const TYPE_NAMES: Record<string, { full: string; short: string }> = {
	'1': { full: 'Type 1 (Reformer)', short: 'Reformer' },
	'2': { full: 'Type 2 (Helper)', short: 'Helper' },
	'3': { full: 'Type 3 (Achiever)', short: 'Achiever' },
	'4': { full: 'Type 4 (Individualist)', short: 'Individualist' },
	'5': { full: 'Type 5 (Investigator)', short: 'Investigator' },
	'6': { full: 'Type 6 (Loyalist)', short: 'Loyalist' },
	'7': { full: 'Type 7 (Enthusiast)', short: 'Enthusiast' },
	'8': { full: 'Type 8 (Challenger)', short: 'Challenger' },
	'9': { full: 'Type 9 (Peacemaker)', short: 'Peacemaker' }
};

interface DomainStat {
	slug: string;
	label: string;
	url: string;
	total: number;
	counts_by_type: Record<string, number>;
	share_by_type: Record<string, number>;
	diff_vs_baseline_pp: Record<string, number>;
	top_over_represented: { type: number; share: number; count: number; delta_pp: number };
	top_under_represented: { type: number; share: number; count: number; delta_pp: number };
}

interface PerTypeDomain {
	total: number;
	top_domains: { slug: string; label: string; url: string; count: number; share: number }[];
}

export type TypeCorpusInsight = {
	/** 'domain-overrep' = strong over-representation; 'type-share' = "X% of this type is in domain" */
	variant: 'domain-overrep' | 'type-share';
	type: string; // "1".."9"
	typeFullName: string; // "Type 4 (Individualist)"
	typeShortName: string; // "Individualist"
	domainSlug: string;
	domainLabel: string;
	domainUrl: string; // "/personality-analysis/categories/music"
	corpusAnchorUrl: string; // "/corpus-stats#domain-music"
	corpusPublished: number;
	domainTotal: number; // count in the domain
	count: number; // count of this type in the domain
	sharePct: string; // "35.1%"
	deltaPp: number | null; // null for type-share variant
	deltaPpFormatted: string | null; // "+21.24" or null
	/** One-sentence claim in plain English, ready to drop into UI / Quotation. */
	claim: string;
	/** Generated-at ISO timestamp from the corpus file. */
	generatedAt: string;
};

const formatPct = (share: number) => `${(share * 100).toFixed(1)}%`;
const formatDeltaSigned = (delta: number) =>
	delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2);

/**
 * Heuristic for whether a domain over-rep stat is "strong enough" to lead with:
 *   - delta >= +5 pp AND count >= 6, OR
 *   - delta >= +8 pp AND count >= 4
 *
 * Falls back to the type's most-common domain (per_type_domains.top_domains[0]).
 */
function pickDomainOverrep(typeKey: string): DomainStat | null {
	const domains = Object.values(corpusStats.domains as Record<string, DomainStat>);
	let best: { domain: DomainStat; delta: number; count: number } | null = null;

	for (const domain of domains) {
		const delta = domain.diff_vs_baseline_pp[typeKey];
		const count = domain.counts_by_type[typeKey];
		if (typeof delta !== 'number' || typeof count !== 'number') continue;

		const strong = (delta >= 5 && count >= 6) || (delta >= 8 && count >= 4);
		if (!strong) continue;

		if (!best || delta > best.delta) {
			best = { domain, delta, count };
		}
	}

	return best?.domain ?? null;
}

export function getTypeCorpusInsight(typeSlug: string): TypeCorpusInsight | null {
	const typeKey = String(typeSlug);
	const typeNames = TYPE_NAMES[typeKey];
	if (!typeNames) return null;

	const corpusPublished = corpusStats.totals.published;
	const generatedAt = corpusStats.generated_at;

	const overRepDomain = pickDomainOverrep(typeKey);

	if (overRepDomain) {
		const count = overRepDomain.counts_by_type[typeKey];
		const share = overRepDomain.share_by_type[typeKey];
		const delta = overRepDomain.diff_vs_baseline_pp[typeKey];
		const sharePct = formatPct(share);
		const deltaPpFormatted = formatDeltaSigned(delta);

		const claim = `Among the ${overRepDomain.total} profiles in the 9takes ${overRepDomain.label} category, ${typeNames.full} is over-represented at ${sharePct} — ${deltaPpFormatted} percentage points above the corpus baseline of ${corpusPublished} profiles.`;

		return {
			variant: 'domain-overrep',
			type: typeKey,
			typeFullName: typeNames.full,
			typeShortName: typeNames.short,
			domainSlug: overRepDomain.slug,
			domainLabel: overRepDomain.label,
			domainUrl: overRepDomain.url,
			corpusAnchorUrl: `/corpus-stats#domain-${overRepDomain.slug}`,
			corpusPublished,
			domainTotal: overRepDomain.total,
			count,
			sharePct,
			deltaPp: delta,
			deltaPpFormatted,
			claim,
			generatedAt
		};
	}

	// Fallback: type-share stat (e.g. "48.4% of profiled Type 6s are in Film & TV")
	const perType = (corpusStats.per_type_domains as Record<string, PerTypeDomain>)[typeKey];
	if (!perType || perType.top_domains.length === 0) return null;

	const top = perType.top_domains[0];
	const sharePct = formatPct(top.share);

	const claim = `${sharePct} of the ${perType.total} ${typeNames.full} profiles on 9takes work in ${top.label} (${top.count} of ${perType.total}), making it the dominant lane for this type in the corpus.`;

	return {
		variant: 'type-share',
		type: typeKey,
		typeFullName: typeNames.full,
		typeShortName: typeNames.short,
		domainSlug: top.slug,
		domainLabel: top.label,
		domainUrl: top.url,
		corpusAnchorUrl: `/corpus-stats#domain-${top.slug}`,
		corpusPublished,
		domainTotal: top.count,
		count: top.count,
		sharePct,
		deltaPp: null,
		deltaPpFormatted: null,
		claim,
		generatedAt
	};
}
