<!-- src/lib/components/marketing/CreateContent.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Campaign, Template } from '$lib/types/marketing';
	import { invalidateAll } from '$app/navigation';

	let {
		campaigns,
		templates,
		initialDate = null,
		oncontentCreated,
		oncancel
	}: {
		campaigns: Campaign[];
		templates: Template[];
		initialDate?: Date | null;
		oncontentCreated?: (data: any) => void;
		oncancel?: () => void;
	} = $props();

	let selectedTemplate: Template | null = $state(null);
	let content_text = $state('');
	let scheduled_date = $state(initialDate ? formatDateForInput(initialDate) : '');
	let platform = $state('twitter');
	let campaign_id = $state('');
	let content_promotion_accounts = $state('');
	let content_hashtags = $state('');
	let content_themes = $state('');

	function handleTemplateSelection(event: Event) {
		const templateId = (event.target as HTMLSelectElement).value;
		selectedTemplate = templates.find((t) => t.id === templateId) || null;
		if (selectedTemplate) {
			content_text = selectedTemplate.content_text;
		}
	}

	function formatDateForInput(date: Date): string {
		return date.toISOString().slice(0, 16);
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
</script>

<form
	method="POST"
	action="?/createContent"
	use:enhance={() => {
		return ({ result }) => {
			if (result.type === 'success') {
				oncontentCreated?.(result.data);
				resetForm();
				invalidateAll();
			}
		};
	}}
	class="create-content-form"
>
	<div class="form-grid">
		<div class="form-column">
			<label class="field">
				<span class="field-label">Select Template</span>
				<select onchange={handleTemplateSelection} class="field-input">
					<option value="">No Template</option>
					{#each templates as template}
						<option value={template.id}>{template.type} - {template.purpose_description}</option>
					{/each}
				</select>
			</label>

			<label class="field">
				<span class="field-label">Scheduled Date</span>
				<input
					type="datetime-local"
					name="scheduled_date"
					bind:value={scheduled_date}
					required
					class="field-input"
				/>
			</label>

			<label class="field">
				<span class="field-label">Platform</span>
				<select name="platform" bind:value={platform} required class="field-input">
					<option value="twitter">Twitter</option>
					<option value="instagram">Instagram</option>
					<option value="linkedin">LinkedIn</option>
				</select>
			</label>

			<label class="field">
				<span class="field-label">Campaign</span>
				<select name="campaign_id" bind:value={campaign_id} class="field-input">
					<option value="">No Campaign</option>
					{#each campaigns as campaign}
						<option value={campaign.id}>{campaign.name}</option>
					{/each}
				</select>
			</label>
		</div>

		<div class="form-column">
			<label class="field">
				<span class="field-label">Content Promotion Accounts</span>
				<input
					type="text"
					name="content_promotion_accounts"
					bind:value={content_promotion_accounts}
					class="field-input"
				/>
			</label>

			<label class="field">
				<span class="field-label">Content Hashtags</span>
				<input
					type="text"
					name="content_hashtags"
					bind:value={content_hashtags}
					class="field-input"
				/>
			</label>

			<label class="field">
				<span class="field-label">Content Themes</span>
				<input type="text" name="content_themes" bind:value={content_themes} class="field-input" />
			</label>
		</div>
	</div>

	<label class="field">
		<span class="field-label">Content Text</span>
		<textarea
			name="content_text"
			bind:value={content_text}
			required
			rows="8"
			class="field-input field-textarea"
		></textarea>
	</label>

	<div class="form-actions">
		<button type="submit" class="btn btn-primary">Create Content</button>
		<button type="button" class="btn btn-secondary" onclick={() => oncancel?.()}>Cancel</button>
	</div>
</form>

<style>
	.create-content-form {
		max-width: 56rem;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
		color: var(--text-primary);
		transition: border-color 0.15s ease;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
		box-shadow: 0 0 0 2px rgba(var(--shadow-monarch-rgb, 99, 102, 241), 0.15);
	}

	.field-textarea {
		resize: vertical;
		min-height: 120px;
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
		background: var(--shadow-monarch);
		color: white;
	}

	.btn-primary:hover {
		filter: brightness(1.1);
		box-shadow: var(--glow-sm);
	}

	.btn-secondary {
		background: var(--void-elevated);
		color: var(--text-primary);
	}

	.btn-secondary:hover {
		background: var(--void-highlight);
	}

	@media (max-width: 768px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
