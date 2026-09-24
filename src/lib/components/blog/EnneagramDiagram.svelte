<!-- src/lib/components/blog/EnneagramDiagram.svelte -->
<!-- Interactive Enneagram symbol: hover a number to read the type, click it to open the guide. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showLabels?: boolean;
	}

	let { size = 'md', showLabels = true }: Props = $props();

	type Source = 'node' | 'legend';

	// Type metadata (colors come from shared constants)
	const typeMetadata: Record<
		number,
		{
			description: string;
			coreEmotion: string;
			emotionalStance: string;
			stanceDetail: string;
		}
	> = {
		1: {
			description:
				'Ethical, dedicated and reliable. Motivated by a desire to live the right way and improve the world.',
			coreEmotion: 'Anger',
			emotionalStance: 'Internalizes',
			stanceDetail: 'anger becomes the inner critic'
		},
		2: {
			description: 'Warm, caring and giving. Motivated by a need to be loved and needed.',
			coreEmotion: 'Shame',
			emotionalStance: 'Represses',
			stanceDetail: 'denies shame through giving'
		},
		3: {
			description: 'Success-oriented and image-conscious. Motivated by a need to be successful.',
			coreEmotion: 'Shame',
			emotionalStance: 'Compensates',
			stanceDetail: 'channels shame into performance'
		},
		4: {
			description: 'Creative, sensitive and expressive. Motivated by a need to be understood.',
			coreEmotion: 'Shame',
			emotionalStance: 'Identifies',
			stanceDetail: 'inhabits shame as identity'
		},
		5: {
			description: 'Analytical, detached and private. Motivated by a need to gain knowledge.',
			coreEmotion: 'Fear',
			emotionalStance: 'Withdraws',
			stanceDetail: 'retreats from fear into the mind'
		},
		6: {
			description:
				'Committed, practical and vigilant. Motivated by fear and the need for security.',
			coreEmotion: 'Fear',
			emotionalStance: 'Engages',
			stanceDetail: 'faces fear through vigilance'
		},
		7: {
			description:
				'Fun, spontaneous and versatile. Motivated by a need to be happy and avoid pain.',
			coreEmotion: 'Fear',
			emotionalStance: 'Reframes',
			stanceDetail: 'escapes fear through possibilities'
		},
		8: {
			description: 'Powerful, dominating and self-confident. Motivated by a need to be strong.',
			coreEmotion: 'Anger',
			emotionalStance: 'Expresses',
			stanceDetail: 'uses anger as fuel'
		},
		9: {
			description: 'Easygoing, accommodating and peaceful. Motivated by a need to keep the peace.',
			coreEmotion: 'Anger',
			emotionalStance: 'Suppresses',
			stanceDetail: 'numbs anger for harmony'
		}
	};

	const enneagramTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
		id,
		name: ENNEAGRAM_TYPE_COLORS[id].name,
		shortName: ENNEAGRAM_TYPE_COLORS[id].name.replace(/^The /, ''),
		color: ENNEAGRAM_TYPE_COLORS[id].color,
		...typeMetadata[id]
	}));

	// Geometry in viewBox units (0-100). Type 9 sits at the top and the rest
	// run clockwise every 40 degrees.
	const CENTER = 50;
	const RADIUS = 40;

	const positions = enneagramTypes.map(({ id }) => {
		const radians = ((id % 9) * 40 - 90) * (Math.PI / 180);
		return {
			x: CENTER + RADIUS * Math.cos(radians),
			y: CENTER + RADIUS * Math.sin(radians)
		};
	});

	// Inner triangle (3-6-9) and hexad (1-4-2-8-5-7-1), as type-id pairs.
	const lines = [
		...[
			[3, 6],
			[6, 9],
			[9, 3]
		].map(([a, b]) => ({ a, b, kind: 'triangle' })),
		...[
			[1, 4],
			[4, 2],
			[2, 8],
			[8, 5],
			[5, 7],
			[7, 1]
		].map(([a, b]) => ({ a, b, kind: 'hexad' }))
	];

	let activeType = $state<number | null>(null);
	let activeSource = $state<Source | null>(null);
	// Last type opened from the symbol. Keeps the card's text in place while it fades out.
	let detailType = $state(1);
	let releaseTimer: ReturnType<typeof setTimeout> | undefined;

	let detailsOpen = $derived(activeType !== null && activeSource === 'node');
	let detail = $derived(enneagramTypes[detailType - 1]);
	let activeColor = $derived(activeType ? enneagramTypes[activeType - 1].color : undefined);

	function activate(id: number, source: Source) {
		clearTimeout(releaseTimer);
		activeType = id;
		activeSource = source;
		if (source === 'node') detailType = id;
	}

	// Hover is sticky inside the symbol and inside the legend: crossing the gap
	// between two numbers keeps the current type until the next one takes over,
	// so the card never blinks. Leaving the zone clears it after a short grace
	// period (enough to slide from the symbol into the legend). Pass an id to
	// clear only if that type is still the active one (keyboard blur).
	function release(id?: number) {
		clearTimeout(releaseTimer);
		releaseTimer = setTimeout(() => {
			if (id !== undefined && activeType !== id) return;
			activeType = null;
			activeSource = null;
		}, 120);
	}

	function handlePointerEnter(event: PointerEvent, id: number, source: Source) {
		// A tap goes straight to the guide; previews are for mouse and pen hover.
		if (event.pointerType === 'touch') return;
		activate(id, source);
	}

	function handleFocus(event: FocusEvent, id: number, source: Source) {
		if ((event.currentTarget as HTMLElement).matches(':focus-visible')) activate(id, source);
	}

	$effect(() => () => clearTimeout(releaseTimer));

	function getTypeUrl(typeId: number): `/enneagram-corner/enneagram-type-${number}` {
		return `/enneagram-corner/enneagram-type-${typeId}`;
	}
