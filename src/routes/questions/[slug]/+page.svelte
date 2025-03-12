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
		flags: data.flags
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
	const formattedAIComments = data?.aiComments?.map((comment) => {
		return {
			'@type': 'Answer',
			text: comment.comment,
			dateCreated: comment.created_at,
			upvoteCount: 0,
			author: {
				'@type': 'Person',
				name: `Enneagram Type ${comment.enneagram_type}`
			}
		};
	});

	const questionJsonLd = formattedAIComments?.length
		? JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'QAPage',
				mainEntity: {
					'@type': 'Question',
					name: data.question.question_formatted,
					answerCount: data.question.comment_count || 0,
					dateCreated: data.question.created_at,
					suggestedAnswer: formattedAIComments
				}
			})
		: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'QAPage',
				mainEntity: {
					'@type': 'Question',
					name: data.question.question_formatted,
					answerCount: data.question.comment_count || 0,
					dateCreated: data.question.created_at
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
	{#if formattedAIComments?.length}
		{@html `<script type="application/ld+json">${questionJsonLd}</script>`}
	{/if}
</svelte:head>

<div class="mx-auto w-full max-w-7xl px-4">
	<aside
		class="relative mb-6 flex flex-col overflow-x-auto rounded bg-gray-100 p-3 xl:fixed xl:right-auto xl:z-10 xl:ml-[860px] xl:mt-2 xl:w-[250px] xl:border xl:border-gray-200"
	>
		{#if data.questionTags}
			{#if innerWidth > 1200}
				<h3 class="m-0 mb-3 text-lg font-semibold text-gray-800">
					Related question <br />categories
				</h3>
			{/if}
			<div
				class="-webkit-overflow-scrolling-touch flex flex-wrap gap-2 overflow-x-auto pb-2 xl:flex-wrap xl:overflow-visible"
			>
				{#each data.questionTags as tag}
					<a
						href={`/questions/categories/${tag.question_categories.category_name.split(' ').join('-')}`}
						class="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded border border-gray-200 bg-indigo-100 px-3 py-2 text-sm text-indigo-800 no-underline transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-indigo-200 hover:text-indigo-900 hover:shadow-sm"
						rel="tag"
					>
						{tag.question_categories.category_name}
					</a>
				{/each}
			</div>
		{/if}
	</aside>
	<article itemscope itemtype="https://schema.org/Question" class="mb-6 max-w-4xl">
		<div>
			<QuestionDisplay question={data.question} />
			<Interact
				{data}
				questionId={data.question.id}
				parentType={'question'}
				on:commentAdded={addComment}
				user={data?.session?.user}
				{qrCodeUrl}
				{qrCodeSize}
			/>
		</div>
		{#if dataForChild}
			<QuestionContent
				data={dataForChild}
				user={data?.session?.user}
				on:commentAdded={() => invalidateAll()}
			/>
		{/if}
	</article>
</div>

<style>
	/* QR code styles that might be hard to implement with just Tailwind */
	:global(.qr-image-border) {
		@apply my-2 h-[60px] w-[60px] rounded border border-gray-200 bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 p-0.5 transition-transform duration-300 ease-in-out hover:scale-105 !important;
	}

	@media (max-width: 576px) {
		:global(.qr-image-border) {
			@apply h-[50px] w-[50px] !important;
		}
	}

	/* Adding touch scrolling for iOS */
	.-webkit-overflow-scrolling-touch {
		-webkit-overflow-scrolling: touch;
	}
	.main-content {
		margin-bottom: 0;
	}
</style>
