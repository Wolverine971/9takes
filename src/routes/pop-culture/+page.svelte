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
	/* Solo Leveling Dark Theme - Pop Culture */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 1.5rem;
		text-align: center;
		position: relative;
	}

	.hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 300px;
		height: 150px;
		background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		color: #f1f5f9;
		position: relative;
		background: linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Quick Navigation */
	.quick-nav {
		background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.95) 100%);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(124, 58, 237, 0.15);
		padding: 0.75rem 0;
		margin-bottom: 1rem;
	}

	.nav-scroll {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		padding: 0.5rem 1.5rem;
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
		padding: 0.5rem 1rem;
		background: rgba(26, 26, 46, 0.6);
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #94a3b8;
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid rgba(100, 116, 139, 0.2);

		&:hover {
			background: rgba(124, 58, 237, 0.15);
			color: #a78bfa;
			border-color: rgba(124, 58, 237, 0.4);
			transform: translateY(-1px);
		}

		&:active {
			transform: scale(0.98);
		}
	}

	.nav-icon {
		font-size: 0.9375rem;
		line-height: 1;
	}

	.nav-text {
		letter-spacing: -0.01em;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 4rem;
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 3.5rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(100, 116, 139, 0.15);
		gap: 1rem;
	}

	.section-title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.section-icon {
		font-size: 1.25rem;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(124, 58, 237, 0.1);
		border-radius: 0.5rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
	}

	.section-title-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #f1f5f9;
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: #64748b;
		margin: 0.125rem 0 0;
	}

	/* Featured Card */
	.featured-grid {
		display: grid;
		gap: 1rem;
	}

	.featured-card {
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
		background: #16161e;
		text-decoration: none;
		transition: all 0.3s ease;
		min-height: 300px;
		border: 1px solid rgba(100, 116, 139, 0.15);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(124, 58, 237, 0.3);
			box-shadow:
				0 12px 24px rgba(0, 0, 0, 0.3),
				0 0 0 1px rgba(124, 58, 237, 0.1);

			&::before {
				opacity: 1;
			}

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
			rgba(10, 10, 15, 0.95) 0%,
			rgba(10, 10, 15, 0.6) 40%,
			rgba(10, 10, 15, 0.3) 100%
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
			color: #f1f5f9;
		}

		p {
			font-size: 1rem;
			line-height: 1.6;
			color: #cbd5e1;
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
		background: rgba(124, 58, 237, 0.2);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 2rem;
		font-size: 0.75rem;
		font-weight: 600;
		margin-bottom: 1rem;
		width: fit-content;
		color: #a78bfa;
	}

	.read-more {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: #a78bfa;
		transition: color 0.2s ease;

		&:hover {
			color: #c4b5fd;
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
		border-radius: 0.75rem;
		overflow: hidden;
		background: #16161e;
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid rgba(100, 116, 139, 0.15);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: rgba(124, 58, 237, 0.3);
			box-shadow:
				0 8px 24px rgba(0, 0, 0, 0.3),
				0 0 0 1px rgba(124, 58, 237, 0.1);

			&::before {
				opacity: 1;
			}

			.card-image {
				transform: scale(1.05);
			}

			.card-content h3 {
				color: #a78bfa;
			}
		}

		&.has-image {
			.card-overlay {
				background: linear-gradient(
					to top,
					rgba(10, 10, 15, 0.95) 0%,
					rgba(10, 10, 15, 0.6) 40%,
					rgba(10, 10, 15, 0.3) 100%
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
		background: linear-gradient(135deg, rgba(22, 22, 30, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%);
	}

	.card-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1rem;
		color: white;

		h3 {
			font-size: 0.9375rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			color: #e2e8f0;
			transition: color 0.2s ease;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.75rem;
			line-height: 1.5;
			color: #94a3b8;
			margin: 0.375rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		time {
			font-size: 0.6875rem;
			color: #64748b;
			margin-top: 0.375rem;
		}
	}

	/* CTA Section */
	.cta-section {
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-radius: 1rem;
		padding: 2.5rem 2rem;
		text-align: center;
		color: white;
		border: 1px solid rgba(124, 58, 237, 0.2);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: 50%;
			transform: translateX(-50%);
			width: 400px;
			height: 200px;
			background: radial-gradient(ellipse, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
			pointer-events: none;
		}
	}

	.cta-content {
		max-width: 500px;
		margin: 0 auto;
		position: relative;

		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			margin: 0 0 0.75rem;
			color: #f1f5f9;
		}

		p {
			font-size: 0.9375rem;
			color: #94a3b8;
			line-height: 1.6;
			margin: 0 0 1.5rem;
		}
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		color: white;
		font-weight: 600;
		font-size: 0.875rem;
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.25);

		&:hover {
			background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
			transform: translateY(-2px);
			box-shadow: 0 0 30px rgba(124, 58, 237, 0.35);
		}
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: rgba(124, 58, 237, 0.1);
		color: #cbd5e1;
		font-weight: 600;
		font-size: 0.875rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(124, 58, 237, 0.25);
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(124, 58, 237, 0.2);
			border-color: rgba(124, 58, 237, 0.4);
			color: #a78bfa;
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
			padding: 1.5rem 1rem 1rem;
		}

		.hero h1 {
			font-size: 1.5rem;
		}

		.quick-nav {
			padding: 0.5rem 0;
		}

		.nav-scroll {
			padding: 0.375rem 1rem;
			gap: 0.375rem;
		}

		.nav-pill {
			padding: 0.4rem 0.75rem;
			font-size: 0.75rem;
			border-radius: 0.375rem;
		}

		.nav-icon {
			font-size: 0.875rem;
		}

		.main-content {
			padding: 1rem 1rem 2.5rem;
		}

		.content-section {
			margin-bottom: 2.5rem;
			scroll-margin-top: 70px;
		}

		.section-header {
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
		}

		.section-icon {
			font-size: 1rem;
			width: 1.75rem;
			height: 1.75rem;
		}

		.section-title-group h2 {
			font-size: 1.0625rem;
		}

		.section-subtitle {
			font-size: 0.75rem;
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
			gap: 0.625rem;
		}

		.blog-card {
			aspect-ratio: 1;
			border-radius: 0.5rem;
		}

		.card-content {
			padding: 0.625rem;

			h3 {
				font-size: 0.75rem;
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
			padding: 1.5rem 1.25rem;
			border-radius: 0.75rem;
			margin-top: 0.5rem;
		}

		.cta-content h2 {
			font-size: 1.1875rem;
		}

		.cta-content p {
			font-size: 0.8125rem;
			margin-bottom: 1.25rem;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}

		.btn-primary,
		.btn-secondary {
			padding: 0.6875rem 1.25rem;
			font-size: 0.8125rem;
			justify-content: center;
			border-radius: 0.5rem;
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.25rem;
		}

		.nav-scroll {
			padding: 0.25rem 0.75rem;
		}

		.nav-pill {
			padding: 0.35rem 0.625rem;
			gap: 0.375rem;
		}

		.nav-text {
			display: none;
		}

		.nav-icon {
			font-size: 1rem;
		}

		.blog-grid {
			gap: 0.5rem;
		}

		.card-content {
			padding: 0.5rem;

			h3 {
				font-size: 0.6875rem;
			}
		}

		.section-title-group {
			gap: 0.5rem;
		}

		.section-title-group h2 {
			font-size: 0.9375rem;
		}
	}
</style>
