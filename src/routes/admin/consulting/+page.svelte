<!-- src/routes/admin/consulting/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailComposeModal from '$lib/components/email/EmailComposeModal.svelte';
	import type { EmailRecipient } from '$lib/types/email';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	type WaitlistEntry = PageData['recentWaitlist'][number];

	// Email modal state
	let showEmailModal = $state(false);
	let emailRecipients = $state<EmailRecipient[]>([]);
	let emailSubject = $state('');
	let emailContent = $state('');
	let showPersonModal = $state(false);
	let selectedPerson = $state<WaitlistEntry | null>(null);

	// Search/filter state
	let waitlistSearch = $state('');
	let showConvertedOnly = $state(false);

	// Collapsible section state
	let frameworksExpanded = $state(true);
	let checklistExpanded = $state(true);

	// Filtered waitlist entries
	let filteredWaitlist = $derived(
		data.recentWaitlist.filter((entry) => {
			const matchesSearch =
				!waitlistSearch ||
				entry.name?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
				entry.email?.toLowerCase().includes(waitlistSearch.toLowerCase()) ||
				entry.session_goal?.toLowerCase().includes(waitlistSearch.toLowerCase());

			const matchesFilter = !showConvertedOnly || entry.isConverted;

			return matchesSearch && matchesFilter;
		})
	);

	const intakeFieldLabels: Record<string, string> = {
		age_range: 'Age range',
		childhood_message: 'Childhood message',
		comfort_response: 'Comfort response',
		communication_style: 'Communication style',
		conflict_style: 'Conflict style',
		core_desire: 'Core desire',
		core_fear: 'Core fear',
		current_challenges: 'Current challenges',
		desired_outcome: 'Desired outcome',
		emotion_expression: 'Emotion expression',
		how_heard_about_us: 'How they heard about you',
		living_situation: 'Living situation',
		long_term_goals: 'Long-term goals',
		occupation: 'Occupation',
		preferred_session_time: 'Preferred session time',
		previous_attempts: 'Previous attempts',
		primary_emotion: 'Primary emotion',
		relationship_patterns: 'Relationship patterns',
		relationship_status: 'Relationship status',
		short_term_goals: 'Short-term goals',
		specific_scenarios: 'Specific scenarios',
		stress_response: 'Stress response',
		suspected_type: 'Suspected type',
		timezone: 'Timezone',
		urgency_level: 'Urgency level',
		why_this_type: 'Why this type'
	};

	const intakeFieldOrder = [
		'occupation',
		'age_range',
		'timezone',
		'preferred_session_time',
		'relationship_status',
		'living_situation',
		'suspected_type',
		'why_this_type',
		'core_fear',
		'core_desire',
		'primary_emotion',
		'stress_response',
		'comfort_response',
		'emotion_expression',
		'communication_style',
		'conflict_style',
		'relationship_patterns',
		'current_challenges',
		'specific_scenarios',
		'desired_outcome',
		'short_term_goals',
		'long_term_goals',
		'previous_attempts',
		'childhood_message',
		'how_heard_about_us',
		'urgency_level'
	] as const;

	function openEmailForWaitlist(entry: WaitlistEntry) {
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

	function openPersonDetails(entry: WaitlistEntry) {
		selectedPerson = entry;
		showPersonModal = true;
	}

	function closePersonDetails() {
		showPersonModal = false;
		selectedPerson = null;
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showPersonModal) {
			closePersonDetails();
		}
	}

	function emailSelectedPerson() {
		if (!selectedPerson) return;
		openEmailForWaitlist(selectedPerson);
		closePersonDetails();
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

	function formatShortDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatDateTime(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatRelativeDate(dateStr: string): string {
		const targetDate = new Date(dateStr);
		const today = new Date();
		const targetDay = new Date(
			targetDate.getFullYear(),
			targetDate.getMonth(),
			targetDate.getDate()
		).getTime();
		const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
		const diffDays = Math.round((targetDay - todayDay) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays === -1) return 'Yesterday';
		if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
		if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
		return formatDate(dateStr);
	}

	function formatCommentCount(count: number): string {
		return `${count} comment${count === 1 ? '' : 's'}`;
	}

	function humanizeValue(value: string | null | undefined): string {
		if (!value) return '-';
		return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
	}

	function getIntakeFields(entry: WaitlistEntry) {
		const intake = entry.person.client?.intake?.[0];
		if (!intake) return [];

		return intakeFieldOrder
			.map((field) => {
				const value = intake[field];
				if (value === null || value === undefined || value === '') {
					return null;
				}

				return {
					label: intakeFieldLabels[field],
					value: String(value)
				};
			})
			.filter((field): field is { label: string; value: string } => Boolean(field));
	}

	function getAcquisitionFields(entry: WaitlistEntry) {
		const metadata = entry.metadata?.[0];
		if (!metadata) return [];

		const fields = [
			{ label: 'Source', value: metadata.source },
			{ label: 'UTM medium', value: metadata.utm_medium },
			{ label: 'UTM campaign', value: metadata.utm_campaign },
			{ label: 'UTM content', value: metadata.utm_content },
			{ label: 'IP address', value: metadata.ip_address },
			{ label: 'User agent', value: metadata.user_agent }
		];

		return fields.filter((field): field is { label: string; value: string } =>
			Boolean(field.value)
		);
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
	let promotingId = $state<string | null>(null);

	// Calculate progress percentage
	let progressPercentage = $derived(
		data.stats.totalClients > 0
			? Math.round((data.stats.activeClients / data.stats.totalClients) * 100)
			: 0
	);
</script>

<svelte:head>
	<title>Consulting Dashboard | 9takes Admin</title>
</svelte:head>

<svelte:window onkeydown={handleWindowKeydown} />

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
									<span class="session-when">
										{session.scheduled_at ? formatRelativeDate(session.scheduled_at) : '-'}
									</span>
									<span class="session-hour">
										{session.scheduled_at
											? new Date(session.scheduled_at).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: '2-digit'
												})
											: '-'}
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
					<span class="count-badge" aria-label={`${data.stats.waitlistCount} people on waitlist`}>
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
								onclick={() => (waitlistSearch = '')}
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
							onclick={() => {
								waitlistSearch = '';
								showConvertedOnly = false;
							}}
						>
							Clear filters
						</button>
					</div>
				{:else}
					<div class="waitlist-table-wrapper" role="region" aria-label="Waitlist entries">
						<table class="waitlist-table" aria-describedby="waitlist-heading">
							<colgroup>
								<col class="col-person" />
								<col class="col-contact" />
								<col class="col-goal" />
								<col class="col-signed-up" />
								<col class="col-actions" />
							</colgroup>
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
									<tr class:converted={entry.isConverted}>
										<td class="name-cell" data-label="Person">
											<div class="person-info">
												<button
													type="button"
													class="person-name person-button"
													onclick={() => openPersonDetails(entry)}
												>
													{entry.name}
												</button>
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
												<p class="person-meta">
													{#if entry.person.commentSummary.hasCommented}
														{formatCommentCount(entry.person.commentSummary.totalComments)}
													{:else}
														No comments yet
													{/if}
													{#if entry.person.joinedAt}
														<span class="meta-separator" aria-hidden="true">•</span>
														Joined {formatShortDate(entry.person.joinedAt)}
													{/if}
												</p>
											</div>
										</td>
										<td class="email-cell" data-label="Contact">
											<a
												href="mailto:{entry.email}"
												class="email-link"
												title="Send email to {entry.email}"
											>
												{entry.email}
											</a>
										</td>
										<td class="goal-cell" data-label="Goal">
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
										<td class="date-cell" data-label="Signed up">
											<time datetime={entry.created_at}>
												{formatDate(entry.created_at)}
											</time>
											<span class="date-subtle">
												{entry.created_at ? formatRelativeDate(entry.created_at) : '-'}
											</span>
										</td>
										<td class="action-cell" data-label="Actions">
											<div class="action-buttons">
												<button
													type="button"
													class="btn btn-sm btn-secondary btn-action"
													onclick={() => openEmailForWaitlist(entry)}
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
													Email
												</button>
												{#if entry.isConverted && entry.clientId}
													<a
														href="/admin/consulting/clients/{entry.clientId}"
														class="btn btn-sm btn-secondary btn-action"
														aria-label="View {entry.name}'s client profile"
													>
														View Client
													</a>
												{:else}
													<form
														method="POST"
														action="?/promoteToClient"
														use:enhance={() => {
															promotingId = String(entry.id);
															return async ({ result }) => {
																promotingId = null;
																if (result.type === 'success') {
																	notifications.success(`${entry.name} is now a client!`, 3000);
																	invalidateAll();
																} else if (result.type === 'failure') {
																	const errorMessage =
																		(result.data as { error?: string } | undefined)?.error ||
																		'Failed to convert to client';
																	notifications.danger(errorMessage, 3000);
																}
															};
														}}
													>
														<input type="hidden" name="waitlistId" value={entry.id} />
														<button
															type="submit"
															class="btn btn-sm btn-primary btn-convert btn-action"
															disabled={promotingId === String(entry.id)}
															aria-label="Convert {entry.name} to client"
														>
															{#if promotingId === String(entry.id)}
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
					onclick={() => (checklistExpanded = !checklistExpanded)}
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
					onclick={() => (frameworksExpanded = !frameworksExpanded)}
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

{#if showPersonModal && selectedPerson}
	<div
		class="modal-overlay person-modal-overlay"
		role="presentation"
		tabindex="-1"
		onclick={(event) => {
			if (event.target === event.currentTarget) closePersonDetails();
		}}
		onkeydown={(event) => {
			if (event.key === 'Escape') {
				closePersonDetails();
			}
		}}
	>
		<div class="person-modal" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
			<div class="person-modal-header">
				<div>
					<p class="person-modal-kicker">9takes person record</p>
					<h2 id="person-modal-title">{selectedPerson.name}</h2>
					<p class="person-modal-email">{selectedPerson.email}</p>
				</div>
				<button
					type="button"
					class="close-btn"
					onclick={closePersonDetails}
					aria-label="Close details"
				>
					&times;
				</button>
			</div>

			<div class="person-modal-body">
				<div class="person-modal-chips">
					{#if selectedPerson.enneagram_type}
						<span class="type-badge">Type {selectedPerson.enneagram_type}</span>
					{/if}
					<span class="detail-chip">
						{selectedPerson.person.commentSummary.hasCommented
							? formatCommentCount(selectedPerson.person.commentSummary.totalComments)
							: 'No comments'}
					</span>
					<span class="detail-chip">
						{selectedPerson.person.joinedAt
							? `Joined ${formatShortDate(selectedPerson.person.joinedAt)}`
							: 'No 9takes account match'}
					</span>
					{#if selectedPerson.isConverted}
						<span class="converted-badge">Client</span>
					{/if}
				</div>

				<div class="person-detail-grid">
					<section class="detail-card">
						<h3>9takes Activity</h3>
						{#if selectedPerson.person.profile || selectedPerson.person.signup}
							<dl class="detail-list">
								<div>
									<dt>First 9takes touchpoint</dt>
									<dd>
										{selectedPerson.person.joinedAt
											? formatDateTime(selectedPerson.person.joinedAt)
											: 'No match found'}
									</dd>
								</div>
								{#if selectedPerson.person.profile}
									<div>
										<dt>Account created</dt>
										<dd>{formatDateTime(selectedPerson.person.profile.created_at)}</dd>
									</div>
									<div>
										<dt>Username</dt>
										<dd>{selectedPerson.person.profile.username || 'Not set'}</dd>
									</div>
									<div>
										<dt>Profile Enneagram</dt>
										<dd>{selectedPerson.person.profile.enneagram || 'Unknown'}</dd>
									</div>
								{/if}
								{#if selectedPerson.person.signup}
									<div>
										<dt>Email signup</dt>
										<dd>{formatDateTime(selectedPerson.person.signup.created_at)}</dd>
									</div>
								{/if}
								<div>
									<dt>Commented on 9takes</dt>
									<dd>
										{#if selectedPerson.person.profile}
											{selectedPerson.person.commentSummary.hasCommented
												? `Yes • ${formatCommentCount(selectedPerson.person.commentSummary.totalComments)}`
												: 'No'}
										{:else}
											No profile match
										{/if}
									</dd>
								</div>
								{#if selectedPerson.person.commentSummary.hasCommented}
									<div>
										<dt>First comment</dt>
										<dd>{formatDateTime(selectedPerson.person.commentSummary.firstCommentAt)}</dd>
									</div>
									<div>
										<dt>Latest comment</dt>
										<dd>{formatDateTime(selectedPerson.person.commentSummary.lastCommentAt)}</dd>
									</div>
								{/if}
							</dl>
						{:else}
							<p class="detail-empty">No 9takes profile or email signup matched this address.</p>
						{/if}
					</section>

					<section class="detail-card">
						<h3>Consulting Signup</h3>
						<dl class="detail-list">
							<div>
								<dt>Waitlist joined</dt>
								<dd>{formatDateTime(selectedPerson.created_at)}</dd>
							</div>
							<div>
								<dt>Claimed type</dt>
								<dd>
									{selectedPerson.enneagram_type
										? `Type ${selectedPerson.enneagram_type}`
										: 'Not provided'}
								</dd>
							</div>
							<div>
								<dt>Converted to client</dt>
								<dd>{selectedPerson.isConverted ? 'Yes' : 'No'}</dd>
							</div>
							{#if selectedPerson.person.client}
								<div>
									<dt>Client created</dt>
									<dd>{formatDateTime(selectedPerson.person.client.created_at)}</dd>
								</div>
								<div>
									<dt>Client status</dt>
									<dd>{humanizeValue(selectedPerson.person.client.status)}</dd>
								</div>
								<div>
									<dt>Trust layer</dt>
									<dd>{humanizeValue(selectedPerson.person.client.trust_layer)}</dd>
								</div>
								{#if selectedPerson.person.client.phone}
									<div>
										<dt>Phone</dt>
										<dd>{selectedPerson.person.client.phone}</dd>
									</div>
								{/if}
								{#if selectedPerson.person.client.first_session_at}
									<div>
										<dt>First session</dt>
										<dd>{formatDateTime(selectedPerson.person.client.first_session_at)}</dd>
									</div>
								{/if}
								{#if selectedPerson.person.client.last_session_at}
									<div>
										<dt>Last session</dt>
										<dd>{formatDateTime(selectedPerson.person.client.last_session_at)}</dd>
									</div>
								{/if}
							{/if}
							<div class="detail-list-full">
								<dt>Session goal</dt>
								<dd class="detail-text">{selectedPerson.session_goal || 'Not provided'}</dd>
							</div>
							{#if selectedPerson.person.client?.initial_goal}
								<div class="detail-list-full">
									<dt>Client initial goal</dt>
									<dd class="detail-text">{selectedPerson.person.client.initial_goal}</dd>
								</div>
							{/if}
							{#if selectedPerson.person.client?.notes}
								<div class="detail-list-full">
									<dt>Client notes</dt>
									<dd class="detail-text">{selectedPerson.person.client.notes}</dd>
								</div>
							{/if}
						</dl>
					</section>

					<section class="detail-card detail-card-wide">
						{#if selectedPerson.person.client?.intake?.[0]}
							{@const intake = selectedPerson.person.client?.intake?.[0]}
							<div class="detail-card-header">
								<h3>Intake Form</h3>
								<span class="detail-chip">
									{humanizeValue(intake.status)}
								</span>
							</div>

							<dl class="detail-list detail-list-columns">
								<div>
									<dt>Sent</dt>
									<dd>{formatDateTime(intake.sent_at)}</dd>
								</div>
								<div>
									<dt>Completed</dt>
									<dd>{formatDateTime(intake.completed_at)}</dd>
								</div>
								<div>
									<dt>Reviewed</dt>
									<dd>{formatDateTime(intake.reviewed_at)}</dd>
								</div>
								{#each getIntakeFields(selectedPerson) as field}
									<div class:detail-list-full={field.value.length > 80}>
										<dt>{field.label}</dt>
										<dd class:detail-text={field.value.length > 80}>{field.value}</dd>
									</div>
								{/each}
							</dl>
						{:else}
							<div class="detail-card-header">
								<h3>Intake Form</h3>
							</div>
							<p class="detail-empty">No intake answers submitted yet.</p>
						{/if}
					</section>

					{#if getAcquisitionFields(selectedPerson).length > 0}
						<section class="detail-card detail-card-wide">
							<h3>Acquisition Metadata</h3>
							<dl class="detail-list detail-list-columns">
								{#each getAcquisitionFields(selectedPerson) as field}
									<div class:detail-list-full={field.value.length > 80}>
										<dt>{field.label}</dt>
										<dd class:detail-text={field.value.length > 80}>{field.value}</dd>
									</div>
								{/each}
							</dl>
						</section>
					{/if}
				</div>
			</div>

			<div class="person-modal-footer">
				{#if selectedPerson.isConverted && selectedPerson.clientId}
					<a href="/admin/consulting/clients/{selectedPerson.clientId}" class="btn btn-secondary">
						Open Client Page
					</a>
				{/if}
				<button type="button" class="btn btn-secondary" onclick={emailSelectedPerson}>
					Email Person
				</button>
				<button type="button" class="btn btn-primary" onclick={closePersonDetails}>Close</button>
			</div>
		</div>
	</div>
{/if}

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
		color: var(--text-secondary, var(--text-tertiary));
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
		border: 1px solid var(--border-color);
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
		background: var(--hover-background, var(--text-primary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		background: var(--hover-background, var(--text-primary));
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
		border: 1px solid var(--border-color);
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
		color: var(--text-secondary, var(--text-tertiary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		background: var(--hover-background, var(--text-primary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		color: var(--text-secondary, var(--text-tertiary));
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 2rem 0.5rem 2.25rem;
		border: 1px solid var(--border-color);
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
		color: var(--text-secondary, var(--text-secondary));
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
		color: var(--text-secondary, var(--text-tertiary));
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.clear-search:hover {
		color: var(--text-primary, #1e293b);
		background: var(--hover-background, var(--text-primary));
	}

	.filter-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8125rem;
		color: var(--text-secondary, var(--text-tertiary));
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
		border: 1px solid var(--border-color);
	}

	.waitlist-table-wrapper:focus {
		outline: 2px solid var(--primary, #6366f1);
		outline-offset: -2px;
	}

	.waitlist-table {
		width: 100%;
		min-width: 1080px;
		border-collapse: collapse;
		font-size: 0.8125rem;
		table-layout: fixed;
	}

	.col-person {
		width: 24%;
	}

	.col-contact {
		width: 20%;
	}

	.col-goal {
		width: 24%;
	}

	.col-signed-up {
		width: 14%;
	}

	.col-actions {
		width: 18%;
	}

	.waitlist-table th {
		text-align: left;
		padding: 0.75rem 1rem;
		font-weight: 600;
		color: var(--text-secondary, var(--text-tertiary));
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		background: var(--hover-background, var(--text-primary));
		border-bottom: 1px solid var(--border-color);
	}

	.waitlist-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color);
		vertical-align: middle;
	}

	.waitlist-table tbody tr {
		transition: background-color 0.15s ease;
	}

	.waitlist-table tbody tr:hover {
		background: rgba(99, 102, 241, 0.04);
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

	.person-button {
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
		font: inherit;
		color: var(--text-primary, #1e293b);
		transition: color 0.2s ease;
	}

	.person-button:hover {
		color: var(--primary, #6366f1);
	}

	.person-button:focus {
		outline: 2px solid rgba(99, 102, 241, 0.25);
		outline-offset: 4px;
		border-radius: 4px;
	}

	.person-badges {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.person-meta {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-secondary, var(--text-tertiary));
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-separator {
		color: var(--border-color);
	}

	.email-link {
		color: var(--primary, #6366f1);
		text-decoration: none;
		word-break: break-word;
	}

	.email-link:hover {
		text-decoration: underline;
	}

	.goal-text {
		color: var(--text-secondary, var(--text-tertiary));
		font-size: 0.8125rem;
		line-height: 1.4;
		line-clamp: 3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.no-goal {
		color: var(--text-secondary, var(--text-secondary));
		font-style: italic;
		font-size: 0.75rem;
	}

	.date-cell time {
		display: block;
		font-size: 0.75rem;
		color: var(--text-secondary, var(--text-tertiary));
		white-space: nowrap;
	}

	.date-subtle {
		display: block;
		margin-top: 0.125rem;
		font-size: 0.6875rem;
		color: var(--text-secondary, var(--text-tertiary));
	}

	.action-cell {
		text-align: right;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
	}

	.action-buttons form {
		display: flex;
	}

	.filter-status {
		margin: 0.75rem 0 0;
		font-size: 0.75rem;
		color: var(--text-secondary, var(--text-tertiary));
		text-align: center;
	}

	/* ==========================================
	   EMPTY STATES
	   ========================================== */
	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
		color: var(--text-secondary, var(--text-tertiary));
	}

	.empty-icon {
		margin-bottom: 1rem;
		color: var(--text-secondary, var(--text-secondary));
	}

	.empty-state p {
		margin: 0 0 0.5rem;
	}

	.empty-hint {
		font-size: 0.8125rem;
		color: var(--text-secondary, var(--text-secondary));
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
		background: var(--hover-background, var(--text-primary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		background: var(--hover-background, var(--text-primary));
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
		color: var(--text-secondary, var(--text-tertiary));
		line-height: 1.3;
	}

	.quick-link-arrow {
		color: var(--text-secondary, var(--text-secondary));
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
		border: 2px solid var(--border-color, var(--neutral-700));
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
		color: var(--text-secondary, var(--text-secondary));
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
		color: var(--text-secondary, var(--text-tertiary));
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
		background: var(--border-color);
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
		color: var(--text-secondary, var(--text-tertiary));
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

	.btn-action {
		min-width: 5.5rem;
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
		background: var(--hover-background, var(--text-primary));
		color: var(--text-primary, #1e293b);
		border: 1px solid var(--border-color);
	}

	.btn-secondary:hover {
		background: var(--primary, #6366f1);
		color: white;
		border-color: var(--primary, #6366f1);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* ==========================================
	   PERSON DETAILS MODAL
	   ========================================== */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.65);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		z-index: 1200;
	}

	.person-modal {
		width: min(1080px, 100%);
		max-height: calc(100vh - 3rem);
		display: flex;
		flex-direction: column;
		background: var(--card-background, white);
		border: 1px solid var(--border-color);
		border-radius: 18px;
		box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
		overflow: hidden;
	}

	.person-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem 1.5rem 1.25rem;
		border-bottom: 1px solid var(--border-color);
	}

	.person-modal-header h2 {
		margin: 0;
		font-size: 1.375rem;
		color: var(--text-primary, #1e293b);
	}

	.person-modal-kicker {
		margin: 0 0 0.375rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--primary, #6366f1);
	}

	.person-modal-email {
		margin: 0.375rem 0 0;
		font-size: 0.875rem;
		color: var(--text-secondary, var(--text-tertiary));
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-secondary, var(--text-tertiary));
		font-size: 1.75rem;
		line-height: 1;
		padding: 0;
		cursor: pointer;
	}

	.close-btn:hover {
		color: var(--text-primary, #1e293b);
	}

	.person-modal-body {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.person-modal-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.detail-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border-radius: 999px;
		background: var(--hover-background, var(--text-primary));
		color: var(--text-secondary, var(--text-tertiary));
		font-size: 0.75rem;
		font-weight: 500;
	}

	.person-detail-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.detail-card {
		border: 1px solid var(--border-color);
		border-radius: 14px;
		padding: 1rem;
		background: color-mix(
			in srgb,
			var(--card-background, white) 90%,
			var(--hover-background, #f8fafc)
		);
	}

	.detail-card-wide {
		grid-column: 1 / -1;
	}

	.detail-card h3 {
		margin: 0 0 0.875rem;
		font-size: 0.95rem;
		color: var(--text-primary, #1e293b);
	}

	.detail-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.875rem;
	}

	.detail-card-header h3 {
		margin-bottom: 0;
	}

	.detail-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.875rem 1rem;
		margin: 0;
	}

	.detail-list-columns {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.detail-list > div {
		min-width: 0;
	}

	.detail-list-full {
		grid-column: 1 / -1;
	}

	.detail-list dt {
		margin: 0 0 0.25rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-secondary, var(--text-tertiary));
	}

	.detail-list dd {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--text-primary, #1e293b);
		word-break: break-word;
	}

	.detail-text {
		white-space: pre-wrap;
	}

	.detail-empty {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, var(--text-tertiary));
	}

	.person-modal-footer {
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 1rem 1.5rem 1.5rem;
		border-top: 1px solid var(--border-color);
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

		.person-detail-grid {
			grid-template-columns: 1fr;
		}

		.detail-card-wide {
			grid-column: auto;
		}

		.detail-list-columns {
			grid-template-columns: repeat(2, minmax(0, 1fr));
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

		.waitlist-table {
			min-width: 0;
		}

		.waitlist-table colgroup {
			display: none;
		}

		.waitlist-table thead {
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

		.waitlist-table,
		.waitlist-table tbody,
		.waitlist-table tr {
			display: block;
		}

		.waitlist-table-wrapper {
			border: none;
			overflow: visible;
		}

		.waitlist-table tbody {
			display: grid;
			gap: 0.85rem;
		}

		.waitlist-table tbody tr {
			border: 1px solid var(--border-color);
			border-radius: 12px;
			background: color-mix(in srgb, var(--card-background) 84%, var(--background));
			padding: 0.9rem;
		}

		.waitlist-table td {
			display: grid;
			grid-template-columns: minmax(82px, 0.85fr) minmax(0, 1fr);
			gap: 0.75rem;
			padding: 0;
			border-bottom: none;
			align-items: start;
		}

		.waitlist-table td + td {
			margin-top: 0.7rem;
		}

		.waitlist-table td::before {
			content: attr(data-label);
			font-size: 0.66rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-secondary, var(--text-tertiary));
		}

		.person-modal {
			max-height: calc(100vh - 1.5rem);
			border-radius: 14px;
		}

		.person-modal-header,
		.person-modal-body,
		.person-modal-footer {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.detail-list,
		.detail-list-columns {
			grid-template-columns: 1fr;
		}

		.name-cell,
		.email-cell,
		.goal-cell,
		.date-cell,
		.action-cell {
			display: grid;
		}

		.action-buttons {
			flex-direction: column;
			gap: 0.375rem;
			align-items: stretch;
			justify-content: flex-start;
		}

		.action-cell {
			text-align: left;
		}

		.action-cell,
		.action-buttons form {
			width: 100%;
		}

		.action-cell {
			grid-template-columns: 1fr;
		}

		.action-cell::before {
			margin-bottom: 0.1rem;
		}

		.btn-action {
			width: 100%;
			justify-content: center;
		}

		.goal-text,
		.person-meta {
			white-space: normal;
		}

		.date-cell time {
			white-space: normal;
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

		.modal-overlay {
			padding: 0.75rem;
		}

		.person-modal-header {
			padding-top: 1rem;
			padding-bottom: 1rem;
		}

		.person-modal-header h2 {
			font-size: 1.125rem;
		}

		.person-modal-footer .btn {
			width: 100%;
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

	:global(.dark) .person-modal,
	:global(.dark) .detail-card {
		background: var(--card-background, #1e293b);
		border-color: var(--border-color, #334155);
	}
</style>
