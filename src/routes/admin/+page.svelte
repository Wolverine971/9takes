<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import { Button } from '$lib/components/atoms';
	import { notifications } from '$lib/components/molecules/notifications';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import EnneagramBarChart from '$lib/components/charts/EnneagramBarChart.svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import { convertDateToReadable } from '../../utils/conversions';
	import MobileCommandCenter from './MobileCommandCenter.svelte';
	import type { PageData } from './$types';

	type ActionResultPayload = {
		success?: boolean;
		message?: string;
	};

	type ReindexActionPayload = {
		success: boolean;
		message?: string;
		details?: {
			questions: { indexed: number; failed: number; total: number };
			blogs: { indexed: number; failed: number; total: number };
		};
		indexed: number;
		failed: number;
		total: number;
	};

	type MetricCard = {
		icon: string;
		label: string;
		value: number | string;
		subValue?: string;
		trend?: 'up' | 'down' | 'neutral' | null;
		trendValue?: string;
		color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
		sparklineData?: number[];
		href?: string;
	};

	type QuestionActivityItem = {
		question: string;
		createdAt: string;
		todayComments: number;
		totalComments: number;
		authorEmail: string;
		authorHref?: string;
		questionHref?: string;
	};

	type TrendingTrafficSource = {
		key: string;
		count: number;
	};

	type TrendingPageRow = {
		path: string;
		content_type: string;
		current_visits: number;
		current_unique_visitors: number;
		baseline_avg_visits: number;
		lift_visits: number;
		ratio_visits: number | null;
		trend_score: number;
		confidence: string;
		top_sources: TrendingTrafficSource[];
		avg_time_on_page_ms: number;
		bounce_rate: number;
		is_low_unique: boolean;
	};

	type VisitorDay = NonNullable<PageData['dailyVisitors']>[number];
	type CommentDay = NonNullable<PageData['dailyComments']>[number];
	type QuestionDay = NonNullable<PageData['dailyQuestions']>[number];
	type ChartPoint = {
		x: number;
		y: number;
		label: string;
	};

	let { data }: { data: PageData } = $props();

	let isDemoTime = $state(false);
	let isReindexing = $state(false);

	$effect(() => {
		isDemoTime = data.demoTime === true;
	});

	const readActionPayload = async <T,>(response: Response): Promise<T | null> => {
		const result = await response.json().catch(() => null);

		if (!result || result.data == null) {
			return null;
		}

		if (typeof result.data === 'string') {
			try {
				return JSON.parse(result.data) as T;
			} catch {
				return null;
			}
		}

		return result.data as T;
	};

	const formatCount = (value: number | null | undefined) => (value ?? 0).toLocaleString();
	const formatDate = (value: string | null | undefined) =>
		value ? convertDateToReadable(value) : '—';
	const formatPercent = (value: number | null | undefined, denominator?: number | null) => {
		if (denominator !== undefined && (denominator ?? 0) <= 0) return '—';
		return `${(value ?? 0).toFixed(1)}%`;
	};
	const formatRateValue = (
		block:
			| {
					numerator?: number | null;
					pct?: number | null;
					denominator?: number | null;
			  }
			| null
			| undefined
	) => `${formatCount(block?.numerator)} (${formatPercent(block?.pct, block?.denominator)})`;
	const formatRateWindow = (
		block:
			| {
					week_start?: string | null;
					week_end?: string | null;
			  }
			| null
			| undefined
	) =>
		block?.week_start && block?.week_end
			? `${convertDateToReadable(block.week_start)} - ${convertDateToReadable(block.week_end)}`
			: 'Retention rollup pending';
	const formatTrendLift = (value: number) => {
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value.toFixed(value % 1 === 0 ? 0 : 1)}`;
	};
	const formatTrendBaseline = (value: number) =>
		value.toFixed(value >= 10 || value % 1 === 0 ? 0 : 1);
	const formatTrendRatio = (value: number | null) =>
		value === null || !Number.isFinite(value) ? 'New' : `${value.toFixed(1)}x`;
	const formatTrendSource = (row: TrendingPageRow) => row.top_sources[0]?.key ?? 'unknown';
	const formatShortDuration = (value: number) => {
		if (!value) return '0s';
		const seconds = Math.round(value / 1000);
		if (seconds < 60) return `${seconds}s`;
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	};

	const changeDemoTime = async () => {
		try {
			const response = await fetch('?/toggleDemo', {
				method: 'POST',
				body: new FormData()
			});
			const payload = await readActionPayload<ActionResultPayload>(response);

			if (!response.ok || payload?.success === false) {
				throw new Error(payload?.message || 'Failed to update demo mode');
			}

			const nextState = !isDemoTime;
			isDemoTime = nextState;
			notifications.success(nextState ? 'Demo mode enabled.' : 'Live data restored.', 3000);
		} catch (error) {
			console.error('Failed to toggle demo mode:', error);
			notifications.danger('Failed to update demo mode. Check server logs for details.', 5000);
		}
	};

	const reindexEverything = async () => {
		isReindexing = true;

		try {
			const response = await fetch('?/reindexEverything', {
				method: 'POST',
				body: new FormData()
			});
			const payload = await readActionPayload<ReindexActionPayload>(response);

			if (!response.ok || !payload) {
				notifications.danger(
					payload?.message || 'Failed to reindex. Check server logs for details.',
					5000
				);
				return;
			}

			if (payload.success) {
				notifications.success(
					payload.message || `Successfully reindexed ${payload.indexed} documents.`,
					5000
				);
				return;
			}

			if (payload.failed > 0) {
				let errorMessage =
					payload.message ||
					`Reindexing completed with errors: ${payload.indexed} succeeded, ${payload.failed} failed out of ${payload.total} total.`;

				if (payload.details) {
					errorMessage += `\n\nQuestions: ${payload.details.questions.indexed}/${payload.details.questions.total} indexed`;
					errorMessage += `\nBlogs: ${payload.details.blogs.indexed}/${payload.details.blogs.total} indexed`;
				}

				notifications.warning(errorMessage, 10000);
				return;
			}

			notifications.success(payload.message || 'Reindexing completed.', 3000);
		} catch (error) {
			console.error('Reindexing error:', error);
			notifications.danger(
				'Failed to reindex content. Please check Elasticsearch connectivity.',
				5000
			);
		} finally {
			isReindexing = false;
			getModal('confirmReindex').close();
		}
	};

	let visitorChartData = $derived(
		(data.dailyVisitors ?? [])
			.map((visitor: VisitorDay): ChartPoint => {
				const date = new Date(visitor.days);
				return {
					x: date.getTime(),
					y: visitor.number_of_visitors,
					label: `${date.toLocaleDateString()}: ${visitor.number_of_visitors} visitors`
				};
			})
			.sort((a: ChartPoint, b: ChartPoint) => a.x - b.x)
	);

	let commentChartData = $derived(
		(data.dailyComments ?? [])
			.map((comment: CommentDay): ChartPoint => {
				const date = new Date(comment.days);
				return {
					x: date.getTime(),
					y: comment.number_of_comments,
					label: `${date.toLocaleDateString()}: ${comment.number_of_comments} comments`
				};
			})
			.sort((a: ChartPoint, b: ChartPoint) => a.x - b.x)
	);

	let totalVisitors = $derived(
		visitorChartData.reduce((sum: number, point: ChartPoint) => sum + point.y, 0)
	);
	let visitorSparkline = $derived(visitorChartData.slice(-7).map((point: ChartPoint) => point.y));
	let commentSparkline = $derived(commentChartData.slice(-7).map((point: ChartPoint) => point.y));
	let userGrowth = $derived(
		data.totalUsers > 0 ? ((data.newUsersMonth / data.totalUsers) * 100).toFixed(1) : '0.0'
	);

	let metricCards = $derived.by((): MetricCard[] => [
		{
			icon: '👥',
			label: 'Total Users',
			value: data.totalUsers,
			subValue: `+${formatCount(data.newUsersToday)} today`,
			color: 'primary',
			href: '/admin/users'
		},
		{
			icon: '👀',
			label: 'Visitors (30d)',
			value: totalVisitors,
			subValue: 'Traffic over the last month',
			color: 'default',
			sparklineData: visitorSparkline,
			href: '/admin/analytics'
		},
		{
			icon: '🆕',
			label: 'New Visitors (WTD)',
			value: data.retentionSummary?.newVisitorsThisWeek ?? 0,
			subValue: data.retentionSummary?.available
				? `${formatDate(data.retentionSummary?.currentWeekStart)} - ${formatDate(data.retentionSummary?.currentWeekEnd)}`
				: 'Retention rollup pending',
			color: 'primary',
			href: '/admin/analytics'
		},
		{
			icon: '💬',
			label: 'First Comment (7d)',
			value: formatRateValue(data.retentionSummary?.firstCommentRateLastFullWeek),
			subValue: formatRateWindow(data.retentionSummary?.firstCommentRateLastFullWeek),
			color: 'success',
			href: '/admin/analytics'
		},
		{
			icon: '✉️',
			label: 'Email Signup (7d)',
			value: formatRateValue(data.retentionSummary?.emailSignupRateLastFullWeek),
			subValue: formatRateWindow(data.retentionSummary?.emailSignupRateLastFullWeek),
			color: 'default',
			href: '/admin/analytics'
		},
		{
			icon: '📧',
			label: 'New Email Signups',
			value: data.newEmailSignupsWeek,
			subValue: `${formatCount(data.newEmailSignupsToday)} today | ${formatCount(data.totalEmailSignups)} total`,
			color: data.newEmailSignupsToday > 0 ? 'warning' : 'default',
			href: '/admin/users'
		},
		{
			icon: '🪪',
			label: 'Registered (7d)',
			value: formatRateValue(data.retentionSummary?.registeredRateLastFullWeek),
			subValue: formatRateWindow(data.retentionSummary?.registeredRateLastFullWeek),
			color: 'primary',
			href: '/admin/analytics'
		},
		{
			icon: '🔁',
			label: 'D7 Retention',
			value: formatRateValue(data.retentionSummary?.d7RetentionLastMatureWeek),
			subValue: formatRateWindow(data.retentionSummary?.d7RetentionLastMatureWeek),
			color: 'warning',
			href: '/admin/analytics'
		},
		{
			icon: '⚡',
			label: 'Active Contributors',
			value: data.retentionSummary?.activeContributorsThisWeek ?? data.activeContributors ?? 0,
			subValue: 'This week, signed-in + anonymous',
			color: 'default',
			href: '/admin/comments'
		},
		{
			icon: '🎯',
			label: 'Coaching Waitlist',
			value: data.coachingWaitlist,
			subValue: 'Current inbound demand',
			color: 'success',
			href: '/admin/consulting'
		},
		{
			icon: '📈',
			label: 'New Users (30d)',
			value: data.newUsersMonth,
			subValue: `${userGrowth}% of total`,
			trend: Number(userGrowth) > 5 ? 'up' : 'neutral',
			trendValue: `${userGrowth}%`,
			color: 'primary',
			href: '/admin/users'
		},
		{
			icon: '📣',
			label: 'Comments',
			value: data.totalComments,
			subValue: `+${formatCount(data.commentsToday)} today`,
			color: 'success',
			sparklineData: commentSparkline,
			href: '/admin/comments'
		}
	]);

	let waitlistEntries = $derived((data.coachingWaitlistUsers ?? []).slice(0, 6));
	let recentUsers = $derived((data.recentSignups ?? []).slice(0, 8));
	let recentEmailSignups = $derived((data.recentEmailSignups ?? []).slice(0, 8));
	let questionActivity = $derived(
		(data.dailyQuestions ?? []).slice(0, 10).map((question: QuestionDay): QuestionActivityItem => ({
			question: question.question || 'Untitled question',
			createdAt: formatDate(question.created_at),
			todayComments: question.number_of_comments_today ?? 0,
			totalComments: question.number_of_comments ?? 0,
			authorEmail: question.user_email || 'Unknown author',
			authorHref: question.user_external_id ? `/users/${question.user_external_id}` : undefined,
			questionHref: question.url ? `/questions/${question.url}` : undefined
		}))
	);
	let trendingBroadRows = $derived(
		((data.trending?.broadRows ?? []) as TrendingPageRow[]).slice(0, 5)
	);
	let trendingRepeatRows = $derived(
		((data.trending?.repeatRows ?? []) as TrendingPageRow[]).slice(0, 4)
	);
	let trendingAvailable = $derived(data.trending?.available === true);

	const formatEmailSignupSource = (signup: NonNullable<PageData['recentEmailSignups']>[number]) => {
		const source = signup.first_acquisition_source || 'unknown';
		return signup.first_landing_path ? `${source} | ${signup.first_landing_path}` : source;
	};
</script>

<div class="mobile-command-shell">
	<MobileCommandCenter
		{data}
		{isDemoTime}
		{isReindexing}
		onToggleDemo={changeDemoTime}
		onOpenReindex={() => getModal('confirmReindex').open()}
	/>
</div>

<div class="admin-dashboard desktop-dashboard">
	<section class="dashboard-hero">
		<div class="hero-bar">
			<div class="hero-copy">
				<h1 class="page-title">Control center</h1>
				<span class="hero-mode" data-tone={isDemoTime ? 'warning' : 'success'}>
					{isDemoTime ? 'Demo data' : 'Live data'}
				</span>
			</div>

			<div class="hero-actions">
				<button type="button" class="action-btn" class:active={isDemoTime} onclick={changeDemoTime}>
					<span class="action-icon" aria-hidden="true">🎭</span>
					<span class="action-label">Demo mode</span>
					<span class="action-state">{isDemoTime ? 'On' : 'Off'}</span>
				</button>

				<button
					type="button"
					class="action-btn"
					onclick={() => getModal('confirmReindex').open()}
					disabled={isReindexing}
				>
					<span class="action-icon" aria-hidden="true">🔄</span>
					<span class="action-label">Reindex search</span>
					<span class="action-state">{isReindexing ? 'Running' : 'Ready'}</span>
				</button>
			</div>
		</div>
	</section>

	{#if data.dataStatus?.state === 'degraded'}
		<section class="data-status" role="status" aria-live="polite">
			<div>
				<strong>Some dashboard data could not be refreshed.</strong>
				<p>
					Unavailable: {data.dataStatus.warnings.map((warning) => warning.label).join(', ')}. Empty
					values in those areas may not mean zero activity.
				</p>
			</div>
			<div class="data-status-meta">
				<span>Checked {new Date(data.dataStatus.generatedAt).toLocaleTimeString()}</span>
				<a href="/admin">Retry</a>
			</div>
		</section>
	{/if}

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Overview</span>
				<h2 class="section-title">Core metrics</h2>
				<p class="section-description">The numbers you are most likely to check every day.</p>
			</div>
			<a href="/admin/analytics" class="section-link">Open analytics</a>
		</div>

		<div class="metrics-grid">
			{#each metricCards as metric}
				<StatCard
					icon={metric.icon}
					label={metric.label}
					value={metric.value}
					subValue={metric.subValue ?? ''}
					trend={metric.trend ?? null}
					trendValue={metric.trendValue ?? ''}
					color={metric.color ?? 'default'}
					sparklineData={metric.sparklineData ?? []}
					href={metric.href ?? ''}
				/>
			{/each}
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Trending</span>
				<h2 class="section-title">Pages moving today</h2>
				<p class="section-description">
					Same-time comparison against each page's previous {data.trending?.baselineDays ?? 7}-day
					baseline.
				</p>
			</div>
			<a href="/admin/analytics" class="section-link">Open analytics</a>
		</div>

		<div class="trending-grid">
			<article class="panel trending-panel">
				<div class="trending-panel-header">
					<div class="section-copy">
						<span class="eyebrow">Broad spikes</span>
						<h3 class="card-title">Real momentum</h3>
					</div>
					<span class="count-pill">{formatCount(trendingBroadRows.length)}</span>
				</div>

				{#if !trendingAvailable}
					<p class="empty-state">Trending analytics are waiting for the database migration.</p>
				{:else if trendingBroadRows.length === 0}
					<p class="empty-state">No broad page spikes right now.</p>
				{:else}
					<ul class="trend-list">
						{#each trendingBroadRows as row}
							<li class="trend-item">
								<div class="trend-main">
									<a href={row.path} class="trend-path">{row.path}</a>
									<p class="trend-subtitle">
										{row.current_unique_visitors.toLocaleString()} uniques |
										{formatTrendSource(row)} |
										{formatShortDuration(row.avg_time_on_page_ms)} avg
									</p>
								</div>
								<div class="trend-side">
									<strong>{row.current_visits.toLocaleString()}</strong>
									<span>
										{formatTrendLift(row.lift_visits)} vs
										{formatTrendBaseline(row.baseline_avg_visits)}
									</span>
									<small>{formatTrendRatio(row.ratio_visits)}</small>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</article>

			<article class="panel trending-panel">
				<div class="trending-panel-header">
					<div class="section-copy">
						<span class="eyebrow">Watchlist</span>
						<h3 class="card-title">Repeat-heavy spikes</h3>
					</div>
					<span class="count-pill muted">{formatCount(trendingRepeatRows.length)}</span>
				</div>

				{#if !trendingAvailable}
					<p class="empty-state">Trending analytics are waiting for the database migration.</p>
				{:else if trendingRepeatRows.length === 0}
					<p class="empty-state">No concentrated repeat spikes right now.</p>
				{:else}
					<ul class="trend-list">
						{#each trendingRepeatRows as row}
							<li class="trend-item repeat">
								<div class="trend-main">
									<a href={row.path} class="trend-path">{row.path}</a>
									<p class="trend-subtitle">
										{row.current_unique_visitors.toLocaleString()} uniques |
										{formatTrendSource(row)} |
										{formatTrendRatio(row.ratio_visits)}
									</p>
								</div>
								<div class="trend-side">
									<strong>{row.current_visits.toLocaleString()}</strong>
									<span>
										{formatTrendLift(row.lift_visits)} vs
										{formatTrendBaseline(row.baseline_avg_visits)}
									</span>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</article>
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Trends</span>
				<h2 class="section-title">Traffic and participation</h2>
				<p class="section-description">
					Thirty-day patterns for visitors, comments, and user types.
				</p>
			</div>
		</div>

		<div class="insights-grid">
			<div class="panel chart-panel">
				<LineChart
					data={visitorChartData}
					title="Visitors"
					height={380}
					color="var(--data-teal)"
					showPoints={true}
					showGrid={true}
					showSummary={true}
					showTrend={true}
				/>
			</div>

			<div class="panel chart-panel">
				<LineChart
					data={commentChartData}
					title="Comments"
					height={380}
					color="var(--success)"
					showPoints={true}
					showGrid={true}
					showSummary={true}
					showTrend={true}
				/>
			</div>

			<div class="panel distribution-panel">
				<EnneagramBarChart
					distribution={data.enneagramDistribution}
					title="User Type Distribution"
					showPercentages={true}
					compact={false}
				/>
			</div>
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Queues</span>
				<h2 class="section-title">Recent inbound activity</h2>
				<p class="section-description">The latest signups and coaching demand in one place.</p>
			</div>
		</div>

		<div class="queue-grid">
			<article class="panel list-card">
				<div class="list-card-header">
					<div class="section-copy">
						<span class="eyebrow">Consulting</span>
						<h3 class="card-title">Coaching waitlist</h3>
					</div>
					<div class="list-card-meta">
						<span class="count-pill">{formatCount(data.coachingWaitlist)}</span>
						<a href="/admin/consulting" class="inline-link">Open consulting</a>
					</div>
				</div>

				{#if waitlistEntries.length > 0}
					<ul class="detail-list">
						{#each waitlistEntries as user}
							<li class="detail-item">
								<div class="detail-main">
									<a href={`mailto:${user.email}`} class="detail-link">{user.email}</a>
									<p class="detail-subtitle">
										{user.session_goal || 'No session goal provided yet.'}
									</p>
								</div>
								<div class="detail-side">
									<span class="detail-date">{formatDate(user.created_at)}</span>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No coaching waitlist entries yet.</p>
				{/if}
			</article>

			<article class="panel list-card">
				<div class="list-card-header">
					<div class="section-copy">
						<span class="eyebrow">Users</span>
						<h3 class="card-title">Recent registered users</h3>
					</div>
					<div class="list-card-meta">
						<span class="count-pill">{formatCount(data.newUsersMonth)}</span>
						<a href="/admin/users" class="inline-link">Open users</a>
					</div>
				</div>

				{#if recentUsers.length > 0}
					<ul class="detail-list">
						{#each recentUsers as signup}
							<li class="detail-item">
								<div class="detail-main">
									{#if signup.external_id}
										<a href={`/users/${signup.external_id}`} class="detail-link">
											{signup.email || 'Anonymous'}
										</a>
									{:else}
										<span class="detail-text">{signup.email || 'Anonymous'}</span>
									{/if}
									<p class="detail-subtitle">Joined {formatDate(signup.created_at)}</p>
								</div>
								<div class="detail-side">
									{#if signup.enneagram}
										<span class="type-badge type-{signup.enneagram}">{signup.enneagram}</span>
									{:else}
										<span class="type-badge pending">?</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No recent registered users available.</p>
				{/if}
			</article>

			<article class="panel list-card">
				<div class="list-card-header">
					<div class="section-copy">
						<span class="eyebrow">Email</span>
						<h3 class="card-title">Recent email signups</h3>
					</div>
					<div class="list-card-meta">
						<span class="count-pill">{formatCount(data.newEmailSignupsWeek)}</span>
						<a href="/admin/users" class="inline-link">Open users</a>
					</div>
				</div>

				{#if recentEmailSignups.length > 0}
					<ul class="detail-list">
						{#each recentEmailSignups as signup}
							<li class="detail-item">
								<div class="detail-main">
									<a href={`mailto:${signup.email}`} class="detail-link">
										{signup.email || 'Unknown email'}
									</a>
									<p class="detail-subtitle">{formatEmailSignupSource(signup)}</p>
								</div>
								<div class="detail-side">
									<span class="detail-date">{formatDate(signup.created_at)}</span>
									{#if signup.unsubscribed_date}
										<span class="meta-pill warning">Suppressed</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No recent email signups available.</p>
				{/if}
			</article>
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Questions</span>
				<h2 class="section-title">Question activity snapshot</h2>
				<p class="section-description">
					A readable view of which questions are drawing attention right now.
				</p>
			</div>
			<a href="/admin/questions" class="section-link">Open question admin</a>
		</div>

		<div class="panel question-feed">
			{#if questionActivity.length > 0}
				<ul class="question-list">
					{#each questionActivity as question}
						<li class="question-item">
							<div class="question-meta">
								<span class="meta-pill success">{question.todayComments} today</span>
								<span class="meta-pill neutral">{question.totalComments} total</span>
								<span class="meta-text">{question.createdAt}</span>
							</div>

							<h3 class="question-title">{question.question}</h3>

							<div class="question-footer">
								{#if question.authorHref}
									<a href={question.authorHref} class="detail-link">{question.authorEmail}</a>
								{:else}
									<span class="detail-text">{question.authorEmail}</span>
								{/if}

								{#if question.questionHref}
									<a href={question.questionHref} class="inline-link">Open question</a>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty-state">No daily question activity is available right now.</p>
			{/if}
		</div>
	</section>
</div>

<Modal id="confirmReindex" name="Reindex Elasticsearch">
	<div class="modal-content">
		<div class="modal-icon">🔄</div>
		<h2 class="modal-title">Reindex Elasticsearch</h2>
		<p class="modal-text">
			This rebuilds the Elasticsearch indices for all questions and published blog posts.
		</p>

		<div class="modal-details">
			<p>The job will:</p>
			<ul>
				<li>Delete the current question and blog indices</li>
				<li>Recreate them with the current mappings</li>
				<li>Re-import all questions and published blog posts</li>
			</ul>
		</div>

		<p class="modal-warning">
			<strong>Warning:</strong> This can take several minutes to finish.
		</p>

		<div class="modal-actions">
			<Button
				variant="secondary"
				onclick={() => getModal('confirmReindex').close()}
				disabled={isReindexing}
			>
				Cancel
			</Button>
			<Button onclick={reindexEverything} loading={isReindexing}>
				{isReindexing ? 'Reindexing...' : 'Start reindex'}
			</Button>
		</div>
	</div>
</Modal>

<style>
	.mobile-command-shell {
		display: none;
	}

	.admin-dashboard {
		display: flex;
		flex-direction: column;
		gap: 32px;
		width: 100%;
		max-width: 100%;
		min-width: 0;
	}

	.dashboard-section,
	.dashboard-hero,
	.data-status,
	.metrics-grid,
	.insights-grid,
	.queue-grid {
		min-width: 0;
	}

	.data-status {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 16px;
		border: 1px solid color-mix(in srgb, var(--warning) 45%, transparent);
		border-radius: 10px;
		background: color-mix(in srgb, var(--warning) 9%, var(--night));
		color: var(--ink-bright);
	}

	.data-status p {
		margin: 4px 0 0;
		color: var(--ink-mid);
	}

	.data-status-meta {
		display: flex;
		align-items: center;
		gap: 12px;
		white-space: nowrap;
		font-size: 0.82rem;
		color: var(--ink-mid);
	}

	.data-status-meta a {
		color: var(--accent);
		font-weight: 700;
	}

	.panel {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--stone-warm) 94%, white 6%),
			var(--stone-warm)
		);
		border: 1px solid var(--stone-warm);
		border-radius: 16px;
		box-shadow: var(--shadow-md);
		min-width: 0;
	}

	.hero-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 18px;
		border-radius: 1rem;
		border: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--stone-warm) 94%, transparent);
	}

	.hero-copy {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}

	.hero-mode {
		display: inline-flex;
		align-items: center;
		padding: 4px 10px;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		border: 1px solid color-mix(in srgb, var(--stone-warm) 86%, transparent);
		background: color-mix(in srgb, var(--night-deep) 90%, transparent);
		color: var(--ink-mid);
	}

	.hero-mode[data-tone='success'] {
		border-color: color-mix(in srgb, var(--success) 40%, transparent);
		color: var(--success-text);
	}

	.hero-mode[data-tone='warning'] {
		border-color: color-mix(in srgb, var(--warning) 45%, transparent);
		color: var(--warning);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.section-copy {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.eyebrow {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-mid);
	}

	.page-title,
	.section-title,
	.card-title {
		margin: 0;
		color: var(--ink-bright);
	}

	.page-title {
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: 700;
		line-height: 1.1;
	}

	.section-description {
		margin: 0;
		color: var(--ink-mid);
		line-height: 1.55;
	}

	.section-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
	}

	.section-header.compact {
		align-items: flex-start;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 700;
	}

	.section-link,
	.inline-link,
	.detail-link {
		color: var(--lamp-glow);
		text-decoration: none;
		font-weight: 600;
		transition:
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.section-link:hover,
	.inline-link:hover,
	.detail-link:hover {
		color: var(--lamp-glow);
	}

	.dashboard-section {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border-radius: 10px;
		border: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--night-deep) 88%, var(--stone-warm));
		color: var(--ink-bright);
		font-size: 0.88rem;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}

	.action-btn:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-warm));
	}

	.action-btn.active {
		border-color: color-mix(in srgb, var(--success) 55%, var(--stone-warm));
	}

	.action-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.action-icon {
		font-size: 1rem;
		line-height: 1;
	}

	.action-label {
		font-weight: 600;
		color: var(--ink-bright);
	}

	.action-state {
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: color-mix(in srgb, var(--stone-warm) 85%, transparent);
		color: var(--ink-mid);
	}

	.action-btn.active .action-state {
		background: color-mix(in srgb, var(--success) 16%, transparent);
		color: var(--success-text);
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
		gap: 16px;
	}

	.metrics-grid :global(.stat-card) {
		height: 100%;
		min-height: 138px;
		padding: 18px 20px;
		border-radius: 16px;
	}

	.metrics-grid :global(.stat-value) {
		font-size: 1.75rem;
	}

	.insights-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
	}

	.chart-panel,
	.distribution-panel {
		overflow: hidden;
	}

	.chart-panel {
		padding: 12px;
	}

	.distribution-panel :global(.enneagram-chart) {
		background: transparent;
		padding: 18px;
	}

	.queue-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
	}

	.trending-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
		gap: 20px;
		min-width: 0;
	}

	.trending-panel {
		overflow: hidden;
	}

	.trending-panel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 20px 22px 16px;
		border-bottom: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--night-deep) 82%, var(--stone-warm));
	}

	.count-pill.muted {
		background: color-mix(in srgb, var(--warning) 14%, transparent);
		color: var(--warning);
	}

	.trend-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.trend-item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 14px;
		align-items: center;
		padding: 14px 22px;
		border-top: 1px solid var(--stone-warm);
	}

	.trend-item:first-child {
		border-top: none;
	}

	.trend-item:hover {
		background: color-mix(in srgb, var(--night-deep) 84%, var(--stone-warm));
	}

	.trend-item.repeat {
		border-left: 2px solid color-mix(in srgb, var(--warning) 60%, transparent);
	}

	.trend-main,
	.trend-side {
		min-width: 0;
	}

	.trend-main {
		display: grid;
		gap: 5px;
	}

	.trend-path {
		color: var(--ink-bright);
		text-decoration: none;
		font-weight: 700;
		font-size: 0.9rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.trend-path:hover {
		color: var(--lamp-glow);
	}

	.trend-subtitle {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.76rem;
		line-height: 1.45;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.trend-side {
		display: grid;
		gap: 3px;
		justify-items: end;
		text-align: right;
	}

	.trend-side strong {
		color: var(--ink-bright);
		font-size: 1rem;
		line-height: 1;
	}

	.trend-side span,
	.trend-side small {
		color: var(--ink-mid);
		font-size: 0.72rem;
		white-space: nowrap;
	}

	.list-card,
	.question-feed {
		overflow: hidden;
	}

	.list-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 24px 24px 18px;
		border-bottom: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--night-deep) 82%, var(--stone-warm));
	}

	.list-card-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.card-title {
		font-size: 1rem;
		font-weight: 700;
	}

	.count-pill,
	.meta-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 10px;
		border-radius: 999px;
		font-size: 0.76rem;
		font-weight: 700;
		line-height: 1;
	}

	.count-pill {
		background: color-mix(in srgb, var(--lamp-glow) 16%, transparent);
		color: var(--lamp-glow);
	}

	.detail-list,
	.question-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.detail-item,
	.question-item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 24px;
		border-top: 1px solid var(--stone-warm);
	}

	.detail-item:first-child,
	.question-item:first-child {
		border-top: none;
	}

	.detail-item:hover,
	.question-item:hover {
		background: color-mix(in srgb, var(--night-deep) 84%, var(--stone-warm));
	}

	.detail-main,
	.detail-side {
		min-width: 0;
	}

	.detail-main {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.detail-side {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		flex-shrink: 0;
	}

	.detail-link,
	.detail-text {
		font-size: 0.94rem;
		line-height: 1.35;
	}

	.detail-text {
		color: var(--ink-bright);
		font-weight: 600;
	}

	.detail-subtitle {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.detail-date,
	.meta-text {
		font-size: 0.76rem;
		color: var(--ink-mid);
		white-space: nowrap;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 0.625rem;
		font-size: 0.78rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.24);
	}

	.type-badge.pending {
		background: var(--stone-warm);
		color: var(--ink-mid);
	}

	.type-badge.type-1 {
		background: var(--type-1-color);
	}

	.type-badge.type-2 {
		background: var(--type-2-color);
	}

	.type-badge.type-3 {
		background: var(--type-3-color);
	}

	.type-badge.type-4 {
		background: var(--type-4-color);
	}

	.type-badge.type-5 {
		background: var(--type-5-color);
	}

	.type-badge.type-6 {
		background: var(--type-6-color);
	}

	.type-badge.type-7 {
		background: var(--type-7-color);
	}

	.type-badge.type-8 {
		background: var(--type-8-color);
	}

	.type-badge.type-9 {
		background: var(--type-9-color);
	}

	.question-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 12px;
	}

	.meta-pill.success {
		background: color-mix(in srgb, var(--success) 16%, transparent);
		color: var(--success-text);
	}

	.meta-pill.neutral {
		background: color-mix(in srgb, var(--stone-warm) 90%, transparent);
		color: var(--ink-mid);
	}

	.meta-pill.warning {
		background: color-mix(in srgb, var(--warning) 14%, transparent);
		color: var(--warning);
	}

	.question-feed {
		padding: 0;
	}

	.question-item {
		flex-direction: column;
	}

	.question-title {
		margin: 0;
		font-size: 1rem;
		line-height: 1.45;
		color: var(--ink-bright);
	}

	.question-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 14px;
	}

	.empty-state {
		margin: 0;
		padding: 28px 24px;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.modal-content {
		max-width: 480px;
	}

	.modal-icon {
		font-size: 2.5rem;
		text-align: center;
		margin-bottom: 16px;
	}

	.modal-title {
		margin: 0 0 16px;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--ink-bright);
		text-align: center;
	}

	.modal-text {
		margin: 0 0 16px;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.55;
		text-align: center;
	}

	.modal-details {
		margin: 0 0 16px;
		padding: 16px;
		background: var(--stone-warm);
		border-radius: 1rem;
		border: 1px solid var(--stone-warm);
	}

	.modal-details p {
		margin: 0 0 10px;
		font-weight: 600;
		color: var(--ink-bright);
	}

	.modal-details ul {
		margin: 0;
		padding-left: 20px;
		color: var(--ink-mid);
		font-size: 0.84rem;
		line-height: 1.55;
	}

	.modal-warning {
		margin: 0 0 20px;
		padding: 14px;
		background: var(--warning-light);
		border: 1px solid var(--warning);
		border-radius: 1rem;
		color: var(--warning);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.modal-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	@media (max-width: 1200px) {
		.queue-grid,
		.insights-grid,
		.trending-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.mobile-command-shell {
			display: block;
		}

		.desktop-dashboard {
			display: none;
		}

		.admin-dashboard {
			gap: 20px;
		}

		.data-status {
			flex-direction: column;
		}

		.data-status-meta {
			width: 100%;
			justify-content: space-between;
		}

		.hero-bar {
			flex-direction: column;
			align-items: flex-start;
			padding: 12px 14px;
		}

		.section-header,
		.list-card-header,
		.trending-panel-header,
		.question-footer {
			flex-direction: column;
			align-items: flex-start;
		}

		.section-link,
		.inline-link {
			font-size: 0.85rem;
		}

		.metrics-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.metrics-grid :global(.stat-card) {
			min-height: 0;
			padding: 16px;
			border-radius: 1rem;
		}

		.metrics-grid :global(.stat-value) {
			font-size: 1.4rem;
		}

		.metrics-grid :global(.sparkline-container) {
			display: none;
		}

		.detail-item {
			flex-direction: column;
		}

		.trend-item {
			grid-template-columns: 1fr;
			gap: 9px;
			padding: 15px 18px;
		}

		/* Full, readable paths — no truncation on mobile */
		.trend-path,
		.trend-subtitle {
			white-space: normal;
			overflow: visible;
			text-overflow: clip;
		}

		.trend-path {
			overflow-wrap: anywhere;
			word-break: break-word;
			font-size: 0.95rem;
			line-height: 1.3;
		}

		.trend-subtitle {
			line-height: 1.4;
		}

		/* Side metrics collapse into a single inline row, divided from the path */
		.trend-side {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			gap: 4px 12px;
			margin-top: 2px;
			padding-top: 10px;
			border-top: 1px dashed color-mix(in srgb, var(--stone-mid) 80%, transparent);
		}

		.trend-side strong {
			font-size: 1.25rem;
		}

		.trend-side strong::after {
			content: ' visits';
			margin-left: 2px;
			font-size: 0.7rem;
			font-weight: 500;
			color: var(--ink-mid);
		}

		.trend-side span {
			font-size: 0.78rem;
		}

		.trend-side small {
			margin-left: auto;
			padding: 2px 9px;
			border-radius: 999px;
			font-weight: 700;
			background: color-mix(in srgb, var(--lamp-glow) 16%, transparent);
			color: var(--lamp-glow);
		}

		.detail-side,
		.list-card-meta {
			align-items: flex-start;
			justify-items: start;
			text-align: left;
		}

		.modal-actions {
			flex-direction: column-reverse;
		}
	}

	@media (max-width: 520px) {
		.page-title {
			font-size: 1.15rem;
		}

		.question-item,
		.detail-item {
			padding-left: 14px;
			padding-right: 14px;
		}

		.list-card-header {
			padding: 16px 14px 14px;
		}

		.empty-state {
			padding: 20px 14px;
		}
	}
</style>
