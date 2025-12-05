<!-- src/routes/pop-culture/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const blogCategories = [
		{
			id: 'dark-psychology',
			title: 'Dark Psychology',
			subtitle: 'Shadow personality & criminal minds',
			icon: '🎭'
		},
		{
			id: 'celebrity-analysis',
			title: 'Celebrities',
			subtitle: 'Psychological profiles',
			icon: '⭐'
		},
		{
			id: 'cultural-phenomena',
			title: 'Culture',
			subtitle: 'Trends & movements',
			icon: '🌍'
		},
		{
			id: 'power-politics',
			title: 'Power',
			subtitle: 'Politics & leadership',
			icon: '⚡'
		},
		{
			id: 'creative-genius',
			title: 'Creativity',
			subtitle: 'Genius & madness',
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
						"name": "Cultural Phenomena Through Personality",
						"description": "Understanding viral trends, movements, and collective behavior patterns",
						"url": "https://9takes.com/pop-culture#cultural-phenomena"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Power and Politics Psychology",
						"description": "Analyzing political figures, scandals, and the psychology of leadership",
						"url": "https://9takes.com/pop-culture#power-politics"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Creative Genius and Mental Health",
						"description": "Exploring the link between creativity, personality types, and psychological struggles",
						"url": "https://9takes.com/pop-culture#creative-genius"
					}
				]
			},
			"name": "Pop Culture Psychology: Enneagram Analysis of Famous Figures & Cultural Phenomena",
			"description": "Deep psychological analysis of celebrities, criminals, and cultural movements through the Enneagram personality system. Explore the Dark Triad, famous scandals, and the psychology behind pop culture.",
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
				'dark triad, criminal psychology, celebrity psychology, enneagram pop culture, serial killers, personality disorders, famous scandals, narcissism, psychopathy, cultural psychology, celebrity mental health'
		},
		{ name: 'author', content: '9takes' },
		{ property: 'article:publisher', content: 'https://9takes.com' },
		{ property: 'og:site_name', content: '9takes' },
		{ property: 'og:locale', content: 'en_US' }
	]}
/>

