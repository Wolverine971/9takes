<!-- src/lib/components/blog/SuggestionsBlog.svelte -->
<script lang="ts">
	export let posts: App.BlogPost[] = [];
	export let blogType = '';
	export let slugPrefix = '';
	let innerWidth = 0;

	const normalizeSlugPrefix = (value: string | undefined): string =>
		value ? value.replace(/^\/+|\/+$/g, '') : '';
	const buildBlogPath = (prefix: string, slug: string): string =>
		prefix ? `/${prefix}/${slug}` : `/${slug}`;
	const buildBlogUrl = (prefix: string, slug: string): string =>
		`https://9takes.com${buildBlogPath(prefix, slug)}`;

	$: resolvedPosts = Array.isArray(posts) ? posts : [];
	$: normalizedSlugPrefix = normalizeSlugPrefix(slugPrefix);
	$: blogTypeLabel = (blogType || '').trim() || 'Blog';
	$: blogTypeLower = blogTypeLabel.toLowerCase();
	$: visiblePosts = resolvedPosts.slice(0, innerWidth > 920 ? 10 : 6);
	$: itemListPosts = resolvedPosts.slice(0, 10);

	// Generate ItemList JSON-LD for related articles
	$: itemListJsonLd = resolvedPosts.length
		? JSON.stringify({
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
						url: buildBlogUrl(normalizedSlugPrefix, post.slug)
					}
				}))
			})
		: '';
	$: safeItemListJsonLd = itemListJsonLd
		? itemListJsonLd.replace(/<\/script>/gi, '<\\/script>')
		: '';
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
					href={buildBlogPath(normalizedSlugPrefix, blog.slug)}
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
		color: #f1f5f9;
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
		background-color: #1a1a2e;
		background-size: cover;
		background-position: center;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover,
		&:focus {
			border-color: #7c3aed;
			box-shadow: 0 0 25px rgba(124, 58, 237, 0.3);
			outline: none;
			transform: translateY(-3px);
		}
	}

	.blog-content {
		height: 100%;
		padding: 1rem;
		background-color: rgba(10, 10, 15, 0.85);
		transition: background-color 0.3s ease;

		&.has-image {
			background-color: rgba(10, 10, 15, 0.75);
		}
	}

	.blog-title {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
		color: #f1f5f9;

		.has-image & {
			color: #f1f5f9;
		}
	}

	.blog-description {
		font-size: 0.9rem;
		color: #94a3b8;

		.has-image & {
			color: #cbd5e1;
		}
	}

	@media (max-width: 768px) {
		.blog-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}

		.blog-title {
			font-size: 1rem;
		}

		.blog-description {
			font-size: 0.8rem;
		}
	}
</style>
