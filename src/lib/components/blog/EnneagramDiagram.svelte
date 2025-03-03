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

<!-- Wrapper with a nice gradient background -->
<div class="relative flex w-full flex-col items-center justify-center">
	<!-- Title at the top -->

	<!-- Diagram container with a subtle border & background -->
	<div
		class="relative aspect-square w-full max-w-2xl overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
	>
		<svg class="h-full w-full" viewBox="0 0 100 100">
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
					class="transition-opacity duration-200 hover:opacity-75"
				/>
			{/each}
		</svg>

		<!-- Enneagram Nodes -->
		{#each enneagramTypes as type, index}
			<a
				class="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform
               cursor-pointer items-center justify-center rounded-full transition-transform duration-200
               hover:scale-110"
				style="
          left: {typePositions[index].x}%;
          top: {typePositions[index].y}%;
          background-color: {type.color};
          box-shadow: {hoveredType === type.id
					? '0 0 10px 3px rgba(0,0,0,0.3)' // More dramatic ring if hovered
					: '0 2px 5px rgba(0,0,0,0.2)'};
          z-index: 10;
        "
				href={'/enneagram-corner/enneagram-type-' + type.id}
				on:mouseenter={() => (hoveredType = type.id)}
				on:mouseleave={() => (hoveredType = null)}
			>
				<span class="font-bold text-white">{type.id}</span>
			</a>
		{/each}

		<!-- Centered Tooltip -->
		{#if hoveredType}
			<div
				class="absolute z-20 max-w-xs rounded-lg bg-white p-4
               shadow-xl transition-opacity duration-200"
				style="
          left: 50%;
          top: 50%;
          transform: translate(-50%, -52%); /* Slight upward offset so arrow is below */
          border: 1px solid purple;
        "
			>
				<!-- The small arrow under the tooltip -->
				<div
					class="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-b-8 border-l-8 border-r-8 border-transparent"
					style="border-bottom-color: white;"
				></div>

				<!-- Header circle with hovered type number -->
				<div
					class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white"
					style="background-color: {enneagramTypes[hoveredType - 1].color}"
				>
					<span class="font-bold text-white">{hoveredType}</span>
				</div>

				<!-- Type name -->
				<h3 class="mb-1 text-center text-lg font-bold text-gray-800">
					{enneagramTypes[hoveredType - 1].name}
				</h3>

				<!-- Short excerpt from the description -->
				<p class="mb-3 text-center text-sm text-gray-600">
					{enneagramTypes[hoveredType - 1].description.split('.')[0]}.
				</p>

				<!-- Growth & Stress quick info -->
				<div class="flex justify-between text-xs">
					<div class="w-1/2 border-r border-gray-200 pr-2">
						<p class="mb-1 font-bold text-gray-700">In Growth:</p>
						<p>→ Type {getGrowthType(hoveredType)}</p>
					</div>
					<div class="w-1/2 pl-2">
						<p class="mb-1 font-bold text-gray-700">In Stress:</p>
						<p>→ Type {getStressType(hoveredType)}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Optional type labels near nodes (slightly smaller & subdued) -->
		{#each enneagramTypes as type, index}
			<div
				class="absolute text-xs font-medium text-gray-700"
				style="
          left: {typePositions[index].x}%;
          top: {typePositions[index].y < 50
					? typePositions[index].y - 5
					: typePositions[index].y + 5}%;
          transform: translate(-50%, -50%);
          width: 80px;
          text-align: center;
        "
			>
				{type.name}
			</div>
		{/each}
	</div>
</div>
