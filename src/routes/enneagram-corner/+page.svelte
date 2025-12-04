<!-- src/routes/enneagram-corner/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const blogSections = [
		{
			id: 'nine-types',
			title: 'The 9 Types',
			subtitle: 'Core personality patterns',
			type: 'nine-types',
			linkTitle: 'All 9 Types',
			icon: '🎯'
		},
		{
			id: 'understanding',
			title: 'Foundations',
			subtitle: 'Master the fundamentals',
			type: 'overview',
			linkTitle: 'Core Concepts',
			icon: '📚'
		},
		{
			id: 'personal-development',
			title: 'Growth',
			subtitle: 'Transform yourself',
			type: 'development',
			linkTitle: 'Growth Strategies',
			icon: '🌱'
		},
		{
			id: 'relationships',
			title: 'Relationships',
			subtitle: 'Connect deeper',
			type: 'relationships',
			linkTitle: 'Relationship Insights',
			icon: '💜'
		},
		{
			id: 'mental-health',
			title: 'Mental Health',
			subtitle: 'Type-aware wellness',
			type: 'mental-health',
			linkTitle: 'Wellness Resources',
			icon: '🧠'
		},
		{
			id: 'workplace',
			title: 'Career',
			subtitle: 'Professional growth',
			type: 'workplace',
			linkTitle: 'Career Insights',
			icon: '💼'
		},
		{
			id: 'situations',
			title: 'Real Life',
			subtitle: 'Types in action',
			type: 'situational',
			linkTitle: 'Real-World Examples',
			icon: '🎭'
		},
		{
			id: 'resources',
			title: 'Resources',
			subtitle: 'Books & tools',
			type: 'resources',
			linkTitle: 'Resources',
			icon: '🔧'
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
						"name": "The Nine Enneagram Types",
						"description": "Detailed information about each of the nine Enneagram personality types",
						"url": "https://9takes.com/enneagram-corner#nine-types"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Understanding the Enneagram",
						"description": "Explore the basics and fundamentals of the Enneagram system",
						"url": "https://9takes.com/enneagram-corner#understanding"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Personal Development",
						"description": "Learn how to apply Enneagram insights for personal growth",
						"url": "https://9takes.com/enneagram-corner#personal-development"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Relationships",
						"description": "Understand how Enneagram types interact in relationships",
						"url": "https://9takes.com/enneagram-corner#relationships"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Mental Health",
						"description": "Type-specific mental health resources and healing strategies",
						"url": "https://9takes.com/enneagram-corner#mental-health"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Career & Workplace",
						"description": "Enneagram insights for professional development",
						"url": "https://9takes.com/enneagram-corner#workplace"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Types in Real Life",
						"description": "How Enneagram types respond in various situations",
						"url": "https://9takes.com/enneagram-corner#situations"
					},
					{
						"@type": "ListItem",
						"position": 8,
						"name": "Resources",
						"description": "Curated Enneagram books, tools, and resources",
						"url": "https://9takes.com/enneagram-corner#resources"
					}
				]
			},
			"name": "Enneagram Corner: Your Guide to Personal Growth",
			"description": "Master the Enneagram personality system. Explore the nine types, personal development, relationships, and more.",
			"url": "https://9takes.com/enneagram-corner",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Enneagram Personality Guide: Complete Psychology System | 9takes"
	description="Master the Enneagram personality system. Discover your type among 9 distinct patterns, understand core motivations, break limiting patterns, and transform relationships."
	canonical="https://9takes.com/enneagram-corner"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/enneagram-corner-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'enneagram, personality types, enneagram test, personality psychology, 9 types, self-improvement, personal growth'
		},
		{ name: 'author', content: '9takes' }
	]}
/>

<div class="page-wrapper">
	<!-- Hero Section -->
	<header class="hero">
		<h1>Enneagram Guide</h1>
	</header>

	<!-- Quick Navigation -->
	<nav class="quick-nav" aria-label="Topic Navigation">
		<div class="nav-scroll">
			{#each blogSections as section}
				<a href="#{section.id}" class="nav-pill">
					<span class="nav-icon">{section.icon}</span>
					<span class="nav-text">{section.title}</span>
				</a>
			{/each}
		</div>
	</nav>

	<main class="main-content">
		<!-- Blog Sections -->
		{#each blogSections as section, sectionIndex}
			<section class="content-section" id={section.id}>
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-icon">{section.icon}</span>
						<div>
							<h2>{section.title}</h2>
							<p class="section-subtitle">{section.subtitle}</p>
						</div>
					</div>
					{#if section.type !== 'nine-types'}
						<a
							href="/enneagram-corner/{section.type === 'mental-health'
								? 'mental-health'
								: `subtopic/${section.type}`}"
							class="view-all-link"
						>
							View all
							<ArrowRightIcon
								iconStyle={'margin-left: 0.25rem'}
								height={'1rem'}
								fill={'currentColor'}
							/>
						</a>
					{/if}
				</div>

				<div class="blog-grid" class:nine-types-grid={section.type === 'nine-types'}>
					{#each data.enneagramBlogs
						.filter((blog) => blog.type[0] === section.type)
						.slice(0, section.type === 'nine-types' ? 9 : 6) as blog (blog.slug)}
						<a
							href="/enneagram-corner/{blog.slug}"
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
								{#if section.type !== 'nine-types' && blog.description}
									<p>{blog.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}

		<!-- CTA Section -->
		<section class="cta-section">
			<div class="cta-content">
				<h2>Ready to discover your type?</h2>
				<p>
					Start with our comprehensive guides to each of the 9 personality types, or learn the
					foundational concepts behind the Enneagram system.
				</p>
				<div class="cta-buttons">
					<a href="/enneagram-corner/subtopic/nine-types" class="btn-primary">
						Explore All 9 Types
					</a>
					<a href="/enneagram-corner/subtopic/overview" class="btn-secondary"> Learn the Basics </a>
				</div>
			</div>
		</section>
	</main>
</div>

<style lang="scss">
	.page-wrapper {
		min-height: 100vh;
	}

	/* Hero Section - Compact */
	.hero {
		background: var(--darkest-gray);
		padding: 0.75rem 1rem;
		text-align: center;
		color: white;
	}

	.hero h1 {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1;
		margin: 0;
		letter-spacing: -0.01em;
	}

	/* Quick Navigation */
	.quick-nav {
		background: var(--card-background);
		border-bottom: 1px solid var(--border-color);
		padding: 1rem 1.5rem;
		position: sticky;
		top: 60px;
		z-index: 30;
	}

	.nav-scroll {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		max-width: 1200px;
		margin: 0 auto;
		padding-bottom: 0.25rem;
		scrollbar-width: none;

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

	.view-all-link {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s ease;

		&:hover {
			color: var(--text-primary);
		}
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.nine-types-grid {
		grid-template-columns: repeat(3, 1fr);
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

		.nine-types-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 0.5rem 0.75rem;
		}

		.hero h1 {
			font-size: 1.1rem;
		}

		.quick-nav {
			padding: 0.5rem 0.75rem;
			top: 56px;
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

		.view-all-link {
			font-size: 0.8rem;
		}

		.blog-grid,
		.nine-types-grid {
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
			font-size: 1rem;
		}

		.nav-pill {
			padding: 0.35rem 0.5rem;
		}

		.nav-text {
			display: none;
		}

		.blog-grid,
		.nine-types-grid {
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
