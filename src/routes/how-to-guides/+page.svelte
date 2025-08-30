<!-- src/routes/how-to-guides/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	export let data: PageData;
</script>

<svelte:head></svelte:head>

<BlogPageHead
	data={{
		title: '9takes Guides',
		description: 'Guides to various topics'
	}}
	slug={`how-to-guides`}
/>

<div class="how-to-guides-wrapper">
	<header class="page-header">
		<h1>How-To Guides</h1>
		<p class="page-description">Practical guides to help you navigate life with the Enneagram</p>
	</header>

	<div class="guides-grid">
		{#each data.posts as blog}
			<a
				href={`/how-to-guides/${blog.slug}`}
				class="guide-card {!blog.pic ? 'no-image' : 'has-image'}"
				style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}
			>
				<div class="card-content">
					<h3>
						{blog.title}
					</h3>
					<p>{blog.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<!-- style="--tag: h-blog--tough-conversations-to-have-with-your-partner-or-yngmi;" -->
<style lang="scss">
	/* Style Guide Compliant Styles with isolation */
	.how-to-guides-wrapper {
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
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
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

		/* Guides Grid - Style Guide Compliant */
		.guides-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
			margin-bottom: 4rem;
		}

		.guide-card {
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
			.guides-grid {
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

			.guides-grid {
				grid-template-columns: repeat(2, 1fr);
				gap: 1rem;
			}

			.guide-card .card-content h3 {
				font-size: 1rem;
			}

			.guide-card .card-content p {
				font-size: 0.8rem;
			}
		}

		@media (max-width: 550px) {
			.guides-grid {
				grid-template-columns: repeat(2, 1fr);
				gap: 0.75rem;
			}
			
			.guide-card .card-content {
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
