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
		ai_comments: data.ai_comments,
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
			light: 'rgba(193, 192, 192, 0.21)'
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
	const formattedAIComments = data?.ai_comments?.map((comment) => {
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
			...(formattedAIComments?.length > 0 && { suggestedAnswer: formattedAIComments })
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
	<meta property="twitter:url" content={url} />
	<meta name="twitter:image" content={imgUrl} />
	{@html `<script type="application/ld+json">${questionJsonLd}</script>`}
</svelte:head>

<div class="mx-auto w-full max-w-7xl">
	<aside
		class="relative mb-6 flex flex-col overflow-x-auto rounded p-3 xl:fixed xl:right-auto xl:z-10 xl:ml-[860px] xl:mt-2 xl:w-[250px] xl:border"
		style="overflow: visible;"
	>
		{#if data.questionTags && innerWidth > 1200}
			{#if innerWidth > 1200}
				<h3 class="m-0 mb-3 text-lg font-semibold text-neutral-800">
					Related question <br />categories
				</h3>
			{/if}
			<div
				class="touch-scroll flex flex-wrap gap-2 overflow-x-auto pb-2 xl:flex-wrap xl:overflow-visible"
			>
				{#each data.questionTags as tag}
					<a
						href={`/questions/categories/${tag.question_categories.category_name.split(' ').join('-')}`}
						class="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded border border-neutral-200 bg-primary-100 px-3 py-2 text-sm text-primary-800 no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-primary-200 hover:text-primary-900 hover:shadow-sm"
						rel="tag"
					>
						{tag.question_categories.category_name}
					</a>
				{/each}
			</div>
		{/if}
	</aside>
	<article itemscope itemtype="https://schema.org/QAPage" class="mb-6 max-w-4xl">
		<div>
			<QuestionDisplay question={data.question} />
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
		{#if data.questionTags && innerWidth <= 1200}
			<div
				class="touch-scroll flex flex-wrap gap-2 overflow-x-auto pb-2 xl:flex-wrap xl:overflow-visible"
			>
				{#each data.questionTags as tag}
					<a
						href={`/questions/categories/${tag.question_categories.category_name.split(' ').join('-')}`}
						class="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded border border-neutral-200 bg-primary-100 px-3 py-2 text-sm text-primary-800 no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-primary-200 hover:text-primary-900 hover:shadow-sm"
						rel="tag"
					>
						{tag.question_categories.category_name}
					</a>
				{/each}
			</div>
		{/if}
		{#if dataForChild}
			<QuestionContent
				data={dataForChild}
				user={data?.user}
				on:commentAdded={() => invalidateAll()}
			/>
		{/if}
	</article>
</div>

<style>
	/* Adding touch scrolling for iOS */
	.touch-scroll {
		-webkit-overflow-scrolling: touch;
	}
</style>
