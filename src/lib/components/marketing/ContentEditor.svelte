<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Label, Textarea, Select } from 'flowbite-svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';
	import { createEventDispatcher } from 'svelte';

	export let contentItem: ContentItem | null = null;
	export let campaigns: Campaign[] = [];
	export let templates: Template[] = [];

	let editingContent: ContentItem = contentItem ? { ...contentItem } : ({} as ContentItem);
	let selectedTemplate: Template | null = null;

	const dispatch = createEventDispatcher();

	function updateEditingContent(field: keyof ContentItem, value: string) {
		editingContent = { ...editingContent, [field]: value };
	}

	function handleTemplateSelection(event: Event) {
		const templateId = (event.target as HTMLSelectElement).value;
		selectedTemplate = templates.find((t) => t.id === templateId) || null;
		if (selectedTemplate) {
			updateEditingContent('content_text', selectedTemplate.content_text);
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function formatDateForInput(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDTHH:mm"
	}

	$: scheduledDateValue = formatDateForInput(editingContent.scheduled_date);
</script>

<form
	method="POST"
	action={contentItem ? '?/updateContent' : '?/createContent'}
	use:enhance={() => {
		return ({ result }) => {
			if (result.type === 'success') {
				dispatch('contentUpdated', result.data);
			}
		};
	}}
	class="space-y-4"
>
	{#if contentItem}
		<input type="hidden" name="id" value={contentItem.id} />
	{/if}

	{#if !contentItem}
		<Label>
			Select Template
			<Select on:change={handleTemplateSelection}>
				<option value="">No Template</option>
				{#each templates as template}
					<option value={template.id}>{template.type} - {template.purpose_description}</option>
				{/each}
			</Select>
		</Label>
	{/if}
	<Label>
		Content Text
		<Textarea
			name="content_text"
			value={editingContent.content_text || ''}
			on:input={(e) => updateEditingContent('content_text', e.currentTarget.value)}
			required
		/>
	</Label>
	<Label>
		Scheduled Date
		<Input
			type="datetime-local"
			name="scheduled_date"
			value={scheduledDateValue}
			on:input={(e) => updateEditingContent('scheduled_date', e.currentTarget.value)}
			required
		/>
	</Label>
	<Label>
		Platform
		<Select
			name="platform"
			value={editingContent.platform || ''}
			on:change={(e) => updateEditingContent('platform', e.currentTarget.value)}
			required
		>
			<option value="twitter">Twitter</option>
			<option value="instagram">Instagram</option>
			<option value="linkedin">LinkedIn</option>
		</Select>
	</Label>
	<Label>
		Campaign
		<Select
			name="campaign_id"
			value={editingContent.campaign_id || ''}
			on:change={(e) => updateEditingContent('campaign_id', e.currentTarget.value)}
		>
			<option value="">No Campaign</option>
			{#each campaigns as campaign}
				<option value={campaign.id}>{campaign.name}</option>
			{/each}
		</Select>
	</Label>
	{#if contentItem}
		<Label>
			Status
			<Select
				name="status"
				value={editingContent.status || ''}
				on:change={(e) => updateEditingContent('status', e.currentTarget.value)}
				required
			>
				<option value="scheduled">Scheduled</option>
				<option value="posted">Posted</option>
				<option value="cancelled">Cancelled</option>
			</Select>
		</Label>
	{/if}
	<Label>
		Content Promotion Accounts
		<Input
			type="text"
			name="content_promotion_accounts"
			value={editingContent.content_promotion_accounts || ''}
			on:input={(e) => updateEditingContent('content_promotion_accounts', e.currentTarget.value)}
		/>
	</Label>
	<Label>
		Content Hashtags
		<Input
			type="text"
			name="content_hashtags"
			value={editingContent.content_hashtags || ''}
			on:input={(e) => updateEditingContent('content_hashtags', e.currentTarget.value)}
		/>
	</Label>
	<Label>
		Content Themes
		<Input
			type="text"
			name="content_themes"
			value={editingContent.content_themes || ''}
			on:input={(e) => updateEditingContent('content_themes', e.currentTarget.value)}
		/>
	</Label>
	<div class="flex justify-end space-x-2">
		<Button type="submit">{contentItem ? 'Update' : 'Create'} Content</Button>
		<Button color="alternative" on:click={handleCancel}>Cancel</Button>
	</div>
</form>
