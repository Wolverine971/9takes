<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const sections = [
		{
			id: 'community',
			title: 'Community',
			subtitle: 'Ideas & inspiration behind 9takes',
			key: 'community' as const,
			href: '/community',
			linkPrefix: '/community'
		},
		{
			id: 'guides',
			title: 'How-to Guides',
			subtitle: 'Practical personality guides',
			key: 'guides' as const,
			href: '/how-to-guides',
			linkPrefix: '/how-to-guides'
		},
		{
			id: 'enneagram',
			title: 'Enneagram Corner',
			subtitle: 'Deep dives into the 9 types',
			key: 'enneagram' as const,
			href: '/enneagram-corner',
			linkPrefix: '/enneagram-corner'
		},
		{
			id: 'people',
			title: 'Personality Analysis',
			subtitle: 'Famous people through the Enneagram lens',
			key: 'people' as const,
			href: '/personality-analysis',
			linkPrefix: '/personality-analysis'
		}
	];
</script>

<SEOHead
	title="All Blogs | 9takes"
	description="Explore all 9takes blogs: Enneagram deep dives, personality analyses of famous people, practical guides, and community insights."
	canonical="https://9takes.com/blog"
/>

<div class="page-wrapper">
	<header class="hero">
		<h1>All Blogs</h1>
		<p class="hero-subtitle">
			Personality insights, Enneagram deep dives, and real-world analysis
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
					</div>
					<a href={section.href} class="view-all-link">
						View all &rarr;
					</a>
				</div>

				<div class="blog-grid">
					{#each data[section.key] as blog}
						{@const isPerson = section.key === 'people'}
						<a
							href="{section.linkPrefix}/{blog.slug}"
							class="blog-card"
							class:has-image={blog.pic || isPerson}
						>
							{#if isPerson && blog.enneagram}
								<div
									class="card-image"
									style="background-image: url(/types/{blog.enneagram}s/s-{blog.slug}.webp);"
								></div>
							{:else if blog.pic}
								<div
									class="card-image"
									style="background-image: url(/blogs/s-{blog.pic}.webp);"
								></div>
							{/if}
							<div class="card-overlay"></div>
							<div class="card-content">
								<h3>
									{#if isPerson}
										{blog.slug.split('-').join(' ')}
									{:else}
										{blog.title}
									{/if}
								</h3>
								{#if !isPerson && blog.description}
									<p>{blog.description}</p>
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
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
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

	.hero-subtitle {
		font-size: 1rem;
		color: #64748b;
		margin: 0.5rem 0 0;
		position: relative;
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

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.nav-pill {
		display: flex;
		align-items: center;
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
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(100, 116, 139, 0.15);
		gap: 1rem;

		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			color: #f1f5f9;
			margin: 0;
			line-height: 1.3;
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

	.section-subtitle {
		font-size: 0.8125rem;
		color: #64748b;
		margin: 0.25rem 0 0;
	}

	.view-all-link {
		font-size: 0.8125rem;
		font-weight: 500;
		color: #64748b;
		text-decoration: none;
		transition: all 0.2s ease;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid transparent;
		white-space: nowrap;

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
			text-transform: capitalize;
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
