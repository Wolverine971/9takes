<!-- src/lib/components/marketing/CaseCard.svelte -->
<!--
  Case-file card — the canonical V5 listing card.
  Extracted 2026-06-10 (design audit): five listing pages carried near-identical
  copies of this markup + ~120 lines of CSS each. One source of truth now.

  - `stripe` paints the 3px top edge + eyebrow (e.g. a --type-N-color for
    personality-analysis, --lamp-glow for featured cards). Omit for the plain
    card (no top stripe, amber eyebrow).
  - `featured` switches to the large 16/11 variant used in §02 sections.
  - `.mono` / global type utilities come from src/scss/index.scss.
-->
<script lang="ts">
	type Props = {
		href: string;
		title: string;
		/** Mono eyebrow above the title (topic / TYPE N). */
		eyebrow?: string;
		description?: string;
		imageSrc?: string | null;
		imageAlt?: string;
		/** CSS color for the top stripe + eyebrow. Omit for no stripe. */
		stripe?: string | null;
		featured?: boolean;
		/** Pre-formatted date string (renders in the meta row). */
		date?: string;
		/** Recency label, e.g. "UPDATED THIS WEEK". */
		recency?: string;
		/** Eager-load the image (above-the-fold cards). */
		eager?: boolean;
		/** Also raise fetchpriority (LCP-candidate featured cards only). */
		priority?: boolean;
		stubLabel?: string;
		ariaLabel?: string;
	};

	let {
		href,
		title,
		eyebrow = '',
		description = '',
		imageSrc = null,
		imageAlt = '',
		stripe = null,
		featured = false,
		date = '',
		recency = '',
		eager = false,
		priority = false,
		stubLabel = '[ARTICLE]',
		ariaLabel = ''
	}: Props = $props();

	let stripeStyle = $derived(stripe ? `--case-stripe: ${stripe};` : '');
</script>

<a
	{href}
	class="case-card"
	class:case-card--featured={featured}
	class:has-stripe={Boolean(stripe) || featured}
	style={stripeStyle}
	aria-label={ariaLabel || `Read ${title}`}
>
	<div class="case-image-wrap">
		{#if imageSrc}
			<img
				src={imageSrc}
				alt={imageAlt || title}
				class="case-image"
				loading={eager ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : undefined}
				width={featured ? 640 : 320}
				height={featured ? 440 : 240}
				decoding="async"
			/>
		{:else}
			<div class="case-image-stub" aria-hidden="true">
				<span class="mono">{stubLabel}</span>
			</div>
		{/if}
	</div>
	<div class="case-card-body">
		{#if eyebrow}
			<span class="mono case-id">{eyebrow}</span>
		{/if}
		<h3 class="case-name">{title}</h3>
		{#if description}
			<p class="case-subtitle">{description}</p>
		{/if}
		{#if date || recency}
			<div class="case-meta">
				{#if date}
					<span class="mono case-date">{date}</span>
				{/if}
				{#if recency}
					<span class="mono case-recency">{recency}</span>
				{/if}
			</div>
		{/if}
	</div>
</a>

<style lang="scss">
	.case-card {
		--case-stripe: var(--lamp-glow);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			background: var(--stone-mid);
			border-color: var(--ink-dim);
			transform: translateY(-2px);
		}

		&.has-stripe:hover {
			border-color: var(--case-stripe);
		}
	}

	.case-card:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.case-image-wrap {
		position: relative;
		border-bottom: 1px solid var(--stone-edge);
	}

	.has-stripe .case-image-wrap {
		border-top: 3px solid var(--case-stripe);
	}

	.case-image {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 25%;
		filter: contrast(1.05) brightness(0.96) saturate(0.92);
	}

	:global(:root.light) .case-image {
		filter: contrast(1.02) brightness(1) saturate(0.96);
	}

	.case-card--featured .case-image {
		aspect-ratio: 16 / 11;

		@media (max-width: 540px) {
			aspect-ratio: 4 / 3;
		}
	}

	.case-image-stub {
		aspect-ratio: 4 / 3;
		background: var(--stone-mid);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			rgba(var(--pool-rgb), 0.04) 14px,
			rgba(var(--pool-rgb), 0.04) 15px
		);
		display: flex;
		align-items: center;
		justify-content: center;

		.mono {
			color: var(--ink-dim);
			font-size: 11px;
		}
	}

	.case-card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.case-id {
		color: var(--case-stripe);
		font-size: 10.5px;
	}

	.case-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 19px;
		line-height: 1.22;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.case-card--featured .case-name {
		font-size: clamp(22px, 2.4vw, 30px);
		line-height: 1.14;
	}

	.case-subtitle {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
	}

	.case-card--featured .case-subtitle {
		font-size: 15px;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.case-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		margin-top: 6px;
	}

	.case-date {
		color: var(--ink-dim);
		font-size: 10.5px;
	}

	.case-recency {
		color: var(--lamp-glow);
		font-size: 10.5px;
	}

	/* Mobile tightening */
	@media (max-width: 540px) {
		.case-card-body {
			padding: 14px 16px 18px;
		}

		.case-name {
			font-size: 16px;
		}

		.case-subtitle {
			font-size: 13px;
		}
	}
</style>
