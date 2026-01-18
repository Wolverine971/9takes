<!-- src/lib/components/blog/EnneagramDiagram.svelte -->
<!-- Solo Leveling themed Enneagram Diagram -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Props
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showLabels?: boolean;
		interactive?: boolean;
	}

	let { size = 'md', showLabels: showLabelsProp = true, interactive = true }: Props = $props();

	let hoveredType: number | null = $state(null);
	let mounted = $state(false);
	let containerElement: HTMLElement | null = $state(null);
	let isMobile = $state(false);
	let showLabels = $state(true);

	// The 9 Enneagram types with Solo Leveling themed colors
	const enneagramTypes = [
		{
			id: 1,
			name: 'The Perfectionist',
			description:
				'Ethical, dedicated and reliable. Motivated by a desire to live the right way and improve the world.',
			color: '#a8dadc',
			coreEmotion: 'Anger'
		},
		{
			id: 2,
			name: 'The Helper',
			description: 'Warm, caring and giving. Motivated by a need to be loved and needed.',
			color: '#ff6b6b',
			coreEmotion: 'Shame'
		},
		{
			id: 3,
			name: 'The Achiever',
			description: 'Success-oriented and image-conscious. Motivated by a need to be successful.',
			color: '#fbbf24',
			coreEmotion: 'Shame'
		},
		{
			id: 4,
			name: 'The Individualist',
			description: 'Creative, sensitive and expressive. Motivated by a need to be understood.',
			color: '#c084fc',
			coreEmotion: 'Shame'
		},
		{
			id: 5,
			name: 'The Investigator',
			description: 'Analytical, detached and private. Motivated by a need to gain knowledge.',
			color: '#22d3ee',
			coreEmotion: 'Fear'
		},
		{
			id: 6,
			name: 'The Loyalist',
			description:
				'Committed, practical and vigilant. Motivated by fear and the need for security.',
			color: '#64748b',
			coreEmotion: 'Fear'
		},
		{
			id: 7,
			name: 'The Enthusiast',
			description:
				'Fun, spontaneous and versatile. Motivated by a need to be happy and avoid pain.',
			color: '#fb923c',
			coreEmotion: 'Fear'
		},
		{
			id: 8,
			name: 'The Challenger',
			description: 'Powerful, dominating and self-confident. Motivated by a need to be strong.',
			color: '#ef4444',
			coreEmotion: 'Anger'
		},
		{
			id: 9,
			name: 'The Peacemaker',
			description: 'Easygoing, accommodating and peaceful. Motivated by a need to keep the peace.',
			color: '#4ade80',
			coreEmotion: 'Anger'
		}
	];

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

	// Get label positioning - adjusted to stay within container bounds
	function getLabelPosition(index: number) {
		const pos = typePositions[index];
		const type = enneagramTypes[index];

		const positions: Record<number, { left: string; top: string; textAlign: string }> = {
			1: { left: '72%', top: '22%', textAlign: 'left' },
			2: { left: '78%', top: '42%', textAlign: 'left' },
			3: { left: '72%', top: '62%', textAlign: 'left' },
			4: { left: '58%', top: '75%', textAlign: 'center' },
			5: { left: '42%', top: '75%', textAlign: 'center' },
			6: { left: '22%', top: '62%', textAlign: 'right' },
			7: { left: '16%', top: '42%', textAlign: 'right' },
			8: { left: '22%', top: '22%', textAlign: 'right' },
			9: { left: '50%', top: '10%', textAlign: 'center' }
		};

		return positions[type.id] || { left: '50%', top: '50%', textAlign: 'center' };
	}

	// Get URL for each Enneagram type
	function getTypeUrl(typeId: number) {
		return `/enneagram-corner/enneagram-type-${typeId}`;
	}

	function handleTypeClick(typeId: number) {
		if (interactive) {
			window.location.href = getTypeUrl(typeId);
		}
	}

	function handleResize() {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 768;
			showLabels = showLabelsProp && window.innerWidth > 480;
		}
	}

	onMount(() => {
		mounted = true;
		handleResize();

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	});
</script>

<div
	class="diagram-wrapper"
	class:size-sm={size === 'sm'}
	class:size-lg={size === 'lg'}
	bind:this={containerElement}
