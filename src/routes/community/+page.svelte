<!-- src/routes/community/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { FAQItem } from '$lib/types/faq';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	import { buildFAQSchema } from '$lib/utils/schema';

	export let data: PageData;

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

	// Build FAQ schema for SEO
	const faqSchema = buildFAQSchema(communityFAQs);
</script>

<SEOHead
	title="9takes Community | Ideas & Inspiration"
	description="Discover the inspiration and ideas behind 9takes. Explore our community blog posts."
	canonical="https://9takes.com/community"
	jsonLd={faqSchema}
/>

<div class="page-wrapper">
	<header class="hero">
		<h1>Community</h1>
	</header>

	<main class="main-content">
		<!-- Intro Section -->
		<section class="intro-section">
			<p class="intro-text">
				One situation, 9 ways to see it. 9takes explores how personality shapes perspective.
				Discover the ideas and inspirations behind our platform, and see why
				<strong>understanding different takes leads to deeper connection</strong>.
			</p>
		</section>

		<section class="content-section">
			<h2>The Inspiration Behind 9takes</h2>
			<div class="blog-grid">
				{#each data.posts.filter((b) => b?.type?.[0] === 'inspiration') as blog}
					<a href={`/community/${blog.slug}`} class="blog-card" class:has-image={blog.pic}>
						{#if blog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{blog.title}</h3>
							<p>{blog.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section class="content-section">
			<h2>The Ideas Behind 9takes</h2>
			<div class="blog-grid">
				{#each data.posts.filter((b) => b?.type?.[0] === 'idea') as blog}
					<a href={`/community/${blog.slug}`} class="blog-card" class:has-image={blog.pic}>
						{#if blog.pic}
							<div
								class="card-image"
								style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
							></div>
						{/if}
						<div class="card-overlay"></div>
						<div class="card-content">
							<h3>{blog.title}</h3>
							<p>{blog.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- FAQ Section -->
		<FAQSection faqs={communityFAQs} title="About 9takes" />
	</main>
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme - Community */
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
		width: 350px;
		height: 175px;
		background: radial-gradient(ellipse, rgba(124, 58, 237, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%);
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
		color: #94a3b8;
		line-height: 1.7;
		margin: 0;

		strong {
			color: #e2e8f0;
		}
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 3rem;

		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			color: #f1f5f9;
			margin: 0 0 1.25rem;
			padding-bottom: 0.75rem;
			border-bottom: 1px solid rgba(100, 116, 139, 0.15);
			display: flex;
			align-items: center;
			gap: 0.75rem;

			&::before {
				content: '';
				width: 3px;
				height: 1.25rem;
				background: linear-gradient(180deg, #7c3aed 0%, #a78bfa 100%);
				border-radius: 2px;
			}
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
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
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

		.main-content {
			padding: 1rem 1rem 2.5rem;
		}

		.content-section {
			margin-bottom: 2.5rem;

			h2 {
				font-size: 1.0625rem;
				margin-bottom: 1rem;
				padding-bottom: 0.5rem;
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

		.content-section h2 {
			font-size: 0.9375rem;
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
	}
</style>
