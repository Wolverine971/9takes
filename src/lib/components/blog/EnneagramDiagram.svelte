<!-- src/lib/components/blog/EnneagramDiagram.svelte -->
<!-- Warm tech themed Enneagram Diagram -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	// Props
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showLabels?: boolean;
	}

	let { size = 'md', showLabels: showLabelsProp = true }: Props = $props();

	let hoveredType: number | null = $state(null);
	let showLabels = $derived(showLabelsProp);

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
			stanceDetail: 'Anger becomes inner critic'
		},
		2: {
			description: 'Warm, caring and giving. Motivated by a need to be loved and needed.',
			coreEmotion: 'Shame',
			emotionalStance: 'Represses',
			stanceDetail: 'Denies shame through giving'
		},
		3: {
			description: 'Success-oriented and image-conscious. Motivated by a need to be successful.',
			coreEmotion: 'Shame',
			emotionalStance: 'Compensates',
			stanceDetail: 'Channels shame into performance'
		},
		4: {
			description: 'Creative, sensitive and expressive. Motivated by a need to be understood.',
			coreEmotion: 'Shame',
			emotionalStance: 'Identifies',
			stanceDetail: 'Inhabits shame as identity'
		},
		5: {
			description: 'Analytical, detached and private. Motivated by a need to gain knowledge.',
			coreEmotion: 'Fear',
			emotionalStance: 'Withdraws',
			stanceDetail: 'Retreats from fear into mind'
		},
		6: {
			description:
				'Committed, practical and vigilant. Motivated by fear and the need for security.',
			coreEmotion: 'Fear',
			emotionalStance: 'Engages',
			stanceDetail: 'Faces fear through vigilance'
		},
		7: {
			description:
				'Fun, spontaneous and versatile. Motivated by a need to be happy and avoid pain.',
			coreEmotion: 'Fear',
			emotionalStance: 'Reframes',
			stanceDetail: 'Escapes fear through possibilities'
		},
		8: {
			description: 'Powerful, dominating and self-confident. Motivated by a need to be strong.',
			coreEmotion: 'Anger',
			emotionalStance: 'Expresses',
			stanceDetail: 'Uses anger as fuel'
		},
		9: {
			description: 'Easygoing, accommodating and peaceful. Motivated by a need to keep the peace.',
			coreEmotion: 'Anger',
			emotionalStance: 'Suppresses',
			stanceDetail: 'Numbs anger for harmony'
		}
	};

	const enneagramTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => ({
		id,
		name: ENNEAGRAM_TYPE_COLORS[id].name,
		shortName: ENNEAGRAM_TYPE_COLORS[id].name.replace(/^The /, ''),
		color: ENNEAGRAM_TYPE_COLORS[id].color,
		...typeMetadata[id]
	}));

	// Center and radius for the main circle
	const center = { x: 50, y: 50 };
	const radius = 34;

	// Convert angle (0° = top) to x,y coordinates
	function getPosition(angle: number) {
		const radians = (angle - 90) * (Math.PI / 180);
		return {
			x: center.x + radius * Math.cos(radians),
			y: center.y + radius * Math.sin(radians)
		};
	}

	// Position each type so that Type 9 is at angle=0 (top)
	const typePositions = enneagramTypes.map((_, index) => {
		const angle = 40 * ((index + 1) % 9);
		return getPosition(angle);
	});

	// Inner triangle (3-6-9) and hexad connections
	const triangleConnections = [
		{ from: 2, to: 5 }, // 3 → 6
		{ from: 5, to: 8 }, // 6 → 9
		{ from: 8, to: 2 } // 9 → 3
	];

	const hexadConnections = [
		{ from: 0, to: 3 }, // 1 → 4
		{ from: 3, to: 1 }, // 4 → 2
		{ from: 1, to: 7 }, // 2 → 8
		{ from: 7, to: 4 }, // 8 → 5
		{ from: 4, to: 6 }, // 5 → 7
		{ from: 6, to: 0 } // 7 → 1
	];

	// Get URL for each Enneagram type
	function getTypeUrl(typeId: number): `/enneagram-corner/enneagram-type-${number}` {
		return `/enneagram-corner/enneagram-type-${typeId}`;
	}
</script>

