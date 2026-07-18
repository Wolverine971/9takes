<!-- src/routes/admin/MobileCommandCenter.svelte -->
<script lang="ts">
	import {
		Activity,
		ArrowUpRight,
		ChartNoAxesCombined,
		CircleAlert,
		Command,
		FileText,
		FolderKanban,
		Mail,
		Megaphone,
		MessageCircle,
		RefreshCw,
		Search,
		Target,
		Users,
		UserRoundPlus
	} from '@lucide/svelte';
	import { getMobileAdminCommand } from '$lib/admin/mobileAdminCommand';
	import type { PageData } from './$types';

	type Props = {
		data: PageData;
		isDemoTime: boolean;
		isReindexing: boolean;
		onToggleDemo: () => void | Promise<void>;
		onOpenReindex: () => void;
	};

	type TrendingPageRow = {
		path: string;
		current_visits: number;
		current_unique_visitors: number;
		baseline_avg_visits: number;
		lift_visits: number;
		ratio_visits: number | null;
		top_sources: Array<{ key: string; count: number }>;
	};

	let { data, isDemoTime, isReindexing, onToggleDemo, onOpenReindex }: Props = $props();
	const mobileCommand = getMobileAdminCommand();

	const quickLinks = [
		{ href: '/admin/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
		{ href: '/admin/content-board', label: 'Content', icon: FolderKanban },
		{ href: '/admin/users', label: 'Users', icon: Users },
		{ href: '/admin/questions', label: 'Questions', icon: MessageCircle },
		{ href: '/admin/email-dashboard', label: 'Email', icon: Mail },
		{ href: '/admin/consulting', label: 'Consulting', icon: Target },
		{ href: '/admin/marketing', label: 'Marketing', icon: Megaphone }
	];

	const formatCount = (value: number | null | undefined) => (value ?? 0).toLocaleString();
	const formatCompactCount = (value: number | null | undefined) =>
		new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(
			value ?? 0
		);
	const formatPercent = (
		block:
			| {
					pct?: number | null;
					denominator?: number | null;
			  }
			| null
			| undefined
	) => ((block?.denominator ?? 0) > 0 ? `${(block?.pct ?? 0).toFixed(1)}%` : '—');
	const formatDate = (value: string | null | undefined) => {
		if (!value) return '—';
		const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
		if (Number.isNaN(date.getTime())) return '—';
		return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
	};
	const formatTime = (value: string | null | undefined) => {
		if (!value) return 'just now';
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return 'just now';
		return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date);
	};
	const formatLift = (value: number) => `${value > 0 ? '+' : ''}${Math.round(value)}`;
	const formatRatio = (value: number | null) =>
		value === null || !Number.isFinite(value) ? 'new' : `${value.toFixed(1)}×`;

	let visitorDays = $derived(
		(data.dailyVisitors ?? [])
			.map((day) => ({
				date: day.days,
				value: day.number_of_visitors
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
	);
	let recentVisitorDays = $derived(visitorDays.slice(-7));
	let maxRecentVisitors = $derived(Math.max(1, ...recentVisitorDays.map((day) => day.value ?? 0)));
	let totalVisitors = $derived(visitorDays.reduce((total, day) => total + (day.value ?? 0), 0));

	let primaryMetrics = $derived.by(() => [
		{
			label: 'Visitors · 30d',
			value: formatCompactCount(totalVisitors),
			meta: 'Traffic',
			href: '/admin/analytics',
			icon: Activity,
			tone: 'data'
		},
		{
			label: 'Contributors · WTD',
			value: formatCompactCount(
				data.retentionSummary?.activeContributorsThisWeek ?? data.activeContributors
			),
			meta: 'Active',
			href: '/admin/comments',
			icon: MessageCircle,
			tone: 'success'
		},
		{
			label: 'New users · today',
			value: formatCompactCount(data.newUsersToday),
			meta: `${formatCompactCount(data.totalUsers)} total`,
			href: '/admin/users',
			icon: UserRoundPlus,
			tone: 'primary'
		},
		{
			label: 'Comments · today',
			value: formatCompactCount(data.commentsToday),
			meta: `${formatCompactCount(data.totalComments)} total`,
			href: '/admin/comments',
			icon: MessageCircle,
			tone: 'success'
		},
		{
			label: 'Email · today',
			value: formatCompactCount(data.newEmailSignupsToday),
			meta: `${formatCompactCount(data.newEmailSignupsWeek)} this week`,
			href: '/admin/users',
			icon: Mail,
			tone: 'default'
		},
		{
			label: 'Coaching queue',
			value: formatCompactCount(data.coachingWaitlist),
			meta: 'Waiting',
			href: '/admin/consulting',
			icon: Target,
			tone: data.coachingWaitlist > 0 ? 'warning' : 'default'
		}
	]);

	let funnelMetrics = $derived.by(() => [
		{
			label: 'First comment',
			value: formatPercent(data.retentionSummary?.firstCommentRateLastFullWeek)
		},
		{
			label: 'Email signup',
			value: formatPercent(data.retentionSummary?.emailSignupRateLastFullWeek)
		},
		{
			label: 'Registered',
			value: formatPercent(data.retentionSummary?.registeredRateLastFullWeek)
		},
		{
			label: 'D7 retained',
			value: formatPercent(data.retentionSummary?.d7RetentionLastMatureWeek)
		}
	]);

	let trendingBroadRows = $derived(
		((data.trending?.broadRows ?? []) as TrendingPageRow[]).slice(0, 3)
	);
	let trendingRepeatRows = $derived(
		((data.trending?.repeatRows ?? []) as TrendingPageRow[]).slice(0, 2)
	);
	let trendingAvailable = $derived(data.trending?.available === true);
	let recentQuestions = $derived((data.dailyQuestions ?? []).slice(0, 4));
	let recentUsers = $derived((data.recentSignups ?? []).slice(0, 4));
	let recentEmailSignups = $derived((data.recentEmailSignups ?? []).slice(0, 4));
</script>

<section class="command-center" aria-labelledby="mobile-command-title">
	<header class="command-header">
		<div class="command-heading">
			<div class="status-line">
				<span
					class={['status-dot', { warning: isDemoTime || data.dataStatus?.state === 'degraded' }]}
					aria-hidden="true"
				></span>
				<span>{isDemoTime ? 'Demo feed' : 'Live feed'}</span>
				<span class="status-separator" aria-hidden="true">/</span>
				<span>Updated {formatTime(data.dataStatus?.generatedAt)}</span>
			</div>
			<h1 id="mobile-command-title">Command center</h1>
			<p>What changed, what needs attention, and where to go next.</p>
		</div>
		<a class="analytics-shortcut" href="/admin/analytics" aria-label="Open full analytics">
			<ChartNoAxesCombined size={18} strokeWidth={1.8} aria-hidden="true" />
		</a>
	</header>

	{#if data.dataStatus?.state === 'degraded'}
		<aside class="degraded-alert" role="status" aria-live="polite">
			<CircleAlert size={18} strokeWidth={1.8} aria-hidden="true" />
			<div>
				<strong>Partial data</strong>
				<p>{data.dataStatus.warnings.map((warning) => warning.label).join(', ')} unavailable.</p>
			</div>
			<a href="/admin">Retry</a>
		</aside>
	{/if}

	<section class="metric-section" aria-labelledby="mobile-pulse-title">
		<div class="section-heading">
			<div>
				<span class="eyebrow">Now</span>
				<h2 id="mobile-pulse-title">Pulse</h2>
			</div>
			<span class="period-label">local snapshot</span>
		</div>

		<div class="metric-matrix">
			{#each primaryMetrics as metric (metric.label)}
				{@const Icon = metric.icon}
				<a class="metric-cell" data-tone={metric.tone} href={metric.href}>
					<span class="metric-icon">
						<Icon size={16} strokeWidth={1.8} aria-hidden="true" />
					</span>
					<span class="metric-copy">
						<span class="metric-label">{metric.label}</span>
						<strong>{metric.value}</strong>
						<small>{metric.meta}</small>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<nav class="quick-launch" aria-labelledby="mobile-launch-title">
		<div class="section-heading">
			<div>
				<span class="eyebrow">Navigate</span>
				<h2 id="mobile-launch-title">Quick launch</h2>
			</div>
			<span class="period-label">8 essentials</span>
		</div>

		<div class="launch-grid">
			{#each quickLinks as link (link.href)}
				{@const Icon = link.icon}
				<a href={link.href} class="launch-link">
					<span class="launch-icon">
						<Icon size={18} strokeWidth={1.8} aria-hidden="true" />
					</span>
					<span>{link.label}</span>
				</a>
			{/each}
			<button type="button" class="launch-link launch-button" onclick={mobileCommand.openMenu}>
				<span class="launch-icon">
					<Command size={18} strokeWidth={1.8} aria-hidden="true" />
				</span>
				<span>All tools</span>
			</button>
		</div>
	</nav>

	<section class="signal-panel" aria-labelledby="mobile-signal-title">
		<div class="section-heading signal-heading">
			<div>
				<span class="eyebrow">Signals</span>
				<h2 id="mobile-signal-title">Moving now</h2>
			</div>
			<a href="/admin/analytics">
				Details
				<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
			</a>
		</div>

		{#if !trendingAvailable}
			<p class="empty-copy">Trending signals are waiting for the analytics migration.</p>
		{:else if trendingBroadRows.length === 0 && trendingRepeatRows.length === 0}
			<p class="empty-copy">No unusual traffic movement right now.</p>
		{:else}
			{#if trendingBroadRows.length > 0}
				<ul class="signal-list" aria-label="Broad traffic spikes">
					{#each trendingBroadRows as row (row.path)}
						<li>
							<a class="signal-row" href={row.path}>
								<span class="signal-rank" aria-hidden="true">↗</span>
								<span class="signal-main">
									<strong>{row.path}</strong>
									<small>
										{formatCompactCount(row.current_unique_visitors)} unique ·
										{row.top_sources[0]?.key ?? 'direct'}
									</small>
								</span>
								<span class="signal-value">
									<strong>{formatCompactCount(row.current_visits)}</strong>
									<small>
										{formatLift(row.lift_visits)} · {formatRatio(row.ratio_visits)}
									</small>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}

			{#if trendingRepeatRows.length > 0}
				<div class="watch-strip">
					<span class="watch-label">Repeat watch</span>
					<a href={trendingRepeatRows[0].path}>{trendingRepeatRows[0].path}</a>
					<strong>{formatCompactCount(trendingRepeatRows[0].current_visits)}</strong>
				</div>
			{/if}
		{/if}
	</section>

	<div class="insight-grid">
		<section class="compact-panel" aria-labelledby="mobile-funnel-title">
			<div class="compact-panel-header">
				<div>
					<span class="eyebrow">7-day</span>
					<h2 id="mobile-funnel-title">Conversion</h2>
				</div>
				<FileText size={17} strokeWidth={1.8} aria-hidden="true" />
			</div>
			<dl class="funnel-list">
				{#each funnelMetrics as metric (metric.label)}
					<div>
						<dt>{metric.label}</dt>
						<dd>{metric.value}</dd>
					</div>
				{/each}
			</dl>
		</section>

		<section class="compact-panel" aria-labelledby="mobile-traffic-title">
			<div class="compact-panel-header">
				<div>
					<span class="eyebrow">Last 7 days</span>
					<h2 id="mobile-traffic-title">Traffic</h2>
				</div>
				<Activity size={17} strokeWidth={1.8} aria-hidden="true" />
			</div>

			{#if recentVisitorDays.length > 0}
				<div class="traffic-bars" aria-label="Visitors over the last seven days">
					{#each recentVisitorDays as day (day.date)}
						<div
							class="traffic-day"
							aria-label={`${formatDate(day.date)}: ${formatCount(day.value)} visitors`}
						>
							<strong>{formatCompactCount(day.value)}</strong>
							<span class="bar-track" aria-hidden="true">
								<span
									class="bar-fill"
									style:height={`${Math.max(10, ((day.value ?? 0) / maxRecentVisitors) * 100)}%`}
								></span>
							</span>
							<small>{formatDate(day.date).split(' ')[1]}</small>
						</div>
					{/each}
				</div>
			{:else}
				<p class="empty-copy compact">No traffic history yet.</p>
			{/if}
		</section>
	</div>

	<section class="activity-panel" aria-labelledby="mobile-activity-title">
		<div class="section-heading activity-heading">
			<div>
				<span class="eyebrow">Inbox</span>
				<h2 id="mobile-activity-title">Latest activity</h2>
			</div>
			<span class="activity-count">
				{formatCount(recentQuestions.length + recentUsers.length + recentEmailSignups.length)}
			</span>
		</div>

		<details open>
			<summary>
				<span>Questions</span>
				<strong>{recentQuestions.length}</strong>
			</summary>
			<div class="activity-list">
				{#each recentQuestions as question (`${question.url ?? question.question}-${question.created_at}`)}
					<a
						href={question.url ? `/questions/${question.url}` : '/admin/questions'}
						class="activity-row"
					>
						<span class="activity-main">
							<strong>{question.question || 'Untitled question'}</strong>
							<small>
								{formatDate(question.created_at)} ·
								{formatCount(question.number_of_comments_today)} today
							</small>
						</span>
						<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
					</a>
				{:else}
					<p class="empty-copy compact">No recent question activity.</p>
				{/each}
			</div>
		</details>

		<details>
			<summary>
				<span>New users</span>
				<strong>{recentUsers.length}</strong>
			</summary>
			<div class="activity-list">
				{#each recentUsers as user (user.external_id ?? user.email ?? user.created_at)}
					<a
						href={user.external_id ? `/users/${user.external_id}` : '/admin/users'}
						class="activity-row"
					>
						<span class="activity-main">
							<strong>{user.email || 'Anonymous user'}</strong>
							<small>
								Joined {formatDate(user.created_at)} · Type {user.enneagram || 'pending'}
							</small>
						</span>
						<ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />
					</a>
				{:else}
					<p class="empty-copy compact">No recent registered users.</p>
				{/each}
			</div>
		</details>

		<details>
			<summary>
				<span>Email signups</span>
				<strong>{recentEmailSignups.length}</strong>
			</summary>
			<div class="activity-list">
				{#each recentEmailSignups as signup (`${signup.email}-${signup.created_at}`)}
					<a href={signup.email ? `mailto:${signup.email}` : '/admin/users'} class="activity-row">
						<span class="activity-main">
							<strong>{signup.email || 'Unknown email'}</strong>
							<small>
								{signup.first_acquisition_source || 'unknown source'} ·
								{formatDate(signup.created_at)}
							</small>
						</span>
						<Mail size={14} strokeWidth={1.8} aria-hidden="true" />
					</a>
				{:else}
					<p class="empty-copy compact">No recent email signups.</p>
				{/each}
			</div>
		</details>
	</section>

	<section class="system-actions" aria-labelledby="mobile-system-title">
		<div>
			<span class="eyebrow">System</span>
			<h2 id="mobile-system-title">Controls</h2>
		</div>
		<div class="system-action-list">
			<button type="button" class={{ active: isDemoTime }} onclick={onToggleDemo}>
				<span>
					<RefreshCw size={16} strokeWidth={1.8} aria-hidden="true" />
					Demo data
				</span>
				<strong>{isDemoTime ? 'On' : 'Off'}</strong>
			</button>
			<button type="button" onclick={onOpenReindex} disabled={isReindexing}>
				<span>
					<Search size={16} strokeWidth={1.8} aria-hidden="true" />
					Search index
				</span>
				<strong>{isReindexing ? 'Running' : 'Rebuild'}</strong>
			</button>
		</div>
	</section>
</section>

<style>
	.command-center {
		display: grid;
		gap: 12px;
		width: 100%;
		min-width: 0;
		color: var(--ink-bright);
	}

	.command-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 4px 2px 2px;
	}

	.command-heading {
		min-width: 0;
	}

	.status-line {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 6px;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.status-dot {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--success);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--success) 15%, transparent);
	}

	.status-dot.warning {
		background: var(--warning);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning) 15%, transparent);
	}

	.status-separator {
		color: var(--ink-dim);
	}

	h1,
	h2,
	p {
		margin: 0;
	}

	h1 {
		font-size: 1.35rem;
		font-weight: 750;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.command-heading > p {
		margin-top: 5px;
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.analytics-shortcut {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, var(--stone-edge));
		border-radius: 10px;
		background: color-mix(in srgb, var(--lamp-glow) 8%, var(--stone-warm));
		color: var(--lamp-glow);
	}

	.degraded-alert {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border: 1px solid color-mix(in srgb, var(--warning) 42%, var(--stone-edge));
		border-radius: 10px;
		background: color-mix(in srgb, var(--warning) 8%, var(--stone-warm));
	}

	.degraded-alert > svg {
		color: var(--warning);
	}

	.degraded-alert strong {
		font-size: 0.78rem;
	}

	.degraded-alert p {
		margin-top: 2px;
		color: var(--ink-mid);
		font-size: 0.69rem;
		line-height: 1.35;
	}

	.degraded-alert a {
		color: var(--warning-text);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.metric-section,
	.quick-launch,
	.signal-panel,
	.compact-panel,
	.activity-panel,
	.system-actions {
		min-width: 0;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);
		overflow: hidden;
	}

	.section-heading,
	.compact-panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 12px 14px 10px;
		border-bottom: 1px solid color-mix(in srgb, var(--stone-edge) 72%, transparent);
	}

	.eyebrow {
		display: block;
		margin-bottom: 2px;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}

	h2 {
		font-size: 0.94rem;
		font-weight: 720;
		line-height: 1.2;
	}

	.period-label {
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.58rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.metric-matrix {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.metric-cell {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		align-items: center;
		gap: 8px;
		min-width: 0;
		min-height: 74px;
		padding: 10px 12px;
		border-right: 1px solid color-mix(in srgb, var(--stone-edge) 62%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--stone-edge) 62%, transparent);
		color: inherit;
		text-decoration: none;
	}

	.metric-cell:nth-child(2n) {
		border-right: none;
	}

	.metric-cell:nth-last-child(-n + 2) {
		border-bottom: none;
	}

	.metric-icon,
	.launch-icon {
		display: grid;
		place-items: center;
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-mid);
	}

	.metric-icon {
		width: 30px;
		height: 30px;
	}

	.metric-cell[data-tone='primary'] .metric-icon,
	.metric-cell[data-tone='data'] .metric-icon {
		background: color-mix(in srgb, var(--data-teal) 14%, var(--night-mid));
		color: var(--data-cyan);
	}

	.metric-cell[data-tone='success'] .metric-icon {
		background: color-mix(in srgb, var(--success) 13%, var(--night-mid));
		color: var(--success-text);
	}

	.metric-cell[data-tone='warning'] .metric-icon {
		background: color-mix(in srgb, var(--warning) 13%, var(--night-mid));
		color: var(--warning-text);
	}

	.metric-copy {
		display: grid;
		min-width: 0;
	}

	.metric-label {
		overflow: hidden;
		color: var(--ink-mid);
		font-size: 0.62rem;
		font-weight: 650;
		line-height: 1.25;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.metric-copy strong {
		margin-top: 2px;
		font-family: var(--font-mono);
		font-size: 1rem;
		line-height: 1.05;
	}

	.metric-copy small {
		margin-top: 3px;
		overflow: hidden;
		color: var(--ink-mid);
		font-size: 0.58rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.launch-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.launch-link {
		display: flex;
		min-width: 0;
		min-height: 70px;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 6px;
		padding: 8px 3px;
		border-right: 1px solid color-mix(in srgb, var(--stone-edge) 62%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--stone-edge) 62%, transparent);
		color: var(--ink-mid);
		font-size: 0.61rem;
		font-weight: 650;
		text-align: center;
		text-decoration: none;
	}

	.launch-button {
		width: 100%;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.launch-link:nth-child(4n) {
		border-right: none;
	}

	.launch-link:nth-last-child(-n + 4) {
		border-bottom: none;
	}

	.launch-icon {
		width: 32px;
		height: 32px;
		color: var(--lamp-glow);
	}

	.signal-heading a {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		min-height: 32px;
		color: var(--lamp-glow);
		font-size: 0.68rem;
		font-weight: 700;
		text-decoration: none;
	}

	.signal-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.signal-list li + li {
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 62%, transparent);
	}

	.signal-row {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) auto;
		align-items: center;
		gap: 8px;
		min-height: 58px;
		padding: 8px 12px;
		color: inherit;
		text-decoration: none;
	}

	.signal-rank {
		display: grid;
		width: 24px;
		height: 24px;
		place-items: center;
		border-radius: 10px;
		background: color-mix(in srgb, var(--success) 12%, transparent);
		color: var(--success-text);
		font-size: 0.72rem;
		font-weight: 800;
	}

	.signal-main,
	.signal-value {
		display: grid;
		min-width: 0;
	}

	.signal-main strong {
		overflow: hidden;
		font-size: 0.72rem;
		line-height: 1.35;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.signal-main small,
	.signal-value small {
		margin-top: 2px;
		color: var(--ink-mid);
		font-size: 0.58rem;
		white-space: nowrap;
	}

	.signal-value {
		justify-items: end;
		font-family: var(--font-mono);
	}

	.signal-value strong {
		font-size: 0.82rem;
	}

	.watch-strip {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 7px 12px;
		border-top: 1px solid color-mix(in srgb, var(--warning) 24%, var(--stone-edge));
		background: color-mix(in srgb, var(--warning) 6%, var(--night-mid));
	}

	.watch-label {
		color: var(--warning-text);
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.watch-strip a {
		overflow: hidden;
		color: var(--ink-mid);
		font-size: 0.62rem;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.watch-strip strong {
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	.empty-copy {
		padding: 18px 14px;
		color: var(--ink-mid);
		font-size: 0.72rem;
		line-height: 1.45;
	}

	.empty-copy.compact {
		padding: 12px;
		font-size: 0.66rem;
	}

	.insight-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		min-width: 0;
	}

	.compact-panel-header {
		padding: 10px 11px 8px;
	}

	.compact-panel-header > svg {
		color: var(--ink-mid);
	}

	.compact-panel h2 {
		font-size: 0.82rem;
	}

	.funnel-list {
		display: grid;
		margin: 0;
		padding: 6px 10px 8px;
	}

	.funnel-list > div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 6px;
		min-height: 30px;
		padding: 6px 0;
		border-bottom: 1px solid color-mix(in srgb, var(--stone-edge) 55%, transparent);
	}

	.funnel-list > div:last-child {
		border-bottom: none;
	}

	.funnel-list dt {
		overflow: hidden;
		color: var(--ink-mid);
		font-size: 0.59rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.funnel-list dd {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
	}

	.traffic-bars {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		align-items: end;
		gap: 3px;
		height: 142px;
		padding: 10px 8px 8px;
	}

	.traffic-day {
		display: grid;
		grid-template-rows: 16px 82px 14px;
		align-items: end;
		justify-items: center;
		gap: 3px;
		min-width: 0;
	}

	.traffic-day strong,
	.traffic-day small {
		font-family: var(--font-mono);
		font-size: 0.48rem;
		font-weight: 600;
	}

	.traffic-day strong {
		overflow: hidden;
		max-width: 100%;
		text-overflow: ellipsis;
	}

	.traffic-day small {
		color: var(--ink-mid);
	}

	.bar-track {
		display: flex;
		width: 8px;
		height: 82px;
		align-items: flex-end;
		overflow: hidden;
		border-radius: 999px;
		background: var(--night-mid);
	}

	.bar-fill {
		display: block;
		width: 100%;
		border-radius: 999px;
		background: var(--data-teal);
	}

	.activity-heading {
		padding-bottom: 11px;
	}

	.activity-count {
		display: grid;
		min-width: 26px;
		height: 26px;
		place-items: center;
		padding: 0 7px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--lamp-glow) 13%, transparent);
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 700;
	}

	.activity-panel details + details {
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 70%, transparent);
	}

	.activity-panel summary {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 8px 14px;
		color: var(--ink-bright);
		cursor: pointer;
		font-size: 0.72rem;
		font-weight: 700;
		list-style: none;
	}

	.activity-panel summary::-webkit-details-marker {
		display: none;
	}

	.activity-panel summary::after {
		content: '+';
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.82rem;
	}

	.activity-panel details[open] summary::after {
		content: '−';
	}

	.activity-panel summary strong {
		margin-left: auto;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.62rem;
	}

	.activity-list {
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 55%, transparent);
		background: color-mix(in srgb, var(--night-mid) 70%, transparent);
	}

	.activity-row {
		display: flex;
		min-height: 48px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 8px 14px;
		color: inherit;
		text-decoration: none;
	}

	.activity-row + .activity-row {
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 45%, transparent);
	}

	.activity-row > svg {
		flex: 0 0 auto;
		color: var(--ink-mid);
	}

	.activity-main {
		display: grid;
		min-width: 0;
	}

	.activity-main strong {
		overflow: hidden;
		font-size: 0.67rem;
		line-height: 1.35;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.activity-main small {
		margin-top: 2px;
		overflow: hidden;
		color: var(--ink-mid);
		font-size: 0.57rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.system-actions {
		padding: 12px 14px 14px;
	}

	.system-actions > div:first-child {
		margin-bottom: 10px;
	}

	.system-action-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.system-action-list button {
		display: grid;
		min-width: 0;
		min-height: 48px;
		gap: 3px;
		padding: 7px 9px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-bright);
		cursor: pointer;
		text-align: left;
	}

	.system-action-list button span {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 6px;
		color: var(--ink-mid);
		font-size: 0.59rem;
	}

	.system-action-list button strong {
		font-size: 0.7rem;
	}

	.system-action-list button.active {
		border-color: color-mix(in srgb, var(--success) 52%, var(--stone-edge));
	}

	.system-action-list button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	a:focus-visible,
	button:focus-visible,
	summary:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: -2px;
	}

	@media (hover: hover) {
		.metric-cell:hover,
		.launch-link:hover,
		.signal-row:hover,
		.activity-row:hover {
			background: color-mix(in srgb, var(--lamp-glow) 5%, var(--stone-mid));
		}

		.launch-link:hover {
			color: var(--ink-bright);
		}
	}

	@media (max-width: 360px) {
		.metric-cell {
			padding-inline: 9px;
		}

		.metric-label {
			font-size: 0.58rem;
		}

		.launch-link {
			font-size: 0.56rem;
		}

		.insight-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			scroll-behavior: auto;
		}
	}
</style>
