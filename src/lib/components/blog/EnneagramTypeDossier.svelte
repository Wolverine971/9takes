<!-- src/lib/components/blog/EnneagramTypeDossier.svelte -->
<script lang="ts">
	type DossierStat = { label: string; value: number };

	type CoreEmotion = 'Anger' | 'Fear' | 'Shame';
	type Intelligence = 'Instinctual' | 'Intellectual' | 'Emotional';

	let {
		number = '0008',
		type = 8,
		archetype = 'The Challenger',
		title = 'The Challenger.',
		coreFear = 'Being controlled',
		coreDesire = 'Self-mastery',
		coreEmotion = 'Anger' as CoreEmotion,
		intelligence = 'Instinctual' as Intelligence,
		stats = [] as DossierStat[],
		annotations = [] as string[],
		imageSrc = '/greek_pantheon.webp',
		imageAlt = '',
		specimenLine = 'SPECIMEN · BUST · MARBLE · GREECE · UNDATED',
		ctaHref = '#full-breakdown',
		ctaLabel = 'Read the full breakdown',
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
		stats?: DossierStat[];
		annotations?: string[];
		imageSrc?: string;
		imageAlt?: string;
		specimenLine?: string;
		ctaHref?: string;
		ctaLabel?: string;
		lastObserved?: string;
	} = $props();

	const triadKey = $derived(coreEmotion.toLowerCase());
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
			<span class="mono dossier-id">№ {number} · TYPE {type} · {archetype.toUpperCase()}</span>
			{#if lastObserved}
				<span class="mono dossier-status">
					<span class="status-dot" aria-hidden="true"></span>
					STATUS: ACTIVE · LAST OBSERVED: {lastObserved}
				</span>
			{/if}
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
				</div>
				<p class="mono subject-meta">{specimenLine}</p>
			</div>

			<div class="dossier-content">
				<h3 class="dossier-title">{title}</h3>
				<p class="mono dossier-core">
					CORE FEAR: {coreFear} · CORE DESIRE: {coreDesire}
				</p>
				<p class="mono dossier-triad triad--{triadKey}">
					CORE EMOTION:
					<span class="triad-value">{coreEmotion}</span>
					· INTELLIGENCE:
					<span class="triad-value">{intelligence}</span>
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

				{#if annotations.length}
					<aside class="dossier-annotations" aria-label="Cross-references">
						{#each annotations as a}
							<span class="mono">{a}</span>
						{/each}
					</aside>
				{/if}

				{#if ctaHref && ctaLabel}
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

	.dossier-status {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--ink-mid);

		.status-dot {
			width: 7px;
			height: 7px;
			border-radius: 50%;
			background: var(--data-cyan);
			box-shadow: 0 0 8px rgba(94, 234, 212, 0.6);
		}
	}

	.dossier-body {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 36px;
		padding-top: 24px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	.dossier-subject {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.subject-stack {
		position: relative;
		aspect-ratio: 4 / 5;
		background: var(--night-deep);
		overflow: hidden;
		border-radius: 8px;
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

	.subject-meta {
		color: var(--ink-dim);
		margin: 0;
	}

	.dossier-content {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.dossier-title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(28px, 4vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		margin: 0 0 4px;
	}

	.dossier-core {
		color: var(--ink-mid);
		margin: 0;
	}

	.dossier-triad {
		color: var(--ink-mid);
		padding-bottom: 16px;
		border-bottom: 1px dashed var(--stone-mid);
		margin: 0;

		.triad-value {
			color: var(--data-cyan);
			font-weight: 600;
		}
	}

	.triad--anger .triad-value {
		color: var(--lamp-light);
	}

	.triad--fear .triad-value {
		color: var(--data-cyan);
	}

	.triad--shame .triad-value {
		color: #f0abfc; /* soft violet for shame triad */
	}

	.stats {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 4px 0;
	}

	.stat-row {
		display: grid;
		grid-template-columns: 110px 1fr 50px;
		align-items: center;
		gap: 16px;

		@media (max-width: 480px) {
			grid-template-columns: 92px 1fr 44px;
			gap: 10px;
		}
	}

	.stat-label {
		color: var(--ink-dim);
	}

	.stat-track {
		height: 10px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		position: relative;
		overflow: hidden;
		border-radius: 2px;
	}

	.stat-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--lamp-deep) 0%,
			var(--lamp-glow) 60%,
			var(--lamp-light) 100%
		);
		box-shadow: 0 0 8px rgba(245, 158, 11, 0.35);
		background-image:
			linear-gradient(90deg, var(--lamp-deep) 0%, var(--lamp-glow) 60%, var(--lamp-light) 100%),
			repeating-linear-gradient(
				90deg,
				transparent 0,
				transparent 9px,
				rgba(10, 8, 7, 0.55) 9px,
				rgba(10, 8, 7, 0.55) 10px
			);
		background-blend-mode: multiply;
	}

	.stat-value {
		color: var(--lamp-glow);
		text-align: right;
	}

	.dossier-annotations {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 20px;
		padding: 14px;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 6px;

		.mono {
			color: var(--data-cyan);
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

		.status-dot {
			background: var(--data-cyan);
			box-shadow: 0 0 6px rgba(15, 118, 110, 0.5);
		}

		.stat-track {
			background: #f5f0e8;
		}

		.stat-fill {
			box-shadow: 0 0 6px rgba(217, 119, 6, 0.25);
			background-image:
				linear-gradient(90deg, var(--lamp-deep) 0%, var(--lamp-glow) 60%, var(--lamp-light) 100%),
				repeating-linear-gradient(
					90deg,
					transparent 0,
					transparent 9px,
					rgba(255, 255, 255, 0.45) 9px,
					rgba(255, 255, 255, 0.45) 10px
				);
		}

		.dossier-annotations {
			background: #fdfaf2;

			.mono {
				color: var(--data-cyan);
			}
		}

		.dossier-link:hover {
			border-bottom-color: var(--lamp-deep);
			color: var(--lamp-deep);
		}

		.triad--shame .triad-value {
			color: #a21caf; /* darker violet so shame value still pops on cream */
		}

		.triad--anger .triad-value {
			color: var(--lamp-deep);
		}

		.triad--fear .triad-value {
			color: var(--data-cyan);
		}
	}
</style>
