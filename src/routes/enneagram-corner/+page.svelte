<!-- src/routes/enneagram-corner/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const blogSections = [
		{
			id: 'understanding',
			title: 'Understanding the Enneagram',
			subtitle: 'Master the fundamental principles of personality psychology',
			type: 'overview',
			linkTitle: 'Core Concepts'
		},
		{
			id: 'nine-types',
			title: 'The Nine Personality Types',
			subtitle: 'Deep dive into each type\'s motivations, fears, and growth paths',
			type: 'nine-types',
			linkTitle: 'All 9 Types'
		},
		{
			id: 'personal-development',
			title: 'Personal Development',
			subtitle: 'Type-specific strategies for authentic growth and transformation',
			type: 'development',
			linkTitle: 'Growth Strategies'
		},
		{
			id: 'relationships',
			title: 'Relationships & Compatibility',
			subtitle: 'Navigate relationships with deeper understanding and empathy',
			type: 'relationships',
			linkTitle: 'Relationship Insights'
		},
		{
			id: 'mental-health',
			title: 'Mental Health & Wellness',
			subtitle: 'Type-aware approaches to emotional well-being and resilience',
			type: 'mental-health',
			linkTitle: 'Wellness Resources'
		},
		{
			id: 'workplace',
			title: 'Career & Leadership',
			subtitle: 'Leverage your natural strengths in professional settings',
			type: 'workplace',
			linkTitle: 'Career Insights'
		},
		{
			id: 'resources',
			title: 'Tools & Resources',
			subtitle: 'Curated collection of books, tests, and practical applications',
			type: 'resources',
			linkTitle: 'Resources'
		},
		{
			id: 'situations',
			title: 'Types in Real Life',
			subtitle: 'How each type responds to everyday situations and challenges',
			type: 'situational',
			linkTitle: 'Real-World Examples'
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
						"name": "Understanding the Enneagram",
						"description": "Explore the basics and fundamentals of the Enneagram system",
						"url": "https://9takes.com/enneagram-corner#understanding"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "The Nine Enneagram Types",
						"description": "Detailed information about each of the nine Enneagram personality types",
						"url": "https://9takes.com/enneagram-corner#nine-types"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Using the Enneagram for Personal Development",
						"description": "Learn how to apply Enneagram insights for personal growth and self-improvement",
						"url": "https://9takes.com/enneagram-corner#personal-development"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Enneagram in Relationships",
						"description": "Understand how Enneagram types interact in various relationships",
						"url": "https://9takes.com/enneagram-corner#relationships"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Enneagram and Mental Health",
						"description": "Type-specific mental health resources, therapy guides, and healing strategies tailored to each Enneagram type",
						"url": "https://9takes.com/enneagram-corner#mental-health"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Enneagram in the Workplace",
						"description": "Discover how Enneagram knowledge can improve workplace dynamics and productivity",
						"url": "https://9takes.com/enneagram-corner#workplace"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Enneagram Resources",
						"description": "Curated collection of Enneagram books, tools, and other resources",
						"url": "https://9takes.com/enneagram-corner#resources"
					},
					{
						"@type": "ListItem",
						"position": 8,
						"name": "Enneagram Situational Topics",
						"description": "Explore how Enneagram types respond in various life situations",
						"url": "https://9takes.com/enneagram-corner#situations"
					}
				]
			},
			"name": "Enneagram Corner: Your Guide to Personal Growth and Understanding",
			"description": "Dive into the Enneagram with this 9takes guide. Explore the nine types, personal development, relationships, workplace dynamics, and more.",
			"url": "https://9takes.com/enneagram-corner",
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
						"name": "Enneagram Corner",
						"item": "https://9takes.com/enneagram-corner"
					}
				]
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Enneagram Personality Guide: Complete Psychology System | 9takes"
	description="Master the Enneagram personality system. Discover your type among 9 distinct patterns, understand core motivations, break limiting patterns, and transform relationships. Expert insights on mental health, career, and personal growth."
	canonical="https://9takes.com/enneagram-corner"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/enneagram-corner-card.webp"
	additionalMeta={[
		{ name: 'keywords', content: 'enneagram, personality types, enneagram test, personality psychology, 9 types, self-improvement, personal growth, mental health, relationships, career development, enneagram compatibility, personality assessment' },
		{ name: 'author', content: '9takes' },
		{ property: 'article:publisher', content: 'https://9takes.com' },
		{ property: 'og:site_name', content: '9takes' },
		{ property: 'og:locale', content: 'en_US' }
	]}
/>

