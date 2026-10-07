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
//                       for this type (e.g. Type 8 in the current corpus).
//
// The most over-represented domain and the most common domain are different
// facts (Type 3: over-represented in Tech, but most Type 3s are in Film & TV).
// `domainLabel` is the callout's domain; `mostCommonDomainText` is the "dominant
// lane" by raw count. Never swap one in for the other.

import corpusStats from '$lib/data/corpus-stats.json';
import { describeTypeRank, joinList, rankTypes } from '$lib/utils/corpusTypeRanking';

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
}

interface PerTypeDomain {
	total: number;
	top_domains: { slug: string; label: string; url: string; count: number; share: number }[];
}

/** The slice of corpus-stats.json this module reads. */
export interface CorpusStatsInput {
	generated_at: string;
	totals: { published: number };
	enneagram_distribution: { counts: Record<string, number>; shares: Record<string, number> };
	domains: Record<string, DomainStat>;
	per_type_domains: Record<string, PerTypeDomain>;
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
	/** Population the claim's share is computed over, for the callout's "n=" label. */
	sampleSize: number;
	/** Names that population: "Tech, Founders & Business, all types" or "All Type 8s". */
	sampleLabel: string;
	/** Profiles of this type in the corpus. */
	typeCount: number;
	/** This type's share of all published profiles: "18.0%". */
	typeSharePct: string;
	/** Competition rank by count (1 = most common). Ties share a rank. */
	typeRank: number;
	/** "the most common of the nine types", "tied with Type 2 for the least common…" */
	typeRankPhrase: string;
	/** Most common domain(s) for this type by raw count: "Film & TV (27 of 81)". */
	mostCommonDomainText: string | null;
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
function pickDomainOverrep(stats: CorpusStatsInput, typeKey: string): DomainStat | null {
	let best: { domain: DomainStat; delta: number } | null = null;

	for (const domain of Object.values(stats.domains)) {
		const delta = domain.diff_vs_baseline_pp[typeKey];
		const count = domain.counts_by_type[typeKey];
		if (typeof delta !== 'number' || typeof count !== 'number') continue;

		const strong = (delta >= 5 && count >= 6) || (delta >= 8 && count >= 4);
		if (!strong) continue;

		if (!best || delta > best.delta) {
			best = { domain, delta };
		}
	}

	return best?.domain ?? null;
}

/**
 * "Film & TV (27 of 81)", or for a tie "Film & TV and Comedians (12 each of 45)".
 * top_domains is already sorted by count, largest first.
 */
export function formatMostCommonDomain(perType: PerTypeDomain | undefined): string | null {
	const top = perType?.top_domains ?? [];
	if (!perType || top.length === 0 || top[0].count <= 0) return null;
	const leaders = top.filter((domain) => domain.count === top[0].count);
	const labels = joinList(leaders.map((domain) => domain.label));
	return leaders.length > 1
		? `${labels} (${top[0].count} each of ${perType.total})`
		: `${labels} (${top[0].count} of ${perType.total})`;
}

export function buildTypeCorpusInsight(
	stats: CorpusStatsInput,
	typeSlug: string
): TypeCorpusInsight | null {
	const typeKey = String(typeSlug);
	const typeNames = TYPE_NAMES[typeKey];
	if (!typeNames) return null;

	const corpusPublished = stats.totals.published;
	const generatedAt = stats.generated_at;
	const counts = stats.enneagram_distribution.counts;
	const typeCount = counts[typeKey] ?? 0;
	const typeShare = stats.enneagram_distribution.shares[typeKey] ?? 0;
	const typeRank = rankTypes(counts).find((entry) => entry.type === typeKey)?.rank ?? 0;
	const perType = stats.per_type_domains[typeKey];

	const typeFacts = {
		typeCount,
		typeSharePct: formatPct(typeShare),
		typeRank,
		typeRankPhrase: describeTypeRank(counts, typeKey),
		mostCommonDomainText: formatMostCommonDomain(perType),
		generatedAt
	};

	const overRepDomain = pickDomainOverrep(stats, typeKey);

	if (overRepDomain) {
		const count = overRepDomain.counts_by_type[typeKey];
		const share = overRepDomain.share_by_type[typeKey];
		const delta = overRepDomain.diff_vs_baseline_pp[typeKey];
		const sharePct = formatPct(share);
		const deltaPpFormatted = formatDeltaSigned(delta);

		const claim = `Among the ${overRepDomain.total} profiles in the 9takes ${overRepDomain.label} category, ${typeNames.full} is over-represented at ${sharePct}, ${delta.toFixed(2)} percentage points above its ${typeFacts.typeSharePct} share of all ${corpusPublished} profiles.`;

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
			sampleSize: overRepDomain.total,
			sampleLabel: `${overRepDomain.label}, all types`,
			...typeFacts
		};
	}

	// Fallback: type-share stat (e.g. "33.3% of profiled Type 8s are in Film & TV")
	if (!perType || perType.top_domains.length === 0) return null;

	const top = perType.top_domains[0];
	const sharePct = formatPct(top.share);
	const coLeaders = perType.top_domains
		.slice(1)
		.filter((domain) => domain.count === top.count)
		.map((domain) => domain.label);
	const leadClause = coLeaders.length
		? `tied with ${joinList(coLeaders)} as the most common domain for this type in the corpus`
		: 'making it the most common domain for this type in the corpus';

	// Starts with "Of the…" rather than the share: the callout already prints
	// the share in large type right before this sentence.
	const claim = `Of the ${perType.total} ${typeNames.full} profiles on 9takes, ${sharePct} (${top.count} of ${perType.total}) work in ${top.label}, ${leadClause}.`;

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
		sampleSize: perType.total,
		sampleLabel: `All Type ${typeKey}s`,
		...typeFacts
	};
}

export function getTypeCorpusInsight(typeSlug: string): TypeCorpusInsight | null {
	return buildTypeCorpusInsight(corpusStats as unknown as CorpusStatsInput, typeSlug);
}
