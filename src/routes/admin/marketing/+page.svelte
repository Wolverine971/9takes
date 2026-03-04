<!-- src/routes/admin/marketing/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { fade } from 'svelte/transition';

	import Calendar from '$lib/components/marketing/Calendar.svelte';
	import CampaignManager from '$lib/components/marketing/CampaignManager.svelte';
	import ContentManager from '$lib/components/marketing/ContentManager.svelte';
	import TemplateManager from '$lib/components/marketing/TemplateManager.svelte';

	let { data }: { data: any } = $props();

	let activeTab = $state<'calendar' | 'campaigns' | 'content' | 'templates'>('calendar');
	let isLoading = $state(false);
	let tabRefs = $state<HTMLButtonElement[]>([]);

	const tabs = [
		{ id: 'calendar', label: 'Calendar', icon: 'calendar' },
		{ id: 'campaigns', label: 'Campaigns', icon: 'megaphone' },
		{ id: 'content', label: 'Content', icon: 'document' },
		{ id: 'templates', label: 'Templates', icon: 'template' }
	] as const;

	function setActiveTab(tab: typeof activeTab) {
		if (tab !== activeTab) {
			isLoading = true;
			activeTab = tab;
			setTimeout(() => (isLoading = false), 150);
		}
	}

	function handleTabKeydown(event: KeyboardEvent, index: number) {
		let newIndex = index;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			event.preventDefault();
			newIndex = (index + 1) % tabs.length;
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			newIndex = (index - 1 + tabs.length) % tabs.length;
		} else if (event.key === 'Home') {
			event.preventDefault();
			newIndex = 0;
		} else if (event.key === 'End') {
			event.preventDefault();
			newIndex = tabs.length - 1;
		}
		if (newIndex !== index) {
			tabRefs[newIndex]?.focus();
			setActiveTab(tabs[newIndex].id);
		}
	}

	let todayContentCount = $derived(
		data.content.filter((item: any) => {
			const itemDate = new Date(item.scheduled_date);
			const today = new Date();
			return itemDate.toDateString() === today.toDateString();
		}).length
	);

	let pendingContentCount = $derived(
		data.content.filter((item: any) => item.status === 'pending' || item.status === 'draft').length
	);

	let scheduledContentCount = $derived(
		data.content.filter((item: any) => item.status === 'scheduled').length
	);

	let publishedContentCount = $derived(
		data.content.filter((item: any) => item.status === 'published').length
	);

	let activeCampaignsCount = $derived(
		data.campaigns.filter((campaign: any) => {
			const today = new Date();
			return new Date(campaign.start_date) <= today && new Date(campaign.end_date) >= today;
		}).length
	);

	let weekContent = $derived(
		data.content
			.filter((item: any) => {
				const itemDate = new Date(item.scheduled_date);
				const today = new Date();
				const weekFromNow = new Date(today);
				weekFromNow.setDate(weekFromNow.getDate() + 7);
				return itemDate >= today && itemDate <= weekFromNow;
			})
			.sort(
				(a: any, b: any) =>
					new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
			)
	);

	function getTabBadge(tabId: string) {
		switch (tabId) {
			case 'calendar':
				return todayContentCount > 0
					? { count: `${todayContentCount} today`, color: 'info' }
					: null;
			case 'campaigns':
				return { count: data.campaigns.length, color: 'success' };
			case 'content':
				return pendingContentCount > 0
					? { count: `${pendingContentCount} pending`, color: 'warning' }
					: null;
			case 'templates':
				return { count: data.templates.length, color: 'neutral' };
			default:
				return null;
		}
	}

	function formatRelativeDate(dateStr: string) {
		const date = new Date(dateStr);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		if (date.toDateString() === today.toDateString()) return 'Today';
		if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
		return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
	}

	function formatTime(dateStr: string) {
		return new Date(dateStr).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}
</script>

<!-- Header -->
<header class="page-header">
	<div class="header-content">
		<div>
			<h1>Marketing Dashboard</h1>
			<p class="subtitle">Manage campaigns, content scheduling, and templates</p>
		</div>
	</div>
</header>

