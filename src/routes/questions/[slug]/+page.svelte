<!-- src/routes/questions/[slug]/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import type { PageData } from './$types';
	import type { QuestionPageData, Comment } from '$lib/types/questions';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';

	let { data }: { data: PageData } = $props();

	type EditableCategory = {
		id: number;
		category_name: string;
		parent_id: number | null;
		level: number | null;
	};

	const DEFAULT_MAX_CATEGORIES_PER_QUESTION = 3;

	// Local state for optimistic updates
	let optimisticComments = $state<Comment[]>([]);
	let optimisticUserHasAnswered = $state(false);
	let categoryEditorOpen = $state(false);
	let categoryEditorError = $state('');
	let categoryEditorSuccess = $state('');
	let categoryEditorSaving = $state(false);
	let creatingLeafCategory = $state(false);
	let newLeafCategoryName = $state('');
	let selectedRootCategoryId = $state<number | null>(null);
	let selectedParentCategoryId = $state<number | null>(null);
	let selectedTagIds = $state<number[]>([]);
	let serverTagSignature = $state('');

	let editableCategories = $derived<EditableCategory[]>(
		Array.isArray(data.categoryEditor?.categories)
			? (data.categoryEditor?.categories as EditableCategory[])
			: []
	);
	let maxCategoriesPerQuestion = $derived(
		Number(data.categoryEditor?.maxTagsPerQuestion || DEFAULT_MAX_CATEGORIES_PER_QUESTION)
	);
	let categoryById = $derived.by(
		() =>
			new Map<number, EditableCategory>(
				editableCategories.map((category) => [category.id, category])
			)
	);
	let rootCategories = $derived.by(() =>
		editableCategories
			.filter((category) => category.level === 1)
			.sort((a, b) => a.category_name.localeCompare(b.category_name))
	);
	let parentCategories = $derived.by(() => {
		if (!selectedRootCategoryId) {
			return [] as EditableCategory[];
		}
		return editableCategories
			.filter((category) => category.level === 2 && category.parent_id === selectedRootCategoryId)
			.sort((a, b) => a.category_name.localeCompare(b.category_name));
	});
	let leafCategories = $derived.by(() => {
		if (!selectedParentCategoryId) {
			return [] as EditableCategory[];
		}
		return editableCategories
			.filter((category) => category.level === 3 && category.parent_id === selectedParentCategoryId)
			.sort((a, b) => a.category_name.localeCompare(b.category_name));
	});
	let selectedLeafCategories = $derived.by(() =>
		selectedTagIds
			.map((tagId) => categoryById.get(tagId))
			.filter((category): category is EditableCategory => Boolean(category))
			.sort((a, b) => a.category_name.localeCompare(b.category_name))
	);
	let selectedParentCategoryName = $derived(
		selectedParentCategoryId
			? (categoryById.get(selectedParentCategoryId)?.category_name ?? '')
			: ''
	);

	// Reset optimistic state BEFORE DOM updates when server confirms user has answered
	$effect.pre(() => {
		if (data.flags?.userHasAnswered) {
			optimisticComments = [];
			optimisticUserHasAnswered = false;
		}
	});

	$effect(() => {
		if (!editableCategories.length) {
			selectedTagIds = [];
			selectedRootCategoryId = null;
			selectedParentCategoryId = null;
			serverTagSignature = '';
			return;
		}

		const serverTagIds = (data.questionTags || [])
			.map((tag: any) => Number.parseInt(String(tag.tag_id), 10))
			.filter((id) => Number.isFinite(id))
			.sort((a, b) => a - b);
		const signature = serverTagIds.join(',');

		if (signature === serverTagSignature) {
			return;
		}

		serverTagSignature = signature;
		selectedTagIds = serverTagIds;
		categoryEditorError = '';
		categoryEditorSuccess = '';

		const firstSelectedLeaf = serverTagIds
			.map((tagId) => categoryById.get(tagId))
			.find((category): category is EditableCategory => Boolean(category) && category.level === 3);

		if (firstSelectedLeaf?.parent_id) {
			selectedParentCategoryId = firstSelectedLeaf.parent_id;
			const parentCategory = categoryById.get(firstSelectedLeaf.parent_id);
			selectedRootCategoryId = parentCategory?.parent_id ?? null;
		}
	});

	$effect(() => {
		if (!rootCategories.length) {
			selectedRootCategoryId = null;
			selectedParentCategoryId = null;
			return;
		}

		const rootIsValid = selectedRootCategoryId
			? rootCategories.some((category) => category.id === selectedRootCategoryId)
			: false;
		if (!rootIsValid) {
			selectedRootCategoryId = rootCategories[0].id;
		}
	});

	$effect(() => {
		if (!selectedRootCategoryId) {
			selectedParentCategoryId = null;
			return;
		}

		if (!parentCategories.length) {
			selectedParentCategoryId = null;
			return;
		}

		const parentIsValid = selectedParentCategoryId
			? parentCategories.some((category) => category.id === selectedParentCategoryId)
			: false;
		if (!parentIsValid) {
			const selectedTagParent = selectedLeafCategories
				.map((leaf) => leaf.parent_id)
				.find(
					(parentId): parentId is number =>
						typeof parentId === 'number' &&
						parentCategories.some((category) => category.id === parentId)
				);
			selectedParentCategoryId = selectedTagParent ?? parentCategories[0].id;
		}
	});

	// Merge optimistic and server comments, deduplicating by ID
	let mergedComments = $derived.by(() => {
		const serverComments = data.comments || [];
		if (optimisticComments.length === 0) return serverComments;

		// If server already has the data, prefer server version (has profile info etc.)
		const serverIds = new Set(serverComments.map((c: Comment) => c.id));
		const uniqueOptimistic = optimisticComments.filter((c) => c.id && !serverIds.has(c.id));
		return [...uniqueOptimistic, ...serverComments];
	});

	// Create reactive data object for child components with proper QuestionPageData structure
	let dataForChild = $derived<QuestionPageData>({
		question: data.question,
		removedComments: data.removedComments,
		removed_comment_count: data.removed_comment_count,
		comments: mergedComments,
		comment_count: Math.max(data.comment_count || 0, mergedComments.length),
		aiComments: data.aiComments,
		links: data.links,
		links_count: data.links_count ?? 0,
		flags: {
			userHasAnswered: data.flags?.userHasAnswered || optimisticUserHasAnswered,
			userSignedIn: data.flags?.userSignedIn || false
		},
		questionTags: data.questionTags,
		flagReasons: data.flagReasons || [],
		user: data.user
	});

	// QR Code settings
	let qrCodeUrl = $state('');
	const QR_OPTS = {
		errorCorrectionLevel: 'H' as const,
		type: 'image/png' as const,
		margin: 1,
		color: {
			dark: '',
			light: '#c1c0c036'
		}
	};

	// Responsive variables
	let innerWidth = $state(0);
	let title = $derived(computeTitle(data.question.question_formatted || data.question.question));

	// Compute SEO-friendly title
	function computeTitle(questionText: string): string {
		const fullTitle = `9takes | ${questionText}`;
		return fullTitle.length > 60 ? fullTitle.slice(0, 57) + '...' : fullTitle;
	}

	// Handle comment addition - uses optimistic update
	function addComment(newComment?: Comment) {
		const isFirstComment = !data.flags?.userHasAnswered && !optimisticUserHasAnswered;

		// Optimistic update - immediately add comment to UI
		if (newComment && typeof newComment === 'object' && 'id' in newComment) {
			optimisticComments = [newComment, ...optimisticComments];
		}
		// Always mark as answered so the gate opens immediately
		if (isFirstComment) {
			optimisticUserHasAnswered = true;
		}

		// Invalidate for first-time commenters to refresh permissions and load all comments
		if (isFirstComment) {
			invalidateAll();
		}
	}

	// Generate QR code on component mount
	onMount(() => {
		innerWidth = window.innerWidth;
		QRCode.toDataURL(`https://9takes.com/questions/${data.question.url}`, QR_OPTS)
			.then((url) => (qrCodeUrl = url))
			.catch((err) => console.error('QR Code generation failed:', err));
	});

	// SEO metadata (derived to stay reactive with data changes)
	let description = $derived(
		`🏛️ Give your take to the question: ${data.question?.question_formatted || data.question?.question}`
	);
	let url = $derived(`https://9takes.com/questions/${data.question.url}`);
	let imgUrl = $derived(
		data.question?.img_url
			? `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/questions/${data.question.img_url}`
			: `https://9takes.com/blogs/looking-at-questions.webp`
	);

	// Prepare JSON-LD for structured data (derived for reactivity)
	let formattedAIComments = $derived(
		data?.aiComments?.map((comment: any) => {
			return {
				'@type': 'Answer',
				text: comment.comment,
				dateCreated: comment.created_at,
				upvoteCount: 0,
				author: {
					'@type': 'Person',
					name: `Enneagram Type ${comment.enneagram}`,
					identifier: `enneagram-type-${comment.enneagram}`
				}
			};
		})
	);

	// Format regular user comments as answers (fallback when no AI comments)
	let formattedUserComments = $derived(
		data?.comments?.slice(0, 5).map((comment: any) => {
			return {
				'@type': 'Answer',
				text: comment.comment,
				dateCreated: comment.created_at,
				upvoteCount: comment.likes || 0,
				author: {
					'@type': 'Person',
					name: comment.enneagram ? `Enneagram Type ${comment.enneagram}` : 'Anonymous',
					identifier: comment.author_id || 'anonymous'
				}
			};
		})
	);

	// Use AI comments first, then user comments as fallback
	let suggestedAnswers = $derived(
		formattedAIComments?.length > 0
			? formattedAIComments
			: formattedUserComments?.length > 0
				? formattedUserComments
				: undefined
	);

	let questionJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'QAPage',
			url: url,
			name: title,
			description: description,
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
						name: data.question.question_formatted || data.question.question,
						item: url
					}
				]
			},
			mainEntity: {
				'@type': 'Question',
				name: data.question.question_formatted || data.question.question,
				text: data.question.context || data.question.question_formatted || data.question.question,
				answerCount: data.question.comment_count || 0,
				dateCreated: data.question.created_at,
				author: data.question.author_id
					? {
							'@type': 'Person',
							identifier: data.question.author_id
						}
					: undefined,
				...(suggestedAnswers && { suggestedAnswer: suggestedAnswers })
			}
		})
	);

	function selectRootCategory(rootId: number) {
		selectedRootCategoryId = rootId;
		categoryEditorError = '';
		categoryEditorSuccess = '';
	}

	function selectParentCategory(parentId: number) {
		selectedParentCategoryId = parentId;
		categoryEditorError = '';
		categoryEditorSuccess = '';
	}

	function toggleLeafCategory(categoryId: number) {
		categoryEditorError = '';
		categoryEditorSuccess = '';

		if (selectedTagIds.includes(categoryId)) {
			selectedTagIds = selectedTagIds.filter((tagId) => tagId !== categoryId);
			return;
		}

		if (selectedTagIds.length >= maxCategoriesPerQuestion) {
			categoryEditorError = `You can select up to ${maxCategoriesPerQuestion} categories per question.`;
			return;
		}

		selectedTagIds = [...selectedTagIds, categoryId];
	}

	function resetCategoryEditor() {
		const serverTagIds = (data.questionTags || [])
			.map((tag: any) => Number.parseInt(String(tag.tag_id), 10))
			.filter((id) => Number.isFinite(id))
			.sort((a, b) => a - b);
		selectedTagIds = serverTagIds;
		categoryEditorError = '';
		categoryEditorSuccess = '';
	}

	async function saveQuestionCategories() {
		categoryEditorError = '';
		categoryEditorSuccess = '';

		if (!selectedTagIds.length) {
			categoryEditorError = 'Select at least one category before saving.';
			return;
		}

		if (selectedTagIds.length > maxCategoriesPerQuestion) {
			categoryEditorError = `You can select up to ${maxCategoriesPerQuestion} categories per question.`;
			return;
		}

		categoryEditorSaving = true;
		const body = new FormData();
		body.append('questionId', String(data.question.id));
		body.append('tagIds', JSON.stringify(selectedTagIds));

		try {
			const response = await fetch('?/updateCategories', { method: 'POST', body });
			if (!response.ok) {
				throw new Error('Failed to update categories');
			}

			const result = deserialize(await response.text()) as any;
			if (result?.type !== 'success' || !result?.data?.success) {
				throw new Error(result?.data?.message || 'Failed to update categories');
			}

			categoryEditorOpen = false;
			categoryEditorSuccess = 'Categories updated.';
			await invalidateAll();
		} catch (err) {
			categoryEditorError = err instanceof Error ? err.message : 'Failed to update categories';
		} finally {
			categoryEditorSaving = false;
		}
	}

	async function createLeafCategory() {
		categoryEditorError = '';
		categoryEditorSuccess = '';

		if (!selectedParentCategoryId) {
			categoryEditorError = 'Choose a level 2 parent before creating a leaf category.';
			return;
		}

		const normalizedName = newLeafCategoryName.trim().replace(/\s+/g, ' ');
		if (!normalizedName) {
			categoryEditorError = 'Enter a category name.';
			return;
		}

		creatingLeafCategory = true;
		const body = new FormData();
		body.append('questionId', String(data.question.id));
		body.append('parentId', String(selectedParentCategoryId));
		body.append('categoryName', normalizedName);

		try {
			const response = await fetch('?/createLeafCategory', { method: 'POST', body });
			if (!response.ok) {
				throw new Error('Failed to create category');
			}

			const result = deserialize(await response.text()) as any;
			if (result?.type !== 'success' || !result?.data?.success) {
				throw new Error(result?.data?.message || 'Failed to create category');
			}

			newLeafCategoryName = '';
			categoryEditorSuccess = result?.data?.created
				? 'New leaf category created.'
				: 'Category already exists under this parent.';
			await invalidateAll();
		} catch (err) {
			categoryEditorError = err instanceof Error ? err.message : 'Failed to create category';
		} finally {
			creatingLeafCategory = false;
		}
	}
