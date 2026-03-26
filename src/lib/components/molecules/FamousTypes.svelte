<!-- src/lib/components/molecules/FamousTypes.svelte -->
<script lang="ts">
	export let type: number; //: Database['public']['Tables']['comments']['Row'];
	import { famousTypes } from '$lib/components/molecules/famousTypes';
	import {
		buildPersonalityAnalysisPath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
</script>

<ul>
	{#each famousTypes[type] as person}
		<li>
			{#if person.link}
				<a href={buildPersonalityAnalysisPath(person.name)}>
					{formatPersonalityDisplayName(person.name)}
				</a>
			{:else}
				<p style="margin: 0;">{formatPersonalityDisplayName(person.name)}</p>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	@mixin white-gradient {
		background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
	}

	// Animation
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1024px * (var(--num-images))));
		}
	}
</style>
