<!-- src/lib/components/marketing/CorpusStatsComparisonSection.svelte -->
<!-- Joins the 9takes corpus distribution with published public-data sources
	 (enneagram-personality.com, Truity) and academic validity references.
	 Lives on /corpus-stats after the per-type-domains section. -->
<script lang="ts">
	import corpusStats from '$lib/data/corpus-stats.json';
	import externalStats from '$lib/data/corpus-stats-external.json';
	import { describeTypeRank, joinList, typeExtremes } from '$lib/utils/corpusTypeRanking';

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
	const corpusCounts = corpusStats.enneagram_distribution.counts as Record<string, number>;
	const corpusTotal = corpusStats.totals.published;
	const primaryShares = primarySource.type_shares;

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

	// Same threshold that colors the table's delta column: gaps under 3 pp are
	// treated as noise, not divergence.
	const DIVERGENCE_PP = 3;
	type Direction = 'over' | 'under' | 'close';
	const direction = (pp: number | null): Direction =>
		pp === null ? 'close' : pp >= DIVERGENCE_PP ? 'over' : pp <= -DIVERGENCE_PP ? 'under' : 'close';
	const points = (pp: number) => `${Math.abs(pp).toFixed(1)} points`;
	const NUMBER_WORDS = [
		'zero',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine'
	];
	const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);
	const typeLabel = (t: number | string) => `Type ${t} (${TYPE_NAMES[Number(t)]})`;
	const corpusRank = (t: number) => describeTypeRank(corpusCounts, String(t));
	const EDITOR_TYPING = '9takes editors assign every type in this corpus';

	// Per-type interpretive copy. Every number is computed from the live corpus and
	// the external JSON; only the hypotheses are hand-written, and each note only
	// renders its hypothesis while the gap still points the way it explains.
	// Notes whose gap has closed or flipped fall back to neutral copy.
	type Note = {
		expects: 'over' | 'under' | 'always';
		heading: string;
		facts: (row: Row) => string;
		hypothesis: (row: Row) => string;
	};

	const baseFacts = (row: Row) =>
		`Type ${row.type} is ${pct(row.corpusShare)} of the 9takes corpus, ${corpusRank(row.type)}, against ${pct(row.primaryShare)} on ${primarySource.short_name}`;

	const sourceGapPp = (row: Row) =>
		row.primaryShare !== null && row.secondaryShare !== null
			? Math.abs(row.primaryShare - row.secondaryShare) * 100
			: null;

	const NOTES: Record<number, Note> = {
		3: {
			expects: 'over',
			heading: "Type 3 (Achiever): visibility, or the typist's eye?",
			facts: (row) => `${baseFacts(row)}.`,
			hypothesis: () =>
				'One hypothesis: becoming a publicly documented figure is already an achievement-shaped outcome, so a corpus built from visible people may select for Type 3. Another is editor-typing bias: on-camera polish and ambition are easy to read as Type 3, and ' +
				EDITOR_TYPING +
				". This data can't tell the two apart."
		},
		8: {
			expects: 'over',
			heading: 'Type 8 (Challenger): a public-figure effect?',
			facts: (row) =>
				`${baseFacts(row)}${row.secondaryShare !== null ? ` and ${pct(row.secondaryShare)} on ${secondarySource.short_name}` : ''}.`,
			hypothesis: (row) => {
				const gap = sourceGapPp(row);
				return (
					'If public life rewards people who take charge, a corpus of well-known people could run heavy on Type 8 compared with test-taker samples. That is a hypothesis, not a finding' +
					(gap !== null && gap >= DIVERGENCE_PP
						? `: the two test-taker sources are ${points(gap)} apart on Type 8 themselves, and `
						: ', and ') +
					EDITOR_TYPING +
					'.'
				);
			}
		},
		9: {
			expects: 'under',
			heading: 'Type 9 (Peacemaker): common online, rarer here',
			facts: (row) =>
				`Type 9 is ${pct(row.primaryShare)} of ${primarySource.short_name}'s sample, ${describeTypeRank(primaryShares, '9')}, but ${pct(row.corpusShare)} of the 9takes corpus, ${corpusRank(9)}.`,
			hypothesis: () =>
				'One hypothesis: Peacemakers hold groups together from the inside, and that kind of work rarely produces a Wikipedia page. Another is editor-typing bias: easygoing public figures may get typed as something else. Either way, the gap is a reminder that this is a sample of public figures, not of the population.'
		},
		1: {
			expects: 'under',
			heading: 'Type 1 (Reformer): lighter than test-taker data',
			facts: (row) => `${baseFacts(row)}.`,
			hypothesis: () =>
				"Two possible reasons, neither tested: 9takes hasn't profiled many politicians, judges, or activist founders yet, the kinds of public figures who often type as 1, or its editors read principled public figures as other types. If the first is right, the share should rise as the corpus adds more of them."
		},
		6: {
			expects: 'under',
			heading: 'Type 6 (Loyalist): common online, less so here',
			facts: (row) => `${baseFacts(row)}.`,
			hypothesis: () =>
				'One hypothesis is that anxiety-prone types seek out typology tests more often, which would inflate their share among test-takers. Another is that skepticism and loyalty do not automatically make a person famous. A third is editor-typing bias in how 9takes reads public figures. None of these has been tested.'
		},
		7: {
			expects: 'always',
			heading: 'Type 7 (Enthusiast): the source-of-truth problem',
			facts: (row) => {
				const truityKeys = Object.keys(secondarySource.type_shares);
				const truityLowest = typeExtremes(secondarySource.type_shares)?.least ?? [];
				const truityPosition =
					truityLowest.length === 1 && truityLowest[0] === '7'
						? `, the lowest of the ${countWord(truityKeys.length)} types it publishes`
						: '';
				return `The 9takes corpus shows Type 7 at ${pct(row.corpusShare)}. ${primarySource.short_name} ranks it ${describeTypeRank(primaryShares, '7')} at ${pct(row.primaryShare)}, while ${secondarySource.short_name} puts it at ${pct(row.secondaryShare)}${truityPosition}.`;
			},
			hypothesis: (row) => {
				const gap = sourceGapPp(row);
				if (gap === null) return 'Treat any Type 7 comparison as noisy.';
				const otherGaps = rows
					.filter((other) => other.type !== 7)
					.map(sourceGapPp)
					.filter((value): value is number => value !== null);
				const largest = otherGaps.every((other) => gap > other);
				return `The two public sources are ${points(gap)} apart on Type 7${largest ? ', more than on any other type they both report' : ''}. Treat any Type 7 comparison as noisy until that disagreement is resolved.`;
			}
		}
	};

	function interpret(row: Row): { heading: string; body: string } {
		const note = NOTES[row.type];
		const dir = direction(row.deltaVsPrimaryPp);
		if (note.expects === 'always' || note.expects === dir) {
			return { heading: note.heading, body: `${note.facts(row)} ${note.hypothesis(row)}` };
		}
		if (dir === 'close') {
			return {
				heading: `${typeLabel(row.type)}: close to test-taker data`,
				body: `${baseFacts(row)}, a gap of ${points(row.deltaVsPrimaryPp ?? 0)}. That is small enough to be noise at this sample size, so there is no divergence to explain yet.`
			};
		}
		return {
			heading: `${typeLabel(row.type)}: ${dir === 'over' ? 'heavier' : 'lighter'} than test-taker data`,
			body: `${baseFacts(row)}. There is no working hypothesis for this direction yet; keep in mind that ${EDITOR_TYPING}.`
		};
	}

	const divergenceInterpretations = rows
		.filter((r) => NOTES[r.type])
		.sort((a, b) => Math.abs(b.deltaVsPrimaryPp ?? 0) - Math.abs(a.deltaVsPrimaryPp ?? 0))
		.map((r) => ({
			...interpret(r),
			type: r.type,
			delta: r.deltaVsPrimaryPp,
			share: r.corpusShare
		}));

	// "11.11% per type" note: name each source's extremes from the data shown,
	// so the copy can't contradict the table (Truity's partial table only
	// supports "lowest of the types it publishes").
	const typesList = (types: string[]) =>
		types.length > 1 ? `Types ${joinList(types)}` : `Type ${types[0]}`;
	const publicDataSentence = (() => {
		const primaryExtremes = typeExtremes(primaryShares);
		if (!primaryExtremes) return '';
		const secondaryExtremes = typeExtremes(secondarySource.type_shares);
		const agreeOnLowest =
			!!secondaryExtremes && secondaryExtremes.least.join() === primaryExtremes.least.join();
		const primaryPart = `${primarySource.short_name}${primarySource.complete ? ', the one source here with a full nine-type table,' : ''} has ${typesList(primaryExtremes.least)} lowest (${pct(primaryExtremes.leastValue)}) and ${typesList(primaryExtremes.most)} highest (${pct(primaryExtremes.mostValue)}).`;
		if (!secondaryExtremes) return `The public data that does exist is uneven. ${primaryPart}`;
		const secondaryCount = Object.keys(secondarySource.type_shares).length;
		return (
			`The public data that does exist is uneven${agreeOnLowest ? '' : ", and the sources don't agree on which type is rarest"}. ` +
			`${primaryPart} ${secondarySource.short_name}'s lowest share among the ${countWord(secondaryCount)} types it publishes is ${typesList(secondaryExtremes.least)} (${pct(secondaryExtremes.leastValue)})${agreeOnLowest ? ', the same' : ''}.`
		);
	})();
