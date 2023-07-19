<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = data.component as unknown as C;
</script>

<div style="align-items: inherit;">
	<BlogPageHead data={data.frontmatter} slug={`blog/enneagram/${data.slug}`} />
	<ArticleTitle title={data.frontmatter.title} />
	<ArticleDescription description={data.frontmatter.description} />
	<ArticleMeta metaData={data.frontmatter} />
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
	// @import '../../../../scss/index.scss';
	tr {
		border: var(--classic-border);
		text-align: center;
	}
	td {
		border: var(--classic-border);
		text-align: center;
	}
	th {
		border: var(--classic-border);
		text-align: center;
	}
</style>
