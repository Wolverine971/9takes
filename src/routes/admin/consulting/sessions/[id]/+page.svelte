<!-- src/routes/admin/consulting/sessions/[id]/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	export let data: PageData;

	// Note form state
	let noteContent = '';
	let noteType = 'observation';
	let noteTitle = '';

	// Completion form state
	let showCompleteModal = false;
	let sessionSummary = '';
	let nextSteps = '';
	let clientProgress = '';

	// Prep checklist state
	let prepChecklist = {
		reviewedIntake: false,
		reviewedPreviousSessions: false,
		preparedQuestions: false,
		testedMeetingLink: false,
		clearedMentalSpace: false
	};

	// Copy question to clipboard
	function copyQuestion(question: string) {
		navigator.clipboard.writeText(question);
		notifications.success('Question copied!', 2000);
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTime(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
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

	function isSessionToday(): boolean {
		const sessionDate = new Date(data.session.scheduled_at);
		const today = new Date();
		return sessionDate.toDateString() === today.toDateString();
	}

	function isSessionPast(): boolean {
		return new Date(data.session.scheduled_at) < new Date();
	}

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			scheduled: '#f59e0b',
			confirmed: '#3b82f6',
			in_progress: '#10b981',
			completed: '#6b7280',
			cancelled: '#ef4444',
			no_show: '#ef4444'
		};
		return colors[status] || '#6b7280';
	}

	const noteTypes = [
		{ value: 'observation', label: 'Observation', icon: '👁️' },
		{ value: 'insight', label: 'Insight', icon: '💡' },
		{ value: 'pattern', label: 'Pattern', icon: '🔄' },
		{ value: 'action_item', label: 'Action Item', icon: '✅' },
		{ value: 'breakthrough', label: 'Breakthrough', icon: '🎯' },
		{ value: 'concern', label: 'Concern', icon: '⚠️' }
	];

	// Calculate prep completion
	$: prepProgress = Object.values(prepChecklist).filter(Boolean).length;
	$: prepTotal = Object.values(prepChecklist).length;
</script>

