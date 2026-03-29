<!-- src/lib/components/questions/AdminQuestionItem.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';
	import { onDestroy } from 'svelte';

	export let questionData: any;
	export let tags: any[];

	const MAX_TAGS = 5;
	const TAGGING_POLL_INTERVAL_MS = 1500;
	const TAGGING_POLL_TIMEOUT_MS = 120000;

	// Track question ID to reset local state when a different question is selected
	let prevQuestionId: any = null;
	let selectedTags: any[] = [];
	let editing = false;
	let confirmingTag = false;
	let taggingLoading = false;
	let backgroundTagging = false;
	let questionEditsSaving = false;
	let editBackup: any = null;
	let activeTaggingJobId: string | null = null;
	let taggingPollTimer: ReturnType<typeof setTimeout> | null = null;
	let taggingPollStartedAt = 0;

	// Reset all local state when the question changes
	$: if (questionData?.id !== prevQuestionId) {
		stopTaggingPoll();
		prevQuestionId = questionData?.id;
		selectedTags = [...(questionData?.question_tag || [])];
		editing = false;
		confirmingTag = false;
		editBackup = null;

		const aiTaggingState = getAiTaggingState(questionData);
		if (aiTaggingState?.status === 'processing' && aiTaggingState.jobId) {
			startTaggingPoll(aiTaggingState.jobId);
		}
	}

	$: formattedDate = formatDate(questionData?.created_at);
	$: availableTags =
		selectedTags.length >= MAX_TAGS
			? []
			: tags.filter((t) => !selectedTags.some((st: any) => st.tag_id === t.tag_id));

	onDestroy(() => {
		stopTaggingPoll();
	});

	function getAiTaggingState(question: any) {
		const state = question?.data?.aiTagging;
		if (!state || typeof state !== 'object') {
			return null;
		}

		if (typeof state.jobId !== 'string' || typeof state.status !== 'string') {
			return null;
		}

		return state as { jobId: string; status: string; error?: string };
	}

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

	function removeTag(tag: any) {
		selectedTags = selectedTags.filter((t: any) => t.tag_id !== tag.tag_id);
	}

	function addTag(tag: any) {
		if (selectedTags.length >= MAX_TAGS) {
			notifications.warning(`Questions can have at most ${MAX_TAGS} tags.`, 4000);
			return;
		}

		selectedTags = [...selectedTags, tag];
	}

	function applyQuestionUpdate(nextQuestion: any) {
		Object.assign(questionData, nextQuestion);
		questionData = { ...questionData };
		selectedTags = [...(nextQuestion?.question_tag || [])];
	}

	function buildCompletionMessage(nextQuestion: any): string {
		const tagCount = nextQuestion?.question_tag?.length ?? 0;
		if (tagCount > 0) {
			return `AI tagging finished. Applied ${tagCount} ${tagCount === 1 ? 'tag' : 'tags'}.`;
		}

		if (nextQuestion?.flagged) {
			return 'AI tagging finished. No matching tags were applied and the question was flagged for review.';
		}

		return 'AI tagging finished.';
	}

	function stopTaggingPoll() {
		if (taggingPollTimer) {
			clearTimeout(taggingPollTimer);
			taggingPollTimer = null;
		}

		activeTaggingJobId = null;
		backgroundTagging = false;
	}

	function scheduleNextTaggingPoll(jobId: string) {
		taggingPollTimer = setTimeout(() => {
			void pollTaggingStatus(jobId);
		}, TAGGING_POLL_INTERVAL_MS);
	}

	function startTaggingPoll(jobId: string) {
		if (!jobId) {
			return;
		}

		if (activeTaggingJobId === jobId && backgroundTagging) {
			return;
		}

		stopTaggingPoll();
		activeTaggingJobId = jobId;
		backgroundTagging = true;
		taggingPollStartedAt = Date.now();
		void pollTaggingStatus(jobId);
	}

	async function pollTaggingStatus(jobId: string) {
		try {
			const resp = await fetch(
				`/api/update-questions?questionId=${questionData.id}&jobId=${encodeURIComponent(jobId)}`
			);
			const result = await resp.json();

			if (!resp.ok || !result?.success) {
				throw new Error('Failed to fetch AI tagging status');
			}

			if (result.question) {
				applyQuestionUpdate(result.question);
			}

			if (result.jobId && result.jobId !== jobId) {
				stopTaggingPoll();
				return;
			}

			if (result.status === 'completed') {
				stopTaggingPoll();
				notifications.success(buildCompletionMessage(result.question), 5000);
				return;
			}

			if (result.status === 'failed') {
				stopTaggingPoll();
				notifications.danger(
					result.question?.data?.aiTagging?.error || 'AI tagging failed for this question.',
					5000
				);
				return;
			}

			if (result.status === 'superseded') {
				stopTaggingPoll();
				return;
			}

			if (Date.now() - taggingPollStartedAt > TAGGING_POLL_TIMEOUT_MS) {
				stopTaggingPoll();
				notifications.warning(
					'AI tagging is still running in the background. Refresh if the completion toast does not appear.',
					5000
				);
				return;
			}

			scheduleNextTaggingPoll(jobId);
		} catch {
			stopTaggingPoll();
			notifications.danger('Failed to track AI tagging progress.', 4000);
		}
	}

	async function tagQuestion() {
		if (backgroundTagging) {
			notifications.info('AI tagging is already running for this question.', 3000);
			return;
		}

		taggingLoading = true;
		const body = new FormData();
		body.append('questionId', questionData.id);
		body.append('questionText', questionData.question);

		try {
			const resp = await fetch('/api/update-questions', { method: 'POST', body });
			const result: any = await resp.json();

			if (!resp.ok || !result?.success || !result?.jobId) {
				notifications.danger('Error tagging question', 3000);
				return;
			}

			const currentData =
				questionData.data &&
				typeof questionData.data === 'object' &&
				!Array.isArray(questionData.data)
					? questionData.data
					: {};

			questionData.data = {
				...currentData,
				aiTagging: {
					jobId: result.jobId,
					status: 'processing'
				}
			};
			questionData = { ...questionData };
			confirmingTag = false;
			notifications.info('AI tagging started. You will get a toast when it finishes.', 3500);
			startTaggingPoll(result.jobId);
		} finally {
			taggingLoading = false;
		}
	}

	async function saveQuestionEdits() {
		if (selectedTags.length > MAX_TAGS) {
			notifications.warning(`Questions can have at most ${MAX_TAGS} tags.`, 4000);
			return;
		}

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
				questionData.question_tag = [...selectedTags];
				questionData.tagged = selectedTags.length > 0;
				questionData = { ...questionData };
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

<div class="question-detail-modal">
	<header class="question-detail-modal__hero">
		<div class="question-detail-modal__hero-copy">
			<span class="question-detail-modal__eyebrow"
				>{editing ? 'Editing question' : 'Question details'}</span
			>
			<h2 class="question-detail-modal__title">
				{questionData.question_formatted || questionData.question}
			</h2>
			<p class="question-detail-modal__subtitle">
				Review the public copy, moderation state, AI tags, and author details from one place.
			</p>
		</div>
		<div class="question-detail-modal__status-list">
			{#if backgroundTagging}
				<span class="question-detail-modal__status question-detail-modal__status--info"
					>AI Tagging...</span
				>
			{/if}
			{#if selectedTags.length > 0}
				<span class="question-detail-modal__status question-detail-modal__status--success"
					>AI Tagged</span
				>
			{:else}
				<span class="question-detail-modal__status question-detail-modal__status--neutral"
					>Needs Tags</span
				>
			{/if}
			{#if questionData.question_formatted && questionData.question_formatted !== questionData.question}
				<span class="question-detail-modal__status question-detail-modal__status--info"
					>Processed</span
				>
			{:else}
				<span class="question-detail-modal__status question-detail-modal__status--neutral"
					>Raw Copy</span
				>
			{/if}
			{#if questionData.flagged}
				<span class="question-detail-modal__status question-detail-modal__status--warning"
					>Flagged</span
				>
			{/if}
			{#if questionData.removed}
				<span class="question-detail-modal__status question-detail-modal__status--danger"
					>Removed</span
				>
			{/if}
		</div>
	</header>

	{#if editing}
		<div class="question-detail-modal__grid">
			<section class="question-detail-modal__panel question-detail-modal__panel--main">
				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Original submission</span>
					<p class="question-detail-modal__text-block question-detail-modal__text-block--muted">
						{questionData.question}
					</p>
				</div>

				<div class="question-detail-modal__section">
					<label class="question-detail-modal__label" for="formatted-question">Formatted copy</label
					>
					<textarea
						id="formatted-question"
						bind:value={questionData.question_formatted}
						class="question-detail-modal__textarea"
						rows="6"
					></textarea>
				</div>
			</section>

			<aside class="question-detail-modal__panel question-detail-modal__panel--side">
				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Moderation</span>
					<div class="question-detail-modal__toggle-grid">
						<button
							type="button"
							class="question-detail-modal__toggle"
							class:question-detail-modal__toggle--warning={questionData.flagged}
							on:click={() => (questionData.flagged = !questionData.flagged)}
						>
							<span>Flagged</span>
							<span>{questionData.flagged ? 'On' : 'Off'}</span>
						</button>
						<button
							type="button"
							class="question-detail-modal__toggle"
							class:question-detail-modal__toggle--danger={questionData.removed}
							on:click={() => (questionData.removed = !questionData.removed)}
						>
							<span>Removed</span>
							<span>{questionData.removed ? 'On' : 'Off'}</span>
						</button>
					</div>
				</div>

				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label"
						>Selected tags ({selectedTags.length}/{MAX_TAGS})</span
					>
					<div class="question-detail-modal__chip-list">
						{#each selectedTags as tag}
							<span class="question-detail-modal__chip question-detail-modal__chip--selected">
								{tag.tag_name}
								<button
									type="button"
									class="question-detail-modal__chip-remove"
									aria-label={`Remove ${tag.tag_name}`}
									on:click={() => removeTag(tag)}
								>
									<XmarkIcon height="0.65rem" fill="currentColor" />
								</button>
							</span>
						{:else}
							<span class="question-detail-modal__empty">No tags selected yet.</span>
						{/each}
					</div>
				</div>

				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Add tags</span>
					<div class="question-detail-modal__tag-picker">
						{#each availableTags as tag}
							<button
								type="button"
								class="question-detail-modal__tag-action"
								on:click={() => addTag(tag)}
							>
								+ {tag.tag_name}
							</button>
						{:else}
							<span class="question-detail-modal__empty">
								{selectedTags.length >= MAX_TAGS
									? `Tag limit reached (${MAX_TAGS} max).`
									: 'All tags are already assigned.'}
							</span>
						{/each}
					</div>
				</div>
			</aside>
		</div>

		<footer class="question-detail-modal__footer">
			<p class="question-detail-modal__footer-note">
				Save updates to apply formatting, moderation state, and tag changes.
			</p>
			<div class="question-detail-modal__actions">
				<button
					type="button"
					class="question-detail-modal__button question-detail-modal__button--secondary"
					on:click={cancelEditing}
				>
					Cancel
				</button>
				<button
					type="button"
					class="question-detail-modal__button question-detail-modal__button--primary"
					disabled={questionEditsSaving}
					on:click={saveQuestionEdits}
				>
					{questionEditsSaving ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</footer>
	{:else}
		<div class="question-detail-modal__grid">
			<section class="question-detail-modal__panel question-detail-modal__panel--main">
				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Original submission</span>
					<p class="question-detail-modal__text-block">{questionData.question}</p>
				</div>

				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Formatted copy</span>
					{#if questionData.question_formatted && questionData.question_formatted !== questionData.question}
						<p class="question-detail-modal__text-block question-detail-modal__text-block--accent">
							{questionData.question_formatted}
						</p>
					{:else}
						<p class="question-detail-modal__empty-card">
							No formatted version has been saved yet. The public question is still using the
							original submission.
						</p>
					{/if}
				</div>

				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Keywords</span>
					<div class="question-detail-modal__chip-list">
						{#each questionData.keywords || [] as keyword}
							<span class="question-detail-modal__chip question-detail-modal__chip--keyword"
								>{keyword}</span
							>
						{:else}
							<span class="question-detail-modal__empty">No keywords generated yet.</span>
						{/each}
					</div>
				</div>

				<div class="question-detail-modal__section">
					<span class="question-detail-modal__label">Question tags</span>
					<div class="question-detail-modal__chip-list">
						{#each selectedTags as tag}
							<span class="question-detail-modal__chip">{tag.tag_name}</span>
						{:else}
							<span class="question-detail-modal__empty"
								>This question does not have category tags yet.</span
							>
						{/each}
					</div>
				</div>
			</section>

			<aside class="question-detail-modal__panel question-detail-modal__panel--side">
				<div class="question-detail-modal__summary-list">
					<div class="question-detail-modal__summary-item">
						<span class="question-detail-modal__label">Created</span>
						<strong class="question-detail-modal__summary-value">{formattedDate}</strong>
					</div>

					<div class="question-detail-modal__summary-item">
						<span class="question-detail-modal__label">Comments</span>
						<strong
							class="question-detail-modal__summary-value question-detail-modal__summary-value--inline"
						>
							<MasterCommentIcon
								height="0.9rem"
								fill="currentColor"
								type={questionData.comment_count ? 'multiple' : 'empty'}
							/>
							{questionData.comment_count || '0'}
						</strong>
					</div>

					<div class="question-detail-modal__summary-item">
						<span class="question-detail-modal__label">Slug</span>
						<strong
							class="question-detail-modal__summary-value question-detail-modal__summary-value--wrap"
							>/questions/{questionData.url}</strong
						>
					</div>

					{#if questionData.profiles?.external_id || questionData.profiles?.email || questionData.profiles?.enneagram}
						<div class="question-detail-modal__summary-item">
							<span class="question-detail-modal__label">Author</span>
							<div class="question-detail-modal__author">
								<strong
									class="question-detail-modal__summary-value question-detail-modal__summary-value--wrap"
								>
									{questionData.profiles?.external_id || 'Unknown user'}
								</strong>
								{#if questionData.profiles?.email}
									<span class="question-detail-modal__author-email"
										>{questionData.profiles.email}</span
									>
								{/if}
								{#if questionData.profiles?.enneagram}
									<span class="question-detail-modal__author-meta"
										>Type {questionData.profiles.enneagram}</span
									>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</aside>
		</div>

		<footer class="question-detail-modal__footer">
			<div class="question-detail-modal__footer-primary">
				{#if confirmingTag}
					<div class="question-detail-modal__confirm">
						<span class="question-detail-modal__confirm-text">Run AI tagging now?</span>
						<div class="question-detail-modal__confirm-actions">
							<button
								type="button"
								class="question-detail-modal__button question-detail-modal__button--primary question-detail-modal__button--small"
								disabled={taggingLoading || backgroundTagging}
								on:click={tagQuestion}
							>
								{taggingLoading ? 'Starting...' : backgroundTagging ? 'Running...' : 'Confirm'}
							</button>
							<button
								type="button"
								class="question-detail-modal__button question-detail-modal__button--secondary question-detail-modal__button--small"
								disabled={taggingLoading || backgroundTagging}
								on:click={() => (confirmingTag = false)}
							>
								Cancel
							</button>
						</div>
					</div>
				{:else}
					<button
						type="button"
						class="question-detail-modal__button question-detail-modal__button--outline"
						disabled={backgroundTagging}
						on:click={() => (confirmingTag = true)}
					>
						{backgroundTagging ? 'AI Tagging...' : 'AI Tag'}
					</button>
				{/if}
			</div>

			<div class="question-detail-modal__actions">
				<button
					type="button"
					class="question-detail-modal__button question-detail-modal__button--secondary"
					on:click={startEditing}
				>
					Edit Question
				</button>
				<a
					href="/questions/{questionData.url}"
					class="question-detail-modal__button question-detail-modal__button--primary"
					target="_blank"
				>
					Open Public Page
				</a>
			</div>
		</footer>
	{/if}
</div>

<style>
	.question-detail-modal {
		overflow: hidden;
		width: 100%;
		border: 1px solid color-mix(in srgb, var(--primary) 12%, var(--border-color));
		border-radius: 24px;
		background: linear-gradient(
			180deg,
			var(--bg-surface) 0%,
			color-mix(in srgb, var(--bg-surface) 82%, var(--bg-deep)) 100%
		);
		box-shadow: var(--shadow-md);
	}

	.question-detail-modal__hero {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 28px 72px 24px 28px;
		border-bottom: 1px solid color-mix(in srgb, var(--primary) 10%, var(--border-color));
		background: linear-gradient(
			140deg,
			color-mix(in srgb, var(--primary) 10%, var(--bg-surface)) 0%,
			var(--bg-deep) 100%
		);
	}

	.question-detail-modal__hero-copy {
		max-width: 680px;
	}

	.question-detail-modal__eyebrow,
	.question-detail-modal__label {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.question-detail-modal__title {
		margin: 10px 0 0;
		font-size: clamp(1.3rem, 1.8vw, 1.85rem);
		line-height: 1.35;
		color: var(--text-primary);
		word-break: break-word;
	}

	.question-detail-modal__subtitle {
		margin: 12px 0 0;
		max-width: 58ch;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.question-detail-modal__status-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: flex-end;
		max-width: 320px;
	}

	.question-detail-modal__status {
		display: inline-flex;
		align-items: center;
		padding: 6px 10px;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1;
	}

	.question-detail-modal__status--success {
		background: rgba(16, 185, 129, 0.13);
		color: #34d399;
	}

	.question-detail-modal__status--info {
		background: rgba(59, 130, 246, 0.14);
		color: #60a5fa;
	}

	.question-detail-modal__status--warning {
		background: rgba(245, 158, 11, 0.15);
		color: #fbbf24;
	}

	.question-detail-modal__status--danger {
		background: rgba(239, 68, 68, 0.14);
		color: #fca5a5;
	}

	.question-detail-modal__status--neutral {
		background: rgba(148, 163, 184, 0.16);
		color: #cbd5e1;
	}

	.question-detail-modal__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.95fr);
		gap: 18px;
		padding: 24px 28px 0;
	}

	.question-detail-modal__panel {
		display: flex;
		flex-direction: column;
		gap: 18px;
		min-width: 0;
		padding: 20px;
		border: 1px solid var(--border-color);
		border-radius: 18px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-deep) 88%, black) 0%,
			var(--bg-deep) 100%
		);
	}

	.question-detail-modal__section {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}

	.question-detail-modal__text-block,
	.question-detail-modal__textarea,
	.question-detail-modal__empty-card {
		margin: 0;
		padding: 16px;
		border: 1px solid color-mix(in srgb, var(--primary) 8%, var(--border-color));
		border-radius: 16px;
		background: color-mix(in srgb, var(--bg-surface) 78%, var(--bg-deep));
		color: var(--text-primary);
		line-height: 1.65;
		word-break: break-word;
	}

	.question-detail-modal__text-block--muted,
	.question-detail-modal__empty-card {
		color: color-mix(in srgb, var(--text-secondary) 88%, white 12%);
	}

	.question-detail-modal__text-block--accent {
		border-color: color-mix(in srgb, var(--primary) 20%, var(--border-color));
		background: color-mix(in srgb, var(--primary) 8%, var(--bg-surface));
	}

	.question-detail-modal__textarea {
		min-height: 180px;
		width: 100%;
		resize: vertical;
		font: inherit;
	}

	.question-detail-modal__textarea:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--primary) 60%, var(--border-color));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
	}

	.question-detail-modal__toggle-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.question-detail-modal__toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		min-height: 48px;
		padding: 12px 14px;
		border: 1px solid var(--border-color);
		border-radius: 14px;
		background: color-mix(in srgb, var(--bg-surface) 74%, var(--bg-deep));
		color: var(--text-secondary);
		font-size: 0.85rem;
		font-weight: 650;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	.question-detail-modal__toggle:hover {
		border-color: color-mix(in srgb, var(--primary) 30%, var(--border-color));
		color: var(--text-primary);
	}

	.question-detail-modal__toggle--warning {
		border-color: rgba(245, 158, 11, 0.45);
		background: rgba(245, 158, 11, 0.14);
		color: #fbbf24;
	}

	.question-detail-modal__toggle--danger {
		border-color: rgba(239, 68, 68, 0.45);
		background: rgba(239, 68, 68, 0.12);
		color: #fca5a5;
	}

	.question-detail-modal__chip-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.question-detail-modal__chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 12px;
		border-radius: 999px;
		background: rgba(99, 102, 241, 0.12);
		color: #a5b4fc;
		font-size: 0.8rem;
		font-weight: 650;
	}

	.question-detail-modal__chip--keyword {
		background: rgba(16, 185, 129, 0.12);
		color: #6ee7b7;
	}

	.question-detail-modal__chip--selected {
		background: color-mix(in srgb, var(--primary) 12%, transparent);
		color: color-mix(in srgb, var(--primary) 82%, white);
	}

	.question-detail-modal__chip-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		padding: 0;
		border: none;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		color: inherit;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.question-detail-modal__chip-remove:hover {
		background: rgba(255, 255, 255, 0.16);
	}

	.question-detail-modal__tag-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		max-height: 240px;
		overflow-y: auto;
		padding: 4px;
	}

	.question-detail-modal__tag-action {
		padding: 8px 12px;
		border: 1px dashed color-mix(in srgb, var(--primary) 20%, var(--border-color));
		border-radius: 999px;
		background: transparent;
		color: var(--text-secondary);
		font-size: 0.78rem;
		font-weight: 650;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			color 0.2s ease,
			background 0.2s ease;
	}

	.question-detail-modal__tag-action:hover {
		border-color: color-mix(in srgb, var(--primary) 50%, var(--border-color));
		background: color-mix(in srgb, var(--primary) 10%, transparent);
		color: color-mix(in srgb, var(--primary) 82%, white);
	}

	.question-detail-modal__empty {
		color: var(--text-secondary);
		font-size: 0.84rem;
		line-height: 1.5;
	}

	.question-detail-modal__summary-list {
		display: grid;
		gap: 12px;
	}

	.question-detail-modal__summary-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px 16px;
		border: 1px solid color-mix(in srgb, var(--primary) 8%, var(--border-color));
		border-radius: 16px;
		background: color-mix(in srgb, var(--bg-surface) 70%, var(--bg-deep));
	}

	.question-detail-modal__summary-value {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.question-detail-modal__summary-value--inline {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.question-detail-modal__summary-value--wrap {
		word-break: break-word;
	}

	.question-detail-modal__author {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.question-detail-modal__author-email,
	.question-detail-modal__author-meta {
		color: var(--text-secondary);
		font-size: 0.82rem;
		line-height: 1.4;
		word-break: break-word;
	}

	.question-detail-modal__footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 28px 28px;
	}

	.question-detail-modal__footer-primary {
		display: flex;
		flex: 1 1 320px;
		align-items: center;
		min-width: 0;
	}

	.question-detail-modal__footer-note {
		margin: 0;
		flex: 1 1 280px;
		font-size: 0.86rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.question-detail-modal__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-left: auto;
	}

	.question-detail-modal__confirm {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 12px 14px;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		border-radius: 16px;
		background: color-mix(in srgb, var(--primary) 8%, var(--bg-surface));
	}

	.question-detail-modal__confirm-text {
		font-size: 0.88rem;
		font-weight: 650;
		color: var(--text-primary);
	}

	.question-detail-modal__confirm-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-left: auto;
	}

	.question-detail-modal__button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 42px;
		padding: 0 16px;
		border-radius: 12px;
		border: 1px solid transparent;
		font-size: 0.84rem;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease,
			opacity 0.2s ease;
	}

	.question-detail-modal__button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	.question-detail-modal__button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.question-detail-modal__button--small {
		min-height: 36px;
		padding: 0 14px;
		font-size: 0.78rem;
	}

	.question-detail-modal__button--primary {
		background: var(--primary);
		color: white;
	}

	.question-detail-modal__button--secondary,
	.question-detail-modal__button--outline {
		border-color: var(--border-color);
		background: color-mix(in srgb, var(--bg-surface) 76%, var(--bg-deep));
		color: var(--text-primary);
	}

	.question-detail-modal__button--secondary:hover:not(:disabled),
	.question-detail-modal__button--outline:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--primary) 35%, var(--border-color));
		color: color-mix(in srgb, var(--primary) 82%, white);
	}

	@media (max-width: 920px) {
		.question-detail-modal__grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.question-detail-modal__hero {
			padding: 24px 52px 20px 20px;
		}

		.question-detail-modal__grid {
			padding: 20px 20px 0;
		}

		.question-detail-modal__panel {
			padding: 16px;
		}

		.question-detail-modal__footer {
			padding: 18px 20px 20px;
		}

		.question-detail-modal__toggle-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.question-detail-modal__status-list,
		.question-detail-modal__actions,
		.question-detail-modal__confirm-actions {
			width: 100%;
		}

		.question-detail-modal__actions .question-detail-modal__button,
		.question-detail-modal__actions a {
			flex: 1 1 0;
		}

		.question-detail-modal__confirm-actions {
			margin-left: 0;
		}
	}
</style>
