<!-- src/lib/components/marketing/ContentEditor.svelte -->
<script lang="ts">
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';

	let {
		contentItem = null,
		campaigns = [],
		templates = [],
		oncontentUpdated,
		oncancel
	}: {
		contentItem?: ContentItem | null;
		campaigns?: Campaign[];
		templates?: Template[];
		oncontentUpdated?: (data: any) => void;
		oncancel?: () => void;
	} = $props();

	let editingContent: ContentItem = $state(contentItem ? { ...contentItem } : ({} as ContentItem));
	let selectedTemplate: Template | null = $state(null);
	let isThreadView = $state(false);
	let threadBlocks: string[] = $state([]);
	let showDeleteConfirmation = $state(false);
	let blockToDelete: number | null = $state(null);

	let contentTextWithSeparators: string = $state(editingContent.content_text || '');
	let contentTextWithoutSeparators: string = $state(removeSeparators(contentTextWithSeparators));

	const SEPARATOR = '-------sep sep sep-------';
	const MAX_CHARS = 280;

	let scheduledDateValue = $derived(formatDateForInput(editingContent.scheduled_date));
	let accordionOpen = $state(false);

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

	function formatDateForInput(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toISOString().slice(0, 16);
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
				oncontentUpdated?.(result.data);
			}
		});
	}
</script>

