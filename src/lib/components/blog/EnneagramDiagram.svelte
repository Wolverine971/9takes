<script lang="ts">
	let hoveredType: number | null = null;

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
	const radius = 35;

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
</script>

<div class="enneagram-component">
	<!-- Diagram container with a subtle border & background -->
	<div class="diagram-container">
		<svg class="diagram-svg" viewBox="0 0 100 100">
			<!-- Outer circle with a slight drop shadow -->
			<circle
				cx={center.x}
				cy={center.y}
				r={radius}
				stroke="#333"
				stroke-width="0.35"
				fill="none"
				style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));"
			/>

			<!-- All lines share a neutral color & slight hover effect via CSS -->
			{#each connections as conn}
				<line
					x1={typePositions[conn.from].x}
					y1={typePositions[conn.from].y}
					x2={typePositions[conn.to].x}
					y2={typePositions[conn.to].y}
					stroke="#888"
					stroke-width="0.3"
					class="connection-line"
				/>
			{/each}
		</svg>

		<!-- Enneagram Nodes -->
		{#each enneagramTypes as type, index}
			<a
				class="enneagram-node"
				style="
          left: {typePositions[index].x}%;
          top: {typePositions[index].y}%;
          background-color: {type.color};
          box-shadow: {hoveredType === type.id
					? '0 0 10px 3px rgba(0,0,0,0.3)'
					: '0 2px 5px rgba(0,0,0,0.2)'};
        "
				href={'/enneagram-corner/enneagram-type-' + type.id}
				on:mouseenter={() => (hoveredType = type.id)}
				on:mouseleave={() => (hoveredType = null)}
			>
				<span class="node-text">{type.id}</span>
			</a>
		{/each}

		<!-- Centered Tooltip -->
		{#if hoveredType}
			<div class="tooltip">
				<!-- The small arrow under the tooltip -->
				<div class="tooltip-arrow"></div>

				<!-- Header circle with hovered type number -->
				<div
					class="tooltip-header"
					style="background-color: {enneagramTypes[hoveredType - 1].color}"
				>
					<span class="tooltip-header-text">{hoveredType}</span>
				</div>

				<!-- Type name -->
				<h3 class="tooltip-title">
					{enneagramTypes[hoveredType - 1].name}
				</h3>

				<!-- Short excerpt from the description -->
				<p class="tooltip-description">
					{enneagramTypes[hoveredType - 1].description.split('.')[0]}.
				</p>

				<!-- Growth & Stress quick info -->
				<div class="tooltip-info">
					<div class="tooltip-info-column">
						<p class="tooltip-info-header">In Growth:</p>
						<p class="tooltip-info-text">→ Type {getGrowthType(hoveredType)}</p>
					</div>
					<div class="tooltip-info-column">
						<p class="tooltip-info-header">In Stress:</p>
						<p class="tooltip-info-text">→ Type {getStressType(hoveredType)}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Type labels near nodes -->
		{#each enneagramTypes as type, index}
			<div
				class="type-label"
				style="
          left: {typePositions[index].x}%;
          top: {typePositions[index].y < 50
					? typePositions[index].y - 5
					: typePositions[index].y + 5}%;
        "
			>
				{type.name}
			</div>
		{/each}
	</div>
</div>

<style>
	/* This is the key part that isolates your component's styles */
	:global(.enneagram-component) {
		/* Reset all inherited styles */
		all: revert;

		/* Set base element styles */
		color: #333;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		box-sizing: border-box;
	}

	/* Then, define component-specific styles */
	.enneagram-component {
		position: relative;
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.diagram-container {
		position: relative;
		aspect-ratio: 1;
		width: 100%;
		max-width: 32rem;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		background-color: white;
		padding: 1rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.diagram-svg {
		height: 100%;
		width: 100%;
	}

	.connection-line {
		transition: opacity 200ms;
	}

	.connection-line:hover {
		opacity: 0.75;
	}

	.enneagram-node {
		position: absolute;
		display: flex;
		height: 2rem;
		width: 2rem;
		transform: translate(-50%, -50%);
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: transform 200ms;
		z-index: 10;
	}

	.enneagram-node:hover {
		transform: translate(-50%, -50%) scale(1.1);
	}

	.node-text {
		font-weight: bold;
		color: white;
	}

	.tooltip {
		position: absolute;
		z-index: 20;
		max-width: 16rem;
		border-radius: 0.5rem;
		background-color: white;
		padding: 1rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		transition: opacity 200ms;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -52%);
		border: 1px solid purple;
	}

	.tooltip-arrow {
		position: absolute;
		bottom: -0.5rem;
		left: 50%;
		height: 0;
		width: 0;
		transform: translateX(-50%);
		border-bottom: 0.5rem solid white;
		border-left: 0.5rem solid transparent;
		border-right: 0.5rem solid transparent;
	}

	.tooltip-header {
		margin: 0 auto 0.5rem;
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		ring: 2px solid white;
	}

	.tooltip-header-text {
		font-weight: bold;
		color: white;
	}

	.tooltip-title {
		margin-bottom: 0.25rem;
		text-align: center;
		font-size: 1.125rem;
		font-weight: bold;
		color: #1f2937;
	}

	.tooltip-description {
		margin-bottom: 0.75rem;
		text-align: center;
		font-size: 0.875rem;
		color: #4b5563;
	}

	.tooltip-info {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
	}

	.tooltip-info-column {
		width: 50%;
	}

	.tooltip-info-column:first-child {
		border-right: 1px solid #e5e7eb;
		padding-right: 0.5rem;
	}

	.tooltip-info-column:last-child {
		padding-left: 0.5rem;
	}

	.tooltip-info-header {
		margin-bottom: 0.25rem;
		font-weight: bold;
		color: #4b5563;
	}

	.type-label {
		position: absolute;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--primary);
		transform: translate(-50%, -50%);
		width: 5rem;
		text-align: center;
		font-family: var(--font-family);
		font-weight: bold;
		z-index: 1234;
		text-shadow: 1px 1px 2px pink;
	}

	a::after {
		content: none;
	}
</style>
