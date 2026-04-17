<!-- src/routes/corpus-stats/+page.svelte -->
<!-- Full dataset view of the 9takes corpus stats. Structured so Google + -->
<!-- LLMs can cite specific claims. Tables are flat; per-domain breakdowns -->
<!-- live inside <details> so the page scans cleanly without hiding content. -->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import CorpusStatsTable from '$lib/components/marketing/CorpusStatsTable.svelte';
	import CorpusStatsComparisonSection from '$lib/components/marketing/CorpusStatsComparisonSection.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type DomainStat = {
		slug: string;
		label: string;
		url: string;
		total: number;
		counts_by_type: Record<string, number>;
		share_by_type: Record<string, number>;
		diff_vs_baseline_pp: Record<string, number>;
		top_over_represented: { type: number; share: number; count: number; delta_pp: number };
		top_under_represented: { type: number; share: number; count: number; delta_pp: number };
	};
	type PerTypeDomain = {
		total: number;
		top_domains: { slug: string; label: string; url: string; count: number; share: number }[];
	};
	type Pipeline = {
		in_draft: number;
		published_last_30_days: number;
		published_last_90_days: number;
		avg_new_per_month: number;
	};
	type Stats = {
		generated_at: string;
		totals: {
			published: number;
			unpublished_drafts: number;
		};
		enneagram_distribution: {
			counts: Record<string, number>;
			shares: Record<string, number>;
		};
		domains: Record<string, DomainStat>;
		per_type_domains: Record<string, PerTypeDomain>;
		pipeline?: Pipeline;
		min_domain_size: number;
		citable_claims: string[];
	};

	const stats = $derived(data.stats as unknown as Stats);

	const TYPE_NAMES: Record<number, string> = {
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

	const pct = (n: number) => (n * 100).toFixed(1);
	const fmtDate = (iso: string) => {
		try {
			return new Date(iso).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return iso.slice(0, 10);
		}
	};

	const headline = $derived(
		`The 9takes Corpus: Enneagram Type Distribution Across ${stats.totals.published} Public Figures`
	);
	const description = $derived(
		`Type distribution, over- and under-representation by profession, and publishing pipeline across ${stats.totals.published} published profiles on 9takes. Regenerated on every deploy.`
	);
</script>

<SEOHead
	title="9takes Corpus Stats"
	{description}
	canonical="https://9takes.com/corpus-stats"
	jsonLd={data.jsonLd}
/>

<div class="corpus-page">
	<article class="content">
		<!-- ========== HERO ========== -->
		<header class="page-hero">
			<div class="hero-badge">
				<span class="badge-dot"></span>
				<span>PUBLIC DATASET</span>
			</div>
			<h1>{headline}</h1>
			<p class="hero-lede">
				This is what {stats.totals.published} profiles actually show. Every number on this page is computed
				from the 9takes celebrity database and regenerated on every deploy.
			</p>
			<p class="hero-meta">
				Last generated: <time datetime={stats.generated_at}>{fmtDate(stats.generated_at)}</time>
				· <a href="/corpus-stats.json">Download raw JSON</a>
			</p>
		</header>

		<!-- ========== TL;DR ========== -->
		<section class="page-section">
			<h2>TL;DR</h2>
			<ul class="tldr-list">
				{#each stats.citable_claims.slice(0, 3) as claim}
					<li>{claim}</li>
				{/each}
			</ul>
		</section>

		<!-- ========== CORPUS TOTALS ========== -->
		<section class="page-section">
			<h2>Corpus Totals</h2>
			<div class="totals-row">
				<div class="total-tile accent">
					<div class="total-value">{stats.totals.published}</div>
					<div class="total-label">Published profiles</div>
				</div>
				<div class="total-tile">
					<div class="total-value">{stats.totals.unpublished_drafts}</div>
					<div class="total-label">Drafts in pipeline</div>
				</div>
			</div>
			<p class="note">
				All percentages, deltas, and domain breakdowns below are computed against the published set
				only.
			</p>
		</section>

		<!-- ========== ENNEAGRAM DISTRIBUTION ========== -->
		<section class="page-section">
			<h2>Enneagram Type Distribution</h2>
			<p class="lede">
				How the corpus-wide baseline is split across the nine types. Type 3 (Achiever) leads at
				{pct(stats.enneagram_distribution.shares['3'])}%.
			</p>
			<CorpusStatsTable
				counts={stats.enneagram_distribution.counts}
				shares={stats.enneagram_distribution.shares}
				caption="Corpus baseline, all published profiles"
			/>
		</section>

		<!-- ========== DOMAINS ========== -->
		<section class="page-section">
			<h2>Type Distribution by Domain</h2>
			<p class="lede">
				Each domain with at least {stats.min_domain_size} profiled figures gets its own 9-row breakdown.
				"Δ vs baseline" is the percentage-point difference between the domain's type share and the corpus-wide
				share above. Positive means over-represented relative to 9takes itself, not vs. the general population.
			</p>

			{#each Object.values(stats.domains) as domain (domain.slug)}
				<details class="domain-block">
					<summary>
						<span class="domain-name">
							<a href={domain.url}>{domain.label}</a>
						</span>
						<span class="domain-meta">
							n={domain.total} · top over: {TYPE_NAMES[domain.top_over_represented.type]} at {pct(
								domain.top_over_represented.share
							)}% ({domain.top_over_represented.delta_pp >= 0 ? '+' : ''}{domain
								.top_over_represented.delta_pp} pp)
						</span>
					</summary>

					<CorpusStatsTable
						counts={domain.counts_by_type}
						shares={domain.share_by_type}
						diffsPp={domain.diff_vs_baseline_pp}
					/>

					<p class="domain-claim">
						<strong>Most over-represented:</strong>
						{TYPE_NAMES[domain.top_over_represented.type]} at
						{pct(domain.top_over_represented.share)}% ({domain.top_over_represented.delta_pp >= 0
							? '+'
							: ''}{domain.top_over_represented.delta_pp} pp above baseline, n={domain
							.top_over_represented.count}).
					</p>
					<p class="domain-claim">
						<strong>Most under-represented:</strong>
						{TYPE_NAMES[domain.top_under_represented.type]} at
						{pct(domain.top_under_represented.share)}% ({domain.top_under_represented.delta_pp} pp, n={domain
							.top_under_represented.count}).
					</p>
				</details>
			{/each}
		</section>

		<!-- ========== PER-TYPE TOP DOMAINS ========== -->
		<section class="page-section">
			<h2>Most Common Domains per Enneagram Type</h2>
			<p class="lede">
				For each type we profile, which domains dominate? The top three are listed by profile count
				within that type, linked to the full category page.
			</p>
			<ul class="per-type-list">
				{#each Object.entries(stats.per_type_domains) as [type, entry] (type)}
					<li>
						<span class="per-type-label">{TYPE_NAMES[Number(type)]}</span>
						<span class="per-type-total">n={entry.total}</span>
						<span class="per-type-domains">
							{#if entry.top_domains.length === 0}
								—
							{:else}
								{#each entry.top_domains as d, i}
									{#if i > 0},
									{/if}
									<a href={d.url}>{d.label}</a> ({d.count}, {pct(d.share)}%)
								{/each}
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- ========== COMPARISON TO PUBLIC DATA ========== -->
		<CorpusStatsComparisonSection />

		<!-- ========== PIPELINE ========== -->
		{#if stats.pipeline}
			<section class="page-section">
				<h2>Pipeline</h2>
				<p class="lede">
					Proof the corpus is active, not frozen. Drafts in review + monthly shipping cadence show
					new profiles are arriving on a regular beat.
				</p>
				<ul class="kv-list">
					<li>
						<strong>In draft / review pipeline:</strong>
						{stats.pipeline.in_draft}
					</li>
					<li>
						<strong>Published in last 30 days:</strong>
						{stats.pipeline.published_last_30_days}
					</li>
					<li>
						<strong>Published in last 90 days:</strong>
						{stats.pipeline.published_last_90_days}
					</li>
					<li>
						<strong>Average new profiles / month (trailing 90d):</strong>
						~{stats.pipeline.avg_new_per_month}
					</li>
				</ul>
			</section>
		{/if}

		<!-- ========== METHODOLOGY ========== -->
		<section class="page-section">
			<h2>Methodology</h2>
			<ul class="kv-list">
				<li>
					<strong>Source:</strong> The 9takes public-figure corpus — one row per profiled person.
				</li>
				<li>
					<strong>Scope:</strong> Published profiles only. Drafts are excluded from every percentage,
					delta, and domain breakdown on this page.
				</li>
				<li>
					<strong>Domain buckets:</strong> Each profile carries one or more profession tags, grouped
					into the same readable categories surfaced at
					<a href="/personality-analysis/categories">/personality-analysis/categories</a>. Domains
					with fewer than {stats.min_domain_size} profiled figures are omitted to avoid small-sample
					noise.
				</li>
				<li>
					<strong>Over/under-representation:</strong> Each domain's type share minus the corpus-wide
					baseline share, expressed in percentage points. Positive values mean a type is over-represented
					on 9takes relative to the rest of 9takes — not relative to the general population.
				</li>
				<li>
					<strong>Multi-domain figures:</strong> A person tagged as both a musician and an activist is
					counted in both domains.
				</li>
			</ul>
		</section>

		<!-- ========== CITABLE CLAIMS ========== -->
		<section class="page-section">
			<h2>Ready-to-Cite Claims</h2>
			<p class="lede">
				These are pre-computed sentences safe to quote verbatim. Cite the generation date and a link
				to this page.
			</p>
			<div class="claims">
				{#each stats.citable_claims as claim}
					<blockquote>{claim}</blockquote>
				{/each}
			</div>
		</section>

		<!-- ========== DOWNLOAD ========== -->
		<section class="page-section">
			<h2>Raw Dataset</h2>
			<p class="lede">
				Want the underlying numbers? Download the raw JSON. Structured for schema.org
				<code>Dataset</code> consumers and LLM ingestion.
			</p>
			<p>
				<a class="download-link" href="/corpus-stats.json" download>→ corpus-stats.json</a>
			</p>
		</section>
	</article>
</div>

<style>
	.corpus-page {
		background: var(--bg-base);
		color: var(--text-primary);
		min-height: 100vh;
		padding: 3rem 0 5rem;
	}

	.content {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	.page-hero {
		text-align: left;
		padding-bottom: 2.5rem;
		border-bottom: 1px solid var(--border-color);
		margin-bottom: 2.5rem;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(45, 212, 191, 0.08);
		border: 1px solid rgba(45, 212, 191, 0.2);
		border-radius: 4px;
		margin-bottom: 1.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--shadow-flame, var(--primary));
	}
	.badge-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--shadow-flame, var(--primary));
		box-shadow: 0 0 8px var(--primary);
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(1.85rem, 4.2vw, 2.75rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.015em;
		margin: 0 0 0.85rem;
		color: var(--text-primary);
		text-wrap: balance;
	}

	.hero-lede {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-secondary);
		max-width: 680px;
		margin: 0 0 0.75rem;
	}

	.hero-meta {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin: 0;
	}
	.hero-meta a {
		color: var(--shadow-flame, var(--primary));
	}

	.page-section {
		margin-bottom: 3rem;
	}
	.page-section h2 {
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 2.4vw, 1.65rem);
		font-weight: 700;
		margin: 0 0 0.75rem;
		color: var(--text-primary);
	}
	.page-section p.lede {
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0 0 1rem;
		max-width: 720px;
	}
	.page-section .note {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-top: 0.75rem;
	}

	/* ===== TL;DR ===== */
	.tldr-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.85rem;
	}
	.tldr-list li {
		padding: 1rem 1.15rem;
		background: linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border: 1px solid rgba(45, 212, 191, 0.18);
		border-left: 3px solid var(--shadow-flame, var(--primary));
		border-radius: 10px;
		line-height: 1.55;
	}

	/* ===== Totals row ===== */
	.totals-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	.total-tile {
		padding: 1.25rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 10px;
		background: var(--bg-surface);
	}
	.total-tile.accent {
		border-color: rgba(45, 212, 191, 0.35);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--primary) 4%, var(--bg-surface)) 0%,
			var(--bg-deep) 100%
		);
	}
	.total-value {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 700;
		color: var(--shadow-flame, var(--primary));
		line-height: 1;
	}
	.total-label {
		margin-top: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-mist, var(--text-secondary));
	}

	/* ===== Domain details ===== */
	.domain-block {
		border: 1px solid var(--border-color);
		border-radius: 10px;
		margin-bottom: 0.75rem;
		background: var(--bg-surface);
	}
	.domain-block summary {
		cursor: pointer;
		padding: 0.9rem 1.15rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: baseline;
		justify-content: space-between;
	}
	.domain-block summary::-webkit-details-marker {
		display: none;
	}
	.domain-name {
		font-weight: 700;
		font-family: var(--font-display);
		font-size: 1.05rem;
	}
	.domain-name a {
		color: var(--shadow-flame, var(--primary));
		text-decoration: none;
	}
	.domain-name a:hover {
		text-decoration: underline;
	}
	.domain-meta {
		color: var(--text-mist, var(--text-secondary));
		font-size: 0.9rem;
	}
	.domain-block[open] {
		padding-bottom: 1rem;
	}
	.domain-block[open] summary {
		border-bottom: 1px solid var(--border-color);
		margin-bottom: 0.75rem;
	}
	.domain-block :global(.corpus-table) {
		margin: 0 1.15rem 1rem;
		width: calc(100% - 2.3rem);
	}
	.domain-claim {
		margin: 0.25rem 1.15rem 0.5rem;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	/* ===== Per-type list ===== */
	.per-type-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.per-type-list li {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		padding: 0.6rem 0;
		border-bottom: 1px solid var(--border-color);
	}
	.per-type-label {
		font-weight: 700;
		min-width: 12rem;
		color: var(--shadow-flame, var(--primary));
	}
	.per-type-total {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--text-mist, var(--text-secondary));
		min-width: 4rem;
	}
	.per-type-domains {
		color: var(--text-secondary);
		flex: 1 1 18rem;
	}

	/* ===== Key-value + quality table ===== */
	.kv-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.kv-list li {
		padding: 0.45rem 0;
		border-bottom: 1px solid var(--border-color);
		line-height: 1.5;
	}
	.kv-list code,
	.page-section code {
		font-family: var(--font-mono);
		font-size: 0.88em;
		background: var(--bg-deep);
		padding: 0.08em 0.35em;
		border-radius: 4px;
	}

	/* ===== Claims ===== */
	.claims blockquote {
		margin: 0 0 0.85rem;
		padding: 0.85rem 1.1rem;
		border-left: 3px solid var(--shadow-flame, var(--primary));
		background: var(--bg-surface);
		color: var(--text-primary);
		border-radius: 0 8px 8px 0;
		line-height: 1.55;
		font-size: 0.98rem;
	}

	/* ===== Download ===== */
	.download-link {
		display: inline-block;
		padding: 0.55rem 0.95rem;
		border: 1px solid rgba(45, 212, 191, 0.35);
		border-radius: 8px;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--shadow-flame, var(--primary));
		text-decoration: none;
		background: var(--bg-surface);
	}
	.download-link:hover {
		background: color-mix(in srgb, var(--primary) 8%, var(--bg-surface));
	}

	@media (max-width: 640px) {
		.totals-row {
			grid-template-columns: 1fr;
		}
		.per-type-label {
			min-width: 0;
		}
	}
</style>
