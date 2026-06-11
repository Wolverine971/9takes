<!-- src/lib/components/blog/EnneagramTypeDossier.svelte -->
<script lang="ts">
	type DossierStat = { label: string; value: number };

	type CoreEmotion = 'Anger' | 'Fear' | 'Shame';
	type Intelligence = 'Instinctual' | 'Intellectual' | 'Emotional';
	type Hornevian = 'Compliant' | 'Withdrawn' | 'Assertive';
	type Harmonic = 'Positive Outlook' | 'Competency' | 'Reactive';
	type MovementLine = { type: number; archetype: string };

	let {
		number = '0008',
		type = 8,
		archetype = 'The Challenger',
		title = 'The Challenger.',
		coreFear = 'Being controlled',
		coreDesire = 'Self-mastery',
		coreEmotion = 'Anger' as CoreEmotion,
		intelligence = 'Instinctual' as Intelligence,
		hornevian = 'Assertive' as Hornevian,
		harmonic = 'Reactive' as Harmonic,
		stressLine = null as MovementLine | null,
		growthLine = null as MovementLine | null,
		akaArchetypes = null as [string, string] | null,
		stats = [] as DossierStat[],
		imageSrc = '/greek_pantheon.webp',
		imageAlt = '',
		specimenLine = 'SPECIMEN · BUST · MARBLE · GREECE · UNDATED',
		ctaHref = '#full-breakdown',
		ctaLabel = 'Read the full breakdown',
		showCta = false,
		lastObserved = ''
	}: {
		number?: string;
		type?: number;
		archetype?: string;
		title?: string;
		coreFear?: string;
		coreDesire?: string;
		coreEmotion?: CoreEmotion;
		intelligence?: Intelligence;
		hornevian?: Hornevian;
		harmonic?: Harmonic;
		stressLine?: MovementLine | null;
		growthLine?: MovementLine | null;
		akaArchetypes?: [string, string] | null;
		stats?: DossierStat[];
		imageSrc?: string;
		imageAlt?: string;
		specimenLine?: string;
		ctaHref?: string;
		ctaLabel?: string;
		showCta?: boolean;
		lastObserved?: string;
	} = $props();

	const specimenAttributes = $derived(
		specimenLine
			.split('·')
			.map((s) => s.trim())
			.filter(Boolean)
	);

	const triadKey = $derived(coreEmotion.toLowerCase());

	const TRIAD_NAMES: Record<CoreEmotion, string> = {
		Anger: 'GUT',
		Shame: 'HEART',
		Fear: 'HEAD'
	};
	const triadName = $derived(TRIAD_NAMES[coreEmotion]);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<section class="type-dossier">
	<article class="dossier-card">
		<div class="dossier-card-top">
			<span class="mono dossier-id">TYPE {type} · {archetype.toUpperCase()}</span>
			<span class="mono dossier-triad-tag triad-tag--{triadKey}">{triadName} TRIAD</span>
		</div>

		<div class="dossier-body">
			<div class="dossier-subject">
				<div class="subject-stack">
					<img
						src={imageSrc}
						alt={imageAlt}
						class="dossier-image"
						loading="lazy"
						decoding="async"
					/>
					<div class="dossier-image-vignette" aria-hidden="true"></div>
					<div class="corner corner--tl" aria-hidden="true"></div>
					<div class="corner corner--tr" aria-hidden="true"></div>
					<div class="corner corner--bl" aria-hidden="true"></div>
					<div class="corner corner--br" aria-hidden="true"></div>
					{#if specimenAttributes.length}
						<ul class="specimen-attributes" aria-label="Specimen attributes">
							{#each specimenAttributes as attr, i}
								<li class="mono specimen-attr" style="--i: {i}">{attr}</li>
							{/each}
						</ul>
					{/if}
				</div>

				<dl class="dossier-classifications" aria-label="Classifications">
					<div class="classification-row">
						<dt class="mono">STANCE</dt>
						<dd class="classification-value">{hornevian}</dd>
					</div>
					<div class="classification-row">
						<dt class="mono">HARMONIC</dt>
						<dd class="classification-value">{harmonic}</dd>
					</div>
				</dl>
			</div>

			<div class="dossier-content">
				{#if akaArchetypes}
					<p class="dossier-aka">
						<span class="mono dossier-aka-label">AKA</span>
						<span class="dossier-aka-value">
							&ldquo;{akaArchetypes[0]}&rdquo;
							<span class="dossier-aka-or">or</span>
							&ldquo;{akaArchetypes[1]}&rdquo;
						</span>
					</p>
				{/if}
				<p class="mono dossier-core">
					<span class="dossier-core-label">CORE FEAR</span>
					<span class="dossier-core-value">{coreFear}</span>
					<span class="dossier-core-label">CORE DESIRE</span>
					<span class="dossier-core-value">{coreDesire}</span>
					<span class="dossier-core-label">INTELLIGENCE</span>
					<span class="dossier-core-value">{intelligence}</span>
					<span class="dossier-core-label">CORE EMOTION</span>
					<span class="dossier-core-value triad-value triad--{triadKey}">{coreEmotion}</span>
				</p>

				{#if stats.length}
					<div class="stats">
						{#each stats as stat}
							<div class="stat-row">
								<span class="mono stat-label">{stat.label}</span>
								<div class="stat-track" aria-hidden="true">
									<div class="stat-fill" style="width: {stat.value}%"></div>
								</div>
								<span class="mono stat-value">{stat.value}%</span>
							</div>
						{/each}
					</div>
				{/if}

				{#if stressLine && growthLine}
					<div class="dossier-movement" aria-label="Movement under stress and in growth">
						<div class="movement-row movement-row--stress">
							<span class="mono movement-tag">STRESS LINE</span>
							<span class="movement-arrow" aria-hidden="true">↘</span>
							<span class="movement-target">{stressLine.type}</span>
							<span class="mono movement-name">{stressLine.archetype}</span>
						</div>
						<div class="movement-row movement-row--growth">
							<span class="mono movement-tag">GROWTH LINE</span>
							<span class="movement-arrow" aria-hidden="true">↗</span>
							<span class="movement-target">{growthLine.type}</span>
							<span class="mono movement-name">{growthLine.archetype}</span>
						</div>
					</div>
				{/if}

				{#if showCta && ctaHref && ctaLabel}
					<div class="dossier-cta-row">
						<a class="dossier-link" href={ctaHref}>
							{ctaLabel}
							<span aria-hidden="true">→</span>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</article>
</section>

<style lang="scss">
	/* All tokens scoped to .type-dossier so this component is self-contained
	   and matches the Streetlamp Symposium V4 dossier card aesthetic. */
	.type-dossier {
		--night-deep: #0a0807;
		--night-mid: #16110d;
		--stone-warm: #241d17;
		--stone-mid: #3a302a;
		--stone-edge: #5c4f47;
		--lamp-glow: #f59e0b;
		--lamp-deep: #b45309;
		--lamp-light: #fbbf24;
		--data-cyan: #5eead4;
		--ink-bright: #faf8f4;
		--ink-mid: #a8a095;
		--ink-dim: #5c4f47;
		--pool-rgb: 245, 158, 11;
		--font-display: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

		margin: 1.5rem 0 2.25rem;
		color: var(--ink-bright);
		font-family: var(--font-body);
	}

	.mono {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
		line-height: 1.4;
	}

	.dossier-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		padding: 28px 32px;

		@media (max-width: 768px) {
			padding: 18px 16px;
		}
	}

	.dossier-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding-bottom: 22px;
		border-bottom: 1px solid var(--stone-mid);
		flex-wrap: wrap;
	}

	.dossier-id {
		color: var(--lamp-glow);
	}

	.dossier-triad-tag {
		color: var(--ink-mid);
		font-weight: 600;

		&.triad-tag--anger {
			color: var(--lamp-light);
		}

		&.triad-tag--fear {
			color: var(--data-cyan);
		}

		&.triad-tag--shame {
			color: #f0abfc;
		}
	}

	.dossier-body {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 36px;
		padding-top: 24px;

		@media (max-width: 960px) {
			grid-template-columns: 240px 1fr;
			gap: 24px;
		}

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	.dossier-subject {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: 0;
	}

	.subject-stack {
		position: relative;
		aspect-ratio: 4 / 5;
		background: var(--night-deep);
		overflow: hidden;
		border-radius: 0.625rem;
	}

	.dossier-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: contrast(1.2) brightness(0.95) saturate(0.7) sepia(0.18);
	}

	.dossier-image-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 30% 25%, rgba(var(--pool-rgb), 0.18) 0%, transparent 60%),
			linear-gradient(135deg, transparent 40%, rgba(10, 8, 7, 0.7) 100%);
	}

	.corner {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: var(--lamp-glow);
		border-style: solid;
		border-width: 0;

		&--tl {
			top: 6px;
			left: 6px;
			border-top-width: 1px;
			border-left-width: 1px;
		}
		&--tr {
			top: 6px;
			right: 6px;
			border-top-width: 1px;
			border-right-width: 1px;
		}
		&--bl {
			bottom: 6px;
			left: 6px;
			border-bottom-width: 1px;
			border-left-width: 1px;
		}
		&--br {
			bottom: 6px;
			right: 6px;
			border-bottom-width: 1px;
			border-right-width: 1px;
		}
	}

	.specimen-attributes {
		position: absolute;
		inset: 14px;
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: none;
		z-index: 2;

		@media (max-width: 480px) {
			inset: 10px;
		}
	}

	.specimen-attr {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.2em;
		color: var(--ink-bright);
		text-shadow:
			0 1px 4px rgba(10, 8, 7, 0.9),
			0 0 12px rgba(10, 8, 7, 0.6);
		padding-left: calc(var(--i, 0) * 8%);
		opacity: 0.95;

		&::before {
			content: '·';
			margin-right: 6px;
			color: var(--lamp-glow);
			text-shadow: 0 0 6px rgba(var(--pool-rgb), 0.8);
		}
	}

	.dossier-classifications {
		margin: auto 0 0;
		padding: 14px 16px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 0.625rem;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.classification-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		min-height: 26px;
	}

	.classification-row dt {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
		line-height: 1.4;
	}

	.classification-value {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-bright);
		text-align: right;
	}

	.triad-value.triad--anger {
		color: var(--lamp-light);
	}

	.triad-value.triad--fear {
		color: var(--data-cyan);
	}

	.triad-value.triad--shame {
		color: #f0abfc; /* soft violet for shame triad */
	}

	.dossier-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-width: 0;
	}

	.dossier-aka {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 10px 14px;
		margin: 0;
		padding-bottom: 8px;
	}

	.dossier-aka-label {
		color: var(--ink-dim);
		font-size: 11px;
	}

	.dossier-aka-value {
		font-family: var(--font-display);
		font-size: clamp(18px, 2.2vw, 22px);
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.01em;
		color: var(--ink-bright);
	}

	.dossier-aka-or {
		color: var(--ink-dim);
		font-weight: 400;
		font-style: italic;
		margin: 0 2px;
	}

	.dossier-core {
		display: grid;
		grid-template-columns: max-content 1fr;
		column-gap: 14px;
		row-gap: 6px;
		align-items: baseline;
		color: var(--ink-mid);
		margin: 0;
		padding-bottom: 16px;
		border-bottom: 1px dashed var(--stone-mid);
	}

	.dossier-core-label {
		color: var(--ink-dim);
		font-size: 11px;
	}

	.dossier-core-value {
		color: var(--ink-bright);
		font-family: var(--font-mono);
		font-size: 13px;
		letter-spacing: 0.02em;
		text-transform: none;
		font-weight: 500;
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 4px 0 2px;
	}

	.stat-row {
		display: grid;
		grid-template-columns: 132px 1fr 44px;
		align-items: center;
		gap: 14px;

		@media (max-width: 480px) {
			grid-template-columns: 104px 1fr 38px;
			gap: 10px;
		}
	}

	.stat-label {
		color: var(--ink-dim);
		font-size: 11px;
	}

	.stat-track {
		position: relative;
		height: 7px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 0;
		overflow: hidden;
	}

	/* Quartile gridlines (25 / 50 / 75) — render above the fill at low opacity
	   so the bar reads like an instrument gauge instead of a UI progress bar. */
	.stat-track::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: linear-gradient(
			90deg,
			transparent calc(25% - 1px),
			var(--ink-dim) calc(25% - 1px),
			var(--ink-dim) 25%,
			transparent 25%,
			transparent calc(50% - 1px),
			var(--ink-dim) calc(50% - 1px),
			var(--ink-dim) 50%,
			transparent 50%,
			transparent calc(75% - 1px),
			var(--ink-dim) calc(75% - 1px),
			var(--ink-dim) 75%,
			transparent 75%
		);
		opacity: 0.45;
	}

	.stat-fill {
		position: relative;
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--lamp-deep) 0%,
			var(--lamp-glow) 55%,
			var(--lamp-light) 100%
		);
		box-shadow: 0 0 4px rgba(245, 158, 11, 0.28);
	}

	/* Bright leading edge — like the needle of a calibrated meter. */
	.stat-fill::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 1.5px;
		background: var(--lamp-light);
		box-shadow: 0 0 4px rgba(251, 191, 36, 0.65);
	}

	.stat-value {
		color: var(--lamp-glow);
		text-align: right;
		font-size: 11px;
	}

	.dossier-movement {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px 16px;
		margin-top: auto;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 0.625rem;
	}

	.movement-row {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.movement-tag {
		color: var(--ink-dim);
		white-space: nowrap;
	}

	.movement-arrow {
		font-family: var(--font-mono);
		font-size: 16px;
		line-height: 1;
		flex-shrink: 0;
	}

	.movement-target {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 26px;
		border-radius: 4px;
		border: 1px solid currentColor;
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.04em;
		flex-shrink: 0;
	}

	.movement-name {
		color: var(--ink-mid);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.movement-row--stress {
		.movement-arrow,
		.movement-target {
			color: var(--lamp-glow);
		}
		.movement-target {
			background: rgba(var(--pool-rgb), 0.1);
		}
	}

	.movement-row--growth {
		.movement-arrow,
		.movement-target {
			color: var(--data-cyan);
		}
		.movement-target {
			background: rgba(94, 234, 212, 0.08);
		}
	}

	.dossier-cta-row {
		margin-top: 4px;
	}

	.dossier-link {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		color: var(--lamp-glow);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 16px;
		border-bottom: 1px solid transparent;
		padding-bottom: 2px;
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;

		&:hover {
			border-bottom-color: var(--lamp-glow);
			color: var(--lamp-light);
		}
	}

	/* =========================================================
	   Light mode — site-wide theme toggle sets <html class="light">.
	   We rewire the token palette + a handful of selectors that
	   behave differently against a bright background.
	   ========================================================= */
	:global(html.light) .type-dossier {
		--night-deep: #faf8f4;
		--night-mid: #f2ebdd;
		--stone-warm: #ffffff;
		--stone-mid: #f5f0e8;
		--stone-edge: #d6ccb8;

		--lamp-glow: #b45309;
		--lamp-deep: #92400e;
		--lamp-light: #d97706;

		--data-cyan: #0f766e;

		--ink-bright: #1c1917;
		--ink-mid: #44403c;
		--ink-dim: #78716c;

		--pool-rgb: 217, 119, 6;

		.dossier-card {
			box-shadow:
				0 1px 0 rgba(120, 113, 108, 0.12),
				0 12px 32px rgba(120, 113, 108, 0.08);
		}

		.dossier-image {
			filter: contrast(1.05) brightness(1) saturate(0.9);
		}

		.dossier-image-vignette {
			background:
				radial-gradient(ellipse at 30% 25%, rgba(var(--pool-rgb), 0.06) 0%, transparent 60%),
				linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.05) 100%);
		}

		.specimen-attr {
			color: #faf8f4;
			text-shadow:
				0 1px 3px rgba(28, 25, 23, 0.85),
				0 0 10px rgba(28, 25, 23, 0.6);
		}

		.status-dot {
			background: var(--data-cyan);
			box-shadow: 0 0 6px rgba(15, 118, 110, 0.5);
		}

		.dossier-classifications {
			background: #fdfaf2;
		}

		.stat-track {
			background: #f5f0e8;
		}

		.stat-track::after {
			opacity: 0.5;
		}

		.stat-fill {
			box-shadow: 0 0 4px rgba(217, 119, 6, 0.22);
		}

		.stat-fill::after {
			box-shadow: 0 0 4px rgba(180, 83, 9, 0.55);
		}

		.dossier-movement {
			background: #fdfaf2;
		}

		.movement-row--growth .movement-target {
			background: rgba(15, 118, 110, 0.08);
		}

		.movement-row--stress .movement-target {
			background: rgba(180, 83, 9, 0.08);
		}

		.dossier-link:hover {
			border-bottom-color: var(--lamp-deep);
			color: var(--lamp-deep);
		}

		.triad-value.triad--shame {
			color: #a21caf; /* darker violet so shame value still pops on cream */
		}

		.triad-value.triad--anger {
			color: var(--lamp-deep);
		}

		.triad-value.triad--fear {
			color: var(--data-cyan);
		}
	}
</style>
