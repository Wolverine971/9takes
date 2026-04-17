<!-- src/lib/components/marketing/CorpusStatsComparisonSection.svelte -->
<!-- Joins the 9takes corpus distribution with published public-data sources
	 (enneagram-personality.com, Truity) and academic validity references.
	 Lives on /corpus-stats after the per-type-domains section. -->
<script lang="ts">
	import corpusStats from '$lib/data/corpus-stats.json';
	import externalStats from '$lib/data/corpus-stats-external.json';

	type ExternalSource = {
		id: string;
		name: string;
		short_name: string;
		url: string;
		methodology: string;
		sample_size: number;
		date_range: string;
		complete: boolean;
		type_shares: Record<string, number>;
		notes: string;
	};
	type CredibilityReference = {
		id: string;
		name: string;
		citation: string;
		url: string;
		sample_size: number | null;
		contribution: string;
	};
	type External = {
		last_reviewed: string;
		sources: ExternalSource[];
		credibility_references: CredibilityReference[];
	};

	const external = externalStats as unknown as External;

	const TYPE_NAMES: Record<number, string> = {
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

	const pct = (n: number | null | undefined) =>
		n === null || n === undefined ? '—' : `${(n * 100).toFixed(1)}%`;
	const fmtDelta = (pp: number | null) => {
		if (pp === null) return '—';
		return pp >= 0 ? `+${pp.toFixed(1)}` : pp.toFixed(1);
	};
	const fmtN = (n: number) => {
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${Math.round(n / 1000)}k`;
		return String(n);
	};

	const primarySource = external.sources.find((s) => s.id === 'enneagram_personality_com')!;
	const secondarySource = external.sources.find((s) => s.id === 'truity')!;

	const corpusShares = corpusStats.enneagram_distribution.shares as Record<string, number>;
	const corpusTotal = corpusStats.totals.published;

	type Row = {
		type: number;
		name: string;
		corpusShare: number;
		primaryShare: number | null;
		secondaryShare: number | null;
		deltaVsPrimaryPp: number | null;
	};

	const rows: Row[] = Array.from({ length: 9 }, (_, i) => {
		const t = i + 1;
		const key = String(t);
		const corpusShare = corpusShares[key] ?? 0;
		const primaryShare = primarySource.type_shares[key] ?? null;
		const secondaryShare = secondarySource.type_shares[key] ?? null;
		const deltaVsPrimaryPp =
			primaryShare !== null ? +((corpusShare - primaryShare) * 100).toFixed(2) : null;
		return {
			type: t,
			name: TYPE_NAMES[t],
			corpusShare,
			primaryShare,
			secondaryShare,
			deltaVsPrimaryPp
		};
	});

	// Per-type interpretive copy. Keyed by Enneagram type number. We render
	// entries only when |Δ vs primary| ≥ 3 pp OR the entry has a narrative
	// reason to appear (e.g., Type 7 sits inside a source conflict).
	const INTERPRETATIONS: Record<number, { heading: string; body: string }> = {
		3: {
			heading: 'Type 3 (Achiever) — the corpus leans heavily into achievement',
			body: 'The biggest over-representation on the page. Type 3 sits near 20% of the 9takes corpus versus roughly 10% of the largest online test-taker sample. The explanation is not mysterious: becoming a publicly-documented figure is already an Achiever-shaped outcome. Our corpus selects for visibility and resume, which selects for Type 3.'
		},
		8: {
			heading: 'Type 8 (Challenger) — power and presence bias',
			body: 'Challengers run companies, enter politics, and get profiled. At 11.9% the corpus sits above online test-taker baselines but below what Truity reports (15%). Treat this as a "public-figure" effect more than a "9takes" effect — every corpus of well-known people will over-index on Type 8.'
		},
		9: {
			heading: 'Type 9 (Peacemaker) — the invisible majority',
			body: 'The opposite story. Type 9 is the single most common type in online test-taker samples (16.5%) and one of the least-represented in ours (9.2%). Peacemakers hold groups together from the inside; that kind of work rarely produces a Wikipedia page. This gap is one of the best arguments that the 9takes corpus is a public-figure sample, not a population sample.'
		},
		1: {
			heading: 'Type 1 (Reformer) — modestly under-represented',
			body: "At 7.2% versus 11.5% online, Reformers run about four points light. Expect this to drift upward as the corpus grows toward politicians, judges, and activist founders — the kinds of public figures that frequently type as Type 1 but we haven't yet profiled in numbers."
		},
		6: {
			heading: 'Type 6 (Loyalist) — common online, less so in public-figure data',
			body: 'Loyalists over-index in test-taker samples (13.8%) and under-index in our corpus (9.6%). Part of this is that anxiety-linked types engage with typology tools at higher rates. Part of it is that skepticism and loyalty do not automatically make a person famous.'
		},
		7: {
			heading: 'Type 7 (Enthusiast) — the source-of-truth problem',
			body: 'The 9takes corpus shows Type 7 at 14.3%, essentially matching enneagram-personality.com (13.6%). But Truity, with a very large sample of its own, calls Type 7 the single rarest type at 9%. The two largest public sources disagree on Type 7 by more than they disagree on any other type. Treat any Type 7 comparison as noisy until the disagreement is resolved.'
		}
	};

	const divergenceInterpretations = rows
		.filter((r) => INTERPRETATIONS[r.type])
		.sort((a, b) => Math.abs(b.deltaVsPrimaryPp ?? 0) - Math.abs(a.deltaVsPrimaryPp ?? 0))
		.map((r) => ({
			...INTERPRETATIONS[r.type],
			type: r.type,
			delta: r.deltaVsPrimaryPp,
			share: r.corpusShare
		}));
</script>

<section class="comparison-section page-section">
	<h2>Comparison to Published Enneagram Distributions</h2>

	<p class="lede">
		Our 293-profile corpus, put next to the two largest public Enneagram datasets that actually
		publish numbers. The point is not to crown a "correct" distribution — it's to make our sample
		bias legible.
	</p>

	<!-- ========== HONEST-SAMPLE CAVEAT ========== -->
	<aside class="caveat-box" aria-label="Methodology caveat">
		<h3>What we are and aren't</h3>
		<p>
			The 9takes corpus is a non-random sample of well-documented public figures. It is
			<strong>not</strong>
			a representative population sample. When our numbers diverge from test-taker datasets like
			Truity or enneagram-personality.com, the divergence is usually a story about <em>our</em> sample
			— which types become famous, who gets written about, which professions we lean toward — not about
			which dataset is "right." This section exists to make those sample biases legible, not to claim
			a true population distribution.
		</p>
		<p class="sub">
			Sources last reviewed {external.last_reviewed}. See
			<a href="/corpus-stats.json">raw JSON</a>
			for the underlying numbers.
		</p>
	</aside>

	<!-- ========== JOINED TABLE ========== -->
	<div class="table-wrap">
		<table class="comparison-table">
			<caption>
				9takes corpus vs two largest public Enneagram test-taker datasets. Shares in %.
			</caption>
			<thead>
				<tr>
					<th scope="col">Type</th>
					<th scope="col">Name</th>
					<th scope="col" class="num">
						9takes
						<span class="col-sub">n={corpusTotal}</span>
					</th>
					<th scope="col" class="num">
						{primarySource.short_name}
						<span class="col-sub">n≈{fmtN(primarySource.sample_size)}</span>
					</th>
					<th scope="col" class="num">
						{secondarySource.short_name}
						<span class="col-sub">n≈{fmtN(secondarySource.sample_size)}</span>
					</th>
					<th scope="col" class="num">Δ vs {primarySource.short_name}</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.type)}
					<tr>
						<th scope="row">{row.type}</th>
						<td>{row.name}</td>
						<td class="num corpus">{pct(row.corpusShare)}</td>
						<td class="num">{pct(row.primaryShare)}</td>
						<td class="num">
							{pct(row.secondaryShare)}
							{#if row.secondaryShare === null}
								<span class="missing-note" title="Truity has not published this type's share"
									>n/d</span
								>
							{/if}
						</td>
						<td
							class="num"
							class:pos={row.deltaVsPrimaryPp !== null && row.deltaVsPrimaryPp >= 3}
							class:neg={row.deltaVsPrimaryPp !== null && row.deltaVsPrimaryPp <= -3}
						>
							{fmtDelta(row.deltaVsPrimaryPp)} pp
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="table-note">
		<strong>n/d</strong> = not disclosed. Truity has never published a consolidated 9-type table —
		only Types 5, 7, 8, and 9 have explicit shares on record.
	</p>

	<!-- ========== DIVERGENCE INTERPRETATIONS ========== -->
	<div class="interpretations">
		<h3>Where the 9takes corpus diverges, and why</h3>
		<p class="lede-sub">
			Types ordered by absolute delta against
			{primarySource.short_name}. Entries below are written, not generated — each one is a working
			hypothesis for why our sample moves the way it does.
		</p>

		{#each divergenceInterpretations as intp (intp.type)}
			<article class="interpretation">
				<header class="interpretation-head">
					<span class="interpretation-type">Type {intp.type}</span>
					<span
						class="interpretation-delta"
						class:pos={intp.delta !== null && intp.delta >= 0}
						class:neg={intp.delta !== null && intp.delta < 0}
					>
						{fmtDelta(intp.delta)} pp vs {primarySource.short_name}
					</span>
				</header>
				<h4>{intp.heading}</h4>
				<p>{intp.body}</p>
			</article>
		{/each}
	</div>

	<!-- ========== CONFLICT NOTE ========== -->
	<aside class="conflict-note">
		<h3>One more thing: the "equal distribution" claim</h3>
		<p>
			Enneagram discourse sometimes cites an "11.11% per type" baseline — the idea that every type
			is equally common in the general population. No primary empirical source supports that number.
			It's a theoretical prior, not a finding. The actual public data (when it exists at all) shows
			uneven distributions with Type 5 consistently rare and Type 9 consistently common.
		</p>
	</aside>

	<!-- ========== SOURCES ========== -->
	<div class="sources">
		<h3>Public Data Sources</h3>
		<ul class="source-list">
			{#each external.sources as src (src.id)}
				<li>
					<div class="source-name">
						<a href={src.url} rel="noopener" target="_blank">{src.name}</a>
					</div>
					<div class="source-meta">
						n = {src.sample_size.toLocaleString()} · {src.date_range}
						{#if !src.complete}
							· <span class="partial-tag">partial table</span>
						{/if}
					</div>
					<div class="source-methodology">
						<strong>Methodology.</strong>
						{src.methodology}
					</div>
					<div class="source-notes">{src.notes}</div>
				</li>
			{/each}
		</ul>

		<h3>Academic Context</h3>
		<p class="lede-sub">
			None of the peer-reviewed Enneagram research below publishes a per-type population
			distribution. They're listed here as the validity backbone — proof the Enneagram has been
			studied in psychology journals, not merely in self-help — not as chart data. That distinction
			is the whole reason this page exists.
		</p>
		<ul class="source-list academic">
			{#each external.credibility_references as ref (ref.id)}
				<li>
					<div class="source-name">
						<a href={ref.url} rel="noopener" target="_blank">{ref.name}</a>
						{#if ref.sample_size !== null}
							<span class="source-meta-inline">n = {ref.sample_size.toLocaleString()}</span>
						{/if}
					</div>
					<div class="source-citation">{ref.citation}</div>
					<div class="source-contribution">{ref.contribution}</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.comparison-section :global(*) {
		box-sizing: border-box;
	}

	h2 {
		font-family: var(--font-display);
		font-size: clamp(1.3rem, 2.4vw, 1.65rem);
		font-weight: 700;
		margin: 0 0 0.75rem;
		color: var(--text-primary);
	}
	h3 {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
		color: var(--text-primary);
	}
	h4 {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		margin: 0.25rem 0 0.5rem;
		color: var(--text-primary);
	}
	p {
		line-height: 1.55;
		color: var(--text-secondary);
		margin: 0 0 0.75rem;
		max-width: 720px;
	}
	p.lede {
		margin: 0 0 1.25rem;
	}
	p.lede-sub {
		color: var(--text-mist, var(--text-secondary));
		font-size: 0.95rem;
		margin: 0 0 1rem;
	}

	/* ===== Caveat box ===== */
	.caveat-box {
		border: 1px solid rgba(45, 212, 191, 0.25);
		border-left: 3px solid var(--shadow-flame, var(--primary));
		background: var(--bg-surface);
		border-radius: 10px;
		padding: 1rem 1.15rem 0.75rem;
		margin: 0 0 1.75rem;
	}
	.caveat-box h3 {
		margin-bottom: 0.35rem;
		color: var(--shadow-flame, var(--primary));
		font-size: 0.95rem;
		letter-spacing: 0.01em;
	}
	.caveat-box p {
		margin-bottom: 0.65rem;
	}
	.caveat-box p.sub {
		color: var(--text-mist, var(--text-secondary));
		font-size: 0.85rem;
		margin-bottom: 0;
	}
	.caveat-box a {
		color: var(--shadow-flame, var(--primary));
	}

	/* ===== Table ===== */
	.table-wrap {
		overflow-x: auto;
		margin: 0 0 0.5rem;
	}
	.comparison-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
		min-width: 560px;
	}
	.comparison-table caption {
		caption-side: top;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-mist);
		padding-bottom: 0.5rem;
	}
	.comparison-table th,
	.comparison-table td {
		padding: 0.55rem 0.75rem;
		border-bottom: 1px solid var(--border-color);
		text-align: left;
		vertical-align: baseline;
	}
	.comparison-table thead th {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-mist);
		font-weight: 600;
	}
	.comparison-table tbody th {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--shadow-flame, var(--primary));
	}
	.comparison-table .num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.comparison-table td.corpus {
		font-weight: 700;
		color: var(--text-primary);
	}
	.col-sub {
		display: block;
		font-size: 0.68rem;
		color: var(--text-mist);
		text-transform: none;
		letter-spacing: 0.02em;
		margin-top: 0.15rem;
		font-weight: 400;
	}
	.comparison-table td.pos {
		color: var(--shadow-flame, var(--primary));
		font-weight: 600;
	}
	.comparison-table td.neg {
		color: var(--text-mist);
		font-weight: 600;
	}
	.missing-note {
		display: inline-block;
		margin-left: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-mist);
	}
	.table-note {
		font-size: 0.82rem;
		color: var(--text-mist);
		margin: 0 0 1.5rem;
	}

	/* ===== Interpretations ===== */
	.interpretations {
		margin: 0 0 1.75rem;
	}
	.interpretation {
		padding: 0.85rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 10px;
		background: var(--bg-surface);
		margin-bottom: 0.6rem;
	}
	.interpretation-head {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
		flex-wrap: wrap;
		margin-bottom: 0.2rem;
	}
	.interpretation-type {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-mist);
	}
	.interpretation-delta {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-variant-numeric: tabular-nums;
	}
	.interpretation-delta.pos {
		color: var(--shadow-flame, var(--primary));
	}
	.interpretation-delta.neg {
		color: var(--text-mist);
	}
	.interpretation p {
		margin: 0;
		font-size: 0.95rem;
	}

	/* ===== Conflict note ===== */
	.conflict-note {
		border: 1px dashed var(--border-color);
		border-radius: 10px;
		padding: 0.9rem 1rem;
		background: var(--bg-deep);
		margin: 0 0 2rem;
	}
	.conflict-note h3 {
		font-size: 1rem;
	}
	.conflict-note p {
		margin: 0;
		font-size: 0.95rem;
	}

	/* ===== Sources ===== */
	.sources h3 {
		margin-top: 1rem;
	}
	.source-list {
		list-style: none;
		padding: 0;
		margin: 0 0 1.25rem;
	}
	.source-list li {
		padding: 0.65rem 0;
		border-bottom: 1px solid var(--border-color);
	}
	.source-list li:last-child {
		border-bottom: 0;
	}
	.source-name {
		font-weight: 700;
		font-size: 0.98rem;
		color: var(--text-primary);
	}
	.source-name a {
		color: var(--shadow-flame, var(--primary));
		text-decoration: none;
	}
	.source-name a:hover {
		text-decoration: underline;
	}
	.source-meta,
	.source-meta-inline {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-mist);
	}
	.source-meta {
		margin-top: 0.15rem;
	}
	.source-meta-inline {
		margin-left: 0.5rem;
	}
	.partial-tag {
		display: inline-block;
		padding: 0 0.35rem;
		border: 1px solid var(--border-color);
		border-radius: 3px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-mist);
	}
	.source-methodology,
	.source-notes,
	.source-citation,
	.source-contribution {
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin-top: 0.2rem;
	}
	.source-notes,
	.source-contribution {
		color: var(--text-mist);
	}
	.source-list.academic li {
		padding: 0.5rem 0;
	}

	@media (max-width: 640px) {
		.comparison-table {
			font-size: 0.85rem;
		}
	}
</style>
