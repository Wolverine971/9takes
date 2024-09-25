<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Select, Label } from 'flowbite-svelte';
	import ContentEditor from './ContentEditor.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';

	export let contentItems: ContentItem[];
	export let campaigns: Campaign[];
	export let templates: Template[];

	let selectedCampaignId: string = 'all';
	let editingContent: ContentItem | null = null;
	let showNewContentForm = false;

	$: filteredContent =
		selectedCampaignId === 'all'
			? contentItems
			: contentItems.filter((item) =>
					selectedCampaignId === 'no-campaign'
						? item.campaign_id === null
						: item.campaign_id === selectedCampaignId
				);

	function handleCampaignSelection(event: Event) {
		selectedCampaignId = (event.target as HTMLSelectElement).value;
	}

	function handleContentUpdate(event: CustomEvent) {
		const updatedContent = event.detail;
		const index = contentItems.findIndex((item) => item.id === updatedContent.id);
		if (index !== -1) {
			contentItems[index] = updatedContent;
			contentItems = [...contentItems]; // Trigger reactivity
		}
		editingContent = null;
	}
</script>

<div class="mb-4">
	<h2 class="mb-2 text-2xl font-bold">Filter by Campaign</h2>
	<Label class="space-y-2">
		<span>Select Campaign</span>
		<Select on:change={handleCampaignSelection} value={selectedCampaignId}>
			<option value="all">All Campaigns</option>
			<option value="no-campaign">No Campaign</option>
			{#each campaigns as campaign}
				<option value={campaign.id}>{campaign.name}</option>
			{/each}
		</Select>
	</Label>
</div>

<Button on:click={() => (showNewContentForm = !showNewContentForm)}>
	{showNewContentForm ? 'Hide' : 'Show'} Create New Content Form
</Button>

{#if showNewContentForm}
	<Card class="mt-4 max-w-[600px]">
		<h3 class="mb-2 text-xl font-bold">Create New Content</h3>
		<CreateContent {campaigns} {templates} />
	</Card>
{/if}

<h2 class="my-4 text-2xl font-bold">Existing Content</h2>
{#each filteredContent as item}
	<Card class="mb-4 max-w-[600px]">
		{#if editingContent && editingContent.id === item.id}
			<ContentEditor
				contentItem={item}
				{campaigns}
				{templates}
				on:contentUpdated={handleContentUpdate}
				on:cancel={() => (editingContent = null)}
			/>
		{:else}
			<h3 class="font-bold">{item.content_text.substring(0, 50)}...</h3>
			<p>Scheduled for: {new Date(item.scheduled_date).toLocaleString()}</p>
			<p>Platform: {item.platform}</p>
			<p>Campaign: {campaigns.find((c) => c.id === item.campaign_id)?.name || 'No Campaign'}</p>
			<p>Status: {item.status}</p>
			<Button on:click={() => (editingContent = item)}>Edit</Button>
		{/if}
	</Card>
{/each}
