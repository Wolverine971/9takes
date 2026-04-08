<!-- src/routes/admin/analytics/+page.svelte -->
<script lang="ts">
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
	type AnalyticsTab = 'pageviews' | 'cohorts';

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

	let { data }: { data: PageData } = $props();
	const initialFilters = data.filters;
	const initialPagination = data.pagination;
	const initialOverview = data.overview;
	const initialTimeseries = data.timeseries;
	const initialRows = data.rows;
	const initialTopPages = data.topPages;
	let activeTab = $state<AnalyticsTab>('pageviews');

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

	let loading = $state(false);
	let tableLoading = $state(false);
	let insightsLoading = $state(false);
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

	let selectedTrendPath = $state(initialTopPages?.topPagesOverTime?.[0]?.path ?? '');
	let selectedTrendPoints = $state<PageTrendPoint[]>([]);
	const trendCache = new Map<string, PageTrendPoint[]>();

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
			params.set('topN', '6');
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
		await Promise.all([fetchOverviewAndTimeseries(), fetchPages(), fetchTopPagesInsights()]);
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
		await Promise.all([fetchOverviewAndTimeseries(), fetchPages(), fetchTopPagesInsights()]);
		selectedTrendPath = topPages.topPagesOverTime[0]?.path ?? '';
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

	let pageSubtitle = $derived(
		activeTab === 'pageviews'
			? 'Visits and time-on-page for all tracked pages'
			: 'Weekly cohorts by entry surface and acquisition source'
	);
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
			onclick={() => (activeTab = 'pageviews')}
		>
			Pageviews
		</button>
		<button
			type="button"
			role="tab"
			class="analytics-tab"
			class:active={activeTab === 'cohorts'}
			aria-selected={activeTab === 'cohorts'}
			onclick={() => (activeTab = 'cohorts')}
		>
			Cohorts &amp; Sources
		</button>
	</div>

	{#if activeTab === 'pageviews'}
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
			<div class="table-wrapper">
				<table class="data-table">
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
								<tr class:active-row={selectedTrendPath === row.path}>
									<td class="path">
										<button
											type="button"
											class="table-path-button"
											class:active={selectedTrendPath === row.path}
											onclick={() => void focusPathTrend(row.path)}
										>
											{row.path}
										</button>
									</td>
									<td>{row.path_group}</td>
									<td>{row.content_type}</td>
									<td class="num">{row.visits.toLocaleString()}</td>
									<td class="num">{row.unique_visitors.toLocaleString()}</td>
									<td class="num">{row.authenticated_visits.toLocaleString()}</td>
									<td class="num">{row.anonymous_visits.toLocaleString()}</td>
									<td class="num">{formatDurationMs(row.avg_time_on_page_ms)}</td>
									<td class="num">{formatDurationMs(row.median_time_on_page_ms)}</td>
									<td class="num">{formatBounceRate(row.bounce_rate)}</td>
									<td>
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
	{:else}
		<RetentionAnalyticsPanel filters={data.cohortFilters} cohorts={data.cohorts} />
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
		max-height: 360px;
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

	.table-path-button {
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		color: var(--text-primary);
		font-size: 0.84rem;
		cursor: pointer;
		text-align: left;
		max-width: 100%;
		word-break: break-word;
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
	}

	@media (max-width: 980px) {
		.charts-grid,
		.top-lists-grid,
		.top-trend-layout {
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
	}
</style>
