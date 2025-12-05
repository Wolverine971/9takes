<!-- src/routes/admin/email-dashboard/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type {
		EmailRecipient,
		EmailAnalytics,
		EmailDraft,
		ScheduledEmail
	} from '$lib/types/email';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailComposeModal from '$lib/components/email/EmailComposeModal.svelte';

	export let data: PageData;

	// State
	let activeTab: 'users' | 'drafts' | 'sent' | 'scheduled' = 'users';
	let users: EmailRecipient[] = data.users || [];
	let totalUsers = data.totalUsers || 0;
	let drafts: EmailDraft[] = data.drafts || [];
	let scheduledEmails: ScheduledEmail[] = data.scheduledEmails || [];
	let analytics: EmailAnalytics = data.analytics;
	let cronStatus = data.cronStatus;

	// Selection state
	let selectedUsers = new Set<string>();
	let selectAll = false;

	// Search and filter state
	let searchQuery = '';
	let sourceFilter: 'all' | 'profiles' | 'signups' | 'coaching_waitlist' = 'all';
	let currentPage = 1;
	let isLoading = false;

	// Compose modal state
	let showCompose = false;
	let composeRecipients: EmailRecipient[] = [];
	let initialSubject = '';
	let initialContent = '';
	let initialScheduledFor = '';

	// Fetch users with filters
	async function fetchUsers() {
		isLoading = true;
		try {
			const params = new URLSearchParams({
				source: sourceFilter,
				page: currentPage.toString(),
				limit: '50'
			});
			if (searchQuery) params.set('search', searchQuery);

			const response = await fetch(`/api/admin/email-dashboard/users?${params}`);
			const result = await response.json();

			users = result.users;
			totalUsers = result.pagination.total;
		} catch (error) {
			console.error('Error fetching users:', error);
			notifications.danger('Failed to fetch users', 3000);
		} finally {
			isLoading = false;
		}
	}

	// Toggle user selection
	function toggleUserSelection(user: EmailRecipient) {
		const key = `${user.source}-${user.id}`;
		if (selectedUsers.has(key)) {
			selectedUsers.delete(key);
		} else {
			selectedUsers.add(key);
		}
		selectedUsers = selectedUsers;
	}

	// Toggle select all
	function toggleSelectAll() {
		if (selectAll) {
			selectedUsers.clear();
		} else {
			users.forEach((user) => {
				if (!user.unsubscribed) {
					selectedUsers.add(`${user.source}-${user.id}`);
				}
			});
		}
		selectedUsers = selectedUsers;
		selectAll = !selectAll;
	}

	// Open compose with selected users
	function openComposeWithSelected() {
		composeRecipients = users.filter(
			(u) => selectedUsers.has(`${u.source}-${u.id}`) && !u.unsubscribed
		);
		if (composeRecipients.length === 0) {
			notifications.warning('No valid recipients selected', 3000);
			return;
		}
		initialSubject = '';
		initialContent = '';
		initialScheduledFor = '';
		showCompose = true;
	}

	// Handle compose modal close
	function handleComposeClose() {
		showCompose = false;
		selectedUsers.clear();
		selectedUsers = selectedUsers;
	}

	// Format date
	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Handle search
	function handleSearch() {
		currentPage = 1;
		fetchUsers();
	}

	// Handle filter change
	function handleFilterChange() {
		currentPage = 1;
		selectedUsers.clear();
		selectAll = false;
		fetchUsers();
	}

	// Reactive: debounced search
	let searchTimeout: ReturnType<typeof setTimeout>;
	$: {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			if (searchQuery !== undefined) {
				handleSearch();
			}
		}, 300);
	}
</script>

