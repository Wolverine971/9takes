<!-- src/lib/components/admin/RetentionAnalyticsPanel.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { formatDurationMs } from '$lib/analytics/pageAnalytics';
	import {
		buildAcquisitionMixChart,
		formatAcquisitionSourceLabel,
		type AcquisitionMixRow
	} from './acquisitionMixChart';

	interface CohortOverviewRow {
		entry_surface: string;
		new_visitors: number;
		commented_within_d7: number;
		comment_rate_denominator: number;
		comment_rate_pct: number;
		signed_up_within_d7: number;
		signup_rate_denominator: number;
		signup_rate_pct: number;
		registered_within_d7: number;
		registration_rate_denominator: number;
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

	interface SourceOverviewRow {
		acquisition_source: string;
		new_visitors: number;
		commented_within_d7: number;
		comment_rate_denominator: number;
		comment_rate_pct: number;
		signed_up_within_d7: number;
		signup_rate_denominator: number;
		signup_rate_pct: number;
		registered_within_d7: number;
		registration_rate_denominator: number;
		registration_rate_pct: number;
		retained_d7: number;
		retained_d7_denominator: number;
		retained_d7_pct: number;
		avg_engaged_minutes_within_d7: number;
	}

	interface WeeklyCohortRow {
		cohort_week: string;
		cohort_week_end: string;
		new_visitors: number;
		commented_within_d7: number;
		comment_rate_denominator: number;
		comment_rate_pct: number;
		signed_up_within_d7: number;
		signup_rate_denominator: number;
		signup_rate_pct: number;
		registered_within_d7: number;
		registration_rate_denominator: number;
		registration_rate_pct: number;
		retained_d1: number;
		retained_d1_denominator: number;
		retained_d1_pct: number;
		is_mature_d1: boolean;
		retained_d3: number;
		retained_d3_denominator: number;
		retained_d3_pct: number;
		is_mature_d3: boolean;
		retained_d7: number;
		retained_d7_denominator: number;
		retained_d7_pct: number;
		is_mature_d7: boolean;
		retained_d14: number;
		retained_d14_denominator: number;
		retained_d14_pct: number;
		is_mature_d14: boolean;
		retained_d30: number;
		retained_d30_denominator: number;
		retained_d30_pct: number;
		is_mature_d30: boolean;
		avg_engaged_minutes_within_d7: number;
		is_mature_within_d7: boolean;
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
		anchorDate: string;
		overview: CohortOverviewRow[];
		weeklyCohorts: WeeklyCohortRow[];
		acquisitionMix: AcquisitionMixRow[];
		sourceOverview: SourceOverviewRow[];
		nextPaths: NextPathRow[];
	}

	interface HeadlineCard {
		label: string;
		value: string;
		note: string;
		delta: string;
		tone: 'positive' | 'negative' | 'neutral';
	}

	const surfaceOptions = [
		{ value: '', label: 'Compare all surfaces' },
		{ value: 'home', label: 'Home' },
		{ value: 'people', label: 'People' },
		{ value: 'community', label: 'Community' },
		{ value: 'guides', label: 'Guides' },
		{ value: 'enneagram', label: 'Enneagram' },
		{ value: 'pop-culture', label: 'Pop Culture' },
		{ value: 'question', label: 'Questions' },
		{ value: 'other', label: 'Other' }
	];
	const defaultNextPathLimit = 12;

	let { filters, cohorts = null }: { filters: CohortFilters; cohorts?: CohortData | null } =
		$props();

	function getInitialState() {
		return {
			filters: {
				from: filters?.from ?? '',
				to: filters?.to ?? '',
				entrySurface: filters?.entrySurface ?? '',
				acquisitionSource: filters?.acquisitionSource ?? ''
			},
			cohorts
		};
	}

	const initialState = getInitialState();
	const initialFilters = { ...initialState.filters };

	let fromDate = $state(initialState.filters.from);
	let toDate = $state(initialState.filters.to);
	let selectedSurface = $state(initialState.filters.entrySurface);
	let selectedSource = $state(initialState.filters.acquisitionSource);
	let initialized = $state(initialState.cohorts !== null);
	let available = $state(Boolean(initialState.cohorts?.available));
	let loading = $state(false);
	let errorMessage = $state('');
	let anchorDate = $state(initialState.cohorts?.anchorDate ?? initialState.filters.to ?? '');
	let overview = $state<CohortOverviewRow[]>(initialState.cohorts?.overview ?? []);
	let weeklyCohorts = $state<WeeklyCohortRow[]>(initialState.cohorts?.weeklyCohorts ?? []);
	let acquisitionMix = $state<AcquisitionMixRow[]>(initialState.cohorts?.acquisitionMix ?? []);
	let sourceOverview = $state<SourceOverviewRow[]>(initialState.cohorts?.sourceOverview ?? []);
	let nextPaths = $state<NextPathRow[]>(initialState.cohorts?.nextPaths ?? []);

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

	function formatWeekRange(weekStart: string, weekEnd?: string): string {
		if (!weekStart) return '—';
		if (weekEnd) {
			return `${formatWeek(weekStart)} - ${formatWeek(weekEnd)}`;
		}

		const start = new Date(`${weekStart}T00:00:00`);
		const end = new Date(start);
		end.setDate(end.getDate() + 6);
		return `${formatWeek(weekStart)} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
	}

	function formatCountWithPct(count: number, pct: number, denominator: number): string {
		if (denominator <= 0) return '—';
		return `${count.toLocaleString()} (${formatPct(pct, denominator)})`;
	}

	function formatSurfaceLabel(surface: string): string {
		const fallback = surface.trim();
		return (
			surfaceOptions.find((option) => option.value === surface)?.label ?? (fallback || 'Other')
		);
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

		if (selectedSurface) {
			params.set('entrySurface', selectedSurface);
		}
		if (selectedSurface && selectedSource) {
			params.set('acquisitionSource', selectedSource);
		}

		return params;
	}

	function getAcquisitionOptions(
		rows: SourceOverviewRow[]
	): Array<{ value: string; label: string }> {
		const values = [...new Set(rows.map((row) => row.acquisition_source).filter(Boolean))].sort();
		return [
			{ value: '', label: 'All sources in selected surface' },
			...values.map((value) => ({ value, label: formatAcquisitionSourceLabel(value) }))
		];
	}

	async function fetchCohorts() {
		loading = true;
		errorMessage = '';
		try {
			const response = await fetch(`/api/admin/analytics/cohorts?${buildParams().toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load cohort analytics');
			}

			available = Boolean(body.available);
			anchorDate = String(body.anchorDate ?? anchorDate);
			overview = (body.overview ?? []) as CohortOverviewRow[];
			weeklyCohorts = (body.weeklyCohorts ?? []) as WeeklyCohortRow[];
			acquisitionMix = (body.acquisitionMix ?? []) as AcquisitionMixRow[];
			sourceOverview = (body.sourceOverview ?? []) as SourceOverviewRow[];
			nextPaths = (body.nextPaths ?? []) as NextPathRow[];

			if (
				selectedSource &&
				!(body.sourceOverview ?? []).some(
					(row: SourceOverviewRow) => row.acquisition_source === selectedSource
				)
			) {
				selectedSource = '';
			}
		} catch (err) {
			console.error('Failed to fetch cohort analytics:', err);
			errorMessage = 'Failed to load cohort analytics.';
			notifications.danger('Failed to load cohort analytics', 3000);
		} finally {
			loading = false;
			initialized = true;
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
		selectedSurface = initialFilters.entrySurface ?? '';
		selectedSource = initialFilters.acquisitionSource ?? '';
		await fetchCohorts();
	}

	async function selectSurface(surface: string) {
		if (loading) return;
		selectedSurface = surface;
		selectedSource = '';
		await fetchCohorts();
	}

	async function clearDrilldown() {
		if (loading) return;
		selectedSurface = '';
		selectedSource = '';
		await fetchCohorts();
	}

	async function toggleSourceSelection(source: string) {
		if (!selectedSurface || loading) return;
		selectedSource = selectedSource === source ? '' : source;
		await fetchCohorts();
	}

	function handleSurfaceSelectChange() {
		selectedSource = '';
	}

	function getHeatStyle(pct: number, mature: boolean): string {
		if (!mature) {
			return 'background: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-deep)); border-color: color-mix(in srgb, var(--bg-elevated) 86%, transparent);';
		}

		const intensity = Math.max(16, Math.min(78, 16 + pct * 0.85));
		return `background: color-mix(in srgb, var(--primary) ${intensity}%, var(--bg-deep)); border-color: color-mix(in srgb, var(--primary) ${Math.max(26, intensity - 10)}%, transparent);`;
	}

	function getSignedDelta(value: number, suffix = ''): string {
		const sign = value > 0 ? '+' : '';
		return `${sign}${value.toFixed(suffix ? 1 : 0)}${suffix}`;
	}

	function getLatestWeek(
		rows: WeeklyCohortRow[],
		predicate: (row: WeeklyCohortRow) => boolean
	): { row: WeeklyCohortRow; index: number } | null {
		for (let index = rows.length - 1; index >= 0; index -= 1) {
			if (predicate(rows[index])) {
				return { row: rows[index], index };
			}
		}

		return null;
	}

	function getPreviousWeek(
		rows: WeeklyCohortRow[],
		startIndex: number,
		predicate: (row: WeeklyCohortRow) => boolean
	): WeeklyCohortRow | null {
		for (let index = startIndex - 1; index >= 0; index -= 1) {
			if (predicate(rows[index])) {
				return rows[index];
			}
		}

		return null;
	}

	function buildVolumeCard(rows: WeeklyCohortRow[]): HeadlineCard {
		const currentInfo = getLatestWeek(rows, (row) => row.new_visitors > 0);
		if (!currentInfo) {
			return {
				label: 'New visitors',
				value: '—',
				note: 'No cohort weeks in range',
				delta: 'Adjust the selected date range.',
				tone: 'neutral'
			};
		}

		const previous = getPreviousWeek(rows, currentInfo.index, (row) => row.new_visitors > 0);
		const weekLabel = formatWeekRange(currentInfo.row.cohort_week, currentInfo.row.cohort_week_end);

		return {
			label: 'New visitors',
			value: currentInfo.row.new_visitors.toLocaleString(),
			note: `Last cohort week ${weekLabel}`,
			delta: previous
				? `${getSignedDelta(currentInfo.row.new_visitors - previous.new_visitors)} vs ${formatWeekRange(previous.cohort_week, previous.cohort_week_end)}`
				: 'No prior cohort week in range.',
			tone: 'neutral'
		};
	}

	function buildMatureRateCard(
		rows: WeeklyCohortRow[],
		label: string,
		getCurrentValue: (
			row: WeeklyCohortRow
		) => { numerator: number; denominator: number; pct: number }
	): HeadlineCard {
		const currentInfo = getLatestWeek(rows, (row) => row.is_mature_within_d7);
		if (!currentInfo) {
			return {
				label,
				value: '—',
				note: 'Waiting for a mature cohort week',
				delta: '7-day metrics unlock after the full week has aged 7 days.',
				tone: 'neutral'
			};
		}

		const current = getCurrentValue(currentInfo.row);
		const previousRow = getPreviousWeek(rows, currentInfo.index, (row) => row.is_mature_within_d7);
		const previous = previousRow ? getCurrentValue(previousRow) : null;
		const delta = previous ? current.pct - previous.pct : 0;
		const tone =
			previous === null ? 'neutral' : delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';

		return {
			label,
			value: formatPct(current.pct, current.denominator),
			note: `${current.numerator.toLocaleString()} of ${current.denominator.toLocaleString()} in ${formatWeekRange(currentInfo.row.cohort_week, currentInfo.row.cohort_week_end)}`,
			delta: previous
				? `${getSignedDelta(delta, ' pts')} vs ${formatWeekRange(previousRow!.cohort_week, previousRow!.cohort_week_end)}`
				: 'No prior mature week in range.',
			tone
		};
	}

	function getSelectedSegmentLabel(): string {
		if (selectedSurface && selectedSource) {
			return `${formatSurfaceLabel(selectedSurface)} from ${formatAcquisitionSourceLabel(selectedSource)}`;
		}
		if (selectedSurface) {
			return `${formatSurfaceLabel(selectedSurface)} cohorts`;
		}
		return 'all first-touch cohorts';
	}

	let acquisitionOptions = $derived(getAcquisitionOptions(sourceOverview));
	let acquisitionChart = $derived(buildAcquisitionMixChart(acquisitionMix));
	let selectedSurfaceLabel = $derived(
		selectedSurface ? formatSurfaceLabel(selectedSurface) : 'All surfaces'
	);
	let selectedSourceLabel = $derived(
		selectedSource ? formatAcquisitionSourceLabel(selectedSource) : 'All sources'
	);
	let showDrilldown = $derived(Boolean(selectedSurface));
	let headlineCards = $derived([
		buildVolumeCard(weeklyCohorts),
		buildMatureRateCard(weeklyCohorts, 'Comment within 7d', (row) => ({
			numerator: row.commented_within_d7,
			denominator: row.comment_rate_denominator,
			pct: row.comment_rate_pct
		})),
		buildMatureRateCard(weeklyCohorts, 'Signup within 7d', (row) => ({
			numerator: row.signed_up_within_d7,
			denominator: row.signup_rate_denominator,
			pct: row.signup_rate_pct
		})),
		buildMatureRateCard(weeklyCohorts, 'Registered within 7d', (row) => ({
			numerator: row.registered_within_d7,
			denominator: row.registration_rate_denominator,
			pct: row.registration_rate_pct
		})),
		buildMatureRateCard(weeklyCohorts, 'D7 retention', (row) => ({
			numerator: row.retained_d7,
			denominator: row.retained_d7_denominator,
			pct: row.retained_d7_pct
		}))
	]);

	onMount(() => {
		if (initialState.cohorts === null) {
			void fetchCohorts();
		}
	});
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
			<span>Drill into surface</span>
			<select bind:value={selectedSurface} onchange={handleSurfaceSelectChange}>
				{#each surfaceOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
		<label class="field">
			<span>Drill into source</span>
			<select
				bind:value={selectedSource}
				disabled={!selectedSurface || sourceOverview.length === 0}
			>
				{#each acquisitionOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</label>
	</div>
	<div class="filter-actions">
		<button class="btn btn-primary" onclick={applyFilters} disabled={loading}>Apply</button>
		<button class="btn btn-secondary" onclick={resetFilters} disabled={loading}>Reset</button>
		{#if selectedSurface || selectedSource}
			<button class="btn btn-secondary" onclick={clearDrilldown} disabled={loading}>
				Clear drill-down
			</button>
		{/if}
	</div>
	<p class="cohort-note">
		The compare table stays stable. Lower panels drill into {getSelectedSegmentLabel()}. 7-day
		metrics wait for mature cohorts instead of blending partial weeks into the denominator. Snapshot
		anchored on
		{anchorDate || 'today'}.
	</p>
</section>

{#if !initialized}
	<section class="panel-card">
		<div class="empty-panel">Loading acquisition and retention analytics...</div>
	</section>
{:else if errorMessage && !available && overview.length === 0 && weeklyCohorts.length === 0 && acquisitionMix.length === 0 && sourceOverview.length === 0 && nextPaths.length === 0}
	<section class="panel-card">
		<div class="empty-panel">{errorMessage}</div>
	</section>
{:else if !available}
	<section class="panel-card">
		<div class="empty-panel">
			Retention rollups are not available yet. Apply the retention migration before using this tab.
		</div>
	</section>
{:else}
	<section class="summary-grid">
		{#each headlineCards as card}
			<article class={`summary-card tone-${card.tone}`}>
				<span class="summary-label">{card.label}</span>
				<strong class="summary-value">{card.value}</strong>
				<span class="summary-note">{card.note}</span>
				<span class="summary-delta">{card.delta}</span>
			</article>
		{/each}
	</section>

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>Surface comparison</h2>
				<p>
					Use this table to decide which entry surfaces create quality cohorts. D7 metrics sort the
					list; low-sample rows are flagged.
				</p>
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
						<th class="num">D7</th>
						<th class="num">Avg engaged</th>
						<th class="num">Drill-down</th>
					</tr>
				</thead>
				<tbody>
					{#if overview.length === 0}
						<tr>
							<td colspan="8" class="empty">No cohort rows for this filter set.</td>
						</tr>
					{:else}
						{#each overview as row}
							<tr class:selected-row={selectedSurface === row.entry_surface}>
								<td>
									<div class="surface-cell">
										<span>{formatSurfaceLabel(row.entry_surface)}</span>
										{#if isLowSample(row.retained_d7_denominator)}
											<span class="sample-pill">Low sample</span>
										{/if}
									</div>
								</td>
								<td class="num">{row.new_visitors.toLocaleString()}</td>
								<td class="num">
									{formatCountWithPct(
										row.commented_within_d7,
										row.comment_rate_pct,
										row.comment_rate_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.signed_up_within_d7,
										row.signup_rate_pct,
										row.signup_rate_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.registered_within_d7,
										row.registration_rate_pct,
										row.registration_rate_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.retained_d7,
										row.retained_d7_pct,
										row.retained_d7_denominator
									)}
								</td>
								<td class="num">{row.avg_engaged_minutes_within_d7.toFixed(1)}m</td>
								<td class="num">
									<button
										type="button"
										class={`table-action ${selectedSurface === row.entry_surface ? 'is-selected' : ''}`}
										onclick={() => selectSurface(row.entry_surface)}
										disabled={loading}
									>
										{selectedSurface === row.entry_surface ? 'Selected' : 'View'}
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</section>

	{#if showDrilldown}
		<section class="panel-card drilldown-banner">
			<div>
				<h2>Drill-down</h2>
				<p>
					Below this point, the page is focused on <strong>{getSelectedSegmentLabel()}</strong>. The
					compare table above stays global so you never lose context.
				</p>
			</div>
			<div class="drilldown-badges">
				<span class="segment-pill">{selectedSurfaceLabel}</span>
				{#if selectedSource}
					<span class="segment-pill segment-pill-secondary">{selectedSourceLabel}</span>
				{/if}
			</div>
		</section>
	{/if}

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>Weekly cohort quality</h2>
				<p>
					Week-over-week view for {getSelectedSegmentLabel()}. Immature cells stay muted until the
					full week has had time to age.
				</p>
			</div>
		</div>

		<div class="table-wrapper">
			<table class="data-table cohort-table cohort-matrix">
				<thead>
					<tr>
						<th>Week</th>
						<th class="num">Cohort</th>
						<th>Comment 7d</th>
						<th>Signup 7d</th>
						<th>Registered 7d</th>
						<th>D1</th>
						<th>D7</th>
						<th>D30</th>
					</tr>
				</thead>
				<tbody>
					{#if weeklyCohorts.length === 0}
						<tr>
							<td colspan="8" class="empty">No weekly cohort rows yet.</td>
						</tr>
					{:else}
						{#each weeklyCohorts as row}
							<tr>
								<td>
									<div class="week-cell">
										<strong>{formatWeekRange(row.cohort_week, row.cohort_week_end)}</strong>
										<span>{row.new_visitors.toLocaleString()} visitors</span>
									</div>
								</td>
								<td class="num">{row.new_visitors.toLocaleString()}</td>
								<td>
									<div
										class:metric-cell={true}
										class:is-muted={!row.is_mature_within_d7}
										style={getHeatStyle(row.comment_rate_pct, row.is_mature_within_d7)}
									>
										<strong>{formatPct(row.comment_rate_pct, row.comment_rate_denominator)}</strong>
										<span
											>{formatCountWithPct(
												row.commented_within_d7,
												row.comment_rate_pct,
												row.comment_rate_denominator
											)}</span
										>
									</div>
								</td>
								<td>
									<div
										class:metric-cell={true}
										class:is-muted={!row.is_mature_within_d7}
										style={getHeatStyle(row.signup_rate_pct, row.is_mature_within_d7)}
									>
										<strong>{formatPct(row.signup_rate_pct, row.signup_rate_denominator)}</strong>
										<span
											>{formatCountWithPct(
												row.signed_up_within_d7,
												row.signup_rate_pct,
												row.signup_rate_denominator
											)}</span
										>
									</div>
								</td>
								<td>
									<div
										class:metric-cell={true}
										class:is-muted={!row.is_mature_within_d7}
										style={getHeatStyle(row.registration_rate_pct, row.is_mature_within_d7)}
									>
										<strong
											>{formatPct(
												row.registration_rate_pct,
												row.registration_rate_denominator
											)}</strong
										>
										<span
											>{formatCountWithPct(
												row.registered_within_d7,
												row.registration_rate_pct,
												row.registration_rate_denominator
											)}</span
										>
									</div>
								</td>
								<td>
									<div
										class:metric-cell={true}
										class:is-muted={!row.is_mature_d1}
										style={getHeatStyle(row.retained_d1_pct, row.is_mature_d1)}
									>
										<strong>{formatPct(row.retained_d1_pct, row.retained_d1_denominator)}</strong>
										<span
											>{formatCountWithPct(
												row.retained_d1,
												row.retained_d1_pct,
												row.retained_d1_denominator
											)}</span
										>
									</div>
								</td>
								<td>
									<div
										class:metric-cell={true}
										class:is-muted={!row.is_mature_d7}
										style={getHeatStyle(row.retained_d7_pct, row.is_mature_d7)}
									>
										<strong>{formatPct(row.retained_d7_pct, row.retained_d7_denominator)}</strong>
										<span
											>{formatCountWithPct(
												row.retained_d7,
												row.retained_d7_pct,
												row.retained_d7_denominator
											)}</span
										>
									</div>
								</td>
								<td>
									<div
										class:metric-cell={true}
										class:is-muted={!row.is_mature_d30}
										style={getHeatStyle(row.retained_d30_pct, row.is_mature_d30)}
									>
										<strong>{formatPct(row.retained_d30_pct, row.retained_d30_denominator)}</strong>
										<span
											>{formatCountWithPct(
												row.retained_d30,
												row.retained_d30_pct,
												row.retained_d30_denominator
											)}</span
										>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</section>

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>Acquisition mix</h2>
				<p>
					This explains where each cohort came from. It stays broad on purpose: selecting a source
					highlights and filters the detail panels, but the mix chart still shows the full
					composition.
				</p>
			</div>
		</div>

		{#if acquisitionMix.length === 0}
			<div class="empty-panel">No acquisition rows for this range.</div>
		{:else}
			<div class="acquisition-panel">
				<div class="acquisition-summary-grid">
					<div class="acquisition-summary-card">
						<span class="acquisition-summary-label">Range total</span>
						<strong class="acquisition-summary-value">
							{acquisitionChart.totalVisitors.toLocaleString()}
						</strong>
						<span class="acquisition-summary-note">New visitors across selected cohort weeks</span>
					</div>
					<div class="acquisition-summary-card">
						<span class="acquisition-summary-label">Lead source</span>
						<strong class="acquisition-summary-value">
							{acquisitionChart.leadSource?.label ?? '—'}
						</strong>
						<span class="acquisition-summary-note">
							{#if acquisitionChart.leadSource}
								{formatPct(acquisitionChart.leadSource.sharePct)} of the selected range
							{:else}
								No source data yet
							{/if}
						</span>
					</div>
					<div class="acquisition-summary-card">
						<span class="acquisition-summary-label">Current focus</span>
						<strong class="acquisition-summary-value">
							{selectedSource ? selectedSourceLabel : 'No source filter'}
						</strong>
						<span class="acquisition-summary-note">
							{#if selectedSurface}
								Legend clicks filter the source-quality and next-path panels below.
							{:else}
								Choose a surface first to drill into source-level quality.
							{/if}
						</span>
					</div>
				</div>

				<div
					class="acquisition-chart-card acquisition-chart-card-wide"
					role="img"
					aria-label="Weekly 100 percent stacked bar chart showing the acquisition source mix for each cohort week"
				>
					<div class="acquisition-chart-caption">
						<span>100% of each bar equals that week&apos;s new visitors.</span>
						<span>Weeks are ordered oldest to newest.</span>
					</div>

					<div class="acquisition-weeks">
						{#each acquisitionChart.weeks as week}
							<div class="acquisition-week-row">
								<div class="acquisition-week-meta">
									<strong class="acquisition-week-label">
										{formatWeekRange(week.cohortWeek)}
									</strong>
									<span class="acquisition-week-note">
										{week.dominantLabel} leads {formatPct(week.dominantSharePct)}
									</span>
								</div>

								<div class="acquisition-week-bar">
									{#each week.segments as segment}
										<button
											type="button"
											class={`acquisition-segment ${selectedSource && selectedSource !== segment.key ? 'is-dimmed' : ''} ${selectedSource === segment.key ? 'is-active' : ''} ${selectedSurface ? 'is-clickable' : ''}`}
											style={`--segment-color: ${segment.color}; flex: ${segment.count} 1 0px;`}
											title={`${segment.label}: ${segment.count.toLocaleString()} new visitors (${formatPct(segment.sharePct)})`}
											onclick={() => selectedSurface && toggleSourceSelection(segment.key)}
											disabled={!selectedSurface || loading}
										>
											{#if segment.sharePct >= 18}
												<span>{segment.shortLabel}</span>
											{/if}
										</button>
									{/each}
								</div>

								<div class="acquisition-week-total">
									<strong>{week.total.toLocaleString()}</strong>
									<span>new</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="acquisition-legend-card">
					<div class="acquisition-legend-header">
						<h3>Sources across selected range</h3>
						<span>{acquisitionChart.totalSources.toLocaleString()} total sources</span>
					</div>

					<div class="acquisition-source-list">
						{#each acquisitionChart.sources as source}
							<button
								type="button"
								class={`acquisition-source-row ${selectedSource === source.key ? 'is-selected' : ''}`}
								onclick={() => toggleSourceSelection(source.key)}
								disabled={!selectedSurface || loading}
							>
								<div class="acquisition-source-main">
									<span
										class="acquisition-swatch"
										style={`--swatch-color: ${source.color};`}
										aria-hidden="true"
									></span>
									<div class="acquisition-source-copy">
										<strong>{source.label}</strong>
										<span>
											Active in {source.weeksActive.toLocaleString()} of {acquisitionChart.weeks.length.toLocaleString()}
											weeks
										</span>
									</div>
								</div>

								<div class="acquisition-source-metrics">
									<strong>{source.count.toLocaleString()}</strong>
									<span>{formatPct(source.sharePct)}</span>
								</div>

								<div class="acquisition-source-track" aria-hidden="true">
									<span
										class="acquisition-source-fill"
										style={`--fill-color: ${source.color}; width: ${source.sharePct}%;`}
									></span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</section>

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>Source quality</h2>
				<p>
					{#if selectedSurface}
						Compare acquisition sources inside {selectedSurfaceLabel}. This is the table that tells
						you where distribution effort is actually paying off.
					{:else}
						Choose a surface above to compare acquisition sources by quality, not just volume.
					{/if}
				</p>
			</div>
		</div>

		{#if !selectedSurface}
			<div class="empty-panel">
				Pick a surface from the compare table or the drill-down filter to unlock source-level
				quality.
			</div>
		{:else if sourceOverview.length === 0}
			<div class="empty-panel">No source rows for {selectedSurfaceLabel} in this range.</div>
		{:else}
			<div class="table-wrapper">
				<table class="data-table cohort-table">
					<thead>
						<tr>
							<th>Source</th>
							<th class="num">New visitors</th>
							<th class="num">Signup 7d</th>
							<th class="num">Registered 7d</th>
							<th class="num">D7</th>
							<th class="num">Avg engaged</th>
							<th class="num">Focus</th>
						</tr>
					</thead>
					<tbody>
						{#each sourceOverview as row}
							<tr class:selected-row={selectedSource === row.acquisition_source}>
								<td>
									<div class="surface-cell">
										<span>{formatAcquisitionSourceLabel(row.acquisition_source)}</span>
										{#if isLowSample(row.retained_d7_denominator)}
											<span class="sample-pill">Low sample</span>
										{/if}
									</div>
								</td>
								<td class="num">{row.new_visitors.toLocaleString()}</td>
								<td class="num">
									{formatCountWithPct(
										row.signed_up_within_d7,
										row.signup_rate_pct,
										row.signup_rate_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.registered_within_d7,
										row.registration_rate_pct,
										row.registration_rate_denominator
									)}
								</td>
								<td class="num">
									{formatCountWithPct(
										row.retained_d7,
										row.retained_d7_pct,
										row.retained_d7_denominator
									)}
								</td>
								<td class="num">{row.avg_engaged_minutes_within_d7.toFixed(1)}m</td>
								<td class="num">
									<button
										type="button"
										class={`table-action ${selectedSource === row.acquisition_source ? 'is-selected' : ''}`}
										onclick={() => toggleSourceSelection(row.acquisition_source)}
										disabled={loading}
									>
										{selectedSource === row.acquisition_source ? 'Focused' : 'Focus'}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<section class="panel-card">
		<div class="panel-header">
			<div>
				<h2>Where new visitors go next</h2>
				<p>
					The second pageview in the first tracked session for {getSelectedSegmentLabel()}. Use this
					to see whether first-touch traffic is being routed somewhere useful.
				</p>
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
							<td colspan="4" class="empty">No next-path rows for this segment.</td>
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

	.filter-grid {
		display: grid;
		gap: 10px;
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

	.field select:disabled {
		opacity: 0.6;
	}

	.filter-actions {
		display: flex;
		flex-wrap: wrap;
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

	.btn:disabled,
	.table-action:disabled,
	.acquisition-source-row:disabled {
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
		line-height: 1.45;
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

	.summary-card.tone-positive {
		border-color: color-mix(in srgb, #22c55e 40%, var(--bg-elevated));
	}

	.summary-card.tone-negative {
		border-color: color-mix(in srgb, #f97316 48%, var(--bg-elevated));
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

	.summary-note,
	.summary-delta {
		font-size: 0.8rem;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.summary-delta {
		margin-top: auto;
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
		line-height: 1.45;
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--bg-elevated);
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
		border-bottom: 1px solid var(--bg-elevated);
		text-align: left;
		vertical-align: middle;
	}

	.data-table th {
		background: var(--bg-deep);
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 6px 8px;
	}

	.data-table .num {
		text-align: right;
		white-space: nowrap;
	}

	.empty {
		text-align: center;
		color: var(--text-secondary);
		padding: 18px 12px;
	}

	.selected-row {
		background: color-mix(in srgb, var(--primary) 7%, transparent);
	}

	.surface-cell {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.sample-pill,
	.loading-pill,
	.segment-pill {
		font-size: 0.72rem;
		padding: 4px 8px;
		border-radius: 999px;
		white-space: nowrap;
	}

	.sample-pill {
		background: rgba(245, 158, 11, 0.15);
		color: #f59e0b;
	}

	.loading-pill {
		background: rgba(59, 130, 246, 0.14);
		color: #93c5fd;
	}

	.drilldown-banner {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	.drilldown-banner h2 {
		margin: 0;
		font-size: 1rem;
	}

	.drilldown-banner p {
		margin: 6px 0 0;
		font-size: 0.84rem;
		color: var(--text-secondary);
		line-height: 1.45;
	}

	.drilldown-badges {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 8px;
	}

	.segment-pill {
		background: color-mix(in srgb, var(--primary) 22%, var(--bg-deep));
		color: var(--text-primary);
	}

	.segment-pill-secondary {
		background: color-mix(in srgb, #7dd3fc 20%, var(--bg-deep));
	}

	.table-action {
		background: var(--bg-deep);
		color: var(--text-primary);
		border: 1px solid var(--bg-elevated);
		border-radius: 999px;
		padding: 6px 10px;
		font-size: 0.76rem;
		font-weight: 700;
		cursor: pointer;
	}

	.table-action.is-selected {
		background: color-mix(in srgb, var(--primary) 16%, var(--bg-deep));
		border-color: color-mix(in srgb, var(--primary) 36%, var(--bg-elevated));
	}

	.week-cell {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 150px;
	}

	.week-cell strong {
		font-size: 0.84rem;
	}

	.week-cell span {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.metric-cell {
		min-width: 128px;
		border: 1px solid transparent;
		border-radius: 10px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.metric-cell strong {
		font-size: 0.84rem;
		color: var(--text-primary);
	}

	.metric-cell span {
		font-size: 0.72rem;
		color: var(--text-secondary);
		line-height: 1.35;
	}

	.metric-cell.is-muted strong,
	.metric-cell.is-muted span {
		color: var(--text-secondary);
	}

	.acquisition-panel {
		display: grid;
		gap: 12px;
	}

	.acquisition-summary-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.acquisition-summary-card,
	.acquisition-chart-card,
	.acquisition-legend-card {
		border: 1px solid var(--bg-elevated);
		border-radius: 10px;
		background: color-mix(in srgb, var(--bg-surface) 72%, var(--bg-deep));
	}

	.acquisition-summary-card {
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.acquisition-summary-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
	}

	.acquisition-summary-value {
		font-size: 1rem;
		color: var(--text-primary);
	}

	.acquisition-summary-note {
		font-size: 0.76rem;
		color: var(--text-secondary);
		line-height: 1.35;
	}

	.acquisition-chart-card,
	.acquisition-legend-card {
		padding: 12px;
	}

	.acquisition-chart-card-wide .acquisition-week-row {
		grid-template-columns: minmax(160px, 220px) minmax(0, 1fr) auto;
	}

	.acquisition-chart-caption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
		font-size: 0.77rem;
		color: var(--text-secondary);
	}

	.acquisition-weeks {
		display: grid;
		gap: 10px;
	}

	.acquisition-week-row {
		display: grid;
		grid-template-columns: minmax(120px, 148px) minmax(0, 1fr) auto;
		gap: 10px;
		align-items: center;
	}

	.acquisition-week-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.acquisition-week-label {
		font-size: 0.84rem;
		color: var(--text-primary);
	}

	.acquisition-week-note {
		font-size: 0.74rem;
		color: var(--text-secondary);
	}

	.acquisition-week-bar {
		min-width: 0;
		height: 30px;
		display: flex;
		overflow: hidden;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--bg-elevated) 80%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 92%, black 8%);
	}

	.acquisition-segment {
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 8px;
		background: var(--segment-color);
		color: #0f172a;
		border: 0;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.01em;
	}

	.acquisition-segment.is-clickable {
		cursor: pointer;
	}

	.acquisition-segment.is-dimmed {
		opacity: 0.35;
	}

	.acquisition-segment.is-active {
		box-shadow: inset 0 0 0 2px rgba(15, 23, 42, 0.28);
	}

	.acquisition-segment + .acquisition-segment {
		box-shadow: inset 1px 0 0 rgba(15, 23, 42, 0.18);
	}

	.acquisition-segment span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.acquisition-week-total {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
		min-width: 56px;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.acquisition-week-total strong {
		font-size: 0.88rem;
		color: var(--text-primary);
	}

	.acquisition-legend-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.acquisition-legend-header h3 {
		margin: 0;
		font-size: 0.9rem;
	}

	.acquisition-legend-header span {
		font-size: 0.77rem;
		color: var(--text-secondary);
	}

	.acquisition-source-list {
		display: grid;
		gap: 10px;
	}

	.acquisition-source-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 6px 12px;
		padding: 10px 0 0;
		border-top: 1px solid color-mix(in srgb, var(--bg-elevated) 75%, transparent);
		background: transparent;
		text-align: left;
		width: 100%;
		border-left: 0;
		border-right: 0;
		border-bottom: 0;
		cursor: pointer;
	}

	.acquisition-source-row:first-child {
		padding-top: 0;
		border-top: 0;
	}

	.acquisition-source-row.is-selected {
		background: color-mix(in srgb, var(--primary) 6%, transparent);
		border-radius: 8px;
		padding-left: 8px;
		padding-right: 8px;
	}

	.acquisition-source-main {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		min-width: 0;
	}

	.acquisition-swatch {
		width: 10px;
		height: 10px;
		margin-top: 4px;
		border-radius: 999px;
		background: var(--swatch-color);
		flex-shrink: 0;
	}

	.acquisition-source-copy {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.acquisition-source-copy strong {
		font-size: 0.84rem;
		color: var(--text-primary);
	}

	.acquisition-source-copy span {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.acquisition-source-metrics {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
		font-size: 0.76rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.acquisition-source-metrics strong {
		font-size: 0.84rem;
		color: var(--text-primary);
	}

	.acquisition-source-track {
		grid-column: 1 / -1;
		height: 6px;
		overflow: hidden;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-deep) 92%, black 8%);
	}

	.acquisition-source-fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(
			90deg,
			var(--fill-color),
			color-mix(in srgb, var(--fill-color) 65%, white 35%)
		);
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
		.cohort-filter-grid {
			grid-template-columns: 1fr 1fr;
		}

		.drilldown-banner {
			flex-direction: column;
		}

		.drilldown-badges {
			justify-content: flex-start;
		}
	}

	@media (max-width: 700px) {
		.summary-grid,
		.cohort-filter-grid,
		.acquisition-summary-grid {
			grid-template-columns: 1fr;
		}

		.acquisition-chart-caption,
		.acquisition-week-row,
		.acquisition-legend-header {
			grid-template-columns: 1fr;
			display: grid;
		}

		.acquisition-chart-caption,
		.acquisition-legend-header {
			justify-content: unset;
		}

		.acquisition-week-row {
			gap: 6px;
		}

		.acquisition-week-total {
			align-items: flex-start;
		}

		.metric-cell {
			min-width: 112px;
		}
	}
</style>
