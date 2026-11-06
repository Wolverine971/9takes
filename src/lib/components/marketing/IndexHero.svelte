<!-- src/lib/components/marketing/IndexHero.svelte -->
<!--
  §01 OBSERVATION hero for content listing pages.
  Extracted 2026-06-10 (design audit): five listing pages carried
  near-identical hero markup + ~190 lines of CSS each.

  Cold Light (2026-11-06): the heading is the loud/quiet pair. Pass
  `titleQuiet` (the trailing words of `title`) and the heading renders the rest
  in Anton uppercase, then the quiet words in Playfair italic lavender. The
  heading's text content stays exactly `title` (SEO).

  Pool-alpha / statue-blend / grain custom properties are inherited from the
  page wrapper (e.g. `.library-index`) when defined there; sensible defaults
  apply otherwise. `actions` is a snippet so each page keeps its own CTAs.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SectionKicker } from '$lib/components/atoms';

	let {
		num = '01',
		label = 'OBSERVATION',
		title,
		titleQuiet = '',
		line1 = '',
		line2 = '',
		imageSrc,
		imageAlt,
		imageMono = '',
		headingLevel = 'h1',
		meta,
		actions
	}: {
		num?: string;
		label?: string;
		title: string;
		/** Trailing words of `title` set in the quiet Playfair italic line. */
		titleQuiet?: string;
		line1?: string;
		line2?: string;
		imageSrc: string;
		imageAlt: string;
		imageMono?: string;
		/** Keep h1 for page heroes; lower the level when the hero is embedded in documentation. */
		headingLevel?: 'h1' | 'h2' | 'h3' | 'h4';
		/** Optional label meta row (e.g. Published / Last updated) between subheads and CTAs. */
		meta?: Snippet;
		actions?: Snippet;
	} = $props();

	// Split the title into the loud Anton line and the quiet Playfair line.
	// Only splits when `titleQuiet` really is the tail of `title`.
	const titleParts = $derived.by(() => {
		const quiet = titleQuiet.trim();
		if (quiet && title.endsWith(quiet) && title.length > quiet.length) {
			return { loud: title.slice(0, title.length - quiet.length).trimEnd(), quiet };
		}
		return { loud: title, quiet: '' };
	});

	// Eleven scale ticks; the middle one (5) is the major tick.
	const SCALE_TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
</script>

<section class="hero">
	<div class="grain" aria-hidden="true"></div>
	<div class="hero-pool" aria-hidden="true"></div>

	<div class="hero-inner">
		<div class="hero-text">
			{#if label && label !== 'OBSERVATION'}
				<div class="hero-eyebrow">
					<SectionKicker {num} {label} />
				</div>
			{/if}

			<svelte:element this={headingLevel} class="hero-title">
				<span class="hero-title-shout">{titleParts.loud}</span>
				{#if titleParts.quiet}
					<span class="hero-title-voice">{titleParts.quiet}</span>
				{/if}
			</svelte:element>

			<div class="scale-marker" aria-hidden="true">
				{#each SCALE_TICKS as i (i)}
					<span class={['tick', { 'tick--major': i === 5 }]}></span>
				{/each}
			</div>

			{#if line1}
				<p class="hero-subhead hero-subhead-line-1">{line1}</p>
			{/if}
			{#if line2}
				<p class="hero-subhead hero-subhead-line-2">{line2}</p>
			{/if}

			{#if meta}
				<p class="hero-meta">
					{@render meta()}
				</p>
			{/if}

			{#if actions}
				<div class="hero-actions">
					{@render actions()}
				</div>
			{/if}
		</div>

		<div class="hero-subject">
			<div class="subject-frame">
				<!-- .hero-subject is display:none ≤968px; the media-gated source keeps
				     phones from downloading the hero image at all (2026-06-11 audit) -->
				<picture>
					<source media="(min-width: 969px)" srcset={imageSrc} />
					<source
						media="(max-width: 968px)"
						srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
					/>
					<img src={imageSrc} alt={imageAlt} class="statue" loading="eager" decoding="async" />
				</picture>
				<div class="subject-vignette"></div>
				{#if imageMono}
					<div class="subject-caption">
						<span class="caption-label">{imageMono}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.hero {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--bg);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	/* Neutral cool grain (the old one was tinted warm). */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--grain-opacity, 0.05);
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.8 0 0 0 0 0.78 0 0 0 0 1 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	/* One indigo glow from the upper left, like the statue light. */
	.hero-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				color-mix(in srgb, var(--accent) 24%, transparent) 0%,
				color-mix(in srgb, var(--accent) 7%, transparent) 30%,
				transparent 60%
			),
			radial-gradient(
				ellipse 90% 70% at 22% 12%,
				color-mix(in srgb, var(--accent-deep) 28%, transparent) 0%,
				transparent 55%
			);
		z-index: 0;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 56px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}

	.hero-text {
		max-width: 720px;
	}

	.hero-eyebrow {
		margin-bottom: 22px;
	}

	.hero-title {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* The take: Anton, uppercase, 40px+. */
	.hero-title-shout {
		font-family: var(--font-shout);
		font-size: clamp(2.5rem, 6.4vw, 4.5rem);
		font-weight: 400;
		line-height: 0.98;
		letter-spacing: 0.005em;
		text-transform: uppercase;
		color: var(--text);
	}

	/* The quiet second line: Playfair italic, lavender. */
	.hero-title-voice {
		font-family: var(--font-voice);
		font-size: clamp(1.625rem, 3vw, 2.5rem);
		font-style: italic;
		font-weight: 400;
		line-height: 1.15;
		color: var(--highlight);
	}

	.scale-marker {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 18px;
		margin: 24px 0 14px;
		opacity: 0.7;
	}

	.tick {
		width: 1px;
		height: 8px;
		background: var(--rule);
	}

	.tick--major {
		height: 16px;
		background: var(--accent);
		width: 1.5px;
	}

	.hero-subhead {
		font-family: var(--font-talk);
		font-size: var(--font-size-lg);
		line-height: 1.55;
		color: var(--text-muted);
		max-width: 640px;
		font-weight: 400;
		margin: 0;

		@media (max-width: 540px) {
			font-size: var(--font-size-base);
		}
	}

	.hero-subhead-line-1 {
		margin-bottom: 10px;
	}

	/* Labels: Archivo uppercase, letter-spaced, faint. */
	.hero-meta,
	.caption-label {
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.hero-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
		margin-top: 14px;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}

	.hero-subject {
		position: relative;

		@media (max-width: 968px) {
			display: none;
		}
	}

	.subject-frame {
		position: relative;
		aspect-ratio: 4 / 5;
		max-height: 460px;
		margin-left: auto;
		overflow: hidden;
	}

	.statue {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		filter: contrast(1.18) brightness(1.04) saturate(0.88);
		mix-blend-mode: var(--statue-blend, screen);
	}

	/* Cool scrims only: fade the statue into the page, no warm tint. */
	.subject-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse at 25% 25%,
				color-mix(in srgb, var(--accent) 18%, transparent) 0%,
				transparent 55%
			),
			linear-gradient(135deg, transparent 35%, color-mix(in srgb, var(--bg) 65%, transparent) 100%),
			linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--bg) 85%, transparent) 100%);
	}

	.subject-caption {
		position: absolute;
		left: 12px;
		bottom: 12px;
	}
</style>
