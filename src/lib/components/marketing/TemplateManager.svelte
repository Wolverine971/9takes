<!-- src/lib/components/marketing/TemplateManager.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Input, Label, Textarea, Modal } from 'flowbite-svelte';
	import type { Template } from '$lib/types/marketing';

	export let templates: Template[];

	let editingTemplate: Partial<Template> | null = null;
	let showCreateModal = false;
	let showEditModal = false;

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

	function handleCreateTemplate(event: SubmitEvent) {
		return ({ result }) => {
			if (result.type === 'success') {
				closeCreateModal();
				// Assuming the server returns the newly created template
				templates = [...templates, result.data.template];
			}
		};
	}

	function handleUpdateTemplate() {
		return ({ result }) => {
			if (result.type === 'success') {
				closeEditModal();
				// Update the template in the list
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
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h2 class="mb-6 text-center text-3xl font-bold">Content Templates</h2>

	<div class="mb-4 text-right">
		<Button on:click={openCreateModal}>Create New Template</Button>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each templates as template (template.id)}
			<Card>
				<h4 class="mb-2 text-lg font-bold">{template.type}</h4>
				<p class="mb-2"><strong>Content:</strong> {template.content_text}</p>
				<p class="mb-4"><strong>Purpose:</strong> {template.purpose_description}</p>
				<div class="flex space-x-2">
					<Button on:click={() => openEditModal(template)} class="flex-1">Edit</Button>
					<form
						action="?/deleteTemplate"
						method="POST"
						use:enhance={() => {
							return ({ result }) => {
								if (result.type === 'success') handleDeleteTemplate(template.id);
							};
						}}
						class="flex-1"
					>
						<input type="hidden" name="id" value={template.id} />
						<Button type="submit" color="red" class="w-full">Delete</Button>
					</form>
				</div>
			</Card>
		{/each}
	</div>
</div>

<Modal bind:open={showCreateModal} size="lg" autoclose={false} class="w-full">
	<h3 class="mb-4 text-xl font-bold">Create New Template</h3>
	<form
		action="?/createTemplate"
		method="POST"
		use:enhance={handleCreateTemplate}
		class="space-y-4"
	>
		<Label class="space-y-2">
			<span>Content Text</span>
			<Textarea name="content_text" required rows="4" class="w-full" />
		</Label>
		<Label class="space-y-2">
			<span>Type</span>
			<Input type="text" name="type" required class="w-full" />
		</Label>
		<Label class="space-y-2">
			<span>Purpose Description</span>
			<Textarea name="purpose_description" required rows="3" class="w-full" />
		</Label>
		<div class="flex space-x-2">
			<Button type="submit" class="flex-1">Create Template</Button>
			<Button color="alternative" on:click={closeCreateModal} class="flex-1">Cancel</Button>
		</div>
	</form>
</Modal>

<Modal bind:open={showEditModal} size="lg" autoclose={false} class="w-full">
	<h3 class="mb-4 text-xl font-bold">Edit Template</h3>
	{#if editingTemplate}
		<form
			action="?/updateTemplate"
			method="POST"
			use:enhance={handleUpdateTemplate}
			class="space-y-4"
		>
			<input type="hidden" name="id" value={editingTemplate.id} />
			<Label class="space-y-2">
				<span>Content Text</span>
				<Textarea
					name="content_text"
					bind:value={editingTemplate.content_text}
					required
					rows="4"
					class="w-full"
				/>
			</Label>
			<Label class="space-y-2">
				<span>Type</span>
				<Input type="text" name="type" bind:value={editingTemplate.type} required class="w-full" />
			</Label>
			<Label class="space-y-2">
				<span>Purpose Description</span>
				<Textarea
					name="purpose_description"
					bind:value={editingTemplate.purpose_description}
					required
					rows="3"
					class="w-full"
				/>
			</Label>
			<div class="flex space-x-2">
				<Button type="submit" class="flex-1">Save Changes</Button>
				<Button color="alternative" on:click={closeEditModal} class="flex-1">Cancel</Button>
			</div>
		</form>
	{/if}
</Modal>
