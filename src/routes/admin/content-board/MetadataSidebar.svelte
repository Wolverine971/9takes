<!-- src/routes/admin/content-board/MetadataSidebar.svelte -->
<script lang="ts">
	import { slide } from 'svelte/transition';

	interface HistoryItem {
		id: number;
		changed_at: string;
		old_content: string;
		new_content: string;
	}

	interface Props {
		data?: Record<string, any>;
		history?: HistoryItem[];
		stageName?: string | null;
		readonly?: boolean;
		onchange?: (data: { field: string; value: any }) => void;
		onstagechange?: (stage: string) => void;
	}

	let {
		data = {},
		history = [],
		stageName = null,
		readonly = false,
		onchange,
		onstagechange
	}: Props = $props();

	// Workflow stages
	const stages = [
		'Not written',
		'Prioritized',
		'Written',
		'Proof read',
		'Sent out for review',
		'Reviewed',
		'Socialized',
		'Growing',
		'Needs Work'
	];

	// Section collapse state
	let sections = $state({
		status: true,
		seo: true,
		social: false,
		dates: false,
		related: false,
		history: false,
		actions: true
	});

	function toggleSection(section: keyof typeof sections) {
		sections[section] = !sections[section];
	}

	// Handle field changes
	function handleChange(field: string, value: any) {
		onchange?.({ field, value });
	}

	// Handle stage change
	function handleStageChange(stage: string) {
		onstagechange?.(stage);
	}

	// Format date for display
	function formatDate(dateStr: string | undefined): string {
		if (!dateStr) return '—';
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return dateStr;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	// Format relative time
	function formatRelativeTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor(diff / (1000 * 60));

		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return 'Just now';
	}

	// Character count helpers
	function charCount(
		str: string | undefined,
		target: number
	): { count: number; status: 'good' | 'warn' | 'over' } {
		const count = str?.length || 0;
		if (count === 0) return { count, status: 'warn' };
		if (count > target * 1.2) return { count, status: 'over' };
		if (count < target * 0.7) return { count, status: 'warn' };
		return { count, status: 'good' };
	}

	// Parse suggestions array reactively
	let suggestionsArray = $derived.by(() => {
		if (Array.isArray(data.suggestions)) return data.suggestions;
		if (typeof data.suggestions === 'string') {
			try {
				return JSON.parse(data.suggestions);
			} catch {
				return [];
			}
		}
		return [];
	});

	// Copy content to clipboard
	async function copyMarkdown() {
		if (data.content) {
			await navigator.clipboard.writeText(data.content);
		}
	}

	// Open preview
	function openPreview() {
		const url =
			data.loc?.replace('https://9takes.com', '') ||
			(data.person ? `/personality-analysis/${data.person}` : null);
		if (url) {
			window.open(url, '_blank');
		}
	}
</script>

