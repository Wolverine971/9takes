<!-- src/routes/questions/categories/+page.svelte -->
<script lang="ts">
	import CategoryBrowseBranch from '$lib/components/questions/CategoryBrowseBranch.svelte';
	import type { PageData } from './$types';

	type BrowseCategoryNode = {
		id: number;
		category_name: string;
		slug?: string | null;
		parent_id: number | null;
		level: number;
		directQuestionCount: number;
		subtreeQuestionCount: number;
		hasDirectQuestions: boolean;
		children: BrowseCategoryNode[];
	};

	export let data: PageData;

	let categoryTree: BrowseCategoryNode[] = [];
	let totalVisibleCategories = 0;
	let totalVisibleRoots = 0;
	$: categoryTree = (data?.categoryTree ?? []) as BrowseCategoryNode[];
	$: totalVisibleCategories = Number(data?.totalVisibleCategories ?? 0);
	$: totalVisibleRoots = Number(data?.totalVisibleRoots ?? categoryTree.length);

	const pageTitle = '9takes | Question Categories';
	const pageDescription =
		'Browse question categories with live questions only. Empty branches are hidden so the tree stays useful.';
	const canonicalUrl = 'https://9takes.com/questions/categories';
	const shareImage = 'https://9takes.com/questions-default.webp';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="author" content="DJ Wayne" />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" href={canonicalUrl} hreflang="en-US" />
	<link rel="alternate" href={canonicalUrl} hreflang="x-default" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={shareImage} />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={shareImage} />
	<meta name="twitter:image:alt" content="Question categories on 9takes" />
	<meta name="twitter:url" content={canonicalUrl} />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Question Categories | 9takes",
			"description": "Browse question categories with live questions only. Empty branches are hidden so the tree stays useful.",
			"url": "https://9takes.com/questions/categories",
			"isPartOf": {
				"@type": "WebSite",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Questions",
						"item": "https://9takes.com/questions"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Categories",
						"item": "https://9takes.com/questions/categories"
					}
				]
			}
		}
	</script>
</svelte:head>

<div class="page-shell">
	<div class="page-inner">
		<header class="hero">
			<p class="eyebrow">Question Library</p>
			<h1>Categories With Live Questions</h1>
			<p class="lede">
				This tree only shows branches that currently lead to real questions. Empty categories are
				hidden so the browse view stays tight and useful.
			</p>

			<div class="hero-stats" aria-label="Category totals">
				<div class="stat-chip">
					<strong>{totalVisibleCategories}</strong>
					<span>visible categories</span>
				</div>
				<div class="stat-chip">
					<strong>{totalVisibleRoots}</strong>
					<span>topic groups</span>
				</div>
			</div>
		</header>

		{#if categoryTree.length === 0}
			<section class="empty-state">
				<h2>No categories with live questions yet.</h2>
				<p>
					Once questions are tagged into the new category tree, they will appear here automatically.
				</p>
			</section>
		{:else}
			<div class="root-stack">
				{#each categoryTree as rootCategory (rootCategory.id)}
					<CategoryBrowseBranch category={rootCategory} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.page-shell {
		min-height: 100vh;
		background:
			radial-gradient(
				circle at top,
				color-mix(in srgb, var(--accent-soft) 48%, transparent) 0%,
				transparent 36%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-deep) 88%, var(--bg-base)) 0%,
				var(--bg-base) 100%
			);
	}

	.page-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2.5rem 1rem 4rem;
	}

	.hero {
		margin-bottom: 2rem;
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	h1,
	h2,
	p {
		margin: 0;
	}

	h1,
	h2 {
		color: var(--text-primary);
		line-height: 1.15;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 3.1rem);
		letter-spacing: -0.03em;
	}

	.lede {
		max-width: 760px;
		margin: 0.95rem auto 0;
		font-size: 1rem;
		line-height: 1.7;
		color: var(--text-secondary);
	}

	.hero-stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	.stat-chip {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		min-width: 10rem;
		padding: 0.85rem 1rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--accent) 16%, var(--border-color));
		background: color-mix(in srgb, var(--bg-surface) 88%, var(--bg-base));
		box-shadow: var(--shadow-sm);
	}

	.stat-chip strong {
		font-size: 1.45rem;
		color: var(--text-primary);
	}

	.stat-chip span {
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.root-stack {
		display: grid;
		gap: 1.25rem;
	}

	.empty-state {
		padding: 1.4rem;
		border-radius: 1.2rem;
		border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--border-color));
		background: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-base));
		text-align: center;
		box-shadow: var(--shadow-sm);
	}

	.empty-state p {
		margin-top: 0.65rem;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	@media (max-width: 720px) {
		.page-inner {
			padding-top: 2rem;
		}

		.stat-chip {
			min-width: 8.75rem;
		}
	}
</style>
