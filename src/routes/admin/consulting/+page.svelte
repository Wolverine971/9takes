<!-- src/routes/admin/consulting/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailComposeModal from '$lib/components/email/EmailComposeModal.svelte';
	import type { EmailRecipient } from '$lib/types/email';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Email modal state
	let showEmailModal = false;
	let emailRecipients: EmailRecipient[] = [];
	let emailSubject = '';
	let emailContent = '';

	function openEmailForWaitlist(entry: any) {
		const firstName = entry.name?.split(' ')[0] || 'there';
		emailRecipients = [
			{
				id: String(entry.id),
				email: entry.email,
				name: entry.name,
				source: 'coaching_waitlist',
				source_id: String(entry.id),
				enneagram: entry.enneagram_type
			}
		];
		emailSubject = '';
		emailContent = `<p>Hi ${firstName},</p>\n\n<p>Thanks for signing up for personality maxing coaching!</p>\n\n<p></p>\n\n<p>Best,<br>DJ</p>`;
		showEmailModal = true;
	}

	function handleEmailSent() {
		showEmailModal = false;
	}

	// Format date for display
	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatRelativeDate(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays < 7) return `In ${diffDays} days`;
		return formatDate(dateStr);
	}

	// Pipeline stages
	const pipelineStages = [
		{ key: 'prospect', label: 'Prospects', color: '#6366f1' },
		{ key: 'intake_sent', label: 'Intake Sent', color: '#f59e0b' },
		{ key: 'intake_completed', label: 'Intake Done', color: '#10b981' },
		{ key: 'active', label: 'Active', color: '#3b82f6' },
		{ key: 'completed', label: 'Completed', color: '#6b7280' }
	];

	// Quick links to resources
	const quickLinks = [
		{
			title: 'Intro Call Script',
			slug: 'intro-call-playbook',
			description: 'Trust onion, EEO voice, objection handling'
		},
		{
			title: 'Session Framework',
			slug: 'session-delivery-framework',
			description: 'Before, during, and after session checklist'
		},
		{
			title: 'Type Questions',
			slug: 'type-specific-questions',
			description: 'Deep questions for each Enneagram type'
		}
	];

	// Handle promote action
	let promotingId: number | null = null;
</script>

