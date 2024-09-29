<script lang="ts">
	import SuggestFamousPerson from '$lib/components/molecules/SuggestFamousPerson.svelte';

	import BlogInteract from '$lib/components/blog/BlogInteract.svelte';

	import BlogComments from '$lib/components/blog/BlogComments.svelte';
	import PeopleSuggestions from '$lib/components/blog/SuggestionsPeople.svelte';

	import FloatingSidebar from '$lib/components/blog/FloatingSidebar.svelte';

	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';

	import { onMount } from 'svelte';
	import PeopleBlogPageHead from '$lib/components/blog/PeopleBlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;

	let comments = data.comments;
	let userHasAnswered = data.flags.userHasAnswered;

	const commentAdded = (detail: any) => {
		comments = [...detail, ...comments];
		userHasAnswered = true;
	};
	let innerWidth: number = 0;

	onMount(() => {
		innerWidth = window.innerWidth;
	});
</script>

<svelte:window bind:innerWidth />

<article itemscope itemtype="https://schema.org/BlogPosting" style="" class="blog">
	<div style="align-items: inherit;">
		<PeopleBlogPageHead data={data.metadata} />
		<ArticleTitle title={data.metadata.title} />
		<!-- <ArticleDescription description={data.metadata.description} /> -->
		<ArticleSubTitle metaData={data.metadata} />
	</div>
	<svelte:component this={component} />
	{#if innerWidth > 1500 && data.metadata.suggestions}
		<FloatingSidebar links={data.metadata.suggestions} />
	{/if}
</article>

<h3 title="additional comments">What would you add?</h3>
<div>
	<BlogComments
		slug={data.slug}
		{comments}
		session={data.session}
		parentType={'personality-analysis'}
		{userHasAnswered}
	/>
	<BlogInteract
		{data}
		parentType={'personality-analysis'}
		on:commentAdded={({ detail }) => commentAdded(detail)}
		user={data?.session?.user}
	/>
</div>

<hr style="margin: 5rem;" />

<PeopleSuggestions suggestions={data?.suggestions} />

<div class="join">
	{#if !data?.session?.user}
		<SuggestFamousPerson />
	{/if}
</div>

<style lang="scss">
	@import '../../../scss/index.scss';
</style>
