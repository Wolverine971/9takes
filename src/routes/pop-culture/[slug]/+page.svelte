<!-- src/routes/pop-culture/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import type { PageData } from './$types';
	import type { Component } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
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
		const node = document.querySelector('#popCultureArticle');

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

	// Determine if this is a dark/crime-related post
	$: isDarkContent =
		data?.slug?.includes('dark-triad') ||
		data?.slug?.includes('serial-killer') ||
		data?.slug?.includes('criminal') ||
		data?.frontmatter?.tags?.includes('dark-psychology');
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

	{#if data?.frontmatter?.pic}
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

	<TableOfContents {contentStore} />

	<div class="article-content">
		<svelte:component this={component} />
	</div>

	<!-- Related Content Section -->
	<section class="related-content">
		<h2>Explore More Pop Culture Psychology</h2>
		<div class="related-grid">
			<div class="related-card">
				<h3>🎭 Dark Psychology</h3>
				<p>Explore the shadow side of personality through famous cases.</p>
				<a href="/pop-culture#dark-psychology">View Articles →</a>
			</div>
			<div class="related-card">
				<h3>⭐ Celebrity Analysis</h3>
				<p>Deep dives into the personalities of public figures.</p>
				<a href="/pop-culture#celebrity-analysis">View Articles →</a>
			</div>
		</div>
	</section>
</article>

<hr class="section-divider" />

<SuggestionsBlog posts={data?.posts} blogType={'Pop Culture'} slugPrefix={'pop-culture'} />

{#if !data?.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

<style lang="scss">
	/* Solo Leveling Dark Theme - Pop Culture Article */
	.pop-culture-article {
		color: #cbd5e1;
	}

	.article-header {
		margin-bottom: 2rem;

		&.dark-theme {
			padding: 2rem;
			background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
			border-radius: 16px;
			border: 1px solid rgba(124, 58, 237, 0.2);
			color: white;

			:global(h1) {
				color: #f1f5f9 !important;
			}

			:global(.article-subtitle) {
				color: #94a3b8 !important;
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
			background: rgba(124, 58, 237, 0.15);
			color: #a78bfa;
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 500;
			border: 1px solid rgba(124, 58, 237, 0.3);
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
		color: #cbd5e1;

		:global(h2) {
			font-size: 1.75rem;
			font-weight: 600;
			color: #f1f5f9;
			margin-top: 2rem;
			margin-bottom: 1rem;
			padding-top: 1rem;
			line-height: 1.3;
		}

		:global(h3) {
			font-size: 1.35rem;
			font-weight: 600;
			color: #f1f5f9;
			margin-top: 1.5rem;
			margin-bottom: 0.75rem;
			line-height: 1.35;
		}

		:global(h4) {
			font-size: 1.15rem;
			font-weight: 600;
			color: #f1f5f9;
			margin-top: 1.25rem;
			margin-bottom: 0.5rem;
			line-height: 1.4;
		}

		:global(p) {
			margin-bottom: 1.2rem;
			color: #cbd5e1;
		}

		:global(ul),
		:global(ol) {
			margin: 1rem 0;
			padding-left: 1.5rem;
			color: #cbd5e1;
		}

		:global(li) {
			margin-bottom: 0.5rem;
			line-height: 1.6;
		}

		:global(a) {
			color: #a78bfa;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: #c4b5fd;
				text-decoration: underline;
			}
		}

		:global(blockquote) {
			margin: 1.5rem 0;
			padding: 1rem 1.5rem;
			border-left: 4px solid #7c3aed;
			background-color: #1a1a2e;
			font-style: italic;
			color: #94a3b8;
			border-radius: 0 8px 8px 0;
		}

		:global(blockquote p) {
			margin-bottom: 0;
			color: #94a3b8;
		}

		:global(strong) {
			font-weight: 600;
			color: #f1f5f9;
		}

		:global(code) {
			background-color: #252538;
			color: #a78bfa;
			padding: 0.2rem 0.4rem;
			border-radius: 4px;
			font-size: 0.9em;
		}

		:global(pre) {
			background-color: #0a0a0f;
			border: 1px solid rgba(100, 116, 139, 0.3);
			border-radius: 8px;
			padding: 1rem;
			overflow-x: auto;

			:global(code) {
				background: none;
				padding: 0;
			}
		}

		:global(.section-content) {
			background: #1a1a2e;
			border-radius: 12px;
			padding: 2rem;
			margin: 2rem 0;
			border: 1px solid rgba(124, 58, 237, 0.2);
		}
	}

	.related-content {
		margin-top: 4rem;
		padding: 3rem;
		background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
		border-radius: 20px;
		color: white;

		h2 {
			font-size: 2rem;
			margin-bottom: 2rem;
			text-align: center;
			color: white;
		}

		.related-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1.5rem;
		}

		.related-card {
			background: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(10px);
			padding: 1.5rem;
			border-radius: 12px;
			border: 1px solid rgba(255, 255, 255, 0.2);

			h3 {
				font-size: 1.25rem;
				margin-bottom: 0.75rem;
				color: white;
			}

			p {
				margin-bottom: 1rem;
				opacity: 0.9;
				line-height: 1.5;
			}

			a {
				color: white;
				font-weight: 600;
				text-decoration: none;
				display: inline-flex;
				align-items: center;
				transition: transform 0.2s ease;

				&:hover {
					transform: translateX(5px);
				}
			}
		}
	}

	.section-divider {
		margin: 5rem 0;
		border: 0;
		border-top: 1px solid rgba(100, 116, 139, 0.3);
	}

	.join {
		margin-top: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-radius: 1rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
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
			padding: 2rem 1.5rem;

			.related-grid {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
