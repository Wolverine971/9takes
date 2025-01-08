<script lang="ts">
	import { Button, Card, Modal, Select } from 'flowbite-svelte';
	import ContentEditor from './ContentEditor.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let contentItems: ContentItem[];
	export let campaigns: Campaign[];
	export let templates: Template[];

	let currentDate = new Date();
	let todayDate = new Date();
	let selectedContent: ContentItem | null = null;
	let showEditModal = false;
	let showCreateModal = false;
	let selectedCampaignId: string = 'all';
	let showAllContentModal = false;
	let selectedDayContent: ContentItem[] = [];
	let selectedDate: Date | null = null;
	let calendarDays: (Date | null)[] = [];

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

	$: {
		currentDate;
		calendarDays = generateCalendarDays(currentDate);
	}

	function generateCalendarDays(date: Date): (Date | null)[] {
		const days: (Date | null)[] = [];
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
			updatedContents.forEach(updateContentItem);
		} else {
			updateContentItem(updatedContents);
		}
		contentItems = [...contentItems];
		closeEditModal();
		dispatch('calendarUpdated');
	}

	function updateContentItem(updatedContent: ContentItem) {
		const index = contentItems.findIndex((item) => item.id === updatedContent.id);
		if (index !== -1) {
			contentItems[index] = updatedContent;
		}
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

	function sortContentByDateTime(a: ContentItem, b: ContentItem) {
		return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
	}

	onMount(() => {
		window.addEventListener('contentUpdated', handleContentUpdate);
		return () => {
			window.removeEventListener('contentUpdated', handleContentUpdate);
		};
	});
</script>

<div class="container mx-auto px-4 py-8">
	<div
		class="mb-6 flex flex-col items-center justify-between gap-2 space-y-4 sm:flex-row sm:space-y-0"
	>
		<div class="flex items-center space-x-4">
			<Button on:click={previousMonth} class="px-3 py-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</Button>
			<span class="text-xl font-bold">
				{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
			</span>
			<Button on:click={nextMonth} class="px-3 py-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</Button>
		</div>
		<div class="w-full sm:w-64">
			<Select on:change={handleCampaignSelection} value={selectedCampaignId} class="w-full">
				<option value="all">All Campaigns</option>
				<option value="no-campaign">No Campaign</option>
				{#each campaigns as campaign}
					<option value={campaign.id}>{campaign.name}</option>
				{/each}
			</Select>
		</div>
	</div>

	<div class="grid grid-cols-7 gap-1 sm:gap-2">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
			<div class="p-1 text-center text-xs font-bold sm:text-sm md:text-base">{day}</div>
		{/each}

		{#each calendarDays as day}
			<div
				class="h-24 overflow-hidden rounded-lg border p-1 sm:h-32 sm:p-2 md:h-32 {day &&
				day.toDateString() === todayDate.toDateString()
					? 'bg-blue-100 dark:bg-blue-900'
					: ''}"
				on:click={() => day && openCreateModal(day)}
			>
				{#if day}
					<div
						class="mb-1 text-xs font-bold sm:text-sm {day.toDateString() ===
						todayDate.toDateString()
							? 'text-blue-600 dark:text-blue-300'
							: ''}"
					>
						{day.getDate()}
					</div>
					{@const dayContent = filteredContentItems
						.filter((item) => new Date(item.scheduled_date).toDateString() === day.toDateString())
						.sort(sortContentByDateTime)}
					<div class="space-y-1">
						{#each dayContent.slice(0, 2) as item (item.id)}
							<div
								class="item-color cursor-pointer truncate rounded p-1 text-xs hover:opacity-80"
								style="background-color: {campaigns.find((c) => c.id === item.campaign_id)?.color ||
									'#e2e8f0'}"
								on:click|stopPropagation={() => openContentEditor(item)}
							>
								{item.content_text}
							</div>
						{/each}
						{#if dayContent.length > 2}
							<div
								class="cursor-pointer text-xs text-primary-600 hover:underline"
								on:click|stopPropagation={() => openAllContentModal(dayContent)}
							>
								+{dayContent.length - 2} more
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<Modal bind:open={showEditModal} size="xl" autoclose={false} class="w-full">
	<h2 class="mb-4 mt-0 pb-0 pt-0 text-2xl font-bold">Edit Content</h2>
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
				role="button"
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
