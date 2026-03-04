<!-- src/lib/components/questions/AdminQuestionItem.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';

	export let questionData: any;
	export let tags: any[];

	const dispatch = createEventDispatcher();

	// Track question ID to reset local state when a different question is selected
	let prevQuestionId: any = null;
	let selectedTags: any[] = [];
	let editing = false;
	let confirmingTag = false;
	let taggingLoading = false;
	let questionEditsSaving = false;
	let editBackup: any = null;

	// Reset all local state when the question changes
	$: if (questionData?.id !== prevQuestionId) {
		prevQuestionId = questionData?.id;
		selectedTags = [...(questionData?.question_tag || [])];
		editing = false;
		confirmingTag = false;
		editBackup = null;
	}

	$: formattedDate = formatDate(questionData?.created_at);
	$: availableTags = tags.filter((t) => !selectedTags.some((st: any) => st.tag_id === t.tag_id));

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	function startEditing() {
		editBackup = {
			question_formatted: questionData.question_formatted,
			flagged: questionData.flagged,
			removed: questionData.removed,
			tags: [...selectedTags]
		};
		editing = true;
	}

	function cancelEditing() {
		if (editBackup) {
			questionData.question_formatted = editBackup.question_formatted;
			questionData.flagged = editBackup.flagged;
			questionData.removed = editBackup.removed;
			selectedTags = [...editBackup.tags];
			editBackup = null;
		}
		editing = false;
	}

	async function remove() {
		const body = new FormData();
		body.append('questionId', questionData.id);

		const resp = await fetch('/questions?/remove', { method: 'POST', body });
		const result: any = deserialize(await resp.text());

		if (result?.data?.success) {
			notifications.success('Question removed', 3000);
			dispatch('questionRemoved');
		} else {
			notifications.danger('Error removing question', 3000);
		}
	}

	function removeTag(tag: any) {
		selectedTags = selectedTags.filter((t: any) => t.tag_id !== tag.tag_id);
	}

	function addTag(tag: any) {
		selectedTags = [...selectedTags, tag];
	}

	async function tagQuestion() {
		taggingLoading = true;
		const body = new FormData();
		body.append('questionId', questionData.id);
		body.append('questionText', questionData.question);

		try {
			const resp = await fetch('/api/update-questions', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result?.success) {
				notifications.success('Tagged question', 3000);
				confirmingTag = false;
			} else {
				notifications.danger('Error tagging question', 3000);
			}
		} finally {
			taggingLoading = false;
		}
	}

	async function saveQuestionEdits() {
		questionEditsSaving = true;
		const body = new FormData();
		body.append('questionId', questionData.id);
		body.append('flagged', questionData.flagged);
		body.append('removed', questionData.removed);
		body.append('question', questionData.question);
		body.append('question_formatted', questionData.question_formatted);
		body.append('tags', JSON.stringify(selectedTags));

		try {
			const resp = await fetch('/questions?/update', { method: 'POST', body });
			const result: any = deserialize(await resp.text());

			if (result?.data?.success) {
				editBackup = null;
				editing = false;
				notifications.success('Question edited', 3000);
			} else {
				notifications.danger('Error saving edits', 3000);
			}
		} finally {
			questionEditsSaving = false;
		}
	}
</script>

