<!-- src/routes/admin/consulting/resources/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const categoryLabels: Record<string, string> = {
		playbook: 'Playbook',
		framework: 'Framework',
		script: 'Script',
		reference: 'Reference',
		exercise: 'Exercise'
	};

	const escapeHtml = (str: string): string =>
		str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

	// Simple markdown-to-HTML conversion for display
	function parseMarkdown(md: string): string {
		if (!md) return '';

		const safeContent = escapeHtml(md);

		return (
			safeContent
				// Headers
				.replace(/^### (.*$)/gm, '<h3>$1</h3>')
				.replace(/^## (.*$)/gm, '<h2>$1</h2>')
				.replace(/^# (.*$)/gm, '<h1>$1</h1>')
				// Bold
				.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
				// Italic
				.replace(/\*(.*?)\*/g, '<em>$1</em>')
				// Code blocks
				.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
				// Inline code
				.replace(/`(.*?)`/g, '<code>$1</code>')
				// Blockquotes
				.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
				// Horizontal rules
				.replace(/^---$/gm, '<hr>')
				// Unordered lists
				.replace(/^- (.*$)/gm, '<li>$1</li>')
				// Tables (basic)
				.replace(/\| (.*) \|/g, (match) => {
					const cells = match.split('|').filter((c) => c.trim());
					return '<tr>' + cells.map((c) => `<td>${c.trim()}</td>`).join('') + '</tr>';
				})
				// Paragraphs
				.replace(/\n\n/g, '</p><p>')
				// Line breaks
				.replace(/\n/g, '<br>')
		);
	}
</script>

<div class="resource-page">
	<div class="page-header">
		<a href="/admin/consulting/resources" class="back-link"> &larr; All Resources </a>
		<div class="header-meta">
			<span class="category-badge"
				>{categoryLabels[data.resource.category] || data.resource.category}</span
			>
			{#if data.resource.is_pinned}
				<span class="pinned-badge">Pinned</span>
			{/if}
		</div>
		<h1>{data.resource.title}</h1>
		{#if data.resource.description}
			<p class="description">{data.resource.description}</p>
		{/if}
	</div>

	<div class="content-grid">
		<div class="main-content">
			<div class="resource-content">
				{@html parseMarkdown(data.resource.content)}
			</div>
		</div>

		{#if data.relatedResources.length > 0}
			<div class="sidebar">
				<div class="sidebar-card">
					<h3>Related Resources</h3>
					<div class="related-list">
						{#each data.relatedResources as related}
							<a href="/admin/consulting/resources/{related.slug}" class="related-item">
								<span class="related-title">{related.title}</span>
								{#if related.description}
									<span class="related-desc">{related.description}</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>

				{#if data.resource.related_blog_slug}
					<div class="sidebar-card">
						<h3>Related Blog Post</h3>
						<a href="/{data.resource.related_blog_slug}" target="_blank" class="blog-link">
							View on 9takes →
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.resource-page {
		max-width: 1100px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.back-link {
		display: inline-block;
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: 0.5rem;
	}

	.back-link:hover {
		color: var(--primary);
	}

	.header-meta {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.category-badge {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.pinned-badge {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.page-header h1 {
		font-size: 1.75rem;
		margin: 0 0 0.5rem;
	}

	.description {
		color: var(--text-secondary);
		font-size: 1rem;
		margin: 0;
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 1.5rem;
	}

	.main-content {
		min-width: 0;
	}

	.resource-content {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 2rem;
		line-height: 1.7;
	}

	/* Markdown Content Styles */
	.resource-content :global(h1) {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.resource-content :global(h1:first-child) {
		margin-top: 0;
	}

	.resource-content :global(h2) {
		font-size: 1.25rem;
		margin: 1.75rem 0 0.75rem;
		color: var(--primary);
	}

	.resource-content :global(h3) {
		font-size: 1rem;
		margin: 1.5rem 0 0.5rem;
	}

	.resource-content :global(h4) {
		font-size: 0.9rem;
		margin: 1.25rem 0 0.5rem;
		font-weight: 600;
	}

	.resource-content :global(p) {
		margin: 0 0 1rem;
	}

	.resource-content :global(strong) {
		font-weight: 600;
		color: var(--text-primary);
	}

	.resource-content :global(blockquote) {
		margin: 1rem 0;
		padding: 0.75rem 1rem;
		background: rgba(99, 102, 241, 0.05);
		border-left: 3px solid var(--primary);
		font-style: italic;
	}

	.resource-content :global(code) {
		background: var(--hover-background);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.85em;
		font-family: monospace;
	}

	.resource-content :global(pre) {
		background: var(--hover-background);
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.resource-content :global(pre code) {
		background: none;
		padding: 0;
	}

	.resource-content :global(li) {
		margin: 0.25rem 0;
		padding-left: 0.5rem;
	}

	.resource-content :global(hr) {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 2rem 0;
	}

	.resource-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.resource-content :global(td) {
		padding: 0.5rem;
		border: 1px solid var(--border-color);
	}

	/* Sidebar */
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sidebar-card {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
	}

	.sidebar-card h3 {
		font-size: 0.85rem;
		margin: 0 0 0.75rem;
		color: var(--text-secondary);
	}

	.related-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.related-item {
		display: block;
		padding: 0.5rem;
		background: var(--hover-background);
		border-radius: 6px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.related-item:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.related-title {
		display: block;
		font-weight: 500;
		font-size: 0.85rem;
		color: var(--text-primary);
	}

	.related-desc {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.blog-link {
		color: var(--primary);
		text-decoration: none;
		font-size: 0.85rem;
	}

	.blog-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.sidebar {
			order: -1;
		}

		.resource-content {
			padding: 1.25rem;
		}
	}
</style>
