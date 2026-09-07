<!-- src/routes/admin/host-desk/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Textarea } from '$lib/components/atoms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let texts = $state<Record<number, string>>({});
	let running = $state(false);

	$effect(() => {
		// Seed each pending editor with Draft A unless the operator already typed.
		for (const draft of data.pending) {
			if (texts[draft.id] === undefined) texts[draft.id] = draft.draft_a;
		}
	});

	function formatDate(value: string | null | undefined): string {
		if (!value) return '—';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(new Date(value));
	}

	function isLowEffort(text: string | undefined): boolean {
		const clean = (text ?? '').trim();
		return (
			clean.length < 3 || !/[\p{L}\p{N}]/u.test(clean) || (!/\s/.test(clean) && clean.length <= 12)
		);
	}
</script>

<svelte:head>
	<title>Host Desk | 9takes Admin</title>
</svelte:head>

<div class="desk-page">
	<header class="page-header">
		<div>
			<span class="eyebrow">Retention / host replies</span>
			<h1>Host desk</h1>
			<p>
				Every new human take gets two drafted replies in your voice. Post one, edit it, or skip. The
				morning email does the same thing with one tap.
			</p>
		</div>
		<form
			method="POST"
			action="?/runDigest"
			use:enhance={() => {
				running = true;
				return async ({ update }) => {
					await update({ reset: false });
					running = false;
				};
			}}
		>
			<Button type="submit" variant="secondary" loading={running}>Run digest now</Button>
		</form>
	</header>

	{#if form?.message}
		<p class={['form-message', form.success ? 'success' : 'error']} role="status">
			{form.message}
		</p>
	{/if}

	<section class="panel" aria-labelledby="pending-heading">
		<div class="section-heading">
			<div>
				<span class="eyebrow">Waiting on you</span>
				<h2 id="pending-heading">Pending ({data.pending.length})</h2>
			</div>
		</div>

		{#if data.pending.length === 0}
			<p class="empty-state">Nothing pending. The next digest runs at 9am ET.</p>
		{:else}
			<ul class="draft-list">
				{#each data.pending as draft (draft.id)}
					<li class="draft-card">
						<div class="draft-meta">
							{#if draft.questionHref}
								<a href={draft.questionHref} target="_blank" rel="noopener">
									{draft.question?.text || `Question #${draft.question_id}`}
								</a>
							{:else}
								<span>{draft.question?.text || `Question #${draft.question_id}`}</span>
							{/if}
							<small>
								{draft.authorLabel} · {formatDate(draft.take?.created_at)}
								{#if draft.digest_sent_at}
									· emailed {formatDate(draft.digest_sent_at)}
								{:else}
									· not emailed yet
								{/if}
							</small>
						</div>

						{#if draft.take?.parent_text}
							<p class="parent">Replying to: {draft.take.parent_text}</p>
						{/if}

						<blockquote class="take">
							{draft.take?.text ?? '(take unavailable)'}
							{#if draft.low_effort || isLowEffort(draft.take?.text)}
								<span class="status-pill low">low effort</span>
							{/if}
							{#if draft.take?.removed}
								<span class="status-pill ended">removed</span>
							{/if}
						</blockquote>

						<div class="drafts">
							<button
								type="button"
								class="draft-option"
								class:active={texts[draft.id] === draft.draft_a}
								onclick={() => (texts[draft.id] = draft.draft_a)}
							>
								<span class="option-label">Draft A</span>
								<span>{draft.draft_a}</span>
							</button>
							<button
								type="button"
								class="draft-option"
								class:active={texts[draft.id] === draft.draft_b}
								onclick={() => (texts[draft.id] = draft.draft_b)}
							>
								<span class="option-label">Draft B</span>
								<span>{draft.draft_b}</span>
							</button>
						</div>

						<form method="POST" action="?/markLowEffort" use:enhance>
							<input type="hidden" name="draftId" value={draft.id} />
							<input type="hidden" name="lowEffort" value={draft.low_effort ? 'false' : 'true'} />
							<Button type="submit" size="sm" variant="ghost"
								>{draft.low_effort ? 'Clear low-effort flag' : 'Mark low effort'}</Button
							>
						</form>
						<form class="post-form" method="POST" action="?/post" use:enhance>
							<input type="hidden" name="draftId" value={draft.id} />
							<Textarea
								name="text"
								rows={3}
								maxlength={5000}
								bind:value={texts[draft.id]}
								required
							/>
							<div class="actions">
								<Button type="submit" size="sm" disabled={draft.take?.removed}>Post as DJ</Button>
								<Button type="submit" size="sm" variant="ghost" formaction="?/skip" formnovalidate>
									Skip
								</Button>
							</div>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section class="panel" aria-labelledby="history-heading">
		<div class="section-heading">
			<div>
				<span class="eyebrow">Last {data.historyDays} days</span>
				<h2 id="history-heading">History ({data.history.length})</h2>
			</div>
		</div>

		{#if data.history.length === 0}
			<p class="empty-state">No posted or skipped drafts yet.</p>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>When</th>
							<th>Status</th>
							<th>Take</th>
							<th>Rank at reply</th>
							<th>Reply</th>
						</tr>
					</thead>
					<tbody>
						{#each data.history as draft (draft.id)}
							<tr>
								<td>
									{formatDate(draft.acted_at ?? draft.updated_at)}
									<small>{draft.authorLabel}</small>
								</td>
								<td>
									<span class={['status-pill', draft.status]}>{draft.status}</span>
								</td>
								<td>
									{#if draft.questionHref}
										<a href={draft.questionHref} target="_blank" rel="noopener">
											{draft.take?.text ?? '(take unavailable)'}
										</a>
									{:else}
										{draft.take?.text ?? '(take unavailable)'}
									{/if}
								</td>
								<td>{draft.take_rank_at_post ? `#${draft.take_rank_at_post}` : '—'}</td>
								<td>{draft.posted_text ?? '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<p class="foot">Posting as host user <code>{data.hostUserId}</code>.</p>
</div>

<style>
	.desk-page {
		display: grid;
		gap: 1.5rem;
		padding-bottom: 3rem;
		color: var(--ink-bright);
	}

	.page-header,
	.section-heading,
	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.page-header {
		align-items: flex-end;
		padding: 1.5rem 0 0.5rem;
		flex-wrap: wrap;
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
	.empty-state,
	.foot {
		max-width: 44rem;
		margin-top: 0.65rem;
		color: var(--ink-dim);
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
		color: var(--lamp-glow);
	}

	.panel {
		padding: 1.25rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);
	}

	.form-message {
		padding: 0.75rem 1rem;
		border-radius: 10px;
		background: var(--lamp-soft);
	}

	.form-message.error {
		border: 1px solid var(--lamp-deep);
	}

	.draft-list {
		display: grid;
		gap: 1rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.draft-card {
		display: grid;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-mid);
	}

	.draft-meta {
		display: grid;
		gap: 0.2rem;
	}

	.draft-meta a,
	.draft-meta span {
		font-weight: 600;
		color: inherit;
	}

	.draft-meta small,
	td small {
		display: block;
		font-size: 0.75rem;
		color: var(--ink-dim);
	}

	.parent {
		font-size: 0.85rem;
		color: var(--ink-dim);
	}

	.take {
		margin: 0;
		padding: 0.75rem 0.9rem;
		border-left: 3px solid var(--lamp-glow);
		border-radius: 10px;
		background: var(--stone-warm);
		line-height: 1.5;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.drafts {
		display: grid;
		gap: 0.5rem;
	}

	@media (min-width: 720px) {
		.drafts {
			grid-template-columns: 1fr 1fr;
		}
	}

	.draft-option {
		display: grid;
		gap: 0.25rem;
		padding: 0.65rem 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 0.9rem;
		line-height: 1.45;
		text-align: left;
		cursor: pointer;
	}

	.draft-option.active {
		border-color: var(--lamp-glow);
		background: var(--lamp-soft);
	}

	.option-label {
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.post-form {
		display: grid;
		gap: 0.6rem;
	}

	.actions {
		justify-content: flex-start;
	}

	.status-pill {
		display: inline-flex;
		width: fit-content;
		align-items: center;
		margin-left: 0.4rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: var(--stone-mid);
		color: var(--ink-mid);
		font-family: var(--font-mono, monospace);
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.status-pill.posted {
		background: var(--data-teal-rgba);
		color: var(--data-teal);
	}

	.status-pill.low,
	.status-pill.skipped {
		background: var(--lamp-soft);
		color: var(--lamp-deep);
	}

	.status-pill.failed,
	.status-pill.expired,
	.status-pill.ended {
		background: var(--stone-edge);
		color: var(--ink-bright);
	}

	.table-wrap {
		margin-top: 1rem;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th,
	td {
		padding: 0.6rem 0.5rem;
		border-bottom: 1px solid var(--stone-edge);
		text-align: left;
		vertical-align: top;
	}

	th {
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	td a {
		color: inherit;
	}

	.foot {
		font-size: 0.8rem;
	}

	code {
		font-family: var(--font-mono, monospace);
	}
</style>
