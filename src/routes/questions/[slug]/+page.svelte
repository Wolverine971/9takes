<!-- src/routes/questions/[slug]/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import type { PageData } from './$types';
	import type { QuestionPageData, Comment } from '$lib/types/questions';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';

	let { data }: { data: PageData } = $props();

	// Local state for optimistic updates
	let optimisticComments = $state<Comment[]>([]);
	let optimisticUserHasAnswered = $state(false);

	// Reset optimistic state BEFORE DOM updates when server confirms user has answered
	$effect.pre(() => {
		if (data.flags?.userHasAnswered) {
			optimisticComments = [];
			optimisticUserHasAnswered = false;
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
		comment_count: Math.max((data.comment_count || 0), mergedComments.length),
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
		{#if data.questionTags && data.questionTags.length > 0}
			<div class="mb-6">
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
