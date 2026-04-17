// src/lib/server/personalityCategoryStats.ts
// Surfaces citation-grade, sourced numerical claims for each personality
// category index page (the "Statistics Addition" + "Cite Sources" levers from
// the GEO/AEO research — see 9takes-strat.md Part 3).
//
// corpus-stats.json keys domains by the exact category slug used in
// personalityCategories.ts, so the domain total matches the page's filter
// exactly (e.g. politics-public = politician + historical + activist).

import corpusStats from '$lib/data/corpus-stats.json';
import type { PersonalityCategorySlug } from '$lib/personalityCategories';

const TYPE_NAMES: Record<string, string> = {
	'1': 'Type 1 (Reformer)',
	'2': 'Type 2 (Helper)',
	'3': 'Type 3 (Achiever)',
	'4': 'Type 4 (Individualist)',
	'5': 'Type 5 (Investigator)',
	'6': 'Type 6 (Loyalist)',
	'7': 'Type 7 (Enthusiast)',
	'8': 'Type 8 (Challenger)',
	'9': 'Type 9 (Peacemaker)'
};

interface DomainStat {
	slug: string;
	label: string;
	url: string;
	raw_labels: string[];
	total: number;
	counts_by_type: Record<string, number>;
	share_by_type: Record<string, number>;
	diff_vs_baseline_pp: Record<string, number>;
	top_over_represented: { type: number; share: number; count: number; delta_pp: number };
	top_under_represented: { type: number; share: number; count: number; delta_pp: number };
}

export interface CategoryStatInsight {
	/** How many published profiles sit in this category slice. Matches the page filter. */
	domainTotal: number;
	/** Total published profiles in the whole corpus — baseline denominator. */
	corpusPublished: number;
	/** Share of the whole corpus that was refreshed in the last 90 days (0-1). */
	freshnessShare90d: number;
	/** Share of the whole corpus refreshed in last 90 days, formatted as "86.6%". */
	freshnessShare90dPct: string;
	/** Citation-grade headline sentence — what LLMs and humans should quote. */
	headlineClaim: string;
	/** Counterpart sentence for the under-represented type. */
	underClaim: string;
	/** Freshness sentence suitable for the visible UI + FAQ answer. */
	freshnessClaim: string;
	/** ISO timestamp the corpus file was generated at. */
	generatedAt: string;
	/** Top over-represented type for this domain. */
	over: { type: string; typeName: string; sharePct: string; deltaPp: number; count: number };
	/** Top under-represented type. */
	under: { type: string; typeName: string; sharePct: string; deltaPp: number; count: number };
	/** Canonical URL of the public corpus dataset page. */
	datasetUrl: string;
	/** Pretty domain label from the corpus file (e.g. "Film & TV"). */
	domainLabel: string;
}

const formatPct = (share: number) => `${(share * 100).toFixed(1)}%`;
const formatDelta = (delta: number) =>
	delta >= 0 ? `+${delta.toFixed(2)} pp` : `${delta.toFixed(2)} pp`;

export function getPersonalityCategoryStats(
	slug: PersonalityCategorySlug
): CategoryStatInsight | null {
	const domain = (corpusStats.domains as Record<string, DomainStat>)[slug];
	if (!domain) return null;

	const corpusPublished = corpusStats.totals.published;
	const freshnessShare90d = corpusStats.freshness.share_updated_last_90_days ?? 0;
	const freshnessCount = corpusStats.freshness.updated_last_90_days ?? 0;
	const freshnessPct = `${(freshnessShare90d * 100).toFixed(1)}%`;

	const over = {
		type: String(domain.top_over_represented.type),
		typeName: TYPE_NAMES[String(domain.top_over_represented.type)],
		sharePct: formatPct(domain.top_over_represented.share),
		deltaPp: domain.top_over_represented.delta_pp,
		count: domain.top_over_represented.count
	};
	const under = {
		type: String(domain.top_under_represented.type),
		typeName: TYPE_NAMES[String(domain.top_under_represented.type)],
		sharePct: formatPct(domain.top_under_represented.share),
		deltaPp: domain.top_under_represented.delta_pp,
		count: domain.top_under_represented.count
	};

	const headlineClaim = `Of the ${domain.total} profiles in the 9takes ${domain.label} category, ${over.typeName} is over-represented at ${over.sharePct} (${formatDelta(over.deltaPp)} vs. the ${corpusPublished}-profile corpus baseline).`;

	const underClaim = `${under.typeName} is the most under-represented type in this lane at ${under.sharePct} (${formatDelta(under.deltaPp)}).`;

	const freshnessClaim = `${freshnessPct} of the ${corpusPublished} published profiles on 9takes were refreshed in the last 90 days (${freshnessCount} of ${corpusPublished}).`;

	return {
		domainTotal: domain.total,
		corpusPublished,
		freshnessShare90d,
		freshnessShare90dPct: freshnessPct,
		headlineClaim,
		underClaim,
		freshnessClaim,
		generatedAt: corpusStats.generated_at,
		over,
		under,
		datasetUrl: 'https://9takes.com/corpus-stats',
		domainLabel: domain.label
	};
}
