<!-- src/routes/admin/questions/hierarchy/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import CategoryTree from '$lib/components/molecules/CategoryTree.svelte';

	let { data }: { data: PageData } = $props();

	interface Category {
		id: number;
		name: string;
		level: number;
		children?: Category[];
	}

	function countCategories(cats: Category[]): number {
		return cats.reduce((acc, cat) => {
			return acc + 1 + (cat.children ? countCategories(cat.children) : 0);
		}, 0);
	}

	let categories = $derived(data.categories as Category[]);
	let totalCategories = $derived(countCategories(categories));
	let topLevelCount = $derived(categories.length);
</script>

<div class="page-header">
	<div class="header-content">
		<h1>Category Hierarchy</h1>
		<p class="subtitle">View and manage question category structure</p>
	</div>
	<div class="header-stats">
		<div class="stat-pill">
			<span class="stat-value">{totalCategories}</span>
			<span class="stat-label">Total Categories</span>
		</div>
		<div class="stat-pill">
			<span class="stat-value">{topLevelCount}</span>
			<span class="stat-label">Top Level</span>
		</div>
	</div>
</div>

<div class="hierarchy-container">
	{#if categories.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📂</div>
			<h3>No Categories</h3>
			<p>No question categories have been created yet.</p>
		</div>
	{:else}
		<div class="tree-wrapper">
			{#each categories as category}
				<CategoryTree {category} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-content h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
	}

	.header-stats {
		display: flex;
		gap: 0.75rem;
	}

	.stat-pill {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.625rem 1rem;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		min-width: 90px;
	}

	.stat-value {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--shadow-monarch);
	}

	.stat-label {
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.hierarchy-container {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	.tree-wrapper {
		padding: 1.25rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1.5rem;
	}

	.empty-icon {
		font-size: 2.5rem;
		margin-bottom: 0.75rem;
	}

	.empty-state h3 {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.375rem 0;
	}

	.empty-state p {
		color: var(--text-secondary);
		margin: 0;
		font-size: 0.875rem;
	}

	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
		}

		.header-stats {
			width: 100%;
		}

		.stat-pill {
			flex: 1;
		}
	}
</style>
