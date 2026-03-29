<!-- src/lib/components/marketing/TemplateManager.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import type { Template } from '$lib/types/marketing';

	let { templates }: { templates: Template[] } = $props();

	let editingTemplate: Partial<Template> | null = $state(null);
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let searchTerm = $state('');
	let showDeleteConfirm = $state(false);
	let templateToDelete: Template | null = $state(null);

	let filteredTemplates = $derived(
		templates.filter(
			(t) =>
				searchTerm === '' ||
				t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
				t.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(t.purpose_description &&
					t.purpose_description.toLowerCase().includes(searchTerm.toLowerCase()))
		)
	);

	let groupedTemplates = $derived(
		filteredTemplates.reduce(
			(acc, template) => {
				const type = template.type || 'Other';
				if (!acc[type]) acc[type] = [];
				acc[type].push(template);
				return acc;
			},
			{} as Record<string, Template[]>
		)
	);

	function openCreateModal() {
		showCreateModal = true;
	}

	function closeCreateModal() {
		showCreateModal = false;
	}

	function openEditModal(template: Template) {
		editingTemplate = { ...template };
		showEditModal = true;
	}

	function closeEditModal() {
		editingTemplate = null;
		showEditModal = false;
	}

	function confirmDelete(template: Template) {
		templateToDelete = template;
		showDeleteConfirm = true;
	}

	function cancelDelete() {
		templateToDelete = null;
		showDeleteConfirm = false;
	}

	function handleCreateTemplate() {
		return ({ result }: any) => {
			if (result.type === 'success') {
				closeCreateModal();
				templates = [...templates, result.data.template];
			}
		};
	}

	function handleUpdateTemplate() {
		return ({ result }: any) => {
			if (result.type === 'success') {
				closeEditModal();
				const index = templates.findIndex((t) => t.id === result.data.template.id);
				if (index !== -1) {
					templates[index] = result.data.template;
					templates = [...templates];
				}
			}
		};
	}

	function handleDeleteTemplate(deletedTemplateId: string) {
		templates = templates.filter((template) => template.id !== deletedTemplateId);
		showDeleteConfirm = false;
		templateToDelete = null;
	}

	function truncateText(text: string, maxLength: number): string {
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}
</script>

