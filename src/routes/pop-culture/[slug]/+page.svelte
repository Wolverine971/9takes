<!-- src/routes/pop-culture/[slug]/+page.svelte -->
<script lang="ts">
	import TableOfContents, { trackArticleHtml } from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import PopCardGroup from '$lib/components/atoms/PopCardGroup.svelte';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import TestYourTypeCTA from '$lib/components/blog/TestYourTypeCTA.svelte';
	import ExperimentalTherapyInvite from '$lib/components/blog/ExperimentalTherapyInvite.svelte';
	import { getPopCultureBridges } from '$lib/data/popCultureBridges';
	import { getPersonalityCategoryBySlug } from '$lib/personalityCategories';
	import { getAuthShell } from '$lib/authShell.svelte';
	let { data }: { data: PageData } = $props();
	const authShell = getAuthShell();
	type C = Component;
	let Article = $derived(data.component as unknown as C);

	// Bucket 3 — internal-linking bridges to type pillars, corpus stats, and
	// the matching personality-analysis category. Falls back to no-render
	// when the slug isn't mapped (e.g., an unpublished file rendered in dev).
	const bridges = $derived(getPopCultureBridges(data?.slug ?? ''));
	const bridgeCategory = $derived(bridges ? getPersonalityCategoryBySlug(bridges.category) : null);
	const TYPE_PILLAR_LABELS: Record<number, string> = {
		1: 'Type 1: Perfectionist',
		2: 'Type 2: Helper',
		3: 'Type 3: Achiever',
		4: 'Type 4: Individualist',
		5: 'Type 5: Investigator',
		6: 'Type 6: Loyalist',
		7: 'Type 7: Enthusiast',
		8: 'Type 8: Challenger',
		9: 'Type 9: Peacemaker'
	};

	// The article's live HTML, for the TOC's client-side fallback.
	let tocContent = $state('');

	// Frontmatter tags, one each (a repeated tag would break the keyed list).
	const tags = $derived(
		(data.frontmatter.tags ?? []).filter(
			(tag: string, i: number, all: string[]) => all.indexOf(tag) === i
		)
	);

	let isDarkContent = $derived(
		data?.slug?.includes('dark-triad') ||
			data?.slug?.includes('serial-killer') ||
			data?.slug?.includes('criminal') ||
			data?.frontmatter?.tags?.includes('dark-psychology')
	);
</script>

<article
	class="pop-culture-article"
	id="popCultureArticle"
	{@attach trackArticleHtml((html) => (tocContent = html))}
