<!-- src/routes/admin/analytics/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import RetentionAnalyticsPanel from '$lib/components/admin/RetentionAnalyticsPanel.svelte';
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

	interface PageSummaryRow {
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
	}

	interface PageRow extends PageSummaryRow {
		total_rows: number;
		last_modified_at: string | null;
	}

	interface PaginationState {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}

	interface TopPagesTimeseriesRow {
		day: string;
		path: string;
		path_group: string;
		visits: number;
	}

	interface TopPagesWindows {
		selectedFrom: string;
		selectedTo: string;
		weekFrom: string;
		weekTo: string;
		monthFrom: string;
		monthTo: string;
	}

	interface TopPagesState {
		topPagesOverTime: TopPagesTimeseriesRow[];
		topPagesThisWeek: PageSummaryRow[];
		topPagesThisMonth: PageSummaryRow[];
		topPagesBySessionDuration: PageSummaryRow[];
		windows: TopPagesWindows;
	}

	interface TopPageAggregate {
		path: string;
		path_group: string;
		total_visits: number;
		days_active: number;
	}

	interface RankedVisitRow extends PageSummaryRow {
		rank: number;
		width_pct: number;
	}

	interface RankedDurationRow extends PageSummaryRow {
		rank: number;
		width_pct: number;
	}

	type SortKey =
		| 'path'
		| 'path_group'
		| 'content_type'
		| 'visits'
		| 'unique_visitors'
		| 'authenticated_visits'
		| 'anonymous_visits'
		| 'avg_time_on_page_ms'
		| 'median_time_on_page_ms'
		| 'bounce_rate';
	type SortDirection = 'asc' | 'desc';
	type PageBreakdownWindow = '24h' | '7d' | '14d' | '30d' | '90d';
	type AnalyticsTab = 'pageviews' | 'timing' | 'releases' | 'cohorts';
	type ReleaseSortKey =
		| 'title'
		| 'published_at'
		| 'minutes_to_first_view'
		| 'views_24h'
		| 'views_7d'
		| 'views_30d'
		| 'total_views'
		| 'benchmark_score'
		| 'performance_band'
		| 'growth_slope_7d'
		| 'bounce_rate'
		| 'avg_time_on_page_ms';
	type ReleaseBandFilter =
		| 'all'
		| 'above_norm'
		| 'below_norm'
		| 'near_norm'
		| 'collecting'
		| 'insufficient_history';

	interface PageBreakdownWindowOption {
		key: PageBreakdownWindow;
		label: string;
	}

	interface PageBreakdownWindowSnapshot {
		contextKey: string;
		rows: PageRow[];
		pagination: PaginationState;
		page: number;
		sortBy: SortKey;
		sortDir: SortDirection;
		rangeFrom: string;
		rangeTo: string;
		rangeLabel: string;
	}

	interface PageTrendPoint {
		day: string;
		visits: number;
		unique_visitors: number;
		avg_time_on_page_ms: number;
	}

	interface TrendSummary {
		path: string;
		path_group: string;
		total_visits: number;
		active_days: number;
	}

	interface TimingHeatmapRow {
		local_dow: number;
		local_hour: number;
		visits: number;
		unique_visitors: number;
		avg_time_on_page_ms: number;
	}

	interface ReleasePerformanceRow {
		id: number;
		slug: string;
		path: string;
		title: string;
		published_at: string | null;
		first_view_at: string | null;
		minutes_to_first_view: number | null;
		views_1h: number;
		views_6h: number;
		views_24h: number;
		unique_24h: number;
		views_7d: number;
		unique_7d: number;
		views_30d: number;
		unique_30d: number;
		total_views: number;
		total_unique_visitors: number;
		avg_time_on_page_ms: number;
		median_time_on_page_ms: number;
		avg_scroll_pct: number;
		bounce_rate: number;
		views_24h_percentile: number | null;
		views_7d_percentile: number | null;
		views_30d_percentile: number | null;
		benchmark_score: number | null;
		benchmark_sample_size: number;
		benchmark_basis: string;
		performance_band: string;
		release_stage: string;
		growth_slope_7d: number | null;
		decay_rate_after_spike: number | null;
	}

	interface ReleaseGrowthPoint {
		day_number: number;
		day_date: string;
		visits: number;
		unique_visitors: number;
		cumulative_visits: number;
		cumulative_unique_visitors: number;
	}

	interface ReleaseEventImpactRow {
		id: number;
		event_type: string;
		event_at: string;
		source: string | null;
		views_before: number;
		views_after: number;
		unique_before: number;
		unique_after: number;
		avg_daily_before: number;
		avg_daily_after: number;
		lift_views: number;
		lift_pct: number | null;
		days_before: number;
		days_after: number;
	}

	let { data }: { data: PageData } = $props();

	function getInitialPageData() {
		return {
			filters: data.filters,
			pagination: data.pagination,
			overview: data.overview,
			timeseries: data.timeseries,
			rows: data.rows,
			topPages: data.topPages
		};
	}

	const initialPageData = getInitialPageData();
	const initialFilters = initialPageData.filters;
	const initialPagination = initialPageData.pagination;
	const initialOverview = initialPageData.overview;
	const initialTimeseries = initialPageData.timeseries;
	const initialRows = initialPageData.rows;
	const initialTopPages = initialPageData.topPages;
	const hasInitialPageviewData = Boolean(
		(initialOverview?.total_visits ?? 0) > 0 ||
			(initialTimeseries?.length ?? 0) > 0 ||
			(initialRows?.length ?? 0) > 0 ||
			(initialTopPages?.topPagesOverTime?.length ?? 0) > 0
	);
	let activeTab = $state<AnalyticsTab>('pageviews');
	let pageviewsLoaded = $state(hasInitialPageviewData);
	let hasOpenedTiming = $state(false);
	let hasOpenedReleases = $state(false);
	let hasOpenedCohorts = $state(false);

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

	const defaultTopPages: TopPagesState = {
		topPagesOverTime: [],
		topPagesThisWeek: [],
		topPagesThisMonth: [],
		topPagesBySessionDuration: [],
		windows: {
			selectedFrom: '',
			selectedTo: '',
			weekFrom: '',
			weekTo: '',
			monthFrom: '',
			monthTo: ''
		}
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

	const tableSortColumns: Array<{ key: SortKey; label: string; numeric?: boolean }> = [
		{ key: 'path', label: 'Path' },
		{ key: 'path_group', label: 'Path Group' },
		{ key: 'content_type', label: 'Type' },
		{ key: 'visits', label: 'Visits', numeric: true },
		{ key: 'unique_visitors', label: 'Unique', numeric: true },
		{ key: 'authenticated_visits', label: 'Auth', numeric: true },
		{ key: 'anonymous_visits', label: 'Anon', numeric: true },
		{ key: 'avg_time_on_page_ms', label: 'Avg Time', numeric: true },
		{ key: 'median_time_on_page_ms', label: 'Median', numeric: true },
		{ key: 'bounce_rate', label: 'Bounce', numeric: true }
	];

	const pageBreakdownWindowOptions: PageBreakdownWindowOption[] = [
		{ key: '24h', label: '24 Hours' },
		{ key: '7d', label: 'Last 7 Days' },
		{ key: '14d', label: 'Last 14 Days' },
		{ key: '30d', label: 'Last 30 Days' },
		{ key: '90d', label: 'Last 90 Days' }
	];
	const defaultPageBreakdownWindow: PageBreakdownWindow = '30d';

	const releaseBandFilterOptions: Array<{ key: ReleaseBandFilter; label: string }> = [
		{ key: 'all', label: 'All releases' },
		{ key: 'above_norm', label: 'Overperforming' },
		{ key: 'below_norm', label: 'Underperforming' },
		{ key: 'near_norm', label: 'Near norm' },
		{ key: 'collecting', label: 'Collecting' },
		{ key: 'insufficient_history', label: 'Needs history' }
	];

	const releaseSortOptions: Array<{ key: ReleaseSortKey; label: string }> = [
		{ key: 'benchmark_score', label: 'Benchmark score' },
		{ key: 'views_24h', label: '24h views' },
		{ key: 'views_7d', label: '7d views' },
		{ key: 'views_30d', label: '30d views' },
		{ key: 'total_views', label: 'Total views' },
		{ key: 'published_at', label: 'Publish date' },
		{ key: 'growth_slope_7d', label: '7d growth slope' },
		{ key: 'minutes_to_first_view', label: 'Time to first view' },
		{ key: 'avg_time_on_page_ms', label: 'Avg time' },
		{ key: 'bounce_rate', label: 'Bounce rate' },
		{ key: 'title', label: 'Title' }
	];

	const releaseTableColumns: Array<{ key: ReleaseSortKey; label: string; numeric?: boolean }> = [
		{ key: 'title', label: 'Release' },
		{ key: 'published_at', label: 'Published' },
		{ key: 'minutes_to_first_view', label: 'First View', numeric: true },
		{ key: 'views_24h', label: '24h', numeric: true },
		{ key: 'views_7d', label: '7d', numeric: true },
		{ key: 'views_30d', label: '30d', numeric: true },
		{ key: 'benchmark_score', label: 'Score', numeric: true },
		{ key: 'performance_band', label: 'Band' }
	];
	const releaseAnalyticsLimit = 500;

	let fromDate = $state(initialFilters?.from ?? '');
	let toDate = $state(initialFilters?.to ?? '');
	let scope = $state<AnalyticsScope>(
		(ANALYTICS_SCOPES.includes(initialFilters?.scope as AnalyticsScope)
			? initialFilters?.scope
			: 'all') as AnalyticsScope
	);
	let search = $state('');
	let page = $state(initialPagination?.page ?? 1);
	let sortBy = $state<SortKey>('visits');
	let sortDir = $state<SortDirection>('desc');
	let pageBreakdownWindow = $state<PageBreakdownWindow>(defaultPageBreakdownWindow);
	let pageBreakdownRangeFrom = $state(initialFilters?.from ?? '');
	let pageBreakdownRangeTo = $state(initialFilters?.to ?? '');
	let pageBreakdownRangeLabel = $state(
		formatDateWindow(initialFilters?.from ?? '', initialFilters?.to ?? '')
	);
	const pageBreakdownCache = new Map<PageBreakdownWindow, PageBreakdownWindowSnapshot>();
	let tableFetchRequestId = 0;
	let seededPageBreakdownCache = false;

	let loading = $state(!hasInitialPageviewData);
	let tableLoading = $state(!hasInitialPageviewData);
	let insightsLoading = $state(!hasInitialPageviewData);
	let trendLoading = $state(false);
	let overview = $state<AnalyticsOverview>({ ...defaultOverview, ...(initialOverview ?? {}) });
	let timeseries = $state<TimeseriesPoint[]>((initialTimeseries ?? []) as TimeseriesPoint[]);
	let rows = $state<PageRow[]>((initialRows ?? []) as PageRow[]);
	let pagination = $state<PaginationState>({ ...defaultPagination, ...(initialPagination ?? {}) });
	let topPages = $state<TopPagesState>({
		topPagesOverTime: (initialTopPages?.topPagesOverTime ??
			defaultTopPages.topPagesOverTime) as TopPagesTimeseriesRow[],
		topPagesThisWeek: (initialTopPages?.topPagesThisWeek ??
			defaultTopPages.topPagesThisWeek) as PageSummaryRow[],
		topPagesThisMonth: (initialTopPages?.topPagesThisMonth ??
			defaultTopPages.topPagesThisMonth) as PageSummaryRow[],
		topPagesBySessionDuration: (initialTopPages?.topPagesBySessionDuration ??
			defaultTopPages.topPagesBySessionDuration) as PageSummaryRow[],
		windows: {
			...defaultTopPages.windows,
			...(initialTopPages?.windows ?? {})
		}
	});

	let selectedTrendPath = $state(
		((initialTopPages?.topPagesOverTime ?? []) as TopPagesTimeseriesRow[])[0]?.path ?? ''
	);
	let selectedTrendPoints = $state<PageTrendPoint[]>([]);
	const trendCache = new Map<string, PageTrendPoint[]>();
	let timingRows = $state<TimingHeatmapRow[]>([]);
	let timingLoading = $state(false);
	let timingLoaded = $state(false);
	let releaseRows = $state<ReleasePerformanceRow[]>([]);
	let releasesLoading = $state(false);
	let releasesLoaded = $state(false);
	let selectedReleaseSlug = $state('');
	let releaseSortBy = $state<ReleaseSortKey>('published_at');
	let releaseSortDir = $state<SortDirection>('desc');
	let releaseBandFilter = $state<ReleaseBandFilter>('all');
	let releaseGrowthPoints = $state<ReleaseGrowthPoint[]>([]);
	let releaseGrowthLoading = $state(false);
	const releaseGrowthCache = new Map<string, ReleaseGrowthPoint[]>();
	let releaseEventRows = $state<ReleaseEventImpactRow[]>([]);
	let releaseEventsLoading = $state(false);
	const releaseEventsCache = new Map<string, ReleaseEventImpactRow[]>();
	let releaseEventType = $state('newsletter_sent');
	let releaseEventSource = $state('');
	let releaseEventAt = $state('');
	let releaseEventSubmitting = $state(false);

	function toDateString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function parseDate(value: string): Date {
		return new Date(`${value}T00:00:00`);
	}

	function getRangeDays(from: string, to: string): string[] {
		if (!from || !to || from > to) return [];

		const dates: string[] = [];
		const cursor = parseDate(from);
		const end = parseDate(to);

		while (cursor <= end) {
			dates.push(toDateString(cursor));
			cursor.setDate(cursor.getDate() + 1);
		}

		return dates;
	}

	function formatDateLabel(dateStr: string): string {
		if (!dateStr) return '';
		const date = parseDate(dateStr);
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}

	function formatDateWindow(from: string, to: string): string {
		if (!from || !to) return '';
		return `${formatDateLabel(from)} - ${formatDateLabel(to)}`;
	}

	const timingDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const timingHours = Array.from({ length: 24 }, (_, hour) => hour);
	const releaseEventTypeOptions = [
		{ value: 'newsletter_sent', label: 'Newsletter' },
		{ value: 'social_posted', label: 'Social post' },
		{ value: 'sitemap_generated', label: 'Sitemap' },
		{ value: 'indexed', label: 'Indexed' },
		{ value: 'internal_links_added', label: 'Internal links' },
		{ value: 'major_update', label: 'Major update' },
		{ value: 'title_meta_updated', label: 'Title/meta update' },
		{ value: 'manual_note', label: 'Manual note' }
	];

	function formatHourLabel(hour: number): string {
		const suffix = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;
		return `${hour12}${suffix}`;
	}

	function getTimingSlotLabel(row: TimingHeatmapRow): string {
		return `${timingDayLabels[row.local_dow] ?? 'Day'} ${formatHourLabel(row.local_hour)}`;
	}

	function getTimingCell(day: number, hour: number): TimingHeatmapRow {
		return (
			timingBySlot.get(`${day}:${hour}`) ?? {
				local_dow: day,
				local_hour: hour,
				visits: 0,
				unique_visitors: 0,
				avg_time_on_page_ms: 0
			}
		);
	}

	function getPageHref(path: string): string | null {
		const trimmed = path.trim();
		return trimmed.startsWith('/') && !trimmed.startsWith('//') ? trimmed : null;
	}

	function getPageBreakdownWindowLabel(window: PageBreakdownWindow): string {
		return pageBreakdownWindowOptions.find((option) => option.key === window)?.label ?? '';
	}

	function getPageBreakdownContextKey(): string {
		return `${scope}|${fromDate}|${toDate}|${search.trim()}`;
	}

	function cacheCurrentPageBreakdownState(): void {
		pageBreakdownCache.set(pageBreakdownWindow, {
			contextKey: getPageBreakdownContextKey(),
			rows: [...rows],
			pagination: { ...pagination },
			page,
			sortBy,
			sortDir,
			rangeFrom: pageBreakdownRangeFrom,
			rangeTo: pageBreakdownRangeTo,
			rangeLabel: pageBreakdownRangeLabel
		});
	}

	function restoreCachedPageBreakdownState(window: PageBreakdownWindow): boolean {
		const cached = pageBreakdownCache.get(window);
		if (!cached || cached.contextKey !== getPageBreakdownContextKey()) {
			return false;
		}

		rows = [...cached.rows];
		pagination = { ...cached.pagination };
		page = cached.page;
		sortBy = cached.sortBy;
		sortDir = cached.sortDir;
		pageBreakdownRangeFrom = cached.rangeFrom;
		pageBreakdownRangeTo = cached.rangeTo;
		pageBreakdownRangeLabel = cached.rangeLabel;
		return true;
	}

	function clearPageBreakdownCache(): void {
		pageBreakdownCache.clear();
		seededPageBreakdownCache = false;
	}

	function buildTrendData(
		points: Array<{ day: string; visits: number }>,
		from: string,
		to: string
	): Array<{ x: number; y: number; label: string }> {
		if (!points.length) return [];

		const visitsByDay = new Map(points.map((point) => [point.day, point.visits]));
		const rangeDays = getRangeDays(from, to);
		const allDays =
			rangeDays.length > 0 ? rangeDays : [...new Set(points.map((point) => point.day))].sort();

		return allDays.map((day) => {
			const visits = visitsByDay.get(day) ?? 0;
			const date = parseDate(day);
			return {
				x: date.getTime(),
				y: visits,
				label: `${date.toLocaleDateString()}: ${visits.toLocaleString()} visits`
			};
		});
	}

	function buildTopPageTotals(points: TopPagesTimeseriesRow[]): TopPageAggregate[] {
		const totals = new Map<string, TopPageAggregate>();

		for (const point of points) {
			const existing = totals.get(point.path);
			if (existing) {
				existing.total_visits += point.visits;
				existing.days_active += 1;
				continue;
			}

			totals.set(point.path, {
				path: point.path,
				path_group: point.path_group,
				total_visits: point.visits,
				days_active: 1
			});
		}

		return [...totals.values()].sort(
			(a, b) => b.total_visits - a.total_visits || a.path.localeCompare(b.path)
		);
	}

	function buildTopPageDrillData(
		points: TopPagesTimeseriesRow[],
		path: string,
		from: string,
		to: string
	): Array<{ x: number; y: number; label: string }> {
		if (!path) return [];

		const pagePoints = points.filter((point) => point.path === path);
		if (pagePoints.length === 0) return [];

		const visitsByDay = new Map(pagePoints.map((point) => [point.day, point.visits]));
		const rangeDays = getRangeDays(from, to);
		const allDays =
			rangeDays.length > 0 ? rangeDays : [...new Set(pagePoints.map((point) => point.day))].sort();

		return allDays.map((day) => {
			const visits = visitsByDay.get(day) ?? 0;
			const date = parseDate(day);
			return {
				x: date.getTime(),
				y: visits,
				label: `${date.toLocaleDateString()}: ${visits.toLocaleString()} visits`
			};
		});
	}

	function isPathInTopSeries(path: string): boolean {
		return topPages.topPagesOverTime.some((point) => point.path === path);
	}

	function getSortIndicator(column: SortKey): string {
		if (sortBy !== column) return '';
		return sortDir === 'desc' ? '↓' : '↑';
	}

	function getAriaSort(column: SortKey): 'none' | 'ascending' | 'descending' {
		if (sortBy !== column) return 'none';
		return sortDir === 'asc' ? 'ascending' : 'descending';
	}

	function getReleaseSortIndicator(column: ReleaseSortKey): string {
		if (releaseSortBy !== column) return '';
		return releaseSortDir === 'desc' ? '↓' : '↑';
	}

	function getReleaseAriaSort(column: ReleaseSortKey): 'none' | 'ascending' | 'descending' {
		if (releaseSortBy !== column) return 'none';
		return releaseSortDir === 'asc' ? 'ascending' : 'descending';
	}

	function getReleaseBandCount(filter: ReleaseBandFilter): number {
		if (filter === 'all') return releaseRows.length;
		return releaseRows.filter((row) => row.performance_band === filter).length;
	}

	function getReleaseBandSortRank(value: string): number {
		switch (value) {
			case 'above_norm':
				return 4;
			case 'near_norm':
				return 3;
			case 'collecting':
				return 2;
			case 'insufficient_history':
				return 1;
			case 'below_norm':
				return 0;
			default:
				return -1;
		}
	}

	function getReleaseSortValue(
		row: ReleasePerformanceRow,
		key: ReleaseSortKey
	): number | string | null {
		switch (key) {
			case 'title':
				return row.title || row.slug;
			case 'published_at':
				return row.published_at ? new Date(row.published_at).getTime() : null;
			case 'minutes_to_first_view':
				return row.minutes_to_first_view;
			case 'views_24h':
				return row.views_24h;
			case 'views_7d':
				return row.views_7d;
			case 'views_30d':
				return row.views_30d;
			case 'total_views':
				return row.total_views;
			case 'benchmark_score':
				return row.benchmark_score;
			case 'performance_band':
				return getReleaseBandSortRank(row.performance_band);
			case 'growth_slope_7d':
				return row.growth_slope_7d;
			case 'bounce_rate':
				return row.bounce_rate;
			case 'avg_time_on_page_ms':
				return row.avg_time_on_page_ms;
		}
	}

	function compareReleaseRows(
		a: ReleasePerformanceRow,
		b: ReleasePerformanceRow,
		key: ReleaseSortKey,
		direction: SortDirection
	): number {
		const aValue = getReleaseSortValue(a, key);
		const bValue = getReleaseSortValue(b, key);
		const aMissing =
			aValue === null ||
			aValue === undefined ||
			(typeof aValue === 'number' && Number.isNaN(aValue));
		const bMissing =
			bValue === null ||
			bValue === undefined ||
			(typeof bValue === 'number' && Number.isNaN(bValue));

		if (aMissing && bMissing) {
			return (a.title || a.slug).localeCompare(b.title || b.slug);
		}
		if (aMissing) return 1;
		if (bMissing) return -1;

		let comparison = 0;
		if (typeof aValue === 'string' && typeof bValue === 'string') {
			comparison = aValue.localeCompare(bValue);
		} else {
			comparison = Number(aValue) - Number(bValue);
		}

		if (comparison === 0) {
			comparison = (a.title || a.slug).localeCompare(b.title || b.slug);
		}

		return direction === 'asc' ? comparison : -comparison;
	}

	function getReleaseRowsForControls(
		filter: ReleaseBandFilter = releaseBandFilter,
		key: ReleaseSortKey = releaseSortBy,
		direction: SortDirection = releaseSortDir
	): ReleasePerformanceRow[] {
		const filtered =
			filter === 'all'
				? [...releaseRows]
				: releaseRows.filter((row) => row.performance_band === filter);

		return filtered.sort((a, b) => compareReleaseRows(a, b, key, direction));
	}

	function ensureSelectedReleaseInVisibleRows() {
		const visibleRows = getReleaseRowsForControls();
		if (visibleRows.length === 0) {
			selectedReleaseSlug = '';
			releaseGrowthPoints = [];
			releaseEventRows = [];
			releaseGrowthLoading = false;
			releaseEventsLoading = false;
			return;
		}
		if (visibleRows.some((row) => row.slug === selectedReleaseSlug)) {
			return;
		}

		void selectRelease(visibleRows[0].slug);
	}

	function handleReleaseSort(column: ReleaseSortKey) {
		if (releaseSortBy === column) {
			releaseSortDir = releaseSortDir === 'desc' ? 'asc' : 'desc';
		} else {
			releaseSortBy = column;
			releaseSortDir = column === 'title' ? 'asc' : 'desc';
		}

		ensureSelectedReleaseInVisibleRows();
	}

	function updateReleaseSortKey(value: string) {
		releaseSortBy = value as ReleaseSortKey;
		ensureSelectedReleaseInVisibleRows();
	}

	function toggleReleaseSortDirection() {
		releaseSortDir = releaseSortDir === 'desc' ? 'asc' : 'desc';
		ensureSelectedReleaseInVisibleRows();
	}

	function setReleaseBandFilter(filter: ReleaseBandFilter) {
		releaseBandFilter = filter;
		ensureSelectedReleaseInVisibleRows();
	}

	function focusReleaseSignal(slug: string, filter: ReleaseBandFilter) {
		releaseBandFilter = filter;
		void selectRelease(slug);
	}

	function handleSort(column: SortKey) {
		if (sortBy === column) {
			sortDir = sortDir === 'desc' ? 'asc' : 'desc';
		} else {
			sortBy = column;
			sortDir = 'desc';
		}
		page = 1;
		void fetchPages();
	}

	async function selectPageBreakdownWindow(window: PageBreakdownWindow) {
		if (window === pageBreakdownWindow || tableLoading) return;

		cacheCurrentPageBreakdownState();
		pageBreakdownWindow = window;

		if (restoreCachedPageBreakdownState(window)) {
			return;
		}

		page = 1;
		sortBy = 'visits';
		sortDir = 'desc';
		rows = [];
		pagination = {
			...defaultPagination,
			limit: pagination.limit || defaultPagination.limit
		};
		pageBreakdownRangeFrom = '';
		pageBreakdownRangeTo = '';
		pageBreakdownRangeLabel = getPageBreakdownWindowLabel(window);
		await fetchPages();
	}

	async function focusPathTrend(path: string) {
		if (!path) return;
		selectedTrendPath = path;

		if (isPathInTopSeries(path)) {
			selectedTrendPoints = [];
			trendLoading = false;
			return;
		}

		const cacheKey = `${scope}|${fromDate}|${toDate}|${path}`;
		const cached = trendCache.get(cacheKey);
		if (cached) {
			selectedTrendPoints = cached;
			trendLoading = false;
			return;
		}

		selectedTrendPoints = [];
		trendLoading = true;
		try {
			const params = new URLSearchParams({
				from: fromDate,
				to: toDate,
				scope,
				path
			});
			const response = await fetch(`/api/admin/analytics/page-trend?${params.toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load page trend');
			}

			const points = (body.points ?? []) as PageTrendPoint[];
			selectedTrendPoints = points;
			trendCache.set(cacheKey, points);
		} catch (err) {
			console.error('Analytics page trend fetch error:', err);
			notifications.danger('Failed to load selected page trend', 3000);
		} finally {
			trendLoading = false;
		}
	}

	function rankByVisits(rows: PageSummaryRow[]): RankedVisitRow[] {
		const maxVisits = Math.max(1, ...rows.map((row) => row.visits));
		return rows.map((row, index) => ({
			...row,
			rank: index + 1,
			width_pct: (row.visits / maxVisits) * 100
		}));
	}

	function rankByDuration(rows: PageSummaryRow[]): RankedDurationRow[] {
		const maxDuration = Math.max(1, ...rows.map((row) => row.avg_time_on_page_ms));
		return rows.map((row, index) => ({
			...row,
			rank: index + 1,
			width_pct: (row.avg_time_on_page_ms / maxDuration) * 100
		}));
	}

	let visitsChartData = $derived(
		timeseries.map((point) => {
			const date = parseDate(point.day);
			return {
				x: date.getTime(),
				y: point.visits,
				label: `${date.toLocaleDateString()}: ${point.visits.toLocaleString()} visits`
			};
		})
	);

	let avgTimeChartData = $derived(
		timeseries.map((point) => {
			const date = parseDate(point.day);
			return {
				x: date.getTime(),
				y: Math.round(point.avg_time_on_page_ms / 1000),
				label: `${date.toLocaleDateString()}: ${formatDurationMs(point.avg_time_on_page_ms)} avg time`
			};
		})
	);

	let topPageTotals = $derived(buildTopPageTotals(topPages.topPagesOverTime));
	let selectedTrendInTopSeries = $derived(
		!!selectedTrendPath && isPathInTopSeries(selectedTrendPath)
	);
	let selectedTrendChartData = $derived(
		selectedTrendInTopSeries
			? buildTopPageDrillData(
					topPages.topPagesOverTime,
					selectedTrendPath,
					topPages.windows.selectedFrom,
					topPages.windows.selectedTo
				)
			: buildTrendData(
					selectedTrendPoints,
					topPages.windows.selectedFrom,
					topPages.windows.selectedTo
				)
	);
	let selectedTrendSummary = $derived.by((): TrendSummary | null => {
		if (!selectedTrendPath) return null;

		const topSummary = topPageTotals.find((row) => row.path === selectedTrendPath);
		if (topSummary) {
			return {
				path: selectedTrendPath,
				path_group: topSummary.path_group,
				total_visits: topSummary.total_visits,
				active_days: topSummary.days_active
			};
		}

		const fromLists =
			topPages.topPagesThisWeek.find((row) => row.path === selectedTrendPath) ||
			topPages.topPagesThisMonth.find((row) => row.path === selectedTrendPath) ||
			topPages.topPagesBySessionDuration.find((row) => row.path === selectedTrendPath) ||
			rows.find((row) => row.path === selectedTrendPath);
		const totalVisits = selectedTrendPoints.reduce((sum, point) => sum + point.visits, 0);
		const activeDays = selectedTrendPoints.filter((point) => point.visits > 0).length;

		return {
			path: selectedTrendPath,
			path_group: fromLists?.path_group ?? '',
			total_visits: fromLists?.visits ?? totalVisits,
			active_days: activeDays
		};
	});
	let weekRankedRows = $derived(rankByVisits(topPages.topPagesThisWeek));
	let monthRankedRows = $derived(rankByVisits(topPages.topPagesThisMonth));
	let durationRankedRows = $derived(rankByDuration(topPages.topPagesBySessionDuration));
	let timingBySlot = $derived(
		new Map(timingRows.map((row) => [`${row.local_dow}:${row.local_hour}`, row]))
	);
	let timingMaxVisits = $derived(Math.max(1, ...timingRows.map((row) => row.visits)));
	let topTimingSlots = $derived(
		[...timingRows]
			.sort(
				(a, b) => b.visits - a.visits || a.local_dow - b.local_dow || a.local_hour - b.local_hour
			)
			.slice(0, 8)
	);
	let selectedRelease = $derived(
		releaseRows.find((row) => row.slug === selectedReleaseSlug) ?? null
	);
	let releaseGrowthChartData = $derived(
		releaseGrowthPoints.map((point) => ({
			x: point.day_number,
			y: point.cumulative_visits,
			label: `Day ${point.day_number}: ${point.cumulative_visits.toLocaleString()} cumulative visits`
		}))
	);
	let releaseVisibleRows = $derived(getReleaseRowsForControls());
	let overperformingRows = $derived(
		getReleaseRowsForControls('above_norm', 'benchmark_score', 'desc').slice(0, 3)
	);
	let underperformingRows = $derived(
		getReleaseRowsForControls('below_norm', 'benchmark_score', 'asc').slice(0, 3)
	);
	let releaseSummary = $derived({
		total: releaseRows.length,
		aboveNorm: releaseRows.filter((row) => row.performance_band === 'above_norm').length,
		belowNorm: releaseRows.filter((row) => row.performance_band === 'below_norm').length,
		nearNorm: releaseRows.filter((row) => row.performance_band === 'near_norm').length,
		collecting: releaseRows.filter((row) => row.performance_band === 'collecting').length,
		needsHistory: releaseRows.filter((row) => row.performance_band === 'insufficient_history')
			.length
	});

	$effect(() => {
		const firstPath = topPageTotals[0]?.path ?? '';
		if (!selectedTrendPath && firstPath) {
			selectedTrendPath = firstPath;
		}
	});

	$effect(() => {
		if (seededPageBreakdownCache) return;
		cacheCurrentPageBreakdownState();
		seededPageBreakdownCache = true;
	});

	let totalPages = $derived(Math.max(1, pagination.totalPages || 1));
	let canPrev = $derived(page > 1);
	let canNext = $derived(page < totalPages);

	function buildParams(
		includePaging = false,
		options: {
			page?: number;
			sortBy?: SortKey;
			sortDir?: SortDirection;
			window?: PageBreakdownWindow;
		} = {}
	): URLSearchParams {
		const params = new URLSearchParams({
			from: fromDate,
			to: toDate,
			scope
		});
		if (search.trim()) {
			params.set('search', search.trim());
		}
		if (includePaging) {
			params.set('page', String(options.page ?? page));
			params.set('limit', String(pagination.limit || 50));
			params.set('sortBy', options.sortBy ?? sortBy);
			params.set('sortDir', options.sortDir ?? sortDir);
			params.set('window', options.window ?? pageBreakdownWindow);
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
		const requestId = ++tableFetchRequestId;
		const requestWindow = pageBreakdownWindow;
		const requestPage = page;
		const requestSortBy = sortBy;
		const requestSortDir = sortDir;
		const requestContextKey = getPageBreakdownContextKey();

		tableLoading = true;
		try {
			const params = buildParams(true, {
				page: requestPage,
				sortBy: requestSortBy,
				sortDir: requestSortDir,
				window: requestWindow
			}).toString();
			const response = await fetch(`/api/admin/analytics/pages?${params}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load page analytics');
			}

			if (requestId !== tableFetchRequestId) return;

			rows = body.rows ?? [];
			pagination = { ...defaultPagination, ...(body.pagination ?? {}) };
			page = body.pagination?.page ?? requestPage;
			sortBy = (body.sorting?.sortBy as SortKey) ?? requestSortBy;
			sortDir = (body.sorting?.sortDir as SortDirection) ?? requestSortDir;
			pageBreakdownRangeFrom = body.window?.from ?? pageBreakdownRangeFrom;
			pageBreakdownRangeTo = body.window?.to ?? pageBreakdownRangeTo;
			const responseWindowLabel =
				body.window?.label ?? formatDateWindow(pageBreakdownRangeFrom, pageBreakdownRangeTo);
			pageBreakdownRangeLabel = responseWindowLabel || getPageBreakdownWindowLabel(requestWindow);

			pageBreakdownCache.set(requestWindow, {
				contextKey: requestContextKey,
				rows: [...rows],
				pagination: { ...pagination },
				page,
				sortBy,
				sortDir,
				rangeFrom: pageBreakdownRangeFrom,
				rangeTo: pageBreakdownRangeTo,
				rangeLabel: pageBreakdownRangeLabel
			});
			seededPageBreakdownCache = true;
		} catch (err) {
			console.error('Analytics pages fetch error:', err);
			notifications.danger('Failed to load page table', 3000);
		} finally {
			if (requestId === tableFetchRequestId) {
				tableLoading = false;
			}
		}
	}

	async function fetchTopPagesInsights() {
		insightsLoading = true;
		try {
			const params = buildParams(false);
			params.set('topN', '10');
			params.set('limit', '8');
			params.set('minVisits', '3');

			const response = await fetch(`/api/admin/analytics/top-pages?${params.toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load top pages');
			}

			topPages = {
				topPagesOverTime: (body.topPagesOverTime ?? []) as TopPagesTimeseriesRow[],
				topPagesThisWeek: (body.topPagesThisWeek ?? []) as PageSummaryRow[],
				topPagesThisMonth: (body.topPagesThisMonth ?? []) as PageSummaryRow[],
				topPagesBySessionDuration: (body.topPagesBySessionDuration ?? []) as PageSummaryRow[],
				windows: {
					...defaultTopPages.windows,
					...(body.windows ?? {})
				}
			};
		} catch (err) {
			console.error('Analytics top pages fetch error:', err);
			notifications.danger('Failed to load top page insights', 3000);
		} finally {
			insightsLoading = false;
		}
	}

	async function fetchPageviewAnalytics() {
		try {
			await Promise.all([fetchOverviewAndTimeseries(), fetchPages(), fetchTopPagesInsights()]);
			selectedTrendPath = topPages.topPagesOverTime[0]?.path ?? '';
		} finally {
			pageviewsLoaded = true;
		}
	}

	async function fetchTimingAnalytics() {
		timingLoading = true;
		try {
			const response = await fetch(`/api/admin/analytics/timing?${buildParams(false).toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load timing analytics');
			}

			timingRows = (body.rows ?? []) as TimingHeatmapRow[];
			timingLoaded = true;
		} catch (err) {
			console.error('Analytics timing fetch error:', err);
			notifications.danger('Failed to load timing analytics', 3000);
		} finally {
			timingLoading = false;
		}
	}

	async function selectRelease(slug: string) {
		if (!slug) return;
		selectedReleaseSlug = slug;

		const cached = releaseGrowthCache.get(slug);
		if (cached) {
			releaseGrowthPoints = cached;
			releaseGrowthLoading = false;
		} else {
			releaseGrowthPoints = [];
			releaseGrowthLoading = true;
			try {
				const params = new URLSearchParams({ slug, days: '30' });
				const response = await fetch(`/api/admin/analytics/release-growth?${params.toString()}`);
				const body = await response.json();

				if (!response.ok) {
					throw new Error(body.message || 'Failed to load release growth');
				}

				const points = (body.points ?? []) as ReleaseGrowthPoint[];
				releaseGrowthPoints = points;
				releaseGrowthCache.set(slug, points);
			} catch (err) {
				console.error('Release growth fetch error:', err);
				notifications.danger('Failed to load release growth', 3000);
			} finally {
				releaseGrowthLoading = false;
			}
		}

		await fetchReleaseEvents(slug);
	}

	async function fetchReleaseEvents(slug: string, force = false) {
		if (!slug) return;

		const cached = releaseEventsCache.get(slug);
		if (cached && !force) {
			releaseEventRows = cached;
			releaseEventsLoading = false;
			return;
		}

		releaseEventRows = [];
		releaseEventsLoading = true;
		try {
			const params = new URLSearchParams({ slug, daysBefore: '7', daysAfter: '7' });
			const response = await fetch(`/api/admin/analytics/release-events?${params.toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load release events');
			}

			const rows = (body.rows ?? []) as ReleaseEventImpactRow[];
			releaseEventRows = rows;
			releaseEventsCache.set(slug, rows);
		} catch (err) {
			console.error('Release event fetch error:', err);
			notifications.danger('Failed to load release events', 3000);
		} finally {
			releaseEventsLoading = false;
		}
	}

	async function submitReleaseEvent() {
		if (!selectedRelease) return;

		releaseEventSubmitting = true;
		try {
			const response = await fetch('/api/admin/analytics/release-events', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					slug: selectedRelease.slug,
					eventType: releaseEventType,
					eventAt: releaseEventAt ? new Date(releaseEventAt).toISOString() : undefined,
					source: releaseEventSource || undefined,
					path: selectedRelease.path,
					metadata: {
						title: selectedRelease.title
					}
				})
			});
			const body = await response.json();

			if (!response.ok || !body.success) {
				throw new Error(body.message || 'Failed to record release event');
			}

			releaseEventSource = '';
			releaseEventAt = '';
			releaseEventsCache.delete(selectedRelease.slug);
			await fetchReleaseEvents(selectedRelease.slug, true);
			notifications.success('Release event recorded', 2500);
		} catch (err) {
			console.error('Release event submit error:', err);
			notifications.danger('Failed to record release event', 3000);
		} finally {
			releaseEventSubmitting = false;
		}
	}

	async function fetchReleaseAnalytics() {
		releasesLoading = true;
		try {
			const params = buildParams(false);
			params.set('limit', String(releaseAnalyticsLimit));
			const response = await fetch(`/api/admin/analytics/releases?${params.toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load release analytics');
			}

			releaseRows = (body.rows ?? []) as ReleasePerformanceRow[];
			releasesLoaded = true;

			const visibleRows = getReleaseRowsForControls();
			const nextSlug =
				visibleRows.find((row) => row.slug === selectedReleaseSlug)?.slug ??
				visibleRows[0]?.slug ??
				releaseRows.find((row) => row.slug === selectedReleaseSlug)?.slug ??
				releaseRows[0]?.slug ??
				'';
			if (nextSlug) {
				await selectRelease(nextSlug);
			}
		} catch (err) {
			console.error('Release analytics fetch error:', err);
			notifications.danger('Failed to load release analytics', 3000);
		} finally {
			releasesLoading = false;
		}
	}

	async function applyFilters() {
		if (!isDateRangeValid()) {
			notifications.warning('Please use a valid date range', 3000);
			return;
		}
		page = 1;
		clearPageBreakdownCache();
		pageBreakdownRangeFrom = '';
		pageBreakdownRangeTo = '';
		pageBreakdownRangeLabel = getPageBreakdownWindowLabel(pageBreakdownWindow);
		trendCache.clear();
		selectedTrendPoints = [];
		timingLoaded = false;
		releasesLoaded = false;
		releaseGrowthCache.clear();
		releaseGrowthPoints = [];
		releaseEventsCache.clear();
		releaseEventRows = [];
		await fetchPageviewAnalytics();
		if (activeTab === 'timing') {
			await fetchTimingAnalytics();
		}
		if (activeTab === 'releases') {
			await fetchReleaseAnalytics();
		}
		selectedTrendPath = topPages.topPagesOverTime[0]?.path ?? '';
	}

	async function resetFilters() {
		fromDate = initialFilters?.from ?? fromDate;
		toDate = initialFilters?.to ?? toDate;
		scope = 'all';
		search = '';
		page = 1;
		sortBy = 'visits';
		sortDir = 'desc';
		pageBreakdownWindow = defaultPageBreakdownWindow;
		clearPageBreakdownCache();
		pageBreakdownRangeFrom = '';
		pageBreakdownRangeTo = '';
		pageBreakdownRangeLabel = getPageBreakdownWindowLabel(pageBreakdownWindow);
		trendCache.clear();
		selectedTrendPoints = [];
		timingLoaded = false;
		releasesLoaded = false;
		releaseGrowthCache.clear();
		releaseGrowthPoints = [];
		releaseEventsCache.clear();
		releaseEventRows = [];
		await fetchPageviewAnalytics();
		if (activeTab === 'timing') {
			await fetchTimingAnalytics();
		}
		if (activeTab === 'releases') {
			await fetchReleaseAnalytics();
		}
		selectedTrendPath = topPages.topPagesOverTime[0]?.path ?? '';
	}

	async function goToPage(nextPage: number) {
		if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
		page = nextPage;
		await fetchPages();
	}

	function csvEscape(value: string | number | null | undefined): string {
		if (value === null || value === undefined) return '';
		const text = String(value);
		if (/[",\n\r]/.test(text)) {
			return `"${text.replace(/"/g, '""')}"`;
		}
		return text;
	}

	function formatCsvDate(value: string | null): string {
		if (!value) return '';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toISOString();
	}

	function buildReleaseAnalysisCsv(exportRows: ReleasePerformanceRow[]): string {
		const columns: Array<{
			header: string;
			value: (row: ReleasePerformanceRow) => string | number | null | undefined;
		}> = [
			{ header: 'title', value: (row) => row.title },
			{ header: 'slug', value: (row) => row.slug },
			{ header: 'path', value: (row) => row.path },
			{ header: 'published_at', value: (row) => formatCsvDate(row.published_at) },
			{ header: 'first_view_at', value: (row) => formatCsvDate(row.first_view_at) },
			{ header: 'minutes_to_first_view', value: (row) => row.minutes_to_first_view },
			{ header: 'performance_band', value: (row) => formatPerformanceBand(row.performance_band) },
			{ header: 'release_stage', value: (row) => formatReleaseStage(row.release_stage) },
			{ header: 'benchmark_score', value: (row) => row.benchmark_score },
			{ header: 'benchmark_basis', value: (row) => row.benchmark_basis },
			{ header: 'benchmark_sample_size', value: (row) => row.benchmark_sample_size },
			{ header: 'views_1h', value: (row) => row.views_1h },
			{ header: 'views_6h', value: (row) => row.views_6h },
			{ header: 'views_24h', value: (row) => row.views_24h },
			{ header: 'views_24h_percentile', value: (row) => row.views_24h_percentile },
			{ header: 'unique_24h', value: (row) => row.unique_24h },
			{ header: 'views_7d', value: (row) => row.views_7d },
			{ header: 'views_7d_percentile', value: (row) => row.views_7d_percentile },
			{ header: 'unique_7d', value: (row) => row.unique_7d },
			{ header: 'views_30d', value: (row) => row.views_30d },
			{ header: 'views_30d_percentile', value: (row) => row.views_30d_percentile },
			{ header: 'unique_30d', value: (row) => row.unique_30d },
			{ header: 'total_views', value: (row) => row.total_views },
			{ header: 'total_unique_visitors', value: (row) => row.total_unique_visitors },
			{
				header: 'avg_time_on_page_seconds',
				value: (row) => Math.round(row.avg_time_on_page_ms / 1000)
			},
			{
				header: 'median_time_on_page_seconds',
				value: (row) => Math.round(row.median_time_on_page_ms / 1000)
			},
			{ header: 'avg_scroll_pct', value: (row) => row.avg_scroll_pct },
			{ header: 'bounce_rate', value: (row) => row.bounce_rate },
			{ header: 'growth_slope_7d', value: (row) => row.growth_slope_7d },
			{ header: 'decay_rate_after_spike', value: (row) => row.decay_rate_after_spike }
		];

		return [
			columns.map((column) => csvEscape(column.header)).join(','),
			...exportRows.map((row) => columns.map((column) => csvEscape(column.value(row))).join(','))
		].join('\n');
	}

	function getReleaseExportFilename(): string {
		const filterSuffix =
			releaseBandFilter === 'all' ? '' : `-${releaseBandFilter.replace(/_/g, '-')}`;
		return `release-performance-${fromDate || 'start'}-${toDate || 'end'}${filterSuffix}.csv`;
	}

	function exportReleaseAnalysisCsv() {
		const exportRows = releaseVisibleRows;
		if (exportRows.length === 0) {
			notifications.warning('No release rows to export', 2500);
			return;
		}

		const csv = buildReleaseAnalysisCsv(exportRows);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = getReleaseExportFilename();
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
		notifications.success(`Exported ${exportRows.length.toLocaleString()} releases`, 2500);
	}

	function formatBounceRate(value: number): string {
		if (!Number.isFinite(value)) return '0.00%';
		return `${value.toFixed(2)}%`;
	}

	function formatLastModified(value: string | null): string {
		if (!value) return '—';

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;

		if (value.includes('T')) {
			return date.toLocaleString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit'
			});
		}

		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(value: string | null): string {
		if (!value) return '—';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatMinutesToFirstView(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return 'No views yet';
		if (value < 60) return `${value}m`;
		const hours = Math.floor(value / 60);
		const minutes = value % 60;
		if (hours < 24) return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
		const days = Math.floor(hours / 24);
		const remainingHours = hours % 24;
		return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`;
	}

	function formatPerformanceBand(value: string): string {
		switch (value) {
			case 'above_norm':
				return 'Above norm';
			case 'below_norm':
				return 'Below norm';
			case 'near_norm':
				return 'Near norm';
			case 'collecting':
				return 'Collecting';
			default:
				return 'Needs history';
		}
	}

	function formatPercentile(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return '';
		return `${value.toFixed(0)}th pct`;
	}

	function formatBenchmarkScore(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return 'Needs history';
		return value.toFixed(0);
	}

	function formatBenchmarkBasis(value: string): string {
		switch (value) {
			case '24h':
				return '24h';
			case '24h_7d':
				return '24h + 7d';
			case '24h_7d_30d':
				return '24h + 7d + 30d';
			case 'collecting':
				return 'Collecting';
			default:
				return 'Needs history';
		}
	}

	function formatGrowthSlope(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return 'Needs 7d';
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value.toFixed(1)}/day`;
	}

	function formatPostLaunchDecay(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return 'Needs 30d';
		if (value < 0) return `${Math.abs(value).toFixed(0)}% higher`;
		return `${value.toFixed(0)}% lower`;
	}

	function formatReleaseStage(value: string): string {
		switch (value) {
			case 'first_day':
				return 'First day';
			case 'first_week':
				return 'First week';
			case 'first_month':
				return 'First month';
			default:
				return 'Mature';
		}
	}

	function formatReleaseEventType(value: string): string {
		switch (value) {
			case 'published':
				return 'Published';
			case 'republished':
				return 'Republished';
			case 'sitemap_generated':
				return 'Sitemap';
			case 'indexed':
				return 'Indexed';
			case 'newsletter_sent':
				return 'Newsletter';
			case 'social_posted':
				return 'Social post';
			case 'internal_links_added':
				return 'Internal links';
			case 'major_update':
				return 'Major update';
			case 'title_meta_updated':
				return 'Title/meta update';
			default:
				return 'Manual note';
		}
	}

	function formatLiftPct(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return 'No baseline';
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value.toFixed(0)}%`;
	}

	function getBandClass(value: string): string {
		if (value === 'above_norm') return 'band-above';
		if (value === 'below_norm') return 'band-below';
		if (value === 'collecting') return 'band-collecting';
		return 'band-neutral';
	}

	let pageSubtitle = $derived(
		activeTab === 'pageviews'
			? 'Visits and time-on-page for all tracked pages'
			: activeTab === 'timing'
				? 'When visitors show up by day and hour'
				: activeTab === 'releases'
					? 'How personality analysis releases grow after publish'
					: 'Which new visitors activate and come back'
	);

	function openTab(tab: AnalyticsTab) {
		activeTab = tab;
		if (tab === 'pageviews' && !pageviewsLoaded && !loading && !tableLoading && !insightsLoading) {
			void fetchPageviewAnalytics();
		}
		if (tab === 'timing') {
			hasOpenedTiming = true;
			if (!timingLoaded && !timingLoading) {
				void fetchTimingAnalytics();
			}
		}
		if (tab === 'releases') {
			hasOpenedReleases = true;
			if (!releasesLoaded && !releasesLoading) {
				void fetchReleaseAnalytics();
			}
		}
		if (tab === 'cohorts') {
			hasOpenedCohorts = true;
		}
	}

	onMount(() => {
		if (!pageviewsLoaded) {
			void fetchPageviewAnalytics();
		}
	});
</script>

<div class="analytics-page">
	<header class="page-header">
		<div>
			<h1 class="page-title">Analytics</h1>
			<p class="page-subtitle">{pageSubtitle}</p>
		</div>
	</header>

	<div class="analytics-tabs" role="tablist" aria-label="Analytics views">
		<button
			type="button"
			role="tab"
			class="analytics-tab"
			class:active={activeTab === 'pageviews'}
			aria-selected={activeTab === 'pageviews'}
			onclick={() => openTab('pageviews')}
		>
			Pageviews
		</button>
		<button
			type="button"
			role="tab"
			class="analytics-tab"
			class:active={activeTab === 'timing'}
			aria-selected={activeTab === 'timing'}
			onclick={() => openTab('timing')}
		>
			Traffic Timing
		</button>
		<button
			type="button"
			role="tab"
			class="analytics-tab"
			class:active={activeTab === 'releases'}
			aria-selected={activeTab === 'releases'}
			onclick={() => openTab('releases')}
		>
			Release Performance
		</button>
		<button
			type="button"
			role="tab"
			class="analytics-tab"
			class:active={activeTab === 'cohorts'}
			aria-selected={activeTab === 'cohorts'}
			onclick={() => openTab('cohorts')}
		>
			Acquisition &amp; Retention
		</button>
	</div>

	<div hidden={activeTab !== 'pageviews'}>
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

		<section class="insight-card">
			<div class="insight-header">
				<div>
					<h2>Top Pages Over Time</h2>
					<p>
						{formatDateWindow(topPages.windows.selectedFrom, topPages.windows.selectedTo)}
						{#if topPageTotals.length > 0}
							| Top {topPageTotals.length} pages by visits
						{/if}
					</p>
					<p class="trend-hint">Click any path card or table row below to load its trend.</p>
				</div>
				{#if insightsLoading}
					<span class="loading-pill">Updating...</span>
				{/if}
			</div>

			{#if topPageTotals.length === 0}
				<div class="empty-panel">No top page trend data for this date range.</div>
			{:else}
				<div class="top-trend-layout">
					<div class="path-selector">
						{#each topPageTotals as row, index}
							<button
								class="path-pill"
								class:active={selectedTrendPath === row.path}
								onclick={() => void focusPathTrend(row.path)}
							>
								<span class="path-rank">#{index + 1}</span>
								<span class="path-text">{row.path}</span>
								<span class="path-visits">{row.total_visits.toLocaleString()}</span>
							</button>
						{/each}
					</div>

					<div class="trend-panel">
						{#if selectedTrendChartData.length > 0}
							<LineChart
								data={selectedTrendChartData}
								title={selectedTrendPath ? `Visits Trend - ${selectedTrendPath}` : 'Visits Trend'}
								height={300}
								color="#f59e0b"
								showPoints={true}
								showGrid={true}
								showSummary={true}
								showTrend={true}
							/>
						{:else}
							<div class="empty-panel trend-empty">
								{trendLoading
									? 'Loading selected path trend...'
									: 'No trend data available for the selected page in this range.'}
							</div>
						{/if}
						{#if selectedTrendSummary}
							<div class="trend-meta">
								<span>{selectedTrendSummary.total_visits.toLocaleString()} visits</span>
								<span>{selectedTrendSummary.active_days} active days</span>
								<span>{selectedTrendSummary.path_group || 'n/a'}</span>
								{#if trendLoading}
									<span class="loading-pill">Loading path trend...</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</section>

		<section class="top-lists-grid">
			<article class="list-card">
				<div class="list-header">
					<h3>Top Pages This Week</h3>
					<p>{formatDateWindow(topPages.windows.weekFrom, topPages.windows.weekTo)}</p>
				</div>
				{#if weekRankedRows.length === 0}
					<div class="empty-panel">No page visits recorded this week.</div>
				{:else}
					<ol class="rank-list">
						{#each weekRankedRows as row}
							<li>
								<button
									type="button"
									class="rank-item-button"
									class:active={selectedTrendPath === row.path}
									onclick={() => void focusPathTrend(row.path)}
								>
									<div class="rank-top">
										<span class="rank-num">{row.rank}</span>
										<span class="rank-path">{row.path}</span>
										<span class="rank-value">{row.visits.toLocaleString()} visits</span>
									</div>
									<div class="bar-track">
										<div
											class="bar-fill bar-week"
											style={`width: ${Math.max(6, row.width_pct)}%`}
										></div>
									</div>
									<div class="rank-meta">
										{row.unique_visitors.toLocaleString()} uniques | {formatDurationMs(
											row.avg_time_on_page_ms
										)}
										avg
									</div>
								</button>
							</li>
						{/each}
					</ol>
				{/if}
			</article>

			<article class="list-card">
				<div class="list-header">
					<h3>Top Pages This Month</h3>
					<p>{formatDateWindow(topPages.windows.monthFrom, topPages.windows.monthTo)}</p>
				</div>
				{#if monthRankedRows.length === 0}
					<div class="empty-panel">No page visits recorded this month.</div>
				{:else}
					<ol class="rank-list">
						{#each monthRankedRows as row}
							<li>
								<button
									type="button"
									class="rank-item-button"
									class:active={selectedTrendPath === row.path}
									onclick={() => void focusPathTrend(row.path)}
								>
									<div class="rank-top">
										<span class="rank-num">{row.rank}</span>
										<span class="rank-path">{row.path}</span>
										<span class="rank-value">{row.visits.toLocaleString()} visits</span>
									</div>
									<div class="bar-track">
										<div
											class="bar-fill bar-month"
											style={`width: ${Math.max(6, row.width_pct)}%`}
										></div>
									</div>
									<div class="rank-meta">
										{row.unique_visitors.toLocaleString()} uniques | {formatDurationMs(
											row.avg_time_on_page_ms
										)}
										avg
									</div>
								</button>
							</li>
						{/each}
					</ol>
				{/if}
			</article>

			<article class="list-card">
				<div class="list-header">
					<h3>Top Pages by Session Duration</h3>
					<p>{formatDateWindow(topPages.windows.selectedFrom, topPages.windows.selectedTo)}</p>
				</div>
				{#if durationRankedRows.length === 0}
					<div class="empty-panel">No pages meet the minimum visit threshold for this range.</div>
				{:else}
					<ol class="rank-list">
						{#each durationRankedRows as row}
							<li>
								<button
									type="button"
									class="rank-item-button"
									class:active={selectedTrendPath === row.path}
									onclick={() => void focusPathTrend(row.path)}
								>
									<div class="rank-top">
										<span class="rank-num">{row.rank}</span>
										<span class="rank-path">{row.path}</span>
										<span class="rank-value">{formatDurationMs(row.avg_time_on_page_ms)} avg</span>
									</div>
									<div class="bar-track">
										<div
											class="bar-fill bar-duration"
											style={`width: ${Math.max(6, row.width_pct)}%`}
										></div>
									</div>
									<div class="rank-meta">
										{row.visits.toLocaleString()} visits | median
										{formatDurationMs(row.median_time_on_page_ms)} | bounce
										{formatBounceRate(row.bounce_rate)}
									</div>
								</button>
							</li>
						{/each}
					</ol>
				{/if}
			</article>
		</section>

		<section class="table-card">
			<div class="table-header">
				<div>
					<h2>Page Breakdown (Raw Paths)</h2>
					<p class="table-window-summary">
						{pageBreakdownRangeLabel || getPageBreakdownWindowLabel(pageBreakdownWindow)}
					</p>
				</div>
				<div class="table-header-controls">
					<div class="table-window-tabs" role="tablist" aria-label="Page breakdown time windows">
						{#each pageBreakdownWindowOptions as option}
							<button
								type="button"
								role="tab"
								class="window-tab"
								class:active={pageBreakdownWindow === option.key}
								aria-selected={pageBreakdownWindow === option.key}
								disabled={tableLoading && pageBreakdownWindow !== option.key}
								onclick={() => void selectPageBreakdownWindow(option.key)}
							>
								{option.label}
							</button>
						{/each}
					</div>
					<div class="table-meta">
						<span>{pagination.total.toLocaleString()} total rows</span>
						<span>Page {page} of {totalPages}</span>
						<span>
							Sorted by {tableSortColumns.find((column) => column.key === sortBy)?.label ||
								'Visits'} (
							{sortDir})
						</span>
					</div>
				</div>
			</div>
			<div class="table-wrapper" role="region" aria-label="Page breakdown">
				<table class="data-table pageview-table">
					<thead>
						<tr>
							{#each tableSortColumns as column}
								<th class:num={column.numeric} aria-sort={getAriaSort(column.key)}>
									<button
										type="button"
										class="sort-button"
										class:num={column.numeric}
										class:active={sortBy === column.key}
										onclick={() => handleSort(column.key)}
									>
										<span>{column.label}</span>
										<span class="sort-indicator">{getSortIndicator(column.key)}</span>
									</button>
								</th>
							{/each}
							<th>Last Modified</th>
						</tr>
					</thead>
					<tbody>
						{#if tableLoading}
							<tr>
								<td colspan="11" class="empty">Loading...</td>
							</tr>
						{:else if rows.length === 0}
							<tr>
								<td colspan="11" class="empty">No data for this filter set.</td>
							</tr>
						{:else}
							{#each rows as row}
								{@const pageHref = getPageHref(row.path)}
								<tr class:active-row={selectedTrendPath === row.path}>
									<td class="path" data-label="Path">
										<div class="table-path-cell">
											{#if pageHref}
												<a class="table-page-link" href={pageHref} title={`Open ${row.path}`}>
													{row.path}
												</a>
											{:else}
												<span class="table-page-text">{row.path}</span>
											{/if}
											<button
												type="button"
												class="table-trend-button"
												class:active={selectedTrendPath === row.path}
												onclick={() => void focusPathTrend(row.path)}
											>
												Trend
											</button>
										</div>
									</td>
									<td data-label="Group">{row.path_group}</td>
									<td data-label="Type">{row.content_type}</td>
									<td class="num" data-label="Visits">{row.visits.toLocaleString()}</td>
									<td class="num" data-label="Unique">
										{row.unique_visitors.toLocaleString()}
									</td>
									<td class="num" data-label="Auth">
										{row.authenticated_visits.toLocaleString()}
									</td>
									<td class="num" data-label="Anon">
										{row.anonymous_visits.toLocaleString()}
									</td>
									<td class="num" data-label="Avg time">
										{formatDurationMs(row.avg_time_on_page_ms)}
									</td>
									<td class="num" data-label="Median">
										{formatDurationMs(row.median_time_on_page_ms)}
									</td>
									<td class="num" data-label="Bounce">
										{formatBounceRate(row.bounce_rate)}
									</td>
									<td data-label="Last modified">
										{#if row.last_modified_at}
											<time datetime={row.last_modified_at}>
												{formatLastModified(row.last_modified_at)}
											</time>
										{:else}
											—
										{/if}
									</td>
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

	{#if activeTab === 'timing' || hasOpenedTiming}
		<div hidden={activeTab !== 'timing'}>
			<section class="insight-card">
				<div class="insight-header">
					<div>
						<h2>Traffic Timing</h2>
						<p>
							{formatDateWindow(fromDate, toDate)} | {scopeOptions.find(
								(option) => option.value === scope
							)?.label ?? 'All Pages'}
						</p>
					</div>
					<button class="btn btn-secondary" onclick={fetchTimingAnalytics} disabled={timingLoading}>
						{timingLoading ? 'Refreshing...' : 'Refresh'}
					</button>
				</div>

				{#if timingLoading && !timingLoaded}
					<div class="empty-panel">Loading traffic timing...</div>
				{:else if timingRows.length === 0}
					<div class="empty-panel">No visit timing data for this filter set.</div>
				{:else}
					<div class="timing-overview">
						<div class="timing-stat">
							<span>Total visits</span>
							<strong
								>{timingRows.reduce((sum, row) => sum + row.visits, 0).toLocaleString()}</strong
							>
						</div>
						<div class="timing-stat">
							<span>Peak slot</span>
							<strong>{topTimingSlots[0] ? getTimingSlotLabel(topTimingSlots[0]) : '—'}</strong>
						</div>
						<div class="timing-stat">
							<span>Peak visits</span>
							<strong>{(topTimingSlots[0]?.visits ?? 0).toLocaleString()}</strong>
						</div>
					</div>

					<div class="heatmap-wrapper" role="region" aria-label="Traffic timing heatmap">
						<table class="heatmap-table">
							<thead>
								<tr>
									<th>Day</th>
									{#each timingHours as hour}
										<th>{formatHourLabel(hour)}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each timingDayLabels as dayLabel, dayIndex}
									<tr>
										<th>{dayLabel}</th>
										{#each timingHours as hour}
											{@const cell = getTimingCell(dayIndex, hour)}
											<td
												style={`--heat: ${Math.max(0.08, cell.visits / timingMaxVisits).toFixed(2)}`}
												title={`${dayLabel} ${formatHourLabel(hour)}: ${cell.visits.toLocaleString()} visits`}
											>
												<span>{cell.visits > 0 ? cell.visits.toLocaleString() : ''}</span>
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="timing-top-list">
						{#each topTimingSlots as row}
							<div class="timing-top-item">
								<span>{getTimingSlotLabel(row)}</span>
								<strong>{row.visits.toLocaleString()} visits</strong>
								<small>{row.unique_visitors.toLocaleString()} uniques</small>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	{/if}

	{#if activeTab === 'releases' || hasOpenedReleases}
		<div hidden={activeTab !== 'releases'}>
			<section class="insight-card release-performance-card">
				<div class="insight-header release-header">
					<div>
						<h2>Personality Analysis Release Performance</h2>
						<p>Personality analysis releases in {formatDateWindow(fromDate, toDate)}</p>
					</div>
					<div class="release-header-actions">
						<button
							class="btn btn-secondary"
							onclick={exportReleaseAnalysisCsv}
							disabled={releasesLoading || releaseVisibleRows.length === 0}
						>
							Export CSV
						</button>
						<button
							class="btn btn-secondary"
							onclick={fetchReleaseAnalytics}
							disabled={releasesLoading}
						>
							{releasesLoading ? 'Refreshing...' : 'Refresh'}
						</button>
					</div>
				</div>

				{#if releasesLoading && !releasesLoaded}
					<div class="empty-panel">Loading release performance...</div>
				{:else if releaseRows.length === 0}
					<div class="empty-panel">No personality releases found for this date range.</div>
				{:else}
					<div class="release-command-row">
						<div class="release-band-filters" role="group" aria-label="Release performance filter">
							{#each releaseBandFilterOptions as option}
								<button
									type="button"
									class="summary-filter"
									class:active={releaseBandFilter === option.key}
									class:above={option.key === 'above_norm'}
									class:below={option.key === 'below_norm'}
									onclick={() => setReleaseBandFilter(option.key)}
								>
									<span>{option.label}</span>
									<strong>{getReleaseBandCount(option.key).toLocaleString()}</strong>
								</button>
							{/each}
						</div>
						<div class="release-sort-controls">
							<label>
								<span>Sort by</span>
								<select
									value={releaseSortBy}
									onchange={(event) =>
										updateReleaseSortKey((event.currentTarget as HTMLSelectElement).value)}
								>
									{#each releaseSortOptions as option}
										<option value={option.key}>{option.label}</option>
									{/each}
								</select>
							</label>
							<button type="button" class="btn btn-secondary" onclick={toggleReleaseSortDirection}>
								{releaseSortDir === 'desc' ? 'High to low' : 'Low to high'}
							</button>
						</div>
					</div>

					<div class="release-signal-grid">
						<div class="release-signal-panel over">
							<div class="signal-header">
								<span>Overperforming</span>
								<strong>{releaseSummary.aboveNorm.toLocaleString()}</strong>
							</div>
							{#if overperformingRows.length === 0}
								<p>No releases above benchmark yet.</p>
							{:else}
								{#each overperformingRows as row}
									<button type="button" onclick={() => focusReleaseSignal(row.slug, 'above_norm')}>
										<span>{row.title || row.slug}</span>
										<strong>{formatBenchmarkScore(row.benchmark_score)}</strong>
									</button>
								{/each}
							{/if}
						</div>
						<div class="release-signal-panel under">
							<div class="signal-header">
								<span>Underperforming</span>
								<strong>{releaseSummary.belowNorm.toLocaleString()}</strong>
							</div>
							{#if underperformingRows.length === 0}
								<p>No releases below benchmark yet.</p>
							{:else}
								{#each underperformingRows as row}
									<button type="button" onclick={() => focusReleaseSignal(row.slug, 'below_norm')}>
										<span>{row.title || row.slug}</span>
										<strong>{formatBenchmarkScore(row.benchmark_score)}</strong>
									</button>
								{/each}
							{/if}
						</div>
					</div>

					<div class="release-result-meta">
						<span>
							Showing {releaseVisibleRows.length.toLocaleString()} of {releaseSummary.total.toLocaleString()}
							releases
						</span>
						<span>
							{releaseSummary.nearNorm.toLocaleString()} near norm,
							{releaseSummary.collecting.toLocaleString()} collecting,
							{releaseSummary.needsHistory.toLocaleString()} need history
						</span>
					</div>

					<div class="release-layout">
						<div
							class="table-wrapper release-table-wrapper"
							role="region"
							aria-label="Release performance"
						>
							<table class="data-table release-table">
								<thead>
									<tr>
										{#each releaseTableColumns as column}
											<th class:num={column.numeric} aria-sort={getReleaseAriaSort(column.key)}>
												<button
													type="button"
													class="sort-button"
													class:num={column.numeric}
													class:active={releaseSortBy === column.key}
													onclick={() => handleReleaseSort(column.key)}
												>
													<span>{column.label}</span>
													<span class="sort-indicator">{getReleaseSortIndicator(column.key)}</span>
												</button>
											</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#if releaseVisibleRows.length === 0}
										<tr>
											<td colspan="8" class="empty">No releases match this performance filter.</td>
										</tr>
									{:else}
										{#each releaseVisibleRows as row}
											{@const releaseHref = getPageHref(row.path)}
											<tr class:active-row={selectedReleaseSlug === row.slug}>
												<td data-label="Release">
													<div class="release-title-row">
														<button
															type="button"
															class="table-path-button"
															class:active={selectedReleaseSlug === row.slug}
															title={row.title || row.slug}
															onclick={() => void selectRelease(row.slug)}
														>
															{row.title || row.slug}
														</button>
													</div>
													{#if releaseHref}
														<a
															class="release-path release-path-link"
															href={releaseHref}
															title={row.path}
														>
															{row.path}
														</a>
													{:else}
														<div class="release-path" title={row.path}>{row.path}</div>
													{/if}
												</td>
												<td data-label="Published">{formatDateTime(row.published_at)}</td>
												<td data-label="First view"
													>{formatMinutesToFirstView(row.minutes_to_first_view)}</td
												>
												<td class="num" data-label="24h">
													{row.views_24h.toLocaleString()}
													<small>{row.unique_24h.toLocaleString()} unique</small>
													{#if row.views_24h_percentile !== null}
														<small>{formatPercentile(row.views_24h_percentile)}</small>
													{/if}
												</td>
												<td class="num" data-label="7d">
													{row.views_7d.toLocaleString()}
													{#if row.views_7d_percentile !== null}
														<small>{formatPercentile(row.views_7d_percentile)}</small>
													{/if}
												</td>
												<td class="num" data-label="30d">
													{row.views_30d.toLocaleString()}
													{#if row.views_30d_percentile !== null}
														<small>{formatPercentile(row.views_30d_percentile)}</small>
													{/if}
												</td>
												<td class="num" data-label="Score">
													{formatBenchmarkScore(row.benchmark_score)}
													<small>{formatBenchmarkBasis(row.benchmark_basis)}</small>
													{#if row.benchmark_sample_size > 0}
														<small>n={row.benchmark_sample_size.toLocaleString()}</small>
													{/if}
												</td>
												<td data-label="Band">
													<span class={`band-pill ${getBandClass(row.performance_band)}`}>
														{formatPerformanceBand(row.performance_band)}
													</span>
													<small>{formatReleaseStage(row.release_stage)}</small>
												</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						</div>

						<div class="trend-panel release-growth-panel">
							{#if selectedRelease}
								<div class="release-detail-header">
									<div>
										<h3>{selectedRelease.title || selectedRelease.slug}</h3>
										<p>
											{selectedRelease.total_views.toLocaleString()} total views |
											{selectedRelease.total_unique_visitors.toLocaleString()} unique visitors
										</p>
									</div>
									<span class={`band-pill ${getBandClass(selectedRelease.performance_band)}`}>
										{formatPerformanceBand(selectedRelease.performance_band)}
									</span>
								</div>

								{#if releaseGrowthChartData.length > 0}
									<LineChart
										data={releaseGrowthChartData}
										title="Cumulative Views After Publish"
										xLabel="Days Since Publish"
										height={240}
										color="#10b981"
										showPoints={true}
										showGrid={true}
										showSummary={true}
										showTrend={true}
									/>
								{:else}
									<div class="empty-panel trend-empty">
										{releaseGrowthLoading
											? 'Loading release growth...'
											: 'No growth data available for this release.'}
									</div>
								{/if}

								<div class="release-detail-grid">
									<div>
										<span>First hour</span>
										<strong>{selectedRelease.views_1h.toLocaleString()}</strong>
									</div>
									<div>
										<span>First 6 hours</span>
										<strong>{selectedRelease.views_6h.toLocaleString()}</strong>
									</div>
									<div>
										<span>Score</span>
										<strong>{formatBenchmarkScore(selectedRelease.benchmark_score)}</strong>
									</div>
									<div>
										<span>Basis</span>
										<strong>{formatBenchmarkBasis(selectedRelease.benchmark_basis)}</strong>
									</div>
									<div>
										<span>Sample</span>
										<strong>
											{selectedRelease.benchmark_sample_size > 0
												? selectedRelease.benchmark_sample_size.toLocaleString()
												: 'Needs history'}
										</strong>
									</div>
									<div>
										<span>7d slope</span>
										<strong>{formatGrowthSlope(selectedRelease.growth_slope_7d)}</strong>
									</div>
									<div>
										<span>After week 1</span>
										<strong>{formatPostLaunchDecay(selectedRelease.decay_rate_after_spike)}</strong>
									</div>
									<div>
										<span>Avg time</span>
										<strong>{formatDurationMs(selectedRelease.avg_time_on_page_ms)}</strong>
									</div>
									<div>
										<span>Avg scroll</span>
										<strong>{selectedRelease.avg_scroll_pct}%</strong>
									</div>
									<div>
										<span>Bounce</span>
										<strong>{formatBounceRate(selectedRelease.bounce_rate)}</strong>
									</div>
								</div>

								<div class="release-events-section">
									<div class="release-events-header">
										<div>
											<h4>Event Impact</h4>
											<p>Compare 7 days before and after each release event.</p>
										</div>
										<button
											type="button"
											class="btn btn-secondary"
											onclick={() => void fetchReleaseEvents(selectedRelease.slug, true)}
											disabled={releaseEventsLoading}
										>
											{releaseEventsLoading ? 'Refreshing...' : 'Refresh'}
										</button>
									</div>

									<form
										class="release-event-form"
										onsubmit={(event) => {
											event.preventDefault();
											void submitReleaseEvent();
										}}
									>
										<label>
											<span>Event</span>
											<select bind:value={releaseEventType}>
												{#each releaseEventTypeOptions as option}
													<option value={option.value}>{option.label}</option>
												{/each}
											</select>
										</label>
										<label>
											<span>Source</span>
											<input
												type="text"
												placeholder="mailchimp, x, reddit..."
												bind:value={releaseEventSource}
											/>
										</label>
										<label>
											<span>When</span>
											<input type="datetime-local" bind:value={releaseEventAt} />
										</label>
										<button type="submit" class="btn btn-primary" disabled={releaseEventSubmitting}>
											{releaseEventSubmitting ? 'Saving...' : 'Record'}
										</button>
									</form>

									{#if releaseEventsLoading && releaseEventRows.length === 0}
										<div class="empty-panel trend-empty">Loading release events...</div>
									{:else if releaseEventRows.length === 0}
										<div class="empty-panel trend-empty">No release events recorded yet.</div>
									{:else}
										<div class="release-events-list">
											{#each releaseEventRows as event}
												<div class="release-event-item">
													<div>
														<strong>{formatReleaseEventType(event.event_type)}</strong>
														<span>
															{formatDateTime(event.event_at)}
															{event.source ? ` | ${event.source}` : ''}
														</span>
													</div>
													<div class="release-event-impact">
														<span>
															{event.views_before.toLocaleString()} -> {event.views_after.toLocaleString()}
															views
														</span>
														<strong class:positive={event.lift_views > 0}>
															{event.lift_views > 0 ? '+' : ''}{event.lift_views.toLocaleString()}
														</strong>
														<small>{formatLiftPct(event.lift_pct)}</small>
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{:else}
								<div class="empty-panel trend-empty">
									Select a release to view its growth curve.
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</section>
		</div>
	{/if}

	{#if activeTab === 'cohorts' || hasOpenedCohorts}
		<div hidden={activeTab !== 'cohorts'}>
			<RetentionAnalyticsPanel filters={data.cohortFilters} />
		</div>
	{/if}
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

	.analytics-tabs {
		display: flex;
		gap: 8px;
	}

	.analytics-tab {
		border: 1px solid var(--bg-elevated);
		border-radius: 999px;
		padding: 8px 14px;
		background: var(--bg-surface);
		color: var(--text-secondary);
		font-weight: 600;
		cursor: pointer;
	}

	.analytics-tab.active {
		background: rgba(59, 130, 246, 0.12);
		border-color: rgba(59, 130, 246, 0.3);
		color: #93c5fd;
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
	.table-card,
	.insight-card,
	.list-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
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

	.insight-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.insight-header h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.insight-header p {
		margin: 4px 0 0;
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.trend-hint {
		margin: 6px 0 0;
		font-size: 0.76rem;
		color: var(--text-secondary);
		opacity: 0.85;
	}

	.loading-pill {
		font-size: 0.75rem;
		padding: 4px 8px;
		border-radius: 999px;
		background: rgba(251, 113, 133, 0.15);
		color: #93c5fd;
		white-space: nowrap;
	}

	.empty-panel {
		padding: 14px;
		border: 1px dashed var(--bg-elevated);
		border-radius: 10px;
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.trend-empty {
		min-height: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.top-trend-layout {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 12px;
	}

	.path-selector {
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow-y: auto;
		padding-right: 2px;
	}

	.path-pill {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 8px;
		align-items: center;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		color: var(--text-primary);
		padding: 9px 10px;
		border-radius: 9px;
		cursor: pointer;
		text-align: left;
	}

	.path-pill:hover {
		border-color: var(--bg-highlight);
	}

	.path-pill.active {
		border-color: #f59e0b;
		background: rgba(245, 158, 11, 0.12);
	}

	.path-rank {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary);
	}

	.path-text {
		font-size: 0.82rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.path-visits {
		font-size: 0.74rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.trend-panel {
		border: 1px solid var(--bg-elevated);
		border-radius: 10px;
		padding: 8px;
		background: var(--bg-deep);
	}

	.trend-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.78rem;
		color: var(--text-secondary);
		padding: 6px 10px 8px;
		flex-wrap: wrap;
	}

	.top-lists-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.list-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 10px;
	}

	.list-header h3 {
		margin: 0;
		font-size: 1rem;
	}

	.list-header p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.rank-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.rank-item-button {
		width: 100%;
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: inherit;
		text-align: left;
		cursor: pointer;
		background: var(--bg-deep);
		border-radius: 9px;
		padding: 9px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.rank-item-button:hover {
		border-color: var(--bg-highlight);
	}

	.rank-item-button.active {
		border-color: #f59e0b;
		background: rgba(245, 158, 11, 0.12);
	}

	.rank-top {
		display: grid;
		grid-template-columns: 24px 1fr auto;
		align-items: center;
		gap: 8px;
	}

	.rank-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 999px;
		background: rgba(148, 163, 184, 0.2);
		color: var(--text-primary);
		font-size: 0.75rem;
		font-weight: 700;
	}

	.rank-path {
		font-size: 0.8rem;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rank-value {
		font-size: 0.74rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.bar-track {
		height: 8px;
		background: rgba(148, 163, 184, 0.15);
		border-radius: 999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
	}

	.bar-week {
		background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
	}

	.bar-month {
		background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
	}

	.bar-duration {
		background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
	}

	.rank-meta {
		font-size: 0.73rem;
		color: var(--text-secondary);
	}

	.timing-overview,
	.release-summary-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 12px;
	}

	.timing-stat {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		border-radius: 8px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.timing-stat span,
	.release-detail-grid span {
		font-size: 0.74rem;
		color: var(--text-secondary);
	}

	.timing-stat strong,
	.release-detail-grid strong {
		font-size: 1rem;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.heatmap-wrapper {
		overflow-x: auto;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
	}

	.heatmap-table {
		width: 100%;
		min-width: 980px;
		border-collapse: collapse;
		font-size: 0.74rem;
	}

	.heatmap-table th,
	.heatmap-table td {
		border: 1px solid rgba(148, 163, 184, 0.15);
		padding: 6px;
		text-align: center;
	}

	.heatmap-table th {
		background: var(--bg-deep);
		color: var(--text-secondary);
		font-weight: 700;
	}

	.heatmap-table td {
		background: rgba(59, 130, 246, var(--heat));
		color: #eff6ff;
		min-width: 38px;
		height: 34px;
	}

	.heatmap-table td span {
		font-weight: 700;
	}

	.timing-top-list {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-top: 12px;
	}

	.timing-top-item {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		border-radius: 8px;
		padding: 9px;
		display: grid;
		gap: 2px;
	}

	.timing-top-item span,
	.timing-top-item small {
		color: var(--text-secondary);
	}

	.timing-top-item strong {
		color: var(--text-primary);
	}

	.release-performance-card {
		padding: 12px;
	}

	.release-header {
		margin-bottom: 10px;
	}

	.release-header-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.release-command-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		align-items: stretch;
		margin-bottom: 10px;
	}

	.release-band-filters {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 8px;
	}

	.summary-filter {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: var(--text-primary);
		border-radius: 8px;
		padding: 8px 9px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		cursor: pointer;
		min-width: 0;
	}

	.summary-filter span {
		font-size: 0.72rem;
		color: var(--text-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.summary-filter strong {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.summary-filter:hover {
		border-color: var(--bg-highlight);
	}

	.summary-filter.active {
		border-color: #3b82f6;
		background: rgba(59, 130, 246, 0.14);
	}

	.summary-filter.above.active {
		border-color: rgba(16, 185, 129, 0.7);
		background: rgba(16, 185, 129, 0.14);
	}

	.summary-filter.below.active {
		border-color: rgba(251, 113, 133, 0.7);
		background: rgba(251, 113, 133, 0.14);
	}

	.release-sort-controls {
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		padding: 8px;
		display: flex;
		align-items: end;
		gap: 8px;
	}

	.release-sort-controls label {
		display: grid;
		gap: 4px;
		min-width: 170px;
	}

	.release-sort-controls label span {
		font-size: 0.72rem;
		color: var(--text-secondary);
	}

	.release-sort-controls select {
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-surface);
		color: var(--text-primary);
		padding: 8px;
	}

	.release-signal-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 8px;
	}

	.release-signal-panel {
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		padding: 9px;
		display: grid;
		gap: 7px;
		min-width: 0;
	}

	.release-signal-panel.over {
		border-color: rgba(16, 185, 129, 0.35);
	}

	.release-signal-panel.under {
		border-color: rgba(251, 113, 133, 0.35);
	}

	.signal-header,
	.release-signal-panel button {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 8px;
		align-items: center;
	}

	.signal-header span {
		font-size: 0.78rem;
		color: var(--text-secondary);
		font-weight: 700;
	}

	.signal-header strong {
		color: var(--text-primary);
	}

	.release-signal-panel button {
		border: none;
		background: transparent;
		color: var(--text-primary);
		padding: 0;
		cursor: pointer;
		text-align: left;
	}

	.release-signal-panel button:hover span {
		color: #fbbf24;
		text-decoration: underline;
	}

	.release-signal-panel button span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.8rem;
	}

	.release-signal-panel button strong {
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	.release-signal-panel p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.78rem;
	}

	.release-result-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 8px;
		color: var(--text-secondary);
		font-size: 0.78rem;
		flex-wrap: wrap;
	}

	.release-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(400px, 0.92fr);
		gap: 12px;
	}

	.release-table-wrapper {
		max-height: 660px;
		overflow-y: auto;
	}

	.release-table {
		min-width: 1040px;
		table-layout: fixed;
	}

	.release-table th:nth-child(1),
	.release-table td:nth-child(1) {
		width: 330px;
	}

	.release-table th:nth-child(2),
	.release-table td:nth-child(2) {
		width: 128px;
	}

	.release-table th:nth-child(3),
	.release-table td:nth-child(3),
	.release-table th:nth-child(7),
	.release-table td:nth-child(7) {
		width: 104px;
	}

	.release-table th:nth-child(4),
	.release-table td:nth-child(4),
	.release-table th:nth-child(5),
	.release-table td:nth-child(5),
	.release-table th:nth-child(6),
	.release-table td:nth-child(6) {
		width: 74px;
	}

	.release-table th:nth-child(8),
	.release-table td:nth-child(8) {
		width: 120px;
	}

	.release-table th {
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.release-table td {
		padding-top: 8px;
		padding-bottom: 8px;
	}

	.release-table td small {
		display: block;
		margin-top: 3px;
		color: var(--text-secondary);
		font-size: 0.7rem;
	}

	.release-title-row {
		display: block;
	}

	.release-path {
		margin-top: 4px;
		color: var(--text-secondary);
		font-size: 0.72rem;
		line-height: 1.35;
		overflow-wrap: break-word;
		word-break: normal;
	}

	.release-path-link {
		display: block;
		text-decoration: none;
	}

	.release-path-link:hover {
		color: #fbbf24;
		text-decoration: underline;
	}

	.band-pill {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		padding: 4px 8px;
		font-size: 0.72rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.band-above {
		background: rgba(16, 185, 129, 0.16);
		color: #86efac;
	}

	.band-below {
		background: rgba(251, 113, 133, 0.16);
		color: #fda4af;
	}

	.band-collecting {
		background: rgba(59, 130, 246, 0.16);
		color: #bfdbfe;
	}

	.band-neutral {
		background: rgba(148, 163, 184, 0.18);
		color: var(--text-secondary);
	}

	.release-growth-panel {
		padding: 12px;
	}

	.release-growth-panel .trend-empty {
		min-height: 220px;
	}

	.release-detail-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 10px;
	}

	.release-detail-header h3 {
		margin: 0;
		font-size: 1rem;
	}

	.release-detail-header p {
		margin: 4px 0 0;
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	.release-detail-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 10px;
	}

	.release-detail-grid div {
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		padding: 8px;
		display: grid;
		gap: 4px;
	}

	.release-events-section {
		margin-top: 14px;
		border-top: 1px solid var(--bg-elevated);
		padding-top: 12px;
	}

	.release-events-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 10px;
	}

	.release-events-header h4 {
		margin: 0;
		font-size: 0.95rem;
	}

	.release-events-header p {
		margin: 3px 0 0;
		color: var(--text-secondary);
		font-size: 0.76rem;
	}

	.release-event-form {
		display: grid;
		grid-template-columns: minmax(120px, 0.8fr) minmax(130px, 1fr) minmax(170px, 1fr) auto;
		gap: 8px;
		align-items: end;
		margin-bottom: 12px;
	}

	.release-event-form label {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.release-event-form label span {
		font-size: 0.72rem;
		color: var(--text-secondary);
	}

	.release-event-form select,
	.release-event-form input {
		width: 100%;
		min-width: 0;
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		background: var(--bg-deep);
		color: var(--text-primary);
		padding: 8px;
		font-size: 0.8rem;
	}

	.release-events-list {
		display: grid;
		gap: 8px;
	}

	.release-event-item {
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		padding: 9px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		align-items: center;
	}

	.release-event-item strong {
		color: var(--text-primary);
	}

	.release-event-item span,
	.release-event-item small {
		display: block;
		color: var(--text-secondary);
		font-size: 0.74rem;
	}

	.release-event-impact {
		text-align: right;
		white-space: nowrap;
	}

	.release-event-impact strong {
		font-size: 0.95rem;
	}

	.release-event-impact strong.positive {
		color: #86efac;
	}

	.table-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 10px;
	}

	.table-header h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.table-window-summary {
		margin: 4px 0 0;
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	.table-header-controls {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-end;
	}

	.table-window-tabs {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: flex-end;
	}

	.window-tab {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: var(--text-secondary);
		font-size: 0.74rem;
		font-weight: 600;
		border-radius: 999px;
		padding: 5px 9px;
		cursor: pointer;
	}

	.window-tab:hover {
		border-color: var(--bg-highlight);
		color: var(--text-primary);
	}

	.window-tab.active {
		border-color: #3b82f6;
		background: rgba(251, 113, 133, 0.16);
		color: #bfdbfe;
	}

	.window-tab:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.table-meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
		color: var(--text-secondary);
		font-size: 0.85rem;
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

	.pageview-table {
		min-width: 1320px;
		table-layout: fixed;
	}

	.pageview-table th:nth-child(1),
	.pageview-table td:nth-child(1) {
		width: 360px;
	}

	.pageview-table th:nth-child(2),
	.pageview-table td:nth-child(2) {
		width: 120px;
	}

	.pageview-table th:nth-child(3),
	.pageview-table td:nth-child(3) {
		width: 96px;
	}

	.pageview-table th:nth-child(4),
	.pageview-table td:nth-child(4),
	.pageview-table th:nth-child(5),
	.pageview-table td:nth-child(5),
	.pageview-table th:nth-child(6),
	.pageview-table td:nth-child(6),
	.pageview-table th:nth-child(7),
	.pageview-table td:nth-child(7) {
		width: 80px;
	}

	.pageview-table th:nth-child(8),
	.pageview-table td:nth-child(8),
	.pageview-table th:nth-child(9),
	.pageview-table td:nth-child(9) {
		width: 100px;
	}

	.pageview-table th:nth-child(10),
	.pageview-table td:nth-child(10) {
		width: 82px;
	}

	.pageview-table th:nth-child(11),
	.pageview-table td:nth-child(11) {
		width: 142px;
	}

	.data-table th,
	.data-table td {
		padding: 10px 10px;
		border-bottom: 1px solid var(--bg-elevated);
		text-align: left;
		vertical-align: top;
	}

	.data-table th {
		background: var(--bg-deep);
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 6px 8px;
	}

	.sort-button {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		background: transparent;
		color: inherit;
		border: none;
		font-size: inherit;
		font-weight: inherit;
		text-transform: inherit;
		letter-spacing: inherit;
		cursor: pointer;
		padding: 4px 2px;
	}

	.sort-button.num {
		justify-content: flex-end;
	}

	.sort-button.active {
		color: var(--text-primary);
	}

	.sort-indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 12px;
		font-size: 0.74rem;
		color: #fbbf24;
	}

	.table-path-cell {
		display: block;
	}

	.table-page-link,
	.table-page-text {
		display: block;
		color: var(--text-primary);
		font-size: 0.84rem;
		line-height: 1.3;
		max-width: 100%;
		overflow-wrap: break-word;
		word-break: normal;
	}

	.table-page-link {
		text-decoration: none;
	}

	.table-page-link:hover {
		color: #fbbf24;
		text-decoration: underline;
	}

	.table-trend-button {
		border: 1px solid var(--bg-elevated);
		border-radius: 999px;
		background: rgba(148, 163, 184, 0.1);
		color: var(--text-secondary);
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1;
		padding: 5px 8px;
		white-space: nowrap;
	}

	.table-trend-button:hover {
		border-color: rgba(245, 158, 11, 0.55);
		background: rgba(245, 158, 11, 0.12);
		color: #fbbf24;
		text-decoration: none;
	}

	.table-trend-button {
		cursor: pointer;
		margin-top: 6px;
	}

	.table-trend-button.active {
		border-color: rgba(245, 158, 11, 0.7);
		background: rgba(245, 158, 11, 0.16);
		color: #fbbf24;
	}

	.table-path-button {
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		color: var(--text-primary);
		font-size: 0.84rem;
		line-height: 1.25;
		cursor: pointer;
		text-align: left;
		max-width: 100%;
		overflow-wrap: break-word;
		word-break: normal;
	}

	.table-path-button:hover {
		color: #fbbf24;
		text-decoration: underline;
	}

	.table-path-button.active {
		color: #fbbf24;
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

	.data-table tr.active-row {
		background: rgba(245, 158, 11, 0.12);
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

	@media (max-width: 1300px) {
		.top-lists-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.release-layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 1200px) {
		.metrics-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.filter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.top-trend-layout {
			grid-template-columns: 280px 1fr;
		}

		.timing-overview,
		.release-summary-grid,
		.timing-top-list,
		.release-detail-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.release-event-form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.release-command-row {
			grid-template-columns: 1fr;
		}

		.release-sort-controls {
			justify-content: flex-start;
		}

		.release-band-filters {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 980px) {
		.charts-grid,
		.top-lists-grid,
		.top-trend-layout,
		.release-signal-grid {
			grid-template-columns: 1fr;
		}

		.path-selector {
			max-height: 220px;
		}
	}

	@media (max-width: 700px) {
		.metrics-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.filter-grid {
			grid-template-columns: 1fr;
		}

		.table-header,
		.list-header,
		.insight-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}

		.table-header-controls,
		.table-window-tabs,
		.table-meta {
			align-items: flex-start;
			justify-content: flex-start;
		}

		.rank-top {
			grid-template-columns: 24px 1fr;
			grid-template-areas:
				'num path'
				'num value';
		}

		.rank-num {
			grid-area: num;
		}

		.rank-path {
			grid-area: path;
		}

		.rank-value {
			grid-area: value;
		}

		.table-wrapper {
			border: none;
			overflow: visible;
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

		.pageview-table,
		.release-table {
			min-width: 0;
			table-layout: auto;
		}

		.pageview-table th,
		.pageview-table td,
		.release-table th,
		.release-table td {
			width: auto;
		}

		.data-table tbody {
			display: grid;
			gap: 0.8rem;
		}

		.data-table tr {
			border: 1px solid var(--bg-elevated);
			border-radius: 12px;
			background: color-mix(in srgb, var(--bg-surface) 94%, var(--bg-base));
			padding: 0.95rem;
		}

		.data-table th,
		.data-table td {
			border-bottom: none;
			padding: 0;
		}

		.data-table td {
			display: grid;
			grid-template-columns: minmax(88px, 0.9fr) minmax(0, 1fr);
			gap: 0.75rem;
			align-items: start;
		}

		.data-table td + td {
			margin-top: 0.7rem;
		}

		.data-table td::before {
			content: attr(data-label);
			font-size: 0.64rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-secondary);
		}

		.data-table td.empty {
			display: block;
		}

		.data-table td.empty::before {
			content: none;
		}

		.data-table .num {
			text-align: left;
			white-space: normal;
		}

		.data-table .path {
			max-width: none;
		}

		.table-path-button {
			font-size: 0.82rem;
		}

		.timing-overview,
		.release-summary-grid,
		.timing-top-list,
		.release-detail-grid {
			grid-template-columns: 1fr;
		}

		.release-detail-header {
			flex-direction: column;
		}

		.release-event-item {
			grid-template-columns: 1fr;
		}

		.release-events-header {
			flex-direction: column;
		}

		.release-event-form {
			grid-template-columns: 1fr;
		}

		.release-header-actions,
		.release-sort-controls {
			width: 100%;
			justify-content: flex-start;
		}

		.release-sort-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.release-sort-controls label {
			min-width: 0;
		}

		.release-band-filters {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.release-event-impact {
			text-align: left;
			white-space: normal;
		}
	}
</style>