<div class="template-manager">
	<!-- Header -->
	<div class="manager-header">
		<div class="header-left">
			<h2>Content Templates</h2>
			<span class="template-count">{templates.length} templates</span>
		</div>
		<div class="header-right">
			<div class="search-wrapper">
				<svg
					class="search-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				<input
					type="search"
					bind:value={searchTerm}
					placeholder="Search templates..."
					class="search-input"
				/>
			</div>
			<button class="btn btn-primary" onclick={openCreateModal}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
				New Template
			</button>
		</div>
	</div>

	<!-- Templates Grid -->
	{#if filteredTemplates.length > 0}
		{#each Object.entries(groupedTemplates) as [type, typeTemplates]}
			<div class="type-section" transition:slide={{ duration: 200 }}>
				<div class="type-header">
					<h3>{type}</h3>
					<span class="type-count">{typeTemplates.length}</span>
				</div>
				<div class="templates-grid">
					{#each typeTemplates as template (template.id)}
						<div class="template-card" transition:fade={{ duration: 150 }}>
							<div class="card-header">
								<span class="type-badge">{template.type}</span>
							</div>

							<div class="card-body">
								<p class="content-preview">{truncateText(template.content_text, 120)}</p>
								{#if template.purpose_description}
									<p class="purpose-text">
										<span class="purpose-label">Purpose:</span>
										{truncateText(template.purpose_description, 80)}
									</p>
								{/if}
							</div>

							<div class="card-actions">
								<button class="action-btn edit" onclick={() => openEditModal(template)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
									</svg>
									Edit
								</button>
								<button class="action-btn delete" onclick={() => confirmDelete(template)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<polyline points="3 6 5 6 21 6" />
										<path
											d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
										/>
									</svg>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<div class="empty-state" transition:fade={{ duration: 150 }}>
			<div class="empty-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<rect width="18" height="7" x="3" y="3" rx="1" />
					<rect width="9" height="7" x="3" y="14" rx="1" />
					<rect width="5" height="7" x="16" y="14" rx="1" />
				</svg>
			</div>
			{#if searchTerm}
				<h3>No templates match your search</h3>
				<p>Try a different search term</p>
				<button class="btn btn-secondary" onclick={() => (searchTerm = '')}>Clear Search</button>
			{:else}
				<h3>No templates yet</h3>
				<p>Create reusable content templates to speed up your workflow</p>
				<button class="btn btn-primary" onclick={openCreateModal}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					Create Template
				</button>
			{/if}
		</div>
	{/if}
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div class="modal-overlay" onclick={closeCreateModal} role="presentation">
		<div class="modal-dialog modal-lg" onclick={(e) => e.stopPropagation()} role="dialog">
			<h3 class="modal-title">Create New Template</h3>
			<form
				action="?/createTemplate"
				method="POST"
				use:enhance={handleCreateTemplate}
				class="modal-form"
			>
				<label class="field">
					<span class="field-label">Type / Category</span>
					<input
						type="text"
						name="type"
						required
						placeholder="e.g., Tweet, Thread Opener, CTA"
						class="field-input"
					/>
				</label>
				<label class="field">
					<span class="field-label">Content Text</span>
					<textarea
						name="content_text"
						required
						rows="6"
						placeholder="Enter your template content..."
						class="field-input field-textarea"
					></textarea>
				</label>
				<label class="field">
					<span class="field-label">Purpose Description</span>
					<textarea
						name="purpose_description"
						required
						rows="3"
						placeholder="Describe when to use this template..."
						class="field-input field-textarea"
					></textarea>
				</label>
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={closeCreateModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">Create Template</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && editingTemplate}
	<div class="modal-overlay" onclick={closeEditModal} role="presentation">
		<div class="modal-dialog modal-lg" onclick={(e) => e.stopPropagation()} role="dialog">
			<h3 class="modal-title">Edit Template</h3>
			<form
				action="?/updateTemplate"
				method="POST"
				use:enhance={handleUpdateTemplate}
				class="modal-form"
			>
				<input type="hidden" name="id" value={editingTemplate.id} />
				<label class="field">
					<span class="field-label">Type / Category</span>
					<input
						type="text"
						name="type"
						bind:value={editingTemplate.type}
						required
						class="field-input"
					/>
				</label>
				<label class="field">
					<span class="field-label">Content Text</span>
					<textarea
						name="content_text"
						bind:value={editingTemplate.content_text}
						required
						rows="6"
						class="field-input field-textarea"
					></textarea>
				</label>
				<label class="field">
					<span class="field-label">Purpose Description</span>
					<textarea
						name="purpose_description"
						bind:value={editingTemplate.purpose_description}
						required
						rows="3"
						class="field-input field-textarea"
					></textarea>
				</label>
				<div class="modal-actions">
					<button type="button" class="btn btn-secondary" onclick={closeEditModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">Save Changes</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm && templateToDelete}
	<div class="modal-overlay" onclick={cancelDelete} role="presentation">
		<div class="modal-dialog modal-sm" onclick={(e) => e.stopPropagation()} role="dialog">
			<div class="delete-confirm-content">
				<div class="delete-icon-wrapper">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
						stroke="#ef4444"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h3 class="modal-title">Delete Template?</h3>
				<p class="delete-message">
					This will permanently delete "{templateToDelete.type}". This action cannot be undone.
				</p>
				<div class="modal-actions modal-actions-center">
					<button class="btn btn-secondary" onclick={cancelDelete}>Cancel</button>
					<form
						action="?/deleteTemplate"
						method="POST"
						use:enhance={() => {
							return ({ result }) => {
								if (result.type === 'success' && templateToDelete) {
									handleDeleteTemplate(templateToDelete.id);
								}
							};
						}}
					>
						<input type="hidden" name="id" value={templateToDelete.id} />
						<button type="submit" class="btn btn-danger">Delete</button>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.template-manager {
		padding: 0;
	}

	.manager-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-left h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.template-count {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.search-wrapper {
		position: relative;
		width: 200px;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 0.75rem 0.5rem 2.25rem;
		font-size: 0.8125rem;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		color: var(--text-primary);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.type-section {
		margin-bottom: 1.5rem;
	}

	.type-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--bg-elevated);
	}

	.type-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.type-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 9999px;
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.templates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.template-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.15s ease;
	}

	.template-card:hover {
		border-color: var(--primary);
		box-shadow: var(--glow-sm);
	}

	.card-header {
		padding: 0.75rem 1rem;
		background: var(--bg-deep);
		border-bottom: 1px solid var(--bg-elevated);
	}

	.type-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		border-radius: 9999px;
		background: rgba(251, 113, 133, 0.15);
		color: #60a5fa;
	}

	.card-body {
		padding: 1rem;
	}

	.content-preview {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		color: var(--text-primary);
		line-height: 1.5;
	}

	.purpose-text {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.purpose-label {
		font-weight: 500;
	}

	.card-actions {
		display: flex;
		border-top: 1px solid var(--bg-elevated);
	}

	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.625rem;
		font-size: 0.8125rem;
		font-weight: 500;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn.edit {
		color: var(--primary);
		border-right: 1px solid var(--bg-elevated);
	}

	.action-btn.edit:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.action-btn.delete {
		color: #ef4444;
	}

	.action-btn.delete:hover {
		background: rgba(239, 68, 68, 0.1);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
	}

	.empty-icon {
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
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

	/* Modals */
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
		width: 90%;
	}

	.modal-lg {
		max-width: 600px;
	}

	.modal-sm {
		max-width: 400px;
	}

	.modal-title {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding-top: 0.5rem;
	}

	.modal-actions-center {
		justify-content: center;
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
	}

	.field-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.field-textarea {
		resize: vertical;
		min-height: 80px;
	}

	.delete-confirm-content {
		text-align: center;
	}

	.delete-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin: 0 auto 1rem;
		border-radius: 50%;
		background: rgba(239, 68, 68, 0.1);
	}

	.delete-message {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0 0 1.25rem 0;
	}

	@media (max-width: 768px) {
		.manager-header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-right {
			flex-direction: column;
			width: 100%;
		}

		.search-wrapper {
			width: 100%;
		}

		.templates-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
