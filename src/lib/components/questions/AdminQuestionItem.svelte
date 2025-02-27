<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { Button, Badge } from 'flowbite-svelte';

	export let questionData: any;
	export let tags: any[];

	const dispatch = createEventDispatcher();

	let selectedTags = questionData.question_tag;
	let editing = false;
	let taggingLoading = false;
	let questionEditsSaving = false;

	$: formattedDate = formatDate(questionData?.created_at);
	$: availableTags = tags.filter((t) => !selectedTags.some((st) => st.tag_id === t.tag_id));

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	async function remove() {
		const body = new FormData();
		body.append('questionId', questionData.id);

		const resp = await fetch('/questions?/remove', { method: 'POST', body });
		const result: any = deserialize(await resp.text());

		if (result?.data?.success) {
			notifications.info('Question removed', 3000);
			dispatch('questionRemoved');
		} else {
			notifications.danger('Error removing question', 3000);
		}
	}

	function removeTag(tag: any) {
		selectedTags = selectedTags.filter((t) => t.tag_id !== tag.tag_id);
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
				notifications.info('Tagged question', 3000);
				editing = false;
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
				editing = false;
				notifications.info('Question edited', 3000);
				getModal(`edit-modal-${questionData.id}`).close();
			} else {
				notifications.danger('Error saving edits', 3000);
			}
		} finally {
			questionEditsSaving = false;
		}
	}
</script>

<div class="question-card mb-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
	<div class="mb-4">
		<p class="text-sm text-gray-600 dark:text-gray-400"><b>Original:</b> {questionData.question}</p>
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

	<div class="flex flex-wrap gap-2">
		<Button
			size="sm"
			on:click={() => {
				const modal = getModal(`tag-question-${questionData.id}`);
				modal.open();
			}}>AI Tag</Button
		>
		<Button
			size="sm"
			on:click={() => {
				editing = true;
				getModal(`edit-modal-${questionData.id}`).open();
			}}>Edit</Button
		>
		<Button size="sm" href="/questions/{questionData.url}">Go to</Button>
	</div>
</div>

<Modal2 id={`tag-question-${questionData.id}`}>
	<h2>Tag Question:</h2>
	<h3>{questionData.question}</h3>
	<button class="btn btn-primary" disabled={taggingLoading} on:click={tagQuestion}>
		{taggingLoading ? 'Loading...' : 'Yes'}
	</button>
</Modal2>

<Modal2 id={`edit-modal-${questionData.id}`}>
	<div class="edit-modal-content p-4">
		<h2 class="mb-4 text-xl font-bold">Edit Question</h2>
		<div class="mb-4">
			<p class="mb-2"><b>Original:</b> {questionData.question}</p>
			<label
				for="formatted-question"
				class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Formatted:</label
			>
			<textarea
				id="formatted-question"
				bind:value={questionData.question_formatted}
				class="w-full rounded-md border p-2"
				rows="3"
			></textarea>
		</div>

		<div class="mb-4 flex justify-between">
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
			<h3 class="mb-2 text-lg font-semibold">Selected Tags</h3>
			<div class="flex flex-wrap gap-2">
				{#each selectedTags as tag}
					<Badge color="indigo">
						{tag.tag_name}
						<button class="ml-1 text-xs" on:click={() => removeTag(tag)}>
							<XmarkIcon iconStyle="" height="0.75rem" fill="currentColor" />
						</button>
					</Badge>
				{/each}
			</div>
		</div>

		<div class="mb-4">
			<h3 class="mb-2 text-lg font-semibold">Add Tags</h3>
			<div class="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-md border p-2">
				{#each availableTags as tag}
					<Button size="xs" on:click={() => addTag(tag)}>{tag.tag_name}</Button>
				{/each}
			</div>
		</div>

		<div class="flex justify-end gap-2">
			<Button color="gray" on:click={() => (editing = false)}>Cancel</Button>
			<Button disabled={questionEditsSaving} on:click={saveQuestionEdits}>
				{questionEditsSaving ? 'Saving...' : 'Save'}
			</Button>
		</div>
	</div>
</Modal2>

<style lang="scss">
	.question-card {
		width: 100%;
		max-width: 1000px;
		position: relative;
		box-shadow:
			0 3px 1px -2px rgba(0, 0, 0, 0.2),
			0 2px 2px 0 rgba(0, 0, 0, 0.14),
			0 1px 5px 0 rgba(0, 0, 0, 0.12);
		transition:
			background-color 0.3s,
			box-shadow 0.3s;

		&:hover {
			background-color: var(--base-white-outline);
			box-shadow:
				0 2px 0px -1px var(--primary-light),
				0 3px 3px 1px var(--primary-light),
				0 1px 5px 0 var(--primary-light);
		}
	}
	.edit-modal-content {
		max-height: 500px;
		max-width: 600px;
		overflow-y: auto;
	}
</style>
