<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	interface CategoryStep {
		id: number;
		category_name: string;
		level: number;
	}

	export let categoryStructure: CategoryStep[] = [];

	$: categories = categoryStructure;

	$: jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: categories.map((step, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: step.category_name,
			item: `https://9takes.com/questions/categories/${step.category_name.split(' ').join('-')}`
		}))
	};

	function getCategoryUrl(slug: string): string {
		return `/questions/categories/${slug.split(' ').join('-')}`;
	}

	function formatCategoryName(name: string): string {
		return name.replace(/-/g, ' ');
	}

	afterNavigate(() => {
		// If you need to fetch the category structure here, you can do so
		// For now, we assume it's passed as a prop
	});
</script>

<svelte:head>
	{#if categories.length}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>

{#if categories.length}
	<div class="breadcrumb-container">
		<div class="back-nav">
			{#each categories as step, index}
				<a href={getCategoryUrl(step.category_name)} class="marquee-text">
					{formatCategoryName(step.category_name)}
				</a>
				{#if index < categories.length - 1}
					<span class="marquee-text separator">></span>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.breadcrumb-container {
		max-width: 64rem;
		margin: auto;
	}

	.back-nav {
		width: 100%;
		border-bottom: 1px solid rgba(44, 45, 42, 0.25);
		display: flex;
		align-items: center;
		overflow: hidden;
		flex-wrap: wrap;
	}

	.marquee-text {
		color: var(--dark-gray);
		text-transform: uppercase;
		font-size: 1.2rem;
		margin: 0 0.5rem;

		&.separator {
			margin: 0 0.2rem;
		}
	}

	@media (max-width: 500px) {
		.back-nav {
			border-top: 1px solid var(--dark-gray);
			border-bottom: 1px solid var(--dark-gray);
			padding: 0.5rem;
			margin: 1rem;
			height: 3rem;
			width: 90%;
		}

		.marquee-text {
			margin: 0 0.4rem;
		}
	}
</style>
