<!-- src/routes/enneagram-corner/[slug]/+page.svelte -->
<!--
  src/routes/enneagram-corner/[slug]/+page.svelte
  Phase 5 #6 of docs/design/2026-05-04-rollout-plan.md — blog reading layout.
  Mechanical pass: Svelte 5 runes + V5 tokens. Visual redesign is follow-up work.
  Spec: docs/design-system.md §4–§6.
-->
<script lang="ts">
	import TableOfContents, { trackArticleHtml } from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import EnneagramTypeDossier from '$lib/components/blog/EnneagramTypeDossier.svelte';
	import { enneagramTypeProfiles } from '$lib/data/enneagramTypeProfiles';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import AuthorBio from '$lib/components/blog/AuthorBio.svelte';
	import TestYourTypeCTA from '$lib/components/blog/TestYourTypeCTA.svelte';
	import TestNudge from '$lib/components/blog/TestNudge.svelte';
	import KeepThisPageInvite from '$lib/components/blog/KeepThisPageInvite.svelte';
	import ExperimentalTherapyInvite from '$lib/components/blog/ExperimentalTherapyInvite.svelte';
	import { getAuthShell } from '$lib/authShell.svelte';

	let { data }: { data: PageData } = $props();
	const authShell = getAuthShell();
	type C = Component;
	let Article = $derived(data.component as unknown as C);

	// The article's live HTML, for the TOC's client-side fallback.
	let tocContent = $state('');

	// Pages hosting the in-article strategic question (T-12) declare it via
	// frontmatter. The question is the page's primary ask there, so the quiz
	// card is demoted to its compact form (kept, not removed; email capture
	// surfaces stay untouched per the resolved decision 3).
	const hasStrategicQuestion = $derived(
		Boolean(
			(data?.frontmatter as { strategic_question_url?: unknown } | undefined)
				?.strategic_question_url
		)
	);

	// Detect enneagram type pages (enneagram-type-1 … enneagram-type-9). When
	// matched, the dossier card renders in place of the standard featured PopCard.
	const enneagramTypeMatch = $derived(/^enneagram-type-([1-9])$/.exec(data?.slug ?? ''));
	const dossierProfile = $derived(
		enneagramTypeMatch ? enneagramTypeProfiles[parseInt(enneagramTypeMatch[1], 10)] : null
	);
</script>

<article class="blog" id="blogA" {@attach trackArticleHtml((html) => (tocContent = html))}>
	<div class="article-header">
		<BlogPageHead data={data.frontmatter} slug={`enneagram-corner/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
		<ArticleSubTitle metaData={data.frontmatter} />
	</div>

	{#if dossierProfile}
		<div class="featured-dossier">
			<EnneagramTypeDossier {...dossierProfile} />
		</div>
	{:else if data?.frontmatter?.pic}
		<div class="featured-image">
			<PopCard
				priority
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText={data?.frontmatter?.title || 'Enneagram article illustration'}
				subtext=""
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents content={tocContent} headings={data.frontmatter.headings} />

	<!-- The full test CTA is below the article, where about one reader in five scrolls. -->
	<TestNudge placement="corner_top" />

	<div class="article-body">
		<Article />
	</div>

	<AuthorBio author={data.frontmatter.author} />
</article>

<TestYourTypeCTA
	compact={hasStrategicQuestion}
	secondaryHref={hasStrategicQuestion ? null : '/corpus-stats'}
	secondaryLabel={hasStrategicQuestion ? null : 'See the corpus stats'}
/>

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType="Enneagram" slugPrefix="enneagram-corner" />

{#if !authShell.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<!-- The beta card ("Want to try experimental therapy, 9takes style?") for every
     reader: a side card on wide screens, inside the article on narrower ones.
     It replaced the newsletter side card here on 2026-10-04. -->
{#key data.slug}
	<ExperimentalTherapyInvite surface="enneagram" articleSelector=".article-body" />
	<!-- "Email me this page", a third of the way in. Signed-in readers have an account already. -->
	{#if !authShell.user}
		<KeepThisPageInvite articleSelector=".article-body" />
	{/if}
{/key}

<style lang="scss">
	.article-header {
		margin-bottom: 2rem;
	}

	.featured-image {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
	}

	.featured-dossier {
		margin: 1rem 0 2rem;
	}

	.article-body {
		margin-bottom: 2rem;
		line-height: 1.7;
		/* Body color comes from .blog in blog.scss (--text-muted); headings
		   and strong read at --text. */

		/* Header styles for injected content */
		:global(h2) {
			font-size: 1.75rem;
			font-weight: 600;
			color: var(--text);
			margin-top: 2rem;
			margin-bottom: 1rem;
			padding-top: 1rem;
			line-height: 1.3;
		}

		:global(h3) {
			font-size: 1.35rem;
			font-weight: 600;
			color: var(--text);
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			line-height: 1.35;
		}

		:global(h4) {
			font-size: 1.15rem;
			font-weight: 600;
			color: var(--text);
			margin-top: 1.25rem;
			margin-bottom: 0.5rem;
			line-height: 1.4;
		}

		:global(p) {
			margin-bottom: 1.2rem;
		}

		:global(ul),
		:global(ol) {
			margin: 1rem 0;
			padding-left: 1.5rem;
		}

		:global(li) {
			margin-bottom: 0.5rem;
			line-height: 1.6;
		}

		/* Links and blockquotes are styled once, in blog.scss (lavender +
		   underlined; indigo bar on --surface). */

		:global(strong) {
			font-weight: 700;
		}

		:global(.text-white :not(a):not([class*='bg-'])) {
			color: inherit;
		}

		:global(code) {
			background-color: var(--surface);
			color: var(--highlight);
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-size: 0.9em;
		}

		:global(pre) {
			background-color: var(--bg);
			border: 1px solid var(--rule);
			border-radius: 0.625rem;
			padding: 1rem;
			overflow-x: auto;

			:global(code) {
				background: none;
				padding: 0;
			}
		}
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid var(--rule);
	}

	.join {
		margin-top: 2rem;
	}

	/* Mobile-specific styles */
	@media (max-width: 768px) {
		.article-body {
			margin-bottom: 1rem;
			overflow-wrap: break-word;
			word-wrap: break-word;

			/* Mobile header sizes */
			:global(h2) {
				font-size: 1.4rem;
				margin-top: 1.5rem;
				margin-bottom: 0.75rem;
				padding-top: 0.75rem;
			}

			:global(h3) {
				font-size: 1.15rem;
				margin-top: 1.25rem;
				margin-bottom: 0.5rem;
			}

			:global(h4) {
				font-size: 1.05rem;
				margin-top: 1rem;
				margin-bottom: 0.4rem;
			}

			:global(p) {
				/* No font-size: 0.95rem out-specified `.blog p { font-size: inherit }`
				   and dropped article bodies to 15.2px while community/pop-culture
				   read at 18px (2026-06-11 mobile audit; same fix as pop-culture). */
				margin-bottom: 1rem;
			}

			/* Ensure all images are responsive */
			:global(img) {
				max-width: 100%;
				height: auto;
				display: block;
			}

			/* Make embedded content responsive */
			:global(iframe),
			:global(video) {
				max-width: 100%;
			}

			/* Ensure code blocks don't overflow */
			:global(pre),
			:global(code) {
				overflow-x: auto;
				word-wrap: normal;
			}
		}
	}
</style>
