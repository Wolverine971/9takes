<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Select, Label, Modal } from 'flowbite-svelte';
	import ContentEditor from './ContentEditor.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';

	export let contentItems: ContentItem[];
	export let campaigns: Campaign[];
	export let templates: Template[];

	let selectedCampaignId: string = 'all';
	let editingContent: ContentItem | null = null;
	let showNewContentForm = false;
	let showEditModal = false;

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
		closeEditModal();
	}

	function openEditModal(item: ContentItem) {
		editingContent = item;
		showEditModal = true;
	}

	function closeEditModal() {
		editingContent = null;
		showEditModal = false;
	}

	function truncateText(text: string, maxLength: number): string {
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}
</script>

<div class="max-w-7xl mx-auto p-4">
	<div class="mb-6 md:flex md:justify-between md:items-end">
		<div class="mb-4 md:mb-0 md:flex-grow md:mr-4">
			<h2 class="mb-2 text-2xl font-bold">Filter by Campaign</h2>
			<Label class="space-y-2 block">
				<span class="text-sm font-medium text-gray-700">Select Campaign</span>
				<Select on:change={handleCampaignSelection} value={selectedCampaignId} class="w-full">
					<option value="all">All Campaigns</option>
					<option value="no-campaign">No Campaign</option>
					{#each campaigns as campaign}
						<option value={campaign.id}>{campaign.name}</option>
					{/each}
				</Select>
			</Label>
		</div>
		<div>
			<Button on:click={() => (showNewContentForm = !showNewContentForm)} class="w-full md:w-auto">
				{showNewContentForm ? 'Hide' : 'Show'} Create New Content Form
			</Button>
		</div>
	</div>

	{#if showNewContentForm}
		<Card class="mb-6">
			<h3 class="mb-4 text-xl font-bold">Create New Content</h3>
			<CreateContent {campaigns} {templates} />
		</Card>
	{/if}

	<h2 class="mb-4 text-2xl font-bold">Existing Content</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each filteredContent as item}
			<Card class="flex flex-col">
				<div class="flex-grow">
					<h3 class="m-0 p-0 font-bold mb-2 text-lg">{truncateText(item.content_text, 50)}</h3>
					<p class="text-sm mb-1"><span class="font-medium">Scheduled for:</span> {new Date(item.scheduled_date).toLocaleString()}</p>
					<p class="text-sm mb-1"><span class="font-medium">Platform:</span> {item.platform}</p>
					<p class="text-sm mb-1"><span class="font-medium">Campaign:</span> {campaigns.find((c) => c.id === item.campaign_id)?.name || 'No Campaign'}</p>
					<p class="text-sm mb-3"><span class="font-medium">Status:</span> {item.status}</p>
				</div>
				<Button on:click={() => openEditModal(item)} class="w-full">Edit</Button>
			</Card>
		{/each}
	</div>
</div>

<Modal bind:open={showEditModal} size="xl" autoclose={false} class="w-full">
	<h3 class="text-xl font-medium text-gray-900 mb-4">Edit Content</h3>
	{#if editingContent}
		<ContentEditor
			contentItem={editingContent}
			{campaigns}
			{templates}
			on:contentUpdated={handleContentUpdate}
			on:cancel={closeEditModal}
		/>
	{/if}
</Modal>