<!-- src/lib/components/marketing/Calendar.svelte -->
<script lang="ts">
	import ContentEditor from './ContentEditor.svelte';
	import CreateContent from './CreateContent.svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		contentItems,
		campaigns,
		templates,
		oncalendarUpdated
	}: {
		contentItems: ContentItem[];
		campaigns: Campaign[];
		templates: Template[];
		oncalendarUpdated?: () => void;
	} = $props();

	let currentDate = $state(new Date());
	let todayDate = $state(new Date());
	let selectedContent: ContentItem | null = $state(null);
	let showEditModal = $state(false);
	let showCreateModal = $state(false);
	let selectedCampaignId: string = $state('all');
	let showAllContentModal = $state(false);
	let selectedDayContent: ContentItem[] = $state([]);
	let selectedDate: Date | null = $state(null);
	let calendarDays: (Date | null)[] = $state([]);
	let isLoading = $state(false);
	let viewMode: 'month' | 'week' = $state('month');
	let weekStartDate: Date | null = $state(null);
	let searchTerm = $state('');

	const platformColors: Record<string, string> = {
		twitter: '#1DA1F2',
		facebook: '#4267B2',
		instagram: '#E1306C',
		linkedin: '#0077B5',
		tiktok: '#000000',
		default: '#6B7280'
	};

	function getPlatformIcon(platform: string) {
		const platforms: Record<string, string> = {
			twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>`,
			facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>`,
			instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>`,
			linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>`,
			tiktok: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/></svg>`
		};
		return platforms[platform.toLowerCase()] || '';
	}

	let filteredContentItems = $derived(
		contentItems.filter((item) => {
			const itemDate = new Date(item.scheduled_date);
			const isInCurrentMonthView =
				viewMode === 'month' &&
				itemDate.getFullYear() === currentDate.getFullYear() &&
				itemDate.getMonth() === currentDate.getMonth();

			let isInCurrentWeekView = false;
			if (viewMode === 'week' && weekStartDate) {
				const weekEndDate = new Date(weekStartDate);
				weekEndDate.setDate(weekEndDate.getDate() + 6);
				isInCurrentWeekView = itemDate >= weekStartDate && itemDate <= weekEndDate;
			}

			const matchesCampaign =
				selectedCampaignId === 'all' ||
				(selectedCampaignId === 'no-campaign' && !item.campaign_id) ||
				item.campaign_id === selectedCampaignId;

			const matchesSearch =
				searchTerm === '' ||
				item.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(item.content_hashtags &&
					item.content_hashtags.toLowerCase().includes(searchTerm.toLowerCase()));

			return (isInCurrentMonthView || isInCurrentWeekView) && matchesCampaign && matchesSearch;
		})
	);

	$effect(() => {
		currentDate;
		viewMode;
		updateCalendarDays();
	});

	function updateCalendarDays() {
		if (viewMode === 'month') {
			calendarDays = generateCalendarDays(currentDate);
		} else if (viewMode === 'week') {
			const firstDayOfWeek = new Date(currentDate);
			const day = firstDayOfWeek.getDay();
			firstDayOfWeek.setDate(firstDayOfWeek.getDate() - day);
			weekStartDate = firstDayOfWeek;

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

		for (let i = 0; i < firstDay.getDay(); i++) {
			days.push(null);
		}
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

	function handleContentUpdate(updatedContents: any) {
		if (Array.isArray(updatedContents)) {
			updatedContents.forEach(updateContentItem);
		} else {
			updateContentItem(updatedContents);
		}
		contentItems = [...contentItems];
		closeEditModal();
		oncalendarUpdated?.();
	}

	function updateContentItem(updatedContent: ContentItem) {
		const index = contentItems.findIndex((item) => item.id === updatedContent.id);
		if (index !== -1) {
			contentItems[index] = updatedContent;
		}
	}

	function handleContentCreate(newContent: any) {
		contentItems = [...contentItems, newContent];
		closeCreateModal();
		oncalendarUpdated?.();
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
		if (!campaignId) return 'var(--void-elevated)';
		const campaign = campaigns.find((c) => c.id === campaignId);
		return campaign?.color || 'var(--void-elevated)';
	}

	function getStatusClass(status: string | undefined): string {
		if (!status || status === 'draft') return 'status-draft';
		if (status === 'pending') return 'status-pending';
		if (status === 'published') return 'status-published';
		if (status === 'scheduled') return 'status-scheduled';
		return '';
	}

	function getFormattedDay(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			day: 'numeric'
		}).format(date);
	}

	onMount(() => {
		const handler = (event: Event) => handleContentUpdate((event as CustomEvent).detail);
		window.addEventListener('contentUpdated', handler);
		return () => window.removeEventListener('contentUpdated', handler);
	});
</script>

<div class="calendar-container">
	<!-- Calendar Header -->
	<div class="calendar-header">
		<div class="nav-controls">
			<button class="nav-btn" onclick={previousPeriod}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			{#if isLoading}
				<div class="nav-loading"><span class="spinner"></span></div>
			{:else}
				<button class="btn btn-secondary btn-sm" onclick={goToToday}>Today</button>
				<span class="period-label">
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

			<button class="nav-btn" onclick={nextPeriod}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<button class="btn btn-secondary btn-xs" onclick={toggleViewMode}>
				{viewMode === 'month' ? 'Week View' : 'Month View'}
			</button>
		</div>

		<div class="filter-controls">
			<select onchange={handleCampaignSelection} value={selectedCampaignId} class="filter-select">
				<option value="all">All Campaigns</option>
				<option value="no-campaign">No Campaign</option>
				{#each campaigns as campaign}
					<option value={campaign.id}>{campaign.name}</option>
				{/each}
			</select>

			<div class="search-wrapper">
				<svg
					class="search-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="8.5" cy="8.5" r="6" />
					<path d="m13 13 4 4" />
				</svg>
				<input type="search" bind:value={searchTerm} placeholder="Search..." class="search-input" />
			</div>
		</div>
	</div>

	<!-- Month View -->
	{#if viewMode === 'month'}
		<div class="month-grid-wrapper">
			<div class="month-grid">
				{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
					<div class="day-header">{day}</div>
				{/each}

				{#each calendarDays as day}
					<div
						class="day-cell"
						class:is-today={day && day.toDateString() === todayDate.toDateString()}
						class:is-empty={!day}
						class:is-active={!!day}
						role={day ? 'button' : undefined}
						tabindex={day ? 0 : -1}
						onclick={() => day && openCreateModal(day)}
						onkeydown={(event) => {
							if (!day) return;
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								openCreateModal(day);
							}
						}}
					>
						{#if day}
							<div
								class="day-number"
								class:today-number={day.toDateString() === todayDate.toDateString()}
							>
								{day.getDate()}
							</div>
							{@const dayContent = filteredContentItems
								.filter(
									(item) => new Date(item.scheduled_date).toDateString() === day.toDateString()
								)
								.sort(sortContentByDateTime)}
							<div class="day-content">
								{#each dayContent.slice(0, 3) as item (item.id)}
									<button
										transition:slide={{ duration: 150 }}
										class="content-chip"
										style="background-color: {getCampaignColor(item.campaign_id)}; color: white;"
										onclick={(e) => {
											e.stopPropagation();
											openContentEditor(item, e);
										}}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												openContentEditor(item, e);
											}
										}}
									>
										{#if item.platform}
											<span
												class="chip-icon"
												style="color: {platformColors[item.platform.toLowerCase()] ||
													platformColors.default};"
											>
												{@html getPlatformIcon(item.platform)}
											</span>
										{/if}
										<span class="chip-time">
											{new Date(item.scheduled_date).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
										<span class="chip-text">{item.content_text}</span>
									</button>
								{/each}
								{#if dayContent.length > 3}
									<button
										type="button"
										class="more-link"
										onclick={(e) => {
											e.stopPropagation();
											openAllContentModal(dayContent, e);
										}}
									>
										+{dayContent.length - 3} more
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- Week view -->
		<div class="week-view">
			{#each calendarDays as day}
				{@const dayContent = filteredContentItems
					.filter(
						(item) => day && new Date(item.scheduled_date).toDateString() === day.toDateString()
					)
					.sort(sortContentByDateTime)}

				{#if day}
					<div class="week-day">
						<div class="week-day-header">
							<span
								class="week-day-label"
								class:today-label={day.toDateString() === todayDate.toDateString()}
							>
								{getFormattedDay(day)}
							</span>
							{#if day.toDateString() === todayDate.toDateString()}
								<span class="today-badge">Today</span>
							{/if}
							<button
								class="btn btn-secondary btn-xs week-add-btn"
								onclick={() => openCreateModal(day)}
							>
								Add
							</button>
						</div>

						{#if dayContent.length > 0}
							<div class="week-day-content">
								{#each dayContent as item (item.id)}
									<button
										class="week-item"
										style="background-color: {getCampaignColor(item.campaign_id)}10;"
										onclick={() => openContentEditor(item)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												openContentEditor(item);
											}
										}}
									>
										<div class="week-item-time">
											<span class="time-bold">
												{new Date(item.scheduled_date).toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit'
												})}
											</span>
											{#if item.platform}
												<span
													style="color: {platformColors[item.platform.toLowerCase()] ||
														platformColors.default};"
												>
													{@html getPlatformIcon(item.platform)}
												</span>
											{/if}
										</div>
										<div class="week-item-content">
											<span>{item.content_text}</span>
											{#if item.content_hashtags}
												<span class="week-item-hashtags">{item.content_hashtags}</span>
											{/if}
										</div>
										<div class="week-item-meta">
											{#if item.status}
												<span class="status-badge-sm {getStatusClass(item.status)}"
													>{item.status}</span
												>
											{/if}
											{#if item.campaign_id}
												{@const camp = campaigns.find((c) => c.id === item.campaign_id)}
												{#if camp}
													<span
														class="campaign-pill"
														style="background-color: {camp.color}; color: white;">{camp.name}</span
													>
												{/if}
											{/if}
										</div>
									</button>
								{/each}
							</div>
						{:else}
							<div class="week-empty">No content scheduled for this day</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<!-- Edit Modal -->
{#if showEditModal}
	<div class="modal-overlay" onclick={closeEditModal} role="presentation">
		<div class="modal-dialog modal-xl" onclick={(e) => e.stopPropagation()} role="dialog">
			<h2 class="modal-title">Edit Content</h2>
			{#if selectedContent}
				<ContentEditor
					contentItem={selectedContent}
					{campaigns}
					{templates}
					oncontentUpdated={(data) => handleContentUpdate(data)}
					oncancel={closeEditModal}
				/>
			{/if}
		</div>
	</div>
{/if}

<!-- Create Modal -->
{#if showCreateModal}
	<div class="modal-overlay" onclick={closeCreateModal} role="presentation">
		<div class="modal-dialog modal-xl" onclick={(e) => e.stopPropagation()} role="dialog">
			<h2 class="modal-title">Create Content</h2>
			{#if selectedDate}
				<CreateContent
					{campaigns}
					{templates}
					initialDate={selectedDate}
					oncontentCreated={(data) => handleContentCreate(data)}
					oncancel={closeCreateModal}
				/>
			{/if}
		</div>
	</div>
{/if}

<!-- All Content Modal -->
{#if showAllContentModal}
	<div class="modal-overlay" onclick={() => (showAllContentModal = false)} role="presentation">
		<div class="modal-dialog modal-lg" onclick={(e) => e.stopPropagation()} role="dialog">
			<h2 class="modal-title">
				All Content for {selectedDayContent.length > 0
					? new Date(selectedDayContent[0].scheduled_date).toLocaleDateString()
					: ''}
			</h2>
			<div class="all-content-list">
				{#each selectedDayContent as item (item.id)}
					<button
						class="all-content-item"
						style="background-color: {getCampaignColor(item.campaign_id)}10;"
						onclick={() => {
							openContentEditor(item);
							showAllContentModal = false;
						}}
						onkeydown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								openContentEditor(item);
								showAllContentModal = false;
							}
						}}
					>
						<div class="all-content-time">
							<span class="time-bold">
								{new Date(item.scheduled_date).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit'
								})}
							</span>
							{#if item.platform}
								<span
									style="color: {platformColors[item.platform.toLowerCase()] ||
										platformColors.default};"
								>
									{@html getPlatformIcon(item.platform)}
									<span class="platform-text">{item.platform}</span>
								</span>
							{/if}
						</div>
						<div class="all-content-body">
							<span>{item.content_text}</span>
							{#if item.content_hashtags}
								<span class="hashtags-text">{item.content_hashtags}</span>
							{/if}
						</div>
						<div class="all-content-meta">
							{#if item.status}
								<span class="status-badge-sm {getStatusClass(item.status)}">{item.status}</span>
							{/if}
							{#if item.campaign_id}
								{@const camp = campaigns.find((c) => c.id === item.campaign_id)}
								{#if camp}
									<span class="campaign-pill" style="background-color: {camp.color}; color: white;"
										>{camp.name}</span
									>
								{/if}
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.calendar-container {
		margin-bottom: 2rem;
	}

	/* Header */
	.calendar-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.nav-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		border: 1px solid var(--void-elevated);
		background: var(--void-surface);
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.nav-btn:hover {
		background: var(--void-elevated);
	}

	.nav-loading {
		padding: 0 0.75rem;
	}

	.period-label {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.filter-controls {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.filter-select {
		padding: 0.375rem 2rem 0.375rem 0.75rem;
		font-size: 0.8125rem;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
		color: var(--text-primary);
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		min-width: 160px;
	}

	.search-wrapper {
		position: relative;
		min-width: 160px;
	}

	.search-icon {
		position: absolute;
		left: 0.625rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.375rem 0.75rem 0.375rem 2rem;
		font-size: 0.8125rem;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
		color: var(--text-primary);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
	}

	.btn-xs {
		padding: 0.25rem 0.5rem;
		font-size: 0.6875rem;
	}

	.btn-secondary {
		background: var(--void-elevated);
		color: var(--text-primary);
		font-weight: 600;
	}

	.btn-secondary:hover {
		background: var(--void-highlight);
	}

	/* Spinner */
	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid var(--void-elevated);
		border-top-color: var(--shadow-monarch);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Month Grid */
	.month-grid-wrapper {
		overflow-x: auto;
	}

	.month-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
		min-width: 46rem;
	}

	.day-header {
		padding: 0.5rem;
		text-align: center;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.day-cell {
		position: relative;
		min-height: 8rem;
		overflow: hidden;
		border-radius: 8px;
		border: 1px solid var(--void-elevated);
		padding: 0.5rem;
		background: var(--void-surface);
		transition: all 0.2s ease;
	}

	.day-cell.is-active {
		cursor: pointer;
	}

	.day-cell.is-active:hover {
		border-color: var(--shadow-monarch);
	}

	.day-cell.is-today {
		border-color: rgba(59, 130, 246, 0.4);
		background: rgba(59, 130, 246, 0.05);
	}

	.day-cell.is-empty {
		background: var(--void-deep);
	}

	.day-number {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}

	.today-number {
		color: #60a5fa;
	}

	.day-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.content-chip {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 2px 4px;
		border-radius: 4px;
		font-size: 0.625rem;
		cursor: pointer;
		border: none;
		text-align: left;
		width: 100%;
		transition: box-shadow 0.15s ease;
	}

	.content-chip:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.chip-icon {
		flex-shrink: 0;
	}

	.chip-time {
		flex-shrink: 0;
		font-size: 0.625rem;
		opacity: 0.8;
	}

	.chip-text {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.more-link {
		padding: 0.25rem 0;
		text-align: center;
		font-size: 0.75rem;
		color: var(--shadow-monarch);
		background: none;
		border: none;
		cursor: pointer;
	}

	.more-link:hover {
		text-decoration: underline;
	}

	/* Week View */
	.week-view {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 36rem;
	}

	.week-day {
		display: flex;
		flex-direction: column;
	}

	.week-day-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.week-day-label {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.today-label {
		color: #60a5fa;
	}

	.today-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 9999px;
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
	}

	.week-add-btn {
		margin-left: auto;
	}

	.week-day-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid var(--void-elevated);
		background: var(--void-surface);
	}

	.week-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		border-radius: 8px;
		cursor: pointer;
		border: none;
		text-align: left;
		width: 100%;
		transition: box-shadow 0.15s ease;
	}

	.week-item:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.week-item-time {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
		padding-right: 0.75rem;
		border-right: 1px solid var(--void-elevated);
	}

	.time-bold {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.week-item-content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		font-size: 0.875rem;
		color: var(--text-primary);
	}

	.week-item-hashtags {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	.week-item-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	.status-badge-sm {
		display: inline-block;
		padding: 0.125rem 0.375rem;
		font-size: 0.625rem;
		font-weight: 600;
		border-radius: 9999px;
		text-transform: capitalize;
	}

	.status-scheduled {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
	}

	.status-published {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
	}

	.status-pending {
		background: rgba(234, 179, 8, 0.15);
		color: #facc15;
	}

	.status-draft {
		background: var(--void-elevated);
		color: var(--text-secondary);
	}

	.campaign-pill {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		border-radius: 9999px;
		margin-top: 0.25rem;
	}

	.week-empty {
		padding: 1rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--text-secondary);
		border: 1px dashed var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
	}

	/* Modals */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		padding: 1rem;
	}

	.modal-dialog {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 1.5rem;
		width: 90%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-xl {
		max-width: 800px;
	}

	.modal-lg {
		max-width: 640px;
	}

	.modal-title {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.all-content-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.all-content-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		border-radius: 8px;
		cursor: pointer;
		border: none;
		text-align: left;
		width: 100%;
		font-size: 0.875rem;
		transition: opacity 0.15s ease;
	}

	.all-content-item:hover {
		opacity: 0.9;
	}

	.all-content-time {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
	}

	.platform-text {
		font-size: 0.75rem;
		margin-left: 0.25rem;
	}

	.all-content-body {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		color: var(--text-primary);
	}

	.hashtags-text {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	.all-content-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.calendar-header {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-controls {
			flex-direction: column;
			width: 100%;
		}

		.filter-select,
		.search-wrapper {
			width: 100%;
		}
	}
</style>