<!-- Quick Stats -->
<section class="stats-section" aria-label="Quick statistics">
	<div class="stats-grid">
		<button class="stat-card clickable" onclick={() => setActiveTab('content')}>
			<div class="stat-icon today">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
					<line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line
						x1="3"
						x2="21"
						y1="10"
						y2="10"
					/>
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-value">{todayContentCount}</span>
				<span class="stat-label">Today</span>
			</div>
		</button>

		<button class="stat-card clickable" onclick={() => setActiveTab('content')}>
			<div class="stat-icon scheduled">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-value">{scheduledContentCount}</span>
				<span class="stat-label">Scheduled</span>
			</div>
		</button>

		<button class="stat-card clickable" onclick={() => setActiveTab('campaigns')}>
			<div class="stat-icon active">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-value">{activeCampaignsCount}</span>
				<span class="stat-label">Active</span>
			</div>
		</button>

		<button
			class="stat-card clickable"
			class:has-pending={pendingContentCount > 0}
			onclick={() => setActiveTab('content')}
		>
			<div class="stat-icon pending">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path
						d="m16.2 16.2 2.9 2.9"
					/><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path
						d="m4.9 4.9 2.9 2.9"
					/>
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-value">{pendingContentCount}</span>
				<span class="stat-label">Pending</span>
			</div>
		</button>

		<div class="stat-card">
			<div class="stat-icon published">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-value">{publishedContentCount}</span>
				<span class="stat-label">Published</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon templates">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect width="18" height="7" x="3" y="3" rx="1" /><rect
						width="9"
						height="7"
						x="3"
						y="14"
						rx="1"
					/><rect width="5" height="7" x="16" y="14" rx="1" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-value">{data.templates.length}</span>
				<span class="stat-label">Templates</span>
			</div>
		</div>
	</div>
</section>

