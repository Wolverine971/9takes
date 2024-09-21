<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Input, Label, Textarea, Select } from 'flowbite-svelte';
	import type { Template } from '$lib/types/marketing';

	export let templates: Template[];

	let editingTemplate: Partial<Template> = null;

	function startEditing(template: Template) {
		editingTemplate = { ...template };
	}

	function cancelEditing() {
		editingTemplate = null;
	}
</script>

<h2 class="mb-4 text-2xl font-bold">Content Templates</h2>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<div>
		<h3 class="mb-2 text-xl font-bold">Create New Template</h3>
		<form action="?/createTemplate" method="POST" use:enhance class="space-y-4">
			<Label>
				Content Text
				<Textarea name="content_text" required />
			</Label>
			<Label>
				Type
				<Input type="text" name="type" required />
			</Label>
			<Label>
				Purpose Description
				<Textarea name="purpose_description" required />
			</Label>
			<Button type="submit">Create Template</Button>
		</form>
	</div>

	<div>
		<h3 class="mb-2 text-xl font-bold">Existing Templates</h3>
		{#each templates as template}
			<Card class="mb-2">
				{#if editingTemplate && editingTemplate.id === template.id}
					<form action="?/updateTemplate" method="POST" use:enhance class="space-y-2">
						<input type="hidden" name="id" value={template.id} />
						<Textarea name="content_text" bind:value={editingTemplate.content_text} required />
						<Input type="text" name="type" bind:value={editingTemplate.type} required />
						<Textarea
							name="purpose_description"
							bind:value={editingTemplate.purpose_description}
							required
						/>
						<Button type="submit">Save</Button>
						<Button on:click={cancelEditing}>Cancel</Button>
					</form>
				{:else}
					<h4 class="font-bold">{template.type}</h4>
					<p>{template.content_text}</p>
					<p>Purpose: {template.purpose_description}</p>
					<Button on:click={() => startEditing(template)}>Edit</Button>
					<form action="?/deleteTemplate" method="POST" use:enhance>
						<input type="hidden" name="id" value={template.id} />
						<Button type="submit" color="red">Delete</Button>
					</form>
				{/if}
			</Card>
		{/each}
	</div>
</div>
