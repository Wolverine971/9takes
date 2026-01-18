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
	/* Solo Leveling Dark Theme - Enneagram Corner */
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
		justify-content: flex-start;

		/* Fade edges for scroll indication */
		mask-image: linear-gradient(
			to right,
			transparent,
			black 2rem,
			black calc(100% - 2rem),
			transparent
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent,
			black 2rem,
			black calc(100% - 2rem),
			transparent
		);

		&::-webkit-scrollbar {
			display: none;
		}

		@media (min-width: 900px) {
			justify-content: center;
			mask-image: none;
			-webkit-mask-image: none;
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
		flex-shrink: 0;

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

	.view-all-link {
		display: flex;
		align-items: center;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #64748b;
		text-decoration: none;
		transition: all 0.2s ease;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid transparent;

		&:hover {
			color: #a78bfa;
			background: rgba(124, 58, 237, 0.1);
			border-color: rgba(124, 58, 237, 0.2);
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

	/* Blog Cards - Refined */
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
			background: linear-gradient(
				135deg,
				rgba(124, 58, 237, 0.05) 0%,
				transparent 50%
			);
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
	}

	/* CTA Section - Refined */
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

		.nine-types-grid {
			grid-template-columns: repeat(3, 1fr);
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
			flex-wrap: wrap;
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

		.view-all-link {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
		}

		.blog-grid,
		.nine-types-grid {
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

		.blog-grid,
		.nine-types-grid {
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
