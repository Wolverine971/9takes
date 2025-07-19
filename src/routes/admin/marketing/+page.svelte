<!-- routes/marketing/+page.svelte -->
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
	<div class="page-header">
		<h1>Marketing Dashboard</h1>
		<p class="subtitle">Manage marketing campaigns and analytics</p>
	</div>

	<div class="section-card">
		<Tabs
			tabStyle="pills"
			contentClass="py-6 bg-transparent"
			defaultClass="flex flex-wrap mb-4 text-sm font-medium text-center list-none"
		>
			<TabItem open title="Calendar" on:click={() => setActiveTab('calendar')}>
				{#if todayContentCount > 0}
					<Badge color="blue" class="ml-2">{todayContentCount} today</Badge>
				{/if}
				<div class="mt-4">
					<Calendar
						contentItems={data.content}
						campaigns={data.campaigns}
						templates={data.templates}
						on:calendarUpdated={() => invalidateAll()}
					/>
				</div>
			</TabItem>

			<TabItem title="Campaigns" on:click={() => setActiveTab('campaigns')}>
				<Badge color="green" class="ml-2">Campaigns #{data.campaigns.length}</Badge>
				<div class="mt-4">
					<CampaignManager campaigns={data.campaigns} />
				</div>
			</TabItem>

			<TabItem title="Content" on:click={() => setActiveTab('content')}>
				{#if pendingContentCount > 0}
					<Badge color="red" class="ml-2">{pendingContentCount} pending</Badge>
				{/if}
				<div class="mt-4">
					<ContentManager
						contentItems={data.content}
						campaigns={data.campaigns}
						templates={data.templates}
					/>
				</div>
			</TabItem>

			<TabItem title="Templates" on:click={() => setActiveTab('templates')}>
				<Badge color="gray" class="ml-2">Template #{data.templates.length}</Badge>
				<div class="mt-4">
					<TemplateManager templates={data.templates} />
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>

<style lang="scss">
	.admin-marketing {
		max-width: 100%;
		margin: 0 auto;
	}

	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	nav a {
		position: relative;
	}

	nav a.text-blue-600::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 70%;
		height: 2px;
		background-color: currentColor;
	}
</style>
