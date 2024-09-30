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
	class="w-full max-w-4xl mx-auto p-4 space-y-6"
>
	{#if contentItem}
		<input type="hidden" name="id" value={contentItem.id} />
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="space-y-4">
			{#if !contentItem}
				<Label class="space-y-2">
					<span class="text-sm font-medium text-gray-700">Select Template</span>
					<Select on:change={handleTemplateSelection} class="w-full">
						<option value="">No Template</option>
						{#each templates as template}
							<option value={template.id}>{template.type} - {template.purpose_description}</option>
						{/each}
					</Select>
				</Label>
			{/if}
			<Label class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Scheduled Date</span>
				<Input
					type="datetime-local"
					name="scheduled_date"
					value={scheduledDateValue}
					on:input={(e) => updateEditingContent('scheduled_date', e.currentTarget.value)}
					required
					class="w-full"
				/>
			</Label>
			<Label class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Platform</span>
				<Select
					name="platform"
					value={editingContent.platform || ''}
					on:change={(e) => updateEditingContent('platform', e.currentTarget.value)}
					required
					class="w-full"
				>
					<option value="twitter">Twitter</option>
					<option value="instagram">Instagram</option>
					<option value="linkedin">LinkedIn</option>
				</Select>
			</Label>
			<Label class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Campaign</span>
				<Select
					name="campaign_id"
					value={editingContent.campaign_id || ''}
					on:change={(e) => updateEditingContent('campaign_id', e.currentTarget.value)}
					class="w-full"
				>
					<option value="">No Campaign</option>
					{#each campaigns as campaign}
						<option value={campaign.id}>{campaign.name}</option>
					{/each}
				</Select>
			</Label>
			{#if contentItem}
				<Label class="space-y-2">
					<span class="text-sm font-medium text-gray-700">Status</span>
					<Select
						name="status"
						value={editingContent.status || ''}
						on:change={(e) => updateEditingContent('status', e.currentTarget.value)}
						required
						class="w-full"
					>
						<option value="scheduled">Scheduled</option>
						<option value="posted">Posted</option>
						<option value="cancelled">Cancelled</option>
					</Select>
				</Label>
			{/if}
		</div>
		<div class="space-y-4">
			<Label class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Content Promotion Accounts</span>
				<Input
					type="text"
					name="content_promotion_accounts"
					value={editingContent.content_promotion_accounts || ''}
					on:input={(e) => updateEditingContent('content_promotion_accounts', e.currentTarget.value)}
					class="w-full"
				/>
			</Label>
			<Label class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Content Hashtags</span>
				<Input
					type="text"
					name="content_hashtags"
					value={editingContent.content_hashtags || ''}
					on:input={(e) => updateEditingContent('content_hashtags', e.currentTarget.value)}
					class="w-full"
				/>
			</Label>
			<Label class="space-y-2">
				<span class="text-sm font-medium text-gray-700">Content Themes</span>
				<Input
					type="text"
					name="content_themes"
					value={editingContent.content_themes || ''}
					on:input={(e) => updateEditingContent('content_themes', e.currentTarget.value)}
					class="w-full"
				/>
			</Label>
		</div>
	</div>

	<Label class="space-y-2">
		<span class="text-sm font-medium text-gray-700">Content Text</span>
		<Textarea
			name="content_text"
			value={editingContent.content_text || ''}
			on:input={(e) => updateEditingContent('content_text', e.currentTarget.value)}
			required
			rows="8"
			class="w-full resize-y"
		/>
	</Label>

	<div class="flex justify-end space-x-4">
		<Button type="submit" class="px-6 py-2">{contentItem ? 'Update' : 'Create'} Content</Button>
		<Button color="alternative" on:click={handleCancel} class="px-6 py-2">Cancel</Button>
	</div>
</form>