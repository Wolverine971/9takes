<!-- src/routes/admin/analytics/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import {
		ANALYTICS_SCOPES,
		formatDurationMs,
		type AnalyticsScope
	} from '$lib/analytics/pageAnalytics';

	interface AnalyticsOverview {
		total_visits: number;
		unique_visitors: number;
		authenticated_visits: number;
		anonymous_visits: number;
		avg_time_on_page_ms: number;
		median_time_on_page_ms: number;
		bounce_rate: number;
	}

	interface TimeseriesPoint {
		day: string;
		visits: number;
		unique_visitors: number;
		authenticated_visits: number;
		anonymous_visits: number;
		avg_time_on_page_ms: number;
	}

	interface PageRow {
		path: string;
		path_group: string;
		content_type: string;
		visits: number;
		unique_visitors: number;
		authenticated_visits: number;
		anonymous_visits: number;
		avg_time_on_page_ms: number;
		median_time_on_page_ms: number;
		bounce_rate: number;
		total_rows: number;
	}

	interface PaginationState {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}

	let { data }: { data: PageData } = $props();
	const initialFilters = data.filters;
	const initialPagination = data.pagination;
	const initialOverview = data.overview;
	const initialTimeseries = data.timeseries;
	const initialRows = data.rows;

	const defaultOverview: AnalyticsOverview = {
		total_visits: 0,
		unique_visitors: 0,
		authenticated_visits: 0,
		anonymous_visits: 0,
		avg_time_on_page_ms: 0,
		median_time_on_page_ms: 0,
		bounce_rate: 0
	};

	const defaultPagination: PaginationState = {
		total: 0,
		page: 1,
		limit: 50,
		totalPages: 1
	};

	const scopeOptions: Array<{ value: AnalyticsScope; label: string }> = [
		{ value: 'all', label: 'All Pages' },
		{ value: 'blog', label: 'Blog Pages' },
		{ value: 'people', label: 'People' },
		{ value: 'community', label: 'Community' },
		{ value: 'guides', label: 'Guides' },
		{ value: 'enneagram', label: 'Enneagram' },
		{ value: 'pop-culture', label: 'Pop Culture' },
		{ value: 'question', label: 'Questions' },
		{ value: 'other', label: 'Other' }
	];

	let fromDate = $state(initialFilters?.from ?? '');
	let toDate = $state(initialFilters?.to ?? '');
	let scope = $state<AnalyticsScope>(
		(ANALYTICS_SCOPES.includes(initialFilters?.scope as AnalyticsScope)
			? initialFilters?.scope
			: 'all') as AnalyticsScope
	);
	let search = $state('');
	let page = $state(initialPagination?.page ?? 1);

	let loading = $state(false);
	let tableLoading = $state(false);
	let overview = $state<AnalyticsOverview>({ ...defaultOverview, ...(initialOverview ?? {}) });
	let timeseries = $state<TimeseriesPoint[]>((initialTimeseries ?? []) as TimeseriesPoint[]);
	let rows = $state<PageRow[]>((initialRows ?? []) as PageRow[]);
	let pagination = $state<PaginationState>({ ...defaultPagination, ...(initialPagination ?? {}) });

	let visitsChartData = $derived(
		timeseries.map((point) => {
			const date = new Date(point.day);
			return {
				x: date.getTime(),
				y: point.visits,
				label: `${date.toLocaleDateString()}: ${point.visits.toLocaleString()} visits`
			};
		})
	);

	let avgTimeChartData = $derived(
		timeseries.map((point) => {
			const date = new Date(point.day);
			return {
				x: date.getTime(),
				y: Math.round(point.avg_time_on_page_ms / 1000),
				label: `${date.toLocaleDateString()}: ${formatDurationMs(point.avg_time_on_page_ms)} avg time`
			};
		})
	);

	let totalPages = $derived(Math.max(1, pagination.totalPages || 1));
	let canPrev = $derived(page > 1);
	let canNext = $derived(page < totalPages);

	function buildParams(includePaging = false): URLSearchParams {
		const params = new URLSearchParams({
			from: fromDate,
			to: toDate,
			scope
		});
		if (search.trim()) {
			params.set('search', search.trim());
		}
		if (includePaging) {
			params.set('page', String(page));
			params.set('limit', String(pagination.limit || 50));
		}
		return params;
	}

	function isDateRangeValid(): boolean {
		if (!fromDate || !toDate) return false;
		return fromDate <= toDate;
	}

	async function fetchOverviewAndTimeseries() {
		loading = true;
		try {
			const params = buildParams(false).toString();
			const [overviewRes, timeseriesRes] = await Promise.all([
				fetch(`/api/admin/analytics/overview?${params}`),
				fetch(`/api/admin/analytics/timeseries?${params}`)
			]);

			const overviewBody = await overviewRes.json();
			const timeseriesBody = await timeseriesRes.json();

			if (!overviewRes.ok) {
				throw new Error(overviewBody.message || 'Failed to load overview');
			}
			if (!timeseriesRes.ok) {
				throw new Error(timeseriesBody.message || 'Failed to load timeseries');
			}

			overview = { ...defaultOverview, ...(overviewBody.summary ?? {}) };
			timeseries = timeseriesBody.points ?? [];
		} catch (err) {
			console.error('Analytics overview/timeseries fetch error:', err);
			notifications.danger('Failed to load overview analytics', 3000);
		} finally {
			loading = false;
		}
	}

	async function fetchPages() {
		tableLoading = true;
		try {
			const params = buildParams(true).toString();
			const response = await fetch(`/api/admin/analytics/pages?${params}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load page analytics');
			}

			rows = body.rows ?? [];
			pagination = { ...defaultPagination, ...(body.pagination ?? {}) };
		} catch (err) {
			console.error('Analytics pages fetch error:', err);
			notifications.danger('Failed to load page table', 3000);
		} finally {
			tableLoading = false;
		}
	}

	async function applyFilters() {
		if (!isDateRangeValid()) {
			notifications.warning('Please use a valid date range', 3000);
			return;
		}
		page = 1;
		await Promise.all([fetchOverviewAndTimeseries(), fetchPages()]);
	}

	async function resetFilters() {
		fromDate = initialFilters?.from ?? fromDate;
		toDate = initialFilters?.to ?? toDate;
		scope = 'all';
		search = '';
		page = 1;
		await Promise.all([fetchOverviewAndTimeseries(), fetchPages()]);
	}

	async function goToPage(nextPage: number) {
		if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
		page = nextPage;
		await fetchPages();
	}

	function formatBounceRate(value: number): string {
		if (!Number.isFinite(value)) return '0.00%';
		return `${value.toFixed(2)}%`;
	}
</script>

<div class="analytics-page">
	<header class="page-header">
		<div>
			<h1 class="page-title">Analytics</h1>
			<p class="page-subtitle">Visits and time-on-page for all tracked pages</p>
		</div>
	</header>

	<section class="filter-card">
		<div class="filter-grid">
			<label class="field">
				<span>From</span>
				<input type="date" bind:value={fromDate} />
			</label>
			<label class="field">
				<span>To</span>
				<input type="date" bind:value={toDate} />
			</label>
			<label class="field">
				<span>Scope</span>
				<select bind:value={scope}>
					{#each scopeOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
			<label class="field grow">
				<span>Search path</span>
				<input
					type="text"
					placeholder="/personality-analysis/chamath-palihapitiya"
					bind:value={search}
				/>
			</label>
		</div>
		<div class="filter-actions">
			<button class="btn btn-primary" onclick={applyFilters} disabled={loading || tableLoading}>
				Apply
			</button>
			<button class="btn btn-secondary" onclick={resetFilters} disabled={loading || tableLoading}>
				Reset
			</button>
		</div>
	</section>

	<section class="metrics-grid">
		<StatCard icon="👀" label="Visits" value={overview.total_visits} color="primary" />
		<StatCard icon="🧬" label="Unique Visitors" value={overview.unique_visitors} />
		<StatCard
			icon="🔐"
			label="Authenticated Visits"
			value={overview.authenticated_visits}
			color="success"
		/>
		<StatCard icon="🕶️" label="Anonymous Visits" value={overview.anonymous_visits} />
		<StatCard
			icon="⏱️"
			label="Avg Time on Page"
			value={formatDurationMs(overview.avg_time_on_page_ms)}
		/>
		<StatCard
			icon="📉"
			label="Bounce Rate"
			value={formatBounceRate(overview.bounce_rate)}
			color={overview.bounce_rate > 65 ? 'warning' : 'default'}
		/>
	</section>

	<section class="charts-grid">
		<div class="chart-card">
			<LineChart
				data={visitsChartData}
				title="Visits Over Time"
				height={280}
				color="#3b82f6"
				showPoints={true}
				showGrid={true}
				showSummary={true}
				showTrend={true}
			/>
		</div>
		<div class="chart-card">
			<LineChart
				data={avgTimeChartData}
				title="Average Time on Page (Seconds)"
				height={280}
				color="#22c55e"
				showPoints={true}
				showGrid={true}
				showSummary={true}
				showTrend={true}
			/>
		</div>
	</section>

	<section class="table-card">
		<div class="table-header">
			<h2>Page Breakdown (Raw Paths)</h2>
			<div class="table-meta">
				<span>{pagination.total.toLocaleString()} total rows</span>
				<span>Page {page} of {totalPages}</span>
			</div>
		</div>
		<div class="table-wrapper">
			<table class="data-table">
				<thead>
					<tr>
						<th>Path</th>
						<th>Path Group</th>
						<th>Type</th>
						<th class="num">Visits</th>
						<th class="num">Unique</th>
						<th class="num">Auth</th>
						<th class="num">Anon</th>
						<th class="num">Avg Time</th>
						<th class="num">Median</th>
						<th class="num">Bounce</th>
					</tr>
				</thead>
				<tbody>
					{#if tableLoading}
						<tr>
							<td colspan="10" class="empty">Loading...</td>
						</tr>
					{:else if rows.length === 0}
						<tr>
							<td colspan="10" class="empty">No data for this filter set.</td>
						</tr>
					{:else}
						{#each rows as row}
							<tr>
								<td class="path">{row.path}</td>
								<td>{row.path_group}</td>
								<td>{row.content_type}</td>
								<td class="num">{row.visits.toLocaleString()}</td>
								<td class="num">{row.unique_visitors.toLocaleString()}</td>
								<td class="num">{row.authenticated_visits.toLocaleString()}</td>
								<td class="num">{row.anonymous_visits.toLocaleString()}</td>
								<td class="num">{formatDurationMs(row.avg_time_on_page_ms)}</td>
								<td class="num">{formatDurationMs(row.median_time_on_page_ms)}</td>
								<td class="num">{formatBounceRate(row.bounce_rate)}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		<div class="pagination">
			<button class="btn btn-secondary" onclick={() => goToPage(page - 1)} disabled={!canPrev}>
				Previous
			</button>
			<span>Page {page} of {totalPages}</span>
			<button class="btn btn-secondary" onclick={() => goToPage(page + 1)} disabled={!canNext}>
				Next
			</button>
		</div>
	</section>
</div>

<style>
	.analytics-page {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.page-title {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.page-subtitle {
		margin: 6px 0 0;
		color: var(--text-secondary);
	}

	.filter-card,
	.chart-card,
	.table-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 14px;
	}

	.filter-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field.grow {
		grid-column: span 1;
	}

	.field span {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.field input,
	.field select {
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		padding: 8px 10px;
		color: var(--text-primary);
	}

	.filter-actions {
		display: flex;
		gap: 8px;
		margin-top: 10px;
	}

	.btn {
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		padding: 8px 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: #fff;
		border-color: var(--shadow-monarch);
	}

	.btn-secondary {
		background: var(--void-deep);
		color: var(--text-primary);
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 10px;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.table-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.table-header h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.table-meta {
		display: flex;
		gap: 10px;
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.84rem;
	}

	.data-table th,
	.data-table td {
		padding: 10px 10px;
		border-bottom: 1px solid var(--void-elevated);
		text-align: left;
		vertical-align: top;
	}

	.data-table th {
		background: var(--void-deep);
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.data-table .num {
		text-align: right;
		white-space: nowrap;
	}

	.data-table .path {
		max-width: 320px;
		word-break: break-word;
	}

	.data-table tr:hover {
		background: rgba(148, 163, 184, 0.08);
	}

	.empty {
		text-align: center !important;
		color: var(--text-secondary);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 10px;
	}

	@media (max-width: 1200px) {
		.metrics-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.filter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 900px) {
		.charts-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 700px) {
		.metrics-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.filter-grid {
			grid-template-columns: 1fr;
		}

		.table-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
	}
</style>
