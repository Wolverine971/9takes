<!-- src/routes/admin/email-dashboard/+page.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import type {
		EmailRecipient,
		EmailAnalytics,
		EmailDraft,
		EmailSend,
		EmailTrackingEvent,
		ScheduledEmail,
		RecipientSource,
		FetchBatchRecipientsResponse
	} from '$lib/types/email';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailComposeModal from '$lib/components/email/EmailComposeModal.svelte';

	export let data: PageData;

	// State
	let activeTab: 'users' | 'drafts' | 'sent' | 'scheduled' = 'users';
	let users = (data.users || []) as EmailRecipient[];
	let totalUsers = data.totalUsers || 0;
	let drafts = (data.drafts || []) as unknown as EmailDraft[];
	let scheduledEmails = (data.scheduledEmails || []) as unknown as ScheduledEmail[];
	const analyticsDefaults: EmailAnalytics = {
		total_sent: 0,
		total_opened: 0,
		total_clicked: 0,
		total_unsubscribed: 0,
		total_bounced: 0,
		total_failed: 0,
		total_open_count: 0,
		total_click_count: 0,
		open_rate: 0,
		click_rate: 0,
		unsubscribe_rate: 0
	};
	let analytics: EmailAnalytics = { ...analyticsDefaults, ...data.analytics };
	let cronStatus = data.cronStatus;

	// Analytics filter state
	let analyticsRange: 'all' | '7d' | '30d' | '90d' | 'custom' = 'all';
	let analyticsFrom = '';
	let analyticsTo = '';
	let analyticsLoading = false;

	// Selection state
	let selectedUsers = new Set<string>();
	let selectAll = false;

	// Search and filter state
	let searchQuery = '';
	let sourceFilter: 'all' | 'profiles' | 'signups' | 'coaching_waitlist' = 'all';
	let currentPage = 1;
	let isLoading = false;

	// Sent email state
	const sentLimit = 50;
	let sentEmails: EmailSend[] = [];
	let sentTotal = 0;
	let sentPage = 1;
	let sentIsLoading = false;
	let sentSearch = '';
	let sentStatusFilter: 'all' | 'sent' | 'failed' | 'bounced' = 'all';
	let sentSourceFilter: 'all' | 'profiles' | 'signups' | 'coaching_waitlist' = 'all';
	let sentDetailOpen = false;
	let sentDetailLoading = false;
	let sentDetailEmail: EmailSend | null = null;
	let sentDetailEvents: EmailTrackingEvent[] = [];
	let sentDetailRaw = false;

	// Compose modal state
	let showCompose = false;
	let composeRecipients: EmailRecipient[] = [];
	let initialSubject = '';
	let initialContent = '';
	let initialScheduledFor = '';
	let initialDraftId: string | undefined = undefined;
	let loadingBatchRecipients = false;

	const batchSourceOptions: Array<{ value: RecipientSource; label: string }> = [
		{ value: 'profiles', label: 'Profiles' },
		{ value: 'signups', label: 'Signups' },
		{ value: 'coaching_waitlist', label: 'Coaching Waitlist' }
	];
	const allRecipientSources: RecipientSource[] = batchSourceOptions.map((option) => option.value);
	let selectedBatchSources = new Set<RecipientSource>(allRecipientSources);

	const usersPerPage = 50;

	// Fetch users with filters
	async function fetchUsers() {
		isLoading = true;
		try {
			const params = new URLSearchParams({
				source: sourceFilter,
				page: currentPage.toString(),
				limit: usersPerPage.toString()
			});
			if (searchQuery) params.set('search', searchQuery);

			const response = await fetch(`/api/admin/email-dashboard/users?${params}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch users');
			}

			users = result.users || [];
			totalUsers = result.pagination?.total || 0;
			resetSelection();
		} catch (error) {
			console.error('Error fetching users:', error);
			notifications.danger('Failed to fetch users', 3000);
		} finally {
			isLoading = false;
		}
	}

	async function fetchDrafts() {
		try {
			const response = await fetch('/api/admin/email-dashboard/drafts');
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch drafts');
			}

			drafts = result.drafts || [];
		} catch (error) {
			console.error('Error fetching drafts:', error);
			notifications.danger('Failed to fetch drafts', 3000);
		}
	}

	async function fetchScheduledEmails() {
		try {
			const response = await fetch('/api/admin/email-dashboard/schedule?status=pending');
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch scheduled emails');
			}

			scheduledEmails = result.scheduled_emails || [];
		} catch (error) {
			console.error('Error fetching scheduled emails:', error);
			notifications.danger('Failed to fetch scheduled emails', 3000);
		}
	}

	function startOfDay(date: Date): Date {
		const value = new Date(date);
		value.setHours(0, 0, 0, 0);
		return value;
	}

	function endOfDay(date: Date): Date {
		const value = new Date(date);
		value.setHours(23, 59, 59, 999);
		return value;
	}

	function parseDateInput(value: string): Date | null {
		const [year, month, day] = value.split('-').map((part) => Number(part));

		if (!year || !month || !day) {
			return null;
		}

		const parsed = new Date(year, month - 1, day);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	function toLocalDateTimeValue(dateStr: string | null | undefined): string {
		if (!dateStr) return '';

		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return '';

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function getAnalyticsRange(): { fromDate?: string; toDate?: string } {
		if (analyticsRange === 'all') return {};

		if (analyticsRange === 'custom') {
			const fromBase = analyticsFrom ? parseDateInput(analyticsFrom) : null;
			const toBase = analyticsTo ? parseDateInput(analyticsTo) : null;
			const from = fromBase ? startOfDay(fromBase) : null;
			const to = toBase ? endOfDay(toBase) : null;
			return {
				fromDate: from ? from.toISOString() : undefined,
				toDate: to ? to.toISOString() : undefined
			};
		}

		const now = new Date();
		const from = new Date();
		const days = analyticsRange === '7d' ? 7 : analyticsRange === '30d' ? 30 : 90;
		from.setDate(now.getDate() - (days - 1));

		return {
			fromDate: startOfDay(from).toISOString(),
			toDate: now.toISOString()
		};
	}

	async function fetchAnalytics() {
		analyticsLoading = true;
		try {
			const params = new URLSearchParams();
			const { fromDate, toDate } = getAnalyticsRange();
			if (fromDate) params.set('from_date', fromDate);
			if (toDate) params.set('to_date', toDate);

			const response = await fetch(`/api/admin/email-dashboard/analytics?${params}`);
			const result = await response.json();

			if (response.ok) {
				analytics = { ...analyticsDefaults, ...result.summary };
			} else {
				notifications.danger(result.message || 'Failed to fetch analytics', 3000);
			}
		} catch (error) {
			console.error('Error fetching analytics:', error);
			notifications.danger('Failed to fetch analytics', 3000);
		} finally {
			analyticsLoading = false;
		}
	}

	async function applyAnalyticsRange() {
		if (analyticsRange === 'custom' && (!analyticsFrom || !analyticsTo)) {
			notifications.warning('Select a start and end date', 3000);
			return;
		}
		if (analyticsRange === 'custom') {
			const from = parseDateInput(analyticsFrom);
			const to = parseDateInput(analyticsTo);

			if (!from || !to) {
				notifications.warning('Invalid custom date range', 3000);
				return;
			}

			if (from > to) {
				notifications.warning('Start date must be before end date', 3000);
				return;
			}
		}
		await fetchAnalytics();
		if (activeTab === 'sent') {
			sentPage = 1;
			await fetchSentEmails();
		}
	}

	function handleAnalyticsRangeChange() {
		if (analyticsRange !== 'custom') {
			void applyAnalyticsRange();
		}
	}

	async function fetchSentEmails() {
		sentIsLoading = true;
		try {
			const params = new URLSearchParams({
				page: sentPage.toString(),
				limit: sentLimit.toString()
			});

			if (sentSearch) params.set('search', sentSearch);
			if (sentStatusFilter !== 'all') params.set('status', sentStatusFilter);
			if (sentSourceFilter !== 'all') params.set('source', sentSourceFilter);

			const { fromDate, toDate } = getAnalyticsRange();
			if (fromDate) params.set('from_date', fromDate);
			if (toDate) params.set('to_date', toDate);

			const response = await fetch(`/api/admin/email-dashboard/sent?${params}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch sent emails');
			}

			sentEmails = result.emails || [];
			sentTotal = result.pagination?.total || 0;
		} catch (error) {
			console.error('Error fetching sent emails:', error);
			notifications.danger('Failed to fetch sent emails', 3000);
		} finally {
			sentIsLoading = false;
		}
	}

	function handleSentFilterChange() {
		sentPage = 1;
		void fetchSentEmails();
	}

	function handleSentSearchInput() {
		clearTimeout(sentSearchTimeout);
		sentSearchTimeout = setTimeout(() => {
			if (activeTab !== 'sent') return;
			sentPage = 1;
			void fetchSentEmails();
		}, 300);
	}

	async function openSentDetail(email: EmailSend) {
		sentDetailOpen = true;
		sentDetailLoading = true;
		sentDetailEmail = null;
		sentDetailEvents = [];
		sentDetailRaw = false;

		try {
			const response = await fetch(`/api/admin/email-dashboard/sent/${email.id}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch email details');
			}

			sentDetailEmail = result.email;
			sentDetailEvents = result.events || [];
		} catch (error) {
			console.error('Error fetching sent details:', error);
			notifications.danger('Failed to load email details', 3000);
			sentDetailOpen = false;
		} finally {
			sentDetailLoading = false;
		}
	}

	function closeSentDetail() {
		sentDetailOpen = false;
		sentDetailEmail = null;
		sentDetailEvents = [];
	}

	async function copyTrackingId(trackingId: string) {
		try {
			await navigator.clipboard.writeText(trackingId);
			notifications.success('Tracking ID copied', 2000);
		} catch (error) {
			console.error('Error copying tracking ID:', error);
			notifications.warning('Failed to copy tracking ID', 3000);
		}
	}

	function setActiveTab(tab: 'users' | 'drafts' | 'sent' | 'scheduled') {
		activeTab = tab;
		if (tab === 'sent') {
			void fetchSentEmails();
		}
		if (tab === 'drafts') {
			void fetchDrafts();
		}
		if (tab === 'scheduled') {
			void fetchScheduledEmails();
		}
	}

	function resetSelection() {
		selectedUsers.clear();
		selectedUsers = selectedUsers;
		selectAll = false;
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

		const selectableUsers = users.filter((u) => !u.unsubscribed);
		selectAll =
			selectableUsers.length > 0 &&
			selectableUsers.every((u) => selectedUsers.has(`${u.source}-${u.id}`));
	}

	// Toggle select all
	function toggleSelectAll() {
		const selectableUsers = users.filter((u) => !u.unsubscribed);
		const nextSelectAll = !selectAll;

		if (!nextSelectAll) {
			resetSelection();
		} else {
			selectableUsers.forEach((user) => {
				selectedUsers.add(`${user.source}-${user.id}`);
			});
			selectedUsers = selectedUsers;
			selectAll = selectableUsers.length > 0;
		}
	}

	function openComposeWithRecipients(recipients: EmailRecipient[]) {
		composeRecipients = recipients;
		if (composeRecipients.length === 0) {
			notifications.warning('No valid recipients selected', 3000);
			return;
		}
		initialDraftId = undefined;
		initialSubject = '';
		initialContent = '';
		initialScheduledFor = '';
		showCompose = true;
	}

	// Open compose with selected users
	function openComposeWithSelected() {
		const recipients = users.filter(
			(u) => selectedUsers.has(`${u.source}-${u.id}`) && !u.unsubscribed
		);
		openComposeWithRecipients(recipients);
	}

	function getSelectedBatchSources(): RecipientSource[] {
		return batchSourceOptions
			.map((option) => option.value)
			.filter((source) => selectedBatchSources.has(source));
	}

	function toggleBatchSource(source: RecipientSource) {
		const next = new Set(selectedBatchSources);
		if (next.has(source)) {
			next.delete(source);
		} else {
			next.add(source);
		}
		selectedBatchSources = next;
	}

	function selectAllBatchSources() {
		selectedBatchSources = new Set(allRecipientSources);
	}

	function clearBatchSources() {
		selectedBatchSources = new Set();
	}

	async function openComposeWithSourceBatch(sources: RecipientSource[]) {
		if (sources.length === 0) {
			notifications.warning('Select at least one source batch', 3000);
			return;
		}

		loadingBatchRecipients = true;
		try {
			const params = new URLSearchParams({ sources: sources.join(',') });
			const response = await fetch(`/api/admin/email-dashboard/recipients?${params}`);
			const result = (await response.json()) as FetchBatchRecipientsResponse | { message?: string };

			if (!response.ok) {
				const message = 'message' in result ? result.message : undefined;
				throw new Error(message || 'Failed to load recipients');
			}

			const batchResult = result as FetchBatchRecipientsResponse;
			openComposeWithRecipients(batchResult.recipients || []);

			const duplicatesRemoved = batchResult.meta?.duplicates_removed || 0;
			const unsubscribedExcluded = batchResult.meta?.unsubscribed_excluded || 0;
			if (duplicatesRemoved > 0 || unsubscribedExcluded > 0) {
				const parts: string[] = [];
				if (duplicatesRemoved > 0) {
					parts.push(
						`${duplicatesRemoved} duplicate email${duplicatesRemoved === 1 ? '' : 's'} removed`
					);
				}
				if (unsubscribedExcluded > 0) {
					parts.push(
						`${unsubscribedExcluded} unsubscribed recipient${unsubscribedExcluded === 1 ? '' : 's'} excluded`
					);
				}
				notifications.warning(parts.join(' • '), 5000);
			}
		} catch (error) {
			console.error('Error loading source batch recipients:', error);
			notifications.danger('Failed to load recipients for selected sources', 3000);
		} finally {
			loadingBatchRecipients = false;
		}
	}

	async function openComposeWithSelectedBatches() {
		await openComposeWithSourceBatch(getSelectedBatchSources());
	}

	async function openComposeWithEveryone() {
		await openComposeWithSourceBatch(allRecipientSources);
	}

	// Handle compose modal close
	function handleComposeClose() {
		showCompose = false;
		initialDraftId = undefined;
		resetSelection();
	}

	async function handleComposeSend() {
		await fetchAnalytics();
		if (activeTab === 'sent') {
			sentPage = 1;
			await fetchSentEmails();
		}
	}

	async function handleComposeSchedule() {
		await fetchScheduledEmails();
	}

	async function handleComposeSaveDraft() {
		await fetchDrafts();
	}

	// Format date
	function formatDate(dateStr: string | null | undefined): string {
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
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Handle search
	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			void fetchUsers();
		}, 300);
	}

	// Handle filter change
	function handleFilterChange() {
		currentPage = 1;
		resetSelection();
		fetchUsers();
	}

	let searchTimeout: ReturnType<typeof setTimeout> | undefined;
	let sentSearchTimeout: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => {
		if (searchTimeout) clearTimeout(searchTimeout);
		if (sentSearchTimeout) clearTimeout(sentSearchTimeout);
	});
</script>

<div class="email-dashboard">
	<div class="page-header">
		<h1>Email Dashboard</h1>
		<p class="subtitle">Send emails to users across all sources</p>
	</div>

	<!-- Analytics Controls -->
	<div class="analytics-toolbar">
		<div class="analytics-range">
			<label class="analytics-label" for="analytics-range">Date range</label>
			<select
				id="analytics-range"
				bind:value={analyticsRange}
				on:change={handleAnalyticsRangeChange}
				class="filter-select"
			>
				<option value="all">All time</option>
				<option value="7d">Last 7 days</option>
				<option value="30d">Last 30 days</option>
				<option value="90d">Last 90 days</option>
				<option value="custom">Custom</option>
			</select>
		</div>

		{#if analyticsRange === 'custom'}
			<div class="analytics-custom">
				<input
					type="date"
					bind:value={analyticsFrom}
					class="filter-select"
					aria-label="Start date"
				/>
				<input type="date" bind:value={analyticsTo} class="filter-select" aria-label="End date" />
				<button class="btn btn-secondary btn-sm" on:click={applyAnalyticsRange}> Apply </button>
			</div>
		{/if}

		<button
			class="btn btn-secondary btn-sm"
			on:click={applyAnalyticsRange}
			disabled={analyticsLoading}
		>
			{analyticsLoading ? 'Updating...' : 'Refresh'}
		</button>
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
			<span class="stat-rate">{analytics.unsubscribe_rate}%</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Bounced</span>
			<span class="stat-num">{analytics.total_bounced}</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Failed</span>
			<span class="stat-num">{analytics.total_failed}</span>
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
		<button class="tab" class:active={activeTab === 'users'} on:click={() => setActiveTab('users')}>
			Users ({totalUsers})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'drafts'}
			on:click={() => setActiveTab('drafts')}
		>
			Drafts ({drafts.length})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'scheduled'}
			on:click={() => setActiveTab('scheduled')}
		>
			Scheduled ({scheduledEmails.length})
		</button>
		<button class="tab" class:active={activeTab === 'sent'} on:click={() => setActiveTab('sent')}>
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
						on:input={handleSearchInput}
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

			<div class="batch-compose-card">
				<div class="batch-compose-header">
					<h3>Source Batches</h3>
					<p>Compose to all recipients in selected sources</p>
				</div>
				<div class="batch-compose-body">
					<div class="batch-source-options">
						{#each batchSourceOptions as option}
							<label class="batch-source-option">
								<input
									type="checkbox"
									checked={selectedBatchSources.has(option.value)}
									on:change={() => toggleBatchSource(option.value)}
								/>
								<span>{option.label}</span>
							</label>
						{/each}
					</div>
					<div class="batch-compose-actions">
						<button class="btn btn-secondary btn-sm" on:click={selectAllBatchSources}>
							Select All
						</button>
						<button class="btn btn-secondary btn-sm" on:click={clearBatchSources}>Clear</button>
						<button
							class="btn btn-secondary"
							on:click={openComposeWithSelectedBatches}
							disabled={loadingBatchRecipients}
						>
							{loadingBatchRecipients ? 'Loading...' : 'Email Selected Sources'}
						</button>
						<button
							class="btn btn-primary"
							on:click={openComposeWithEveryone}
							disabled={loadingBatchRecipients}
						>
							{loadingBatchRecipients ? 'Loading...' : 'Email Everyone'}
						</button>
					</div>
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
			{#if totalUsers > usersPerPage}
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
						Page {currentPage} of {Math.ceil(totalUsers / usersPerPage)}
					</span>
					<button
						class="btn btn-secondary"
						disabled={currentPage >= Math.ceil(totalUsers / usersPerPage)}
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
										initialDraftId = draft.id || undefined;
										initialSubject = draft.subject || '';
										initialContent = draft.html_content || '';
										composeRecipients = (draft.recipients || []) as EmailRecipient[];
										initialScheduledFor = toLocalDateTimeValue(draft.scheduled_for);
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
			<div class="toolbar">
				<div class="toolbar-left">
					<input
						type="text"
						bind:value={sentSearch}
						placeholder="Search subject or recipient..."
						class="search-input"
						on:input={handleSentSearchInput}
					/>
					<select
						bind:value={sentStatusFilter}
						on:change={handleSentFilterChange}
						class="filter-select"
					>
						<option value="all">All Statuses</option>
						<option value="sent">Sent</option>
						<option value="failed">Failed</option>
						<option value="bounced">Bounced</option>
					</select>
					<select
						bind:value={sentSourceFilter}
						on:change={handleSentFilterChange}
						class="filter-select"
					>
						<option value="all">All Sources</option>
						<option value="profiles">Profiles</option>
						<option value="signups">Signups</option>
						<option value="coaching_waitlist">Coaching Waitlist</option>
					</select>
				</div>
			</div>

			<div class="table-wrapper">
				{#if sentIsLoading}
					<div class="loading">Loading...</div>
				{:else}
					<table class="data-table sent-table">
						<thead>
							<tr>
								<th>Sent</th>
								<th>Subject</th>
								<th>Recipient</th>
								<th>Source</th>
								<th>Status</th>
								<th>Opens</th>
								<th>Clicks</th>
								<th>Unsubscribed</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{#each sentEmails as email (email.id)}
								<tr>
									<td class="sent-date">{formatDateTime(email.sent_at || email.created_at)}</td>
									<td class="subject-cell">{email.subject}</td>
									<td class="recipient-cell">
										<div class="recipient-email">{email.recipient_email}</div>
										{#if email.recipient_name}
											<div class="recipient-name">{email.recipient_name}</div>
										{/if}
									</td>
									<td>
										<span class="source-badge source-{email.recipient_source}">
											{email.recipient_source === 'coaching_waitlist'
												? 'coaching'
												: email.recipient_source}
										</span>
									</td>
									<td>
										<span class="status-badge status-{email.status}">{email.status}</span>
									</td>
									<td>{email.open_count || 0}</td>
									<td>{email.click_count || 0}</td>
									<td>{email.unsubscribed_at ? formatDate(email.unsubscribed_at) : '-'}</td>
									<td class="actions-cell">
										<button class="btn btn-secondary btn-sm" on:click={() => openSentDetail(email)}>
											View
										</button>
										<button
											class="btn btn-secondary btn-sm"
											on:click={() => copyTrackingId(email.tracking_id)}
										>
											Copy ID
										</button>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="9" class="empty-state">No sent emails found</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>

			{#if sentTotal > sentLimit}
				<div class="pagination">
					<button
						class="btn btn-secondary"
						disabled={sentPage === 1}
						on:click={() => {
							sentPage--;
							fetchSentEmails();
						}}
					>
						Previous
					</button>
					<span class="page-info">
						Page {sentPage} of {Math.ceil(sentTotal / sentLimit)}
					</span>
					<button
						class="btn btn-secondary"
						disabled={sentPage >= Math.ceil(sentTotal / sentLimit)}
						on:click={() => {
							sentPage++;
							fetchSentEmails();
						}}
					>
						Next
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

{#if sentDetailOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div class="sent-detail-overlay" role="presentation" on:click|self={closeSentDetail}>
		<div class="sent-detail-panel">
			<div class="sent-detail-header">
				<h2>Sent Email</h2>
				<button class="sent-detail-close" aria-label="Close" on:click={closeSentDetail}>
					&times;
				</button>
			</div>
			<div class="sent-detail-body">
				{#if sentDetailLoading}
					<div class="loading">Loading...</div>
				{:else if sentDetailEmail}
					<div class="sent-detail-section">
						<h3>Overview</h3>
						<div class="detail-grid">
							<div class="detail-row">
								<span class="detail-label">Subject</span>
								<span class="detail-value">{sentDetailEmail.subject}</span>
							</div>
							<div class="detail-row">
								<span class="detail-label">Recipient</span>
								<span class="detail-value">{sentDetailEmail.recipient_email}</span>
							</div>
							<div class="detail-row">
								<span class="detail-label">Campaign</span>
								<span class="detail-value">{sentDetailEmail.campaign_id || '-'}</span>
							</div>
							<div class="detail-row">
								<span class="detail-label">Sent By</span>
								<span class="detail-value">{sentDetailEmail.sent_by || '-'}</span>
							</div>
							<div class="detail-row">
								<span class="detail-label">Sent</span>
								<span class="detail-value">
									{formatDateTime(sentDetailEmail.sent_at || sentDetailEmail.created_at)}
								</span>
							</div>
							<div class="detail-row">
								<span class="detail-label">Status</span>
								<span class="detail-value">
									<span class="status-badge status-{sentDetailEmail.status}">
										{sentDetailEmail.status}
									</span>
								</span>
							</div>
							<div class="detail-row">
								<span class="detail-label">Tracking ID</span>
								<span class="detail-value">{sentDetailEmail.tracking_id}</span>
								<button
									class="btn btn-secondary btn-sm"
									on:click={() => sentDetailEmail && copyTrackingId(sentDetailEmail.tracking_id)}
								>
									Copy
								</button>
							</div>
						</div>
					</div>

					<div class="sent-detail-section">
						<div class="detail-header">
							<h3>Content</h3>
							<button
								class="btn btn-secondary btn-sm"
								on:click={() => (sentDetailRaw = !sentDetailRaw)}
							>
								{sentDetailRaw ? 'Preview' : 'Raw'}
							</button>
						</div>
						{#if sentDetailRaw}
							<pre class="raw-html">{sentDetailEmail.html_content}</pre>
						{:else}
							<div class="email-preview">
								{@html sentDetailEmail.html_content}
							</div>
						{/if}
					</div>

					<div class="sent-detail-section">
						<h3>Events</h3>
						{#if sentDetailEvents.length === 0}
							<div class="empty-state">No tracking events yet</div>
						{:else}
							<div class="event-list">
								{#each sentDetailEvents as event}
									<div class="event-item">
										<span class="event-type">{event.event_type}</span>
										<span class="event-time">{formatDateTime(event.created_at)}</span>
										{#if event.link_url}
											<a class="event-link" href={event.link_url} target="_blank" rel="noreferrer">
												{event.link_url}
											</a>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<div class="empty-state">No email selected</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Email Compose Modal -->
<EmailComposeModal
	bind:open={showCompose}
	recipients={composeRecipients}
	{initialSubject}
	{initialContent}
	{initialScheduledFor}
	{initialDraftId}
	on:close={handleComposeClose}
	on:send={handleComposeSend}
	on:schedule={handleComposeSchedule}
	on:saveDraft={handleComposeSaveDraft}
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

	/* Analytics Toolbar */
	.analytics-toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.analytics-range {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.analytics-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.analytics-custom {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
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

	.batch-compose-card {
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 0.875rem;
		margin-bottom: 1rem;
		background: var(--background);
	}

	.batch-compose-header {
		margin-bottom: 0.75rem;
	}

	.batch-compose-header h3 {
		margin: 0;
		font-size: 0.9375rem;
	}

	.batch-compose-header p {
		margin: 0.25rem 0 0;
		color: var(--text-secondary);
		font-size: 0.75rem;
	}

	.batch-compose-body {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		justify-content: space-between;
	}

	.batch-source-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.batch-source-option {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		padding: 0.35rem 0.65rem;
		font-size: 0.8125rem;
		cursor: pointer;
		user-select: none;
	}

	.batch-source-option input {
		margin: 0;
	}

	.batch-compose-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
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
		font-family: var(--font-mono);
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

	.status-sent,
	.status-delivered {
		background: rgba(34, 197, 94, 0.1);
		color: rgb(34, 197, 94);
	}

	.status-failed {
		background: rgba(239, 68, 68, 0.1);
		color: rgb(239, 68, 68);
	}

	.status-bounced {
		background: rgba(234, 179, 8, 0.1);
		color: rgb(202, 138, 4);
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

	/* Sent Table */
	.sent-table .subject-cell {
		max-width: 280px;
	}

	.sent-date {
		white-space: nowrap;
	}

	.recipient-cell {
		min-width: 180px;
	}

	.recipient-email {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
	}

	.recipient-name {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.actions-cell {
		display: flex;
		gap: 0.5rem;
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

	/* Sent Detail */
	.sent-detail-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.45);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1100;
		padding: 1.5rem;
	}

	.sent-detail-panel {
		width: min(900px, 100%);
		max-height: 90vh;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}

	.sent-detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.sent-detail-body {
		padding: 1.5rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.sent-detail-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary);
	}

	.sent-detail-section h3 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
	}

	.detail-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.detail-label {
		min-width: 100px;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
	}

	.detail-value {
		font-size: 0.875rem;
		color: var(--text-primary);
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.email-preview {
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
		background: #ffffff;
		color: #111111;
		color-scheme: light;
	}

	.email-preview h1,
	.email-preview h2,
	.email-preview h3,
	.email-preview h4,
	.email-preview p,
	.email-preview li,
	.email-preview td,
	.email-preview th,
	.email-preview span,
	.email-preview div {
		color: inherit;
	}

	.email-preview a {
		color: #6c5ce7;
	}

	.raw-html {
		background: var(--background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		white-space: pre-wrap;
		word-break: break-word;
		max-height: 320px;
		overflow: auto;
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-item {
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		background: var(--background);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.event-type {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
	}

	.event-time {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.event-link {
		font-size: 0.75rem;
		color: var(--primary);
		word-break: break-word;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.analytics-toolbar {
			align-items: stretch;
		}

		.analytics-range,
		.analytics-custom {
			width: 100%;
		}

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

		.batch-compose-body {
			flex-direction: column;
			align-items: stretch;
		}

		.batch-compose-actions {
			width: 100%;
		}

		.actions-cell {
			flex-direction: column;
			align-items: flex-start;
		}

		.sent-detail-panel {
			max-height: 100vh;
			border-radius: 0;
		}
	}
</style>
