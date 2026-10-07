// src/lib/server/typeCorpusStats.spec.ts
import { describe, expect, it } from 'vitest';
import {
	buildTypeCorpusInsight,
	formatMostCommonDomain,
	getTypeCorpusInsight,
	type CorpusStatsInput
} from './typeCorpusStats';
import corpusStats from '$lib/data/corpus-stats.json';

const domain = (
	slug: string,
	label: string,
	counts: Record<string, number>,
	baseline: Record<string, number>
) => {
	const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
	const share = Object.fromEntries(Object.entries(counts).map(([t, n]) => [t, n / total]));
	return {
		slug,
		label,
		url: `/personality-analysis/categories/${slug}`,
		total,
		counts_by_type: counts,
		share_by_type: share,
		diff_vs_baseline_pp: Object.fromEntries(
			Object.entries(share).map(([t, s]) => [t, Number(((s - baseline[t]) * 100).toFixed(2))])
		)
	};
};

// Small fixture with the Type 3 shape that caused the bug: over-represented in
// Tech, but most Type 3s sit in Film & TV.
const counts = { '1': 10, '2': 10, '3': 30, '4': 20, '5': 10, '6': 10, '7': 10, '8': 10, '9': 10 };
const published = 120;
const baseline = Object.fromEntries(Object.entries(counts).map(([t, n]) => [t, n / published]));
const fixture: CorpusStatsInput = {
	generated_at: '2026-10-06T00:00:00.000Z',
	totals: { published },
	enneagram_distribution: { counts, shares: baseline },
	domains: {
		'film-tv': domain(
			'film-tv',
			'Film & TV',
			{ '1': 6, '2': 6, '3': 14, '4': 8, '5': 4, '6': 6, '7': 6, '8': 6, '9': 6 },
			baseline
		),
		'tech-business': domain(
			'tech-business',
			'Tech, Founders & Business',
			{ '1': 2, '2': 1, '3': 10, '4': 1, '5': 4, '6': 1, '7': 1, '8': 1, '9': 1 },
			baseline
		)
	},
	per_type_domains: {
		'3': {
			total: 30,
			top_domains: [
				{ slug: 'film-tv', label: 'Film & TV', url: '/x', count: 14, share: 14 / 30 },
				{
					slug: 'tech-business',
					label: 'Tech, Founders & Business',
					url: '/y',
					count: 10,
					share: 1 / 3
				}
			]
		},
		'8': {
			total: 10,
			top_domains: [{ slug: 'film-tv', label: 'Film & TV', url: '/x', count: 6, share: 0.6 }]
		}
	}
};

describe('buildTypeCorpusInsight', () => {
	it('keeps the over-represented domain and the most common domain separate', () => {
		const insight = buildTypeCorpusInsight(fixture, '3');
		expect(insight?.variant).toBe('domain-overrep');
		expect(insight?.domainLabel).toBe('Tech, Founders & Business');
		expect(insight?.mostCommonDomainText).toBe('Film & TV (14 of 30)');
	});

	it('labels the callout sample with the population the share is computed over', () => {
		const overRep = buildTypeCorpusInsight(fixture, '3');
		expect(overRep?.sampleSize).toBe(22); // Tech category size, all types
		expect(overRep?.sampleLabel).toBe('Tech, Founders & Business, all types');

		const typeShare = buildTypeCorpusInsight(fixture, '8');
		expect(typeShare?.variant).toBe('type-share');
		expect(typeShare?.sampleSize).toBe(10); // all Type 8s, not the Type 8 count in one domain
		expect(typeShare?.sampleLabel).toBe('All Type 8s');
	});

	it('reports the type share and a tie-aware rank', () => {
		const leader = buildTypeCorpusInsight(fixture, '3');
		expect(leader?.typeSharePct).toBe('25.0%');
		expect(leader?.typeRank).toBe(1);
		expect(leader?.typeRankPhrase).toBe('the most common of the nine types');

		const tied = buildTypeCorpusInsight(fixture, '8');
		expect(tied?.typeRank).toBe(3);
		expect(tied?.typeRankPhrase).toContain('tied with Type 1, Type 2, Type 5');
	});

	it('returns null for a non-type slug', () => {
		expect(buildTypeCorpusInsight(fixture, 'abc')).toBeNull();
	});
});

describe('formatMostCommonDomain', () => {
	it('names every domain tied for the lead', () => {
		expect(
			formatMostCommonDomain({
				total: 45,
				top_domains: [
					{ slug: 'film-tv', label: 'Film & TV', url: '/x', count: 12, share: 0.27 },
					{ slug: 'comedy', label: 'Comedians', url: '/y', count: 12, share: 0.27 },
					{ slug: 'music', label: 'Musicians & Artists', url: '/z', count: 5, share: 0.11 }
				]
			})
		).toBe('Film & TV and Comedians (12 each of 45)');
		expect(formatMostCommonDomain({ total: 3, top_domains: [] })).toBeNull();
	});
});

describe('getTypeCorpusInsight against the live corpus file', () => {
	it("uses each type's top per-type domain as the dominant lane", () => {
		const perType = corpusStats.per_type_domains as Record<
			string,
			{ total: number; top_domains: { label: string; count: number }[] }
		>;
		for (const type of ['3', '5', '9']) {
			const insight = getTypeCorpusInsight(type);
			const top = perType[type].top_domains[0];
			expect(insight?.mostCommonDomainText).toContain(`${top.label} (${top.count}`);
			expect(insight?.typeCount).toBe(perType[type].total);
		}
	});
});
