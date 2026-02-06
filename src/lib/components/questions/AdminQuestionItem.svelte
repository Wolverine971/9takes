<!-- src/lib/components/questions/AdminQuestionItem.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';
	import { Button, Badge } from 'flowbite-svelte';

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

<div class="question-card mb-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
	{#if editing}
		<!-- Edit Mode -->
		<div class="edit-form">
			<h2 class="mb-4 text-xl font-bold">Edit Question</h2>

			<div class="mb-4">
				<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
					<b>Original:</b>
					{questionData.question}
				</p>
				<label
					for="formatted-question"
					class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Formatted:</label
				>
				<textarea
					id="formatted-question"
					bind:value={questionData.question_formatted}
					class="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
					rows="3"
				></textarea>
			</div>

			<div class="mb-4 flex gap-3">
				<Button
					size="sm"
					color={questionData.flagged ? 'red' : 'gray'}
					on:click={() => (questionData.flagged = !questionData.flagged)}
				>
					Flagged: {questionData.flagged}
				</Button>
				<Button
					size="sm"
					color={questionData.removed ? 'red' : 'gray'}
					on:click={() => (questionData.removed = !questionData.removed)}
				>
					Removed: {questionData.removed}
				</Button>
			</div>

			<div class="mb-4">
				<h3 class="mb-2 text-sm font-semibold">Selected Tags</h3>
				<div class="flex flex-wrap gap-2">
					{#each selectedTags as tag}
						<Badge color="indigo">
							{tag.tag_name}
							<button class="ml-1 text-xs" on:click={() => removeTag(tag)}>
								<XmarkIcon iconStyle="" height="0.75rem" fill="currentColor" />
							</button>
						</Badge>
					{:else}
						<span class="text-sm text-gray-500">No tags selected</span>
					{/each}
				</div>
			</div>

			<div class="mb-4">
				<h3 class="mb-2 text-sm font-semibold">Add Tags</h3>
				<div class="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border p-2">
					{#each availableTags as tag}
						<Button size="xs" on:click={() => addTag(tag)}>{tag.tag_name}</Button>
					{:else}
						<span class="text-sm text-gray-500">All tags assigned</span>
					{/each}
				</div>
			</div>

			<div class="flex justify-end gap-2">
				<Button color="gray" on:click={cancelEditing}>Cancel</Button>
				<Button disabled={questionEditsSaving} on:click={saveQuestionEdits}>
					{questionEditsSaving ? 'Saving...' : 'Save'}
				</Button>
			</div>
		</div>
	{:else}
		<!-- View Mode -->
		<div class="mb-4">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				<b>Original:</b>
				{questionData.question}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				<b>Formatted:</b>
				{questionData.question_formatted}
			</p>
		</div>

		<div class="mb-4 flex flex-wrap gap-2">
			<Badge color={questionData.flagged ? 'red' : 'gray'}>Flagged: {questionData.flagged}</Badge>
			<Badge color={questionData.removed ? 'red' : 'gray'}>Removed: {questionData.removed}</Badge>
			<Badge color="blue">{formattedDate}</Badge>
			<Badge color="purple">
				{questionData.comment_count || '0'}
				<MasterCommentIcon
					iconStyle="margin-left: .5rem"
					height="1rem"
					fill={questionData.comment_count ? 'currentColor' : ''}
					type={questionData.comment_count ? 'multiple' : 'empty'}
				/>
			</Badge>
		</div>

		<div class="mb-4">
			<h3 class="mb-2 text-sm font-semibold">Keywords:</h3>
			<div class="flex flex-wrap gap-2">
				{#if questionData.keywords?.length}
					{#each questionData.keywords as keyword}
						<Badge color="green">{keyword}</Badge>
					{/each}
				{:else}
					<span class="text-sm text-gray-500">No keywords</span>
				{/if}
			</div>
		</div>

		<div class="mb-4">
			<h3 class="mb-2 text-sm font-semibold">Tags:</h3>
			<div class="flex flex-wrap gap-2">
				{#if selectedTags.length}
					{#each selectedTags as tag}
						<Badge color="indigo">{tag.tag_name}</Badge>
					{/each}
				{:else}
					<span class="text-sm text-gray-500">No tags</span>
				{/if}
			</div>
		</div>

		{#if confirmingTag}
			<div
				class="mb-4 flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/30"
			>
				<p class="flex-1 text-sm font-medium">Run AI tagging on this question?</p>
				<Button size="xs" disabled={taggingLoading} on:click={tagQuestion}>
					{taggingLoading ? 'Tagging...' : 'Yes, Tag'}
				</Button>
				<Button size="xs" color="gray" on:click={() => (confirmingTag = false)}>Cancel</Button>
			</div>
		{/if}

		<div class="flex flex-wrap gap-2">
			<Button size="sm" on:click={() => (confirmingTag = true)}>AI Tag</Button>
			<Button size="sm" on:click={startEditing}>Edit</Button>
			<Button size="sm" href="/questions/{questionData.url}">Go to</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.question-card {
		width: 100%;
		max-width: 1000px;
		position: relative;
		box-shadow:
			0 3px 1px -2px rgba(0, 0, 0, 0.2),
			0 2px 2px 0 rgba(0, 0, 0, 0.14),
			0 1px 5px 0 rgba(0, 0, 0, 0.12);
	}
	.edit-form {
		max-height: 70vh;
		overflow-y: auto;
	}
</style>
