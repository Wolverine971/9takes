<!-- src/routes/admin/reactivation-sequence/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import RecipientTable from './RecipientTable.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type ActionData = {
		error?: string;
		message?: string;
		summary?: {
			enrolled: Record<string, number>;
			errors?: { email: string; reason: string }[];
		};
	};

	let selectedEditorKey = $derived(data.steps[0]?.editor_key ?? '');
	let testEmail = $derived(data.adminEmail ?? '');
	let showPreview = $state(true);

	const statusColors: Record<string, string> = {
		draft: 'var(--warning)',
		active: 'var(--success)',
		paused: 'var(--ink-dim)',
		processing: 'var(--lamp-glow)',
		completed: 'var(--data-teal)',
		exited: 'var(--warning)',
		errored: 'var(--error)',
		unsubscribed: 'var(--warning)'
	};

	let selectedStep = $derived(
		data.steps.find((step) => step.editor_key === selectedEditorKey) ?? data.steps[0] ?? null
	);
	let testSequenceKey = $derived(selectedStep?.sequence_key ?? 'reactivation_dormant');
	let testStepNumber = $derived(selectedStep?.step_number ?? 1);
	let allActive = $derived(
		data.sequences.length === 3 && data.sequences.every((sequence) => sequence.status === 'active')
	);
	let dueQueueCount = $derived(data.queue.filter((item) => item.due_now).length);
	let sharedSchedule = $derived(
		data.steps
			.filter((step) => step.sequence_key === 'reactivation_dormant')
			.sort((a, b) => a.step_number - b.step_number)
	);

	function offsetLabel(days: number): string {
		if (days === 0) return 'On enrollment';
		if (days === 1) return '+1 day';
		return `+${days} days`;
	}

	function handleAction(defaultMessage: string) {
		return () => {
			return async ({ result }: { result: { type: string; data?: ActionData } }) => {
				if (result.type === 'success') {
					notifications.success(result.data?.message || defaultMessage, 5000);
					await invalidateAll();
					return;
				}

				if (result.type === 'failure') {
					notifications.danger(result.data?.error || 'Action failed', 6000);
					return;
				}

				notifications.danger('Unexpected admin action error', 6000);
			};
		};
	}
</script>

<svelte:head>
	<title>Reactivation Sequence | Admin</title>
</svelte:head>

