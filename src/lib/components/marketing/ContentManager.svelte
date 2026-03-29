<!-- src/lib/components/marketing/ContentManager.svelte -->
<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import ContentDetailModal from './ContentDetailModal.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';

	let {
		contentItems,
		campaigns,
		templates
	}: {
		contentItems: ContentItem[];
		campaigns: Campaign[];
		templates: Template[];
	} = $props();

	let selectedCampaignId: string = $state('all');
	let selectedStatus: string = $state('all');
	let searchTerm: string = $state('');
	let sortBy: 'date-asc' | 'date-desc' | 'status' = $state('date-desc');
	let selectedContent: ContentItem | null = $state(null);
	let showNewContentForm = $state(false);
	let showDetailModal = $state(false);

	const platformColors: Record<string, string> = {
		twitter: '#1DA1F2',
		instagram: '#E1306C',
		linkedin: '#0077B5',
		facebook: '#4267B2'
	};

	let filteredContent = $derived(
		contentItems
			.filter((item) => {
				const matchesCampaign =
					selectedCampaignId === 'all' ||
					(selectedCampaignId === 'no-campaign'
						? !item.campaign_id
						: item.campaign_id === selectedCampaignId);
				const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
				const matchesSearch =
					searchTerm === '' ||
					item.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(item.content_hashtags &&
						item.content_hashtags.toLowerCase().includes(searchTerm.toLowerCase()));
				return matchesCampaign && matchesStatus && matchesSearch;
			})
			.sort((a, b) => {
				if (sortBy === 'date-asc') {
					return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
				} else if (sortBy === 'date-desc') {
					return new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime();
				} else {
					return (a.status || '').localeCompare(b.status || '');
				}
			})
	);

	let hasActiveFilters = $derived(
		selectedCampaignId !== 'all' || selectedStatus !== 'all' || searchTerm !== ''
	);

	function handleContentUpdate(updatedContent: any) {
		const index = contentItems.findIndex((item) => item.id === updatedContent.id);
		if (index !== -1) {
			contentItems[index] = updatedContent;
			contentItems = [...contentItems];
		}
		closeDetailModal();
	}

	function openDetailModal(item: ContentItem) {
		selectedContent = item;
		showDetailModal = true;
	}

	function closeDetailModal() {
		selectedContent = null;
		showDetailModal = false;
	}

	function truncateText(text: string, maxLength: number): string {
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}

	function getStatusClass(status: string | undefined): string {
		switch (status) {
			case 'scheduled':
				return 'status-scheduled';
			case 'published':
			case 'posted':
				return 'status-published';
			case 'pending':
			case 'draft':
				return 'status-pending';
			case 'cancelled':
				return 'status-cancelled';
			default:
				return 'status-default';
		}
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return {
				label: 'Today',
				time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
			};
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return {
				label: 'Tomorrow',
				time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
			};
		} else {
			return {
				label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
			};
		}
	}

	function clearFilters() {
		selectedCampaignId = 'all';
		selectedStatus = 'all';
		searchTerm = '';
	}
</script>

