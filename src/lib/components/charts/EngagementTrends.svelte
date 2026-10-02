<script lang="ts">
	import { area, curveMonotoneX, line } from 'd3';

	type EngagementDay = {
		days: string;
		visitors: number;
		visitorsWithComments: number;
		coaching: number;
		signups: number;
		userSignups: number;
		questionsAsked: number;
		commentsCreated: number;
	};
	type ActivityKey = Exclude<keyof EngagementDay, 'days' | 'visitors'>;

	let { data }: { data: EngagementDay[] } = $props();
	let selectedIndex = $state<number | null>(null);

	const activities: { key: ActivityKey; label: string; color: string }[] = [
		{ key: 'visitorsWithComments', label: 'Visitors with comments', color: '#7558a2' },
		{ key: 'coaching', label: 'Coaching', color: '#4075a9' },
		{ key: 'signups', label: 'Signups', color: '#b46b26' },
		{ key: 'userSignups', label: 'User signups', color: '#468258' },
		{ key: 'questionsAsked', label: 'Questions asked', color: '#b85576' },
		{ key: 'commentsCreated', label: 'Comments created', color: '#576b7c' }
	];
	const plot = { left: 0, right: 1000, top: 14, bottom: 190 };
	const formatCount = (value: number) => value.toLocaleString();
	const formatDay = (value: string) =>
		new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
			new Date(`${value}T00:00:00Z`)
		);
	const xAt = (index: number, count: number) =>
		plot.left + ((index + 0.5) / count) * (plot.right - plot.left);
	const yAt = (value: number, ceiling: number) =>
		plot.bottom - (value / ceiling) * (plot.bottom - plot.top);
	const totalFor = (key: ActivityKey) => days.reduce((sum, day) => sum + day[key], 0);
	const peakFor = (key: ActivityKey) => Math.max(1, ...days.map((day) => day[key]));
	const barHeight = (key: ActivityKey, value: number) =>
		value === 0 ? 2 : Math.max(4, Math.round((value / peakFor(key)) * 38));

	let days = $derived([...data].sort((a, b) => a.days.localeCompare(b.days)));
	let selectedDay = $derived(selectedIndex === null ? null : (days[selectedIndex] ?? null));
	let visitorTotal = $derived(days.reduce((sum, day) => sum + day.visitors, 0));
	let visitorPeak = $derived(Math.max(0, ...days.map((day) => day.visitors)));
	let visitorCeiling = $derived(Math.max(1, Math.ceil(visitorPeak / 100) * 100));
	let visitorAverage = $derived(days.length ? Math.round(visitorTotal / days.length) : 0);
	let visitorLine = $derived.by(
		() =>
			line<EngagementDay>()
				.x((_, index) => xAt(index, days.length))
				.y((day) => yAt(day.visitors, visitorCeiling))
				.curve(curveMonotoneX)(days) ?? ''
	);
	let visitorArea = $derived.by(
		() =>
			area<EngagementDay>()
				.x((_, index) => xAt(index, days.length))
				.y0(plot.bottom)
				.y1((day) => yAt(day.visitors, visitorCeiling))
				.curve(curveMonotoneX)(days) ?? ''
	);
	let dateTicks = $derived(
		[0, 7, 14, 21, days.length - 1].filter(
			(index, position, ticks) =>
				index >= 0 && index < days.length && ticks.indexOf(index) === position
		)
	);
</script>

