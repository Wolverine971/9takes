<script lang="ts">
	import { Button, Card, Modal, Select } from 'flowbite-svelte';
	import ContentEditor from './ContentEditor.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let contentItems: ContentItem[];
	export let campaigns: Campaign[];
	export let templates: Template[];

	let currentDate = new Date();
	let selectedContent: ContentItem | null = null;
	let showEditModal = false;
	let showCreateModal = false;
	let selectedCampaignId: string = 'all';
	let showAllContentModal = false;
	let selectedDayContent: ContentItem[] = [];
	let selectedDate: Date | null = null;

	function generateCalendarDays(date: Date): Date[] {
		const days: Date[] = [];
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		for (let i = 0; i < firstDay.getDay(); i++) {
			days.push(null);
		}

		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(date.getFullYear(), date.getMonth(), i));
		}

		return days;
	}

	$: calendarDays = generateCalendarDays(currentDate);

	function previousMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
	}

	function openContentEditor(content: ContentItem) {
		selectedContent = { ...content };
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		selectedContent = null;
	}

	function openCreateModal(date: Date) {
		selectedDate = date;
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
		selectedDate = null;
	}

	function handleContentUpdate(event: CustomEvent) {
		const updatedContents = event.detail;
		if (Array.isArray(updatedContents)) {
			// Handle multiple content updates (from campaign date change)
			updatedContents.forEach((updatedContent) => {
				const index = contentItems.findIndex((item) => item.id === updatedContent.id);
				if (index !== -1) {
					contentItems[index] = updatedContent;
				}
			});
		} else {
			// Handle single content update
			const updatedContent = event.detail;
			const index = contentItems.findIndex((item) => item.id === updatedContent.id);
			if (index !== -1) {
				contentItems[index] = updatedContent;
			}
		}
		contentItems = [...contentItems]; // Trigger reactivity
		closeEditModal();
		dispatch('calendarUpdated');
	}

	function handleContentCreate(event: CustomEvent) {
		const newContent = event.detail;
		contentItems = [...contentItems, newContent];
		closeCreateModal();
		dispatch('calendarUpdated');
	}

	function handleCampaignSelection(event: Event) {
		selectedCampaignId = (event.target as HTMLSelectElement).value;
	}

	function openAllContentModal(dayContent: ContentItem[]) {
		selectedDayContent = dayContent;
		showAllContentModal = true;
	}

	$: filteredContentItems = contentItems.filter((item) => {
		const itemDate = new Date(item.scheduled_date);
		const isInCurrentMonth =
			itemDate.getFullYear() === currentDate.getFullYear() &&
			itemDate.getMonth() === currentDate.getMonth();
		const matchesCampaign =
			selectedCampaignId === 'all' ||
			(selectedCampaignId === 'no-campaign' && !item.campaign_id) ||
			item.campaign_id === selectedCampaignId;
		return isInCurrentMonth && matchesCampaign;
	});

	function sortContentByDateTime(a: ContentItem, b: ContentItem) {
		return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
	}
</script>

<svelte:window on:contentUpdated={handleContentUpdate} />

<div class="mb-4 flex items-center justify-between">
	<div>
		<Button on:click={previousMonth}>Previous</Button>
		<span class="mx-4 text-lg font-bold">
			{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
		</span>
		<Button on:click={nextMonth}>Next</Button>
	</div>
	<div class="w-64">
		<Select on:change={handleCampaignSelection} value={selectedCampaignId}>
			<option value="all">All Campaigns</option>
			<option value="no-campaign">No Campaign</option>
			{#each campaigns as campaign}
				<option value={campaign.id}>{campaign.name}</option>
			{/each}
		</Select>
	</div>
</div>

<div class="grid grid-cols-7 gap-1">
	{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
		<div class="p-2 text-center font-bold">{day}</div>
	{/each}

	{#each calendarDays as day}
		<div class="h-32 overflow-hidden border p-1" on:click={() => day && openCreateModal(day)}>
			{#if day}
				<div class="mb-1 text-sm font-bold">{day.getDate()}</div>
				{@const dayContent = filteredContentItems
					.filter((item) => new Date(item.scheduled_date).toDateString() === day.toDateString())
					.sort(sortContentByDateTime)}
				{#each dayContent.slice(0, 3) as item (item.id)}
					<div
						class="item-color mb-1 cursor-pointer truncate rounded p-1 text-xs hover:opacity-80"
						style="background-color: {campaigns.find((c) => c.id === item.campaign_id)?.color ||
							'#e2e8f0'}"
						on:click|stopPropagation={() => openContentEditor(item)}
					>
						{item.content_text}
					</div>
				{/each}
				{#if dayContent.length > 3}
					<div
						class="cursor-pointer text-xs text-blue-600 hover:underline"
						on:click|stopPropagation={() => openAllContentModal(dayContent)}
					>
						+{dayContent.length - 3} more
					</div>
				{/if}
			{/if}
		</div>
	{/each}
</div>

<Modal bind:open={showEditModal} size="xl" autoclose={false} class="w-full">
	<h2 class="mb-4 text-2xl font-bold">Edit Content</h2>
	{#if selectedContent}
		<ContentEditor
			contentItem={selectedContent}
			{campaigns}
			{templates}
			on:contentUpdated={handleContentUpdate}
			on:cancel={closeEditModal}
		/>
	{/if}
</Modal>

<Modal bind:open={showCreateModal} size="xl" autoclose={false} class="w-full">
	<h2 class="mb-4 text-2xl font-bold">Create Content</h2>
	{#if selectedDate}
		<CreateContent
			{campaigns}
			{templates}
			initialDate={selectedDate}
			on:contentCreated={handleContentCreate}
			on:cancel={closeCreateModal}
		/>
	{/if}
</Modal>

<Modal bind:open={showAllContentModal} size="lg" autoclose={false} class="w-full">
	<h2 class="mb-4 text-2xl font-bold">
		All Content for {selectedDayContent[0]?.scheduled_date.split('T')[0]}
	</h2>
	<div class="space-y-2">
		{#each selectedDayContent as item (item.id)}
			<div
				class="item-color cursor-pointer rounded p-2 text-sm hover:opacity-80"
				style="background-color: {campaigns.find((c) => c.id === item.campaign_id)?.color ||
					'#e2e8f0'}"
				on:click={() => {
					openContentEditor(item);
					showAllContentModal = false;
				}}
			>
				<div class="font-bold">
					{new Date(item.scheduled_date).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</div>
				<div class="truncate">{item.content_text}</div>
			</div>
		{/each}
	</div>
</Modal>

<style>
	.item-color {
		color: white;
		mix-blend-mode: color-burn;
	}
</style>
