<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	export let questionData: any;
	export let tags: any[];

	const dispatch = createEventDispatcher();

	let innerWidth = 0;
	let selectedTags = questionData.question_tag;
	let editing = false;
	let taggingLoading = false;
	let questionEditsSaving = false;

	$: formattedDate = formatDate(questionData?.created_at, innerWidth);
	$: availableTags = tags.filter((t) => !selectedTags.some((st) => st.tag_id === t.tag_id));

	function formatDate(dateString: string, width: number): string {
		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const year = date.getUTCFullYear();
		return `${month}/${day}${width > 400 ? '/' + year : ''}`;
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
				getModal(`tag-question-${questionData.id}`).close();
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

<svelte:window bind:innerWidth />

<div class="question-card">
	<div class="question-content">
		<p class="question-display"><b>Original:</b> {questionData.question}</p>
		<p class="question-display"><b>Formatted:</b> {questionData.question_formatted}</p>
	</div>
	<div class="question-meta">
		<div class="meta-item">
			<span class="comment-span-display">
				{questionData.comment_count || ''}
				<MasterCommentIcon
					iconStyle="margin-left: .5rem"
					height="1.5rem"
					fill={questionData.comment_count ? 'var(--primary)' : ''}
					type={questionData.comment_count ? 'multiple' : 'empty'}
				/>
			</span>
			<span class="date-span">{formattedDate}</span>
			<span style="color: {questionData.flagged ? 'red' : ''}">Flagged: {questionData.flagged}</span
			>
			<span style="color: {questionData.removed ? 'red' : ''}">Removed: {questionData.removed}</span
			>
		</div>
		<div class="meta-item">
			<span style="min-width: 80px;">Keywords:</span>
			{#if questionData.keywords?.length}
				<div class="tags-div">
					{#each questionData.keywords as keyword}
						<span class="tag">{keyword}</span>
					{/each}
				</div>
			{:else}
				<span>No tags</span>
			{/if}
		</div>
		<div class="meta-item">
			<span style="min-width: 80px;">Tags:</span>
			{#if selectedTags.length}
				<div class="tags-div">
					{#each selectedTags as tag}
						<span class="tag">{tag.tag_name}</span>
					{/each}
				</div>
			{:else}
				<span>No tags</span>
			{/if}
		</div>
	</div>
	<div class="">
		<button
			class="btn btn-primary"
			on:click={() => getModal(`tag-question-${questionData.id}`).open()}
		>
			AI Tag
		</button>
		<button
			class="btn btn-primary "
			on:click={() => {
				editing = !editing;
				getModal(`edit-modal-${questionData.id}`).open();
			}}
		>
			{editing ? 'Editing' : 'Edit'}
		</button>
		<a href="/questions/{questionData.url}"><button class="btn btn-primary"> Go to </button></a>
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
	<div class="edit-modal-content">
		<div class="question-edit">
			<p><b>Original:</b> {questionData.question}</p>
			<p><b>Formatted:</b></p>
			<textarea bind:value={questionData.question_formatted} />
		</div>
		<div class="meta-edit">
			<div class="flex-between">
				<span
					>Flagged: <button on:click={() => (questionData.flagged = !questionData.flagged)}
						>{questionData.flagged}</button
					></span
				>
				<span
					>Removed: <button on:click={() => (questionData.removed = !questionData.removed)}
						>{questionData.removed}</button
					></span
				>
			</div>
			<div>
				<h2>Selected Tags</h2>
				<div class="tags-container">
					{#each selectedTags as tag}
						<span class="tag">
							{tag.tag_name}
							<button class="remove-tag-btn" on:click={() => removeTag(tag)}>
								<XmarkIcon iconStyle="" height="1rem" fill="red" />
							</button>
						</span>
					{/each}
				</div>
			</div>
			<div>
				<h2>Add Tags</h2>
				<div class="big-tags">
					{#each availableTags as tag}
						<button class="tag" on:click={() => addTag(tag)}>{tag.tag_name}</button>
					{/each}
				</div>
			</div>
		</div>
		<button
			class="btn btn-primary save-btn"
			disabled={questionEditsSaving}
			on:click={saveQuestionEdits}
		>
			{questionEditsSaving ? 'Saving...' : 'Save'}
		</button>
	</div>
</Modal2>

<style lang="scss">
	.question-card {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
			0 1px 5px 0 rgba(0, 0, 0, 0.12);
		transition: background-color 0.3s, box-shadow 0.3s;

		&:hover {
			background-color: var(--base-white-outline);
			box-shadow: 0 2px 0px -1px var(--color-theme-purple-light),
				0 3px 3px 1px var(--color-theme-purple-light), 0 1px 5px 0 var(--color-theme-purple-light);
		}
	}

	.question-content,
	.question-meta {
		display: flex;
		flex-direction: column;
		// gap: 0.5rem;
	}

	.question-display {
		word-break: normal;
		display: flex;
		align-items: center;
		text-wrap: balance;
		gap: 0.5rem;
		margin: 0 0.5rem;
	}

	.meta-item {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.comment-span-display {
		display: flex;
		justify-content: space-between;
		font-weight: bold;
		color: var(--color-p-dark);
	}

	.date-span,
	.tag {
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		padding: 0.3rem;
	}

	.top-right,
	.bottom-right {
		position: absolute;
		padding: 0.25rem;
		min-width: 4rem;
	}

	.top-right {
		top: 0;
		right: 0;
		border-radius: 0 0 0 5px;
		border-top: none;
		border-right: none;
	}

	.bottom-right {
		bottom: 0;
		right: 0;
		border-radius: 5px 0 0 0;
		border-bottom: none;
		border-right: none;
	}

	.tags-div,
	.big-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		max-height: 100px;
		overflow-y: auto;
	}

	.big-tags {
		max-width: 900px;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		padding: 0.5rem;
	}

	.tag {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		cursor: pointer;

		&:hover {
			background-color: var(--base-white-outline);
		}
	}

	.save-btn {
		align-self: flex-end;
	}

	.edit-modal-content {
		max-height: 500px;
		overflow-y: auto;
	}

	@media (max-width: 576px) {
		.question-card {
			margin: 0.5rem;
			padding: 0.5rem;
		}

		.question-display {
			width: 90%;
			margin: 0;
			word-break: break-word;
			display: block;
		}

		.meta-item {
			flex-direction: column;
			margin: 0.5rem;
			width: 100%;
		}
	}
</style>
