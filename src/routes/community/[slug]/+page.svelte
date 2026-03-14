<!-- src/routes/community/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';
	export let data: PageData;
	type C = Component;
	$: component = data.component as unknown as C;

	const contentStore = writable('');
	let observer: MutationObserver | null = null;

	onMount(() => {
		findObserver();

		return () => {
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		};
	});

	$: if (data?.slug) {
		contentStore.set('');
		if (observer) {
			observer.disconnect();
			observer = null;
		}
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
			contentStore.set(node.innerHTML);
		}
	};
</script>

<article itemscope itemtype="https://schema.org/BlogPosting" style="" class="blog" id="blogA">
	<div style="align-items: inherit;">
		<BlogPageHead data={data.frontmatter} slug={`community/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
		<!-- <ArticleDescription description={data.frontmatter.description} /> -->
		<ArticleSubTitle metaData={data.frontmatter} />
	</div>

	<TableOfContents {contentStore} />

	<svelte:component this={component} />

	<AuthorBio author={data.frontmatter.author} />
</article>

<hr style="margin: 5rem;" />

<SuggestionsBlog posts={data?.posts} blogType={'Community'} slugPrefix={'community'} />

<div class="join">
	{#if !data?.user}
		<EmailSignup cta={'We are making something 👷🔨 join the waitlist'} />
	{/if}
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme - Community Article */
	:global(.blog) {
		color: #cbd5e1;
	}

	.join {
		margin-top: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-radius: 1rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
	}
</style>
