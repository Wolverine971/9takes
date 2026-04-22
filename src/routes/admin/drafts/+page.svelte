<!-- src/routes/admin/drafts/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';

	let { data }: { data: PageData } = $props();

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
	noindex
	nofollow
/>

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

<style lang="scss">
	.header-section {
		margin-bottom: 1.5rem;

		h1 {
			font-size: 1.75rem;
			font-weight: 700;
			color: var(--text-primary);
			margin-bottom: 0.5rem;
		}

		.header-subtitle {
			font-size: 0.9rem;
			color: var(--text-secondary);
			margin-bottom: 1rem;
		}

		.stats {
			display: flex;
			gap: 1rem;

			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 0.75rem 1.25rem;
				background: var(--bg-surface);
				border: 1px solid var(--bg-elevated);
				border-radius: 12px;
				min-width: 100px;
				color: var(--text-secondary);

				strong {
					font-size: 1.5rem;
					font-weight: 700;
					color: var(--primary);
				}
			}
		}
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1.5rem;
		background: var(--bg-surface);
		border-radius: 12px;
		border: 1px solid var(--bg-elevated);

		h2 {
			color: var(--text-primary);
			margin-bottom: 0.5rem;
			font-size: 1.25rem;
		}

		p {
			color: var(--text-secondary);
			font-size: 0.9rem;
		}
	}

	.drafts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		gap: 1rem;
	}

	.draft-card {
		background: var(--bg-surface);
		border-radius: 12px;
		border: 1px solid var(--bg-elevated);
		overflow: hidden;
		transition: all 0.15s ease;

		&:hover {
			transform: translateY(-1px);
			box-shadow: var(--glow-sm);
			border-color: var(--primary);
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
		padding: 1.25rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.draft-header {
		margin-bottom: 0.75rem;

		h3 {
			font-size: 1.05rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0 0 0.625rem 0;
			line-height: 1.4;
		}

		.draft-meta {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			flex-wrap: wrap;

			.person-name {
				background: var(--primary);
				color: white;
				padding: 0.2rem 0.625rem;
				border-radius: 20px;
				font-size: 0.7rem;
				font-weight: 600;
			}

			.enneagram-badge {
				background: rgba(139, 92, 246, 0.1);
				color: var(--primary);
				padding: 0.2rem 0.625rem;
				border-radius: 20px;
				font-size: 0.7rem;
				font-weight: 600;
			}
		}
	}

	.draft-description {
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0 0 0.75rem 0;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 0.825rem;
	}

	.draft-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-top: auto;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--bg-elevated);

		.draft-dates {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
			font-size: 0.7rem;
			color: var(--text-secondary);

			.last-modified {
				font-weight: 600;
				color: var(--text-primary);
			}
		}

		.draft-actions {
			.view-draft {
				display: flex;
				align-items: center;
				color: var(--primary);
				font-weight: 600;
				font-size: 0.8rem;
				transition: opacity 0.15s ease;
			}
		}
	}

	.draft-card:hover {
		.view-draft {
			opacity: 0.8;
		}
	}

	@media (max-width: 768px) {
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
		}

		.draft-content {
			padding: 1rem;
		}

		.draft-footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