<form onsubmit={handleSubmit} method="POST" class="editor-form">
	{#if contentItem}
		<input type="hidden" name="id" value={contentItem.id} />
	{/if}

	<div class="accordion">
		<button type="button" class="accordion-header" onclick={() => (accordionOpen = !accordionOpen)}>
			<span>
				{campaigns.find((c) => c.id === editingContent.campaign_id)?.name || 'No Campaign'} - {new Date(
					scheduledDateValue
				)
					.toISOString()
					.split('T')[0]}
			</span>
			<svg
				class="accordion-chevron"
				class:accordion-open={accordionOpen}
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</button>

		{#if accordionOpen}
			<div class="accordion-content">
				<div class="form-grid">
					<div class="form-column">
						{#if !contentItem}
							<label class="field">
								<span class="field-label">Select Template</span>
								<select onchange={handleTemplateSelection} class="field-input">
									<option value="">No Template</option>
									{#each templates as template}
										<option value={template.id}
											>{template.type} - {template.purpose_description}</option
										>
									{/each}
								</select>
							</label>
						{/if}

						<label class="field">
							<span class="field-label">Scheduled Date</span>
							<input
								type="datetime-local"
								name="scheduled_date"
								value={scheduledDateValue}
								oninput={(e) => updateEditingContent('scheduled_date', e.currentTarget.value)}
								required
								class="field-input"
							/>
						</label>
						<label class="field">
							<span class="field-label">Platform</span>
							<select
								name="platform"
								value={editingContent.platform || ''}
								onchange={(e) => updateEditingContent('platform', e.currentTarget.value)}
								required
								class="field-input"
							>
								<option value="twitter">Twitter</option>
								<option value="instagram">Instagram</option>
								<option value="linkedin">LinkedIn</option>
							</select>
						</label>
						<label class="field">
							<span class="field-label">Campaign</span>
							<select
								name="campaign_id"
								value={editingContent.campaign_id || ''}
								onchange={(e) => updateEditingContent('campaign_id', e.currentTarget.value)}
								class="field-input"
							>
								<option value="">No Campaign</option>
								{#each campaigns as campaign}
									<option value={campaign.id}>{campaign.name}</option>
								{/each}
							</select>
						</label>
						{#if contentItem}
							<label class="field">
								<span class="field-label">Status</span>
								<select
									name="status"
									value={editingContent.status || ''}
									onchange={(e) => updateEditingContent('status', e.currentTarget.value)}
									required
									class="field-input"
								>
									<option value="scheduled">Scheduled</option>
									<option value="posted">Posted</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</label>
						{/if}
					</div>
					<div class="form-column">
						<label class="field">
							<span class="field-label">Content Promotion Accounts</span>
							<input
								type="text"
								name="content_promotion_accounts"
								value={editingContent.content_promotion_accounts || ''}
								oninput={(e) =>
									updateEditingContent('content_promotion_accounts', e.currentTarget.value)}
								class="field-input"
							/>
						</label>
						<label class="field">
							<span class="field-label">Content Hashtags</span>
							<input
								type="text"
								name="content_hashtags"
								value={editingContent.content_hashtags || ''}
								oninput={(e) => updateEditingContent('content_hashtags', e.currentTarget.value)}
								class="field-input"
							/>
						</label>
						<label class="field">
							<span class="field-label">Content Themes</span>
							<input
								type="text"
								name="content_themes"
								value={editingContent.content_themes || ''}
								oninput={(e) => updateEditingContent('content_themes', e.currentTarget.value)}
								class="field-input"
							/>
						</label>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="content-section">
		<div class="content-header">
			<span class="field-label">Content Text</span>
			<label class="toggle-label">
				<input
					type="checkbox"
					bind:checked={isThreadView}
					onchange={toggleThreadView}
					class="toggle-input"
				/>
				<span class="toggle-switch"></span>
				<span class="toggle-text">Thread View</span>
			</label>
		</div>
		{#if isThreadView}
			{#each threadBlocks as block, index}
				<div class="thread-block">
					<textarea
						value={block}
						oninput={(e) => updateThreadBlock(index, e.currentTarget.value)}
						rows="6"
						class="field-input field-textarea"
						class:over-limit={block.length > MAX_CHARS}
					></textarea>
					<div class="thread-footer" class:over-limit={block.length > MAX_CHARS}>
						{block.length}/{MAX_CHARS}
						<button type="button" class="delete-link" onclick={() => confirmDeleteBlock(index)}>
							Delete
						</button>
					</div>
				</div>
			{/each}
			<button type="button" class="btn btn-secondary" onclick={addThreadBlock}>Add Tweet</button>
		{:else}
			<textarea
				name="content_text"
				value={contentTextWithoutSeparators}
				oninput={handleContentTextInput}
				required
				rows="8"
				class="field-input field-textarea"
			></textarea>
		{/if}
	</div>

	<div class="form-actions">
		<button type="submit" class="btn btn-primary">
			{contentItem ? 'Update' : 'Create'} Content
		</button>
		<button type="button" class="btn btn-secondary" onclick={() => oncancel?.()}>Cancel</button>
	</div>
</form>

{#if showDeleteConfirmation}
	<div class="modal-overlay" onclick={() => (showDeleteConfirmation = false)} role="presentation">
		<div class="modal-dialog" onclick={(e) => e.stopPropagation()} role="dialog">
			<h3 class="modal-title">Are you sure you want to delete this tweet?</h3>
			<div class="modal-actions">
				<button class="btn btn-danger" onclick={() => deleteThreadBlock(blockToDelete!)}>
					Yes, I'm sure
				</button>
				<button class="btn btn-secondary" onclick={() => (showDeleteConfirmation = false)}>
					No, cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.editor-form {
		width: 100%;
		max-width: 56rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.accordion {
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	.accordion-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--bg-surface);
		border: none;
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.accordion-header:hover {
		background: var(--bg-elevated);
	}

	.accordion-chevron {
		transition: transform 0.2s ease;
	}

	.accordion-chevron.accordion-open {
		transform: rotate(180deg);
	}

	.accordion-content {
		padding: 1rem;
		border-top: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.form-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
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
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		color: var(--text-primary);
		transition: border-color 0.15s ease;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.field-textarea {
		resize: vertical;
		min-height: 80px;
	}

	.field-input.over-limit {
		border-color: #ef4444;
	}

	.content-section {
		max-width: 700px;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.toggle-input {
		display: none;
	}

	.toggle-switch {
		position: relative;
		width: 36px;
		height: 20px;
		background: var(--bg-elevated);
		border-radius: 10px;
		transition: background 0.2s ease;
	}

	.toggle-switch::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		background: white;
		border-radius: 50%;
		transition: transform 0.2s ease;
	}

	.toggle-input:checked + .toggle-switch {
		background: var(--primary);
	}

	.toggle-input:checked + .toggle-switch::after {
		transform: translateX(16px);
	}

	.toggle-text {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.thread-block {
		position: relative;
		margin-bottom: 0.5rem;
	}

	.thread-footer {
		font-size: 0.75rem;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.25rem 0.5rem;
	}

	.thread-footer.over-limit {
		color: #ef4444;
	}

	.delete-link {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.75rem;
		padding: 0;
	}

	.delete-link:hover {
		color: #ef4444;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.btn {
		padding: 0.5rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-primary:hover {
		filter: brightness(1.1);
		box-shadow: var(--glow-sm);
	}

	.btn-secondary {
		background: var(--bg-elevated);
		color: var(--text-primary);
	}

	.btn-secondary:hover {
		background: var(--bg-highlight);
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover {
		background: #dc2626;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.modal-dialog {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 1.5rem;
		max-width: 400px;
		width: 90%;
		text-align: center;
	}

	.modal-title {
		margin: 0 0 1.25rem 0;
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.modal-actions {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
	}

	@media (max-width: 768px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
