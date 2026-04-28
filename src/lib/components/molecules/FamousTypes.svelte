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
