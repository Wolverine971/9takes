<!-- src/routes/pop-culture/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
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
	import { getPopCultureBridges } from '$lib/data/popCultureBridges';
	import { getPersonalityCategoryBySlug } from '$lib/personalityCategories';
	let { data }: { data: PageData } = $props();
	type C = Component;
	let Article = $derived(data.component as unknown as C);

	// Bucket 3 — internal-linking bridges to type pillars, corpus stats, and
	// the matching personality-analysis category. Falls back to no-render
	// when the slug isn't mapped (e.g., an unpublished file rendered in dev).
	const bridges = $derived(getPopCultureBridges(data?.slug ?? ''));
	const bridgeCategory = $derived(bridges ? getPersonalityCategoryBySlug(bridges.category) : null);
	const TYPE_PILLAR_LABELS: Record<number, string> = {
		1: 'Type 1 — Perfectionist',
		2: 'Type 2 — Helper',
		3: 'Type 3 — Achiever',
		4: 'Type 4 — Individualist',
		5: 'Type 5 — Investigator',
		6: 'Type 6 — Loyalist',
		7: 'Type 7 — Enthusiast',
		8: 'Type 8 — Challenger',
		9: 'Type 9 — Peacemaker'
	};

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

	// Watch for slug changes and reinitialize observer
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
		const node = document.querySelector('#popCultureArticle');

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

	let isDarkContent = $derived(
		data?.slug?.includes('dark-triad') ||
			data?.slug?.includes('serial-killer') ||
			data?.slug?.includes('criminal') ||
			data?.frontmatter?.tags?.includes('dark-psychology')
	);
</script>

<article
	itemscope
	itemtype="https://schema.org/BlogPosting"
	class="pop-culture-article"
	id="popCultureArticle"
