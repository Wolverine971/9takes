<!-- src/routes/admin/welcome-sequence/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let expandedStep = $state<number | null>(null);
	let showAllEnrollments = $state(false);

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

	let returnRate = $derived(() => {
		const withSends = data.enrollments.filter((e) => e.last_sent_at);
		if (withSends.length === 0) return 0;
		const returned = withSends.filter((e) => cameBack(e) === 'yes').length;
		return Math.round((returned / withSends.length) * 100);
	});
</script>

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

	<!-- Per-Step Metrics + Content -->
	<section class="section">
		<h2>Email Steps</h2>
		<div class="steps-grid">
			{#each data.steps as step, i}
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

					<button
						class="toggle-content"
						onclick={() =>
							(expandedStep = expandedStep === step.step_number ? null : step.step_number)}
					>
						{expandedStep === step.step_number ? 'Hide' : 'View'} email content
					</button>

					{#if expandedStep === step.step_number}
						<div class="email-preview">
							{@html step.html_content}
						</div>
					{/if}
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
		border-radius: 12px;
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

	/* Step Cards */
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 16px;
	}

	.step-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
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
		margin: 0 0 12px 0;
		color: var(--text-primary);
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

	.email-preview {
		margin-top: 12px;
		padding: 16px;
		background: var(--bg-deep, var(--bg-base));
		border-radius: 8px;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--text-primary);
		overflow-x: auto;
	}

	.email-preview :global(p) {
		margin: 0 0 8px 0;
	}

	.email-preview :global(ul),
	.email-preview :global(ol) {
		margin: 0 0 8px 0;
		padding-left: 20px;
	}

	.email-preview :global(a) {
		color: var(--primary);
	}

	/* Enrollments Table */
	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
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
		letter-spacing: 0.03em;
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
			border-radius: 12px;
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
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-secondary);
		}

		.email-cell {
			max-width: none;
		}
	}
</style>
