<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import { Button, Card, Input, Label, Textarea, AccordionItem, Accordion } from 'flowbite-svelte';
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

<div class="container mx-auto px-4 py-2">
	<h2 class="my-1 mb-2 py-1 text-center text-3xl font-bold">Campaign Management</h2>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div class="bg-grey rounded-lg p-6 shadow-md">
			<h3 class="mb-2 text-xl font-bold">Create New Campaign</h3>
			<form on:submit={handleCampaignCreate} class="space-y-4">
				<Label class="space-y-2">
					<span>Name</span>
					<Input type="text" name="name" required class="w-full" />
				</Label>
				<Label class="space-y-2">
					<span>Description</span>
					<Textarea name="description" class="w-full" />
				</Label>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Label class="space-y-2">
						<span>Start Date</span>
						<Input type="date" name="start_date" required class="w-full" />
					</Label>
					<Label class="space-y-2">
						<span>End Date</span>
						<Input type="date" name="end_date" required class="w-full" />
					</Label>
				</div>
				<Label class="space-y-2">
					<span>Color</span>
					<Input type="color" name="color" required class="h-10 w-full" />
				</Label>
				<Label class="space-y-2">
					<span>Target Audience</span>
					<Textarea name="target_audience" class="w-full" />
				</Label>
				<Label class="space-y-2">
					<span>Themes and Topics</span>
					<Textarea name="themes_and_topics" class="w-full" />
				</Label>
				<Label class="space-y-2">
					<span>Target Hashtags</span>
					<Input type="text" name="target_hashtags" class="w-full" />
				</Label>
				<Label class="space-y-2">
					<span>Campaign Hashtags</span>
					<Input type="text" name="campaign_hashtags" class="w-full" />
				</Label>
				<Label class="space-y-2">
					<span>Campaign Promotion Accounts</span>
					<Input type="text" name="campaign_promotion_accounts" class="w-full" />
				</Label>
				<Button type="submit" class="w-full">Create Campaign</Button>
			</form>
		</div>

		<div class="bg-grey rounded-lg p-6 shadow-md">
			<h3 class="m-0 mb-2 p-0 text-xl font-bold">Existing Campaigns</h3>
			{#each campaigns as campaign}
				{#if editingCampaign && editingCampaign.id === campaign.id}
					<Accordion class="">
						<AccordionItem tag="h4" paddingDefault="p-1">
							<span slot="header" class="text-xl font-semibold">{editingCampaign.name}</span>
							<Card class="mb-2">
								<form on:submit={handleCampaignUpdate} class="space-y-4">
									<input type="hidden" name="id" value={campaign.id} />
									<Input
										type="text"
										placeholder="Name"
										name="name"
										bind:value={editingCampaign.name}
										required
										class="w-full"
									/>
									<Textarea
										name="description"
										placeholder="Description"
										bind:value={editingCampaign.description}
										class="w-full"
									/>
									<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<Input
											type="date"
											placeholder="Start Date"
											name="start_date"
											bind:value={editingCampaign.start_date}
											required
											class="w-full"
										/>
										<Input
											type="date"
											placeholder="End Date"
											name="end_date"
											bind:value={editingCampaign.end_date}
											required
											class="w-full"
										/>
									</div>
									<Input
										type="color"
										placeholder="Color"
										name="color"
										bind:value={editingCampaign.color}
										required
										class="h-10 w-full"
									/>
									<Textarea
										name="target_audience"
										placeholder="Target Audience"
										bind:value={editingCampaign.target_audience}
										class="w-full"
									/>
									<Textarea
										name="themes_and_topics"
										placeholder="Themes and Topics"
										bind:value={editingCampaign.themes_and_topics}
										class="w-full"
									/>
									<Input
										type="text"
										placeholder="Target Hashtags"
										name="target_hashtags"
										bind:value={editingCampaign.target_hashtags}
										class="w-full"
									/>
									<Input
										type="text"
										placeholder="Campaign Hashtags"
										name="campaign_hashtags"
										bind:value={editingCampaign.campaign_hashtags}
										class="w-full"
									/>
									<Input
										type="text"
										placeholder="Campaign Promotion Accounts"
										name="campaign_promotion_accounts"
										bind:value={editingCampaign.campaign_promotion_accounts}
										class="w-full"
									/>
									<div class="flex space-x-4">
										<Button type="submit" class="flex-1">Save</Button>
										<Button on:click={cancelEditing} class="flex-1" color="red">Cancel</Button>
									</div>
								</form>
							</Card>
						</AccordionItem>
					</Accordion>
				{:else}
					<Accordion class="">
						<AccordionItem tag="h4" paddingDefault="p-1">
							<span slot="header" class="font-semibold">{campaign.name}</span>
							<Card class="mb-2">
								<h5 class="!m-0 !p-0 font-bold">{campaign.name}</h5>
								<p>{campaign.description}</p>
								<p>
									From {new Date(campaign.start_date).toLocaleDateString()} to {new Date(
										campaign.end_date
									).toLocaleDateString()}
								</p>
								<div class="mb-2 flex items-center">
									<span class="mr-2">Color:</span>
									<div class="h-6 w-6 rounded" style="background-color: {campaign.color}"></div>
								</div>
								<p><strong>Target Audience:</strong> {campaign.target_audience}</p>
								<p><strong>Themes and Topics:</strong> {campaign.themes_and_topics}</p>
								<p><strong>Target Hashtags:</strong> {campaign.target_hashtags}</p>
								<p><strong>Campaign Hashtags:</strong> {campaign.campaign_hashtags}</p>
								<p>
									<strong>Promotion Accounts:</strong>
									{campaign.campaign_promotion_accounts}
								</p>
								<Button on:click={() => startEditing(campaign)} class="w-full">Edit</Button>
							</Card>
						</AccordionItem>
					</Accordion>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.group {
		padding: 0;
	}
	.accordheader {
		padding: 0;
		font-size: 1rem;
	}
	/* h2 {
		margin: 0;
		padding: 0;
	} */
</style>