<div class="page-wrapper">
	<!-- Hero Section -->
	<header class="hero">
		<h1>Pop Culture Psychology</h1>
	</header>

	<!-- Quick Navigation -->
	<nav class="quick-nav" aria-label="Topic Navigation">
		<div class="nav-scroll">
			{#each blogCategories as category}
				<a href="#{category.id}" class="nav-pill">
					<span class="nav-icon">{category.icon}</span>
					<span class="nav-text">{category.title}</span>
				</a>
			{/each}
		</div>
	</nav>

	<main class="main-content">
		<!-- Featured Section -->
		{#if data.popCultureBlogs.some((blog) => blog.slug.includes('dark-triad'))}
			<section class="content-section" id="featured">
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-icon">🔥</span>
						<div>
							<h2>Featured</h2>
							<p class="section-subtitle">The dark side of personality</p>
						</div>
					</div>
				</div>

				<div class="featured-grid">
					{#each data.popCultureBlogs
						.filter((blog) => blog.slug.includes('dark-triad'))
						.slice(0, 1) as blog}
						<a href="/pop-culture/{blog.slug}" class="featured-card">
							{#if blog.pic}
								<div
									class="featured-image"
									style={`background-image: url(/blogs/${blog.pic}.webp);`}
								></div>
							{/if}
							<div class="featured-overlay"></div>
							<div class="featured-content">
								<span class="featured-badge">Deep Dive</span>
								<h3>{blog.title}</h3>
								<p>{blog.description}</p>
								<span class="read-more">
									Read Analysis
									<ArrowRightIcon
										iconStyle={'margin-left: 0.25rem'}
										height={'1rem'}
										fill={'currentColor'}
									/>
								</span>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- All Blog Posts -->
		<section class="content-section" id="all-posts">
			<div class="section-header">
				<div class="section-title-group">
					<span class="section-icon">📚</span>
					<div>
						<h2>All Analyses</h2>
						<p class="section-subtitle">Deep dives into pop culture psychology</p>
					</div>
				</div>
			</div>

			<div class="blog-grid">
				{#each data.popCultureBlogs as blog}
					<a
						href="/pop-culture/{blog.slug}"
						class="blog-card"
						class:has-image={blog.pic}
						data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
					>
						{#if blog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{blog.title}</h3>
							{#if blog.description}
								<p>{blog.description}</p>
							{/if}
							<time datetime={blog.date}>
								{new Date(blog.date).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</time>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- CTA Section -->
		<section class="cta-section">
			<div class="cta-content">
				<h2>Dive deeper into personality</h2>
				<p>
					Explore how the Enneagram reveals hidden patterns in pop culture, from criminal minds to
					creative genius.
				</p>
				<div class="cta-buttons">
					<a href="/enneagram-corner" class="btn-primary">Learn the Enneagram</a>
					<a href="/personality-analysis" class="btn-secondary">Famous People</a>
				</div>
			</div>
		</section>
	</main>
</div>

<style lang="scss">
	.page-wrapper {
		min-height: 100vh;
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 1rem;
		text-align: center;
	}

	.hero h1 {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}

	/* Quick Navigation */
	.quick-nav {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 1.5rem;
	}

	.nav-scroll {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
		scrollbar-width: none;
		justify-content: center;
		flex-wrap: wrap;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.nav-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: var(--lightest-gray);
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid transparent;

		&:hover {
			background: var(--darkest-gray);
			color: white;
			border-color: var(--darkest-gray);
			transform: translateY(-1px);
		}
	}

	.nav-icon {
		font-size: 1rem;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 4rem;
		scroll-margin-top: 120px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.section-title-group {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.section-icon {
		font-size: 1.5rem;
		margin-top: 0.25rem;
	}

	.section-title-group h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0.25rem 0 0;
	}

	/* Featured Card */
	.featured-grid {
		display: grid;
		gap: 1rem;
	}

	.featured-card {
		position: relative;
		border-radius: 16px;
		overflow: hidden;
		background: linear-gradient(135deg, var(--darkest-gray) 0%, var(--black) 100%);
		text-decoration: none;
		transition: all 0.3s ease;
		min-height: 300px;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);

			.featured-image {
				transform: scale(1.05);
			}
		}
	}

	.featured-image {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		transition: transform 0.4s ease;
	}

	.featured-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.9) 0%,
			rgba(0, 0, 0, 0.5) 50%,
			rgba(0, 0, 0, 0.2) 100%
		);
	}

	.featured-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 2rem;
		color: white;

		h3 {
			font-size: 1.5rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0 0 0.75rem;
		}

		p {
			font-size: 1rem;
			line-height: 1.6;
			opacity: 0.9;
			margin: 0 0 1rem;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	.featured-badge {
		display: inline-block;
		padding: 0.375rem 0.75rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2rem;
		font-size: 0.75rem;
		font-weight: 600;
		margin-bottom: 1rem;
		width: fit-content;
	}

	.read-more {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		opacity: 0.9;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 1;
		}
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	/* Blog Cards */
	.blog-card {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 12px;
		overflow: hidden;
		background: linear-gradient(135deg, var(--darkest-gray) 0%, var(--black) 100%);
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);

			.card-image {
				transform: scale(1.05);
			}
		}

		&.has-image {
			.card-overlay {
				background: linear-gradient(
					to top,
					rgba(0, 0, 0, 0.85) 0%,
					rgba(0, 0, 0, 0.4) 50%,
					rgba(0, 0, 0, 0.1) 100%
				);
			}
		}
	}

	.card-image {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		transition: transform 0.4s ease;
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(42, 45, 52, 0.9) 0%, rgba(24, 25, 26, 0.9) 100%);
	}

	.card-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.25rem;
		color: white;

		h3 {
			font-size: 1rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.8rem;
			line-height: 1.5;
			opacity: 0.85;
			margin: 0.5rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		time {
			font-size: 0.75rem;
			opacity: 0.7;
			margin-top: 0.5rem;
		}
	}

	/* CTA Section */
	.cta-section {
		background: linear-gradient(135deg, var(--darkest-gray) 0%, var(--black) 100%);
		border-radius: 20px;
		padding: 3rem 2rem;
		text-align: center;
		color: white;
	}

	.cta-content {
		max-width: 600px;
		margin: 0 auto;

		h2 {
			font-size: 1.75rem;
			font-weight: 700;
			margin: 0 0 1rem;
		}

		p {
			font-size: 1rem;
			opacity: 0.85;
			line-height: 1.6;
			margin: 0 0 2rem;
		}
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		padding: 0.875rem 1.5rem;
		background: white;
		color: var(--darkest-gray);
		font-weight: 600;
		font-size: 0.9rem;
		border-radius: 2rem;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: var(--lightest-gray);
			transform: translateY(-2px);
		}
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.875rem 1.5rem;
		background: transparent;
		color: white;
		font-weight: 600;
		font-size: 0.9rem;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.5);
		}
	}

	/* Responsive */
	@media (max-width: 900px) {
		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 1.25rem 0.75rem 0.75rem;
		}

		.hero h1 {
			font-size: 1.35rem;
		}

		.quick-nav {
			padding: 0 0.75rem 1rem;
		}

		.nav-pill {
			padding: 0.4rem 0.75rem;
			font-size: 0.75rem;
		}

		.nav-icon {
			font-size: 0.875rem;
		}

		.main-content {
			padding: 1rem 0.75rem 2rem;
		}

		.content-section {
			margin-bottom: 2rem;
			scroll-margin-top: 100px;
		}

		.section-header {
			margin-bottom: 1rem;
		}

		.section-icon {
			font-size: 1.25rem;
		}

		.section-title-group h2 {
			font-size: 1.1rem;
		}

		.section-subtitle {
			font-size: 0.8rem;
		}

		.featured-card {
			min-height: 250px;
		}

		.featured-content {
			padding: 1.25rem;

			h3 {
				font-size: 1.25rem;
			}

			p {
				font-size: 0.875rem;
			}
		}

		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.blog-card {
			aspect-ratio: 1;
			border-radius: 8px;
		}

		.card-content {
			padding: 0.75rem;

			h3 {
				font-size: 0.8rem;
				-webkit-line-clamp: 2;
				line-clamp: 2;
			}

			p {
				display: none;
			}

			time {
				display: none;
			}
		}

		.cta-section {
			padding: 1.5rem 1rem;
			border-radius: 12px;
			margin-top: 1rem;
		}

		.cta-content h2 {
			font-size: 1.25rem;
		}

		.cta-content p {
			font-size: 0.875rem;
			margin-bottom: 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
		}

		.btn-primary,
		.btn-secondary {
			padding: 0.75rem 1.25rem;
			font-size: 0.85rem;
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.2rem;
		}

		.nav-pill {
			padding: 0.35rem 0.5rem;
		}

		.nav-text {
			display: none;
		}

		.blog-grid {
			gap: 0.4rem;
		}

		.card-content {
			padding: 0.5rem;

			h3 {
				font-size: 0.7rem;
			}
		}
	}
</style>
