<!-- src/routes/pop-culture/[slug]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import type { PageData } from './$types';
	import type { SvelteComponent } from 'svelte';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleSubTitle from '$lib/components/blog/ArticleSubTitle.svelte';
	import SuggestionsBlog from '$lib/components/blog/SuggestionsBlog.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: PageData;
	type C = $$Generic<typeof SvelteComponent<any, any, any>>;
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
	.pop-culture-article {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.article-header {
		margin-bottom: 2rem;

		&.dark-theme {
			padding: 2rem;
			background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
			border-radius: 16px;
			color: white;

			:global(h1) {
				color: white !important;
			}

			:global(.article-subtitle) {
				color: rgba(255, 255, 255, 0.8) !important;
			}
		}
	}

	.content-warning {
		background: rgba(232, 67, 147, 0.1);
		border: 2px solid var(--error);
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1.5rem;
		color: var(--error-700);
		font-size: 0.95rem;

		.dark-theme & {
			background: rgba(232, 67, 147, 0.2);
			color: var(--error-light);
			border-color: var(--error);
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
			background: rgba(var(--accent-rgb), 0.12);
			color: var(--primary);
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 500;

			.dark-theme & {
				background: rgba(255, 255, 255, 0.1);
				color: rgba(255, 255, 255, 0.9);
			}
		}
	}

	.featured-image {
		display: flex;
		justify-content: center;
		margin: 2rem 0;

		&.dark-image {
			:global(img) {
				filter: brightness(0.9) contrast(1.1);
			}
		}
	}

	.article-content {
		:global(h2) {
			margin-top: 3rem;
			margin-bottom: 1.5rem;
			font-size: 1.875rem;
			font-weight: 700;
			color: var(--neutral-800);
		}

		:global(h3) {
			margin-top: 2rem;
			margin-bottom: 1rem;
			font-size: 1.5rem;
			font-weight: 600;
			color: var(--neutral-800);
		}

		:global(p) {
			line-height: 1.7;
			margin-bottom: 1.25rem;
			color: var(--text-secondary);
		}

		:global(blockquote) {
			border-left: 4px solid var(--primary-700);
			padding-left: 1.5rem;
			margin: 2rem 0;
			font-style: italic;
			color: var(--neutral-600);
		}

		:global(ul),
		:global(ol) {
			margin: 1.5rem 0;
			padding-left: 2rem;

			:global(li) {
				margin-bottom: 0.75rem;
				line-height: 1.7;
			}
		}

		:global(.section-content) {
			background: var(--neutral-50);
			border-radius: 12px;
			padding: 2rem;
			margin: 2rem 0;
		}
	}

	.related-content {
		margin-top: 4rem;
		padding: 3rem;
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
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
		margin: 4rem 0;
		border: 0;
		height: 1px;
		background: linear-gradient(to right, transparent, var(--neutral-200), transparent);
	}

	.join {
		margin: 3rem 0;
		padding: 2rem;
		background: var(--neutral-50);
		border-radius: 16px;
	}

	@media (max-width: 768px) {
		.pop-culture-article {
			padding: 1rem;
		}

		.article-header.dark-theme {
			padding: 1.5rem;
		}

		.related-content {
			padding: 2rem 1.5rem;

			.related-grid {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
