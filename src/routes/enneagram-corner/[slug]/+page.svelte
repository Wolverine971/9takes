<!-- src/routes/enneagram-corner/[slug]/+page.svelte -->
<!--
  src/routes/enneagram-corner/[slug]/+page.svelte
  Phase 5 #6 of docs/design/2026-05-04-rollout-plan.md — blog reading layout.
  Mechanical pass: Svelte 5 runes + V5 tokens. Visual redesign is follow-up work.
  Spec: docs/design-system.md §4–§6.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
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

	let { data }: { data: PageData } = $props();
	type C = Component;
	let Article = $derived(data.component as unknown as C);

	const contentStore = writable('');

	// Detect enneagram type pages (enneagram-type-1 … enneagram-type-9). When
	// matched, the dossier card renders in place of the standard featured PopCard.
	const enneagramTypeMatch = $derived(/^enneagram-type-([1-9])$/.exec(data?.slug ?? ''));
	const dossierProfile = $derived(
		enneagramTypeMatch ? enneagramTypeProfiles[parseInt(enneagramTypeMatch[1], 10)] : null
	);

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

<article itemscope itemtype="https://schema.org/BlogPosting" style="" class="blog" id="blogA">
	<div class="article-header">
		<BlogPageHead data={data.frontmatter} slug={`enneagram-corner/${data.slug}`} />
		<ArticleTitle title={data.frontmatter.title} />
		<ArticleSubTitle metaData={data.frontmatter} />
		<meta itemprop="description" content={data.frontmatter.description} />
	</div>

	{#if dossierProfile}
		<div class="featured-dossier">
			<EnneagramTypeDossier {...dossierProfile} />
		</div>
	{:else if data?.frontmatter?.pic}
		<div
			class="featured-image"
			itemprop="image"
			itemscope
			itemtype="https://schema.org/ImageObject"
		>
			<meta itemprop="url" content={`https://9takes.com/blogs/${data.frontmatter.pic}.webp`} />
			<PopCard
				image={`/blogs/${data?.frontmatter?.pic}.webp`}
				showIcon={false}
				displayText=""
				altText={data?.frontmatter?.title || 'Enneagram article illustration'}
				subtext=""
				aspectRatio="1/1"
			/>
		</div>
	{/if}

	<TableOfContents {contentStore} headings={data.frontmatter.headings} />

	<div class="article-body" itemprop="articleBody">
		<Article />
	</div>

	<AuthorBio author={data.frontmatter.author} />
</article>

<TestYourTypeCTA secondaryHref="/corpus-stats" secondaryLabel="See the corpus stats" />

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType={'Enneagram'} slugPrefix={'enneagram-corner'} />

{#if !data?.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

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
		color: var(--ink-mid);

		/* Header styles for injected content */
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

		:global(a) {
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
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
		}

		:global(strong) {
			font-weight: 700;
			color: inherit;
		}

		:global(.text-white :not(a):not([class*='bg-'])) {
			color: inherit;
		}

		:global(code) {
			background-color: var(--stone-warm);
			color: var(--data-teal);
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

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid var(--stone-edge);
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
	}
</style>
