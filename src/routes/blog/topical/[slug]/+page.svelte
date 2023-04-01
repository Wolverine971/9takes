<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import Card from '$lib/components/atoms/card.svelte';
	import BlogList from '$lib/components/blog/BlogList.svelte';
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = data.component as unknown as C;
</script>

<div style="align-items: inherit;">
	<BlogPageHead data={data.frontmatter} slug={`people/${data.slug}`} />
	<ArticleTitle title={data.frontmatter.title} />
	<ArticleDescription description={data.frontmatter.description} />
	<ArticleMeta author={data.frontmatter.author} date={data.frontmatter.date} />
</div>

<svelte:component this={component} />

<hr style="margin: 5rem;" />

<BlogList posts={data?.posts} />

<div class="join">
	<CollectEmail cta={'We are making something 👷🔨 join the waitlist'} />
</div>

<style lang="scss">
	@import '../../../../scss/index.scss';
	tr {
		border: 1px solid var(--color-theme-purple);
		text-align: center;
	}
	td {
		border: 1px solid var(--color-theme-purple);
		text-align: center;
	}
	th {
		border: 1px solid var(--color-theme-purple);
		text-align: center;
	}
</style>
