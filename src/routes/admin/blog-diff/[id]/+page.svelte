<!-- src/routes/admin/blog-diff/[id]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogDiffViewer from '$lib/components/admin/BlogDiffViewer.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let selectedLeftVersion = $state('');
	let selectedRightVersion = $state('');
	let leftContent = $state('');
	let rightContent = $state('');
	let leftTitle = $state('');
	let rightTitle = $state('');
	let viewMode = $state<'diff' | 'single'>('diff');
	let activeTab = $state<'diff' | 'preview'>('diff');

	let selectedRightSource = $derived(
		data.versions?.find((v) => v.id.toString() === selectedRightVersion)?.source
	);

	// Initialize with latest two versions if available
	$effect(() => {
		if (data.versions?.length > 0 && !selectedLeftVersion && !selectedRightVersion) {
			if (data.versions.length >= 2) {
				selectedLeftVersion = data.versions[1].id.toString();
				selectedRightVersion = data.versions[0].id.toString();
				viewMode = 'diff';
			} else {
				selectedRightVersion = data.versions[0].id.toString();
				viewMode = 'single';
			}
			updateDiffContent();
		}
	});

	function updateDiffContent() {
		const leftVersion = data.versions.find((v) => v.id.toString() === selectedLeftVersion);
		const rightVersion = data.versions.find((v) => v.id.toString() === selectedRightVersion);

		leftContent = leftVersion?.content || '';
		rightContent = rightVersion?.content || '';

		leftTitle = leftVersion
			? `Version ${leftVersion.version_number} (${new Date(leftVersion.changed_at).toLocaleDateString()}) - ${getVersionLabel(leftVersion)}`
			: 'Select Version';
		rightTitle = rightVersion
			? `Version ${rightVersion.version_number} (${new Date(rightVersion.changed_at).toLocaleDateString()}) - ${getVersionLabel(rightVersion)}${rightVersion.is_current ? ' (Current)' : ''}`
			: 'Select Version';
	}

	$effect(() => {
		selectedLeftVersion;
		selectedRightVersion;
		updateDiffContent();
		if (selectedLeftVersion && selectedRightVersion) {
			viewMode = 'diff';
		} else if (selectedRightVersion && !selectedLeftVersion) {
			viewMode = 'single';
		}
	});

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString();
	}

	function getVersionLabel(version: any): string {
		switch (version.source) {
			case 'draft':
				return 'Draft File';
			case 'database':
				return 'Published';
			case 'history':
				return 'Historical';
			default:
				return 'Unknown';
		}
	}

	function goBack() {
		goto('/admin/content-board');
	}
</script>

<svelte:head>
	<title>Blog Version Diff - {data.blog?.title || 'Unknown Blog'}</title>
</svelte:head>

