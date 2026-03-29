<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type BlogCardPost = PageData['popCulture'][number];
	type BlogCardPerson = PageData['people'][number];
	type BlogCard = BlogCardPost | BlogCardPerson;

	function isPersonCard(blog: BlogCard): blog is BlogCardPerson {
		return 'enneagram' in blog;
	}

	function isPostCard(blog: BlogCard): blog is BlogCardPost {
		return 'title' in blog;
	}

	const sections = [
		{
			id: 'pop-culture',
			title: 'Pop Culture',
			subtitle: 'The psychology behind the headlines',
			description:
				'Cultural phenomena, criminal psychology, and social dynamics decoded through personality patterns.',
			key: 'popCulture' as const,
			href: '/pop-culture',
			linkPrefix: '/pop-culture',
			isPerson: false
		},
		{
			id: 'people',
			title: 'Personality Analysis',
			subtitle: 'Famous people through the Enneagram lens',
			description:
				'Deep dives into the personality types of celebrities, leaders, and public figures.',
			key: 'people' as const,
			href: '/personality-analysis',
			linkPrefix: '/personality-analysis',
			isPerson: true
		},
		{
			id: 'enneagram',
			title: 'Enneagram Corner',
			subtitle: 'Deep dives into the 9 types',
			description:
				'Core education on the Enneagram system — from basics to advanced type dynamics.',
			key: 'enneagram' as const,
			href: '/enneagram-corner',
			linkPrefix: '/enneagram-corner',
			isPerson: false
		},
		{
			id: 'guides',
			title: 'How-to Guides',
			subtitle: 'Practical personality guides',
			description:
				'Actionable frameworks for using personality insights in relationships, work, and daily life.',
			key: 'guides' as const,
			href: '/how-to-guides',
			linkPrefix: '/how-to-guides',
			isPerson: false
		},
		{
			id: 'community',
			title: 'Community',
			subtitle: 'Ideas & inspiration behind 9takes',
			description: 'The philosophy, stories, and ideas driving the 9takes platform.',
			key: 'community' as const,
			href: '/community',
			linkPrefix: '/community',
			isPerson: false
		}
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': 'https://9takes.com/blog#webpage',
				name: 'Personality & Enneagram Blog',
				description:
					'Explore personality through pop culture psychology, famous people analysis, Enneagram deep dives, and practical guides.',
				url: 'https://9takes.com/blog',
				inLanguage: 'en-US',
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com'
				},
				breadcrumb: { '@id': 'https://9takes.com/blog#breadcrumb' },
				mainEntity: {
					'@type': 'ItemList',
					itemListElement: sections.map((section, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: section.title,
						url: `https://9takes.com${section.href}`
					}))
				}
			},
			{
				'@type': 'BreadcrumbList',
				'@id': 'https://9takes.com/blog#breadcrumb',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: 'https://9takes.com'
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Blog',
						item: 'https://9takes.com/blog'
					}
				]
			}
		]
	};
</script>

<SEOHead
	title="Personality & Enneagram Blog | 9takes"
	description="Explore personality through pop culture psychology, famous people analysis, Enneagram deep dives, and practical guides. One system, many lenses."
	canonical="https://9takes.com/blog"
	{jsonLd}
/>

