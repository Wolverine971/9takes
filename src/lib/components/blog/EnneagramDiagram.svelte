<!-- src/lib/components/blog/EnneagramDiagram.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { cubicOut, elasticOut } from 'svelte/easing';

	let hoveredType: number | null = null;
	let mounted = false;
	let containerWidth = 0;
	let containerElement: HTMLElement;
	let isMobile = false;

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

<div class="relative mx-auto w-full max-w-4xl" bind:this={containerElement}>
	<div class="enneagram-container">
		<svg class="h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<!-- Outer circle with subtle gradient -->
			<defs>
				<linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#f5f5f5" />
					<stop offset="100%" stop-color="#eaeaea" />
				</linearGradient>
			</defs>

			<circle
				cx={center.x}
				cy={center.y}
				r={radius}
				stroke="#333"
				stroke-width="0.35"
				fill="url(#circleGradient)"
				class="transition-all duration-300"
				style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1));"
			/>

			<!-- Connection lines with hover effects -->
			{#each connections as conn, i}
				<line
					x1={typePositions[conn.from].x}
					y1={typePositions[conn.from].y}
					x2={typePositions[conn.to].x}
					y2={typePositions[conn.to].y}
					stroke={isConnectionHighlighted(conn)
						? hoveredType
							? enneagramTypes[hoveredType - 1].color
							: '#888'
						: '#888'}
					stroke-width={isConnectionHighlighted(conn) ? '0.6' : '0.3'}
					stroke-opacity={isConnectionHighlighted(conn) ? '0.8' : '0.4'}
					class="transition-all duration-300 ease-out"
				/>
			{/each}
		</svg>

		<!-- Enneagram Nodes -->
		{#each enneagramTypes as type, index}
			{#if mounted}
				<a
					href={getTypeUrl(type.id)}
					class="node-hover-effect"
					style="
						left: {typePositions[index].x}%;
						top: {typePositions[index].y}%;
						background-color: {type.color};
						width: {isMobile ? '2rem' : '2.5rem'};
						height: {isMobile ? '2rem' : '2.5rem'};
						box-shadow: {hoveredType === type.id
						? '0 0 12px 4px rgba(0,0,0,0.15)'
						: '0 2px 5px rgba(0,0,0,0.2)'};
						transform: translate(-50%, -50%) {hoveredType === type.id ? 'scale(1.15)' : 'scale(1)'};
					"
					on:mouseenter={() => (hoveredType = type.id)}
					on:mouseleave={() => (hoveredType = null)}
					on:focus={() => (hoveredType = type.id)}
					on:blur={() => (hoveredType = null)}
					on:click={() => handleTypeClick(type.id)}
					tabindex="0"
					aria-label={`Enneagram Type ${type.id}: ${type.name}`}
				>
					<span class="text-sm font-bold text-white md:text-base">{type.id}</span>
				</a>
			{/if}
		{/each}

		<!-- Type labels with better visibility -->
		{#each enneagramTypes as type, index}
			{#if mounted && window.innerWidth > 400}
				<div
					class="enneagram-label"
					style="
						left: {getLabelPosition(index).left};
						top: {getLabelPosition(index).top};
						transform: translate({getLabelPosition(index).textAlign === 'center'
						? '-50%'
						: getLabelPosition(index).textAlign === 'left'
							? '0'
							: '-100%'}, 0);
						text-align: {getLabelPosition(index).textAlign};
						opacity: {hoveredType === null || hoveredType === type.id ? '1' : '0.4'};
						max-width: {isMobile ? '90px' : '130px'};
						color: {hoveredType === type.id ? type.color : '#333'};
						font-weight: {hoveredType === type.id ? '700' : '600'};
					"
				>
					<span class="label-text">
						{type.name}
					</span>
				</div>
			{/if}
		{/each}

		<!-- Tooltip with smooth transitions -->
		{#if hoveredType && mounted}
			<div
				class="enneagram-tooltip"
				style={`left: ${getTooltipPosition().left}; top: ${getTooltipPosition().top};`}
				in:scale={{ duration: 200, delay: 50, opacity: 0, start: 0.9, easing: cubicOut }}
				out:fade={{ duration: 150 }}
			>
				<!-- Header circle with hovered type number -->
				<div
					class="enneagram-tooltip__header"
					style={`background-color: ${enneagramTypes[hoveredType - 1].color}`}
					in:scale={{ duration: 300, delay: 100, easing: elasticOut }}
				>
					<span>{hoveredType}</span>
				</div>

				<!-- Type name -->
				<h3 class="enneagram-tooltip__title">
					{enneagramTypes[hoveredType - 1].name}
				</h3>

				<!-- Short excerpt from the description -->
				<p class="enneagram-tooltip__description">
					{enneagramTypes[hoveredType - 1].description.split('.')[0]}.
				</p>

				<!-- Growth & Stress quick info -->
				<div class="enneagram-tooltip__info">
					<div>
						<p>In Growth:</p>
						<p>→ Type {getGrowthType(hoveredType)}</p>
					</div>
					<div>
						<p>In Stress:</p>
						<p>→ Type {getStressType(hoveredType)}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	a {
		display: flex;

		&::after {
			content: none !important;
		}
	}
</style>
