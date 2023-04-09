<script lang="ts">
	import { browser } from '$app/environment';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import Interact from '$lib/components/molecules/Interact.svelte';
	import type { PageData } from '../$types';

	interface QuestionData extends PageData {
		question: any;
		comments: any;
		comment_count: number;
		flags: any;
	}

	/** @type {import('./$types').PageData} */
	export let data: QuestionData;
</script>

<!-- Question always renders -->
<article>
	<header>Question</header>
	<section>
		{data.question.question}
	</section>
</article>

<hr />

<ul>
	<!--
  Renders if has answered and signed in
          OR not answered and not signed in
-->
	{data.flags.userSignedIn} || {!(!data.flags.userSignedIn && data.flags.userHasAnswered)}
	{#if data.flags.userSignedIn || !(!data.flags.userSignedIn && data.flags.userHasAnswered)}
		<Interact {data} parentType={'question'} />
		<!-- userData=  -->
	{/if}
	<!-- Renders for SEO, removed if not answered -->
	{#if !browser || data.flags.userHasAnswered}
		<h3>Renders for SEO, removed if not answered</h3>
		<h1>Comments</h1>
		{#if data.comments.length}
			<Comments {data} nested={true} parentType={'question'} />
		{/if}
	{/if}
	{#if data.flags.userHasAnswered && !browser}
		<h3>Renders only if answered</h3>
		<h1>Comments</h1>
		<!-- Renders only if answered -->
		<li>Answer Two</li>
		<li>Answer Three</li>
		<!-- only load first or top comment -->
		{#if data.comments.length}
			<Comments {data} nested={false} parentType={'question'} />
		{/if}
	{/if}
</ul>

<style lang="scss">
</style>
