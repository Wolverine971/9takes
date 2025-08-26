<!-- src/routes/admin/questions/hierarchy/+page.svelte -->
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

<div class="rounded-lg bg-neutral-50 bg-opacity-80 p-6 shadow-lg backdrop-blur-sm">
	<!-- Page Header -->
	<div class="page-header mb-6">
		<h1 class="text-2xl font-bold text-neutral-900">Category Hierarchy</h1>
		<p class="text-neutral-600">View and manage question category structure</p>
	</div>

	<div class="rounded-lg bg-white p-6 shadow-md">
		{#each categories as category}
			<CategoryTree {category} />
		{/each}
	</div>
</div>
