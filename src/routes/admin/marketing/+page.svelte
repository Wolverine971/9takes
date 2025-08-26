<!-- src/routes/admin/marketing/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import Calendar from '$lib/components/marketing/Calendar.svelte';
	import CampaignManager from '$lib/components/marketing/CampaignManager.svelte';
	import ContentManager from '$lib/components/marketing/ContentManager.svelte';
	import TemplateManager from '$lib/components/marketing/TemplateManager.svelte';
	import { Tabs, TabItem, Badge } from 'flowbite-svelte';
	import '../../../app.scss';

	let activeTab: 'calendar' | 'campaigns' | 'content' | 'templates' = 'calendar';

	function setActiveTab(tab: typeof activeTab) {
		activeTab = tab;
	}

	export let data;

	// Get today's content count for the badge
	$: todayContentCount = data.content.filter((item) => {
		const itemDate = new Date(item.scheduled_date);
		const today = new Date();
		return itemDate.toDateString() === today.toDateString();
	}).length;

	// Get pending content count for the badge
	$: pendingContentCount = data.content.filter(
		(item) => item.status === 'pending' || item.status === 'draft'
	).length;
</script>

<div class="admin-marketing">
	<header class="page-header">
		<h1>Marketing Dashboard</h1>
		<p class="subtitle">
			Manage marketing campaigns, content scheduling, and analytics in one place
		</p>
	</header>

	<main class="section-card">
		<div class="tabs" role="tablist">
			<button
				class="tab-item {activeTab === 'calendar' ? 'active' : ''}"
				on:click={() => setActiveTab('calendar')}
				aria-selected={activeTab === 'calendar'}
				role="tab"
			>
				<span>Calendar</span>
				{#if todayContentCount > 0}
					<Badge color="blue" class="badge">{todayContentCount} today</Badge>
				{/if}
			</button>

			<button
				class="tab-item {activeTab === 'campaigns' ? 'active' : ''}"
				on:click={() => setActiveTab('campaigns')}
				aria-selected={activeTab === 'campaigns'}
				role="tab"
			>
				<span>Campaigns</span>
				<Badge color="green" class="badge">{data.campaigns.length}</Badge>
			</button>

			<button
				class="tab-item {activeTab === 'content' ? 'active' : ''}"
				on:click={() => setActiveTab('content')}
				aria-selected={activeTab === 'content'}
				role="tab"
			>
				<span>Content</span>
				{#if pendingContentCount > 0}
					<Badge color="red" class="badge">{pendingContentCount} pending</Badge>
				{/if}
			</button>

			<button
				class="tab-item {activeTab === 'templates' ? 'active' : ''}"
				on:click={() => setActiveTab('templates')}
				aria-selected={activeTab === 'templates'}
				role="tab"
			>
				<span>Templates</span>
				<Badge color="gray" class="badge">{data.templates.length}</Badge>
			</button>
		</div>

		<div class="tab-content" role="tabpanel">
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
	</main>
</div>

<style lang="scss">
	.admin-marketing {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
		overflow-x: hidden;

		@media (max-width: 768px) {
			padding: 0.5rem;
		}

		@media (max-width: 480px) {
			padding: 0.25rem;
		}
	}

	.page-header {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, var(--primary-light, #f0f9ff) 0%, #f8fafc 100%);
		border-radius: 1rem;
		border: 1px solid var(--border-color, #e5e7eb);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

		@media (max-width: 768px) {
			margin-bottom: 1rem;
			padding: 1rem;
			border-radius: 0.5rem;
		}

		h1 {
			margin: 0 0 0.5rem 0;
			font-size: 2rem;
			font-weight: 700;
			color: var(--text-primary, #111827);
			letter-spacing: -0.025em;

			@media (max-width: 768px) {
				font-size: 1.5rem;
			}
		}

		.subtitle {
			margin: 0;
			font-size: 1rem;
			color: var(--text-secondary, #6b7280);
			line-height: 1.5;

			@media (max-width: 768px) {
				font-size: 0.875rem;
			}
		}
	}

	.section-card {
		background-color: var(--card-background, #ffffff);
		border: 1px solid var(--border-color, #e5e7eb);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		min-height: 600px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;

		@media (max-width: 768px) {
			padding: 1rem;
			border-radius: 0.5rem;
			min-height: 500px;
		}

		@media (max-width: 480px) {
			padding: 0.5rem;
			min-height: auto;
		}
	}

	// Tab improvements
	:global(.admin-marketing .tabs) {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--border-color, #e5e7eb);
		padding-bottom: 0;

		@media (max-width: 640px) {
			gap: 0.25rem;
			margin-bottom: 1rem;
		}
	}

	:global(.admin-marketing .tab-item) {
		position: relative;
		padding: 0.75rem 1.25rem;
		font-weight: 500;
		font-size: 0.9375rem;
		color: var(--text-secondary, #6b7280);
		background-color: transparent;
		border: none;
		border-bottom: 3px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 0.5rem;

		@media (max-width: 640px) {
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}

		&:hover {
			color: var(--primary, #3b82f6);
			background-color: var(--primary-light, #eff6ff);
			border-radius: 0.5rem 0.5rem 0 0;
		}

		&.active {
			color: var(--primary, #3b82f6);
			border-bottom-color: var(--primary, #3b82f6);
			background-color: var(--primary-light, #eff6ff);
			border-radius: 0.5rem 0.5rem 0 0;
		}
	}

	// Badge improvements
	:global(.admin-marketing .badge) {
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 9999px;

		@media (max-width: 640px) {
			padding: 0.125rem 0.375rem;
			font-size: 0.6875rem;
		}
	}

	// Content area improvements
	:global(.admin-marketing .tab-content) {
		padding: 1.5rem 0;
		overflow-x: hidden;

		@media (max-width: 768px) {
			padding: 1rem 0;
		}

		@media (max-width: 480px) {
			padding: 0.5rem 0;
		}
	}

	// Loading state
	:global(.admin-marketing .loading-container) {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
	}

	// Empty state
	:global(.admin-marketing .empty-state) {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary, #6b7280);
	}

	// Additional mobile optimizations
	@media (max-width: 480px) {
		.page-header {
			margin-bottom: 0.75rem !important;
			padding: 0.75rem !important;

			h1 {
				font-size: 1.25rem !important;
			}

			.subtitle {
				font-size: 0.75rem !important;
			}
		}
	}

	// Dark mode support
	@media (prefers-color-scheme: dark) {
		.page-header {
			background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);

			h1 {
				color: #f9fafb;
			}
		}

		.section-card {
			background-color: #1f2937;
			border-color: #374151;
		}

		:global(.admin-marketing .tabs) {
			border-bottom-color: #374151;
		}

		:global(.admin-marketing .tab-item) {
			color: #9ca3af;

			&:hover {
				color: #60a5fa;
				background-color: rgba(59, 130, 246, 0.1);
			}

			&.active {
				color: #60a5fa;
				border-bottom-color: #60a5fa;
				background-color: rgba(59, 130, 246, 0.1);
			}
		}
	}
</style>
