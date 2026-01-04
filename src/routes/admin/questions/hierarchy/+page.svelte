<!-- src/routes/admin/questions/hierarchy/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import CategoryTree from '$lib/components/molecules/CategoryTree.svelte';

	export let data: PageData;

	interface Category {
		id: number;
		name: string;
		level: number;
		children?: Category[];
	}

	let categories: Category[] = data.categories;

	// Count total categories
	function countCategories(cats: Category[]): number {
		return cats.reduce((acc, cat) => {
			return acc + 1 + (cat.children ? countCategories(cat.children) : 0);
		}, 0);
	}

	$: totalCategories = countCategories(categories);
	$: topLevelCount = categories.length;
</script>

<div class="hierarchy-page">
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
</div>

<style>
	.hierarchy-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.header-content h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary, #1e293b);
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		color: var(--text-secondary, #64748b);
		font-size: 0.95rem;
		margin: 0;
	}

	.header-stats {
		display: flex;
		gap: 1rem;
	}

	.stat-pill {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem 1.25rem;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		min-width: 100px;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--primary, #6366f1);
	}

	.stat-label {
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.hierarchy-container {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 16px;
		overflow: hidden;
	}

	.tree-wrapper {
		padding: 1.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
		margin: 0 0 0.5rem 0;
	}

	.empty-state p {
		color: var(--text-secondary, #64748b);
		margin: 0;
	}

	@media (max-width: 640px) {
		.hierarchy-page {
			padding: 1rem;
		}

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