<div class="consulting-dashboard">
	<div class="page-header">
		<h1>Personality Maxing Consulting</h1>
		<p class="subtitle">Your coaching practice at a glance</p>
	</div>

	<!-- Stats Row -->
	<div class="stats-grid">
		<div class="stat-card highlight">
			<div class="stat-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-num">{data.stats.waitlistCount}</span>
				<span class="stat-label">Waitlist</span>
			</div>
			<a href="/admin/consulting/clients" class="stat-link">View all</a>
		</div>

		<div class="stat-card">
			<div class="stat-icon clients">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
					<circle cx="12" cy="7" r="4" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-num">{data.stats.totalClients}</span>
				<span class="stat-label">Total Clients</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon active">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-num">{data.stats.activeClients}</span>
				<span class="stat-label">Active</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon pending">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14 2 14 8 20 8" />
					<line x1="16" y1="13" x2="8" y2="13" />
					<line x1="16" y1="17" x2="8" y2="17" />
				</svg>
			</div>
			<div class="stat-content">
				<span class="stat-num">{data.stats.pendingIntakes}</span>
				<span class="stat-label">Pending Intakes</span>
			</div>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="content-grid">
		<!-- Left Column -->
		<div class="main-column">
			<!-- Pipeline Overview -->
			<section class="section-card">
				<div class="section-header">
					<h2>Client Pipeline</h2>
					<a href="/admin/consulting/clients" class="view-all-link">View all</a>
				</div>
				<div class="pipeline">
					{#each pipelineStages as stage}
						<div class="pipeline-stage">
							<div class="stage-bar" style="--stage-color: {stage.color}">
								<span class="stage-count">{data.statusCounts[stage.key] || 0}</span>
							</div>
							<span class="stage-label">{stage.label}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Upcoming Sessions -->
			<section class="section-card">
				<div class="section-header">
					<h2>Upcoming Sessions</h2>
					<a href="/admin/consulting/sessions" class="view-all-link">View all</a>
				</div>
				{#if data.upcomingSessions.length === 0}
					<div class="empty-state">
						<p>No upcoming sessions scheduled</p>
						<a href="/admin/consulting/sessions" class="btn btn-primary btn-sm">Schedule Session</a>
					</div>
				{:else}
					<div class="session-list">
						{#each data.upcomingSessions as session}
							<div class="session-item">
								<div class="session-time">
									<span class="session-when">{formatRelativeDate(session.scheduled_at)}</span>
									<span class="session-hour"
										>{new Date(session.scheduled_at).toLocaleTimeString('en-US', {
											hour: 'numeric',
											minute: '2-digit'
										})}</span
									>
								</div>
								<div class="session-info">
									<span class="session-client">{session.client?.name || 'Unknown'}</span>
									<span class="session-type">{session.session_type?.replace('_', ' ')}</span>
								</div>
								<div class="session-meta">
									{#if session.client?.enneagram_type}
										<span class="type-badge">T{session.client.enneagram_type}</span>
									{/if}
									{#if session.client?.trust_layer}
										<span class="trust-badge trust-{session.client.trust_layer}"
											>{session.client.trust_layer}</span
										>
									{/if}
								</div>
								<a href="/admin/consulting/sessions/{session.id}" class="session-action"> Prep </a>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Recent Waitlist -->
			<section class="section-card">
				<div class="section-header">
					<h2>Recent Waitlist Signups</h2>
					<span class="count-badge">{data.stats.waitlistCount}</span>
				</div>
				{#if data.recentWaitlist.length === 0}
					<div class="empty-state">
						<p>No waitlist signups yet</p>
					</div>
				{:else}
					<div class="waitlist-table">
						<table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Goal</th>
									<th>Date</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{#each data.recentWaitlist as entry}
									<tr class:converted={entry.isConverted}>
										<td class="name-cell">
											{entry.name}
											{#if entry.enneagram_type}
												<span class="type-badge small">T{entry.enneagram_type}</span>
											{/if}
											{#if entry.isConverted}
												<span class="converted-badge">Client</span>
											{/if}
										</td>
										<td class="email-cell">
											<a href="mailto:{entry.email}">{entry.email}</a>
										</td>
										<td class="goal-cell" title={entry.session_goal}>
											{entry.session_goal
												? entry.session_goal.slice(0, 60) +
													(entry.session_goal.length > 60 ? '...' : '')
												: '-'}
										</td>
										<td class="date-cell">{formatDate(entry.created_at)}</td>
										<td class="action-cell">
											<button
												class="btn btn-sm btn-email"
												on:click={() => openEmailForWaitlist(entry)}
												title="Send email"
											>
												Email
											</button>
											{#if entry.isConverted && entry.clientId}
												<a
													href="/admin/consulting/clients/{entry.clientId}"
													class="btn btn-sm btn-secondary"
												>
													View
												</a>
											{:else}
												<form
													method="POST"
													action="?/promoteToClient"
													use:enhance={() => {
														promotingId = entry.id;
														return async ({ result }) => {
															promotingId = null;
															if (result.type === 'success') {
																notifications.success('Client created successfully', 3000);
																invalidateAll();
															} else if (result.type === 'failure') {
																notifications.danger(
																	result.data?.error || 'Failed to create client',
																	3000
																);
															}
														};
													}}
												>
													<input type="hidden" name="waitlistId" value={entry.id} />
													<button
														type="submit"
														class="btn btn-sm btn-primary"
														disabled={promotingId === entry.id}
													>
														{promotingId === entry.id ? '...' : 'Convert'}
													</button>
												</form>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</section>
		</div>

		<!-- Right Column -->
		<div class="side-column">
			<!-- Type Distribution -->
			<section class="section-card compact">
				<div class="section-header">
					<h2>Client Types</h2>
				</div>
				<div class="type-grid">
					{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
						<div class="type-cell" class:has-clients={data.typeDistribution[type] > 0}>
							<span class="type-num">{type}</span>
							<span class="type-count">{data.typeDistribution[type] || 0}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- Quick Access Resources -->
			<section class="section-card compact">
				<div class="section-header">
					<h2>Quick Access</h2>
				</div>
				<div class="quick-links">
					{#each quickLinks as link}
						<a href="/admin/consulting/resources/{link.slug}" class="quick-link">
							<span class="quick-link-title">{link.title}</span>
							<span class="quick-link-desc">{link.description}</span>
						</a>
					{/each}
				</div>
				<a href="/admin/consulting/resources" class="view-all-btn"> View All Resources </a>
			</section>

			<!-- Today's Prep Checklist -->
			<section class="section-card compact">
				<div class="section-header">
					<h2>Session Prep</h2>
				</div>
				<div class="checklist">
					<label class="checklist-item">
						<input type="checkbox" />
						<span>Review client intake forms</span>
					</label>
					<label class="checklist-item">
						<input type="checkbox" />
						<span>Prepare type-specific questions</span>
					</label>
					<label class="checklist-item">
						<input type="checkbox" />
						<span>Set up meeting links</span>
					</label>
					<label class="checklist-item">
						<input type="checkbox" />
						<span>Clear mental space (5 min meditation)</span>
					</label>
				</div>
			</section>

			<!-- Key Frameworks Reference -->
			<section class="section-card compact frameworks">
				<div class="section-header">
					<h2>Key Frameworks</h2>
				</div>
				<div class="framework-list">
					<div class="framework-item">
						<h4>Trust Onion</h4>
						<div class="framework-levels">
							<span class="level outer">Outer: Blame circumstances</span>
							<span class="level middle">Middle: Blame people</span>
							<span class="level inner">Inner: Self-responsibility</span>
						</div>
					</div>
					<div class="framework-item">
						<h4>EEO Voice</h4>
						<div class="framework-levels">
							<span class="level">Observation: "Studies show..."</span>
							<span class="level">Experience: "In my work..."</span>
							<span class="level">Expert: "What's happening is..."</span>
						</div>
					</div>
					<div class="framework-item">
						<h4>90-Second Rule</h4>
						<p class="framework-note">
							Emotions last 90 seconds. After that, we choose to refresh them.
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

<!-- Email Compose Modal -->
<EmailComposeModal
	bind:open={showEmailModal}
	recipients={emailRecipients}
	initialSubject={emailSubject}
	initialContent={emailContent}
	on:send={handleEmailSent}
	on:close={() => (showEmailModal = false)}
/>

<style>
	.consulting-dashboard {
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.5rem;
		margin: 0 0 0.25rem;
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0;
		font-size: 0.875rem;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
	}

	.stat-card.highlight {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
		border-color: rgba(99, 102, 241, 0.3);
	}

	.stat-icon {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: var(--hover-background);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary);
	}

	.stat-icon.clients {
		color: #6366f1;
	}
	.stat-icon.active {
		color: #10b981;
	}
	.stat-icon.pending {
		color: #f59e0b;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
	}

	.stat-num {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.stat-link {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.75rem;
		color: var(--primary);
		text-decoration: none;
	}

	.stat-link:hover {
		text-decoration: underline;
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 1.5rem;
	}

	/* Section Cards */
	.section-card {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.section-card.compact {
		padding: 0.75rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.section-header h2 {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
	}

	.view-all-link {
		font-size: 0.75rem;
		color: var(--primary);
		text-decoration: none;
	}

	.view-all-link:hover {
		text-decoration: underline;
	}

	.count-badge {
		background: var(--primary);
		color: white;
		font-size: 0.7rem;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-weight: 500;
	}

	/* Pipeline */
	.pipeline {
		display: flex;
		gap: 0.5rem;
	}

	.pipeline-stage {
		flex: 1;
		text-align: center;
	}

	.stage-bar {
		background: var(--stage-color);
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		margin-bottom: 0.25rem;
	}

	.stage-count {
		font-weight: 700;
		font-size: 1.125rem;
	}

	.stage-label {
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	/* Session List */
	.session-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.session-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem;
		background: var(--hover-background);
		border-radius: 6px;
	}

	.session-time {
		min-width: 80px;
		text-align: center;
	}

	.session-when {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--primary);
	}

	.session-hour {
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	.session-info {
		flex: 1;
	}

	.session-client {
		display: block;
		font-weight: 500;
		font-size: 0.875rem;
	}

	.session-type {
		font-size: 0.7rem;
		color: var(--text-secondary);
		text-transform: capitalize;
	}

	.session-meta {
		display: flex;
		gap: 0.25rem;
	}

	.session-action {
		font-size: 0.75rem;
		color: var(--primary);
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--primary);
		border-radius: 4px;
	}

	.session-action:hover {
		background: var(--primary);
		color: white;
	}

	/* Type Badge */
	.type-badge {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		font-size: 0.7rem;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-weight: 500;
	}

	.type-badge.small {
		font-size: 0.6rem;
		padding: 0.0625rem 0.25rem;
	}

	/* Trust Badge */
	.trust-badge {
		font-size: 0.65rem;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-weight: 500;
		text-transform: capitalize;
	}

	.trust-outer {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}
	.trust-middle {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}
	.trust-inner {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	/* Waitlist Table */
	.waitlist-table {
		overflow-x: auto;
	}

	.waitlist-table table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8rem;
	}

	.waitlist-table th {
		text-align: left;
		padding: 0.5rem;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.7rem;
		text-transform: uppercase;
		border-bottom: 1px solid var(--border-color);
	}

	.waitlist-table td {
		padding: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.name-cell {
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.email-cell a {
		color: var(--primary);
		text-decoration: none;
	}

	.goal-cell {
		max-width: 200px;
		color: var(--text-secondary);
		font-size: 0.75rem;
	}

	.date-cell {
		font-size: 0.7rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.converted-badge {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
		font-size: 0.6rem;
		padding: 0.0625rem 0.25rem;
		border-radius: 4px;
		font-weight: 500;
	}

	tr.converted {
		opacity: 0.7;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 1.5rem;
		color: var(--text-secondary);
	}

	.empty-state p {
		margin: 0 0 1rem;
	}

	/* Type Distribution Grid */
	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.375rem;
	}

	.type-cell {
		background: var(--hover-background);
		border-radius: 6px;
		padding: 0.5rem;
		text-align: center;
		opacity: 0.5;
	}

	.type-cell.has-clients {
		opacity: 1;
		background: rgba(99, 102, 241, 0.1);
	}

	.type-num {
		display: block;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--primary);
	}

	.type-count {
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	/* Quick Links */
	.quick-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.quick-link {
		display: block;
		padding: 0.5rem;
		background: var(--hover-background);
		border-radius: 6px;
		text-decoration: none;
		transition: all 0.2s;
	}

	.quick-link:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.quick-link-title {
		display: block;
		font-weight: 500;
		font-size: 0.8rem;
		color: var(--text-primary);
	}

	.quick-link-desc {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.view-all-btn {
		display: block;
		text-align: center;
		margin-top: 0.75rem;
		padding: 0.5rem;
		background: var(--primary);
		color: white;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.view-all-btn:hover {
		opacity: 0.9;
	}

	/* Checklist */
	.checklist {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.checklist-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.checklist-item input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: var(--primary);
	}

	.checklist-item span {
		color: var(--text-primary);
	}

	/* Frameworks */
	.framework-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.framework-item h4 {
		font-size: 0.75rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
		color: var(--text-primary);
	}

	.framework-levels {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.framework-levels .level {
		font-size: 0.7rem;
		color: var(--text-secondary);
		padding-left: 0.5rem;
		border-left: 2px solid var(--border-color);
	}

	.framework-levels .level.outer {
		border-color: #ef4444;
	}
	.framework-levels .level.middle {
		border-color: #f59e0b;
	}
	.framework-levels .level.inner {
		border-color: #10b981;
	}

	.framework-note {
		font-size: 0.7rem;
		color: var(--text-secondary);
		margin: 0;
		font-style: italic;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s;
	}

	.btn-sm {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-secondary {
		background: var(--hover-background);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
	}

	.btn-secondary:hover {
		background: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	.btn-email {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.btn-email:hover {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.action-cell {
		display: flex;
		gap: 0.375rem;
		align-items: center;
	}

	.action-cell form {
		display: inline;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.side-column {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}

	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.side-column {
			grid-template-columns: 1fr;
		}

		.pipeline {
			flex-wrap: wrap;
		}

		.pipeline-stage {
			flex: 1 1 calc(33% - 0.5rem);
		}
	}
</style>
