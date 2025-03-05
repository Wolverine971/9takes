<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import Calendar from '$lib/components/marketing/Calendar.svelte';
	import CampaignManager from '$lib/components/marketing/CampaignManager.svelte';
	import ContentManager from '$lib/components/marketing/ContentManager.svelte';
	import TemplateManager from '$lib/components/marketing/TemplateManager.svelte';
	import { Tabs, TabItem, Badge } from 'flowbite-svelte';
	import '../../app.scss';

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

<main class="container mx-auto p-4">
	<div class="mb-6 rounded-lg bg-white p-3 shadow dark:bg-gray-800">
		<nav class="flex flex-wrap text-sm font-medium sm:text-base">
			<a
				href="/admin/users"
				class="px-3 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400">Users</a
			>
			<a
				href="/admin/questions"
				class="px-3 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
				>Questions</a
			>
			<a
				href="/admin/comments"
				class="px-3 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400">Comments</a
			>
			<a
				href="/content-board"
				class="px-3 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
				>Content Board</a
			>
			<a href="/marketing" class="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">Marketing</a
			>
			<a
				href="/links"
				class="px-3 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400">Links</a
			>
			<a
				href="/admin/messages"
				class="px-3 py-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400">Messages</a
			>
		</nav>
	</div>

	<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
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
</main>

<style lang="scss">
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
