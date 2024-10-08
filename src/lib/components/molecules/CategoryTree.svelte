<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	interface Category {
		id: number;
		name: string;
		level: number;
		children?: Category[];
	}

	export let category: Category;
	let expanded = category.level === 1;

	function toggleExpand() {
		expanded = !expanded;
	}
</script>

<div class="category-item mb-2">
	<div
		class="flex cursor-pointer items-center rounded p-2 hover:bg-gray-100"
		on:click={toggleExpand}
		on:keydown={(e) => e.key === 'Enter' && toggleExpand()}
		tabindex="0"
	>
		{#if category.children && category.children.length > 0}
			<span class="mr-2 text-gray-500">
				{expanded ? '▼' : '►'}
			</span>
		{/if}
		<A
			href="/questions/categories/{category.name.split(' ').join('-')}"
			class="ml-auto"
			data-sveltekit-preload-data="tap"
			id="category-link-{category.id}">{category.name}</A
		>
	</div>

	{#if expanded && category.children && category.children.length > 0}
		<div class="ml-6 mt-2" transition:slide|local>
			{#each category.children as childCategory}
				<svelte:self category={childCategory} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.category-item {
		transition: all 0.3s ease;
	}
</style>
