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

	// Search/filter state
	let waitlistSearch = '';
	let showConvertedOnly = false;

	// Collapsible section state
	let frameworksExpanded = true;
	let checklistExpanded = true;

	// Filtered waitlist entries
	$: filteredWaitlist = data.recentWaitlist.filter((entry: any) => {
		const matchesSearch =
			!waitlistSearch ||
			entry.name?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
			entry.email?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
			entry.session_goal?.toLowerCase().includes(waitlistSearch.toLowerCase());

		const matchesFilter = !showConvertedOnly || entry.isConverted;

		return matchesSearch && matchesFilter;
	});

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
		notifications.success('Email sent successfully', 3000);
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
		{ key: 'prospect', label: 'Prospects', color: '#6366f1', description: 'New leads' },
		{
			key: 'intake_sent',
			label: 'Intake Sent',
			color: '#f59e0b',
			description: 'Awaiting response'
		},
		{
			key: 'intake_completed',
			label: 'Intake Done',
			color: '#10b981',
			description: 'Ready for session'
		},
		{ key: 'active', label: 'Active', color: '#3b82f6', description: 'In coaching' },
		{ key: 'completed', label: 'Completed', color: '#6b7280', description: 'Finished program' }
	];

	// Quick links to resources
	const quickLinks = [
		{
			title: 'Intro Call Script',
			slug: 'intro-call-playbook',
			description: 'Trust onion, EEO voice, objection handling',
			icon: 'phone'
		},
		{
			title: 'Session Framework',
			slug: 'session-delivery-framework',
			description: 'Before, during, and after session checklist',
			icon: 'clipboard'
		},
		{
			title: 'Type Questions',
			slug: 'type-specific-questions',
			description: 'Deep questions for each Enneagram type',
			icon: 'question'
		}
	];

	// Handle promote action
	let promotingId: number | null = null;

	// Keyboard handler for waitlist table rows
	function handleRowKeydown(event: KeyboardEvent, entry: any) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!entry.isConverted) {
				// Focus the convert button
				const row = event.currentTarget as HTMLElement;
				const convertBtn = row.querySelector('.btn-convert') as HTMLButtonElement;
				convertBtn?.focus();
			}
		}
	}

	// Calculate progress percentage
	$: progressPercentage =
		data.stats.totalClients > 0
			? Math.round((data.stats.activeClients / data.stats.totalClients) * 100)
			: 0;
</script>

<svelte:head>
	<title>Consulting Dashboard | 9takes Admin</title>
</svelte:head>

