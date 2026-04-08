<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import EnneagramBarChart from '$lib/components/charts/EnneagramBarChart.svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import { convertDateToReadable } from '../../utils/conversions';
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

	type HighlightCard = {
		label: string;
		value: string;
		note: string;
		tone: 'neutral' | 'primary' | 'success' | 'warning';
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
		isDemoTime = data.demoTime ?? false;
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
	) =>
		`${formatCount(block?.numerator)} (${formatPercent(block?.pct, block?.denominator)})`;
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

	let highlightCards = $derived.by((): HighlightCard[] => [
		{
			label: 'Mode',
			value: isDemoTime ? 'Demo data' : 'Live data',
			note: isDemoTime
				? 'Sandbox values are enabled for safe review.'
				: 'Production-backed counts are active.',
			tone: isDemoTime ? 'warning' : 'success'
		},
		{
			label: 'Visitors (30d)',
			value: formatCount(totalVisitors),
			note: 'Rolling total across the last 30 days.',
			tone: 'primary'
		},
		{
			label: 'Community today',
			value: `${formatCount(data.commentsToday)} comments`,
			note: `${formatCount(data.questionsToday)} new questions so far.`,
			tone: 'neutral'
		},
		{
			label: 'User growth',
			value: `+${formatCount(data.newUsersMonth)} this month`,
			note: `${userGrowth}% of total accounts added in the last 30 days.`,
			tone: 'primary'
		}
	]);

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
			value:
				data.retentionSummary?.activeContributorsThisWeek ?? data.activeContributors ?? 0,
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
	let recentSignups = $derived((data.recentSignups ?? []).slice(0, 8));
	let questionActivity = $derived(
		(data.dailyQuestions ?? []).slice(0, 10).map(
			(question: QuestionDay): QuestionActivityItem => ({
				question: question.question || 'Untitled question',
				createdAt: formatDate(question.created_at),
				todayComments: question.number_of_comments_today ?? 0,
				totalComments: question.number_of_comments ?? 0,
				authorEmail: question.user_email || 'Unknown author',
				authorHref: question.user_external_id ? `/users/${question.user_external_id}` : undefined,
				questionHref: question.url ? `/questions/${question.url}` : undefined
			})
		)
	);
</script>

