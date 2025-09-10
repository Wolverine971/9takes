<!-- src/routes/community/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import Layout from '$lib/components/blog/layout.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
</script>

<svelte:head></svelte:head>

<BlogPageHead
	data={{
		title: '9takes Community Blogs',
		description: 'List blogs outlining the ideas behind 9takes.'
	}}
	slug={`community`}
/>

<div class="community-page-wrapper">
	<header class="page-header">
		<h1>9takes Community</h1>
		<p class="page-description">Discover the inspiration and ideas behind 9takes</p>
	</header>

	<section class="content-section">
		<h2>The Inspiration Behind 9takes</h2>
		<div class="blog-grid">
			{#each data.posts as blog}
				{#if blog?.type?.[0] === 'inspiration'}
					<a
						href={`/community/${blog.slug}`}
						class="blog-card {!blog.pic ? 'no-image' : 'has-image'}"
						style:background-image={blog.pic ? `url(/blogs/s-${blog.pic}.webp)` : null}
					>
						<div class="card-content">
							<h3>
								{blog.title}
							</h3>
							<p>{blog.description}</p>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</section>

	<section class="content-section">
		<h2>The Ideas Behind 9takes</h2>
		<div class="blog-grid">
			{#each data.posts as blog}
				{#if blog?.type?.[0] === 'idea'}
					<a
						href={`/community/${blog.slug}`}
						class="blog-card {!blog.pic ? 'no-image' : 'has-image'}"
						style:background-image={blog.pic ? `url(/blogs/s-${blog.pic}.webp)` : null}
					>
						<div class="card-content">
							<h3>
								{blog.title}
							</h3>
							<p>{blog.description}</p>
						</div>
					</a>
				{/if}
			{/each}
		</div>
	</section>
</div>

<style lang="scss">
	/* Style Guide Compliant Styles with isolation */
	.community-page-wrapper {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1.5rem;

		// Reset global styles
		* {
			box-sizing: border-box;
		}

		article,
		h1,
		h2,
		h3,
		p {
			all: unset;
			display: block;
		}

		a {
			text-decoration: none !important;

			&::after {
				display: none !important;
			}
		}

		.page-header {
			text-align: center;
			margin-bottom: 4rem;
			padding: 3rem;
			background: linear-gradient(
				135deg,
				theme('colors.gray.700') 0%,
				theme('colors.gray.800') 100%
			);
			border-radius: 20px;
			color: white;

			h1 {
				font-size: 2.5rem;
				font-weight: 700;
				margin-bottom: 1rem;
				color: white;
			}

			.page-description {
				font-size: 1.125rem;
				color: rgba(255, 255, 255, 0.95);
				max-width: 600px;
				margin: 0 auto;
				line-height: 1.6;
			}
		}

		.content-section {
			margin-bottom: 4rem;

			h2 {
				font-size: 1.875rem;
				font-weight: 600;
				color: #2d3436;
				margin-bottom: 2rem;
			}
		}

		/* Blog Grid - Style Guide Compliant */
		.blog-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
			margin-bottom: 2rem;
		}

		.blog-card {
			aspect-ratio: 3 / 4;
			border-radius: 12px;
			background: white;
			border: 1px solid rgba(0, 0, 0, 0.06);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			text-decoration: none !important;
			display: flex;
			position: relative;
			overflow: hidden;

			&.has-image {
				background-size: cover !important;
				background-position: center !important;
			}

			&:hover {
				transform: translateY(-4px);
				box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
				border-color: rgba(108, 92, 231, 0.2);
			}

			/* Dark cards for no-image items */
			&.no-image {
				background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
				border: 1px solid rgba(255, 255, 255, 0.08);

				&:hover {
					background: linear-gradient(135deg, #2d3436 0%, #3d4447 100%);
				}

				.card-content {
					background: none;

					h3 {
						color: white;
					}

					p {
						color: rgba(255, 255, 255, 0.8);
					}
				}
			}

			.card-content {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				padding: 1.5rem;
				background: linear-gradient(
					to top,
					rgba(0, 0, 0, 0.9) 0%,
					rgba(0, 0, 0, 0.7) 60%,
					rgba(0, 0, 0, 0.2) 100%
				);
				min-height: 60%;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				gap: 0.75rem;

				h3 {
					color: white;
					font-size: 1.15rem;
					font-weight: 600;
					line-height: 1.35;
					margin: 0;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				p {
					color: rgba(255, 255, 255, 0.95);
					font-size: 0.875rem;
					line-height: 1.5;
					margin: 0;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}
		}

		/* Responsive breakpoints */
		@media (max-width: 900px) {
			.blog-grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		@media (max-width: 768px) {
			.page-header {
				padding: 2rem 1.5rem;

				h1 {
					font-size: 2rem;
				}

				.page-description {
					font-size: 1rem;
				}
			}

			.content-section h2 {
				font-size: 1.5rem;
			}

			.blog-grid {
				grid-template-columns: repeat(2, 1fr);
				gap: 1rem;
			}

			.blog-card .card-content h3 {
				font-size: 1rem;
			}

			.blog-card .card-content p {
				font-size: 0.8rem;
			}
		}

		@media (max-width: 550px) {
			.blog-grid {
				grid-template-columns: repeat(2, 1fr);
				gap: 0.75rem;
			}

			.blog-card .card-content {
				padding: 1rem;

				h3 {
					font-size: 0.9rem;
					-webkit-line-clamp: 2;
					line-clamp: 2;
				}

				p {
					font-size: 0.75rem;
					-webkit-line-clamp: 2;
					line-clamp: 2;
				}
			}
		}
	}
</style>
