<script lang="ts">
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	export let category: any;
	export let questionTags: any;
	let showChildren = true;
</script>

<h3>
	{category?.subcategory_name}
	{#if category?.question_subcategories && category?.question_subcategories?.length !== 0}
		<button
			on:click={() => (showChildren = !showChildren)}
			class="btn btn-primary"
			style="display: inline-flex"
		>
			{#if showChildren}
				<DownIcon />
			{:else}
				<RightIcon />
			{/if}
		</button>
	{/if}
</h3>

<div style="display: {showChildren ? 'block' : 'none'};">
	{#if category?.question_subcategories && category?.question_subcategories?.length !== 0}
		<div style="margin: 0 2rem">
			{#each category?.question_subcategories as scategory}
				<svelte:self category={scategory} {questionTags} />
			{/each}
		</div>
	{:else if questionTags[category?.id]}
		<div style="margin: 0 2rem">
			{#each questionTags[category?.id] as qCat}
				<p>
					<a href={`/questions/${qCat?.url}`} style:--tag={`h-question-${qCat?.id}`}
						>{qCat?.question_formatted || qCat?.question}</a
					>
				</p>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
</style>
