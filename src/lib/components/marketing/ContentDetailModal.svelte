<!-- src/lib/components/marketing/ContentDetailModal.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { Button, Badge, Modal, Input, Label, Textarea, Select, Toggle } from 'flowbite-svelte';
	import type { ContentItem, Campaign, Template } from '$lib/types/marketing';

	export let open = false;
	export let contentItem: ContentItem | null = null;
	export let campaigns: Campaign[] = [];
	export let templates: Template[] = [];

	const dispatch = createEventDispatcher();

	let isEditMode = false;
	let editingContent: ContentItem | null = null;
	let isThreadView = false;
	let threadBlocks: string[] = [];
	let isSaving = false;

	const SEPARATOR = '-------sep sep sep-------';
	const MAX_CHARS = 280;

	// Platform colors
	const platformColors: Record<string, { bg: string; text: string; border: string }> = {
		twitter: { bg: '#1DA1F2', text: 'white', border: '#1a8cd8' },
		instagram: { bg: '#E1306C', text: 'white', border: '#c13584' },
		linkedin: { bg: '#0077B5', text: 'white', border: '#006097' },
		facebook: { bg: '#4267B2', text: 'white', border: '#365899' }
	};

	$: if (contentItem && open) {
		editingContent = { ...contentItem };
		isEditMode = false;
		isThreadView = false;
		threadBlocks = splitIntoThreads(contentItem.content_text || '');
	}

	$: campaign = contentItem ? campaigns.find((c) => c.id === contentItem.campaign_id) : null;
	$: platformStyle = contentItem
		? platformColors[contentItem.platform?.toLowerCase()] || platformColors.twitter
		: platformColors.twitter;

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

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatTime(dateStr: string) {
		return new Date(dateStr).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	function formatDateForInput(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toISOString().slice(0, 16);
	}

	function getStatusColor(
		status: string | undefined
	): 'blue' | 'green' | 'yellow' | 'red' | 'dark' {
		switch (status) {
			case 'scheduled':
				return 'blue';
			case 'published':
			case 'posted':
				return 'green';
			case 'pending':
			case 'draft':
				return 'yellow';
			case 'cancelled':
				return 'red';
			default:
				return 'dark';
		}
	}

	function enterEditMode() {
		editingContent = contentItem ? { ...contentItem } : null;
		isEditMode = true;
	}

	function cancelEdit() {
		editingContent = contentItem ? { ...contentItem } : null;
		isEditMode = false;
		isThreadView = false;
	}

	function updateField(field: keyof ContentItem, value: string) {
		if (editingContent) {
			editingContent = { ...editingContent, [field]: value };
			if (field === 'content_text') {
				threadBlocks = splitIntoThreads(value);
			}
		}
	}

	function updateThreadBlock(index: number, value: string) {
		threadBlocks[index] = value;
		threadBlocks = [...threadBlocks];
		if (editingContent) {
			editingContent.content_text = threadBlocks.join(SEPARATOR);
		}
	}

	function addThreadBlock() {
		threadBlocks = [...threadBlocks, ''];
		if (editingContent) {
			editingContent.content_text = threadBlocks.join(SEPARATOR);
		}
	}

	function removeThreadBlock(index: number) {
		threadBlocks = threadBlocks.filter((_, i) => i !== index);
		if (editingContent) {
			editingContent.content_text = threadBlocks.join(SEPARATOR);
		}
	}

	async function saveChanges() {
		if (!editingContent) return;

		isSaving = true;

		const formData = new FormData();
		formData.set('id', editingContent.id);
		formData.set('content_text', editingContent.content_text);
		formData.set('scheduled_date', editingContent.scheduled_date);
		formData.set('platform', editingContent.platform);
		formData.set('status', editingContent.status || 'scheduled');
		if (editingContent.campaign_id) formData.set('campaign_id', editingContent.campaign_id);
		if (editingContent.content_hashtags)
			formData.set('content_hashtags', editingContent.content_hashtags);
		if (editingContent.content_themes)
			formData.set('content_themes', editingContent.content_themes);
		if (editingContent.content_promotion_accounts)
			formData.set('content_promotion_accounts', editingContent.content_promotion_accounts);

		try {
			const response = await fetch('?/updateContent', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.type === 'success') {
				dispatch('contentUpdated', editingContent);
				isEditMode = false;
			}
		} catch (err) {
			console.error('Failed to save:', err);
		} finally {
			isSaving = false;
		}
	}

	function closeModal() {
		open = false;
		isEditMode = false;
		dispatch('close');
	}

	function handleCopy() {
		if (contentItem?.content_text) {
			navigator.clipboard.writeText(
				contentItem.content_text.replace(new RegExp(SEPARATOR, 'g'), '\n\n')
			);
		}
	}
</script>

<Modal bind:open size="xl" autoclose={false} class="content-detail-modal" outsideclose>
	{#if contentItem}
		<!-- Header -->
		<div class="modal-header" style="border-bottom-color: {platformStyle.bg}">
			<div class="header-left">
				<div class="platform-badge" style="background-color: {platformStyle.bg}">
					{#if contentItem.platform?.toLowerCase() === 'twitter'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
							/>
						</svg>
					{:else if contentItem.platform?.toLowerCase() === 'instagram'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"
							/>
							<circle cx="12" cy="12" r="3.5" />
						</svg>
					{:else if contentItem.platform?.toLowerCase() === 'linkedin'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
						</svg>
					{/if}
				</div>
				<div class="header-info">
					<span class="platform-name">{contentItem.platform}</span>
					<Badge color={getStatusColor(contentItem.status)} rounded
						>{contentItem.status || 'draft'}</Badge
					>
				</div>
			</div>
			<div class="header-actions">
				{#if !isEditMode}
					<button class="icon-btn" on:click={handleCopy} title="Copy content">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
							<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
						</svg>
					</button>
					<Button size="sm" color="blue" on:click={enterEditMode}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="mr-1"
						>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
						Edit
					</Button>
				{:else}
					<Button size="sm" color="alternative" on:click={cancelEdit}>Cancel</Button>
					<Button size="sm" color="blue" on:click={saveChanges} disabled={isSaving}>
						{#if isSaving}
							<svg
								class="mr-1 h-4 w-4 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Saving...
						{:else}
							Save Changes
						{/if}
					</Button>
				{/if}
			</div>
		</div>

		<div class="modal-body">
			{#if !isEditMode}
				<!-- View Mode -->
				<div class="content-view" transition:fade={{ duration: 150 }}>
					<!-- Schedule Info -->
					<div class="schedule-banner">
						<div class="schedule-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
								<line x1="16" x2="16" y1="2" y2="6" />
								<line x1="8" x2="8" y1="2" y2="6" />
								<line x1="3" x2="21" y1="10" y2="10" />
							</svg>
						</div>
						<div class="schedule-details">
							<span class="schedule-date">{formatDate(contentItem.scheduled_date)}</span>
							<span class="schedule-time">{formatTime(contentItem.scheduled_date)}</span>
						</div>
						{#if campaign}
							<div
								class="campaign-badge"
								style="background-color: {campaign.color}15; border-color: {campaign.color}; color: {campaign.color}"
							>
								{campaign.name}
							</div>
						{/if}
					</div>

					<!-- Content Preview -->
					<div class="content-preview-section">
						<h4>Content</h4>
						<div class="content-text">
							{#each contentItem.content_text.split(SEPARATOR) as block, i}
								{#if contentItem.content_text.includes(SEPARATOR)}
									<div class="thread-block">
										<span class="thread-number">{i + 1}</span>
										<p>{block}</p>
										<span class="char-count">{block.length}/{MAX_CHARS}</span>
									</div>
								{:else}
									<p>{block}</p>
								{/if}
							{/each}
						</div>
					</div>

					<!-- Metadata Grid -->
					<div class="metadata-grid">
						{#if contentItem.content_hashtags}
							<div class="metadata-item">
								<span class="metadata-label">Hashtags</span>
								<div class="hashtags-list">
									{#each contentItem.content_hashtags.split(' ') as tag}
										<span class="hashtag">{tag}</span>
									{/each}
								</div>
							</div>
						{/if}

						{#if contentItem.content_themes}
							<div class="metadata-item">
								<span class="metadata-label">Themes</span>
								<span class="metadata-value">{contentItem.content_themes}</span>
							</div>
						{/if}

						{#if contentItem.content_promotion_accounts}
							<div class="metadata-item">
								<span class="metadata-label">Mentions</span>
								<span class="metadata-value">{contentItem.content_promotion_accounts}</span>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<!-- Edit Mode -->
				<div class="content-edit" transition:fade={{ duration: 150 }}>
					<div class="edit-grid">
						<!-- Left Column: Metadata -->
						<div class="edit-sidebar">
							<div class="edit-section">
								<Label class="edit-label">
									<span>Scheduled Date & Time</span>
									<Input
										type="datetime-local"
										value={formatDateForInput(editingContent?.scheduled_date || '')}
										on:input={(e) => updateField('scheduled_date', e.currentTarget.value)}
									/>
								</Label>

								<Label class="edit-label">
									<span>Platform</span>
									<Select
										value={editingContent?.platform || 'twitter'}
										on:change={(e) => updateField('platform', e.currentTarget.value)}
									>
										<option value="twitter">Twitter / X</option>
										<option value="instagram">Instagram</option>
										<option value="linkedin">LinkedIn</option>
										<option value="facebook">Facebook</option>
									</Select>
								</Label>

								<Label class="edit-label">
									<span>Status</span>
									<Select
										value={editingContent?.status || 'scheduled'}
										on:change={(e) => updateField('status', e.currentTarget.value)}
									>
										<option value="scheduled">Scheduled</option>
										<option value="draft">Draft</option>
										<option value="pending">Pending Review</option>
										<option value="published">Published</option>
										<option value="cancelled">Cancelled</option>
									</Select>
								</Label>

								<Label class="edit-label">
									<span>Campaign</span>
									<Select
										value={editingContent?.campaign_id || ''}
										on:change={(e) => updateField('campaign_id', e.currentTarget.value)}
									>
										<option value="">No Campaign</option>
										{#each campaigns as campaign}
											<option value={campaign.id}>{campaign.name}</option>
										{/each}
									</Select>
								</Label>
							</div>

							<div class="edit-section">
								<Label class="edit-label">
									<span>Hashtags</span>
									<Input
										type="text"
										value={editingContent?.content_hashtags || ''}
										on:input={(e) => updateField('content_hashtags', e.currentTarget.value)}
										placeholder="#hashtag1 #hashtag2"
									/>
								</Label>

								<Label class="edit-label">
									<span>Themes</span>
									<Input
										type="text"
										value={editingContent?.content_themes || ''}
										on:input={(e) => updateField('content_themes', e.currentTarget.value)}
										placeholder="theme1, theme2"
									/>
								</Label>

								<Label class="edit-label">
									<span>Mentions</span>
									<Input
										type="text"
										value={editingContent?.content_promotion_accounts || ''}
										on:input={(e) =>
											updateField('content_promotion_accounts', e.currentTarget.value)}
										placeholder="@account1 @account2"
									/>
								</Label>
							</div>
						</div>

						<!-- Right Column: Content -->
						<div class="edit-main">
							<div class="content-header">
								<span class="content-title">Content</span>
								<Toggle bind:checked={isThreadView}>Thread Mode</Toggle>
							</div>

							{#if isThreadView}
								<div class="thread-editor" transition:slide={{ duration: 200 }}>
									{#each threadBlocks as block, index}
										<div class="thread-edit-block">
											<div class="thread-edit-header">
												<span class="thread-label">Tweet {index + 1}</span>
												{#if threadBlocks.length > 1}
													<button
														class="remove-thread-btn"
														on:click={() => removeThreadBlock(index)}
													>
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
												{/if}
											</div>
											<Textarea
												value={block}
												on:input={(e) => updateThreadBlock(index, e.currentTarget.value)}
												rows="4"
												class={block.length > MAX_CHARS ? 'border-red-500' : ''}
											/>
											<div class="thread-char-count" class:over-limit={block.length > MAX_CHARS}>
												{block.length}/{MAX_CHARS}
											</div>
										</div>
									{/each}
									<button class="add-thread-btn" on:click={addThreadBlock}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M5 12h14" /><path d="M12 5v14" />
										</svg>
										Add Tweet
									</button>
								</div>
							{:else}
								<Textarea
									value={editingContent?.content_text?.replace(
										new RegExp(SEPARATOR, 'g'),
										'\n\n'
									) || ''}
									on:input={(e) => updateField('content_text', e.currentTarget.value)}
									rows="12"
									placeholder="Write your content here..."
									class="content-textarea"
								/>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</Modal>

<style>
	:global(.content-detail-modal) {
		max-width: 900px !important;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 3px solid;
		margin: -1.25rem -1.25rem 0 -1.25rem;
		background: var(--hover-background, #f8fafc);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.platform-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 0.5rem;
		color: white;
	}

	.header-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.platform-name {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text-primary, #1e293b);
		text-transform: capitalize;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color, #e2e8f0);
		background: var(--card-background, #fff);
		color: var(--text-secondary, #64748b);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.icon-btn:hover {
		color: var(--primary, #3b82f6);
		border-color: var(--primary, #3b82f6);
	}

	.modal-body {
		padding: 1.25rem 0 0 0;
	}

	/* View Mode Styles */
	.content-view {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.schedule-banner {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
	}

	.schedule-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--primary, #3b82f6);
		color: white;
		border-radius: 0.5rem;
	}

	.schedule-details {
		display: flex;
		flex-direction: column;
	}

	.schedule-date {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text-primary, #1e293b);
	}

	.schedule-time {
		font-size: 0.875rem;
		color: var(--text-secondary, #64748b);
	}

	.campaign-badge {
		margin-left: auto;
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 9999px;
		border: 1px solid;
	}

	.content-preview-section {
		padding: 1rem;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
	}

	.content-preview-section h4 {
		margin: 0 0 0.75rem 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.content-text {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-primary, #1e293b);
	}

	.content-text p {
		margin: 0;
		white-space: pre-wrap;
	}

	.thread-block {
		position: relative;
		padding: 1rem;
		padding-left: 2.5rem;
		margin-bottom: 0.75rem;
		background: var(--hover-background, #f8fafc);
		border-radius: 0.5rem;
		border-left: 3px solid var(--primary, #3b82f6);
	}

	.thread-number {
		position: absolute;
		left: 0.75rem;
		top: 1rem;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary, #3b82f6);
		color: white;
		border-radius: 50%;
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.char-count {
		position: absolute;
		right: 0.75rem;
		bottom: 0.5rem;
		font-size: 0.6875rem;
		color: var(--text-secondary, #94a3b8);
	}

	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.metadata-item {
		padding: 0.75rem 1rem;
		background: var(--hover-background, #f8fafc);
		border-radius: 0.5rem;
	}

	.metadata-label {
		display: block;
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.375rem;
	}

	.metadata-value {
		font-size: 0.875rem;
		color: var(--text-primary, #1e293b);
	}

	.hashtags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.hashtag {
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		background: rgba(59, 130, 246, 0.1);
		color: var(--primary, #3b82f6);
		border-radius: 0.25rem;
	}

	/* Edit Mode Styles */
	.content-edit {
		padding: 0;
	}

	.edit-grid {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 1.5rem;
	}

	.edit-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.edit-section {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		padding: 1rem;
		background: var(--hover-background, #f8fafc);
		border-radius: 0.75rem;
	}

	.edit-label {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.edit-label span {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-primary, #1e293b);
	}

	.edit-main {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.content-title {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	:global(.content-textarea) {
		min-height: 300px;
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	.thread-editor {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.thread-edit-block {
		padding: 0.75rem;
		background: var(--hover-background, #f8fafc);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
	}

	.thread-edit-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.thread-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
	}

	.remove-thread-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: transparent;
		border: none;
		color: var(--text-secondary, #94a3b8);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.15s ease;
	}

	.remove-thread-btn:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.thread-char-count {
		text-align: right;
		font-size: 0.6875rem;
		color: var(--text-secondary, #94a3b8);
		margin-top: 0.25rem;
	}

	.thread-char-count.over-limit {
		color: #ef4444;
		font-weight: 600;
	}

	.add-thread-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--primary, #3b82f6);
		background: transparent;
		border: 1px dashed var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.add-thread-btn:hover {
		background: rgba(59, 130, 246, 0.05);
		border-color: var(--primary, #3b82f6);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.edit-grid {
			grid-template-columns: 1fr;
		}

		.schedule-banner {
			flex-wrap: wrap;
		}

		.campaign-badge {
			margin-left: 0;
			margin-top: 0.5rem;
			width: 100%;
			text-align: center;
		}
	}

	/* Dark Mode */
	@media (prefers-color-scheme: dark) {
		.modal-header {
			background: #111827;
		}

		.platform-name {
			color: #f9fafb;
		}

		.icon-btn {
			background: #1f2937;
			border-color: #374151;
		}

		.schedule-banner {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
			border-color: #374151;
		}

		.schedule-date {
			color: #f9fafb;
		}

		.content-preview-section {
			background: #1f2937;
			border-color: #374151;
		}

		.content-text {
			color: #f9fafb;
		}

		.thread-block {
			background: #111827;
		}

		.metadata-item {
			background: #111827;
		}

		.metadata-value {
			color: #f9fafb;
		}

		.edit-section {
			background: #111827;
		}

		.edit-label span {
			color: #f9fafb;
		}

		.content-title {
			color: #f9fafb;
		}

		.thread-edit-block {
			background: #111827;
			border-color: #374151;
		}
	}
</style>
