<script lang="ts">
	import { notifications } from '$lib/components/molecules/notifications';
	import { formatDurationMs } from '$lib/analytics/pageAnalytics';

	interface CohortOverviewRow {
		entry_surface: string;
		new_visitors: number;
		commented_within_d7: number;
		comment_rate_pct: number;
		signed_up_within_d7: number;
		signup_rate_pct: number;
		registered_within_d7: number;
		registration_rate_pct: number;
		retained_d1: number;
		retained_d1_denominator: number;
		retained_d1_pct: number;
		retained_d7: number;
		retained_d7_denominator: number;
		retained_d7_pct: number;
		retained_d30: number;
		retained_d30_denominator: number;
		retained_d30_pct: number;
		avg_engaged_minutes_within_d7: number;
	}

	interface CohortRetentionRow {
		cohort_week: string;
		new_visitors: number;
		retained_d1: number;
		retained_d1_denominator: number;
		retained_d1_pct: number;
		retained_d3: number;
		retained_d3_denominator: number;
		retained_d3_pct: number;
		retained_d7: number;
		retained_d7_denominator: number;
		retained_d7_pct: number;
		retained_d14: number;
		retained_d14_denominator: number;
		retained_d14_pct: number;
		retained_d30: number;
		retained_d30_denominator: number;
		retained_d30_pct: number;
	}

	interface AcquisitionMixRow {
		cohort_week: string;
		acquisition_source: string;
		new_visitors: number;
	}

	interface NextPathRow {
		next_path: string;
		visitor_count: number;
		share_pct: number;
		avg_engaged_ms: number;
	}

	interface CohortFilters {
		from: string;
		to: string;
		entrySurface: string;
		acquisitionSource: string;
	}

	interface CohortData {
		available: boolean;
		overview: CohortOverviewRow[];
		retentionCurve: CohortRetentionRow[];
		acquisitionMix: AcquisitionMixRow[];
		nextPaths: NextPathRow[];
	}

	let { filters, cohorts }: { filters: CohortFilters; cohorts: CohortData } = $props();

	const entrySurfaceOptions = [
		{ value: '', label: 'All surfaces' },
		{ value: 'home', label: 'Home' },
		{ value: 'people', label: 'People' },
		{ value: 'community', label: 'Community' },
		{ value: 'guides', label: 'Guides' },
		{ value: 'enneagram', label: 'Enneagram' },
		{ value: 'pop-culture', label: 'Pop Culture' },
		{ value: 'question', label: 'Question' },
		{ value: 'other', label: 'Other' }
	];
	const defaultNextPathLimit = 12;

	let fromDate = $state(filters?.from ?? '');
	let toDate = $state(filters?.to ?? '');
	let entrySurface = $state(filters?.entrySurface ?? '');
	let acquisitionSource = $state(filters?.acquisitionSource ?? '');
	let available = $state(Boolean(cohorts?.available));
	let loading = $state(false);
	let overview = $state<CohortOverviewRow[]>(cohorts?.overview ?? []);
	let retentionCurve = $state<CohortRetentionRow[]>(cohorts?.retentionCurve ?? []);
	let acquisitionMix = $state<AcquisitionMixRow[]>(cohorts?.acquisitionMix ?? []);
	let nextPaths = $state<NextPathRow[]>(cohorts?.nextPaths ?? []);

	function formatPct(value: number, denominator?: number): string {
		if (denominator !== undefined && denominator <= 0) return '—';
		if (!Number.isFinite(value)) return '0.0%';
		return `${value.toFixed(1)}%`;
	}

	function formatWeek(dateStr: string): string {
		if (!dateStr) return '—';
		const date = new Date(`${dateStr}T00:00:00`);
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}

	function formatWeekRange(weekStart: string): string {
		if (!weekStart) return '—';
		const start = new Date(`${weekStart}T00:00:00`);
		const end = new Date(start);
		end.setDate(end.getDate() + 6);
		return `${formatWeek(weekStart)} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
	}

	function formatCountWithPct(count: number, pct: number, denominator?: number): string {
		return `${count.toLocaleString()} (${formatPct(pct, denominator)})`;
	}

	function isLowSample(value: number): boolean {
		return value > 0 && value < 25;
	}

	function buildParams(): URLSearchParams {
		const params = new URLSearchParams({
			from: fromDate,
			to: toDate,
			nextPathLimit: String(defaultNextPathLimit)
		});

		if (entrySurface) {
			params.set('entrySurface', entrySurface);
		}
		if (acquisitionSource) {
			params.set('acquisitionSource', acquisitionSource);
		}

		return params;
	}

	function getAcquisitionOptions(rows: AcquisitionMixRow[]): Array<{ value: string; label: string }> {
		const values = [...new Set(rows.map((row) => row.acquisition_source).filter(Boolean))].sort();
		return [
			{ value: '', label: 'All sources' },
			...values.map((value) => ({ value, label: value }))
		];
	}

	const initialFilters = { ...filters };

	async function fetchCohorts() {
		loading = true;
		try {
			const response = await fetch(`/api/admin/analytics/cohorts?${buildParams().toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load cohort analytics');
			}

			available = Boolean(body.available);
			overview = (body.overview ?? []) as CohortOverviewRow[];
			retentionCurve = (body.retentionCurve ?? []) as CohortRetentionRow[];
			acquisitionMix = (body.acquisitionMix ?? []) as AcquisitionMixRow[];
			nextPaths = (body.nextPaths ?? []) as NextPathRow[];

			if (acquisitionSource) {
				const exists = (body.acquisitionMix ?? []).some(
					(row: AcquisitionMixRow) => row.acquisition_source === acquisitionSource
				);
				if (!exists) {
					acquisitionSource = '';
				}
			}
		} catch (err) {
			console.error('Failed to fetch cohort analytics:', err);
			notifications.danger('Failed to load cohort analytics', 3000);
		} finally {
			loading = false;
		}
	}

	async function applyFilters() {
		if (!fromDate || !toDate || fromDate > toDate) {
			notifications.warning('Please use a valid cohort date range', 3000);
			return;
		}

		await fetchCohorts();
	}

	async function resetFilters() {
		fromDate = initialFilters.from ?? fromDate;
		toDate = initialFilters.to ?? toDate;
		entrySurface = initialFilters.entrySurface ?? '';
		acquisitionSource = initialFilters.acquisitionSource ?? '';
		await fetchCohorts();
	}

	let acquisitionOptions = $derived(getAcquisitionOptions(acquisitionMix));
	let totalNewVisitors = $derived(overview.reduce((sum, row) => sum + row.new_visitors, 0));
	let totalCommented = $derived(overview.reduce((sum, row) => sum + row.commented_within_d7, 0));
	let totalSignedUp = $derived(overview.reduce((sum, row) => sum + row.signed_up_within_d7, 0));
	let totalRegistered = $derived(overview.reduce((sum, row) => sum + row.registered_within_d7, 0));
	let totalD7Numerator = $derived(overview.reduce((sum, row) => sum + row.retained_d7, 0));
	let totalD7Denominator = $derived(
		overview.reduce((sum, row) => sum + row.retained_d7_denominator, 0)
	);
	let summaryCards = $derived([
		{
			label: 'New visitors',
			value: totalNewVisitors.toLocaleString(),
			note: 'Across the selected cohort weeks'
		},
		{
			label: 'Comment within 7d',
			value: formatCountWithPct(
				totalCommented,
				totalNewVisitors > 0 ? (totalCommented / totalNewVisitors) * 100 : 0,
				totalNewVisitors
			),
			note: 'First comment milestone'
		},
		{
			label: 'Signup within 7d',
			value: formatCountWithPct(
				totalSignedUp,
				totalNewVisitors > 0 ? (totalSignedUp / totalNewVisitors) * 100 : 0,
				totalNewVisitors
			),
			note: 'Email capture milestone'
		},
		{
			label: 'Registered within 7d',
			value: formatCountWithPct(
				totalRegistered,
				totalNewVisitors > 0 ? (totalRegistered / totalNewVisitors) * 100 : 0,
				totalNewVisitors
			),
			note: 'Account creation milestone'
		},
		{
			label: 'D7 retention',
			value: formatCountWithPct(
				totalD7Numerator,
				totalD7Denominator > 0 ? (totalD7Numerator / totalD7Denominator) * 100 : 0,
				totalD7Denominator
			),
			note: 'Only mature cohorts count'
		}
	]);
