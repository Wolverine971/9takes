<!-- src/lib/components/marketing/CampaignManager.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import type { Campaign } from '$lib/types/marketing';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let {
		campaigns,
		oncontentCreated,
		oncontentUpdated
	}: {
		campaigns: Campaign[];
		oncontentCreated?: (data: any) => void;
		oncontentUpdated?: (data: any) => void;
	} = $props();

	let editingCampaign: Partial<Campaign> | null = $state(null);
	let originalStartDate: string | null = $state(null);
	let isSubmitting = $state(false);
	let formError = $state('');
	let formSuccess = $state('');
	let showFormSuccess = $state(false);
	let campaignFilter = $state('all');
	let searchTerm = $state('');
	let activeTab: 'create' | 'list' = $state('list');
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

	let sortedCampaigns = $derived(
		[...campaigns].sort(
			(a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
		)
	);

	let filteredCampaigns = $derived(
		sortedCampaigns.filter((campaign) => {
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
		})
	);

	let newCampaign = $state({
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
	});

	let showAdditionalDetails = $state(false);
	let showEditAdditionalDetails = $state(false);

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
		activeTab = 'create';
		setTimeout(() => {
			const createForm = document.getElementById('create-campaign-form');
			if (createForm) {
				createForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	}

	async function handleCampaignCreate(event: SubmitEvent) {
		event.preventDefault();
		formError = '';
		formSuccess = '';
		isSubmitting = true;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			const startDate = new Date(formData.get('start_date') as string);
			const endDate = new Date(formData.get('end_date') as string);

			if (endDate < startDate) {
				formError = 'End date cannot be before start date';
				isSubmitting = false;
				return;
			}

			const result = await submitForm('?/createCampaign', formData);

			if (result.type === 'success') {
				const data = result.data as { campaign: Campaign } | undefined;
				const campaign = data?.campaign;
				if (campaign) {
					campaigns = [...campaigns, campaign];
					await createPrimerContent(campaign);
				}
				form.reset();
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
				formSuccess = `Campaign "${campaign?.name || ''}" created successfully!`;
				showFormSuccess = true;
				setTimeout(() => {
					showFormSuccess = false;
				}, 5000);
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
		formError = '';
		isSubmitting = true;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);
			const startDate = new Date(formData.get('start_date') as string);
			const endDate = new Date(formData.get('end_date') as string);

			if (endDate < startDate) {
				formError = 'End date cannot be before start date';
				isSubmitting = false;
				return;
			}

			const result = await submitForm('?/updateCampaign', formData);

			if (result.type === 'success') {
				const data = result.data as { campaign: Campaign } | undefined;
				const updatedCampaign = data?.campaign;
				if (updatedCampaign) {
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
				}

				formSuccess = `Campaign "${updatedCampaign?.name || ''}" updated successfully!`;
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
			const data = result.data as { content: any } | undefined;
			oncontentCreated?.(data?.content);
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
			const data = result.data as { updatedContent: any } | undefined;
			oncontentUpdated?.(data?.updatedContent);
		}
	}

	async function submitForm(url: string, formData: FormData) {
		const response = await fetch(url, { method: 'POST', body: formData });
		return deserialize(await response.text());
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}

	function getCampaignStatus(campaign: Campaign): { status: string; cls: string } {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		const endDate = new Date(campaign.end_date);

		if (startDate <= today && endDate >= today) {
			return { status: 'Active', cls: 'badge-green' };
		} else if (startDate > today) {
			return { status: 'Upcoming', cls: 'badge-blue' };
		} else {
			return { status: 'Past', cls: 'badge-gray' };
		}
	}

	function getDaysRemaining(campaign: Campaign): { text: string; cls: string } {
		const today = new Date();
		const startDate = new Date(campaign.start_date);
		const endDate = new Date(campaign.end_date);

		if (startDate > today) {
			const days = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
			return { text: `Starts in ${days} day${days !== 1 ? 's' : ''}`, cls: 'badge-blue' };
		} else if (endDate >= today) {
			const days = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
			return {
				text: `${days} day${days !== 1 ? 's' : ''} remaining`,
				cls: days <= 3 ? 'badge-red' : days <= 7 ? 'badge-yellow' : 'badge-green'
			};
		} else {
			const days = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
			return { text: `Ended ${days} day${days !== 1 ? 's' : ''} ago`, cls: 'badge-gray' };
		}
	}

	onMount(() => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const endDate = new Date(tomorrow);
		endDate.setDate(endDate.getDate() + 30);
		newCampaign.start_date = tomorrow.toISOString().split('T')[0];
		newCampaign.end_date = endDate.toISOString().split('T')[0];
	});
</script>

<div class="campaign-manager">
	<!-- Alerts -->
	{#if showFormSuccess}
		<div class="alert alert-success" transition:slide>
			<span class="alert-bold">Success!</span>
			{formSuccess}
			<button class="alert-dismiss" onclick={() => (showFormSuccess = false)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M18 6 6 18" /><path d="m6 6 12 12" />
				</svg>
			</button>
		</div>
	{/if}

	{#if formError}
		<div class="alert alert-error" transition:slide>
			<span class="alert-bold">Error!</span>
			{formError}
			<button class="alert-dismiss" onclick={() => (formError = '')}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M18 6 6 18" /><path d="m6 6 12 12" />
				</svg>
			</button>
		</div>
	{/if}

	<!-- Tab Bar -->
	<div class="tab-bar">
		<button
			class="tab-btn"
			class:active={activeTab === 'list'}
			onclick={() => (activeTab = 'list')}
		>
			<svg
				width="16"
				height="16"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
				></path>
			</svg>
			Campaign List
			<span class="tab-count">{campaigns.length}</span>
		</button>
		<button
			class="tab-btn"
			class:active={activeTab === 'create'}
			onclick={() => (activeTab = 'create')}
		>
			<svg
				width="16"
				height="16"
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
		</button>
	</div>

	<!-- List Tab -->
	{#if activeTab === 'list'}
		<div class="list-toolbar">
			<div class="toolbar-filters">
				<select bind:value={campaignFilter} class="filter-select">
					<option value="all">All Campaigns</option>
					<option value="active">Active</option>
					<option value="upcoming">Upcoming</option>
					<option value="past">Past</option>
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
					<input
						type="search"
						bind:value={searchTerm}
						placeholder="Search campaigns..."
						class="search-input"
					/>
				</div>
			</div>

			<button class="btn btn-primary btn-sm" onclick={() => (activeTab = 'create')}>
				<svg
					width="16"
					height="16"
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
			</button>
		</div>

		{#if filteredCampaigns.length === 0}
			<div class="empty-state">
				{#if searchTerm || campaignFilter !== 'all'}
					<p>No campaigns match your filters. Try changing your search or filter criteria.</p>
					<button
						class="btn btn-secondary btn-sm"
						onclick={() => {
							searchTerm = '';
							campaignFilter = 'all';
						}}
					>
						Clear Filters
					</button>
				{:else}
					<p>No campaigns have been created yet.</p>
					<button class="btn btn-primary btn-sm" onclick={() => (activeTab = 'create')}>
						Create Your First Campaign
					</button>
				{/if}
			</div>
		{:else}
			<div class="campaign-grid">
				{#each filteredCampaigns as campaign (campaign.id)}
					<div class="campaign-card">
						<div class="card-color-bar" style="background-color: {campaign.color};"></div>

						{#if editingCampaign && editingCampaign.id === campaign.id}
							<form
								onsubmit={handleCampaignUpdate}
								class="edit-form"
								id="edit-form-{campaign.id}"
								transition:slide
							>
								<input type="hidden" name="id" value={campaign.id} />
								<div class="edit-form-header">
									<h3>Edit Campaign</h3>
									<button type="button" class="btn btn-danger btn-xs" onclick={cancelEditing}
										>Cancel</button
									>
								</div>

								<label class="field">
									<span class="field-label">Name*</span>
									<input
										type="text"
										name="name"
										bind:value={editingCampaign.name}
										required
										class="field-input"
										placeholder="Campaign Name"
									/>
								</label>

								<label class="field">
									<span class="field-label">Description</span>
									<textarea
										name="description"
										bind:value={editingCampaign.description}
										class="field-input field-textarea"
										placeholder="Campaign description"
										rows="3"
									></textarea>
								</label>

								<div class="field-row">
									<label class="field">
										<span class="field-label">Start Date*</span>
										<input
											type="date"
											name="start_date"
											bind:value={editingCampaign.start_date}
											required
											class="field-input"
										/>
									</label>
									<label class="field">
										<span class="field-label">End Date*</span>
										<input
											type="date"
											name="end_date"
											bind:value={editingCampaign.end_date}
											required
											class="field-input"
										/>
									</label>
								</div>

								<label class="field">
									<span class="field-label">Color*</span>
									<div class="color-picker-row">
										<input
											type="color"
											name="color"
											bind:value={editingCampaign.color}
											required
											class="color-input"
										/>
										<div
											class="color-preview"
											style="background-color: {editingCampaign.color}; color: white;"
										>
											{editingCampaign.color}
										</div>
									</div>
								</label>

								<button
									type="button"
									class="accordion-toggle"
									onclick={() => (showEditAdditionalDetails = !showEditAdditionalDetails)}
								>
									Additional Details
									<svg
										class="accordion-chevron"
										class:open={showEditAdditionalDetails}
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="m6 9 6 6 6-6" />
									</svg>
								</button>

								{#if showEditAdditionalDetails}
									<div class="additional-fields" transition:slide>
										<label class="field">
											<span class="field-label">Target Audience</span>
											<textarea
												name="target_audience"
												bind:value={editingCampaign.target_audience}
												class="field-input field-textarea"
												placeholder="Who is this campaign targeting?"
												rows="2"
											></textarea>
										</label>
										<label class="field">
											<span class="field-label">Themes and Topics</span>
											<textarea
												name="themes_and_topics"
												bind:value={editingCampaign.themes_and_topics}
												class="field-input field-textarea"
												placeholder="Key themes and topics"
												rows="2"
											></textarea>
										</label>
										<label class="field">
											<span class="field-label">Target Hashtags</span>
											<input
												type="text"
												name="target_hashtags"
												bind:value={editingCampaign.target_hashtags}
												class="field-input"
												placeholder="#relevant #industry #hashtags"
											/>
										</label>
										<label class="field">
											<span class="field-label">Campaign Hashtags</span>
											<input
												type="text"
												name="campaign_hashtags"
												bind:value={editingCampaign.campaign_hashtags}
												class="field-input"
												placeholder="#OurCampaign #UniqueTag"
											/>
										</label>
										<label class="field">
											<span class="field-label">Promotion Accounts</span>
											<input
												type="text"
												name="campaign_promotion_accounts"
												bind:value={editingCampaign.campaign_promotion_accounts}
												class="field-input"
												placeholder="@ourcompany @influencer"
											/>
										</label>
									</div>
								{/if}

								<button
									type="submit"
									class="btn btn-primary"
									disabled={isSubmitting}
									style="width: 100%;"
								>
									{#if isSubmitting}
										<span class="spinner"></span> Saving...
									{:else}
										Save Changes
									{/if}
								</button>
							</form>
						{:else}
							<div class="card-body">
								<div class="card-title-row">
									<h5 class="card-title">{campaign.name}</h5>
									<span class="badge {getCampaignStatus(campaign).cls}"
										>{getCampaignStatus(campaign).status}</span
									>
								</div>

								<div class="card-description">
									{#if campaign.description}
										<p>
											{campaign.description.length > 100
												? `${campaign.description.substring(0, 100)}...`
												: campaign.description}
										</p>
									{:else}
										<p class="no-description">No description provided</p>
									{/if}
								</div>

								<div class="card-dates">
									<span>📅 {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</span
									>
								</div>

								<div class="days-remaining">
									<span class="badge badge-full {getDaysRemaining(campaign).cls}"
										>{getDaysRemaining(campaign).text}</span
									>
								</div>

								{#if campaign.themes_and_topics}
									<div class="card-themes">
										<span class="themes-label">Themes:</span>
										<div class="themes-list">
											{#each campaign.themes_and_topics.split(',').slice(0, 3) as theme}
												<span class="theme-tag">{theme.trim()}</span>
											{/each}
											{#if campaign.themes_and_topics.split(',').length > 3}
												<span class="theme-tag" title={campaign.themes_and_topics}>
													+{campaign.themes_and_topics.split(',').length - 3} more
												</span>
											{/if}
										</div>
									</div>
								{/if}

								{#if campaign.campaign_hashtags}
									<div class="card-hashtags">
										<span class="themes-label">Campaign Hashtags:</span>
										<span class="hashtags-value">{campaign.campaign_hashtags}</span>
									</div>
								{/if}

								<div class="card-actions">
									<button class="btn btn-secondary btn-xs" onclick={() => startEditing(campaign)}>
										<svg
											width="14"
											height="14"
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
									</button>
									<button
										class="btn btn-secondary btn-xs"
										onclick={() => duplicateCampaign(campaign)}
									>
										<svg
											width="14"
											height="14"
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
									</button>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- Create Tab -->
	{#if activeTab === 'create'}
		<div class="create-panel" id="create-campaign-form">
			<h2 class="create-title">Create New Campaign</h2>

			<div class="template-section">
				<h3 class="template-heading">Start with a template:</h3>
				<div class="template-grid">
					{#each campaignTemplates as template, index}
						<button class="template-btn" onclick={() => applyTemplate(index)}>
							<div class="template-icon">
								{#if index === 0}
									<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										></path></svg
									>
								{:else if index === 1}
									<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										></path></svg
									>
								{:else}
									<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										></path></svg
									>
								{/if}
							</div>
							<div class="template-info">
								<span class="template-name">{template.name}</span>
								<span class="template-desc">{template.description}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<form onsubmit={handleCampaignCreate} class="create-form">
				<div class="field-row">
					<label class="field">
						<span class="field-label">Campaign Name*</span>
						<input
							type="text"
							name="name"
							bind:value={newCampaign.name}
							required
							placeholder="Enter campaign name"
							class="field-input"
						/>
					</label>
					<label class="field">
						<span class="field-label">Color*</span>
						<div class="color-picker-row">
							<input
								type="color"
								name="color"
								bind:value={newCampaign.color}
								required
								class="color-input"
							/>
							<div
								class="color-preview"
								style="background-color: {newCampaign.color}; color: white;"
							>
								{newCampaign.color}
							</div>
						</div>
					</label>
				</div>

				<label class="field">
					<span class="field-label">Description</span>
					<textarea
						name="description"
						bind:value={newCampaign.description}
						placeholder="Enter campaign description"
						rows="3"
						class="field-input field-textarea"
					></textarea>
				</label>

				<div class="field-row">
					<label class="field">
						<span class="field-label">Start Date*</span>
						<input
							type="date"
							name="start_date"
							bind:value={newCampaign.start_date}
							required
							class="field-input"
						/>
					</label>
					<label class="field">
						<span class="field-label">End Date*</span>
						<input
							type="date"
							name="end_date"
							bind:value={newCampaign.end_date}
							required
							class="field-input"
						/>
					</label>
				</div>

				<button
					type="button"
					class="accordion-toggle"
					onclick={() => (showAdditionalDetails = !showAdditionalDetails)}
				>
					Additional Campaign Details
					<svg
						class="accordion-chevron"
						class:open={showAdditionalDetails}
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>

				{#if showAdditionalDetails}
					<div class="additional-fields" transition:slide>
						<label class="field">
							<span class="field-label">Target Audience</span>
							<textarea
								name="target_audience"
								bind:value={newCampaign.target_audience}
								placeholder="Who is this campaign targeting?"
								rows="2"
								class="field-input field-textarea"
							></textarea>
						</label>
						<label class="field">
							<span class="field-label">Themes and Topics</span>
							<textarea
								name="themes_and_topics"
								bind:value={newCampaign.themes_and_topics}
								placeholder="Key themes and topics for this campaign"
								rows="2"
								class="field-input field-textarea"
							></textarea>
						</label>
						<label class="field">
							<span class="field-label">Target Hashtags</span>
							<input
								type="text"
								name="target_hashtags"
								bind:value={newCampaign.target_hashtags}
								placeholder="#relevant #industry #hashtags"
								class="field-input"
							/>
						</label>
						<label class="field">
							<span class="field-label">Campaign Hashtags</span>
							<input
								type="text"
								name="campaign_hashtags"
								bind:value={newCampaign.campaign_hashtags}
								placeholder="#OurCampaign #UniqueTag"
								class="field-input"
							/>
						</label>
						<label class="field">
							<span class="field-label">Promotion Accounts</span>
							<input
								type="text"
								name="campaign_promotion_accounts"
								bind:value={newCampaign.campaign_promotion_accounts}
								placeholder="@ourcompany @influencer"
								class="field-input"
							/>
						</label>
					</div>
				{/if}

				<div class="form-actions">
					<button type="button" class="btn btn-secondary" onclick={() => (activeTab = 'list')}
						>Cancel</button
					>
					<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
						{#if isSubmitting}
							<span class="spinner"></span> Creating Campaign...
						{:else}
							Create Campaign
						{/if}
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.campaign-manager {
		padding: 0.5rem 0;
	}

	/* Alerts */
	.alert {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.alert-success {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #4ade80;
	}

	.alert-error {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #f87171;
	}

	.alert-bold {
		font-weight: 600;
	}

	.alert-dismiss {
		margin-left: auto;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 0.25rem;
		opacity: 0.7;
	}

	.alert-dismiss:hover {
		opacity: 1;
	}

	/* Tab Bar */
	.tab-bar {
		display: flex;
		gap: 0;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--void-elevated);
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tab-btn:hover {
		color: var(--text-primary);
	}

	.tab-btn.active {
		color: var(--shadow-monarch);
		border-bottom-color: var(--shadow-monarch);
	}

	.tab-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 9999px;
		background: var(--void-elevated);
		color: var(--text-secondary);
	}

	/* List Toolbar */
	.list-toolbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.toolbar-filters {
		display: flex;
		gap: 0.5rem;
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
		min-width: 140px;
	}

	.search-wrapper {
		position: relative;
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
		padding: 0.375rem 0.75rem 0.375rem 2rem;
		font-size: 0.8125rem;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
		color: var(--text-primary);
		width: 200px;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
	}

	/* Campaign Grid */
	.campaign-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1rem;
	}

	.campaign-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
		transition: box-shadow 0.15s ease;
	}

	.campaign-card:hover {
		box-shadow: var(--glow-sm);
	}

	.card-color-bar {
		height: 4px;
		width: 100%;
	}

	.card-body {
		padding: 1rem;
	}

	.card-title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.card-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.card-description {
		margin-bottom: 0.75rem;
	}

	.card-description p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.no-description {
		font-style: italic;
		opacity: 0.6;
	}

	.card-dates {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.days-remaining {
		margin-bottom: 0.75rem;
	}

	.card-themes {
		margin-bottom: 0.75rem;
	}

	.themes-label {
		display: block;
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 0.25rem;
	}

	.themes-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.theme-tag {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		border-radius: 9999px;
		background: var(--void-elevated);
		color: var(--text-primary);
	}

	.card-hashtags {
		margin-bottom: 0.75rem;
	}

	.hashtags-value {
		font-size: 0.875rem;
		color: var(--shadow-monarch);
	}

	.card-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	/* Badges */
	.badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 9999px;
	}

	.badge-full {
		width: 100%;
		text-align: center;
		padding: 0.25rem 0.5rem;
	}

	.badge-green {
		background: rgba(34, 197, 94, 0.15);
		color: #4ade80;
	}

	.badge-blue {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
	}

	.badge-yellow {
		background: rgba(234, 179, 8, 0.15);
		color: #facc15;
	}

	.badge-red {
		background: rgba(239, 68, 68, 0.15);
		color: #f87171;
	}

	.badge-gray {
		background: var(--void-elevated);
		color: var(--text-secondary);
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

	.btn-primary {
		background: var(--shadow-monarch);
		color: white;
	}

	.btn-primary:hover {
		filter: brightness(1.1);
		box-shadow: var(--glow-sm);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--void-elevated);
		color: var(--text-primary);
	}

	.btn-secondary:hover {
		background: var(--void-highlight);
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background: #dc2626;
	}

	/* Spinner */
	.spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Edit Form */
	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
	}

	.edit-form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.edit-form-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	/* Fields */
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		flex: 1;
	}

	.field-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.field-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
		color: var(--text-primary);
		transition: border-color 0.15s ease;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
	}

	.field-textarea {
		resize: vertical;
		min-height: 60px;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.color-picker-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.color-input {
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
	}

	.color-preview {
		flex-grow: 1;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Accordion */
	.accordion-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-primary);
		background: var(--void-elevated);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		cursor: pointer;
		width: 100%;
		text-align: left;
	}

	.accordion-chevron {
		margin-left: auto;
		transition: transform 0.2s ease;
	}

	.accordion-chevron.open {
		transform: rotate(180deg);
	}

	.additional-fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--void-deep);
		border-radius: 8px;
	}

	/* Create Panel */
	.create-panel {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 1.5rem;
		max-width: 56rem;
		margin: 0 auto;
	}

	.create-title {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--void-elevated);
	}

	.template-section {
		margin-bottom: 1.5rem;
	}

	.template-heading {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.template-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.template-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		text-align: left;
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.template-btn:hover {
		border-color: var(--shadow-monarch);
	}

	.template-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(59, 130, 246, 0.1);
		color: #60a5fa;
		flex-shrink: 0;
	}

	.template-info {
		display: flex;
		flex-direction: column;
	}

	.template-name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.template-desc {
		font-size: 0.6875rem;
		color: var(--text-secondary);
	}

	.create-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	/* Empty State */
	.empty-state {
		padding: 3rem 2rem;
		text-align: center;
		color: var(--text-secondary);
		border: 1px dashed var(--void-elevated);
		border-radius: 12px;
	}

	.empty-state p {
		margin: 0 0 1rem 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.list-toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toolbar-filters {
			flex-direction: column;
			width: 100%;
		}

		.search-input {
			width: 100%;
		}

		.campaign-grid {
			grid-template-columns: 1fr;
		}

		.field-row {
			grid-template-columns: 1fr;
		}

		.template-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
