<!-- src/routes/community/[slug]/+page.svelte -->
<!--
  src/routes/community/[slug]/+page.svelte
  Phase 5 #6 of docs/design/2026-05-04-rollout-plan.md — blog reading layout.
  Mechanical pass: Svelte 5 runes + V5 tokens. Visual redesign (Greek-imagery
  section anchors, Inter body rhythm) is a follow-up design exploration.
  Spec: docs/design-system.md §4–§6.
-->
<script lang="ts">
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import TableOfContents, { trackArticleHtml } from '$lib/components/blog/TableOfContents.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import ExperimentalTherapyInvite from '$lib/components/blog/ExperimentalTherapyInvite.svelte';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import { getAuthShell } from '$lib/authShell.svelte';

	let { data }: { data: PageData } = $props();
	const authShell = getAuthShell();
	type C = Component;
	let Article = $derived(data.component as unknown as C);

	// The article's live HTML, for the TOC's client-side fallback.
	let tocContent = $state('');
</script>

<article class="blog" id="blogA" {@attach trackArticleHtml((html) => (tocContent = html))}>
	<div>
		<BlogPageHead data={data.frontmatter} slug={`community/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
		<!-- <ArticleDescription description={data.frontmatter.description} /> -->
		<ArticleSubTitle metaData={data.frontmatter} />
	</div>

	{#if data.frontmatter.pic}
		<div style="display: flex; justify-content: center; margin: 1rem 0;">
			<PopCard
				priority
				image={`/blogs/${data.frontmatter.pic}.webp`}
				showIcon={false}
				tint={false}
				displayText=""
				altText={data.frontmatter.pic.split('-').join(' ')}
				subtext=""
			/>
		</div>
	{/if}

	<TableOfContents content={tocContent} headings={data.frontmatter.headings} />

	<Article />

	<AuthorBio author={data.frontmatter.author} />
</article>

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType="Community" slugPrefix="community" />

<div class="join">
	{#if !authShell.user}
		<EmailSignup cta="Get the next community take from 9takes" />
	{/if}
</div>

<!-- The beta card ("Want to try experimental therapy, 9takes style?") for every
     reader: a side card on wide screens, inside the article on narrower ones.
     It replaced the newsletter side card here on 2026-10-04. -->
{#key data.slug}
	<ExperimentalTherapyInvite
		surface="community"
		articleSelector="article.blog"
		fallbackBeforeSelector=".author-bio"
	/>
{/key}

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
