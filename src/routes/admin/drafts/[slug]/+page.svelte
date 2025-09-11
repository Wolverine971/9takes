<!-- src/routes/admin/drafts/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowLeftIcon from '$lib/components/icons/leftIcon.svelte';

	export let data: PageData;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getWordCount(content: string) {
		// This is a rough estimate since we don't have the actual content here
		// In a real implementation, you might want to extract text from the component
		return '~3,500'; // placeholder
	}
</script>

<SEOHead
	title="Draft: {data.frontmatter.title || data.person} - Admin Panel | 9takes"
	description="Review draft: {data.frontmatter.description || 'Celebrity personality analysis draft'}"
	canonical="https://9takes.com/admin/drafts/{data.slug}"
	robots="noindex, nofollow"
/>

<main class="draft-view">
	<div class="draft-header">
		<div class="navigation">
			<a href="/admin/drafts" class="back-link">
				<ArrowLeftIcon
					iconStyle={'margin-right: .5rem'}
					height={'1rem'}
					fill={'currentColor'}
				/>
				Back to Drafts
			</a>
		</div>

		<div class="draft-info">
			<div class="draft-meta">
				<span class="person-badge">{data.person}</span>
				{#if data.frontmatter.enneagram}
					<span class="enneagram-badge">Enneagram Type {data.frontmatter.enneagram}</span>
				{/if}
				<span class="status-badge draft">DRAFT</span>
			</div>
			
			<h1>{data.frontmatter.title || `${data.person} Personality Analysis`}</h1>
			
			{#if data.frontmatter.description}
				<p class="draft-description">{data.frontmatter.description}</p>
			{/if}

			<div class="draft-stats">
				<div class="stat-grid">
					{#if data.frontmatter.date}
						<div class="stat-item">
							<label>Created</label>
							<span>{formatDate(data.frontmatter.date)}</span>
						</div>
					{/if}
					
					{#if data.frontmatter.lastmod}
						<div class="stat-item">
							<label>Last Modified</label>
							<span>{formatDate(data.frontmatter.lastmod)}</span>
						</div>
					{/if}
					
					<div class="stat-item">
						<label>Word Count</label>
						<span>{getWordCount('')}</span>
					</div>
					
					{#if data.frontmatter.author}
						<div class="stat-item">
							<label>Author</label>
							<span>{data.frontmatter.author}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="draft-actions">
			<button class="btn btn-secondary" type="button">
				Edit Draft
			</button>
			<button class="btn btn-primary" type="button">
				Publish to Database
			</button>
		</div>
	</div>

	<div class="draft-content">
		<div class="content-wrapper">
			<article class="blog-article">
				<svelte:component this={data.component} />
			</article>
		</div>
	</div>
</main>

<style lang="scss">
	.draft-view {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.draft-header {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		border: 1px solid #e9ecef;
	}

	.navigation {
		margin-bottom: 2rem;

		.back-link {
			display: inline-flex;
			align-items: center;
			color: #667eea;
			text-decoration: none;
			font-weight: 600;
			padding: 0.5rem 1rem;
			border-radius: 8px;
			transition: all 0.3s ease;

			&:hover {
				background: #f8f9ff;
				color: #4c63d2;
			}
		}
	}

	.draft-info {
		margin-bottom: 2rem;

		.draft-meta {
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: 1.5rem;
			flex-wrap: wrap;

			.person-badge {
				background: #667eea;
				color: white;
				padding: 0.5rem 1rem;
				border-radius: 20px;
				font-weight: 600;
				font-size: 0.875rem;
			}

			.enneagram-badge {
				background: #74b9ff;
				color: white;
				padding: 0.5rem 1rem;
				border-radius: 20px;
				font-weight: 600;
				font-size: 0.875rem;
			}

			.status-badge {
				padding: 0.5rem 1rem;
				border-radius: 20px;
				font-weight: 600;
				font-size: 0.875rem;

				&.draft {
					background: #fdcb6e;
					color: #2d3436;
				}
			}
		}

		h1 {
			font-size: 2.25rem;
			font-weight: 700;
			color: #2d3436;
			margin: 0 0 1rem 0;
			line-height: 1.3;
		}

		.draft-description {
			font-size: 1.1rem;
			color: #636e72;
			line-height: 1.6;
			margin: 0 0 2rem 0;
		}

		.draft-stats {
			.stat-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
				gap: 1.5rem;

				.stat-item {
					display: flex;
					flex-direction: column;
					gap: 0.25rem;

					label {
						font-size: 0.875rem;
						color: #868e96;
						font-weight: 600;
						text-transform: uppercase;
						letter-spacing: 0.5px;
					}

					span {
						font-size: 1rem;
						color: #2d3436;
						font-weight: 600;
					}
				}
			}
		}
	}

	.draft-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		flex-wrap: wrap;

		.btn {
			padding: 0.75rem 1.5rem;
			border-radius: 8px;
			font-weight: 600;
			text-decoration: none;
			border: none;
			cursor: pointer;
			transition: all 0.3s ease;
			font-size: 0.875rem;

			&.btn-primary {
				background: #00b894;
				color: white;

				&:hover {
					background: #00a085;
					transform: translateY(-2px);
					box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
				}
			}

			&.btn-secondary {
				background: #ddd;
				color: #2d3436;

				&:hover {
					background: #ccc;
					transform: translateY(-2px);
				}
			}
		}
	}

	.draft-content {
		background: white;
		border-radius: 16px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		border: 1px solid #e9ecef;
		overflow: hidden;

		.content-wrapper {
			padding: 3rem;
		}

		.blog-article {
			max-width: none;
			line-height: 1.7;

			// Style the blog content
			:global(h1) {
				font-size: 2rem;
				font-weight: 700;
				color: #2d3436;
				margin: 2rem 0 1rem 0;
				line-height: 1.3;
			}

			:global(h2) {
				font-size: 1.5rem;
				font-weight: 700;
				color: #2d3436;
				margin: 2rem 0 1rem 0;
				line-height: 1.4;
			}

			:global(h3) {
				font-size: 1.25rem;
				font-weight: 600;
				color: #2d3436;
				margin: 1.5rem 0 0.75rem 0;
			}

			:global(p) {
				margin: 0 0 1.5rem 0;
				color: #2d3436;
			}

			:global(.firstLetter) {
				font-size: 1.25rem;
				font-weight: 600;
				line-height: 1.6;
				margin-bottom: 2rem;
			}

			:global(blockquote) {
				border-left: 4px solid #667eea;
				padding: 1rem 1.5rem;
				margin: 2rem 0;
				background: #f8f9ff;
				font-style: italic;
				color: #495057;
			}

			:global(ul), :global(ol) {
				margin: 1rem 0 1.5rem 0;
				padding-left: 2rem;

				:global(li) {
					margin: 0.5rem 0;
				}
			}

			:global(details) {
				margin: 2rem 0;
				border: 1px solid #e9ecef;
				border-radius: 8px;
				overflow: hidden;

				:global(summary) {
					background: #f8f9fa;
					padding: 1rem;
					cursor: pointer;
					font-weight: 600;
					border-bottom: 1px solid #e9ecef;

					&:hover {
						background: #e9ecef;
					}
				}

				:global(.panel) {
					padding: 1.5rem;
				}
			}
		}
	}

	@media (max-width: 768px) {
		.draft-view {
			padding: 1rem;
		}

		.draft-header {
			padding: 1.5rem;
		}

		.draft-info h1 {
			font-size: 1.75rem;
		}

		.draft-actions {
			justify-content: stretch;

			.btn {
				flex: 1;
				text-align: center;
			}
		}

		.content-wrapper {
			padding: 2rem;
		}

		.draft-meta {
			.person-badge,
			.enneagram-badge,
			.status-badge {
				font-size: 0.75rem;
				padding: 0.375rem 0.75rem;
			}
		}
	}
</style>