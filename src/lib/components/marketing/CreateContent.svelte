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
	class="mx-auto max-w-4xl space-y-6 p-4"
>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="space-y-4">
			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Select Template</span>
				<Select on:change={handleTemplateSelection} class="w-full">
					<option value="">No Template</option>
					{#each templates as template}
						<option value={template.id}>{template.type} - {template.purpose_description}</option>
					{/each}
				</Select>
			</Label>

			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Scheduled Date</span>
				<Input
					type="datetime-local"
					name="scheduled_date"
					bind:value={scheduled_date}
					required
					class="w-full"
				/>
			</Label>

			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Platform</span>
				<Select name="platform" bind:value={platform} required class="w-full">
					<option value="twitter">Twitter</option>
					<option value="instagram">Instagram</option>
					<option value="linkedin">LinkedIn</option>
				</Select>
			</Label>

			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Campaign</span>
				<Select name="campaign_id" bind:value={campaign_id} class="w-full">
					<option value="">No Campaign</option>
					{#each campaigns as campaign}
						<option value={campaign.id}>{campaign.name}</option>
					{/each}
				</Select>
			</Label>
		</div>

		<div class="space-y-4">
			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Content Promotion Accounts</span>
				<Input
					type="text"
					name="content_promotion_accounts"
					bind:value={content_promotion_accounts}
					class="w-full"
				/>
			</Label>

			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Content Hashtags</span>
				<Input type="text" name="content_hashtags" bind:value={content_hashtags} class="w-full" />
			</Label>

			<Label class="block">
				<span class="mb-1 text-sm font-medium text-gray-700">Content Themes</span>
				<Input type="text" name="content_themes" bind:value={content_themes} class="w-full" />
			</Label>
		</div>
	</div>

	<Label class="block">
		<span class="mb-1 text-sm font-medium text-gray-700">Content Text</span>
		<Textarea
			name="content_text"
			bind:value={content_text}
			required
			rows="8"
			class="w-full resize-y"
		/>
	</Label>

	<div class="flex justify-end space-x-4">
		<Button type="submit" class="px-6 py-2">Create Content</Button>
		<Button color="alternative" on:click={handleCancel} class="px-6 py-2">Cancel</Button>
	</div>
</form>
