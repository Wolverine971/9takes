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
	import PopCard from '$lib/components/atoms/PopCard.svelte';
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

	{#if data.frontmatter.pic}
		<div style="display: flex; justify-content: center; margin: 1rem 0;">
			<PopCard
				image={`/blogs/${data.frontmatter.pic}.webp`}
				showIcon={false}
				tint={false}
				displayText=""
				altText={data.frontmatter.pic.split('-').join(' ')}
				subtext=""
			/>
		</div>
	{/if}

	<TableOfContents {contentStore} headings={data.frontmatter.headings} />

	<svelte:component this={component} />

	<AuthorBio author={data.frontmatter.author} />
</article>

<hr style="margin: 5rem;" />

<SuggestionsBlog posts={data?.posts} blogType={'Community'} slugPrefix={'community'} />

<div class="join">
	{#if !data?.user}
		<EmailSignup cta={'Get the next community take from 9takes'} />
	{/if}
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Community Article */
	:global(.blog) {
		color: var(--text-secondary);
	}

	.join {
		margin-top: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border-radius: 1rem;
		border: 1px solid rgba(45, 212, 191, 0.2);
	}
</style>