<div class="metadata-sidebar">
	<!-- Status & Classification -->
	<section class="section">
		<button class="section-header" onclick={() => toggleSection('status')}>
			<span class="section-title">Status & Classification</span>
			<svg class="chevron" class:expanded={sections.status} viewBox="0 0 24 24">
				<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		</button>
		{#if sections.status}
			<div class="section-content" transition:slide={{ duration: 150 }}>
				<!-- Published Toggle -->
				<div class="field">
					<label class="field-label">Published</label>
					<label class="toggle">
						<input
							type="checkbox"
							checked={data.published}
							disabled={readonly}
							onchange={(e) => handleChange('published', e.currentTarget.checked)}
						/>
						<span class="toggle-slider"></span>
					</label>
				</div>

				<!-- Stage Dropdown -->
				<div class="field">
					<label class="field-label">Workflow Stage</label>
					<select
						class="field-select"
						value={stageName || ''}
						disabled={readonly}
						onchange={(e) => handleStageChange(e.currentTarget.value)}
					>
						<option value="">Select stage...</option>
						{#each stages as stage}
							<option value={stage}>{stage}</option>
						{/each}
					</select>
				</div>

				<!-- Enneagram Type -->
				<div class="field">
					<label class="field-label">Enneagram Type</label>
					<select
						class="field-select"
						value={data.enneagram || ''}
						disabled={readonly}
						onchange={(e) => handleChange('enneagram', e.currentTarget.value)}
					>
						<option value="">Select type...</option>
						{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
							<option value={type}>Type {type}</option>
						{/each}
					</select>
				</div>

				<!-- Category -->
				<div class="field">
					<label class="field-label">Category</label>
					<input
						type="text"
						class="field-input"
						value={data.category || ''}
						placeholder="e.g., musician, celebrity"
						disabled={readonly}
						oninput={(e) => handleChange('category', e.currentTarget.value)}
					/>
				</div>
			</div>
		{/if}
	</section>

	<!-- SEO Information -->
	<section class="section">
		<button class="section-header" onclick={() => toggleSection('seo')}>
			<span class="section-title">SEO Information</span>
			<svg class="chevron" class:expanded={sections.seo} viewBox="0 0 24 24">
				<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		</button>
		{#if sections.seo}
			{@const tc = charCount(data.title, 60)}
			{@const dc = charCount(data.description, 155)}
			<div class="section-content" transition:slide={{ duration: 150 }}>
				<!-- Title -->
				<div class="field">
					<label class="field-label">
						Title
						<span class="char-count {tc.status}">{tc.count}/60</span>
					</label>
					<input
						type="text"
						class="field-input"
						value={data.title || ''}
						disabled={readonly}
						oninput={(e) => handleChange('title', e.currentTarget.value)}
					/>
				</div>

				<!-- Meta Title -->
				<div class="field">
					<label class="field-label">Meta Title</label>
					<input
						type="text"
						class="field-input"
						value={data.meta_title || ''}
						disabled={readonly}
						oninput={(e) => handleChange('meta_title', e.currentTarget.value)}
					/>
				</div>

				<!-- Description -->
				<div class="field">
					<label class="field-label">
						Description
						<span class="char-count {dc.status}">{dc.count}/155</span>
					</label>
					<textarea
						class="field-textarea"
						value={data.description || ''}
						disabled={readonly}
						rows="3"
						oninput={(e) => handleChange('description', e.currentTarget.value)}
					></textarea>
				</div>

				<!-- URL -->
				<div class="field">
					<label class="field-label">URL</label>
					<div class="field-readonly">
						{#if data.loc}
							<a href={data.loc.replace('https://9takes.com', '')} target="_blank" class="url-link">
								{data.loc}
							</a>
						{:else}
							<span class="text-gray-400">Not set</span>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- Social Links -->
	<section class="section">
		<button class="section-header" onclick={() => toggleSection('social')}>
			<span class="section-title">Social Links</span>
			<svg class="chevron" class:expanded={sections.social} viewBox="0 0 24 24">
				<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		</button>
		{#if sections.social}
			<div class="section-content" transition:slide={{ duration: 150 }}>
				<div class="field">
					<label class="field-label">Twitter</label>
					<div class="input-with-prefix">
						<span class="prefix">@</span>
						<input
							type="text"
							class="field-input"
							value={data.twitter || ''}
							disabled={readonly}
							oninput={(e) => handleChange('twitter', e.currentTarget.value)}
						/>
					</div>
				</div>

				<div class="field">
					<label class="field-label">Instagram</label>
					<div class="input-with-prefix">
						<span class="prefix">@</span>
						<input
							type="text"
							class="field-input"
							value={data.instagram || ''}
							disabled={readonly}
							oninput={(e) => handleChange('instagram', e.currentTarget.value)}
						/>
					</div>
				</div>

				<div class="field">
					<label class="field-label">TikTok</label>
					<div class="input-with-prefix">
						<span class="prefix">@</span>
						<input
							type="text"
							class="field-input"
							value={data.tiktok || ''}
							disabled={readonly}
							oninput={(e) => handleChange('tiktok', e.currentTarget.value)}
						/>
					</div>
				</div>

				<div class="field">
					<label class="field-label">Wikipedia</label>
					<input
						type="url"
						class="field-input"
						value={data.wikipedia || ''}
						disabled={readonly}
						placeholder="https://en.wikipedia.org/..."
						oninput={(e) => handleChange('wikipedia', e.currentTarget.value)}
					/>
				</div>
			</div>
		{/if}
	</section>

	<!-- Dates & Author -->
	<section class="section">
		<button class="section-header" onclick={() => toggleSection('dates')}>
			<span class="section-title">Dates & Author</span>
			<svg class="chevron" class:expanded={sections.dates} viewBox="0 0 24 24">
				<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		</button>
		{#if sections.dates}
			<div class="section-content" transition:slide={{ duration: 150 }}>
				<div class="field">
					<label class="field-label">Created</label>
					<div class="field-readonly">{formatDate(data.date)}</div>
				</div>

				<div class="field">
					<label class="field-label">Last Modified</label>
					<div class="field-readonly">{formatDate(data.lastmod)}</div>
				</div>

				<div class="field">
					<label class="field-label">Author</label>
					<input
						type="text"
						class="field-input"
						value={data.author || ''}
						disabled={readonly}
						oninput={(e) => handleChange('author', e.currentTarget.value)}
					/>
				</div>
			</div>
		{/if}
	</section>

	<!-- Related Content -->
	<section class="section">
		<button class="section-header" onclick={() => toggleSection('related')}>
			<span class="section-title">Related Content</span>
			<svg class="chevron" class:expanded={sections.related} viewBox="0 0 24 24">
				<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		</button>
		{#if sections.related}
			<div class="section-content" transition:slide={{ duration: 150 }}>
				<div class="field">
					<label class="field-label">Suggestions</label>
					<div class="suggestions-list">
						{#if suggestionsArray.length > 0}
							{#each suggestionsArray as suggestion}
								<span class="suggestion-pill">{suggestion.replace(/-/g, ' ')}</span>
							{/each}
						{:else}
							<span class="text-xs text-gray-400">None</span>
						{/if}
					</div>
				</div>

				<div class="field">
					<label class="field-label">Image URL</label>
					<input
						type="url"
						class="field-input"
						value={data.pic || ''}
						disabled={readonly}
						placeholder="https://..."
						oninput={(e) => handleChange('pic', e.currentTarget.value)}
					/>
				</div>
			</div>
		{/if}
	</section>

	<!-- Version History -->
	{#if history.length > 0}
		<section class="section">
			<button class="section-header" onclick={() => toggleSection('history')}>
				<span class="section-title">Version History ({history.length})</span>
				<svg class="chevron" class:expanded={sections.history} viewBox="0 0 24 24">
					<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</button>
			{#if sections.history}
				<div class="section-content" transition:slide={{ duration: 150 }}>
					<div class="history-list">
						{#each history as change}
							<div class="history-item">
								<span class="history-time">{formatRelativeTime(change.changed_at)}</span>
								<span class="history-date">{formatDate(change.changed_at)}</span>
							</div>
						{/each}
					</div>
					{#if data.id}
						<a href="/admin/blog-diff/{data.id}" class="view-changes-link"> View All Changes → </a>
					{/if}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Actions -->
	<section class="section">
		<button class="section-header" onclick={() => toggleSection('actions')}>
			<span class="section-title">Actions</span>
			<svg class="chevron" class:expanded={sections.actions} viewBox="0 0 24 24">
				<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
		</button>
		{#if sections.actions}
			<div class="section-content" transition:slide={{ duration: 150 }}>
				<div class="actions-grid">
					{#if data.published && (data.loc || data.person)}
						<button class="action-btn" onclick={openPreview}>
							<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							Preview
						</button>
					{/if}
					<button class="action-btn" onclick={copyMarkdown}>
						<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
							/>
						</svg>
						Copy MD
					</button>
				</div>
			</div>
		{/if}
	</section>
</div>

<style lang="scss">
	.metadata-sidebar {
		height: 100%;
		overflow-y: auto;
		background: #f9fafb;
		border-left: 1px solid #e5e7eb;
	}

	.section {
		border-bottom: 1px solid #e5e7eb;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 12px 16px;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s ease;

		&:hover {
			background: #f3f4f6;
		}
	}

	.section-title {
		font-size: 12px;
		font-weight: 600;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.chevron {
		width: 16px;
		height: 16px;
		color: #9ca3af;
		transition: transform 0.15s ease;

		&.expanded {
			transform: rotate(180deg);
		}
	}

	.section-content {
		padding: 0 16px 16px;
	}

	.field {
		margin-bottom: 12px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.field-label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
		font-weight: 500;
		color: #6b7280;
		margin-bottom: 4px;
	}

	.char-count {
		font-weight: 400;
		font-size: 10px;

		&.good {
			color: #16a34a;
		}
		&.warn {
			color: #d97706;
		}
		&.over {
			color: #dc2626;
		}
	}

	.field-input,
	.field-select,
	.field-textarea {
		width: 100%;
		padding: 6px 10px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 13px;
		color: #1f2937;
		background: white;
		transition: all 0.15s ease;

		&:focus {
			outline: none;
			border-color: #3b82f6;
			box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
		}

		&:disabled {
			background: #f3f4f6;
			color: #6b7280;
			cursor: not-allowed;
		}
	}

	.field-textarea {
		resize: vertical;
		min-height: 60px;
	}

	.field-readonly {
		font-size: 13px;
		color: #374151;
		padding: 6px 0;
	}

	.url-link {
		color: #3b82f6;
		text-decoration: none;
		font-size: 12px;
		word-break: break-all;

		&:hover {
			text-decoration: underline;
		}
	}

	.input-with-prefix {
		display: flex;
		align-items: stretch;

		.prefix {
			display: flex;
			align-items: center;
			padding: 0 8px;
			background: #f3f4f6;
			border: 1px solid #d1d5db;
			border-right: none;
			border-radius: 6px 0 0 6px;
			font-size: 13px;
			color: #6b7280;
		}

		.field-input {
			border-radius: 0 6px 6px 0;
		}
	}

	.toggle {
		position: relative;
		display: inline-block;
		width: 40px;
		height: 22px;

		input {
			opacity: 0;
			width: 0;
			height: 0;

			&:checked + .toggle-slider {
				background: #3b82f6;
			}

			&:checked + .toggle-slider::before {
				transform: translateX(18px);
			}

			&:disabled + .toggle-slider {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}

	.toggle-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #d1d5db;
		border-radius: 22px;
		transition: 0.2s;

		&::before {
			position: absolute;
			content: '';
			height: 16px;
			width: 16px;
			left: 3px;
			bottom: 3px;
			background: white;
			border-radius: 50%;
			transition: 0.2s;
		}
	}

	.suggestions-list {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.suggestion-pill {
		display: inline-flex;
		padding: 2px 8px;
		background: #e5e7eb;
		border-radius: 12px;
		font-size: 11px;
		color: #4b5563;
	}

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 8px;
	}

	.history-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 8px;
		background: white;
		border-radius: 4px;
		font-size: 11px;
	}

	.history-time {
		color: #3b82f6;
		font-weight: 500;
	}

	.history-date {
		color: #9ca3af;
	}

	.view-changes-link {
		display: block;
		font-size: 12px;
		color: #3b82f6;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 8px 12px;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 12px;
		font-weight: 500;
		color: #374151;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			background: #f3f4f6;
			border-color: #9ca3af;
		}
	}

	.action-icon {
		width: 14px;
		height: 14px;
	}

	/* Scrollbar */
	.metadata-sidebar {
		scrollbar-width: thin;
		scrollbar-color: #d1d5db #f9fafb;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: #f9fafb;
		}

		&::-webkit-scrollbar-thumb {
			background: #d1d5db;
			border-radius: 3px;

			&:hover {
				background: #9ca3af;
			}
		}
	}
</style>
