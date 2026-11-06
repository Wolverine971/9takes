<!-- src/lib/components/blog/SuggestionsBlog.svelte -->
<script lang="ts">
	import { serializeJsonLd } from '$lib/utils/jsonLd';

	interface Props {
		posts?: App.BlogPost[];
		blogType?: string;
		slugPrefix?: string;
	}

	let { posts = [], blogType = '', slugPrefix = '' }: Props = $props();
	let innerWidth = $state(0);

	const normalizeSlugPrefix = (value: string | undefined): string =>
		value ? value.replace(/^\/+|\/+$/g, '') : '';
	const SITE_ORIGIN = 'https://9takes.com';
	// Prefer the post's canonical `loc` so nested posts (e.g. mental-health/)
	// don't link through a 301; fall back to prefix + slug.
	const buildBlogPath = (prefix: string, post: App.BlogPost): string => {
		if (typeof post.loc === 'string' && post.loc.startsWith(`${SITE_ORIGIN}/`)) {
			return post.loc.slice(SITE_ORIGIN.length);
		}
		return prefix ? `/${prefix}/${post.slug}` : `/${post.slug}`;
	};
	const buildBlogUrl = (prefix: string, post: App.BlogPost): string =>
		`${SITE_ORIGIN}${buildBlogPath(prefix, post)}`;

	let resolvedPosts = $derived(Array.isArray(posts) ? posts : []);
	let normalizedSlugPrefix = $derived(normalizeSlugPrefix(slugPrefix));
	let blogTypeLabel = $derived((blogType || '').trim() || 'Blog');
	let blogTypeLower = $derived(blogTypeLabel.toLowerCase());
	let visiblePosts = $derived(resolvedPosts.slice(0, innerWidth > 920 ? 10 : 6));
	let itemListPosts = $derived(resolvedPosts.slice(0, 10));

	// Generate ItemList JSON-LD for related articles
	let itemListJsonLd = $derived(
		resolvedPosts.length
			? serializeJsonLd({
					'@context': 'https://schema.org',
					'@type': 'ItemList',
					name: `More ${blogTypeLabel} Articles`,
					description: `Related ${blogTypeLower} articles and guides`,
					numberOfItems: itemListPosts.length,
					itemListElement: itemListPosts.map((post, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						item: {
							'@type': 'Article',
							name: post.title,
							description: post.description,
							url: buildBlogUrl(normalizedSlugPrefix, post)
						}
					}))
				})
			: ''
	);
	// Escaping now happens in serializeJsonLd above.
	let safeItemListJsonLd = $derived(itemListJsonLd);
</script>

<svelte:head>
	{#if safeItemListJsonLd}
		{@html `<script type="application/ld+json">${safeItemListJsonLd}</script>`}
	{/if}
</svelte:head>

<svelte:window bind:innerWidth />

<section class="blog-suggestions" aria-labelledby="suggestions-title">
	<h2 id="suggestions-title" class="suggestions-title">More {blogTypeLabel} Articles</h2>
	<ul class="blog-grid-container">
		{#each visiblePosts as blog (blog.slug)}
			<li class="grid-item">
				<a
					href={buildBlogPath(normalizedSlugPrefix, blog)}
					class="blog-link"
					style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}
					data-sveltekit-preload-data="tap"
					aria-labelledby="title-{blog.slug}"
				>
					<div class="blog-content {blog.pic ? 'has-image' : ''}">
						<h3 id="title-{blog.slug}" class="blog-title">
							{blog.title}
						</h3>
						<p class="blog-description">{blog.description}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	.blog-suggestions {
		margin-bottom: 5rem;
	}

	.suggestions-title {
		text-align: center;
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.blog-grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
		list-style-type: none;
		padding: 0;
	}

	.grid-item {
		break-inside: avoid;
		page-break-inside: avoid;
	}

	.blog-link {
		display: block;
		height: 100%;
		min-height: 200px;
		background-color: var(--surface);
		background-size: cover;
		background-position: center;
		border: 1px solid var(--rule);
		border-radius: 1rem;
		overflow: hidden;
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover,
		&:focus-visible {
			border-color: color-mix(in srgb, var(--accent) 70%, transparent);
			box-shadow: 0 0 25px color-mix(in srgb, var(--accent) 35%, transparent);
			transform: translateY(-3px);
		}

		/* Keyboard focus keeps the lavender ring (never indigo). */
		&:focus-visible {
			outline: 2px solid var(--focus);
			outline-offset: 2px;
		}
	}

	.blog-content {
		height: 100%;
		padding: 1rem;
		background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
		transition: background 0.3s ease;

		&.has-image {
			background: linear-gradient(
				to top,
				var(--image-overlay-strong) 0%,
				var(--image-overlay-medium) 45%,
				var(--image-overlay-soft) 100%
			);
		}
	}

	.blog-title {
		font-family: var(--font-talk);
		font-size: var(--font-size-xl);
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--text);

		.has-image & {
			color: var(--text-on-image);
		}
	}

	.blog-description {
		font-size: var(--font-size-sm);
		color: var(--text-muted);

		.has-image & {
			color: var(--text-on-image-muted);
		}
	}

	@media (max-width: 768px) {
		.blog-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}

		.blog-title {
			font-size: var(--font-size-base);
		}

		.blog-description {
			font-size: var(--font-size-xs);
		}
	}
</style>
