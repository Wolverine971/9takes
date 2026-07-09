<!-- src/routes/admin/analytics/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import RetentionAnalyticsPanel from '$lib/components/admin/RetentionAnalyticsPanel.svelte';
	import { Button } from '$lib/components/atoms';
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

	interface TrendingTrafficSource {
		key: string;
		count: number;
	}

	interface TrendingPageRow {
		path: string;
		path_group: string;
		content_type: string;
		current_visits: number;
		current_unique_visitors: number;
		baseline_avg_visits: number;
		baseline_avg_unique_visitors: number;
		lift_visits: number;
		lift_unique_visitors: number;
		ratio_visits: number | null;
		trend_score: number;
		confidence: string;
		top_sources: TrendingTrafficSource[];
		top_referrers: TrendingTrafficSource[];
		avg_time_on_page_ms: number;
		median_time_on_page_ms: number;
		bounce_rate: number;
		is_low_unique: boolean;
	}

	interface TrendingState {
		available: boolean;
		generatedAt: string;
		baselineDays: number;
		minVisits: number;
		minUnique: number;
		rows: TrendingPageRow[];
		broadRows: TrendingPageRow[];
		repeatRows: TrendingPageRow[];
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
	type AnalyticsTab =
		| 'pageviews'
		| 'timing'
		| 'releases'
		| 'overperformers'
		| 'underperformers'
		| 'cohorts';
	type ReleaseSortKey =
		| 'title'
		| 'published_at'
		| 'minutes_to_first_view'
		| 'views_24h'
		| 'views_7d'
		| 'views_30d'
		| 'total_views'
		| 'overall_score'
		| 'launch_score'
		| 'quality_demand_score'
		| 'benchmark_score'
		| 'performance_band'
		| 'external_unique_30d'
		| 'internal_share_30d'
		| 'repeat_view_share_24h'
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

	interface TimingSlotAnalysis extends TimingHeatmapRow {
		label: string;
		z_score: number;
		share_pct: number;
	}

	interface TimingSummaryGroup {
		key: string;
		label: string;
		visits: number;
		unique_visitors: number;
		active_slots: number;
		avg_slot_visits: number;
		z_score: number;
	}

	interface TimingAnalysis {
		total_visits: number;
		active_slots: number;
		active_slot_pct: number;
		mean_slot_visits: number;
		std_dev_slot_visits: number;
		peak_slot: TimingSlotAnalysis | null;
		quiet_slot: TimingSlotAnalysis | null;
		high_outliers: TimingSlotAnalysis[];
		low_outliers: TimingSlotAnalysis[];
		busiest_day: TimingSummaryGroup | null;
		quietest_day: TimingSummaryGroup | null;
		busiest_hour: TimingSummaryGroup | null;
		quietest_hour: TimingSummaryGroup | null;
		weekday_visits: number;
		weekend_visits: number;
		weekday_avg_slot_visits: number;
		weekend_avg_slot_visits: number;
		weekday_share_pct: number;
		weekend_share_pct: number;
		primary_trend: string;
		recommendations: string[];
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
		launch_score: number | null;
		launch_band: string;
		launch_basis: string;
		launch_sample_size: number;
		quality_demand_score: number | null;
		quality_demand_band: string;
		quality_demand_basis: string;
		quality_demand_sample_size: number;
		quality_demand_confidence: 'collecting' | 'directional' | 'stable';
		overall_score: number | null;
		overall_performance_band: string;
		overall_basis: string;
		external_unique_7d: number;
		external_unique_30d: number;
		engaged_external_unique_7d: number;
		engaged_external_unique_30d: number;
		search_unique_7d: number;
		search_unique_30d: number;
		direct_unique_7d: number;
		direct_unique_30d: number;
		internal_share_24h: number;
		internal_share_7d: number;
		internal_share_30d: number;
		repeat_view_share_24h: number;
		demand_points: number | null;
		demand_percentile: number | null;
		engagement_percentile: number | null;
		top_demand_sources: Array<{ source: string; visits: number }>;
		performance_notes: string[];
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

	interface BlogDiagnosticsRow {
		slug: string;
		file_path: string;
		frontmatter: {
			title: string;
			meta_title: string;
			persona_title: string;
			description: string;
			date: string;
			lastmod: string;
			published: boolean | string | null;
			enneagram: string;
			type: string[];
			person: string;
			suggestions: string[];
			content_quality: {
				hook: number | null;
				enneagram: number | null;
				evidence: number | null;
				writing: number | null;
				originality: number | null;
				overall: number | null;
				letter: string;
				graded_at: string;
			};
			keywords: string[];
			citations: string[];
			faq_count: number;
			same_as_count: number;
		};
		content_stats: {
			word_count: number;
			h2_count: number;
			h3_count: number;
			title_chars: number;
			meta_title_chars: number;
			description_chars: number;
			has_tldr: boolean;
			has_testimony_ledger: boolean;
			has_heading_mix_ledger: boolean;
			has_distribution_ledger: boolean;
			has_faq_schema: boolean;
		};
		link_stats: {
			outgoing_internal_count: number;
			outgoing_personality_count: number;
			outgoing_enneagram_count: number;
			outgoing_category_count: number;
			external_link_count: number;
			incoming_internal_count: number;
			suggestion_count: number;
			suggestions_existing_count: number;
			missing_suggestions: string[];
			outgoing_targets: Array<{ href: string; label: string }>;
			incoming_sources: Array<{ slug: string; title: string; href: string }>;
		};
		diagnostic_scores: {
			seo: number;
			internal_links: number;
			content_depth: number;
			frontmatter: number;
		};
		action_notes: string[];
		replication_notes: string[];
	}

	interface BlogInsightRow {
		release: ReleasePerformanceRow;
		diagnostics: BlogDiagnosticsRow | null;
	}

	interface BlogInsightSummary {
		count: number;
		avgOverall: number | null;
		avgExternal30d: number | null;
		avgIncomingLinks: number | null;
		avgOutgoingLinks: number | null;
		avgSeoScore: number | null;
	}

	let { data }: { data: PageData } = $props();

	function getInitialPageData() {
		return {
			filters: data.filters,
			pagination: data.pagination,
			overview: data.overview,
			timeseries: data.timeseries,
			rows: data.rows,
			topPages: data.topPages,
			trending: data.trending
		};
	}

	const initialPageData = getInitialPageData();
	const initialFilters = initialPageData.filters;
	const initialPagination = initialPageData.pagination;
	const initialOverview = initialPageData.overview;
	const initialTimeseries = initialPageData.timeseries;
	const initialRows = initialPageData.rows;
	const initialTopPages = initialPageData.topPages;
	const initialTrending = initialPageData.trending;
	const hasInitialPageviewData = Boolean(
		(initialOverview?.total_visits ?? 0) > 0 ||
			(initialTimeseries?.length ?? 0) > 0 ||
			(initialRows?.length ?? 0) > 0 ||
			(initialTopPages?.topPagesOverTime?.length ?? 0) > 0 ||
			(initialTrending?.rows?.length ?? 0) > 0
	);
	let activeTab = $state<AnalyticsTab>('pageviews');
	let pageviewsLoaded = $state(hasInitialPageviewData);
	let hasOpenedTiming = $state(false);
	let hasOpenedReleases = $state(false);
	let hasOpenedBlogInsights = $state(false);
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

	const defaultTrending: TrendingState = {
		available: false,
		generatedAt: '',
		baselineDays: 7,
		minVisits: 3,
		minUnique: 3,
		rows: [],
		broadRows: [],
		repeatRows: []
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
		{ key: 'overall_score', label: 'Overall score' },
		{ key: 'quality_demand_score', label: 'Demand score' },
		{ key: 'launch_score', label: 'Launch score' },
		{ key: 'views_24h', label: '24h views' },
		{ key: 'views_7d', label: '7d views' },
		{ key: 'views_30d', label: '30d views' },
		{ key: 'total_views', label: 'Total views' },
		{ key: 'external_unique_30d', label: '30d external unique' },
		{ key: 'internal_share_30d', label: '30d internal share' },
		{ key: 'repeat_view_share_24h', label: '24h repeat share' },
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
		{ key: 'launch_score', label: 'Launch', numeric: true },
		{ key: 'quality_demand_score', label: 'Demand', numeric: true },
		{ key: 'overall_score', label: 'Overall', numeric: true },
		{ key: 'performance_band', label: 'Band' }
	];
	const releaseAnalyticsLimit = 200;
	const releaseRangePresetOptions = [
		{ label: 'Last 30 days', days: 30 },
		{ label: 'Last 90 days', days: 90 },
		{ label: 'Last 180 days', days: 180 },
		{ label: 'Last year', days: 365 }
	];

	let fromDate = $state(initialFilters?.from ?? '');
	let toDate = $state(initialFilters?.to ?? '');
	let releaseFromDate = $state(initialFilters?.from ?? '');
	let releaseToDate = $state(initialFilters?.to ?? '');
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
	let trendingBaselineDays = $state(initialTrending?.baselineDays ?? defaultTrending.baselineDays);
	let trendingMinUnique = $state(initialTrending?.minUnique ?? defaultTrending.minUnique);
	let pageBreakdownRangeFrom = $state(initialFilters?.from ?? '');
	let pageBreakdownRangeTo = $state(initialFilters?.to ?? '');
	let pageBreakdownRangeLabel = $state(
		formatDateWindow(initialFilters?.from ?? '', initialFilters?.to ?? '')
	);
	const pageBreakdownCache = new Map<PageBreakdownWindow, PageBreakdownWindowSnapshot>();
	let tableFetchRequestId = 0;
	let pageviewFetchRequestId = 0;
	let overviewFetchRequestId = 0;
	let insightsFetchRequestId = 0;
	let trendingFetchRequestId = 0;
	let timingFetchRequestId = 0;
	let releaseFetchRequestId = 0;
	let releaseSelectionRequestId = 0;
	let releaseEventsRequestId = 0;
	let blogDiagnosticsFetchRequestId = 0;
	let seededPageBreakdownCache = false;

	let loading = $state(!hasInitialPageviewData);
	let tableLoading = $state(!hasInitialPageviewData);
	let insightsLoading = $state(!hasInitialPageviewData);
	let trendingLoading = $state(!hasInitialPageviewData);
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
	let trending = $state<TrendingState>({
		...defaultTrending,
		...(initialTrending ?? {}),
		rows: ((initialTrending?.rows ?? defaultTrending.rows) as TrendingPageRow[]) ?? [],
		broadRows:
			((initialTrending?.broadRows ?? defaultTrending.broadRows) as TrendingPageRow[]) ?? [],
		repeatRows:
			((initialTrending?.repeatRows ?? defaultTrending.repeatRows) as TrendingPageRow[]) ?? []
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
	let releaseSortBy = $state<ReleaseSortKey>('overall_score');
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
	let blogDiagnosticsRows = $state<BlogDiagnosticsRow[]>([]);
	let blogDiagnosticsLoading = $state(false);
	let blogDiagnosticsLoaded = $state(false);
	let selectedBlogInsightSlug = $state('');

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

	function formatReleaseDateWindow(from: string, to: string): string {
		if (from && to) return formatDateWindow(from, to);
		if (from) return `since ${formatDateLabel(from)}`;
		if (to) return `through ${formatDateLabel(to)}`;
		return 'all history';
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

	function getTimingSlotSortValue(row: TimingHeatmapRow): number {
		return row.local_dow * 24 + row.local_hour;
	}

	function calculatePopulationStdDev(values: number[], mean: number): number {
		if (values.length === 0) return 0;
		const variance =
			values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
		return Math.sqrt(variance);
	}

	function buildTimingGroups(
		slots: TimingSlotAnalysis[],
		kind: 'day' | 'hour'
	): TimingSummaryGroup[] {
		const groups = new Map<string, Omit<TimingSummaryGroup, 'z_score'>>();

		for (const slot of slots) {
			const key = kind === 'day' ? String(slot.local_dow) : String(slot.local_hour);
			const label =
				kind === 'day'
					? (timingDayLabels[slot.local_dow] ?? 'Day')
					: formatHourLabel(slot.local_hour);
			const existing = groups.get(key);

			if (existing) {
				existing.visits += slot.visits;
				existing.unique_visitors += slot.unique_visitors;
				existing.active_slots += slot.visits > 0 ? 1 : 0;
				continue;
			}

			groups.set(key, {
				key,
				label,
				visits: slot.visits,
				unique_visitors: slot.unique_visitors,
				active_slots: slot.visits > 0 ? 1 : 0,
				avg_slot_visits: 0
			});
		}

		const groupList = [...groups.values()].map((group) => ({
			...group,
			avg_slot_visits: group.visits / (kind === 'day' ? 24 : 7)
		}));
		const mean =
			groupList.length > 0
				? groupList.reduce((sum, group) => sum + group.visits, 0) / groupList.length
				: 0;
		const stdDev = calculatePopulationStdDev(
			groupList.map((group) => group.visits),
			mean
		);

		return groupList.map((group) => ({
			...group,
			z_score: stdDev > 0 ? (group.visits - mean) / stdDev : 0
		}));
	}

	function sortTimingSlotsByVisits(
		rows: TimingSlotAnalysis[],
		direction: 'asc' | 'desc'
	): TimingSlotAnalysis[] {
		return [...rows].sort((a, b) => {
			const visitComparison = direction === 'desc' ? b.visits - a.visits : a.visits - b.visits;
			return visitComparison || getTimingSlotSortValue(a) - getTimingSlotSortValue(b);
		});
	}

	function sortTimingGroupsByVisits(
		rows: TimingSummaryGroup[],
		direction: 'asc' | 'desc'
	): TimingSummaryGroup[] {
		return [...rows].sort((a, b) => {
			const visitComparison = direction === 'desc' ? b.visits - a.visits : a.visits - b.visits;
			return visitComparison || a.label.localeCompare(b.label);
		});
	}

	function describeTimingTrend(
		analysis: Pick<
			TimingAnalysis,
			| 'total_visits'
			| 'peak_slot'
			| 'busiest_day'
			| 'busiest_hour'
			| 'weekday_avg_slot_visits'
			| 'weekend_avg_slot_visits'
			| 'std_dev_slot_visits'
			| 'mean_slot_visits'
		>
	): string {
		if (analysis.total_visits === 0) {
			return 'No traffic landed in this timing window.';
		}

		const peak = analysis.peak_slot;
		const busiestDay = analysis.busiest_day;
		const busiestHour = analysis.busiest_hour;
		const parts: string[] = [];

		if (peak) {
			const outlierText = peak.z_score >= 2 ? `, ${formatZScore(peak.z_score)} above average` : '';
			parts.push(`${peak.label} is the strongest slot${outlierText}`);
		}
		if (busiestDay && busiestHour) {
			parts.push(`${busiestDay.label} and ${busiestHour.label} are the strongest rollups`);
		}

		const weekdayAvg = analysis.weekday_avg_slot_visits;
		const weekendAvg = analysis.weekend_avg_slot_visits;
		if (weekdayAvg > 0 || weekendAvg > 0) {
			if (weekdayAvg >= weekendAvg * 1.25) {
				parts.push(
					`weekday slots run ${formatRatio(weekdayAvg / Math.max(weekendAvg, 0.01))}x weekend slots`
				);
			} else if (weekendAvg >= weekdayAvg * 1.25) {
				parts.push(
					`weekend slots run ${formatRatio(weekendAvg / Math.max(weekdayAvg, 0.01))}x weekday slots`
				);
			}
		}

		if (
			analysis.mean_slot_visits > 0 &&
			analysis.std_dev_slot_visits / analysis.mean_slot_visits < 0.75
		) {
			parts.push('traffic is relatively even across the week');
		}

		return parts.length > 0
			? `${parts.join('. ')}.`
			: 'Traffic is too thin to show a stable timing trend.';
	}

	function buildTimingRecommendations(
		analysis: Omit<TimingAnalysis, 'primary_trend' | 'recommendations'>
	): string[] {
		if (analysis.total_visits === 0) {
			return ['Wait for more visits before using timing as a planning signal.'];
		}

		const recommendations: string[] = [];
		const peak = analysis.peak_slot;
		const quiet = analysis.quiet_slot;
		const busiestDay = analysis.busiest_day;
		const busiestHour = analysis.busiest_hour;
		const highOutlier = analysis.high_outliers[0];
		const weekdayAvg = analysis.weekday_avg_slot_visits;
		const weekendAvg = analysis.weekend_avg_slot_visits;

		if (analysis.total_visits < 30) {
			recommendations.push(
				`Treat this as directional only: the filter has ${analysis.total_visits.toLocaleString()} visits across ${analysis.active_slots} active slots.`
			);
		}

		if (peak) {
			const zText = analysis.std_dev_slot_visits > 0 ? ` (${formatZScore(peak.z_score)})` : '';
			recommendations.push(
				`Use ${peak.label} as the first promotion window; it has ${peak.visits.toLocaleString()} visits${zText} and ${peak.unique_visitors.toLocaleString()} slot uniques.`
			);
		}

		if (busiestDay && busiestHour) {
			recommendations.push(
				`Publish or share important content 30-60 minutes before ${busiestHour.label} on ${busiestDay.label}; that is the strongest day/hour pattern in this range.`
			);
		}

		if (quiet) {
			recommendations.push(
				`Put maintenance, low-risk experiments, and background updates near ${quiet.label}; it is the quietest slot with ${quiet.visits.toLocaleString()} visits.`
			);
		}

		if (weekdayAvg > 0 || weekendAvg > 0) {
			if (weekdayAvg >= weekendAvg * 1.25) {
				recommendations.push(
					`Favor weekday launches: weekday slots average ${formatCompactNumber(weekdayAvg, 1)} visits versus ${formatCompactNumber(weekendAvg, 1)} on weekends.`
				);
			} else if (weekendAvg >= weekdayAvg * 1.25) {
				recommendations.push(
					`Do not ignore weekends: weekend slots average ${formatCompactNumber(weekendAvg, 1)} visits versus ${formatCompactNumber(weekdayAvg, 1)} on weekdays.`
				);
			}
		}

		if (highOutlier) {
			recommendations.push(
				`Investigate ${highOutlier.label} in Pageviews/top pages before repeating it; the spike is ${formatZScore(highOutlier.z_score)} from the slot average.`
			);
		} else if (
			analysis.mean_slot_visits > 0 &&
			analysis.std_dev_slot_visits / analysis.mean_slot_visits < 0.75
		) {
			recommendations.push(
				'Timing is not the main lever yet; traffic is spread evenly enough that source mix, page quality, and internal links should matter more than exact posting time.'
			);
		}

		return [...new Set(recommendations)].slice(0, 5);
	}

	function buildTimingAnalysis(rows: TimingHeatmapRow[]): TimingAnalysis {
		const rowMap = new Map(
			rows.map((row) => [
				`${row.local_dow}:${row.local_hour}`,
				{
					local_dow: row.local_dow,
					local_hour: row.local_hour,
					visits: Number(row.visits || 0),
					unique_visitors: Number(row.unique_visitors || 0),
					avg_time_on_page_ms: Number(row.avg_time_on_page_ms || 0)
				}
			])
		);
		const slots = timingDayLabels.flatMap((_dayLabel, day) =>
			timingHours.map((hour) => {
				const row =
					rowMap.get(`${day}:${hour}`) ??
					({
						local_dow: day,
						local_hour: hour,
						visits: 0,
						unique_visitors: 0,
						avg_time_on_page_ms: 0
					} satisfies TimingHeatmapRow);
				return row;
			})
		);
		const totalVisits = slots.reduce((sum, row) => sum + row.visits, 0);
		const activeSlots = slots.filter((row) => row.visits > 0).length;
		const meanSlotVisits = slots.length > 0 ? totalVisits / slots.length : 0;
		const stdDevSlotVisits = calculatePopulationStdDev(
			slots.map((row) => row.visits),
			meanSlotVisits
		);
		const analyzedSlots: TimingSlotAnalysis[] = slots.map((row) => ({
			...row,
			label: getTimingSlotLabel(row),
			z_score: stdDevSlotVisits > 0 ? (row.visits - meanSlotVisits) / stdDevSlotVisits : 0,
			share_pct: totalVisits > 0 ? (row.visits / totalVisits) * 100 : 0
		}));
		const peakSlot = sortTimingSlotsByVisits(analyzedSlots, 'desc')[0] ?? null;
		const quietSlot = sortTimingSlotsByVisits(analyzedSlots, 'asc')[0] ?? null;
		const highOutliers = analyzedSlots
			.filter((slot) => slot.visits > 0 && slot.z_score >= 2)
			.sort(
				(a, b) => b.z_score - a.z_score || getTimingSlotSortValue(a) - getTimingSlotSortValue(b)
			)
			.slice(0, 6);
		const lowOutliers = analyzedSlots
			.filter((slot) => slot.z_score <= -1)
			.sort(
				(a, b) => a.z_score - b.z_score || getTimingSlotSortValue(a) - getTimingSlotSortValue(b)
			)
			.slice(0, 6);
		const dayGroups = buildTimingGroups(analyzedSlots, 'day');
		const hourGroups = buildTimingGroups(analyzedSlots, 'hour');
		const busiestDay = sortTimingGroupsByVisits(dayGroups, 'desc')[0] ?? null;
		const quietestDay = sortTimingGroupsByVisits(dayGroups, 'asc')[0] ?? null;
		const busiestHour = sortTimingGroupsByVisits(hourGroups, 'desc')[0] ?? null;
		const quietestHour = sortTimingGroupsByVisits(hourGroups, 'asc')[0] ?? null;
		const weekdayVisits = dayGroups
			.filter((group) => Number(group.key) >= 1 && Number(group.key) <= 5)
			.reduce((sum, group) => sum + group.visits, 0);
		const weekendVisits = totalVisits - weekdayVisits;
		const weekdayAvgSlotVisits = weekdayVisits / (5 * 24);
		const weekendAvgSlotVisits = weekendVisits / (2 * 24);
		const baseAnalysis = {
			total_visits: totalVisits,
			active_slots: activeSlots,
			active_slot_pct: slots.length > 0 ? (activeSlots / slots.length) * 100 : 0,
			mean_slot_visits: meanSlotVisits,
			std_dev_slot_visits: stdDevSlotVisits,
			peak_slot: peakSlot,
			quiet_slot: quietSlot,
			high_outliers: highOutliers,
			low_outliers: lowOutliers,
			busiest_day: busiestDay,
			quietest_day: quietestDay,
			busiest_hour: busiestHour,
			quietest_hour: quietestHour,
			weekday_visits: weekdayVisits,
			weekend_visits: weekendVisits,
			weekday_avg_slot_visits: weekdayAvgSlotVisits,
			weekend_avg_slot_visits: weekendAvgSlotVisits,
			weekday_share_pct: totalVisits > 0 ? (weekdayVisits / totalVisits) * 100 : 0,
			weekend_share_pct: totalVisits > 0 ? (weekendVisits / totalVisits) * 100 : 0
		};

		return {
			...baseAnalysis,
			primary_trend: describeTimingTrend(baseAnalysis),
			recommendations: buildTimingRecommendations(baseAnalysis)
		};
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
		return releaseRows.filter((row) => row.overall_performance_band === filter).length;
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
			case 'overall_score':
				return row.overall_score;
			case 'launch_score':
				return row.launch_score;
			case 'quality_demand_score':
				return row.quality_demand_score;
			case 'benchmark_score':
				return row.benchmark_score;
			case 'performance_band':
				return getReleaseBandSortRank(row.overall_performance_band);
			case 'external_unique_30d':
				return row.external_unique_30d;
			case 'internal_share_30d':
				return row.internal_share_30d;
			case 'repeat_view_share_24h':
				return row.repeat_view_share_24h;
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
				: releaseRows.filter((row) => row.overall_performance_band === filter);

		return filtered.sort((a, b) => compareReleaseRows(a, b, key, direction));
	}

	function ensureSelectedReleaseInVisibleRows(
		filter: ReleaseBandFilter = releaseBandFilter,
		key: ReleaseSortKey = releaseSortBy,
		direction: SortDirection = releaseSortDir
	) {
		const visibleRows = getReleaseRowsForControls(filter, key, direction);
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
		let nextSortBy = releaseSortBy;
		let nextSortDir = releaseSortDir;
		if (releaseSortBy === column) {
			nextSortDir = releaseSortDir === 'desc' ? 'asc' : 'desc';
		} else {
			nextSortBy = column;
			nextSortDir = column === 'title' ? 'asc' : 'desc';
		}

		releaseSortBy = nextSortBy;
		releaseSortDir = nextSortDir;
		ensureSelectedReleaseInVisibleRows(releaseBandFilter, nextSortBy, nextSortDir);
	}

	function updateReleaseSortKey(value: string) {
		const nextSortBy = value as ReleaseSortKey;
		releaseSortBy = nextSortBy;
		ensureSelectedReleaseInVisibleRows(releaseBandFilter, nextSortBy, releaseSortDir);
	}

	function toggleReleaseSortDirection() {
		const nextSortDir = releaseSortDir === 'desc' ? 'asc' : 'desc';
		releaseSortDir = nextSortDir;
		ensureSelectedReleaseInVisibleRows(releaseBandFilter, releaseSortBy, nextSortDir);
	}

	function setReleaseBandFilter(filter: ReleaseBandFilter) {
		releaseBandFilter = filter;
		ensureSelectedReleaseInVisibleRows(filter);
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

	function averageNullable(values: Array<number | null | undefined>): number | null {
		const finiteValues = values.filter(
			(value): value is number => typeof value === 'number' && Number.isFinite(value)
		);
		if (finiteValues.length === 0) return null;
		return finiteValues.reduce((sum, value) => sum + value, 0) / finiteValues.length;
	}

	function getBlogInsightRows(band: 'above_norm' | 'below_norm'): BlogInsightRow[] {
		const sortDir = band === 'above_norm' ? 'desc' : 'asc';
		const rows = getReleaseRowsForControls(band, 'overall_score', sortDir);
		return rows.map((release) => ({
			release,
			diagnostics: blogDiagnosticsBySlug.get(release.slug) ?? null
		}));
	}

	function getBlogInsightSummary(rows: BlogInsightRow[]): BlogInsightSummary {
		return {
			count: rows.length,
			avgOverall: averageNullable(rows.map((row) => row.release.overall_score)),
			avgExternal30d: averageNullable(rows.map((row) => row.release.external_unique_30d)),
			avgIncomingLinks: averageNullable(
				rows.map((row) => row.diagnostics?.link_stats.incoming_internal_count)
			),
			avgOutgoingLinks: averageNullable(
				rows.map((row) => row.diagnostics?.link_stats.outgoing_internal_count)
			),
			avgSeoScore: averageNullable(rows.map((row) => row.diagnostics?.diagnostic_scores.seo))
		};
	}

	function formatCompactNumber(value: number | null | undefined, digits = 0): string {
		if (value === null || value === undefined || !Number.isFinite(value)) return '—';
		return value.toLocaleString(undefined, {
			maximumFractionDigits: digits,
			minimumFractionDigits: digits
		});
	}

	function formatRatio(value: number): string {
		if (!Number.isFinite(value)) return '0.0';
		return value.toFixed(value >= 10 ? 0 : 1);
	}

	function formatPercent(value: number, digits = 0): string {
		if (!Number.isFinite(value)) return '0%';
		return `${value.toFixed(digits)}%`;
	}

	function formatZScore(value: number): string {
		if (!Number.isFinite(value)) return '0.0 SD';
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value.toFixed(1)} SD`;
	}

	function formatFrontmatterValue(value: boolean | string | null): string {
		if (value === true) return 'true';
		if (value === false) return 'false';
		return value || 'Missing';
	}

	function formatList(values: string[], fallback = 'None'): string {
		return values.length > 0 ? values.join(', ') : fallback;
	}

	function getInsightModeLabel(mode: 'over' | 'under'): string {
		return mode === 'over' ? 'Overperforming Blogs' : 'Underperforming Blogs';
	}

	function getInsightModeDescription(mode: 'over' | 'under'): string {
		return mode === 'over'
			? 'Find what the winners have in common: demand source, frontmatter quality, content structure, and internal-link support.'
			: 'Prioritize fixes by separating weak demand from fixable SEO, content, and cross-linking gaps.';
	}

	function getSelectedBlogInsight(rows: BlogInsightRow[]): BlogInsightRow | null {
		return rows.find((row) => row.release.slug === selectedBlogInsightSlug) ?? rows[0] ?? null;
	}

	function getTopTrafficSource(row: TrendingPageRow): string {
		return row.top_sources[0]?.key ?? 'unknown';
	}

	function formatTrendLift(value: number): string {
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value.toFixed(value % 1 === 0 ? 0 : 1)}`;
	}

	function formatTrendBaseline(value: number): string {
		return value.toFixed(value >= 10 || value % 1 === 0 ? 0 : 1);
	}

	function formatTrendRatio(value: number | null): string {
		if (value === null || !Number.isFinite(value)) return 'New';
		return `${value.toFixed(1)}x`;
	}

	function formatTrendGeneratedAt(value: string): string {
		if (!value) return '';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '';
		return date.toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: '2-digit'
		});
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
	let broadTrendingRows = $derived(trending.broadRows.slice(0, 8));
	let repeatTrendingRows = $derived(trending.repeatRows.slice(0, 6));
	let hasTrendingRows = $derived(trending.rows.length > 0);
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
	let timingAnalysis = $derived(buildTimingAnalysis(timingRows));
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
		getReleaseRowsForControls('above_norm', 'overall_score', 'desc').slice(0, 3)
	);
	let underperformingRows = $derived(
		getReleaseRowsForControls('below_norm', 'overall_score', 'asc').slice(0, 3)
	);
	let releaseSummary = $derived({
		total: releaseRows.length,
		aboveNorm: releaseRows.filter((row) => row.overall_performance_band === 'above_norm').length,
		belowNorm: releaseRows.filter((row) => row.overall_performance_band === 'below_norm').length,
		nearNorm: releaseRows.filter((row) => row.overall_performance_band === 'near_norm').length,
		collecting: releaseRows.filter((row) => row.overall_performance_band === 'collecting').length,
		needsHistory: releaseRows.filter(
			(row) => row.overall_performance_band === 'insufficient_history'
		).length
	});
	let blogDiagnosticsBySlug = $derived(new Map(blogDiagnosticsRows.map((row) => [row.slug, row])));
	let overperformerBlogRows = $derived(getBlogInsightRows('above_norm'));
	let underperformerBlogRows = $derived(getBlogInsightRows('below_norm'));
	let activeBlogInsightMode: 'over' | 'under' = $derived(
		activeTab === 'underperformers' ? 'under' : 'over'
	);
	let activeBlogInsightRows = $derived(
		activeBlogInsightMode === 'over' ? overperformerBlogRows : underperformerBlogRows
	);
	let activeBlogInsightSummary = $derived(getBlogInsightSummary(activeBlogInsightRows));
	let selectedBlogInsight = $derived(getSelectedBlogInsight(activeBlogInsightRows));

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

	function buildReleaseParams(): URLSearchParams {
		const params = new URLSearchParams();
		if (releaseFromDate) {
			params.set('from', releaseFromDate);
		}
		if (releaseToDate) {
			params.set('to', releaseToDate);
		}
		params.set('scope', scope);
		return params;
	}

	function isDateRangeValid(): boolean {
		if (!fromDate || !toDate) return false;
		return fromDate <= toDate;
	}

	function isReleaseDateRangeValid(): boolean {
		if (releaseFromDate && releaseToDate && releaseFromDate > releaseToDate) return false;
		return true;
	}

	async function readJsonResponse(
		response: Response,
		fallbackMessage: string
	): Promise<Record<string, unknown>> {
		try {
			const body = await response.json();
			return body && typeof body === 'object' ? body : {};
		} catch (err) {
			if (!response.ok) {
				const status = response.status ? ` (${response.status})` : '';
				const statusText = response.statusText ? `: ${response.statusText}` : '';
				return { message: `${fallbackMessage}${status}${statusText}` };
			}
			throw err;
		}
	}

	function setReleaseRangePreset(days: number) {
		const anchor = releaseToDate ? parseDate(releaseToDate) : new Date();
		const from = new Date(anchor);
		from.setDate(from.getDate() - (days - 1));
		releaseFromDate = toDateString(from);
		releaseToDate = toDateString(anchor);
		void applyReleaseFilters();
	}

	async function fetchOverviewAndTimeseries() {
		const requestId = ++overviewFetchRequestId;
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

			if (requestId !== overviewFetchRequestId) return;

			overview = { ...defaultOverview, ...(overviewBody.summary ?? {}) };
			timeseries = timeseriesBody.points ?? [];
		} catch (err) {
			if (requestId !== overviewFetchRequestId) return;
			console.error('Analytics overview/timeseries fetch error:', err);
			notifications.danger('Failed to load overview analytics', 3000);
		} finally {
			if (requestId === overviewFetchRequestId) {
				loading = false;
			}
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
		const requestId = ++insightsFetchRequestId;
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

			if (requestId !== insightsFetchRequestId) return;

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
			if (requestId !== insightsFetchRequestId) return;
			console.error('Analytics top pages fetch error:', err);
			notifications.danger('Failed to load top page insights', 3000);
		} finally {
			if (requestId === insightsFetchRequestId) {
				insightsLoading = false;
			}
		}
	}

	async function fetchTrendingAnalytics() {
		const requestId = ++trendingFetchRequestId;
		trendingLoading = true;
		try {
			const params = new URLSearchParams({
				scope,
				baselineDays: String(trendingBaselineDays),
				minVisits: '3',
				minUnique: String(trendingMinUnique),
				limit: '20'
			});
			const response = await fetch(`/api/admin/analytics/trending?${params.toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load trending analytics');
			}

			if (requestId !== trendingFetchRequestId) return;

			trending = {
				...defaultTrending,
				...(body ?? {}),
				rows: (body.rows ?? []) as TrendingPageRow[],
				broadRows: (body.broadRows ?? []) as TrendingPageRow[],
				repeatRows: (body.repeatRows ?? []) as TrendingPageRow[]
			};
			trendingBaselineDays = trending.baselineDays || trendingBaselineDays;
			trendingMinUnique = trending.minUnique || trendingMinUnique;
		} catch (err) {
			if (requestId !== trendingFetchRequestId) return;
			console.error('Trending analytics fetch error:', err);
			notifications.danger('Failed to load trending pages', 3000);
		} finally {
			if (requestId === trendingFetchRequestId) {
				trendingLoading = false;
			}
		}
	}

	async function fetchPageviewAnalytics() {
		const requestId = ++pageviewFetchRequestId;
		try {
			await Promise.all([
				fetchOverviewAndTimeseries(),
				fetchPages(),
				fetchTopPagesInsights(),
				fetchTrendingAnalytics()
			]);
			if (requestId === pageviewFetchRequestId) {
				selectedTrendPath = topPages.topPagesOverTime[0]?.path ?? '';
			}
		} finally {
			if (requestId === pageviewFetchRequestId) {
				pageviewsLoaded = true;
			}
		}
	}

	async function fetchTimingAnalytics() {
		const requestId = ++timingFetchRequestId;
		timingLoading = true;
		try {
			const response = await fetch(`/api/admin/analytics/timing?${buildParams(false).toString()}`);
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load timing analytics');
			}

			if (requestId !== timingFetchRequestId) return;

			timingRows = (body.rows ?? []) as TimingHeatmapRow[];
			timingLoaded = true;
		} catch (err) {
			if (requestId !== timingFetchRequestId) return;
			console.error('Analytics timing fetch error:', err);
			notifications.danger('Failed to load timing analytics', 3000);
		} finally {
			if (requestId === timingFetchRequestId) {
				timingLoading = false;
			}
		}
	}

	async function selectRelease(slug: string) {
		if (!slug) return;
		const requestId = ++releaseSelectionRequestId;
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
				releaseGrowthCache.set(slug, points);
				if (requestId !== releaseSelectionRequestId || selectedReleaseSlug !== slug) return;
				releaseGrowthPoints = points;
			} catch (err) {
				if (requestId !== releaseSelectionRequestId || selectedReleaseSlug !== slug) return;
				console.error('Release growth fetch error:', err);
				notifications.danger('Failed to load release growth', 3000);
			} finally {
				if (requestId === releaseSelectionRequestId && selectedReleaseSlug === slug) {
					releaseGrowthLoading = false;
				}
			}
		}

		if (requestId === releaseSelectionRequestId && selectedReleaseSlug === slug) {
			await fetchReleaseEvents(slug);
		}
	}

	async function fetchReleaseEvents(slug: string, force = false) {
		if (!slug) return;
		const requestId = ++releaseEventsRequestId;

		const cached = releaseEventsCache.get(slug);
		if (cached && !force) {
			if (selectedReleaseSlug === slug) {
				releaseEventRows = cached;
				releaseEventsLoading = false;
			}
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
			releaseEventsCache.set(slug, rows);
			if (requestId !== releaseEventsRequestId || selectedReleaseSlug !== slug) return;
			releaseEventRows = rows;
		} catch (err) {
			if (requestId !== releaseEventsRequestId || selectedReleaseSlug !== slug) return;
			console.error('Release event fetch error:', err);
			notifications.danger('Failed to load release events', 3000);
		} finally {
			if (requestId === releaseEventsRequestId && selectedReleaseSlug === slug) {
				releaseEventsLoading = false;
			}
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
		const requestId = ++releaseFetchRequestId;
		releasesLoading = true;
		try {
			const params = buildReleaseParams();
			params.set('limit', String(releaseAnalyticsLimit));
			const response = await fetch(`/api/admin/analytics/releases?${params.toString()}`);
			const body = await readJsonResponse(response, 'Failed to load release analytics');

			if (!response.ok) {
				const message =
					typeof body.message === 'string' ? body.message : 'Failed to load release analytics';
				throw new Error(message);
			}

			if (requestId !== releaseFetchRequestId) return;

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
			if (requestId !== releaseFetchRequestId) return;
			console.error('Release analytics fetch error:', err);
			notifications.danger('Failed to load release analytics', 3000);
		} finally {
			if (requestId === releaseFetchRequestId) {
				releasesLoading = false;
			}
		}
	}

	async function fetchBlogDiagnostics(force = false) {
		if (blogDiagnosticsLoading || (blogDiagnosticsLoaded && !force)) return;

		const requestId = ++blogDiagnosticsFetchRequestId;
		blogDiagnosticsLoading = true;
		try {
			const response = await fetch('/api/admin/analytics/blog-diagnostics');
			const body = await response.json();

			if (!response.ok) {
				throw new Error(body.message || 'Failed to load blog diagnostics');
			}

			if (requestId !== blogDiagnosticsFetchRequestId) return;

			blogDiagnosticsRows = (body.rows ?? []) as BlogDiagnosticsRow[];
			blogDiagnosticsLoaded = true;
		} catch (err) {
			if (requestId !== blogDiagnosticsFetchRequestId) return;
			console.error('Blog diagnostics fetch error:', err);
			notifications.danger('Failed to load blog diagnostics', 3000);
		} finally {
			if (requestId === blogDiagnosticsFetchRequestId) {
				blogDiagnosticsLoading = false;
			}
		}
	}

	async function ensureBlogInsightData() {
		if (!releasesLoaded && !releasesLoading) {
			await fetchReleaseAnalytics();
		}
		if (!blogDiagnosticsLoaded && !blogDiagnosticsLoading) {
			await fetchBlogDiagnostics();
		}
	}

	async function applyReleaseFilters() {
		if (!isReleaseDateRangeValid()) {
			notifications.warning('Please use a valid release date range', 3000);
			return;
		}

		releasesLoaded = false;
		selectedReleaseSlug = '';
		releaseGrowthCache.clear();
		releaseGrowthPoints = [];
		releaseEventsCache.clear();
		releaseEventRows = [];
		await fetchReleaseAnalytics();
	}

	async function resetReleaseFilters() {
		releaseFromDate = initialFilters?.from ?? '';
		releaseToDate = initialFilters?.to ?? '';
		releaseBandFilter = 'all';
		releaseSortBy = 'overall_score';
		releaseSortDir = 'desc';
		await applyReleaseFilters();
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
		if (
			activeTab === 'releases' ||
			activeTab === 'overperformers' ||
			activeTab === 'underperformers'
		) {
			await fetchReleaseAnalytics();
		}
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
		if (
			activeTab === 'releases' ||
			activeTab === 'overperformers' ||
			activeTab === 'underperformers'
		) {
			await fetchReleaseAnalytics();
		}
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
			{
				header: 'overall_performance_band',
				value: (row) => formatPerformanceBand(row.overall_performance_band)
			},
			{ header: 'overall_score', value: (row) => row.overall_score },
			{ header: 'overall_basis', value: (row) => row.overall_basis },
			{ header: 'launch_score', value: (row) => row.launch_score },
			{ header: 'launch_band', value: (row) => formatPerformanceBand(row.launch_band) },
			{ header: 'launch_basis', value: (row) => row.launch_basis },
			{ header: 'quality_demand_score', value: (row) => row.quality_demand_score },
			{
				header: 'quality_demand_band',
				value: (row) => formatPerformanceBand(row.quality_demand_band)
			},
			{ header: 'quality_demand_basis', value: (row) => row.quality_demand_basis },
			{ header: 'quality_demand_confidence', value: (row) => row.quality_demand_confidence },
			{ header: 'quality_demand_sample_size', value: (row) => row.quality_demand_sample_size },
			{ header: 'external_unique_7d', value: (row) => row.external_unique_7d },
			{ header: 'external_unique_30d', value: (row) => row.external_unique_30d },
			{ header: 'engaged_external_unique_7d', value: (row) => row.engaged_external_unique_7d },
			{ header: 'engaged_external_unique_30d', value: (row) => row.engaged_external_unique_30d },
			{ header: 'search_unique_7d', value: (row) => row.search_unique_7d },
			{ header: 'search_unique_30d', value: (row) => row.search_unique_30d },
			{ header: 'direct_unique_7d', value: (row) => row.direct_unique_7d },
			{ header: 'direct_unique_30d', value: (row) => row.direct_unique_30d },
			{ header: 'internal_share_24h', value: (row) => row.internal_share_24h },
			{ header: 'internal_share_7d', value: (row) => row.internal_share_7d },
			{ header: 'internal_share_30d', value: (row) => row.internal_share_30d },
			{ header: 'repeat_view_share_24h', value: (row) => row.repeat_view_share_24h },
			{ header: 'demand_points', value: (row) => row.demand_points },
			{ header: 'demand_percentile', value: (row) => row.demand_percentile },
			{ header: 'engagement_percentile', value: (row) => row.engagement_percentile },
			{
				header: 'top_demand_sources',
				value: (row) => formatSourceSummary(row.top_demand_sources)
			},
			{ header: 'performance_notes', value: (row) => row.performance_notes.join(' | ') },
			{
				header: 'legacy_performance_band',
				value: (row) => formatPerformanceBand(row.performance_band)
			},
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
		return `release-performance-${releaseFromDate || 'start'}-${releaseToDate || 'end'}${filterSuffix}.csv`;
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

	function formatSourceSummary(sources: Array<{ source: string; visits: number }> | null): string {
		if (!sources || sources.length === 0) return 'No demand source yet';
		return sources.map((source) => `${source.source}:${source.visits}`).join(', ');
	}

	function formatBenchmarkBasis(value: string): string {
		switch (value) {
			case '24h':
				return '24h';
			case '7d':
				return '7d';
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

	function formatDemandBasis(value: string): string {
		switch (value) {
			case '7d':
				return '7d demand';
			case '30d':
				return '30d demand';
			case 'demand_7d':
				return '7d demand';
			case 'demand_30d':
				return '30d demand';
			case 'demand_unavailable':
				return 'Demand unavailable';
			case 'unavailable':
				return 'Unavailable';
			case 'collecting':
				return 'Needs 7d';
			default:
				return value || 'Needs history';
		}
	}

	function formatConfidence(value: string): string {
		switch (value) {
			case 'stable':
				return 'Stable';
			case 'directional':
				return 'Directional';
			default:
				return 'Collecting';
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
					: activeTab === 'overperformers'
						? 'Why the strongest blogs are working'
						: activeTab === 'underperformers'
							? 'Which weak blogs have the clearest fixes'
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
		if (tab === 'overperformers' || tab === 'underperformers') {
			hasOpenedBlogInsights = true;
			void ensureBlogInsightData();
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
			class:active={activeTab === 'overperformers'}
			aria-selected={activeTab === 'overperformers'}
			onclick={() => openTab('overperformers')}
		>
			Overperformers
		</button>
		<button
			type="button"
			role="tab"
			class="analytics-tab"
			class:active={activeTab === 'underperformers'}
			aria-selected={activeTab === 'underperformers'}
			onclick={() => openTab('underperformers')}
		>
			Underperformers
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
				<Button onclick={applyFilters} disabled={loading || tableLoading}>Apply</Button>
				<Button variant="secondary" onclick={resetFilters} disabled={loading || tableLoading}>
					Reset
				</Button>
				<span class="reporting-time-zone"
					>Reporting days use {initialFilters?.timeZone ?? 'UTC'}.</span
				>
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

		<section class="insight-card trending-card">
			<div class="insight-header trending-header">
				<div>
					<h2>Trending Now</h2>
					<p>
						Today versus the same elapsed time across the previous {trending.baselineDays} days
						{#if trending.generatedAt}
							| refreshed {formatTrendGeneratedAt(trending.generatedAt)}
						{/if}
					</p>
				</div>
				<div class="trending-controls">
					<label>
						<span>Baseline</span>
						<select
							bind:value={trendingBaselineDays}
							onchange={() => void fetchTrendingAnalytics()}
						>
							<option value={3}>3 days</option>
							<option value={7}>7 days</option>
							<option value={14}>14 days</option>
							<option value={30}>30 days</option>
						</select>
					</label>
					<label>
						<span>Min unique</span>
						<select bind:value={trendingMinUnique} onchange={() => void fetchTrendingAnalytics()}>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={5}>5</option>
							<option value={8}>8</option>
						</select>
					</label>
					<Button variant="secondary" onclick={fetchTrendingAnalytics} loading={trendingLoading}>
						{trendingLoading ? 'Refreshing...' : 'Refresh'}
					</Button>
				</div>
			</div>

			{#if trendingLoading && !hasTrendingRows}
				<div class="empty-panel">Loading trending pages...</div>
			{:else if !trending.available}
				<div class="empty-panel">Trending analytics are waiting for the database migration.</div>
			{:else if !hasTrendingRows}
				<div class="empty-panel">No pages are trending above baseline right now.</div>
			{:else}
				<div class="trending-layout">
					<article class="trending-list-panel">
						<div class="trending-list-header">
							<h3>Broad Spikes</h3>
							<span>{broadTrendingRows.length.toLocaleString()}</span>
						</div>
						{#if broadTrendingRows.length === 0}
							<p class="trending-empty">No broad spikes meet the unique visitor threshold.</p>
						{:else}
							<div class="trending-list">
								{#each broadTrendingRows as row}
									<button
										type="button"
										class="trending-row"
										class:active={selectedTrendPath === row.path}
										onclick={() => void focusPathTrend(row.path)}
									>
										<span class="trend-page-path">{row.path}</span>
										<span class="trend-page-score">
											{row.current_visits.toLocaleString()} visits
										</span>
										<span class="trend-page-meta">
											{row.current_unique_visitors.toLocaleString()} uniques |
											{formatTrendLift(row.lift_visits)} vs
											{formatTrendBaseline(row.baseline_avg_visits)} avg |
											{formatTrendRatio(row.ratio_visits)}
										</span>
										<span class="trend-page-source">{getTopTrafficSource(row)}</span>
									</button>
								{/each}
							</div>
						{/if}
					</article>

					<article class="trending-list-panel repeat">
						<div class="trending-list-header">
							<h3>Repeat Activity</h3>
							<span>{repeatTrendingRows.length.toLocaleString()}</span>
						</div>
						{#if repeatTrendingRows.length === 0}
							<p class="trending-empty">No concentrated repeat spikes right now.</p>
						{:else}
							<div class="trending-list">
								{#each repeatTrendingRows as row}
									<button
										type="button"
										class="trending-row repeat"
										class:active={selectedTrendPath === row.path}
										onclick={() => void focusPathTrend(row.path)}
									>
										<span class="trend-page-path">{row.path}</span>
										<span class="trend-page-score">
											{row.current_visits.toLocaleString()} visits
										</span>
										<span class="trend-page-meta">
											{row.current_unique_visitors.toLocaleString()} uniques |
											{formatTrendLift(row.lift_visits)} vs
											{formatTrendBaseline(row.baseline_avg_visits)} avg |
											{formatTrendRatio(row.ratio_visits)}
										</span>
										<span class="trend-page-source">{getTopTrafficSource(row)}</span>
									</button>
								{/each}
							</div>
						{/if}
					</article>
				</div>
			{/if}
		</section>

		<section class="charts-grid">
			<div class="chart-card">
				<LineChart
					data={visitsChartData}
					title="Visits Over Time"
					height={280}
					color="var(--data-teal)"
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
					color="var(--success-text)"
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
								color="var(--lamp-glow)"
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
				<Button variant="secondary" onclick={() => goToPage(page - 1)} disabled={!canPrev}>
					Previous
				</Button>
				<span>Page {page} of {totalPages}</span>
				<Button variant="secondary" onclick={() => goToPage(page + 1)} disabled={!canNext}>
					Next
				</Button>
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
							)?.label ?? 'All Pages'} | New York local time
						</p>
					</div>
					<Button variant="secondary" onclick={fetchTimingAnalytics} loading={timingLoading}>
						{timingLoading ? 'Refreshing...' : 'Refresh'}
					</Button>
				</div>

				{#if timingLoading && !timingLoaded}
					<div class="empty-panel">Loading traffic timing...</div>
				{:else if timingRows.length === 0}
					<div class="empty-panel">No visit timing data for this filter set.</div>
				{:else}
					<div class="timing-overview">
						<div class="timing-stat">
							<span>Total visits</span>
							<strong>{timingAnalysis.total_visits.toLocaleString()}</strong>
							<small>{timingAnalysis.active_slots} active slots</small>
						</div>
						<div class="timing-stat">
							<span>Slot average</span>
							<strong>{formatCompactNumber(timingAnalysis.mean_slot_visits, 1)}</strong>
							<small>Across all 168 slots</small>
						</div>
						<div class="timing-stat">
							<span>Std dev</span>
							<strong>{formatCompactNumber(timingAnalysis.std_dev_slot_visits, 1)}</strong>
							<small>Visits per slot</small>
						</div>
						<div class="timing-stat">
							<span>Slot coverage</span>
							<strong>{formatPercent(timingAnalysis.active_slot_pct, 0)}</strong>
							<small>{timingAnalysis.active_slots} of 168 had traffic</small>
						</div>
						<div class="timing-stat">
							<span>Most traffic</span>
							<strong>{timingAnalysis.peak_slot?.label ?? '—'}</strong>
							<small
								>{(timingAnalysis.peak_slot?.visits ?? 0).toLocaleString()} visits · {formatZScore(
									timingAnalysis.peak_slot?.z_score ?? 0
								)}</small
							>
						</div>
						<div class="timing-stat">
							<span>Least traffic</span>
							<strong>{timingAnalysis.quiet_slot?.label ?? '—'}</strong>
							<small
								>{(timingAnalysis.quiet_slot?.visits ?? 0).toLocaleString()} visits · {formatZScore(
									timingAnalysis.quiet_slot?.z_score ?? 0
								)}</small
							>
						</div>
						<div class="timing-stat">
							<span>Busiest hour</span>
							<strong>{timingAnalysis.busiest_hour?.label ?? '—'}</strong>
							<small
								>{(timingAnalysis.busiest_hour?.visits ?? 0).toLocaleString()} visits · {formatZScore(
									timingAnalysis.busiest_hour?.z_score ?? 0
								)}</small
							>
						</div>
						<div class="timing-stat">
							<span>Quietest hour</span>
							<strong>{timingAnalysis.quietest_hour?.label ?? '—'}</strong>
							<small
								>{(timingAnalysis.quietest_hour?.visits ?? 0).toLocaleString()} visits · {formatZScore(
									timingAnalysis.quietest_hour?.z_score ?? 0
								)}</small
							>
						</div>
					</div>

					<div class="timing-synthesis-grid">
						<section class="timing-panel">
							<h3>Timing Synthesis</h3>
							<p class="timing-lede">{timingAnalysis.primary_trend}</p>
							<div class="timing-rollup-grid">
								<div>
									<span>Busiest day</span>
									<strong>{timingAnalysis.busiest_day?.label ?? '—'}</strong>
									<small>{(timingAnalysis.busiest_day?.visits ?? 0).toLocaleString()} visits</small>
								</div>
								<div>
									<span>Quietest day</span>
									<strong>{timingAnalysis.quietest_day?.label ?? '—'}</strong>
									<small>{(timingAnalysis.quietest_day?.visits ?? 0).toLocaleString()} visits</small
									>
								</div>
								<div>
									<span>Weekday share</span>
									<strong>{formatPercent(timingAnalysis.weekday_share_pct, 0)}</strong>
									<small
										>{formatCompactNumber(timingAnalysis.weekday_avg_slot_visits, 1)} visits/slot</small
									>
								</div>
								<div>
									<span>Weekend share</span>
									<strong>{formatPercent(timingAnalysis.weekend_share_pct, 0)}</strong>
									<small
										>{formatCompactNumber(timingAnalysis.weekend_avg_slot_visits, 1)} visits/slot</small
									>
								</div>
							</div>
						</section>

						<section class="timing-panel">
							<h3>Recommendations</h3>
							<ol class="timing-recommendations">
								{#each timingAnalysis.recommendations as recommendation}
									<li>{recommendation}</li>
								{/each}
							</ol>
						</section>
					</div>

					<div class="timing-outliers">
						<div class="timing-outlier-header">
							<div>
								<h3>Standard Deviation Outliers</h3>
								<p>
									High outliers are slots at +2 SD or more. Low outliers are slots at -1 SD or
									lower.
								</p>
							</div>
						</div>
						<div class="timing-outlier-grid">
							<section class="timing-outlier-list">
								<h4>High Traffic Outliers</h4>
								{#if timingAnalysis.high_outliers.length === 0}
									<p>No slot is +2 SD above the slot average.</p>
								{:else}
									{#each timingAnalysis.high_outliers as row}
										<div class="timing-outlier-item">
											<span>{row.label}</span>
											<strong>{row.visits.toLocaleString()} visits</strong>
											<small
												>{formatZScore(row.z_score)} · {formatPercent(row.share_pct, 1)} of traffic</small
											>
										</div>
									{/each}
								{/if}
							</section>
							<section class="timing-outlier-list">
								<h4>Low Traffic Outliers</h4>
								{#if timingAnalysis.low_outliers.length === 0}
									<p>No slot is -1 SD below the slot average.</p>
								{:else}
									{#each timingAnalysis.low_outliers as row}
										<div class="timing-outlier-item low">
											<span>{row.label}</span>
											<strong>{row.visits.toLocaleString()} visits</strong>
											<small
												>{formatZScore(row.z_score)} · {formatPercent(row.share_pct, 1)} of traffic</small
											>
										</div>
									{/each}
								{/if}
							</section>
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
						<p>
							Mature demand bands use non-internal visitors plus engagement after 7d/30d. Launch
							score is shown separately. Releases {formatReleaseDateWindow(
								releaseFromDate,
								releaseToDate
							)}
						</p>
					</div>
					<div class="release-header-actions">
						<Button
							variant="secondary"
							onclick={exportReleaseAnalysisCsv}
							disabled={releasesLoading || releaseVisibleRows.length === 0}
						>
							Export CSV
						</Button>
						<Button variant="secondary" onclick={fetchReleaseAnalytics} loading={releasesLoading}>
							{releasesLoading ? 'Refreshing...' : 'Refresh'}
						</Button>
					</div>
				</div>

				<div class="release-range-panel" aria-label="Release date range">
					<div class="release-range-fields">
						<label class="field">
							<span>Release from</span>
							<input type="date" bind:value={releaseFromDate} />
						</label>
						<label class="field">
							<span>Release to</span>
							<input type="date" bind:value={releaseToDate} />
						</label>
						<div class="release-range-presets" aria-label="Release range presets">
							{#each releaseRangePresetOptions as option}
								<button
									type="button"
									class="range-preset"
									onclick={() => setReleaseRangePreset(option.days)}
									disabled={releasesLoading}
								>
									{option.label}
								</button>
							{/each}
						</div>
					</div>
					<div class="release-range-actions">
						<Button onclick={applyReleaseFilters} disabled={releasesLoading}>Apply range</Button>
						<Button variant="secondary" onclick={resetReleaseFilters} disabled={releasesLoading}>
							Reset range
						</Button>
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
							<Button variant="secondary" onclick={toggleReleaseSortDirection}>
								{releaseSortDir === 'desc' ? 'High to low' : 'Low to high'}
							</Button>
						</div>
					</div>

					<div class="release-signal-grid">
						<div class="release-signal-panel over">
							<div class="signal-header">
								<span>Mature overperforming</span>
								<strong>{releaseSummary.aboveNorm.toLocaleString()}</strong>
							</div>
							{#if overperformingRows.length === 0}
								<p>No releases above benchmark yet.</p>
							{:else}
								{#each overperformingRows as row}
									<button type="button" onclick={() => focusReleaseSignal(row.slug, 'above_norm')}>
										<span>{row.title || row.slug}</span>
										<strong>{formatBenchmarkScore(row.overall_score)}</strong>
									</button>
								{/each}
							{/if}
						</div>
						<div class="release-signal-panel under">
							<div class="signal-header">
								<span>Mature underperforming</span>
								<strong>{releaseSummary.belowNorm.toLocaleString()}</strong>
							</div>
							{#if underperformingRows.length === 0}
								<p>No releases below benchmark yet.</p>
							{:else}
								{#each underperformingRows as row}
									<button type="button" onclick={() => focusReleaseSignal(row.slug, 'below_norm')}>
										<span>{row.title || row.slug}</span>
										<strong>{formatBenchmarkScore(row.overall_score)}</strong>
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
						<div class="trend-panel release-growth-panel">
							{#if releaseVisibleRows.length === 0}
								<div class="empty-panel trend-empty">
									Select a release below to view its growth curve.
								</div>
							{:else if selectedRelease}
								<div class="release-detail-header">
									<div>
										<h3>{selectedRelease.title || selectedRelease.slug}</h3>
										<p>
											{selectedRelease.total_views.toLocaleString()} total views |
											{selectedRelease.total_unique_visitors.toLocaleString()} unique visitors
										</p>
									</div>
									<span
										class={`band-pill ${getBandClass(selectedRelease.overall_performance_band)}`}
									>
										{formatPerformanceBand(selectedRelease.overall_performance_band)}
									</span>
								</div>

								{#if releaseGrowthChartData.length > 0}
									<LineChart
										data={releaseGrowthChartData}
										title="Cumulative Views After Publish"
										xLabel="Days Since Publish"
										height={280}
										color="var(--success)"
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
										<span>Overall</span>
										<strong>{formatBenchmarkScore(selectedRelease.overall_score)}</strong>
									</div>
									<div>
										<span>Basis</span>
										<strong>{formatDemandBasis(selectedRelease.overall_basis)}</strong>
									</div>
									<div>
										<span>Demand sample</span>
										<strong>
											{selectedRelease.quality_demand_sample_size > 0
												? selectedRelease.quality_demand_sample_size.toLocaleString()
												: 'Needs history'}
										</strong>
									</div>
									<div>
										<span>Launch</span>
										<strong>{formatBenchmarkScore(selectedRelease.launch_score)}</strong>
									</div>
									<div>
										<span>Demand</span>
										<strong>{formatBenchmarkScore(selectedRelease.quality_demand_score)}</strong>
									</div>
									<div>
										<span>External 30d</span>
										<strong>{selectedRelease.external_unique_30d.toLocaleString()}</strong>
									</div>
									<div>
										<span>Internal 30d</span>
										<strong>{selectedRelease.internal_share_30d.toFixed(0)}%</strong>
									</div>
									<div>
										<span>Repeat 24h</span>
										<strong>{selectedRelease.repeat_view_share_24h.toFixed(0)}%</strong>
									</div>
									<div>
										<span>Confidence</span>
										<strong>{formatConfidence(selectedRelease.quality_demand_confidence)}</strong>
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

								<div class="release-demand-notes">
									<div>
										<span>Top demand sources</span>
										<strong>{formatSourceSummary(selectedRelease.top_demand_sources)}</strong>
									</div>
									{#if selectedRelease.performance_notes.length}
										<ul>
											{#each selectedRelease.performance_notes as note}
												<li>{note}</li>
											{/each}
										</ul>
									{/if}
								</div>

								<div class="release-events-section">
									<div class="release-events-header">
										<div>
											<h4>Event Impact</h4>
											<p>Compare 7 days before and after each release event.</p>
										</div>
										<Button
											variant="secondary"
											onclick={() => void fetchReleaseEvents(selectedRelease.slug, true)}
											loading={releaseEventsLoading}
										>
											{releaseEventsLoading ? 'Refreshing...' : 'Refresh'}
										</Button>
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
										<Button type="submit" loading={releaseEventSubmitting}>
											{releaseEventSubmitting ? 'Saving...' : 'Record'}
										</Button>
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
									Select a release below to view its growth curve.
								</div>
							{/if}
						</div>

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
											<td colspan={releaseTableColumns.length} class="empty">
												No releases match this performance filter.
											</td>
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
												<td class="num" data-label="Launch">
													{formatBenchmarkScore(row.launch_score)}
													<small>{formatBenchmarkBasis(row.launch_basis)}</small>
													{#if row.launch_sample_size > 0}
														<small>n={row.launch_sample_size.toLocaleString()}</small>
													{/if}
												</td>
												<td class="num" data-label="Demand">
													{formatBenchmarkScore(row.quality_demand_score)}
													<small>{formatDemandBasis(row.quality_demand_basis)}</small>
													{#if row.quality_demand_sample_size > 0}
														<small>n={row.quality_demand_sample_size.toLocaleString()}</small>
													{/if}
													<small>{row.external_unique_30d.toLocaleString()} external 30d</small>
												</td>
												<td class="num" data-label="Overall">
													{formatBenchmarkScore(row.overall_score)}
													<small>{formatDemandBasis(row.overall_basis)}</small>
													{#if row.internal_share_30d > 0 || row.repeat_view_share_24h > 0}
														<small>
															{row.internal_share_30d.toFixed(0)}% internal · {row.repeat_view_share_24h.toFixed(
																0
															)}% repeat
														</small>
													{/if}
												</td>
												<td data-label="Band">
													<span class={`band-pill ${getBandClass(row.overall_performance_band)}`}>
														{formatPerformanceBand(row.overall_performance_band)}
													</span>
													<small>{formatReleaseStage(row.release_stage)}</small>
												</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</section>
		</div>
	{/if}

	{#if activeTab === 'overperformers' || activeTab === 'underperformers' || hasOpenedBlogInsights}
		<div hidden={activeTab !== 'overperformers' && activeTab !== 'underperformers'}>
			<section class="insight-card blog-insight-card">
				<div class="insight-header release-header">
					<div>
						<h2>{getInsightModeLabel(activeBlogInsightMode)}</h2>
						<p>{getInsightModeDescription(activeBlogInsightMode)}</p>
					</div>
					<div class="release-header-actions">
						<Button
							variant="secondary"
							onclick={() => void fetchBlogDiagnostics(true)}
							loading={blogDiagnosticsLoading}
						>
							{blogDiagnosticsLoading ? 'Refreshing...' : 'Refresh diagnostics'}
						</Button>
						<Button variant="secondary" onclick={fetchReleaseAnalytics} loading={releasesLoading}>
							{releasesLoading ? 'Refreshing...' : 'Refresh performance'}
						</Button>
					</div>
				</div>

				<div class="release-range-panel" aria-label="Blog insight release date range">
					<div class="release-range-fields">
						<label class="field">
							<span>Release from</span>
							<input type="date" bind:value={releaseFromDate} />
						</label>
						<label class="field">
							<span>Release to</span>
							<input type="date" bind:value={releaseToDate} />
						</label>
						<div class="release-range-presets" aria-label="Release range presets">
							{#each releaseRangePresetOptions as option}
								<button
									type="button"
									class="range-preset"
									onclick={() => setReleaseRangePreset(option.days)}
									disabled={releasesLoading}
								>
									{option.label}
								</button>
							{/each}
						</div>
					</div>
					<div class="release-range-actions">
						<Button onclick={applyReleaseFilters} disabled={releasesLoading}>Apply range</Button>
						<Button variant="secondary" onclick={resetReleaseFilters} disabled={releasesLoading}>
							Reset range
						</Button>
					</div>
				</div>

				{#if (releasesLoading && !releasesLoaded) || (blogDiagnosticsLoading && !blogDiagnosticsLoaded)}
					<div class="empty-panel">Loading blog diagnostics...</div>
				{:else if activeBlogInsightRows.length === 0}
					<div class="empty-panel">
						No {activeBlogInsightMode === 'over' ? 'overperforming' : 'underperforming'} mature blogs
						found for this release range.
					</div>
				{:else}
					<div class="blog-insight-summary-grid">
						<div>
							<span>Blogs</span>
							<strong>{activeBlogInsightSummary.count.toLocaleString()}</strong>
						</div>
						<div>
							<span>Avg overall</span>
							<strong>{formatCompactNumber(activeBlogInsightSummary.avgOverall, 0)}</strong>
						</div>
						<div>
							<span>Avg external 30d</span>
							<strong>{formatCompactNumber(activeBlogInsightSummary.avgExternal30d, 1)}</strong>
						</div>
						<div>
							<span>Avg incoming links</span>
							<strong>{formatCompactNumber(activeBlogInsightSummary.avgIncomingLinks, 1)}</strong>
						</div>
						<div>
							<span>Avg outgoing links</span>
							<strong>{formatCompactNumber(activeBlogInsightSummary.avgOutgoingLinks, 1)}</strong>
						</div>
						<div>
							<span>Avg SEO health</span>
							<strong>{formatCompactNumber(activeBlogInsightSummary.avgSeoScore, 0)}</strong>
						</div>
					</div>

					<p class="blog-insight-note">
						Frontmatter <code>published</code> is shown for sanity checking only. Performance scoring
						comes from the release analytics database and raw visit signals.
					</p>

					<div class="blog-insight-layout">
						<div class="blog-insight-list" aria-label="Blog insight list">
							{#each activeBlogInsightRows as row}
								<button
									type="button"
									class:active={selectedBlogInsight?.release.slug === row.release.slug}
									onclick={() => (selectedBlogInsightSlug = row.release.slug)}
								>
									<span>{row.release.title || row.release.slug}</span>
									<strong>{formatBenchmarkScore(row.release.overall_score)}</strong>
									<small>
										{row.release.external_unique_30d.toLocaleString()} external 30d ·
										{row.diagnostics?.link_stats.incoming_internal_count ?? 0} in /
										{row.diagnostics?.link_stats.outgoing_internal_count ?? 0} out links
									</small>
								</button>
							{/each}
						</div>

						{#if selectedBlogInsight}
							<div class="blog-insight-detail">
								<div class="blog-insight-title">
									<div>
										<h3>{selectedBlogInsight.release.title || selectedBlogInsight.release.slug}</h3>
										<a href={selectedBlogInsight.release.path}>{selectedBlogInsight.release.path}</a
										>
									</div>
									<span
										class={`band-pill ${getBandClass(selectedBlogInsight.release.overall_performance_band)}`}
									>
										{formatPerformanceBand(selectedBlogInsight.release.overall_performance_band)}
									</span>
								</div>

								<div class="blog-insight-metrics">
									<div>
										<span>Overall</span>
										<strong
											>{formatBenchmarkScore(selectedBlogInsight.release.overall_score)}</strong
										>
										<small>{formatDemandBasis(selectedBlogInsight.release.overall_basis)}</small>
									</div>
									<div>
										<span>Demand</span>
										<strong
											>{formatBenchmarkScore(
												selectedBlogInsight.release.quality_demand_score
											)}</strong
										>
										<small
											>{formatConfidence(
												selectedBlogInsight.release.quality_demand_confidence
											)}</small
										>
									</div>
									<div>
										<span>Launch</span>
										<strong>{formatBenchmarkScore(selectedBlogInsight.release.launch_score)}</strong
										>
										<small>{formatBenchmarkBasis(selectedBlogInsight.release.launch_basis)}</small>
									</div>
									<div>
										<span>External 30d</span>
										<strong
											>{selectedBlogInsight.release.external_unique_30d.toLocaleString()}</strong
										>
										<small>
											{selectedBlogInsight.release.search_unique_30d.toLocaleString()} search ·
											{selectedBlogInsight.release.direct_unique_30d.toLocaleString()} direct
										</small>
									</div>
									<div>
										<span>Internal share</span>
										<strong>{selectedBlogInsight.release.internal_share_30d.toFixed(0)}%</strong>
										<small
											>{selectedBlogInsight.release.repeat_view_share_24h.toFixed(0)}% repeat 24h</small
										>
									</div>
								</div>

								{#if selectedBlogInsight.diagnostics}
									{@const diagnostics = selectedBlogInsight.diagnostics}
									<div class="blog-diagnostic-grid">
										<section>
											<h4>Frontmatter</h4>
											<dl>
												<div>
													<dt>File</dt>
													<dd>{diagnostics.file_path}</dd>
												</div>
												<div>
													<dt>Title</dt>
													<dd>{diagnostics.frontmatter.title || 'Missing'}</dd>
												</div>
												<div>
													<dt>Meta title</dt>
													<dd>{diagnostics.frontmatter.meta_title || 'Missing'}</dd>
												</div>
												<div>
													<dt>Persona</dt>
													<dd>{diagnostics.frontmatter.persona_title || 'Missing'}</dd>
												</div>
												<div>
													<dt>Description</dt>
													<dd>{diagnostics.frontmatter.description || 'Missing'}</dd>
												</div>
												<div>
													<dt>Date / lastmod</dt>
													<dd>
														{diagnostics.frontmatter.date || 'Missing'} / {diagnostics.frontmatter
															.lastmod || 'Missing'}
													</dd>
												</div>
												<div>
													<dt>Published flag</dt>
													<dd>{formatFrontmatterValue(diagnostics.frontmatter.published)}</dd>
												</div>
												<div>
													<dt>Type</dt>
													<dd>
														Enneagram {diagnostics.frontmatter.enneagram || 'missing'} ·
														{formatList(diagnostics.frontmatter.type)}
													</dd>
												</div>
												<div>
													<dt>Suggestions</dt>
													<dd>{formatList(diagnostics.frontmatter.suggestions)}</dd>
												</div>
												<div>
													<dt>Keywords</dt>
													<dd>{formatList(diagnostics.frontmatter.keywords)}</dd>
												</div>
												<div>
													<dt>Schema / citations</dt>
													<dd>
														{diagnostics.frontmatter.faq_count} FAQ · {diagnostics.frontmatter
															.same_as_count}
														sameAs · {diagnostics.frontmatter.citations.length} citations
													</dd>
												</div>
											</dl>
										</section>

										<section>
											<h4>Content Signals</h4>
											<div class="diagnostic-score-row">
												<span>SEO {diagnostics.diagnostic_scores.seo}</span>
												<span>Depth {diagnostics.diagnostic_scores.content_depth}</span>
												<span>FM {diagnostics.diagnostic_scores.frontmatter}</span>
											</div>
											<dl>
												<div>
													<dt>Words / headings</dt>
													<dd>
														{diagnostics.content_stats.word_count.toLocaleString()} words ·
														{diagnostics.content_stats.h2_count} H2 · {diagnostics.content_stats
															.h3_count}
														H3
													</dd>
												</div>
												<div>
													<dt>Meta lengths</dt>
													<dd>
														{diagnostics.content_stats.meta_title_chars} title chars ·
														{diagnostics.content_stats.description_chars} description chars
													</dd>
												</div>
												<div>
													<dt>Structure</dt>
													<dd>
														TL;DR {diagnostics.content_stats.has_tldr ? 'yes' : 'no'} · FAQ
														{diagnostics.content_stats.has_faq_schema ? 'yes' : 'no'} · evidence
														{diagnostics.content_stats.has_testimony_ledger ? 'yes' : 'no'}
													</dd>
												</div>
												<div>
													<dt>Quality</dt>
													<dd>
														{diagnostics.frontmatter.content_quality.letter || 'No grade'} · overall
														{formatCompactNumber(
															diagnostics.frontmatter.content_quality.overall,
															1
														)}
													</dd>
												</div>
											</dl>
										</section>

										<section>
											<h4>Cross-Links</h4>
											<div class="diagnostic-score-row">
												<span>Link health {diagnostics.diagnostic_scores.internal_links}</span>
												<span>{diagnostics.link_stats.incoming_internal_count} in</span>
												<span>{diagnostics.link_stats.outgoing_internal_count} out</span>
											</div>
											<dl>
												<div>
													<dt>Outgoing mix</dt>
													<dd>
														{diagnostics.link_stats.outgoing_personality_count} people ·
														{diagnostics.link_stats.outgoing_enneagram_count} type ·
														{diagnostics.link_stats.outgoing_category_count} category
													</dd>
												</div>
												<div>
													<dt>Suggestion health</dt>
													<dd>
														{diagnostics.link_stats.suggestions_existing_count}/{diagnostics
															.link_stats.suggestion_count}
														resolve locally
													</dd>
												</div>
												<div>
													<dt>Incoming sources</dt>
													<dd>
														{#if diagnostics.link_stats.incoming_sources.length}
															{diagnostics.link_stats.incoming_sources
																.slice(0, 4)
																.map((source) => source.title)
																.join(', ')}
														{:else}
															No incoming personality links found
														{/if}
													</dd>
												</div>
												<div>
													<dt>Top outgoing targets</dt>
													<dd>
														{#if diagnostics.link_stats.outgoing_targets.length}
															{diagnostics.link_stats.outgoing_targets
																.slice(0, 5)
																.map((target) => target.href)
																.join(', ')}
														{:else}
															No outgoing internal links found
														{/if}
													</dd>
												</div>
											</dl>
										</section>

										<section>
											<h4>{activeBlogInsightMode === 'over' ? 'Replicate' : 'Fix Next'}</h4>
											<ul class="diagnostic-note-list">
												{#each activeBlogInsightMode === 'over' ? diagnostics.replication_notes : diagnostics.action_notes as note}
													<li>{note}</li>
												{/each}
												{#if (activeBlogInsightMode === 'over' ? diagnostics.replication_notes : diagnostics.action_notes).length === 0}
													<li>No obvious diagnostic notes from the static checks.</li>
												{/if}
											</ul>
										</section>
									</div>
								{:else}
									<div class="empty-panel trend-empty">
										No local frontmatter diagnostics found for this slug.
									</div>
								{/if}
							</div>
						{/if}
					</div>

					<div class="table-wrapper blog-action-table-wrapper">
						<table class="data-table blog-action-table">
							<thead>
								<tr>
									<th>Blog</th>
									<th class="num">Overall</th>
									<th class="num">External</th>
									<th class="num">Internal</th>
									<th class="num">Links</th>
									<th class="num">SEO</th>
									<th>Primary note</th>
								</tr>
							</thead>
							<tbody>
								{#each activeBlogInsightRows as row}
									<tr class:active-row={selectedBlogInsight?.release.slug === row.release.slug}>
										<td data-label="Blog">
											<button
												type="button"
												class="table-path-button"
												onclick={() => (selectedBlogInsightSlug = row.release.slug)}
											>
												{row.release.title || row.release.slug}
											</button>
											<small>{row.release.path}</small>
										</td>
										<td class="num" data-label="Overall"
											>{formatBenchmarkScore(row.release.overall_score)}</td
										>
										<td class="num" data-label="External">
											{row.release.external_unique_30d.toLocaleString()}
											<small>{row.release.search_unique_30d.toLocaleString()} search</small>
										</td>
										<td class="num" data-label="Internal">
											{row.release.internal_share_30d.toFixed(0)}%
											<small>{row.release.repeat_view_share_24h.toFixed(0)}% repeat</small>
										</td>
										<td class="num" data-label="Links">
											{row.diagnostics?.link_stats.incoming_internal_count ?? 0} in /
											{row.diagnostics?.link_stats.outgoing_internal_count ?? 0} out
										</td>
										<td class="num" data-label="SEO">
											{row.diagnostics?.diagnostic_scores.seo ?? '—'}
										</td>
										<td data-label="Primary note">
											{(activeBlogInsightMode === 'over'
												? row.diagnostics?.replication_notes[0]
												: row.diagnostics?.action_notes[0]) ?? 'No diagnostic note'}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
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
		border: 1px solid var(--stone-warm);
		border-radius: 999px;
		padding: 8px 14px;
		background: var(--stone-warm);
		color: var(--ink-mid);
		font-weight: 600;
		cursor: pointer;
	}

	.analytics-tab.active {
		background: color-mix(in srgb, var(--data-teal) 14%, transparent);
		border-color: color-mix(in srgb, var(--data-teal) 32%, transparent);
		color: var(--data-cyan);
	}

	.page-title {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.page-subtitle {
		margin: 6px 0 0;
		color: var(--ink-mid);
	}

	.filter-card,
	.chart-card,
	.table-card,
	.insight-card,
	.list-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-warm);
		border-radius: 1rem;
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
		color: var(--ink-mid);
	}

	.field input,
	.field select {
		background: var(--night-deep);
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		padding: 8px 10px;
		color: var(--ink-bright);
	}

	.filter-actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
	}

	.reporting-time-zone {
		margin-left: auto;
		font-size: 0.78rem;
		color: var(--ink-mid);
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
		color: var(--ink-mid);
		font-size: 0.85rem;
	}

	.trend-hint {
		margin: 6px 0 0;
		font-size: 0.76rem;
		color: var(--ink-mid);
		opacity: 0.85;
	}

	.loading-pill {
		font-size: 0.75rem;
		padding: 4px 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--data-teal) 16%, transparent);
		color: var(--data-cyan);
		white-space: nowrap;
	}

	.trending-card {
		padding: 12px;
	}

	.trending-header {
		align-items: flex-start;
	}

	.trending-controls {
		display: flex;
		align-items: end;
		justify-content: flex-end;
		gap: 8px;
		flex-wrap: wrap;
	}

	.trending-controls label {
		display: grid;
		gap: 4px;
		min-width: 116px;
	}

	.trending-controls label span {
		font-size: 0.72rem;
		color: var(--ink-mid);
	}

	.trending-controls select {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		padding: 8px;
	}

	.trending-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
		gap: 12px;
	}

	.trending-list-panel {
		border: 1px solid var(--stone-warm);
		border-radius: 10px;
		background: var(--night-deep);
		padding: 10px;
		min-width: 0;
	}

	.trending-list-panel.repeat {
		border-color: color-mix(in srgb, var(--warning) 28%, var(--stone-warm));
	}

	.trending-list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 8px;
	}

	.trending-list-header h3 {
		margin: 0;
		font-size: 0.95rem;
	}

	.trending-list-header span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		height: 24px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--data-teal) 16%, transparent);
		color: var(--data-cyan);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.trending-list {
		display: grid;
		gap: 8px;
	}

	.trending-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas:
			'path score'
			'meta source';
		gap: 5px 10px;
		width: 100%;
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 88%, var(--stone-warm));
		color: inherit;
		text-align: left;
		padding: 9px;
		cursor: pointer;
		min-width: 0;
	}

	.trending-row:hover,
	.trending-row.active {
		border-color: var(--lamp-glow);
	}

	.trending-row.active {
		background: color-mix(in srgb, var(--lamp-glow) 14%, transparent);
	}

	.trend-page-path {
		grid-area: path;
		color: var(--ink-bright);
		font-size: 0.82rem;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.trend-page-score {
		grid-area: score;
		color: var(--ink-bright);
		font-size: 0.8rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.trend-page-meta {
		grid-area: meta;
		color: var(--ink-mid);
		font-size: 0.74rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.trend-page-source {
		grid-area: source;
		color: var(--data-cyan);
		font-size: 0.72rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.trending-empty {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.empty-panel {
		padding: 14px;
		border: 1px dashed var(--stone-warm);
		border-radius: 10px;
		text-align: center;
		color: var(--ink-mid);
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
		background: var(--night-deep);
		border: 1px solid var(--stone-warm);
		color: var(--ink-bright);
		padding: 9px 10px;
		border-radius: 0.625rem;
		cursor: pointer;
		text-align: left;
	}

	.path-pill:hover {
		border-color: var(--stone-warm);
	}

	.path-pill.active {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-glow) 14%, transparent);
	}

	.path-rank {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--ink-mid);
	}

	.path-text {
		font-size: 0.82rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.path-visits {
		font-size: 0.74rem;
		color: var(--ink-mid);
		white-space: nowrap;
	}

	.trend-panel {
		border: 1px solid var(--stone-warm);
		border-radius: 10px;
		padding: 8px;
		background: var(--night-deep);
	}

	.trend-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.78rem;
		color: var(--ink-mid);
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
		color: var(--ink-mid);
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
		border: 1px solid var(--stone-warm);
		background: var(--night-deep);
		color: inherit;
		text-align: left;
		cursor: pointer;
		background: var(--night-deep);
		border-radius: 0.625rem;
		padding: 9px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.rank-item-button:hover {
		border-color: var(--stone-warm);
	}

	.rank-item-button.active {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-glow) 14%, transparent);
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
		background: color-mix(in srgb, var(--ink-dim) 26%, transparent);
		color: var(--ink-bright);
		font-size: 0.75rem;
		font-weight: 700;
	}

	.rank-path {
		font-size: 0.8rem;
		color: var(--ink-bright);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.rank-value {
		font-size: 0.74rem;
		color: var(--ink-mid);
		white-space: nowrap;
	}

	.bar-track {
		height: 8px;
		background: color-mix(in srgb, var(--ink-dim) 18%, transparent);
		border-radius: 999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
	}

	.bar-week {
		background: linear-gradient(90deg, var(--data-teal) 0%, var(--data-cyan) 100%);
	}

	.bar-month {
		background: linear-gradient(90deg, var(--success) 0%, var(--success-text) 100%);
	}

	.bar-duration {
		background: linear-gradient(90deg, var(--lamp-glow) 0%, var(--lamp-light) 100%);
	}

	.rank-meta {
		font-size: 0.73rem;
		color: var(--ink-mid);
	}

	.timing-overview,
	.release-summary-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 12px;
	}

	.timing-stat {
		border: 1px solid var(--stone-warm);
		background: var(--night-deep);
		border-radius: 0.625rem;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.timing-stat span,
	.release-detail-grid span {
		font-size: 0.74rem;
		color: var(--ink-mid);
	}

	.timing-stat strong,
	.release-detail-grid strong {
		font-size: 1rem;
		color: var(--ink-bright);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.timing-stat small {
		color: var(--ink-mid);
		font-size: 0.72rem;
		line-height: 1.25;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.timing-synthesis-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
		gap: 12px;
		margin-bottom: 12px;
	}

	.timing-panel,
	.timing-outliers {
		border: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--night-deep) 88%, transparent);
		border-radius: 0.625rem;
		padding: 12px;
		min-width: 0;
	}

	.timing-panel h3,
	.timing-outlier-header h3 {
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.95rem;
	}

	.timing-lede {
		margin: 8px 0 10px;
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.timing-rollup-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.timing-rollup-grid div {
		border: 1px solid var(--stone-edge);
		background: color-mix(in srgb, var(--ink-dim) 8%, transparent);
		border-radius: 0.625rem;
		padding: 9px;
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.timing-rollup-grid span,
	.timing-rollup-grid small,
	.timing-outlier-header p,
	.timing-outlier-list p,
	.timing-outlier-item small {
		color: var(--ink-mid);
	}

	.timing-rollup-grid span {
		font-size: 0.72rem;
	}

	.timing-rollup-grid strong {
		color: var(--ink-bright);
		font-size: 0.95rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.timing-rollup-grid small {
		font-size: 0.72rem;
	}

	.timing-recommendations {
		margin: 8px 0 0;
		padding-left: 20px;
		color: var(--ink-bright);
		font-size: 0.86rem;
		line-height: 1.45;
	}

	.timing-recommendations li + li {
		margin-top: 6px;
	}

	.timing-outliers {
		margin-bottom: 12px;
	}

	.timing-outlier-header {
		margin-bottom: 10px;
	}

	.timing-outlier-header p {
		margin: 4px 0 0;
		font-size: 0.78rem;
	}

	.timing-outlier-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.timing-outlier-list {
		display: grid;
		gap: 7px;
		min-width: 0;
	}

	.timing-outlier-list h4 {
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.82rem;
	}

	.timing-outlier-list p {
		margin: 0;
		font-size: 0.8rem;
	}

	.timing-outlier-item {
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 52%, var(--stone-edge));
		background: color-mix(in srgb, var(--lamp-glow) 10%, transparent);
		border-radius: 0.625rem;
		padding: 8px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 2px 8px;
		align-items: baseline;
	}

	.timing-outlier-item.low {
		border-color: color-mix(in srgb, var(--data-cyan) 48%, var(--stone-edge));
		background: color-mix(in srgb, var(--data-cyan) 8%, transparent);
	}

	.timing-outlier-item span {
		color: var(--ink-bright);
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.timing-outlier-item strong {
		color: var(--ink-bright);
		font-size: 0.82rem;
		white-space: nowrap;
	}

	.timing-outlier-item small {
		grid-column: 1 / -1;
		font-size: 0.72rem;
	}

	.heatmap-wrapper {
		overflow-x: auto;
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
	}

	.heatmap-table {
		width: 100%;
		min-width: 980px;
		border-collapse: collapse;
		font-size: 0.74rem;
	}

	.heatmap-table th,
	.heatmap-table td {
		border: 1px solid var(--stone-edge);
		padding: 6px;
		text-align: center;
	}

	.heatmap-table th {
		background: var(--night-deep);
		color: var(--ink-mid);
		font-weight: 700;
	}

	.heatmap-table td {
		background: color-mix(in srgb, var(--data-teal) calc(var(--heat) * 100%), transparent);
		color: var(--ink-bright);
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
		border: 1px solid var(--stone-warm);
		background: var(--night-deep);
		border-radius: 0.625rem;
		padding: 9px;
		display: grid;
		gap: 2px;
	}

	.timing-top-item span,
	.timing-top-item small {
		color: var(--ink-mid);
	}

	.timing-top-item strong {
		color: var(--ink-bright);
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

	.release-range-panel {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
		padding: 10px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		align-items: end;
		margin-bottom: 10px;
	}

	.release-range-fields {
		display: grid;
		grid-template-columns: minmax(150px, 180px) minmax(150px, 180px) minmax(0, 1fr);
		gap: 10px;
		align-items: end;
	}

	.release-range-presets {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		align-items: center;
	}

	.range-preset {
		border: 1px solid var(--stone-warm);
		background: var(--stone-warm);
		color: var(--ink-bright);
		border-radius: 0.625rem;
		padding: 8px 10px;
		cursor: pointer;
		font-weight: 600;
		white-space: nowrap;
	}

	.range-preset:hover:not(:disabled) {
		border-color: var(--data-cyan);
		color: var(--data-cyan);
	}

	.range-preset:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.release-range-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		flex-wrap: wrap;
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
		border: 1px solid var(--stone-warm);
		background: var(--night-deep);
		color: var(--ink-bright);
		border-radius: 0.625rem;
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
		color: var(--ink-mid);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.summary-filter strong {
		font-size: 0.95rem;
		color: var(--ink-bright);
	}

	.summary-filter:hover {
		border-color: var(--stone-warm);
	}

	.summary-filter.active {
		border-color: var(--data-teal);
		background: color-mix(in srgb, var(--data-teal) 16%, transparent);
	}

	.summary-filter.above.active {
		border-color: color-mix(in srgb, var(--success) 70%, transparent);
		background: color-mix(in srgb, var(--success) 16%, transparent);
	}

	.summary-filter.below.active {
		border-color: color-mix(in srgb, var(--secondary) 70%, transparent);
		background: color-mix(in srgb, var(--secondary) 16%, transparent);
	}

	.release-sort-controls {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
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
		color: var(--ink-mid);
	}

	.release-sort-controls select {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--stone-warm);
		color: var(--ink-bright);
		padding: 8px;
	}

	.release-signal-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 8px;
	}

	.release-signal-panel {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
		padding: 9px;
		display: grid;
		gap: 7px;
		min-width: 0;
	}

	.release-signal-panel.over {
		border-color: color-mix(in srgb, var(--success) 38%, transparent);
	}

	.release-signal-panel.under {
		border-color: color-mix(in srgb, var(--secondary) 38%, transparent);
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
		color: var(--ink-mid);
		font-weight: 700;
	}

	.signal-header strong {
		color: var(--ink-bright);
	}

	.release-signal-panel button {
		border: none;
		background: transparent;
		color: var(--ink-bright);
		padding: 0;
		cursor: pointer;
		text-align: left;
	}

	.release-signal-panel button:hover span {
		color: var(--lamp-light);
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
		color: var(--ink-mid);
	}

	.release-signal-panel p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.78rem;
	}

	.release-result-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 8px;
		color: var(--ink-mid);
		font-size: 0.78rem;
		flex-wrap: wrap;
	}

	.release-layout {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.release-table-wrapper {
		max-height: 720px;
		overflow-y: auto;
		overflow-x: auto;
	}

	.release-table {
		min-width: 1280px;
		table-layout: fixed;
	}

	.release-table th:nth-child(1),
	.release-table td:nth-child(1) {
		width: 300px;
	}

	.release-table th:nth-child(2),
	.release-table td:nth-child(2) {
		width: 132px;
	}

	.release-table th:nth-child(3),
	.release-table td:nth-child(3) {
		width: 92px;
	}

	.release-table th:nth-child(4),
	.release-table td:nth-child(4),
	.release-table th:nth-child(5),
	.release-table td:nth-child(5),
	.release-table th:nth-child(6),
	.release-table td:nth-child(6) {
		width: 82px;
	}

	.release-table th:nth-child(7),
	.release-table td:nth-child(7) {
		width: 90px;
	}

	.release-table th:nth-child(8),
	.release-table td:nth-child(8) {
		width: 145px;
	}

	.release-table th:nth-child(9),
	.release-table td:nth-child(9) {
		width: 145px;
	}

	.release-table th:nth-child(10),
	.release-table td:nth-child(10) {
		width: 130px;
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
		color: var(--ink-mid);
		font-size: 0.7rem;
		line-height: 1.35;
		overflow-wrap: break-word;
	}

	.release-table .sort-button {
		min-width: 0;
		gap: 5px;
	}

	.release-table .sort-button span:first-child {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.release-table .sort-indicator {
		flex: 0 0 auto;
	}

	.release-title-row {
		display: block;
	}

	.release-path {
		margin-top: 4px;
		color: var(--ink-mid);
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
		color: var(--lamp-light);
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
		background: color-mix(in srgb, var(--success) 18%, transparent);
		color: var(--success-text);
	}

	.band-below {
		background: color-mix(in srgb, var(--secondary) 18%, transparent);
		color: var(--secondary-light);
	}

	.band-collecting {
		background: color-mix(in srgb, var(--data-teal) 18%, transparent);
		color: var(--data-cyan);
	}

	.band-neutral {
		background: color-mix(in srgb, var(--ink-dim) 22%, transparent);
		color: var(--ink-mid);
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
		color: var(--ink-mid);
		font-size: 0.8rem;
	}

	.release-detail-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 8px;
		margin-top: 12px;
	}

	.release-detail-grid div {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		padding: 8px;
		display: grid;
		gap: 4px;
	}

	.release-demand-notes {
		margin-top: 10px;
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		padding: 10px;
		display: grid;
		gap: 8px;
	}

	.release-demand-notes span {
		display: block;
		color: var(--ink-mid);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.release-demand-notes strong {
		display: block;
		margin-top: 2px;
		font-size: 0.85rem;
	}

	.release-demand-notes ul {
		margin: 0;
		padding-left: 18px;
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.45;
	}

	.release-events-section {
		margin-top: 14px;
		border-top: 1px solid var(--stone-warm);
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
		color: var(--ink-mid);
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
		color: var(--ink-mid);
	}

	.release-event-form select,
	.release-event-form input {
		width: 100%;
		min-width: 0;
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		padding: 8px;
		font-size: 0.8rem;
	}

	.release-events-list {
		display: grid;
		gap: 8px;
	}

	.release-event-item {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		padding: 9px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 10px;
		align-items: center;
	}

	.release-event-item strong {
		color: var(--ink-bright);
	}

	.release-event-item span,
	.release-event-item small {
		display: block;
		color: var(--ink-mid);
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
		color: var(--success-text);
	}

	.blog-insight-card {
		padding: 12px;
	}

	.blog-insight-summary-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 8px;
		margin-bottom: 10px;
	}

	.blog-insight-summary-grid div,
	.blog-diagnostic-grid section {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
		padding: 10px;
		min-width: 0;
	}

	.blog-insight-summary-grid span,
	.blog-insight-metrics span,
	.blog-diagnostic-grid dt {
		display: block;
		color: var(--ink-mid);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.blog-insight-summary-grid strong,
	.blog-insight-metrics strong {
		display: block;
		margin-top: 4px;
		color: var(--ink-bright);
		font-size: 1rem;
	}

	.blog-insight-note {
		margin: 0 0 10px;
		color: var(--ink-mid);
		font-size: 0.78rem;
	}

	.blog-insight-note code {
		color: var(--ink-bright);
	}

	.blog-insight-layout {
		display: grid;
		grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
		gap: 12px;
		align-items: start;
	}

	.blog-insight-list {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		background: var(--night-deep);
		max-height: 760px;
		overflow: auto;
		padding: 6px;
		display: grid;
		gap: 5px;
	}

	.blog-insight-list button {
		border: 1px solid transparent;
		border-radius: 0.625rem;
		background: transparent;
		color: var(--ink-bright);
		text-align: left;
		padding: 8px;
		cursor: pointer;
		display: grid;
		gap: 3px;
	}

	.blog-insight-list button:hover,
	.blog-insight-list button.active {
		border-color: color-mix(in srgb, var(--lamp-glow) 45%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 12%, transparent);
	}

	.blog-insight-list span {
		font-weight: 700;
		line-height: 1.25;
	}

	.blog-insight-list strong,
	.blog-insight-list small {
		color: var(--ink-mid);
		font-size: 0.74rem;
	}

	.blog-insight-detail {
		min-width: 0;
	}

	.blog-insight-title {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 10px;
	}

	.blog-insight-title h3 {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.25;
	}

	.blog-insight-title a {
		display: inline-block;
		margin-top: 4px;
		color: var(--ink-mid);
		font-size: 0.78rem;
		text-decoration: none;
	}

	.blog-insight-title a:hover {
		color: var(--lamp-light);
		text-decoration: underline;
	}

	.blog-insight-metrics {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 8px;
		margin-bottom: 10px;
	}

	.blog-insight-metrics div {
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		padding: 9px;
		min-width: 0;
	}

	.blog-insight-metrics small,
	.blog-action-table small {
		display: block;
		margin-top: 3px;
		color: var(--ink-mid);
		font-size: 0.7rem;
		line-height: 1.35;
	}

	.blog-diagnostic-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.blog-diagnostic-grid h4 {
		margin: 0 0 8px;
		font-size: 0.9rem;
		color: var(--ink-bright);
	}

	.blog-diagnostic-grid dl {
		margin: 0;
		display: grid;
		gap: 8px;
	}

	.blog-diagnostic-grid dd {
		margin: 2px 0 0;
		color: var(--ink-bright);
		font-size: 0.8rem;
		line-height: 1.35;
		overflow-wrap: break-word;
	}

	.diagnostic-score-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 8px;
	}

	.diagnostic-score-row span {
		border-radius: 999px;
		background: color-mix(in srgb, var(--data-teal) 15%, transparent);
		color: var(--data-cyan);
		padding: 4px 7px;
		font-size: 0.68rem;
		font-weight: 700;
	}

	.diagnostic-note-list {
		margin: 0;
		padding-left: 18px;
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.45;
	}

	.blog-action-table-wrapper {
		margin-top: 12px;
	}

	.blog-action-table {
		min-width: 1080px;
		table-layout: fixed;
	}

	.blog-action-table th:nth-child(1),
	.blog-action-table td:nth-child(1) {
		width: 330px;
	}

	.blog-action-table th:nth-child(7),
	.blog-action-table td:nth-child(7) {
		width: 300px;
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
		color: var(--ink-mid);
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
		border: 1px solid var(--stone-warm);
		background: var(--night-deep);
		color: var(--ink-mid);
		font-size: 0.74rem;
		font-weight: 600;
		border-radius: 999px;
		padding: 5px 9px;
		cursor: pointer;
	}

	.window-tab:hover {
		border-color: var(--stone-warm);
		color: var(--ink-bright);
	}

	.window-tab.active {
		border-color: var(--data-teal);
		background: color-mix(in srgb, var(--secondary) 18%, transparent);
		color: var(--data-cyan);
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
		color: var(--ink-mid);
		font-size: 0.85rem;
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
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
		border-bottom: 1px solid var(--stone-warm);
		text-align: left;
		vertical-align: top;
	}

	.data-table th {
		background: var(--night-deep);
		color: var(--ink-mid);
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
		color: var(--ink-bright);
	}

	.sort-indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 12px;
		font-size: 0.74rem;
		color: var(--lamp-light);
	}

	.table-path-cell {
		display: block;
	}

	.table-page-link,
	.table-page-text {
		display: block;
		color: var(--ink-bright);
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
		color: var(--lamp-light);
		text-decoration: underline;
	}

	.table-trend-button {
		border: 1px solid var(--stone-warm);
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink-dim) 12%, transparent);
		color: var(--ink-mid);
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1;
		padding: 5px 8px;
		white-space: nowrap;
	}

	.table-trend-button:hover {
		border-color: color-mix(in srgb, var(--lamp-glow) 55%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 14%, transparent);
		color: var(--lamp-light);
		text-decoration: none;
	}

	.table-trend-button {
		cursor: pointer;
		margin-top: 6px;
	}

	.table-trend-button.active {
		border-color: color-mix(in srgb, var(--lamp-glow) 70%, transparent);
		background: color-mix(in srgb, var(--lamp-glow) 18%, transparent);
		color: var(--lamp-light);
	}

	.table-path-button {
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.84rem;
		line-height: 1.25;
		cursor: pointer;
		text-align: left;
		max-width: 100%;
		overflow-wrap: break-word;
		word-break: normal;
	}

	.table-path-button:hover {
		color: var(--lamp-light);
		text-decoration: underline;
	}

	.table-path-button.active {
		color: var(--lamp-light);
	}

	.data-table .num {
		text-align: right;
		white-space: nowrap;
	}

	.data-table.release-table .num {
		white-space: normal;
	}

	.data-table.release-table td[data-label='Band'] {
		min-width: 0;
	}

	.data-table.release-table td[data-label='Band'] small {
		white-space: normal;
	}

	.data-table .path {
		max-width: 320px;
		word-break: break-word;
	}

	.data-table tr:hover {
		background: color-mix(in srgb, var(--ink-dim) 10%, transparent);
	}

	.data-table tr.active-row {
		background: color-mix(in srgb, var(--lamp-glow) 14%, transparent);
	}

	.empty {
		text-align: center !important;
		color: var(--ink-mid);
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

		.timing-overview,
		.timing-synthesis-grid,
		.release-summary-grid,
		.timing-top-list,
		.timing-outlier-grid,
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

		.release-range-panel {
			grid-template-columns: 1fr;
		}

		.release-range-actions {
			justify-content: flex-start;
		}

		.release-range-fields {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.release-range-presets {
			grid-column: 1 / -1;
		}

		.release-band-filters {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.blog-insight-summary-grid,
		.blog-insight-metrics {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.blog-insight-layout {
			grid-template-columns: 1fr;
		}

		.blog-insight-list {
			max-height: 320px;
		}
	}

	@media (max-width: 980px) {
		.charts-grid,
		.top-lists-grid,
		.top-trend-layout,
		.trending-layout,
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
		.release-table,
		.blog-action-table {
			min-width: 0;
			table-layout: auto;
		}

		.pageview-table th,
		.pageview-table td,
		.release-table th,
		.release-table td,
		.blog-action-table th,
		.blog-action-table td {
			width: auto;
		}

		.data-table tbody {
			display: grid;
			gap: 0.8rem;
		}

		.data-table tr {
			border: 1px solid var(--stone-warm);
			border-radius: 0.625rem;
			background: color-mix(in srgb, var(--stone-warm) 94%, var(--night-deep));
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
			color: var(--ink-mid);
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
		.timing-synthesis-grid,
		.release-summary-grid,
		.timing-top-list,
		.timing-outlier-grid,
		.timing-rollup-grid,
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

		.blog-insight-summary-grid,
		.blog-insight-metrics,
		.blog-diagnostic-grid {
			grid-template-columns: 1fr;
		}

		.release-header-actions,
		.release-sort-controls,
		.trending-controls {
			width: 100%;
			justify-content: flex-start;
		}

		.release-sort-controls,
		.trending-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.trending-controls label {
			min-width: 0;
		}

		.trending-row {
			grid-template-columns: 1fr;
			grid-template-areas:
				'path'
				'score'
				'meta'
				'source';
		}

		.release-range-fields,
		.release-range-actions {
			grid-template-columns: 1fr;
			width: 100%;
		}

		.release-range-actions,
		.release-range-presets {
			flex-direction: column;
			align-items: stretch;
		}

		.range-preset {
			width: 100%;
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
