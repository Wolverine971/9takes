<!-- src/lib/components/marketing/CorpusStatsPanel.svelte -->
<!-- Compact "By the Numbers" corpus panel. Imports the generated stats
	 JSON directly so no data needs to flow through +page.server.ts. -->
<script lang="ts">
	import corpusStats from '$lib/data/corpus-stats.json';

	type DomainStat = {
		slug: string;
		label: string;
		url: string;
		total: number;
		top_over_represented: { type: number; share: number; delta_pp: number };
	};
	type Stats = {
		totals: { published: number; unpublished_drafts: number };
		enneagram_distribution: {
			counts: Record<string, number>;
			shares: Record<string, number>;
		};
		domains: Record<string, DomainStat>;
		pipeline?: {
			in_draft: number;
			published_last_30_days: number;
			published_last_90_days: number;
			avg_new_per_month: number;
		};
	};

	const stats = corpusStats as unknown as Stats;

	const TYPE_LABEL: Record<number, string> = {
		1: 'Type 1',
		2: 'Type 2',
		3: 'Type 3',
		4: 'Type 4',
		5: 'Type 5',
		6: 'Type 6',
		7: 'Type 7',
		8: 'Type 8',
		9: 'Type 9'
	};

	const pct = (n: number) => (n * 100).toFixed(0);
	const fmtDelta = (pp: number) => (pp >= 0 ? `+${pp.toFixed(0)}` : `${pp.toFixed(0)}`);

	const musicians = stats.domains['music'];
	const tech = stats.domains['tech-business'];
	const comedians = stats.domains['comedy'];
	const pipeline = stats.pipeline;

	// Corpus-wide baseline: which type is most common across all profiled figures?
	const topTypeEntry = Object.entries(stats.enneagram_distribution.counts).sort(
		(a, b) => b[1] - a[1]
	)[0];
	const topType = topTypeEntry ? Number(topTypeEntry[0]) : null;
	const topTypeCount = topTypeEntry ? topTypeEntry[1] : 0;
	const topTypeShare = topType !== null ? stats.enneagram_distribution.shares[String(topType)] : 0;

	type Tile = {
		value: string;
		label: string;
		detail: string;
	};

	const tiles: Tile[] = [
		{
			value: `${stats.totals.published}`,
			label: 'profiles analyzed',
			detail: `${stats.totals.unpublished_drafts} drafts in the pipeline`
		},
		musicians && {
			value: `${pct(musicians.top_over_represented.share)}%`,
			label: `Musicians → ${TYPE_LABEL[musicians.top_over_represented.type]}`,
			detail: `${fmtDelta(musicians.top_over_represented.delta_pp)} pp above baseline (n=${musicians.total})`
		},
		tech && {
			value: `${pct(tech.top_over_represented.share)}%`,
			label: `Tech founders → ${TYPE_LABEL[tech.top_over_represented.type]}`,
			detail: `${fmtDelta(tech.top_over_represented.delta_pp)} pp above baseline (n=${tech.total})`
		},
		comedians && {
			value: `${pct(comedians.top_over_represented.share)}%`,
			label: `Comedians → ${TYPE_LABEL[comedians.top_over_represented.type]}`,
			detail: `${fmtDelta(comedians.top_over_represented.delta_pp)} pp above baseline (n=${comedians.total})`
		},
		topType !== null && {
			value: `${pct(topTypeShare)}%`,
			label: `${TYPE_LABEL[topType]} leads the corpus`,
			detail: `${topTypeCount} of ${stats.totals.published} — the most common of nine types`
		},
		pipeline &&
			pipeline.in_draft > 0 && {
				value: `${pipeline.in_draft}`,
				label: 'more in the pipeline',
				detail:
					pipeline.avg_new_per_month >= 1
						? `~${pipeline.avg_new_per_month} new profiles shipping every month`
						: 'being drafted, fact-checked, and polished right now'
			}
	].filter((t): t is Tile => Boolean(t));
</script>

<section class="section corpus-stats-section funnel-section">
	<header class="section-header">
		<div class="section-badge accent">
			<span class="badge-dot"></span>
			<span>BY THE NUMBERS</span>
		</div>
		<h2 class="section-title">The 9takes Corpus, in numbers</h2>
		<p class="section-desc">
			Every stat below is computed from the {stats.totals.published} profiles currently published on
			9takes. Updated automatically on every deploy.
		</p>
	</header>

	<div class="corpus-grid">
		{#each tiles as tile}
			<div class="corpus-tile">
				<div class="tile-value">{tile.value}</div>
				<div class="tile-label">{tile.label}</div>
				<div class="tile-detail">{tile.detail}</div>
			</div>
		{/each}
	</div>

	<div class="section-ctas">
		<a href="/corpus-stats" class="btn-shadow">
			<span>See the full corpus breakdown</span>
		</a>
	</div>
</section>

<style>
	.corpus-stats-section {
		text-align: center;
	}

	.corpus-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.corpus-tile {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		padding: 1.5rem 1.25rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.18);
		border-radius: 14px;
		text-align: left;
		box-shadow: var(--card-shadow-soft), var(--card-highlight);
	}

	.tile-value {
		font-family: var(--font-display);
		font-size: clamp(1.85rem, 3.2vw, 2.4rem);
		font-weight: 700;
		line-height: 1.05;
		color: var(--shadow-flame);
		letter-spacing: -0.02em;
	}

	.tile-label {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.04em;
		color: var(--text-pale);
		text-transform: uppercase;
	}

	.tile-detail {
		font-size: 0.9rem;
		color: var(--text-mist);
		line-height: 1.4;
	}

	.section-ctas {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	@media (max-width: 768px) {
		.corpus-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.corpus-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
