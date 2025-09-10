<!-- src/routes/pop-culture/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const blogCategories = [
		{
			id: 'dark-psychology',
			title: 'Dark Psychology & Criminal Minds',
			subtitle: 'Explore the shadow side of personality through famous cases and scandals',
			icon: '🎭',
			featured: true
		},
		{
			id: 'celebrity-analysis',
			title: 'Celebrity Personality Deep Dives',
			subtitle: 'Psychological profiles of public figures through the Enneagram lens',
			icon: '⭐'
		},
		{
			id: 'fictional-characters',
			title: 'Fictional Character Analysis',
			subtitle: 'Understanding beloved characters from movies, TV, and literature',
			icon: '📺'
		},
		{
			id: 'cultural-phenomena',
			title: 'Cultural Movements & Trends',
			subtitle: 'How personality patterns shape societal movements and viral moments',
			icon: '🌍'
		},
		{
			id: 'power-politics',
			title: 'Power, Politics & Personality',
			subtitle: 'Analyzing leaders, scandals, and the psychology of power',
			icon: '⚡'
		},
		{
			id: 'creative-genius',
			title: 'Creative Genius & Madness',
			subtitle: 'The psychology behind artistic brilliance and self-destruction',
			icon: '🎨'
		}
	];

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"mainEntity": {
				"@type": "ItemList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Dark Psychology & Criminal Minds",
						"description": "Explore the Dark Triad traits through famous criminal cases and psychological profiles",
						"url": "https://9takes.com/pop-culture#dark-psychology"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Celebrity Personality Analysis",
						"description": "In-depth Enneagram analysis of celebrities, public figures, and their behaviors",
						"url": "https://9takes.com/pop-culture#celebrity-analysis"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Fictional Character Psychology",
						"description": "Enneagram typing and psychological analysis of characters from popular media",
						"url": "https://9takes.com/pop-culture#fictional-characters"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Cultural Phenomena Through Personality",
						"description": "Understanding viral trends, movements, and collective behavior patterns",
						"url": "https://9takes.com/pop-culture#cultural-phenomena"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Power and Politics Psychology",
						"description": "Analyzing political figures, scandals, and the psychology of leadership",
						"url": "https://9takes.com/pop-culture#power-politics"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Creative Genius and Mental Health",
						"description": "Exploring the link between creativity, personality types, and psychological struggles",
						"url": "https://9takes.com/pop-culture#creative-genius"
					}
				]
			},
			"name": "Pop Culture Psychology: Enneagram Analysis of Famous Figures & Cultural Phenomena",
			"description": "Deep psychological analysis of celebrities, criminals, fictional characters, and cultural movements through the Enneagram personality system. Explore the Dark Triad, famous scandals, and the psychology behind pop culture.",
			"url": "https://9takes.com/pop-culture",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Pop Culture Psychology",
						"item": "https://9takes.com/pop-culture"
					}
				]
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Pop Culture Psychology: Dark Triad, Celebrities & Criminal Minds | 9takes"
	description="Explore the psychology of pop culture through the Enneagram. From serial killers and the Dark Triad to celebrity breakdowns and fictional characters. Deep dives into famous scandals, criminal psychology, and cultural phenomena."
	canonical="https://9takes.com/pop-culture"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/pop-culture-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'dark triad, criminal psychology, celebrity psychology, enneagram pop culture, serial killers, personality disorders, famous scandals, narcissism, psychopathy, fictional characters, cultural psychology, celebrity mental health'
		},
		{ name: 'author', content: '9takes' },
		{ property: 'article:publisher', content: 'https://9takes.com' },
		{ property: 'og:site_name', content: '9takes' },
		{ property: 'og:locale', content: 'en_US' }
	]}
/>

