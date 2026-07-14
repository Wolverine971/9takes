<!-- src/lib/components/molecules/CategoryTree.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { buildQuestionCategoryPath } from '$lib/utils/questionCategorySlug';
	import { slide } from 'svelte/transition';
	import Self from './CategoryTree.svelte';

	interface Category {
		id: number;
		name: string;
		level: number;
		children?: Category[];
	}

	let { category }: { category: Category } = $props();
	let expanded = $state(isInitiallyExpanded());

	function isInitiallyExpanded() {
		return category.level === 1;
	}

	function toggleExpand() {
		expanded = !expanded;
	}
</script>

<div class="category-item mb-2">
	<div
		role="button"
		class="flex cursor-pointer items-center rounded-md p-2 hover:bg-[var(--stone-mid)]"
		onclick={toggleExpand}
		onkeydown={(e) => e.key === 'Enter' && toggleExpand()}
		tabindex="0"
	>
		{#if category.children && category.children.length > 0}
			<span class="mr-2 text-[var(--ink-mid)]">
				{expanded ? '▼' : '►'}
			</span>
		{/if}
		<a
			href={resolve(
				buildQuestionCategoryPath(category.name) as
					'/questions/categories' | `/questions/categories/${string}`
			)}
			class="ml-auto"
			data-sveltekit-preload-data="tap"
			id="category-link-{category.id}">{category.name}</a
		>
	</div>

	{#if expanded && category.children && category.children.length > 0}
		<div class="ml-6 mt-2" transition:slide|local>
			{#each category.children as childCategory (childCategory.id)}
				<Self category={childCategory} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.category-item {
		transition: all 0.3s ease;
	}
</style>
