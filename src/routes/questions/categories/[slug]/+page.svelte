<!-- src/routes/questions/categories/[slug]/+page.svelte -->
<!--
  /questions/categories/[slug] — Streetlamp Symposium V5 shelf detail.
  Visual ground truth: /questions, /questions/categories.
  Tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-rgb)
  live globally in src/scss/index.scss.
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import CategoryBrowseBranch from '$lib/components/questions/CategoryBrowseBranch.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import Breadcrumbs from '$lib/components/blog/Breadcrumbs.svelte';
	import {
		buildQuestionCategoryPath,
		buildQuestionCategorySlug
	} from '$lib/utils/questionCategorySlug';
	import type { BreadcrumbItem } from '$lib/utils/schema';

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

	type ParentCategory = {
		id: number;
		category_name: string;
		slug?: string | null;
		level: number;
	};

	type QuestionRow = {
		id: number;
		url: string | null;
		question: string | null;
		question_formatted?: string | null;
		comment_count: number | null;
		created_at: string | null;
	};

	/** @type {import('./$types').PageData} */
	export let data: any;

	const shareImage = 'https://9takes.com/questions-default.webp';
	let childCategories: BrowseCategoryNode[] = [];
	$: childCategories = (data?.childCategories ?? []) as BrowseCategoryNode[];
	$: parents = (data?.parents ?? []) as ParentCategory[];
	$: directCount = Number(data?.currentCategory?.directQuestionCount ?? 0);
	$: subtreeCount = Number(data?.currentCategory?.subtreeQuestionCount ?? 0);
	$: nestedCount = Math.max(subtreeCount - directCount, 0);
	$: categoryName = data?.questionTag?.category_name || '';
	$: categoryIntroHtml = data?.categoryIntroHtml || '';
	$: categorySlug = data?.questionTag?.slug || buildQuestionCategorySlug(categoryName);
	$: questions = (data?.questionCategories ?? []) as QuestionRow[];
	$: hasIntro = Boolean(categoryIntroHtml);
	$: hasBranches = childCategories.length > 0;
	$: pageTitle = categoryName
		? `9takes Question Categories | ${categoryName}`
		: '9takes Question Categories';
	$: pageDescription = categoryName
		? data?.categoryIntroDescription ||
			`Browse ${categoryName} questions. User generated questions with comments sorted by personality type.`
		: 'Browse questions organized by category. User generated questions with comments sorted by personality type.';
	$: canonicalUrl = categorySlug
		? `https://9takes.com/questions/categories/${categorySlug}`
		: 'https://9takes.com/questions/categories';
	$: breadcrumbItems = [
		{ name: 'Home', url: 'https://9takes.com' },
		{ name: 'Questions', url: 'https://9takes.com/questions' },
		{ name: 'Categories', url: 'https://9takes.com/questions/categories' },
		...parents.map((parent) => ({
			name: parent.category_name,
			url: `https://9takes.com${buildQuestionCategoryPath(parent.slug || parent.category_name)}`
		}))
	] satisfies BreadcrumbItem[];

	function relativeTime(iso: string | null | undefined): string {
		if (!iso) return 'POSTED RECENTLY';
		const ts = new Date(iso).getTime();
		if (!Number.isFinite(ts)) return 'POSTED RECENTLY';
		const diff = Date.now() - ts;
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return 'POSTED JUST NOW';
		if (minutes < 60) return `POSTED ${minutes}M AGO`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `POSTED ${hours}H AGO`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `POSTED ${days}D AGO`;
		return `POSTED ${new Date(iso)
			.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
			.toUpperCase()}`;
	}
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
	<meta name="twitter:image:alt" content={`Questions in ${categoryName || 'this category'}`} />
	<meta name="twitter:url" content={canonicalUrl} />
	{@html `<script type="application/ld+json">
		${JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: categoryName ? `${categoryName} Questions | 9takes` : 'Question Categories | 9takes',
			description: pageDescription,
			url: canonicalUrl,
			isPartOf: {
				'@type': 'WebSite',
				name: '9takes',
				url: 'https://9takes.com'
			},
			breadcrumb: {
				'@type': 'BreadcrumbList',
				itemListElement: breadcrumbItems.map((item, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: item.name,
					item: item.url
				}))
			}
		})}
	</script>`}
</svelte:head>