<div class="content-manager">
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="toolbar-filters">
			<div class="search-wrapper">
				<svg
					class="search-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				<input
					type="search"
					bind:value={searchTerm}
					placeholder="Search content..."
					class="search-input"
				/>
			</div>

			<select bind:value={selectedCampaignId} class="filter-select" aria-label="Filter by campaign">
				<option value="all">All Campaigns</option>
				<option value="no-campaign">No Campaign</option>
				{#each campaigns as campaign}
					<option value={campaign.id}>{campaign.name}</option>
				{/each}
			</select>

			<select bind:value={selectedStatus} class="filter-select" aria-label="Filter by status">
				<option value="all">All Status</option>
				<option value="scheduled">Scheduled</option>
				<option value="published">Published</option>
				<option value="pending">Pending</option>
				<option value="draft">Draft</option>
				<option value="cancelled">Cancelled</option>
			</select>

			<select bind:value={sortBy} class="filter-select" aria-label="Sort content">
				<option value="date-desc">Newest First</option>
				<option value="date-asc">Oldest First</option>
				<option value="status">By Status</option>
			</select>

			{#if hasActiveFilters}
				<button
					class="clear-filters-btn"
					onclick={clearFilters}
					transition:fade={{ duration: 150 }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
					Clear
				</button>
			{/if}
		</div>

		<button
			class="btn {showNewContentForm ? 'btn-secondary' : 'btn-primary'}"
			onclick={() => (showNewContentForm = !showNewContentForm)}
		>
			{#if showNewContentForm}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg>
				Cancel
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
				New Content
			{/if}
		</button>
	</div>

	<!-- Create Form -->
	{#if showNewContentForm}
		<div class="create-form-wrapper" transition:slide={{ duration: 200 }}>
			<div class="create-form-header">
				<h3>Create New Content</h3>
			</div>
			<CreateContent
				{campaigns}
				{templates}
				oncontentCreated={() => (showNewContentForm = false)}
			/>
		</div>
	{/if}

	<!-- Results Info -->
	<div class="results-info">
		<span class="results-count">
			{filteredContent.length}
			{filteredContent.length === 1 ? 'item' : 'items'}
			{#if hasActiveFilters}
				<span class="filtered-label">(filtered)</span>
			{/if}
		</span>
	</div>

	<!-- Content Grid -->
	{#if filteredContent.length > 0}
		<div class="content-grid">
			{#each filteredContent as item (item.id)}
				{@const dateInfo = formatDate(item.scheduled_date)}
				{@const campaign = item.campaign_id
					? campaigns.find((c) => c.id === item.campaign_id)
					: null}
				<button
					class="content-card"
					onclick={() => openDetailModal(item)}
					transition:fade={{ duration: 150 }}
				>
					<div
						class="platform-indicator"
						style="background-color: {platformColors[item.platform?.toLowerCase()] || '#6B7280'}"
					></div>

					<div class="card-content">
						<div class="card-header">
							<span class="platform-name">{item.platform}</span>
							<span class="status-badge {getStatusClass(item.status)}"
								>{item.status || 'draft'}</span
							>
						</div>

						<p class="content-preview">{truncateText(item.content_text, 100)}</p>

						<div class="card-footer">
							<div class="schedule-info">
								<span class="date-label">{dateInfo.label}</span>
								<span class="time-label">{dateInfo.time}</span>
							</div>

							{#if campaign}
								<div
									class="campaign-tag"
									style="background-color: {campaign.color}20; border-color: {campaign.color}40"
								>
									<span style="color: {campaign.color}">{campaign.name}</span>
								</div>
							{/if}
						</div>

						{#if item.content_hashtags}
							<div class="hashtags">
								{item.content_hashtags.split(' ').slice(0, 3).join(' ')}
								{#if item.content_hashtags.split(' ').length > 3}
									<span class="more-hashtags">+{item.content_hashtags.split(' ').length - 3}</span>
								{/if}
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<div class="empty-state" transition:fade={{ duration: 150 }}>
			<div class="empty-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
					<polyline points="14 2 14 8 20 8" />
				</svg>
			</div>
			{#if hasActiveFilters}
				<h3>No content matches your filters</h3>
				<p>Try adjusting your search or filter criteria</p>
				<button class="btn btn-secondary" onclick={clearFilters}>Clear Filters</button>
			{:else}
				<h3>No content yet</h3>
				<p>Create your first piece of content to get started</p>
				<button class="btn btn-primary" onclick={() => (showNewContentForm = true)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					Create Content
				</button>
			{/if}
		</div>
	{/if}
</div>

<ContentDetailModal
	bind:open={showDetailModal}
	contentItem={selectedContent}
	{campaigns}
	oncontentUpdated={(e) => handleContentUpdate(e)}
	onclose={closeDetailModal}
/>

<style>
	.content-manager {
		padding: 0;
	}

	/* Toolbar */
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.toolbar-filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.search-wrapper {
		position: relative;
		width: 200px;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 0.75rem 0.5rem 2.25rem;
		font-size: 0.8125rem;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		color: var(--text-primary);
		transition: border-color 0.15s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.filter-select {
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		font-size: 0.8125rem;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		color: var(--text-primary);
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--primary);
	}

	.clear-filters-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: transparent;
		border: 1px dashed var(--bg-elevated);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.clear-filters-btn:hover {
		color: #ef4444;
		border-color: #ef4444;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-primary:hover {
		filter: brightness(1.1);
		box-shadow: var(--glow-sm);
	}

	.btn-secondary {
		background: var(--bg-elevated);
		color: var(--text-primary);
	}

	.btn-secondary:hover {
		background: var(--bg-highlight);
	}

	/* Create Form */
	.create-form-wrapper {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		margin-bottom: 1.25rem;
		overflow: hidden;
	}

	.create-form-header {
		padding: 1rem 1.25rem;
		background: var(--bg-deep);
		border-bottom: 1px solid var(--bg-elevated);
	}

	.create-form-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	/* Results Info */
	.results-info {
		margin-bottom: 0.75rem;
	}

	.results-count {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.filtered-label {
		color: var(--primary);
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.content-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
		width: 100%;
	}

	.content-card:hover {
		border-color: var(--primary);
		box-shadow: var(--glow-sm);
		transform: translateY(-2px);
	}

	.platform-indicator {
		height: 4px;
		width: 100%;
	}

	.card-content {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.platform-name {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-secondary);
	}

	.status-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 9999px;
		text-transform: capitalize;
	}

	.status-scheduled {
		background: rgba(251, 113, 133, 0.15);
		color: #60a5fa;
	}

	.status-published {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
	}

	.status-pending {
		background: rgba(234, 179, 8, 0.15);
		color: #facc15;
	}

	.status-cancelled {
		background: rgba(239, 68, 68, 0.15);
		color: #f87171;
	}

	.status-default {
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.content-preview {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-primary);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.schedule-info {
		display: flex;
		flex-direction: column;
	}

	.date-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.time-label {
		font-size: 0.6875rem;
		color: var(--text-secondary);
	}

	.campaign-tag {
		padding: 0.25rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 500;
		border-radius: 0.375rem;
		border: 1px solid;
	}

	.hashtags {
		font-size: 0.75rem;
		color: var(--primary);
	}

	.more-hashtags {
		color: var(--text-secondary);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
	}

	.empty-icon {
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toolbar-filters {
			flex-direction: column;
			width: 100%;
		}

		.search-wrapper {
			width: 100%;
		}

		.filter-select {
			width: 100%;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
