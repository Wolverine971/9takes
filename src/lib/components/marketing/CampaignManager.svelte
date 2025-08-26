<!-- src/lib/components/marketing/CampaignManager.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import {
		Button,
		Card,
		Input,
		Label,
		Textarea,
		AccordionItem,
		Accordion,
		Badge,
		Spinner,
		Select,
		Tabs,
		TabItem,
		Alert,
		Tooltip
	} from 'flowbite-svelte';
	import type { Campaign } from '$lib/types/marketing';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	export let campaigns: Campaign[];

	const dispatch = createEventDispatcher();

	let editingCampaign: Partial<Campaign> | null = null;
	let originalStartDate: string | null = null;
	let isSubmitting = false;
	let formError = '';
	let formSuccess = '';
	let showFormSuccess = false;
	let campaignFilter = 'all';
	let searchTerm = '';
	let activeTab: 'create' | 'list' = 'list';
	let campaignTemplates = [
		{
			name: 'Product Launch',
			description: 'Campaign for launching a new product or feature',
			target_audience: 'Existing customers, potential customers interested in our industry',
			themes_and_topics: 'Product features, benefits, use cases',
			target_hashtags: '#productlaunch #newproduct #innovation',
			campaign_hashtags: '#OurNewProduct #ProductLaunch',
			campaign_promotion_accounts: '@ourcompany @industryinfluencers'
		},
		{
			name: 'Seasonal Promotion',
			description: 'Special offers and content for seasonal events',
			target_audience: 'Existing and potential customers interested in seasonal offers',
			themes_and_topics: 'Season-specific benefits, limited-time offers, holiday themes',
			target_hashtags: '#seasonal #holiday #specialoffer',
			campaign_hashtags: '#SeasonalSale #LimitedTimeOffer',
			campaign_promotion_accounts: '@ourcompany @seasonalpartners'
		},
		{
			name: 'Educational Series',
			description: 'Educational content to position as thought leaders',
			target_audience: 'Industry professionals, potential customers seeking knowledge',
			themes_and_topics: 'Best practices, industry trends, how-to guides',
			target_hashtags: '#education #learning #bestpractices',
			campaign_hashtags: '#LearnWithUs #IndustryInsights',
			campaign_promotion_accounts: '@ourexperts @industryassociations'
		}
	];

	// Sort campaigns by start date (most recent first)
	$: sortedCampaigns = [...campaigns].sort(
		(a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
	);

	// Filter campaigns based on status and search term
	$: filteredCampaigns = sortedCampaigns.filter((campaign) => {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		const endDate = new Date(campaign.end_date);

		const isActive = startDate <= today && endDate >= today;
		const isUpcoming = startDate > today;
		const isPast = endDate < today;

		const matchesFilter =
			campaignFilter === 'all' ||
			(campaignFilter === 'active' && isActive) ||
			(campaignFilter === 'upcoming' && isUpcoming) ||
			(campaignFilter === 'past' && isPast);

		const matchesSearch =
			searchTerm === '' ||
			campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(campaign.description &&
				campaign.description.toLowerCase().includes(searchTerm.toLowerCase()));

		return matchesFilter && matchesSearch;
	});

	// New campaign form data with default values
	let newCampaign = {
		name: '',
		description: '',
		start_date: '',
		end_date: '',
		color: '#3b82f6', // Default blue color
		target_audience: '',
		themes_and_topics: '',
		target_hashtags: '',
		campaign_hashtags: '',
		campaign_promotion_accounts: ''
	};

	// Apply template to new campaign form
	function applyTemplate(templateIndex: number) {
		const template = campaignTemplates[templateIndex];
		newCampaign = {
			...newCampaign,
			name: template.name,
			description: template.description,
			target_audience: template.target_audience,
			themes_and_topics: template.themes_and_topics,
			target_hashtags: template.target_hashtags,
			campaign_hashtags: template.campaign_hashtags,
			campaign_promotion_accounts: template.campaign_promotion_accounts
		};
	}

	function startEditing(campaign: Campaign) {
		editingCampaign = { ...campaign };
		originalStartDate = campaign.start_date;

		// Ensure we're scrolled to the editing form
		setTimeout(() => {
			const editForm = document.getElementById(`edit-form-${campaign.id}`);
			if (editForm) {
				editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	}

	function cancelEditing() {
		editingCampaign = null;
		originalStartDate = null;
	}

	function duplicateCampaign(campaign: Campaign) {
		// Pre-fill the new campaign form with data from the selected campaign
		newCampaign = {
			name: `${campaign.name} (Copy)`,
			description: campaign.description || '',
			start_date: '',
			end_date: '',
			color: campaign.color,
			target_audience: campaign.target_audience || '',
			themes_and_topics: campaign.themes_and_topics || '',
			target_hashtags: campaign.target_hashtags || '',
			campaign_hashtags: campaign.campaign_hashtags || '',
			campaign_promotion_accounts: campaign.campaign_promotion_accounts || ''
		};

		// Switch to create tab
		activeTab = 'create';

		// Scroll to the form
		setTimeout(() => {
			const createForm = document.getElementById('create-campaign-form');
			if (createForm) {
				createForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	}

	async function handleCampaignCreate(event: SubmitEvent) {
		event.preventDefault();

		// Reset messages
		formError = '';
		formSuccess = '';
		isSubmitting = true;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// Validate dates
			const startDate = new Date(formData.get('start_date') as string);
			const endDate = new Date(formData.get('end_date') as string);

			if (endDate < startDate) {
				formError = 'End date cannot be before start date';
				isSubmitting = false;
				return;
			}

			const result = await submitForm('?/createCampaign', formData);

			if (result.type === 'success') {
				campaigns = [...campaigns, result.data.campaign];
				await createPrimerContent(result.data.campaign);
				form.reset();

				// Reset form data
				newCampaign = {
					name: '',
					description: '',
					start_date: '',
					end_date: '',
					color: '#3b82f6',
					target_audience: '',
					themes_and_topics: '',
					target_hashtags: '',
					campaign_hashtags: '',
					campaign_promotion_accounts: ''
				};

				formSuccess = `Campaign "${result.data.campaign.name}" created successfully!`;
				showFormSuccess = true;
				setTimeout(() => {
					showFormSuccess = false;
				}, 5000);

				// Switch to list tab
				activeTab = 'list';
			} else {
				formError = 'Failed to create campaign. Please try again.';
			}
		} catch (error) {
			console.error('Error creating campaign:', error);
			formError = 'An unexpected error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleCampaignUpdate(event: SubmitEvent) {
		event.preventDefault();

		// Reset messages
		formError = '';
		isSubmitting = true;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// Validate dates
			const startDate = new Date(formData.get('start_date') as string);
			const endDate = new Date(formData.get('end_date') as string);

			if (endDate < startDate) {
				formError = 'End date cannot be before start date';
				isSubmitting = false;
				return;
			}

			const result = await submitForm('?/updateCampaign', formData);

			if (result.type === 'success') {
				const updatedCampaign = result.data.campaign;
				const index = campaigns.findIndex((c) => c.id === updatedCampaign.id);
				if (index !== -1) {
					campaigns[index] = updatedCampaign;
					campaigns = [...campaigns];
				}

				if (originalStartDate && updatedCampaign.start_date !== originalStartDate) {
					await updateAssociatedContent(
						updatedCampaign.id,
						originalStartDate,
						updatedCampaign.start_date
					);
				}

				formSuccess = `Campaign "${updatedCampaign.name}" updated successfully!`;
				showFormSuccess = true;
				setTimeout(() => {
					showFormSuccess = false;
				}, 5000);

				cancelEditing();
			} else {
				formError = 'Failed to update campaign. Please try again.';
			}
		} catch (error) {
			console.error('Error updating campaign:', error);
			formError = 'An unexpected error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	async function createPrimerContent(campaign: Campaign) {
		const formData = new FormData();
		formData.append('campaign_id', campaign.id);
		formData.append(
			'content_text',
			`PRIME the audience! What do they need to do? We're launching our ${campaign.name} campaign. Be on the lookout over the next few weeks. #${campaign.name.replace(/\s+/g, '')}`
		);
		formData.append('scheduled_date', campaign.start_date);
		formData.append('platform', 'twitter');
		formData.append('status', 'scheduled');
		formData.append('content_promotion_accounts', '');
		formData.append('content_hashtags', `#${campaign.name.replace(/\s+/g, '')}`);
		formData.append('content_themes', campaign.themes_and_topics || '');

		const result = await submitForm('?/createContent', formData);

		if (result.type === 'success') {
			dispatch('contentCreated', result.data.content);
		}
	}

	async function updateAssociatedContent(
		campaignId: string,
		oldStartDate: string,
		newStartDate: string
	) {
		const formData = new FormData();
		formData.append('campaignId', campaignId);
		formData.append('oldStartDate', oldStartDate);
		formData.append('newStartDate', newStartDate);

		const result = await submitForm('?/updateCampaignContent', formData);

		if (result.type === 'success') {
			dispatch('contentUpdated', result.data.updatedContent);
		}
	}

	async function submitForm(url: string, formData: FormData) {
		const response = await fetch(url, {
			method: 'POST',
			body: formData
		});
		return deserialize(await response.text());
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}

	function getCampaignStatus(campaign: Campaign): { status: string; color: string } {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		const endDate = new Date(campaign.end_date);

		if (startDate <= today && endDate >= today) {
			return { status: 'Active', color: 'green' };
		} else if (startDate > today) {
			return { status: 'Upcoming', color: 'blue' };
		} else {
			return { status: 'Past', color: 'gray' };
		}
	}

	function getDaysRemaining(campaign: Campaign): { text: string; color: string } {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		const endDate = new Date(campaign.end_date);

		if (startDate > today) {
			const days = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
			return {
				text: `Starts in ${days} day${days !== 1 ? 's' : ''}`,
				color: 'blue'
			};
		} else if (endDate >= today) {
			const days = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
			return {
				text: `${days} day${days !== 1 ? 's' : ''} remaining`,
				color: days <= 3 ? 'red' : days <= 7 ? 'yellow' : 'green'
			};
		} else {
			const days = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
			return {
				text: `Ended ${days} day${days !== 1 ? 's' : ''} ago`,
				color: 'gray'
			};
		}
	}

	onMount(() => {
		// Set default dates for new campaign to start tomorrow and end 30 days later
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);

		const endDate = new Date(tomorrow);
		endDate.setDate(endDate.getDate() + 30);

		newCampaign.start_date = tomorrow.toISOString().split('T')[0];
		newCampaign.end_date = endDate.toISOString().split('T')[0];
	});
</script>

<div class="container mx-auto px-4 py-2">
	{#if showFormSuccess}
		<Alert color="green" dismissable class="my-4" transition={slide}>
			<span class="font-medium">Success!</span>
			{formSuccess}
		</Alert>
	{/if}

	{#if formError}
		<Alert color="red" dismissable class="my-4" transition={slide}>
			<span class="font-medium">Error!</span>
			{formError}
		</Alert>
	{/if}

	<Tabs style="full" class="mb-4" defaultClass="list-none">
		<TabItem open={activeTab === 'list' ? true : false} on:click={() => (activeTab = 'list')}>
			<div slot="title" class="flex items-center">
				<svg
					class="mr-2 h-5 w-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
					></path>
				</svg>
				Campaign List
				<Badge color="dark" rounded class="ml-2">{campaigns.length}</Badge>
			</div>

			<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex gap-2">
					<Select id="campaign-filter" bind:value={campaignFilter} size="sm" class="w-40">
						<option value="all">All Campaigns</option>
						<option value="active">Active</option>
						<option value="upcoming">Upcoming</option>
						<option value="past">Past</option>
					</Select>

					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								class="h-4 w-4 text-gray-500 dark:text-gray-400"
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
							placeholder="Search campaigns..."
							class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						/>
					</div>
				</div>

				<Button size="sm" color="blue" on:click={() => (activeTab = 'create')}>
					<svg
						class="mr-2 h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						></path>
					</svg>
					Create Campaign
				</Button>
			</div>

			{#if filteredCampaigns.length === 0}
				<div
					class="rounded-lg border border-dashed p-8 text-center text-gray-500 dark:text-gray-400"
				>
					{#if searchTerm || campaignFilter !== 'all'}
						<p>No campaigns match your filters. Try changing your search or filter criteria.</p>
						<Button
							color="alternative"
							size="xs"
							class="mt-4"
							on:click={() => {
								searchTerm = '';
								campaignFilter = 'all';
							}}
						>
							Clear Filters
						</Button>
					{:else}
						<p>No campaigns have been created yet.</p>
						<Button color="blue" size="sm" class="mt-4" on:click={() => (activeTab = 'create')}>
							Create Your First Campaign
						</Button>
					{/if}
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each filteredCampaigns as campaign (campaign.id)}
						<Card padding="sm" class="overflow-hidden hover:shadow-lg">
							<div class="h-3 w-full" style="background-color: {campaign.color};"></div>

							{#if editingCampaign && editingCampaign.id === campaign.id}
								<form
									on:submit={handleCampaignUpdate}
									class="space-y-4 p-4"
									id="edit-form-{campaign.id}"
									transition:slide
								>
									<input type="hidden" name="id" value={campaign.id} />

									<div class="mb-4 flex items-center justify-between">
										<h3 class="text-lg font-bold">Edit Campaign</h3>
										<Button size="xs" color="red" on:click={cancelEditing}>Cancel</Button>
									</div>

									<Label>
										<span>Name*</span>
										<Input
											type="text"
											name="name"
											bind:value={editingCampaign.name}
											required
											class="w-full"
											placeholder="Campaign Name"
										/>
									</Label>

									<Label>
										<span>Description</span>
										<Textarea
											name="description"
											bind:value={editingCampaign.description}
											class="w-full"
											placeholder="Campaign description"
											rows="3"
										/>
									</Label>

									<div class="grid grid-cols-2 gap-4">
										<Label>
											<span>Start Date*</span>
											<Input
												type="date"
												name="start_date"
												bind:value={editingCampaign.start_date}
												required
												class="w-full"
											/>
										</Label>
										<Label>
											<span>End Date*</span>
											<Input
												type="date"
												name="end_date"
												bind:value={editingCampaign.end_date}
												required
												class="w-full"
											/>
										</Label>
									</div>

									<Label>
										<span>Color*</span>
										<div class="flex items-center space-x-2">
											<Input
												type="color"
												name="color"
												bind:value={editingCampaign.color}
												required
												class="h-10"
											/>
											<div
												class="flex h-10 flex-grow items-center justify-center rounded border border-gray-300 text-sm font-medium"
												style="background-color: {editingCampaign.color}; color: white;"
											>
												{editingCampaign.color}
											</div>
										</div>
									</Label>

									<Accordion flush class="rounded border">
										<AccordionItem>
											<span slot="header" class="text-sm font-medium">Additional Details</span>
											<div class="space-y-4 px-2 py-4">
												<Label>
													<span>Target Audience</span>
													<Textarea
														name="target_audience"
														bind:value={editingCampaign.target_audience}
														class="w-full"
														placeholder="Who is this campaign targeting?"
														rows="2"
													/>
												</Label>

												<Label>
													<span>Themes and Topics</span>
													<Textarea
														name="themes_and_topics"
														bind:value={editingCampaign.themes_and_topics}
														class="w-full"
														placeholder="Key themes and topics for this campaign"
														rows="2"
													/>
												</Label>

												<Label>
													<span>Target Hashtags</span>
													<Input
														type="text"
														name="target_hashtags"
														bind:value={editingCampaign.target_hashtags}
														class="w-full"
														placeholder="#relevant #industry #hashtags"
													/>
												</Label>

												<Label>
													<span>Campaign Hashtags</span>
													<Input
														type="text"
														name="campaign_hashtags"
														bind:value={editingCampaign.campaign_hashtags}
														class="w-full"
														placeholder="#OurCampaign #UniqueTag"
													/>
												</Label>

												<Label>
													<span>Promotion Accounts</span>
													<Input
														type="text"
														name="campaign_promotion_accounts"
														bind:value={editingCampaign.campaign_promotion_accounts}
														class="w-full"
														placeholder="@ourcompany @influencer"
													/>
												</Label>
											</div>
										</AccordionItem>
									</Accordion>

									<Button type="submit" class="w-full" disabled={isSubmitting}>
										{#if isSubmitting}
											<Spinner size="4" class="mr-2" />
											Saving...
										{:else}
											Save Changes
										{/if}
									</Button>
								</form>
							{:else}
								<div class="p-4">
									<div class="mb-4 flex items-center justify-between">
										<h5 class="text-xl font-bold tracking-tight">{campaign.name}</h5>
										<div>
											<Badge color={getCampaignStatus(campaign).color}
												>{getCampaignStatus(campaign).status}</Badge
											>
										</div>
									</div>

									<div class="mb-4">
										{#if campaign.description}
											<p class="text-sm text-gray-700 dark:text-gray-400">
												{campaign.description.length > 100
													? `${campaign.description.substring(0, 100)}...`
													: campaign.description}
											</p>
										{:else}
											<p class="text-sm italic text-gray-500 dark:text-gray-500">
												No description provided
											</p>
										{/if}
									</div>

									<div class="mb-4 space-y-2">
										<div class="flex items-center text-sm">
											<span class="mr-2">📅</span>
											<span class="font-medium"
												>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span
											>
										</div>

										<div class="flex items-center">
											<Badge color={getDaysRemaining(campaign).color} class="w-full text-center">
												{getDaysRemaining(campaign).text}
											</Badge>
										</div>
									</div>

									{#if campaign.themes_and_topics}
										<div class="mb-4">
											<span class="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400"
												>Themes:</span
											>
											<div class="flex flex-wrap gap-1">
												{#each campaign.themes_and_topics.split(',').slice(0, 3) as theme}
													<div class="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
														{theme.trim()}
													</div>
												{/each}
												{#if campaign.themes_and_topics.split(',').length > 3}
													<Tooltip content={campaign.themes_and_topics}>
														<div
															class="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
														>
															+{campaign.themes_and_topics.split(',').length - 3} more
														</div>
													</Tooltip>
												{/if}
											</div>
										</div>
									{/if}

									{#if campaign.campaign_hashtags}
										<div class="mb-4">
											<span class="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400"
												>Campaign Hashtags:</span
											>
											<div class="text-sm text-blue-600 dark:text-blue-400">
												{campaign.campaign_hashtags}
											</div>
										</div>
									{/if}

									<div class="mt-4 flex flex-wrap gap-2">
										<Button size="xs" color="light" on:click={() => startEditing(campaign)}>
											<svg
												class="mr-1 h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												></path>
											</svg>
											Edit
										</Button>

										<Button size="xs" color="light" on:click={() => duplicateCampaign(campaign)}>
											<svg
												class="mr-1 h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												></path>
											</svg>
											Duplicate
										</Button>
									</div>
								</div>
							{/if}
						</Card>
					{/each}
				</div>
			{/if}
		</TabItem>

		<TabItem open={activeTab === 'create'} on:click={() => (activeTab = 'create')}>
			<div slot="title" class="flex items-center">
				<svg
					class="mr-2 h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					></path>
				</svg>
				Create Campaign
			</div>

			<Card id="create-campaign-form" padding="xl" class="mx-auto max-w-4xl">
				<h2 class="mb-6 border-b pb-4 text-xl font-bold">Create New Campaign</h2>

				<div class="mb-6">
					<h3 class="mb-2 text-sm font-medium">Start with a template:</h3>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
						{#each campaignTemplates as template, index}
							<Button
								color="light"
								size="sm"
								on:click={() => applyTemplate(index)}
								class="text-left"
							>
								<div class="flex items-center">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500"
									>
										{#if index === 0}
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M13 10V3L4 14h7v7l9-11h-7z"
												></path>
											</svg>
										{:else if index === 1}
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												></path>
											</svg>
										{:else}
											<svg
												class="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
												></path>
											</svg>
										{/if}
									</div>
									<div class="ml-3">
										<div class="text-sm font-medium">{template.name}</div>
										<div class="text-xs text-gray-500 dark:text-gray-400">
											{template.description}
										</div>
									</div>
								</div>
							</Button>
						{/each}
					</div>
				</div>

				<form on:submit={handleCampaignCreate} class="space-y-4">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<Label for="campaign-name" class="mb-2">Campaign Name*</Label>
							<Input
								id="campaign-name"
								type="text"
								name="name"
								bind:value={newCampaign.name}
								required
								placeholder="Enter campaign name"
							/>
						</div>

						<div>
							<Label for="campaign-color" class="mb-2">Color*</Label>
							<div class="flex items-center space-x-3">
								<Input
									id="campaign-color"
									type="color"
									name="color"
									bind:value={newCampaign.color}
									required
									class="h-10 w-14"
								/>
								<div
									class="flex h-10 flex-grow items-center justify-center rounded border border-gray-300 text-sm font-medium"
									style="background-color: {newCampaign.color}; color: white;"
								>
									{newCampaign.color}
								</div>
							</div>
						</div>
					</div>

					<div>
						<Label for="campaign-description" class="mb-2">Description</Label>
						<Textarea
							id="campaign-description"
							name="description"
							bind:value={newCampaign.description}
							placeholder="Enter campaign description"
							rows="3"
						/>
					</div>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<Label for="campaign-start-date" class="mb-2">Start Date*</Label>
							<Input
								id="campaign-start-date"
								type="date"
								name="start_date"
								bind:value={newCampaign.start_date}
								required
							/>
						</div>

						<div>
							<Label for="campaign-end-date" class="mb-2">End Date*</Label>
							<Input
								id="campaign-end-date"
								type="date"
								name="end_date"
								bind:value={newCampaign.end_date}
								required
							/>
						</div>
					</div>

					<Accordion flush class="rounded border">
						<AccordionItem>
							<span slot="header" class="text-sm font-medium">Additional Campaign Details</span>
							<div class="space-y-4 px-2 py-4">
								<div>
									<Label for="target-audience" class="mb-2">Target Audience</Label>
									<Textarea
										id="target-audience"
										name="target_audience"
										bind:value={newCampaign.target_audience}
										placeholder="Who is this campaign targeting?"
										rows="2"
									/>
								</div>

								<div>
									<Label for="themes-topics" class="mb-2">Themes and Topics</Label>
									<Textarea
										id="themes-topics"
										name="themes_and_topics"
										bind:value={newCampaign.themes_and_topics}
										placeholder="Key themes and topics for this campaign"
										rows="2"
									/>
								</div>

								<div>
									<Label for="target-hashtags" class="mb-2">Target Hashtags</Label>
									<Input
										id="target-hashtags"
										type="text"
										name="target_hashtags"
										bind:value={newCampaign.target_hashtags}
										placeholder="#relevant #industry #hashtags"
									/>
								</div>

								<div>
									<Label for="campaign-hashtags" class="mb-2">Campaign Hashtags</Label>
									<Input
										id="campaign-hashtags"
										type="text"
										name="campaign_hashtags"
										bind:value={newCampaign.campaign_hashtags}
										placeholder="#OurCampaign #UniqueTag"
									/>
								</div>

								<div>
									<Label for="promotion-accounts" class="mb-2">Promotion Accounts</Label>
									<Input
										id="promotion-accounts"
										type="text"
										name="campaign_promotion_accounts"
										bind:value={newCampaign.campaign_promotion_accounts}
										placeholder="@ourcompany @influencer"
									/>
								</div>
							</div>
						</AccordionItem>
					</Accordion>

					<div class="mt-6 flex items-center justify-end space-x-4">
						<Button type="button" color="alternative" on:click={() => (activeTab = 'list')}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{#if isSubmitting}
								<Spinner size="4" class="mr-2" />
								Creating Campaign...
							{:else}
								Create Campaign
							{/if}
						</Button>
					</div>
				</form>
			</Card>
		</TabItem>
	</Tabs>
</div>
