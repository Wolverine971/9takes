<!-- src/routes/admin/marketing/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	import Calendar from '$lib/components/marketing/Calendar.svelte';
	import CampaignManager from '$lib/components/marketing/CampaignManager.svelte';
	import ContentManager from '$lib/components/marketing/ContentManager.svelte';
	import TemplateManager from '$lib/components/marketing/TemplateManager.svelte';
	import { Badge, Spinner } from 'flowbite-svelte';
	import '../../../app.scss';

	export let data;

	let activeTab: 'calendar' | 'campaigns' | 'content' | 'templates' = 'calendar';
	let isLoading = false;
	let tabRefs: HTMLButtonElement[] = [];

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

	// Keyboard navigation for tabs
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

	// Quick stats calculations
	$: todayContentCount = data.content.filter((item) => {
		const itemDate = new Date(item.scheduled_date);
		const today = new Date();
		return itemDate.toDateString() === today.toDateString();
	}).length;

	$: pendingContentCount = data.content.filter(
		(item) => item.status === 'pending' || item.status === 'draft'
	).length;

	$: scheduledContentCount = data.content.filter((item) => item.status === 'scheduled').length;

	$: publishedContentCount = data.content.filter((item) => item.status === 'published').length;

	$: activeCampaignsCount = data.campaigns.filter((campaign) => {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		const endDate = new Date(campaign.end_date);
		return startDate <= today && endDate >= today;
	}).length;

	$: upcomingCampaignsCount = data.campaigns.filter((campaign) => {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		return startDate > today;
	}).length;

	// Week content preview
	$: weekContent = data.content
		.filter((item) => {
			const itemDate = new Date(item.scheduled_date);
			const today = new Date();
			const weekFromNow = new Date(today);
			weekFromNow.setDate(weekFromNow.getDate() + 7);
			return itemDate >= today && itemDate <= weekFromNow;
		})
		.sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());

	function getTabBadge(tabId: string) {
		switch (tabId) {
			case 'calendar':
				return todayContentCount > 0
					? { count: `${todayContentCount} today`, color: 'blue' }
					: null;
			case 'campaigns':
				return { count: data.campaigns.length, color: 'green' };
			case 'content':
				return pendingContentCount > 0
					? { count: `${pendingContentCount} pending`, color: 'yellow' }
					: null;
			case 'templates':
				return { count: data.templates.length, color: 'dark' };
			default:
				return null;
		}
	}

	function formatRelativeDate(dateStr: string) {
		const date = new Date(dateStr);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		} else {
			return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
		}
	}

	function formatTime(dateStr: string) {
		return new Date(dateStr).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}
</script>

