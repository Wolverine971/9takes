<!-- src/routes/community/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { FAQItem } from '$lib/types/faq';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	import { buildBreadcrumbSchemaForGraph, buildFAQSchemaForGraph } from '$lib/utils/schema';

	let { data }: { data: PageData } = $props();

	function getRecencyLabel(lastmod: string): string | null {
		const days = Math.floor((Date.now() - new Date(lastmod).getTime()) / 86400000);
		if (days <= 3) return 'New';
		if (days <= 7) return 'This week';
		if (days <= 30) return 'This month';
		return null;
	}

	const excludedSlugs = $derived(
		new Set([...data.featured.map((p) => p.slug), ...data.recentlyUpdated.map((p) => p.slug)])
	);

	const inspirationPosts = $derived(
		data.posts.filter((b) => b?.type?.[0] === 'inspiration' && !excludedSlugs.has(b.slug))
	);
	const ideaPosts = $derived(
		data.posts.filter((b) => b?.type?.[0] === 'idea' && !excludedSlugs.has(b.slug))
	);

	// FAQ data for community page
	const communityFAQs: FAQItem[] = [
		{
			question: 'What is 9takes?',
			answer:
				'9takes is a personality-based Q&A platform built on the Enneagram system. We help you see how different personality types think about the same situations. Submit anonymous questions, give your perspective first, then discover how all 9 types approach the same topic differently.'
		},
		{
			question: 'Why focus on personality types for Q&A?',
			answer:
				"Most platforms show you popular opinions. We show you diverse perspectives based on how people actually think. A Type 5's analytical response differs from a Type 2's empathetic take. Seeing this range expands your understanding and reduces judgment of others."
		},
		{
			question: 'What does "give-first" commenting mean?',
			answer:
				"Before viewing others' responses, you must contribute your own perspective. This prevents groupthink and ensures authentic answers. You'll see the diversity of thought only after adding your voice. It's designed to promote genuine expression over social conformity."
		},
		{
			question: 'How is my Enneagram type used?',
			answer:
				"Your type adds context to your responses, helping others understand where you're coming from. It's displayed alongside your answer so readers can see patterns in how different types think. You can participate anonymously while still contributing personality-based insights."
		},
		{
			question: 'Who creates content for 9takes?',
			answer:
				'Our team combines Enneagram expertise with practical psychology. We create guides, type analyses, and educational content based on research and real-world application. Community members also contribute questions and perspectives that fuel discussions.'
		},
		{
			question: 'How can I get involved in the community?',
			answer:
				'Start by answering questions on topics you care about. Explore celebrity type analyses and share your thoughts. Follow our blog for new content. If you want deeper engagement, sign up for our newsletter or book a coaching session to explore your type.'
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': 'https://9takes.com/community#webpage',
				name: '9takes Community | Ideas & Inspiration',
				description:
					'Discover the inspiration and ideas behind 9takes. Explore our community blog posts.',
				url: 'https://9takes.com/community',
				inLanguage: 'en-US',
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com'
				},
				breadcrumb: { '@id': 'https://9takes.com/community#breadcrumb' }
			},
			{
				'@id': 'https://9takes.com/community#breadcrumb',
				...buildBreadcrumbSchemaForGraph([
					{ name: 'Home', url: 'https://9takes.com' },
					{ name: 'Community', url: 'https://9takes.com/community' }
				])
			},
			{
				'@id': 'https://9takes.com/community#faq',
				...buildFAQSchemaForGraph(communityFAQs)
			}
		]
	};
</script>

<SEOHead
	title="9takes Community | Ideas & Inspiration"
	description="Discover the inspiration and ideas behind 9takes. Explore our community blog posts."
	canonical="https://9takes.com/community"
	{jsonLd}
/>

