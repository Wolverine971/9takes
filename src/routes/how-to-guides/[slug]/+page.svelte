<!-- src/routes/how-to-guides/[slug]/+page.svelte -->
<!--
  src/routes/how-to-guides/[slug]/+page.svelte
  Phase 5 #6 of docs/design/2026-05-04-rollout-plan.md — blog reading layout.
  Mechanical pass: Svelte 5 runes + V5 tokens. Visual redesign is follow-up work.
-->
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
	import EnneagramCTASidebar from '$lib/components/blog/EnneagramCTASidebar.svelte';
	import { buildHowToSchema } from '$lib/utils/schema';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';

	let { data }: { data: PageData } = $props();

	// Build HowTo schema if steps are defined in frontmatter
	let howToSchema = $derived(
		data?.frontmatter?.howToSteps && data.frontmatter.howToSteps.length > 0
			? JSON.stringify(
					buildHowToSchema({
						name: data.frontmatter.title,
						description: data.frontmatter.description,
						steps: data.frontmatter.howToSteps.map((step) =>
							typeof step === 'string'
								? { name: step, text: step }
								: { name: step.name ?? '', text: step.text ?? '' }
						),
						image: data.frontmatter.pic
							? `https://9takes.com/blogs/${data.frontmatter.pic}.webp`
							: undefined,
						totalTime: data.frontmatter.totalTime
					})
				)
			: null
	);
	type C = Component;
	let Article = $derived(data.component as unknown as C);

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
	$effect(() => {
		if (data?.slug) {
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
	});

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

<!-- HowTo Schema for guides with steps -->
<svelte:head>
	{#if howToSchema}
		{@html `<script type="application/ld+json">${howToSchema}</script>`}
	{/if}
</svelte:head>

<article class="blog" id="blogA">
	<div>
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
				altText={data?.frontmatter?.title || 'Guide illustration'}
				subtext=""
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents {contentStore} headings={data.frontmatter.headings} />

	<Article />

	<AuthorBio author={data.frontmatter.author} />
</article>

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType={'How to Guides'} slugPrefix={'how-to-guides'} />

<div class="join">
	{#if !data?.user}
		<EnneagramCTASidebar />
		<EmailSignup cta={'Get the next practical guide from 9takes'} />
	{/if}
</div>

<style lang="scss">
	.section-divider {
		max-width: var(--prose-measure);
		margin: 3rem auto;
		border: none;
		border-top: 1px solid var(--stone-edge);
	}

	/* Streetlamp Symposium — How-To Guide reading layout.
	   Body reads in --ink-bright (ratified 2026-06-09, design-system.md §6);
	   --ink-mid is for captions/secondary voice only. */
	:global(.blog) {
		color: var(--ink-bright);
	}

	.join {
		margin-top: 2rem;
		padding: 2rem;
		background: var(--stone-warm);
		border-radius: 1rem;
		border: 1px solid var(--stone-edge);
	}
</style>
