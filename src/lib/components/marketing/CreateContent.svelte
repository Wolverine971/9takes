<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Label, Textarea, Select } from 'flowbite-svelte';
	import type { Campaign, Template } from '$lib/types/marketing';
	import { createEventDispatcher } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let campaigns: Campaign[];
	export let templates: Template[];
	export let initialDate: Date | null = null;

	const dispatch = createEventDispatcher();

	let selectedTemplate: Template | null = null;

	function handleTemplateSelection(event: Event) {
		const templateId = (event.target as HTMLSelectElement).value;
		selectedTemplate = templates.find((t) => t.id === templateId) || null;
		if (selectedTemplate) {
			content_text = selectedTemplate.content_text;
		}
	}

	let content_text = '';
	let scheduled_date = initialDate ? formatDateForInput(initialDate) : '';
	let platform = 'twitter';
	let campaign_id = '';
	let content_promotion_accounts = '';
	let content_hashtags = '';
	let content_themes = '';

	function formatDateForInput(date: Date): string {
		return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDTHH:mm"
	}

	function resetForm() {
		content_text = '';
		scheduled_date = initialDate ? formatDateForInput(initialDate) : '';
		platform = 'twitter';
		campaign_id = '';
		content_promotion_accounts = '';
		content_hashtags = '';
		content_themes = '';
		selectedTemplate = null;
	}

	function handleCancel() {
		dispatch('cancel');
	}
</script>

<form
	method="POST"
	action="?/createContent"
	use:enhance={() => {
		return ({ result }) => {
			if (result.type === 'success') {
				dispatch('contentCreated', result.data);
				resetForm();
				invalidateAll();
			}
		};
	}}
	class="space-y-4"
>
	<Label>
		Select Template
		<Select on:change={handleTemplateSelection}>
			<option value="">No Template</option>
			{#each templates as template}
				<option value={template.id}>{template.type} - {template.purpose_description}</option>
			{/each}
		</Select>
	</Label>

	<Label>
		Content Text
		<Textarea name="content_text" bind:value={content_text} required />
	</Label>

	<Label>
		Scheduled Date
		<Input type="datetime-local" name="scheduled_date" bind:value={scheduled_date} required />
	</Label>

	<Label>
		Platform
		<Select name="platform" bind:value={platform} required>
			<option value="twitter">Twitter</option>
			<option value="instagram">Instagram</option>
			<option value="linkedin">LinkedIn</option>
		</Select>
	</Label>

	<Label>
		Campaign
		<Select name="campaign_id" bind:value={campaign_id}>
			<option value="">No Campaign</option>
			{#each campaigns as campaign}
				<option value={campaign.id}>{campaign.name}</option>
			{/each}
		</Select>
	</Label>

	<Label>
		Content Promotion Accounts
		<Input type="text" name="content_promotion_accounts" bind:value={content_promotion_accounts} />
	</Label>

	<Label>
		Content Hashtags
		<Input type="text" name="content_hashtags" bind:value={content_hashtags} />
	</Label>

	<Label>
		Content Themes
		<Input type="text" name="content_themes" bind:value={content_themes} />
	</Label>

	<div class="flex justify-end space-x-2">
		<Button type="submit">Create Content</Button>
		<Button color="alternative" on:click={handleCancel}>Cancel</Button>
	</div>
</form>
