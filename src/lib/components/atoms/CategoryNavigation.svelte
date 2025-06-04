<!-- lib/components/atoms/CategoryNavigation.svelte -->
<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let isMobile = false;

	interface CategoryStep {
		id: number;
		category_name: string;
		level: number;
	}

	export let categoryStructure: CategoryStep[] = [];
	let containerWidth = 0;
	let overflowing = false;

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

	function checkOverflow() {
		if (browser) {
			const container = document.querySelector('.category-container');
			const categoryNav = document.querySelector('.category-nav');

			if (container && categoryNav) {
				overflowing = categoryNav.scrollWidth > container.clientWidth;
			}
		}
	}

	// When the categories change, check for overflow
	$: {
		categories;
		if (browser) {
			setTimeout(checkOverflow, 10);
		}
	}

	afterNavigate(() => {
		if (browser) {
			setTimeout(checkOverflow, 100);
		}
	});
</script>

<svelte:head>
	{#if categories.length}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>

{#if categories.length}
	<div class="category-wrapper" bind:clientWidth={containerWidth}>
		<div class="category-container">
			<div class="category-nav" class:scrollable={overflowing}>
				{#if isMobile && categories.length > 2}
					<!-- On mobile with many categories, show a compact version -->
					<a href="/questions/categories" class="category-item">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
							<polyline points="9 22 9 12 15 12 15 22"></polyline>
						</svg>
					</a>
					<span class="separator">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</span>
					{#if categories.length > 1}
						<!-- Skip intermediate categories on small screens -->
						<span class="category-ellipsis">...</span>
						<span class="separator">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						</span>
					{/if}
					<!-- Always show current category -->
					<a
						href={getCategoryUrl(categories[categories.length - 1].category_name)}
						class="category-item current"
					>
						{formatCategoryName(categories[categories.length - 1].category_name)}
					</a>
				{:else}
					<!-- Full breadcrumb path for desktop or when there are few categories -->
					{#each categories as step, index}
						<a
							href={getCategoryUrl(step.category_name)}
							class="category-item {index === categories.length - 1 ? 'current' : ''}"
						>
							{formatCategoryName(step.category_name)}
						</a>
						{#if index < categories.length - 1}
							<span class="separator">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</span>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.category-wrapper {
		max-width: 64rem;
		margin: 0 auto;
		width: 100%;
	}

	.category-container {
		padding: 0 0.5rem;
		overflow: hidden;
	}

	.category-nav {
		display: flex;
		align-items: center;
		height: 2.5rem;
		border-bottom: 1px solid rgba(44, 45, 42, 0.2);
		width: 100%;

		&.scrollable {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;

			/* Hide scrollbar for Chrome, Safari and Opera */
			&::-webkit-scrollbar {
				display: none;
			}

			/* Hide scrollbar for IE, Edge and Firefox */
			-ms-overflow-style: none; /* IE and Edge */
			scrollbar-width: none; /* Firefox */
		}
	}

	.category-item {
		display: flex;
		align-items: center;
		color: var(--dark-gray);
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		white-space: nowrap;
		text-transform: capitalize;
		font-size: 0.9rem;
		transition: all 0.2s ease;

		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}

		&.current {
			font-weight: 500;
		}
	}

	.category-ellipsis {
		color: var(--dark-gray);
		opacity: 0.8;
		padding: 0 0.25rem;
	}

	.separator {
		display: flex;
		align-items: center;
		color: var(--dark-gray);
		opacity: 0.6;
		margin: 0 0.125rem;
	}

	@media (max-width: 768px) {
		.category-container {
			padding: 0 0.25rem;
		}

		.category-nav {
			height: 2.25rem;
		}

		.category-item {
			font-size: 0.85rem;
			padding: 0.25rem;
		}
	}

	@media (max-width: 480px) {
		.category-item {
			font-size: 0.8rem;
			padding: 0.25rem;
		}

		.separator svg {
			width: 14px;
			height: 14px;
		}
	}
</style>
