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
				'People with 10+ seconds of engaged time that week. Bots that never engage and your own devices are excluded. Returning = first seen in an earlier week.',
			raw: (week) => week.rawVisitors,
			rawLabel: 'tracked visitors, bots included',
			extra: (week) => `${formatCount(week.returningHumanVisitors)} returning`,
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
				// Whole window, not just last week: these are too rare to read weekly.
				return `${all.length} wks: ${sum((w) => w.waitlistAdds)} waitlist · ${sum((w) => w.talkNotes)} notes · ${sum((w) => w.consultingSessions)} sessions`;
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
						<h3 title={tile.metric.definition}>{tile.metric.label}</h3>
						<span class="verdict" title={verdictDetail(tile.verdict, fullWeeks.length)}>
							{tile.verdict.label}
						</span>
					</header>

					<div class="headline">
						<strong>{formatCount(tile.lastValue)}</strong>
						<span>last week</span>
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

					<p class="detail">
						This week <strong>{formatCount(tile.current)}</strong>
						<span
							>so far ({trends.currentWeekDays}/7d) · avg {formatAverage(
								tile.verdict.average
							)}/wk</span
						>
					</p>
				</article>
			{/each}
		</div>

		<div class="growth-footer">
			<details class="definitions">
				<summary>How these are counted</summary>
				<p class="growth-note">
					Weeks run Monday to Sunday, Eastern time{lastFullWeek
						? `; last week is ${formatWeekRange(lastFullWeek.weekStart)}`
						: ''}. Each bar is one week, the striped bar is this week so far, and the dashed line is
					the {fullWeeks.length}-week average. Visitor counts refresh about twice a day.
				</p>
				<dl>
					{#each tiles as tile (tile.metric.key)}
						<div>
							<dt>{tile.metric.label}</dt>
							<dd>
								{tile.metric.definition}
								{#if tile.lastRaw !== null}
									<span class="raw">
										Raw last week: {formatCount(tile.lastRaw)}
										{tile.metric.rawLabel}{tile.filteredShare !== null
											? ` (${tile.filteredShare}% filtered out)`
											: ''}.
									</span>
								{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</details>

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
										>{formatCount(week.bookings)}
										<small>/ {formatCount(week.rawBookings)}</small></td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</details>
		</div>
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
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
	}

	.tile {
		--tone-color: var(--ink-mid);
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
		padding: 12px 14px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
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
		padding: 0;
		min-width: 0;
		cursor: help;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-mid);
	}

	.verdict {
		flex: none;
		padding: 2px 8px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--tone-color) 45%, transparent);
		background: color-mix(in srgb, var(--tone-color) 12%, transparent);
		color: var(--tone-color);
		font-size: 0.68rem;
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
		font-size: 1.6rem;
		line-height: 1;
		color: var(--ink-bright);
	}

	.headline span,
	.extra {
		font-size: 0.78rem;
		color: var(--ink-mid);
	}

	.extra {
		margin: -4px 0 0;
	}

	.bars {
		position: relative;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(0, 1fr);
		grid-template-rows: 100%;
		align-items: end;
		gap: 2px;
		height: 36px;
		margin-top: 2px;
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

	.detail {
		margin: 0;
		font-size: 0.74rem;
		line-height: 1.4;
		color: var(--ink-bright);
	}

	.detail span {
		color: var(--ink-mid);
	}

	.growth-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
	}

	.growth-footer details[open] {
		flex-basis: 100%;
	}

	.growth-note {
		margin: 10px 0 0;
		font-size: 0.74rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.definitions,
	.weekly-data {
		font-size: 0.78rem;
	}

	.definitions dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 10px 20px;
		margin: 10px 0 0;
	}

	.definitions dt {
		font-weight: 700;
		color: var(--ink-bright);
	}

	.definitions dd {
		margin: 2px 0 0;
		line-height: 1.45;
		color: var(--ink-mid);
	}

	.raw {
		display: block;
		margin-top: 2px;
		color: var(--ink-muted);
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
		.tile-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 8px;
		}

		.tile {
			padding: 10px 12px;
		}

		/* Two narrow columns: the verdict drops under the label instead of squeezing it. */
		.tile-header {
			flex-wrap: wrap;
			align-items: flex-start;
			gap: 4px;
		}

		.headline strong {
			font-size: 1.35rem;
		}

		.detail span {
			display: block;
		}
	}
</style>
