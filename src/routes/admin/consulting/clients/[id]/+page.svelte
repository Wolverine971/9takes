<!-- src/routes/admin/consulting/clients/[id]/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailComposeModal from '$lib/components/email/EmailComposeModal.svelte';
	import type { EmailRecipient } from '$lib/types/email';
	import type { PageData } from './$types';

	export let data: PageData;

	// Edit mode
	let isEditing = false;
	let editData = { ...data.client };

	// Email modal state
	let showEmailModal = false;
	let emailRecipients: EmailRecipient[] = [];
	let emailSubject = '';
	let emailContent = '';
	let isGettingIntakeLink = false;

	function openEmailModal() {
		emailRecipients = [
			{
				id: data.client.id,
				email: data.client.email,
				name: data.client.name,
				source: 'coaching_waitlist',
				source_id: data.client.waitlist_id || data.client.id,
				enneagram: data.client.enneagram_type?.toString()
			}
		];
		// Pre-fill with personalized greeting
		const firstName = data.client.name?.split(' ')[0] || 'there';
		emailSubject = '';
		emailContent = `<p>Hi ${firstName},</p>\n\n<p></p>\n\n<p>Best,<br>DJ</p>`;
		showEmailModal = true;
	}

	async function openIntakeEmailModal() {
		isGettingIntakeLink = true;

		try {
			// Call the action to get/create intake link
			const response = await fetch(`?/getIntakeLink`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			});

			const result = await response.json();

			if (result.type === 'success' && result.data?.intakeUrl) {
				const intakeUrl = result.data.intakeUrl;
				const firstName = data.client.name?.split(' ')[0] || 'there';

				emailRecipients = [
					{
						id: data.client.id,
						email: data.client.email,
						name: data.client.name,
						source: 'coaching_waitlist',
						source_id: data.client.waitlist_id || data.client.id,
						enneagram: data.client.enneagram_type?.toString()
					}
				];

				emailSubject = 'Your Personality Coaching Intake Form';
				emailContent = `<p>Hi ${firstName},</p>

<p>Thank you for your interest in personality coaching! Before our first session, I'd like to learn more about you and what you're hoping to achieve.</p>

<p>Please take 10-15 minutes to complete this intake form:</p>

<p><a href="${intakeUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Complete Intake Form</a></p>

<p>Your responses help me prepare for a more effective first session. Everything you share is confidential.</p>

<p>Looking forward to working with you!</p>

<p>Best,<br>DJ</p>`;

				showEmailModal = true;
				invalidateAll();
			} else {
				notifications.danger('Failed to create intake form', 3000);
			}
		} catch (err) {
			console.error('Failed to get intake link:', err);
			notifications.danger('Failed to create intake form', 3000);
		} finally {
			isGettingIntakeLink = false;
		}
	}

	function handleEmailSent() {
		showEmailModal = false;
	}

	// Modals
	let showNoteModal = false;
	let showSessionModal = false;

	// Note form
	let noteTitle = '';
	let noteContent = '';
	let noteType = 'observation';

	// Session form
	let sessionDate = '';
	let sessionTime = '';
	let sessionType = 'discovery';
	let sessionDuration = '60';
	let sessionLink = '';
	let scheduledAtValue = '';

	$: scheduledAtValue = sessionDate && sessionTime ? `${sessionDate}T${sessionTime}` : '';

	function formatDate(dateStr: string | null): string {
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
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function closeNoteModal() {
		showNoteModal = false;
		noteTitle = '';
		noteContent = '';
		noteType = 'observation';
	}

	function closeSessionModal() {
		showSessionModal = false;
		sessionDate = '';
		sessionTime = '';
		sessionType = 'discovery';
		sessionDuration = '60';
		sessionLink = '';
	}

	const statusOptions = [
		{ value: 'prospect', label: 'Prospect' },
		{ value: 'intake_sent', label: 'Intake Sent' },
		{ value: 'intake_completed', label: 'Intake Completed' },
		{ value: 'active', label: 'Active' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'paused', label: 'Paused' },
		{ value: 'churned', label: 'Churned' }
	];

	const trustOptions = [
		{ value: 'outer', label: 'Outer (blame circumstances)' },
		{ value: 'middle', label: 'Middle (blame people)' },
		{ value: 'inner', label: 'Inner (self-responsibility)' }
	];

	const noteTypes = [
		{ value: 'observation', label: 'Observation' },
		{ value: 'insight', label: 'Insight' },
		{ value: 'pattern', label: 'Pattern' },
		{ value: 'action_item', label: 'Action Item' },
		{ value: 'follow_up', label: 'Follow Up' },
		{ value: 'breakthrough', label: 'Breakthrough' },
		{ value: 'concern', label: 'Concern' }
	];

	// Get upcoming sessions
	$: upcomingSessions = (data.client.sessions || [])
		.filter((s: any) => new Date(s.scheduled_at) >= new Date() && s.status !== 'cancelled')
		.sort(
			(a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
		);

	// Get past sessions
	$: pastSessions = (data.client.sessions || [])
		.filter((s: any) => new Date(s.scheduled_at) < new Date() || s.status === 'completed')
		.sort(
			(a: any, b: any) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
		);
</script>

<div class="client-detail">
	<!-- Header -->
	<div class="page-header">
		<div class="header-left">
			<a href="/admin/consulting/clients" class="back-link"> &larr; All Clients </a>
			<h1>{data.client.name}</h1>
			<p class="client-email">{data.client.email}</p>
		</div>
		<div class="header-actions">
			{#if !isEditing}
				<button class="btn btn-secondary" on:click={() => (isEditing = true)}> Edit </button>
			{/if}
		</div>
	</div>

	<div class="content-grid">
		<!-- Main Column -->
		<div class="main-column">
			<!-- Client Info Card -->
			<section class="section-card">
				<div class="section-header">
					<h2>Client Information</h2>
					{#if isEditing}
						<div class="edit-actions">
							<button
								class="btn btn-sm btn-secondary"
								on:click={() => {
									isEditing = false;
									editData = { ...data.client };
								}}
							>
								Cancel
							</button>
						</div>
					{/if}
				</div>

				{#if isEditing}
					<form
						method="POST"
						action="?/updateClient"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									notifications.success('Client updated', 3000);
									isEditing = false;
									invalidateAll();
								} else {
									notifications.danger('Failed to update', 3000);
								}
							};
						}}
					>
						<div class="edit-grid">
							<div class="form-group">
								<label for="name">Name</label>
								<input type="text" id="name" name="name" bind:value={editData.name} required />
							</div>
							<div class="form-group">
								<label for="email">Email</label>
								<input type="email" id="email" name="email" bind:value={editData.email} required />
							</div>
							<div class="form-group">
								<label for="phone">Phone</label>
								<input type="tel" id="phone" name="phone" bind:value={editData.phone} />
							</div>
							<div class="form-group">
								<label for="status">Status</label>
								<select id="status" name="status" bind:value={editData.status}>
									{#each statusOptions as opt}
										<option value={opt.value}>{opt.label}</option>
									{/each}
								</select>
							</div>
							<div class="form-group">
								<label for="trust_layer">Trust Layer</label>
								<select id="trust_layer" name="trust_layer" bind:value={editData.trust_layer}>
									<option value="">Not assessed</option>
									{#each trustOptions as opt}
										<option value={opt.value}>{opt.label}</option>
									{/each}
								</select>
							</div>
							<div class="form-group">
								<label for="enneagram_type">Enneagram Type</label>
								<select
									id="enneagram_type"
									name="enneagram_type"
									bind:value={editData.enneagram_type}
								>
									<option value="">Unknown</option>
									{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
										<option value={type.toString()}>{type}</option>
									{/each}
								</select>
							</div>
							<div class="form-group">
								<label for="enneagram_wing">Wing</label>
								<select
									id="enneagram_wing"
									name="enneagram_wing"
									bind:value={editData.enneagram_wing}
								>
									<option value="">None</option>
									{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as wing}
										<option value={wing.toString()}>{wing}</option>
									{/each}
								</select>
							</div>
							<div class="form-group full-width">
								<label>
									<input
										type="checkbox"
										name="enneagram_confirmed"
										value="true"
										checked={editData.enneagram_confirmed}
									/>
									Type Confirmed
								</label>
							</div>
							<div class="form-group full-width">
								<label for="notes">Notes</label>
								<textarea id="notes" name="notes" bind:value={editData.notes} rows="3"></textarea>
							</div>
						</div>
						<div class="form-footer">
							<button type="submit" class="btn btn-primary">Save Changes</button>
						</div>
					</form>
				{:else}
					<div class="info-grid">
						<div class="info-item">
							<span class="info-label">Status</span>
							<span class="status-badge status-{data.client.status}">
								{statusOptions.find((s) => s.value === data.client.status)?.label ||
									data.client.status}
							</span>
						</div>
						<div class="info-item">
							<span class="info-label">Trust Layer</span>
							{#if data.client.trust_layer}
								<span class="trust-badge trust-{data.client.trust_layer}">
									{trustOptions.find((t) => t.value === data.client.trust_layer)?.label ||
										data.client.trust_layer}
								</span>
							{:else}
								<span class="unknown">Not assessed</span>
							{/if}
						</div>
						<div class="info-item">
							<span class="info-label">Type</span>
							{#if data.client.enneagram_type}
								<span class="type-badge">
									Type {data.client.enneagram_type}
									{#if data.client.enneagram_wing}w{data.client.enneagram_wing}{/if}
									{#if data.client.enneagram_confirmed}
										<span class="confirmed-badge">Confirmed</span>
									{/if}
								</span>
							{:else}
								<span class="unknown">Unknown</span>
							{/if}
						</div>
						<div class="info-item">
							<span class="info-label">Phone</span>
							<span>{data.client.phone || '-'}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Source</span>
							<span>{data.client.source || '-'}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Client Since</span>
							<span>{formatDate(data.client.created_at)}</span>
						</div>
						{#if data.client.initial_goal}
							<div class="info-item full-width">
								<span class="info-label">Initial Goal</span>
								<p class="goal-text">{data.client.initial_goal}</p>
							</div>
						{/if}
						{#if data.client.notes}
							<div class="info-item full-width">
								<span class="info-label">Notes</span>
								<p class="notes-text">{data.client.notes}</p>
							</div>
						{/if}
					</div>
				{/if}
			</section>

			<!-- Intake Form -->
			<section class="section-card">
				<div class="section-header">
					<h2>Intake Form</h2>
					{#if !data.client.intake?.length}
						<button class="btn btn-sm btn-primary" on:click={openIntakeEmailModal}>
							{isGettingIntakeLink ? 'Creating...' : 'Send Intake'}
						</button>
					{/if}
				</div>
				{#if data.client.intake?.length}
					{@const intake = data.client.intake[0]}
					<div class="intake-summary">
						<div class="intake-status-row">
							<span class="intake-status intake-{intake.status}">{intake.status}</span>
							{#if intake.completed_at}
								<span class="intake-date">Completed: {formatDate(intake.completed_at)}</span>
							{:else if intake.sent_at}
								<span class="intake-date">Sent: {formatDate(intake.sent_at)}</span>
							{/if}
						</div>
						{#if intake.status === 'sent' || intake.status === 'pending'}
							<div class="intake-link-section">
								<p class="intake-link-label">Intake Form Link:</p>
								<div class="intake-link-row">
									<code class="intake-link">/intake/{intake.id}</code>
									<button
										class="btn btn-sm btn-secondary"
										on:click={() => {
											const url = `${window.location.origin}/intake/${intake.id}`;
											navigator.clipboard.writeText(url);
											notifications.success('Link copied!', 2000);
										}}
									>
										Copy
									</button>
								</div>
							</div>
						{/if}
						{#if intake.status === 'completed' || intake.status === 'reviewed'}
							<div class="intake-responses">
								{#if intake.current_challenges}
									<div class="response-item">
										<h4>Current Challenges</h4>
										<p>{intake.current_challenges}</p>
									</div>
								{/if}
								{#if intake.desired_outcome}
									<div class="response-item">
										<h4>Desired Outcome</h4>
										<p>{intake.desired_outcome}</p>
									</div>
								{/if}
								{#if intake.core_fear}
									<div class="response-item">
										<h4>Core Fear</h4>
										<p>{intake.core_fear}</p>
									</div>
								{/if}
								{#if intake.core_desire}
									<div class="response-item">
										<h4>Core Desire</h4>
										<p>{intake.core_desire}</p>
									</div>
								{/if}
							</div>
						{:else if intake.status !== 'sent' && intake.status !== 'pending'}
							<p class="empty-note">Intake not yet completed</p>
						{/if}
					</div>
				{:else}
					<p class="empty-note">No intake form created yet</p>
				{/if}
			</section>

			<!-- Sessions -->
			<section class="section-card" id="sessions">
				<div class="section-header">
					<h2>Sessions</h2>
					<button class="btn btn-sm btn-primary" on:click={() => (showSessionModal = true)}>
						+ Schedule
					</button>
				</div>

				{#if upcomingSessions.length > 0}
					<h3 class="subsection-title">Upcoming</h3>
					<div class="session-list">
						{#each upcomingSessions as session}
							<div class="session-item upcoming">
								<div class="session-date">
									<span class="session-day"
										>{session.scheduled_at
											? new Date(session.scheduled_at).toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric'
												})
											: '-'}</span
									>
									<span class="session-time"
										>{session.scheduled_at
											? new Date(session.scheduled_at).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: '2-digit'
												})
											: ''}</span
									>
								</div>
								<div class="session-info">
									<span class="session-type">{session.session_type?.replace('_', ' ')}</span>
									<span class="session-duration">{session.duration_minutes} min</span>
								</div>
								<div class="session-actions">
									{#if session.meeting_link}
										<a href={session.meeting_link} target="_blank" class="btn btn-sm btn-primary"
											>Join</a
										>
									{/if}
									<a href="/admin/consulting/sessions/{session.id}" class="btn btn-sm btn-secondary"
										>Prep</a
									>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if pastSessions.length > 0}
					<h3 class="subsection-title">Past Sessions</h3>
					<div class="session-list">
						{#each pastSessions as session}
							<div class="session-item past">
								<div class="session-date">
									<span class="session-day">{formatDate(session.scheduled_at)}</span>
								</div>
								<div class="session-info">
									<span class="session-type">{session.session_type?.replace('_', ' ')}</span>
									<span class="session-status status-{session.status}">{session.status}</span>
								</div>
								<a href="/admin/consulting/sessions/{session.id}" class="session-link">Review</a>
							</div>
						{/each}
					</div>
				{/if}

				{#if upcomingSessions.length === 0 && pastSessions.length === 0}
					<p class="empty-note">No sessions yet</p>
				{/if}
			</section>

			<!-- Notes -->
			<section class="section-card" id="notes">
				<div class="section-header">
					<h2>Notes</h2>
					<button class="btn btn-sm btn-secondary" on:click={() => (showNoteModal = true)}>
						+ Add Note
					</button>
				</div>
				{#if data.client.notes?.length}
					<div class="notes-list">
						{#each data.client.notes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as note}
							<div class="note-item note-{note.note_type}">
								<div class="note-header">
									<span class="note-type">{note.note_type}</span>
									<span class="note-date">{formatDateTime(note.created_at)}</span>
								</div>
								{#if note.title}
									<h4 class="note-title">{note.title}</h4>
								{/if}
								<p class="note-content">{note.content}</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="empty-note">No notes yet</p>
				{/if}
			</section>
		</div>

		<!-- Sidebar -->
		<div class="side-column">
			<!-- Quick Actions -->
			<section class="section-card compact">
				<h3>Quick Actions</h3>
				<div class="quick-actions">
					<button class="action-btn email-btn" on:click={openEmailModal}> Send Email </button>
					{#if !data.client.intake?.length || data.client.intake[0]?.status === 'pending'}
						<button
							class="action-btn intake-btn"
							on:click={openIntakeEmailModal}
							disabled={isGettingIntakeLink}
						>
							{isGettingIntakeLink ? 'Creating...' : 'Send Intake Form'}
						</button>
					{:else if data.client.intake[0]?.status === 'sent'}
						<button
							class="action-btn intake-btn"
							on:click={openIntakeEmailModal}
							disabled={isGettingIntakeLink}
						>
							Resend Intake Form
						</button>
					{/if}
					<button class="action-btn" on:click={() => (showSessionModal = true)}>
						Schedule Session
					</button>
					<button class="action-btn" on:click={() => (showNoteModal = true)}> Add Note </button>
				</div>
			</section>

			<!-- Type Quick Reference -->
			{#if data.client.enneagram_type}
				<section class="section-card compact">
					<h3>Type {data.client.enneagram_type} Reference</h3>
					<div class="type-reference">
						<a href="/admin/consulting/resources/type-specific-questions" class="ref-link">
							Type Questions
						</a>
						<a
							href="/enneagram-corner/enneagram-type-{data.client.enneagram_type}"
							target="_blank"
							class="ref-link"
						>
							Type Overview
						</a>
					</div>
				</section>
			{/if}

			<!-- Waitlist Origin -->
			{#if data.waitlistData}
				<section class="section-card compact">
					<h3>Waitlist Origin</h3>
					<div class="origin-info">
						<p><strong>Signed up:</strong> {formatDate(data.waitlistData.created_at)}</p>
						{#if data.waitlistData.session_goal}
							<p><strong>Original goal:</strong></p>
							<p class="origin-goal">{data.waitlistData.session_goal}</p>
						{/if}
						{#if data.waitlistData.metadata?.[0]?.source}
							<p><strong>Source:</strong> {data.waitlistData.metadata[0].source}</p>
						{/if}
					</div>
				</section>
			{/if}

			<!-- Danger Zone -->
			<section class="section-card compact danger">
				<h3>Danger Zone</h3>
				<form
					method="POST"
					action="?/deleteClient"
					use:enhance={() => {
						if (!confirm('Are you sure you want to delete this client? This cannot be undone.')) {
							return () => {};
						}
						return async ({ result }) => {
							if (result.type === 'redirect') {
								notifications.success('Client deleted', 3000);
							}
						};
					}}
				>
					<button type="submit" class="btn btn-danger btn-sm">Delete Client</button>
				</form>
			</section>
		</div>
	</div>
</div>

<!-- Add Note Modal -->
{#if showNoteModal}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click|self={closeNoteModal}>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="note-modal-title">
			<div class="modal-header">
				<h2 id="note-modal-title">Add Note</h2>
				<button class="close-btn" on:click={closeNoteModal}>&times;</button>
			</div>
			<form
				method="POST"
				action="?/addNote"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							notifications.success('Note added', 3000);
							closeNoteModal();
							invalidateAll();
						}
					};
				}}
			>
				<div class="modal-body">
					<div class="form-group">
						<label for="noteType">Type</label>
						<select id="noteType" name="noteType" bind:value={noteType}>
							{#each noteTypes as type}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					</div>
					<div class="form-group">
						<label for="noteTitle">Title (optional)</label>
						<input type="text" id="noteTitle" name="title" bind:value={noteTitle} />
					</div>
					<div class="form-group">
						<label for="noteContent">Note *</label>
						<textarea id="noteContent" name="content" bind:value={noteContent} rows="5" required
						></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" on:click={closeNoteModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">Add Note</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Schedule Session Modal -->
{#if showSessionModal}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click|self={closeSessionModal}>
		<div class="modal" role="dialog" aria-modal="true" aria-labelledby="session-modal-title">
			<div class="modal-header">
				<h2 id="session-modal-title">Schedule Session</h2>
				<button class="close-btn" on:click={closeSessionModal}>&times;</button>
			</div>
			<form
				method="POST"
				action="?/scheduleSession"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							notifications.success('Session scheduled', 3000);
							closeSessionModal();
							invalidateAll();
						}
					};
				}}
			>
				<div class="modal-body">
					<div class="form-row">
						<div class="form-group">
							<label for="sessionDate">Date *</label>
							<input type="date" id="sessionDate" bind:value={sessionDate} required />
						</div>
						<div class="form-group">
							<label for="sessionTime">Time *</label>
							<input type="time" id="sessionTime" bind:value={sessionTime} required />
						</div>
					</div>
					<input type="hidden" name="scheduledAt" value={scheduledAtValue} />
					<div class="form-group">
						<label for="sessionType">Session Type</label>
						<select id="sessionType" name="sessionType" bind:value={sessionType}>
							<option value="intro_call">Intro Call</option>
							<option value="discovery">Discovery Session</option>
							<option value="follow_up">Follow Up</option>
							<option value="deep_dive">Deep Dive</option>
							<option value="relationship">Relationship Focus</option>
						</select>
					</div>
					<div class="form-group">
						<label for="sessionDuration">Duration (minutes)</label>
						<select id="sessionDuration" name="duration" bind:value={sessionDuration}>
							<option value="30">30 min</option>
							<option value="60">60 min</option>
							<option value="90">90 min</option>
						</select>
					</div>
					<div class="form-group">
						<label for="sessionLink">Meeting Link</label>
						<input
							type="url"
							id="sessionLink"
							name="meetingLink"
							bind:value={sessionLink}
							placeholder="https://..."
						/>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" on:click={closeSessionModal}
						>Cancel</button
					>
					<button type="submit" class="btn btn-primary">Schedule</button>
				</div>
			</form>
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
	.client-detail {
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.back-link {
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: 0.25rem;
		display: inline-block;
	}

	.back-link:hover {
		color: var(--primary);
	}

	.page-header h1 {
		font-size: 1.5rem;
		margin: 0;
	}

	.client-email {
		color: var(--text-secondary);
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 280px;
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

	.section-card.danger {
		border-color: rgba(239, 68, 68, 0.3);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.section-header h2 {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0;
	}

	.section-card h3 {
		font-size: 0.85rem;
		font-weight: 600;
		margin: 0 0 0.75rem;
	}

	.subsection-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--text-secondary);
		margin: 1rem 0 0.5rem;
		letter-spacing: 0.5px;
	}

	/* Info Grid */
	.info-grid,
	.edit-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-item.full-width,
	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.info-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		color: var(--text-secondary);
		letter-spacing: 0.5px;
	}

	.goal-text,
	.notes-text {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* Badges */
	.status-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-prospect {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
	}
	.status-intake_sent {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}
	.status-intake_completed {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}
	.status-active {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
	}
	.status-completed {
		background: rgba(107, 114, 128, 0.1);
		color: #6b7280;
	}
	.status-paused {
		background: rgba(156, 163, 175, 0.1);
		color: #9ca3af;
	}
	.status-churned {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.trust-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
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

	.type-badge {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.confirmed-badge {
		background: rgba(16, 185, 129, 0.2);
		color: #10b981;
		padding: 0.0625rem 0.25rem;
		border-radius: 3px;
		font-size: 0.65rem;
		margin-left: 0.25rem;
	}

	.unknown {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	/* Intake */
	.intake-status-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.intake-status {
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.intake-pending {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}
	.intake-sent {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
	}
	.intake-completed {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}
	.intake-reviewed {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
	}

	.intake-date {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.intake-link-section {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: var(--hover-background);
		border-radius: 6px;
	}

	.intake-link-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 0 0 0.5rem;
	}

	.intake-link-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.intake-link {
		flex: 1;
		padding: 0.375rem 0.5rem;
		background: var(--background);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 0.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.intake-responses {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.response-item h4 {
		font-size: 0.75rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
		color: var(--text-secondary);
	}

	.response-item p {
		margin: 0;
		font-size: 0.875rem;
	}

	/* Sessions */
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

	.session-item.upcoming {
		background: rgba(59, 130, 246, 0.05);
		border: 1px solid rgba(59, 130, 246, 0.2);
	}

	.session-date {
		min-width: 100px;
	}

	.session-day {
		display: block;
		font-weight: 500;
		font-size: 0.8rem;
	}

	.session-time {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.session-info {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.session-type {
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.session-duration {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.session-status {
		font-size: 0.7rem;
		padding: 0.0625rem 0.375rem;
		border-radius: 3px;
	}

	.session-link {
		font-size: 0.75rem;
		color: var(--primary);
		text-decoration: none;
	}

	/* Notes */
	.notes-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.note-item {
		padding: 0.75rem;
		background: var(--hover-background);
		border-radius: 6px;
		border-left: 3px solid var(--border-color);
	}

	.note-observation {
		border-left-color: #6366f1;
	}
	.note-insight {
		border-left-color: #10b981;
	}
	.note-pattern {
		border-left-color: #f59e0b;
	}
	.note-action_item {
		border-left-color: #3b82f6;
	}
	.note-breakthrough {
		border-left-color: #22c55e;
	}
	.note-concern {
		border-left-color: #ef4444;
	}

	.note-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.note-type {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: var(--text-secondary);
		letter-spacing: 0.5px;
	}

	.note-date {
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	.note-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.note-content {
		font-size: 0.8rem;
		margin: 0;
		line-height: 1.5;
	}

	/* Quick Actions */
	.quick-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.action-btn {
		display: block;
		width: 100%;
		padding: 0.5rem;
		text-align: center;
		background: var(--hover-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		color: var(--text-primary);
		text-decoration: none;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.action-btn:hover {
		background: rgba(99, 102, 241, 0.1);
		border-color: var(--primary);
	}

	.action-btn.email-btn {
		background: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	.action-btn.email-btn:hover {
		opacity: 0.9;
	}

	.action-btn.intake-btn {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	.action-btn.intake-btn:hover {
		background: #059669;
		border-color: #059669;
	}

	.action-btn.intake-btn:disabled {
		background: #a7f3d0;
		border-color: #a7f3d0;
		cursor: not-allowed;
	}

	/* Type Reference */
	.type-reference {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.ref-link {
		font-size: 0.8rem;
		color: var(--primary);
		text-decoration: none;
	}

	.ref-link:hover {
		text-decoration: underline;
	}

	/* Origin Info */
	.origin-info p {
		margin: 0 0 0.375rem;
		font-size: 0.8rem;
	}

	.origin-goal {
		color: var(--text-secondary);
		font-style: italic;
	}

	.empty-note {
		color: var(--text-secondary);
		font-size: 0.875rem;
		text-align: center;
		padding: 1rem;
	}

	/* Forms */
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-group label {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-family: inherit;
	}

	.form-footer {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
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
	}

	.btn-sm {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-secondary {
		background: var(--background);
		border: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal {
		background: var(--card-background);
		border-radius: var(--border-radius);
		width: 100%;
		max-width: 450px;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.25rem;
		cursor: pointer;
		color: var(--text-secondary);
	}

	.modal-body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 1rem;
		border-top: 1px solid var(--border-color);
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.info-grid,
		.edit-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