>
	<div class="enneagram-container">
		<!-- Ambient glow effects -->
		<div class="glow-layer"></div>

		<svg class="diagram-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<!-- Glow filters -->
				<filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
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
					<stop offset="0%" stop-color="rgba(124, 58, 237, 0.08)" />
					<stop offset="100%" stop-color="rgba(10, 10, 15, 0.5)" />
				</radialGradient>
			</defs>

			<!-- Main circle with void effect -->
			<circle cx={center.x} cy={center.y} r={radius} class="main-circle" />

			<!-- Inner glow ring -->
			<circle cx={center.x} cy={center.y} r={radius - 0.5} class="inner-glow" />

			<!-- Triangle connections (3-6-9) - more prominent -->
			{#each triangleConnections as conn}
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
			{#each hexadConnections as conn}
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

		<!-- Central icon -->
		<div class="center-icon">
			<div class="center-pulse"></div>
			<span>◈</span>
		</div>

		<!-- Type Nodes -->
		{#each enneagramTypes as type, index}
			{#if mounted}
				<a
					href={interactive ? getTypeUrl(type.id) : undefined}
					class="type-node"
					class:active={hoveredType === type.id}
					class:non-interactive={!interactive}
					style="
						left: {typePositions[index].x}%;
						top: {typePositions[index].y}%;
						--node-color: {type.color};
					"
					onmouseenter={() => (hoveredType = type.id)}
					onmouseleave={() => (hoveredType = null)}
					onfocus={() => (hoveredType = type.id)}
					onblur={() => (hoveredType = null)}
					tabindex={interactive ? 0 : -1}
					aria-label={`Type ${type.id}: ${type.name}`}
				>
					<span class="node-glow"></span>
					<span class="node-number">{type.id}</span>
				</a>
			{/if}
		{/each}

		<!-- Type Labels -->
		{#each enneagramTypes as type, index}
			{#if mounted && showLabels}
				{@const labelPos = getLabelPosition(index)}
				<div
					class="type-label"
					class:dimmed={hoveredType !== null && hoveredType !== type.id}
					class:active={hoveredType === type.id}
					style="
						left: {labelPos.left};
						top: {labelPos.top};
						text-align: {labelPos.textAlign};
						--label-color: {type.color};
						transform: translate({labelPos.textAlign === 'center'
						? '-50%'
						: labelPos.textAlign === 'left'
							? '0'
							: '-100%'}, -50%);
					"
				>
					<span class="label-name">{type.name}</span>
				</div>
			{/if}
		{/each}

		<!-- Tooltip -->
		{#if hoveredType && mounted && interactive}
			{@const currentType = enneagramTypes[hoveredType - 1]}
			<div
				class="tooltip"
				in:scale={{ duration: 150, opacity: 0, start: 0.95, easing: cubicOut }}
				out:fade={{ duration: 100 }}
			>
				<div class="tooltip-header">
					<div class="tooltip-badge" style="--badge-color: {currentType.color}">
						<span>{hoveredType}</span>
					</div>
					<div class="tooltip-titles">
						<span class="tooltip-title-sub">{currentType.name}</span>
					</div>
				</div>
				<p class="tooltip-description">{currentType.description}</p>
				<div class="tooltip-meta">
					<span class="meta-label">Core Emotion:</span>
					<span class="meta-value" style="color: {currentType.color}"
						>{currentType.coreEmotion}</span
					>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	/* ==========================================
	   CSS VARIABLES
	   ========================================== */
	.diagram-wrapper {
		--void-abyss: #05050a;
		--void-shadow: #0a0a12;
		--void-umbra: #12121c;
		--text-pale: #e8e8f0;
		--text-mist: #9898a8;
		--text-faded: #585868;
		--shadow-monarch: #7c3aed;
		--shadow-flame: #a855f7;
		--shadow-ethereal: #c084fc;
		--system-interface: #3b82f6;
		--system-hologram: #60a5fa;
		--font-display: 'Rajdhani', system-ui, sans-serif;
		--font-mono: 'JetBrains Mono', ui-monospace, monospace;
	}

	/* ==========================================
	   WRAPPER SIZES
	   ========================================== */
	.diagram-wrapper {
		position: relative;
		width: 100%;
		max-width: 24rem;
		margin: 0 auto;
		padding-bottom: 2rem; /* Space for labels that extend below the circle */
		overflow: visible;
		height: 100%;
	}

	.diagram-wrapper.size-sm {
		max-width: 16rem;
		padding-bottom: 1.5rem;
	}

	.diagram-wrapper.size-lg {
		max-width: 32rem;
		padding-bottom: 2.5rem;
	}

	/* ==========================================
	   CONTAINER
	   ========================================== */
	.enneagram-container {
		position: relative;
		width: 100%;
		padding-bottom: 100%; /* Square container for proper circle rendering */
		overflow: visible;
	}

	/* ==========================================
	   GLOW LAYER
	   ========================================== */
	.glow-layer {
		position: absolute;
		inset: -20%;
		background: radial-gradient(
			circle at 50% 50%,
			rgba(124, 58, 237, 0.15) 0%,
			rgba(59, 130, 246, 0.08) 40%,
			transparent 70%
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
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* ==========================================
	   MAIN CIRCLE
	   ========================================== */
	.main-circle {
		fill: url(#voidGradient);
		stroke: rgba(124, 58, 237, 0.25);
		stroke-width: 0.4;
	}

	.inner-glow {
		fill: none;
		stroke: rgba(124, 58, 237, 0.15);
		stroke-width: 0.8;
		filter: url(#glowPurple);
	}

	/* ==========================================
	   CONNECTION LINES
	   ========================================== */
	.connection-triangle {
		stroke: var(--shadow-monarch);
		stroke-width: 0.35;
		stroke-opacity: 0.4;
		transition: all 0.3s ease;
	}

	.connection-triangle.highlighted {
		stroke-opacity: 0.8;
		stroke-width: 0.5;
		filter: url(#glowPurple);
	}

	.connection-hexad {
		stroke: var(--system-interface);
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
	   CENTER ICON
	   ========================================== */
	.center-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #5b21b6 0%, var(--shadow-monarch) 100%);
		border-radius: 50%;
		box-shadow: 0 0 25px rgba(124, 58, 237, 0.5);
		z-index: 5;
	}

	.center-icon span {
		font-size: 1rem;
		color: white;
	}

	.center-pulse {
		position: absolute;
		inset: -8px;
		border: 2px solid var(--shadow-ethereal);
		border-radius: 50%;
		animation: center-pulse 2.5s ease-in-out infinite;
	}

	@keyframes center-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.25);
			opacity: 0;
		}
	}

	/* ==========================================
	   TYPE NODES
	   ========================================== */
	.type-node {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		background: var(--void-shadow);
		border: 2px solid var(--node-color);
		border-radius: 50%;
		text-decoration: none;
		cursor: pointer;
		transform: translate(-50%, -50%);
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
	}

	.type-node.non-interactive {
		cursor: default;
	}

	.node-glow {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		background: radial-gradient(circle, var(--node-color) 0%, transparent 70%);
		opacity: 0.3;
		transition: opacity 0.25s ease;
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
			0 0 0 3px rgba(124, 58, 237, 0.4),
			0 0 20px color-mix(in srgb, var(--node-color) 50%, transparent);
	}

	.node-number {
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--node-color);
		text-shadow: 0 0 10px var(--node-color);
	}

	@media (min-width: 640px) {
		.type-node {
			width: 2.5rem;
			height: 2.5rem;
		}

		.node-number {
			font-size: 1rem;
		}
	}

	/* ==========================================
	   TYPE LABELS
	   ========================================== */
	.type-label {
		position: absolute;
		pointer-events: none;
		max-width: 100px;
		transition: opacity 0.25s ease;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.type-label.dimmed {
		opacity: 0.3;
	}

	.type-label.active {
		opacity: 1;
	}

	.label-name {
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--text-pale);
		line-height: 1.2;
	}

	.type-label.active .label-name {
		color: var(--label-color);
		text-shadow: 0 0 10px color-mix(in srgb, var(--label-color) 40%, transparent);
	}

	@media (min-width: 640px) {
		.type-label {
			max-width: 120px;
		}

		.label-title {
			font-size: 0.6rem;
		}

		.label-name {
			font-size: 0.8rem;
		}
	}

	/* ==========================================
	   TOOLTIP
	   ========================================== */
	.tooltip {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 12px;
		padding: 1rem;
		max-width: min(280px, 85%);
		box-shadow:
			0 0 30px rgba(124, 58, 237, 0.2),
			0 8px 24px rgba(0, 0, 0, 0.4);
		z-index: 100;
	}

	.tooltip-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.tooltip-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: var(--void-abyss);
		border: 2px solid var(--badge-color);
		border-radius: 50%;
		flex-shrink: 0;
		box-shadow: 0 0 15px color-mix(in srgb, var(--badge-color) 40%, transparent);
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
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-pale);
	}

	.tooltip-description {
		font-size: 0.8rem;
		color: var(--text-mist);
		line-height: 1.5;
		margin: 0 0 0.75rem;
	}

	.tooltip-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.meta-label {
		color: var(--text-faded);
	}

	.meta-value {
		font-weight: 600;
	}
</style>
