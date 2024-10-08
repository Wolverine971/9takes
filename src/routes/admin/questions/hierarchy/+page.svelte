<script lang="ts">
	import type { PageData } from './$types';
	import CategoryItem from '$lib/components/molecules/CategoryItem.svelte';
	import CategoryTree from '$lib/components/molecules/CategoryTree.svelte';

	export let data: PageData;

	interface Category {
		id: number;
		name: string;
		level: number;
		children?: Category[];
	}

	let categories: Category[] = data.categories;
</script>

<div class="container mx-auto p-8">
	<h1 class="mb-6 text-3xl font-bold">Category Hierarchy</h1>
	<div class="rounded-lg bg-white p-6 shadow-md">
		{#each categories as category}
			<CategoryTree {category} />
		{/each}
	</div>
</div>
<div class="container mx-auto p-8">
	<h1 class="mb-6 text-3xl font-bold">Category Hierarchy</h1>
	<div class="rounded-lg bg-white p-6 shadow-md">
		{#each categories as category}
			<CategoryTree {category} />
		{/each}
	</div>
</div>
