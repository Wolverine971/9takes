<!-- src/lib/components/blog/EnneagramDiagram.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let hoveredType: number | null = null;
	let mounted = false;
	let containerWidth = 0;
	let containerElement: HTMLElement;
	let isMobile = false;
	let showLabels = true;

	// The 9 Enneagram types
	const enneagramTypes = [
		{
			id: 1,
			name: 'The Reformer',
			description:
				'Ethical, dedicated and reliable, Ones are motivated by a desire to live the right way, improve the world, and avoid fault and blame. Grows to Type 7 (Enthusiast), stresses to Type 4 (Individualist).',
			color: '#A9A9A9'
		},
		{
			id: 2,
			name: 'The Helper',
			description:
				'Warm, caring and giving, Twos are motivated by a need to be loved and needed, and to avoid acknowledging their own needs. Grows to Type 4 (Individualist), stresses to Type 8 (Challenger).',
			color: '#E63946'
		},
		{
			id: 3,
			name: 'The Achiever',
			description:
				'Success-oriented, image-conscious and wired for productivity, Threes are motivated by a need to be (or appear to be) successful and avoid failure. Grows to Type 6 (Loyalist), stresses to Type 9 (Peacemaker).',
			color: '#FFD700'
		},
		{
			id: 4,
			name: 'The Individualist',
			description:
				'Creative, sensitive and moody, Fours are motivated by a need to be understood, experience their emotions and avoid being ordinary. Grows to Type 1 (Reformer), stresses to Type 2 (Helper).',
			color: '#9D4EDD'
		},
		{
			id: 5,
			name: 'The Investigator',
			description:
				'Analytical, detached and private, Fives are motivated by a need to gain knowledge, conserve energy and avoid depending on others. Grows to Type 8 (Challenger), stresses to Type 7 (Enthusiast).',
			color: '#457B9D'
		},
		{
			id: 6,
			name: 'The Loyalist',
			description:
				'Committed, practical and witty, Sixes are motivated by fear and the need for security, and seek to avoid worst-case scenarios. Grows to Type 9 (Peacemaker), stresses to Type 3 (Achiever).',
			color: '#B59410'
		},
		{
			id: 7,
			name: 'The Enthusiast',
			description:
				'Fun, spontaneous and versatile, Sevens are motivated by a need to be happy and avoid pain and discomfort. Grows to Type 5 (Investigator), stresses to Type 1 (Reformer).',
			color: '#76C893'
		},
		{
			id: 8,
			name: 'The Challenger',
			description:
				'Powerful, dominating and self-confident, Eights are motivated by a need to be strong and avoid feeling weak or vulnerable. Grows to Type 2 (Helper), stresses to Type 5 (Investigator).',
			color: '#1A535C'
		},
		{
			id: 9,
			name: 'The Peacemaker',
			description:
				'Easygoing, accommodating and peaceful, Nines are motivated by a need to keep the peace, merge with others and avoid conflict. Grows to Type 3 (Achiever), stresses to Type 6 (Loyalist).',
			color: '#F8961E'
		}
	];

	// Center and radius for the main circle
	const center = { x: 50, y: 50 };
	const radius = 32; // Reduced radius to leave more space for labels

	// Convert angle (0° = top) to x,y coordinates
	function getPosition(angle: number) {
		const radians = (angle - 90) * (Math.PI / 180);
		return {
			x: center.x + radius * Math.cos(radians),
			y: center.y + radius * Math.sin(radians)
		};
	}

	// Position each type so that Type 9 (index=8) is at angle=0 (top)
	const typePositions = enneagramTypes.map((_, index) => {
		const angle = 40 * ((index + 1) % 9);
		return getPosition(angle);
	});

	// Growth/Stress connections
	const connections = [
		{ from: 0, to: 6 }, // 1 → 7
		{ from: 0, to: 3 }, // 1 → 4
		{ from: 1, to: 3 }, // 2 → 4
		{ from: 1, to: 7 }, // 2 → 8
		{ from: 2, to: 5 }, // 3 → 6
		{ from: 2, to: 8 }, // 3 → 9
		{ from: 3, to: 0 }, // 4 → 1
		{ from: 3, to: 1 }, // 4 → 2
		{ from: 4, to: 7 }, // 5 → 8
		{ from: 4, to: 6 }, // 5 → 7
		{ from: 5, to: 8 }, // 6 → 9
		{ from: 5, to: 2 }, // 6 → 3
		{ from: 6, to: 4 }, // 7 → 5
		{ from: 6, to: 0 }, // 7 → 1
		{ from: 7, to: 1 }, // 8 → 2
		{ from: 7, to: 4 }, // 8 → 5
		{ from: 8, to: 2 }, // 9 → 3
		{ from: 8, to: 5 } // 9 → 6
	];

	// Parse "Grows to Type X" from the description
	function getGrowthType(id: number) {
		const match = enneagramTypes[id - 1].description.match(/Grows to Type (\d+)/);
		return match ? match[1] : '?';
	}

	// Parse "stresses to Type Y" from the description
	function getStressType(id: number) {
		const match = enneagramTypes[id - 1].description.match(/stresses to Type (\d+)/);
		return match ? match[1] : '?';
	}

	// Get label positioning - more optimized for readability and containment
	function getLabelPosition(index: number) {
		const pos = typePositions[index];
		const type = enneagramTypes[index];

		// Custom positioning for each type to ensure they're contained within the component
		switch (type.id) {
			case 1: // The Reformer (right)
				return {
					left: `75%`,
					top: `25%`,
					textAlign: 'left'
				};
			case 2: // The Helper (right)
				return {
					left: `85%`,
					top: `42%`,
					textAlign: 'left'
				};
			case 3: // The Achiever (right bottom)
				return {
					left: `81%`,
					top: `65%`,
					textAlign: 'left'
				};
			case 4: // The Individualist (bottom right)
				return {
					left: `62%`,
					top: `84%`,
					textAlign: 'center'
				};
			case 5: // The Investigator (bottom)
				return {
					left: `38%`,
					top: `84%`,
					textAlign: 'center'
				};
			case 6: // The Loyalist (bottom left)
				return {
					left: `19%`,
					top: `65%`,
					textAlign: 'right'
				};
			case 7: // The Enthusiast (left)
				return {
					left: `16%`,
					top: `42%`,
					textAlign: 'right'
				};
			case 8: // The Challenger (left top)
				return {
					left: `25%`,
					top: `25%`,
					textAlign: 'right'
				};
			case 9: // The Peacemaker (top)
				return {
					left: `50%`,
					top: `12%`,
					textAlign: 'center'
				};
			default:
				// Fallback positioning
				let offsetX = 0;
				let offsetY = 0;

				if (pos.y < 50) {
					offsetY = -12;
				} else {
					offsetY = 12;
				}

				if (pos.x < 40) {
					offsetX = -15;
					return {
						left: `${pos.x + offsetX}%`,
						top: `${pos.y + offsetY}%`,
						textAlign: 'right'
					};
				} else if (pos.x > 60) {
					offsetX = 15;
					return {
						left: `${pos.x + offsetX}%`,
						top: `${pos.y + offsetY}%`,
						textAlign: 'left'
					};
				} else {
					return {
						left: `${pos.x}%`,
						top: `${pos.y + offsetY}%`,
						textAlign: 'center'
					};
				}
		}
	}

	// Adjust tooltip position to ensure it stays within viewport
	function getTooltipPosition() {
		if (!containerElement) return { left: '50%', top: '50%' };

		if (isMobile) {
			return { left: '50%', top: '50%' };
		}

		return { left: '50%', top: '50%' };
	}

	// Handle window resize for responsive design
	function handleResize() {
		if (typeof window !== 'undefined') {
			isMobile = window.innerWidth < 768;
			showLabels = window.innerWidth > 400;
			if (containerElement) {
				containerWidth = containerElement.clientWidth;
			}
		}
	}

	// Highlight connections for the hovered type
	function isConnectionHighlighted(conn) {
		if (!hoveredType) return false;
		return (
			enneagramTypes[conn.from].id === hoveredType || enneagramTypes[conn.to].id === hoveredType
		);
	}

	// Get URL for each Enneagram type
	function getTypeUrl(typeId: number) {
		return `/enneagram-corner/enneagram-type-${typeId}`;
	}

	function handleTypeClick(typeId: number) {
		if (isMobile) {
			window.location.href = getTypeUrl(typeId);
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

<div class="diagram-wrapper" bind:this={containerElement}>
	<div class="enneagram-container">
		<svg class="diagram-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<!-- Gradients and filters -->
			<defs>
				<linearGradient id="circleGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#fafafa" />
					<stop offset="100%" stop-color="#f0f0f0" />
				</linearGradient>
				<linearGradient id="circleGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#2a2a3e" />
					<stop offset="100%" stop-color="#1f1f2e" />
				</linearGradient>
				<filter id="circleShadow" x="-20%" y="-20%" width="140%" height="140%">
					<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.1" />
				</filter>
			</defs>

			<!-- Main circle -->
			<circle
				cx={center.x}
				cy={center.y}
				r={radius}
				class="main-circle"
				filter="url(#circleShadow)"
			/>

			<!-- Connection lines -->
			{#each connections as conn}
				<line
					x1={typePositions[conn.from].x}
					y1={typePositions[conn.from].y}
					x2={typePositions[conn.to].x}
					y2={typePositions[conn.to].y}
					class="connection-line"
					class:highlighted={isConnectionHighlighted(conn)}
					stroke={isConnectionHighlighted(conn) && hoveredType
						? enneagramTypes[hoveredType - 1].color
						: undefined}
				/>
			{/each}
		</svg>

		<!-- Enneagram Nodes -->
		{#each enneagramTypes as type, index}
			{#if mounted}
				<a
					href={getTypeUrl(type.id)}
					class="type-node"
					class:active={hoveredType === type.id}
					class:mobile={isMobile}
					style="
						left: {typePositions[index].x}%;
						top: {typePositions[index].y}%;
						--node-color: {type.color};
					"
					on:mouseenter={() => (hoveredType = type.id)}
					on:mouseleave={() => (hoveredType = null)}
					on:focus={() => (hoveredType = type.id)}
					on:blur={() => (hoveredType = null)}
					on:click={() => handleTypeClick(type.id)}
					tabindex="0"
					aria-label={`Enneagram Type ${type.id}: ${type.name}`}
				>
					<span class="type-number">{type.id}</span>
				</a>
			{/if}
		{/each}

		<!-- Type labels -->
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
							: '-100%'}, 0);
					"
				>
					<span class="label-text">{type.name}</span>
				</div>
			{/if}
		{/each}

		<!-- Tooltip -->
		{#if hoveredType && mounted}
			{@const currentType = enneagramTypes[hoveredType - 1]}
			<div
				class="tooltip"
				style="left: 50%; top: 50%;"
				in:scale={{ duration: 150, opacity: 0, start: 0.95, easing: cubicOut }}
				out:fade={{ duration: 100 }}
			>
				<div class="tooltip-badge" style="background-color: {currentType.color}">
					<span>{hoveredType}</span>
				</div>
				<div class="tooltip-content">
					<h3 class="tooltip-title">{currentType.name}</h3>
					<p class="tooltip-description">{currentType.description.split('.')[0]}.</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	/* Wrapper */
	.diagram-wrapper {
		position: relative;
		width: 100%;
		max-width: 56rem;
		margin: 0 auto;
	}

	/* Container */
	.enneagram-container {
		position: relative;
		width: 100%;
		padding-bottom: 100%; /* 1:1 aspect ratio */
	}

	/* SVG */
	.diagram-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* Main circle */
	.main-circle {
		fill: url(#circleGradientLight);
		stroke: #d0d0d0;
		stroke-width: 0.3;
		transition: all 0.3s ease;

		:global(.dark) & {
			fill: url(#circleGradientDark);
			stroke: #3a3a4a;
		}
	}

	/* Connection lines */
	.connection-line {
		stroke: #aaa;
		stroke-width: 0.25;
		stroke-opacity: 0.35;
		transition: all 0.3s ease;

		&.highlighted {
			stroke-width: 0.5;
			stroke-opacity: 0.7;
		}

		:global(.dark) & {
			stroke: #666;
			stroke-opacity: 0.4;

			&.highlighted {
				stroke-opacity: 0.8;
			}
		}
	}

	/* Type nodes */
	.type-node {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background-color: var(--node-color);
		border-radius: 50%;
		text-decoration: none;
		cursor: pointer;
		transform: translate(-50%, -50%);
		transition:
			transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.15),
			0 1px 3px rgba(0, 0, 0, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.25);

		&::after {
			content: none !important;
			display: none !important;
		}

		&.mobile {
			width: 2rem;
			height: 2rem;
		}

		&:hover,
		&:focus,
		&.active {
			transform: translate(-50%, -50%) scale(1.18);
			box-shadow:
				0 4px 16px rgba(0, 0, 0, 0.2),
				0 0 0 3px rgba(255, 255, 255, 0.3);
			z-index: 10;
		}

		&:focus {
			outline: none;
			box-shadow:
				0 4px 16px rgba(0, 0, 0, 0.2),
				0 0 0 3px rgba(91, 76, 219, 0.5);
		}
	}

	.type-number {
		font-size: 0.9375rem;
		font-weight: 700;
		color: #fff;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		line-height: 1;

		.mobile & {
			font-size: 0.8125rem;
		}
	}

	/* Type labels */
	.type-label {
		position: absolute;
		pointer-events: none;
		max-width: 130px;
		transition:
			opacity 0.25s ease,
			color 0.25s ease;

		&.dimmed {
			opacity: 0.35;
		}

		&.active {
			color: var(--label-color) !important;
		}

		@media (max-width: 767px) {
			max-width: 90px;
		}
	}

	.label-text {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-secondary, #444);
		line-height: 1.3;
		display: block;

		.active & {
			font-weight: 700;
			color: var(--label-color);
		}

		:global(.dark) & {
			color: var(--text-secondary, #b0b0b0);
		}

		@media (max-width: 767px) {
			font-size: 0.6875rem;
		}
	}

	/* Tooltip */
	.tooltip {
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #fff;
		border-radius: 10px;
		padding: 0.625rem 1rem;
		max-width: min(320px, 90%);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.12),
			0 4px 8px rgba(0, 0, 0, 0.08);
		z-index: 100;
		border: 1px solid rgba(0, 0, 0, 0.06);

		:global(.dark) & {
			background: #1e1e2e;
			border-color: rgba(255, 255, 255, 0.08);
			box-shadow:
				0 8px 24px rgba(0, 0, 0, 0.35),
				0 4px 8px rgba(0, 0, 0, 0.25);
		}
	}

	.tooltip-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		flex-shrink: 0;

		span {
			font-size: 1rem;
			font-weight: 700;
			color: #fff;
		}
	}

	.tooltip-content {
		flex: 1;
		min-width: 0;
	}

	.tooltip-title {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary, #1a1a1a);
		margin: 0;
		line-height: 1.2;

		:global(.dark) & {
			color: var(--text-primary, #f0f0f0);
		}
	}

	.tooltip-description {
		font-size: 0.75rem;
		color: var(--text-secondary, #666);
		line-height: 1.4;
		margin: 0.125rem 0 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;

		:global(.dark) & {
			color: var(--text-secondary, #a0a0a0);
		}
	}
</style>
