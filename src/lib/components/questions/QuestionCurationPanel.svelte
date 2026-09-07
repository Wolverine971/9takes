<!-- src/lib/components/questions/QuestionCurationPanel.svelte -->
<!--
  Admin-only curation for one question:
    * starter_rank        position in the /questions "Start here" block (blank = not a starter)
    * pinned_comment_ids  up to three top-level answers boosted to the head of the default order
  Saves through /admin/questions?/curate (service-role RPC set_question_curation,
  guarded by requireAdmin). Mounted inside AdminQuestionItem's details view.
-->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { Button, Field, Input } from '$lib/components/atoms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { MAX_PINNED_COMMENTS, normalizePinnedCommentIds } from './curatedReveal';

	type CurationState = { starterRank: number | null; pinnedCommentIds: number[] };
	type AnswerOption = {
		id: number;
		snippet: string;
		anonymous: boolean;
		created_at: string | null;
		like_count: number;
		reply_count: number;
	};

	interface Props {
		questionId: number;
		starterRank?: number | null;
		pinnedCommentIds?: number[];
		oncurationSaved?: (curation: CurationState) => void;
	}

	let { questionId, starterRank = null, pinnedCommentIds = [], oncurationSaved }: Props = $props();

	let rankInput = $state('');
	let pinnedInput = $state('');
	let saving = $state(false);
	let loadingAnswers = $state(false);
	let answers = $state<AnswerOption[] | null>(null);
	let answersError = $state('');
	let lastSyncedQuestionId = $state<number | null>(null);

	// Re-seed the editable fields whenever a different question is opened in the modal.
	$effect(() => {
		if (lastSyncedQuestionId === questionId) return;
		lastSyncedQuestionId = questionId;
		rankInput = starterRank ? String(starterRank) : '';
		pinnedInput = (pinnedCommentIds ?? []).join(', ');
		answers = null;
		answersError = '';
	});

	let selectedPinnedIds = $derived(
		normalizePinnedCommentIds(
			pinnedInput
				.split(/[,\s]+/)
				.map((part) => part.trim())
				.filter(Boolean)
		)
	);
	let atPinLimit = $derived(selectedPinnedIds.length >= MAX_PINNED_COMMENTS);

	function togglePinned(id: number) {
		if (selectedPinnedIds.includes(id)) {
			pinnedInput = selectedPinnedIds.filter((existing) => existing !== id).join(', ');
			return;
		}
		if (atPinLimit) {
			notifications.warning(`Only ${MAX_PINNED_COMMENTS} answers can be pinned.`, 3000);
			return;
		}
		pinnedInput = [...selectedPinnedIds, id].join(', ');
	}

	async function loadAnswers() {
		loadingAnswers = true;
		answersError = '';
		try {
			const body = new FormData();
			body.append('questionId', String(questionId));
			const response = await fetch('/admin/questions?/listAnswers', { method: 'POST', body });
			const result: any = deserialize(await response.text());
			const payload = result?.data?.answers;
			if (result?.type !== 'success' || !payload || payload.error) {
				answersError = payload?.error ?? 'Could not load answers.';
				return;
			}
			answers = (payload.items ?? []) as AnswerOption[];
		} catch {
			answersError = 'Could not load answers.';
		} finally {
			loadingAnswers = false;
		}
	}

	async function save() {
		saving = true;
		try {
			const body = new FormData();
			body.append('questionId', String(questionId));
			body.append('starterRank', rankInput.trim());
			body.append('pinnedCommentIds', selectedPinnedIds.join(','));
			const response = await fetch('/admin/questions?/curate', { method: 'POST', body });
			const result: any = deserialize(await response.text());
			const payload = result?.data?.curation;

			if (result?.type !== 'success' || !payload || payload.error) {
				notifications.danger(payload?.error ?? 'Could not save curation.', 5000);
				return;
			}

			const saved: CurationState = {
				starterRank: payload.starterRank ?? null,
				pinnedCommentIds: normalizePinnedCommentIds(payload.pinnedCommentIds)
			};
			rankInput = saved.starterRank ? String(saved.starterRank) : '';
			pinnedInput = saved.pinnedCommentIds.join(', ');

			const dropped: number[] = Array.isArray(payload.droppedCommentIds)
				? payload.droppedCommentIds
				: [];
			if (dropped.length) {
				notifications.warning(
					`Saved. Dropped ${dropped.join(', ')}: not a live top-level answer on this question.`,
					6000
				);
			} else {
				notifications.success('Curation saved', 3000);
			}
			oncurationSaved?.(saved);
		} catch {
			notifications.danger('Could not save curation.', 5000);
		} finally {
			saving = false;
		}
	}

	function formatAnswerDate(value: string | null): string {
		if (!value) return '';
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
	}
</script>

