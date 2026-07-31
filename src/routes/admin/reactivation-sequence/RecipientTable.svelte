<!-- src/routes/admin/reactivation-sequence/RecipientTable.svelte -->
<script lang="ts">
	import { ArrowDown, ArrowUp, ArrowUpDown, Search } from '@lucide/svelte';
	import EmailSubscriptionStatus from '$lib/components/admin/EmailSubscriptionStatus.svelte';
	import type { PageData } from './$types';

	type RecipientFilter = 'all' | 'eligible' | 'queued' | 'opened' | 'clicked' | 'unsubscribed';
	type SortKey =
		'recipient' | 'bucket' | 'lifecycle' | 'progress' | 'engagement' | 'next' | 'latest';
	type SortDirection = 'asc' | 'desc';
	type RecipientSource = 'candidate' | 'enrollment';

	type RecipientRow = {
		id: string;
		source: RecipientSource;
		name: string | null;
		email: string;
		bucket: string | null;
		lifecycle: string;
		isQueued: boolean;
		currentStep: number | null;
		nextStep: number | null;
		messagesSent: number;
		totalOpens: number;
		totalClicks: number;
		unsubscribed: boolean;
		unsubscribedAt: string | null;
		unsubscribeReason: string | null;
		startedAt: string | null;
		ageDays: number | null;
		nextAt: string | null;
		nextSubject: string | null;
		dueNow: boolean;
		latestLabel: string;
		latestAt: string | null;
		exitReason: string | null;
	};

	type FilterDefinition = {
		key: RecipientFilter;
		label: string;
	};

	type SortColumn = {
		key: SortKey;
		label: string;
		defaultDirection: SortDirection;
	};

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let recipientFilter = $state<RecipientFilter>('all');
	let sortKey = $state<SortKey>('lifecycle');
	let sortDirection = $state<SortDirection>('asc');

	const filters: FilterDefinition[] = [
		{ key: 'all', label: 'All' },
		{ key: 'eligible', label: 'Eligible' },
		{ key: 'queued', label: 'Queued' },
		{ key: 'opened', label: 'Opened' },
		{ key: 'clicked', label: 'Clicked' },
		{ key: 'unsubscribed', label: 'Unsubscribed' }
	];

	const sortColumns: SortColumn[] = [
		{ key: 'recipient', label: 'Recipient', defaultDirection: 'asc' },
		{ key: 'bucket', label: 'Bucket', defaultDirection: 'asc' },
		{ key: 'lifecycle', label: 'Lifecycle', defaultDirection: 'asc' },
		{ key: 'progress', label: 'Progress', defaultDirection: 'desc' },
		{ key: 'engagement', label: 'Engagement', defaultDirection: 'desc' },
		{ key: 'next', label: 'Next action', defaultDirection: 'asc' },
		{ key: 'latest', label: 'Latest signal', defaultDirection: 'desc' }
	];

	const lifecycleOrder: Record<string, number> = {
		queued: 0,
		eligible: 1,
		processing: 2,
		active: 3,
		completed: 4,
		re_permissioned: 5,
		reactivated_click: 6,
		exited: 7,
		errored: 8,
		unsubscribed: 9
	};

	let rows = $derived(buildRows(data));
	let filterCounts = $derived({
		all: rows.length,
		eligible: rows.filter((row) => row.source === 'candidate').length,
		queued: rows.filter((row) => row.isQueued).length,
		opened: rows.filter((row) => row.totalOpens > 0).length,
		clicked: rows.filter((row) => row.totalClicks > 0).length,
		unsubscribed: rows.filter((row) => row.unsubscribed).length
	});
	let visibleRows = $derived.by(() => {
		const query = searchQuery.trim().toLocaleLowerCase();
		const matching = rows.filter((row) => {
			const matchesSearch =
				!query ||
				row.email.toLocaleLowerCase().includes(query) ||
				(row.name?.toLocaleLowerCase().includes(query) ?? false);

			if (!matchesSearch) return false;
			if (recipientFilter === 'eligible') return row.source === 'candidate';
			if (recipientFilter === 'queued') return row.isQueued;
			if (recipientFilter === 'opened') return row.totalOpens > 0;
			if (recipientFilter === 'clicked') return row.totalClicks > 0;
			if (recipientFilter === 'unsubscribed') return row.unsubscribed;
			return true;
		});

		return matching.toSorted((a, b) => compareRows(a, b, sortKey, sortDirection));
	});

	function buildRows(pageData: PageData): RecipientRow[] {
		const queueById = new Map(pageData.queue.map((recipient) => [recipient.id, recipient]));
		const activityIds = new Set(pageData.activity.map((recipient) => recipient.id));

		const enrollmentRows: RecipientRow[] = pageData.activity.map((recipient) => {
			const queued = queueById.get(recipient.id);
			const unsubscribed = Boolean(recipient.unsubscribed);
			const isQueued = Boolean(queued);

			return {
				id: `enrollment:${recipient.id}`,
				source: 'enrollment',
				name: recipient.recipient_name,
				email: recipient.recipient_email,
				bucket: recipient.bucket,
				lifecycle: unsubscribed ? 'unsubscribed' : isQueued ? 'queued' : recipient.display_status,
				isQueued,
				currentStep: recipient.current_step_number,
				nextStep: recipient.next_step_number,
				messagesSent: recipient.messages_sent,
				totalOpens: recipient.total_opens,
				totalClicks: recipient.total_clicks,
				unsubscribed,
				unsubscribedAt: recipient.unsubscribed_at,
				unsubscribeReason: recipient.unsubscribe_reason,
				startedAt: recipient.enrolled_at,
				ageDays: null,
				nextAt: queued?.next_send_at ?? recipient.next_send_at,
				nextSubject: queued?.next_step_subject ?? null,
				dueNow: queued?.due_now ?? false,
				latestLabel: getLatestSignalLabel({
					unsubscribedAt: recipient.unsubscribed_at,
					lastEngagedAt: recipient.last_engaged_at,
					lastClickedAt: recipient.last_clicked_at,
					lastOpenedAt: recipient.last_opened_at,
					lastSentAt: recipient.last_sent_at
				}),
				latestAt:
					recipient.last_engaged_at || recipient.last_sent_at || recipient.enrolled_at || null,
				exitReason: recipient.exit_reason
			};
		});

		const queueOnlyRows: RecipientRow[] = pageData.queue
			.filter((recipient) => !activityIds.has(recipient.id))
			.map((recipient) => {
				const unsubscribed = Boolean(recipient.unsubscribed);

				return {
					id: `queue:${recipient.id}`,
					source: 'enrollment',
					name: recipient.recipient_name,
					email: recipient.recipient_email,
					bucket: recipient.bucket,
					lifecycle: unsubscribed ? 'unsubscribed' : 'queued',
					isQueued: true,
					currentStep: recipient.current_step_number,
					nextStep: recipient.next_step_number,
					messagesSent: recipient.messages_sent,
					totalOpens: recipient.total_opens,
					totalClicks: recipient.total_clicks,
					unsubscribed,
					unsubscribedAt: recipient.unsubscribed_at,
					unsubscribeReason: recipient.unsubscribe_reason,
					startedAt: recipient.enrolled_at,
					ageDays: null,
					nextAt: recipient.next_send_at,
					nextSubject: recipient.next_step_subject,
					dueNow: recipient.due_now,
					latestLabel: getLatestSignalLabel({
						unsubscribedAt: recipient.unsubscribed_at,
						lastEngagedAt: recipient.last_engaged_at,
						lastClickedAt: recipient.last_clicked_at,
						lastOpenedAt: recipient.last_opened_at,
						lastSentAt: recipient.last_sent_at
					}),
					latestAt: recipient.last_engaged_at || recipient.last_sent_at || recipient.enrolled_at,
					exitReason: recipient.exit_reason
				};
			});

		const candidateRows: RecipientRow[] = pageData.candidatePreview.candidates.map((candidate) => ({
			id: `candidate:${candidate.userId}`,
			source: 'candidate',
			name: candidate.name || null,
			email: candidate.email,
			bucket: candidate.bucket,
			lifecycle: 'eligible',
			isQueued: false,
			currentStep: null,
			nextStep: 1,
			messagesSent: 0,
			totalOpens: 0,
			totalClicks: 0,
			unsubscribed: false,
			unsubscribedAt: null,
			unsubscribeReason: null,
			startedAt: candidate.created_at,
			ageDays: candidate.age_days,
			nextAt: null,
			nextSubject: candidate.recommended_batch,
			dueNow: false,
			latestLabel: 'Signed up',
			latestAt: candidate.created_at,
			exitReason: null
		}));

		return [...enrollmentRows, ...queueOnlyRows, ...candidateRows];
	}

	function getLatestSignalLabel(values: {
		unsubscribedAt: string | null;
		lastEngagedAt: string | null;
		lastClickedAt: string | null;
		lastOpenedAt: string | null;
		lastSentAt: string | null;
	}): string {
		if (values.lastEngagedAt && values.unsubscribedAt === values.lastEngagedAt) {
			return 'Unsubscribed';
		}
		if (values.lastEngagedAt && values.lastClickedAt === values.lastEngagedAt) return 'Clicked';
		if (values.lastEngagedAt && values.lastOpenedAt === values.lastEngagedAt) return 'Opened';
		if (values.unsubscribedAt) return 'Unsubscribed';
		if (values.lastClickedAt) return 'Clicked';
		if (values.lastOpenedAt) return 'Opened';
		if (values.lastSentAt) return 'Sent';
		return 'Enrolled';
	}

	function compareRows(
		a: RecipientRow,
		b: RecipientRow,
		key: SortKey,
		direction: SortDirection
	): number {
		const aValue = getSortValue(a, key);
		const bValue = getSortValue(b, key);

		if (aValue === null && bValue !== null) return 1;
		if (aValue !== null && bValue === null) return -1;
		if (aValue === null && bValue === null) return a.email.localeCompare(b.email);

		const comparison =
			typeof aValue === 'number' && typeof bValue === 'number'
				? aValue - bValue
				: String(aValue).localeCompare(String(bValue), undefined, {
						numeric: true,
						sensitivity: 'base'
					});
		const directed = direction === 'asc' ? comparison : -comparison;

		return directed || a.email.localeCompare(b.email);
	}

	function getSortValue(row: RecipientRow, key: SortKey): string | number | null {
		if (key === 'recipient') return row.name || row.email;
		if (key === 'bucket') return row.bucket;
		if (key === 'lifecycle') return lifecycleOrder[row.lifecycle] ?? 99;
		if (key === 'progress') return row.currentStep ?? (row.source === 'candidate' ? 0 : null);
		if (key === 'engagement') {
			return row.totalClicks * 1_000_000 + row.totalOpens * 1_000 + row.messagesSent;
		}
		if (key === 'next') {
			if (row.isQueued && row.nextAt) return `0:${dateValue(row.nextAt)}`;
			if (row.source === 'candidate') return `1:${row.nextSubject ?? ''}`;
			if (row.nextAt) return `2:${dateValue(row.nextAt)}`;
			return null;
		}
		return row.latestAt ? dateValue(row.latestAt) : null;
	}

	function dateValue(value: string): number {
		const timestamp = new Date(value).getTime();
		return Number.isNaN(timestamp) ? 0 : timestamp;
	}

	function toggleSort(key: SortKey) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
			return;
		}

		sortKey = key;
		sortDirection = sortColumns.find((column) => column.key === key)?.defaultDirection ?? 'asc';
	}

	function getAriaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
		if (sortKey !== key) return 'none';
		return sortDirection === 'asc' ? 'ascending' : 'descending';
	}

	function getFilterCount(filter: RecipientFilter): number {
		return filterCounts[filter];
	}

	function getLifecycleLabel(lifecycle: string): string {
		if (lifecycle === 're_permissioned') return 'Re-permissioned';
		if (lifecycle === 'reactivated_click') return 'Reactivated';
		return lifecycle.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
	}

	function getLifecycleColor(lifecycle: string): string {
		if (lifecycle === 'queued') return 'var(--lamp-glow)';
		if (lifecycle === 'eligible') return 'var(--data-teal)';
		if (lifecycle === 'active' || lifecycle === 'completed') return 'var(--success)';
		if (lifecycle === 'processing') return 'var(--data-cyan)';
		if (lifecycle === 'errored') return 'var(--error)';
		if (lifecycle === 'unsubscribed' || lifecycle === 'exited') return 'var(--warning)';
		return 'var(--ink-dim)';
	}

	function formatDateTime(dateStr: string | null): string {
		if (!dateStr) return '—';
		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return '—';

		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '—';
		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return '—';

		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function clearFilters() {
		searchQuery = '';
		recipientFilter = 'all';
	}
</script>

<section class="recipient-section">
	<div class="section-header">
		<div>
			<p class="section-kicker">§06 · RECIPIENT PIPELINE</p>
			<h2>Reactivation Recipients</h2>
			<p class="info-note">
				Eligible profiles, queued sends, sequence progress, and response signals in one view. Select
				any column header to sort.
			</p>
		</div>
		<div class="load-summary">
			<strong>{rows.length}</strong>
			<span>loaded records</span>
			{#if data.candidatePreview.totalEligible > filterCounts.eligible}
				<small>
					{filterCounts.eligible} of {data.candidatePreview.totalEligible} eligible profiles loaded
				</small>
			{/if}
		</div>
	</div>

	<div class="recipient-toolbar">
		<label class="search-control">
			<span class="sr-only">Search recipients</span>
			<Search size={16} strokeWidth={2} aria-hidden="true" />
			<input bind:value={searchQuery} type="search" placeholder="Search name or email" />
		</label>

		<div class="recipient-filters" aria-label="Filter reactivation recipients">
			{#each filters as filter (filter.key)}
				<button
					type="button"
					class:active={recipientFilter === filter.key}
					aria-pressed={recipientFilter === filter.key}
					onclick={() => (recipientFilter = filter.key)}
				>
					{filter.label}
					<span>{getFilterCount(filter.key)}</span>
				</button>
			{/each}
		</div>

		<div class="mobile-sort">
			<label>
				<span>Sort by</span>
				<select bind:value={sortKey}>
					{#each sortColumns as column (column.key)}
						<option value={column.key}>{column.label}</option>
					{/each}
				</select>
			</label>
			<button
				type="button"
				aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
				onclick={() => (sortDirection = sortDirection === 'asc' ? 'desc' : 'asc')}
			>
				{#if sortDirection === 'asc'}
					<ArrowUp size={16} aria-hidden="true" />
				{:else}
					<ArrowDown size={16} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</div>

	<div class="table-meta" aria-live="polite">
		<span>Showing {visibleRows.length} of {rows.length} loaded records</span>
		<span>
			Sorted by {sortColumns.find((column) => column.key === sortKey)?.label} ({sortDirection})
		</span>
	</div>

	{#if visibleRows.length === 0}
		<div class="empty-state">
			<strong>No recipients match this view.</strong>
			<span>Try another lifecycle filter or clear the search.</span>
			<button type="button" onclick={clearFilters}>Clear filters</button>
		</div>
	{:else}
		<div class="table-wrapper" role="region" aria-label="Sortable reactivation recipients table">
			<table>
				<caption class="sr-only">
					Loaded eligible profiles and reactivation enrollments, including queue and engagement
					data.
				</caption>
				<thead>
					<tr>
						{#each sortColumns as column (column.key)}
							<th aria-sort={getAriaSort(column.key)}>
								<button
									type="button"
									class:active={sortKey === column.key}
									onclick={() => toggleSort(column.key)}
								>
									<span>{column.label}</span>
									{#if sortKey === column.key}
										{#if sortDirection === 'asc'}
											<ArrowUp size={14} aria-hidden="true" />
										{:else}
											<ArrowDown size={14} aria-hidden="true" />
										{/if}
									{:else}
										<ArrowUpDown size={14} aria-hidden="true" />
									{/if}
								</button>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each visibleRows as row (row.id)}
						<tr class:unsubscribed-row={row.unsubscribed}>
							<td>
								<div class="recipient-cell">
									<strong>{row.name || 'Unnamed recipient'}</strong>
									<span title={row.email}>{row.email}</span>
									<EmailSubscriptionStatus
										unsubscribed={row.unsubscribed}
										unsubscribedAt={row.unsubscribedAt}
										reason={row.unsubscribeReason}
										showActive
									/>
								</div>
							</td>
							<td>
								<span class="bucket">{row.bucket ?? '—'}</span>
							</td>
							<td>
								<span class="lifecycle">
									<span class="status-dot" style:background={getLifecycleColor(row.lifecycle)}
									></span>
									{getLifecycleLabel(row.lifecycle)}
								</span>
							</td>
							<td>
								<div class="stacked-cell">
									{#if row.source === 'candidate'}
										<strong>Not enrolled</strong>
										<span>{row.ageDays}d old · joined {formatDate(row.startedAt)}</span>
									{:else}
										<strong>Step {row.currentStep} of 5</strong>
										<span>{row.messagesSent} sent · enrolled {formatDate(row.startedAt)}</span>
									{/if}
								</div>
							</td>
							<td>
								<div class="engagement-cell">
									<span class:has-signal={row.totalOpens > 0}>
										<strong>{row.totalOpens}</strong> opens
									</span>
									<span class:has-signal={row.totalClicks > 0}>
										<strong>{row.totalClicks}</strong> clicks
									</span>
								</div>
							</td>
							<td>
								<div class="stacked-cell next-cell">
									{#if row.source === 'candidate'}
										<strong>{row.nextSubject}</strong>
										<span>Email 1 queues on enrollment</span>
									{:else if row.isQueued}
										<strong title={row.nextSubject ?? ''}>
											{row.nextSubject ?? `Step ${row.nextStep}`}
										</strong>
										<span class:due={row.dueNow}>{formatDateTime(row.nextAt)}</span>
									{:else if row.nextAt}
										<strong>Step {row.nextStep}</strong>
										<span>{formatDateTime(row.nextAt)}</span>
									{:else}
										<strong>No send queued</strong>
										<span>{row.exitReason || getLifecycleLabel(row.lifecycle)}</span>
									{/if}
								</div>
							</td>
							<td>
								<div class="stacked-cell latest-cell">
									<strong>{row.latestLabel}</strong>
									<span>{formatDateTime(row.latestAt)}</span>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="recipient-cards">
			{#each visibleRows as row (row.id)}
				<article class:unsubscribed-card={row.unsubscribed}>
					<header>
						<div class="recipient-cell">
							<strong>{row.name || 'Unnamed recipient'}</strong>
							<span>{row.email}</span>
						</div>
						<span class="lifecycle">
							<span class="status-dot" style:background={getLifecycleColor(row.lifecycle)}></span>
							{getLifecycleLabel(row.lifecycle)}
						</span>
					</header>

					<div class="card-meta">
						<span class="bucket">{row.bucket ?? '—'}</span>
						<EmailSubscriptionStatus
							unsubscribed={row.unsubscribed}
							unsubscribedAt={row.unsubscribedAt}
							reason={row.unsubscribeReason}
							showActive
						/>
					</div>

					<dl>
						<div>
							<dt>Progress</dt>
							<dd>
								{row.source === 'candidate' ? 'Not enrolled' : `Step ${row.currentStep} of 5`}
							</dd>
						</div>
						<div class:has-signal={row.totalOpens > 0}>
							<dt>Opens</dt>
							<dd>{row.totalOpens}</dd>
						</div>
						<div class:has-signal={row.totalClicks > 0}>
							<dt>Clicks</dt>
							<dd>{row.totalClicks}</dd>
						</div>
					</dl>

					<div class="card-action">
						<span>Next action</span>
						{#if row.source === 'candidate'}
							<strong>{row.nextSubject}</strong>
							<small>Email 1 queues on enrollment</small>
						{:else if row.isQueued}
							<strong>{row.nextSubject ?? `Step ${row.nextStep}`}</strong>
							<small class:due={row.dueNow}>{formatDateTime(row.nextAt)}</small>
						{:else}
							<strong>{row.nextAt ? `Step ${row.nextStep}` : 'No send queued'}</strong>
							<small>{row.nextAt ? formatDateTime(row.nextAt) : row.exitReason || '—'}</small>
						{/if}
					</div>

					<footer>
						<span>{row.latestLabel}</span>
						<strong>{formatDateTime(row.latestAt)}</strong>
					</footer>
				</article>
			{/each}
		</div>
	{/if}
</section>

<style>
	.recipient-section {
		margin-bottom: 1.25rem;
		padding: 1.25rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);
	}

	.section-header,
	.recipient-toolbar,
	.table-meta,
	.recipient-filters,
	.mobile-sort,
	.lifecycle,
	.engagement-cell,
	.card-meta,
	.recipient-cards article header,
	.recipient-cards article footer {
		display: flex;
		align-items: center;
	}

	.section-header {
		justify-content: space-between;
		gap: 1rem;
	}

	h2,
	p {
		margin-top: 0;
	}

	h2 {
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
	}

	.section-kicker {
		margin: 0 0 0.35rem;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.info-note {
		max-width: 52rem;
		margin-bottom: 0;
		color: var(--ink-mid);
		line-height: 1.5;
	}

	.load-summary {
		display: grid;
		min-width: 9rem;
		justify-items: end;
	}

	.load-summary strong {
		font-family: var(--font-mono);
		font-size: 1.5rem;
		line-height: 1;
	}

	.load-summary span,
	.load-summary small,
	.table-meta,
	.stacked-cell span,
	.recipient-cell > span,
	.card-action span,
	.card-action small {
		color: var(--ink-mid);
	}

	.load-summary span,
	.load-summary small {
		font-size: 0.7rem;
	}

	.recipient-toolbar {
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1rem;
		padding: 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-deep);
	}

	.search-control {
		display: flex;
		min-width: min(18rem, 100%);
		align-items: center;
		gap: 0.5rem;
		padding: 0 0.7rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-warm);
		color: var(--ink-mid);
	}

	.recipient-section :global(.search-control:focus-within) {
		border-color: var(--lamp-glow);
		outline: 2px solid color-mix(in srgb, var(--lamp-glow) 22%, transparent);
		outline-offset: 1px;
	}

	.search-control input {
		width: 100%;
		min-height: 2.65rem;
		padding: 0;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--ink-bright);
		font: inherit;
	}

	.recipient-filters {
		flex: 1;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.recipient-filters button,
	.mobile-sort button,
	.empty-state button {
		min-height: 2.65rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-warm);
		color: var(--ink-mid);
		font-weight: 700;
		cursor: pointer;
	}

	.recipient-filters button {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 0.4rem;
		padding: 0 0.7rem;
	}

	.recipient-filters button span {
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.recipient-filters button:hover,
	.recipient-filters button.active,
	.recipient-section :global(.recipient-filters button:focus-visible) {
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
	}

	.recipient-filters button.active {
		background: color-mix(in srgb, var(--lamp-glow) 10%, var(--stone-warm));
	}

	.recipient-section :global(.recipient-filters button:focus-visible),
	.recipient-section :global(.mobile-sort button:focus-visible),
	.recipient-section :global(.empty-state button:focus-visible),
	.recipient-section :global(th button:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.mobile-sort {
		display: none;
		gap: 0.5rem;
	}

	.mobile-sort label {
		display: grid;
		flex: 1;
		gap: 0.25rem;
	}

	.mobile-sort label span {
		color: var(--ink-mid);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.mobile-sort select {
		width: 100%;
		min-height: 2.75rem;
		padding: 0 0.7rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-warm);
		color: var(--ink-bright);
		font: inherit;
	}

	.mobile-sort button {
		display: grid;
		width: 2.75rem;
		place-items: center;
		align-self: end;
		padding: 0;
	}

	.table-meta {
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 0.15rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-deep);
	}

	table {
		width: 100%;
		min-width: 1120px;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--stone-edge);
		text-align: left;
		vertical-align: top;
	}

	th {
		padding-block: 0.35rem;
		background: var(--stone-warm);
	}

	th button {
		display: flex;
		width: 100%;
		min-height: 2.4rem;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-align: left;
		text-transform: uppercase;
		cursor: pointer;
	}

	th button.active,
	th button:hover {
		color: var(--lamp-glow);
	}

	th button :global(svg) {
		flex: 0 0 auto;
	}

	tbody tr:last-child td {
		border-bottom: 0;
	}

	tbody tr:hover {
		background: color-mix(in srgb, var(--lamp-glow) 4%, transparent);
	}

	tbody tr.unsubscribed-row {
		background: color-mix(in srgb, var(--warning) 5%, transparent);
	}

	.recipient-cell,
	.stacked-cell,
	.latest-cell {
		display: grid;
		min-width: 0;
		gap: 0.25rem;
	}

	.recipient-cell {
		max-width: 18rem;
	}

	.recipient-cell strong,
	.recipient-cell > span,
	.next-cell strong {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recipient-cell > span,
	.stacked-cell span {
		font-size: 0.72rem;
	}

	.bucket,
	.lifecycle {
		width: fit-content;
		white-space: nowrap;
	}

	.bucket {
		display: inline-flex;
		padding: 0.25rem 0.5rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--data-teal) 10%, transparent);
		color: var(--data-cyan);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: capitalize;
	}

	.lifecycle {
		gap: 0.4rem;
		font-size: 0.78rem;
		font-weight: 700;
	}

	.status-dot {
		display: inline-block;
		width: 0.55rem;
		height: 0.55rem;
		flex: 0 0 auto;
		border-radius: 999px;
	}

	.engagement-cell {
		gap: 0.4rem;
		white-space: nowrap;
	}

	.engagement-cell span {
		padding: 0.25rem 0.4rem;
		border: 1px solid var(--stone-edge);
		border-radius: 4px;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.engagement-cell span.has-signal {
		border-color: color-mix(in srgb, var(--data-teal) 32%, var(--stone-edge));
		background: color-mix(in srgb, var(--data-teal) 10%, transparent);
		color: var(--data-cyan);
	}

	.next-cell {
		max-width: 19rem;
	}

	.due {
		color: var(--lamp-glow) !important;
		font-weight: 700;
	}

	.recipient-cards {
		display: none;
	}

	.empty-state {
		display: grid;
		justify-items: start;
		gap: 0.4rem;
		padding: 1.25rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-deep);
	}

	.empty-state span {
		color: var(--ink-mid);
	}

	.empty-state button {
		margin-top: 0.5rem;
		padding: 0 0.8rem;
		color: var(--lamp-glow);
	}

	.sr-only {
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

	@media (max-width: 720px) {
		.recipient-section {
			padding: 1rem;
		}

		.section-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.load-summary {
			justify-items: start;
		}

		.recipient-toolbar {
			align-items: stretch;
			flex-direction: column;
		}

		.search-control {
			min-width: 0;
		}

		.search-control input,
		.mobile-sort select {
			font-size: 1rem;
		}

		.recipient-filters {
			width: 100%;
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 0.15rem;
		}

		.mobile-sort {
			display: flex;
		}

		.table-meta {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.25rem;
		}

		.table-wrapper {
			display: none;
		}

		.recipient-cards {
			display: grid;
			gap: 0.75rem;
		}

		.recipient-cards article {
			display: grid;
			gap: 0.75rem;
			min-width: 0;
			padding: 0.9rem;
			border: 1px solid var(--stone-edge);
			border-radius: 16px;
			background: var(--night-deep);
		}

		.recipient-cards article.unsubscribed-card {
			border-color: color-mix(in srgb, var(--warning) 36%, var(--stone-edge));
		}

		.recipient-cards article header,
		.recipient-cards article footer {
			justify-content: space-between;
			gap: 0.75rem;
			min-width: 0;
		}

		.recipient-cards article header {
			align-items: flex-start;
		}

		.recipient-cards article .recipient-cell {
			max-width: min(58vw, 18rem);
		}

		.card-meta {
			justify-content: flex-start;
			gap: 0.5rem;
		}

		.recipient-cards dl {
			display: grid;
			grid-template-columns: minmax(0, 1.5fr) repeat(2, minmax(0, 1fr));
			margin: 0;
			overflow: hidden;
			border: 1px solid var(--stone-edge);
			border-radius: 10px;
		}

		.recipient-cards dl div {
			min-width: 0;
			padding: 0.7rem;
			border-right: 1px solid var(--stone-edge);
		}

		.recipient-cards dl div:last-child {
			border-right: 0;
		}

		.recipient-cards dl div.has-signal {
			background: color-mix(in srgb, var(--data-teal) 8%, transparent);
		}

		.recipient-cards dt {
			color: var(--ink-mid);
			font-family: var(--font-mono);
			font-size: 0.62rem;
			text-transform: uppercase;
		}

		.recipient-cards dd {
			margin: 0.25rem 0 0;
			overflow: hidden;
			font-family: var(--font-mono);
			font-size: 0.9rem;
			font-weight: 700;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.card-action {
			display: grid;
			gap: 0.25rem;
			padding: 0.75rem;
			border: 1px solid var(--stone-edge);
			border-radius: 10px;
		}

		.card-action span {
			font-family: var(--font-mono);
			font-size: 0.62rem;
			font-weight: 700;
			text-transform: uppercase;
		}

		.card-action strong {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.recipient-cards article footer {
			color: var(--ink-mid);
			font-size: 0.7rem;
		}

		.recipient-cards article footer strong {
			color: var(--ink-bright);
			font-weight: 600;
		}
	}
</style>
