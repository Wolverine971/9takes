<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import { Button, Card, Input, Label, Textarea, Select } from 'flowbite-svelte';
	import type { Campaign } from '$lib/types/marketing';
	import { createEventDispatcher } from 'svelte';

	export let campaigns: Campaign[];

	const dispatch = createEventDispatcher();

	let editingCampaign: Partial<Campaign> | null = null;
	let originalStartDate: string | null = null;

	function startEditing(campaign: Campaign) {
		editingCampaign = { ...campaign };
		originalStartDate = campaign.start_date;
	}

	function cancelEditing() {
		editingCampaign = null;
		originalStartDate = null;
	}

	function updateEditingCampaign(field: keyof Campaign, value: string) {
		if (editingCampaign) {
			editingCampaign = { ...editingCampaign, [field]: value };
		}
	}

	async function handleCampaignCreate(event: SubmitEvent) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const response = await fetch('?/createCampaign', {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			campaigns = [...campaigns, result?.data?.campaign];
			createPrimerContent(result?.data.campaign);
			form.reset();
		}
	}

	async function handleCampaignUpdate(event: SubmitEvent) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const response = await fetch('?/updateCampaign', {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text());

		console.log(result);

		if (result.type === 'success') {
			const updatedCampaign = result?.data?.campaign;
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

			cancelEditing();
		}
	}

	async function createPrimerContent(campaign: Campaign) {
		const form = new FormData();
		form.append('campaign_id', campaign.id);
		form.append(
			'content_text',
			`PRIME the audience! What do they need to do? We're launching our ${campaign.name} campaign. Be on the lookout over the next few weeks. #${campaign.name.replace(/\s+/g, '')}`
		);
		form.append('scheduled_date', campaign.start_date);
		form.append('platform', 'twitter'); // You can adjust this or make it selectable);
		form.append('status', 'scheduled');
		form.append('content_promotion_accounts', '');
		form.append('content_hashtags', `#${campaign.name.replace(/\s+/g, '')}`);
		form.append('content_themes', campaign.themes_and_topics);

		const response = await fetch('?/createContent', {
			method: 'POST',

			body: form
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			dispatch('contentCreated', result?.data?.content);
		}
	}

	async function updateAssociatedContent(
		campaignId: string,
		oldStartDate: string,
		newStartDate: string
	) {
		const form = new FormData();
		form.append('campaignId', campaignId);
		form.append('oldStartDate', oldStartDate);
		form.append('newStartDate', newStartDate);
		const response = await fetch('?/updateCampaignContent', {
			method: 'POST',
			body: form
		});

		const result = deserialize(await response.text());

		if (result.type === 'success') {
			dispatch('contentUpdated', result?.data?.updatedContent);
		}
	}
</script>

<h2 class="mb-4 text-2xl font-bold">Campaigns</h2>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<div>
		<h3 class="mb-2 text-xl font-bold">Create New Campaign</h3>
		<form on:submit={handleCampaignCreate} class="space-y-4">
			<Label>
				Name
				<Input type="text" name="name" required />
			</Label>
			<Label>
				Description
				<Textarea name="description" />
			</Label>
			<Label>
				Start Date
				<Input type="date" name="start_date" required />
			</Label>
			<Label>
				End Date
				<Input type="date" name="end_date" required />
			</Label>
			<Label>
				Color
				<Input type="color" name="color" required />
			</Label>
			<Label>
				Target Audience
				<Textarea name="target_audience" />
			</Label>
			<Label>
				Themes and Topics
				<Textarea name="themes_and_topics" />
			</Label>
			<Label>
				Target Hashtags
				<Input type="text" name="target_hashtags" />
			</Label>
			<Label>
				Campaign Hashtags
				<Input type="text" name="campaign_hashtags" />
			</Label>
			<Label>
				Campaign Promotion Accounts
				<Input type="text" name="campaign_promotion_accounts" />
			</Label>
			<Button type="submit">Create Campaign</Button>
		</form>
	</div>

	<div>
		<h3 class="mb-2 text-xl font-bold">Existing Campaigns</h3>
		{#each campaigns as campaign}
			<Card class="mb-2">
				{#if editingCampaign && editingCampaign.id === campaign.id}
					<form on:submit={handleCampaignUpdate} class="space-y-2">
						<input type="hidden" name="id" value={campaign.id} />
						<Input
							type="text"
							placeholder="Name"
							name="name"
							bind:value={editingCampaign.name}
							required
						/>
						<Textarea
							name="description"
							placeholder="Description"
							bind:value={editingCampaign.description}
						/>
						<Input
							type="date"
							placeholder="Start Date"
							name="start_date"
							bind:value={editingCampaign.start_date}
							required
						/>
						<Input
							type="date"
							placeholder="End Date"
							name="end_date"
							bind:value={editingCampaign.end_date}
							required
						/>
						<Input
							type="color"
							placeholder="Color"
							name="color"
							bind:value={editingCampaign.color}
							required
						/>
						<Textarea
							name="target_audience"
							placeholder="Target Audience"
							bind:value={editingCampaign.target_audience}
						/>
						<Textarea
							name="themes_and_topics"
							placeholder="Themes and Topics"
							bind:value={editingCampaign.themes_and_topics}
						/>
						<Input
							type="text"
							placeholder="Target Hashtags"
							name="target_hashtags"
							bind:value={editingCampaign.target_hashtags}
						/>
						<Input
							type="text"
							placeholder="Campaign Hashtags"
							name="campaign_hashtags"
							bind:value={editingCampaign.campaign_hashtags}
						/>
						<Input
							type="text"
							placeholder="Campaign Promotion Accounts"
							name="campaign_promotion_accounts"
							bind:value={editingCampaign.campaign_promotion_accounts}
						/>
						<Button type="submit">Save</Button>
						<Button on:click={cancelEditing}>Cancel</Button>
					</form>
				{:else}
					<h4 class="font-bold">{campaign.name}</h4>
					<p>{campaign.description}</p>
					<p>
						From {new Date(campaign.start_date).toLocaleDateString()} to {new Date(
							campaign.end_date
						).toLocaleDateString()}
					</p>
					<div class="h-6 w-6 rounded" style="background-color: {campaign.color}"></div>
					<p><strong>Target Audience:</strong> {campaign.target_audience}</p>
					<p><strong>Themes and Topics:</strong> {campaign.themes_and_topics}</p>
					<p><strong>Target Hashtags:</strong> {campaign.target_hashtags}</p>
					<p><strong>Campaign Hashtags:</strong> {campaign.campaign_hashtags}</p>
					<p><strong>Promotion Accounts:</strong> {campaign.campaign_promotion_accounts}</p>
					<Button on:click={() => startEditing(campaign)}>Edit</Button>
				{/if}
			</Card>
		{/each}
	</div>
</div>