</script>

<div
	class="diagram-wrapper"
	class:size-sm={size === 'sm'}
	class:size-lg={size === 'lg'}
	class:has-active={activeType !== null}
	style:--active-color={activeColor}
>
	<div
		class="diagram-stage"
		role="group"
		aria-label="Enneagram symbol"
		onpointerleave={() => release()}
	>
		<svg class="diagram-svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
			<circle cx={CENTER} cy={CENTER} r={RADIUS} class="ring" />
			{#each lines as line (`${line.a}-${line.b}`)}
				{@const from = positions[line.a - 1]}
				{@const to = positions[line.b - 1]}
				<line
					x1={from.x}
					y1={from.y}
					x2={to.x}
					y2={to.y}
					class="line line-{line.kind}"
					class:lit={activeType === line.a || activeType === line.b}
				/>
			{/each}
		</svg>

		{#each enneagramTypes as type, index (type.id)}
			<a
				href={resolve(getTypeUrl(type.id))}
				class="type-node"
				class:active={activeType === type.id}
				style:left="{positions[index].x}%"
				style:top="{positions[index].y}%"
				style:--node-color={type.color}
				onpointerenter={(event) => handlePointerEnter(event, type.id, 'node')}
				onfocus={(event) => handleFocus(event, type.id, 'node')}
				onblur={() => release(type.id)}
				aria-label={`Type ${type.id}: ${type.name}`}>{type.id}</a
			>
		{/each}
	</div>

	<!-- The legend and the type card share one grid cell, so swapping between
	     them never moves anything else on the page. -->
	<div class="readout">
		{#if showLabels}
			<ul
				class="type-legend"
				class:is-covered={detailsOpen}
				onpointerleave={() => activeSource === 'legend' && release()}
			>
				{#each enneagramTypes as type (type.id)}
					<li>
						<a
							href={resolve(getTypeUrl(type.id))}
							class="legend-item"
							class:active={activeType === type.id}
							style:--node-color={type.color}
							onpointerenter={(event) => handlePointerEnter(event, type.id, 'legend')}
							onfocus={(event) => handleFocus(event, type.id, 'legend')}
							onblur={() => release(type.id)}
							aria-label={`Type ${type.id}: ${type.name}`}
						>
							<span class="legend-badge">{type.id}</span>
							<span class="legend-name">{type.shortName}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<div
			class="type-card"
			class:is-open={detailsOpen}
			style:--node-color={detail.color}
			aria-hidden={!detailsOpen}
		>
			<div class="card-head">
				<span class="card-badge">{detail.id}</span>
				<div class="card-titles">
					<span class="card-name">{detail.name}</span>
					<span class="card-core">Core emotion: <strong>{detail.coreEmotion}</strong></span>
				</div>
			</div>
			<p class="card-description">{detail.description}</p>
			<p class="card-stance">
				<strong>{detail.emotionalStance}</strong>: {detail.stanceDetail}
			</p>
		</div>
	</div>
</div>

<style>
	.diagram-wrapper {
		--font-display: 'Inter Variable', 'Inter', system-ui, sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, monospace;
		--motion: 0.16s ease;

		box-sizing: border-box;
		width: 100%;
		max-width: 22rem;
		margin: 0 auto;
		container-type: inline-size;
	}

	.diagram-wrapper.size-sm {
		max-width: 16rem;
	}

	.diagram-wrapper.size-lg {
		max-width: 30rem;
	}

	/* ==========================================
	   SYMBOL
	   ========================================== */
	.diagram-stage {
		position: relative;
		width: 100%;
		max-width: 17rem;
		margin: 0 auto;
		container-type: inline-size;
	}

	.size-sm .diagram-stage {
		max-width: 13rem;
	}

	.size-lg .diagram-stage {
		max-width: 24rem;
	}

	.diagram-svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.ring {
		fill: color-mix(in srgb, var(--night-mid) 70%, transparent);
		stroke: color-mix(in srgb, var(--lamp-glow) 30%, var(--stone-edge));
		stroke-width: 0.35;
	}

	.line {
		stroke-width: 0.45;
		stroke-linecap: round;
		transition:
			stroke var(--motion),
			stroke-opacity var(--motion),
			stroke-width var(--motion);
	}

	.line-triangle {
		stroke: var(--lamp-glow);
		stroke-opacity: 0.5;
	}

	.line-hexad {
		stroke: var(--data-teal);
		stroke-opacity: 0.4;
	}

	.has-active .line {
		stroke-opacity: 0.12;
	}

	.has-active .line.lit {
		stroke: var(--active-color);
		stroke-opacity: 0.9;
		stroke-width: 0.7;
	}

	/* ==========================================
	   NUMBERS
	   ========================================== */
	.type-node {
		--node-size: clamp(2.125rem, 14.5cqi, 2.75rem);
		/* Nudged toward the ink color so light yellows stay legible on light
		   surfaces and dark reds stay legible on dark ones. */
		--node-ink: color-mix(in srgb, var(--node-color) 75%, var(--ink-bright));

		position: absolute;
		z-index: 1;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		width: var(--node-size);
		height: var(--node-size);
		padding: 0;
		border: 2px solid var(--node-color);
		border-radius: 50%;
		background: var(--stone-warm);
		box-shadow: 0 1px 2px rgb(12 10 9 / 0.08);
		color: var(--node-ink);
		font-family: var(--font-mono);
		font-size: calc(var(--node-size) * 0.4);
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		transform: translate(-50%, -50%);
		transition:
			transform var(--motion),
			background-color var(--motion),
			border-color var(--motion),
			color var(--motion),
			box-shadow var(--motion);
	}

	.type-node:hover,
	.type-node.active {
		z-index: 2;
		background: color-mix(in srgb, var(--node-color) 14%, var(--stone-warm));
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--node-color) 22%, transparent);
		text-decoration: none;
		transform: translate(-50%, -50%) scale(1.1);
	}

	/* Fade by color, not opacity: a translucent node would let the lines
	   behind it show through the number. */
	.has-active .type-node:not(.active) {
		border-color: color-mix(in srgb, var(--node-color) 35%, var(--stone-warm));
		color: color-mix(in srgb, var(--node-ink) 40%, var(--stone-warm));
		box-shadow: none;
	}

	.type-node:focus-visible {
		outline: 2px solid var(--node-color);
		outline-offset: 3px;
	}

	/* ==========================================
	   READOUT: legend + type card in one cell
	   ========================================== */
	.readout {
		display: grid;
		margin-top: 0.75rem;
	}

	.readout > * {
		grid-area: 1 / 1;
	}

	.type-legend {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.125rem 0.25rem;
		align-self: center;
		margin: 0;
		padding: 0;
		list-style: none;
		transition: opacity var(--motion);
	}

	.type-legend.is-covered {
		opacity: 0;
		pointer-events: none;
	}

	.type-legend li {
		min-width: 0;
		margin: 0;
		padding: 0;
		line-height: 1;
	}

	.type-legend li::before {
		content: none;
	}

	.legend-item {
		--node-ink: color-mix(in srgb, var(--node-color) 75%, var(--ink-bright));

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.3rem 0.25rem;
		border-radius: 0.625rem;
		text-decoration: none;
		transition:
			background-color var(--motion),
			opacity var(--motion);
	}

	.legend-item:hover,
	.legend-item.active {
		background: color-mix(in srgb, var(--node-color) 12%, transparent);
		text-decoration: none;
	}

	.has-active .legend-item:not(.active) {
		opacity: 0.5;
	}

	.legend-item:focus-visible {
		outline: 2px solid var(--node-color);
		outline-offset: 1px;
	}

	.legend-badge {
		box-sizing: border-box;
		display: grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		border: 1.5px solid var(--node-color);
		border-radius: 50%;
		background: var(--stone-warm);
		color: var(--node-ink);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1;
	}

	/* 12px floor (design-system mono/label size). */
	.legend-name {
		max-width: 100%;
		overflow: hidden;
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.type-card {
		--node-ink: color-mix(in srgb, var(--node-color) 75%, var(--ink-bright));

		box-sizing: border-box;
		align-self: center;
		padding: 0.75rem 0.875rem;
		border: 1px solid color-mix(in srgb, var(--node-color) 40%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--node-color) 7%, var(--stone-warm));
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transform: translateY(0.25rem);
		transition:
			opacity var(--motion),
			transform var(--motion),
			border-color var(--motion),
			background-color var(--motion),
			visibility 0s linear 0.16s;
	}

	.type-card.is-open {
		opacity: 1;
		visibility: visible;
		transform: none;
		transition:
			opacity var(--motion),
			transform var(--motion),
			border-color var(--motion),
			background-color var(--motion);
	}

	.card-head {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 0.5rem;
	}

	.card-badge {
		box-sizing: border-box;
		display: grid;
		flex-shrink: 0;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 2px solid var(--node-color);
		border-radius: 50%;
		background: var(--stone-warm);
		color: var(--node-ink);
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1;
	}

	.card-titles {
		display: grid;
		gap: 0.15rem;
		min-width: 0;
	}

	.card-name {
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.card-core {
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		line-height: 1.2;
	}

	.card-core strong {
		color: var(--node-ink);
		font-weight: 700;
	}

	.diagram-wrapper .card-description,
	.diagram-wrapper .card-stance {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.45;
	}

	.diagram-wrapper .card-description {
		margin-bottom: 0.4rem;
		color: var(--ink-mid);
	}

	.diagram-wrapper .card-stance {
		color: var(--ink-bright);
	}

	.card-stance strong {
		color: var(--node-ink);
		font-weight: 700;
	}

	@media (prefers-reduced-motion: reduce) {
		.diagram-wrapper {
			--motion: 0s;
		}

		.type-node:hover,
		.type-node.active {
			transform: translate(-50%, -50%);
		}

		.type-card {
			transform: none;
		}
	}
</style>