<div class="admin-marketing">
	<!-- Header -->
	<header class="page-header">
		<div class="header-content">
			<div class="header-text">
				<h1>Marketing Dashboard</h1>
				<p class="subtitle">Manage campaigns, content scheduling, and templates</p>
			</div>
			<div class="header-actions">
				<a href="/admin" class="back-link" aria-label="Back to admin dashboard">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m12 19-7-7 7-7" />
						<path d="M19 12H5" />
					</svg>
					<span>Admin</span>
				</a>
			</div>
		</div>
	</header>

	<!-- Quick Stats -->
	<section class="stats-section" aria-label="Quick statistics">
		<div class="stats-grid">
			<button
				class="stat-card clickable"
				on:click={() => setActiveTab('content')}
				aria-label="View content scheduled for today"
			>
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
						<line x1="16" x2="16" y1="2" y2="6" />
						<line x1="8" x2="8" y1="2" y2="6" />
						<line x1="3" x2="21" y1="10" y2="10" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{todayContentCount}</span>
					<span class="stat-label">Today</span>
				</div>
			</button>

			<button
				class="stat-card clickable"
				on:click={() => setActiveTab('content')}
				aria-label="View scheduled content"
			>
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
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{scheduledContentCount}</span>
					<span class="stat-label">Scheduled</span>
				</div>
			</button>

			<button
				class="stat-card clickable"
				on:click={() => setActiveTab('campaigns')}
				aria-label="View active campaigns"
			>
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
						<path d="m3 11 18-5v12L3 14v-3z" />
						<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
					</svg>
				</div>
				<div class="stat-content">
					<span class="stat-value">{activeCampaignsCount}</span>
					<span class="stat-label">Active</span>
				</div>
			</button>

			<button
				class="stat-card clickable {pendingContentCount > 0 ? 'has-pending' : ''}"
				on:click={() => setActiveTab('content')}
				aria-label="View pending content"
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
						<path d="M12 2v4" />
						<path d="m16.2 7.8 2.9-2.9" />
						<path d="M18 12h4" />
						<path d="m16.2 16.2 2.9 2.9" />
						<path d="M12 18v4" />
						<path d="m4.9 19.1 2.9-2.9" />
						<path d="M2 12h4" />
						<path d="m4.9 4.9 2.9 2.9" />
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
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
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
						<rect width="18" height="7" x="3" y="3" rx="1" />
						<rect width="9" height="7" x="3" y="14" rx="1" />
						<rect width="5" height="7" x="16" y="14" rx="1" />
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
				<button class="view-all-btn" on:click={() => setActiveTab('calendar')}>
					View Calendar
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M5 12h14" />
						<path d="m12 5 7 7-7 7" />
					</svg>
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
							<span class="content-preview"
								>{item.content_text.slice(0, 60)}{item.content_text.length > 60 ? '...' : ''}</span
							>
						</div>
						<div class="upcoming-status">
							<Badge
								color={item.status === 'scheduled'
									? 'blue'
									: item.status === 'published'
										? 'green'
										: 'yellow'}
								rounded
							>
								{item.status}
							</Badge>
						</div>
					</div>
				{/each}
				{#if weekContent.length > 5}
					<button class="more-items-btn" on:click={() => setActiveTab('calendar')}>
						+{weekContent.length - 5} more this week
					</button>
				{/if}
			</div>
		</section>
	{/if}

	<!-- Main Content with Tabs -->
	<main class="section-card">
		<div class="tabs" role="tablist" aria-label="Marketing sections">
			{#each tabs as tab, index}
				{@const badge = getTabBadge(tab.id)}
				<button
					bind:this={tabRefs[index]}
					id="tab-{tab.id}"
					class="tab-item {activeTab === tab.id ? 'active' : ''}"
					on:click={() => setActiveTab(tab.id)}
					on:keydown={(e) => handleTabKeydown(e, index)}
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
								<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
								<line x1="16" x2="16" y1="2" y2="6" />
								<line x1="8" x2="8" y1="2" y2="6" />
								<line x1="3" x2="21" y1="10" y2="10" />
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
								<path d="m3 11 18-5v12L3 14v-3z" />
								<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
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
								<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" x2="8" y1="13" y2="13" />
								<line x1="16" x2="8" y1="17" y2="17" />
								<line x1="10" x2="8" y1="9" y2="9" />
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
								<rect width="18" height="7" x="3" y="3" rx="1" />
								<rect width="9" height="7" x="3" y="14" rx="1" />
								<rect width="5" height="7" x="16" y="14" rx="1" />
							</svg>
						{/if}
					</span>
					<span class="tab-label">{tab.label}</span>
					{#if badge}
						<Badge color={badge.color} class="tab-badge">{badge.count}</Badge>
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
					<Spinner size="8" color="blue" />
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
</div>

<style lang="scss">
	.admin-marketing {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
		overflow-x: hidden;

		@media (max-width: 768px) {
			padding: 0.75rem;
		}

		@media (max-width: 480px) {
			padding: 0.5rem;
		}
	}

	/* Header */
	.page-header {
		margin-bottom: 1.5rem;
		padding: 1.25rem 1.5rem;
		background: linear-gradient(135deg, var(--primary-100, #eff6ff) 0%, #f8fafc 100%);
		border-radius: 0.75rem;
		border: 1px solid var(--border-color, #e5e7eb);

		@media (max-width: 768px) {
			margin-bottom: 1rem;
			padding: 1rem;
			border-radius: 0.5rem;
		}
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		@media (max-width: 640px) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.header-text {
		h1 {
			margin: 0 0 0.25rem 0;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text-primary, #1e293b);
			letter-spacing: -0.025em;

			@media (max-width: 768px) {
				font-size: 1.25rem;
			}
		}

		.subtitle {
			margin: 0;
			font-size: 0.875rem;
			color: var(--text-secondary, #64748b);
		}
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary, #64748b);
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.15s ease;

		&:hover {
			color: var(--primary, #3b82f6);
			border-color: var(--primary, #3b82f6);
		}
	}

	/* Stats Section */
	.stats-section {
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.75rem;

		@media (max-width: 1024px) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media (max-width: 640px) {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
		transition: all 0.15s ease;

		&.clickable {
			cursor: pointer;

			&:hover {
				border-color: var(--primary, #3b82f6);
				box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
				transform: translateY(-1px);
			}
		}

		&.has-pending {
			border-color: #fbbf24;
			background: linear-gradient(135deg, #fffbeb 0%, #fff 100%);
		}

		@media (max-width: 640px) {
			padding: 0.75rem;
			gap: 0.5rem;
		}
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 0.5rem;
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
		color: var(--text-primary, #1e293b);
		line-height: 1.2;

		@media (max-width: 640px) {
			font-size: 1.125rem;
		}
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	/* Upcoming Section */
	.upcoming-section {
		margin-bottom: 1.5rem;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.upcoming-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		background: var(--hover-background, #f8fafc);

		h2 {
			margin: 0;
			font-size: 0.9375rem;
			font-weight: 600;
			color: var(--text-primary, #1e293b);
		}
	}

	.view-all-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--primary, #3b82f6);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			text-decoration: underline;
		}
	}

	.upcoming-list {
		padding: 0.5rem;
	}

	.upcoming-item {
		display: grid;
		grid-template-columns: 100px 1fr auto;
		gap: 1rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		transition: background-color 0.15s ease;

		&:hover {
			background: var(--hover-background, #f8fafc);
		}

		@media (max-width: 640px) {
			grid-template-columns: 80px 1fr auto;
			gap: 0.5rem;
			padding: 0.5rem;
		}
	}

	.upcoming-date {
		display: flex;
		flex-direction: column;

		.date-label {
			font-size: 0.8125rem;
			font-weight: 600;
			color: var(--text-primary, #1e293b);
		}

		.time-label {
			font-size: 0.6875rem;
			color: var(--text-secondary, #64748b);
		}
	}

	.upcoming-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.platform-badge {
		flex-shrink: 0;
		padding: 0.125rem 0.5rem;
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		border-radius: 9999px;
		letter-spacing: 0.025em;

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
		font-size: 0.8125rem;
		color: var(--text-secondary, #64748b);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.upcoming-status {
		display: flex;
		align-items: center;
	}

	.more-items-btn {
		display: block;
		width: 100%;
		padding: 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--primary, #3b82f6);
		background: transparent;
		border: 1px dashed var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.15s ease;
		margin-top: 0.5rem;

		&:hover {
			background: var(--hover-background, #f8fafc);
			border-color: var(--primary, #3b82f6);
		}
	}

	/* Main Section Card */
	.section-card {
		background-color: var(--card-background, #ffffff);
		border: 1px solid var(--border-color, #e5e7eb);
		border-radius: 0.75rem;
		padding: 1.25rem;
		min-height: 500px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;

		@media (max-width: 768px) {
			padding: 1rem;
			border-radius: 0.5rem;
			min-height: 400px;
		}

		@media (max-width: 480px) {
			padding: 0.75rem;
			min-height: auto;
		}
	}

	/* Tabs */
	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-bottom: 1.25rem;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
		padding-bottom: 0;

		@media (max-width: 640px) {
			gap: 0.125rem;
			margin-bottom: 1rem;
		}
	}

	.tab-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--text-secondary, #6b7280);
		background-color: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		cursor: pointer;
		transition: all 0.15s ease;
		white-space: nowrap;

		@media (max-width: 640px) {
			padding: 0.625rem 0.75rem;
			font-size: 0.8125rem;
			gap: 0.375rem;
		}

		@media (max-width: 480px) {
			.tab-label {
				display: none;
			}

			gap: 0.25rem;
		}

		&:hover {
			color: var(--primary, #3b82f6);
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: -2px;
			border-radius: 0.375rem 0.375rem 0 0;
		}

		&.active {
			color: var(--primary, #3b82f6);
			border-bottom-color: var(--primary, #3b82f6);
			background-color: rgba(59, 130, 246, 0.05);
			border-radius: 0.375rem 0.375rem 0 0;
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

	:global(.tab-badge) {
		padding: 0.125rem 0.5rem !important;
		font-size: 0.6875rem !important;
		font-weight: 600 !important;

		@media (max-width: 640px) {
			padding: 0.125rem 0.375rem !important;
			font-size: 0.625rem !important;
		}
	}

	/* Tab Content */
	.tab-content {
		padding: 1rem 0;
		min-height: 300px;

		&:focus {
			outline: none;
		}

		@media (max-width: 768px) {
			padding: 0.75rem 0;
		}
	}

	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.page-header {
			background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);

			h1 {
				color: #f9fafb;
			}

			.subtitle {
				color: #94a3b8;
			}
		}

		.back-link {
			background: #1f2937;
			border-color: #374151;
			color: #9ca3af;

			&:hover {
				color: #60a5fa;
				border-color: #60a5fa;
			}
		}

		.stat-card {
			background: #1f2937;
			border-color: #374151;

			&.has-pending {
				background: linear-gradient(135deg, #422006 0%, #1f2937 100%);
				border-color: #a16207;
			}
		}

		.stat-value {
			color: #f9fafb;
		}

		.upcoming-section {
			background: #1f2937;
			border-color: #374151;
		}

		.upcoming-header {
			background: #111827;
			border-color: #374151;

			h2 {
				color: #f9fafb;
			}
		}

		.upcoming-item:hover {
			background: #111827;
		}

		.upcoming-date .date-label {
			color: #f9fafb;
		}

		.more-items-btn {
			border-color: #374151;

			&:hover {
				background: #111827;
			}
		}

		.section-card {
			background-color: #1f2937;
			border-color: #374151;
		}

		.tabs {
			border-bottom-color: #374151;
		}

		.tab-item {
			color: #9ca3af;

			&:hover {
				color: #60a5fa;
			}

			&.active {
				color: #60a5fa;
				border-bottom-color: #60a5fa;
				background-color: rgba(96, 165, 250, 0.1);
			}
		}
	}
</style>
