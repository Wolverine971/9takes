<!-- src/routes/admin/+page.svelte -->
<script lang="ts">
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import { Button } from '$lib/components/atoms';
	import { notifications } from '$lib/components/molecules/notifications';
	import EngagementTrends from '$lib/components/charts/EngagementTrends.svelte';
	import GrowthTrends from '$lib/components/charts/GrowthTrends.svelte';
	import MobileCommandCenter from './MobileCommandCenter.svelte';
	import { markTalkNotesViewed } from '$lib/admin/talkNotesViewed';
	import {
		fullDate,
		shortDate,
		timeFormat,
		unsubscribeReasonLabel
	} from '$lib/admin/dashboardFormat';
	import type { TalkNotePreview } from '$lib/types/talkNotes';
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

	type QuestionActivityItem = {
		question: string;
		createdAt: string | null;
		todayComments: number;
		totalComments: number;
		authorEmail: string;
		questionHref: string;
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

	type QuestionDay = NonNullable<PageData['dailyQuestions']>[number];

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

	let analyticsAsOf = $derived(
		data.analyticsRefreshedAt ? timeFormat.format(new Date(data.analyticsRefreshedAt)) : null
	);

	// Rows whose long text (note body, waitlist goal) is expanded in place.
	let expanded = $state<Record<string, boolean>>({});
	const toggleExpanded = (key: string) => {
		expanded[key] = !expanded[key];
	};

	// Notes opened here this visit. The badge refresh doesn't re-run this page's load, so
	// these stay the source of truth for Seen until the next navigation.
	let seenHere = $state<Record<string, boolean>>({});
	const noteState = (note: TalkNotePreview) => {
		if (note.status === 'replied') return 'replied';
		if (note.status === 'archived') return 'archived';
		return note.viewedAt || seenHere[note.id] ? 'seen' : 'new';
	};
	const noteStateLabel = { new: 'New', seen: 'Seen', replied: 'Replied', archived: 'Archived' };
	const toggleNote = (note: TalkNotePreview) => {
		const key = `note:${note.id}`;
		toggleExpanded(key);
		if (expanded[key] && noteState(note) === 'new') {
			seenHere[note.id] = true;
			// A failed save shows New again, so expanding the note retries it.
			void markTalkNotesViewed([note.id]).then((saved) => {
				if (!saved) delete seenHere[note.id];
			});
		}
	};

	let waitlistEntries = $derived((data.coachingWaitlistUsers ?? []).slice(0, 6));
	let talkNoteEntries = $derived(data.talkNotes?.latest ?? []);
	// The badge refresh re-runs only the admin layout, not this page's load, so the card's
	// count also subtracts notes opened here that the server still has as unseen.
	let unseenNotes = $derived(
		Math.max(
			0,
			(data.talkNotes?.unseenCount ?? 0) -
				talkNoteEntries.filter(
					(note) => note.status === 'new' && !note.viewedAt && seenHere[note.id]
				).length
		)
	);
	let recentUsers = $derived((data.recentSignups ?? []).slice(0, 8));
	let recentEmailSignups = $derived((data.recentEmailSignups ?? []).slice(0, 8));
	let recentUnsubscribes = $derived((data.recentUnsubscribes ?? []).slice(0, 6));
	let questionActivity = $derived(
		(data.dailyQuestions ?? []).slice(0, 10).map((question: QuestionDay): QuestionActivityItem => ({
			question: question.question || 'Untitled question',
			createdAt: question.created_at,
			todayComments: question.number_of_comments_today ?? 0,
			totalComments: question.number_of_comments ?? 0,
			authorEmail: question.user_email || 'Unknown author',
			questionHref: question.url ? `/questions/${question.url}` : '/admin/questions'
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
		return signup.first_landing_path ? `${source} · ${signup.first_landing_path}` : source;
	};
	const unsubscribeTitle = (reason: string | null | undefined, at: string | null | undefined) =>
		['Unsubscribed', reason, fullDate(at)].filter(Boolean).join(' · ');
	const unsubscribeReason = (unsubscribe: NonNullable<PageData['recentUnsubscribes']>[number]) =>
		unsubscribeReasonLabel(unsubscribe.reason);
	const isKnownEnneagram = (value: unknown): value is string =>
		typeof value === 'string' && /^[1-9]$/.test(value);
</script>

<div class="mobile-command-shell">
	<MobileCommandCenter
		{data}
		{isDemoTime}
		{isReindexing}
		onToggleDemo={changeDemoTime}
		onOpenReindex={() => getModal('confirmReindex').open()}
	/>

	<section class="honest-growth-mobile" aria-labelledby="honest-growth-mobile-title">
		<div class="section-copy">
			<span class="eyebrow">Honest growth</span>
			<h2 class="section-title" id="honest-growth-mobile-title">Real people, week by week</h2>
		</div>
		<GrowthTrends trends={data.growthTrends} />
	</section>
</div>

<div class="admin-dashboard desktop-dashboard">
	<section class="dashboard-hero">
		<div class="hero-bar">
			<div class="hero-copy">
				<h1 class="page-title">Control center</h1>
				<span class="hero-mode" data-tone={isDemoTime ? 'warning' : 'success'}>
					{isDemoTime ? 'Demo data' : 'Live data'}
				</span>
				{#if analyticsAsOf}
					<span
						class="hero-asof"
						title="Weekly growth, trends and traffic refresh every 10 minutes"
					>
						Stats as of {analyticsAsOf}
					</span>
				{/if}
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
				<span class="eyebrow">Honest growth</span>
				<h2 class="section-title">Real people, week by week</h2>
			</div>
			<p class="section-note">Bots, your own activity and removed comments filtered out</p>
		</div>

		<GrowthTrends trends={data.growthTrends} />
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Inbox</span>
				<h2 class="section-title">Recent inbound activity</h2>
			</div>
		</div>

		<div class="queue-grid">
			<article class="panel compact-card">
				<header class="card-head">
					<h3 class="card-title">Talk to DJ notes</h3>
					{#if data.talkNotes}
						<span class="card-count" class:attention={unseenNotes > 0}>
							{unseenNotes > 0
								? `${formatCount(unseenNotes)} new`
								: `${formatCount(data.talkNotes.newCount)} open`}
						</span>
					{/if}
					<a href="/admin/consulting/notes" class="card-link">Open</a>
				</header>

				{#if !data.talkNotes}
					<p class="empty-state">Couldn’t load notes.</p>
				{:else if talkNoteEntries.length > 0}
					<ul class="feed">
						{#each talkNoteEntries as note (note.id)}
							{@const state = noteState(note)}
							{@const key = `note:${note.id}`}
							<li class="feed-row" class:expanded={expanded[key]}>
								<div class="feed-line">
									<span class="state-chip" data-state={state}>{noteStateLabel[state]}</span>
									<button
										type="button"
										class="feed-text"
										aria-expanded={expanded[key] ?? false}
										onclick={() => toggleNote(note)}
									>
										{note.preview}
									</button>
									{#if note.wantsSession}
										<span class="feed-flag" title="Wants a session">session</span>
									{/if}
									<time
										class="feed-date"
										datetime={note.createdAt}
										title={fullDate(note.createdAt)}
									>
										{shortDate(note.createdAt)}
									</time>
								</div>
								{#if expanded[key]}
									<div class="feed-detail">
										<p class="feed-body">{note.body}</p>
										<p class="feed-meta-line">
											{note.inputMode === 'voice' ? 'Voice note' : 'Text note'} ·
											{note.hasEmail ? 'Left an email' : 'Anonymous'}{note.wantsSession
												? ' · Wants a session'
												: ''} ·
											<a href="/admin/consulting/notes" class="inline-link">
												{note.hasEmail ? 'Reply in notes' : 'Open in notes'}
											</a>
										</p>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No notes yet.</p>
				{/if}
			</article>

			<article class="panel compact-card">
				<header class="card-head">
					<h3 class="card-title">Coaching waitlist</h3>
					<span class="card-count" title="All-time rows, including the flagged Nov 2025 bot wave">
						{formatCount(data.coachingWaitlist)} total
					</span>
					<a href="/admin/consulting" class="card-link">Open</a>
				</header>

				{#if waitlistEntries.length > 0}
					<ul class="feed">
						{#each waitlistEntries as entry (entry.id)}
							{@const key = `wait:${entry.id}`}
							<li class="feed-row" class:expanded={expanded[key]}>
								<div class="feed-line">
									<a href={`mailto:${entry.email}`} class="feed-title">{entry.email}</a>
									{#if entry.session_goal}
										<button
											type="button"
											class="feed-text muted"
											aria-expanded={expanded[key] ?? false}
											onclick={() => toggleExpanded(key)}
										>
											{entry.session_goal}
										</button>
									{:else}
										<span class="feed-meta">No goal given</span>
									{/if}
									{#if entry.unsubscribed}
										<span
											class="feed-flag warning"
											title={unsubscribeTitle(entry.unsubscribe_reason, entry.unsubscribed_at)}
										>
											unsub
										</span>
									{/if}
									<time
										class="feed-date"
										datetime={entry.created_at}
										title={fullDate(entry.created_at)}
									>
										{shortDate(entry.created_at)}
									</time>
								</div>
								{#if expanded[key] && entry.session_goal}
									<div class="feed-detail">
										<p class="feed-body">{entry.session_goal}</p>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No coaching waitlist entries yet.</p>
				{/if}
			</article>

			<article class="panel compact-card">
				<header class="card-head">
					<h3 class="card-title">Registered users</h3>
					<span class="card-count">{formatCount(data.newUsersMonth)} in 30 days</span>
					<a href="/admin/users" class="card-link">Open</a>
				</header>

				{#if recentUsers.length > 0}
					<ul class="feed">
						{#each recentUsers as signup (signup.id)}
							<li class="feed-row">
								<div class="feed-line">
									{#if isKnownEnneagram(signup.enneagram)}
										<span
											class="type-badge type-{signup.enneagram}"
											title={`Enneagram type ${signup.enneagram}`}
										>
											{signup.enneagram}
										</span>
									{:else}
										<span class="type-badge pending" title="Enneagram type unknown">?</span>
									{/if}
									{#if signup.external_id}
										<a href={`/users/${signup.external_id}`} class="feed-title">
											{signup.email || 'Anonymous'}
										</a>
									{:else}
										<span class="feed-title plain">{signup.email || 'Anonymous'}</span>
									{/if}
									<span class="feed-spacer"></span>
									{#if signup.unsubscribed}
										<span
											class="feed-flag warning"
											title={unsubscribeTitle(signup.unsubscribe_reason, signup.unsubscribed_at)}
										>
											unsub
										</span>
									{/if}
									<time
										class="feed-date"
										datetime={signup.created_at}
										title={fullDate(signup.created_at)}
									>
										{shortDate(signup.created_at)}
									</time>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No recent registered users.</p>
				{/if}
			</article>

			<article class="panel compact-card">
				<header class="card-head">
					<h3 class="card-title">Email signups</h3>
					<span class="card-count" title="Raw rows, bots included">
						{formatCount(data.newEmailSignupsWeek)} this week
					</span>
					<a href="/admin/users" class="card-link">Open</a>
				</header>

				{#if recentEmailSignups.length > 0}
					<ul class="feed">
						{#each recentEmailSignups as signup (signup.id)}
							{@const unsubscribed = signup.unsubscribed || Boolean(signup.unsubscribed_date)}
							<li class="feed-row">
								<div class="feed-line">
									<a href={`mailto:${signup.email}`} class="feed-title">
										{signup.email || 'Unknown email'}
									</a>
									<span class="feed-meta" title={formatEmailSignupSource(signup)}>
										{formatEmailSignupSource(signup)}
									</span>
									{#if unsubscribed}
										<span
											class="feed-flag warning"
											title={unsubscribeTitle(
												signup.unsubscribe_reason,
												signup.unsubscribed_at || signup.unsubscribed_date
											)}
										>
											unsub
										</span>
									{/if}
									<time
										class="feed-date"
										datetime={signup.created_at}
										title={fullDate(signup.created_at)}
									>
										{shortDate(signup.created_at)}
									</time>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No recent email signups.</p>
				{/if}
			</article>

			<article class="panel compact-card">
				<header class="card-head">
					<h3 class="card-title">Unsubscribes</h3>
					<span class="card-count">{formatCount(data.totalUnsubscribes)} total</span>
					<a href="/admin/email-dashboard?tab=unsubscribes" class="card-link">Open</a>
				</header>

				{#if recentUnsubscribes.length > 0}
					<ul class="feed">
						{#each recentUnsubscribes as unsubscribe (unsubscribe.id)}
							<li class="feed-row">
								<div class="feed-line">
									<a href={`mailto:${unsubscribe.email}`} class="feed-title">{unsubscribe.email}</a>
									<span class="feed-meta" title={unsubscribe.reason ?? ''}>
										{unsubscribeReason(unsubscribe)}
									</span>
									<time
										class="feed-date"
										datetime={unsubscribe.unsubscribed_at}
										title={fullDate(unsubscribe.unsubscribed_at)}
									>
										{shortDate(unsubscribe.unsubscribed_at)}
									</time>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No email unsubscribes recorded.</p>
				{/if}
			</article>

			<article class="panel compact-card">
				<header class="card-head">
					<h3 class="card-title">Question activity</h3>
					<a href="/admin/questions" class="card-link">Open</a>
				</header>

				{#if questionActivity.length > 0}
					<ul class="feed">
						{#each questionActivity as question (question.questionHref + question.question)}
							<li class="feed-row">
								<div class="feed-line">
									<span
										class="feed-count"
										class:active={question.todayComments > 0}
										title={`${question.todayComments} comments today · ${question.totalComments} total`}
									>
										{question.todayComments > 0
											? `+${question.todayComments}`
											: question.totalComments}
									</span>
									<a href={question.questionHref} class="feed-title grow" title={question.question}>
										{question.question}
									</a>
									<time
										class="feed-date"
										datetime={question.createdAt ?? undefined}
										title={`Asked ${fullDate(question.createdAt)} by ${question.authorEmail}`}
									>
										{shortDate(question.createdAt)}
									</time>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-state">No question activity right now.</p>
				{/if}
			</article>
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Trending</span>
				<h2 class="section-title">Pages moving today</h2>
			</div>
			<p class="section-note">
				vs each page's previous {data.trending?.baselineDays ?? 7} days, same time of day ·
				<a href="/admin/analytics" class="inline-link">Analytics</a>
			</p>
		</div>

		{#if !trendingAvailable}
			<p class="panel empty-state">Trending analytics are unavailable right now.</p>
		{:else}
			<div class="trending-grid">
				<article class="panel compact-card">
					<header class="card-head">
						<h3 class="card-title">Real momentum</h3>
						<span class="card-count">{formatCount(trendingBroadRows.length)}</span>
					</header>
					{#if trendingBroadRows.length === 0}
						<p class="empty-state">No broad page spikes right now.</p>
					{:else}
						<ul class="feed">
							{#each trendingBroadRows as row (row.path)}
								<li class="feed-row">
									<div class="feed-line">
										<a href={row.path} class="feed-title" title={row.path}>{row.path}</a>
										<span class="feed-meta">
											{row.current_unique_visitors.toLocaleString()} uniq · {formatTrendSource(row)} ·
											{formatShortDuration(row.avg_time_on_page_ms)}
										</span>
										<span
											class="trend-num"
											title={`${formatTrendLift(row.lift_visits)} vs a ${formatTrendBaseline(row.baseline_avg_visits)}-visit baseline`}
										>
											<strong>{row.current_visits.toLocaleString()}</strong>
											<small>{formatTrendRatio(row.ratio_visits)}</small>
										</span>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</article>

				<article class="panel compact-card">
					<header class="card-head">
						<h3 class="card-title">Repeat-heavy spikes</h3>
						<span class="card-count warning">{formatCount(trendingRepeatRows.length)}</span>
					</header>
					{#if trendingRepeatRows.length === 0}
						<p class="empty-state">No concentrated repeat spikes right now.</p>
					{:else}
						<ul class="feed">
							{#each trendingRepeatRows as row (row.path)}
								<li class="feed-row">
									<div class="feed-line">
										<a href={row.path} class="feed-title" title={row.path}>{row.path}</a>
										<span class="feed-meta">
											{row.current_unique_visitors.toLocaleString()} uniq · {formatTrendSource(row)}
										</span>
										<span
											class="trend-num"
											title={`${formatTrendLift(row.lift_visits)} vs a ${formatTrendBaseline(row.baseline_avg_visits)}-visit baseline`}
										>
											<strong>{row.current_visits.toLocaleString()}</strong>
											<small>{formatTrendRatio(row.ratio_visits)}</small>
										</span>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</article>
			</div>
		{/if}
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<div class="section-copy">
				<span class="eyebrow">Raw daily rows</span>
				<h2 class="section-title">Traffic and participation</h2>
			</div>
			<p class="section-note">Last 30 days, unfiltered: bots and your own activity included</p>
		</div>

		<div class="panel chart-panel">
			<EngagementTrends data={data.dailyEngagement} />
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

	.honest-growth-mobile {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 20px;
	}

	.admin-dashboard {
		display: flex;
		flex-direction: column;
		gap: 26px;
		width: 100%;
		max-width: 100%;
		min-width: 0;
	}

	.dashboard-section,
	.dashboard-hero,
	.data-status,
	.queue-grid,
	.trending-grid {
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
		background: color-mix(in srgb, var(--warning) 9%, var(--night-deep));
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
		color: var(--lamp-glow);
		font-weight: 700;
	}

	.panel {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--stone-warm) 94%, white 6%),
			var(--stone-warm)
		);
		border: 1px solid var(--stone-warm);
		border-radius: 10px;
		box-shadow: var(--shadow-md);
		min-width: 0;
	}

	.hero-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 16px;
		border-radius: 1rem;
		border: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--stone-warm) 94%, transparent);
	}

	.hero-copy {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 12px;
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

	.hero-asof {
		font-size: 0.78rem;
		color: var(--ink-mid);
		white-space: nowrap;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.section-copy {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.eyebrow {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-mid);
	}

	/* Global h1-h3 rules add vertical padding; these headings sit in tight rows. */
	.page-title,
	.section-title,
	.card-title {
		margin: 0;
		padding: 0;
		color: var(--ink-bright);
	}

	.page-title {
		font-size: clamp(1.25rem, 2vw, 1.5rem);
		font-weight: 700;
		line-height: 1.1;
	}

	.section-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 8px 16px;
		flex-wrap: wrap;
	}

	.section-title {
		font-size: 1.15rem;
		font-weight: 700;
	}

	.section-note {
		margin: 0;
		font-size: 0.8rem;
		color: var(--ink-mid);
	}

	.inline-link,
	.card-link {
		color: var(--lamp-glow);
		text-decoration: none;
		font-weight: 600;
	}

	.inline-link:hover,
	.card-link:hover {
		text-decoration: underline;
	}

	.dashboard-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 12px;
		border-radius: 10px;
		border: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--night-deep) 88%, var(--stone-warm));
		color: var(--ink-bright);
		font-size: 0.86rem;
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

	/* Compact cards: one header line, then one line per row. */
	.queue-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
		gap: 14px;
		align-items: start;
	}

	.trending-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: 14px;
		align-items: start;
	}

	.compact-card {
		overflow: hidden;
		padding: 0;
	}

	.card-head {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--stone-warm);
		background: color-mix(in srgb, var(--night-deep) 82%, var(--stone-warm));
	}

	.card-title {
		flex: 1 1 auto;
		min-width: 0;
		font-size: 0.9rem;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card-count {
		flex: none;
		font-size: 0.74rem;
		font-weight: 600;
		color: var(--ink-mid);
		white-space: nowrap;
	}

	.card-count.attention {
		padding: 2px 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--lamp-glow) 16%, transparent);
		color: var(--lamp-glow);
		font-weight: 700;
	}

	.card-count.warning {
		color: var(--warning-text);
	}

	.card-link {
		flex: none;
		font-size: 0.78rem;
	}

	.feed {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.feed-row {
		border-top: 1px solid var(--stone-warm);
	}

	.feed-row:first-child {
		border-top: none;
	}

	.feed-row:hover,
	.feed-row.expanded {
		background: color-mix(in srgb, var(--night-deep) 84%, var(--stone-warm));
	}

	.feed-line {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 34px;
		padding: 5px 14px;
		font-size: 0.84rem;
	}

	.feed-title,
	.feed-text,
	.feed-meta {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.feed-title {
		flex: 0 1 auto;
		max-width: 62%;
		color: var(--ink-bright);
		font-weight: 600;
		text-decoration: none;
	}

	.feed-title.grow {
		flex: 1 1 auto;
		max-width: none;
	}

	a.feed-title:hover {
		color: var(--lamp-glow);
	}

	.feed-title.plain {
		font-weight: 500;
	}

	.feed-meta {
		flex: 1 1 0;
		font-size: 0.78rem;
		color: var(--ink-mid);
	}

	.feed-spacer {
		flex: 1 1 0;
	}

	/* Truncated text that expands in place; the whole line is the toggle. */
	.feed-text {
		flex: 1 1 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--ink-bright);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.feed-text.muted {
		font-size: 0.78rem;
		color: var(--ink-mid);
	}

	.feed-text:hover {
		color: var(--lamp-glow);
	}

	.feed-date {
		flex: none;
		margin-left: auto;
		font-size: 0.74rem;
		color: var(--ink-mid);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.feed-flag {
		flex: none;
		padding: 1px 6px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 45%, transparent);
		font-size: 0.66rem;
		font-weight: 700;
		color: var(--lamp-light);
	}

	.feed-flag.warning {
		border-color: color-mix(in srgb, var(--warning) 45%, transparent);
		color: var(--warning-text);
	}

	.state-chip {
		flex: none;
		min-width: 44px;
		padding: 1px 6px;
		border-radius: 999px;
		font-size: 0.66rem;
		font-weight: 700;
		text-align: center;
		color: var(--ink-mid);
		background: color-mix(in srgb, var(--stone-warm) 85%, transparent);
	}

	.state-chip[data-state='new'] {
		background: color-mix(in srgb, var(--lamp-glow) 18%, transparent);
		color: var(--lamp-glow);
	}

	.state-chip[data-state='replied'] {
		color: var(--success-text);
	}

	.feed-count {
		flex: none;
		min-width: 30px;
		font-size: 0.74rem;
		font-weight: 700;
		text-align: right;
		color: var(--ink-mid);
		font-variant-numeric: tabular-nums;
	}

	.feed-count.active {
		color: var(--success-text);
	}

	.feed-detail {
		padding: 0 14px 10px;
	}

	.feed-body {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.55;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--ink-bright);
	}

	.feed-meta-line {
		margin: 6px 0 0;
		font-size: 0.76rem;
		color: var(--ink-mid);
	}

	.trend-num {
		flex: none;
		display: inline-flex;
		align-items: baseline;
		gap: 6px;
		font-variant-numeric: tabular-nums;
	}

	.trend-num strong {
		color: var(--ink-bright);
		font-size: 0.86rem;
	}

	.trend-num small {
		min-width: 34px;
		color: var(--ink-mid);
		font-size: 0.72rem;
		text-align: right;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 700;
		color: white;
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

	.chart-panel {
		overflow: hidden;
		padding: 0;
	}

	.empty-state {
		margin: 0;
		padding: 14px;
		color: var(--ink-mid);
		font-size: 0.84rem;
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

	@media (max-width: 1100px) {
		.trending-grid {
			grid-template-columns: minmax(0, 1fr);
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

		.modal-actions {
			flex-direction: column-reverse;
		}
	}

	@media (max-width: 520px) {
		.page-title {
			font-size: 1.15rem;
		}
	}
</style>
