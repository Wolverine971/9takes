<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	// import { onMount } from 'svelte';
	import Calendar from '$lib/components/marketing/Calendar.svelte';
	import CampaignManager from '$lib/components/marketing/CampaignManager.svelte';
	import ContentManager from '$lib/components/marketing/ContentManager.svelte';
	import TemplateManager from '$lib/components/marketing/TemplateManager.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import '../../app.scss';

	let activeTab: 'calendar' | 'campaigns' | 'content' | 'templates' = 'calendar';

	function setActiveTab(tab: typeof activeTab) {
		activeTab = tab;
	}
	export let data;
</script>

<main class="container mx-auto p-4">
	<div class="row">
		<a href="/admin/users">Users</a> |
		<a href="/admin/questions">Questions</a> |
		<a href="/admin/comments">Comments</a> |
		<a href="/content-board">Content Board</a> |
		<a href="/marketing" class="active-link">Marketing</a> |
		<a href="/links">Links</a> |
		<a href="/admin/messages">Messages</a>
	</div>

	<Tabs
		tabStyle="underline"
		contentClass="py-4 bg-transparent max-w-[700px]"
		defaultClass="list-none flex"
	>
		<TabItem open title="Calendar" on:click={() => setActiveTab('calendar')}>
			<Calendar
				contentItems={data.content}
				campaigns={data.campaigns}
				templates={data.templates}
				on:calendarUpdated={() => invalidateAll()}
			/>
		</TabItem>

		<TabItem title="Campaigns" on:click={() => setActiveTab('campaigns')}>
			<CampaignManager campaigns={data.campaigns} />
		</TabItem>

		<TabItem title="Content" on:click={() => setActiveTab('content')}>
			<ContentManager
				contentItems={data.content}
				campaigns={data.campaigns}
				templates={data.templates}
			/>
		</TabItem>
		<TabItem title="Templates" on:click={() => setActiveTab('templates')}>
			<TemplateManager templates={data.templates} />
		</TabItem>
	</Tabs>
</main>
