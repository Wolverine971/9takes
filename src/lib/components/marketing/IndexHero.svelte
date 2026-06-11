<!-- src/lib/components/marketing/IndexHero.svelte -->
<!--
  §01 OBSERVATION hero for content listing pages.
  Extracted 2026-06-10 (design audit): five listing pages carried
  near-identical hero markup + ~190 lines of CSS each.

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
		line1 = '',
		line2 = '',
		imageSrc,
		imageAlt = '',
		imageMono = '',
		meta,
		actions
	}: {
		num?: string;
		label?: string;
		title: string;
		line1?: string;
		line2?: string;
		imageSrc: string;
		imageAlt?: string;
		imageMono?: string;
		/** Optional mono meta row (e.g. Published / Last updated) between subheads and CTAs. */
		meta?: Snippet;
		actions?: Snippet;
	} = $props();
</script>

<section class="hero">
	<div class="grain" aria-hidden="true"></div>
	<div class="hero-pool" aria-hidden="true"></div>

	<div class="hero-inner">
		<div class="hero-text">
			<div class="hero-eyebrow">
				<SectionKicker {num} {label} />
			</div>

			<h1 class="hero-title">{title}</h1>

			<div class="scale-marker" aria-hidden="true">
				{#each Array(11) as _, i}
					<span class="tick" class:tick--major={i === 5}></span>
				{/each}
			</div>

			{#if line1}
				<p class="hero-subhead hero-subhead-line-1">{line1}</p>
			{/if}
			{#if line2}
				<p class="hero-subhead hero-subhead-line-2">{line2}</p>
			{/if}

			{#if meta}
				<p class="hero-meta mono">
					{@render meta()}
				</p>
			{/if}

			{#if actions}
				<div class="hero-actions">
					{@render actions()}
				</div>
			{/if}
		</div>

		<div class="hero-subject" aria-hidden="true">
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
					<div class="subject-mono">
						<span class="mono">{imageMono}</span>
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
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--grain-opacity, 0.05);
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	.hero-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				rgba(var(--pool-rgb), var(--pool-alpha-strong, 0.28)) 0%,
				rgba(var(--pool-rgb), var(--pool-alpha-soft, 0.08)) 30%,
				transparent 60%
			),
			radial-gradient(
				ellipse 90% 70% at 22% 12%,
				rgba(var(--pool-deep-rgb), var(--pool-alpha-mid, 0.18)) 0%,
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
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 6.4vw, 64px);
		line-height: 1.04;
		letter-spacing: -0.04em;
		color: var(--ink-bright);
		margin: 0;
		padding: 0;
	}

	.scale-marker {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 18px;
		margin: 24px 0 14px;
		opacity: 0.7;

		.tick {
			width: 1px;
			height: 8px;
			background: var(--stone-edge);

			&--major {
				height: 16px;
				background: var(--lamp-glow);
				width: 1.5px;
			}
		}
	}

	.hero-subhead {
		font-family: var(--font-display);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 640px;
		font-weight: 400;
		margin: 0;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.hero-subhead-line-1 {
		margin-bottom: 10px;
	}

	.hero-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
		margin-top: 14px;
		color: var(--ink-dim);
		font-size: 11.5px;
		letter-spacing: 0.08em;
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

	:global(:root.light) .statue {
		filter: contrast(1.05) brightness(1) saturate(1);
	}

	.subject-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
	}

	:global(:root.light) .subject-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.08) 0%, transparent 55%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.06) 100%);
	}

	.subject-mono {
		position: absolute;
		left: 12px;
		bottom: 12px;

		.mono {
			color: var(--ink-mid);
		}
	}
</style>
