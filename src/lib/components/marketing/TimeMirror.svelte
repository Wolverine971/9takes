<!-- src/lib/components/marketing/TimeMirror.svelte -->
<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';

	type Era = 'modern' | 'ancient';

	const ERA_CADENCE_MS = 6000;

	let activeEra = $state<Era>('modern');
	let eraHeld = $state(false);
	let pageVisible = $state(true);

	const nextEra = $derived<Era>(activeEra === 'modern' ? 'ancient' : 'modern');
	const currentEraName = $derived(activeEra === 'modern' ? 'NOW' : 'THEN');
	const nextEraName = $derived(nextEra === 'modern' ? 'NOW' : 'THEN');
	const currentEraDescription = $derived(
		activeEra === 'modern'
			? 'nine modern people gathered in conversation beneath a streetlamp'
			: 'nine marble Greek philosophers gathered in conversation around a fire'
	);
	const nextEraDescription = $derived(
		nextEra === 'modern'
			? 'nine modern people beneath a streetlamp'
			: 'nine marble Greek philosophers around a fire'
	);
	const actionLabel = $derived(
		`Showing ${currentEraDescription}. Activate to show ${nextEraDescription}.${
			prefersReducedMotion.current
				? ' Automatic transitions are off because reduced motion is enabled.'
				: ' The image also changes automatically every six seconds.'
		}`
	);

	$effect(() => {
		const queuedEra = nextEra;

		if (prefersReducedMotion.current || eraHeld || !pageVisible) return;

		const timeout = window.setTimeout(() => {
			activeEra = queuedEra;
		}, ERA_CADENCE_MS);

		return () => window.clearTimeout(timeout);
	});

	function showNextEra() {
		activeEra = nextEra;
	}

	function holdEra(event: PointerEvent) {
		if (event.pointerType === 'mouse') eraHeld = true;
	}

	function releaseEra(event: PointerEvent) {
		if (event.pointerType === 'mouse') eraHeld = false;
	}

	function handleVisibilityChange() {
		pageVisible = document.visibilityState === 'visible';
	}
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />

<figure class="hero-figure">
	<button
		type="button"
		class="image-frame era-frame"
		data-era={activeEra}
		aria-label={actionLabel}
		onclick={showNextEra}
		onpointerenter={holdEra}
		onpointerleave={releaseEra}
	>
		<img
			src="/images/home-reimagined/streetlamp-nine.webp"
			class="era-image era-image--modern"
			alt=""
			width="1400"
			height="788"
			loading="eager"
			fetchpriority="high"
			decoding="async"
		/>
		<img
			src="/images/home-reimagined/ancient-fire-nine.webp"
			class="era-image era-image--ancient"
			alt=""
			width="1400"
			height="788"
			loading="eager"
			decoding="async"
		/>
		<div class="image-scrim" aria-hidden="true"></div>
		<div class="image-coordinate" aria-hidden="true">
			{#if eraHeld}
				{currentEraName} · HELD
			{:else if prefersReducedMotion.current}
				{currentEraName} · CLICK FOR {nextEraName}
			{:else}
				{currentEraName} · CLICK FOR {nextEraName} · AUTO 06S
			{/if}
		</div>
		<div class="image-caption" aria-hidden="true">
			<span class="caption-mark"></span>
			<span>The setting changes. The question does not.</span>
		</div>
	</button>
	<figcaption>
		<span>THE CIRCLE · THEN / NOW</span>
		<span aria-hidden="true">01 02 03 04 05 06 07 08 09</span>
	</figcaption>
</figure>

<style lang="scss">
	.hero-figure {
		min-width: 0;
		width: 100%;
		margin: 0;
	}

	.image-frame {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 16 / 9;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, var(--stone-edge));
		border-radius: 1rem;
		background: var(--night-mid);
		color: inherit;
		font: inherit;
		text-align: left;
		box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.36);
		cursor: pointer;
	}

	:global(.era-frame:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 4px;
	}

	.image-frame::before,
	.image-frame::after {
		position: absolute;
		z-index: 3;
		width: 4rem;
		height: 4rem;
		border-color: color-mix(in srgb, var(--lamp-glow) 60%, transparent);
		pointer-events: none;
		content: '';
	}

	.image-frame::before {
		inset: 0.85rem auto auto 0.85rem;
		border-top: 1px solid;
		border-left: 1px solid;
	}

	.image-frame::after {
		inset: auto 0.85rem 0.85rem auto;
		border-right: 1px solid;
		border-bottom: 1px solid;
	}

	.image-frame img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.era-image--modern {
		filter: saturate(0.86) contrast(1.04);
	}

	.era-image--ancient {
		opacity: 0;
		filter: saturate(0.82) contrast(1.04) brightness(0.96);
	}

	.era-frame[data-era='ancient'] .era-image--ancient {
		opacity: 1;
	}

	.image-scrim {
		position: absolute;
		z-index: 1;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(10, 8, 7, 0.06) 40%, rgba(10, 8, 7, 0.82) 100%),
			linear-gradient(90deg, rgba(10, 8, 7, 0.18), transparent 34%);
		pointer-events: none;
	}

	.image-coordinate {
		position: absolute;
		z-index: 4;
		top: 1.15rem;
		right: 1.2rem;
		color: rgba(250, 248, 244, 0.72);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.08em;
	}

	.image-caption {
		position: absolute;
		z-index: 4;
		right: 1.5rem;
		bottom: 1.5rem;
		left: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: rgba(250, 248, 244, 0.9);
		font-size: 0.9rem;
	}

	.caption-mark {
		width: 1.8rem;
		height: 1px;
		background: var(--lamp-glow);
	}

	figcaption {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 0.2rem 0;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.08em;
	}

	@media (prefers-reduced-motion: no-preference) {
		.era-image--ancient {
			will-change: opacity;
			transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
		}
	}

	@media (max-width: 46rem) {
		.image-coordinate,
		.image-caption {
			display: none;
		}

		figcaption span:last-child {
			font-size: 0.55rem;
			letter-spacing: 0.03em;
		}
	}
</style>