<div class="admin-dashboard">
	<section class="dashboard-hero">
		<div class="hero-panel">
			<div class="hero-top">
				<div class="hero-copy">
					<span class="eyebrow">Admin dashboard</span>
					<h1 class="page-title">Control center</h1>
					<p class="page-subtitle">
						A cleaner snapshot of user growth, community activity, and operational controls.
					</p>
				</div>

				<div class="hero-controls">
					<div class="hero-controls-header">
						<span class="eyebrow">Admin controls</span>
						<p class="hero-controls-note">
							Demo mode only affects admin-facing data sources. Reindexing can take several minutes
							and rebuilds both question and blog indices.
						</p>
					</div>

					<div class="control-grid">
						<button
							type="button"
							class="action-btn"
							class:active={isDemoTime}
							onclick={changeDemoTime}
						>
							<div class="action-copy">
								<span class="action-icon">🎭</span>
								<div>
									<span class="action-label">Demo mode</span>
								</div>
							</div>
							<span class="action-state">{isDemoTime ? 'On' : 'Off'}</span>
						</button>

						<button
							type="button"
							class="action-btn action-btn-secondary"
							onclick={() => getModal('confirmReindex').open()}
							disabled={isReindexing}
						>
							<div class="action-copy">
								<span class="action-icon">🔄</span>
								<div>
									<span class="action-label">Reindex search</span>
								</div>
							</div>
							<span class="action-state">{isReindexing ? 'Running' : 'Ready'}</span>
						</button>
					</div>
				</div>
			</div>

			<div class="highlight-grid">
				{#each highlightCards as highlight}
					<div class="highlight-card" data-tone={highlight.tone}>
						<span class="highlight-label">{highlight.label}</span>
						<strong class="highlight-value">{highlight.value}</strong>
						<span class="highlight-note">{highlight.note}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

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
					color="#3b82f6"
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
					color="#10b981"
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
						<h3 class="card-title">Recent signups</h3>
					</div>
					<div class="list-card-meta">
						<span class="count-pill">{formatCount(data.newUsersMonth)}</span>
						<a href="/admin/users" class="inline-link">Open users</a>
					</div>
				</div>

				{#if recentSignups.length > 0}
					<ul class="detail-list">
						{#each recentSignups as signup}
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
					<p class="empty-state">No recent signups available.</p>
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

<Modal2 id="confirmReindex">
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
			<button
				type="button"
				class="btn btn-secondary"
				onclick={() => getModal('confirmReindex').close()}
				disabled={isReindexing}
			>
				Cancel
			</button>
			<button
				type="button"
				class="btn btn-primary"
				onclick={reindexEverything}
				disabled={isReindexing}
			>
				{isReindexing ? 'Reindexing...' : 'Start reindex'}
			</button>
		</div>
	</div>
</Modal2>

<style>
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
	.highlight-grid,
	.metrics-grid,
	.insights-grid,
	.queue-grid,
	.control-grid {
		min-width: 0;
	}

	.dashboard-hero {
		display: block;
	}

	.panel,
	.hero-panel {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-surface) 94%, white 6%),
			var(--bg-surface)
		);
		border: 1px solid var(--bg-elevated);
		border-radius: 16px;
		box-shadow: var(--shadow-md);
		min-width: 0;
	}

	.hero-panel {
		position: relative;
		overflow: hidden;
		padding: 32px;
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--primary) 24%, transparent) 0%,
				transparent 34%
			),
			radial-gradient(
				circle at bottom left,
				color-mix(in srgb, var(--accent) 22%, transparent) 0%,
				transparent 42%
			),
			linear-gradient(160deg, var(--bg-surface), var(--bg-deep));
	}

	.hero-panel::after {
		content: '';
		position: absolute;
		inset: auto -10% -35% 45%;
		height: 220px;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--primary-light) 20%, transparent)
		);
		transform: rotate(-12deg);
		opacity: 0.6;
		pointer-events: none;
	}

	.hero-top {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.95fr);
		gap: 24px;
		align-items: start;
		margin-bottom: 28px;
	}

	.hero-controls {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 18px;
		border-radius: 18px;
		background: color-mix(in srgb, var(--bg-surface) 80%, transparent);
		border: 1px solid color-mix(in srgb, var(--bg-elevated) 86%, transparent);
		backdrop-filter: blur(10px);
	}

	.hero-controls-header {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.hero-controls-note {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.hero-copy,
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
		color: var(--text-secondary);
	}

	.page-title,
	.section-title,
	.card-title {
		margin: 0;
		color: var(--text-primary);
	}

	.page-title {
		font-size: clamp(1.8rem, 3.2vw, 2.5rem);
		font-weight: 800;
		line-height: 1.05;
	}

	.page-subtitle,
	.section-description {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.55;
	}

	.page-subtitle {
		max-width: 48rem;
		font-size: 0.97rem;
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
		color: var(--primary-light);
		text-decoration: none;
		font-weight: 600;
		transition:
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.section-link:hover,
	.inline-link:hover,
	.detail-link:hover {
		color: var(--accent-light);
	}

	.dashboard-section {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.highlight-grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.highlight-card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px;
		border-radius: 18px;
		background: color-mix(in srgb, var(--bg-surface) 82%, transparent);
		border: 1px solid color-mix(in srgb, var(--bg-elevated) 82%, transparent);
		backdrop-filter: blur(8px);
	}

	.highlight-card[data-tone='primary'] {
		border-color: color-mix(in srgb, var(--primary) 35%, var(--bg-elevated));
	}

	.highlight-card[data-tone='success'] {
		border-color: color-mix(in srgb, var(--success) 35%, var(--bg-elevated));
	}

	.highlight-card[data-tone='warning'] {
		border-color: color-mix(in srgb, var(--warning) 40%, var(--bg-elevated));
	}

	.highlight-label {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.highlight-value {
		font-size: 1.35rem;
		line-height: 1.15;
		color: var(--text-primary);
	}

	.highlight-note {
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--text-secondary);
	}

	.control-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	.action-btn {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 14px;
		padding: 18px;
		border-radius: 16px;
		border: 1px solid var(--bg-elevated);
		background: color-mix(in srgb, var(--bg-deep) 88%, var(--bg-surface));
		color: var(--text-primary);
		cursor: pointer;
		text-align: left;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.action-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--primary) 45%, var(--bg-elevated));
		box-shadow: var(--glow-sm);
	}

	.action-btn.active {
		border-color: color-mix(in srgb, var(--success) 55%, var(--bg-elevated));
		background: color-mix(in srgb, var(--success-light) 58%, var(--bg-surface));
	}

	.action-btn-secondary {
		border-color: color-mix(in srgb, var(--primary) 40%, var(--bg-elevated));
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary) 22%, var(--bg-deep)),
			var(--bg-deep)
		);
	}

	.action-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.action-copy {
		display: flex;
		gap: 12px;
		min-width: 0;
	}

	.action-icon {
		font-size: 1.2rem;
		line-height: 1;
		padding-top: 2px;
	}

	.action-label {
		display: block;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.action-desc {
		display: block;
		margin-top: 4px;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.action-state {
		flex-shrink: 0;
		padding: 6px 10px;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: color-mix(in srgb, var(--bg-elevated) 85%, transparent);
		color: var(--text-secondary);
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
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
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
		border-bottom: 1px solid var(--bg-elevated);
		background: color-mix(in srgb, var(--bg-deep) 82%, var(--bg-surface));
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
		background: color-mix(in srgb, var(--primary) 16%, transparent);
		color: var(--primary-light);
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
		border-top: 1px solid var(--bg-elevated);
	}

	.detail-item:first-child,
	.question-item:first-child {
		border-top: none;
	}

	.detail-item:hover,
	.question-item:hover {
		background: color-mix(in srgb, var(--bg-deep) 84%, var(--bg-surface));
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
		color: var(--text-primary);
		font-weight: 600;
	}

	.detail-subtitle {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.detail-date,
	.meta-text {
		font-size: 0.76rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		font-size: 0.78rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.24);
	}

	.type-badge.pending {
		background: var(--bg-elevated);
		color: var(--text-secondary);
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
		background: color-mix(in srgb, var(--bg-elevated) 90%, transparent);
		color: var(--text-secondary);
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
		color: var(--text-primary);
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
		color: var(--text-secondary);
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
		color: var(--text-primary);
		text-align: center;
	}

	.modal-text {
		margin: 0 0 16px;
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.55;
		text-align: center;
	}

	.modal-details {
		margin: 0 0 16px;
		padding: 16px;
		background: var(--bg-elevated);
		border-radius: 12px;
		border: 1px solid var(--bg-highlight);
	}

	.modal-details p {
		margin: 0 0 10px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.modal-details ul {
		margin: 0;
		padding-left: 20px;
		color: var(--text-secondary);
		font-size: 0.84rem;
		line-height: 1.55;
	}

	.modal-warning {
		margin: 0 0 20px;
		padding: 14px;
		background: var(--warning-light);
		border: 1px solid var(--warning);
		border-radius: 12px;
		color: var(--warning);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.modal-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	.btn {
		padding: 12px 20px;
		font-size: 0.88rem;
		font-weight: 600;
		border-radius: 10px;
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--bg-surface);
		color: var(--text-primary);
		border: 1px solid var(--bg-elevated);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--bg-elevated);
		border-color: var(--bg-highlight);
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
		color: white;
		border: 1px solid var(--primary);
		box-shadow: var(--glow-sm);
	}

	.btn-primary:hover:not(:disabled) {
		box-shadow: var(--glow-md);
	}

	@media (max-width: 1200px) {
		.hero-top {
			grid-template-columns: 1fr;
		}

		.control-grid {
			grid-template-columns: 1fr 1fr;
		}

		.queue-grid,
		.insights-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.admin-dashboard {
			gap: 20px;
		}

		.hero-panel {
			padding: 20px;
		}

		.section-header,
		.list-card-header,
		.question-footer {
			flex-direction: column;
			align-items: flex-start;
		}

		.section-link,
		.inline-link {
			font-size: 0.85rem;
		}

		.highlight-grid {
			grid-template-columns: 1fr;
		}

		.control-grid {
			grid-template-columns: 1fr;
		}

		.metrics-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.metrics-grid :global(.stat-card) {
			min-height: 0;
			padding: 16px;
			border-radius: 12px;
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

		.detail-side,
		.list-card-meta {
			align-items: flex-start;
		}

		.modal-actions {
			flex-direction: column-reverse;
		}

		.btn {
			width: 100%;
		}
	}

	@media (max-width: 520px) {
		.page-title {
			font-size: 1.6rem;
		}

		.highlight-card,
		.action-btn,
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
