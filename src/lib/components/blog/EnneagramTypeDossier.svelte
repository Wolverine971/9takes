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
		imageAlt,
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
	const resolvedImageAlt = $derived(
		imageAlt || `Greek pantheon representing Enneagram Type ${type}, ${archetype}`
	);

	const TRIAD_NAMES: Record<CoreEmotion, string> = {
		Anger: 'GUT',
		Shame: 'HEART',
		Fear: 'HEAD'
	};
	const triadName = $derived(TRIAD_NAMES[coreEmotion]);
</script>

<!-- No font <svelte:head> here: the Cold Light faces are self-hosted in the
     root layout (2026-06-11 mobile audit dropped the duplicate Google Fonts copy). -->

<section class="type-dossier">
	<article class="dossier-card">
		<div class="dossier-card-top">
			<span class="dlabel dossier-id">TYPE {type} · {archetype.toUpperCase()}</span>
			<span class="dlabel dossier-triad-tag triad-tag--{triadKey}">{triadName} TRIAD</span>
		</div>

		<div class="dossier-body">
			<div class="dossier-subject">
				<div class="subject-stack">
					<img
						src={imageSrc}
						alt={resolvedImageAlt}
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
							{#each specimenAttributes as attr, i (attr)}
								<li class="dlabel specimen-attr" style="--i: {i}">{attr}</li>
							{/each}
						</ul>
					{/if}
				</div>

				<dl class="dossier-classifications" aria-label="Classifications">
					<div class="classification-row">
						<dt class="dlabel">STANCE</dt>
						<dd class="classification-value">{hornevian}</dd>
					</div>
					<div class="classification-row">
						<dt class="dlabel">HARMONIC</dt>
						<dd class="classification-value">{harmonic}</dd>
					</div>
				</dl>
			</div>

			<div class="dossier-content">
				{#if akaArchetypes}
					<p class="dossier-aka">
						<span class="dlabel dossier-aka-label">AKA</span>
						<span class="dossier-aka-value">
							&ldquo;{akaArchetypes[0]}&rdquo;
							<span class="dossier-aka-or">or</span>
							&ldquo;{akaArchetypes[1]}&rdquo;
						</span>
					</p>
				{/if}
				<p class="dlabel dossier-core">
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
						{#each stats as stat (stat.label)}
							<div class="stat-row">
								<span class="dlabel stat-label">{stat.label}</span>
								<div class="stat-track" aria-hidden="true">
									<div class="stat-fill" style="width: {stat.value}%"></div>
								</div>
								<span class="dlabel stat-value">{stat.value}%</span>
							</div>
						{/each}
					</div>
				{/if}

				{#if stressLine && growthLine}
					<div class="dossier-movement" aria-label="Movement under stress and in growth">
						<div class="movement-row movement-row--stress">
							<span class="dlabel movement-tag">STRESS LINE</span>
							<span class="movement-arrow" aria-hidden="true">↘</span>
							<span class="movement-target">{stressLine.type}</span>
							<span class="dlabel movement-name">{stressLine.archetype}</span>
						</div>
						<div class="movement-row movement-row--growth">
							<span class="dlabel movement-tag">GROWTH LINE</span>
							<span class="movement-arrow" aria-hidden="true">↗</span>
							<span class="movement-target">{growthLine.type}</span>
							<span class="dlabel movement-name">{growthLine.archetype}</span>
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
	/* Cold Light dossier card: global tokens only, one tint. The statue reads
	   as grey stone under an indigo wash; labels are Archivo uppercase. */
	.type-dossier {
		margin: 1.5rem 0 2.25rem;
		color: var(--text);
		font-family: var(--font-talk);
	}

	.dlabel {
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
		line-height: 1.4;
	}

	.dossier-card {
		background: var(--surface);
		border: 1px solid var(--rule);
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
		border-bottom: 1px solid var(--rule);
		flex-wrap: wrap;
	}

	.dossier-id {
		color: var(--highlight);
	}

	.dossier-triad-tag {
		color: var(--text-muted);
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
		background: var(--bg);
		overflow: hidden;
		border-radius: 10px;
	}

	.dossier-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: grayscale(1) contrast(1.15) brightness(0.9);
	}

	/* The indigo tint the statue library shares, applied over the grey stone. */
	.dossier-image-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse at 30% 25%,
				color-mix(in srgb, var(--highlight) 14%, transparent) 0%,
				transparent 60%
			),
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--accent) 22%, transparent) 0%,
				color-mix(in srgb, var(--bg) 70%, transparent) 100%
			);
	}

	.corner {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: color-mix(in srgb, var(--highlight) 60%, transparent);
		border-style: solid;
		border-width: 0;
	}

	.corner--tl {
		top: 6px;
		left: 6px;
		border-top-width: 1px;
		border-left-width: 1px;
	}

	.corner--tr {
		top: 6px;
		right: 6px;
		border-top-width: 1px;
		border-right-width: 1px;
	}

	.corner--bl {
		bottom: 6px;
		left: 6px;
		border-bottom-width: 1px;
		border-left-width: 1px;
	}

	.corner--br {
		bottom: 6px;
		right: 6px;
		border-bottom-width: 1px;
		border-right-width: 1px;
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
		font-size: 0.625rem;
		letter-spacing: 0.2em;
		color: var(--text);
		text-shadow:
			0 1px 4px color-mix(in srgb, var(--bg) 90%, transparent),
			0 0 12px color-mix(in srgb, var(--bg) 60%, transparent);
		padding-left: calc(var(--i, 0) * 8%);
		opacity: 0.95;

		&::before {
			content: '·';
			margin-right: 6px;
			color: var(--highlight);
		}
	}

	.dossier-classifications {
		margin: auto 0 0;
		padding: 14px 16px;
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
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
	}

	.classification-value {
		margin: 0;
		font-family: var(--font-talk);
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--text);
		text-align: right;
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

	.dossier-aka-value {
		font-family: var(--font-talk);
		font-size: clamp(1.125rem, 2.2vw, 1.375rem);
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.01em;
		color: var(--text);
	}

	.dossier-aka-or {
		font-family: var(--font-voice);
		color: var(--highlight);
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
		margin: 0;
		padding-bottom: 16px;
		border-bottom: 1px dashed var(--rule);
	}

	.dossier-core-value {
		color: var(--text);
		font-family: var(--font-talk);
		font-size: var(--font-size-sm);
		letter-spacing: normal;
		text-transform: none;
		font-weight: 500;
	}

	.dossier-core-value.triad-value {
		color: var(--highlight);
		font-weight: 600;
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

	.stat-track {
		position: relative;
		height: 7px;
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 0;
		overflow: hidden;
	}

	/* Quartile gridlines (25 / 50 / 75) above the fill at low opacity, so the bar
	   reads like an instrument gauge instead of a UI progress bar. */
	.stat-track::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image: linear-gradient(
			90deg,
			transparent calc(25% - 1px),
			var(--text-faint) calc(25% - 1px),
			var(--text-faint) 25%,
			transparent 25%,
			transparent calc(50% - 1px),
			var(--text-faint) calc(50% - 1px),
			var(--text-faint) 50%,
			transparent 50%,
			transparent calc(75% - 1px),
			var(--text-faint) calc(75% - 1px),
			var(--text-faint) 75%,
			transparent 75%
		);
		opacity: 0.35;
	}

	.stat-fill {
		position: relative;
		height: 100%;
		background: linear-gradient(90deg, var(--accent-deep) 0%, var(--accent) 70%);
		box-shadow: 0 0 4px color-mix(in srgb, var(--accent) 35%, transparent);
	}

	/* Lavender leading edge, like the needle of a calibrated meter. */
	.stat-fill::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: 1.5px;
		background: var(--highlight);
	}

	.stat-value {
		color: var(--text-muted);
		text-align: right;
	}

	.dossier-movement {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px 16px;
		margin-top: auto;
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
	}

	.movement-row {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.movement-tag {
		white-space: nowrap;
	}

	.movement-arrow {
		font-size: var(--font-size-base);
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
		font-family: var(--font-talk);
		font-weight: 600;
		font-size: var(--font-size-sm);
		flex-shrink: 0;
	}

	.movement-name {
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	/* One tint: stress is the quiet line, growth the lit one. */
	.movement-row--stress {
		.movement-arrow,
		.movement-target {
			color: var(--text-faint);
		}
		.movement-target {
			border-color: var(--rule);
		}
	}

	.movement-row--growth {
		.movement-arrow,
		.movement-target {
			color: var(--highlight);
		}
		.movement-target {
			background: var(--accent-deep);
		}
	}

	.dossier-cta-row {
		margin-top: 4px;
	}

	.dossier-link {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		color: var(--highlight);
		font-family: var(--font-talk);
		font-weight: 600;
		font-size: var(--font-size-base);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
		transition: color 0.2s ease;

		&:hover {
			color: var(--text);
		}

		&:focus-visible {
			outline: 2px solid var(--highlight);
			outline-offset: 3px;
			border-radius: 4px;
		}
	}
</style>
