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
	.page-wrapper {
		min-height: 100vh;

		a::after {
			display: none !important;
		}
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 1.5rem;
		text-align: center;
	}

	.hero h1 {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		color: var(--text-primary);
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
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
	}

	/* Responsive */
	@media (max-width: 900px) {
		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 1.25rem 0.75rem 1rem;
		}

		.hero h1 {
			font-size: 1.35rem;
		}

		.main-content {
			padding: 1rem 0.75rem 2rem;
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
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.2rem;
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
