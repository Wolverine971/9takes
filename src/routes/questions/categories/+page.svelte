<!-- src/routes/questions/categories/+page.svelte -->
<!--
  /questions/categories — Streetlamp Symposium V5 library shelf.
  Visual ground truth: /questions, /design-preview/v5.
  Tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-rgb)
  live globally in src/scss/index.scss.
-->
<script lang="ts">
	import CategoryBrowseBranch from '$lib/components/questions/CategoryBrowseBranch.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
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

<div class="categories-page">
	<!-- =====================================================================
	  §01 LIBRARY — hero
	  ===================================================================== -->
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-inner">
			<SectionKicker class="section-tag" num="01" label="LIBRARY" />
			<h1 class="display-xl">The question library.</h1>
			<p class="hero-sub">
				Every live category, sorted by shelf. Empty branches stay closed &mdash; what you see has
				questions waiting underneath.
			</p>
			<p class="mono hero-meta">
				OPEN · {totalVisibleCategories}
				{totalVisibleCategories === 1 ? 'CATEGORY' : 'CATEGORIES'} · {totalVisibleRoots}
				{totalVisibleRoots === 1 ? 'SHELF' : 'SHELVES'}
			</p>
			<div class="hero-ctas">
				<Button size="md" variant="primary" href="/questions">Browse open questions →</Button>
				<Button size="md" variant="ghost" href="/questions/create">Ask a question</Button>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  §02 SHELVES — recursive category tree
	  ===================================================================== -->
	<section class="shelves">
		<header class="shelves-header">
			<SectionKicker class="section-tag" num="02" label="THE STACKS" />
			<h2 class="display-md">Browse by shelf.</h2>
			<p class="shelves-sub">
				Counts include every live question nested underneath. Drill in until you find the question
				you're circling.
			</p>
		</header>

		<div class="shelves-body">
			{#if categoryTree.length === 0}
				<div class="empty-state">
					<p class="mono empty-state-label">SHELVES · EMPTY</p>
					<p class="empty-state-body">
						Once questions are tagged into the new category tree, they will appear here
						automatically.
					</p>
				</div>
			{:else}
				<div class="shelf-stack">
					{#each categoryTree as rootCategory (rootCategory.id)}
						<CategoryBrowseBranch category={rootCategory} />
					{/each}
				</div>
			{/if}
		</div>
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /questions/categories — V5 library layout.
	  Bridge tokens ship globally from src/scss/index.scss.
	  ========================================================= */
	.categories-page {
		--pool-alpha-strong: 0.22;
		--pool-alpha-mid: 0.14;
		--pool-alpha-soft: 0.06;
		--grain-opacity: 0.05;

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-display);
		min-height: 100vh;
		position: relative;
		overflow: hidden;

		:global(:root.light) & {
			--pool-alpha-strong: 0.12;
			--pool-alpha-mid: 0.06;
			--pool-alpha-soft: 0.03;
			--grain-opacity: 0.025;
		}
	}

	/* ---------- shared utilities ---------- */
	.categories-page :global(.mono) {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.categories-page :global(.section-tag) {
		display: inline-block;
		margin-bottom: 14px;
		color: var(--lamp-glow);
	}

	.display-xl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 5.4vw, 56px);
		line-height: 1.05;
		letter-spacing: -0.035em;
		color: var(--ink-bright);
		margin: 0;
	}

	.display-md {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(24px, 3vw, 32px);
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		margin: 0;
	}

	/* ---------- subtle paper grain ---------- */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--grain-opacity);
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	/* =========================================================
	  §01 HERO
	  ========================================================= */
	.hero {
		position: relative;
		padding: 72px 48px 56px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 48px 20px 40px;
		}
	}

	.hero-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 50% 50% at 12% 12%,
			rgba(var(--pool-rgb), var(--pool-alpha-strong)) 0%,
			rgba(var(--pool-rgb), var(--pool-alpha-soft)) 32%,
			transparent 60%
		);
		z-index: 0;
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
	}

	.hero-sub {
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 640px;
		margin: 0;

		@media (max-width: 540px) {
			font-size: 15px;
		}
	}

	.hero-meta {
		color: var(--ink-dim);
		margin: 0;
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 6px;
	}

	/* =========================================================
	  §02 SHELVES
	  ========================================================= */
	.shelves {
		position: relative;
		padding: 64px 48px 96px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 48px 20px 72px;
		}
	}

	.shelves-header {
		max-width: 880px;
		margin: 0 auto 32px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.shelves-sub {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
		margin: 0;
	}

	.shelves-body {
		max-width: 880px;
		margin: 0 auto;
	}

	.shelf-stack {
		display: flex;
		flex-direction: column;
	}

	/* =========================================================
	  Empty state
	  ========================================================= */
	.empty-state {
		max-width: 560px;
		margin: 0 auto;
		padding: 40px 28px;
		text-align: center;
		border: 1px dashed var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
	}

	.empty-state-label {
		color: var(--lamp-glow);
		margin: 0;
	}

	.empty-state-body {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin: 0;
	}
</style>
