<!-- src/lib/components/molecules/PeopleBoard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { famousTypes } from './famousTypes'; // adjust path as needed
	import SmallPopCard from '../atoms/SmallPopCard.svelte';

	let gridSize = 9;
	export let images: Array<any> = images.length;

	// We'll still track total / loaded for optional usage or debugging
	let totalCount = 0;
	let loadedCount = 0;

	onMount(async () => {
		if (window.innerWidth < 600) {
			gridSize = 5;
		}
	});
</script>

<!-- We always render the grid; each cell handles its own loading state. -->
<div class="grid-container" style="grid-template-columns: repeat({gridSize}, 1fr);">
	{#each images as person, index}
		{#if (gridSize === 9 && index === 40) || (gridSize === 5 && index === 27)}
			<!-- Special "YOUR NAME" cell -->
			<div class="grid-cell loaded">
				<SmallPopCard
					image=""
					showIcon={false}
					displayText="YOUR NAME"
					subtext=""
					link="/book-session"
				/>
			</div>
		{:else}
			<!-- Normal cell: show name immediately, show actual image only if `loaded` -->
			<div class="grid-cell">
				<SmallPopCard
					image={`/types/${person.type}s/s-${person.name}.webp`}
					showIcon={false}
					enneagramType={person.type}
					displayText={person.name.split('-').join(' ')}
					subtext=""
					link={person.url ? `/personality-analysis/${person.name}` : ''}
				/>
			</div>
		{/if}
	{/each}
</div>

<style>
	.grid-container {
		display: grid;
		gap: 4px;
		max-width: 900px;
		margin: 0 auto;
		position: relative;
	}

	.grid-cell {
		aspect-ratio: 1;
		overflow: hidden;
	}

	/* Optional styling differences if you want a "loading" vs "loaded" class. */
	.grid-cell.loading {
		background-color: #ddd; /* or some placeholder style */
	}
</style>
