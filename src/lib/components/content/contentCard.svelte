<!-- src/lib/components/content/contentCard.svelte -->
<script lang="ts">
	export let blogContent: App.BlogPost = null;
	export let stage: string = '';
	export let contentType: string = '';

	// Define stages that allow content retrieval
	const stagesContentRetrieval = ['Sent out for review', 'Reviewed', 'Socialized', 'Growing'];

	// Keys to hide in the details panel (already shown or not useful)
	const hiddenKeys = new Set([
		'title',
		'description',
		'date',
		'lastmod',
		'published',
		'stage',
		'stageName',
		'slug'
	]);

	// Format date function
	function formatDate(dateStr: string): string {
		if (!dateStr) return '—';
		const date = new Date(dateStr);
		return isNaN(date.getTime())
			? dateStr
			: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Format value for display
	function formatValue(value: unknown): string {
		if (value === null || value === undefined) return '—';
		if (typeof value === 'boolean') return value ? 'Yes' : 'No';
		if (Array.isArray(value)) return value.join(', ') || '—';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value) || '—';
	}

	// Format key for display
	function formatKey(key: string): string {
		return key
			.replace(/_/g, ' ')
			.replace(/([A-Z])/g, ' $1')
			.trim()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	// Get visible entries for details panel
	$: visibleEntries = blogContent
		? Object.entries(blogContent).filter(
				([key, value]) =>
					!hiddenKeys.has(key) && value !== null && value !== undefined && value !== ''
			)
		: [];

	// Handle get info action
	function getInfo() {
		console.log('Get Update for', blogContent.title);
		// Add your update logic here
	}

	// Check if this is a blog from the famous people table (has version history)
	$: hasVersionHistory = contentType === 'people' && blogContent?.id;

	// Only show view link for published content
	$: showViewLink = blogContent?.published && blogContent?.loc;

	let showDetails = false;
</script>

<div class="content-card-details">
	<!-- Description -->
	{#if blogContent.description}
		<p class="description">{blogContent.description}</p>
	{/if}

	<!-- Meta info row -->
	<div class="meta-row">
		<div class="meta-item">
			<span class="meta-label">Created</span>
			<span class="meta-value">{formatDate(blogContent.date)}</span>
		</div>
		<div class="meta-item">
			<span class="meta-label">Modified</span>
			<span class="meta-value">{formatDate(blogContent.lastmod)}</span>
		</div>
		{#if blogContent.author}
			<div class="meta-item">
				<span class="meta-label">Author</span>
				<span class="meta-value">{blogContent.author}</span>
			</div>
		{/if}
	</div>

	<!-- Actions -->
	<div class="actions">
		{#if showViewLink}
			<a
				href={blogContent.loc.replace('https://9takes.com', '')}
				class="action-btn primary"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/>
				</svg>
				View
			</a>
		{/if}

		{#if hasVersionHistory}
			<a href="/admin/blog-diff/{blogContent.id}" class="action-btn secondary">
				<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Versions
			</a>
		{/if}

		{#if stage && stagesContentRetrieval.includes(stage)}
			<button class="action-btn accent" type="button" on:click={getInfo}>
				<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
				Get Update
			</button>
		{/if}

		{#if visibleEntries.length > 0}
			<button
				class="action-btn toggle"
				type="button"
				on:click={() => (showDetails = !showDetails)}
				aria-expanded={showDetails}
			>
				<svg
					class="btn-icon transition-transform duration-200 {showDetails ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
				{showDetails ? 'Less' : 'More'}
			</button>
		{/if}
	</div>

	<!-- Expandable Details Panel -->
	{#if showDetails && visibleEntries.length > 0}
		<div class="details-panel">
			<div class="details-grid">
				{#each visibleEntries as [key, value]}
					<div class="detail-item">
						<span class="detail-label">{formatKey(key)}</span>
						<span class="detail-value">{formatValue(value)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.content-card-details {
		padding: 0.5rem;
		font-size: 0.6875rem;
	}

	.description {
		margin: 0 0 0.5rem 0;
		padding: 0 0 0.5rem 0;
		border-bottom: 1px solid #f0f0f0;
		line-height: 1.4;
		color: #4b5563;
	}

	.meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.meta-label {
		font-size: 0.5625rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		color: #9ca3af;
		font-weight: 500;
	}

	.meta-value {
		font-size: 0.6875rem;
		color: #374151;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.125rem;
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.15s ease;

		&.primary {
			background: #eff6ff;
			color: #2563eb;

			&:hover {
				background: #dbeafe;
			}
		}

		&.secondary {
			background: #f0fdf4;
			color: #16a34a;

			&:hover {
				background: #dcfce7;
			}
		}

		&.accent {
			background: #fef3c7;
			color: #d97706;

			&:hover {
				background: #fde68a;
			}
		}

		&.toggle {
			background: #f3f4f6;
			color: #6b7280;

			&:hover {
				background: #e5e7eb;
				color: #374151;
			}
		}
	}

	.btn-icon {
		width: 0.625rem;
		height: 0.625rem;
		flex-shrink: 0;
	}

	.details-panel {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #f9fafb;
		border-radius: 0.25rem;
		border: 1px solid #f0f0f0;
		max-height: 150px;
		overflow-y: auto;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.375rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 0.25rem;
		background: white;
		border-radius: 0.125rem;
		border: 1px solid #e5e7eb;
	}

	.detail-label {
		font-size: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		color: #9ca3af;
		font-weight: 500;
	}

	.detail-value {
		font-size: 0.625rem;
		color: #374151;
		word-break: break-word;
		line-height: 1.3;
	}

	// Scrollbar styling
	.details-panel {
		scrollbar-width: thin;
		scrollbar-color: #d1d5db transparent;

		&::-webkit-scrollbar {
			width: 3px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: #d1d5db;
			border-radius: 3px;
		}
	}
</style>
