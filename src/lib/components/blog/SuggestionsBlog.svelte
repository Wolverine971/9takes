<!-- src/lib/components/blog/SuggestionsBlog.svelte -->
<script lang="ts">
	export let posts: App.BlogPost[];
	export let blogType: string;
	export let slugPrefix: string;
	let innerWidth: number;

	$: visiblePosts = posts.slice(0, innerWidth > 920 ? 10 : 6);

	// Generate ItemList JSON-LD for related articles
	$: itemListJsonLd = posts?.length
		? JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: `More ${blogType} Articles`,
				description: `Related ${blogType.toLowerCase()} articles and guides`,
				numberOfItems: posts.length,
				itemListElement: posts.slice(0, 10).map((post, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Article',
						name: post.title,
						description: post.description,
						url: `https://9takes.com/${slugPrefix}/${post.slug}`
					}
				}))
			})
		: '';
</script>

<svelte:head>
	{#if itemListJsonLd}
		{@html `<script type="application/ld+json">${itemListJsonLd}</script>`}
	{/if}
</svelte:head>

<svelte:window bind:innerWidth />

<section class="blog-suggestions" aria-labelledby="suggestions-title">
	<h2 id="suggestions-title" class="suggestions-title">More {blogType} Articles</h2>
	<ul class="blog-grid-container">
		{#each visiblePosts as blog (blog.slug)}
			<li class="grid-item">
				<a
					href="/{slugPrefix}/{blog.slug}"
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
		color: var(--text-color);
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
		background-color: var(--card-bg-color, rgba(255, 255, 255, 0.5));
		background-size: cover;
		background-position: center;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		overflow: hidden;
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover,
		&:focus {
			filter: sepia(100%) hue-rotate(160deg);
			border-color: var(--primary) !important;
			outline: none;
		}
	}

	.blog-content {
		height: 100%;
		padding: 1rem;
		background-color: rgba(255, 255, 255, 0.8);
		transition: background-color 0.3s ease;

		&.has-image {
			background-color: rgba(0, 0, 0, 0.6);
		}
	}

	.blog-title {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
		color: var(--text-color);

		.has-image & {
			color: white;
		}
	}

	.blog-description {
		font-size: 0.9rem;
		color: var(--text-color);

		.has-image & {
			color: white;
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
