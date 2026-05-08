<!-- src/lib/components/molecules/FamousTypes.svelte -->
<script lang="ts">
	export let type: number; //: Database['public']['Tables']['comments']['Row'];
	import { famousTypes } from '$lib/components/molecules/famousTypes';
	import {
		buildPersonalityAnalysisPath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
</script>

<ul class="famous-types">
	{#each famousTypes[type] as person}
		<li>
			{#if person.link}
				<a href={buildPersonalityAnalysisPath(person.name)}>
					{formatPersonalityDisplayName(person.name)}
				</a>
			{:else}
				<span>{formatPersonalityDisplayName(person.name)}</span>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.famous-types {
		list-style: none;
		padding: 0;
		margin: 0;
		columns: 14rem auto;
		column-gap: 1.5rem;
	}

	.famous-types li {
		break-inside: avoid;
		padding: 0.15rem 0;
		line-height: 1.4;
	}

	@media (min-width: 48rem) {
		.famous-types {
			column-count: 2;
		}
	}

	@media (min-width: 72rem) {
		.famous-types {
			column-count: 3;
		}
	}
</style>
