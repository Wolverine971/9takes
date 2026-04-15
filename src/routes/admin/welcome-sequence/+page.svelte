<!-- src/routes/admin/welcome-sequence/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let expandedStep = $state<number | null>(null);
	let showAllEnrollments = $state(false);
	let testEmail = $state('');
	let testStepNumber = $state(1);
	let testSending = $state(false);

	type TestActionData = {
		error?: string;
		sent?: number;
		email?: string;
		mode?: string;
		stepNumber?: number | null;
	};

	const statusColors: Record<string, string> = {
		active: '#22c55e',
		completed: '#3b82f6',
		exited: '#f59e0b',
		errored: '#ef4444',
		processing: '#a855f7',
		paused: '#6b7280'
	};

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function formatDateTime(dateStr: string | null): string {
		if (!dateStr) return '-';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function daysSince(dateStr: string | null): string {
		if (!dateStr) return '-';
		const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
		if (days === 0) return 'today';
		if (days === 1) return '1 day ago';
		return `${days}d ago`;
	}

	function cameBack(enrollment: (typeof data.enrollments)[0]): 'yes' | 'no' | 'unknown' {
		if (!enrollment.return_data) return 'unknown';
		if (!enrollment.last_sent_at) return 'unknown';
		return new Date(enrollment.return_data.last_visit) > new Date(enrollment.last_sent_at)
			? 'yes'
			: 'no';
	}

	let displayedEnrollments = $derived(
		showAllEnrollments ? data.enrollments : data.enrollments.slice(0, 50)
	);
	let dueQueueCount = $derived(data.queuedEnrollments.filter((item) => item.due_now).length);
	let upcomingQueueCount = $derived(data.queuedEnrollments.length - dueQueueCount);
	let selectedPreviewStep = $derived(
		data.steps.find((step) => step.step_number === expandedStep) ?? null
	);

	let returnRate = $derived(() => {
		const withSends = data.enrollments.filter((e) => e.last_sent_at);
		if (withSends.length === 0) return 0;
		const returned = withSends.filter((e) => cameBack(e) === 'yes').length;
		return Math.round((returned / withSends.length) * 100);
	});

	$effect(() => {
		if (!testEmail && data.adminEmail) {
			testEmail = data.adminEmail;
		}

		if (!data.steps.some((step) => step.step_number === testStepNumber)) {
			testStepNumber = data.steps[0]?.step_number ?? 1;
		}
	});

	function handleTestEmailSubmit() {
		testSending = true;

		return async ({ result }: { result: { type: string; data?: TestActionData } }) => {
			testSending = false;

			if (result.type === 'success') {
				const sent = result.data?.sent ?? 0;
				const email = result.data?.email ?? testEmail;
				notifications.success(`Sent ${sent} test email${sent === 1 ? '' : 's'} to ${email}`, 5000);
				await invalidateAll();
				return;
			}

			if (result.type === 'failure') {
				notifications.danger(result.data?.error || 'Failed to send test email', 5000);
				return;
			}

			notifications.danger('Unexpected error sending test email', 5000);
		};
	}

	function closePreviewModal() {
		expandedStep = null;
	}

	function handlePreviewKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selectedPreviewStep) {
			closePreviewModal();
		}
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		if ((event.key === 'Enter' || event.key === ' ') && selectedPreviewStep) {
			event.preventDefault();
			closePreviewModal();
		}
	}
</script>

<svelte:window onkeydown={handlePreviewKeydown} />

<svelte:head>
	<title>Welcome Sequence | Admin</title>
</svelte:head>

<div class="page-header">
	<h1>Welcome Email Sequence</h1>
	<p class="subtitle">
		Track delivery, engagement, and return visits for the onboarding email sequence.
		<!-- Cross-link: docs/email-sequences/welcome-email-assessment.md has the copy analysis and strategy review -->
	</p>
</div>

