<!-- src/routes/questions/categories/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let subCats = {};
	let questionTags = {};

	data?.subcategoryTags.forEach((item: any) => {
		if (!questionTags[item.tag_id]) {
			questionTags[item.tag_id] = [
				{
					subcategory_id: item.subcategory_id,
					tag_id: item.tag_id,
					tag_name: item.tag_name
				}
			];
		} else {
			questionTags[item.tag_id] = [
				...questionTags[item.tag_id],
				{
					subcategory_id: item.subcategory_id,
					tag_id: item.tag_id,
					tag_name: item.tag_name
				}
			];
		}
	});
	data?.categories.forEach((item: any) => {
		if (questionTags[item.tagid]) {
			questionTags[item.tagid] = [
				Object.assign(...questionTags[item.tagid], { question_count: item.question_count })
			];
		}

		return { ...item, special: false };
	});

	data?.subcategoryTags.forEach((item: any) => {
		if (item.tag_id && !subCats[item.question_subcategories.id]) {
			subCats[item.question_subcategories.id] = questionTags[item.tag_id];
		} else {
			if (item.question_subcategories.subcategory_name) {
				subCats[item.question_subcategories.id] = [
					...subCats[item.question_subcategories.id],

					...questionTags[item.tag_id]
				];
			}
		}
	});

	const findParent = (id: number) => {
		let hasParent = false;
		data?.rootCategories.forEach((item: any) => {
			if (item.parent_id === id) {
				hasParent = true;
			}
		});
		return hasParent;
	};
	const findParentCategory = (id: number) => {
		let parents = data?.rootCategories.filter((item: any) => {
			if (item.parent_id === id) {
				return true;
			}
		});
		return parents;
	};

	// console.log('subCats', subCats);
</script>

<svelte:head>
	<title>9takes | Question Categories</title>
	<meta
		name="description"
		content="Browse questions organized by category. User generated questions with comments sorted by personality type."
	/>
	<link rel="canonical" href="https://9takes.com/questions/categories" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"name": "Question Categories | 9takes",
			"description": "Browse questions organized by category. User generated questions with comments sorted by personality type.",
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

<div>
	<div class="mx-auto flex max-w-4xl flex-col items-start gap-4 px-3">
		<!-- <ul class=""> -->
		<!-- Repeating list items for each number, skipping the ones in the 'skip' array -->
		<!-- Manually expanded for demonstration based on the given start and count -->
		<!-- You may need to manually adjust the numbers based on your specific requirements -->
		<h1 class="text-2xl font-semibold text-neutral-900">Categorized Questions</h1>

		{#each data?.rootCategories as category, index}
			{#if category.parent_id === null}
				<h3 class="mt-6 text-left text-lg font-semibold text-neutral-900">
					{category.subcategory_name}
					<ul class="mt-2 space-y-2 text-left text-sm text-neutral-800">
						{#each data?.rootCategories as subCategory}
							{#if subCategory?.parent_id === category.id}
								<li class="list-none text-left">
									<p class="font-semibold text-neutral-900">
										<!-- <span>{subCategory.id}</span> -->
										{subCategory.subcategory_name}
									</p>
									<ul class="mt-2 space-y-2 border-l border-neutral-200 pl-3 text-sm text-neutral-700">
										{#if subCats[subCategory.id]}
											{#each subCats[subCategory.id] as subSubCategory, i}
												{#if findParent(subSubCategory.subcategory_id) && findParentCategory(subSubCategory.subcategory_id)}
													<ul class="space-y-1 border-l border-neutral-200 pl-3 text-sm">
														{#each findParentCategory(subSubCategory.subcategory_id) as suuCategory}
															{#if suuCategory?.tag_name === subSubCategory.subcategory_name && i === 0}
																<li class="list-none">
																	<p class="font-medium text-neutral-900">{suuCategory?.subcategory_name}</p>
																	{#if subCats[suuCategory.id]}
																		<ul class="mt-1 space-y-1 pl-4 text-sm text-neutral-700">
																			{#each subCats[suuCategory.id] as scat}
																				<li class="list-none">
																					<a
																						href={`/questions/categories/${scat?.tag_name
																							.split(' ')
																							.join('-')}`}
																						class="inline-flex items-center rounded-md border border-neutral-200 px-3 py-1 text-sm text-neutral-800 underline-offset-2 transition hover:text-primary-600"
																					>
																						<span class="text-center">{scat?.tag_name}</span>
																						<span class="ml-2 text-xs text-neutral-500" title="question count"
																							>({scat?.question_count > 1
																								? `${scat?.question_count} questions`
																								: '1 question'})</span
																						>
																					</a>
																				</li>
																			{/each}
																		</ul>
																	{/if}
																</li>
															{/if}
														{/each}
													</ul>
												{:else}
													<li class="list-none">
														<a
															href={`/questions/categories/${subSubCategory?.tag_name
																.split(' ')
																.join('-')}`}
															class="inline-flex items-center rounded-md border border-neutral-200 px-3 py-1 text-sm text-neutral-800 underline-offset-2 transition hover:text-primary-600"
														>
															<span class="text-center">{subSubCategory?.tag_name}</span>
															<span class="ml-2 text-xs text-neutral-500" title="question count"
																>({subSubCategory?.question_count > 1
																	? `${subSubCategory?.question_count} questions`
																	: '1 question'})</span
															>
														</a>
													</li>
												{/if}
											{/each}
										{/if}
									</ul>

									<ul class="mt-3 space-y-2 border-l border-dashed border-neutral-200 pl-4 text-sm text-neutral-700">
										{#each data?.rootCategories as sub}
											{#if findParent(subCategory.id) && 1 === 5}
												<li class="list-none">
													<p class="font-medium text-neutral-900">
														<span>sub: {sub.id}</span>
														{sub.subcategory_name}
													</p>
													<ul class="mt-1 space-y-1 pl-4">
														<!-- <pre>{JSON.stringify(subCats[sub.id])}</pre> -->
														{#if subCats[sub.id]}
															{#each subCats[sub.id] as subSubCategory}
																<li class="list-none">
																	<a
																		href={`/questions/categories/${subSubCategory?.tag_name
																			.split(' ')
																			.join('-')}`}
																		class="inline-flex items-center rounded-md border border-neutral-200 px-3 py-1 text-sm text-neutral-800 underline-offset-2 transition hover:text-primary-600"
																	>
																		<span class="text-center">{subSubCategory?.tag_name}</span>

																		<span class="ml-2 text-xs text-neutral-500" title="question count"
																			>({subSubCategory?.question_count > 1
																				? `${subSubCategory?.question_count} questions`
																				: '1 question'})</span
																		>
																	</a>
																</li>
															{/each}
														{/if}
													</ul>
												</li>
											{/if}
										{/each}
									</ul>
								</li>
								<!-- {:else if subCategory?.parent_id !== category.id} -->
							{/if}
						{/each}
					</ul>
				</h3>
			{/if}
		{/each}
	</div>
</div>
