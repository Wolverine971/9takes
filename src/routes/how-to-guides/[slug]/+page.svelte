<!-- src/routes/how-to-guides/[slug]/+page.svelte -->
<script lang="ts">
	import PopCard from '$lib/components/atoms/PopCard.svelte';

	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	export let data: PageData;
	type C = Component;
	$: component = data.component as unknown as C;

	const contentStore = writable('');
	let observer: MutationObserver | null = null;

	onMount(() => {
		findObserver();

		return () => {
			// Cleanup observer on unmount
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		};
	});

	// Watch for slug changes and reinitialize observer
	$: if (data?.slug) {
		// Reset content store when slug changes
		contentStore.set('');

		// Clean up existing observer
		if (observer) {
			observer.disconnect();
			observer = null;
		}

		// Set up new observer after a short delay to ensure DOM is updated
		setTimeout(() => {
			findObserver();
		}, 100);
	}

	const findObserver = () => {
		if (!browser) return;
		const node = document.querySelector('#blogA');

		if (!node) {
			setTimeout(findObserver, 500);
		} else {
			// Disconnect existing observer if any
			if (observer) {
				observer.disconnect();
			}

			observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') {
						contentStore.set(node.innerHTML);
					}
				});
			});

			observer.observe(node, { childList: true, subtree: true });

			// Also set initial content
			contentStore.set(node.innerHTML);
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
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents {contentStore} />

	<svelte:component this={component} />
</article>

<hr style="margin: 5rem;" />

<SuggestionsBlog posts={data?.posts} blogType={'How to Guides'} slugPrefix={'how-to-guides'} />

<div class="join">
	{#if !data?.user}
		<EmailSignup cta={'We are making something 👷🔨 join the waitlist'} />
	{/if}
</div>

<style lang="scss">
</style>
