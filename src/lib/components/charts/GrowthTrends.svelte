<!-- src/lib/components/charts/GrowthTrends.svelte -->
<!--
	Honest weekly growth: human-filtered counts from admin_engagement_trends_weekly_v2,
	with raw row counts as secondary context. Each metric gets 26 full weeks of bars,
	a dashed 26-week average, and a verdict so "just dropped" and "never moved" read
	differently.
-->
<script module lang="ts">
	export type GrowthTrendWeek = {
		weekStart: string;
		humanVisitors: number;
		returningHumanVisitors: number;
		rawVisitors: number;
		humanComments: number;
		rawComments: number;
		contributors: number;
		returningContributors: number;
		realSignups: number;
		rawSignups: number;
		registrations: number;
		rawRegistrations: number;
		bookings: number;
		rawBookings: number;
		waitlistAdds: number;
		talkNotes: number;
		consultingSessions: number;
	};

	export type GrowthTrendsPayload = {
		status: 'ready' | 'migration_pending' | 'unavailable';
		/** Oldest first. The last row is the current, partial week. */
		weeks: GrowthTrendWeek[];
		/** Days of the current week elapsed so far (1-7, America/New_York). */
		currentWeekDays: number;
		migration: string;
	};

	export type TrendVerdict = {
		tone: 'flat' | 'rare' | 'down' | 'up' | 'steady';
		label: string;
		average: number;
		recent: number;
		activeWeeks: number;
	};

	/**
	 * Classify a series of full weeks (oldest first). Recent = last 4 weeks.
	 * - flat:    zero every week ("never moved", not a drop)
	 * - rare:    averages under one a week, so week-to-week swings are noise
	 * - down/up: the last 4 weeks are at or below 60% / at or above 140% of the
	 *            average AND the gap is beyond ~2 standard deviations of count noise
	 *            (Poisson), so a 3-vs-5 wobble on a small count reads as steady.
	 */
	export function trendVerdict(fullWeeks: number[]): TrendVerdict {
		const total = fullWeeks.reduce((sum, value) => sum + value, 0);
		const average = fullWeeks.length ? total / fullWeeks.length : 0;
		const recentWeeks = fullWeeks.slice(-4);
		const recentTotal = recentWeeks.reduce((sum, value) => sum + value, 0);
		const recent = recentWeeks.length ? recentTotal / recentWeeks.length : 0;
		const activeWeeks = fullWeeks.filter((value) => value > 0).length;
		const base = { average, recent, activeWeeks };

		const expected = average * recentWeeks.length;
		const beyondNoise = Math.abs(recentTotal - expected) >= 2 * Math.sqrt(expected);

		if (total === 0) return { tone: 'flat', label: 'Never moved', ...base };
		if (average < 1) return { tone: 'rare', label: 'Rare', ...base };
		if (recent <= average * 0.6 && beyondNoise) {
			return { tone: 'down', label: 'Below usual', ...base };
		}
		if (recent >= average * 1.4 && beyondNoise) {
			return { tone: 'up', label: 'Above usual', ...base };
		}
		return { tone: 'steady', label: 'Steady', ...base };
	}
</script>