>
	<div class={['article-header', { 'dark-theme': isDarkContent }]}>
		<BlogPageHead data={data.frontmatter} slug={`pop-culture/${data.slug}`} />

		{#if isDarkContent}
			<div class="content-warning">
				<strong>Content Warning:</strong> This article discusses criminal behavior, mental health conditions,
				and violence. Reader discretion is advised.
			</div>
		{/if}

		<ArticleTitle title={data.frontmatter.title} />
		<ArticleSubTitle metaData={data.frontmatter} />

		<div class="article-tags">
			{#if data.frontmatter.tags}
				{#each tags as tag (tag)}
					<span class="tag">{tag}</span>
				{/each}
			{/if}
		</div>
	</div>

	{#if data?.frontmatter?.picGroup}
		<div class={['featured-image', { 'dark-image': isDarkContent }]}>
			<PopCardGroup people={data.frontmatter.picGroup} lazyLoad={!data.frontmatter.eagerPicGroup} />
		</div>
	{:else if data?.frontmatter?.pic}
		<div class={['featured-image', { 'dark-image': isDarkContent }]}>
			<PopCard
				priority
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText={data?.frontmatter?.title || ''}
				subtext=""
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents
		content={tocContent}
		headings={data.frontmatter.headings}
		maxTocEntries={data.frontmatter.tocMaxEntries ?? 24}
	/>

	<div class="article-content">
		<Article />
	</div>

	<!-- Related Content Section -->
	<section class="related-content">
		<p class="related-eyebrow">Keep Reading</p>
		<h2>Explore More Pop Culture Psychology</h2>
		<div class="related-grid">
			{#if bridges}
				<a href={`/enneagram-corner/enneagram-type-${bridges.type}`} class="related-card">
					<span class="card-icon" aria-hidden="true">○</span>
					<h3>{TYPE_PILLAR_LABELS[bridges.type]}</h3>
					<p>The pillar profile for the type at the center of this analysis.</p>
					<span class="card-link">Read the type pillar →</span>
				</a>
				{#if bridges.secondaryType}
					<a
						href={`/enneagram-corner/enneagram-type-${bridges.secondaryType}`}
						class="related-card"
					>
						<span class="card-icon" aria-hidden="true">◐</span>
						<h3>{TYPE_PILLAR_LABELS[bridges.secondaryType]}</h3>
						<p>The other type driving this dynamic. Read it side-by-side.</p>
						<span class="card-link">Read the type pillar →</span>
					</a>
				{/if}
				{#if bridgeCategory}
					<a href={`/personality-analysis/categories/${bridgeCategory.slug}`} class="related-card">
						<span class="card-icon" aria-hidden="true">◯</span>
						<h3>{bridgeCategory.label} profiles</h3>
						<p>Real-people personality breakdowns inside this same category.</p>
						<span class="card-link">Browse profiles →</span>
					</a>
				{/if}
				<a href={`/corpus-stats#domain-${bridges.corpusAnchor}`} class="related-card">
					<span class="card-icon" aria-hidden="true">▦</span>
					<h3>Corpus stats: {bridgeCategory?.shortLabel ?? bridges.corpusAnchor}</h3>
					<p>The actual type distribution in this domain across the 9takes corpus.</p>
					<span class="card-link">See the data →</span>
				</a>
			{:else}
				<a href="/pop-culture#dark-psychology" class="related-card">
					<span class="card-icon" aria-hidden="true">◆</span>
					<h3>Dark Psychology</h3>
					<p>Explore the shadow side of personality through famous cases.</p>
					<span class="card-link">View Articles →</span>
				</a>
				<a href="/pop-culture#celebrity-analysis" class="related-card">
					<span class="card-icon" aria-hidden="true">✦</span>
					<h3>Celebrity Analysis</h3>
					<p>Deep dives into the personalities of public figures.</p>
					<span class="card-link">View Articles →</span>
				</a>
			{/if}
		</div>
	</section>
</article>

<TestYourTypeCTA />

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType="Pop Culture" slugPrefix="pop-culture" />

{#if !authShell.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<!-- The beta card ("Want to try experimental therapy, 9takes style?") for every
     reader: a side card on wide screens, inside the article on narrower ones.
     It replaced the newsletter side card here on 2026-10-04. -->
{#key data.slug}
	<ExperimentalTherapyInvite surface="pop_culture" articleSelector=".article-content" />
{/key}

<style lang="scss">
	/* Pop Culture article (Cold Light). Body copy is --text-muted, headings and
	   strong are --text. Links, blockquotes and tables come from blog.scss,
	   which styles `.pop-culture-article .article-content` like `.blog`. */
	.pop-culture-article {
		color: var(--text-muted);
	}

	.article-header {
		margin-bottom: 2rem;

		&.dark-theme {
			padding: 2rem;
			background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
			border-radius: 1rem;
			border: 1px solid var(--rule);
			color: var(--text);

			:global(h1) {
				color: var(--text);
			}

			:global(.article-subtitle) {
				color: var(--text-muted);
			}
		}
	}

	.content-warning {
		background: var(--error-light);
		border: 1px solid var(--error);
		border-radius: 0.625rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
		color: var(--error-text);
		font-size: var(--font-size-sm);

		strong {
			color: var(--text);
		}
	}

	.article-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 1rem;

		/* Tags are metadata: Archivo uppercase labels on a hairline ring. */
		.tag {
			display: inline-block;
			padding: 0.3rem 0.75rem;
			background: transparent;
			color: var(--text-faint);
			border-radius: 999px;
			font-family: var(--font-talk);
			font-size: var(--font-size-xs);
			font-weight: 600;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			border: 1px solid var(--rule);
		}
	}

	.featured-image {
		display: flex;
		justify-content: center;
		margin: 1rem 0;

		&.dark-image {
			:global(img) {
				filter: brightness(0.9) contrast(1.1);
			}
		}
	}

	.article-content {
		/* Reading measure + 18px body (2026-06-09 design audit) — matches
		   .blog and the dossier .article-body. */
		max-width: var(--prose-measure);
		margin-inline: auto;
		font-size: var(--font-size-lg);
		margin-bottom: 2rem;
		line-height: 1.7;
		color: var(--text-muted);

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
			/* inherit the 18px reading size — the global `p { font-size: 1rem }`
			   in index.scss would otherwise pin paragraphs to 16px. */
			font-size: inherit;
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

		:global(strong) {
			font-weight: 600;
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

	.related-content {
		margin-top: 3rem;
		padding: 2.5rem;
		background: var(--surface);
		border-radius: 1rem;
		border: 1px solid var(--rule);

		.related-eyebrow {
			font-family: var(--font-talk);
			text-transform: uppercase;
			font-size: var(--font-size-xs);
			font-weight: 600;
			letter-spacing: 0.08em;
			color: var(--text-faint);
			text-align: center;
			margin-bottom: 0.25rem;
		}

		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			margin-bottom: 1.5rem;
			text-align: center;
			color: var(--text);
		}

		.related-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1rem;
		}

		.related-card {
			display: flex;
			flex-direction: column;
			padding: 1.5rem;
			background: var(--surface-raised);
			border-radius: 0.625rem;
			border: 1px solid var(--rule);
			text-decoration: none;
			color: inherit;
			transition:
				border-color 0.2s ease,
				background 0.2s ease,
				transform 0.2s ease;

			&:hover {
				border-color: color-mix(in srgb, var(--accent) 60%, transparent);
				background: color-mix(in srgb, var(--accent) 12%, var(--surface-raised));
				transform: translateY(-2px);

				.card-link {
					color: var(--text);
				}
			}

			.card-icon {
				font-size: 1.75rem;
				margin-bottom: 0.75rem;
				color: var(--text-faint);
			}

			h3 {
				font-size: var(--font-size-lg);
				font-weight: 600;
				margin-bottom: 0.5rem;
				color: var(--text);
			}

			p {
				font-size: var(--font-size-sm);
				line-height: 1.5;
				color: var(--text-muted);
				margin-bottom: 1rem;
				flex: 1;
			}

			/* Reads as the card's link: lavender, underlined. */
			.card-link {
				font-size: var(--font-size-sm);
				font-weight: 600;
				color: var(--highlight);
				text-decoration: underline;
				text-decoration-thickness: 1px;
				text-underline-offset: 3px;
				transition: color 0.2s ease;
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
		padding: 2rem;
		background: var(--surface);
		border-radius: 1rem;
		border: 1px solid var(--rule);
	}

	/* Mobile-specific styles */
	@media (max-width: 768px) {
		.article-header.dark-theme {
			padding: 1.5rem;
		}

		.article-content {
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
				/* was 0.95rem (15.2px) — below the 16px mobile floor.
				   Inherits the 18px reading size like .blog on mobile. */
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

		.related-content {
			padding: 1.5rem;

			h2 {
				font-size: var(--font-size-xl);
			}

			.related-grid {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
