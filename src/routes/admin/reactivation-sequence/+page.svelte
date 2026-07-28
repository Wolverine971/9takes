<!-- src/routes/admin/reactivation-sequence/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailSubscriptionStatus from '$lib/components/admin/EmailSubscriptionStatus.svelte';
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

	let selectedEditorKey = $state('');
	let testEmail = $state('');
	let testSequenceKey = $state('reactivation_dormant');
	let testStepNumber = $state(1);
	let showAllCandidates = $state(false);
	let showPreview = $state(true);
	let activityFilter = $state<'all' | 'opened' | 'clicked' | 'unsubscribed'>('all');

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
	let allActive = $derived(
		data.sequences.length === 3 && data.sequences.every((sequence) => sequence.status === 'active')
	);
	let anyActive = $derived(data.sequences.some((sequence) => sequence.status === 'active'));
	let dueQueueCount = $derived(data.queue.filter((item) => item.due_now).length);
	let displayedCandidates = $derived(
		showAllCandidates
			? data.candidatePreview.candidates
			: data.candidatePreview.candidates.slice(0, 75)
	);
	let sharedSchedule = $derived(
		data.steps
			.filter((step) => step.sequence_key === 'reactivation_dormant')
			.sort((a, b) => a.step_number - b.step_number)
	);
	let filteredActivity = $derived(
		data.activity.filter((recipient) => {
			if (activityFilter === 'opened') return recipient.opened_messages > 0;
			if (activityFilter === 'clicked') return recipient.clicked_messages > 0;
			if (activityFilter === 'unsubscribed') return recipient.unsubscribed;
			return true;
		})
	);

	$effect(() => {
		if (!selectedEditorKey && data.steps.length > 0) {
			selectedEditorKey = data.steps[0].editor_key;
		}

		if (!testEmail && data.adminEmail) {
			testEmail = data.adminEmail;
		}

		if (selectedStep) {
			testSequenceKey = selectedStep.sequence_key;
			testStepNumber = selectedStep.step_number;
		}
	});

	function formatDateTime(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function offsetLabel(days: number): string {
		if (days === 0) return 'On enrollment';
		if (days === 1) return '+1 day';
		return `+${days} days`;
	}

	function lastActivityLabel(recipient: PageData['activity'][number]): string {
		if (recipient.last_engaged_at && recipient.unsubscribed_at === recipient.last_engaged_at) {
			return 'Unsubscribed';
		}
		if (recipient.last_engaged_at && recipient.last_clicked_at === recipient.last_engaged_at) {
			return 'Clicked';
		}
		if (recipient.last_engaged_at && recipient.last_opened_at === recipient.last_engaged_at) {
			return 'Opened';
		}
		if (recipient.last_sent_at) return 'Sent';
		return 'Enrolled';
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
		{#each data.sequences as sequence}
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

	<section class="section">
		<div class="section-header activity-section-header">
			<div>
				<p class="section-kicker">§06 · RESPONSE SIGNALS</p>
				<h2>Recipient Activity</h2>
				<p class="info-note">
					See who opened, clicked, or unsubscribed across the latest {data.activitySummary.loaded}
					reactivation enrollments. Opens are directional because inbox privacy tools can preload them.
				</p>
			</div>
			<div class="candidate-counts activity-counts" aria-label="Recipient activity totals">
				<span class="signal-count opened">Opened {data.activitySummary.opened}</span>
				<span class="signal-count clicked">Clicked {data.activitySummary.clicked}</span>
				<span class="signal-count unsubscribed"
					>Unsubscribed {data.activitySummary.unsubscribed}</span
				>
			</div>
		</div>

		<div class="activity-filters" aria-label="Filter recipient activity">
			<button
				type="button"
				class="filter-button"
				class:active={activityFilter === 'all'}
				onclick={() => (activityFilter = 'all')}>All {data.activitySummary.loaded}</button
			>
			<button
				type="button"
				class="filter-button"
				class:active={activityFilter === 'opened'}
				onclick={() => (activityFilter = 'opened')}>Opened {data.activitySummary.opened}</button
			>
			<button
				type="button"
				class="filter-button"
				class:active={activityFilter === 'clicked'}
				onclick={() => (activityFilter = 'clicked')}>Clicked {data.activitySummary.clicked}</button
			>
			<button
				type="button"
				class="filter-button"
				class:active={activityFilter === 'unsubscribed'}
				onclick={() => (activityFilter = 'unsubscribed')}
				>Unsubscribed {data.activitySummary.unsubscribed}</button
			>
		</div>

		{#if filteredActivity.length === 0}
			<p class="empty-note activity-empty">No recipients match this activity filter.</p>
		{:else}
			<div class="table-wrapper activity-table-wrap">
				<table class="activity-table">
					<thead>
						<tr>
							<th>Recipient</th>
							<th>Bucket</th>
							<th>Sent</th>
							<th>Opened</th>
							<th>Clicked</th>
							<th>Email status</th>
							<th>Sequence</th>
							<th>Latest signal</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredActivity as recipient (recipient.id)}
							<tr class:unsubscribed-row={recipient.unsubscribed}>
								<td class="recipient-cell">
									<strong>{recipient.recipient_name || 'Unnamed recipient'}</strong>
									<span title={recipient.recipient_email}>{recipient.recipient_email}</span>
								</td>
								<td><span class="bucket">{recipient.bucket ?? '-'}</span></td>
								<td class="number-cell">{recipient.messages_sent}</td>
								<td>
									{#if recipient.opened_messages > 0}
										<span class="engagement-badge opened">
											Opened {recipient.total_opens}×
										</span>
										<small class="engagement-date">{formatDateTime(recipient.last_opened_at)}</small
										>
									{:else}
										<span class="no-signal">Not yet</span>
									{/if}
								</td>
								<td>
									{#if recipient.clicked_messages > 0}
										<span class="engagement-badge clicked">
											Clicked {recipient.total_clicks}×
										</span>
										<small class="engagement-date"
											>{formatDateTime(recipient.last_clicked_at)}</small
										>
									{:else}
										<span class="no-signal">Not yet</span>
									{/if}
								</td>
								<td>
									<EmailSubscriptionStatus
										unsubscribed={recipient.unsubscribed}
										unsubscribedAt={recipient.unsubscribed_at}
										reason={recipient.unsubscribe_reason}
										showActive
									/>
								</td>
								<td class="sequence-cell">
									<span class="sequence-status">
										<span
											class="status-dot"
											style="background: {statusColors[recipient.display_status] ||
												'var(--ink-dim)'}"
										></span>
										{recipient.display_status}
									</span>
									<small>Step {recipient.current_step_number} of 5</small>
								</td>
								<td class="latest-signal">
									<strong>{lastActivityLabel(recipient)}</strong>
									<span
										>{formatDateTime(
											recipient.last_engaged_at || recipient.last_sent_at || recipient.enrolled_at
										)}</span
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="activity-cards">
				{#each filteredActivity as recipient (recipient.id)}
					<article class="activity-card" class:unsubscribed-card={recipient.unsubscribed}>
						<header>
							<div class="recipient-cell">
								<strong>{recipient.recipient_name || 'Unnamed recipient'}</strong>
								<span>{recipient.recipient_email}</span>
							</div>
							<EmailSubscriptionStatus
								unsubscribed={recipient.unsubscribed}
								unsubscribedAt={recipient.unsubscribed_at}
								reason={recipient.unsubscribe_reason}
								showActive
							/>
						</header>
						<div class="activity-card-meta">
							<span class="bucket">{recipient.bucket ?? '-'}</span>
							<span>{recipient.display_status} · Step {recipient.current_step_number} of 5</span>
						</div>
						<dl>
							<div>
								<dt>Sent</dt>
								<dd>{recipient.messages_sent}</dd>
							</div>
							<div class:has-signal={recipient.opened_messages > 0}>
								<dt>Opens</dt>
								<dd>{recipient.total_opens}</dd>
							</div>
							<div class:has-signal={recipient.clicked_messages > 0}>
								<dt>Clicks</dt>
								<dd>{recipient.total_clicks}</dd>
							</div>
						</dl>
						<footer>
							<span>{lastActivityLabel(recipient)}</span>
							<strong
								>{formatDateTime(
									recipient.last_engaged_at || recipient.last_sent_at || recipient.enrolled_at
								)}</strong
							>
						</footer>
					</article>
				{/each}
			</div>
		{/if}
	</section>

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
			{#each sharedSchedule as step}
				<div class="schedule-item">
					<span>Step {step.step_number}</span>
					<strong>{offsetLabel(step.cumulative_days_after_enrollment)}</strong>
					<small>{step.effective_subject}</small>
				</div>
			{/each}
		</div>

		<div class="editor-layout">
			<nav class="step-nav" aria-label="Reactivation email steps">
				{#each data.steps as step}
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

	<section class="section">
		<div class="section-header">
			<div>
				<h2>Eligible Recipients</h2>
				<p class="info-note">
					These profiles are not suppressed, not fresh, and not already enrolled in welcome or
					reactivation. Email 1 sends when you enroll each batch.
				</p>
			</div>
			<div class="candidate-counts">
				<span>Cold {data.candidatePreview.counts.cold}</span>
				<span>Dormant {data.candidatePreview.counts.dormant}</span>
				<span>Zombies {data.candidatePreview.counts.zombies}</span>
			</div>
		</div>

		{#if data.candidatePreview.candidates.length === 0}
			<p class="empty-note">No eligible reactivation candidates right now.</p>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Email</th>
							<th>Name</th>
							<th>Bucket</th>
							<th>Signed Up</th>
							<th>Age</th>
							<th>Recommended Batch</th>
							<th>When</th>
						</tr>
					</thead>
					<tbody>
						{#each displayedCandidates as candidate}
							<tr>
								<td class="email-cell" title={candidate.email}>{candidate.email}</td>
								<td>{candidate.name}</td>
								<td><span class="bucket">{candidate.bucket}</span></td>
								<td>{formatDate(candidate.created_at)}</td>
								<td>{candidate.age_days}d</td>
								<td>{candidate.recommended_batch}</td>
								<td>{candidate.first_send_timing}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if data.candidatePreview.candidates.length > 75}
				<button
					class="text-button"
					type="button"
					onclick={() => (showAllCandidates = !showAllCandidates)}
				>
					{showAllCandidates
						? 'Show fewer candidates'
						: `Show all ${data.candidatePreview.candidates.length} loaded candidates`}
				</button>
			{/if}
		{/if}
	</section>

	<section class="section">
		<div class="section-header">
			<div>
				<h2>Active Queue</h2>
				<p class="info-note">
					Once candidates are enrolled, this table shows the exact next email and send time cron
					will claim.
				</p>
			</div>
			<div class="candidate-counts">
				<span>Active {data.enrollmentCounts.active}</span>
				<span>Completed {data.enrollmentCounts.completed}</span>
				<span>Re-permissioned {data.enrollmentCounts.rePermissioned}</span>
				<span>Clicked {data.enrollmentCounts.reactivatedClick}</span>
			</div>
		</div>

		{#if data.queue.length === 0}
			<p class="empty-note">
				No reactivation emails are queued. {anyActive
					? 'Enroll a controlled batch when ready.'
					: 'Sequences are still draft or paused.'}
			</p>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Email</th>
							<th>Bucket</th>
							<th>Next Step</th>
							<th>Subject</th>
							<th>Send Time</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each data.queue as queued}
							<tr>
								<td class="email-cell" title={queued.recipient_email}>{queued.recipient_email}</td>
								<td>{queued.bucket ?? '-'}</td>
								<td>Step {queued.next_step_number}</td>
								<td class="subject-cell">
									{queued.next_step_subject}
									{#if queued.next_step_preheader}
										<small>{queued.next_step_preheader}</small>
									{/if}
								</td>
								<td class:due={queued.due_now}>{formatDateTime(queued.next_send_at)}</td>
								<td>
									<span
										class="status-dot"
										style="background: {statusColors[queued.status] || 'var(--ink-dim)'}"
									></span>
									{queued.status}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
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
	.header-actions,
	.candidate-counts {
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
	.empty-note,
	.inline-warning,
	.save-scope,
	.preview-meta span {
		color: var(--ink-mid);
		line-height: 1.5;
	}

	.header-actions a,
	.text-button {
		color: var(--lamp-glow);
		text-decoration: none;
	}

	.section-kicker {
		margin: 0 0 0.35rem;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
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

	.step-nav small,
	.subject-cell small {
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

	.table-wrapper {
		overflow-x: auto;
	}

	.activity-filters {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 1rem 0;
		overflow-x: auto;
		padding-bottom: 0.15rem;
	}

	.filter-button {
		min-height: 2.75rem;
		flex: 0 0 auto;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		background: var(--night-deep);
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	.filter-button:hover,
	:global(.page-shell .activity-filters button:focus-visible),
	.filter-button.active {
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
	}

	:global(.page-shell .activity-filters button:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.signal-count,
	.engagement-badge {
		display: inline-flex;
		width: fit-content;
		align-items: center;
		border: 1px solid transparent;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
	}

	.signal-count {
		padding: 0.4rem 0.6rem;
	}

	.engagement-badge {
		padding: 0.25rem 0.45rem;
	}

	.signal-count.opened,
	.engagement-badge.opened {
		border-color: color-mix(in srgb, var(--data-teal) 32%, transparent);
		background: color-mix(in srgb, var(--data-teal) 11%, transparent);
		color: var(--data-cyan);
	}

	.signal-count.clicked,
	.engagement-badge.clicked {
		border-color: color-mix(in srgb, var(--success) 32%, transparent);
		background: color-mix(in srgb, var(--success) 11%, transparent);
		color: var(--success-text);
	}

	.signal-count.unsubscribed {
		border-color: color-mix(in srgb, var(--warning) 34%, transparent);
		background: color-mix(in srgb, var(--warning) 12%, transparent);
		color: var(--warning-text);
	}

	.activity-table {
		min-width: 1120px;
	}

	.activity-table tr.unsubscribed-row {
		background: color-mix(in srgb, var(--warning) 5%, transparent);
	}

	.recipient-cell,
	.sequence-cell,
	.latest-signal {
		min-width: 0;
	}

	.recipient-cell,
	.sequence-cell,
	.latest-signal {
		display: grid;
		gap: 0.25rem;
	}

	.recipient-cell {
		max-width: 17rem;
	}

	.recipient-cell strong,
	.recipient-cell span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recipient-cell span,
	.sequence-cell small,
	.latest-signal span,
	.engagement-date,
	.no-signal {
		color: var(--ink-mid);
		font-size: 0.72rem;
	}

	.sequence-status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		text-transform: capitalize;
	}

	.engagement-date {
		display: block;
		margin-top: 0.3rem;
		white-space: nowrap;
	}

	.number-cell {
		font-family: var(--font-mono);
		font-weight: 700;
	}

	.activity-cards {
		display: none;
	}

	.activity-empty {
		padding: 1.5rem 0 0.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 900px;
	}

	th,
	td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--stone-warm);
		text-align: left;
		vertical-align: top;
	}

	th {
		color: var(--ink-mid);
		font-size: 0.75rem;
		text-transform: uppercase;
	}

	.email-cell,
	.subject-cell {
		max-width: 18rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bucket {
		display: inline-flex;
		padding: 0.2rem 0.45rem;
		border-radius: 999px;
		background: var(--data-teal-rgba);
		color: var(--data-teal);
		font-size: 0.8rem;
	}

	.due {
		color: var(--lamp-glow);
		font-weight: 700;
	}

	.text-button {
		margin-top: 0.8rem;
		padding: 0;
		background: transparent;
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
		.header-actions,
		.candidate-counts {
			align-items: flex-start;
			flex-direction: column;
		}

		.status-grid,
		.schedule-strip,
		.test-form {
			grid-template-columns: 1fr;
		}

		.activity-section-header {
			gap: 0.75rem;
		}

		.activity-counts {
			flex-direction: row;
			flex-wrap: wrap;
		}

		.activity-table-wrap {
			display: none;
		}

		.activity-cards {
			display: grid;
			gap: 0.75rem;
		}

		.activity-card {
			display: grid;
			gap: 0.75rem;
			min-width: 0;
			padding: 0.9rem;
			border: 1px solid var(--stone-edge);
			border-radius: 16px;
			background: var(--night-deep);
		}

		.activity-card.unsubscribed-card {
			border-color: color-mix(in srgb, var(--warning) 36%, var(--stone-edge));
		}

		.activity-card header,
		.activity-card footer,
		.activity-card-meta {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.75rem;
			min-width: 0;
		}

		.activity-card header {
			align-items: flex-start;
			flex-wrap: wrap;
		}

		.activity-card .recipient-cell {
			max-width: min(55vw, 18rem);
		}

		.activity-card-meta {
			justify-content: flex-start;
			color: var(--ink-mid);
			font-size: 0.72rem;
			text-transform: capitalize;
		}

		.activity-card dl {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			margin: 0;
			border: 1px solid var(--stone-warm);
			border-radius: 10px;
			overflow: hidden;
		}

		.activity-card dl div {
			padding: 0.7rem;
			border-right: 1px solid var(--stone-warm);
		}

		.activity-card dl div:last-child {
			border-right: none;
		}

		.activity-card dl div.has-signal {
			background: color-mix(in srgb, var(--data-teal) 8%, transparent);
		}

		.activity-card dt {
			color: var(--ink-mid);
			font-family: var(--font-mono);
			font-size: 0.62rem;
			text-transform: uppercase;
		}

		.activity-card dd {
			margin: 0.25rem 0 0;
			font-family: var(--font-mono);
			font-size: 1rem;
			font-weight: 700;
		}

		.activity-card footer {
			color: var(--ink-mid);
			font-size: 0.68rem;
		}

		.activity-card footer strong {
			color: var(--ink-bright);
			font-weight: 600;
		}

		/* Let the wide tables reflow within the phone viewport instead of
		   forcing a 900px-wide horizontal scroll on every row. */
		.table-wrapper table {
			min-width: 0;
		}

		.email-cell,
		.subject-cell {
			max-width: none;
			white-space: normal;
			overflow-wrap: anywhere;
		}
	}
</style>