<script lang="ts">
	type MetricKey =
		| 'humanVisitors'
		| 'humanComments'
		| 'contributors'
		| 'realSignups'
		| 'registrations'
		| 'bookings';

	type Metric = {
		key: MetricKey;
		label: string;
		definition: string;
		raw?: (week: GrowthTrendWeek) => number;
		rawLabel?: string;
		/** Context line under the headline; gets the last full week and every week. */
		extra?: (lastFull: GrowthTrendWeek, all: GrowthTrendWeek[]) => string;
		showFilteredShare?: boolean;
	};

	let { trends }: { trends: GrowthTrendsPayload } = $props();

	const formatCount = (value: number) => Math.round(value).toLocaleString();
	const formatAverage = (value: number) =>
		value >= 10 || value === 0 ? formatCount(value) : value.toFixed(1);
	const dayFormat = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC'
	});
	const formatWeekStart = (weekStart: string) =>
		dayFormat.format(new Date(`${weekStart}T00:00:00Z`));
	const formatWeekRange = (weekStart: string) => {
		const start = new Date(`${weekStart}T00:00:00Z`);
		const end = new Date(start.getTime() + 6 * 86_400_000);
		return `${dayFormat.format(start)} – ${dayFormat.format(end)}`;
	};

	const metrics: Metric[] = [
		{
			key: 'humanVisitors',
			label: 'Engaged visitors',
			definition:
				'People with 10+ seconds of engaged time that week. Bots that never engage and your own devices are excluded.',
			raw: (week) => week.rawVisitors,
			rawLabel: 'tracked visitors, bots included',
			extra: (week) =>
				`${formatCount(week.returningHumanVisitors)} returning (first seen in an earlier week)`,
			showFilteredShare: true
		},
		{
			key: 'humanComments',
			label: 'Human comments',
			definition:
				'Question answers, replies and personality-page comments from people other than you. Removed comments and AI takes are excluded.',
			raw: (week) => week.rawComments,
			rawLabel: 'comment rows, incl. yours + removed'
		},
		{
			key: 'contributors',
			label: 'Contributors',
			definition:
				'Distinct people who left a human comment that week. Returning means they had commented in an earlier week.',
			extra: (week) => `${formatCount(week.returningContributors)} returning`
		},
		{
			key: 'realSignups',
			label: 'Email signups',
			definition:
				'Newsletter signups minus known bots: quarantined emails, login-page-first landings (the June wave), dotted-Gmail patterns, auth abuse.',
			raw: (week) => week.rawSignups,
			rawLabel: 'signup rows'
		},
		{
			key: 'registrations',
			label: 'Registrations',
			definition: 'New accounts, excluding admins and emails already flagged as bots.',
			raw: (week) => week.rawRegistrations,
			rawLabel: 'profile rows'
		},
		{
			key: 'bookings',
			label: 'Bookings',
			definition:
				'Real coaching-waitlist adds + Talk to DJ notes + consulting sessions. Flagged bot waitlist rows are excluded.',
			raw: (week) => week.rawBookings,
			rawLabel: 'rows across all three',
			extra: (_lastFull, all) => {
				const sum = (pick: (week: GrowthTrendWeek) => number) =>
					all.reduce((total, week) => total + pick(week), 0);
				return `Whole window: ${sum((w) => w.waitlistAdds)} waitlist · ${sum((w) => w.talkNotes)} notes · ${sum((w) => w.consultingSessions)} sessions`;
			}
		}
	];

	let weeks = $derived(trends.weeks);
	let currentWeek = $derived(weeks.at(-1) ?? null);
	let fullWeeks = $derived(weeks.slice(0, -1));
	let lastFullWeek = $derived(fullWeeks.at(-1) ?? null);

	let tiles = $derived(
		metrics.map((metric) => {
			const series = fullWeeks.map((week) => week[metric.key]);
			const verdict = trendVerdict(series);
			const current = currentWeek ? currentWeek[metric.key] : 0;
			const ceiling = Math.max(1, verdict.average, current, ...series);
			const bars = weeks.map((week, index) => ({
				weekStart: week.weekStart,
				value: week[metric.key],
				raw: metric.raw ? metric.raw(week) : null,
				partial: index === weeks.length - 1,
				height: (week[metric.key] / ceiling) * 100
			}));
			const lastValue = lastFullWeek ? lastFullWeek[metric.key] : 0;
			const lastRaw = lastFullWeek && metric.raw ? metric.raw(lastFullWeek) : null;
			return {
				metric,
				verdict,
				lastValue,
				lastRaw,
				filteredShare:
					metric.showFilteredShare && lastRaw
						? Math.max(0, Math.round((1 - lastValue / lastRaw) * 100))
						: null,
				lastExtra: lastFullWeek && metric.extra ? metric.extra(lastFullWeek, weeks) : null,
				current,
				averageLine: (verdict.average / ceiling) * 100,
				bars
			};
		})
	);

	const verdictDetail = (verdict: TrendVerdict, weekCount: number) => {
		if (verdict.tone === 'flat') return `Zero in all ${weekCount} full weeks`;
		if (verdict.tone === 'rare') return `Happened in ${verdict.activeWeeks} of ${weekCount} weeks`;
		return `Last 4 wks ${formatAverage(verdict.recent)}/wk vs ${formatAverage(verdict.average)}/wk avg`;
	};
</script>

