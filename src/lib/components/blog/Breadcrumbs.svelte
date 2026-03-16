<!-- src/lib/components/blog/Breadcrumbs.svelte -->
<script lang="ts">
	import { buildBreadcrumbSchema, type BreadcrumbItem } from '$lib/utils/schema';

	export let items: BreadcrumbItem[] = [];

	$: breadcrumbJsonLd = items.length > 0 ? JSON.stringify(buildBreadcrumbSchema(items)) : null;
</script>

<svelte:head>
	{#if breadcrumbJsonLd}
		{@html `<script type="application/ld+json">${breadcrumbJsonLd}</script>`}
	{/if}
</svelte:head>

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
			color: #a78bfa;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: #c4b5fd;
				text-decoration: underline;
			}
		}

		.separator {
			color: #475569;
			margin: 0 0.15rem;
		}

		.current {
			color: #94a3b8;
		}
	}
</style>
