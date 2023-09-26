<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import Card from '$lib/components/atoms/card.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;
</script>

<div style="align-items: inherit;">
	<BlogPageHead data={data.frontmatter} slug={`blog/topical/${data.slug}`} />
	<ArticleTitle title={data.frontmatter.title} />
	<ArticleDescription description={data.frontmatter.description} />
	<ArticleSubTitle metaData={data.frontmatter} />
</div>

<svelte:component this={component} />

<hr style="margin: 5rem;" />

<SuggestionsBlog posts={data?.posts} />

<div class="join">
	{#if !data?.session?.user}
		<EmailSignup cta={'We are making something 👷🔨 join the waitlist'} />
	{/if}
</div>

<style lang="scss">
	@import '../../../../scss/index.scss';
</style>
