<!-- src/routes/questions/categories/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	type RootCategory = {
		id: number;
		parent_id: number | null;
		subcategory_name: string;
	};

	type QuestionTag = {
		subcategory_id: number;
		tag_id: number;
		tag_name: string;
		question_count?: number;
	};

	type SubcategoryTag = QuestionTag & {
		question_subcategories: {
			id: number;
			subcategory_name: string;
		};
	};

	type CategoryCount = {
		tagid: number;
		question_count: number;
	};

	export let data: PageData;
	const rootCategories = (data?.rootCategories ?? []) as RootCategory[];
	const categories = (data?.categories ?? []) as CategoryCount[];
	const subcategoryTags = (data?.subcategoryTags ?? []) as SubcategoryTag[];

	let subCats: Record<number, QuestionTag[]> = {};
	let questionTags: Record<number, QuestionTag[]> = {};

	subcategoryTags.forEach((item) => {
		const nextTag: QuestionTag = {
			subcategory_id: item.subcategory_id,
			tag_id: item.tag_id,
			tag_name: item.tag_name
		};

		questionTags[item.tag_id] = [...(questionTags[item.tag_id] ?? []), nextTag];
	});

	categories.forEach((item) => {
		if (questionTags[item.tagid]) {
			questionTags[item.tagid] = questionTags[item.tagid].map((tag) => ({
				...tag,
				question_count: item.question_count
			}));
		}
	});

	subcategoryTags.forEach((item) => {
		const subcategoryId = item.question_subcategories.id;
		const linkedTags = questionTags[item.tag_id] ?? [];

		if (!linkedTags.length) return;

		subCats[subcategoryId] = [...(subCats[subcategoryId] ?? []), ...linkedTags];
	});

	const findParent = (id: number) => {
		return rootCategories.some((item) => item.parent_id === id);
	};

	const findParentCategory = (id: number) => {
		return rootCategories.filter((item) => item.parent_id === id);
	};

	const pageTitle = '9takes | Question Categories';
	const pageDescription =
		'Browse questions organized by category. User generated questions with comments sorted by personality type.';
	const canonicalUrl = 'https://9takes.com/questions/categories';
	const shareImage = 'https://9takes.com/questions-default.webp';

	function toSlug(name: string) {
		return name.split(' ').join('-');
	}

	function formatQuestionCount(count?: number) {
		return count && count > 1 ? `${count} questions` : '1 question';
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
	<meta name="twitter:image:alt" content="Question categories on 9takes" />
	<meta name="twitter:url" content={canonicalUrl} />
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

<div class="page-shell">
	<div class="page-inner">
		<header class="hero">
			<p class="eyebrow">Question Library</p>
			<h1>Categorized Questions</h1>
			<p class="lede">
				Browse the question archive by topic cluster instead of scrolling one long feed. Each lane
				groups related prompts so it is easier to jump straight into the conversations you actually
				care about.
			</p>
		</header>

		<div class="root-stack">
			{#each rootCategories as category}
				{#if category.parent_id === null}
					<section class="root-card">
						<div class="root-head">
							<p class="root-kicker">Topic Group</p>
							<h2>{category.subcategory_name}</h2>
						</div>

						<div class="subcategory-stack">
							{#each rootCategories as subCategory}
								{#if subCategory?.parent_id === category.id}
									<section class="subcategory-card">
										<h3>{subCategory.subcategory_name}</h3>
										<div class="tag-cluster">
											{#if subCats[subCategory.id]}
												{#each subCats[subCategory.id] as subSubCategory, i}
													{#if findParent(subSubCategory.subcategory_id) && findParentCategory(subSubCategory.subcategory_id)}
														{#each findParentCategory(subSubCategory.subcategory_id) as suuCategory}
															{#if suuCategory.subcategory_name === subSubCategory.tag_name && i === 0}
																<div class="nested-card">
																	<p class="nested-title">{suuCategory.subcategory_name}</p>
																	{#if subCats[suuCategory.id]}
																		<div class="tag-list">
																			{#each subCats[suuCategory.id] as scat}
																				<a
																					href={`/questions/categories/${toSlug(scat.tag_name)}`}
																					class="tag-link"
																				>
																					<span>{scat.tag_name}</span>
																					<span class="tag-count" title="question count">
																						{formatQuestionCount(scat.question_count)}
																					</span>
																				</a>
																			{/each}
																		</div>
																	{/if}
																</div>
															{/if}
														{/each}
													{:else}
														<a
															href={`/questions/categories/${toSlug(subSubCategory.tag_name)}`}
															class="tag-link"
														>
															<span>{subSubCategory.tag_name}</span>
															<span class="tag-count" title="question count">
																{formatQuestionCount(subSubCategory.question_count)}
															</span>
														</a>
													{/if}
												{/each}
											{:else}
												<p class="empty-note">No question tags available yet.</p>
											{/if}
										</div>
									</section>
								{/if}
							{/each}
						</div>
					</section>
				{/if}
			{/each}
		</div>
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

	.eyebrow,
	.root-kicker {
		margin: 0 0 0.35rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
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

	.root-stack {
		display: grid;
		gap: 1.25rem;
	}

	.root-card {
		padding: 1.15rem;
		border-radius: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-color));
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 34%, transparent) 0%,
				transparent 44%
			),
			color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep));
		box-shadow: var(--shadow-sm);
	}

	.root-head {
		margin-bottom: 1rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid color-mix(in srgb, var(--accent) 16%, var(--border-color));
	}

	.root-head h2 {
		font-size: 1.4rem;
	}

	.subcategory-stack {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.subcategory-card {
		padding: 0.95rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--border-color));
		background: color-mix(in srgb, var(--bg-surface) 88%, var(--bg-base));
	}

	.subcategory-card h3 {
		margin-bottom: 0.8rem;
		font-size: 1rem;
	}

	.tag-cluster {
		display: grid;
		gap: 0.6rem;
	}

	.nested-card {
		padding: 0.8rem;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--accent) 12%, var(--border-color));
		background: color-mix(in srgb, var(--accent-soft) 22%, var(--bg-surface));
	}

	.nested-title {
		margin-bottom: 0.65rem;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.tag-link {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
		padding: 0.55rem 0.8rem;
		border-radius: 0.8rem;
		border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--border-color));
		background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
		color: var(--text-primary);
		font-size: 0.87rem;
		line-height: 1.4;
		text-decoration: none;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			color 0.2s ease;
	}

	.tag-link:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--accent) 36%, transparent);
		color: var(--primary);
		box-shadow: var(--shadow-sm);
	}

	.tag-count {
		font-size: 0.74rem;
		color: var(--text-tertiary);
	}

	.empty-note {
		font-size: 0.88rem;
		color: var(--text-secondary);
	}

	@media (max-width: 840px) {
		.subcategory-stack {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.page-inner {
			padding: 2rem 0.85rem 3rem;
		}

		.root-card {
			padding: 0.95rem;
		}

		.root-head h2 {
			font-size: 1.22rem;
		}
	}
</style>