<div class="question-card">
	{#if editing}
		<!-- Edit Mode -->
		<div class="edit-form">
			<div class="edit-header">
				<h2 class="edit-title">Edit Question</h2>
				<button class="close-btn" on:click={cancelEditing}>
					<XmarkIcon height="0.85rem" fill="currentColor" />
				</button>
			</div>

			<div class="field-group">
				<label class="field-label">Original</label>
				<p class="original-text">{questionData.question}</p>
			</div>

			<div class="field-group">
				<label class="field-label" for="formatted-question">Formatted</label>
				<textarea
					id="formatted-question"
					bind:value={questionData.question_formatted}
					class="field-textarea"
					rows="3"
				></textarea>
			</div>

			<div class="toggle-row">
				<button
					class="toggle-btn"
					class:active={questionData.flagged}
					class:warning={questionData.flagged}
					on:click={() => (questionData.flagged = !questionData.flagged)}
				>
					Flagged
				</button>
				<button
					class="toggle-btn"
					class:active={questionData.removed}
					class:danger={questionData.removed}
					on:click={() => (questionData.removed = !questionData.removed)}
				>
					Removed
				</button>
			</div>

			<div class="field-group">
				<label class="field-label">Selected Tags</label>
				<div class="tag-list">
					{#each selectedTags as tag}
						<span class="tag selected">
							{tag.tag_name}
							<button class="tag-remove" on:click={() => removeTag(tag)}>
								<XmarkIcon height="0.6rem" fill="currentColor" />
							</button>
						</span>
					{:else}
						<span class="empty-text">No tags selected</span>
					{/each}
				</div>
			</div>

			<div class="field-group">
				<label class="field-label">Add Tags</label>
				<div class="tag-picker">
					{#each availableTags as tag}
						<button class="tag-add-btn" on:click={() => addTag(tag)}>
							+ {tag.tag_name}
						</button>
					{:else}
						<span class="empty-text">All tags assigned</span>
					{/each}
				</div>
			</div>

			<div class="edit-actions">
				<button class="btn btn-secondary" on:click={cancelEditing}>Cancel</button>
				<button class="btn btn-primary" disabled={questionEditsSaving} on:click={saveQuestionEdits}>
					{questionEditsSaving ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</div>
	{:else}
		<!-- View Mode -->
		<div class="view-section">
			<div class="question-texts">
				<div class="field-group">
					<span class="field-label">Original</span>
					<p class="question-text">{questionData.question}</p>
				</div>
				{#if questionData.question_formatted && questionData.question_formatted !== questionData.question}
					<div class="field-group">
						<span class="field-label">Formatted</span>
						<p class="question-text formatted">{questionData.question_formatted}</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="meta-row">
			{#if questionData.flagged}
				<span class="status-badge warning">Flagged</span>
			{/if}
			{#if questionData.removed}
				<span class="status-badge danger">Removed</span>
			{/if}
			<span class="meta-badge">
				{formattedDate}
			</span>
			<span class="meta-badge comments">
				<MasterCommentIcon
					height="0.85rem"
					fill="currentColor"
					type={questionData.comment_count ? 'multiple' : 'empty'}
				/>
				{questionData.comment_count || '0'}
			</span>
		</div>

		{#if questionData.keywords?.length}
			<div class="tag-section">
				<span class="field-label">Keywords</span>
				<div class="tag-list">
					{#each questionData.keywords as keyword}
						<span class="tag keyword">{keyword}</span>
					{/each}
				</div>
			</div>
		{/if}

		{#if selectedTags.length}
			<div class="tag-section">
				<span class="field-label">Tags</span>
				<div class="tag-list">
					{#each selectedTags as tag}
						<span class="tag">{tag.tag_name}</span>
					{/each}
				</div>
			</div>
		{/if}

		{#if confirmingTag}
			<div class="confirm-bar">
				<p class="confirm-text">Run AI tagging on this question?</p>
				<div class="confirm-actions">
					<button class="btn btn-primary btn-sm" disabled={taggingLoading} on:click={tagQuestion}>
						{taggingLoading ? 'Tagging...' : 'Yes, Tag'}
					</button>
					<button class="btn btn-secondary btn-sm" on:click={() => (confirmingTag = false)}>
						Cancel
					</button>
				</div>
			</div>
		{/if}

		<div class="action-row">
			<button class="btn btn-outline" on:click={() => (confirmingTag = true)}>AI Tag</button>
			<button class="btn btn-outline" on:click={startEditing}>Edit</button>
			<a href="/questions/{questionData.url}" class="btn btn-primary" target="_blank">View</a>
		</div>
	{/if}
</div>

<style>
	.question-card {
		width: 100%;
		max-width: 720px;
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		overflow: hidden;
	}

	/* Edit Mode */
	.edit-form {
		padding: 20px;
		max-height: 70vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.edit-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.edit-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: var(--text-secondary, #64748b);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.close-btn:hover {
		background: var(--hover-background, #f1f5f9);
		color: var(--text-primary, #1e293b);
	}

	/* Field Groups */
	.field-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-label {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.original-text {
		font-size: 0.85rem;
		color: var(--text-secondary, #64748b);
		margin: 0;
		padding: 8px 12px;
		background: var(--hover-background, #f8fafc);
		border-radius: 8px;
		line-height: 1.5;
	}

	.field-textarea {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 8px;
		font-size: 0.85rem;
		font-family: inherit;
		color: var(--text-primary, #1e293b);
		background: var(--card-background, #fff);
		resize: vertical;
		line-height: 1.5;
		transition: border-color 0.15s ease;
	}

	.field-textarea:focus {
		outline: none;
		border-color: var(--primary, #3b82f6);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* Toggle Buttons */
	.toggle-row {
		display: flex;
		gap: 8px;
	}

	.toggle-btn {
		padding: 6px 14px;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 6px;
		background: var(--card-background, #fff);
		color: var(--text-secondary, #64748b);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.toggle-btn:hover {
		border-color: var(--primary, #3b82f6);
	}

	.toggle-btn.active.warning {
		background: rgba(245, 158, 11, 0.1);
		border-color: #f59e0b;
		color: #d97706;
	}

	.toggle-btn.active.danger {
		background: rgba(239, 68, 68, 0.1);
		border-color: #ef4444;
		color: #dc2626;
	}

	/* Tags */
	.tag-section {
		padding: 0 20px;
		padding-bottom: 12px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 3px 10px;
		background: rgba(99, 102, 241, 0.08);
		color: #6366f1;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.tag.keyword {
		background: rgba(16, 185, 129, 0.08);
		color: #059669;
	}

	.tag.selected {
		background: rgba(99, 102, 241, 0.12);
	}

	.tag-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		border: none;
		background: transparent;
		color: inherit;
		cursor: pointer;
		border-radius: 50%;
		padding: 0;
		opacity: 0.6;
		transition: opacity 0.15s ease;
	}

	.tag-remove:hover {
		opacity: 1;
	}

	.tag-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		max-height: 140px;
		overflow-y: auto;
		padding: 8px;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 8px;
	}

	.tag-add-btn {
		padding: 3px 10px;
		border: 1px dashed var(--border-color, #cbd5e1);
		border-radius: 12px;
		background: transparent;
		color: var(--text-secondary, #64748b);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.tag-add-btn:hover {
		border-color: var(--primary, #3b82f6);
		color: var(--primary, #3b82f6);
		background: rgba(59, 130, 246, 0.04);
	}

	.empty-text {
		font-size: 0.8rem;
		color: var(--text-secondary, #94a3b8);
	}

	/* View Mode */
	.view-section {
		padding: 20px;
		padding-bottom: 12px;
	}

	.question-texts {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.question-text {
		font-size: 0.9rem;
		color: var(--text-primary, #1e293b);
		margin: 0;
		line-height: 1.5;
	}

	.question-text.formatted {
		color: var(--text-primary, #1e293b);
		font-weight: 500;
	}

	/* Meta Row */
	.meta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 0 20px;
		padding-bottom: 12px;
	}

	.status-badge {
		padding: 2px 10px;
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.status-badge.warning {
		background: rgba(245, 158, 11, 0.1);
		color: #d97706;
	}

	.status-badge.danger {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}

	.meta-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 10px;
		background: var(--hover-background, #f1f5f9);
		color: var(--text-secondary, #64748b);
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.meta-badge.comments {
		background: rgba(16, 185, 129, 0.08);
		color: #059669;
	}

	/* Confirm Bar */
	.confirm-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin: 0 20px;
		margin-bottom: 12px;
		padding: 10px 14px;
		background: rgba(59, 130, 246, 0.05);
		border: 1px solid rgba(59, 130, 246, 0.15);
		border-radius: 8px;
	}

	.confirm-text {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-primary, #1e293b);
	}

	.confirm-actions {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}

	/* Action Row */
	.action-row {
		display: flex;
		gap: 8px;
		padding: 12px 20px;
		border-top: 1px solid var(--border-color, #e2e8f0);
		background: var(--hover-background, #f8fafc);
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 7px 16px;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		text-decoration: none;
		border: none;
		line-height: 1.3;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-sm {
		padding: 5px 12px;
		font-size: 0.75rem;
	}

	.btn-primary {
		background: var(--primary, #3b82f6);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
	}

	.btn-secondary {
		background: var(--card-background, #fff);
		color: var(--text-secondary, #64748b);
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.btn-secondary:hover {
		border-color: var(--text-secondary, #94a3b8);
		color: var(--text-primary, #1e293b);
	}

	.btn-outline {
		background: var(--card-background, #fff);
		color: var(--text-secondary, #64748b);
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.btn-outline:hover {
		border-color: var(--primary, #3b82f6);
		color: var(--primary, #3b82f6);
	}

	/* Edit Actions */
	.edit-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		padding-top: 8px;
		border-top: 1px solid var(--border-color, #e2e8f0);
	}
</style>