{#if !data.sequence}
	<div class="empty-state">
		<p>No welcome sequence found. Run the migration to set it up.</p>
	</div>
{:else}
	<!-- Sequence Status -->
	<div class="status-bar">
		<span class="status-badge" class:active={data.sequence.status === 'active'}>
			{data.sequence.status}
		</span>
		<span class="meta">{data.steps.length} emails</span>
		<span class="meta">Trigger: {data.sequence.trigger_type}</span>
		<a href="/admin/email-dashboard" class="meta link">Back to Email Dashboard</a>
	</div>

	<!-- Test Email Flow -->
	<section class="section">
		<h2>Test Email Flow</h2>
		<div class="test-panel">
			<div class="panel-copy">
				<p>
					Send yourself the selected step or the full welcome flow using the exact copy the cron job
					would resolve today.
				</p>
				<p class="info-note">
					Test sends are untracked and do not advance the queue. Production welcome emails still use
					tracked unsubscribe links and one-click unsubscribe headers.
				</p>
			</div>

			<form
				method="POST"
				action="?/sendTestWelcomeEmail"
				class="test-form"
				use:enhance={handleTestEmailSubmit}
			>
				<label>
					<span>Send to</span>
					<input
						type="email"
						name="testEmail"
						bind:value={testEmail}
						placeholder="dj@9takes.com"
						required
					/>
				</label>

				<label>
					<span>Step</span>
					<select name="stepNumber" bind:value={testStepNumber}>
						{#each data.steps as step}
							<option value={step.step_number}>Step {step.step_number} - {step.subject}</option>
						{/each}
					</select>
				</label>

				<div class="button-row">
					<button type="submit" name="mode" value="single" disabled={testSending || !testEmail}>
						{testSending ? 'Sending...' : 'Send selected test'}
					</button>
					<button
						type="submit"
						name="mode"
						value="flow"
						class="secondary-button"
						disabled={testSending || !testEmail}
					>
						Send full test flow
					</button>
				</div>
			</form>
		</div>
	</section>

	<!-- Funnel Overview -->
	{#if data.funnelCounts}
		{@const fc = data.funnelCounts}
		{@const funnelSteps = [
			{ label: 'Enrolled', count: fc.total_enrolled },
			{ label: 'Step 1 sent', count: fc.reached_step_1 },
			{ label: 'Step 2 sent', count: fc.reached_step_2 },
			{ label: 'Step 3 sent', count: fc.reached_step_3 },
			{ label: 'Step 4 sent', count: fc.reached_step_4 },
			{ label: 'Completed', count: fc.completed }
		]}
		<section class="section">
			<h2>Enrollment Funnel</h2>
			<div class="funnel">
				{#each funnelSteps as step, i}
					{@const prev = i > 0 ? funnelSteps[i - 1].count : step.count}
					{@const pct = prev > 0 ? Math.round((step.count / prev) * 100) : 0}
					{@const widthPct =
						fc.total_enrolled > 0
							? Math.max(10, Math.round((step.count / fc.total_enrolled) * 100))
							: 10}
					<div class="funnel-step">
						<div class="funnel-bar" style="width: {widthPct}%">
							<span class="funnel-count">{step.count}</span>
						</div>
						<div class="funnel-label">
							{step.label}
							{#if i > 0}
								<span class="funnel-pct">{pct}%</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
			<div class="funnel-summary">
				<span class="stat">
					<span class="stat-value" style="color: #22c55e">{fc.active}</span> active
				</span>
				<span class="stat">
					<span class="stat-value" style="color: #f59e0b">{fc.exited}</span> exited
				</span>
				<span class="stat">
					<span class="stat-value" style="color: #ef4444">{fc.errored}</span> errored
				</span>
				<span class="stat">
					<span class="stat-value" style="color: #3b82f6">{returnRate()}%</span> return rate
				</span>
			</div>
		</section>
	{/if}

	<!-- Queue Overview -->
	<section class="section">
		<h2>Welcome Queue</h2>
		<div class="queue-summary">
			<div class="summary-tile">
				<span class="summary-value">{data.queuedEnrollments.length}</span>
				<span class="summary-label">queued</span>
			</div>
			<div class="summary-tile">
				<span class="summary-value">{dueQueueCount}</span>
				<span class="summary-label">due now</span>
			</div>
			<div class="summary-tile">
				<span class="summary-value">{upcomingQueueCount}</span>
				<span class="summary-label">upcoming</span>
			</div>
		</div>
		<p class="info-note">
			The welcome queue stores enrollment state, next step, and send time. It does not store the
			email body, so queued welcome emails will use the current code-managed copy when cron sends.
		</p>

		{#if data.queuedEnrollments.length === 0}
			<p class="empty-note">No active welcome emails are queued.</p>
		{:else}
			<div class="table-wrapper">
				<table class="enrollments-table queue-table">
					<thead>
						<tr>
							<th>Email</th>
							<th>Next Step</th>
							<th>Subject</th>
							<th>Send Time</th>
							<th>Status</th>
							<th>Copy</th>
						</tr>
					</thead>
					<tbody>
						{#each data.queuedEnrollments as queued}
							<tr>
								<td class="email-cell" data-label="Email" title={queued.recipient_email}>
									{queued.recipient_email}
								</td>
								<td data-label="Next step">Step {queued.next_step_number}</td>
								<td data-label="Subject" class="subject-cell" title={queued.next_step_subject}>
									{queued.next_step_subject}
									{#if queued.next_step_preheader}
										<span class="preheader-line">{queued.next_step_preheader}</span>
									{/if}
								</td>
								<td data-label="Send time" title={queued.next_send_at}>
									<span class:due={queued.due_now}>{formatDateTime(queued.next_send_at)}</span>
								</td>
								<td data-label="Status">
									<span
										class="status-dot"
										style="background: {statusColors[queued.status] || '#6b7280'}"
									></span>
									{queued.status}
								</td>
								<td data-label="Copy">
									<span class="copy-source">{queued.code_managed ? 'code' : 'database'}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<section class="section">
		<h2>Manual Scheduled Emails</h2>
		<p class="info-note">
			Manual scheduled emails store their own HTML body. If one of these looks stale, review it in
			<a href="/admin/email-dashboard" class="link">Email Dashboard</a> before its scheduled time.
		</p>

		{#if data.scheduledEmails.length === 0}
			<p class="empty-note">No pending or processing manual scheduled emails.</p>
		{:else}
			<div class="table-wrapper">
				<table class="enrollments-table queue-table">
					<thead>
						<tr>
							<th>Subject</th>
							<th>Recipients</th>
							<th>Scheduled For</th>
							<th>Status</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{#each data.scheduledEmails as scheduled}
							<tr>
								<td data-label="Subject" class="subject-cell" title={scheduled.subject}>
									{scheduled.subject}
								</td>
								<td data-label="Recipients">{scheduled.recipient_count}</td>
								<td data-label="Scheduled for" title={scheduled.scheduled_for}>
									{formatDateTime(scheduled.scheduled_for)}
								</td>
								<td data-label="Status">{scheduled.status || 'pending'}</td>
								<td data-label="Created" title={scheduled.created_at}>
									{formatDateTime(scheduled.created_at)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<!-- Per-Step Metrics + Content -->
	<section class="section">
		<h2>Email Steps</h2>
		<div class="steps-grid">
			{#each data.steps as step}
				{@const metrics = data.stepMetrics.find((m) => m.step_number === step.step_number)}
				<div class="step-card">
					<div class="step-header">
						<div class="step-number">Step {step.step_number}</div>
						<div class="step-delay">
							{#if step.delay_days_after_previous === 0}
								Immediate
							{:else}
								+{step.delay_days_after_previous} day{step.delay_days_after_previous !== 1
									? 's'
									: ''}
							{/if}
						</div>
					</div>
					{#if step.code_managed}
						<div class="managed-badge">Copy managed in code</div>
					{/if}
					<h3 class="step-subject">{step.subject}</h3>
					{#if step.preheader}
						<p class="step-preheader">{step.preheader}</p>
					{/if}

					{#if metrics}
						<div class="metrics-row">
							<div class="metric">
								<span class="metric-value">{metrics.total_sent}</span>
								<span class="metric-label">sent</span>
							</div>
							<div class="metric">
								<span class="metric-value">{metrics.total_opened}</span>
								<span class="metric-label">opened ({metrics.open_rate}%)</span>
							</div>
							<div class="metric">
								<span class="metric-value">{metrics.total_clicked}</span>
								<span class="metric-label">clicked ({metrics.click_rate}%)</span>
							</div>
						</div>
					{:else}
						<div class="metrics-row">
							<span class="metric-label">No send data yet</span>
						</div>
					{/if}

					<button class="toggle-content" onclick={() => (expandedStep = step.step_number)}>
						View email content
					</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- Enrollment Details -->
	<section class="section">
		<h2>Enrollments ({data.enrollments.length})</h2>
		<div class="table-wrapper">
			<table class="enrollments-table">
				<thead>
					<tr>
						<th>Email</th>
						<th>Status</th>
						<th>Step</th>
						<th>Enrolled</th>
						<th>Last Email Sent</th>
						<th>Last Site Visit</th>
						<th>Sessions</th>
						<th>Came Back?</th>
					</tr>
				</thead>
				<tbody>
					{#each displayedEnrollments as enrollment}
						{@const returned = cameBack(enrollment)}
						<tr>
							<td class="email-cell" data-label="Email" title={enrollment.recipient_email}>
								{enrollment.recipient_email}
							</td>
							<td data-label="Status">
								<span
									class="status-dot"
									style="background: {statusColors[enrollment.status] || '#6b7280'}"
								></span>
								{enrollment.status}
								{#if enrollment.exit_reason}
									<span class="exit-reason">({enrollment.exit_reason})</span>
								{/if}
							</td>
							<td data-label="Step">{enrollment.current_step_number}/{data.steps.length}</td>
							<td data-label="Enrolled" title={enrollment.enrolled_at}>
								{formatDate(enrollment.enrolled_at)}
							</td>
							<td data-label="Last email" title={enrollment.last_sent_at}>
								{formatDateTime(enrollment.last_sent_at)}
							</td>
							<td data-label="Last visit">
								{#if enrollment.return_data}
									<span title={enrollment.return_data.last_visit}>
										{daysSince(enrollment.return_data.last_visit)}
									</span>
								{:else}
									<span class="no-data">no visits</span>
								{/if}
							</td>
							<td data-label="Sessions">
								{enrollment.return_data ? enrollment.return_data.session_count : 0}
							</td>
							<td data-label="Came back">
								{#if returned === 'yes'}
									<span class="badge badge-yes">Yes</span>
								{:else if returned === 'no'}
									<span class="badge badge-no">No</span>
								{:else}
									<span class="badge badge-unknown">-</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.enrollments.length > 50 && !showAllEnrollments}
			<button class="show-all-btn" onclick={() => (showAllEnrollments = true)}>
				Show all {data.enrollments.length} enrollments
			</button>
		{/if}

		{#if data.enrollments.length === 0}
			<p class="empty-note">No enrollments yet. Users are enrolled when they register.</p>
		{/if}
	</section>
{/if}

{#if selectedPreviewStep}
	<div
		class="email-modal-overlay"
		role="presentation"
		onclick={closePreviewModal}
		onkeydown={handleOverlayKeydown}
	>
		<div
			class="email-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="email-preview-title"
			tabindex="-1"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<header class="email-modal-header">
				<div class="email-modal-title-group">
					<div class="step-number">Step {selectedPreviewStep.step_number}</div>
					<h2 id="email-preview-title">{selectedPreviewStep.subject}</h2>
					{#if selectedPreviewStep.preheader}
						<p>{selectedPreviewStep.preheader}</p>
					{/if}
				</div>
				<button class="modal-close-button" type="button" onclick={closePreviewModal}>
					Close
				</button>
			</header>

			<div class="email-modal-meta">
				<span>
					{#if selectedPreviewStep.delay_days_after_previous === 0}
						Immediate send
					{:else}
						Sends +{selectedPreviewStep.delay_days_after_previous} day{selectedPreviewStep.delay_days_after_previous !==
						1
							? 's'
							: ''}
					{/if}
				</span>
				<span
					>{selectedPreviewStep.code_managed ? 'Copy managed in code' : 'Copy from database'}</span
				>
			</div>

			<div class="email-preview-shell modal-preview-shell">
				<iframe
					class="email-preview-frame modal-preview-frame"
					title={`Welcome email step ${selectedPreviewStep.step_number} preview`}
					srcdoc={selectedPreviewStep.preview_html || selectedPreviewStep.html_content}
					sandbox=""
				></iframe>
			</div>
		</div>
	</div>
{/if}

<style>
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--text-secondary);
	}

	.status-bar {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.status-badge {
		padding: 4px 12px;
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.status-badge.active {
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
	}

	.meta {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.link {
		color: var(--primary);
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}

	.section {
		margin-bottom: 32px;
	}

	.section h2 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 16px 0;
		color: var(--text-primary);
	}

	.test-panel {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
		gap: 20px;
		padding: 16px;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-surface);
	}

	.panel-copy p {
		margin: 0;
		color: var(--text-primary);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.panel-copy p + p {
		margin-top: 10px;
	}

	.info-note {
		margin: 0 0 12px 0;
		color: var(--text-secondary);
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	.test-form {
		display: grid;
		gap: 12px;
	}

	.test-form label {
		display: grid;
		gap: 6px;
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.test-form input,
	.test-form select {
		width: 100%;
		min-height: 38px;
		border: 1px solid var(--bg-elevated);
		border-radius: 6px;
		background: var(--bg-base);
		color: var(--text-primary);
		font-size: 0.875rem;
		padding: 8px 10px;
	}

	.test-form input:focus,
	.test-form select:focus {
		outline: 2px solid color-mix(in srgb, var(--primary) 40%, transparent);
		border-color: var(--primary);
	}

	.button-row {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.button-row button {
		border: 1px solid var(--primary);
		border-radius: 6px;
		background: var(--primary);
		color: white;
		padding: 8px 14px;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
	}

	.button-row button:hover:not(:disabled) {
		filter: brightness(1.05);
	}

	.button-row button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-row .secondary-button {
		background: transparent;
		color: var(--primary);
	}

	/* Funnel */
	.funnel {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.funnel-step {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.funnel-bar {
		height: 32px;
		background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark, #1a6b5a) 100%);
		border-radius: 6px;
		display: flex;
		align-items: center;
		padding: 0 12px;
		min-width: 40px;
		transition: width 0.3s ease;
	}

	.funnel-count {
		color: white;
		font-weight: 700;
		font-size: 0.8125rem;
	}

	.funnel-label {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.funnel-pct {
		color: var(--text-tertiary, var(--text-secondary));
		font-size: 0.75rem;
		margin-left: 4px;
	}

	.funnel-summary {
		display: flex;
		gap: 20px;
		margin-top: 12px;
		flex-wrap: wrap;
	}

	.stat {
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.stat-value {
		font-weight: 700;
		font-size: 1rem;
	}

	.queue-summary {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		margin-bottom: 12px;
	}

	.summary-tile {
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-surface);
		padding: 12px;
	}

	.summary-value {
		display: block;
		color: var(--text-primary);
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1;
	}

	.summary-label {
		display: block;
		margin-top: 4px;
		color: var(--text-secondary);
		font-size: 0.75rem;
	}

	.subject-cell {
		max-width: 340px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.preheader-line {
		display: block;
		max-width: 360px;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--text-secondary);
		font-size: 0.75rem;
		margin-top: 2px;
	}

	.due {
		color: #ef4444;
		font-weight: 700;
	}

	.copy-source {
		display: inline-block;
		border-radius: 6px;
		background: var(--bg-elevated);
		color: var(--text-secondary);
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 3px 8px;
		text-transform: uppercase;
	}

	/* Step Cards */
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 16px;
	}

	.step-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		padding: 16px;
	}

	.step-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.step-number {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--primary);
	}

	.step-delay {
		font-size: 0.75rem;
		color: var(--text-secondary);
		background: var(--bg-elevated);
		padding: 2px 8px;
		border-radius: 8px;
	}

	.managed-badge {
		display: inline-block;
		margin-bottom: 8px;
		border-radius: 6px;
		background: rgba(15, 118, 110, 0.12);
		color: #0f766e;
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 3px 8px;
	}

	.step-subject {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 6px 0;
		color: var(--text-primary);
		line-height: 1.4;
	}

	.step-preheader {
		margin: 0 0 12px 0;
		color: var(--text-secondary);
		font-size: 0.75rem;
		line-height: 1.4;
	}

	.metrics-row {
		display: flex;
		gap: 16px;
		margin-bottom: 12px;
		flex-wrap: wrap;
	}

	.metric {
		display: flex;
		flex-direction: column;
	}

	.metric-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1;
	}

	.metric-label {
		font-size: 0.6875rem;
		color: var(--text-secondary);
		margin-top: 2px;
	}

	.toggle-content {
		background: none;
		border: 1px solid var(--bg-elevated);
		color: var(--primary);
		padding: 6px 12px;
		border-radius: 6px;
		font-size: 0.75rem;
		cursor: pointer;
		width: 100%;
	}

	.toggle-content:hover {
		background: var(--bg-elevated);
	}

	.email-preview-shell {
		margin-top: 12px;
		background: var(--bg-base);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		overflow: hidden;
	}

	.email-preview-frame {
		display: block;
		width: 100%;
		height: 640px;
		border: 0;
		background: white;
	}

	.email-modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		background: rgba(0, 0, 0, 0.62);
	}

	.email-modal {
		width: min(100%, 1120px);
		max-height: calc(100vh - 32px);
		display: flex;
		flex-direction: column;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-base);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
		overflow: hidden;
	}

	.email-modal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 20px 14px;
		border-bottom: 1px solid var(--bg-elevated);
		background: var(--bg-surface);
	}

	.email-modal-title-group {
		min-width: 0;
	}

	.email-modal-title-group h2 {
		margin: 4px 0 0;
		color: var(--text-primary);
		font-size: 1rem;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.email-modal-title-group p {
		margin: 6px 0 0;
		color: var(--text-secondary);
		font-size: 0.8125rem;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.modal-close-button {
		flex: 0 0 auto;
		border: 1px solid var(--bg-elevated);
		border-radius: 6px;
		background: var(--bg-base);
		color: var(--text-primary);
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 7px 12px;
		cursor: pointer;
	}

	.modal-close-button:hover {
		background: var(--bg-elevated);
	}

	.email-modal-meta {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		padding: 10px 20px;
		border-bottom: 1px solid var(--bg-elevated);
		background: var(--bg-base);
	}

	.email-modal-meta span {
		border-radius: 6px;
		background: var(--bg-elevated);
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 600;
		padding: 4px 8px;
	}

	.modal-preview-shell {
		margin-top: 0;
		flex: 1 1 auto;
		min-height: min(700px, calc(100vh - 190px));
		border: 0;
		border-radius: 0;
		overflow: hidden;
	}

	.modal-preview-frame {
		height: 100%;
		min-height: min(700px, calc(100vh - 190px));
	}

	/* Enrollments Table */
	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
	}

	.enrollments-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}

	.enrollments-table th {
		background: var(--bg-elevated);
		padding: 10px 12px;
		text-align: left;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0;
		white-space: nowrap;
	}

	.enrollments-table td {
		padding: 10px 12px;
		border-top: 1px solid var(--bg-elevated);
		color: var(--text-primary);
		white-space: nowrap;
	}

	.enrollments-table tr:hover td {
		background: var(--bg-surface);
	}

	.email-cell {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.status-dot {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		margin-right: 6px;
		vertical-align: middle;
	}

	.exit-reason {
		font-size: 0.6875rem;
		color: var(--text-secondary);
	}

	.no-data {
		color: var(--text-secondary);
		font-style: italic;
	}

	.badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 8px;
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.badge-yes {
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
	}

	.badge-no {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
	}

	.badge-unknown {
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.show-all-btn {
		display: block;
		margin: 12px auto 0;
		padding: 8px 20px;
		background: var(--bg-elevated);
		border: 1px solid var(--bg-highlight, var(--bg-elevated));
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 0.8125rem;
		cursor: pointer;
	}

	.show-all-btn:hover {
		background: var(--bg-surface);
	}

	.empty-note {
		text-align: center;
		color: var(--text-secondary);
		padding: 24px;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.steps-grid {
			grid-template-columns: 1fr;
		}

		.funnel-summary {
			gap: 12px;
		}

		.table-wrapper {
			border: none;
			overflow: visible;
		}

		.enrollments-table {
			display: block;
		}

		.enrollments-table thead {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.enrollments-table,
		.enrollments-table tbody,
		.enrollments-table tr {
			display: block;
		}

		.enrollments-table tbody {
			display: grid;
			gap: 0.85rem;
		}

		.enrollments-table tr {
			border: 1px solid var(--bg-elevated);
			border-radius: 8px;
			background: color-mix(in srgb, var(--bg-surface) 92%, var(--bg-base));
			padding: 0.95rem;
		}

		.enrollments-table td {
			display: grid;
			grid-template-columns: minmax(92px, 0.9fr) minmax(0, 1fr);
			gap: 0.75rem;
			padding: 0;
			border-top: none;
			white-space: normal;
			align-items: start;
		}

		.enrollments-table td + td {
			margin-top: 0.7rem;
		}

		.enrollments-table td::before {
			content: attr(data-label);
			font-size: 0.64rem;
			font-weight: 700;
			letter-spacing: 0;
			text-transform: uppercase;
			color: var(--text-secondary);
		}

		.email-cell {
			max-width: none;
		}

		.test-panel {
			grid-template-columns: 1fr;
		}

		.queue-summary {
			grid-template-columns: 1fr;
		}

		.subject-cell,
		.preheader-line {
			max-width: none;
		}

		.email-modal-overlay {
			align-items: stretch;
			padding: 8px;
		}

		.email-modal {
			max-height: calc(100vh - 16px);
		}

		.email-modal-header {
			padding: 14px;
		}

		.email-modal-meta {
			padding: 10px 14px;
		}

		.modal-preview-shell,
		.modal-preview-frame {
			min-height: calc(100vh - 205px);
		}
	}
</style>
