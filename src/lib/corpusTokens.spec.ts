// src/lib/corpusTokens.spec.ts
import { describe, expect, it } from 'vitest';
import corpusStats from '$lib/data/corpus-stats.json';
import {
	buildCorpusTokenTable,
	checkCorpusAssertions,
	findCorpusTokens,
	resolveCorpusTokens
} from './corpusTokens.js';

const stats = {
	generated_at: '2026-11-20T04:25:17.570Z',
	totals: { published: 100, unpublished_drafts: 7 },
	enneagram_distribution: {
		counts: { 1: 5, 2: 4, 3: 20, 4: 15, 5: 8, 6: 12, 7: 14, 8: 11, 9: 11 },
		shares: { 1: 0.05, 2: 0.04, 3: 0.2, 4: 0.15, 5: 0.08, 6: 0.12, 7: 0.14, 8: 0.11, 9: 0.11 }
	},
	domains: {
		music: {
			slug: 'music',
			label: 'Music',
			url: '/personality-analysis/categories/music',
			total: 20,
			counts_by_type: { 1: 0, 2: 1, 3: 4, 4: 9, 5: 0, 6: 1, 7: 2, 8: 1, 9: 2 },
			share_by_type: { 1: 0, 2: 0.05, 3: 0.2, 4: 0.45, 5: 0, 6: 0.05, 7: 0.1, 8: 0.05, 9: 0.1 },
			diff_vs_baseline_pp: { 1: -5, 2: 1, 3: 0, 4: 30, 5: -8, 6: -7, 7: -4, 8: -6, 9: -1 },
			top_over_represented: { type: 4, share: 0.45, count: 9, delta_pp: 30 },
			top_under_represented: { type: 5, share: 0, count: 0, delta_pp: -8 }
		},
		comedy: {
			slug: 'comedy',
			label: 'Comedy',
			url: '/personality-analysis/categories/comedy',
			total: 10,
			counts_by_type: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0, 6: 1, 7: 6, 8: 1, 9: 1 },
			share_by_type: { 1: 0, 2: 0, 3: 0.1, 4: 0, 5: 0, 6: 0.1, 7: 0.6, 8: 0.1, 9: 0.1 },
			diff_vs_baseline_pp: { 1: -5, 2: -4, 3: -10, 4: -15, 5: -8, 6: -2, 7: 46, 8: -1, 9: -1 },
			top_over_represented: { type: 7, share: 0.6, count: 6, delta_pp: 46 },
			top_under_represented: { type: 4, share: 0, count: 0, delta_pp: -15 }
		}
	},
	per_type_domains: {
		4: {
			total: 15,
			top_domains: [{ slug: 'music', label: 'Music', url: '/x', count: 9, share: 0.6 }]
		}
	},
	pipeline: { in_draft: 7, avg_new_per_month: 3.3, published_last_30_days: 2 },
	freshness: { updated_last_90_days: 40, share_updated_last_90_days: 0.4 }
};

describe('corpus tokens', () => {
	const table = buildCorpusTokenTable(stats);

	it('formats whole-corpus, type, rank and domain values', () => {
		expect(
			resolveCorpusTokens(
				'{{corpus.total}} profiles; {{corpus.rank.1.name}} leads at {{corpus.rank.1.share}}; rarest {{corpus.rank.9.short}}; as of {{corpus.as-of}}',
				table
			)
		).toBe('100 profiles; Type 3 (Achiever) leads at 20.0%; rarest Type 2; as of November 2026');
		expect(
			resolveCorpusTokens(
				'{{corpus.domain.music.type.4.count}} of {{ corpus.domain.music.total }} ({{corpus.domain.music.type.4.share}}, {{corpus.domain.music.type.4.delta}} points); {{corpus.domain.music.type.5.delta}}',
				table
			)
		).toBe('9 of 20 (45.0%, +30.0 points); −8.0');
	});

	it('exposes share-of-type, home field and the most skewed field', () => {
		expect(table.get('domain.music.type.4.of-type')).toBe('60.0%'); // 9 of 15 Fours
		expect(table.get('type.4.top-domain')).toBe('music');
		expect(table.get('skew.1.domain')).toBe('comedy');
		expect(table.get('domain.music.rank.2.name')).toBe('Type 3 (Achiever)');
	});

	it('throws on an unknown token by default and honors onMissing', () => {
		expect(() => resolveCorpusTokens('{{corpus.domain.nope.total}}', table)).toThrow(
			/Unknown corpus token/
		);
		expect(resolveCorpusTokens('{{corpus.nope}}', table, { onMissing: () => '?' })).toBe('?');
	});

	it('checks corpus-assert claims, including alternatives', () => {
		const text = [
			'<!-- corpus-assert: domain.music.top.type = 4 -->',
			'<!-- corpus-assert: rank.9.type = 1|2 -->',
			'<!-- corpus-assert: domain.comedy.top.type = 3 -->',
			'<!-- corpus-assert: domain.gone.top.type = 3 -->'
		].join('\n');
		expect(checkCorpusAssertions(text, table)).toEqual([
			'claims domain.comedy.top.type = 3, data now says 7',
			'corpus-assert on unknown path "domain.gone.top.type"'
		]);
	});

	it('finds token paths', () => {
		expect(findCorpusTokens('a {{corpus.total}} b {{corpus.Domain.music.total}}')).toEqual([
			'total',
			'domain.music.total'
		]);
	});

	it('builds a table from the committed corpus-stats.json', () => {
		const live = buildCorpusTokenTable(corpusStats);
		expect(live.get('total')).toBe(String(corpusStats.totals.published));
		expect(live.has('domain.music.type.4.share')).toBe(true);
	});
});