<section class="curation" aria-labelledby="curation-title-{questionId}">
	<div class="curation__head">
		<h3 id="curation-title-{questionId}" class="curation__title">Curation</h3>
		<p class="curation__copy">
			Starter rank puts this question in the "Start here" block on /questions. Boosted answers lead
			the default order after the reveal, inside the one list, in the order given. No separate
			section. Once the ranked order ships they become the early boost.
		</p>
	</div>

	<div class="curation__grid">
		<Field
			for="curation-rank-{questionId}"
			label="Starter rank"
			help="Blank = not a starter. 1 is the top of the block."
		>
			<Input
				id="curation-rank-{questionId}"
				type="number"
				inputmode="numeric"
				min="1"
				max="999"
				step="1"
				density="compact"
				placeholder="—"
				bind:value={rankInput}
			/>
		</Field>

		<Field
			for="curation-pins-{questionId}"
			label="Boosted answer ids"
			help={`Comma-separated comment ids, max ${MAX_PINNED_COMMENTS}. Order = display order.`}
		>
			<Input
				id="curation-pins-{questionId}"
				type="text"
				density="compact"
				placeholder="e.g. 375, 372, 661"
				bind:value={pinnedInput}
			/>
		</Field>
	</div>

	<div class="curation__answers">
		<div class="curation__answers-head">
			<span class="curation__label">Answers on this question</span>
			<Button
				variant="secondary"
				size="sm"
				type="button"
				onclick={loadAnswers}
				loading={loadingAnswers}
				disabled={loadingAnswers}
			>
				{answers ? 'Reload answers' : 'Load answers'}
			</Button>
		</div>

		{#if answersError}
			<p class="curation__error" role="alert">{answersError}</p>
		{:else if answers}
			{#if answers.length === 0}
				<p class="curation__empty">No live top-level answers yet.</p>
			{:else}
				<ul class="curation__list">
					{#each answers as answer (answer.id)}
						{@const pinnedIndex = selectedPinnedIds.indexOf(answer.id)}
						<li>
							<button
								type="button"
								class="curation__answer"
								class:curation__answer--pinned={pinnedIndex !== -1}
								aria-pressed={pinnedIndex !== -1}
								onclick={() => togglePinned(answer.id)}
							>
								<span class="curation__answer-slot">
									{pinnedIndex === -1 ? '+' : `#${pinnedIndex + 1}`}
								</span>
								<span class="curation__answer-body">
									<span class="curation__answer-text">{answer.snippet || '(empty)'}</span>
									<span class="curation__answer-meta">
										id {answer.id} · {answer.anonymous ? 'anon' : 'member'} · {answer.like_count}
										{answer.like_count === 1 ? 'like' : 'likes'} · {answer.reply_count}
										{answer.reply_count === 1 ? 'reply' : 'replies'}
										{#if formatAnswerDate(answer.created_at)}
											· {formatAnswerDate(answer.created_at)}
										{/if}
									</span>
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</div>

	<div class="curation__actions">
		<span class="curation__status">
			{selectedPinnedIds.length}/{MAX_PINNED_COMMENTS} boosted
			{#if rankInput.trim()}
				· starter #{rankInput.trim()}
			{:else}
				· not a starter
			{/if}
		</span>
		<Button
			variant="primary"
			size="sm"
			type="button"
			onclick={save}
			loading={saving}
			disabled={saving}
		>
			{saving ? 'Saving…' : 'Save curation'}
		</Button>
	</div>
</section>

<style>
	.curation {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 16px;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 22%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-soft) 30%, var(--stone-warm));
	}

	.curation__head {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.curation__title {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.curation__copy,
	.curation__empty,
	.curation__error,
	.curation__status {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.curation__error {
		color: var(--error-text);
	}

	.curation__grid {
		display: grid;
		grid-template-columns: minmax(0, 160px) minmax(0, 1fr);
		gap: 12px;
	}

	.curation__answers {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.curation__answers-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.curation__label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-mid);
	}

	.curation__list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		max-height: 18rem;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		list-style: none;
	}

	.curation__answer {
		display: grid;
		grid-template-columns: 2.25rem minmax(0, 1fr);
		gap: 10px;
		align-items: start;
		width: 100%;
		padding: 8px 10px;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
	}

	.curation__answer:hover {
		border-color: var(--ink-dim);
	}

	.curation__answer:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.curation__answer--pinned {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-soft) 45%, var(--night-mid));
	}

	.curation__answer-slot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 1.6rem;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.72rem;
		color: var(--lamp-glow);
	}

	.curation__answer-body {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.curation__answer-text {
		font-size: 0.86rem;
		line-height: 1.4;
		color: var(--ink-bright);
		overflow-wrap: anywhere;
	}

	.curation__answer-meta {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.66rem;
		letter-spacing: 0.04em;
		color: var(--ink-dim);
	}

	.curation__actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}

	@media (max-width: 640px) {
		.curation__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
