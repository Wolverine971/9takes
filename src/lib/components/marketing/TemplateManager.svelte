<!-- src/lib/components/marketing/TemplateManager.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Input, Label, Textarea, Modal, Badge } from 'flowbite-svelte';
	import { fade, slide } from 'svelte/transition';
	import type { Template } from '$lib/types/marketing';

	export let templates: Template[];

	let editingTemplate: Partial<Template> | null = null;
	let showCreateModal = false;
	let showEditModal = false;
	let searchTerm = '';
	let showDeleteConfirm = false;
	let templateToDelete: Template | null = null;

	// Group templates by type
	$: filteredTemplates = templates.filter(
		(t) =>
			searchTerm === '' ||
			t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			t.content_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(t.purpose_description &&
				t.purpose_description.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	$: groupedTemplates = filteredTemplates.reduce(
		(acc, template) => {
			const type = template.type || 'Other';
			if (!acc[type]) acc[type] = [];
			acc[type].push(template);
			return acc;
		},
		{} as Record<string, Template[]>
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

	function handleCreateTemplate(event: SubmitEvent) {
		return ({ result }) => {
			if (result.type === 'success') {
				closeCreateModal();
				templates = [...templates, result.data.template];
			}
		};
	}

	function handleUpdateTemplate() {
		return ({ result }) => {
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
			<Button on:click={openCreateModal} size="sm" color="blue">
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
					<path d="M5 12h14" />
					<path d="M12 5v14" />
				</svg>
				New Template
			</Button>
		</div>
	</div>

	<!-- Templates Grid -->
	{#if filteredTemplates.length > 0}
		{#each Object.entries(groupedTemplates) as [type, typeTemplates]}
			<div class="type-section" transition:slide={{ duration: 200 }}>
				<div class="type-header">
					<h3>{type}</h3>
					<Badge color="dark" rounded>{typeTemplates.length}</Badge>
				</div>
				<div class="templates-grid">
					{#each typeTemplates as template (template.id)}
						<div class="template-card" transition:fade={{ duration: 150 }}>
							<div class="card-header">
								<Badge color="blue" rounded>{template.type}</Badge>
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
								<button class="action-btn edit" on:click={() => openEditModal(template)}>
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
								<button class="action-btn delete" on:click={() => confirmDelete(template)}>
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
		<!-- Empty State -->
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
				<Button color="alternative" size="sm" on:click={() => (searchTerm = '')}
					>Clear Search</Button
				>
			{:else}
				<h3>No templates yet</h3>
				<p>Create reusable content templates to speed up your workflow</p>
				<Button color="blue" size="sm" on:click={openCreateModal}>
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
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					Create Template
				</Button>
			{/if}
		</div>
	{/if}
</div>

<!-- Create Modal -->
<Modal bind:open={showCreateModal} size="lg" autoclose={false} class="w-full">
	<h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create New Template</h3>
	<form
		action="?/createTemplate"
		method="POST"
		use:enhance={handleCreateTemplate}
		class="space-y-4"
	>
		<Label class="space-y-2">
			<span>Type / Category</span>
			<Input type="text" name="type" required placeholder="e.g., Tweet, Thread Opener, CTA" />
		</Label>
		<Label class="space-y-2">
			<span>Content Text</span>
			<Textarea
				name="content_text"
				required
				rows="6"
				placeholder="Enter your template content..."
			/>
		</Label>
		<Label class="space-y-2">
			<span>Purpose Description</span>
			<Textarea
				name="purpose_description"
				required
				rows="3"
				placeholder="Describe when to use this template..."
			/>
		</Label>
		<div class="flex justify-end gap-2 pt-2">
			<Button color="alternative" on:click={closeCreateModal}>Cancel</Button>
			<Button type="submit" color="blue">Create Template</Button>
		</div>
	</form>
</Modal>

<!-- Edit Modal -->
<Modal bind:open={showEditModal} size="lg" autoclose={false} class="w-full">
	<h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Template</h3>
	{#if editingTemplate}
		<form
			action="?/updateTemplate"
			method="POST"
			use:enhance={handleUpdateTemplate}
			class="space-y-4"
		>
			<input type="hidden" name="id" value={editingTemplate.id} />
			<Label class="space-y-2">
				<span>Type / Category</span>
				<Input type="text" name="type" bind:value={editingTemplate.type} required />
			</Label>
			<Label class="space-y-2">
				<span>Content Text</span>
				<Textarea name="content_text" bind:value={editingTemplate.content_text} required rows="6" />
			</Label>
			<Label class="space-y-2">
				<span>Purpose Description</span>
				<Textarea
					name="purpose_description"
					bind:value={editingTemplate.purpose_description}
					required
					rows="3"
				/>
			</Label>
			<div class="flex justify-end gap-2 pt-2">
				<Button color="alternative" on:click={closeEditModal}>Cancel</Button>
				<Button type="submit" color="blue">Save Changes</Button>
			</div>
		</form>
	{/if}
</Modal>

<!-- Delete Confirmation Modal -->
<Modal bind:open={showDeleteConfirm} size="sm" autoclose={false}>
	<div class="text-center">
		<div
			class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
		>
			<svg
				class="h-6 w-6 text-red-600 dark:text-red-400"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
		</div>
		<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Delete Template?</h3>
		<p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
			This will permanently delete "{templateToDelete?.type}". This action cannot be undone.
		</p>
		<div class="flex justify-center gap-3">
			<Button color="alternative" on:click={cancelDelete}>Cancel</Button>
			{#if templateToDelete}
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
					<Button type="submit" color="red">Delete</Button>
				</form>
			{/if}
		</div>
	</div>
</Modal>

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
		color: var(--text-primary, #1e293b);
	}

	.template-count {
		font-size: 0.8125rem;
		color: var(--text-secondary, #64748b);
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
		color: var(--text-secondary, #64748b);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 0.75rem 0.5rem 2.25rem;
		font-size: 0.8125rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.5rem;
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary, #3b82f6);
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
		border-bottom: 1px solid var(--border-color, #e2e8f0);
	}

	.type-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.templates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.template-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 0.75rem;
		overflow: hidden;
		transition: all 0.15s ease;
	}

	.template-card:hover {
		border-color: var(--primary, #3b82f6);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
	}

	.card-header {
		padding: 0.75rem 1rem;
		background: var(--hover-background, #f8fafc);
		border-bottom: 1px solid var(--border-color, #e2e8f0);
	}

	.card-body {
		padding: 1rem;
	}

	.content-preview {
		margin: 0 0 0.75rem 0;
		font-size: 0.875rem;
		color: var(--text-primary, #1e293b);
		line-height: 1.5;
	}

	.purpose-text {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-secondary, #64748b);
	}

	.purpose-label {
		font-weight: 500;
	}

	.card-actions {
		display: flex;
		border-top: 1px solid var(--border-color, #e2e8f0);
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
		color: var(--primary, #3b82f6);
		border-right: 1px solid var(--border-color, #e2e8f0);
	}

	.action-btn.edit:hover {
		background: rgba(59, 130, 246, 0.1);
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
		color: var(--text-secondary, #94a3b8);
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.empty-state p {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #64748b);
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

	@media (prefers-color-scheme: dark) {
		.header-left h2 {
			color: #f9fafb;
		}

		.type-header h3 {
			color: #f9fafb;
		}

		.type-header {
			border-color: #374151;
		}

		.search-input {
			background: #1f2937;
			border-color: #374151;
			color: #f9fafb;
		}

		.template-card {
			background: #1f2937;
			border-color: #374151;
		}

		.card-header {
			background: #111827;
			border-color: #374151;
		}

		.content-preview {
			color: #f9fafb;
		}

		.card-actions {
			border-color: #374151;
		}

		.action-btn.edit {
			border-color: #374151;
		}

		.empty-state h3 {
			color: #f9fafb;
		}
	}
</style>