<div class="consulting-dashboard" role="main" aria-label="Consulting Dashboard">
	<!-- Skip Link for accessibility -->
	<a href="#main-content" class="skip-link">Skip to main content</a>

	<!-- Page Header -->
	<header class="page-header">
		<div class="header-content">
			<h1 id="page-title">Personality Maxing Consulting</h1>
			<p class="subtitle">Your coaching practice at a glance</p>
		</div>
		<div class="header-actions">
			<a href="/admin/consulting/clients" class="btn btn-secondary">
				<svg
					aria-hidden="true"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
				<span>All Clients</span>
			</a>
			<a href="/admin/consulting/sessions" class="btn btn-primary">
				<svg
					aria-hidden="true"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
					<line x1="16" y1="2" x2="16" y2="6" />
					<line x1="8" y1="2" x2="8" y2="6" />
					<line x1="3" y1="10" x2="21" y2="10" />
				</svg>
				<span>Schedule Session</span>
			</a>
		</div>
	</header>

	<!-- Stats Overview -->
	<section class="stats-section" aria-labelledby="stats-heading">
		<h2 id="stats-heading" class="visually-hidden">Key Statistics</h2>
		<div class="stats-grid" role="list">
			<div class="stat-card highlight" role="listitem">
				<div class="stat-icon" aria-hidden="true">
					<svg
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
					<span class="stat-num" aria-describedby="waitlist-label">{data.stats.waitlistCount}</span>
					<span class="stat-label" id="waitlist-label">On Waitlist</span>
				</div>
				<a href="#waitlist-section" class="stat-link" aria-label="Jump to waitlist section">
					View below
					<svg
						aria-hidden="true"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</a>
			</div>

			<div class="stat-card" role="listitem">
				<div class="stat-icon clients" aria-hidden="true">
					<svg
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
					<span class="stat-num" aria-describedby="total-label">{data.stats.totalClients}</span>
					<span class="stat-label" id="total-label">Total Clients</span>
				</div>
			</div>

			<div class="stat-card" role="listitem">
				<div class="stat-icon active" aria-hidden="true">
					<svg
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
					<span class="stat-num" aria-describedby="active-label">{data.stats.activeClients}</span>
					<span class="stat-label" id="active-label">Active Clients</span>
				</div>
				{#if data.stats.totalClients > 0}
					<div class="stat-progress" aria-hidden="true">
						<div class="progress-bar" style="width: {progressPercentage}%"></div>
					</div>
				{/if}
			</div>

			<div class="stat-card" role="listitem">
				<div class="stat-icon pending" aria-hidden="true">
					<svg
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
					<span class="stat-num" aria-describedby="pending-label">{data.stats.pendingIntakes}</span>
					<span class="stat-label" id="pending-label">Pending Intakes</span>
				</div>
				{#if data.stats.pendingIntakes > 0}
					<span class="stat-badge">Needs attention</span>
				{/if}
			</div>
		</div>
	</section>

	<!-- Main Content Grid -->
	<div id="main-content" class="content-grid">
		<!-- Left Column -->
		<div class="main-column">
			<!-- Pipeline Overview -->
			<section class="section-card" aria-labelledby="pipeline-heading">
				<div class="section-header">
					<h2 id="pipeline-heading">Client Pipeline</h2>
					<a href="/admin/consulting/clients" class="view-all-link">
						Manage clients
						<svg
							aria-hidden="true"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</a>
				</div>
				<div class="pipeline" role="list" aria-label="Client status pipeline">
					{#each pipelineStages as stage}
						<a
							href="/admin/consulting/clients?status={stage.key}"
							class="pipeline-stage"
							role="listitem"
							title="{stage.description}: {data.statusCounts[stage.key] || 0} clients"
						>
							<div class="stage-bar" style="--stage-color: {stage.color}">
								<span class="stage-count">{data.statusCounts[stage.key] || 0}</span>
							</div>
							<span class="stage-label">{stage.label}</span>
						</a>
					{/each}
				</div>
			</section>

			<!-- Upcoming Sessions -->
			<section class="section-card" aria-labelledby="sessions-heading">
				<div class="section-header">
					<h2 id="sessions-heading">
						<svg
							aria-hidden="true"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
							<line x1="16" y1="2" x2="16" y2="6" />
							<line x1="8" y1="2" x2="8" y2="6" />
							<line x1="3" y1="10" x2="21" y2="10" />
						</svg>
						Upcoming Sessions
					</h2>
					<a href="/admin/consulting/sessions" class="view-all-link">
						View all
						<svg
							aria-hidden="true"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</a>
				</div>
				{#if data.upcomingSessions.length === 0}
					<div class="empty-state" role="status">
						<div class="empty-icon" aria-hidden="true">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
						</div>
						<p>No upcoming sessions scheduled</p>
						<p class="empty-hint">Schedule your next client session to see it here</p>
						<a href="/admin/consulting/sessions" class="btn btn-primary">
							<svg
								aria-hidden="true"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="12" y1="5" x2="12" y2="19" />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
							Schedule Session
						</a>
					</div>
				{:else}
					<ul class="session-list" aria-label="Upcoming sessions">
						{#each data.upcomingSessions as session}
							<li class="session-item">
								<div class="session-time">
									<span class="session-when">{formatRelativeDate(session.scheduled_at)}</span>
									<span class="session-hour">
										{new Date(session.scheduled_at).toLocaleTimeString('en-US', {
											hour: 'numeric',
											minute: '2-digit'
										})}
									</span>
								</div>
								<div class="session-info">
									<span class="session-client">{session.client?.name || 'Unknown Client'}</span>
									<span class="session-type">{session.session_type?.replace('_', ' ')}</span>
								</div>
								<div class="session-meta">
									{#if session.client?.enneagram_type}
										<span class="type-badge" title="Enneagram Type {session.client.enneagram_type}">
											Type {session.client.enneagram_type}
										</span>
									{/if}
									{#if session.client?.trust_layer}
										<span
											class="trust-badge trust-{session.client.trust_layer}"
											title="Trust layer: {session.client.trust_layer}"
										>
											{session.client.trust_layer}
										</span>
									{/if}
								</div>
								<a
									href={session.client?.id
										? `/admin/consulting/clients/${session.client.id}#notes`
										: '#'}
									class="btn btn-sm btn-secondary"
									aria-label="View notes for {session.client?.name || 'client'}"
									aria-disabled={!session.client?.id}
								>
									<svg
										aria-hidden="true"
										width="14"
										height="14"
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
									Notes
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<!-- Recent Waitlist -->
			<section
				id="waitlist-section"
				class="section-card waitlist-section"
				aria-labelledby="waitlist-heading"
			>
				<div class="section-header">
					<h2 id="waitlist-heading">
						<svg
							aria-hidden="true"
							width="18"
							height="18"
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
						Waitlist
					</h2>
					<span class="count-badge" aria-label="{data.stats.waitlistCount} people on waitlist">
						{data.stats.waitlistCount}
					</span>
				</div>

				<!-- Search and Filter Bar -->
				<div class="waitlist-toolbar" role="search">
					<div class="search-input-wrapper">
						<svg
							aria-hidden="true"
							class="search-icon"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
						</svg>
						<input
							type="search"
							bind:value={waitlistSearch}
							placeholder="Search by name, email, or goal..."
							aria-label="Search waitlist"
							class="search-input"
						/>
						{#if waitlistSearch}
							<button
								type="button"
								class="clear-search"
								on:click={() => (waitlistSearch = '')}
								aria-label="Clear search"
							>
								<svg
									aria-hidden="true"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						{/if}
					</div>
					<label class="filter-checkbox">
						<input type="checkbox" bind:checked={showConvertedOnly} />
						<span>Show converted only</span>
					</label>
				</div>

				{#if data.recentWaitlist.length === 0}
					<div class="empty-state" role="status">
						<div class="empty-icon" aria-hidden="true">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						</div>
						<p>No waitlist signups yet</p>
						<p class="empty-hint">People who sign up for coaching will appear here</p>
					</div>
				{:else if filteredWaitlist.length === 0}
					<div class="empty-state" role="status">
						<p>No results match your search</p>
						<button
							type="button"
							class="btn btn-secondary btn-sm"
							on:click={() => {
								waitlistSearch = '';
								showConvertedOnly = false;
							}}
						>
							Clear filters
						</button>
					</div>
				{:else}
					<div
						class="waitlist-table-wrapper"
						role="region"
						aria-label="Waitlist entries"
						tabindex="0"
					>
						<table class="waitlist-table" aria-describedby="waitlist-heading">
							<thead>
								<tr>
									<th scope="col">Person</th>
									<th scope="col">Contact</th>
									<th scope="col">Goal</th>
									<th scope="col">Signed Up</th>
									<th scope="col">
										<span class="visually-hidden">Actions</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredWaitlist as entry (entry.id)}
									<tr
										class:converted={entry.isConverted}
										tabindex="0"
										on:keydown={(e) => handleRowKeydown(e, entry)}
									>
										<td class="name-cell">
											<div class="person-info">
												<span class="person-name">{entry.name}</span>
												<div class="person-badges">
													{#if entry.enneagram_type}
														<span
															class="type-badge small"
															title="Enneagram Type {entry.enneagram_type}"
														>
															Type {entry.enneagram_type}
														</span>
													{/if}
													{#if entry.isConverted}
														<span class="converted-badge">
															<svg
																aria-hidden="true"
																width="10"
																height="10"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																stroke-width="3"
															>
																<polyline points="20 6 9 17 4 12" />
															</svg>
															Client
														</span>
													{/if}
												</div>
											</div>
										</td>
										<td class="email-cell">
											<a
												href="mailto:{entry.email}"
												class="email-link"
												title="Send email to {entry.email}"
											>
												{entry.email}
											</a>
										</td>
										<td class="goal-cell">
											{#if entry.session_goal}
												<span class="goal-text" title={entry.session_goal}>
													{entry.session_goal.slice(0, 80)}{entry.session_goal.length > 80
														? '...'
														: ''}
												</span>
											{:else}
												<span class="no-goal">No goal provided</span>
											{/if}
										</td>
										<td class="date-cell">
											<time datetime={entry.created_at}>
												{formatDate(entry.created_at)}
											</time>
										</td>
										<td class="action-cell">
											<div class="action-buttons">
												<button
													type="button"
													class="btn btn-sm btn-icon btn-email"
													on:click={() => openEmailForWaitlist(entry)}
													title="Send email to {entry.name}"
													aria-label="Send email to {entry.name}"
												>
													<svg
														aria-hidden="true"
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
													>
														<path
															d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
														/>
														<polyline points="22,6 12,13 2,6" />
													</svg>
												</button>
												{#if entry.isConverted && entry.clientId}
													<a
														href="/admin/consulting/clients/{entry.clientId}"
														class="btn btn-sm btn-secondary"
														aria-label="View {entry.name}'s client profile"
													>
														View Client
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
																	notifications.success(`${entry.name} is now a client!`, 3000);
																	invalidateAll();
																} else if (result.type === 'failure') {
																	notifications.danger(
																		result.data?.error || 'Failed to convert to client',
																		3000
																	);
																}
															};
														}}
													>
														<input type="hidden" name="waitlistId" value={entry.id} />
														<button
															type="submit"
															class="btn btn-sm btn-primary btn-convert"
															disabled={promotingId === entry.id}
															aria-label="Convert {entry.name} to client"
														>
															{#if promotingId === entry.id}
																<span class="loading-spinner" aria-hidden="true"></span>
																Converting...
															{:else}
																<svg
																	aria-hidden="true"
																	width="14"
																	height="14"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	stroke-width="2"
																>
																	<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
																	<circle cx="8.5" cy="7" r="4" />
																	<line x1="20" y1="8" x2="20" y2="14" />
																	<line x1="23" y1="11" x2="17" y2="11" />
																</svg>
																Convert
															{/if}
														</button>
													</form>
												{/if}
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					{#if filteredWaitlist.length !== data.recentWaitlist.length}
						<p class="filter-status" role="status">
							Showing {filteredWaitlist.length} of {data.recentWaitlist.length} entries
						</p>
					{/if}
				{/if}
			</section>
		</div>

		<!-- Right Column / Sidebar -->
		<aside class="side-column" aria-label="Tools and resources">
			<!-- Type Distribution -->
			<section class="section-card compact" aria-labelledby="types-heading">
				<div class="section-header">
					<h2 id="types-heading">Client Types</h2>
				</div>
				<div class="type-grid" role="list" aria-label="Enneagram type distribution">
					{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
						<a
							href="/admin/consulting/clients?type={type}"
							class="type-cell"
							class:has-clients={data.typeDistribution[type] > 0}
							role="listitem"
							title="View Type {type} clients ({data.typeDistribution[type] || 0} total)"
						>
							<span class="type-num">{type}</span>
							<span class="type-count">{data.typeDistribution[type] || 0}</span>
						</a>
					{/each}
				</div>
			</section>

			<!-- Quick Access Resources -->
			<section class="section-card compact" aria-labelledby="resources-heading">
				<div class="section-header">
					<h2 id="resources-heading">Quick Access</h2>
				</div>
				<nav class="quick-links" aria-label="Quick access resources">
					{#each quickLinks as link}
						<a href="/admin/consulting/resources/{link.slug}" class="quick-link">
							<span class="quick-link-icon" aria-hidden="true">
								{#if link.icon === 'phone'}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
										/>
									</svg>
								{:else if link.icon === 'clipboard'}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
										/>
										<rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
									</svg>
								{:else}
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<circle cx="12" cy="12" r="10" />
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
										<line x1="12" y1="17" x2="12.01" y2="17" />
									</svg>
								{/if}
							</span>
							<span class="quick-link-content">
								<span class="quick-link-title">{link.title}</span>
								<span class="quick-link-desc">{link.description}</span>
							</span>
							<svg
								class="quick-link-arrow"
								aria-hidden="true"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M9 18l6-6-6-6" />
							</svg>
						</a>
					{/each}
				</nav>
				<a href="/admin/consulting/resources" class="view-all-btn"> View All Resources </a>
			</section>

			<!-- Session Prep Checklist -->
			<section class="section-card compact" aria-labelledby="prep-heading">
				<button
					type="button"
					class="section-header collapsible"
					on:click={() => (checklistExpanded = !checklistExpanded)}
					aria-expanded={checklistExpanded}
					aria-controls="prep-content"
				>
					<h2 id="prep-heading">Session Prep</h2>
					<svg
						class="collapse-icon"
						class:expanded={checklistExpanded}
						aria-hidden="true"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</button>
				{#if checklistExpanded}
					<div
						id="prep-content"
						class="checklist"
						role="group"
						aria-label="Session preparation checklist"
					>
						<label class="checklist-item">
							<input type="checkbox" />
							<span class="checkbox-custom" aria-hidden="true"></span>
							<span class="checklist-text">Review client intake forms</span>
						</label>
						<label class="checklist-item">
							<input type="checkbox" />
							<span class="checkbox-custom" aria-hidden="true"></span>
							<span class="checklist-text">Prepare type-specific questions</span>
						</label>
						<label class="checklist-item">
							<input type="checkbox" />
							<span class="checkbox-custom" aria-hidden="true"></span>
							<span class="checklist-text">Set up meeting links</span>
						</label>
						<label class="checklist-item">
							<input type="checkbox" />
							<span class="checkbox-custom" aria-hidden="true"></span>
							<span class="checklist-text">Clear mental space (5 min meditation)</span>
						</label>
					</div>
				{/if}
			</section>

			<!-- Key Frameworks Reference -->
			<section class="section-card compact frameworks" aria-labelledby="frameworks-heading">
				<button
					type="button"
					class="section-header collapsible"
					on:click={() => (frameworksExpanded = !frameworksExpanded)}
					aria-expanded={frameworksExpanded}
					aria-controls="frameworks-content"
				>
					<h2 id="frameworks-heading">Key Frameworks</h2>
					<svg
						class="collapse-icon"
						class:expanded={frameworksExpanded}
						aria-hidden="true"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</button>
				{#if frameworksExpanded}
					<div id="frameworks-content" class="framework-list">
						<div class="framework-item">
							<h3>Trust Onion</h3>
							<div class="framework-levels">
								<span class="level outer">
									<span class="level-indicator" aria-hidden="true"></span>
									Outer: Blame circumstances
								</span>
								<span class="level middle">
									<span class="level-indicator" aria-hidden="true"></span>
									Middle: Blame people
								</span>
								<span class="level inner">
									<span class="level-indicator" aria-hidden="true"></span>
									Inner: Self-responsibility
								</span>
							</div>
						</div>
						<div class="framework-item">
							<h3>EEO Voice</h3>
							<div class="framework-levels">
								<span class="level">
									<strong>O</strong>bservation: "Studies show..."
								</span>
								<span class="level">
									<strong>E</strong>xperience: "In my work..."
								</span>
								<span class="level">
									<strong>E</strong>xpert: "What's happening is..."
								</span>
							</div>
						</div>
						<div class="framework-item">
							<h3>90-Second Rule</h3>
							<p class="framework-note">
								Emotions last 90 seconds. After that, we choose to refresh them.
							</p>
						</div>
					</div>
				{/if}
			</section>
		</aside>
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
	/* ==========================================
	   BASE STYLES & VARIABLES
	   ========================================== */
	.consulting-dashboard {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 0.5rem;
	}

	/* Skip link for accessibility */
	.skip-link {
		position: absolute;
		top: -100px;
		left: 0;
		background: var(--primary, #6366f1);
		color: white;
		padding: 0.75rem 1rem;
		z-index: 1000;
		border-radius: 0 0 var(--border-radius, 8px) 0;
		text-decoration: none;
		font-weight: 500;
	}

	.skip-link:focus {
		top: 0;
	}

	.visually-hidden {
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

	/* ==========================================
	   PAGE HEADER
	   ========================================== */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.header-content h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		color: var(--text-primary, #1e293b);
	}

	.subtitle {
		color: var(--text-secondary, #64748b);
		margin: 0;
		font-size: 0.875rem;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	/* ==========================================
	   STATS SECTION
	   ========================================== */
	.stats-section {
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.stat-card {
		background: var(--card-background, white);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		padding: 1rem 1.25rem;
		display: flex;
		align-items: center;
		gap: 0.875rem;
		position: relative;
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.stat-card:hover {
		border-color: var(--primary, #6366f1);
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
	}

	.stat-card.highlight {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08));
		border-color: rgba(99, 102, 241, 0.25);
	}

	.stat-icon {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		background: var(--hover-background, #f8fafc);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary, #6366f1);
		flex-shrink: 0;
	}

	.stat-icon.clients {
		color: #6366f1;
	}
	.stat-icon.active {
		color: #10b981;
		background: rgba(16, 185, 129, 0.1);
	}
	.stat-icon.pending {
		color: #f59e0b;
		background: rgba(245, 158, 11, 0.1);
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.stat-num {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary, #1e293b);
		line-height: 1;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		margin-top: 0.125rem;
	}

	.stat-link {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		color: var(--primary, #6366f1);
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.stat-link:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.stat-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--hover-background, #f1f5f9);
		border-radius: 0 0 12px 12px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #10b981, #34d399);
		transition: width 0.3s ease;
	}

	.stat-badge {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		font-size: 0.625rem;
		padding: 0.125rem 0.375rem;
		background: rgba(245, 158, 11, 0.15);
		color: #d97706;
		border-radius: 4px;
		font-weight: 500;
	}

	/* ==========================================
	   CONTENT GRID
	   ========================================== */
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 1.5rem;
	}

	.main-column {
		min-width: 0;
	}

	/* ==========================================
	   SECTION CARDS
	   ========================================== */
	.section-card {
		background: var(--card-background, white);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		padding: 1.25rem;
		margin-bottom: 1rem;
	}

	.section-card.compact {
		padding: 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		gap: 0.5rem;
	}

	.section-header h2 {
		font-size: 0.9375rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary, #1e293b);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.section-header h2 svg {
		color: var(--text-secondary, #64748b);
	}

	.section-header.collapsible {
		cursor: pointer;
		padding: 0;
		background: none;
		border: none;
		width: 100%;
		text-align: left;
		margin-bottom: 0;
	}

	.section-header.collapsible:hover h2 {
		color: var(--primary, #6366f1);
	}

	.section-header.collapsible + * {
		margin-top: 1rem;
	}

	.collapse-icon {
		transition: transform 0.2s ease;
		color: var(--text-secondary, #64748b);
	}

	.collapse-icon.expanded {
		transform: rotate(180deg);
	}

	.view-all-link {
		font-size: 0.75rem;
		color: var(--primary, #6366f1);
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		transition: gap 0.2s ease;
	}

	.view-all-link:hover {
		text-decoration: underline;
		gap: 0.5rem;
	}

	.count-badge {
		background: var(--primary, #6366f1);
		color: white;
		font-size: 0.6875rem;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-weight: 600;
	}

	/* ==========================================
	   PIPELINE
	   ========================================== */
	.pipeline {
		display: flex;
		gap: 0.5rem;
	}

	.pipeline-stage {
		flex: 1;
		text-align: center;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.pipeline-stage:hover {
		transform: translateY(-2px);
	}

	.pipeline-stage:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: 2px;
		border-radius: 6px;
	}

	.stage-bar {
		background: var(--stage-color);
		color: white;
		padding: 0.625rem 0.5rem;
		border-radius: 8px;
		margin-bottom: 0.375rem;
		transition: box-shadow 0.2s ease;
	}

	.pipeline-stage:hover .stage-bar {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.stage-count {
		font-weight: 700;
		font-size: 1.25rem;
	}

	.stage-label {
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
		font-weight: 500;
	}

	/* ==========================================
	   SESSION LIST
	   ========================================== */
	.session-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.session-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: var(--hover-background, #f8fafc);
		border-radius: 10px;
		transition: background-color 0.2s ease;
	}

	.session-item:hover {
		background: rgba(99, 102, 241, 0.08);
	}

	.session-time {
		min-width: 90px;
		text-align: center;
	}

	.session-when {
		display: block;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--primary, #6366f1);
	}

	.session-hour {
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
	}

	.session-info {
		flex: 1;
		min-width: 0;
	}

	.session-client {
		display: block;
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--text-primary, #1e293b);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.session-type {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		text-transform: capitalize;
	}

	.session-meta {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	/* ==========================================
	   BADGES
	   ========================================== */
	.type-badge {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		font-size: 0.6875rem;
		padding: 0.1875rem 0.5rem;
		border-radius: 6px;
		font-weight: 500;
	}

	.type-badge.small {
		font-size: 0.625rem;
		padding: 0.125rem 0.375rem;
	}

	.trust-badge {
		font-size: 0.6875rem;
		padding: 0.1875rem 0.5rem;
		border-radius: 6px;
		font-weight: 500;
		text-transform: capitalize;
	}

	.trust-outer {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}
	.trust-middle {
		background: rgba(245, 158, 11, 0.1);
		color: #d97706;
	}
	.trust-inner {
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
	}

	.converted-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
		font-size: 0.625rem;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-weight: 500;
	}

	/* ==========================================
	   WAITLIST SECTION
	   ========================================== */
	.waitlist-section {
		scroll-margin-top: 1rem;
	}

	.waitlist-toolbar {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.search-input-wrapper {
		flex: 1;
		min-width: 200px;
		position: relative;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary, #64748b);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 2rem 0.5rem 2.25rem;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 8px;
		font-size: 0.8125rem;
		background: var(--card-background, white);
		color: var(--text-primary, #1e293b);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary, #6366f1);
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.search-input::placeholder {
		color: var(--text-secondary, #94a3b8);
	}

	.clear-search {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.25rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-secondary, #64748b);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.clear-search:hover {
		color: var(--text-primary, #1e293b);
		background: var(--hover-background, #f1f5f9);
	}

	.filter-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--text-secondary, #64748b);
		cursor: pointer;
		white-space: nowrap;
	}

	.filter-checkbox input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: var(--primary, #6366f1);
	}

	.waitlist-table-wrapper {
		overflow-x: auto;
		border-radius: 8px;
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.waitlist-table-wrapper:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: -2px;
	}

	.waitlist-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}

	.waitlist-table th {
		text-align: left;
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: var(--text-secondary, #64748b);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		background: var(--hover-background, #f8fafc);
		border-bottom: 1px solid var(--border-color, #e2e8f0);
	}

	.waitlist-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		vertical-align: middle;
	}

	.waitlist-table tbody tr {
		transition: background-color 0.15s ease;
	}

	.waitlist-table tbody tr:hover {
		background: rgba(99, 102, 241, 0.04);
	}

	.waitlist-table tbody tr:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: -2px;
	}

	.waitlist-table tbody tr:last-child td {
		border-bottom: none;
	}

	tr.converted {
		opacity: 0.7;
	}

	tr.converted:hover {
		opacity: 1;
	}

	.person-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.person-name {
		font-weight: 500;
		color: var(--text-primary, #1e293b);
	}

	.person-badges {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.email-link {
		color: var(--primary, #6366f1);
		text-decoration: none;
	}

	.email-link:hover {
		text-decoration: underline;
	}

	.goal-text {
		color: var(--text-secondary, #64748b);
		font-size: 0.8125rem;
		line-height: 1.4;
	}

	.no-goal {
		color: var(--text-secondary, #94a3b8);
		font-style: italic;
		font-size: 0.75rem;
	}

	.date-cell time {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		white-space: nowrap;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.action-buttons form {
		display: inline;
	}

	.filter-status {
		margin: 0.75rem 0 0;
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		text-align: center;
	}

	/* ==========================================
	   EMPTY STATES
	   ========================================== */
	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
		color: var(--text-secondary, #64748b);
	}

	.empty-icon {
		margin-bottom: 1rem;
		color: var(--text-secondary, #94a3b8);
	}

	.empty-state p {
		margin: 0 0 0.5rem;
	}

	.empty-hint {
		font-size: 0.8125rem;
		color: var(--text-secondary, #94a3b8);
		margin-bottom: 1rem;
	}

	/* ==========================================
	   TYPE DISTRIBUTION GRID
	   ========================================== */
	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	.type-cell {
		background: var(--hover-background, #f8fafc);
		border-radius: 8px;
		padding: 0.625rem;
		text-align: center;
		opacity: 0.5;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid transparent;
	}

	.type-cell.has-clients {
		opacity: 1;
		background: rgba(99, 102, 241, 0.08);
	}

	.type-cell:hover {
		opacity: 1;
		border-color: var(--primary, #6366f1);
		transform: scale(1.05);
	}

	.type-cell:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: 2px;
	}

	.type-num {
		display: block;
		font-size: 1rem;
		font-weight: 700;
		color: var(--primary, #6366f1);
	}

	.type-count {
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
	}

	/* ==========================================
	   QUICK LINKS
	   ========================================== */
	.quick-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.quick-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--hover-background, #f8fafc);
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.quick-link:hover {
		background: rgba(99, 102, 241, 0.08);
		border-color: rgba(99, 102, 241, 0.2);
	}

	.quick-link:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: 2px;
	}

	.quick-link-icon {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary, #6366f1);
		flex-shrink: 0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.quick-link-content {
		flex: 1;
		min-width: 0;
	}

	.quick-link-title {
		display: block;
		font-weight: 500;
		font-size: 0.8125rem;
		color: var(--text-primary, #1e293b);
	}

	.quick-link-desc {
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
		line-height: 1.3;
	}

	.quick-link-arrow {
		color: var(--text-secondary, #94a3b8);
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.quick-link:hover .quick-link-arrow {
		transform: translateX(2px);
		color: var(--primary, #6366f1);
	}

	.view-all-btn {
		display: block;
		text-align: center;
		margin-top: 0.75rem;
		padding: 0.625rem;
		background: var(--primary, #6366f1);
		color: white;
		border-radius: 8px;
		text-decoration: none;
		font-size: 0.8125rem;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.view-all-btn:hover {
		background: #5855eb;
	}

	.view-all-btn:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: 2px;
	}

	/* ==========================================
	   CHECKLIST
	   ========================================== */
	.checklist {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.checklist-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.8125rem;
		cursor: pointer;
		padding: 0.375rem 0;
		transition: color 0.2s ease;
	}

	.checklist-item:hover {
		color: var(--text-primary, #1e293b);
	}

	.checklist-item input[type='checkbox'] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.checkbox-custom {
		width: 18px;
		height: 18px;
		border: 2px solid var(--border-color, #cbd5e1);
		border-radius: 4px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.checklist-item input:checked + .checkbox-custom {
		background: var(--primary, #6366f1);
		border-color: var(--primary, #6366f1);
	}

	.checklist-item input:checked + .checkbox-custom::after {
		content: '';
		width: 6px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
		margin-bottom: 2px;
	}

	.checklist-item input:focus + .checkbox-custom {
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
	}

	.checklist-text {
		color: var(--text-primary, #1e293b);
	}

	.checklist-item input:checked ~ .checklist-text {
		text-decoration: line-through;
		color: var(--text-secondary, #94a3b8);
	}

	/* ==========================================
	   FRAMEWORKS
	   ========================================== */
	.framework-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.framework-item h3 {
		font-size: 0.8125rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: var(--text-primary, #1e293b);
	}

	.framework-levels {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.framework-levels .level {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		padding-left: 0.875rem;
		position: relative;
		line-height: 1.4;
	}

	.level-indicator {
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--border-color, #e2e8f0);
	}

	.framework-levels .level.outer .level-indicator {
		background: #ef4444;
	}
	.framework-levels .level.middle .level-indicator {
		background: #f59e0b;
	}
	.framework-levels .level.inner .level-indicator {
		background: #10b981;
	}

	.framework-note {
		font-size: 0.75rem;
		color: var(--text-secondary, #64748b);
		margin: 0;
		font-style: italic;
		line-height: 1.5;
	}

	/* ==========================================
	   BUTTONS
	   ========================================== */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 8px;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.btn:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: 2px;
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		gap: 0.375rem;
	}

	.btn-icon {
		padding: 0.375rem;
	}

	.btn-primary {
		background: var(--primary, #6366f1);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #5855eb;
	}

	.btn-secondary {
		background: var(--hover-background, #f1f5f9);
		color: var(--text-primary, #1e293b);
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.btn-secondary:hover {
		background: var(--primary, #6366f1);
		color: white;
		border-color: var(--primary, #6366f1);
	}

	.btn-email {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
	}

	.btn-email:hover {
		background: #3b82f6;
		color: white;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Loading spinner */
	.loading-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ==========================================
	   RESPONSIVE DESIGN
	   ========================================== */
	@media (max-width: 1200px) {
		.content-grid {
			grid-template-columns: 1fr 300px;
		}
	}

	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.side-column {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}

		.side-column .section-card {
			margin-bottom: 0;
		}

		.side-column .section-card.frameworks {
			grid-column: span 2;
		}
	}

	@media (max-width: 768px) {
		.consulting-dashboard {
			padding: 0;
		}

		.page-header {
			flex-direction: column;
			align-items: stretch;
		}

		.header-actions {
			justify-content: stretch;
		}

		.header-actions .btn {
			flex: 1;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.stat-card {
			padding: 0.875rem;
		}

		.stat-num {
			font-size: 1.5rem;
		}

		.stat-link {
			display: none;
		}

		.side-column {
			grid-template-columns: 1fr;
		}

		.side-column .section-card.frameworks {
			grid-column: span 1;
		}

		.pipeline {
			flex-wrap: wrap;
		}

		.pipeline-stage {
			flex: 1 1 calc(33.333% - 0.5rem);
			min-width: 70px;
		}

		.waitlist-toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.search-input-wrapper {
			min-width: auto;
		}

		.waitlist-table th,
		.waitlist-table td {
			padding: 0.625rem 0.75rem;
		}

		.goal-cell {
			display: none;
		}

		.action-buttons {
			flex-direction: column;
			gap: 0.375rem;
		}
	}

	@media (max-width: 480px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.pipeline-stage {
			flex: 1 1 calc(50% - 0.25rem);
		}

		.stage-count {
			font-size: 1.125rem;
		}

		.session-item {
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.session-time {
			min-width: auto;
			text-align: left;
		}

		.session-meta {
			width: 100%;
			justify-content: flex-start;
		}

		.type-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.375rem;
		}
	}

	/* ==========================================
	   DARK MODE SUPPORT
	   ========================================== */
	:global(.dark) .stat-card,
	:global(.dark) .section-card {
		background: var(--card-background, #1e293b);
		border-color: var(--border-color, #334155);
	}

	:global(.dark) .stat-card.highlight {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
	}

	:global(.dark) .quick-link-icon {
		background: var(--hover-background, #334155);
	}

	:global(.dark) .waitlist-table th {
		background: var(--hover-background, #1e293b);
	}
</style>
