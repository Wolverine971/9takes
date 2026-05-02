<!-- src/routes/questions/[slug]/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import Breadcrumbs from '$lib/components/blog/Breadcrumbs.svelte';
	import { buildQuestionCategoryPath } from '$lib/utils/questionCategorySlug';
	import { buildBreadcrumbSchemaForGraph, type BreadcrumbItem } from '$lib/utils/schema';
	import type { PageData } from './$types';
	import type { QuestionPageData, Comment, QuestionTag } from '$lib/types/questions';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import {
		isQuestionSocialCardV1,
		toQuestionPublicImageUrl,
		toQuestionSocialCardRoute
	} from '$lib/socialCards/questionSocialCard';

	let { data }: { data: PageData } = $props();

	type EditableCategory = {
		id: number;
		category_name: string;
		slug?: string | null;
		parent_id: number | null;
		level: number | null;
	};

	const DEFAULT_MAX_CATEGORIES_PER_QUESTION = 3;
	const MAX_META_DESCRIPTION_LENGTH = 160;
	const MAX_CONTEXT_PREVIEW_LENGTH = 320;

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

		const serverTagIds = getServerTagIds((data.questionTags || []) as QuestionTagRef[]);
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
			.find(
				(category): category is EditableCategory => category !== undefined && category.level === 3
			);

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
			dark: '#2DD4BF',
			light: '#0C0A09'
		}
	};

	// Responsive variables
	let innerWidth = $state(0);
	let formattedQuestionText = $derived(
		normalizeText(data.question.question_formatted || data.question.question)
	);
	let hasUserProvidedContext = $derived(hasUserProvidedQuestionContext(data.question.data));
	let questionContext = $derived(
		hasUserProvidedContext
			? truncateText(normalizeText(data.question.context), MAX_CONTEXT_PREVIEW_LENGTH)
			: ''
	);
	let categoryNames = $derived.by(() =>
		(data.questionTags || [])
			.map((tag: QuestionTag) => normalizeText(tag?.question_categories?.category_name))
			.filter(Boolean)
	);
	let categorySummary = $derived(categoryNames.length ? joinHumanList(categoryNames) : '');
	let deepestCategory = $derived.by(() => {
		const tags = (data.questionTags || []) as QuestionTag[];
		let best: QuestionTag['question_categories'] | null = null;
		for (const tag of tags) {
			const candidate = tag?.question_categories;
			if (!candidate?.category_name) continue;
			const candidateLevel = Number(candidate.level ?? 0);
			const bestLevel = Number(best?.level ?? -1);
			if (candidateLevel > bestLevel) {
				best = candidate;
			}
		}
		return best;
	});
	let categoryBreadcrumbItems = $derived.by(() => {
		const items: BreadcrumbItem[] = [
			{ name: 'Home', url: 'https://9takes.com' },
			{ name: 'Questions', url: 'https://9takes.com/questions' }
		];
		if (deepestCategory?.category_name) {
			items.push({
				name: 'Categories',
				url: 'https://9takes.com/questions/categories'
			});
			items.push({
				name: deepestCategory.category_name,
				url: `https://9takes.com${buildQuestionCategoryPath(
					deepestCategory.slug || deepestCategory.category_name
				)}`
			});
		}
		items.push({ name: formattedQuestionText, url });
		return items;
	});
	let publicQuestionOverview = $derived.by(() => {
		const parts = ['Compare perspectives on this question on 9takes.'];

		if (data.comment_count > 0) {
			parts.push(
				`${data.comment_count} ${data.comment_count === 1 ? 'perspective has' : 'perspectives have'} already been shared.`
			);
		} else {
			parts.push('Be the first to add a perspective.');
		}

		if (categorySummary) {
			parts.push(`This discussion is grouped under ${categorySummary}.`);
		}

		parts.push(
			'Add your own take to unlock the full community discussion and compare how different Enneagram types respond.'
		);
		return parts.join(' ');
	});
	let title = $derived(buildSeoTitle(formattedQuestionText));

	function normalizeText(value?: string | null): string {
		return String(value ?? '')
			.replace(/\s+/g, ' ')
			.trim();
	}

	function hasUserProvidedQuestionContext(value: unknown): boolean {
		return Boolean(
			value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				(value as Record<string, unknown>).userProvidedContext === true
		);
	}

	function truncateText(value: string, maxLength: number): string {
		if (value.length <= maxLength) return value;
		return `${value.slice(0, maxLength - 1).trimEnd()}…`;
	}

	function joinHumanList(items: string[]): string {
		if (items.length <= 1) return items[0] ?? '';
		if (items.length === 2) return `${items[0]} and ${items[1]}`;
		return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
	}

	function buildSeoTitle(questionText: string): string {
		const suffix = ' | 9takes';
		const maxLength = 60;
		if (!questionText) return `Questions${suffix}`;
		if (questionText.length + suffix.length <= maxLength) {
			return `${questionText}${suffix}`;
		}
		return `${questionText.slice(0, maxLength - suffix.length - 1).trimEnd()}…${suffix}`;
	}

	function buildSeoDescription(
		questionText: string,
		context: string,
		categories: string[],
		commentCount: number
	): string {
		const parts = [`Explore perspectives on "${questionText}" on 9takes.`];
		if (categories.length) {
			parts.push(`Topics: ${joinHumanList(categories)}.`);
		}
		if (context) {
			parts.push(context);
		}
		parts.push(
			commentCount > 0
				? `${commentCount} ${commentCount === 1 ? 'perspective' : 'perspectives'} so far.`
				: 'Join the discussion.'
		);
		return truncateText(parts.join(' '), MAX_META_DESCRIPTION_LENGTH);
	}

	type QuestionTagRef = {
		tag_id: number | string;
	};

	function getServerTagIds(questionTags: QuestionTagRef[] = []): number[] {
		return questionTags
			.map((tag) => Number.parseInt(String(tag.tag_id), 10))
			.filter((id): id is number => Number.isFinite(id))
			.sort((a, b) => a - b);
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
		buildSeoDescription(
			formattedQuestionText,
			questionContext,
			categoryNames,
			data.comment_count || 0
		)
	);
	let url = $derived(`https://9takes.com/questions/${data.question.url}`);
	let imgUrl = $derived.by(() => {
		if (
			data.question?.img_url &&
			isQuestionSocialCardV1(data.question.img_url) &&
			PUBLIC_SUPABASE_URL
		) {
			return toQuestionPublicImageUrl(PUBLIC_SUPABASE_URL, data.question.img_url);
		}
		if (data.question?.url) {
			return toQuestionSocialCardRoute(data.question.url);
		}
		return 'https://9takes.com/questions-default.webp';
	});
	let twitterImageAlt = $derived(
		`Question on 9takes: ${data.question?.question_formatted || data.question?.question || 'Share your perspective'}`
	);
	let questionStructuredData = $derived.by(() => ({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${url}#webpage`,
				name: formattedQuestionText,
				description,
				url,
				inLanguage: 'en-US',
				isPartOf: {
					'@type': 'WebSite',
					name: '9takes',
					url: 'https://9takes.com'
				},
				breadcrumb: {
					'@id': `${url}#breadcrumb`
				},
				primaryImageOfPage: {
					'@type': 'ImageObject',
					url: imgUrl
				}
			},
			{
				'@id': `${url}#breadcrumb`,
				...buildBreadcrumbSchemaForGraph(categoryBreadcrumbItems)
			}
		]
	}));

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
		const serverTagIds = getServerTagIds((data.questionTags || []) as QuestionTagRef[]);
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

