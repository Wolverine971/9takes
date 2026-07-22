<!-- src/routes/questions/[slug]/+page.svelte -->
<!--
  /questions/[slug] — Streetlamp Symposium V5.
  Phase 5 page #4 of docs/design/2026-05-04-rollout-plan.md.

  Restyle, don't rewrite: this page imports specialized components
  (QuestionDisplay, Interact, QuestionContent) that handle the give-first
  comment mechanic. We add V5 layout chrome — an "open case" header,
  V5 §NN sections, restyled scoped CSS — but keep all business logic,
  optimistic state, form actions, SEO/structured data, and the imported
  components untouched.

  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*) ship
  globally in src/scss/index.scss.
-->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import { Share2, X } from '@lucide/svelte';
	import QRCode from 'qrcode';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import Breadcrumbs from '$lib/components/blog/Breadcrumbs.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import { capture } from '$lib/analytics/posthog';
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
	let shareNudgeVisible = $state(false);
	let shareNudgeFeedback = $state('');
	let shareNudgeTimer: number | null = null;
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
			// Brand amber (--lamp-glow) on night-deep — was the retired teal.
			dark: '#F59E0B',
			light: '#0C0A09'
		}
	};

	// Responsive variables
	let innerWidth = $state(0);
	let formattedQuestionText = $derived(
		normalizeText(data.question.question_formatted || data.question.question)
	);
	let url = $derived(`https://9takes.com/questions/${data.question.url}`);
	let shareNudgeStorageKey = $derived(`9takes:share-nudge:${data.question.url}`);
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
	let displayQuestionTags = $derived.by(() =>
		[...((data.questionTags || []) as QuestionTag[])]
			.filter((tag) => normalizeText(tag?.question_categories?.category_name))
			.sort((a, b) => {
				const levelDelta =
					Number(b.question_categories?.level ?? 0) - Number(a.question_categories?.level ?? 0);
				if (levelDelta !== 0) return levelDelta;
				return normalizeText(a.question_categories?.category_name).localeCompare(
					normalizeText(b.question_categories?.category_name)
				);
			})
	);
	let primaryQuestionTag = $derived(displayQuestionTags[0] ?? null);
	let overflowQuestionTags = $derived(displayQuestionTags.slice(1));
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
	// Full breadcrumb chain (Home → Questions → … → Question) is kept for
	// JSON-LD / structured data so SEO stays intact.
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
	// Trimmed chain shown to readers — drops the redundant "Home" entry and the
	// trailing question title (the question card sits right below the crumbs).
	let displayBreadcrumbItems = $derived.by(() => {
		const items: BreadcrumbItem[] = [{ name: 'Questions', url: 'https://9takes.com/questions' }];
		if (deepestCategory?.category_name) {
			items.push({
				name: deepestCategory.category_name,
				url: `https://9takes.com${buildQuestionCategoryPath(
					deepestCategory.slug || deepestCategory.category_name
				)}`
			});
		}
		return items;
	});
	let title = $derived(buildSeoTitle(formattedQuestionText));

	// V5 case-file derivations
	let postedDate = $derived(formatPostedDate(data.question?.created_at));
	let totalTakes = $derived(Math.max(data.comment_count || 0, mergedComments.length));

	// Comments are gated until the user shares their own perspective (the
	// "give-first" mechanic). Mirror the same flag QuestionContent uses so the
	// meta badge tells the truth once comments are revealed.
	let commentsUnlocked = $derived(data.flags?.userHasAnswered || optimisticUserHasAnswered);

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
		// Long-tail SEO: preserve the full question wording so the exact-match
		// search query lands in <title>. We only truncate at a hard ceiling to
		// avoid pathologically long titles. Browser tab / SERP rendering will
		// still ellipsize visually, but the full phrase is in the markup.
		const suffix = ' | 9takes';
		const HARD_TITLE_CEILING = 200;
		if (!questionText) return `Questions${suffix}`;
		if (questionText.length + suffix.length <= HARD_TITLE_CEILING) {
			return `${questionText}${suffix}`;
		}
		return `${questionText.slice(0, HARD_TITLE_CEILING - suffix.length - 1).trimEnd()}…${suffix}`;
	}

	function formatPostedDate(value: string | null | undefined): string {
		if (!value) return '';
		const literal = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (literal) return `${literal[1]}-${literal[2]}-${literal[3]}`;
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return '';
		return parsed.toISOString().slice(0, 10);
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
			queueShareNudge('question-answer');
		}

		// Invalidate for first-time commenters to refresh permissions and load all comments
		if (isFirstComment) {
			invalidateAll();
		}
	}

	function shareNudgeSeen(): boolean {
		try {
			return window.sessionStorage.getItem(shareNudgeStorageKey) === 'seen';
		} catch {
			return false;
		}
	}

	function markShareNudgeSeen() {
		try {
			window.sessionStorage.setItem(shareNudgeStorageKey, 'seen');
		} catch {
			// Storage can be unavailable in privacy modes; dismissal still works in memory.
		}
	}

	function queueShareNudge(source: 'homepage-answer' | 'question-answer') {
		if (!window.matchMedia('(min-width: 900px)').matches || shareNudgeSeen()) return;
		if (shareNudgeTimer !== null) window.clearTimeout(shareNudgeTimer);

		shareNudgeTimer = window.setTimeout(() => {
			shareNudgeFeedback = '';
			shareNudgeVisible = true;
			shareNudgeTimer = null;
			void capture('question_share_nudge_shown', {
				question_url: data.question.url,
				source
			});
		}, 8000);
	}

	function dismissShareNudge(action: 'dismissed' | 'shared' = 'dismissed') {
		shareNudgeVisible = false;
		markShareNudgeSeen();
		void capture('question_share_nudge_closed', {
			question_url: data.question.url,
			action
		});
	}

	async function shareQuestionFromNudge() {
		const shareData = {
			title: 'A question from 9takes',
			text: `${formattedQuestionText}\n\nWhat’s your take?`,
			url
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
				void capture('question_shared_from_nudge', {
					question_url: data.question.url,
					method: 'native'
				});
				dismissShareNudge('shared');
				return;
			}

			await navigator.clipboard.writeText(url);
			shareNudgeFeedback = 'Link copied. Drop it in the group chat.';
			markShareNudgeSeen();
			void capture('question_shared_from_nudge', {
				question_url: data.question.url,
				method: 'clipboard'
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			shareNudgeFeedback = 'Could not open sharing. Copy the page URL from your browser.';
		}
	}

	// Generate QR code on component mount
	onMount(() => {
		innerWidth = window.innerWidth;
		QRCode.toDataURL(`https://9takes.com/questions/${data.question.url}`, QR_OPTS)
			.then((url) => (qrCodeUrl = url))
			.catch((err) => console.error('QR Code generation failed:', err));

		if (new URL(window.location.href).searchParams.get('from') === 'homepage-answer') {
			queueShareNudge('homepage-answer');
		}

		return () => {
			if (shareNudgeTimer !== null) window.clearTimeout(shareNudgeTimer);
		};
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
	// =====================================================================
	// Structured data
	// We emit DiscussionForumPosting (rather than WebPage) for the question
	// itself. 9takes is an anonymous opinion forum, not a public Q&A site —
	// `DiscussionForumPosting` matches Google's guidance for forum-style
	// pages where the post (question + context) is publicly visible.
	//
	// IMPORTANT — give-first guarantee:
	// We deliberately do NOT include nested `comment` items in the schema.
	// Real community comments are gated behind the give-first mechanic, and
	// the public AI preview is a "Sample perspectives" pattern preview,
	// NOT user discussion. Per Google's discussion-forum docs, schema
	// markup must reflect content that's visible on the page, and per the
	// 2026-04-07 audit guardrail: never put answer markup around gated
	// comments and never use AI-only summaries as a substitute for visible
	// public discussion.
	//
	// `commentCount` advertises forum activity without exposing private
	// content; users still have to participate to see the thread.
	// =====================================================================
	let datePublished = $derived(toIsoDate(data.question?.created_at));
	let dateModified = $derived(toIsoDate(data.question?.updated_at) || datePublished);
	let postBodyText = $derived(
		questionContext ? `${formattedQuestionText}\n\n${questionContext}` : formattedQuestionText
	);

	function toIsoDate(value: string | null | undefined): string {
		if (!value) return '';
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return '';
		return parsed.toISOString();
	}

	let discussionPostingNode = $derived.by(() => {
		const node: Record<string, unknown> = {
			'@type': 'DiscussionForumPosting',
			'@id': `${url}#post`,
			headline: formattedQuestionText,
			name: formattedQuestionText,
			text: postBodyText,
			url,
			mainEntityOfPage: { '@id': `${url}#webpage` },
			inLanguage: 'en-US',
			isPartOf: {
				'@type': 'WebSite',
				name: '9takes',
				url: 'https://9takes.com'
			},
			author: {
				'@type': 'Person',
				name: 'Anonymous 9takes member'
			},
			image: imgUrl,
			commentCount: Math.max(data.comment_count || 0, 0)
		};
		if (datePublished) node.datePublished = datePublished;
		if (dateModified) node.dateModified = dateModified;
		if (categoryNames.length) node.keywords = categoryNames.join(', ');
		return node;
	});

	let questionStructuredData = $derived.by(() => ({
		'@context': 'https://schema.org',
		'@graph': [
			discussionPostingNode,
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
				},
				mainEntity: { '@id': `${url}#post` }
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

<article class="question-page">
	<!-- =====================================================================
	  Question hero + thread — one continuous flow.
	  Question card → Comment/Subscribe/Share toolbar (Interact) → meta line →
	  optional user-added context → discussion thread (QuestionContent).
	  ===================================================================== -->
	<section class="open-case" aria-labelledby="open-case-question">
		<div class="open-case-pool" aria-hidden="true"></div>

		<div class="open-case-inner">
			{#if displayBreadcrumbItems.length}
				<div class="open-case-breadcrumbs">
					<Breadcrumbs items={displayBreadcrumbItems} />
				</div>
			{/if}

			{#if primaryQuestionTag}
				<div class="open-case-category mono">
					<span class="open-case-category__label">TOPIC:</span>
					<a
						href={buildQuestionCategoryPath(
							primaryQuestionTag.question_categories.slug ||
								primaryQuestionTag.question_categories.category_name
						)}
						class="open-case-category__link"
						rel="tag"
					>
						{primaryQuestionTag.question_categories.category_name.toUpperCase()}
					</a>
					{#if overflowQuestionTags.length}
						<details class="open-case-category-more">
							<summary
								class="open-case-category-more__summary"
								aria-label={`${overflowQuestionTags.length} more question ${
									overflowQuestionTags.length === 1 ? 'category' : 'categories'
								}`}
							>
								+{overflowQuestionTags.length}
							</summary>
							<div class="open-case-category-more__panel" aria-label="Additional categories">
								{#each overflowQuestionTags as tag, i (tag.tag_id ?? i)}
									<a
										href={buildQuestionCategoryPath(
											tag.question_categories.slug || tag.question_categories.category_name
										)}
										class="open-case-category-more__link"
										rel="tag"
									>
										{tag.question_categories.category_name}
									</a>
								{/each}
							</div>
						</details>
					{/if}
				</div>
			{/if}

			<div id="open-case-question" class="open-case-display">
				<QuestionDisplay question={data.question} />
			</div>

			<div class="open-case-interact">
				<Interact
					data={dataForChild}
					questionId={data.question.id}
					parentType={'question'}
					oncommentAdded={addComment}
					user={data?.user}
					{qrCodeUrl}
				/>
			</div>

			<div class="open-case-coords mono">
				{#if postedDate}POSTED: {postedDate}{/if}
				{#if postedDate}<span class="open-case-coord-sep">·</span>{/if}
				{totalTakes}
				{totalTakes === 1 ? 'TAKE' : 'TAKES'} SO FAR
				<span class="open-case-coord-sep">·</span>
				{commentsUnlocked ? 'COMMENTS UNLOCKED' : 'COMMENTS HIDDEN UNTIL YOU ANSWER'}
			</div>

			{#if questionContext}
				<aside class="open-case-context">
					<p class="mono open-case-context__label">USER-ADDED CONTEXT</p>
					<p class="open-case-context__body">{questionContext}</p>
				</aside>
			{/if}

			{#if dataForChild}
				<div class="open-case-floor">
					<QuestionContent
						data={dataForChild}
						user={data?.user}
						oncommentAdded={() => addComment()}
					/>
				</div>
			{/if}

			<!-- ===================================================================
			  Author-only category management. Non-authors already see the
			  categories at the top of the page, so we don't repeat them here.
			  =================================================================== -->
			{#if data.canEditTags}
				<aside class="open-case-categories" aria-label="Manage categories">
					<header class="open-case-categories__head">
						<SectionKicker label="CATEGORIES" />
						<Button
							variant="ghost"
							size="sm"
							onclick={() => {
								categoryEditorOpen = !categoryEditorOpen;
								if (!categoryEditorOpen) {
									resetCategoryEditor();
								}
							}}
						>
							{categoryEditorOpen ? 'Close editor' : 'Edit categories'}
						</Button>
					</header>

					{#if data.questionTags && data.questionTags.length > 0}
						<div class="open-case-categories__pills">
							{#each data.questionTags as tag}
								<a
									href={buildQuestionCategoryPath(
										tag.question_categories.slug || tag.question_categories.category_name
									)}
									class="open-case-categories__pill"
									rel="tag"
								>
									{tag.question_categories.category_name}
								</a>
							{/each}
						</div>
					{:else}
						<p class="open-case-categories__empty">No categories assigned yet.</p>
					{/if}

					{#if categoryEditorOpen}
						<div class="category-editor">
							<div class="category-editor-step">
								<p class="mono category-editor-step__label">STEP 1: TOP-LEVEL PARENT</p>
								<div class="chip-row">
									{#each rootCategories as category}
										<button
											type="button"
											onclick={() => selectRootCategory(category.id)}
											class="cat-chip"
											class:cat-chip--active={selectedRootCategoryId === category.id}
										>
											{category.category_name}
										</button>
									{/each}
								</div>
							</div>

							<div class="category-editor-step">
								<p class="mono category-editor-step__label">STEP 2: SECOND-LEVEL PARENT</p>
								{#if parentCategories.length}
									<div class="chip-row">
										{#each parentCategories as category}
											<button
												type="button"
												onclick={() => selectParentCategory(category.id)}
												class="cat-chip"
												class:cat-chip--active={selectedParentCategoryId === category.id}
											>
												{category.category_name}
											</button>
										{/each}
									</div>
								{:else}
									<p class="category-editor-empty">
										No level 2 categories under this top-level parent.
									</p>
								{/if}
							</div>

							<div class="category-editor-step">
								<div class="category-editor-step__head">
									<p class="mono category-editor-step__label">STEP 3: LEAF CATEGORIES</p>
									<p class="mono category-editor-step__count">
										{selectedTagIds.length}/{maxCategoriesPerQuestion} SELECTED
									</p>
								</div>

								{#if leafCategories.length}
									<div class="leaf-grid">
										{#each leafCategories as category}
											<button
												type="button"
												onclick={() => toggleLeafCategory(category.id)}
												class="leaf-tile"
												class:leaf-tile--active={selectedTagIds.includes(category.id)}
											>
												<span class="leaf-tile__name">{category.category_name}</span>
												<span class="mono leaf-tile__state">
													{selectedTagIds.includes(category.id) ? 'SELECTED' : 'SELECT'}
												</span>
											</button>
										{/each}
									</div>
								{:else}
									<p class="category-editor-empty">
										No leaf categories available under this parent yet.
									</p>
								{/if}
							</div>

							<div class="category-editor-step">
								<p class="mono category-editor-step__label">SELECTED CATEGORIES</p>
								{#if selectedLeafCategories.length}
									<div class="chip-row">
										{#each selectedLeafCategories as category}
											<button
												type="button"
												onclick={() => toggleLeafCategory(category.id)}
												class="cat-chip cat-chip--selected"
												title="Remove category"
											>
												{category.category_name} ×
											</button>
										{/each}
									</div>
								{:else}
									<p class="category-editor-empty">No categories selected yet.</p>
								{/if}
							</div>

							<div class="category-editor-creator">
								<p class="mono category-editor-step__label">CREATE NEW LEAF CATEGORY</p>
								<p class="category-editor-creator__hint">
									New categories are created as level 3 leaves under
									{selectedParentCategoryName || 'a selected level 2 parent'}.
								</p>
								<div class="category-editor-creator__row">
									<input
										type="text"
										bind:value={newLeafCategoryName}
										maxlength="60"
										placeholder="e.g. Career transitions"
										class="case-input"
									/>
									<Button
										variant="secondary"
										size="md"
										onclick={createLeafCategory}
										disabled={creatingLeafCategory ||
											!selectedParentCategoryId ||
											!newLeafCategoryName.trim()}
									>
										{creatingLeafCategory ? 'Creating…' : 'Create Leaf'}
									</Button>
								</div>
							</div>

							{#if categoryEditorError}
								<p class="category-editor-msg category-editor-msg--error" role="alert">
									{categoryEditorError}
								</p>
							{/if}
							{#if categoryEditorSuccess}
								<p class="category-editor-msg category-editor-msg--success" role="status">
									{categoryEditorSuccess}
								</p>
							{/if}

							<div class="category-editor-actions">
								<Button
									variant="secondary"
									size="md"
									onclick={() => {
										resetCategoryEditor();
										categoryEditorOpen = false;
									}}
								>
									Cancel
								</Button>
								<Button
									variant="primary"
									size="md"
									onclick={saveQuestionCategories}
									loading={categoryEditorSaving}
									disabled={categoryEditorSaving}
								>
									{categoryEditorSaving ? 'Saving…' : 'Save Categories'}
								</Button>
							</div>
						</div>
					{/if}
				</aside>
			{/if}
		</div>
	</section>

	{#if shareNudgeVisible}
		<aside
			class="share-nudge"
			aria-labelledby="share-nudge-title"
			aria-describedby="share-nudge-copy"
		>
			<button
				type="button"
				class="share-nudge__close"
				onclick={() => dismissShareNudge()}
				aria-label="Dismiss share suggestion"
			>
				<X size={17} aria-hidden="true" />
			</button>
			<span class="share-nudge__icon" aria-hidden="true">
				<Share2 size={20} />
			</span>
			<p class="share-nudge__kicker">A friend-to-friend test</p>
			<h2 id="share-nudge-title">Who would answer this differently?</h2>
			<p id="share-nudge-copy" class="share-nudge__copy">
				Drop this question in a group chat. Compare answers after everyone gives their own take.
			</p>
			<Button fullWidth size="md" onclick={shareQuestionFromNudge}>Share in a group chat</Button>
			{#if shareNudgeFeedback}
				<p class="share-nudge__feedback" role="status">{shareNudgeFeedback}</p>
			{/if}
		</aside>
	{/if}
</article>

<style lang="scss">
	/* =========================================================
	  /questions/[slug] — Streetlamp Symposium V5.
	  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*)
	  ship globally from src/scss/index.scss.
	  Restyle pass: layout chrome only. Imported components
	  (QuestionDisplay, Interact, QuestionContent) keep their own styles.
	  ========================================================= */
	.question-page {
		--cta-text: var(--night-deep);

		display: block;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-display);
		min-height: 100vh;
		position: relative;
	}

	:global(:root.light) .question-page {
		--cta-text: var(--ink-bright);
	}

	.share-nudge {
		position: fixed;
		right: max(1.5rem, env(safe-area-inset-right));
		bottom: max(1.5rem, env(safe-area-inset-bottom));
		z-index: 30;
		display: none;
		width: min(23rem, calc(100vw - 3rem));
		padding: 1.2rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 38%, var(--stone-edge));
		border-radius: 1rem;
		background: color-mix(in srgb, var(--stone-warm) 97%, var(--night-deep));
		box-shadow: var(--shadow-lg);
	}

	.share-nudge__close {
		position: absolute;
		top: 0.55rem;
		right: 0.55rem;
		display: grid;
		width: 2.75rem;
		height: 2.75rem;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 0.625rem;
		background: transparent;
		color: var(--ink-dim);
		cursor: pointer;
	}

	.share-nudge__close:hover {
		background: var(--stone-mid);
		color: var(--ink-bright);
	}

	:global(.question-page .share-nudge__close:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.share-nudge__icon {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		margin-bottom: 0.85rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 34%, var(--stone-edge));
		border-radius: 0.625rem;
		background: var(--lamp-soft);
		color: var(--lamp-glow);
	}

	.share-nudge__kicker {
		margin: 0;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.share-nudge h2 {
		max-width: 17rem;
		margin: 0.4rem 0 0;
		color: var(--ink-bright);
		font-size: 1.2rem;
		font-weight: 720;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.share-nudge__copy {
		margin: 0.65rem 0 1rem;
		color: var(--ink-mid);
		font-size: 0.84rem;
		line-height: 1.55;
	}

	.share-nudge__feedback {
		margin: 0.75rem 0 0;
		color: var(--success-text);
		font-size: 0.75rem;
		line-height: 1.45;
	}

	@media (min-width: 900px) {
		.share-nudge {
			display: block;
		}
	}

	@media (min-width: 900px) and (prefers-reduced-motion: no-preference) {
		.share-nudge {
			animation: share-nudge-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
		}
	}

	@keyframes share-nudge-enter {
		from {
			transform: translateY(10px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* .mono is a global utility in index.scss (promoted 2026-06-10). */

	/* =========================================================
	  Question hero + thread — one continuous flow.
	  ========================================================= */
	.open-case {
		position: relative;
		padding: 32px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;
		border-top: 3px solid var(--lamp-glow);

		@media (max-width: 768px) {
			padding: 20px 20px 48px;
		}
	}

	.open-case-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 70% 55% at 50% 0%,
			rgba(245, 158, 11, 0.12) 0%,
			rgba(245, 158, 11, 0.04) 35%,
			transparent 65%
		);
		z-index: 0;
	}

	:global(:root.light) .question-page .open-case-pool {
		background: radial-gradient(
			ellipse 70% 55% at 50% 0%,
			rgba(180, 83, 9, 0.08) 0%,
			rgba(180, 83, 9, 0.02) 40%,
			transparent 70%
		);
	}

	.open-case-inner {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.open-case-breadcrumbs {
		margin-bottom: 0;

		:global(.breadcrumbs) {
			margin-bottom: 0;
		}
	}

	.open-case-interact {
		margin: 4px 0 4px;
	}

	.open-case-floor {
		margin-top: 16px;
		padding-top: 24px;
		border-top: 1px solid var(--stone-edge);
	}

	.open-case-category {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		color: var(--data-teal);
		margin: 0;
		min-width: 0;
	}

	.open-case-category__label {
		flex: 0 0 auto;
		color: var(--ink-dim);
	}

	.open-case-category__link {
		flex: 1 1 0;
		min-width: 0;
		max-width: min(100%, 42rem);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--data-teal);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;

		&:hover {
			color: var(--lamp-glow);
			border-bottom-color: var(--lamp-glow);
		}
	}

	.open-case-category-more {
		position: relative;
		display: inline-flex;
		align-items: center;
		flex: 0 0 auto;
		padding: 0;
	}

	.open-case-category-more__summary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 1.55rem;
		padding: 0.15rem 0.55rem;
		border: 1px solid var(--stone-edge);
		border-radius: 9999px;
		background: var(--night-mid);
		color: var(--ink-mid);
		cursor: pointer;
		list-style: none;
		transition:
			border-color 0.15s ease,
			color 0.15s ease,
			background 0.15s ease;

		&::-webkit-details-marker {
			display: none;
		}

		&:hover {
			border-color: var(--lamp-glow);
			color: var(--lamp-glow);
			background: var(--stone-warm);
		}
	}

	:global(.open-case-category-more__summary:focus-visible) {
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
		background: var(--stone-warm);
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.open-case-category-more__panel {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;
		padding: 10px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-warm);
	}

	.open-case-category-more:not([open]) .open-case-category-more__panel {
		display: none;
	}

	.open-case-category-more__link {
		display: inline-flex;
		max-width: 100%;
		padding: 4px 8px;
		border: 1px solid var(--stone-edge);
		border-radius: 9999px;
		background: var(--night-mid);
		color: var(--ink-mid);
		text-decoration: none;
		white-space: nowrap;

		&:hover {
			border-color: var(--lamp-glow);
			color: var(--lamp-glow);
		}
	}

	.open-case-display {
		margin: 4px 0 4px;
	}

	.open-case-display :global(.question-display-card) {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		padding: 32px clamp(20px, 3vw, 40px);
		box-shadow: none;
		backdrop-filter: none;
	}

	.open-case-display :global(.question-display-card::before) {
		display: none;
	}

	.open-case-display :global(.question-display-card h1) {
		font-family: var(--font-display);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--ink-bright);
		text-wrap: balance;
		line-height: 1.08;
	}

	.open-case-coords {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		color: var(--ink-dim);
		margin: 0;
	}

	.open-case-coord-sep {
		opacity: 0.6;
	}

	.open-case-context {
		margin: 8px 0 0;
		padding: 16px 20px;
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--data-teal);
		border-radius: 10px;
		background: var(--stone-warm);
	}

	.open-case-context__label {
		margin: 0 0 6px;
		color: var(--data-teal);
	}

	.open-case-context__body {
		margin: 0;
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-bright);
	}

	/* =========================================================
	  Author-only category management — sits inside the open-case
	  flow so it shares the same background and feels like a tail
	  of the article rather than a fresh section.
	  ========================================================= */
	.open-case-categories {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 24px;
		padding: 20px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.open-case-categories__head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.open-case-categories__pills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.open-case-categories__pill {
		display: inline-flex;
		align-items: center;
		padding: 6px 12px;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		background: var(--night-mid);
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 500;
		text-decoration: none;
		transition:
			border-color 0.18s ease,
			color 0.18s ease,
			background 0.18s ease;

		&:hover {
			border-color: var(--lamp-glow);
			color: var(--lamp-glow);
		}
	}

	.open-case-categories__empty {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin: 0;
	}

	/* ---------- category editor inner ---------- */
	.category-editor {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 24px;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);

		@media (max-width: 540px) {
			padding: 18px;
		}
	}

	.category-editor-step {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.category-editor-empty {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin: 0;
	}

	.category-editor-step__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.category-editor-step__label {
		margin: 0;
		color: var(--lamp-glow);
	}

	.category-editor-step__count {
		margin: 0;
		color: var(--data-teal);
	}

	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.cat-chip {
		appearance: none;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 8px 14px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-mid);
		cursor: pointer;
		transition:
			border-color 0.18s ease,
			color 0.18s ease,
			background 0.18s ease;

		&:hover {
			border-color: var(--ink-dim);
			color: var(--ink-bright);
			background: var(--stone-mid);
		}
	}

	.cat-chip--active {
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
		background: var(--stone-warm);
	}

	.cat-chip--selected {
		border-color: var(--data-teal);
		color: var(--data-teal);
		background: var(--stone-warm);
	}

	.leaf-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;

		@media (max-width: 540px) {
			grid-template-columns: 1fr;
		}
	}

	.leaf-tile {
		appearance: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-bright);
		text-align: left;
		font-family: var(--font-display);
		font-size: 14px;
		cursor: pointer;
		transition:
			border-color 0.18s ease,
			background 0.18s ease;

		&:hover {
			border-color: var(--ink-dim);
			background: var(--stone-mid);
		}
	}

	.leaf-tile--active {
		border-color: var(--lamp-glow);
		background: var(--stone-warm);
	}

	.leaf-tile__name {
		font-weight: 500;
	}

	.leaf-tile__state {
		color: var(--ink-dim);
	}

	.leaf-tile--active .leaf-tile__state {
		color: var(--lamp-glow);
	}

	.category-editor-creator {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 18px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.category-editor-creator__hint {
		font-family: var(--font-display);
		font-size: 13px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin: 0;
	}

	.category-editor-creator__row {
		display: flex;
		flex-direction: row;
		gap: 8px;

		@media (max-width: 540px) {
			flex-direction: column;
			align-items: stretch;
		}
	}

	.case-input {
		flex: 1;
		appearance: none;
		font-family: var(--font-display);
		font-size: 14px;
		padding: 10px 14px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-deep);
		color: var(--ink-bright);
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease;

		&::placeholder {
			color: var(--ink-dim);
		}

		&:focus {
			outline: none;
			border-color: var(--lamp-glow);
			box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.18);
		}
	}

	:global(:root.light) .question-page .case-input:focus {
		box-shadow: 0 0 0 2px rgba(180, 83, 9, 0.18);
	}

	.category-editor-msg {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		margin: 0;
	}

	.category-editor-msg--error {
		color: var(--error-text);
	}

	.category-editor-msg--success {
		color: var(--success-text);
	}

	.category-editor-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--stone-edge);
	}

	/* =========================================================
	  Mobile-specific tightening
	  ========================================================= */
	@media (max-width: 480px) {
		.open-case {
			padding: 16px 16px 40px;
		}

		.open-case-categories {
			padding: 16px;
		}

		.open-case-display :global(.question-display-card) {
			padding: 24px 18px;
			border-radius: 1rem;
		}
	}
</style>
