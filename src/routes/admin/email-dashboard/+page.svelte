<!-- src/routes/admin/email-dashboard/+page.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import type {
		EmailRecipient,
		EmailAnalytics,
		EmailDraft,
		EmailSend,
		EmailUnsubscribe,
		EmailTrackingEvent,
		ScheduledEmail,
		RecipientSource,
		FetchBatchRecipientsResponse
	} from '$lib/types/email';
	import { notifications } from '$lib/components/molecules/notifications';
	import EmailComposeModal from '$lib/components/email/EmailComposeModal.svelte';

	let { data }: { data: PageData } = $props();

	// State
	let activeTab = $state<'users' | 'drafts' | 'sent' | 'scheduled' | 'unsubscribes'>('users');
	let users = $state((data.users || []) as EmailRecipient[]);
	let totalUsers = $state(data.totalUsers || 0);
	let drafts = $state((data.drafts || []) as unknown as EmailDraft[]);
	let scheduledEmails = $state((data.scheduledEmails || []) as unknown as ScheduledEmail[]);
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
	let analytics = $state<EmailAnalytics>({ ...analyticsDefaults, ...data.analytics });
	let cronStatus = $state(data.cronStatus);
	let welcomeSequence = $derived(data.welcomeSequence);

	// Analytics filter state
	let analyticsRange = $state<'all' | '7d' | '30d' | '90d' | 'custom'>('all');
	let analyticsFrom = $state('');
	let analyticsTo = $state('');
	let analyticsLoading = $state(false);

	// Selection state
	let selectedUsers = $state(new Set<string>());
	let selectAll = $state(false);

	// Search and filter state
	let searchQuery = $state('');
	let sourceFilter = $state<'all' | 'profiles' | 'signups' | 'coaching_waitlist'>('all');
	let currentPage = $state(1);
	let isLoading = $state(false);

	// Sent email state
	const sentLimit = 50;
	let sentEmails = $state<EmailSend[]>([]);
	let sentTotal = $state(0);
	let sentPage = $state(1);
	let sentIsLoading = $state(false);
	let sentSearch = $state('');
	let sentStatusFilter = $state<'all' | 'sent' | 'failed' | 'bounced'>('all');
	let sentSourceFilter = $state<'all' | 'profiles' | 'signups' | 'coaching_waitlist'>('all');
	let sentDetailOpen = $state(false);
	let sentDetailLoading = $state(false);
	let sentDetailEmail = $state<EmailSend | null>(null);
	let sentDetailEvents = $state<EmailTrackingEvent[]>([]);
	let sentDetailRaw = $state(false);

	// Unsubscribe list state
	const unsubLimit = 50;
	let unsubscribes = $state<EmailUnsubscribe[]>([]);
	let unsubTotal = $state(0);
	let unsubPage = $state(1);
	let unsubIsLoading = $state(false);
	let unsubSearch = $state('');

	// Compose modal state
	let showCompose = $state(false);
	let composeRecipients = $state<EmailRecipient[]>([]);
	let initialSubject = $state('');
	let initialContent = $state('');
	let initialScheduledFor = $state('');
	let initialDraftId = $state<string | undefined>(undefined);
	let loadingBatchRecipients = $state(false);

	const batchSourceOptions: Array<{ value: RecipientSource; label: string }> = [
		{ value: 'profiles', label: 'Profiles' },
		{ value: 'signups', label: 'Signups' },
		{ value: 'coaching_waitlist', label: 'Coaching Waitlist' }
	];
	const allRecipientSources: RecipientSource[] = batchSourceOptions.map((option) => option.value);
	let selectedBatchSources = $state(new Set<RecipientSource>(allRecipientSources));

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

	async function fetchUnsubscribes() {
		unsubIsLoading = true;
		try {
			const params = new URLSearchParams({
				page: unsubPage.toString(),
				limit: unsubLimit.toString()
			});
			if (unsubSearch) params.set('search', unsubSearch);

			const response = await fetch(`/api/admin/email-dashboard/unsubscribes?${params}`);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch unsubscribes');
			}

			unsubscribes = result.unsubscribes || [];
			unsubTotal = result.pagination?.total || 0;
		} catch (error) {
			console.error('Error fetching unsubscribes:', error);
			notifications.danger('Failed to fetch unsubscribes', 3000);
		} finally {
			unsubIsLoading = false;
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

	function handleUnsubSearchInput() {
		clearTimeout(unsubSearchTimeout);
		unsubSearchTimeout = setTimeout(() => {
			if (activeTab !== 'unsubscribes') return;
			unsubPage = 1;
			void fetchUnsubscribes();
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

	function setActiveTab(tab: 'users' | 'drafts' | 'sent' | 'scheduled' | 'unsubscribes') {
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
		if (tab === 'unsubscribes') {
			void fetchUnsubscribes();
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
	let unsubSearchTimeout: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => {
		if (searchTimeout) clearTimeout(searchTimeout);
		if (sentSearchTimeout) clearTimeout(sentSearchTimeout);
		if (unsubSearchTimeout) clearTimeout(unsubSearchTimeout);
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
				onchange={handleAnalyticsRangeChange}
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
				<button class="btn btn-secondary btn-sm" onclick={applyAnalyticsRange}> Apply </button>
			</div>
		{/if}

		<button
			class="btn btn-secondary btn-sm"
			onclick={applyAnalyticsRange}
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

	{#if welcomeSequence}
		<div class="sequence-panel">
			<div class="sequence-panel-header">
				<div>
					<h2>{welcomeSequence.sequence.display_name}</h2>
					<p>
						{welcomeSequence.stepCount} steps • trigger: {welcomeSequence.sequence.trigger_type} • status:
						{welcomeSequence.sequence.status}
					</p>
				</div>
			</div>

			<div class="sequence-stats">
				<div class="sequence-stat">
					<span class="sequence-stat-label">Total</span>
					<span class="sequence-stat-value">{welcomeSequence.counts.total}</span>
				</div>
				<div class="sequence-stat">
					<span class="sequence-stat-label">Active</span>
					<span class="sequence-stat-value">{welcomeSequence.counts.active}</span>
				</div>
				<div class="sequence-stat">
					<span class="sequence-stat-label">Due Now</span>
					<span class="sequence-stat-value">{welcomeSequence.counts.dueNow}</span>
				</div>
				<div class="sequence-stat">
					<span class="sequence-stat-label">Completed</span>
					<span class="sequence-stat-value">{welcomeSequence.counts.completed}</span>
				</div>
				<div class="sequence-stat">
					<span class="sequence-stat-label">Exited</span>
					<span class="sequence-stat-value">{welcomeSequence.counts.exited}</span>
				</div>
				<div class="sequence-stat">
					<span class="sequence-stat-label">Errored</span>
					<span class="sequence-stat-value">{welcomeSequence.counts.errored}</span>
				</div>
			</div>

			<div class="table-wrapper">
				{#if welcomeSequence.recentEnrollments.length === 0}
					<div class="empty-state">No welcome-sequence enrollments yet</div>
				{:else}
					<table class="data-table sequence-table">
						<thead>
							<tr>
								<th>Updated</th>
								<th>Recipient</th>
								<th>Source</th>
								<th>Status</th>
								<th>Step</th>
								<th>Next Send</th>
								<th>Exit / Error</th>
							</tr>
						</thead>
						<tbody>
							{#each welcomeSequence.recentEnrollments as enrollment (enrollment.id)}
								<tr>
									<td data-label="Updated">{formatDateTime(enrollment.updated_at)}</td>
									<td class="email-cell" data-label="Recipient">{enrollment.recipient_email}</td>
									<td data-label="Source">
										<span class="source-badge source-{enrollment.recipient_source}">
											{enrollment.recipient_source === 'coaching_waitlist'
												? 'coaching'
												: enrollment.recipient_source}
										</span>
									</td>
									<td data-label="Status">
										<span class="status-badge status-{enrollment.status}">
											{enrollment.status}
										</span>
									</td>
									<td data-label="Step">
										{enrollment.current_step_number}
										{#if enrollment.next_step_number !== null}
											→ {enrollment.next_step_number}
										{/if}
									</td>
									<td data-label="Next send">{formatDateTime(enrollment.next_send_at)}</td>
									<td class="sequence-detail-cell" data-label="Exit / error">
										{#if enrollment.exit_reason}
											<div class="sequence-detail-primary">{enrollment.exit_reason}</div>
										{/if}
										{#if enrollment.last_error}
											<div class="sequence-detail-error">{enrollment.last_error}</div>
										{:else if !enrollment.exit_reason}
											-
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Tabs -->
	<div class="tabs">
		<button class="tab" class:active={activeTab === 'users'} onclick={() => setActiveTab('users')}>
			Users ({totalUsers})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'drafts'}
			onclick={() => setActiveTab('drafts')}
		>
			Drafts ({drafts.length})
		</button>
		<button
			class="tab"
			class:active={activeTab === 'scheduled'}
			onclick={() => setActiveTab('scheduled')}
		>
			Scheduled ({scheduledEmails.length})
		</button>
		<button class="tab" class:active={activeTab === 'sent'} onclick={() => setActiveTab('sent')}>
			Sent
		</button>
		<button
			class="tab"
			class:active={activeTab === 'unsubscribes'}
			onclick={() => setActiveTab('unsubscribes')}
		>
			Unsubscribed ({unsubTotal})
		</button>
	</div>

	<!-- Users Tab -->
	{#if activeTab === 'users'}
		<div class="section-card">
			<!-- Toolbar -->
			<div class="toolbar">
				<div class="toolbar-left">
					<select bind:value={sourceFilter} onchange={handleFilterChange} class="filter-select">
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
						oninput={handleSearchInput}
					/>
				</div>
				<div class="toolbar-right">
					{#if selectedUsers.size > 0}
						<button class="btn btn-primary" onclick={openComposeWithSelected}>
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
									onchange={() => toggleBatchSource(option.value)}
								/>
								<span>{option.label}</span>
							</label>
						{/each}
					</div>
					<div class="batch-compose-actions">
						<button class="btn btn-secondary btn-sm" onclick={selectAllBatchSources}>
							Select All
						</button>
						<button class="btn btn-secondary btn-sm" onclick={clearBatchSources}>Clear</button>
						<button
							class="btn btn-secondary"
							onclick={openComposeWithSelectedBatches}
							disabled={loadingBatchRecipients}
						>
							{loadingBatchRecipients ? 'Loading...' : 'Email Selected Sources'}
						</button>
						<button
							class="btn btn-primary"
							onclick={openComposeWithEveryone}
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
									<input type="checkbox" checked={selectAll} onchange={toggleSelectAll} />
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
									<td class="checkbox-col" data-label="Select">
										<input
											type="checkbox"
											checked={selectedUsers.has(`${user.source}-${user.id}`)}
											disabled={user.unsubscribed}
											onchange={() => toggleUserSelection(user)}
										/>
									</td>
									<td class="email-cell" data-label="Email">{user.email}</td>
									<td data-label="Name">{user.name || '-'}</td>
									<td data-label="Source">
										<span class="source-badge source-{user.source}">
											{user.source === 'coaching_waitlist' ? 'coaching' : user.source}
										</span>
									</td>
									<td data-label="Enneagram">{user.enneagram || '-'}</td>
									<td data-label="Joined">{formatDate(user.created_at)}</td>
									<td data-label="Status">
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
						onclick={() => {
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
						onclick={() => {
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
									onclick={() => {
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
						oninput={handleSentSearchInput}
					/>
					<select
						bind:value={sentStatusFilter}
						onchange={handleSentFilterChange}
						class="filter-select"
					>
						<option value="all">All Statuses</option>
						<option value="sent">Sent</option>
						<option value="failed">Failed</option>
						<option value="bounced">Bounced</option>
					</select>
					<select
						bind:value={sentSourceFilter}
						onchange={handleSentFilterChange}
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
									<td class="sent-date" data-label="Sent">
										{formatDateTime(email.sent_at || email.created_at)}
									</td>
									<td class="subject-cell" data-label="Subject">{email.subject}</td>
									<td class="recipient-cell" data-label="Recipient">
										<div class="recipient-email">{email.recipient_email}</div>
										{#if email.recipient_name}
											<div class="recipient-name">{email.recipient_name}</div>
										{/if}
									</td>
									<td data-label="Source">
										<span class="source-badge source-{email.recipient_source}">
											{email.recipient_source === 'coaching_waitlist'
												? 'coaching'
												: email.recipient_source}
										</span>
									</td>
									<td data-label="Status">
										<span class="status-badge status-{email.status}">{email.status}</span>
									</td>
									<td data-label="Opens">{email.open_count || 0}</td>
									<td data-label="Clicks">{email.click_count || 0}</td>
									<td data-label="Unsubscribed">
										{email.unsubscribed_at ? formatDate(email.unsubscribed_at) : '-'}
									</td>
									<td class="actions-cell" data-label="Actions">
										<button class="btn btn-secondary btn-sm" onclick={() => openSentDetail(email)}>
											View
										</button>
										<button
											class="btn btn-secondary btn-sm"
											onclick={() => copyTrackingId(email.tracking_id)}
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
						onclick={() => {
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
						onclick={() => {
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

	<!-- Unsubscribes Tab -->
	{#if activeTab === 'unsubscribes'}
		<div class="section-card">
			<div class="section-header">
				<h2>Unsubscribed Recipients</h2>
			</div>
			<div class="toolbar">
				<div class="toolbar-left">
					<input
						type="text"
						bind:value={unsubSearch}
						placeholder="Search email, source, or reason..."
						class="search-input"
						oninput={handleUnsubSearchInput}
					/>
				</div>
			</div>

			<div class="table-wrapper">
				{#if unsubIsLoading}
					<div class="loading">Loading...</div>
				{:else}
					<table class="data-table">
						<thead>
							<tr>
								<th>Unsubscribed</th>
								<th>Email</th>
								<th>Source</th>
								<th>Source ID</th>
								<th>Reason</th>
							</tr>
						</thead>
						<tbody>
							{#each unsubscribes as unsubscribe (unsubscribe.id)}
								<tr>
									<td class="unsub-date" data-label="Unsubscribed">
										{formatDateTime(unsubscribe.unsubscribed_at)}
									</td>
									<td class="unsub-email" data-label="Email">{unsubscribe.email}</td>
									<td data-label="Source">{unsubscribe.source || '-'}</td>
									<td class="email-cell" data-label="Source ID">{unsubscribe.source_id || '-'}</td>
									<td class="unsub-reason" data-label="Reason">{unsubscribe.reason || '-'}</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="empty-state">No unsubscribes found</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>

			{#if unsubTotal > unsubLimit}
				<div class="pagination">
					<button
						class="btn btn-secondary"
						disabled={unsubPage === 1}
						onclick={() => {
							unsubPage--;
							fetchUnsubscribes();
						}}
					>
						Previous
					</button>
					<span class="page-info">
						Page {unsubPage} of {Math.ceil(unsubTotal / unsubLimit)}
					</span>
					<button
						class="btn btn-secondary"
						disabled={unsubPage >= Math.ceil(unsubTotal / unsubLimit)}
						onclick={() => {
							unsubPage++;
							fetchUnsubscribes();
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
	<div
		class="sent-detail-overlay"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeSentDetail();
		}}
	>
		<div class="sent-detail-panel">
			<div class="sent-detail-header">
				<h2>Sent Email</h2>
				<button class="sent-detail-close" aria-label="Close" onclick={closeSentDetail}>
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
									onclick={() => sentDetailEmail && copyTrackingId(sentDetailEmail.tracking_id)}
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
								onclick={() => (sentDetailRaw = !sentDetailRaw)}
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
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
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
		color: #22c55e;
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

	.sequence-panel {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1.25rem;
	}

	.sequence-panel-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.sequence-panel-header h2 {
		margin: 0;
		font-size: 1.125rem;
	}

	.sequence-panel-header p {
		margin: 0.25rem 0 0;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.sequence-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.sequence-stat {
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sequence-stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.sequence-stat-value {
		font-size: 1.125rem;
		font-weight: 600;
	}

	.sequence-table {
		font-size: 0.875rem;
	}

	.sequence-detail-cell {
		min-width: 220px;
	}

	.sequence-detail-primary {
		font-weight: 500;
	}

	.sequence-detail-error {
		color: #fca5a5;
		font-size: 0.8125rem;
		margin-top: 0.25rem;
		white-space: normal;
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--bg-elevated);
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
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
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
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		font-size: 0.875rem;
		background: var(--bg-deep);
	}

	.search-input {
		min-width: 200px;
	}

	.batch-compose-card {
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 0.875rem;
		margin-bottom: 1rem;
		background: var(--bg-deep);
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
		border: 1px solid var(--bg-elevated);
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
		border-bottom: 1px solid var(--bg-elevated);
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

	.status-processing {
		background: rgba(251, 113, 133, 0.1);
		color: rgb(59, 130, 246);
	}

	.status-paused,
	.status-exited,
	.status-bounced {
		background: rgba(234, 179, 8, 0.1);
		color: rgb(202, 138, 4);
	}

	.status-errored,
	.status-cancelled {
		background: rgba(239, 68, 68, 0.1);
		color: rgb(239, 68, 68);
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

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--bg-elevated);
	}

	.page-info {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	/* Buttons */
	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 12px;
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
		opacity: 0.85;
	}

	.btn-secondary {
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		color: var(--text-primary);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--bg-elevated);
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

	.unsub-date {
		white-space: nowrap;
	}

	.unsub-email {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
	}

	.unsub-reason {
		max-width: 360px;
		word-break: break-word;
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
		background: var(--bg-deep);
		border-radius: 12px;
		border: 1px solid var(--bg-elevated);
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
		color: var(--text-secondary);
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
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		box-shadow: var(--glow-md);
		display: flex;
		flex-direction: column;
	}

	.sent-detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--bg-elevated);
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
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
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
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
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
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		background: var(--bg-deep);
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
		.tabs {
			overflow-x: auto;
			padding-bottom: 0.25rem;
			-webkit-overflow-scrolling: touch;
		}

		.tab {
			flex: 0 0 auto;
			white-space: nowrap;
		}

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

		.table-wrapper {
			overflow: visible;
		}

		.sequence-table,
		.data-table {
			min-width: 0;
		}

		.data-table thead {
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

		.data-table,
		.data-table tbody,
		.data-table tr {
			display: block;
		}

		.data-table tbody {
			display: grid;
			gap: 0.8rem;
		}

		.data-table tr {
			border: 1px solid var(--bg-elevated);
			border-radius: 12px;
			background: color-mix(in srgb, var(--bg-deep) 58%, var(--bg-surface));
			padding: 0.9rem;
		}

		.data-table td {
			display: grid;
			grid-template-columns: minmax(90px, 0.9fr) minmax(0, 1fr);
			gap: 0.75rem;
			padding: 0;
			border-bottom: none;
			align-items: start;
		}

		.data-table td + td {
			margin-top: 0.7rem;
		}

		.data-table td::before {
			content: attr(data-label);
			font-size: 0.62rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-secondary);
		}

		.data-table td.empty-state {
			display: block;
		}

		.data-table td.empty-state::before {
			content: none;
		}

		.data-table td.checkbox-col,
		.data-table td.actions-cell {
			grid-template-columns: 1fr;
		}

		.data-table td.checkbox-col::before,
		.data-table td.actions-cell::before {
			margin-bottom: 0.1rem;
		}

		.sent-table .subject-cell,
		.recipient-cell,
		.unsub-reason {
			max-width: none;
			min-width: 0;
			white-space: normal;
			word-break: break-word;
		}

		.recipient-email,
		.unsub-email,
		.email-cell {
			overflow-wrap: anywhere;
			word-break: break-word;
		}

		.sent-date,
		.unsub-date {
			white-space: normal;
		}

		.sent-detail-panel {
			max-height: 100vh;
			border-radius: 0;
		}
	}
</style>
