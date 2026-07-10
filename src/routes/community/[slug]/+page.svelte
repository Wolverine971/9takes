<!-- src/routes/community/[slug]/+page.svelte -->
<!--
  src/routes/community/[slug]/+page.svelte
  Phase 5 #6 of docs/design/2026-05-04-rollout-plan.md — blog reading layout.
  Mechanical pass: Svelte 5 runes + V5 tokens. Visual redesign (Greek-imagery
  section anchors, Inter body rhythm) is a follow-up design exploration.
  Spec: docs/design-system.md §4–§6.
-->
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
	import EnneagramCTASidebar from '$lib/components/blog/EnneagramCTASidebar.svelte';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import { getAuthShellUser } from '$lib/authShell';

	let { data }: { data: PageData } = $props();
	const authUser = getAuthShellUser();
	type C = Component;
	let Article = $derived(data.component as unknown as C);

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

	$effect(() => {
		if (data?.slug) {
			contentStore.set('');
			if (observer) {
				observer.disconnect();
				observer = null;
			}
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

<article class="blog" id="blogA">
	<div>
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

	<Article />

	<AuthorBio author={data.frontmatter.author} />
</article>

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType={'Community'} slugPrefix={'community'} />

<div class="join">
	{#if !$authUser}
		<EnneagramCTASidebar />
		<EmailSignup cta={'Get the next community take from 9takes'} />
	{/if}
</div>

<style lang="scss">
	.section-divider {
		max-width: var(--prose-measure);
		margin: 3rem auto;
		border: none;
		border-top: 1px solid var(--stone-edge);
	}

	/* Streetlamp Symposium — Community article reading layout.
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
