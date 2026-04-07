<!-- src/routes/questions/categories/[slug]/+page.svelte -->
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { QuestionItem } from '$lib/components';
	import CategoryBrowseBranch from '$lib/components/questions/CategoryBrowseBranch.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { buildQuestionCategorySlug } from '$lib/utils/questionCategorySlug';

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

	/** @type {import('./$types').PageData} */
	export let data: any;

	const shareImage = 'https://9takes.com/questions-default.webp';
	let childCategories: BrowseCategoryNode[] = [];
	$: childCategories = (data?.childCategories ?? []) as BrowseCategoryNode[];
	$: categoryName = data?.questionTag?.category_name || '';
	$: categoryIntroHtml = data?.categoryIntroHtml || '';
	$: categorySlug = data?.questionTag?.slug || buildQuestionCategorySlug(categoryName);
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
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: 'https://9takes.com'
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Questions',
						item: 'https://9takes.com/questions'
					},
					{
						'@type': 'ListItem',
						position: 3,
						name: 'Categories',
						item: 'https://9takes.com/questions/categories'
					},
					{
						'@type': 'ListItem',
						position: 4,
						name: categoryName,
						item: canonicalUrl
					}
				]
			}
		})}
	</script>`}
</svelte:head>

<div>
	<SearchQuestion
		{data}
		on:questionSelected={({ detail }) => {
			goto(`/questions/${detail.url}`, {});
		}}
	/>

	<div class="mx-auto max-w-5xl p-2">
		<h1
			class="m-1 w-full rounded-lg text-left text-xl font-semibold text-[var(--text-primary)]"
			id="question-box"
			itemprop="name"
		>
			{categoryName}
		</h1>

		{#if categoryIntroHtml}
			<section class="category-intro" aria-label={`${categoryName} intro`}>
				<div class="category-intro__copy" data-category-intro>
					{@html categoryIntroHtml}
				</div>
			</section>
		{/if}

		{#if childCategories.length}
			<section class="mb-4 mt-3">
				<h2 class="mb-3 text-base font-semibold text-[var(--text-primary)]">
					Subcategories With Live Questions
				</h2>
				<div class="grid gap-3">
					{#each childCategories as category (category.id)}
						<CategoryBrowseBranch {category} depth={1} />
					{/each}
				</div>
			</section>
		{/if}
	</div>

	{#if data?.questionCategories?.length}
		<div>
			{#each data.questionCategories as questionData}
				<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.category-intro {
		margin: 0.9rem 0 1.2rem;
		padding: 1rem 1.1rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--bg-elevated));
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary) 7%, transparent) 0%,
				transparent 100%
			),
			color-mix(in srgb, var(--bg-surface) 90%, var(--bg-base));
	}

	:global([data-category-intro] p) {
		margin: 0 0 0.85rem;
		color: var(--text-secondary);
		line-height: 1.75;
	}

	:global([data-category-intro] p:last-child) {
		margin-bottom: 0;
	}

	:global([data-category-intro] ul),
	:global([data-category-intro] ol) {
		margin: 0 0 0.85rem;
		padding-left: 1.2rem;
		color: var(--text-secondary);
	}

	:global([data-category-intro] li) {
		margin-bottom: 0.35rem;
		line-height: 1.7;
	}

	:global([data-category-intro] a) {
		color: var(--primary);
		text-decoration: underline;
	}

	:global([data-category-intro] strong) {
		color: var(--text-primary);
	}
</style>
