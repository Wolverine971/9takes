<script lang="ts">
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import type { PageData } from './$types';

	import { invalidateAll } from '$app/navigation';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';

	/** @type {import('./$types').PageData} */
	export let data: PageData;

	let dataForChild = Object.assign({}, data.question, {
		removedComments: data.removedComments,
		removed_comment_count: data.removed_comment_count,
		comments: data.comments,
		comment_count: data.comment_count,
		ai_comments: data.ai_comments,
		links: data.links,
		links_count: data.links_count,
		flags: data.flags
	});

	const addComment = async (newData: any) => {
		setTimeout(async () => {
			await fetch(`/comments?type=question&parentId=${data?.question?.id}`)
				.then((response) => response.json())
				.then((commentData) => {
					if (!commentData?.message) {
						dataForChild = Object.assign({}, data.question, {
							removedComments: data.removedComments,
							removed_comment_count: data.removed_comment_count,
							comments: commentData,
							comment_count: data.comment_count ? (data.comment_count += 1) : 1,
							ai_comments: data.ai_comments,
							links: data.links,
							links_count: data.links_count,
							flags: Object.assign({}, data.flags, { userHasAnswered: true })
						});
					}
				});
		}, 500);
		invalidateAll();
	};

	const autoGrow = (element: HTMLElement | null) => {
		if (element) {
			element.style.height = '1rem';
			element.style.height = element.scrollHeight + 'px';
		}
	};

	let innerWidth = 0;
	const bigTitle = `9takes | ${data.question.question_formatted || data.question.question}`;
	let title = '';
	if (bigTitle.length >= 57) {
		title = `${bigTitle.slice(0, 57)}...`;
	} else {
		title = bigTitle;
	}

	const description = `🏛️ Give your take and get 9 different personalities' takes on this question.`;
	const slug = data.question.url;
	const url = `https://9takes.com/questions/${slug}`;
	const imgUrl = data.question?.img_url
		? `https://9takes.s3.amazonaws.com/${data.question.img_url}`
		: `https://9takes.com/blogs/looking-at-questions.webp`;
	const questionObject = {
		'@context': 'https://schema.org',
		'@type': 'QAPage',
		mainEntity: {
			'@type': 'Question',
			name: data.question.question_formatted,
			answerCount: data.question.comment_count,
			dateCreated: data.question.created_at
		}
	};
	const questionJsonLd = JSON.stringify(questionObject);
</script>

<svelte:window bind:innerWidth />

<svelte:head>
	<title>{title}</title>

	<link rel="canonical" href={url} />
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width,initial-scale=1" />

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

<!-- <img src="https://9takes.com/blogs/looking-at-questions.webp" alt=""> -->
<div class="question-area-box">
	<!-- Question always renders -->
	<article itemscope itemtype="https://schema.org/Question">
		<!-- <section>
		
	</section> -->
		<div>
			<QuestionDisplay question={data.question} />

			<!-- oninput="auto_grow(this)" -->
			<!-- {data.question.question} -->
			<Interact
				{data}
				questionId={data.question.id}
				parentType={'question'}
				on:commentAdded={({ detail }) => addComment(detail)}
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
					style="text-decoration: none; color: hsl(222, 15%, 19%);"
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
			on:commentAdded={({ detail }) => {
				invalidateAll();
			}}
		/>
	{/if}
</div>

<style lang="scss">
	.question-box {
		// remove update
		width: -webkit-fill-available;
		border-radius: var(--base-border-radius);
		// height: 24px;
		// padding: 0.5rem 1rem;
		color: var(--color-paladin-4);
		font-size: 1.2rem;
		// box-sizing: content-box;

		margin: 0.25rem;
	}

	.tags-heading {
		margin-left: 0.25rem;
		margin-bottom: 0;
		padding-bottom: 0;
		margin-top: 0;
		padding-top: 0;
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