</script>

<section class="filter-card">
	<div class="filter-grid cohort-filter-grid">
		<label class="field">
			<span>Cohort from</span>
			<input type="date" bind:value={fromDate} />
		</label>
		<label class="field">
			<span>Cohort to</span>
			<input type="date" bind:value={toDate} />
		</label>
		<label class="field">
			<span>Entry surface</span>
			<select bind:value={entrySurface}>
				{#each entrySurfaceOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
		<label class="field">
			<span>Acquisition source</span>
			<select bind:value={acquisitionSource}>
				{#each acquisitionOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
	</div>
	<div class="filter-actions">
		<button class="btn btn-primary" onclick={applyFilters} disabled={loading}>Apply</button>
		<button class="btn btn-secondary" onclick={resetFilters} disabled={loading}>Reset</button>
	</div>
	<p class="cohort-note">
		Weekly cohorts, Monday-Sunday, `America/New_York`. D7 and D30 stay muted until the cohort
		window is mature.
	</p>
</section>

{#if !available}
	<section class="panel-card">
		<div class="empty-panel">
			Retention RPCs are not available yet. Apply the retention migration before using this tab.
		</div>
	</section>
{:else}
	<section class="summary-grid">
		{#each summaryCards as card}
			<article class="summary-card">
				<span class="summary-label">{card.label}</span>
				<strong class="summary-value">{card.value}</strong>
				<span class="summary-note">{card.note}</span>
			</article>
		{/each}
	</section>

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>Entry Surface Overview</h2>
				<p>Count plus percentage. Surfaces under 25 new visitors are marked low-sample.</p>
			</div>
			{#if loading}
				<span class="loading-pill">Updating...</span>
			{/if}
		</div>

		<div class="table-wrapper">
			<table class="data-table cohort-table">
				<thead>
					<tr>
						<th>Surface</th>
						<th class="num">New visitors</th>
						<th class="num">Comment 7d</th>
						<th class="num">Signup 7d</th>
						<th class="num">Registered 7d</th>
						<th class="num">D1</th>
						<th class="num">D7</th>
						<th class="num">D30</th>
						<th class="num">Avg engaged</th>
					</tr>
				</thead>
				<tbody>
					{#if overview.length === 0}
						<tr>
							<td colspan="9" class="empty">No cohort rows for this filter set.</td>
						</tr>
					{:else}
						{#each overview as row}
							<tr>
								<td>
									<div class="surface-cell">
										<span>{row.entry_surface}</span>
										{#if isLowSample(row.new_visitors)}
											<span class="sample-pill">Low sample</span>
										{/if}
									</div>
								</td>
								<td class="num">{row.new_visitors.toLocaleString()}</td>
								<td class="num">
									{formatCountWithPct(
										row.commented_within_d7,
										row.comment_rate_pct,
										row.new_visitors
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.signed_up_within_d7,
										row.signup_rate_pct,
										row.new_visitors
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.registered_within_d7,
										row.registration_rate_pct,
										row.new_visitors
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.retained_d1,
										row.retained_d1_pct,
										row.retained_d1_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.retained_d7,
										row.retained_d7_pct,
										row.retained_d7_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.retained_d30,
										row.retained_d30_pct,
										row.retained_d30_denominator
									)}
								</td>
								<td class="num">{row.avg_engaged_minutes_within_d7.toFixed(1)}m</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</section>

	<section class="two-up-grid">
		<article class="panel-card">
			<div class="panel-header">
				<div>
					<h2>Weekly Retention</h2>
					<p>Exact-day retention by cohort week.</p>
				</div>
			</div>

			<div class="table-wrapper">
				<table class="data-table cohort-table">
					<thead>
						<tr>
							<th>Week</th>
							<th class="num">Cohort</th>
							<th class="num">D1</th>
							<th class="num">D3</th>
							<th class="num">D7</th>
							<th class="num">D14</th>
							<th class="num">D30</th>
						</tr>
					</thead>
					<tbody>
						{#if retentionCurve.length === 0}
							<tr>
								<td colspan="7" class="empty">No weekly retention rows yet.</td>
							</tr>
						{:else}
							{#each retentionCurve as row}
								<tr>
									<td>{formatWeekRange(row.cohort_week)}</td>
									<td class="num">{row.new_visitors.toLocaleString()}</td>
									<td class="num">
										{formatCountWithPct(
											row.retained_d1,
											row.retained_d1_pct,
											row.retained_d1_denominator
										)}
									</td>
									<td class="num">
										{formatCountWithPct(
											row.retained_d3,
											row.retained_d3_pct,
											row.retained_d3_denominator
										)}
									</td>
									<td class="num">
										{formatCountWithPct(
											row.retained_d7,
											row.retained_d7_pct,
											row.retained_d7_denominator
										)}
									</td>
									<td class="num">
										{formatCountWithPct(
											row.retained_d14,
											row.retained_d14_pct,
											row.retained_d14_denominator
										)}
									</td>
									<td class="num">
										{formatCountWithPct(
											row.retained_d30,
											row.retained_d30_pct,
											row.retained_d30_denominator
										)}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</article>

		<article class="panel-card">
			<div class="panel-header">
				<div>
					<h2>Acquisition Mix</h2>
					<p>Weekly new-visitor counts by normalized first-touch source.</p>
				</div>
			</div>

			<div class="table-wrapper">
				<table class="data-table cohort-table">
					<thead>
						<tr>
							<th>Week</th>
							<th>Source</th>
							<th class="num">New visitors</th>
						</tr>
					</thead>
					<tbody>
						{#if acquisitionMix.length === 0}
							<tr>
								<td colspan="3" class="empty">No acquisition rows for this range.</td>
							</tr>
						{:else}
							{#each acquisitionMix as row}
								<tr>
									<td>{formatWeekRange(row.cohort_week)}</td>
									<td>{row.acquisition_source}</td>
									<td class="num">{row.new_visitors.toLocaleString()}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</article>
	</section>

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>First-Session Next Paths</h2>
				<p>The second pageview in the first tracked session for the selected cohorts.</p>
			</div>
		</div>

		<div class="table-wrapper">
			<table class="data-table cohort-table">
				<thead>
					<tr>
						<th>Next path</th>
						<th class="num">Visitors</th>
						<th class="num">Share</th>
						<th class="num">Avg engaged</th>
					</tr>
				</thead>
				<tbody>
					{#if nextPaths.length === 0}
						<tr>
							<td colspan="4" class="empty">No next-path rows for this range.</td>
						</tr>
					{:else}
						{#each nextPaths as row}
							<tr>
								<td>{row.next_path}</td>
								<td class="num">{row.visitor_count.toLocaleString()}</td>
								<td class="num">{formatPct(row.share_pct)}</td>
								<td class="num">{formatDurationMs(row.avg_engaged_ms)}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</section>
{/if}

<style>
	.filter-card,
	.panel-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 14px;
	}

	.cohort-filter-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field span {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.field input,
	.field select {
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
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
		border: 1px solid var(--bg-elevated);
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
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
		color: #fff;
		border-color: var(--primary);
	}

	.btn-secondary {
		background: var(--bg-deep);
		color: var(--text-primary);
	}

	.cohort-note {
		margin: 10px 0 0;
		font-size: 0.82rem;
		color: var(--text-secondary);
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 10px;
	}

	.summary-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 12px;
		padding: 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.summary-label {
		font-size: 0.78rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.summary-value {
		font-size: 1.1rem;
		color: var(--text-primary);
	}

	.summary-note {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.two-up-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.panel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.panel-header h2 {
		margin: 0;
		font-size: 1.05rem;
	}

	.panel-header p {
		margin: 4px 0 0;
		font-size: 0.84rem;
		color: var(--text-secondary);
	}

	.table-wrapper {
		overflow-x: auto;
	}

	.cohort-table td,
	.cohort-table th {
		vertical-align: middle;
	}

	.surface-cell {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.sample-pill,
	.loading-pill {
		font-size: 0.72rem;
		padding: 4px 8px;
		border-radius: 999px;
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
		white-space: nowrap;
	}

	.loading-pill {
		background: rgba(59, 130, 246, 0.14);
		color: #93c5fd;
	}

	.empty-panel {
		padding: 14px;
		border: 1px dashed var(--bg-elevated);
		border-radius: 10px;
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	@media (max-width: 1100px) {
		.summary-grid,
		.cohort-filter-grid,
		.two-up-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 700px) {
		.summary-grid,
		.cohort-filter-grid,
		.two-up-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
