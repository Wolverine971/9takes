<!-- src/lib/components/marketing/CaseCard.svelte -->
<!--
  Case-file card — the canonical V5 listing card.
  Extracted 2026-06-10 (design audit): five listing pages carried near-identical
  copies of this markup + ~120 lines of CSS each. One source of truth now.

  Cold Light (2026-11-06): --surface card, --rule border, hover lifts onto
  --surface-raised, lavender focus ring. Labels (eyebrow, date, recency, stub)
  are Archivo uppercase letter-spaced in --text-faint; the title is Archivo
  semibold.

	  - `stripe` paints the 3px top edge only (featured cards default to the
	    indigo --accent). The eyebrow is always a faint label, never tinted.
	  - `featured` switches to the large 16/11 variant used in §02 sections.
	  - `compactMobile` tightens card typography/images for 2-up mobile libraries.
-->
<script lang="ts">
	type Props = {
		href: string;
		title: string;
		/** Small label above the title (topic / TYPE N). */
		eyebrow?: string;
		description?: string;
		imageSrc?: string | null;
		imageAlt?: string;
		/** CSS color for the top stripe. Omit for no stripe (featured cards get --accent). */
		stripe?: string | null;
		/** Opt-in media treatment; non-personality callers keep the current default. */
		imageTreatment?: 'default' | 'personality';
		featured?: boolean;
		compactMobile?: boolean;
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
		imageTreatment = 'default',
		featured = false,
		compactMobile = false,
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
	class={[
		'case-card',
		{
			'case-card--featured': featured,
			'case-card--compact-mobile': compactMobile,
			'has-stripe': Boolean(stripe) || featured
		}
	]}
	style={stripeStyle}
	aria-label={ariaLabel || `Read ${title}`}
>
	<div class={['case-image-wrap', imageTreatment === 'personality' && 'personality-portrait-well']}>
		{#if imageSrc}
			<img
				src={imageSrc}
				alt={imageAlt || title}
				class={['case-image', imageTreatment === 'personality' && 'personality-portrait-image']}
				loading={eager ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : undefined}
				width={featured ? 640 : 320}
				height={featured ? 440 : 240}
				decoding="async"
			/>
		{:else}
			<div class="case-image-stub" aria-hidden="true">
				<span class="card-label">{stubLabel}</span>
			</div>
		{/if}
	</div>
	<div class="case-card-body">
		{#if eyebrow}
			<span class="card-label case-id">{eyebrow}</span>
		{/if}
		<h3 class="case-name">{title}</h3>
		{#if description}
			<p class="case-subtitle">{description}</p>
		{/if}
		{#if date || recency}
			<div class="case-meta">
				{#if date}
					<span class="card-label case-date">{date}</span>
				{/if}
				{#if recency}
					<span class="card-label case-recency">{recency}</span>
				{/if}
			</div>
		{/if}
	</div>
</a>

<style lang="scss">
	.case-card {
		--case-stripe: var(--accent);
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			background: var(--surface-raised);
			border-color: color-mix(in srgb, var(--highlight) 32%, transparent);
			box-shadow: 0 12px 32px color-mix(in srgb, var(--accent) 14%, transparent);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.case-card {
			transition:
				background 0.2s ease,
				border-color 0.2s ease,
				box-shadow 0.2s ease,
				transform 0.2s ease;

			&:hover {
				transform: translateY(-2px);
			}
		}
	}

	.case-card:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 2px;
	}

	.case-image-wrap {
		position: relative;
		border-bottom: 1px solid var(--rule);
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

	.case-image.personality-portrait-image {
		filter: var(--personality-portrait-filter);
		mix-blend-mode: normal;
	}

	.case-card--featured .case-image {
		aspect-ratio: 16 / 11;

		@media (max-width: 540px) {
			aspect-ratio: 4 / 3;
		}
	}

	.case-image-stub {
		aspect-ratio: 4 / 3;
		background: var(--surface-raised);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			color-mix(in srgb, var(--accent) 6%, transparent) 14px,
			color-mix(in srgb, var(--accent) 6%, transparent) 15px
		);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.case-card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	/* Labels: Archivo uppercase, letter-spaced, faint. No mono in Cold Light. */
	.card-label {
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.case-name {
		font-family: var(--font-talk);
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-xl);
		line-height: 1.22;
		color: var(--text);
		letter-spacing: -0.01em;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.case-card--featured .case-name {
		font-size: clamp(1.375rem, 2.4vw, 1.875rem);
		line-height: 1.14;
	}

	.case-subtitle {
		font-family: var(--font-talk);
		font-size: var(--font-size-sm);
		line-height: 1.5;
		color: var(--text-muted);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin: 0;
	}

	.case-card--featured .case-subtitle {
		font-size: var(--font-size-base);
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

	/* Mobile tightening */
	@media (max-width: 540px) {
		.case-card-body {
			padding: 14px 16px 18px;
		}

		.case-name {
			font-size: var(--font-size-base);
		}

		.case-subtitle {
			font-size: var(--font-size-sm);
		}

		.case-card--compact-mobile {
			.case-image,
			.case-image-stub {
				aspect-ratio: 3 / 4;
			}

			.case-card-body {
				gap: 5px;
				padding: 10px 10px 12px;
			}

			.card-label {
				font-size: 0.625rem;
				line-height: 1.25;
			}

			.case-name {
				font-size: var(--font-size-sm);
				line-height: 1.18;
				letter-spacing: 0;
				-webkit-line-clamp: 2;
				line-clamp: 2;
			}

			.case-subtitle {
				font-size: var(--font-size-xs);
				line-height: 1.35;
				-webkit-line-clamp: 1;
				line-clamp: 1;
			}

			.case-meta {
				gap: 6px;
				margin-top: 2px;
			}
		}
	}
</style>
