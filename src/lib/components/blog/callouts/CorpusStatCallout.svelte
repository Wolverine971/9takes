<!-- src/lib/components/blog/callouts/CorpusStatCallout.svelte -->
<!--
  AEO-optimized callout that surfaces a citation-grade stat from the 9takes
  corpus and emits inline `Quotation` JSON-LD so AI Overviews / LLMs can
  extract the claim cleanly.

  Stats MUST be sourced from `$lib/data/corpus-stats.json` via a server-side
  helper (e.g. `getTypeCorpusInsight`). Never hand-key numbers into this
  component — it's a presentation layer, not a data source.
-->
<script lang="ts">
	type Props = {
		/** Plain-English claim sentence — drops straight into Quotation/text. */
		claim: string;
		/** Eyebrow label above the headline. Defaults to "9takes Corpus Stat". */
		eyebrow?: string;
		/** Domain label for the inline link (e.g. "Musicians & Artists"). */
		domainLabel: string;
		/** Domain category page URL (e.g. "/personality-analysis/categories/music"). */
		domainUrl: string;
		/** Anchor on /corpus-stats for this domain (e.g. "/corpus-stats#domain-music"). */
		corpusAnchorUrl: string;
		/** "n=" total for the domain slice. */
		domainTotal: number;
		/** Pretty share string e.g. "35.1%". Required for accessibility. */
		sharePct: string;
		/** Signed pp delta (e.g. "+21.24"). Optional — omitted for type-share variant. */
		deltaPpFormatted?: string | null;
		/** ISO timestamp the corpus file was generated at. */
		generatedAt: string;
		/** Whether to embed Quotation JSON-LD inline. Default true. */
		emitJsonLd?: boolean;
	};

	let {
		claim,
		eyebrow = '9takes Corpus Stat',
		domainLabel,
		domainUrl,
		corpusAnchorUrl,
		domainTotal,
		sharePct,
		deltaPpFormatted = null,
		generatedAt,
		emitJsonLd = true
	}: Props = $props();

	const datasetUrl = 'https://9takes.com/corpus-stats';
	const datasetAbsoluteAnchor = $derived(
		corpusAnchorUrl.startsWith('http') ? corpusAnchorUrl : `https://9takes.com${corpusAnchorUrl}`
	);

	// Quotation schema — extracted by AI Overviews and LLM citation pipelines.
	// The text is the same plain-English claim shown to readers, sourced to a
	// stable URL on /corpus-stats. spokenByCharacter is intentionally omitted;
	// `creator` ties the citation to the 9takes organization.
	const quotationSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Quotation',
		text: claim,
		about: {
			'@type': 'Thing',
			name: `Enneagram type distribution among ${domainLabel}`
		},
		isBasedOn: {
			'@type': 'Dataset',
			name: '9takes Corpus Stats',
			url: datasetUrl,
			dateModified: generatedAt
		},
		creator: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com'
		},
		citation: datasetAbsoluteAnchor
	});
</script>

<svelte:head>
	{#if emitJsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(quotationSchema)}</script>`}
	{/if}
</svelte:head>

<aside
	class="corpus-stat-callout"
	itemscope
	itemtype="https://schema.org/Quotation"
	aria-label="9takes corpus statistic"
>
	<div class="corpus-stat-callout__header">
		<span class="corpus-stat-callout__dot" aria-hidden="true"></span>
		<span class="corpus-stat-callout__eyebrow">{eyebrow}</span>
		<span class="corpus-stat-callout__meta">n={domainTotal}</span>
	</div>

	<p class="corpus-stat-callout__claim" itemprop="text">
		<strong class="corpus-stat-callout__share">{sharePct}</strong>
		{#if deltaPpFormatted}
			<span class="corpus-stat-callout__delta">({deltaPpFormatted} pp vs baseline)</span>
		{/if}
		<span class="corpus-stat-callout__sentence">{claim}</span>
	</p>

	<p class="corpus-stat-callout__source">
		Source:
		<a href={corpusAnchorUrl} class="corpus-stat-callout__link">
			9takes Corpus Stats — {domainLabel}
		</a>
		·
		<a href={domainUrl} class="corpus-stat-callout__link"> Browse {domainLabel} profiles</a>
	</p>

	<meta itemprop="citation" content={datasetAbsoluteAnchor} />
</aside>

<style lang="scss">
	/* 9takes Warm Tech Theme — Corpus stat callout
	   Visually distinct from QuickAnswer (teal lamp-glow) so a single page can
	   stack a Quick Answer + Corpus Stat without colour collision. */
	.corpus-stat-callout {
		position: relative;
		margin: 1.5rem 0 2rem;
		padding: 1rem 1.25rem 1.05rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--shadow-flame, #f97316) 6%, var(--stone-warm)) 0%,
			var(--night-deep) 70%,
			var(--night-deep) 100%
		);
		border: 1px solid color-mix(in srgb, var(--shadow-flame, #f97316) 28%, transparent);
		box-shadow:
			0 4px 18px rgba(0, 0, 0, 0.28),
			0 0 0 1px color-mix(in srgb, var(--shadow-flame, #f97316) 8%, transparent);

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(
				180deg,
				var(--shadow-flame, #f97316) 0%,
				color-mix(in srgb, var(--shadow-flame, #f97316) 60%, var(--lamp-glow)) 100%
			);
			border-radius: 12px 0 0 12px;
		}
	}

	.corpus-stat-callout__header {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		margin-bottom: 0.55rem;
		font-size: 0.7rem;
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.corpus-stat-callout__dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--shadow-flame, #f97316);
		box-shadow: 0 0 8px color-mix(in srgb, var(--shadow-flame, #f97316) 60%, transparent);
		flex-shrink: 0;
	}

	.corpus-stat-callout__eyebrow {
		font-weight: 700;
		color: var(--shadow-flame, #f97316);
	}

	.corpus-stat-callout__meta {
		margin-left: auto;
		color: var(--ink-dim);
		font-weight: 500;
	}

	.corpus-stat-callout__claim {
		margin: 0 0 0.55rem;
		line-height: 1.55;
		color: var(--ink-bright);
		font-size: 1rem;
	}

	.corpus-stat-callout__share {
		display: inline-block;
		font-family: var(--font-display, inherit);
		font-size: 1.45rem;
		font-weight: 800;
		color: var(--shadow-flame, #f97316);
		line-height: 1;
		margin-right: 0.35rem;
		vertical-align: -0.05em;
	}

	.corpus-stat-callout__delta {
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
		font-size: 0.82rem;
		color: var(--ink-mid);
		margin-right: 0.35rem;
	}

	.corpus-stat-callout__sentence {
		color: var(--ink-bright);
	}

	.corpus-stat-callout__source {
		margin: 0;
		font-size: 0.82rem;
		color: var(--ink-mid);
		line-height: 1.5;
	}

	.corpus-stat-callout__link {
		color: var(--lamp-glow);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	@media (max-width: 640px) {
		.corpus-stat-callout {
			padding: 0.85rem 1rem 0.95rem 1.25rem;
			margin: 1rem 0 1.5rem;
			border-radius: 10px;
		}

		.corpus-stat-callout__share {
			font-size: 1.3rem;
		}

		.corpus-stat-callout__claim {
			font-size: 0.95rem;
		}

		.corpus-stat-callout__source {
			font-size: 0.78rem;
		}
	}
</style>
