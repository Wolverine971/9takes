<!-- src/routes/how-to-guides/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;
</script>

<SEOHead
	title="How-To Guides | Practical Life Advice | 9takes"
	description="Practical guides to help you navigate life, relationships, and personal growth with the Enneagram."
	canonical="https://9takes.com/how-to-guides"
/>

<div class="page-wrapper">
	<header class="hero">
		<h1>How-To Guides</h1>
	</header>

	<main class="main-content">
		<div class="blog-grid">
			{#each data.posts as blog}
				<a href={`/how-to-guides/${blog.slug}`} class="blog-card" class:has-image={blog.pic}>
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
	</main>
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme - How-To Guides */
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