<!-- Upcoming Content Preview -->
{#if weekContent.length > 0}
	<section class="upcoming-section" aria-label="Upcoming content this week">
		<div class="upcoming-header">
			<h2>This Week</h2>
			<button class="view-all-btn" onclick={() => setActiveTab('calendar')}>
				View Calendar &rarr;
			</button>
		</div>
		<div class="upcoming-list">
			{#each weekContent.slice(0, 5) as item (item.id)}
				<div class="upcoming-item">
					<div class="upcoming-date">
						<span class="date-label">{formatRelativeDate(item.scheduled_date)}</span>
						<span class="time-label">{formatTime(item.scheduled_date)}</span>
					</div>
					<div class="upcoming-content">
						<span class="platform-badge {item.platform}">{item.platform}</span>
						<span class="content-preview">
							{item.content_text.slice(0, 60)}{item.content_text.length > 60 ? '...' : ''}
						</span>
					</div>
					<div class="upcoming-status">
						<span
							class="status-badge"
							class:scheduled={item.status === 'scheduled'}
							class:published={item.status === 'published'}
							class:pending={item.status !== 'scheduled' && item.status !== 'published'}
						>
							{item.status}
						</span>
					</div>
				</div>
			{/each}
			{#if weekContent.length > 5}
				<button class="more-items-btn" onclick={() => setActiveTab('calendar')}>
					+{weekContent.length - 5} more this week
				</button>
			{/if}
		</div>
	</section>
{/if}

<!-- Main Content with Tabs -->
<main class="main-card">
	<div class="tabs" role="tablist" aria-label="Marketing sections">
		{#each tabs as tab, index}
			{@const badge = getTabBadge(tab.id)}
			<button
				bind:this={tabRefs[index]}
				id="tab-{tab.id}"
				class="tab-item"
				class:active={activeTab === tab.id}
				onclick={() => setActiveTab(tab.id)}
				onkeydown={(e) => handleTabKeydown(e, index)}
				aria-selected={activeTab === tab.id}
				aria-controls="panel-{tab.id}"
				role="tab"
				tabindex={activeTab === tab.id ? 0 : -1}
			>
				<span class="tab-icon">
					{#if tab.icon === 'calendar'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line
								x1="16"
								x2="16"
								y1="2"
								y2="6"
							/><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
						</svg>
					{:else if tab.icon === 'megaphone'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
						</svg>
					{:else if tab.icon === 'document'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
							/><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line
								x1="16"
								x2="8"
								y1="17"
								y2="17"
							/><line x1="10" x2="8" y1="9" y2="9" />
						</svg>
					{:else if tab.icon === 'template'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect width="18" height="7" x="3" y="3" rx="1" /><rect
								width="9"
								height="7"
								x="3"
								y="14"
								rx="1"
							/><rect width="5" height="7" x="16" y="14" rx="1" />
						</svg>
					{/if}
				</span>
				<span class="tab-label">{tab.label}</span>
				{#if badge}
					<span class="tab-badge {badge.color}">{badge.count}</span>
				{/if}
			</button>
		{/each}
	</div>

	<div
		id="panel-{activeTab}"
		class="tab-content"
		role="tabpanel"
		aria-labelledby="tab-{activeTab}"
		tabindex="0"
	>
		{#if isLoading}
			<div class="loading-container" transition:fade={{ duration: 100 }}>
				<div class="spinner"></div>
			</div>
		{:else}
			{#key activeTab}
				<div transition:fade={{ duration: 150 }}>
					{#if activeTab === 'calendar'}
						<Calendar
							contentItems={data.content}
							campaigns={data.campaigns}
							templates={data.templates}
							on:calendarUpdated={() => invalidateAll()}
						/>
					{:else if activeTab === 'campaigns'}
						<CampaignManager campaigns={data.campaigns} />
					{:else if activeTab === 'content'}
						<ContentManager
							contentItems={data.content}
							campaigns={data.campaigns}
							templates={data.templates}
						/>
					{:else if activeTab === 'templates'}
						<TemplateManager templates={data.templates} />
					{/if}
				</div>
			{/key}
		{/if}
	</div>
</main>

<style lang="scss">
	/* Stats Section */
	.stats-section {
		margin-bottom: 20px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 10px;

		@media (max-width: 1024px) {
			grid-template-columns: repeat(3, 1fr);
		}
		@media (max-width: 640px) {
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;
		}
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		transition: all 0.15s ease;
		font-family: inherit;
		text-align: left;

		&.clickable {
			cursor: pointer;
			&:hover {
				border-color: var(--shadow-monarch);
				box-shadow: var(--glow-sm);
				transform: translateY(-1px);
			}
		}

		&.has-pending {
			border-color: #f59e0b;
			background: var(--void-elevated);
		}

		@media (max-width: 640px) {
			padding: 10px;
			gap: 8px;
		}
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		flex-shrink: 0;

		@media (max-width: 640px) {
			width: 32px;
			height: 32px;
			svg {
				width: 16px;
				height: 16px;
			}
		}

		&.today {
			background: rgba(59, 130, 246, 0.1);
			color: #3b82f6;
		}
		&.scheduled {
			background: rgba(99, 102, 241, 0.1);
			color: #6366f1;
		}
		&.active {
			background: rgba(16, 185, 129, 0.1);
			color: #10b981;
		}
		&.pending {
			background: rgba(251, 191, 36, 0.1);
			color: #f59e0b;
		}
		&.published {
			background: rgba(34, 197, 94, 0.1);
			color: #22c55e;
		}
		&.templates {
			background: rgba(139, 92, 246, 0.1);
			color: #8b5cf6;
		}
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.stat-value {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
		@media (max-width: 640px) {
			font-size: 1.125rem;
		}
	}

	.stat-label {
		font-size: 0.7rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	/* Upcoming Section */
	.upcoming-section {
		margin-bottom: 20px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	.upcoming-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 16px;
		border-bottom: 1px solid var(--void-elevated);
		background: var(--void-deep);

		h2 {
			margin: 0;
			font-size: 0.9rem;
			font-weight: 600;
			color: var(--text-primary);
		}
	}

	.view-all-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--shadow-monarch);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s ease;
		&:hover {
			opacity: 0.7;
		}
	}

	.upcoming-list {
		padding: 6px;
	}

	.upcoming-item {
		display: grid;
		grid-template-columns: 100px 1fr auto;
		gap: 12px;
		padding: 10px;
		border-radius: 8px;
		transition: background 0.15s ease;
		&:hover {
			background: var(--void-deep);
		}
		@media (max-width: 640px) {
			grid-template-columns: 80px 1fr auto;
			gap: 8px;
			padding: 8px;
		}
	}

	.upcoming-date {
		display: flex;
		flex-direction: column;
		.date-label {
			font-size: 0.8rem;
			font-weight: 600;
			color: var(--text-primary);
		}
		.time-label {
			font-size: 0.7rem;
			color: var(--text-secondary);
		}
	}

	.upcoming-content {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.platform-badge {
		flex-shrink: 0;
		padding: 2px 8px;
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		border-radius: 12px;
		letter-spacing: 0.04em;

		&.twitter {
			background: #1da1f2;
			color: white;
		}
		&.instagram {
			background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
			color: white;
		}
		&.linkedin {
			background: #0077b5;
			color: white;
		}
		&.facebook {
			background: #4267b2;
			color: white;
		}
	}

	.content-preview {
		font-size: 0.8rem;
		color: var(--text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.upcoming-status {
		display: flex;
		align-items: center;
	}

	.status-badge {
		padding: 2px 10px;
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: capitalize;
		&.scheduled {
			background: rgba(59, 130, 246, 0.12);
			color: #3b82f6;
		}
		&.published {
			background: rgba(16, 185, 129, 0.12);
			color: #10b981;
		}
		&.pending {
			background: rgba(245, 158, 11, 0.12);
			color: #f59e0b;
		}
	}

	.more-items-btn {
		display: block;
		width: 100%;
		padding: 10px;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--shadow-monarch);
		background: transparent;
		border: 1px dashed var(--void-elevated);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s ease;
		margin-top: 6px;
		&:hover {
			background: var(--void-deep);
			border-color: var(--shadow-monarch);
		}
	}

	/* Main Card */
	.main-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 16px;
		min-height: 500px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;

		@media (max-width: 768px) {
			padding: 12px;
			min-height: 400px;
		}
		@media (max-width: 480px) {
			padding: 10px;
			min-height: auto;
		}
	}

	/* Tabs */
	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin-bottom: 16px;
		border-bottom: 1px solid var(--void-elevated);
		padding-bottom: 0;
		@media (max-width: 640px) {
			gap: 0;
		}
	}

	.tab-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 14px;
		font-weight: 500;
		font-size: 0.85rem;
		color: var(--text-secondary);
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;
		font-family: inherit;

		@media (max-width: 640px) {
			padding: 8px 10px;
			font-size: 0.8rem;
			gap: 4px;
		}
		@media (max-width: 480px) {
			.tab-label {
				display: none;
			}
		}

		&:hover {
			color: var(--text-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--shadow-monarch);
			outline-offset: -2px;
			border-radius: 6px 6px 0 0;
		}

		&.active {
			color: var(--shadow-monarch);
			border-bottom-color: var(--shadow-monarch);
			background: rgba(139, 92, 246, 0.05);
			border-radius: 6px 6px 0 0;
		}
	}

	.tab-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		@media (max-width: 640px) {
			svg {
				width: 16px;
				height: 16px;
			}
		}
	}

	.tab-badge {
		padding: 1px 7px;
		border-radius: 12px;
		font-size: 0.65rem;
		font-weight: 600;
		&.info {
			background: rgba(59, 130, 246, 0.12);
			color: #3b82f6;
		}
		&.success {
			background: rgba(16, 185, 129, 0.12);
			color: #10b981;
		}
		&.warning {
			background: rgba(245, 158, 11, 0.12);
			color: #f59e0b;
		}
		&.neutral {
			background: var(--void-elevated);
			color: var(--text-secondary);
		}
		@media (max-width: 640px) {
			padding: 1px 5px;
			font-size: 0.6rem;
		}
	}

	/* Tab Content */
	.tab-content {
		padding: 12px 0;
		min-height: 300px;
		&:focus {
			outline: none;
		}
		@media (max-width: 768px) {
			padding: 8px 0;
		}
	}

	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--void-elevated);
		border-top-color: var(--shadow-monarch);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
