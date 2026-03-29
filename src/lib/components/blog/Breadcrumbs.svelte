<!-- src/lib/components/blog/Breadcrumbs.svelte -->
<script lang="ts">
	import type { BreadcrumbItem } from '$lib/utils/schema';

	let { items = [] }: { items?: BreadcrumbItem[] } = $props();
</script>

<!-- JSON-LD breadcrumb schema is already emitted by BlogPageHead/PeopleBlogPageHead -->

<nav aria-label="Breadcrumb" class="breadcrumbs">
	<ol itemscope itemtype="https://schema.org/BreadcrumbList">
		{#each items as item, i}
			<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
				{#if i < items.length - 1}
					<a itemprop="item" href={item.url}>
						<span itemprop="name">{item.name}</span>
					</a>
					<meta itemprop="position" content={String(i + 1)} />
					<span class="separator" aria-hidden="true">/</span>
				{:else}
					<span itemprop="name" class="current" aria-current="page">{item.name}</span>
					<meta itemprop="item" content={item.url} />
					<meta itemprop="position" content={String(i + 1)} />
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style lang="scss">
	.breadcrumbs {
		margin-bottom: 1rem;
		font-size: 0.85rem;

		ol {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			list-style: none;
			padding: 0;
			margin: 0;
			gap: 0.25rem;
		}

		li {
			display: flex;
			align-items: center;
			gap: 0.25rem;
		}

		a {
			color: var(--accent-light);
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: var(--accent-light);
				text-decoration: underline;
			}
		}

		.separator {
			color: var(--text-tertiary);
			margin: 0 0.15rem;
		}

		.current {
			color: var(--text-secondary);
		}
	}
</style>
