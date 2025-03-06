<script lang="ts">
	import { onMount } from 'svelte';
	import { famousTypes } from './famousTypes'; // adjust path as needed
	import SmallPopCard from '../atoms/SmallPopCard.svelte';

	let gridSize = 9;
	let images: Array<any> = [];

	// We'll still track total / loaded for optional usage or debugging
	let totalCount = 0;
	let loadedCount = 0;

	/**
	 * Preloads a single image; increments `loadedCount` when successful.
	 * Forces a Svelte re-render for that single item by reassigning `images`.
	 */
	function preloadImage(person, i): Promise<void> {
		return new Promise((resolve, reject) => {
			person.loaded = false; // initialize state
			const img = new Image();
			img.src = `/types/${person.type}s/s-${person.name}.webp`;
			img.onload = () => {
				person.loaded = true;
				loadedCount += 1;
				// Force Svelte to recognize the updated `loaded` property:
				images = [...images];
				resolve();
			};
			img.onerror = (err) => reject(err);
		});
	}

	onMount(async () => {
		if (window.innerWidth < 600) {
			gridSize = 5;
		}

		// Build images array
		Object.keys(famousTypes).forEach((keyStr, i) => {
			if (i < gridSize) {
				const key = Number(keyStr);
				let group = famousTypes[key].filter((person) => person.link);
				if (group.length < 9) {
					console.log(key);
					group.push(...famousTypes[key].filter((person) => !person.link).slice(0, 3));
				}

				const slicedGroup = group.slice(0, gridSize);
				slicedGroup.forEach((person) => {
					let info = { ...person, type: key, url: person.link };
					images.push(info);
				});
			}
		});
		totalCount = images.length;

		// Preload all images in parallel
		try {
			await Promise.all(images.map(preloadImage));
			// At this point, all images *should* have `loaded = true`.
		} catch (err) {
			console.error('Failed to load an image:', err);
		}
	});
</script>

<!-- We always render the grid; each cell handles its own loading state. -->
<div class="grid-container" style="grid-template-columns: repeat({gridSize}, 1fr);">
	{#each images as person, index}
		{#if (gridSize === 9 && index === 40) || (gridSize === 5 && index === 12)}
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
			<div class="grid-cell {person.loaded ? 'loaded' : 'loading'}">
				<SmallPopCard
					image={person.loaded ? `/types/${person.type}s/s-${person.name}.webp` : ''}
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