<div class="page-wrapper">
	<header class="hero">
		<h1>One System. Many Lenses.</h1>
		<p class="hero-subtitle">
			Decode personality patterns across pop culture, famous figures, and everyday life through the
			Enneagram.
		</p>
	</header>

	<!-- Quick Navigation -->
	<nav class="quick-nav" aria-label="Blog sections">
		<div class="nav-scroll">
			{#each sections as section}
				<a href="#{section.id}" class="nav-pill">
					{section.title}
				</a>
			{/each}
		</div>
	</nav>

	<main class="main-content">
		{#each sections as section}
			<section class="content-section" id={section.id}>
				<div class="section-header">
					<div>
						<h2>{section.title}</h2>
						<p class="section-subtitle">{section.subtitle}</p>
						<p class="section-description">{section.description}</p>
					</div>
					<a href={section.href} class="view-all-link"> View all &rarr; </a>
				</div>

				<div class="blog-grid">
					{#each data[section.key] as blog}
						{@const personCard = isPersonCard(blog) ? blog : null}
						{@const postCard = isPostCard(blog) ? blog : null}
						{@const pic = postCard?.pic ?? null}
						<a
							href={personCard
								? buildPersonalityAnalysisPath(personCard.slug)
								: `${section.linkPrefix}/${blog.slug}`}
							class="blog-card"
							class:has-image={pic || Boolean(personCard)}
						>
							{#if personCard?.enneagram}
								<div
									class="card-image"
									style={`background-image: url(${buildPersonalityImagePath(personCard.enneagram, personCard.slug, 'thumbnail')});`}
								></div>
							{:else if pic}
								<div class="card-image" style="background-image: url(/blogs/s-{pic}.webp);"></div>
							{/if}
							<div class="card-overlay"></div>
							<div class="card-content">
								<h3>
									{#if personCard}
										{formatPersonalityDisplayName(personCard.slug)}
									{:else if postCard}
										{postCard.title}
									{/if}
								</h3>
								{#if postCard?.description}
									<p>{postCard.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</main>
</div>

<style lang="scss">
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
	}

	/* Hero */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 1rem;
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
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: 1rem;
		color: var(--text-secondary);
		margin: 0.75rem auto 0;
		position: relative;
		max-width: 540px;
		line-height: 1.6;
	}

	/* Quick Navigation */
	.quick-nav {
		background: linear-gradient(
			180deg,
			var(--bg-deep) 0%,
			color-mix(in srgb, var(--bg-deep) 95%, transparent) 100%
		);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(45, 212, 191, 0.15);
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

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.nav-pill {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: var(--bg-surface);
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		flex-shrink: 0;

		&:hover {
			background: rgba(45, 212, 191, 0.15);
			color: var(--accent-light);
			border-color: rgba(45, 212, 191, 0.4);
			transform: translateY(-1px);
		}
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 4rem;
	}

	/* Sections */
	.content-section {
		margin-bottom: 3rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
		gap: 1rem;

		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0;
			line-height: 1.3;
			display: flex;
			align-items: center;
			gap: 0.75rem;

			&::before {
				content: '';
				width: 3px;
				height: 1.25rem;
				background: linear-gradient(180deg, var(--primary-dark) 0%, var(--accent-light) 100%);
				border-radius: 2px;
			}
		}
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0.25rem 0 0;
	}

	.section-description {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin: 0.375rem 0 0;
		max-width: 600px;
		line-height: 1.5;
	}

	.view-all-link {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-tertiary);
		text-decoration: none;
		transition: all 0.2s ease;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid transparent;
		white-space: nowrap;
		margin-top: 0.25rem;

		&:hover {
			color: var(--accent-light);
			background: rgba(45, 212, 191, 0.1);
			border-color: rgba(45, 212, 191, 0.2);
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
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: rgba(45, 212, 191, 0.3);
			box-shadow:
				0 8px 24px rgba(0, 0, 0, 0.3),
				0 0 0 1px rgba(45, 212, 191, 0.1);

			&::before {
				opacity: 1;
			}

			.card-image {
				transform: scale(1.05);
			}

			.card-content h3 {
				color: var(--accent-light);
			}
		}

		&.has-image {
			.card-overlay {
				background: linear-gradient(
					to top,
					color-mix(in srgb, var(--bg-deep) 95%, transparent) 0%,
					color-mix(in srgb, var(--bg-deep) 60%, transparent) 40%,
					color-mix(in srgb, var(--bg-deep) 30%, transparent) 100%
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
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--bg-surface) 95%, transparent) 0%,
			color-mix(in srgb, var(--bg-deep) 98%, transparent) 100%
		);
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
			color: var(--text-primary);
			transition: color 0.2s ease;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-transform: capitalize;
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

		.hero-subtitle {
			font-size: 0.875rem;
		}

		.nav-scroll {
			padding: 0.375rem 1rem;
			gap: 0.375rem;
			justify-content: flex-start;
		}

		.nav-pill {
			padding: 0.4rem 0.75rem;
			font-size: 0.75rem;
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

			h2 {
				font-size: 1.0625rem;
			}
		}

		.section-subtitle {
			font-size: 0.75rem;
		}

		.section-description {
			display: none;
		}

		.view-all-link {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
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