</script>

<section
	class="comparison-section page-section"
	aria-labelledby="comparison-heading"
	id="comparison"
>
	<h2 id="comparison-heading">Comparison to Published Enneagram Distributions</h2>

	<p class="lede">
		Our {corpusTotal}-profile corpus, put next to the two largest public Enneagram datasets that
		actually publish numbers. The point is to make our sample bias legible, not to crown a "correct"
		distribution.
	</p>

	<!-- ========== HONEST-SAMPLE CAVEAT ========== -->
	<aside class="caveat-box" aria-label="Methodology caveat">
		<h3>What we are and aren't</h3>
		<p>
			The 9takes corpus is a non-random sample of well-documented public figures. It is
			<strong>not</strong>
			a representative population sample. When our numbers diverge from test-taker datasets like Truity
			or enneagram-personality.com, the divergence is usually a story about <em>our</em> sample (which
			types become famous, who gets written about, which professions we lean toward) or about our typing:
			9takes editors assign every type in the corpus, so their judgment calls are part of the data. It
			is not a verdict on which dataset is "right." This section exists to make those biases legible,
			not to claim a true population distribution.
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
							class:pos={direction(row.deltaVsPrimaryPp) === 'over'}
							class:neg={direction(row.deltaVsPrimaryPp) === 'under'}
						>
							{fmtDelta(row.deltaVsPrimaryPp)} pp
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="table-note">
		<strong>n/d</strong> = not disclosed. Truity has never published a consolidated 9-type table. Only
		Types 5, 7, 8, and 9 have explicit shares on record.
	</p>

	<!-- ========== DIVERGENCE INTERPRETATIONS ========== -->
	<div class="interpretations" id="comparison-divergence">
		<h3 id="comparison-divergence-heading">Where the 9takes corpus diverges, and why</h3>
		<p class="lede-sub">
			Types ordered by absolute delta against
			{primarySource.short_name}. The numbers are computed from the live data; the explanations are
			written by hand, and each one is a working hypothesis for why our sample moves the way it
			does, not a finding.
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
			Enneagram discourse sometimes cites an "11.11% per type" baseline: the idea that every type is
			equally common in the general population. No primary empirical source supports that number.
			It's a theoretical prior, not a finding. {publicDataSentence}
		</p>
	</aside>

	<!-- ========== SOURCES ========== -->
	<div class="sources" id="comparison-sources">
		<h3 id="comparison-sources-heading">Public Data Sources</h3>
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

		<h3 id="comparison-academic-heading">Academic Context</h3>
		<p class="lede-sub">
			None of the peer-reviewed Enneagram research below publishes a per-type population
			distribution. They're listed here as the validity backbone, not as chart data: proof the
			Enneagram has been studied in psychology journals, not merely in self-help. That distinction
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
		color: var(--ink-bright);
	}
	h3 {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
		color: var(--ink-bright);
	}
	h4 {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		margin: 0.25rem 0 0.5rem;
		color: var(--ink-bright);
	}
	p {
		line-height: 1.55;
		color: var(--ink-mid);
		margin: 0 0 0.75rem;
		max-width: 720px;
	}
	p.lede {
		margin: 0 0 1.25rem;
	}
	p.lede-sub {
		color: var(--text-mist, var(--ink-mid));
		font-size: 0.95rem;
		margin: 0 0 1rem;
	}

	/* ===== Caveat box ===== */
	.caveat-box {
		border: 1px solid color-mix(in srgb, var(--data-teal) 25%, transparent);
		border-left: 3px solid var(--shadow-flame, var(--lamp-glow));
		background: var(--stone-warm);
		border-radius: 10px;
		padding: 1rem 1.15rem 0.75rem;
		margin: 0 0 1.75rem;
	}
	.caveat-box h3 {
		margin-bottom: 0.35rem;
		color: var(--shadow-flame, var(--lamp-glow));
		font-size: 0.95rem;
		letter-spacing: 0.01em;
	}
	.caveat-box p {
		margin-bottom: 0.65rem;
	}
	.caveat-box p.sub {
		color: var(--text-mist, var(--ink-mid));
		font-size: 0.85rem;
		margin-bottom: 0;
	}
	.caveat-box a {
		color: var(--shadow-flame, var(--lamp-glow));
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
		border-bottom: 1px solid var(--stone-edge);
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
		color: var(--shadow-flame, var(--lamp-glow));
	}
	.comparison-table .num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.comparison-table td.corpus {
		font-weight: 700;
		color: var(--ink-bright);
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
		color: var(--shadow-flame, var(--lamp-glow));
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
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-warm);
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
		color: var(--shadow-flame, var(--lamp-glow));
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
		border: 1px dashed var(--stone-edge);
		border-radius: 10px;
		padding: 0.9rem 1rem;
		background: var(--night-deep);
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
		border-bottom: 1px solid var(--stone-edge);
	}
	.source-list li:last-child {
		border-bottom: 0;
	}
	.source-name {
		font-weight: 700;
		font-size: 0.98rem;
		color: var(--ink-bright);
	}
	.source-name a {
		color: var(--shadow-flame, var(--lamp-glow));
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
		border: 1px solid var(--stone-edge);
		border-radius: 0.25rem;
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
		color: var(--ink-mid);
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
