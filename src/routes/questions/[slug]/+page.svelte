<script lang="ts">
	import Card from '$lib/components/atoms/card.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	/** @type {import('./$types').PageData} */
	export let data: PageData;

	let dataForChild = Object.assign({}, data.question, {
		comments: data.comments,
		comment_count: data.comment_count,
		links: data.links,
		links_count: data.links_count,
		flags: data.flags
	});

	const addComment = async (newComment: any) => {
		// flags.userHasAnswered = true
		dataForChild = Object.assign({}, data.question, {
			comments: dataForChild.comments ? [newComment, ...dataForChild.comments] : [newComment],
			comment_count: data.comment_count ? (data.comment_count += 1) : 1,
			links: data.links,
			links_count: data.links_count,
			flags: Object.assign({}, data.flags, { userHasAnswered: true })
		});
	};
	const autoGrow = (element: HTMLElement | null) => {
		if (element) {
			element.style.height = '1rem';
			element.style.height = element.scrollHeight + 'px';
		}
	};

	onMount(() => {
		autoGrow(document.getElementById('question-box'));
	});
</script>

<svelte:head>
	<title>{`9takes | ${data.question.question}`}</title>
	<meta name="description" content={`9takes Question | ${data.question.question}`} />
	<!-- <meta property="og:image" content="https://9takes.com/city-of-thought-bubbles.webp" /> -->
	<link rel="canonical" href={`https://9takes.com/questions/${data.question.url}`} />
</svelte:head>

<!-- Question always renders -->
<article>
	<!-- <section>
		
	</section> -->
	<Card>
		<h1 class="question-box" id="question-box" style="overflow:hidden">{data.question.question}</h1>

		<!-- oninput="auto_grow(this)" -->
		<!-- {data.question.question} -->
		<Interact
			{data}
			questionId={data.question.id}
			parentType={'question'}
			on:commentAdded={({ detail }) => addComment(detail)}
			user={data?.session?.user}
		/>
	</Card>
</article>

<!--
  Renders if has answered and signed in
          OR not answered and not signed in
-->
<!-- {data.flags.userSignedIn} || {!(!data.flags.userSignedIn && data.flags.userHasAnswered)} -->
<!-- {#if data.flags.userSignedIn || !(!data.flags.userSignedIn && data.flags.userHasAnswered)}
		<Interact {data} parentType={'question'} />
	{/if} -->

<QuestionContent data={dataForChild} user={data?.session?.user} />

<style lang="scss">
	.question-box {
		width: -webkit-fill-available;
		background-color: var(--color-bg-0);
		border: 1px solid var(--color-bg-0);
		border-radius: 5px;
		height: 24px;
		padding: 10px 20px;
		color: hsl(222, 15%, 19%);
		// font-size: 16px;
		// box-sizing: content-box;

		margin: 0.25rem;
	}
</style>