<div class="email-dashboard">
	<div class="page-header">
		<h1>Email Dashboard</h1>
		<p class="subtitle">Send emails to users across all sources</p>
	</div>

	<!-- Analytics Summary -->
	<div class="stats-row">
		<div class="stat-chip">
			<span class="stat-label">Sent</span>
			<span class="stat-num">{analytics.total_sent}</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Opened</span>
			<span class="stat-num">{analytics.total_opened}</span>
			<span class="stat-rate">{analytics.open_rate}%</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Clicked</span>
			<span class="stat-num">{analytics.total_clicked}</span>
			<span class="stat-rate">{analytics.click_rate}%</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Unsubscribed</span>
			<span class="stat-num">{analytics.total_unsubscribed}</span>
		</div>
		<!-- Cron Status -->
		{#if cronStatus}
			<div class="stat-chip cron-status">
				<span class="stat-label">Scheduler</span>
				<span class="cron-indicator cron-{cronStatus.health_status}"></span>
				<span class="stat-num cron-text">{cronStatus.health_status}</span>
				{#if cronStatus.last_run_at}
					<span class="cron-time"
						>{new Date(cronStatus.last_run_at).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}</span
					>
				{/if}
			</div>
		{:else}
			<div class="stat-chip cron-status">
				<span class="stat-label">Scheduler</span>
				<span class="cron-indicator cron-not-configured"></span>
				<span class="stat-num cron-text">Not configured</span>
			</div>
		{/if}
	</div>

	<!-- Tabs -->
	<div class="tabs">
		<button class="tab" class:active={activeTab === 'users'} on:click={() => (activeTab = 'users')}>
			Users ({totalUsers})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'drafts'}
			on:click={() => (activeTab = 'drafts')}
		>
			Drafts ({drafts.length})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'scheduled'}
			on:click={() => (activeTab = 'scheduled')}
		>
			Scheduled ({scheduledEmails.length})
		</button>
		<button class="tab" class:active={activeTab === 'sent'} on:click={() => (activeTab = 'sent')}>
			Sent
		</button>
	</div>

	<!-- Users Tab -->
	{#if activeTab === 'users'}
		<div class="section-card">
			<!-- Toolbar -->
			<div class="toolbar">
				<div class="toolbar-left">
					<select bind:value={sourceFilter} on:change={handleFilterChange} class="filter-select">
						<option value="all">All Sources</option>
						<option value="profiles">Profiles</option>
						<option value="signups">Signups</option>
						<option value="coaching_waitlist">Coaching Waitlist</option>
					</select>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search by email or name..."
						class="search-input"
					/>
				</div>
				<div class="toolbar-right">
					{#if selectedUsers.size > 0}
						<button class="btn btn-primary" on:click={openComposeWithSelected}>
							Email {selectedUsers.size} Selected
						</button>
					{/if}
				</div>
			</div>

			<!-- User List -->
			<div class="table-wrapper">
				{#if isLoading}
					<div class="loading">Loading...</div>
				{:else}
					<table class="data-table">
						<thead>
							<tr>
								<th class="checkbox-col">
									<input type="checkbox" checked={selectAll} on:change={toggleSelectAll} />
								</th>
								<th>Email</th>
								<th>Name</th>
								<th>Source</th>
								<th>Enneagram</th>
								<th>Joined</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{#each users as user (user.source + '-' + user.id)}
								<tr class:unsubscribed={user.unsubscribed}>
									<td class="checkbox-col">
										<input
											type="checkbox"
											checked={selectedUsers.has(`${user.source}-${user.id}`)}
											disabled={user.unsubscribed}
											on:change={() => toggleUserSelection(user)}
										/>
									</td>
									<td class="email-cell">{user.email}</td>
									<td>{user.name || '-'}</td>
									<td>
										<span class="source-badge source-{user.source}">
											{user.source === 'coaching_waitlist' ? 'coaching' : user.source}
										</span>
									</td>
									<td>{user.enneagram || '-'}</td>
									<td>{formatDate(user.created_at)}</td>
									<td>
										{#if user.unsubscribed}
											<span class="status-badge status-unsubscribed">Unsubscribed</span>
										{:else}
											<span class="status-badge status-active">Active</span>
										{/if}
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="7" class="empty-state">No users found</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>

			<!-- Pagination -->
			{#if totalUsers > 50}
				<div class="pagination">
					<button
						class="btn btn-secondary"
						disabled={currentPage === 1}
						on:click={() => {
							currentPage--;
							fetchUsers();
						}}
					>
						Previous
					</button>
					<span class="page-info">
						Page {currentPage} of {Math.ceil(totalUsers / 50)}
					</span>
					<button
						class="btn btn-secondary"
						disabled={currentPage >= Math.ceil(totalUsers / 50)}
						on:click={() => {
							currentPage++;
							fetchUsers();
						}}
					>
						Next
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Drafts Tab -->
	{#if activeTab === 'drafts'}
		<div class="section-card">
			<div class="section-header">
				<h2>Saved Drafts</h2>
			</div>
			{#if drafts.length === 0}
				<div class="empty-state">No drafts saved</div>
			{:else}
				<div class="draft-list">
					{#each drafts as draft}
						<div class="draft-item">
							<div class="draft-info">
								<h3>{draft.subject || '(No subject)'}</h3>
								<p>{draft.recipients?.length || 0} recipients</p>
								<span class="draft-date">Updated {formatDate(draft.updated_at)}</span>
							</div>
							<div class="draft-actions">
								<button
									class="btn btn-secondary"
									on:click={() => {
										initialSubject = draft.subject || '';
										initialContent = draft.html_content || '';
										composeRecipients = draft.recipients || [];
										initialScheduledFor = '';
										showCompose = true;
									}}>Edit</button
								>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Scheduled Tab -->
	{#if activeTab === 'scheduled'}
		<div class="section-card">
			<div class="section-header">
				<h2>Scheduled Emails</h2>
			</div>
			{#if scheduledEmails.length === 0}
				<div class="empty-state">No scheduled emails</div>
			{:else}
				<div class="scheduled-list">
					{#each scheduledEmails as scheduled}
						<div class="scheduled-item">
							<div class="scheduled-info">
								<h3>{scheduled.subject}</h3>
								<p>{scheduled.recipients?.length || 0} recipients</p>
								<span class="scheduled-date">
									Scheduled for {new Date(scheduled.scheduled_for).toLocaleString()}
								</span>
							</div>
							<div class="scheduled-status">
								<span class="status-badge status-{scheduled.status}">{scheduled.status}</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Sent Tab -->
	{#if activeTab === 'sent'}
		<div class="section-card">
			<div class="section-header">
				<h2>Sent Emails</h2>
			</div>
			<p class="coming-soon">View sent emails with open/click tracking coming soon...</p>
		</div>
	{/if}
</div>

<!-- Email Compose Modal -->
<EmailComposeModal
	bind:open={showCompose}
	recipients={composeRecipients}
	{initialSubject}
	{initialContent}
	{initialScheduledFor}
	on:close={handleComposeClose}
	on:send={handleComposeClose}
	on:schedule={handleComposeClose}
/>

<style>
	.email-dashboard {
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.75rem;
		margin: 0 0 0.25rem;
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0;
	}

	/* Stats Row */
	.stats-row {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.stat-chip {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-label {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.stat-num {
		font-weight: 600;
		font-size: 1.125rem;
	}

	.stat-rate {
		color: var(--success);
		font-size: 0.75rem;
		background: rgba(34, 197, 94, 0.1);
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
	}

	/* Cron Status */
	.cron-status {
		margin-left: auto;
	}

	.cron-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: inline-block;
	}

	.cron-healthy {
		background: rgb(34, 197, 94);
		box-shadow: 0 0 4px rgb(34, 197, 94);
	}

	.cron-stale {
		background: rgb(234, 179, 8);
		box-shadow: 0 0 4px rgb(234, 179, 8);
	}

	.cron-unhealthy,
	.cron-not-configured {
		background: rgb(239, 68, 68);
		box-shadow: 0 0 4px rgb(239, 68, 68);
	}

	.cron-never_run {
		background: rgb(156, 163, 175);
	}

	.cron-text {
		font-size: 0.8125rem;
		text-transform: capitalize;
	}

	.cron-time {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 0;
	}

	.tab {
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		transition: all 0.2s;
	}

	.tab:hover {
		color: var(--text-primary);
	}

	.tab.active {
		color: var(--primary);
		border-bottom-color: var(--primary);
	}

	/* Section Card */
	.section-card {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
	}

	.section-header {
		margin-bottom: 1rem;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.125rem;
	}

	/* Toolbar */
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.toolbar-left {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-select,
	.search-input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		background: var(--background);
	}

	.search-input {
		min-width: 200px;
	}

	/* Table */
	.table-wrapper {
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.data-table th,
	.data-table td {
		padding: 0.75rem 0.5rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.data-table th {
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.checkbox-col {
		width: 40px;
		text-align: center;
	}

	.email-cell {
		font-family: monospace;
		font-size: 0.8125rem;
	}

	.data-table tr.unsubscribed {
		opacity: 0.5;
	}

	/* Source Badge */
	.source-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.source-profiles {
		background: rgba(99, 102, 241, 0.1);
		color: rgb(99, 102, 241);
	}

	.source-signups {
		background: rgba(34, 197, 94, 0.1);
		color: rgb(34, 197, 94);
	}

	.source-coaching_waitlist {
		background: rgba(249, 115, 22, 0.1);
		color: rgb(249, 115, 22);
	}

	/* Status Badge */
	.status-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.status-active {
		background: rgba(34, 197, 94, 0.1);
		color: rgb(34, 197, 94);
	}

	.status-unsubscribed {
		background: rgba(239, 68, 68, 0.1);
		color: rgb(239, 68, 68);
	}

	.status-pending {
		background: rgba(234, 179, 8, 0.1);
		color: rgb(202, 138, 4);
	}

	.status-completed {
		background: rgba(34, 197, 94, 0.1);
		color: rgb(34, 197, 94);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.page-info {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	/* Buttons */
	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
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

	.btn-primary:hover:not(:disabled) {
		background: var(--primary-dark, #5b4cdb);
	}

	.btn-secondary {
		background: var(--background);
		border: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--hover-background);
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}

	.coming-soon {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
		font-style: italic;
	}

	/* Loading */
	.loading {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}

	/* Drafts & Scheduled Lists */
	.draft-list,
	.scheduled-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.draft-item,
	.scheduled-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--background);
		border-radius: var(--border-radius);
		border: 1px solid var(--border-color);
	}

	.draft-info h3,
	.scheduled-info h3 {
		margin: 0 0 0.25rem;
		font-size: 1rem;
	}

	.draft-info p,
	.scheduled-info p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.draft-date,
	.scheduled-date {
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.toolbar {
			flex-direction: column;
			align-items: stretch;
		}

		.toolbar-left {
			flex-direction: column;
		}

		.search-input {
			min-width: auto;
		}
	}
</style>
