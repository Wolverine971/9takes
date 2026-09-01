<!-- src/routes/admin/question-distribution/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	function questionLabel(question: {
		id: number;
		question: string | null;
		question_formatted: string | null;
	}): string {
		return `#${question.id} — ${question.question_formatted || question.question || 'Untitled question'}`;
	}

	function runQuestion(run: {
		question_id: number;
		questions?:
			| { question?: string | null; question_formatted?: string | null }
			| Array<{ question?: string | null; question_formatted?: string | null }>;
	}): string {
		const relation = Array.isArray(run.questions) ? run.questions[0] : run.questions;
		return relation?.question_formatted || relation?.question || `Question #${run.question_id}`;
	}

	function runQuestionUrl(run: {
		questions?: { url?: string | null } | Array<{ url?: string | null }>;
	}): string | null {
		const relation = Array.isArray(run.questions) ? run.questions[0] : run.questions;
		return relation?.url || null;
	}

	function formatDate(value: string | null | undefined): string {
		if (!value) return '—';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(value));
	}

	let progress = $derived(
		data.current?.target_unique_impressions
			? Math.min(
					100,
					Math.round(
						((data.current.qualified_unique_impressions ?? 0) /
							data.current.target_unique_impressions) *
							100
					)
				)
			: 0
	);
</script>

<svelte:head>
	<title>Question Distribution | 9takes Admin</title>
</svelte:head>

