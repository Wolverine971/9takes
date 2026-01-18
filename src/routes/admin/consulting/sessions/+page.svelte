<!-- src/routes/admin/consulting/sessions/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	function setFilter(key: string, value: string) {
		const url = new URL(window.location.href);
		if (value === 'all' || !value) {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, value);
		}
		goto(url.toString(), { replaceState: true, invalidateAll: true });
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTime(dateStr: string): string {
		return new Date(dateStr).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function isToday(dateStr: string): boolean {
		const date = new Date(dateStr);
		const today = new Date();
		return date.toDateString() === today.toDateString();
	}

	function isTomorrow(dateStr: string): boolean {
		const date = new Date(dateStr);
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return date.toDateString() === tomorrow.toDateString();
	}

	function getRelativeDate(dateStr: string): string {
		if (isToday(dateStr)) return 'Today';
		if (isTomorrow(dateStr)) return 'Tomorrow';
		return formatDate(dateStr);
	}

	const statusColors: Record<string, string> = {
		scheduled: '#f59e0b',
		confirmed: '#3b82f6',
		in_progress: '#10b981',
		completed: '#6b7280',
		cancelled: '#ef4444',
		no_show: '#ef4444',
		rescheduled: '#9ca3af'
	};
</script>

<div class="sessions-page">
	<div class="page-header">
		<div class="header-content">
			<h1>Sessions</h1>
			<p class="subtitle">Manage your coaching sessions</p>
		</div>
	</div>

	<!-- Stats -->
	<div class="stats-row">
		<button
			class="stat-btn"
			class:active={data.filters.view === 'today'}
			on:click={() => setFilter('view', 'today')}
		>
			<span class="stat-num">{data.stats.today}</span>
			<span class="stat-label">Today</span>
		</button>
		<button
			class="stat-btn"
			class:active={data.filters.view === 'upcoming'}
			on:click={() => setFilter('view', 'upcoming')}
		>
			<span class="stat-num">{data.stats.upcoming}</span>
			<span class="stat-label">Upcoming</span>
		</button>
		<button
			class="stat-btn"
			class:active={data.filters.view === 'past'}
			on:click={() => setFilter('view', 'past')}
		>
			<span class="stat-num">{data.stats.completed}</span>
			<span class="stat-label">Completed</span>
		</button>
	</div>

	<!-- Filters -->
	<div class="filters-bar">
		<div class="filter-group">
			<label for="client-filter">Client:</label>
			<select
				id="client-filter"
				value={data.filters.clientId || 'all'}
				on:change={(e) => setFilter('client', e.currentTarget.value)}
			>
				<option value="all">All Clients</option>
				{#each data.clients as client}
					<option value={client.id}>{client.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Sessions List -->
	<div class="sessions-list">
		{#if data.sessions.length === 0}
			<div class="empty-state">
				<p>No sessions found</p>
				<a href="/admin/consulting/clients" class="btn btn-primary"> Go to Clients to Schedule </a>
			</div>
		{:else}
			{#each data.sessions as session}
				<div class="session-card" class:today={isToday(session.scheduled_at)}>
					<div class="session-datetime">
						<span
							class="session-date"
							class:highlight={isToday(session.scheduled_at) || isTomorrow(session.scheduled_at)}
						>
							{getRelativeDate(session.scheduled_at)}
						</span>
						<span class="session-time">{formatTime(session.scheduled_at)}</span>
					</div>

					<div class="session-main">
						<div class="session-client">
							<a href="/admin/consulting/clients/{session.client?.id}" class="client-name">
								{session.client?.name || 'Unknown Client'}
							</a>
							{#if session.client?.enneagram_type}
								<span class="type-badge">T{session.client.enneagram_type}</span>
							{/if}
							{#if session.client?.trust_layer}
								<span class="trust-badge trust-{session.client.trust_layer}">
									{session.client.trust_layer}
								</span>
							{/if}
						</div>
						<div class="session-meta">
							<span class="session-type">{session.session_type?.replace('_', ' ')}</span>
							<span class="session-duration">{session.duration_minutes} min</span>
							<span
								class="session-status"
								style="--status-color: {statusColors[session.status] || '#6b7280'}"
							>
								{session.status?.replace('_', ' ')}
							</span>
						</div>
					</div>

					<div class="session-actions">
						{#if session.meeting_link && session.status !== 'completed'}
							<a href={session.meeting_link} target="_blank" class="btn btn-sm btn-primary">
								Join
							</a>
						{/if}
						<a href="/admin/consulting/sessions/{session.id}" class="btn btn-sm btn-secondary">
							{session.status === 'completed' ? 'Review' : 'Prep'}
						</a>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.sessions-page {
		max-width: 900px;
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

	/* Stats */
	.stats-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.stat-btn {
		flex: 1;
		padding: 0.75rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		cursor: pointer;
		text-align: center;
		transition: all 0.2s;
	}

	.stat-btn:hover {
		border-color: var(--primary);
	}

	.stat-btn.active {
		background: rgba(99, 102, 241, 0.1);
		border-color: var(--primary);
	}

	.stat-num {
		display: block;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	/* Filters */
	.filters-bar {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filter-group label {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.filter-group select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		background: var(--card-background);
	}

	/* Sessions List */
	.sessions-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.session-card {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
	}

	.session-card.today {
		background: rgba(59, 130, 246, 0.05);
		border-color: rgba(59, 130, 246, 0.3);
	}

	.session-datetime {
		min-width: 100px;
		text-align: center;
	}

	.session-date {
		display: block;
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text-primary);
	}

	.session-date.highlight {
		color: var(--primary);
	}

	.session-time {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.session-main {
		flex: 1;
	}

	.session-client {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.client-name {
		font-weight: 500;
		color: var(--text-primary);
		text-decoration: none;
	}

	.client-name:hover {
		color: var(--primary);
	}

	.type-badge {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		padding: 0.0625rem 0.375rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.trust-badge {
		padding: 0.0625rem 0.375rem;
		border-radius: 4px;
		font-size: 0.65rem;
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

	.session-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.session-type {
		font-size: 0.8rem;
		text-transform: capitalize;
		color: var(--text-secondary);
	}

	.session-duration {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.session-status {
		font-size: 0.7rem;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		background: color-mix(in srgb, var(--status-color) 15%, transparent);
		color: var(--status-color);
		text-transform: capitalize;
	}

	.session-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 3rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
	}

	.empty-state p {
		margin: 0 0 1rem;
		color: var(--text-secondary);
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
		padding: 0.375rem 0.75rem;
		font-size: 0.8rem;
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

	.btn[aria-disabled='true'] {
		opacity: 0.6;
		pointer-events: none;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.session-card {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.session-datetime {
			text-align: left;
		}

		.session-actions {
			width: 100%;
		}

		.session-actions .btn {
			flex: 1;
		}
	}
</style>