<div class="diagram-wrapper" class:size-sm={size === 'sm'} class:size-lg={size === 'lg'}>
	<div class="diagram-stage">
		<!-- Ambient glow effects -->
		<div class="glow-layer"></div>

		<svg class="diagram-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<!-- Glow filters -->
				<filter id="glowLamp" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="1" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>

				<!-- Gradient for main circle -->
				<radialGradient id="voidGradient" cx="50%" cy="50%" r="50%">
					<stop
						offset="0%"
						style="stop-color: color-mix(in srgb, var(--data-teal) 8%, transparent)"
					/>
					<stop offset="100%" stop-color="rgba(10, 10, 15, 0.5)" />
				</radialGradient>
			</defs>

			<!-- Main circle with void effect -->
			<circle cx={center.x} cy={center.y} r={radius} class="main-circle" />

			<!-- Inner glow ring -->
			<circle cx={center.x} cy={center.y} r={radius - 0.5} class="inner-glow" />

			<!-- Triangle connections (3-6-9) - more prominent -->
			{#each triangleConnections as conn (`${conn.from}-${conn.to}`)}
				<line
					x1={typePositions[conn.from].x}
					y1={typePositions[conn.from].y}
					x2={typePositions[conn.to].x}
					y2={typePositions[conn.to].y}
					class="connection-triangle"
					class:highlighted={hoveredType &&
						(enneagramTypes[conn.from].id === hoveredType ||
							enneagramTypes[conn.to].id === hoveredType)}
				/>
			{/each}

			<!-- Hexad connections (1-4-2-8-5-7-1) -->
			{#each hexadConnections as conn (`${conn.from}-${conn.to}`)}
				<line
					x1={typePositions[conn.from].x}
					y1={typePositions[conn.from].y}
					x2={typePositions[conn.to].x}
					y2={typePositions[conn.to].y}
					class="connection-hexad"
					class:highlighted={hoveredType &&
						(enneagramTypes[conn.from].id === hoveredType ||
							enneagramTypes[conn.to].id === hoveredType)}
				/>
			{/each}
		</svg>

		<!-- Type Nodes -->
		{#each enneagramTypes as type, index (type.id)}
			<a
				href={resolve(getTypeUrl(type.id))}
				class="type-node"
				class:active={hoveredType === type.id}
				style="
						left: {typePositions[index].x}%;
						top: {typePositions[index].y}%;
						--node-color: {type.color};
					"
				onmouseenter={() => (hoveredType = type.id)}
				onmouseleave={() => (hoveredType = null)}
				onfocus={() => (hoveredType = type.id)}
				onblur={() => (hoveredType = null)}
				aria-label={`Type ${type.id}: ${type.name}`}
			>
				<span class="node-glow"></span>
				<span class="node-number">{type.id}</span>
			</a>
		{/each}

		<!-- Tooltip -->
		{#if hoveredType}
			{@const currentType = enneagramTypes[hoveredType - 1]}
			<div class="tooltip">
				<div class="tooltip-header">
					<div class="tooltip-badge" style="--badge-color: {currentType.color}">
						<span>{hoveredType}</span>
					</div>
					<div class="tooltip-titles">
						<span class="tooltip-title-sub">{currentType.name}</span>
					</div>
				</div>
				<p class="tooltip-description">{currentType.description}</p>
				<div class="tooltip-facts">
					<div class="tooltip-meta">
						<span class="meta-label">Core</span>
						<span class="meta-value" style="color: {currentType.color}"
							>{currentType.coreEmotion}</span
						>
					</div>
					<div class="tooltip-meta">
						<span class="meta-label">Stance</span>
						<span class="meta-value" style="color: {currentType.color}"
							>{currentType.emotionalStance}</span
						>
					</div>
				</div>
				<div class="tooltip-stance-detail">
					{currentType.stanceDetail}
				</div>
			</div>
		{/if}
	</div>

	<!-- Type Legend -->
	{#if showLabels}
		<ul class="type-legend">
			{#each enneagramTypes as type (type.id)}
				<li>
					<a
						href={resolve(getTypeUrl(type.id))}
						class="legend-item"
						class:dimmed={hoveredType !== null && hoveredType !== type.id}
						class:active={hoveredType === type.id}
						style="--node-color: {type.color};"
						onmouseenter={() => (hoveredType = type.id)}
						onmouseleave={() => (hoveredType = null)}
						onfocus={() => (hoveredType = type.id)}
						onblur={() => (hoveredType = null)}
						aria-label={`Type ${type.id}: ${type.name}`}
					>
						<span class="legend-badge">{type.id}</span>
						<span class="legend-name">{type.shortName}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* ==========================================
	   CSS VARIABLES
	   ========================================== */
	.diagram-wrapper {
		--void-shadow: var(--night-deep);
		--void-umbra: var(--night-deep);
		--text-pale: var(--ink-bright);
		--text-mist: var(--ink-mid);
		--text-faded: var(--ink-dim);
		--shadow-flame: var(--lamp-glow);
		--shadow-ethereal: var(--lamp-glow);
		--font-display: 'Inter Variable', 'Inter', system-ui, sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, monospace;
	}

	/* ==========================================
	   WRAPPER SIZES
	   ========================================== */
	.diagram-wrapper {
		position: relative;
		width: 100%;
		max-width: 22rem;
		margin: 0 auto;
		padding-bottom: 0.25rem;
		overflow: visible;
		height: 100%;
		container-type: inline-size;
	}

	.diagram-wrapper.size-sm {
		max-width: 16rem;
		padding-bottom: 0.25rem;
	}

	.diagram-wrapper.size-lg {
		max-width: 30rem;
		padding-bottom: 0.5rem;
	}

	/* ==========================================
	   CONTAINER
	   ========================================== */
	.diagram-stage {
		position: relative;
		width: 100%;
		overflow: visible;
	}

	@media (max-width: 639px) {
		.diagram-wrapper,
		.diagram-stage {
			max-width: 100%;
			min-width: 0;
		}

		.glow-layer,
		.node-glow {
			display: none;
		}
	}

	/* ==========================================
	   GLOW LAYER
	   ========================================== */
	.glow-layer {
		position: absolute;
		inset: -10%;
		background: radial-gradient(
			circle at 50% 50%,
			color-mix(in srgb, var(--lamp-glow) 12%, transparent) 0%,
			color-mix(in srgb, var(--data-teal) 6%, transparent) 40%,
			transparent 65%
		);
		pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}

	/* ==========================================
	   SVG
	   ========================================== */
	.diagram-svg {
		display: block;
		width: 100%;
		height: auto;
	}

	/* ==========================================
	   MAIN CIRCLE
	   ========================================== */
	.main-circle {
		fill: url(#voidGradient);
		stroke: var(--lamp-glow-rgba);
		stroke-width: 0.4;
	}

	.inner-glow {
		fill: none;
		stroke: color-mix(in srgb, var(--lamp-glow) 15%, transparent);
		stroke-width: 0.8;
		filter: url(#glowLamp);
	}

	/* ==========================================
	   CONNECTION LINES
	   ========================================== */
	.connection-triangle {
		stroke: var(--lamp-glow);
		stroke-width: 0.35;
		stroke-opacity: 0.4;
		transition: all 0.3s ease;
	}

	.connection-triangle.highlighted {
		stroke-opacity: 0.8;
		stroke-width: 0.5;
		filter: url(#glowLamp);
	}

	.connection-hexad {
		stroke: var(--data-teal);
		stroke-width: 0.25;
		stroke-opacity: 0.25;
		transition: all 0.3s ease;
	}

	.connection-hexad.highlighted {
		stroke-opacity: 0.6;
		stroke-width: 0.4;
		filter: url(#glowCyan);
	}

	/* ==========================================
	   TYPE NODES
	   ========================================== */
	.type-node {
		box-sizing: border-box;
		position: absolute;
		isolation: isolate;
		display: flex;
		align-items: center;
		justify-content: center;
		inline-size: 2.35rem;
		block-size: 2.35rem;
		min-inline-size: 2.35rem;
		min-block-size: 2.35rem;
		aspect-ratio: 1;
		padding: 0 !important;
		background: var(--night-deep);
		border: 2px solid transparent;
		border-radius: 50%;
		line-height: 1;
		text-decoration: none;
		cursor: pointer;
		transform: translate(-50%, -50%);
		transition:
			box-shadow 0.18s ease,
			transform 0.18s ease;
		z-index: 10;
	}

	.type-node::after {
		content: '';
		position: absolute;
		inset: -2px;
		border: 2px solid var(--node-color);
		border-radius: 50%;
		pointer-events: none;
		z-index: 3;
	}

	.node-glow {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--node-color) 0%, transparent 70%);
		opacity: 0.3;
		pointer-events: none;
		transition: opacity 0.25s ease;
		z-index: 0;
	}

	.type-node:hover .node-glow,
	.type-node.active .node-glow {
		opacity: 0.6;
	}

	.type-node:hover,
	.type-node:focus,
	.type-node.active {
		transform: translate(-50%, -50%) scale(1.15);
		box-shadow: 0 0 20px color-mix(in srgb, var(--node-color) 50%, transparent);
		z-index: 20;
	}

	.type-node:focus {
		outline: none;
		box-shadow:
			0 0 0 3px var(--lamp-glow-rgba),
			0 0 20px color-mix(in srgb, var(--node-color) 50%, transparent);
	}

	.node-number {
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--node-color);
		text-shadow: 0 0 10px var(--node-color);
		z-index: 2;
	}

	@media (min-width: 640px) {
		.type-node {
			inline-size: 2.5rem;
			block-size: 2.5rem;
			min-inline-size: 2.5rem;
			min-block-size: 2.5rem;
		}

		.node-number {
			font-size: 1rem;
		}
	}

	/* ==========================================
	   TYPE LEGEND
	   ========================================== */
	.diagram-wrapper .type-legend {
		list-style: none;
		margin: 0.5rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.2rem 0.25rem;
	}

	@container (min-width: 18rem) {
		.diagram-wrapper .type-legend {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.diagram-wrapper .type-legend li {
		min-width: 0;
		margin: 0;
		line-height: 1;
	}

	.diagram-wrapper .legend-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-height: 1.75rem;
		padding: 0.2rem;
		border-radius: 0.625rem;
		border: 1px solid transparent;
		text-decoration: none;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			opacity 0.2s ease;
	}

	.legend-item:hover,
	.legend-item.active {
		background: color-mix(in srgb, var(--node-color) 12%, transparent);
		border-color: color-mix(in srgb, var(--node-color) 45%, transparent);
	}

	.legend-item:focus-visible {
		outline: none;
		border-color: var(--node-color);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--node-color) 35%, transparent);
	}

	.legend-item.dimmed {
		opacity: 0.45;
	}

	.legend-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
		inline-size: 1.125rem;
		block-size: 1.125rem;
		aspect-ratio: 1;
		padding: 0 !important;
		border-radius: 50%;
		background: var(--night-deep);
		border: 1.5px solid var(--node-color);
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		line-height: 1;
		color: var(--node-color);
	}

	.legend-name {
		font-family: var(--font-display);
		font-size: 0.6rem;
		font-weight: 600;
		line-height: 1.1;
		color: var(--text-pale);
		min-width: 0;
		white-space: nowrap;
	}

	.legend-item.active .legend-name {
		color: var(--node-color);
	}

	/* ==========================================
	   TOOLTIP
	   ========================================== */
	.tooltip {
		box-sizing: border-box;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: calc(100% - 0.75rem);
		max-width: 20rem;
		background: color-mix(in srgb, var(--night-deep) 94%, var(--stone-warm));
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		padding: 0.875rem 1rem;
		box-shadow: var(--shadow-lg);
		z-index: 100;
		pointer-events: none;
	}

	.tooltip-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-bottom: 0.5rem;
	}

	.tooltip-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		inline-size: 1.75rem;
		block-size: 1.75rem;
		aspect-ratio: 1;
		padding: 0 !important;
		background: var(--night-deep);
		border: 2px solid var(--badge-color);
		border-radius: 50%;
		flex-shrink: 0;
	}

	.tooltip-badge span {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--badge-color);
	}

	.tooltip-titles {
		display: flex;
		flex-direction: column;
	}

	.tooltip-title-sub {
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-pale);
	}

	.diagram-wrapper .tooltip-description {
		font-size: 0.76rem;
		color: var(--text-mist);
		line-height: 1.45;
		margin: 0 0 0.625rem;
	}

	.tooltip-facts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.tooltip-meta {
		display: grid;
		gap: 0.1rem;
		font-family: var(--font-mono);
		font-size: 0.66rem;
	}

	.meta-label {
		color: var(--text-faded);
	}

	.meta-value {
		font-weight: 600;
	}

	.tooltip-stance-detail {
		margin-top: 0.4rem;
		padding-top: 0.4rem;
		border-top: 1px solid var(--lamp-soft);
		font-size: 0.7rem;
		font-style: italic;
		color: var(--text-mist);
		text-align: left;
	}

	@media (prefers-reduced-motion: no-preference) {
		.tooltip {
			animation: tooltip-in 0.16s cubic-bezier(0.22, 1, 0.36, 1);
		}

		@keyframes tooltip-in {
			from {
				opacity: 0;
				transform: translate(-50%, -48%) scale(0.97);
			}
			to {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.glow-layer,
		.node-glow {
			display: none;
		}

		.type-node,
		.legend-item {
			transition: none;
		}
	}
</style>