<div class="distribution-page">
	<header class="page-header">
		<div>
			<span class="eyebrow">Comment growth / controlled pilot</span>
			<h1>Question distribution</h1>
			<p>
				Choose one homepage question, give it a fair exposure window, and review the result before
				choosing the next one.
			</p>
		</div>
		<div class="automation-state">
			<span>Automation</span>
			<strong>Manual only</strong>
			<small>Automatic queue advancement is off.</small>
		</div>
	</header>

	{#if form?.message}
		<p class={['form-message', form.success ? 'success' : 'error']} role="status">
			{form.message}
		</p>
	{/if}

	<section class="current-card" aria-labelledby="current-feature-heading">
		<div class="section-heading">
			<div>
				<span class="eyebrow">Live homepage selection</span>
				<h2 id="current-feature-heading">
					{data.current?.is_fallback ? 'Fallback question' : 'Active feature run'}
				</h2>
			</div>
			<span class={['status-pill', data.current?.is_fallback ? 'fallback' : 'active']}>
				{data.current?.is_fallback ? 'Fallback' : 'Active'}
			</span>
		</div>

		{#if data.current}
			<a
				class="current-question"
				href={resolve(`/questions/${data.current.question_url}`)}
				target="_blank"
			>
				#{data.current.question_id} — {data.current.question_text}
			</a>

			{#if data.current.run_id}
				<div class="progress-copy">
					<strong>
						{data.current.qualified_unique_impressions} / {data.current.target_unique_impressions} qualified
						unique impressions
					</strong>
					<span>{progress}%</span>
				</div>
				<div
					class="progress-track"
					role="progressbar"
					aria-label="Qualified homepage impression progress"
					aria-valuenow={data.current.qualified_unique_impressions}
					aria-valuemin="0"
					aria-valuemax={data.current.target_unique_impressions}
				>
					<div class="progress-fill" style:width={`${progress}%`}></div>
				</div>
				<div class="run-meta">
					<span>Started {formatDate(data.current.started_at)}</span>
					<span>Ends {formatDate(data.current.ends_at)}</span>
					<span>Mode: {data.current.selection_mode}</span>
				</div>

				<form class="control-row" method="POST" action="?/control" use:enhance>
					<input type="hidden" name="runId" value={data.current.run_id} />
					<button type="submit" name="controlAction" value="pause">Pause</button>
					<label>
						<span>Extend by</span>
						<input name="extensionDays" type="number" min="1" max="90" value="7" />
						<span>days</span>
					</label>
					<button type="submit" name="controlAction" value="extend">Extend</button>
					<button class="danger" type="submit" name="controlAction" value="stop">Stop</button>
				</form>
			{:else}
				<p class="fallback-note">
					No pilot is active. The explicit fallback remains live until an operator starts a run.
				</p>
			{/if}
		{:else}
			<p class="empty-state">
				No eligible database selection is available. The application emergency fallback is in use.
			</p>
		{/if}
	</section>

	<div class="control-grid">
		<section class="panel" aria-labelledby="start-run-heading">
			<div class="section-heading">
				<div>
					<span class="eyebrow">Operator decision</span>
					<h2 id="start-run-heading">Start or replace a run</h2>
				</div>
			</div>

			<form class="stacked-form" method="POST" action="?/start" use:enhance>
				<label>
					<span>Eligible question</span>
					<select name="questionId" required>
						<option value="">Choose a question</option>
						{#each data.candidates as question (question.id)}
							<option value={question.id}>
								{questionLabel(question)} · {question.comment_count ?? 0} responses
							</option>
						{/each}
					</select>
				</label>

				<label>
					<span>Why this question?</span>
					<textarea
						name="reason"
						rows="3"
						maxlength="500"
						required
						placeholder="Example: New, broadly understandable, and needs a first response."
					></textarea>
				</label>

				<div class="field-row">
					<label>
						<span>Unique impression target</span>
						<input
							name="targetUniqueImpressions"
							type="number"
							min="1"
							max="100000"
							value={data.settings?.default_target_unique_impressions ?? 30}
						/>
					</label>
					<label>
						<span>Maximum days</span>
						<input
							name="maxDurationDays"
							type="number"
							min="1"
							max="90"
							value={data.settings?.default_max_duration_days ?? 7}
						/>
					</label>
				</div>

				<label>
					<span>Operator notes <small>optional</small></span>
					<textarea name="notes" rows="2" maxlength="2000"></textarea>
				</label>

				<button class="primary" type="submit">
					{data.current?.run_id ? 'Replace active run' : 'Start feature run'}
				</button>
				<p class="form-help">
					Starting a run ends any active run as “replaced.” Questions are checked again for
					moderation eligibility inside the transaction.
				</p>
			</form>
		</section>

		<section class="panel" aria-labelledby="fallback-heading">
			<div class="section-heading">
				<div>
					<span class="eyebrow">Safe idle state</span>
					<h2 id="fallback-heading">Homepage fallback</h2>
				</div>
			</div>
			<p class="panel-copy">
				This question appears when no run is active, paused runs included. Changing it does not
				start a feature run.
			</p>
			<form class="stacked-form" method="POST" action="?/setFallback" use:enhance>
				<label>
					<span>Fallback question</span>
					<select name="questionId" required>
						{#each data.candidates as question (question.id)}
							<option
								value={question.id}
								selected={question.id === data.settings?.fallback_question_id}
							>
								{questionLabel(question)}
							</option>
						{/each}
					</select>
				</label>
				<button type="submit">Update fallback</button>
			</form>
		</section>
	</div>

	<section class="history-panel" aria-labelledby="history-heading">
		<div class="section-heading">
			<div>
				<span class="eyebrow">Audit trail</span>
				<h2 id="history-heading">Recent feature runs</h2>
			</div>
			<span>{data.runs.length} shown</span>
		</div>

		<div class="history-table" role="region" aria-label="Recent question feature runs">
			<table>
				<thead>
					<tr>
						<th>Question</th>
						<th>Status</th>
						<th>Qualified</th>
						<th>Window</th>
						<th>Selection reason</th>
						<th>Controls</th>
					</tr>
				</thead>
				<tbody>
					{#each data.runs as run (run.id)}
						<tr>
							<td>
								{#if runQuestionUrl(run)}
									<a href={resolve(`/questions/${runQuestionUrl(run)}`)} target="_blank">
										{runQuestion(run)}
									</a>
								{:else}
									{runQuestion(run)}
								{/if}
								<small>#{run.question_id} · {run.selection_mode}</small>
							</td>
							<td>
								<span class={['status-pill', run.status]}>{run.status}</span>
								{#if run.ended_reason}<small>{run.ended_reason}</small>{/if}
							</td>
							<td>{run.qualified_unique_impressions} / {run.target_unique_impressions}</td>
							<td>
								{formatDate(run.started_at)}
								<small>to {formatDate(run.ends_at)}</small>
							</td>
							<td>{run.reason_selected}</td>
							<td>
								{#if run.status === 'paused'}
									<form method="POST" action="?/control" use:enhance>
										<input type="hidden" name="runId" value={run.id} />
										<button type="submit" name="controlAction" value="resume">Resume</button>
									</form>
								{:else}
									<span>—</span>
								{/if}
							</td>
						</tr>
					{:else}
						<tr><td colspan="6">No feature runs yet.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	.distribution-page {
		display: grid;
		gap: 1.5rem;
		padding-bottom: 3rem;
		color: var(--text-primary, #172016);
	}

	.page-header,
	.section-heading,
	.progress-copy,
	.run-meta,
	.control-row,
	.field-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.page-header {
		align-items: flex-end;
		padding: 1.5rem 0 0.5rem;
	}

	h1,
	h2,
	p {
		margin: 0;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 3.5rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	h2 {
		font-size: 1.2rem;
		letter-spacing: -0.02em;
	}

	.page-header p,
	.panel-copy,
	.form-help,
	.fallback-note {
		max-width: 44rem;
		margin-top: 0.65rem;
		color: var(--text-secondary, #60705f);
		line-height: 1.55;
	}

	.eyebrow {
		display: block;
		margin-bottom: 0.45rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent, #5d6f34);
	}

	.automation-state,
	.current-card,
	.panel,
	.history-panel {
		border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--surface, #fff) 96%, #eef1e7);
		box-shadow: 0 1rem 2.5rem rgb(24 34 20 / 6%);
	}

	.automation-state {
		min-width: 13rem;
		padding: 0.9rem 1rem;
	}

	.automation-state span,
	.automation-state small,
	.run-meta,
	td small {
		display: block;
		font-size: 0.75rem;
		color: var(--text-secondary, #60705f);
	}

	.current-card,
	.panel,
	.history-panel {
		padding: 1.25rem;
	}

	.current-question {
		display: block;
		margin: 1.2rem 0;
		font-size: clamp(1.15rem, 2vw, 1.55rem);
		font-weight: 700;
		color: inherit;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25rem;
	}

	.status-pill {
		display: inline-flex;
		width: fit-content;
		align-items: center;
		border-radius: 999px;
		padding: 0.3rem 0.6rem;
		background: #edf0e7;
		font-family: var(--font-mono, monospace);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.status-pill.active {
		background: #dcefd8;
		color: #25551f;
	}

	.status-pill.paused,
	.status-pill.fallback {
		background: #f4ebcb;
		color: #695814;
	}

	.status-pill.ended {
		background: #e8e9e7;
		color: #5a5e58;
	}

	.progress-copy {
		font-size: 0.85rem;
	}

	.progress-track {
		height: 0.55rem;
		margin-top: 0.5rem;
		overflow: hidden;
		border-radius: 999px;
		background: #e5e9df;
	}

	.progress-fill {
		height: 100%;
		border-radius: inherit;
		background: var(--accent, #687a3c);
	}

	.run-meta {
		justify-content: flex-start;
		margin-top: 0.75rem;
	}

	.control-row {
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-top: 1.2rem;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent);
	}

	.control-row label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
	}

	.control-row input {
		width: 4rem;
	}

	.control-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 0.75fr);
		gap: 1.5rem;
		align-items: start;
	}

	.stacked-form {
		display: grid;
		gap: 1rem;
		margin-top: 1.2rem;
	}

	.stacked-form label {
		display: grid;
		gap: 0.4rem;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.stacked-form label small {
		font-weight: 400;
		color: var(--text-secondary, #60705f);
	}

	.field-row > * {
		flex: 1;
	}

	input,
	select,
	textarea,
	button {
		font: inherit;
	}

	input,
	select,
	textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		border-radius: 0.625rem;
		padding: 0.65rem 0.75rem;
		background: var(--surface, #fff);
		color: inherit;
	}

	textarea {
		resize: vertical;
	}

	button {
		width: fit-content;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		border-radius: 0.625rem;
		padding: 0.55rem 0.8rem;
		background: var(--surface, #fff);
		color: inherit;
		font-weight: 750;
		cursor: pointer;
	}

	button:hover {
		background: #edf0e7;
	}

	button.primary {
		background: #26351f;
		color: white;
	}

	button.danger {
		color: #8a2d24;
	}

	.form-message {
		border-radius: 1rem;
		padding: 0.75rem 0.9rem;
	}

	.form-message.success {
		background: #e0f1dc;
		color: #24551d;
	}

	.form-message.error {
		background: #f8dfdc;
		color: #7e2820;
	}

	.history-table {
		margin-top: 1rem;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}

	th,
	td {
		padding: 0.75rem 0.6rem;
		border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
		text-align: left;
		vertical-align: top;
	}

	th {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary, #60705f);
	}

	td a {
		color: inherit;
		font-weight: 650;
	}

	.empty-state {
		padding: 1.5rem 0;
		color: var(--text-secondary, #60705f);
	}

	@media (max-width: 900px) {
		.page-header,
		.control-grid,
		.field-row {
			display: grid;
			grid-template-columns: 1fr;
		}

		.automation-state {
			min-width: 0;
		}
	}

	@media (max-width: 600px) {
		.run-meta {
			display: grid;
			grid-template-columns: 1fr;
		}

		.current-card,
		.panel,
		.history-panel {
			padding: 1rem;
		}
	}
</style>
