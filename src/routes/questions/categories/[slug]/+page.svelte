<!-- src/routes/questions/categories/[slug]/+page.svelte -->
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { QuestionItem } from '$lib/components';
	import CategoryNavigation from '$lib/components/atoms/CategoryNavigation.svelte';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	import { A, Accordion, AccordionItem } from 'flowbite-svelte';

	// import { ChevronDownOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	/** @type {import('./$types').PageData} */
	export let data: any;

	// Function to create a hierarchical structure
	function createHierarchy(items) {
		if (!items?.length) return [];
		const hierarchy = [];
		const lookup = {};

		// First pass: create lookup table
		items.forEach((item) => {
			const { id, category_name, level, parent_id } = item;
			lookup[id] = { id, category_name, level, parent_id, children: [] };
		});

		const startingLevel = items.reduce(
			(maxLevel, item) => Math.min(maxLevel, item?.level),
			items[0].level
		);
		// Second pass: build hierarchy
		items.forEach((item) => {
			const { id, parent_id, level } = item;
			if (level === startingLevel) {
				hierarchy.push(lookup[id]);
			} else if (lookup[parent_id]) {
				lookup[parent_id].children.push(lookup[id]);
			}
		});

		// Function to sort children recursively
		function sortChildren(category) {
			category.children.sort((a, b) => a.category_name.localeCompare(b.category_name));
			category.children.forEach(sortChildren);
		}

		// Sort the hierarchy
		hierarchy.sort((a, b) => a.category_name.localeCompare(b.category_name));
		hierarchy.forEach(sortChildren);

		return hierarchy;
	}

	$: hierarchicalData = createHierarchy(data?.children);

	function formatUrl(name: string): string {
		return `/questions/categories/${name.split(' ').join('-')}`;
	}

	const shareImage = 'https://9takes.com/questions-default.webp';
	$: categoryName = data?.questionTag?.category_name || '';
	$: categorySlug = categoryName ? categoryName.split(' ').join('-') : '';
	$: pageTitle = categoryName
		? `9takes Question Categories | ${categoryName}`
		: '9takes Question Categories';
	$: pageDescription = categoryName
		? `Browse ${categoryName} questions. User generated questions with comments sorted by personality type.`
		: 'Browse questions organized by category. User generated questions with comments sorted by personality type.';
	$: canonicalUrl = categorySlug
		? `https://9takes.com/questions/categories/${categorySlug}`
		: 'https://9takes.com/questions/categories';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonicalUrl} />
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

	<div class="max-w-2xl p-2">
		<h1
			class="m-1 w-full rounded-lg text-left text-xl font-semibold text-neutral-900"
			id="question-box"
			itemprop="name"
		>
			{data?.questionTag?.category_name}
		</h1>
		{#each hierarchicalData as category (category.id)}
			<div class="mb-1 rounded-lg border border-gray-200 p-2 shadow-sm">
				<h2 class="!my-1 flex items-center !py-0 text-lg font-medium text-gray-900">
					<A
						href={formatUrl(category.category_name)}
						class="flex items-center text-gray-900 hover:text-primary-600"
					>
						<!-- {category.children.length ? <ChevronDownOutline class="mr-2 h-4 w-4" /> : <ChevronRightOutline class="mr-2 h-4 w-4" />} -->
						{category.category_name}
					</A>
				</h2>
				{#if category.children.length}
					<div class="ml-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
						{#each category.children as subCategory (subCategory.id)}
							<div class="rounded-md bg-gray-50 p-2">
								<A
									href={formatUrl(subCategory.category_name)}
									class="font-medium text-gray-700 hover:text-primary-600"
								>
									{subCategory.category_name}
								</A>
								{#if subCategory.children.length}
									<ul class="mt-1 space-y-1 pl-4 text-sm">
										{#each subCategory.children as subSubCategory (subSubCategory.id)}
											<li>
												<A
													href={formatUrl(subSubCategory.category_name)}
													class="text-gray-600 hover:text-primary-600"
												>
													{subSubCategory.category_name}
												</A>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if data?.questionCategories?.length}
		<div>
			{#each data.questionCategories as questionData}
				<QuestionItem {questionData} on:questionRemoved={() => invalidateAll()} />
			{/each}
		</div>
	{/if}
</div>
