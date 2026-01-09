<!-- src/lib/components/marketing/ContentManager.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Select, Label, Badge, Input } from 'flowbite-svelte';
	import { slide, fade } from 'svelte/transition';
	import ContentDetailModal from './ContentDetailModal.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';

	export let contentItems: ContentItem[];
	export let campaigns: Campaign[];
	export let templates: Template[];

	let selectedCampaignId: string = 'all';
	let selectedStatus: string = 'all';
	let searchTerm: string = '';
	let sortBy: 'date-asc' | 'date-desc' | 'status' = 'date-desc';
	let selectedContent: ContentItem | null = null;
	let showNewContentForm = false;
	let showDetailModal = false;

	// Platform colors for visual distinction
	const platformColors: Record<string, string> = {
		twitter: '#1DA1F2',
		instagram: '#E1306C',
		linkedin: '#0077B5',
		facebook: '#4267B2'
	};

	$: filteredContent = contentItems
		.filter((item) => {
			// Campaign filter
			const matchesCampaign =
				selectedCampaignId === 'all' ||
				(selectedCampaignId === 'no-campaign'
					? !item.campaign_id
					: item.campaign_id === selectedCampaignId);

			// Status filter
			const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

			// Search filter
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
		});

	function handleContentUpdate(event: CustomEvent) {
		const updatedContent = event.detail;
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

	function getStatusColor(
		status: string | undefined
	): 'blue' | 'green' | 'yellow' | 'red' | 'dark' {
		switch (status) {
			case 'scheduled':
				return 'blue';
			case 'published':
			case 'posted':
				return 'green';
			case 'pending':
			case 'draft':
				return 'yellow';
			case 'cancelled':
				return 'red';
			default:
				return 'dark';
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

	$: hasActiveFilters =
		selectedCampaignId !== 'all' || selectedStatus !== 'all' || searchTerm !== '';
</script>

<div class="content-manager">
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="toolbar-filters">
			<!-- Search -->
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

			<!-- Campaign Filter -->
			<select bind:value={selectedCampaignId} class="filter-select" aria-label="Filter by campaign">
				<option value="all">All Campaigns</option>
				<option value="no-campaign">No Campaign</option>
				{#each campaigns as campaign}
					<option value={campaign.id}>{campaign.name}</option>
				{/each}
			</select>

			<!-- Status Filter -->
			<select bind:value={selectedStatus} class="filter-select" aria-label="Filter by status">
				<option value="all">All Status</option>
				<option value="scheduled">Scheduled</option>
				<option value="published">Published</option>
				<option value="pending">Pending</option>
				<option value="draft">Draft</option>
				<option value="cancelled">Cancelled</option>
			</select>

			<!-- Sort -->
			<select bind:value={sortBy} class="filter-select" aria-label="Sort content">
				<option value="date-desc">Newest First</option>
				<option value="date-asc">Oldest First</option>
				<option value="status">By Status</option>
			</select>

			{#if hasActiveFilters}
				<button
					class="clear-filters-btn"
					on:click={clearFilters}
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

		<Button
			on:click={() => (showNewContentForm = !showNewContentForm)}
			color={showNewContentForm ? 'alternative' : 'blue'}
			size="sm"
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
					class="mr-1"
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
					class="mr-1"
				>
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
				New Content
			{/if}
		</Button>
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
				on:contentCreated={() => (showNewContentForm = false)}
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
					on:click={() => openDetailModal(item)}
					transition:fade={{ duration: 150 }}
				>
					<!-- Platform indicator -->
					<div
						class="platform-indicator"
						style="background-color: {platformColors[item.platform?.toLowerCase()] || '#6B7280'}"
					/>

					<div class="card-content">
						<!-- Header -->
						<div class="card-header">
							<span class="platform-name">{item.platform}</span>
							<Badge color={getStatusColor(item.status)} rounded>{item.status || 'draft'}</Badge>
						</div>

						<!-- Content preview -->
						<p class="content-preview">{truncateText(item.content_text, 100)}</p>

						<!-- Footer -->
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

						<!-- Hashtags -->
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
		<!-- Empty State -->
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
				<Button color="alternative" size="sm" on:click={clearFilters}>Clear Filters</Button>
			{:else}
				<h3>No content yet</h3>
				<p>Create your first piece of content to get started</p>
				<Button color="blue" size="sm" on:click={() => (showNewContentForm = true)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="mr-1"
					>
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					Create Content
				</Button>
			{/if}
		</div>
	{/if}
</div>

<ContentDetailModal
	bind:open={showDetailModal}
	contentItem={selectedContent}
	{campaigns}
	{templates}
	on:contentUpdated={handleContentUpdate}
	on:close={closeDetailModal}
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
		color: var(--text-secondary, #64748b);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 0.75rem 0.5rem 2.25rem;
		font-size: 0.8125rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
		transition: border-color 0.15s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary, #3b82f6);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.filter-select {
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		font-size: 0.8125rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--primary, #3b82f6);
	}

	.clear-filters-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-secondary, #64748b);
		background: transparent;
		border: 1px dashed var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.clear-filters-btn:hover {
		color: #ef4444;
		border-color: #ef4444;
	}

	/* Create Form */
	.create-form-wrapper {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
		margin-bottom: 1.25rem;
		overflow: hidden;
	}

	.create-form-header {
		padding: 1rem 1.25rem;
		background: var(--hover-background, #f8fafc);
		border-bottom: 1px solid var(--border-color, #e2e8f0);
	}

	.create-form-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	/* Results Info */
	.results-info {
		margin-bottom: 0.75rem;
	}

	.results-count {
		font-size: 0.8125rem;
		color: var(--text-secondary, #64748b);
	}

	.filtered-label {
		color: var(--primary, #3b82f6);
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
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
		width: 100%;
	}

	.content-card:hover {
		border-color: var(--primary, #3b82f6);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
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
		color: var(--text-secondary, #64748b);
	}

	.content-preview {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-primary, #1e293b);
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
		color: var(--text-primary, #1e293b);
	}

	.time-label {
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
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
		color: var(--primary, #3b82f6);
	}

	.more-hashtags {
		color: var(--text-secondary, #64748b);
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
		color: var(--text-secondary, #94a3b8);
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.empty-state p {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #64748b);
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

	/* Dark mode */
	@media (prefers-color-scheme: dark) {
		.search-input,
		.filter-select {
			background: #1f2937;
			border-color: #374151;
			color: #f9fafb;
		}

		.create-form-wrapper {
			background: #1f2937;
			border-color: #374151;
		}

		.create-form-header {
			background: #111827;
			border-color: #374151;
		}

		.create-form-header h3 {
			color: #f9fafb;
		}

		.content-card {
			background: #1f2937;
			border-color: #374151;
		}

		.content-preview {
			color: #f9fafb;
		}

		.date-label {
			color: #f9fafb;
		}

		.empty-state h3 {
			color: #f9fafb;
		}
	}
</style>