<SEOHead
	{title}
	{description}
	canonical={url}
	twitterCardType="summary_large_image"
	ogImage={imgUrl}
	twitterImage={imgUrl}
	{twitterImageAlt}
	jsonLd={questionStructuredData}
/>

<div class="question-page-container mx-auto w-full max-w-6xl px-1 pb-12 sm:px-6 lg:px-8">
	<article class="question-article">
		{#if categoryBreadcrumbItems.length > 1}
			<div class="question-breadcrumbs">
				<Breadcrumbs items={categoryBreadcrumbItems} />
			</div>
		{/if}

		<div class="question-section question-section-display">
			<QuestionDisplay question={data.question} />
		</div>

		<section
			class="question-section question-overview-panel"
			aria-labelledby="question-overview-heading"
		>
			<div class="question-overview-copy">
				<p class="question-overview-kicker">Open forum question</p>
				<h2 id="question-overview-heading" class="question-overview-title">
					What this discussion explores
				</h2>
				<p class="question-overview-lead">{publicQuestionOverview}</p>
				{#if questionContext}
					<div class="question-overview-context">
						<h3 class="question-overview-context__title">User-added context</h3>
						<p class="question-overview-context__body">{questionContext}</p>
					</div>
				{/if}
			</div>

			<div class="question-overview-stats" aria-label="Question summary">
				<div class="question-overview-stat">
					<span class="question-overview-stat__value">{data.comment_count || 0}</span>
					<span class="question-overview-stat__label">
						{data.comment_count === 1 ? 'Perspective' : 'Perspectives'}
					</span>
				</div>
				<div class="question-overview-stat">
					<span class="question-overview-stat__value">{categoryNames.length}</span>
					<span class="question-overview-stat__label">
						{categoryNames.length === 1 ? 'Category' : 'Categories'}
					</span>
				</div>
				<div class="question-overview-stat">
					<span class="question-overview-stat__value">{data.aiComments?.length || 0}</span>
					<span class="question-overview-stat__label">Preview Takes</span>
				</div>
			</div>
		</section>

		<div class="question-section question-section-interact">
			<Interact
				data={dataForChild}
				questionId={data.question.id}
				parentType={'question'}
				oncommentAdded={addComment}
				user={data?.user}
				{qrCodeUrl}
			/>
		</div>

		{#if (data.questionTags && data.questionTags.length > 0) || data.canEditTags}
			<section class="question-section question-tags-panel">
				<div class="question-tags-head">
					<div class="question-tags-title">Question Categories</div>
					{#if data.canEditTags}
						<button
							type="button"
							class="question-inline-button"
							onclick={() => {
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
								href={buildQuestionCategoryPath(
									tag.question_categories.slug || tag.question_categories.category_name
								)}
								class="question-tag-pill"
								rel="tag"
							>
								{tag.question_categories.category_name}
							</a>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-[var(--text-secondary)]">No categories assigned yet.</p>
				{/if}

				{#if data.canEditTags && categoryEditorOpen}
					<div class="category-editor">
						<div class="space-y-4">
							<div>
								<p
									class="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
								>
									Step 1: Choose top-level parent
								</p>
								<div class="flex flex-wrap gap-2">
									{#each rootCategories as category}
										<button
											type="button"
											onclick={() => selectRootCategory(category.id)}
											class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors {selectedRootCategoryId ===
											category.id
												? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary-light)]'
												: 'bg-[var(--bg-deep)]/60 border-[var(--bg-elevated)] text-[var(--text-secondary)]'}"
										>
											{category.category_name}
										</button>
									{/each}
								</div>
							</div>

							<div>
								<p
									class="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
								>
									Step 2: Choose second-level parent
								</p>
								{#if parentCategories.length}
									<div class="flex flex-wrap gap-2">
										{#each parentCategories as category}
											<button
												type="button"
												onclick={() => selectParentCategory(category.id)}
												class="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors {selectedParentCategoryId ===
												category.id
													? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary-light)]'
													: 'bg-[var(--bg-deep)]/60 border-[var(--bg-elevated)] text-[var(--text-secondary)]'}"
											>
												{category.category_name}
											</button>
										{/each}
									</div>
								{:else}
									<p class="text-xs text-[var(--text-secondary)]">
										No level 2 categories under this top-level parent.
									</p>
								{/if}
							</div>

							<div>
								<div class="mb-2 flex items-center justify-between gap-3">
									<p
										class="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
									>
										Step 3: Pick leaf categories
									</p>
									<p class="text-xs text-[var(--text-tertiary)]">
										{selectedTagIds.length}/{maxCategoriesPerQuestion} selected
									</p>
								</div>

								{#if leafCategories.length}
									<div class="grid gap-2 sm:grid-cols-2">
										{#each leafCategories as category}
											<button
												type="button"
												onclick={() => toggleLeafCategory(category.id)}
												class="flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors {selectedTagIds.includes(
													category.id
												)
													? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary-lightest)]'
													: 'bg-[var(--bg-deep)]/60 border-[var(--bg-elevated)] text-[var(--text-secondary)]'}"
											>
												<span>{category.category_name}</span>
												<span class="text-xs">
													{selectedTagIds.includes(category.id) ? 'Selected' : 'Select'}
												</span>
											</button>
										{/each}
									</div>
								{:else}
									<p class="text-xs text-[var(--text-secondary)]">
										No leaf categories available under this parent yet.
									</p>
								{/if}
							</div>

							<div>
								<p
									class="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
								>
									Selected Categories
								</p>
								{#if selectedLeafCategories.length}
									<div class="flex flex-wrap gap-2">
										{#each selectedLeafCategories as category}
											<button
												type="button"
												onclick={() => toggleLeafCategory(category.id)}
												class="rounded-full border border-[var(--primary-subtle)] bg-[var(--primary-subtle)] px-3 py-1 text-xs text-[var(--primary-light)]"
												title="Remove category"
											>
												{category.category_name} ×
											</button>
										{/each}
									</div>
								{:else}
									<p class="text-xs text-[var(--text-secondary)]">No categories selected yet.</p>
								{/if}
							</div>

							<div class="category-editor-creator">
								<p
									class="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
								>
									Create New Leaf Category
								</p>
								<p class="mt-1 text-xs text-[var(--text-tertiary)]">
									New categories are created as level 3 leaves under
									{selectedParentCategoryName || 'a selected level 2 parent'}.
								</p>
								<div class="mt-2 flex flex-col gap-2 sm:flex-row">
									<input
										type="text"
										bind:value={newLeafCategoryName}
										maxlength="60"
										placeholder="e.g. Career transitions"
										class="bg-[var(--bg-base)]/80 w-full rounded-md border border-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
									/>
									<button
										type="button"
										onclick={createLeafCategory}
										disabled={creatingLeafCategory ||
											!selectedParentCategoryId ||
											!newLeafCategoryName.trim()}
										class="rounded-md border border-[var(--primary-subtle)] bg-[var(--primary-subtle)] px-3 py-2 text-sm font-medium text-[var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
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
									onclick={() => {
										resetCategoryEditor();
										categoryEditorOpen = false;
									}}
									class="bg-[var(--bg-deep)]/60 rounded-md border border-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-secondary)]"
								>
									Cancel
								</button>
								<button
									type="button"
									onclick={saveQuestionCategories}
									disabled={categoryEditorSaving}
									class="rounded-md border border-[var(--primary-subtle)] bg-[var(--primary-subtle)] px-4 py-2 text-sm font-semibold text-[var(--primary-lightest)] disabled:cursor-not-allowed disabled:opacity-60"
								>
									{categoryEditorSaving ? 'Saving...' : 'Save Categories'}
								</button>
							</div>
						</div>
					</div>
				{/if}
			</section>
		{/if}

		{#if dataForChild}
			<div class="question-section question-section-content">
				<QuestionContent
					data={dataForChild}
					user={data?.user}
					oncommentAdded={() => addComment()}
				/>
			</div>
		{/if}
	</article>
</div>

<style>
	.question-page-container {
		--question-panel-bg: color-mix(in srgb, var(--bg-surface) 92%, transparent);
		--question-panel-border: color-mix(in srgb, var(--primary) 18%, var(--border-color));
		position: relative;
		overflow-x: hidden;
		padding-top: 0.9rem;
	}

	.question-page-container::before {
		content: '';
		position: absolute;
		top: -2rem;
		left: -1rem;
		right: -1rem;
		height: 8rem;
		background: linear-gradient(
			180deg,
			transparent 0%,
			color-mix(in srgb, var(--primary-subtle) 55%, transparent) 34%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 0;
		filter: blur(18px);
	}

	.question-article {
		position: relative;
		z-index: 1;
	}

	.question-breadcrumbs {
		padding: 0.25rem 0.25rem 0.5rem;
	}

	.question-section {
		margin-bottom: 0.95rem;
	}

	.question-section-display :global(.question-display-card) {
		border-radius: 1.25rem;
		border-color: var(--question-panel-border);
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary-subtle) 28%, transparent) 0%,
				transparent 44%
			),
			var(--question-panel-bg);
		box-shadow: var(--shadow-sm);
		padding: 1.5rem clamp(1rem, 2.4vw, 2rem);
	}

	.question-section-display :global(.question-display-card::before) {
		background: radial-gradient(
			ellipse at 50% 0%,
			color-mix(in srgb, var(--primary) 12%, transparent) 0%,
			transparent 62%
		);
	}

	.question-section-display :global(.question-display-card h1) {
		letter-spacing: -0.025em;
		text-wrap: balance;
	}

	.question-section-interact {
		margin-bottom: 1rem;
	}

	.question-overview-panel {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--question-panel-border);
		border-radius: 1.1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary-subtle) 24%, transparent) 0%,
				transparent 100%
			),
			var(--question-panel-bg);
		box-shadow: var(--shadow-sm);
	}

	.question-overview-kicker {
		margin: 0 0 0.3rem;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--primary);
	}

	.question-overview-title {
		margin: 0;
		font-size: clamp(1.1rem, 1.6vw, 1.35rem);
		font-weight: 700;
		color: var(--text-primary);
	}

	.question-overview-lead {
		margin: 0.7rem 0 0;
		font-size: 0.98rem;
		line-height: 1.7;
		color: var(--text-secondary);
	}

	.question-overview-context {
		margin-top: 0.95rem;
		padding: 0.9rem 1rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		border-radius: 1rem;
		background: color-mix(in srgb, var(--bg-surface) 86%, transparent);
	}

	.question-overview-context__title {
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.question-overview-context__body {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--text-primary);
	}

	.question-overview-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.question-overview-stat {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0.9rem 1rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		border-radius: 1rem;
		background: color-mix(in srgb, var(--bg-surface) 88%, transparent);
	}

	.question-overview-stat__value {
		font-size: 1.4rem;
		font-weight: 700;
		line-height: 1;
		color: var(--text-primary);
	}

	.question-overview-stat__label {
		margin-top: 0.35rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.question-tags-panel {
		padding: 0.95rem;
		border: 1px solid var(--question-panel-border);
		border-radius: 1.1rem;
		background: var(--question-panel-bg);
		box-shadow: var(--shadow-sm);
		backdrop-filter: blur(12px);
	}

	.question-tags-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.8rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid var(--question-panel-border);
	}

	.question-tags-title {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.question-inline-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55rem 0.85rem;
		border-radius: 0.85rem;
		border: 1px solid var(--question-panel-border);
		background: color-mix(in srgb, var(--bg-deep) 68%, transparent);
		color: var(--primary);
		font-size: 0.8rem;
		font-weight: 700;
		transition:
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.question-inline-button:hover {
		border-color: color-mix(in srgb, var(--primary) 28%, var(--border-color));
		color: var(--primary-light);
		box-shadow: var(--shadow-sm);
	}

	.question-tag-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.55rem 0.85rem;
		border-radius: 0.85rem;
		border: 1px solid var(--question-panel-border);
		background: color-mix(in srgb, var(--bg-surface) 90%, transparent);
		color: var(--text-secondary);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.question-tag-pill:hover {
		border-color: color-mix(in srgb, var(--primary) 28%, var(--border-color));
		color: var(--primary);
		box-shadow: var(--shadow-sm);
	}

	.category-editor {
		padding-top: 1rem;
		border-top: 1px solid var(--question-panel-border);
	}

	.category-editor-creator {
		padding: 0.95rem;
		border-radius: 1rem;
		border: 1px solid var(--question-panel-border);
		background: color-mix(in srgb, var(--bg-deep) 62%, transparent);
	}

	@media (max-width: 640px) {
		.question-page-container {
			padding-top: 0.7rem;
		}

		.question-section {
			margin-bottom: 0.8rem;
		}

		.question-section-display :global(.question-display-card) {
			padding: 1.25rem 0.95rem;
			border-radius: 1.05rem;
		}

		.question-tags-panel {
			padding: 0.85rem;
		}

		.question-overview-panel {
			padding: 0.9rem;
		}

		.question-overview-stats {
			grid-template-columns: 1fr;
		}
	}
</style>
