<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import Carousel from '$lib/components/molecules/Carousel.svelte';
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

	const carouselDisplayUrls = [
		'enneagram-type-1',
		'enneagram-type-2',
		'enneagram-type-3',
		'enneagram-type-4',
		'enneagram-type-5',
		'enneagram-type-6',
		'enneagram-type-7',
		'enneagram-type-8',
		'enneagram-type-9'
	];

	const enneagram = data?.slug.split('-');
	const type = enneagram[enneagram.length - 1];

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
		<BlogPageHead data={data.frontmatter} slug={`enneagram-corner/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
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
	{#if carouselDisplayUrls.includes(data?.slug)}
		<Carousel type={parseInt(type)} gridDisplay={true} />
	{/if}

	<TableOfContents {contentStore} pageUrl={`https://9takes.com/enneagram-corner/${data.slug}`} />

	<svelte:component this={component} />
</article>

<hr style="margin: 5rem;" />

<SuggestionsBlog posts={data?.posts} blogType={'Enneagram'} slugPrefix={'enneagram-corner'} />

{#if !data?.session?.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<style lang="scss">
</style>
