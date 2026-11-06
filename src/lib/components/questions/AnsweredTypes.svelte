<!-- src/lib/components/questions/AnsweredTypes.svelte -->
<!--
  The nine types as a strip: lit when someone of that type has answered, dim when no one has.
  Give-first safe: it takes type numbers only, never take text.
-->
<script lang="ts">
	import { listTypes } from '$lib/data/homepageLiveTypes';

	let {
		answered,
		size = 'md',
		class: extraClass = ''
	}: { answered: number[]; size?: 'sm' | 'md'; class?: string } = $props();

	const TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	let seen = $derived(new Set(answered));
	let label = $derived(
		answered.length === 0
			? 'No type has answered yet'
			: answered.length === 9
				? 'All nine types have answered'
				: `Types that have answered: ${listTypes(answered).replace(' or ', ' and ')}`
	);
</script>

<ol class={['answered-types', `answered-types--${size}`, extraClass]} aria-label={label}>
	{#each TYPES as type (type)}
		<li class={['answered-types__type', seen.has(type) && 'is-in']} aria-hidden="true">{type}</li>
	{/each}
</ol>

<style>
	.answered-types {
		--dot: 30px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.answered-types--sm {
		--dot: 22px;
		gap: 4px;
	}
	.answered-types__type {
		display: grid;
		place-items: center;
		width: var(--dot);
		height: var(--dot);
		border: 1px dashed color-mix(in srgb, var(--highlight) 28%, transparent);
		border-radius: 50%;
		color: var(--text-faint);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: calc(var(--dot) * 0.5);
		line-height: 1;
	}
	.answered-types__type.is-in {
		border: 1px solid color-mix(in srgb, var(--highlight) 40%, transparent);
		background: var(--accent-deep);
		color: var(--highlight);
	}
</style>
