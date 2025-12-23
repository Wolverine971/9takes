<!-- src/routes/questions/[slug]/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Create reactive data object for child components
	$: dataForChild = {
		...data.question,
		removedComments: data.removedComments,
		removed_comment_count: data.removed_comment_count,
		comments: data.comments,
		comment_count: data.comment_count,
		ai_comments: data.aiComments,
		links: data.links,
		links_count: data.links_count,
		flags: data.flags,
		flagReasons: data.flagReasons
	};

	// QR Code settings
	let qrCodeUrl = '';
	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '',
			light: '#c1c0c036'
		}
	};

	// Responsive variables
	let innerWidth = 0;
	$: qrCodeSize = innerWidth > 500 ? '10%' : '20%';
	$: title = computeTitle(data.question.question_formatted || data.question.question);

	// Compute SEO-friendly title
	function computeTitle(questionText: string): string {
		const fullTitle = `9takes | ${questionText}`;
		return fullTitle.length > 60 ? fullTitle.slice(0, 57) + '...' : fullTitle;
	}

	// Handle comment addition
	async function addComment() {
		await new Promise((resolve) => setTimeout(resolve, 500));
		try {
			const response = await fetch(`/comments?type=question&parentId=${data?.question?.id}`);
			const commentData = await response.json();

			if (!commentData?.message) {
				dataForChild = {
					...dataForChild,
					comments: commentData,
					comment_count: (dataForChild.comment_count || 0) + 1,
					flags: { ...dataForChild.flags, userHasAnswered: true }
				};
			}
			invalidateAll();
		} catch (error) {
			console.error('Error fetching comment data:', error);
		}
	}

	// Generate QR code on component mount
	onMount(() => {
		innerWidth = window.innerWidth;
		QRCode.toDataURL(`https://9takes.com/questions/${data.question.url}`, QR_OPTS)
			.then((url) => (qrCodeUrl = url))
			.catch((err) => console.error('QR Code generation failed:', err));
	});

	// SEO metadata
	const description = `🏛️ Give your take to the question: ${data.question?.question_formatted || data.question?.question}`;
	const url = `https://9takes.com/questions/${data.question.url}`;
	const imgUrl = data.question?.img_url
		? `https://9takes.s3.amazonaws.com/${data.question.img_url}`
		: `https://9takes.com/blogs/looking-at-questions.webp`;

	// Prepare JSON-LD for structured data
	const formattedAIComments = data?.aiComments?.map((comment: any) => {
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
	});

	// Format regular user comments as answers (fallback when no AI comments)
	const formattedUserComments = data?.comments?.slice(0, 5).map((comment: any) => {
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
	});

	// Use AI comments first, then user comments as fallback
	const suggestedAnswers =
		formattedAIComments?.length > 0
			? formattedAIComments
			: formattedUserComments?.length > 0
				? formattedUserComments
				: undefined;

	const questionJsonLd = JSON.stringify({
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
	});
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

<div class="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
	<article itemscope itemtype="https://schema.org/QAPage">
		<!-- Question Display -->
		<div class="mb-6">
			<QuestionDisplay question={data.question} />
		</div>

		<!-- Interaction Area -->
		<div class="mb-6">
			<Interact
				{data}
				questionId={data.question.id}
				parentType={'question'}
				on:commentAdded={addComment}
				user={data?.user}
				{qrCodeUrl}
				{qrCodeSize}
			/>
		</div>

		<!-- Tags -->
		{#if data.questionTags && data.questionTags.length > 0}
			<div class="mb-6">
				<div class="flex flex-wrap gap-2">
					{#each data.questionTags as tag}
						<a
							href={`/questions/categories/${tag.question_categories.category_name.split(' ').join('-')}`}
							class="inline-flex items-center rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-900"
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
			<QuestionContent
				data={dataForChild}
				user={data?.user}
				on:commentAdded={() => invalidateAll()}
			/>
		{/if}
	</article>
</div>
