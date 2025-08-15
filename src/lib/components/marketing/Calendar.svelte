<!-- lib/components/marketing/Calendar.svelte -->
<script lang="ts">
	import { Button, Card, Modal, Select, Tooltip, Badge, Spinner } from 'flowbite-svelte';
	import ContentEditor from './ContentEditor.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

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
	let isLoading = false;
	let viewMode: 'month' | 'week' = 'month';
	let weekStartDate: Date | null = null;
	let searchTerm = '';

	// Define platform colors for visual distinction
	const platformColors = {
		twitter: '#1DA1F2',
		facebook: '#4267B2',
		instagram: '#E1306C',
		linkedin: '#0077B5',
		tiktok: '#000000',
		default: '#6B7280'
	};

	// Get platform icon
	function getPlatformIcon(platform: string) {
		const platforms: Record<string, string> = {
			twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
						</svg>`,
			facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
						</svg>`,
			instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
						</svg>`,
			linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
						</svg>`,
			tiktok: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/>
						</svg>`
		};

		return platforms[platform.toLowerCase()] || '';
	}

	// This will filter content based on current view, campaign selection, and search term
	$: filteredContentItems = contentItems.filter((item) => {
		const itemDate = new Date(item.scheduled_date);

		// Month view filter
		const isInCurrentMonthView =
			viewMode === 'month' &&
			itemDate.getFullYear() === currentDate.getFullYear() &&
			itemDate.getMonth() === currentDate.getMonth();

		// Week view filter
		let isInCurrentWeekView = false;
		if (viewMode === 'week' && weekStartDate) {
			const weekEndDate = new Date(weekStartDate);
			weekEndDate.setDate(weekEndDate.getDate() + 6);
			isInCurrentWeekView = itemDate >= weekStartDate && itemDate <= weekEndDate;
		}

		// Campaign filter
		const matchesCampaign =
			selectedCampaignId === 'all' ||
			(selectedCampaignId === 'no-campaign' && !item.campaign_id) ||
			item.campaign_id === selectedCampaignId;

		// Search term filter
		const matchesSearch =
			searchTerm === '' ||
			item.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(item.content_hashtags &&
				item.content_hashtags.toLowerCase().includes(searchTerm.toLowerCase()));

		return (isInCurrentMonthView || isInCurrentWeekView) && matchesCampaign && matchesSearch;
	});

	// Update calendar days when current date or view mode changes
	$: {
		currentDate;
		viewMode;
		updateCalendarDays();
	}

	function updateCalendarDays() {
		if (viewMode === 'month') {
			calendarDays = generateCalendarDays(currentDate);
		} else if (viewMode === 'week') {
			// Set week start date to the Sunday of the current week
			const firstDayOfWeek = new Date(currentDate);
			const day = firstDayOfWeek.getDay();
			firstDayOfWeek.setDate(firstDayOfWeek.getDate() - day);
			weekStartDate = firstDayOfWeek;

			// Generate week days
			calendarDays = [];
			for (let i = 0; i < 7; i++) {
				const date = new Date(firstDayOfWeek);
				date.setDate(date.getDate() + i);
				calendarDays.push(date);
			}
		}
	}

	function generateCalendarDays(date: Date): (Date | null)[] {
		const days: (Date | null)[] = [];
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

		// Fill in empty days at the beginning
		for (let i = 0; i < firstDay.getDay(); i++) {
			days.push(null);
		}

		// Fill in actual days of the month
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(date.getFullYear(), date.getMonth(), i));
		}

		return days;
	}

	function toggleViewMode() {
		viewMode = viewMode === 'month' ? 'week' : 'month';
	}

	function previousPeriod() {
		isLoading = true;
		setTimeout(() => {
			if (viewMode === 'month') {
				currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
			} else {
				const newDate = new Date(currentDate);
				newDate.setDate(newDate.getDate() - 7);
				currentDate = newDate;
			}
			isLoading = false;
		}, 300);
	}

	function nextPeriod() {
		isLoading = true;
		setTimeout(() => {
			if (viewMode === 'month') {
				currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
			} else {
				const newDate = new Date(currentDate);
				newDate.setDate(newDate.getDate() + 7);
				currentDate = newDate;
			}
			isLoading = false;
		}, 300);
	}

	function goToToday() {
		isLoading = true;
		setTimeout(() => {
			currentDate = new Date();
			isLoading = false;
		}, 300);
	}

	function openContentEditor(content: ContentItem, event?: Event) {
		if (event) event.stopPropagation();
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

	function openAllContentModal(dayContent: ContentItem[], event?: Event) {
		if (event) event.stopPropagation();
		selectedDayContent = dayContent;
		showAllContentModal = true;
	}

	function sortContentByDateTime(a: ContentItem, b: ContentItem) {
		return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
	}

	function getCampaignColor(campaignId: string | null | undefined) {
		if (!campaignId) return '#e2e8f0';
		const campaign = campaigns.find((c) => c.id === campaignId);
		return campaign?.color || '#e2e8f0';
	}

	function getContentStatusClass(status: string | undefined) {
		if (!status || status === 'draft') return 'bg-gray-200 dark:bg-gray-700';
		if (status === 'pending') return 'bg-yellow-100 dark:bg-yellow-900';
		if (status === 'published') return 'bg-green-100 dark:bg-green-900';
		if (status === 'scheduled') return 'bg-blue-100 dark:bg-blue-900';
		return '';
	}

	function getFormattedDay(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			day: 'numeric'
		}).format(date);
	}

	onMount(() => {
		window.addEventListener('contentUpdated', (event: Event) =>
			handleContentUpdate(event as CustomEvent)
		);
		return () => {
			window.removeEventListener('contentUpdated', (event: Event) =>
				handleContentUpdate(event as CustomEvent)
			);
		};
	});
</script>

<div class="mb-8">
	<div class="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
		<div class="flex items-center space-x-2">
			<Button on:click={previousPeriod} size="sm" class="px-3">
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

			{#if isLoading}
				<div class="px-3">
					<Spinner size="4" />
				</div>
			{:else}
				<Button on:click={goToToday} size="sm" color="alternative" class="font-bold">Today</Button>
				<span class="text-lg font-bold">
					{#if viewMode === 'month'}
						{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
					{:else if viewMode === 'week' && weekStartDate}
						{weekStartDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })} -
						{new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString(
							'default',
							{ month: 'short', day: 'numeric', year: 'numeric' }
						)}
					{/if}
				</span>
			{/if}

			<Button on:click={nextPeriod} size="sm" class="px-3">
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

			<Button
				on:click={toggleViewMode}
				size="xs"
				color="alternative"
				class="sm:size-sm ml-2 px-2 py-1.5 sm:px-3 sm:py-2"
			>
				<span class="hidden sm:inline">{viewMode === 'month' ? 'Week View' : 'Month View'}</span>
				<span class="sm:hidden">{viewMode === 'month' ? 'Week' : 'Month'}</span>
			</Button>
		</div>

		<div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
			<div class="w-full sm:w-64">
				<Select
					on:change={handleCampaignSelection}
					value={selectedCampaignId}
					class="w-full text-xs sm:text-sm"
					size="sm"
				>
					<option value="all">All Campaigns</option>
					<option value="no-campaign">No Campaign</option>
					{#each campaigns as campaign}
						<option value={campaign.id}>{campaign.name}</option>
					{/each}
				</Select>
			</div>

			<div class="relative w-full sm:w-64">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
					<svg
						class="h-3 w-3 text-gray-500 sm:h-4 sm:w-4 dark:text-gray-400"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
				</div>
				<input
					type="search"
					bind:value={searchTerm}
					placeholder="Search..."
					class="w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 pl-8 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:p-2 sm:pl-10 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				/>
			</div>
		</div>
	</div>

	<!-- Month View -->
	{#if viewMode === 'month'}
		<div class="grid grid-cols-7 gap-1 sm:gap-2">
			{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
				<div class="p-1 text-center text-xs font-bold sm:text-sm md:text-base">{day}</div>
			{/each}

			{#each calendarDays as day}
				<div
					class="relative min-h-32 overflow-hidden rounded-lg border transition-all duration-200 {day
						? 'cursor-pointer hover:border-blue-400'
						: ''} p-1 sm:p-2 {day && day.toDateString() === todayDate.toDateString()
						? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
						: day
							? 'bg-white dark:bg-gray-800'
							: 'bg-gray-50 dark:bg-gray-900'}"
					on:click={() => day && openCreateModal(day)}
				>
					{#if day}
						<div
							class="mb-1 text-xs font-semibold sm:text-sm {day.toDateString() ===
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
							{#each dayContent.slice(0, 3) as item (item.id)}
								<div
									transition:slide={{ duration: 150 }}
									class="group flex cursor-pointer items-center overflow-hidden rounded p-0.5 text-[10px] hover:shadow-md sm:p-1 sm:text-xs dark:text-white"
									style="background-color: {getCampaignColor(item.campaign_id)}; color: white;"
									on:click|stopPropagation={(e) => openContentEditor(item, e)}
								>
									<!-- Platform icon -->
									{#if item.platform}
										<div
											class="mr-1 flex-shrink-0"
											style="color: {platformColors[item.platform.toLowerCase()] ||
												platformColors.default};"
										>
											{@html getPlatformIcon(item.platform)}
										</div>
									{/if}

									<!-- Time -->
									<div class="mr-1 text-xs opacity-80">
										{new Date(item.scheduled_date).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</div>

									<!-- Content text with truncation -->
									<div class="flex-grow truncate">
										{item.content_text}
									</div>

									<!-- Status indicator -->
									{#if item.status}
										<div class="ml-1 flex-shrink-0">
											<Badge
												color={item.status === 'published'
													? 'green'
													: item.status === 'scheduled'
														? 'blue'
														: item.status === 'pending'
															? 'yellow'
															: 'gray'}
												size="xs"
											>
												{item.status}
											</Badge>
										</div>
									{/if}
								</div>
							{/each}
							{#if dayContent.length > 3}
								<div
									class="cursor-pointer py-1 text-center text-xs text-primary-600 hover:underline dark:text-primary-400"
									on:click|stopPropagation={(e) => openAllContentModal(dayContent, e)}
								>
									+{dayContent.length - 3} more
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Week view -->
		<div class="flex flex-col space-y-2">
			{#each calendarDays as day}
				{@const dayContent = filteredContentItems
					.filter((item) => new Date(item.scheduled_date).toDateString() === day.toDateString())
					.sort(sortContentByDateTime)}

				<div class="flex flex-col">
					<div class="mb-2 flex items-center">
						<div
							class="text-sm font-bold {day.toDateString() === todayDate.toDateString()
								? 'text-blue-600 dark:text-blue-300'
								: ''}"
						>
							{getFormattedDay(day)}
						</div>

						{#if day.toDateString() === todayDate.toDateString()}
							<Badge color="blue" class="ml-2">Today</Badge>
						{/if}

						<Button
							size="xs"
							color="alternative"
							class="ml-auto"
							on:click={() => openCreateModal(day)}
						>
							Add
						</Button>
					</div>

					{#if dayContent.length > 0}
						<div class="space-y-2 rounded-lg border bg-white p-2 dark:bg-gray-800">
							{#each dayContent as item (item.id)}
								<div
									class="flex cursor-pointer items-center rounded-lg p-2 transition-all hover:shadow-md"
									style="background-color: {getCampaignColor(item.campaign_id)}15;"
									on:click={() => openContentEditor(item)}
								>
									<!-- Left side: time and platform -->
									<div class="mr-3 flex flex-col items-center border-r pr-3">
										<div class="text-sm font-bold">
											{new Date(item.scheduled_date).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</div>

										{#if item.platform}
											<div
												style="color: {platformColors[item.platform.toLowerCase()] ||
													platformColors.default};"
											>
												{@html getPlatformIcon(item.platform)}
											</div>
										{/if}
									</div>

									<!-- Middle: content text -->
									<div class="flex-grow">
										<div class="text-sm">
											{item.content_text}
										</div>

										{#if item.content_hashtags}
											<div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
												{item.content_hashtags}
											</div>
										{/if}
									</div>

									<!-- Right side: status and campaign badge -->
									<div class="ml-2 flex flex-col items-end">
										{#if item.status}
											<Badge
												color={item.status === 'published'
													? 'green'
													: item.status === 'scheduled'
														? 'blue'
														: item.status === 'pending'
															? 'yellow'
															: 'gray'}
												size="sm"
											>
												{item.status}
											</Badge>
										{/if}

										{#if item.campaign_id}
											{@const campaign = campaigns.find((c) => c.id === item.campaign_id)}
											{#if campaign}
												<div
													class="mt-1 rounded-full px-2 py-1 text-xs"
													style="background-color: {campaign.color}; color: white;"
												>
													{campaign.name}
												</div>
											{/if}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div
							class="rounded-lg border border-dashed bg-gray-50 p-4 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400"
						>
							No content scheduled for this day
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
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
		All Content for {selectedDayContent.length > 0
			? new Date(selectedDayContent[0].scheduled_date).toLocaleDateString()
			: ''}
	</h2>
	<div class="space-y-2">
		{#each selectedDayContent as item (item.id)}
			<div
				class="flex cursor-pointer items-center rounded p-3 text-sm transition-all hover:opacity-90"
				style="background-color: {getCampaignColor(item.campaign_id)}15;"
				role="button"
				on:click={() => {
					openContentEditor(item);
					showAllContentModal = false;
				}}
			>
				<div class="mr-3 flex-shrink-0">
					<div class="font-bold">
						{new Date(item.scheduled_date).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}
					</div>

					{#if item.platform}
						<div
							class="mt-1 inline-block"
							style="color: {platformColors[item.platform.toLowerCase()] ||
								platformColors.default};"
						>
							{@html getPlatformIcon(item.platform)}
							<span class="ml-1 text-xs">{item.platform}</span>
						</div>
					{/if}
				</div>

				<div class="flex-grow">
					<div>{item.content_text}</div>

					{#if item.content_hashtags}
						<div class="mt-1 text-xs text-gray-600 dark:text-gray-400">
							{item.content_hashtags}
						</div>
					{/if}
				</div>

				<div class="ml-2 flex-shrink-0">
					{#if item.status}
						<Badge
							color={item.status === 'published'
								? 'green'
								: item.status === 'scheduled'
									? 'blue'
									: item.status === 'pending'
										? 'yellow'
										: 'gray'}
						>
							{item.status}
						</Badge>
					{/if}

					{#if item.campaign_id}
						{@const campaign = campaigns.find((c) => c.id === item.campaign_id)}
						{#if campaign}
							<div
								class="mt-2 rounded-full px-2 py-1 text-center text-xs"
								style="background-color: {campaign.color}; color: white;"
							>
								{campaign.name}
							</div>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</Modal>

<style>
	/* Calendar container */
	.calendar-container {
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
	}

	/* Custom styling for content items */
	:global(.item-color) {
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	/* Platform icon styling on mobile */
	@media (max-width: 640px) {
		:global(.calendar-container svg) {
			width: 10px !important;
			height: 10px !important;
		}
	}

	/* Small mobile optimizations (below 480px) */
	@media (max-width: 480px) {
		/* Calendar grid adjustments */
		:global(.calendar-container .grid) {
			min-width: 280px;
		}

		/* Reduce all button sizes in calendar */
		:global(.calendar-container button) {
			padding: 0.25rem 0.5rem !important;
			font-size: 0.75rem !important;
		}

		/* Select and input adjustments */
		:global(.calendar-container select),
		:global(.calendar-container input) {
			font-size: 0.75rem !important;
			padding: 0.375rem 0.5rem !important;
		}

		/* Badge adjustments */
		:global(.calendar-container .badge) {
			padding: 0 0.25rem !important;
			font-size: 0.625rem !important;
		}

		:global(.modal-body) {
			padding: 0.5rem !important;
		}

		:global(.modal-header) {
			padding: 0.5rem !important;
		}

		/* Make modals full screen on very small devices */
		:global(.modal) {
			max-width: 100% !important;
			margin: 0 !important;
			min-height: 100vh;
		}

		/* Reduce spacing on mobile */
		:global(.flowbite-modal) {
			padding: 0 !important;
		}

		/* Hide status badges on very small screens to save space */
		:global(.calendar-container .group .badge) {
			display: none !important;
		}
	}

	/* Mobile optimizations */
	@media (max-width: 640px) {
		:global(.modal-body) {
			padding: 0.75rem !important;
		}

		:global(.modal-header) {
			padding: 0.75rem !important;
		}

		/* Adjust button sizes */
		:global(.btn-sm) {
			padding: 0.25rem 0.5rem !important;
			font-size: 0.75rem !important;
		}
	}
</style>