<div class="engagement-trends">
	{#if days.length === 0}
		<p class="empty-state">Daily traffic and participation are unavailable right now.</p>
	{:else}
		<div class="trend-header">
			<div class="visitor-heading">
				<h3>Raw visitors</h3>
				<div class="visitor-stats">
					<div><strong>{formatCount(visitorTotal)}</strong><span>30-day total</span></div>
					<div><strong>{formatCount(visitorAverage)}</strong><span>Daily avg</span></div>
					<div><strong>{formatCount(visitorPeak)}</strong><span>Peak</span></div>
				</div>
			</div>
			<div class="selected-day" aria-live="polite">
				{#if selectedDay}
					<span>{formatDay(selectedDay.days)} · UTC</span>
					<strong>{formatCount(selectedDay.visitors)} visitors</strong>
				{:else}
					<span>Daily detail</span>
					<strong>Hover or focus a date</strong>
				{/if}
			</div>
		</div>

		<div class="visitor-grid">
			<div class="visitor-scale" aria-hidden="true">
				<span>{formatCount(visitorCeiling)}</span>
				<span>{formatCount(visitorCeiling / 2)}</span>
				<span>0</span>
			</div>
			<div class="visitor-plot">
				<svg
					viewBox="0 0 1000 200"
					preserveAspectRatio="none"
					role="img"
					aria-label="Daily raw visitors over the last 30 days, bots included"
				>
					<defs>
						<linearGradient id="engagement-visitor-fill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stop-color="#147b73" stop-opacity="0.3" />
							<stop offset="100%" stop-color="#147b73" stop-opacity="0.02" />
						</linearGradient>
					</defs>
					{#each [0, 0.5, 1] as fraction (fraction)}
						<line
							x1={plot.left}
							x2={plot.right}
							y1={yAt(visitorCeiling * fraction, visitorCeiling)}
							y2={yAt(visitorCeiling * fraction, visitorCeiling)}
							class="grid-line"
						/>
					{/each}
					<path d={visitorArea} fill="url(#engagement-visitor-fill)" />
					<path d={visitorLine} class="visitor-line" />
					{#if selectedDay && selectedIndex !== null}
						<line
							x1={xAt(selectedIndex, days.length)}
							x2={xAt(selectedIndex, days.length)}
							y1={plot.top}
							y2={plot.bottom}
							class="focus-line"
						/>
						<circle
							cx={xAt(selectedIndex, days.length)}
							cy={yAt(selectedDay.visitors, visitorCeiling)}
							r="5"
							class="focus-point"
						/>
					{/if}
				</svg>
				<div class="day-targets" style:--day-count={days.length}>
					{#each days as day, index (day.days)}
						<button
							type="button"
							aria-label={`${formatDay(day.days)}: ${formatCount(day.visitors)} visitors`}
							aria-pressed={selectedIndex === index}
							onmouseenter={() => (selectedIndex = index)}
							onfocus={() => (selectedIndex = index)}
							onclick={() => (selectedIndex = index)}
						></button>
					{/each}
				</div>
				<div class="axis-dates" aria-hidden="true">
					{#each dateTicks as index (index)}
						<span style:left={`${((index + 0.5) / days.length) * 100}%`}>
							{formatDay(days[index].days)}
						</span>
					{/each}
				</div>
			</div>
			<div aria-hidden="true"></div>
		</div>

		<div class="activity-heading">
			<h4>Participation</h4>
			<span>Each row uses its own peak to show the daily pattern</span>
		</div>
		<div class="activity-rows">
			{#each activities as activity (activity.key)}
				<div class="activity-row" style:--activity-color={activity.color}>
					<div class="activity-label">
						<span class="activity-name"><i aria-hidden="true"></i>{activity.label}</span>
						<span class="activity-total"
							>{formatCount(totalFor(activity.key))} <small>30d</small></span
						>
					</div>
					<div class="activity-bars" aria-label={`${activity.label} by day`}>
						{#each days as day, index (day.days)}
							<button
								type="button"
								class:chosen={selectedIndex === index}
								tabindex="-1"
								aria-label={`${formatDay(day.days)}: ${formatCount(day[activity.key])} ${activity.label.toLowerCase()}`}
								style:height={`${barHeight(activity.key, day[activity.key])}px`}
								onmouseenter={() => (selectedIndex = index)}
								onclick={() => (selectedIndex = index)}
							></button>
						{/each}
					</div>
					<div class="activity-day-count">
						{#if selectedDay}<strong>{formatCount(selectedDay[activity.key])}</strong><small
								>selected day</small
							>{/if}
					</div>
				</div>
			{/each}
		</div>

		<p class="chart-note">
			<strong>Raw rows.</strong> Most daily visitors are bots, and comments, signups and coaching include
			your own activity, removed comments and known bot waves. Use Honest growth for the filtered weekly
			view. Daily unique visitors are based on tracked site visits. Visitors with comments are those who
			also posted a question comment that day. Coaching counts waitlist entries. Signups are email signups;
			user signups are account registrations. Today is partial. Dates use UTC.
		</p>
		<details class="daily-data">
			<summary>View exact daily counts</summary>
			<div class="table-scroll">
				<table>
					<thead
						><tr
							><th>Date</th><th>Visitors</th>{#each activities as activity (activity.key)}<th
									>{activity.label}</th
								>{/each}</tr
						></thead
					>
					<tbody>
						{#each [...days].reverse() as day (day.days)}
							<tr
								><th>{formatDay(day.days)}</th><td>{formatCount(day.visitors)}</td
								>{#each activities as activity (activity.key)}<td
										>{formatCount(day[activity.key])}</td
									>{/each}</tr
							>
						{/each}
					</tbody>
				</table>
			</div>
		</details>
	{/if}
</div>

<style>
	.engagement-trends {
		padding: 22px 22px 16px;
		color: var(--ink-bright);
	}
	.trend-header {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		align-items: flex-start;
	}
	h3,
	h4 {
		margin: 0;
		font-weight: 700;
	}
	h3 {
		font-size: 1rem;
	}
	h4 {
		font-size: 0.9rem;
	}
	.visitor-stats {
		display: flex;
		gap: 28px;
		margin-top: 15px;
	}
	.visitor-stats div,
	.selected-day {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.visitor-stats strong {
		font-size: 1.2rem;
		line-height: 1.1;
	}
	.visitor-stats span,
	.selected-day span {
		font-size: 0.69rem;
		color: var(--ink-mid);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.selected-day {
		min-width: 144px;
		padding: 9px 13px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		text-align: right;
	}
	.selected-day strong {
		font-size: 0.86rem;
	}
	.visitor-grid {
		display: grid;
		grid-template-columns: minmax(172px, 220px) minmax(0, 1fr) 72px;
		align-items: start;
		gap: 16px;
		margin: 18px 0 6px;
	}
	.visitor-scale {
		position: relative;
		height: 190px;
		color: var(--ink-mid);
		font-size: 0.69rem;
		text-align: right;
	}
	.visitor-scale span {
		position: absolute;
		right: 0;
	}
	.visitor-scale span:first-child {
		top: 7px;
	}
	.visitor-scale span:nth-child(2) {
		top: 87px;
	}
	.visitor-scale span:last-child {
		bottom: 3px;
	}
	.visitor-plot {
		position: relative;
		min-width: 0;
	}
	svg {
		display: block;
		width: 100%;
		height: 190px;
	}
	.grid-line {
		stroke: var(--stone-edge);
		stroke-dasharray: 4 5;
	}
	.visitor-line {
		fill: none;
		stroke: #147b73;
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.focus-line {
		stroke: #147b73;
		stroke-width: 1;
		stroke-dasharray: 4 4;
		opacity: 0.7;
	}
	.focus-point {
		fill: #147b73;
		stroke: white;
		stroke-width: 2;
	}
	.day-targets {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 190px;
		display: grid;
		grid-template-columns: repeat(var(--day-count), minmax(0, 1fr));
	}
	.day-targets button {
		border: 0;
		padding: 0;
		background: transparent;
		cursor: crosshair;
	}
	.day-targets button:focus-visible {
		outline: 2px solid #147b73;
		outline-offset: -2px;
	}
	.axis-dates {
		position: relative;
		height: 22px;
		color: var(--ink-mid);
		font-size: 0.69rem;
	}
	.axis-dates span {
		position: absolute;
		transform: translateX(-50%);
		white-space: nowrap;
	}
	.activity-heading {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin: 10px 0 6px;
		padding-top: 16px;
		border-top: 1px solid var(--stone-edge);
	}
	.activity-heading span {
		font-size: 0.72rem;
		color: var(--ink-mid);
	}
	.activity-rows {
		display: grid;
		gap: 0;
	}
	.activity-row {
		display: grid;
		grid-template-columns: minmax(172px, 220px) minmax(0, 1fr) 72px;
		align-items: center;
		gap: 16px;
		min-height: 59px;
		border-bottom: 1px solid var(--stone-edge);
	}
	.activity-label {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.activity-name {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.81rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.activity-name i {
		display: inline-block;
		width: 8px;
		height: 8px;
		flex: none;
		border-radius: 50%;
		background: var(--activity-color);
	}
	.activity-total {
		padding-left: 16px;
		font-size: 0.76rem;
		font-weight: 700;
	}
	.activity-total small,
	.activity-day-count small {
		color: var(--ink-mid);
		font-size: 0.68rem;
		font-weight: 400;
	}
	.activity-total small {
		margin-left: 4px;
	}
	.activity-bars {
		display: grid;
		grid-template-columns: repeat(30, minmax(0, 1fr));
		align-items: end;
		gap: 2px;
		height: 40px;
	}
	.activity-bars button {
		width: 100%;
		min-width: 0;
		padding: 0;
		border: 0;
		border-radius: 4px 4px 0 0;
		background: var(--activity-color);
		opacity: 0.68;
		cursor: pointer;
	}
	.activity-bars button:hover,
	.activity-bars button.chosen {
		opacity: 1;
		box-shadow: 0 0 0 1px var(--activity-color);
	}
	.activity-day-count {
		display: flex;
		flex-direction: column;
		text-align: right;
		min-width: 0;
	}
	.activity-day-count strong {
		font-size: 0.8rem;
	}
	.chart-note {
		margin: 16px 0 0;
		color: var(--ink-mid);
		font-size: 0.72rem;
		line-height: 1.5;
	}
	.daily-data {
		margin-top: 12px;
		font-size: 0.75rem;
	}
	summary {
		width: fit-content;
		cursor: pointer;
		color: var(--data-teal);
		font-weight: 600;
	}
	.table-scroll {
		overflow-x: auto;
		max-height: 420px;
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
	th:first-child,
	td:first-child {
		text-align: left;
	}
	thead {
		position: sticky;
		top: 0;
		background: var(--stone-warm);
	}
	.empty-state {
		margin: 0;
		padding: 30px;
		color: var(--ink-mid);
	}
	@media (max-width: 1100px) {
		.visitor-grid,
		.activity-row {
			grid-template-columns: 170px minmax(0, 1fr) 55px;
			gap: 8px;
		}
		.activity-name {
			font-size: 0.74rem;
		}
		.activity-bars {
			gap: 1px;
		}
	}
</style>
