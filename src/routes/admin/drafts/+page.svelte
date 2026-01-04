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
		margin-bottom: 2.5rem;

		h1 {
			font-size: 1.75rem;
			font-weight: 700;
			color: var(--text-primary, #1e293b);
			margin-bottom: 0.5rem;
		}

		.header-subtitle {
			font-size: 0.95rem;
			color: var(--text-secondary, #64748b);
			margin-bottom: 1.5rem;
		}

		.stats {
			display: flex;
			gap: 1rem;

			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0.75rem 1.25rem;
				background: var(--card-background, #fff);
				border: 1px solid var(--border-color, #e2e8f0);
				border-radius: 12px;
				min-width: 100px;

				strong {
					font-size: 1.5rem;
					font-weight: 700;
					color: var(--primary, #6366f1);
				}
			}
		}
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--card-background, #fff);
		border-radius: 16px;
		border: 1px solid var(--border-color, #e2e8f0);

		h2 {
			color: var(--text-primary, #1e293b);
			margin-bottom: 0.5rem;
			font-size: 1.25rem;
		}

		p {
			color: var(--text-secondary, #64748b);
			font-size: 0.95rem;
		}
	}

	.drafts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
		gap: 1.5rem;
	}

	.draft-card {
		background: var(--card-background, #fff);
		border-radius: 16px;
		border: 1px solid var(--border-color, #e2e8f0);
		overflow: hidden;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
			border-color: var(--primary, #6366f1);
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
		padding: 1.5rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.draft-header {
		margin-bottom: 1rem;

		h3 {
			font-size: 1.125rem;
			font-weight: 600;
			color: var(--text-primary, #1e293b);
			margin: 0 0 0.75rem 0;
			line-height: 1.4;
		}

		.draft-meta {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			flex-wrap: wrap;

			.person-name {
				background: var(--primary, #6366f1);
				color: white;
				padding: 0.25rem 0.75rem;
				border-radius: 20px;
				font-size: 0.75rem;
				font-weight: 600;
			}

			.enneagram-badge {
				background: rgba(99, 102, 241, 0.1);
				color: var(--primary, #6366f1);
				padding: 0.25rem 0.75rem;
				border-radius: 20px;
				font-size: 0.75rem;
				font-weight: 600;
			}
		}
	}

	.draft-description {
		color: var(--text-secondary, #64748b);
		line-height: 1.6;
		margin: 0 0 1rem 0;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 0.875rem;
	}

	.draft-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: auto;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e2e8f0);

		.draft-dates {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			font-size: 0.75rem;
			color: var(--text-secondary, #64748b);

			.last-modified {
				font-weight: 600;
				color: var(--text-primary, #1e293b);
			}
		}

		.draft-actions {
			.view-draft {
				display: flex;
				align-items: center;
				color: var(--primary, #6366f1);
				font-weight: 600;
				font-size: 0.875rem;
				transition: color 0.2s ease;
			}
		}
	}

	.draft-card:hover {
		.view-draft {
			color: #4f46e5;
		}
	}

	@media (max-width: 768px) {
		.drafts-page {
			padding: 1rem;
		}

		.header-section h1 {
			font-size: 1.5rem;
		}

		.header-section .stats {
			width: 100%;
		}

		.header-section .stats .stat-item {
			flex: 1;
		}

		.drafts-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.draft-content {
			padding: 1.25rem;
		}

		.draft-footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