<main class="enneagram-corner-page">
	<h1 style="text-align: start;">Explore the Enneagram</h1>

	<nav aria-label="Table of Contents" class="nav-section">
		
		<ul>
			{#each blogSections as section}
				<li>
					<a href="#{section.id}">
						<span class="nav-title">{section.title}</span>
						{#if section.subtitle}
							<span class="nav-subtitle">{section.subtitle}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#each blogSections as section}
		<section aria-labelledby={section.id}>
			<h2 id={section.id}>{section.title}</h2>
			{#if section.subtitle}
				<p class="section-subtitle">{section.subtitle}</p>
			{/if}
			<div class="blog-grid-container" class:nine-types={section.type === 'nine-types'}>
				{#each data.enneagramBlogs
					.filter((blog) => blog.type[0] === section.type)
					.slice(0, section.type === 'nine-types' ? 9 : 5) as blog (blog.slug)}
					<article class="grid-item" class:no-image={!blog.pic}>
						<a
							href="/enneagram-corner/{blog.slug}"
							class="blog-link"
							data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
						>
							<div
								class="grid-item-content"
								class:has-image={blog.pic}
								style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}
							>
								{#if !blog.pic}
									<div class="pattern-overlay"></div>
								{/if}
								<div class="text-overlay">
									<h3>{blog.title}</h3>
									<p>{blog.description}</p>
								</div>
							</div>
						</a>
					</article>
				{/each}
				{#if section.type !== 'nine-types'}
					<div class="grid-item view-all">
						<a
							href="/enneagram-corner/{section.type === 'mental-health'
								? 'mental-health'
								: `subtopic/${section.type}`}"
							class="blog-link"
						>
							<div class="grid-item-content">
								<div class="text-overlay">
									<h3>
										View All {section.linkTitle}
										<ArrowRightIcon
											iconStyle={'margin-left: .5rem'}
											height={'1.5rem'}
											fill={'white'}
										/>
									</h3>
								</div>
							</div>
						</a>
					</div>
				{/if}
			</div>
		</section>
	{/each}
</main>

<div class="resources-footer">
	<h2>Why Choose 9takes</h2>
	<div class="difference-grid">
		<div class="difference-item">
			<h3>Deep Psychological Insights</h3>
			<p>
				Go beyond surface-level descriptions to understand the core motivations,
				fears, and desires that shape each personality type.
			</p>
		</div>
		<div class="difference-item">
			<h3>Personalized Growth Strategies</h3>
			<p>
				Receive specific, actionable guidance tailored to your unique
				personality type and individual growth path.
			</p>
		</div>
		<div class="difference-item">
			<h3>Research-Based Approach</h3>
			<p>
				Grounded in decades of psychological research and the work of leading
				Enneagram experts and practitioners.
			</p>
		</div>
		<div class="difference-item">
			<h3>Practical Applications</h3>
			<p>Transform theory into practice with real-world examples, exercises, and tools for immediate implementation.</p>
		</div>
	</div>
	<div class="cta-section">
		<h3>Start Your Enneagram Journey</h3>
		<p>
			Whether you're new to the Enneagram or deepening your understanding,
			we have resources to support your growth.
		</p>
		<div class="cta-buttons">
			<a href="/enneagram-corner/subtopic/nine-types" class="cta-primary">Explore All 9 Types</a>
			<a href="/enneagram-corner/subtopic/overview" class="cta-secondary">Learn the System</a>
		</div>
	</div>
</div>

<style lang="scss">
	// Page-specific isolation wrapper
	.enneagram-corner-page {
		// Reset global styles that might interfere
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
		
		h1, h2, h3, h4, p {
			margin-top: 0;
			padding-top: 0;
		}
	}
	
	h1 {
		text-align: start;
		margin: 2rem 0 2.5rem;
		color: #2d3436;
		font-size: 2.5rem;
		line-height: 1.3;
		font-weight: 700;
	}
	
	.authority-section {
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		
		border-radius: 20px;
		padding: 3rem;
		margin: 2rem auto;
		color: white;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

		.intro-text {
			font-size: 1.2rem;
			line-height: 1.8;
			margin-bottom: 1.5rem;

			strong {
				color: #a29bfe;
				font-weight: 700;
			}
		}

		.authority-badges {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			margin-top: 2rem;

			.badge-item {
				background: rgba(255, 255, 255, 0.1);
				backdrop-filter: blur(10px);
				padding: 1rem;
				border-radius: 8px;
				text-align: center;
				border: 1px solid rgba(255, 255, 255, 0.2);
				font-weight: 600;
			}
		}
	}

	.resources-footer {
		background: linear-gradient(to bottom, #1a1a2e, #0f0f1e);
		padding: 4rem;
		margin-top: 4rem;
		border-radius: 20px;
		color: white;

		h2 {
			color: white;
			font-size: 2.5rem;
			margin-bottom: 2rem;
			text-align: center;
		}

		.difference-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;
			margin: 3rem 0;

			.difference-item {
				background: rgba(255, 255, 255, 0.05);
				padding: 2rem;
				border-radius: 12px;
				border: 1px solid rgba(255, 255, 255, 0.1);
				transition:
					transform 0.3s ease,
					background 0.3s ease;

				&:hover {
					transform: translateY(-5px);
					background: rgba(255, 255, 255, 0.08);
				}

				h3 {
					color: #a29bfe;
					font-size: 1.25rem;
					font-weight: 600;
					margin-bottom: 1rem;
				}

				p {
					line-height: 1.6;
					opacity: 0.9;
					font-size: 1rem;
				}
			}
		}

		.cta-section {
			text-align: center;
			padding: 3rem;
			background: rgba(102, 126, 234, 0.1);
			border-radius: 16px;
			margin-top: 3rem;

			h3 {
				font-size: 2rem;
				margin-bottom: 1rem;
				color: white;
				font-weight: 700;
			}

			p {
				font-size: 1.1rem;
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
	}

	nav {
		margin: 0 0 3rem 0;
		padding: 0;

		h2 {
			font-size: 2rem;
			margin-bottom: 2rem;
			text-align: center;
			color: var(--primary);
		}

		ul {
			list-style-type: none;
			padding: 0;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1rem;
		}

		.nav-section, ul {
			margin: 0;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
				gap: 0.75rem;
		}

		

		

		li {
			a {
				display: block;
				color: var(--text-color);
				text-decoration: none;
				padding: 1.5rem;
				border-radius: 12px;
				background-color: var(--card-bg-color);
				border: 2px solid transparent;
				transition: all 0.3s ease;

				.nav-title {
					display: block;
					font-weight: 600;
					font-size: 1.1rem;
					margin-bottom: 0.5rem;
				}

				.nav-subtitle {
					display: block;
					font-size: 0.9rem;
					opacity: 0.7;
					line-height: 1.4;
				}

				&:hover,
				&:focus {
					border-color: var(--primary);
					transform: translateY(-3px);
					box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
				}
			}
		}
		
		// Mobile styles for 2-column grid
		@media (max-width: 768px) {
			
			
			li a {
				padding: 1rem;
				
				.nav-title {
					font-size: 0.95rem;
					margin-bottom: 0.25rem;
				}
				
				.nav-subtitle {
					font-size: 0.8rem;
					line-height: 1.3;
				}
			}
		}
		
		@media (max-width: 480px) {
			ul {
				grid-template-columns: repeat(2, 1fr);
				gap: 0.5rem;
			}
			
			li a {
				padding: 0.75rem;
				
				.nav-title {
					font-size: 0.9rem;
				}
				
				.nav-subtitle {
					display: none; // Hide subtitle on very small screens for better readability
				}
			}
		}
	}

	section {
		margin: 0 0 3.5rem 0;
		padding: 0;

		h2 {
			font-size: 1.875rem;
			font-weight: 700;
			margin: 0 0 0.75rem 0;
			padding: 0;
			color: #2d3436;
			letter-spacing: -0.02em;
		}

		.section-subtitle {
			font-size: 1.05rem;
			opacity: 0.75;
			margin: 0 0 1.5rem 0;
			padding: 0;
			color: #636e72;
			max-width: 650px;
			line-height: 1.6;
		}
	}

	.blog-grid-container {
		display: grid;
		// grid-template-columns: repeat(2, 1fr);
		grid-template-columns: repeat(3, minmax(300px, 1fr));
			
		gap: 1.5rem;
		margin: 0;
		padding: 0;
		
		// Regular sections always show 2 columns with 3 blogs + 1 view all = 4 items total (2x2)

		&.nine-types {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
			
			.grid-item {
				aspect-ratio: 1 / 1;
			}
		}
	}

	.blog-grid-container .grid-item {
		// Override global article styles
		margin: 0 !important;
		padding: 0 !important;
		aspect-ratio: 3 / 4;
		border-radius: 16px;
		overflow: hidden;
		position: relative;
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		border: 1px solid rgba(0, 0, 0, 0.06);

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
			border-color: rgba(108, 92, 231, 0.2);

			.grid-item-content {
				&::after {
					transform: scale(1.05);
				}
			}

			.text-overlay {
				background: linear-gradient(
					to top,
					rgba(0, 0, 0, 0.98) 0%,
					rgba(0, 0, 0, 0.85) 50%,
					rgba(0, 0, 0, 0.4) 100%
				);
			}
			
			&.no-image {
				background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
				border-color: rgba(255, 255, 255, 0.08);
				
				.text-overlay {
					background: transparent;
				}
				
				&:hover {
					background: linear-gradient(135deg, #2d3436 0%, #3d4447 100%);
				}
			}
		}
	}

	.blog-grid-container .blog-link {
		display: block;
		text-decoration: none !important;
		color: inherit !important;
		height: 100%;
		width: 100%;
		
		// Override global blog link styles
		&::after {
			display: none !important;
		}
		
		&:hover {
			text-decoration: none !important;
			color: inherit !important;
		}
	}

	.grid-item-content {
		height: 100%;
		width: 100%;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
		display: flex;
		align-items: flex-end;
		
		&.has-image::after {
			content: '';
			position: absolute;
			inset: 0;
			background: inherit;
			background-size: inherit;
			background-position: inherit;
			transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			z-index: 0;
		}
		
		&:not(.has-image) {
			background: transparent;
		}
	}
	
	.pattern-overlay {
		position: absolute;
		inset: 0;
		background-image: 
			linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
			linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%);
		background-size: 30px 30px;
		background-position: 0 0, 0 15px, 15px -15px, -15px 0px;
		opacity: 1;
		z-index: 1;
	}

	.text-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 2;
		padding: 1.5rem;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.95) 0%,
			rgba(0, 0, 0, 0.8) 40%,
			rgba(0, 0, 0, 0.4) 70%,
			rgba(0, 0, 0, 0) 100%
		);
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 0.5rem;
		min-height: 50%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.no-image .text-overlay {
		background: transparent;
		min-height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 2rem;
	}

	.blog-grid-container .text-overlay h3 {
		font-size: 1.2rem !important;
		font-weight: 700;
		margin: 0 !important;
		padding: 0 !important;
		line-height: 1.35;
		color: white !important;
		letter-spacing: -0.01em;
		word-wrap: break-word;
		overflow-wrap: break-word;
		hyphens: auto;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.no-image .text-overlay h3 {
		-webkit-line-clamp: 4;
		line-clamp: 4;
		font-size: 1.25rem !important;
	}

	.blog-grid-container .text-overlay p {
		font-size: 0.95rem !important;
		line-height: 1.5;
		opacity: 0.9;
		color: rgba(255, 255, 255, 0.9) !important;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: all 0.3s ease;
		margin: 0 !important;
		padding: 0 !important;
		font-weight: 400;
	}
	
	.no-image .text-overlay p {
		opacity: 0.95;
		transform: none;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.blog-grid-container .view-all {
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		
		.grid-item-content {
			background: transparent;
			display: flex;
			align-items: center;
			justify-content: center;
			
			&::after {
				display: none;
			}
		}

		.text-overlay {
			background: transparent !important;
			min-height: 100%;
			padding: 2rem;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		h3 {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.15rem !important;
			font-weight: 600;
			color: white !important;
			margin: 0 !important;
			padding: 0 !important;
			-webkit-line-clamp: unset;
			line-clamp: unset;
			overflow: visible;
		}
		
		&:hover {
			background: linear-gradient(135deg, #3d4447 0%, #2a2a3e 100%);
			transform: translateY(-4px);
			border-color: rgba(255, 255, 255, 0.15);
			
			h3 {
				color: #a29bfe !important;
			}
		}
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
			line-height: 1.3;
		}

		section h2 {
			font-size: 1.75rem;
		}

		.blog-grid-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			
			&.nine-types {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.grid-item {
			aspect-ratio: 3 / 4;
		}

		.text-overlay {
			padding: 1.25rem;
			min-height: 50%;
		}

		.text-overlay h3 {
			font-size: 1.1rem;
			margin-bottom: 0.5rem;
		}

		.text-overlay p {
			font-size: 0.85rem;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}
	}

	@media (max-width: 480px) {
		.blog-grid-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.75rem;
			
			&.nine-types {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.grid-item {
			aspect-ratio: 1 / 1;
		}

		.text-overlay {
			min-height: auto;
			padding: 1rem;
		}

		.text-overlay h3 {
			font-size: 1rem;
		}

		.text-overlay p {
			font-size: 0.8rem;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}
	}
</style>
