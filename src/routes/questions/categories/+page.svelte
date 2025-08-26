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
	<div class="container">
		<!-- <ul class=""> -->
		<!-- Repeating list items for each number, skipping the ones in the 'skip' array -->
		<!-- Manually expanded for demonstration based on the given start and count -->
		<!-- You may need to manually adjust the numbers based on your specific requirements -->
		<h1>Categorized Questions</h1>

		{#each data?.rootCategories as category, index}
			{#if category.parent_id === null}
				<h3 style="text-align: start;">
					{category.subcategory_name}
					<ul>
						{#each data?.rootCategories as subCategory}
							{#if subCategory?.parent_id === category.id}
								<li>
									<p>
										<!-- <span>{subCategory.id}</span> -->
										{subCategory.subcategory_name}
									</p>
									<ul>
										{#if subCats[subCategory.id]}
											{#each subCats[subCategory.id] as subSubCategory, i}
												{#if findParent(subSubCategory.subcategory_id) && findParentCategory(subSubCategory.subcategory_id)}
													<ul>
														{#each findParentCategory(subSubCategory.subcategory_id) as suuCategory}
															{#if suuCategory?.tag_name === subSubCategory.subcategory_name && i === 0}
																<li>
																	<p>{suuCategory?.subcategory_name}</p>
																	{#if subCats[suuCategory.id]}
																		<ul>
																			{#each subCats[suuCategory.id] as scat}
																				<li>
																					<a
																						href={`/questions/categories/${scat?.tag_name
																							.split(' ')
																							.join('-')}`}
																						class=""
																					>
																						<span style="text-align: center;">{scat?.tag_name}</span
																						>
																						<span title="question count"
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
													<li>
														<a
															href={`/questions/categories/${subSubCategory?.tag_name
																.split(' ')
																.join('-')}`}
															class=""
														>
															<span style="text-align: center;">{subSubCategory?.tag_name}</span>
															<!-- <span>{subSubCategory?.question_count}</span> -->
															<span title="question count"
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

									<ul>
										{#each data?.rootCategories as sub}
											{#if findParent(subCategory.id) && 1 === 5}
												<li>
													<p>
														<span>sub: {sub.id}</span>
														{sub.subcategory_name}
													</p>
													<ul>
														<!-- <pre>{JSON.stringify(subCats[sub.id])}</pre> -->
														{#if subCats[sub.id]}
															{#each subCats[sub.id] as subSubCategory}
																<li>
																	<a
																		href={`/questions/categories/${subSubCategory?.tag_name
																			.split(' ')
																			.join('-')}`}
																		class=""
																	>
																		<span style="text-align: center;"
																			>{subSubCategory?.tag_name}</span
																		>
																		<!-- <span>{subSubCategory?.question_count}</span> -->

																		<span title="question count"
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

<!-- select subcategoryTags.tagname, Count(*) as count from questions
from subcategoryTags
join questions on subcategoryTags.id = questions.subcategoryTagId

D3 view 

https://codepen.io/derekmorash/pen/jyMGaX -->
<style lang="scss">
	h3 {
		margin: 0.2rem;
		padding: 0.2rem;
	}
	:root {
		--threeRoot: 1.73205080757; // sqrt(3);
	}

	// https://codepen.io/ichimonzi/
	// pen/BaMvKJK

	.container {
		height: 100%;
		max-width: 800px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0;
	}

	.list_link {
		color: whitesmoke !important;
	}
	li {
		list-style-type: none;
		text-align: start;
	}
</style>