<div class="session-detail">
	<!-- Header -->
	<div class="page-header">
		<div class="header-nav">
			<a href="/admin/consulting/sessions" class="back-link">&larr; All Sessions</a>
			{#if data.session.client}
				<a href="/admin/consulting/clients/{data.session.client.id}" class="client-link">
					View Client Profile &rarr;
				</a>
			{/if}
		</div>

		<div class="header-main">
			<div class="header-info">
				<h1>
					{#if data.session.client}
						{data.session.client.name}
					{:else}
						Session #{data.session.session_number}
					{/if}
				</h1>
				<div class="session-meta">
					<span class="session-datetime">
						{formatDate(data.session.scheduled_at)} at {formatTime(data.session.scheduled_at)}
					</span>
					<span class="session-type">{data.session.session_type?.replace('_', ' ')}</span>
					<span class="session-duration">{data.session.duration_minutes} min</span>
					<span class="status-badge" style="--status-color: {getStatusColor(data.session.status)}">
						{data.session.status?.replace('_', ' ')}
					</span>
				</div>
			</div>

			<div class="header-actions">
				{#if data.session.meeting_link}
					<a href={data.session.meeting_link} target="_blank" class="btn btn-primary">
						Join Meeting
					</a>
				{/if}

				{#if data.session.status === 'scheduled' || data.session.status === 'confirmed'}
					<form
						method="POST"
						action="?/updateStatus"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									notifications.success('Session started', 2000);
									invalidateAll();
								}
							};
						}}
					>
						<input type="hidden" name="status" value="in_progress" />
						<button type="submit" class="btn btn-success">Start Session</button>
					</form>
				{/if}

				{#if data.session.status === 'in_progress'}
					<button class="btn btn-primary" on:click={() => (showCompleteModal = true)}>
						Complete Session
					</button>
				{/if}
			</div>
		</div>
	</div>

	<div class="content-grid">
		<!-- Main Column -->
		<div class="main-column">
			<!-- Pre-Session Prep Checklist -->
			{#if data.session.status !== 'completed'}
				<section class="section-card prep-section">
					<div class="section-header">
						<h2>Pre-Session Prep</h2>
						<span class="prep-progress">{prepProgress}/{prepTotal} complete</span>
					</div>

					<div class="prep-checklist">
						<label class="prep-item" class:checked={prepChecklist.reviewedIntake}>
							<input type="checkbox" bind:checked={prepChecklist.reviewedIntake} />
							<span class="prep-label">Review intake form responses</span>
						</label>
						<label class="prep-item" class:checked={prepChecklist.reviewedPreviousSessions}>
							<input type="checkbox" bind:checked={prepChecklist.reviewedPreviousSessions} />
							<span class="prep-label">Review previous session notes</span>
						</label>
						<label class="prep-item" class:checked={prepChecklist.preparedQuestions}>
							<input type="checkbox" bind:checked={prepChecklist.preparedQuestions} />
							<span class="prep-label">Prepare type-specific questions</span>
						</label>
						<label class="prep-item" class:checked={prepChecklist.testedMeetingLink}>
							<input type="checkbox" bind:checked={prepChecklist.testedMeetingLink} />
							<span class="prep-label">Test meeting link</span>
						</label>
						<label class="prep-item" class:checked={prepChecklist.clearedMentalSpace}>
							<input type="checkbox" bind:checked={prepChecklist.clearedMentalSpace} />
							<span class="prep-label">Clear mental space (5 min meditation)</span>
						</label>
					</div>
				</section>
			{/if}

			<!-- Client Info & Goals -->
			{#if data.session.client}
				<section class="section-card">
					<div class="section-header">
						<h2>Client Context</h2>
					</div>

					<div class="client-context">
						<div class="context-grid">
							<div class="context-item">
								<span class="context-label">Initial Goal</span>
								<p class="context-value">{data.session.client.initial_goal || 'Not specified'}</p>
							</div>

							{#if data.session.client.intake?.[0]}
								{@const intake = data.session.client.intake[0]}
								{#if intake.current_challenges}
									<div class="context-item">
										<span class="context-label">Current Challenges</span>
										<p class="context-value">{intake.current_challenges}</p>
									</div>
								{/if}
								{#if intake.desired_outcome}
									<div class="context-item">
										<span class="context-label">Desired Outcome</span>
										<p class="context-value">{intake.desired_outcome}</p>
									</div>
								{/if}
								{#if intake.core_fear}
									<div class="context-item highlight">
										<span class="context-label">Their Core Fear</span>
										<p class="context-value">{intake.core_fear}</p>
									</div>
								{/if}
								{#if intake.core_desire}
									<div class="context-item highlight">
										<span class="context-label">Their Core Desire</span>
										<p class="context-value">{intake.core_desire}</p>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				</section>
			{/if}

			<!-- Previous Sessions -->
			{#if data.previousSessions.length > 0}
				<section class="section-card">
					<div class="section-header">
						<h2>Previous Sessions</h2>
					</div>

					<div class="previous-sessions">
						{#each data.previousSessions as prevSession}
							<div class="prev-session-item">
								<div class="prev-session-header">
									<span class="prev-session-date">{formatDateTime(prevSession.scheduled_at)}</span>
									<span class="prev-session-type"
										>{prevSession.session_type?.replace('_', ' ')}</span
									>
								</div>
								{#if prevSession.summary}
									<p class="prev-session-summary">{prevSession.summary}</p>
								{/if}
								{#if prevSession.next_steps}
									<div class="prev-session-next">
										<strong>Next Steps:</strong>
										{prevSession.next_steps}
									</div>
								{/if}
								{#if prevSession.notes?.length}
									<div class="prev-session-notes">
										{#each prevSession.notes.slice(0, 2) as note}
											<div class="mini-note">
												<span class="mini-note-type">{note.note_type}</span>
												<span class="mini-note-content">{note.content.slice(0, 100)}...</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Session Notes -->
			<section class="section-card notes-section">
				<div class="section-header">
					<h2>Session Notes</h2>
					<span class="note-count">{data.sessionNotes.length} notes</span>
				</div>

				<!-- Quick Note Form -->
				<form
					method="POST"
					action="?/addNote"
					class="quick-note-form"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								noteContent = '';
								noteTitle = '';
								notifications.success('Note added', 2000);
								invalidateAll();
							}
						};
					}}
				>
					<div class="note-type-selector">
						{#each noteTypes as type}
							<label class="note-type-option" class:selected={noteType === type.value}>
								<input type="radio" name="noteType" value={type.value} bind:group={noteType} />
								<span class="note-type-icon">{type.icon}</span>
								<span class="note-type-label">{type.label}</span>
							</label>
						{/each}
					</div>

					<input
						type="text"
						name="title"
						bind:value={noteTitle}
						placeholder="Note title (optional)"
						class="note-title-input"
					/>

					<textarea
						name="content"
						bind:value={noteContent}
						placeholder="Type your observation, insight, or action item..."
						rows="3"
						required
						class="note-content-input"
					></textarea>

					<button type="submit" class="btn btn-primary" disabled={!noteContent.trim()}>
						Add Note
					</button>
				</form>

				<!-- Existing Notes -->
				{#if data.sessionNotes.length > 0}
					<div class="notes-list">
						{#each data.sessionNotes as note}
							<div class="note-item note-{note.note_type}">
								<div class="note-header">
									<span class="note-type-badge">{note.note_type?.replace('_', ' ')}</span>
									<span class="note-time">{formatDateTime(note.created_at)}</span>
								</div>
								{#if note.title}
									<h4 class="note-title">{note.title}</h4>
								{/if}
								<p class="note-content">{note.content}</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="empty-notes">No notes yet. Start capturing insights during the session.</p>
				{/if}
			</section>
		</div>

		<!-- Sidebar -->
		<div class="side-column">
			<!-- Type Reference Card -->
			{#if data.typeInfo && data.session.client?.enneagram_type}
				<section class="section-card type-reference">
					<div class="section-header">
						<h2>Type {data.session.client.enneagram_type}</h2>
						<span class="type-name">{data.typeInfo.name}</span>
					</div>

					<div class="type-core">
						<div class="core-item fear">
							<span class="core-label">Core Fear</span>
							<p>{data.typeInfo.coreFear}</p>
						</div>
						<div class="core-item desire">
							<span class="core-label">Core Desire</span>
							<p>{data.typeInfo.coreDesire}</p>
						</div>
					</div>

					<div class="type-patterns">
						<h4>Key Patterns to Watch</h4>
						<ul>
							{#each data.typeInfo.keyPatterns as pattern}
								<li>{pattern}</li>
							{/each}
						</ul>
					</div>

					<div class="type-arrows">
						<div class="arrow-item stress">
							<span class="arrow-label">Under Stress → Type {data.typeInfo.stressArrow.type}</span>
							<ul>
								{#each data.typeInfo.stressArrow.behaviors as behavior}
									<li>{behavior}</li>
								{/each}
							</ul>
						</div>
						<div class="arrow-item security">
							<span class="arrow-label">In Security → Type {data.typeInfo.securityArrow.type}</span>
							<ul>
								{#each data.typeInfo.securityArrow.behaviors as behavior}
									<li>{behavior}</li>
								{/each}
							</ul>
						</div>
					</div>

					<div class="coaching-tips">
						<h4>Coaching Tips</h4>
						<ul>
							{#each data.typeInfo.coachingTips as tip}
								<li>{tip}</li>
							{/each}
						</ul>
					</div>

					<div class="watch-for">
						<h4>Watch For</h4>
						<ul>
							{#each data.typeInfo.watchFor as item}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				</section>

				<!-- Suggested Questions -->
				<section class="section-card questions-card">
					<div class="section-header">
						<h2>Suggested Questions</h2>
					</div>

					<div class="questions-list">
						{#each data.typeInfo.suggestedQuestions as question}
							<button class="question-item" on:click={() => copyQuestion(question)}>
								<span class="question-text">{question}</span>
								<span class="copy-hint">Click to copy</span>
							</button>
						{/each}
					</div>
				</section>
			{:else}
				<section class="section-card">
					<div class="section-header">
						<h2>Type Reference</h2>
					</div>
					<p class="empty-type">
						{#if data.session.client}
							Client's Enneagram type not yet determined.
							<a href="/admin/consulting/clients/{data.session.client.id}">Update client profile</a>
						{:else}
							No client linked to this session.
						{/if}
					</p>
				</section>
			{/if}

			<!-- Trust Layer -->
			{#if data.session.client?.trust_layer}
				<section class="section-card compact trust-card">
					<div class="section-header">
						<h2>Trust Layer</h2>
						<span class="trust-badge trust-{data.session.client.trust_layer}">
							{data.session.client.trust_layer}
						</span>
					</div>
					<div class="trust-guidance">
						{#if data.session.client.trust_layer === 'outer'}
							<p>
								Client is at the <strong>outer layer</strong> - blaming circumstances. Use
								<strong>Observation Voice</strong>: "I notice...", "It seems like..."
							</p>
						{:else if data.session.client.trust_layer === 'middle'}
							<p>
								Client is at the <strong>middle layer</strong> - acknowledging patterns with others.
								Use <strong>Experience Voice</strong>: "In my experience...", "I've seen..."
							</p>
						{:else if data.session.client.trust_layer === 'inner'}
							<p>
								Client is at the <strong>inner layer</strong> - taking self-responsibility. Use
								<strong>Expert Voice</strong>: "What's happening is...", "The pattern here is..."
							</p>
						{/if}
					</div>
				</section>
			{/if}

			<!-- Quick Links -->
			<section class="section-card compact">
				<div class="section-header">
					<h2>Resources</h2>
				</div>
				<div class="quick-links">
					<a href="/admin/consulting/resources/trust-onion-guide" class="quick-link"
						>Trust Onion Framework</a
					>
					<a href="/admin/consulting/resources/90-day-program-framework" class="quick-link"
						>90-Day Blueprint</a
					>
					<a href="/admin/consulting/resources/type-quick-reference" class="quick-link"
						>All Types Reference</a
					>
					{#if data.session.client?.enneagram_type}
						<a
							href="/enneagram-corner/enneagram-type-{data.session.client.enneagram_type}"
							target="_blank"
							class="quick-link"
						>
							Type {data.session.client.enneagram_type} Blog Post
						</a>
					{/if}
				</div>
			</section>
		</div>
	</div>
</div>

<!-- Complete Session Modal -->
{#if showCompleteModal}
	<div class="modal-overlay" on:click|self={() => (showCompleteModal = false)}>
		<div class="modal complete-modal">
			<div class="modal-header">
				<h2>Complete Session</h2>
				<button class="close-btn" on:click={() => (showCompleteModal = false)}>&times;</button>
			</div>
			<form
				method="POST"
				action="?/completeSession"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							showCompleteModal = false;
							notifications.success('Session completed!', 3000);
							invalidateAll();
						}
					};
				}}
			>
				<div class="modal-body">
					<div class="form-group">
						<label for="sessionSummary">Session Summary *</label>
						<textarea
							id="sessionSummary"
							name="summary"
							bind:value={sessionSummary}
							rows="4"
							required
							placeholder="Key insights, breakthroughs, and important observations from this session..."
						></textarea>
					</div>

					<div class="form-group">
						<label for="nextSteps">Next Steps / Homework</label>
						<textarea
							id="nextSteps"
							name="nextSteps"
							bind:value={nextSteps}
							rows="3"
							placeholder="Actions for the client before next session..."
						></textarea>
					</div>

					<div class="form-group">
						<label for="clientProgress">Client Progress Notes</label>
						<textarea
							id="clientProgress"
							name="clientProgress"
							bind:value={clientProgress}
							rows="3"
							placeholder="Any shifts in type awareness, trust layer movement, breakthroughs..."
						></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						on:click={() => (showCompleteModal = false)}
					>
						Cancel
					</button>
					<button type="submit" class="btn btn-success" disabled={!sessionSummary.trim()}>
						Complete Session
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.session-detail {
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Header */
	.page-header {
		margin-bottom: 1.5rem;
	}

	.header-nav {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.back-link,
	.client-link {
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-decoration: none;
	}

	.back-link:hover,
	.client-link:hover {
		color: var(--primary);
	}

	.header-main {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.page-header h1 {
		font-size: 1.5rem;
		margin: 0 0 0.5rem;
	}

	.session-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.session-datetime {
		font-weight: 500;
		color: var(--text-primary);
	}

	.session-type {
		text-transform: capitalize;
		color: var(--text-secondary);
	}

	.session-duration {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
		background: color-mix(in srgb, var(--status-color) 15%, transparent);
		color: var(--status-color);
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		grid-template-columns: 1fr 380px;
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
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0;
	}

	/* Prep Section */
	.prep-section {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
		border-color: rgba(59, 130, 246, 0.2);
	}

	.prep-progress {
		font-size: 0.75rem;
		color: var(--primary);
		font-weight: 500;
	}

	.prep-checklist {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.prep-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		background: var(--card-background);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.prep-item:hover {
		background: var(--hover-background);
	}

	.prep-item.checked {
		background: rgba(16, 185, 129, 0.1);
	}

	.prep-item.checked .prep-label {
		text-decoration: line-through;
		color: var(--text-secondary);
	}

	.prep-item input[type='checkbox'] {
		width: 18px;
		height: 18px;
		accent-color: #10b981;
	}

	.prep-label {
		font-size: 0.875rem;
	}

	/* Client Context */
	.context-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.context-item {
		padding: 0.5rem;
		background: var(--hover-background);
		border-radius: 6px;
	}

	.context-item.highlight {
		background: rgba(99, 102, 241, 0.1);
		border-left: 3px solid var(--primary);
	}

	.context-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		color: var(--text-secondary);
		letter-spacing: 0.5px;
		display: block;
		margin-bottom: 0.25rem;
	}

	.context-value {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	/* Previous Sessions */
	.previous-sessions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.prev-session-item {
		padding: 0.75rem;
		background: var(--hover-background);
		border-radius: 6px;
		border-left: 3px solid var(--border-color);
	}

	.prev-session-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.prev-session-date {
		font-size: 0.8rem;
		font-weight: 500;
	}

	.prev-session-type {
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-transform: capitalize;
	}

	.prev-session-summary {
		font-size: 0.85rem;
		margin: 0 0 0.5rem;
		line-height: 1.5;
	}

	.prev-session-next {
		font-size: 0.8rem;
		color: var(--primary);
		margin-bottom: 0.5rem;
	}

	.prev-session-notes {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mini-note {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.mini-note-type {
		font-weight: 500;
		text-transform: capitalize;
		margin-right: 0.5rem;
	}

	/* Notes Section */
	.notes-section {
		border: 2px solid var(--primary);
	}

	.note-count {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.quick-note-form {
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.note-type-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.note-type-option {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		background: var(--hover-background);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.75rem;
		transition: all 0.2s;
	}

	.note-type-option input {
		display: none;
	}

	.note-type-option.selected {
		background: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	.note-type-icon {
		font-size: 0.875rem;
	}

	.note-title-input,
	.note-content-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-family: inherit;
		margin-bottom: 0.5rem;
	}

	.note-content-input {
		resize: vertical;
		min-height: 80px;
	}

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
		margin-bottom: 0.25rem;
	}

	.note-type-badge {
		font-size: 0.65rem;
		text-transform: uppercase;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.note-time {
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	.note-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.note-content {
		font-size: 0.85rem;
		margin: 0;
		line-height: 1.5;
	}

	.empty-notes {
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.875rem;
		padding: 1rem;
	}

	/* Type Reference */
	.type-reference {
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
		border-color: rgba(99, 102, 241, 0.3);
	}

	.type-name {
		font-size: 0.75rem;
		color: var(--primary);
	}

	.type-core {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.core-item {
		padding: 0.5rem;
		border-radius: 6px;
	}

	.core-item.fear {
		background: rgba(239, 68, 68, 0.1);
		border-left: 3px solid #ef4444;
	}

	.core-item.desire {
		background: rgba(16, 185, 129, 0.1);
		border-left: 3px solid #10b981;
	}

	.core-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		font-weight: 600;
		display: block;
		margin-bottom: 0.125rem;
	}

	.core-item p {
		margin: 0;
		font-size: 0.8rem;
	}

	.type-patterns,
	.type-arrows,
	.coaching-tips,
	.watch-for {
		margin-bottom: 0.75rem;
	}

	.type-patterns h4,
	.coaching-tips h4,
	.watch-for h4 {
		font-size: 0.75rem;
		margin: 0 0 0.375rem;
		color: var(--text-secondary);
	}

	.type-patterns ul,
	.coaching-tips ul,
	.watch-for ul {
		margin: 0;
		padding-left: 1rem;
		font-size: 0.8rem;
	}

	.type-patterns li,
	.coaching-tips li,
	.watch-for li {
		margin-bottom: 0.25rem;
	}

	.type-arrows {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.arrow-item {
		padding: 0.5rem;
		border-radius: 6px;
		font-size: 0.75rem;
	}

	.arrow-item.stress {
		background: rgba(245, 158, 11, 0.1);
	}

	.arrow-item.security {
		background: rgba(59, 130, 246, 0.1);
	}

	.arrow-label {
		font-weight: 600;
		display: block;
		margin-bottom: 0.25rem;
	}

	.arrow-item ul {
		margin: 0;
		padding-left: 1rem;
	}

	/* Questions Card */
	.questions-card {
		max-height: 400px;
		overflow-y: auto;
	}

	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.question-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.625rem;
		background: var(--hover-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.question-item:hover {
		background: rgba(99, 102, 241, 0.1);
		border-color: var(--primary);
	}

	.question-text {
		display: block;
		font-size: 0.8rem;
		line-height: 1.4;
		color: var(--text-primary);
	}

	.copy-hint {
		display: block;
		font-size: 0.65rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	/* Trust Card */
	.trust-card .trust-guidance {
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.trust-card .trust-guidance p {
		margin: 0;
	}

	.trust-badge {
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
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

	/* Quick Links */
	.quick-links {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.quick-link {
		font-size: 0.8rem;
		color: var(--primary);
		text-decoration: none;
		padding: 0.375rem;
		border-radius: 4px;
	}

	.quick-link:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.empty-type {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.empty-type a {
		color: var(--primary);
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

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-success {
		background: #10b981;
		color: white;
	}

	.btn-secondary {
		background: var(--hover-background);
		border: 1px solid var(--border-color);
		color: var(--text-primary);
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
		max-width: 550px;
		max-height: 90vh;
		overflow-y: auto;
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
		font-size: 1.125rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary);
	}

	.modal-body {
		padding: 1rem;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		margin-bottom: 0.375rem;
	}

	.form-group textarea {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-family: inherit;
		resize: vertical;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.side-column {
			order: -1;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}
	}

	@media (max-width: 640px) {
		.header-main {
			flex-direction: column;
		}

		.side-column {
			grid-template-columns: 1fr;
		}

		.note-type-selector {
			flex-wrap: wrap;
		}
	}
</style>