<div class="growth-trends">
	{#if trends.status !== 'ready' || weeks.length < 2}
		<div class="growth-pending" role="status">
			{#if trends.status === 'migration_pending'}
				<strong>Honest weekly numbers are waiting on one database migration.</strong>
				<p>
					Apply <code>{trends.migration}</code> in Supabase. Until then, everything below is raw rows:
					most visitors are bots, and comments include your own replies.
				</p>
			{:else}
				<strong>Honest weekly numbers couldn’t load right now.</strong>
				<p>
					Everything below is raw rows: most visitors are bots, and comments include your own
					replies.
				</p>
			{/if}
		</div>
	{:else}
		<div class="tile-grid">
			{#each tiles as tile (tile.metric.key)}
				<article class="tile" data-tone={tile.verdict.tone}>
					<header class="tile-header">
						<h3>{tile.metric.label}</h3>
						<span class="verdict">{tile.verdict.label}</span>
					</header>

					<div class="headline">
						<strong>{formatCount(tile.lastValue)}</strong>
						<span>
							last full week{lastFullWeek ? ` · ${formatWeekRange(lastFullWeek.weekStart)}` : ''}
						</span>
					</div>
					{#if tile.lastExtra}
						<p class="extra">{tile.lastExtra}</p>
					{/if}

					<div
						class="bars"
						role="img"
						aria-label={`${tile.metric.label}, ${fullWeeks.length} full weeks plus this week. ${verdictDetail(tile.verdict, fullWeeks.length)}.`}
					>
						{#each tile.bars as bar (bar.weekStart)}
							<span
								class="bar"
								class:partial={bar.partial}
								class:zero={bar.value === 0}
								style:height={bar.value === 0 ? '2px' : `${Math.max(bar.height, 4)}%`}
								title={`${formatWeekStart(bar.weekStart)}${bar.partial ? ' (so far)' : ''}: ${formatCount(bar.value)}${bar.raw !== null ? ` · raw ${formatCount(bar.raw)}` : ''}`}
							></span>
						{/each}
						{#if tile.verdict.average > 0}
							<span class="average-line" style:bottom={`${tile.averageLine}%`} aria-hidden="true"
							></span>
						{/if}
					</div>
					<div class="bar-axis" aria-hidden="true">
						<span>{weeks[0] ? formatWeekStart(weeks[0].weekStart) : ''}</span>
						<span class="legend"><i></i>{fullWeeks.length}-wk avg</span>
						<span>This week</span>
					</div>

					<p class="detail">
						{verdictDetail(tile.verdict, fullWeeks.length)} · This week so far:
						<strong>{formatCount(tile.current)}</strong>
						({trends.currentWeekDays}/7 days)
					</p>

					{#if tile.lastRaw !== null}
						<p class="raw">
							Raw last week: {formatCount(tile.lastRaw)}
							{tile.metric.rawLabel}{tile.filteredShare !== null
								? ` (${tile.filteredShare}% filtered out)`
								: ''}
						</p>
					{/if}
					<p class="definition">{tile.metric.definition}</p>
				</article>
			{/each}
		</div>

		<p class="growth-note">
			Weeks run Monday to Sunday, Eastern time. Each bar is one week; the faded bar is this week so
			far. Visitor counts refresh about twice a day.
		</p>

		<details class="weekly-data">
			<summary>View weekly numbers (human / raw)</summary>
			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							<th>Week of</th>
							<th>Visitors</th>
							<th>Returning</th>
							<th>Comments</th>
							<th>Contributors</th>
							<th>Signups</th>
							<th>Registrations</th>
							<th>Bookings</th>
						</tr>
					</thead>
					<tbody>
						{#each [...weeks].reverse() as week, index (week.weekStart)}
							<tr>
								<th>{formatWeekStart(week.weekStart)}{index === 0 ? ' (so far)' : ''}</th>
								<td
									>{formatCount(week.humanVisitors)}
									<small>/ {formatCount(week.rawVisitors)}</small></td
								>
								<td>{formatCount(week.returningHumanVisitors)}</td>
								<td
									>{formatCount(week.humanComments)}
									<small>/ {formatCount(week.rawComments)}</small></td
								>
								<td>
									{formatCount(week.contributors)}
									<small>({formatCount(week.returningContributors)} returning)</small>
								</td>
								<td
									>{formatCount(week.realSignups)}
									<small>/ {formatCount(week.rawSignups)}</small></td
								>
								<td>
									{formatCount(week.registrations)}
									<small>/ {formatCount(week.rawRegistrations)}</small>
								</td>
								<td
									>{formatCount(week.bookings)} <small>/ {formatCount(week.rawBookings)}</small></td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</details>
	{/if}
</div>

<style>
	.growth-trends {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-width: 0;
		color: var(--ink-bright);
	}

	.growth-pending {
		padding: 16px 18px;
		border: 1px solid color-mix(in srgb, var(--warning) 45%, transparent);
		border-radius: 10px;
		background: color-mix(in srgb, var(--warning) 9%, var(--night-deep));
	}

	.growth-pending p {
		margin: 6px 0 0;
		color: var(--ink-mid);
		line-height: 1.5;
	}

	.growth-pending code {
		font-size: 0.82rem;
		overflow-wrap: anywhere;
	}

	.tile-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 16px;
	}

	.tile {
		--tone-color: var(--ink-mid);
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		padding: 18px 20px 16px;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--stone-warm) 94%, white 6%),
			var(--stone-warm)
		);
		box-shadow: var(--shadow-md);
	}

	.tile[data-tone='steady'] {
		--tone-color: var(--data-teal);
	}

	.tile[data-tone='up'] {
		--tone-color: var(--success-text);
	}

	.tile[data-tone='down'] {
		--tone-color: var(--warning-text);
	}

	.tile-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	h3 {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-mid);
	}

	.verdict {
		flex: none;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--tone-color) 45%, transparent);
		background: color-mix(in srgb, var(--tone-color) 12%, transparent);
		color: var(--tone-color);
		font-size: 0.72rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.headline {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 4px 10px;
	}

	.headline strong {
		font-size: 2rem;
		line-height: 1;
		color: var(--ink-bright);
	}

	.headline span,
	.extra {
		font-size: 0.78rem;
		color: var(--ink-mid);
	}

	.extra {
		margin: -2px 0 0;
	}

	.bars {
		position: relative;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		grid-template-rows: 100%;
		align-items: end;
		gap: 2px;
		height: 56px;
		margin-top: 6px;
		border-bottom: 1px solid var(--stone-edge);
	}

	.bar {
		display: block;
		width: 100%;
		border-radius: 4px 4px 0 0;
		background: var(--lamp-glow);
		opacity: 0.8;
	}

	.bar.zero {
		background: var(--stone-mid);
		opacity: 0.7;
	}

	.bar.partial {
		background: repeating-linear-gradient(
			135deg,
			var(--lamp-glow) 0 3px,
			color-mix(in srgb, var(--lamp-glow) 35%, transparent) 3px 6px
		);
		opacity: 0.6;
	}

	.bar.partial.zero {
		background: var(--stone-mid);
	}

	.average-line {
		position: absolute;
		left: 0;
		right: 0;
		height: 0;
		border-top: 1px dashed var(--ink-mid);
		pointer-events: none;
	}

	.bar-axis {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 0.66rem;
		color: var(--ink-muted);
	}

	.legend {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.legend i {
		display: inline-block;
		width: 14px;
		border-top: 1px dashed var(--ink-mid);
	}

	.detail,
	.raw,
	.definition {
		margin: 0;
		font-size: 0.76rem;
		line-height: 1.45;
	}

	.detail {
		color: var(--ink-bright);
	}

	.raw {
		color: var(--ink-mid);
	}

	.definition {
		padding-top: 8px;
		border-top: 1px solid var(--stone-edge);
		color: var(--ink-muted);
	}

	.growth-note {
		margin: 0;
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.weekly-data {
		font-size: 0.78rem;
	}

	summary {
		width: fit-content;
		cursor: pointer;
		color: var(--lamp-glow);
		font-weight: 600;
	}

	.table-scroll {
		overflow-x: auto;
		max-height: 440px;
		margin-top: 10px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: right;
		white-space: nowrap;
	}

	th,
	td {
		padding: 7px 10px;
		border-bottom: 1px solid var(--stone-edge);
	}

	th:first-child {
		text-align: left;
	}

	thead {
		position: sticky;
		top: 0;
		background: var(--stone-warm);
	}

	td small {
		color: var(--ink-mid);
	}

	@media (max-width: 520px) {
		.tile {
			padding: 16px;
		}

		.headline strong {
			font-size: 1.6rem;
		}
	}
</style>