<div class="category-page">
	<!-- =====================================================================
	  HERO — shelf header
	  ===================================================================== -->
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-inner">
			{#if breadcrumbItems.length > 1}
				<div class="hero-breadcrumbs">
					<Breadcrumbs items={breadcrumbItems} />
				</div>
			{/if}

			<SectionKicker class="section-tag" label="SHELF" />
			<h1 class="display-xl" id="question-box" itemprop="name">
				{categoryName}
			</h1>

			{#if subtreeCount > 0}
				<p class="hero-meta mono">
					OPEN ·
					{#if directCount > 0}
						{directCount}
						{directCount === 1 ? 'QUESTION' : 'QUESTIONS'} HERE
					{:else}
						0 QUESTIONS HERE
					{/if}
					{#if nestedCount > 0}
						<span class="hero-meta-sep" aria-hidden="true">·</span>
						{nestedCount} NESTED BELOW
					{/if}
				</p>
			{/if}

			<div class="hero-ctas">
				<Button size="md" variant="primary" href="/questions/create">Ask a question →</Button>
				<Button size="md" variant="ghost" href="/questions/categories">All shelves</Button>
			</div>

			<div class="hero-search">
				<SearchQuestion
					{data}
					on:questionSelected={({ detail }) => {
						if (detail?.url) {
							void goto(`/questions/${detail.url}`);
						}
					}}
				/>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  INTRO — category copy (if any)
	  ===================================================================== -->
	{#if hasIntro}
		<section class="intro">
			<div class="intro-inner">
				<SectionKicker class="section-tag" label="ABOUT THIS SHELF" />
				<div class="intro-copy" data-category-intro>
					{@html categoryIntroHtml}
				</div>
			</div>
		</section>
	{/if}

	<!-- =====================================================================
	  BRANCHES — child subcategories
	  ===================================================================== -->
	{#if hasBranches}
		<section class="branches">
			<div class="section-inner">
				<header class="section-header">
					<SectionKicker class="section-tag" label="BRANCHES" />
					<h2 class="display-md">Drill into subcategories.</h2>
					<p class="section-sub">Numbers count every live question nested underneath.</p>
				</header>

				<div class="branch-grid">
					{#each childCategories as category (category.id)}
						<CategoryBrowseBranch {category} depth={1} />
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- =====================================================================
	  OPEN FLOOR — questions in this category
	  ===================================================================== -->
	<section class="open-floor">
		<div class="open-floor-pool" aria-hidden="true"></div>

		<div class="section-inner">
			<header class="section-header">
				<SectionKicker class="section-tag" label="OPEN FLOOR" />
				<h2 class="display-md">Questions on this shelf.</h2>
				<p class="mono open-floor-kicker">
					OPEN · {questions.length}
					{questions.length === 1 ? 'QUESTION' : 'QUESTIONS'} TAGGED HERE
				</p>
				<p class="section-sub">
					Each question is read by all 9 personality types. Drop your take to unlock the room.
				</p>
			</header>

			{#if questions.length === 0}
				<div class="empty-state">
					<p class="mono empty-state-label">SHELF · QUIET</p>
					<p class="empty-state-body">
						Nothing tagged directly here yet. Try a branch above, or be the first to drop a
						question.
					</p>
					<Button size="md" variant="primary" href="/questions/create">Ask a question →</Button>
				</div>
			{:else}
				<ul class="question-list">
					{#each questions as q (q.id)}
						<li class="question-row">
							<a href={`/questions/${q.url}`} class="question-row-link">
								<span class="question-row-text">
									{q.question_formatted ?? q.question ?? ''}
								</span>
								<span class="mono question-row-meta">
									<span class="question-row-takes">
										{q.comment_count ?? 0} TAKE{(q.comment_count ?? 0) === 1 ? '' : 'S'}
									</span>
									<span class="question-row-sep" aria-hidden="true">·</span>
									<span class="question-row-time">{relativeTime(q.created_at)}</span>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /questions/categories/[slug] — V5 shelf detail.
	  ========================================================= */
	.category-page {
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
	.category-page :global(.mono) {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.category-page :global(.section-tag) {
		display: inline-block;
		margin-bottom: 12px;
		color: var(--lamp-glow);
	}

	.display-xl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(32px, 5vw, 52px);
		line-height: 1.05;
		letter-spacing: -0.035em;
		color: var(--ink-bright);
		margin: 0;
	}

	.display-md {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(22px, 3vw, 30px);
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		margin: 0;
	}

	.section-sub {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
		margin: 0;
	}

	.section-inner {
		max-width: 880px;
		margin: 0 auto;
	}

	.section-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		margin-bottom: 28px;
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
	  HERO
	  ========================================================= */
	.hero {
		position: relative;
		padding: 56px 48px 48px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 36px 20px 32px;
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

	.hero-breadcrumbs {
		width: 100%;
		margin-bottom: -2px;
	}

	.hero-breadcrumbs :global(.breadcrumbs) {
		margin-bottom: 0;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.hero-breadcrumbs :global(.breadcrumbs a) {
		color: var(--ink-mid);

		&:hover {
			color: var(--lamp-glow);
		}
	}

	.hero-breadcrumbs :global(.breadcrumbs .current) {
		color: var(--ink-mid);
	}

	.hero-breadcrumbs :global(.breadcrumbs .separator) {
		color: var(--ink-dim);
		opacity: 0.6;
	}

	.hero-meta {
		color: var(--ink-dim);
		margin: 0;
	}

	.hero-meta-sep {
		opacity: 0.6;
		margin: 0 4px;
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 4px;
	}

	.hero-search {
		width: 100%;
		max-width: 720px;
		margin-top: 12px;
		position: relative;
		z-index: 5;
	}

	/* =========================================================
	  INTRO
	  ========================================================= */
	.intro {
		position: relative;
		padding: 48px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 32px 20px;
		}
	}

	.intro-inner {
		max-width: 720px;
		margin: 0 auto;
	}

	.intro-copy {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-mid);
	}

	:global([data-category-intro] p) {
		margin: 0 0 0.85rem;
		color: var(--ink-mid);
		line-height: 1.7;
	}

	:global([data-category-intro] p:last-child) {
		margin-bottom: 0;
	}

	:global([data-category-intro] ul),
	:global([data-category-intro] ol) {
		margin: 0 0 0.85rem;
		padding-left: 1.2rem;
		color: var(--ink-mid);
	}

	:global([data-category-intro] li) {
		margin-bottom: 0.35rem;
		line-height: 1.65;
	}

	:global([data-category-intro] a) {
		color: var(--lamp-glow);
		text-decoration: underline;
		text-underline-offset: 2px;

		&:hover {
			text-decoration-thickness: 2px;
		}
	}

	:global([data-category-intro] strong) {
		color: var(--ink-bright);
	}

	/* =========================================================
	  BRANCHES
	  ========================================================= */
	.branches {
		position: relative;
		padding: 56px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 40px 20px;
		}
	}

	.branch-grid {
		display: flex;
		flex-direction: column;
	}

	/* =========================================================
	  OPEN FLOOR
	  ========================================================= */
	.open-floor {
		position: relative;
		padding: 64px 48px 96px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 48px 20px 72px;
		}
	}

	.open-floor-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 80% 60% at 50% 0%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 55%
		);
		z-index: 0;
	}

	.open-floor :global(.section-inner) {
		position: relative;
		z-index: 1;
	}

	.open-floor-kicker {
		color: var(--ink-dim);
		margin: 0;
	}

	/* ---------- question rows ---------- */
	.question-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--stone-edge);
	}

	.question-row {
		border-bottom: 1px solid var(--stone-edge);
		transition: background 0.15s ease;

		&:hover {
			background: var(--stone-warm);
		}
	}

	.question-row-link {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 14px;
		text-decoration: none;
		color: inherit;

		&:hover .question-row-text {
			color: var(--lamp-glow);
		}

		@media (max-width: 540px) {
			padding: 10px 10px;
		}
	}

	.question-row-text {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 16px;
		line-height: 1.35;
		color: var(--ink-bright);
		letter-spacing: -0.005em;
		transition: color 0.15s ease;

		@media (max-width: 540px) {
			font-size: 15px;
		}
	}

	.question-row-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: var(--ink-dim);
		flex-wrap: wrap;
	}

	.question-row-takes {
		color: var(--data-teal);
	}

	.question-row-time {
		color: var(--ink-dim);
	}

	.question-row-sep {
		opacity: 0.5;
	}

	/* ---------- empty state ---------- */
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
		margin: 0 0 8px;
	}
</style>