<!-- Header -->
<div class="header-section">
	<button class="back-btn" onclick={goBack}> &larr; Back to Content Board </button>

	<div class="page-header">
		<h1>Blog Version History</h1>
	</div>

	{#if data.blog}
		<div class="blog-meta">
			<p class="blog-title">{data.blog.title}</p>
			<p class="blog-person">Person: {data.blog.person}</p>
		</div>
	{/if}
</div>

<!-- Version Selectors -->
<div class="section-card">
	<h2 class="card-title">Compare Versions</h2>
	<div class="selector-grid">
		<div class="selector-group">
			<label for="leftVersion" class="field-label">Left Side (Older)</label>
			<select id="leftVersion" bind:value={selectedLeftVersion} class="field-select">
				<option value="">Select version...</option>
				{#each data.versions as version}
					<option value={version.id}>
						Version {version.version_number} - {formatDate(version.changed_at)} - {getVersionLabel(
							version
						)}
						{version.is_current ? ' (Current)' : ''}
					</option>
				{/each}
			</select>
		</div>

		<div class="selector-group">
			<label for="rightVersion" class="field-label">Right Side (Newer)</label>
			<select id="rightVersion" bind:value={selectedRightVersion} class="field-select">
				<option value="">Select version...</option>
				{#each data.versions as version}
					<option value={version.id}>
						Version {version.version_number} - {formatDate(version.changed_at)} - {getVersionLabel(
							version
						)}
						{version.is_current ? ' (Current)' : ''}
					</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<!-- Version Summary -->
{#if data.versions?.length > 0}
	<div class="summary-banner">
		<h3 class="summary-title">Version History Summary</h3>
		<p class="summary-text">
			{#if data.versions.length === 1}
				This is the first version. No previous versions to compare.
			{:else}
				Total versions: {data.versions.length} | Latest update: {formatDate(
					data.versions[0].changed_at
				)}
			{/if}
			{#if data.hasDraft}
				<span class="draft-badge">Draft Available</span>
			{/if}
		</p>
	</div>
{/if}

<!-- View Mode Tabs -->
{#if selectedRightVersion}
	<div class="tab-bar">
		<button
			class="tab-btn"
			class:active={activeTab === 'diff'}
			onclick={() => (activeTab = 'diff')}
		>
			{viewMode === 'diff' ? 'Diff View' : 'Source View'}
		</button>
		<button
			class="tab-btn"
			class:active={activeTab === 'preview'}
			onclick={() => (activeTab = 'preview')}
		>
			Preview
		</button>
	</div>
{/if}

<!-- Content Viewer -->
{#if activeTab === 'diff'}
	{#if viewMode === 'single' && selectedRightVersion}
		<div class="content-card">
			<div class="content-header info">
				<h3 class="content-header-title">{rightTitle}</h3>
				<span class="source-badge info">First Version - No Previous History</span>
			</div>
			<div class="content-body">
				<pre class="source-code">{rightContent}</pre>
			</div>
		</div>
	{:else if selectedLeftVersion && selectedRightVersion}
		<div class="content-card">
			<BlogDiffViewer {leftContent} {rightContent} {leftTitle} {rightTitle} />
		</div>
	{:else if selectedRightVersion && !selectedLeftVersion}
		<div class="content-card">
			<div class="content-header">
				<h3 class="content-header-title">{rightTitle}</h3>
				<p class="content-header-hint">
					Select a version on the left to compare, or view this version below.
				</p>
			</div>
			<div class="content-body">
				<pre class="source-code">{rightContent}</pre>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
			<h3 class="empty-title">Select Versions to Compare</h3>
			<p class="empty-hint">Choose at least one version from the dropdowns above.</p>
		</div>
	{/if}
{:else if activeTab === 'preview' && selectedRightVersion}
	<div class="content-card">
		<div class="content-header preview">
			<div class="preview-header-row">
				<h3 class="content-header-title">Preview: {rightTitle}</h3>
				{#if selectedRightSource === 'draft'}
					<span class="source-badge warning">Draft (Markdown)</span>
				{:else}
					<span class="source-badge success">Published HTML</span>
				{/if}
			</div>
			<p class="content-header-hint">
				This preview shows how the content will appear. PopCard image and BlogPurpose are added by
				the page template.
			</p>
		</div>
		<div class="blog-preview content-body">
			<article class="article-body">
				<div class="featured-image">
					<div class="template-indicator">Auto-added by template</div>
					<PopCard
						image={`/types/${data.blog?.enneagram}s/${data.blog?.person}.webp`}
						showIcon={false}
						enneagramType={data.blog?.enneagram}
						displayText={data.blog?.person?.split('-').join(' ') || ''}
						subtext=""
					/>
				</div>

				{@html rightContent}

				<div class="blog-purpose-placeholder">
					<p>
						<strong>BlogPurpose Component</strong> - Automatically inserted here (before the last H2)
					</p>
				</div>
			</article>
		</div>
	</div>
{/if}

<!-- Legend -->
{#if activeTab === 'diff' && viewMode === 'diff' && selectedLeftVersion && selectedRightVersion}
	<div class="legend-card">
		<h3 class="legend-title">Legend</h3>
		<div class="legend-grid">
			<div class="legend-item">
				<div class="legend-swatch added"></div>
				<span>Added</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch removed"></div>
				<span>Removed</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch modified"></div>
				<span>Modified</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch unchanged"></div>
				<span>Unchanged</span>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	/* Header */
	.header-section {
		margin-bottom: 20px;
	}

	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		margin-bottom: 12px;
		background: transparent;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		color: var(--primary);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.back-btn:hover {
		border-color: var(--primary);
		background: var(--bg-elevated);
	}

	.blog-meta {
		margin-top: 8px;
	}

	.blog-title {
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-primary);
		margin: 0 0 2px;
	}

	.blog-person {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Section Card */
	.section-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 16px;
	}

	.card-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 16px;
	}

	/* Selectors */
	.selector-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.selector-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.field-select {
		width: 100%;
		padding: 9px 12px;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		color: var(--text-primary);
		font-size: 0.8rem;
		font-family: inherit;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.field-select:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
	}

	/* Summary Banner */
	.summary-banner {
		padding: 14px 16px;
		background: var(--bg-elevated);
		border: 1px solid var(--bg-highlight);
		border-radius: 12px;
		margin-bottom: 16px;
	}

	.summary-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 4px;
	}

	.summary-text {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.draft-badge {
		display: inline-block;
		padding: 2px 8px;
		margin-left: 8px;
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	/* Tab Bar */
	.tab-bar {
		display: flex;
		gap: 2px;
		border-bottom: 1px solid var(--bg-elevated);
		margin-bottom: 16px;
	}

	.tab-btn {
		padding: 10px 20px;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--text-secondary);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		margin-bottom: -1px;
	}

	.tab-btn:hover {
		color: var(--text-primary);
	}

	.tab-btn.active {
		color: var(--primary);
		border-bottom-color: var(--primary);
	}

	/* Content Card */
	.content-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	.content-header {
		padding: 14px 16px;
		border-bottom: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
	}

	.content-header.info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
	}

	.content-header.preview {
		background: var(--bg-deep);
	}

	.preview-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 4px;
	}

	.content-header-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.content-header-hint {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 4px 0 0;
	}

	.source-badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.source-badge.info {
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.source-badge.warning {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
	}

	.source-badge.success {
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
	}

	.content-body {
		max-height: 70vh;
		overflow-y: auto;
		padding: 16px;
	}

	.source-code {
		white-space: pre-wrap;
		font-family: var(--font-mono, monospace);
		font-size: 0.8rem;
		color: var(--text-primary);
		line-height: 1.6;
		margin: 0;
	}

	/* Empty State */
	.empty-state {
		padding: 48px 24px;
		text-align: center;
		border: 2px dashed var(--bg-elevated);
		border-radius: 12px;
		background: var(--bg-deep);
	}

	.empty-icon {
		width: 48px;
		height: 48px;
		margin: 0 auto 12px;
		color: var(--text-secondary);
		opacity: 0.5;
	}

	.empty-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 4px;
	}

	.empty-hint {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Legend */
	.legend-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 16px;
		margin-top: 16px;
	}

	.legend-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 10px;
	}

	.legend-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.8rem;
		color: var(--text-primary);
	}

	.legend-swatch {
		width: 16px;
		height: 16px;
		border-radius: 3px;
	}

	.legend-swatch.added {
		background: rgba(16, 185, 129, 0.2);
		border-left: 3px solid #10b981;
	}

	.legend-swatch.removed {
		background: rgba(239, 68, 68, 0.2);
		border-left: 3px solid #ef4444;
	}

	.legend-swatch.modified {
		background: rgba(245, 158, 11, 0.2);
		border-left: 3px solid #f59e0b;
	}

	.legend-swatch.unchanged {
		background: var(--bg-elevated);
		border-left: 3px solid var(--bg-highlight);
	}

	/* Blog Preview - content-specific styles */
	.blog-preview {
		font-family: var(--font-family);
		line-height: 1.8;
		color: var(--text-primary);

		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			font-weight: 700;
			line-height: 1.3;
			margin-top: 2rem;
			margin-bottom: 1rem;
			color: var(--text-primary);
		}

		:global(h1) {
			font-size: 2.25rem;
		}
		:global(h2) {
			font-size: 1.875rem;
		}
		:global(h3) {
			font-size: 1.5rem;
		}
		:global(h4) {
			font-size: 1.25rem;
		}

		:global(p) {
			margin-bottom: 1.25rem;
		}

		:global(a) {
			color: var(--primary);
			text-decoration: underline;
			&:hover {
				opacity: 0.8;
			}
		}

		:global(ul),
		:global(ol) {
			margin-bottom: 1.25rem;
			padding-left: 1.5rem;
		}

		:global(li) {
			margin-bottom: 0.5rem;
		}

		:global(blockquote) {
			border-left: 4px solid var(--primary);
			padding: 1rem;
			margin: 1.5rem 0;
			font-style: italic;
			color: var(--text-secondary);
			background: var(--bg-elevated);
			border-radius: 0 8px 8px 0;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
			border-radius: 8px;
			margin: 1.5rem 0;
		}

		:global(pre),
		:global(code) {
			font-family: var(--font-mono, monospace);
			background: var(--bg-deep);
			border-radius: 4px;
		}

		:global(code) {
			padding: 2px 6px;
			font-size: 0.875em;
		}

		:global(pre) {
			padding: 1rem;
			overflow-x: auto;
			margin: 1.5rem 0;
			:global(code) {
				padding: 0;
				background: none;
			}
		}

		:global(hr) {
			border: none;
			border-top: 1px solid var(--bg-elevated);
			margin: 2rem 0;
		}

		:global(table) {
			width: 100%;
			border-collapse: collapse;
			margin: 1.5rem 0;

			:global(th),
			:global(td) {
				border: 1px solid var(--bg-elevated);
				padding: 0.75rem;
				text-align: left;
			}

			:global(th) {
				background: var(--bg-deep);
				font-weight: 600;
			}

			:global(tr:nth-child(even)) {
				background: var(--bg-deep);
			}
		}

		:global(.pop-card),
		:global([class*='card']) {
			margin: 1.5rem 0;
		}
	}

	.article-body {
		max-width: 56rem;
		margin: 0 auto;
	}

	.featured-image {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
		position: relative;

		:global(.pop-card) {
			margin: 0;
		}
	}

	.template-indicator {
		position: absolute;
		top: -8px;
		right: 0;
		z-index: 10;
		padding: 2px 8px;
		background: var(--bg-elevated);
		color: var(--text-secondary);
		border-radius: 12px;
		font-size: 0.6rem;
		font-weight: 600;
	}

	.blog-purpose-placeholder {
		margin: 1.5rem 0;
		padding: 16px;
		border: 2px dashed var(--bg-elevated);
		border-radius: 12px;
		background: var(--bg-deep);
		text-align: center;

		p {
			margin: 0;
			font-size: 0.8rem;
			color: var(--text-secondary);
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.selector-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.legend-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.content-header.info {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
