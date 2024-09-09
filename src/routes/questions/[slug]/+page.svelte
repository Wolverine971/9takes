<script lang="ts">
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

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

	async function addComment() {
		await new Promise((resolve) => setTimeout(resolve, 500));
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
	}

	let innerWidth = 0;
	$: title = computeTitle(data.question.question_formatted || data.question.question);

	function computeTitle(questionText: string): string {
		const fullTitle = `9takes | ${questionText}`;
		return fullTitle.length > 60 ? fullTitle.slice(0, 57) + '...' : fullTitle;
	}

	const description = `🏛️ Give your takey take 🤲 then see everyone else's unbiased answers...`;
	const url = `https://9takes.com/questions/${data.question.url}`;
	const imgUrl = data.question?.img_url
		? `https://9takes.s3.amazonaws.com/${data.question.img_url}`
		: `https://9takes.com/blogs/looking-at-questions.webp`;

	const formattedAIComments = data?.ai_comments.map((comment) => {
		return JSON.stringify({
			'@type': 'Answer',
			text: comment.comment,
			dateCreated: comment.created_at,
			upvoteCount: 0,
			author: {
				'@type': 'Person',
				name: `Enneagram Type ${comment.enneagram_type}`
			}
		});
	});

	const questionJsonLd = formattedAIComments.length
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
	{#if formattedAIComments.length}
		{@html `<script type="application/ld+json">${questionJsonLd}</script>`}
	{/if}
</svelte:head>

<div class="question-area-box">
	<article itemscope itemtype="https://schema.org/Question">
		<div>
			<QuestionDisplay question={data.question} />
			<Interact
				{data}
				questionId={data.question.id}
				parentType={'question'}
				on:commentAdded={addComment}
				user={data?.session?.user}
			/>
		</div>
	</article>

	<aside class="aside-outline">
		{#if data.questionTags}
			{#if innerWidth > 1200}
				<h3 class="tags-heading">Related question <br />categories</h3>
			{/if}
			{#each data.questionTags as tag}
				<a
					href={`/questions/categories/${tag.question_tag.tag_name.split(' ').join('-')}`}
					class="tag"
					rel="tag"
				>
					{tag.question_tag.tag_name}
				</a>
			{/each}
		{/if}
	</aside>

	{#if dataForChild}
		<QuestionContent
			data={dataForChild}
			user={data?.session?.user}
			on:commentAdded={() => invalidateAll()}
		/>
	{/if}
</div>

<style lang="scss">
	.tags-heading {
		margin: 0 0 0 0.25rem;
		padding: 0;
	}

	.tag {
		display: flex;
		text-wrap: nowrap;
		align-items: center;
		justify-content: center;
		border-radius: var(--base-border-radius);
		font-size: 0.8rem;
		margin: 0.25rem;
		padding: 0.25rem;
		border: 1px solid var(--base-white-outline);
		width: fit-content;
		cursor: pointer;
		text-decoration: none;
		color: hsl(222, 15%, 19%);

		&:hover {
			background-color: var(--base-white-outline);
		}
	}

	aside {
		position: relative;
		right: 0;
		display: flex;
		overflow: auto;
		background-color: var(--base-grey-1);
	}

	@media (min-width: 1200px) {
		aside {
			position: fixed !important;
			margin-left: 995px;
			right: auto;
			display: block;
			margin-top: 0.5rem;
			padding: 0.5rem;
			border: var(--classic-border);
			border-radius: var(--base-border-radius);
		}
	}
</style>