>
	<div class="article-header" class:dark-theme={isDarkContent}>
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
				{#each data.frontmatter.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			{/if}
		</div>
	</div>

	{#if data?.frontmatter?.picGroup}
		<div class="featured-image" class:dark-image={isDarkContent}>
			<PopCardGroup people={data.frontmatter.picGroup} />
		</div>
	{:else if data?.frontmatter?.pic}
		<div class="featured-image" class:dark-image={isDarkContent}>
			<PopCard
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText={data?.frontmatter?.title || ''}
				subtext=""
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents {contentStore} headings={data.frontmatter.headings} />

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
					<span class="card-icon">○</span>
					<h3>{TYPE_PILLAR_LABELS[bridges.type]}</h3>
					<p>The pillar profile for the type at the center of this analysis.</p>
					<span class="card-link">Read the type pillar →</span>
				</a>
				{#if bridges.secondaryType}
					<a
						href={`/enneagram-corner/enneagram-type-${bridges.secondaryType}`}
						class="related-card"
					>
						<span class="card-icon">◐</span>
						<h3>{TYPE_PILLAR_LABELS[bridges.secondaryType]}</h3>
						<p>The other type driving this dynamic — read it side-by-side.</p>
						<span class="card-link">Read the type pillar →</span>
					</a>
				{/if}
				{#if bridgeCategory}
					<a href={`/personality-analysis/categories/${bridgeCategory.slug}`} class="related-card">
						<span class="card-icon">◯</span>
						<h3>{bridgeCategory.label} profiles</h3>
						<p>Real-people personality breakdowns inside this same category.</p>
						<span class="card-link">Browse profiles →</span>
					</a>
				{/if}
				<a href={`/corpus-stats#domain-${bridges.corpusAnchor}`} class="related-card">
					<span class="card-icon">▦</span>
					<h3>Corpus stats — {bridgeCategory?.shortLabel ?? bridges.corpusAnchor}</h3>
					<p>The actual type distribution in this domain across the 9takes corpus.</p>
					<span class="card-link">See the data →</span>
				</a>
			{:else}
				<a href="/pop-culture#dark-psychology" class="related-card">
					<span class="card-icon">🎭</span>
					<h3>Dark Psychology</h3>
					<p>Explore the shadow side of personality through famous cases.</p>
					<span class="card-link">View Articles →</span>
				</a>
				<a href="/pop-culture#celebrity-analysis" class="related-card">
					<span class="card-icon">⭐</span>
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

<SuggestionsBlog posts={data?.posts} blogType={'Pop Culture'} slugPrefix={'pop-culture'} />

{#if !data?.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<style lang="scss">
	/* 9takes Warm Tech Theme - Pop Culture Article */
	.pop-culture-article {
		color: var(--neutral-700);
	}

	.article-header {
		margin-bottom: 2rem;

		&.dark-theme {
			padding: 2rem;
			background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
			border-radius: 16px;
			border: 1px solid rgba(45, 212, 191, 0.2);
			color: var(--ink-bright);

			:global(h1) {
				color: var(--ink-bright) !important;
			}

			:global(.article-subtitle) {
				color: var(--ink-mid) !important;
			}
		}
	}

	.content-warning {
		background: rgba(239, 68, 68, 0.15);
		border: 2px solid #ef4444;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1.5rem;
		color: #f87171;
		font-size: 0.95rem;

		strong {
			color: #fca5a5;
		}
	}

	.article-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 1rem;

		.tag {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			background: rgba(45, 212, 191, 0.15);
			color: var(--lamp-glow);
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 500;
			border: 1px solid rgba(45, 212, 191, 0.3);
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
		margin-bottom: 2rem;
		line-height: 1.7;
		color: var(--neutral-700);

		:global(h2) {
			font-size: 1.75rem;
			font-weight: 600;
			color: var(--ink-bright);
			margin-top: 2rem;
			margin-bottom: 1rem;
			padding-top: 1rem;
			line-height: 1.3;
		}

		:global(h3) {
			font-size: 1.35rem;
			font-weight: 600;
			color: var(--ink-bright);
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			line-height: 1.35;
		}

		:global(h4) {
			font-size: 1.15rem;
			font-weight: 600;
			color: var(--ink-bright);
			margin-top: 1.25rem;
			margin-bottom: 0.5rem;
			line-height: 1.4;
		}

		:global(p) {
			margin-bottom: 1.2rem;
			color: var(--neutral-700);
		}

		:global(ul),
		:global(ol) {
			margin: 1rem 0;
			padding-left: 1.5rem;
			color: var(--neutral-700);
		}

		:global(li) {
			margin-bottom: 0.5rem;
			line-height: 1.6;
		}

		:global(a) {
			color: var(--lamp-glow);
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: var(--lamp-glow);
				text-decoration: underline;
			}
		}

		:global(blockquote) {
			margin: 1.5rem 0;
			padding: 1rem 1.5rem;
			border-left: 4px solid var(--lamp-glow);
			background-color: var(--stone-warm);
			font-style: italic;
			color: var(--ink-mid);
			border-radius: 0 8px 8px 0;
		}

		:global(blockquote p) {
			margin-bottom: 0;
			color: var(--ink-mid);
		}

		:global(strong) {
			font-weight: 600;
			color: var(--ink-bright);
		}

		:global(code) {
			background-color: var(--stone-warm);
			color: var(--lamp-glow);
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-size: 0.9em;
		}

		:global(pre) {
			background-color: var(--night-deep);
			border: 1px solid var(--stone-edge);
			border-radius: 8px;
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
		background: var(--stone-warm);
		border-radius: 16px;
		border: 1px solid rgba(45, 212, 191, 0.25);

		.related-eyebrow {
			text-transform: uppercase;
			font-size: 0.75rem;
			font-weight: 700;
			letter-spacing: 0.1em;
			color: var(--lamp-glow);
			text-align: center;
			margin-bottom: 0.25rem;
		}

		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			margin-bottom: 1.5rem;
			text-align: center;
			color: var(--ink-bright);
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
			background: rgba(45, 212, 191, 0.08);
			border-radius: 12px;
			border: 1px solid rgba(45, 212, 191, 0.15);
			text-decoration: none;
			color: inherit;
			transition:
				border-color 0.2s ease,
				background 0.2s ease,
				transform 0.2s ease;

			&:hover {
				border-color: rgba(45, 212, 191, 0.5);
				background: rgba(45, 212, 191, 0.14);
				transform: translateY(-2px);

				.card-link {
					color: var(--lamp-glow);
				}
			}

			.card-icon {
				font-size: 1.75rem;
				margin-bottom: 0.75rem;
			}

			h3 {
				font-size: 1.1rem;
				font-weight: 600;
				margin-bottom: 0.5rem;
				color: var(--ink-bright);
			}

			p {
				font-size: 0.9rem;
				line-height: 1.5;
				color: var(--ink-mid);
				margin-bottom: 1rem;
				flex: 1;
			}

			.card-link {
				font-size: 0.85rem;
				font-weight: 600;
				color: var(--lamp-glow);
				transition: color 0.2s ease;
			}
		}
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
	}

	.join {
		margin-top: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		border-radius: 1rem;
		border: 1px solid rgba(45, 212, 191, 0.2);
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
				font-size: 0.95rem;
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
				font-size: 1.25rem;
			}

			.related-grid {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