</script>

<svelte:window bind:innerWidth />

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href={url} />
	<meta name="description" content={description} />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imgUrl} />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:image" content={imgUrl} />
	{@html `<script type="application/ld+json">${questionJsonLd}</script>`}
</svelte:head>

<div class="question-page-container mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
	<article itemscope itemtype="https://schema.org/QAPage">
		<!-- Question Display -->
		<div class="mb-6">
			<QuestionDisplay question={data.question} />
		</div>

		<!-- Interaction Area -->
		<div class="mb-6">
			<Interact
				data={dataForChild}
				questionId={data.question.id}
				parentType={'question'}
				oncommentAdded={addComment}
				user={data?.user}
				{qrCodeUrl}
			/>
		</div>

		<!-- Tags -->
		{#if (data.questionTags && data.questionTags.length > 0) || data.canEditTags}
			<div class="mb-6 rounded-xl border border-purple-500/15 bg-[#1a1a2e]/40 p-4">
				<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
					<div class="text-sm font-semibold text-slate-100">Question Categories</div>
					{#if data.canEditTags}
						<button
							type="button"
							class="rounded-lg border border-purple-500/30 bg-[#12121a]/70 px-3 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:border-purple-400 hover:text-purple-200"
							on:click={() => {
								categoryEditorOpen = !categoryEditorOpen;
								if (!categoryEditorOpen) {
									resetCategoryEditor();
								}
							}}
						>
							{categoryEditorOpen ? 'Close Editor' : 'Edit Categories'}
						</button>
					{/if}
				</div>

				{#if data.questionTags && data.questionTags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each data.questionTags as tag}
							<a
								href={`/questions/categories/${tag.question_categories.category_name.split(' ').join('-')}`}
								class="inline-flex items-center rounded-lg border border-purple-500/20 bg-[#1a1a2e]/60 px-3 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-900/40 hover:text-purple-300 hover:shadow-[0_0_8px_rgba(124,58,237,0.2)]"
								rel="tag"
							>
								{tag.question_categories.category_name}
							</a>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-slate-400">No categories assigned yet.</p>
				{/if}

				{#if data.canEditTags && categoryEditorOpen}
					<div class="mt-4 border-t border-purple-500/15 pt-4">
						<div class="space-y-4">
							<div>
								<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
									Step 1: Choose top-level parent
								</p>
								<div class="flex flex-wrap gap-2">
									{#each rootCategories as category}
										<button
											type="button"
											on:click={() => selectRootCategory(category.id)}
											class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors {selectedRootCategoryId ===
											category.id
												? 'border-purple-500 bg-purple-900/40 text-purple-200'
												: 'border-slate-700 bg-[#12121a]/60 text-slate-300'}"
										>
											{category.category_name}
										</button>
									{/each}
								</div>
							</div>

							<div>
								<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
									Step 2: Choose second-level parent
								</p>
								{#if parentCategories.length}
									<div class="flex flex-wrap gap-2">
										{#each parentCategories as category}
											<button
												type="button"
												on:click={() => selectParentCategory(category.id)}
												class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors {selectedParentCategoryId ===
												category.id
													? 'border-purple-500 bg-purple-900/40 text-purple-200'
													: 'border-slate-700 bg-[#12121a]/60 text-slate-300'}"
											>
												{category.category_name}
											</button>
										{/each}
									</div>
								{:else}
									<p class="text-xs text-slate-400">
										No level 2 categories under this top-level parent.
									</p>
								{/if}
							</div>

							<div>
								<div class="mb-2 flex items-center justify-between gap-3">
									<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
										Step 3: Pick leaf categories
									</p>
									<p class="text-xs text-slate-500">
										{selectedTagIds.length}/{maxCategoriesPerQuestion} selected
									</p>
								</div>

								{#if leafCategories.length}
									<div class="grid gap-2 sm:grid-cols-2">
										{#each leafCategories as category}
											<button
												type="button"
												on:click={() => toggleLeafCategory(category.id)}
												class="flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors {selectedTagIds.includes(
													category.id
												)
													? 'border-purple-500 bg-purple-900/30 text-purple-100'
													: 'border-slate-700 bg-[#12121a]/60 text-slate-300'}"
											>
												<span>{category.category_name}</span>
												<span class="text-xs">
													{selectedTagIds.includes(category.id) ? 'Selected' : 'Select'}
												</span>
											</button>
										{/each}
									</div>
								{:else}
									<p class="text-xs text-slate-400">
										No leaf categories available under this parent yet.
									</p>
								{/if}
							</div>

							<div>
								<p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
									Selected Categories
								</p>
								{#if selectedLeafCategories.length}
									<div class="flex flex-wrap gap-2">
										{#each selectedLeafCategories as category}
											<button
												type="button"
												on:click={() => toggleLeafCategory(category.id)}
												class="rounded-full border border-purple-500/40 bg-purple-900/30 px-3 py-1 text-xs text-purple-200"
												title="Remove category"
											>
												{category.category_name} ×
											</button>
										{/each}
									</div>
								{:else}
									<p class="text-xs text-slate-400">No categories selected yet.</p>
								{/if}
							</div>

							<div class="rounded-lg border border-purple-500/20 bg-[#12121a]/60 p-3">
								<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
									Create New Leaf Category
								</p>
								<p class="mt-1 text-xs text-slate-500">
									New categories are created as level 3 leaves under
									{selectedParentCategoryName || 'a selected level 2 parent'}.
								</p>
								<div class="mt-2 flex flex-col gap-2 sm:flex-row">
									<input
										type="text"
										bind:value={newLeafCategoryName}
										maxlength="60"
										placeholder="e.g. Career transitions"
										class="w-full rounded-lg border border-slate-700 bg-[#09090f]/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
									/>
									<button
										type="button"
										on:click={createLeafCategory}
										disabled={creatingLeafCategory ||
											!selectedParentCategoryId ||
											!newLeafCategoryName.trim()}
										class="rounded-lg border border-purple-500/40 bg-purple-900/40 px-3 py-2 text-sm font-medium text-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
									>
										{creatingLeafCategory ? 'Creating...' : 'Create Leaf'}
									</button>
								</div>
							</div>

							{#if categoryEditorError}
								<p class="text-sm text-rose-400">{categoryEditorError}</p>
							{/if}
							{#if categoryEditorSuccess}
								<p class="text-sm text-emerald-400">{categoryEditorSuccess}</p>
							{/if}

							<div class="flex flex-wrap justify-end gap-2">
								<button
									type="button"
									on:click={() => {
										resetCategoryEditor();
										categoryEditorOpen = false;
									}}
									class="rounded-lg border border-slate-700 bg-[#12121a]/60 px-3 py-2 text-sm text-slate-300"
								>
									Cancel
								</button>
								<button
									type="button"
									on:click={saveQuestionCategories}
									disabled={categoryEditorSaving}
									class="rounded-lg border border-purple-500/40 bg-purple-900/40 px-4 py-2 text-sm font-semibold text-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{categoryEditorSaving ? 'Saving...' : 'Save Categories'}
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Question Content -->
		{#if dataForChild}
			<QuestionContent data={dataForChild} user={data?.user} oncommentAdded={() => addComment()} />
		{/if}
	</article>
</div>

<style>
	.question-page-container {
		position: relative;
	}

	/* Gradient transition zone: ethereal particle space fades into content area */
	.question-page-container::before {
		content: '';
		position: absolute;
		top: -4rem;
		left: -2rem;
		right: -2rem;
		height: 12rem;
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(124, 58, 237, 0.03) 30%,
			rgba(26, 26, 46, 0.15) 70%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 0;
		filter: blur(20px);
	}
</style>
