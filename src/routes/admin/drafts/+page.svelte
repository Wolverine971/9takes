<!-- src/routes/admin/drafts/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';

	export let data: PageData;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getPersonFromPath(path: string) {
		const filename = path.split('/').pop();
		return filename?.replace('.md', '') || 'Unknown';
	}

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

<SEOHead
	title="Blog Drafts - Admin Panel | 9takes"
	description="Review and manage celebrity personality analysis blog drafts"
	canonical="https://9takes.com/admin/drafts"
	robots="noindex, nofollow"
/>

<main class="drafts-page">
	<div class="header-section">
		<h1>Blog Drafts</h1>
		<p class="header-subtitle">
			Review and manage celebrity personality analysis drafts before publication
		</p>
		<div class="stats">
			<span class="stat-item">
				<strong>{data.drafts.length}</strong> draft{data.drafts.length !== 1 ? 's' : ''}
			</span>
		</div>
	</div>

	{#if data.drafts.length === 0}
		<div class="empty-state">
			<h2>No drafts yet</h2>
			<p>Use the blog content creator to generate new celebrity personality analysis drafts.</p>
		</div>
	{:else}
		<section class="drafts-grid">
			{#each data.drafts as draft (draft.slug)}
				<article class="draft-card">
					<a
						href="/admin/drafts/{getPersonFromPath(draft.path)}"
						class="draft-link"
						data-tag={`h-draft-${formatBlogSlug(draft.title || '')}`}
					>
						<div class="draft-content">
							<div class="draft-header">
								<h3>{draft.title || 'Untitled Draft'}</h3>
								<div class="draft-meta">
									<span class="person-name">
										{getPersonFromPath(draft.path)}
									</span>
									{#if draft.enneagram}
										<span class="enneagram-badge">
											Type {draft.enneagram}
										</span>
									{/if}
								</div>
							</div>

							{#if draft.description}
								<p class="draft-description">{draft.description}</p>
							{/if}

							<div class="draft-footer">
								<div class="draft-dates">
									{#if draft.lastmod}
										<span class="last-modified">
											Modified: {formatDate(draft.lastmod)}
										</span>
									{/if}
									{#if draft.date}
										<span class="created-date">
											Created: {formatDate(draft.date)}
										</span>
									{/if}
								</div>

								<div class="draft-actions">
									<span class="view-draft">
										View Draft
										<ArrowRightIcon
											iconStyle={'margin-left: .5rem'}
											height={'1rem'}
											fill={'currentColor'}
										/>
									</span>
								</div>
							</div>
						</div>
					</a>
				</article>
			{/each}
		</section>
	{/if}
</main>

<style lang="scss">
	.drafts-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header-section {
		margin-bottom: 3rem;
		text-align: center;

		h1 {
			font-size: 2.5rem;
			font-weight: 700;
			color: #2d3436;
			margin-bottom: 1rem;
		}

		.header-subtitle {
			font-size: 1.2rem;
			color: #636e72;
			margin-bottom: 2rem;
			max-width: 600px;
			margin-left: auto;
			margin-right: auto;
		}

		.stats {
			display: flex;
			justify-content: center;
			gap: 2rem;

			.stat-item {
				background: #f8f9fa;
				padding: 0.75rem 1.5rem;
				border-radius: 8px;
				border: 1px solid #e9ecef;

				strong {
					color: #2d3436;
				}
			}
		}
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: #f8f9fa;
		border-radius: 16px;
		border: 2px dashed #dee2e6;

		h2 {
			color: #495057;
			margin-bottom: 1rem;
		}

		p {
			color: #6c757d;
			font-size: 1.1rem;
		}
	}

	.drafts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 2rem;
	}

	.draft-card {
		background: white;
		border-radius: 16px;
		border: 1px solid #e9ecef;
		overflow: hidden;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
			border-color: #667eea;
		}
	}

	.draft-link {
		display: block;
		text-decoration: none;
		color: inherit;
		height: 100%;

		&:hover {
			text-decoration: none;
		}
	}

	.draft-content {
		padding: 2rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.draft-header {
		margin-bottom: 1rem;

		h3 {
			font-size: 1.25rem;
			font-weight: 700;
			color: #2d3436;
			margin: 0 0 0.75rem 0;
			line-height: 1.4;
		}

		.draft-meta {
			display: flex;
			align-items: center;
			gap: 1rem;
			flex-wrap: wrap;

			.person-name {
				background: #667eea;
				color: white;
				padding: 0.25rem 0.75rem;
				border-radius: 20px;
				font-size: 0.875rem;
				font-weight: 600;
			}

			.enneagram-badge {
				background: #74b9ff;
				color: white;
				padding: 0.25rem 0.75rem;
				border-radius: 20px;
				font-size: 0.875rem;
				font-weight: 600;
			}
		}
	}

	.draft-description {
		color: #636e72;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.draft-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: auto;
		flex-wrap: wrap;
		gap: 1rem;

		.draft-dates {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			font-size: 0.875rem;
			color: #868e96;

			.last-modified {
				font-weight: 600;
				color: #495057;
			}
		}

		.draft-actions {
			.view-draft {
				display: flex;
				align-items: center;
				color: #667eea;
				font-weight: 600;
				font-size: 0.875rem;
				transition: color 0.3s ease;
			}
		}
	}

	.draft-card:hover {
		.view-draft {
			color: #4c63d2;
		}
	}

	@media (max-width: 768px) {
		.drafts-page {
			padding: 1rem;
		}

		.header-section h1 {
			font-size: 2rem;
		}

		.drafts-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.draft-content {
			padding: 1.5rem;
		}

		.draft-footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
