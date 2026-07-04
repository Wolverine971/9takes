<!-- src/lib/components/blog/callouts/CorpusStatCallout.svelte -->
<!--
  AEO-optimized callout that surfaces a citation-grade stat from the 9takes
  corpus and emits inline `Quotation` JSON-LD so AI Overviews / LLMs can
  extract the claim cleanly.

  Stats MUST be sourced from `$lib/data/corpus-stats.json` via a server-side
  helper (e.g. `getTypeCorpusInsight`). Never hand-key numbers into this
  component — it's a presentation layer, not a data source.

  Shell renders through the shared <Callout> base with tone="data"
  (2026-06-10 consolidation) — stats are data moments, so the accent is the
  sanctioned --data-teal (was an off-palette orange). Public props unchanged.
-->
<script lang="ts">
	import Callout from './Callout.svelte';
	import {
		buildCorpusDatasetReference,
		NINE_TAKES_ORGANIZATION
	} from '$lib/utils/corpusDatasetJsonLd';

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
		isBasedOn: buildCorpusDatasetReference(generatedAt),
		creator: NINE_TAKES_ORGANIZATION,
		citation: datasetAbsoluteAnchor
	});

	const quotationSchemaHtml = $derived(
		'<' + 'script type="application/ld+json">' + JSON.stringify(quotationSchema) + '</' + 'script>'
	);
</script>

<svelte:head>
	{#if emitJsonLd}
		{@html quotationSchemaHtml}
	{/if}
</svelte:head>

<Callout
	tone="data"
	itemscope
	itemtype="https://schema.org/Quotation"
	aria-label="9takes corpus statistic"
>
	<div class="corpus-stat__header">
		<span class="corpus-stat__dot" aria-hidden="true"></span>
		<span class="corpus-stat__eyebrow">{eyebrow}</span>
		<span class="corpus-stat__meta">n={domainTotal}</span>
	</div>

	<p class="corpus-stat__claim" itemprop="text">
		<strong class="corpus-stat__share">{sharePct}</strong>
		{#if deltaPpFormatted}
			<span class="corpus-stat__delta">({deltaPpFormatted} pp vs baseline)</span>
		{/if}
		<span class="corpus-stat__sentence">{claim}</span>
	</p>

	<p class="corpus-stat__source">
		Source:
		<a href={corpusAnchorUrl} class="corpus-stat__link">
			9takes Corpus Stats — {domainLabel}
		</a>
		·
		<a href={domainUrl} class="corpus-stat__link"> Browse {domainLabel} profiles</a>
	</p>

	<meta itemprop="citation" content={datasetAbsoluteAnchor} />
</Callout>

<style lang="scss">
	/* Custom mono header (dot · eyebrow · n=) — kept local; the base's plain
	   label doesn't carry the right-aligned sample-size meta. */
	.corpus-stat__header {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		margin-bottom: 0.55rem;
		font-size: 0.7rem;
		font-family: var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.corpus-stat__dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--data-teal);
		box-shadow: 0 0 8px color-mix(in srgb, var(--data-teal) 60%, transparent);
		flex-shrink: 0;
	}

	.corpus-stat__eyebrow {
		font-weight: 700;
		color: var(--data-teal);
	}

	.corpus-stat__meta {
		margin-left: auto;
		color: var(--ink-dim);
		font-weight: 500;
	}

	.corpus-stat__claim {
		margin: 0 0 0.55rem;
		line-height: 1.55;
		color: var(--ink-bright);
		font-size: 1rem;
	}

	.corpus-stat__share {
		display: inline-block;
		font-family: var(--font-display, inherit);
		font-size: 1.45rem;
		font-weight: 800;
		color: var(--data-teal);
		line-height: 1;
		margin-right: 0.35rem;
		vertical-align: -0.05em;
	}

	.corpus-stat__delta {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		color: var(--ink-mid);
		margin-right: 0.35rem;
	}

	.corpus-stat__sentence {
		color: var(--ink-bright);
	}

	.corpus-stat__source {
		margin: 0;
		font-size: 0.82rem;
		color: var(--ink-mid);
		line-height: 1.5;
	}

	.corpus-stat__link {
		color: var(--lamp-glow);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	@media (max-width: 640px) {
		.corpus-stat__share {
			font-size: 1.3rem;
		}

		.corpus-stat__claim {
			font-size: 0.95rem;
		}

		.corpus-stat__source {
			font-size: 0.78rem;
		}
	}
</style>