<main class="pop-culture-page">
	<div class="hero-section">
		<h1>Pop Culture Through the Personality Lens</h1>
		<p class="hero-subtitle">
			Uncover the psychological patterns behind famous figures, fictional characters, and cultural
			phenomena. From the Dark Triad to creative genius, explore how personality shapes the stories
			that captivate us.
		</p>
	</div>

	<!-- Featured Section for Dark Psychology -->
	{#if data.popCultureBlogs.some((blog) => blog.slug.includes('dark-triad'))}
		<section class="featured-section" aria-labelledby="featured">
			<h2 id="featured">Featured: The Dark Side of Personality</h2>
			<div class="featured-grid">
				{#each data.popCultureBlogs
					.filter((blog) => blog.slug.includes('dark-triad'))
					.slice(0, 1) as blog}
					<article class="featured-item">
						<a href="/pop-culture/{blog.slug}" class="featured-link">
							<div
								class="featured-image"
								style={blog.pic ? `background-image: url(/blogs/${blog.pic}.webp);` : ''}
							>
								{#if !blog.pic}
									<div class="pattern-overlay"></div>
								{/if}
							</div>
							<div class="featured-content">
								<span class="featured-label">🔥 New Deep Dive</span>
								<h3>{blog.title}</h3>
								<p>{blog.description}</p>
								<span class="read-more">
									Read Full Analysis
									<ArrowRightIcon
										iconStyle={'margin-left: .5rem'}
										height={'1.2rem'}
										fill={'currentColor'}
									/>
								</span>
							</div>
						</a>
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Categories Navigation -->
	<nav aria-label="Content Categories" class="categories-nav">
		<h2>Explore Pop Culture Psychology</h2>
		<div class="category-grid">
			{#each blogCategories as category}
				<a href="#{category.id}" class="category-card" class:featured={category.featured}>
					<span class="category-icon">{category.icon}</span>
					<h3>{category.title}</h3>
					<p>{category.subtitle}</p>
				</a>
			{/each}
		</div>
	</nav>

	<!-- All Blog Posts -->
	<section class="all-posts" aria-labelledby="all-posts">
		<h2 id="all-posts">Latest Pop Culture Analyses</h2>
		<div class="blog-grid">
			{#each data.popCultureBlogs as blog}
				<article class="blog-card">
					<a href="/pop-culture/{blog.slug}" class="blog-link">
						{#if blog.pic}
							<div class="blog-image" style="background-image: url(/blogs/s-{blog.pic}.webp);">
								<div class="image-overlay"></div>
							</div>
						{:else}
							<div class="blog-image no-image">
								<div class="pattern-overlay"></div>
							</div>
						{/if}
						<div class="blog-content">
							<h3>{blog.title}</h3>
							<p>{blog.description}</p>
							<div class="blog-meta">
								<time datetime={blog.date}>
									{new Date(blog.date).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</time>
								<span class="read-time">• 8 min read</span>
							</div>
						</div>
					</a>
				</article>
			{/each}
		</div>
	</section>

	<!-- CTA Section -->
	<section class="cta-section">
		<div class="cta-content">
			<h2>Dive Deeper into Personality Psychology</h2>
			<p>
				Explore how the Enneagram reveals hidden patterns in pop culture, from criminal minds to
				creative genius.
			</p>
			<div class="cta-buttons">
				<a href="/enneagram-corner" class="cta-primary">Learn the Enneagram</a>
				<a href="/personality-analysis" class="cta-secondary">Famous People Analysis</a>
			</div>
		</div>
	</section>
</main>

<style lang="scss">
	.pop-culture-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;

		// Reset unwanted global styles
		article {
			margin: 0;
			padding: 0;
			border-radius: 0;
		}

		a {
			&::after {
				display: none;
			}
		}
	}

	.hero-section {
		text-align: center;
		margin-bottom: 4rem;
		padding: 3rem 0;

		h1 {
			font-size: 3rem;
			font-weight: 800;
			color: var(--neutral-800);
			margin-bottom: 1rem;
			line-height: 1.2;
			letter-spacing: -0.02em;

			@media (max-width: 768px) {
				font-size: 2.2rem;
			}
		}

		.hero-subtitle {
			font-size: 1.25rem;
			color: var(--neutral-600);
			max-width: 700px;
			margin: 0 auto;
			line-height: 1.6;

			@media (max-width: 768px) {
				font-size: 1.1rem;
			}
		}
	}

	.featured-section {
		margin-bottom: 4rem;

		h2 {
			font-size: 2rem;
			font-weight: 700;
			color: var(--neutral-800);
			margin-bottom: 2rem;
		}

		.featured-grid {
			display: grid;
			gap: 2rem;
		}

		.featured-item {
			background: white;
			border-radius: 20px;
			overflow: hidden;
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-5px);
				box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
			}
		}

		.featured-link {
			display: grid;
			grid-template-columns: 1fr 1.5fr;
			text-decoration: none;
			color: inherit;
			height: 100%;

			@media (max-width: 768px) {
				grid-template-columns: 1fr;
			}
		}

		.featured-image {
			background-size: cover;
			background-position: center;
			min-height: 300px;
			position: relative;

			@media (max-width: 768px) {
				min-height: 200px;
			}
		}

		.featured-content {
			padding: 2.5rem;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.featured-label {
				display: inline-block;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				padding: 0.5rem 1rem;
				border-radius: 20px;
				font-size: 0.85rem;
				font-weight: 600;
				margin-bottom: 1rem;
				width: fit-content;
			}

			h3 {
				font-size: 1.75rem;
				font-weight: 700;
				color: var(--neutral-800);
				margin-bottom: 1rem;
				line-height: 1.3;
			}

			p {
				color: var(--neutral-600);
				line-height: 1.6;
				margin-bottom: 1.5rem;
			}

			.read-more {
				color: #667eea;
				font-weight: 600;
				display: flex;
				align-items: center;
				transition: color 0.3s ease;

				&:hover {
					color: #764ba2;
				}
			}
		}
	}

	.categories-nav {
		margin-bottom: 4rem;

		h2 {
			font-size: 2rem;
			font-weight: 700;
			color: var(--neutral-800);
			margin-bottom: 2rem;
			text-align: center;
		}

		.category-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: 1.5rem;
		}

		.category-card {
			background: white;
			padding: 2rem;
			border-radius: 16px;
			text-decoration: none;
			color: inherit;
			border: 2px solid #e0e0e0;
			transition: all 0.3s ease;
			text-align: center;

			&:hover {
				transform: translateY(-3px);
				border-color: #667eea;
				box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
			}

			&.featured {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border-color: transparent;

				h3,
				p {
					color: white;
				}
			}

			.category-icon {
				font-size: 2.5rem;
				display: block;
				margin-bottom: 1rem;
			}

			h3 {
				font-size: 1.25rem;
				font-weight: 600;
				margin-bottom: 0.5rem;
				color: var(--neutral-800);
			}

			p {
				font-size: 0.95rem;
				color: var(--neutral-600);
				line-height: 1.4;
			}
		}
	}

	.all-posts {
		margin-bottom: 4rem;

		h2 {
			font-size: 2rem;
			font-weight: 700;
			color: var(--neutral-800);
			margin-bottom: 2rem;
		}

		.blog-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: 2rem;
		}

		.blog-card {
			background: white;
			border-radius: 16px;
			overflow: hidden;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-5px);
				box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);

				.blog-image::after {
					opacity: 0.7;
				}
			}
		}

		.blog-link {
			text-decoration: none;
			color: inherit;
			display: block;
		}

		.blog-image {
			height: 200px;
			background-size: cover;
			background-position: center;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				inset: 0;
				background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
				opacity: 0.5;
				transition: opacity 0.3s ease;
			}

			&.no-image {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			}
		}

		.pattern-overlay {
			position: absolute;
			inset: 0;
			background-image:
				linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
				linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%);
			background-size: 30px 30px;
		}

		.blog-content {
			padding: 1.5rem;

			h3 {
				font-size: 1.25rem;
				font-weight: 600;
				color: var(--neutral-800);
				margin-bottom: 0.75rem;
				line-height: 1.3;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			p {
				color: var(--neutral-600);
				line-height: 1.5;
				margin-bottom: 1rem;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.blog-meta {
				display: flex;
				align-items: center;
				font-size: 0.9rem;
				color: #95a5a6;

				time {
					font-weight: 500;
				}

				.read-time {
					margin-left: 0.5rem;
				}
			}
		}
	}

	.cta-section {
		background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
		border-radius: 20px;
		padding: 4rem;
		text-align: center;
		color: white;
		margin-top: 4rem;

		h2 {
			font-size: 2.5rem;
			font-weight: 700;
			margin-bottom: 1rem;
			color: white;
		}

		p {
			font-size: 1.2rem;
			margin-bottom: 2rem;
			opacity: 0.9;
		}

		.cta-buttons {
			display: flex;
			justify-content: center;
			gap: 1rem;
			flex-wrap: wrap;

			a {
				padding: 1rem 2rem;
				border-radius: 8px;
				text-decoration: none;
				font-weight: 600;
				transition: all 0.3s ease;

				&.cta-primary {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;

					&:hover {
						transform: scale(1.05);
						box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
					}
				}

				&.cta-secondary {
					background: transparent;
					color: white;
					border: 2px solid rgba(255, 255, 255, 0.3);

					&:hover {
						background: rgba(255, 255, 255, 0.1);
						border-color: rgba(255, 255, 255, 0.5);
					}
				}
			}
		}
	}

	@media (max-width: 768px) {
		.pop-culture-page {
			padding: 1rem;
		}

		.categories-nav .category-grid {
			grid-template-columns: 1fr;
		}

		.all-posts .blog-grid {
			grid-template-columns: 1fr;
		}

		.cta-section {
			padding: 2rem;

			h2 {
				font-size: 1.8rem;
			}
		}
	}
</style>
