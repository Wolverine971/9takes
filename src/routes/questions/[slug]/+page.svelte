<script lang="ts">
	import { browser } from '$app/environment';
	import Card from '$lib/components/atoms/card.svelte';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import QuestionContent from '$lib/components/questions/QuestionContent.svelte';
	import type { PageData } from '../$types';

	interface QuestionData extends PageData {
		question: any;
		comments: any;
		comment_count: number;
		flags: any;
	}

	/** @type {import('./$types').PageData} */
	export let data: QuestionData;

	const dataForChild = Object.assign({}, data.question, {
		comments: data.comments,
		comment_count: data.comment_count,
		flags: data.flags
	});
</script>

<!-- Question always renders -->
<article>
	<!-- <section>
		
	</section> -->
	<Card>
		<input class="question-box" type="text" bind:value={data.question.question} readonly />
		<!-- {data.question.question} -->
		<Interact {data} parentType={'question'} />
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

<QuestionContent data={dataForChild} />

<style lang="scss">
	.question-box {
		width: -webkit-fill-available;
		background-color: var(--color-bg-0);
		border: 1px solid var(--color-bg-0);
		border-radius: 5px;

		margin: 0.25rem;
	}
	.tablinks {
		display: flex;
		margin: 0.25rem;
	}
</style>
