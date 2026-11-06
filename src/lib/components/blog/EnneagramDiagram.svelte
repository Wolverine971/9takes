<!-- src/lib/components/blog/EnneagramDiagram.svelte -->
<!-- Interactive Enneagram symbol: hover a number to read the type, click it to open the guide. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showLabels?: boolean;
		/** Who the article is about. With `personType`, the symbol rests on their
		 *  type ("Druski is a Type 8") instead of the legend. */
		personName?: string;
		personType?: number;
	}

	let { size = 'md', showLabels = true, personName, personType }: Props = $props();

	type Source = 'node' | 'legend';

	// Type metadata. Names come from the shared constants; the symbol itself is
	// one tint (Cold Light), so no per-type color is used here.
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

	let featuredName = $derived(personName?.trim() ?? '');
	let featuredType = $derived.by(() => {
		const type = personType ?? 0;
		return featuredName && Number.isInteger(type) && type >= 1 && type <= 9 ? type : null;
	});
	// What the symbol shows: the hovered type, else the article's person, else nothing.
	let shownType = $derived(activeType ?? featuredType);
	// With a person the card is the resting state; without one it opens from the symbol.
	let detailsOpen = $derived(
		featuredType !== null || (activeType !== null && activeSource === 'node')
	);
	let detail = $derived(
		enneagramTypes[(featuredType !== null ? (activeType ?? featuredType) : detailType) - 1]
	);

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