<div class="page-wrapper">
	<header class="index-hero">
		<div class="index-badge">Community</div>
		<h1>Ideas behind 9takes.</h1>
		<p class="index-hero-copy">
			Read the essays, product thinking, and perspective-shifting ideas that shape how 9takes
			approaches personality, debate, and connection.
		</p>
		<div class="index-hero-actions">
			<a href="#latest" class="index-action primary">Read Latest</a>
			<a href="/questions" class="index-action">Answer Questions</a>
		</div>
	</header>

	<nav class="index-link-band" aria-label="Community Navigation">
		<div class="index-link-scroll">
			<a href="#latest" class="index-link-pill">
				<span class="index-link-code">01</span>
				<span>Latest</span>
			</a>
			<a href="#recent" class="index-link-pill">
				<span class="index-link-code">02</span>
				<span>Recently Updated</span>
			</a>
			<a href="#inspiration" class="index-link-pill">
				<span class="index-link-code">03</span>
				<span>Inspiration</span>
			</a>
			<a href="#ideas" class="index-link-pill">
				<span class="index-link-code">04</span>
				<span>Ideas</span>
			</a>
		</div>
	</nav>

	<main class="main-content">
		<!-- Featured -->
		{#if data.featured.length > 0}
			<section class="content-section" id="latest">
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-marker">01</span>
						<div>
							<h2>Latest</h2>
							<p class="section-subtitle">Most recently updated posts</p>
						</div>
					</div>
				</div>

				<div class="featured-grid">
					{#each data.featured as blog}
						{@const label = getRecencyLabel(blog.lastmod || blog.date)}

						<a
							href={`/community/${blog.slug}`}
							class="featured-card image-card image-card--inset"
							class:has-image={blog.pic}
						>
							{#if blog.pic}
								<div
									class="featured-image image-card-media"
									style={`background-image: url(/blogs/${blog.pic}.webp);`}
								></div>
							{/if}
							<div class="featured-overlay image-card-overlay"></div>
							<div class="featured-content image-card-content">
								<span class="featured-badge" class:new={label === 'New'}>
									{label || 'Latest'}
								</span>
								<h3>{blog.title}</h3>
								<p>{blog.description}</p>
								<span class="read-more image-card-read-more">
									Read Post
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

		<!-- Recently Updated -->
		{#if data.recentlyUpdated.length > 0}
			<section class="content-section" id="recent">
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-marker">02</span>
						<div>
							<h2>Recently Updated</h2>
							<p class="section-subtitle">Fresh content and new perspectives</p>
						</div>
					</div>
				</div>

				<div class="recent-grid">
					{#each data.recentlyUpdated as blog}
						{@const label = getRecencyLabel(blog.lastmod || blog.date)}

						<a
							href={`/community/${blog.slug}`}
							class="recent-card image-card"
							class:has-image={blog.pic}
						>
							{#if blog.pic}
								<div
									class="card-image image-card-media"
									style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
								></div>
							{/if}
							<div class="card-overlay image-card-overlay"></div>
							<div class="card-content image-card-content">
								{#if label}
									<span class="recency-badge" class:new={label === 'New'}>{label}</span>
								{/if}
								<h3>{blog.title}</h3>
								{#if blog.description}
									<p>{blog.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Inspiration Section -->
		{#if inspirationPosts.length > 0}
			<section class="content-section" id="inspiration">
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-marker">03</span>
						<div>
							<h2>The Inspiration Behind 9takes</h2>
						</div>
					</div>
				</div>
				<div class="blog-grid">
					{#each inspirationPosts as blog}
						<a
							href={`/community/${blog.slug}`}
							class="blog-card image-card"
							class:has-image={blog.pic}
						>
							{#if blog.pic}
								<div
									class="card-image image-card-media"
									style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
								></div>
							{/if}
							<div class="card-overlay image-card-overlay"></div>
							<div class="card-content image-card-content">
								<h3>{blog.title}</h3>
								<p>{blog.description}</p>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Ideas Section -->
		{#if ideaPosts.length > 0}
			<section class="content-section" id="ideas">
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-marker">04</span>
						<div>
							<h2>The Ideas Behind 9takes</h2>
						</div>
					</div>
				</div>
				<div class="blog-grid">
					{#each ideaPosts as blog}
						<a
							href={`/community/${blog.slug}`}
							class="blog-card image-card"
							class:has-image={blog.pic}
						>
							{#if blog.pic}
								<div
									class="card-image image-card-media"
									style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
								></div>
							{/if}
							<div class="card-overlay image-card-overlay"></div>
							<div class="card-content image-card-content">
								<h3>{blog.title}</h3>
								<p>{blog.description}</p>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- FAQ Section -->
		<FAQSection faqs={communityFAQs} title="About 9takes" />
	</main>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Community */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
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
		width: 350px;
		height: 175px;
		background: radial-gradient(ellipse, rgba(45, 212, 191, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: 0;
		position: relative;
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 4rem;
	}

	/* Intro Section */
	.intro-section {
		margin-bottom: 2rem;
		max-width: 800px;
	}

	.intro-text {
		font-size: 1.0625rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0;

		strong {
			color: var(--text-primary);
		}
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 3rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
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
		background: rgba(45, 212, 191, 0.1);
		border-radius: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
	}

	.section-title-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0.125rem 0 0;
	}

	/* Featured Grid */
	.featured-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.featured-card {
		@extend .image-card !optional;
		@extend .image-card--inset !optional;
		position: relative;
		border-radius: 8px;
		transition: all 0.3s ease;
		min-height: 280px;
		border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--border-color));
		box-shadow: var(--shadow-sm);
		padding: 0.45rem;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: color-mix(in srgb, var(--primary) 30%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px var(--primary-subtle);

			&::before {
				opacity: 1;
			}
		}
	}

	.featured-image {
		@extend .image-card-media !optional;
	}

	.featured-overlay {
		@extend .image-card-overlay !optional;
	}

	.featured-content {
		@extend .image-card-content !optional;
		padding: 1.5rem;

		h3 {
			font-size: 1.375rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0 0 0.5rem;
			color: var(--text-primary);
		}

		p {
			font-size: 0.9375rem;
			line-height: 1.6;
			color: var(--text-secondary);
			margin: 0 0 0.75rem;
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
		background: var(--primary-subtle);
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		border-radius: 2rem;
		font-size: 0.75rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		width: fit-content;
		color: var(--primary);

		&.new {
			background: color-mix(in srgb, var(--primary) 22%, transparent);
			color: var(--primary-light);
			box-shadow: var(--glow-sm);
		}
	}

	.read-more {
		@extend .image-card-read-more !optional;
		font-size: 0.875rem;
		font-weight: 600;
	}

	/* Recency Badge */
	.recency-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 8px;
		background: var(--primary-subtle);
		color: var(--accent-light);
		border: 1px solid rgba(45, 212, 191, 0.3);
		margin-bottom: 0.375rem;
		width: fit-content;

		&.new {
			background: rgba(45, 212, 191, 0.3);
			color: var(--primary-lightest);
			box-shadow: 0 0 8px rgba(45, 212, 191, 0.2);
		}
	}

	/* Recent Grid */
	.recent-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.recent-card {
		@extend .image-card !optional;
		position: relative;
		aspect-ratio: 3 / 2;
		border-radius: 8px;
		transition: all 0.25s ease;
		border: 1px solid rgba(45, 212, 191, 0.15);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: rgba(45, 212, 191, 0.35);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px var(--primary-subtle);

			&::before {
				opacity: 1;
			}

			.card-content h3 {
				color: var(--accent-light);
			}
		}

		.card-content h3 {
			font-size: 1rem;
			-webkit-line-clamp: 2;
			line-clamp: 2;
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
		@extend .image-card !optional;
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 8px;
		transition: all 0.25s ease;
		border: 1px solid var(--border-color);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: color-mix(in srgb, var(--primary) 30%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px var(--primary-subtle);

			&::before {
				opacity: 1;
			}

			.card-content h3 {
				color: var(--accent-light);
			}
		}
	}

	.card-image {
		@extend .image-card-media !optional;
	}

	.card-overlay {
		@extend .image-card-overlay !optional;
	}

	.card-content {
		@extend .image-card-content !optional;
		padding: 1rem;

		h3 {
			font-size: 0.9375rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			color: var(--text-primary);
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
			color: var(--text-secondary);
			margin: 0.375rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	/* Responsive */
	@media (max-width: 900px) {
		.featured-grid {
			grid-template-columns: 1fr;
		}

		.recent-grid {
			grid-template-columns: repeat(2, 1fr);
		}

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

		.main-content {
			padding: 1rem 1rem 2.5rem;
		}

		.content-section {
			margin-bottom: 2.5rem;
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
			min-height: 220px;
		}

		.featured-content {
			padding: 1.25rem;

			h3 {
				font-size: 1.125rem;
			}

			p {
				font-size: 0.8125rem;
			}
		}

		.recent-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.625rem;
		}

		.recent-card {
			aspect-ratio: 4 / 3;
			border-radius: 0.5rem;

			.card-content h3 {
				font-size: 0.8125rem;
			}

			.card-content p {
				display: none;
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
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.25rem;
		}

		.section-title-group h2 {
			font-size: 0.9375rem;
		}

		.recent-grid,
		.blog-grid {
			gap: 0.5rem;
		}

		.card-content {
			padding: 0.5rem;

			h3 {
				font-size: 0.6875rem;
			}
		}
	}
</style>
