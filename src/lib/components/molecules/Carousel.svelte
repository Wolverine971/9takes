<!-- src/lib/components/molecules/Carousel.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import RubixGrid from '$lib/components/molecules/rubixGrid.svelte';
	import { famousTypes } from '$lib/components/molecules/famousTypes';
	import {
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	export let type: number;
	export let gridDisplay: boolean = false;

	// Filter to only include people with images
	$: peopleWithImages = famousTypes[type]?.filter((p) => p.hasImage) || [];

	let currentIndex = 0;
	$: visiblePerson = peopleWithImages[currentIndex];

	onMount(() => {
		if (peopleWithImages.length > 1) {
			currentIndex = 1;
		}
		setInterval(changePerson, 3333);
	});

	const changePerson = () => {
		if (peopleWithImages.length === 0) return;
		currentIndex = (currentIndex + 1) % peopleWithImages.length;
	};
</script>

<div
	style="display: flex;
    justify-content: center;
    margin: 1rem 0;
	"
>
	{#if type && gridDisplay}
		<RubixGrid peopleList={peopleWithImages} {type} />
	{:else if type && visiblePerson}
		<PopCard
			image={buildPersonalityImagePath(type, visiblePerson.name, 'thumbnail')}
			showIcon={false}
			displayText={formatPersonalityDisplayName(visiblePerson.name)}
			subtext={''}
		/>
	{/if}
</div>