{#snippet cardBody(type: (typeof enneagramTypes)[number])}
	<div class="card-head">
		<span class="card-badge">{type.id}</span>
		<div class="card-titles">
			{#if type.id === featuredType}
				<span class="card-name">{featuredName} is a Type {type.id}</span>
				<span class="card-core"
					>{type.name} &middot; Core emotion: <strong>{type.coreEmotion}</strong></span
				>
			{:else}
				<span class="card-name">{type.name}</span>
				<span class="card-core">Core emotion: <strong>{type.coreEmotion}</strong></span>
			{/if}
		</div>
	</div>
	<p class="card-description">{type.description}</p>
	<p class="card-stance">
		<strong>{type.emotionalStance}</strong>: {type.stanceDetail}
	</p>
{/snippet}

<div
	class={[
		'diagram-wrapper',
		{ 'size-sm': size === 'sm', 'size-lg': size === 'lg', 'has-active': shownType !== null }
	]}
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
					class={[`line line-${line.kind}`, { lit: shownType === line.a || shownType === line.b }]}
				/>
			{/each}
		</svg>

		{#each enneagramTypes as type, index (type.id)}
			<a
				href={resolve(getTypeUrl(type.id))}
				class={['type-node', { active: shownType === type.id, featured: featuredType === type.id }]}
				style:left="{positions[index].x}%"
				style:top="{positions[index].y}%"
				onpointerenter={(event) => handlePointerEnter(event, type.id, 'node')}
				onfocus={(event) => handleFocus(event, type.id, 'node')}
				onblur={() => release(type.id)}
				aria-label={`Type ${type.id}: ${type.name}`}>{type.id}</a
			>
		{/each}
	</div>

	<!-- The legend and the type card share one grid cell, so swapping between
	     them never moves anything else on the page. With a person, their card is
	     the resting state and the legend steps aside. -->
	<div class="readout">
		{#if showLabels && featuredType === null}
			<ul
				class={['type-legend', { 'is-covered': detailsOpen }]}
				onpointerleave={() => activeSource === 'legend' && release()}
			>
				{#each enneagramTypes as type (type.id)}
					<li>
						<a
							href={resolve(getTypeUrl(type.id))}
							class={['legend-item', { active: activeType === type.id }]}
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

		<!-- Invisible copies of every card hold the cell at the tallest one's
		     height, so a longer description (or name) never resizes the card or
		     pushes the article below it. -->
		{#each enneagramTypes as type (type.id)}
			<div class="type-card type-card-sizer" aria-hidden="true">
				{@render cardBody(type)}
			</div>
		{/each}

		<div class={['type-card', { 'is-open': detailsOpen }]} aria-hidden={!detailsOpen}>
			{@render cardBody(detail)}
		</div>
	</div>
</div>

<style>
	/* Cold Light: one tint, like the statues. The lit type (the article's
	   person, or whichever number is hovered) is lavender on deep indigo with a
	   lavender ring; every other type is faint with a hairline ring. */
	.diagram-wrapper {
		--motion: 0.16s ease;

		box-sizing: border-box;
		width: 100%;
		max-width: 22rem;
		margin: 0 auto;
		container-type: inline-size;
		font-family: var(--font-talk);
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
		fill: color-mix(in srgb, var(--accent) 5%, transparent);
		stroke: var(--rule);
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
		stroke: var(--highlight);
		stroke-opacity: 0.3;
	}

	.line-hexad {
		stroke: var(--accent);
		stroke-opacity: 0.55;
	}

	.has-active .line {
		stroke-opacity: 0.12;
	}

	.has-active .line.lit {
		stroke: var(--highlight);
		stroke-opacity: 0.7;
		stroke-width: 0.6;
	}

	/* ==========================================
	   NUMBERS
	   ========================================== */
	.type-node {
		--node-size: clamp(2.125rem, 14.5cqi, 2.75rem);

		position: absolute;
		z-index: 1;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		width: var(--node-size);
		height: var(--node-size);
		padding: 0;
		border: 1.5px solid var(--rule);
		border-radius: 50%;
		background: var(--surface);
		color: var(--text-faint);
		font-family: var(--font-talk);
		font-size: calc(var(--node-size) * 0.4);
		font-weight: 600;
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
		border-color: var(--highlight);
		background: var(--accent-deep);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 28%, transparent);
		color: var(--highlight);
		text-decoration: none;
		transform: translate(-50%, -50%) scale(1.1);
	}

	.has-active .type-node:not(.active) {
		box-shadow: none;
	}

	.type-node:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 3px;
	}

	/* The article's person keeps a dashed halo while another type is being
	   explored, so their spot on the symbol is never lost. */
	.type-node.featured:not(.active) {
		color: var(--highlight);
		outline: 1.5px dashed color-mix(in srgb, var(--highlight) 60%, transparent);
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
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		padding: 0.3rem 0.25rem;
		border-radius: 10px;
		text-decoration: none;
		transition:
			background-color var(--motion),
			opacity var(--motion);
	}

	.legend-item:hover,
	.legend-item.active {
		background: var(--surface-raised);
		text-decoration: none;
	}

	.has-active .legend-item:not(.active) {
		opacity: 0.5;
	}

	.legend-item:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 1px;
	}

	.legend-badge {
		box-sizing: border-box;
		display: grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		border: 1.5px solid var(--rule);
		border-radius: 50%;
		background: var(--surface);
		color: var(--text-faint);
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		line-height: 1;
	}

	.legend-item:hover .legend-badge,
	.legend-item.active .legend-badge {
		border-color: var(--highlight);
		background: var(--accent-deep);
		color: var(--highlight);
	}

	/* 12px floor (design-system label size). */
	.legend-name {
		max-width: 100%;
		overflow: hidden;
		color: var(--text-muted);
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.type-card {
		box-sizing: border-box;
		align-self: stretch;
		padding: 0.75rem 0.875rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface-raised);
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transform: translateY(0.25rem);
		transition:
			opacity var(--motion),
			transform var(--motion),
			visibility 0s linear 0.16s;
	}

	.type-card.is-open {
		opacity: 1;
		visibility: visible;
		transform: none;
		transition:
			opacity var(--motion),
			transform var(--motion);
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
		border: 1.5px solid var(--highlight);
		border-radius: 50%;
		background: var(--accent-deep);
		color: var(--highlight);
		font-family: var(--font-talk);
		font-size: 0.9rem;
		font-weight: 600;
		line-height: 1;
	}

	.card-titles {
		display: grid;
		gap: 0.15rem;
		min-width: 0;
	}

	.card-name {
		color: var(--text);
		font-family: var(--font-talk);
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.2;
	}

	.type-card.type-card-sizer {
		visibility: hidden;
		transition: none;
	}

	.card-core {
		color: var(--text-faint);
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 500;
		line-height: 1.3;
	}

	.card-core strong {
		color: var(--text);
		font-weight: 600;
	}

	.diagram-wrapper .card-description,
	.diagram-wrapper .card-stance {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.45;
	}

	.diagram-wrapper .card-description {
		margin-bottom: 0.4rem;
		color: var(--text-muted);
	}

	.diagram-wrapper .card-stance {
		color: var(--text-muted);
	}

	.card-stance strong {
		color: var(--highlight);
		font-weight: 600;
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