<div class="page-shell">
	<header class="page-header">
		<div>
			<p class="eyebrow">Admin / Email</p>
			<h1>Reactivation Sequence</h1>
			<p class="subtitle">
				Review the win-back flow, edit the copy, see who is eligible, and queue controlled batches.
			</p>
		</div>
		<div class="header-actions">
			<a href="/admin/email-dashboard">Email Dashboard</a>
			<a href="/admin/welcome-sequence">Welcome Sequence</a>
		</div>
	</header>

	{#if data.sequences.length !== 3}
		<section class="notice danger">
			<strong>Setup incomplete.</strong>
			<span>Expected 3 reactivation sequence rows, found {data.sequences.length}.</span>
		</section>
	{/if}

	{#if !data.copyReadiness.step2Saved}
		<section class="notice">
			<strong>Copy gate:</strong>
			<span>
				Step 2 is still using the default fallback copy. Save the final Step 2 body in the editor
				before activation is allowed.
			</span>
		</section>
	{/if}

	<section class="status-grid">
		{#each data.sequences as sequence (sequence.id)}
			<div class="status-tile">
				<div class="status-row">
					<span
						class="status-dot"
						style="background: {statusColors[sequence.status] || 'var(--ink-dim)'}"
					></span>
					<span>{sequence.display_name}</span>
				</div>
				<strong>{sequence.status}</strong>
				<span>{sequence.trigger_type}</span>
			</div>
		{/each}
		<div class="status-tile">
			<span>Eligible profiles</span>
			<strong>{data.candidatePreview.totalEligible}</strong>
			<span>{data.candidatePreview.totalProfilesChecked} checked</span>
		</div>
		<div class="status-tile">
			<span>Queued now</span>
			<strong>{data.queue.length}</strong>
			<span>{dueQueueCount} due now</span>
		</div>
	</section>

	<section class="section two-column">
		<div>
			<h2>Sequence Controls</h2>
			<p class="info-note">
				Draft sequences cannot enroll or send. Activating only unlocks enrollment and cron claiming;
				it does not send anything until candidates are enrolled.
			</p>
			<form
				method="POST"
				action="?/updateStatus"
				class="control-form"
				use:enhance={handleAction('Updated sequence status')}
			>
				<label>
					<span>Status</span>
					<select name="status">
						<option value="draft">Draft</option>
						<option value="active">Active</option>
						<option value="paused">Paused</option>
					</select>
				</label>
				<label>
					<span>Confirm activation</span>
					<input name="confirmation" placeholder="Type ACTIVE when activating" />
				</label>
				<button type="submit">Update all three sequences</button>
			</form>
		</div>

		<div>
			<h2>Queue Batch</h2>
			<p class="info-note">
				Enrollment queues Email 1 immediately for selected candidates. Follow the batch labels in
				the candidate table before increasing the limit.
			</p>
			<form
				method="POST"
				action="?/enrollCandidates"
				class="control-form"
				use:enhance={handleAction('Queued reactivation candidates')}
			>
				<div class="bucket-checks">
					<label><input type="checkbox" name="buckets" value="dormant" checked /> Dormant</label>
					<label><input type="checkbox" name="buckets" value="cold" /> Cold</label>
					<label><input type="checkbox" name="buckets" value="zombies" /> Zombies</label>
				</div>
				<label>
					<span>Limit</span>
					<input type="number" name="limit" min="1" max="200" value="10" />
				</label>
				<label>
					<span>Confirm enrollment</span>
					<input name="confirmation" placeholder="Type ENROLL" />
				</label>
				<button type="submit" disabled={!allActive}>Queue selected candidates</button>
				{#if !allActive}
					<p class="inline-warning">Activate all three sequences before enrolling candidates.</p>
				{/if}
			</form>
		</div>
	</section>

	<RecipientTable {data} />

	<section class="section">
		<div class="section-header">
			<div>
				<h2>Email Flow</h2>
				<p class="info-note">
					Step 1 is bucket-specific. Steps 2-5 are shared and save across all three buckets.
				</p>
			</div>
			<form
				method="POST"
				action="?/sendTestReactivationEmail"
				class="test-form"
				use:enhance={handleAction('Sent test email')}
			>
				<input type="hidden" name="sequenceKey" value={testSequenceKey} />
				<input type="hidden" name="stepNumber" value={testStepNumber} />
				<input type="email" name="testEmail" bind:value={testEmail} placeholder="test@9takes.com" />
				<button type="submit">Send selected test</button>
			</form>
		</div>

		<div class="schedule-strip">
			{#each sharedSchedule as step (step.id)}
				<div class="schedule-item">
					<span>Step {step.step_number}</span>
					<strong>{offsetLabel(step.cumulative_days_after_enrollment)}</strong>
					<small>{step.effective_subject}</small>
				</div>
			{/each}
		</div>

		<div class="editor-layout">
			<nav class="step-nav" aria-label="Reactivation email steps">
				{#each data.steps as step (step.editor_key)}
					<button
						type="button"
						class:active={selectedEditorKey === step.editor_key}
						onclick={() => (selectedEditorKey = step.editor_key)}
					>
						<span>{step.title}</span>
						<small
							>{step.overrides.subject || step.overrides.htmlContent
								? 'database edit'
								: 'default copy'}</small
						>
					</button>
				{/each}
			</nav>

			{#if selectedStep}
				<form
					method="POST"
					action="?/saveStep"
					class="editor-form"
					use:enhance={handleAction('Saved reactivation email copy')}
				>
					<input type="hidden" name="sequenceKey" value={selectedStep.sequence_key} />
					<input type="hidden" name="stepNumber" value={selectedStep.step_number} />

					<div class="editor-heading">
						<div>
							<h3>{selectedStep.title}</h3>
							<p>
								{offsetLabel(selectedStep.cumulative_days_after_enrollment)}
								{#if selectedStep.preheader}
									<span>Preview text: {selectedStep.preheader}</span>
								{/if}
							</p>
						</div>
						<label class="preview-toggle">
							<input type="checkbox" bind:checked={showPreview} />
							<span>Preview</span>
						</label>
					</div>

					<label>
						<span>Subject</span>
						<input name="subject" value={selectedStep.subject} required />
					</label>

					<label>
						<span>HTML Body</span>
						<textarea name="htmlContent" rows="14" required>{selectedStep.html_content}</textarea>
					</label>

					<label>
						<span>Plain Text</span>
						<textarea name="plainText" rows="9">{selectedStep.plain_text ?? ''}</textarea>
					</label>

					<div class="button-row">
						<button type="submit">Save copy</button>
						{#if selectedStep.is_shared}
							<span class="save-scope"
								>Saves Step {selectedStep.step_number} for cold, dormant, and zombies.</span
							>
						{:else}
							<span class="save-scope"
								>Saves only the {selectedStep.bucket_label} Step 1 variant.</span
							>
						{/if}
					</div>
				</form>

				{#if showPreview}
					<div class="preview-panel">
						<div class="preview-meta">
							<span>Resolved subject</span>
							<strong>{selectedStep.effective_subject}</strong>
						</div>
						<iframe title="Email preview" srcdoc={selectedStep.preview_html}></iframe>
					</div>
				{/if}
			{/if}
		</div>
	</section>
</div>

<style>
	.page-shell {
		width: min(100% - 2rem, 1500px);
		margin: 0 auto;
		padding: 2rem 0 4rem;
		color: var(--ink-bright);
	}

	.page-header,
	.section-header,
	.status-row,
	.button-row,
	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.page-header,
	.section-header {
		justify-content: space-between;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.eyebrow {
		margin: 0 0 0.25rem;
		color: var(--lamp-glow);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 0.5rem;
		font-size: clamp(2rem, 4vw, 3.25rem);
		line-height: 1;
	}

	h2 {
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
	}

	h3 {
		margin-bottom: 0.25rem;
	}

	.subtitle,
	.info-note,
	.inline-warning,
	.save-scope,
	.preview-meta span {
		color: var(--ink-mid);
		line-height: 1.5;
	}

	.header-actions a {
		color: var(--lamp-glow);
		text-decoration: none;
	}

	.header-actions a {
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--stone-warm);
		border-radius: 0.25rem;
	}

	.notice,
	.section,
	.status-tile {
		border: 1px solid var(--stone-warm);
		background: var(--stone-warm);
	}

	.notice,
	.section {
		margin-bottom: 1.25rem;
		padding: 1.25rem;
		border-radius: 0.625rem;
	}

	.notice.danger {
		border-color: var(--error);
	}

	.status-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.status-tile {
		display: grid;
		gap: 0.4rem;
		min-height: 7rem;
		padding: 1rem;
		border-radius: 0.625rem;
	}

	.status-tile strong {
		font-size: 1.75rem;
		line-height: 1;
	}

	.status-tile span {
		font-size: 0.85rem;
		color: var(--ink-mid);
	}

	.status-dot {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		flex: 0 0 auto;
		border-radius: 999px;
	}

	.two-column {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
	}

	.control-form,
	.test-form,
	.editor-form {
		display: grid;
		gap: 0.85rem;
	}

	.control-form label,
	.editor-form label {
		display: grid;
		gap: 0.35rem;
	}

	label span {
		color: var(--ink-mid);
		font-size: 0.82rem;
		font-weight: 650;
	}

	input,
	select,
	textarea {
		width: 100%;
		border: 1px solid var(--stone-warm);
		border-radius: 0.25rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		font: inherit;
	}

	input,
	select {
		min-height: 2.45rem;
		padding: 0 0.7rem;
	}

	textarea {
		padding: 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.86rem;
		line-height: 1.55;
	}

	button {
		min-height: 2.45rem;
		padding: 0 0.9rem;
		border: 0;
		border-radius: 0.25rem;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		font-weight: 700;
		cursor: pointer;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.45;
	}

	.bucket-checks {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.bucket-checks label,
	.preview-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.bucket-checks input,
	.preview-toggle input {
		width: auto;
		min-height: auto;
	}

	.test-form {
		grid-template-columns: minmax(15rem, 1fr) auto;
		align-items: end;
	}

	.schedule-strip {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.75rem;
		margin: 1rem 0;
	}

	.schedule-item {
		display: grid;
		gap: 0.25rem;
		padding: 0.85rem;
		border: 1px solid var(--stone-warm);
		border-radius: 0.25rem;
		background: var(--night-deep);
	}

	.schedule-item span,
	.schedule-item small {
		color: var(--ink-mid);
	}

	.schedule-item small {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.editor-layout {
		display: grid;
		grid-template-columns: 17rem minmax(0, 1fr) minmax(22rem, 0.8fr);
		gap: 1rem;
		align-items: start;
	}

	.step-nav {
		display: grid;
		gap: 0.45rem;
		position: sticky;
		top: 1rem;
	}

	.step-nav button {
		display: grid;
		justify-items: start;
		height: auto;
		min-height: 3.4rem;
		padding: 0.7rem;
		border: 1px solid var(--stone-warm);
		background: var(--night-deep);
		color: var(--ink-bright);
		text-align: left;
	}

	.step-nav button.active {
		border-color: var(--lamp-glow);
	}

	.step-nav small {
		display: block;
		color: var(--ink-mid);
	}

	.editor-heading {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.editor-heading p span {
		display: block;
		color: var(--ink-mid);
	}

	.preview-panel {
		position: sticky;
		top: 1rem;
		display: grid;
		gap: 0.75rem;
	}

	.preview-meta {
		display: grid;
		gap: 0.2rem;
		padding: 0.8rem;
		border: 1px solid var(--stone-warm);
		border-radius: 0.25rem;
		background: var(--night-deep);
	}

	iframe {
		width: 100%;
		min-height: 46rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--marble-pure);
	}

	@media (max-width: 1100px) {
		.status-grid,
		.schedule-strip {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.two-column,
		.editor-layout {
			grid-template-columns: 1fr;
		}

		.step-nav,
		.preview-panel {
			position: static;
		}
	}

	@media (max-width: 720px) {
		.page-header,
		.section-header,
		.header-actions {
			align-items: flex-start;
			flex-direction: column;
		}

		.status-grid,
		.schedule-strip,
		.test-form {
			grid-template-columns: 1fr;
		}
	}
</style>
