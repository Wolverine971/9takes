<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Button,
		Input,
		Label,
		Textarea,
		Select,
		Toggle,
		Modal,
		AccordionItem,
		Accordion
	} from 'flowbite-svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';
	import { createEventDispatcher, onMount } from 'svelte';

	export let contentItem: ContentItem | null = null;
	export let campaigns: Campaign[] = [];
	export let templates: Template[] = [];

	let editingContent: ContentItem = contentItem ? { ...contentItem } : ({} as ContentItem);
	let selectedTemplate: Template | null = null;
	let isThreadView = false;
	let threadBlocks: string[] = [];
	let showDeleteConfirmation = false;
	let blockToDelete: number | null = null;

	let contentTextWithSeparators: string = editingContent.content_text || '';
	let contentTextWithoutSeparators: string = removeSeparators(contentTextWithSeparators);

	const dispatch = createEventDispatcher();
	const SEPARATOR = '-------sep sep sep-------';
	const MAX_CHARS = 280;

	function splitIntoThreads(text: string): string[] {
		if (text.includes(SEPARATOR)) {
			return text.split(SEPARATOR);
		}
		const blocks: string[] = [];
		const lines = text.split('\n');
		let currentBlock = '';

		for (const line of lines) {
			if (currentBlock.length + line.length + 1 <= MAX_CHARS) {
				currentBlock += (currentBlock ? '\n' : '') + line;
			} else {
				if (currentBlock) blocks.push(currentBlock);
				currentBlock = line;
			}
		}
		if (currentBlock) blocks.push(currentBlock);
		return blocks.length > 0 ? blocks : [''];
	}

	function removeSeparators(text: string): string {
		return text.split(SEPARATOR).join('\n\n');
	}

	function updateEditingContent(field: keyof ContentItem, value: string) {
		editingContent = { ...editingContent, [field]: value };
		if (field === 'content_text') {
			contentTextWithSeparators = value;
			contentTextWithoutSeparators = removeSeparators(value);
			threadBlocks = splitIntoThreads(value);
		}
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

	function toggleThreadView() {
		if (isThreadView) {
			threadBlocks = splitIntoThreads(contentTextWithSeparators);
		} else {
			contentTextWithSeparators = threadBlocks.join(SEPARATOR);
			contentTextWithoutSeparators = removeSeparators(contentTextWithSeparators);
		}
	}

	function updateThreadBlock(index: number, value: string) {
		threadBlocks[index] = value;
		threadBlocks = [...threadBlocks];
		contentTextWithSeparators = threadBlocks.join(SEPARATOR);
		contentTextWithoutSeparators = removeSeparators(contentTextWithSeparators);
		updateEditingContent('content_text', contentTextWithSeparators);
	}

	function addThreadBlock() {
		threadBlocks = [...threadBlocks, ''];
		contentTextWithSeparators = threadBlocks.join(SEPARATOR);
		contentTextWithoutSeparators = removeSeparators(contentTextWithSeparators);
		updateEditingContent('content_text', contentTextWithSeparators);
	}

	function confirmDeleteBlock(index: number) {
		if (threadBlocks[index].trim()) {
			blockToDelete = index;
			showDeleteConfirmation = true;
		} else {
			deleteThreadBlock(index);
		}
	}

	function deleteThreadBlock(index: number) {
		threadBlocks = threadBlocks.filter((_, i) => i !== index);
		contentTextWithSeparators = threadBlocks.join(SEPARATOR);
		contentTextWithoutSeparators = removeSeparators(contentTextWithSeparators);
		updateEditingContent('content_text', contentTextWithSeparators);
		showDeleteConfirmation = false;
		blockToDelete = null;
	}

	function handleContentTextInput(event: Event) {
		const value = (event.target as HTMLTextAreaElement).value;
		contentTextWithoutSeparators = value;
		contentTextWithSeparators = value;
		updateEditingContent('content_text', contentTextWithSeparators);
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		formData.set('content_text', contentTextWithSeparators);

		fetch(contentItem ? '?/updateContent' : '?/createContent', {
			method: 'POST',
			body: formData
		}).then(async (response) => {
			const result = await response.json();
			if (result.type === 'success') {
				dispatch('contentUpdated', result.data);
			}
		});
	}
	$: scheduledDateValue = formatDateForInput(editingContent.scheduled_date);
</script>

<form on:submit={handleSubmit} method="POST" class="!my-0 mx-auto w-full max-w-4xl space-y-6 !pt-0">
	{#if contentItem}
		<input type="hidden" name="id" value={contentItem.id} />
	{/if}

	<Accordion flush class="!mt-0 pt-0">
		<AccordionItem class="!mt-0 pt-0">
			<span slot="header" class="!mt-0 pt-0"
				>{campaigns.find((c) => c.id === editingContent.campaign_id)?.name || 'No Campaign'}- {new Date(
					scheduledDateValue
				)
					.toISOString()
					.split('T')[0]}</span
			>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-4">
					{#if !contentItem}
						<Label class="space-y-2">
							<span class="text-sm font-medium text-gray-700">Select Template</span>
							<Select on:change={handleTemplateSelection} class="w-full">
								<option value="">No Template</option>
								{#each templates as template}
									<option value={template.id}
										>{template.type} - {template.purpose_description}</option
									>
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
							on:input={(e) =>
								updateEditingContent('content_promotion_accounts', e.currentTarget.value)}
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
		</AccordionItem>
	</Accordion>

	<div class="mx-auto max-w-[700px] space-y-2">
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium text-gray-700">Content Text</span>
			<Toggle bind:checked={isThreadView} on:change={toggleThreadView} class="mr-2"
				>Thread View</Toggle
			>
		</div>
		{#if isThreadView}
			{#each threadBlocks as block, index}
				<div class="relative">
					<Textarea
						value={block}
						on:input={(e) => updateThreadBlock(index, e.currentTarget.value)}
						rows="6"
						class="w-full resize-y {block.length > MAX_CHARS ? 'border-red-500' : ''}"
					/>
					<div
						class="absolute bottom-2 left-2 text-sm {block.length > MAX_CHARS
							? 'text-red-500'
							: 'text-gray-500'}"
					>
						{block.length}/{MAX_CHARS}
						<button
							type="button"
							color="red"
							class="mx-1 hover:text-red-500"
							on:click={() => confirmDeleteBlock(index)}>Delete</button
						>
					</div>
				</div>
			{/each}
			<Button on:click={addThreadBlock} class="mt-2">Add Tweet</Button>
		{:else}
			<Textarea
				name="content_text"
				value={contentTextWithoutSeparators}
				on:input={handleContentTextInput}
				required
				rows="8"
				class="w-full resize-y"
			/>
		{/if}
	</div>

	<div class="flex justify-end space-x-4">
		<Button type="submit" class="px-6 py-2">{contentItem ? 'Update' : 'Create'} Content</Button>
		<Button color="alternative" on:click={handleCancel} class="px-6 py-2">Cancel</Button>
	</div>
</form>

<Modal bind:open={showDeleteConfirmation} size="sm">
	<div class="text-center">
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this tweet?
		</h3>
		<div class="flex justify-center gap-4">
			<Button color="red" on:click={() => deleteThreadBlock(blockToDelete)}>Yes, I'm sure</Button>
			<Button color="alternative" on:click={() => (showDeleteConfirmation = false)}>
				No, cancel
			</Button>
		</div>
	</div>
</Modal>
