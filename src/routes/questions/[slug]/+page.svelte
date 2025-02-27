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
	const description = `🏛️ Give your takey take 🤲 then see everyone else's unbiased answers...`;
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

<div class="question-area-box">
	<article itemscope itemtype="https://schema.org/Question" class="main-content">
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
	</article>

	<aside class="aside-outline">
		{#if data.questionTags}
			{#if innerWidth > 1200}
				<h3 class="tags-heading">Related question <br />categories</h3>
			{/if}
			<div class="tags-container">
				{#each data.questionTags as tag}
					<a
						href={`/questions/categories/${tag.question_categories.category_name.split(' ').join('-')}`}
						class="tag"
						rel="tag"
					>
						{tag.question_categories.category_name}
					</a>
				{/each}
			</div>
		{/if}
	</aside>

	{#if dataForChild}
		<QuestionContent
			data={dataForChild}
			user={data?.session?.user}
			on:commentAdded={() => invalidateAll()}
			class="question-content"
		/>
	{/if}
</div>

<style lang="scss">
	.qr-image-border {
		border: var(--classic-border);
		height: 60px; // Fixed height
		margin: 0.5rem 0; // Vertical margins only
		border-radius: var(--base-border-radius);
		padding: 0.2rem;
		width: 60px !important; // Override inline style on mobile
		background-color: var(--accent);
		background-image: linear-gradient(to right top, #a0b6d4, #b0b8df, #c6b9e6, #e0b8e7, #f9b7e1);
		transition: transform 0.3s ease;

		&:hover {
			transform: scale(1.05);
		}
		@media (max-width: 576px) {
			width: 50px !important;
			height: 50px;
		}
	}

	.main-content {
		margin-bottom: 1.5rem;
		max-width: 960px;
	}

	.question-content {
		max-width: 960px;
	}

	.tags-heading {
		margin: 0 0 0.75rem 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--darkest-gray);
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;

		@media (max-width: 1199px) {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 0.5rem;
			-webkit-overflow-scrolling: touch;
		}
	}

	.tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		font-size: 0.85rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius-sm);
		background-color: var(--accent-light);
		color: var(--primary-dark);
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background-color: var(--primary-light);
			color: var(--primary-dark);
			transform: translateY(-2px);
			box-shadow: var(--shadow-sm);
		}
	}

	.aside-outline {
		position: relative;
		right: 0;
		display: flex;
		flex-direction: column;
		background-color: var(--light-gray);
		border-radius: var(--base-border-radius);
		padding: 0.75rem;
		margin-bottom: 1.5rem;

		@media (max-width: 1199px) {
			overflow-x: auto;
		}

		@media (min-width: 1200px) {
			position: fixed !important;
			margin-left: 995px;
			right: auto;
			width: 250px;
			margin-top: 0.5rem;
			border: var(--classic-border);
			z-index: 10;
		}
	}
</style>
