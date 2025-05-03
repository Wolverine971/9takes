<script lang="ts">
	import PopCard from '$lib/components/atoms/PopCard.svelte';

	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
	$: component = data.component as unknown as C;

	const contentStore = writable('');

	onMount(() => {
		findObserver();
	});

	const findObserver = () => {
		const node = document.querySelector('#blogA');

		if (!node) {
			setTimeout(findObserver, 500);
		} else {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') {
						contentStore.set(node.innerHTML);
					}
				});
			});

			observer.observe(node, { childList: true, subtree: true });
		}
	};
</script>

<article itemscope itemtype="https://schema.org/BlogPosting" style="" class="blog" id="blogA">
	<div style="align-items: inherit;">
		<BlogPageHead data={data.frontmatter} slug={`how-to-guides/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
		<!-- <ArticleDescription description={data.frontmatter.description} /> -->
		<ArticleSubTitle metaData={data.frontmatter} />
	</div>

	{#if data?.frontmatter?.pic}
		<div style="display: flex; justify-content: center; margin: 1rem 0;">
			<PopCard
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText=""
				subtext=""
			/>
		</div>
	{/if}

	<TableOfContents {contentStore} pageUrl={`https://9takes.com/how-to-guides/${data.slug}`} />

	<svelte:component this={component} />
</article>

<hr style="margin: 5rem;" />

<SuggestionsBlog posts={data?.posts} blogType={'How to Guides'} slugPrefix={'how-to-guides'} />

<div class="join">
	{#if !data?.session?.user}
		<EmailSignup cta={'We are making something 👷🔨 join the waitlist'} />
	{/if}
</div>

<style lang="scss">
	@use '../../../scss/index.scss' as *;
</style>
