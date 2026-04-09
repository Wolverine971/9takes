// src/lib/server/cohortAnalytics.ts
export interface CohortFactRow {
	cohort_date: string;
	entry_surface: string;
	acquisition_source: string;
	cohort_size: number;
	commented_within_d7: number;
	signed_up_within_d7: number;
	registered_within_d7: number;
	retained_d1: number;
	retained_d3: number;
	retained_d7: number;
	retained_d14: number;
	retained_d30: number;
	engaged_ms_total_within_d7: number;
}

export interface CohortOverviewRow {
	entry_surface: string;
	new_visitors: number;
	commented_within_d7: number;
	comment_rate_denominator: number;
	comment_rate_pct: number;
	signed_up_within_d7: number;
	signup_rate_denominator: number;
	signup_rate_pct: number;
	registered_within_d7: number;
	registration_rate_denominator: number;
	registration_rate_pct: number;
	retained_d1: number;
	retained_d1_denominator: number;
	retained_d1_pct: number;
	retained_d7: number;
	retained_d7_denominator: number;
	retained_d7_pct: number;
	retained_d30: number;
	retained_d30_denominator: number;
	retained_d30_pct: number;
	avg_engaged_minutes_within_d7: number;
}

export interface SourceOverviewRow {
	acquisition_source: string;
	new_visitors: number;
	commented_within_d7: number;
	comment_rate_denominator: number;
	comment_rate_pct: number;
	signed_up_within_d7: number;
	signup_rate_denominator: number;
	signup_rate_pct: number;
	registered_within_d7: number;
	registration_rate_denominator: number;
	registration_rate_pct: number;
	retained_d7: number;
	retained_d7_denominator: number;
	retained_d7_pct: number;
	avg_engaged_minutes_within_d7: number;
}

export interface WeeklyCohortRow {
	cohort_week: string;
	cohort_week_end: string;
	new_visitors: number;
	commented_within_d7: number;
	comment_rate_denominator: number;
	comment_rate_pct: number;
	signed_up_within_d7: number;
	signup_rate_denominator: number;
	signup_rate_pct: number;
	registered_within_d7: number;
	registration_rate_denominator: number;
	registration_rate_pct: number;
	retained_d1: number;
	retained_d1_denominator: number;
	retained_d1_pct: number;
	is_mature_d1: boolean;
	retained_d3: number;
	retained_d3_denominator: number;
	retained_d3_pct: number;
	is_mature_d3: boolean;
	retained_d7: number;
	retained_d7_denominator: number;
	retained_d7_pct: number;
	is_mature_d7: boolean;
	retained_d14: number;
	retained_d14_denominator: number;
	retained_d14_pct: number;
	is_mature_d14: boolean;
	retained_d30: number;
	retained_d30_denominator: number;
	retained_d30_pct: number;
	is_mature_d30: boolean;
	avg_engaged_minutes_within_d7: number;
	is_mature_within_d7: boolean;
}

export interface AcquisitionMixRow {
	cohort_week: string;
	acquisition_source: string;
	new_visitors: number;
}

interface AggregateAccumulator {
	new_visitors: number;
	commented_within_d7: number;
	comment_rate_denominator: number;
	signed_up_within_d7: number;
	signup_rate_denominator: number;
	registered_within_d7: number;
	registration_rate_denominator: number;
	retained_d1: number;
	retained_d1_denominator: number;
	retained_d7: number;
	retained_d7_denominator: number;
	retained_d30: number;
	retained_d30_denominator: number;
	engaged_ms_total_within_d7: number;
	avg_engaged_denominator: number;
}

interface WeeklyAccumulator {
	cohort_week: string;
	cohort_week_end: string;
	new_visitors: number;
	commented_within_d7_raw: number;
	signed_up_within_d7_raw: number;
	registered_within_d7_raw: number;
	retained_d1_raw: number;
	retained_d3_raw: number;
	retained_d7_raw: number;
	retained_d14_raw: number;
	retained_d30_raw: number;
	engaged_ms_total_within_d7_raw: number;
}

interface CohortFilter {
	entrySurface?: string;
	acquisitionSource?: string;
}

function parseDate(value: string): Date {
	return new Date(`${value}T00:00:00`);
}

function toDateString(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function startOfWeek(date: Date): Date {
	const result = new Date(date);
	const day = result.getDay();
	const mondayOffset = day === 0 ? -6 : 1 - day;
	result.setDate(result.getDate() + mondayOffset);
	result.setHours(0, 0, 0, 0);
	return result;
}

function calculatePct(numerator: number, denominator: number): number {
	if (denominator <= 0) return 0;
	return Number(((numerator / denominator) * 100).toFixed(2));
}

function createAccumulator(): AggregateAccumulator {
	return {
		new_visitors: 0,
		commented_within_d7: 0,
		comment_rate_denominator: 0,
		signed_up_within_d7: 0,
		signup_rate_denominator: 0,
		registered_within_d7: 0,
		registration_rate_denominator: 0,
		retained_d1: 0,
		retained_d1_denominator: 0,
		retained_d7: 0,
		retained_d7_denominator: 0,
		retained_d30: 0,
		retained_d30_denominator: 0,
		engaged_ms_total_within_d7: 0,
		avg_engaged_denominator: 0
	};
}

function createWeeklyAccumulator(weekStart: string, weekEnd: string): WeeklyAccumulator {
	return {
		cohort_week: weekStart,
		cohort_week_end: weekEnd,
		new_visitors: 0,
		commented_within_d7_raw: 0,
		signed_up_within_d7_raw: 0,
		registered_within_d7_raw: 0,
		retained_d1_raw: 0,
		retained_d3_raw: 0,
		retained_d7_raw: 0,
		retained_d14_raw: 0,
		retained_d30_raw: 0,
		engaged_ms_total_within_d7_raw: 0
	};
}

function normalizeSurface(value: string): string {
	return value.trim() || 'other';
}

function normalizeSource(value: string): string {
	return value.trim() || 'direct';
}

function matchesFilter(row: CohortFactRow, filter: CohortFilter): boolean {
	if (filter.entrySurface && normalizeSurface(row.entry_surface) !== filter.entrySurface) {
		return false;
	}

	if (
		filter.acquisitionSource &&
		normalizeSource(row.acquisition_source) !== filter.acquisitionSource
	) {
		return false;
	}

	return true;
}

function isDateOnOrBefore(left: string, right: string): boolean {
	return left <= right;
}

function addAggregateRow(
	accumulator: AggregateAccumulator,
	row: CohortFactRow,
	analyticsToday: string
): void {
	const matureD1Cutoff = toDateString(addDays(parseDate(analyticsToday), -1));
	const matureD7Cutoff = toDateString(addDays(parseDate(analyticsToday), -7));
	const matureD30Cutoff = toDateString(addDays(parseDate(analyticsToday), -30));
	const cohortDate = row.cohort_date;

	accumulator.new_visitors += row.cohort_size;

	if (isDateOnOrBefore(cohortDate, matureD7Cutoff)) {
		accumulator.commented_within_d7 += row.commented_within_d7;
		accumulator.comment_rate_denominator += row.cohort_size;
		accumulator.signed_up_within_d7 += row.signed_up_within_d7;
		accumulator.signup_rate_denominator += row.cohort_size;
		accumulator.registered_within_d7 += row.registered_within_d7;
		accumulator.registration_rate_denominator += row.cohort_size;
		accumulator.engaged_ms_total_within_d7 += row.engaged_ms_total_within_d7;
		accumulator.avg_engaged_denominator += row.cohort_size;
		accumulator.retained_d7 += row.retained_d7;
		accumulator.retained_d7_denominator += row.cohort_size;
	}

	if (isDateOnOrBefore(cohortDate, matureD1Cutoff)) {
		accumulator.retained_d1 += row.retained_d1;
		accumulator.retained_d1_denominator += row.cohort_size;
	}

	if (isDateOnOrBefore(cohortDate, matureD30Cutoff)) {
		accumulator.retained_d30 += row.retained_d30;
		accumulator.retained_d30_denominator += row.cohort_size;
	}
}

function compareByQuality(
	left: Pick<
		CohortOverviewRow | SourceOverviewRow,
		'retained_d7_denominator' | 'retained_d7_pct' | 'registered_within_d7' | 'new_visitors'
	>,
	right: Pick<
		CohortOverviewRow | SourceOverviewRow,
		'retained_d7_denominator' | 'retained_d7_pct' | 'registered_within_d7' | 'new_visitors'
	>
): number {
	const leftMature = left.retained_d7_denominator >= 25 ? 1 : 0;
	const rightMature = right.retained_d7_denominator >= 25 ? 1 : 0;

	return (
		rightMature - leftMature ||
		right.retained_d7_pct - left.retained_d7_pct ||
		right.registered_within_d7 - left.registered_within_d7 ||
		right.new_visitors - left.new_visitors
	);
}

export function aggregateEntrySurfaceOverview(
	rows: CohortFactRow[],
	analyticsToday: string
): CohortOverviewRow[] {
	const groups = new Map<string, AggregateAccumulator>();

	for (const row of rows) {
		const key = normalizeSurface(row.entry_surface);
		if (!groups.has(key)) {
			groups.set(key, createAccumulator());
		}

		addAggregateRow(groups.get(key)!, row, analyticsToday);
	}

	return [...groups.entries()]
		.map(([entrySurface, aggregate]) => ({
			entry_surface: entrySurface,
			new_visitors: aggregate.new_visitors,
			commented_within_d7: aggregate.commented_within_d7,
			comment_rate_denominator: aggregate.comment_rate_denominator,
			comment_rate_pct: calculatePct(
				aggregate.commented_within_d7,
				aggregate.comment_rate_denominator
			),
			signed_up_within_d7: aggregate.signed_up_within_d7,
			signup_rate_denominator: aggregate.signup_rate_denominator,
			signup_rate_pct: calculatePct(
				aggregate.signed_up_within_d7,
				aggregate.signup_rate_denominator
			),
			registered_within_d7: aggregate.registered_within_d7,
			registration_rate_denominator: aggregate.registration_rate_denominator,
			registration_rate_pct: calculatePct(
				aggregate.registered_within_d7,
				aggregate.registration_rate_denominator
			),
			retained_d1: aggregate.retained_d1,
			retained_d1_denominator: aggregate.retained_d1_denominator,
			retained_d1_pct: calculatePct(aggregate.retained_d1, aggregate.retained_d1_denominator),
			retained_d7: aggregate.retained_d7,
			retained_d7_denominator: aggregate.retained_d7_denominator,
			retained_d7_pct: calculatePct(aggregate.retained_d7, aggregate.retained_d7_denominator),
			retained_d30: aggregate.retained_d30,
			retained_d30_denominator: aggregate.retained_d30_denominator,
			retained_d30_pct: calculatePct(aggregate.retained_d30, aggregate.retained_d30_denominator),
			avg_engaged_minutes_within_d7:
				aggregate.avg_engaged_denominator > 0
					? Number(
							(
								aggregate.engaged_ms_total_within_d7 /
								aggregate.avg_engaged_denominator /
								60000
							).toFixed(2)
						)
					: 0
		}))
		.sort(compareByQuality);
}

export function aggregateSourceOverview(
	rows: CohortFactRow[],
	analyticsToday: string,
	entrySurface: string
): SourceOverviewRow[] {
	if (!entrySurface) return [];

	const groups = new Map<string, AggregateAccumulator>();

	for (const row of rows) {
		if (normalizeSurface(row.entry_surface) !== entrySurface) continue;

		const key = normalizeSource(row.acquisition_source);
		if (!groups.has(key)) {
			groups.set(key, createAccumulator());
		}

		addAggregateRow(groups.get(key)!, row, analyticsToday);
	}

	return [...groups.entries()]
		.map(([source, aggregate]) => ({
			acquisition_source: source,
			new_visitors: aggregate.new_visitors,
			commented_within_d7: aggregate.commented_within_d7,
			comment_rate_denominator: aggregate.comment_rate_denominator,
			comment_rate_pct: calculatePct(
				aggregate.commented_within_d7,
				aggregate.comment_rate_denominator
			),
			signed_up_within_d7: aggregate.signed_up_within_d7,
			signup_rate_denominator: aggregate.signup_rate_denominator,
			signup_rate_pct: calculatePct(
				aggregate.signed_up_within_d7,
				aggregate.signup_rate_denominator
			),
			registered_within_d7: aggregate.registered_within_d7,
			registration_rate_denominator: aggregate.registration_rate_denominator,
			registration_rate_pct: calculatePct(
				aggregate.registered_within_d7,
				aggregate.registration_rate_denominator
			),
			retained_d7: aggregate.retained_d7,
			retained_d7_denominator: aggregate.retained_d7_denominator,
			retained_d7_pct: calculatePct(aggregate.retained_d7, aggregate.retained_d7_denominator),
			avg_engaged_minutes_within_d7:
				aggregate.avg_engaged_denominator > 0
					? Number(
							(
								aggregate.engaged_ms_total_within_d7 /
								aggregate.avg_engaged_denominator /
								60000
							).toFixed(2)
						)
					: 0
		}))
		.sort(compareByQuality);
}

export function aggregateWeeklyCohorts(
	rows: CohortFactRow[],
	analyticsToday: string,
	filter: CohortFilter = {}
): WeeklyCohortRow[] {
	const groups = new Map<string, WeeklyAccumulator>();

	for (const row of rows) {
		if (!matchesFilter(row, filter)) continue;

		const cohortDate = parseDate(row.cohort_date);
		const weekStart = startOfWeek(cohortDate);
		const weekStartKey = toDateString(weekStart);
		const weekEndKey = toDateString(addDays(weekStart, 6));

		if (!groups.has(weekStartKey)) {
			groups.set(weekStartKey, createWeeklyAccumulator(weekStartKey, weekEndKey));
		}

		const aggregate = groups.get(weekStartKey)!;
		aggregate.new_visitors += row.cohort_size;
		aggregate.commented_within_d7_raw += row.commented_within_d7;
		aggregate.signed_up_within_d7_raw += row.signed_up_within_d7;
		aggregate.registered_within_d7_raw += row.registered_within_d7;
		aggregate.retained_d1_raw += row.retained_d1;
		aggregate.retained_d3_raw += row.retained_d3;
		aggregate.retained_d7_raw += row.retained_d7;
		aggregate.retained_d14_raw += row.retained_d14;
		aggregate.retained_d30_raw += row.retained_d30;
		aggregate.engaged_ms_total_within_d7_raw += row.engaged_ms_total_within_d7;
	}

	return [...groups.values()]
		.sort((left, right) => left.cohort_week.localeCompare(right.cohort_week))
		.map((aggregate) => {
			const isMatureWithinD7 =
				aggregate.cohort_week_end <= toDateString(addDays(parseDate(analyticsToday), -7));
			const isMatureD1 =
				aggregate.cohort_week_end <= toDateString(addDays(parseDate(analyticsToday), -1));
			const isMatureD3 =
				aggregate.cohort_week_end <= toDateString(addDays(parseDate(analyticsToday), -3));
			const isMatureD7 = isMatureWithinD7;
			const isMatureD14 =
				aggregate.cohort_week_end <= toDateString(addDays(parseDate(analyticsToday), -14));
			const isMatureD30 =
				aggregate.cohort_week_end <= toDateString(addDays(parseDate(analyticsToday), -30));
			const withinD7Denominator = isMatureWithinD7 ? aggregate.new_visitors : 0;
			const retainedD1Denominator = isMatureD1 ? aggregate.new_visitors : 0;
			const retainedD3Denominator = isMatureD3 ? aggregate.new_visitors : 0;
			const retainedD7Denominator = isMatureD7 ? aggregate.new_visitors : 0;
			const retainedD14Denominator = isMatureD14 ? aggregate.new_visitors : 0;
			const retainedD30Denominator = isMatureD30 ? aggregate.new_visitors : 0;

			return {
				cohort_week: aggregate.cohort_week,
				cohort_week_end: aggregate.cohort_week_end,
				new_visitors: aggregate.new_visitors,
				commented_within_d7: isMatureWithinD7 ? aggregate.commented_within_d7_raw : 0,
				comment_rate_denominator: withinD7Denominator,
				comment_rate_pct: calculatePct(
					isMatureWithinD7 ? aggregate.commented_within_d7_raw : 0,
					withinD7Denominator
				),
				signed_up_within_d7: isMatureWithinD7 ? aggregate.signed_up_within_d7_raw : 0,
				signup_rate_denominator: withinD7Denominator,
				signup_rate_pct: calculatePct(
					isMatureWithinD7 ? aggregate.signed_up_within_d7_raw : 0,
					withinD7Denominator
				),
				registered_within_d7: isMatureWithinD7 ? aggregate.registered_within_d7_raw : 0,
				registration_rate_denominator: withinD7Denominator,
				registration_rate_pct: calculatePct(
					isMatureWithinD7 ? aggregate.registered_within_d7_raw : 0,
					withinD7Denominator
				),
				retained_d1: isMatureD1 ? aggregate.retained_d1_raw : 0,
				retained_d1_denominator: retainedD1Denominator,
				retained_d1_pct: calculatePct(
					isMatureD1 ? aggregate.retained_d1_raw : 0,
					retainedD1Denominator
				),
				is_mature_d1: isMatureD1,
				retained_d3: isMatureD3 ? aggregate.retained_d3_raw : 0,
				retained_d3_denominator: retainedD3Denominator,
				retained_d3_pct: calculatePct(
					isMatureD3 ? aggregate.retained_d3_raw : 0,
					retainedD3Denominator
				),
				is_mature_d3: isMatureD3,
				retained_d7: isMatureD7 ? aggregate.retained_d7_raw : 0,
				retained_d7_denominator: retainedD7Denominator,
				retained_d7_pct: calculatePct(
					isMatureD7 ? aggregate.retained_d7_raw : 0,
					retainedD7Denominator
				),
				is_mature_d7: isMatureD7,
				retained_d14: isMatureD14 ? aggregate.retained_d14_raw : 0,
				retained_d14_denominator: retainedD14Denominator,
				retained_d14_pct: calculatePct(
					isMatureD14 ? aggregate.retained_d14_raw : 0,
					retainedD14Denominator
				),
				is_mature_d14: isMatureD14,
				retained_d30: isMatureD30 ? aggregate.retained_d30_raw : 0,
				retained_d30_denominator: retainedD30Denominator,
				retained_d30_pct: calculatePct(
					isMatureD30 ? aggregate.retained_d30_raw : 0,
					retainedD30Denominator
				),
				is_mature_d30: isMatureD30,
				avg_engaged_minutes_within_d7:
					withinD7Denominator > 0
						? Number(
								(aggregate.engaged_ms_total_within_d7_raw / withinD7Denominator / 60000).toFixed(2)
							)
						: 0,
				is_mature_within_d7: isMatureWithinD7
			};
		});
}

export function aggregateAcquisitionMix(
	rows: CohortFactRow[],
	entrySurface = ''
): AcquisitionMixRow[] {
	const groups = new Map<string, number>();

	for (const row of rows) {
		if (entrySurface && normalizeSurface(row.entry_surface) !== entrySurface) continue;

		const weekStartKey = toDateString(startOfWeek(parseDate(row.cohort_date)));
		const sourceKey = normalizeSource(row.acquisition_source);
		const key = `${weekStartKey}::${sourceKey}`;
		groups.set(key, (groups.get(key) ?? 0) + row.cohort_size);
	}

	return [...groups.entries()]
		.map(([key, newVisitors]) => {
			const [cohortWeek, acquisitionSource] = key.split('::');
			return {
				cohort_week: cohortWeek,
				acquisition_source: acquisitionSource,
				new_visitors: newVisitors
			};
		})
		.sort(
			(left, right) =>
				left.cohort_week.localeCompare(right.cohort_week) ||
				right.new_visitors - left.new_visitors ||
				left.acquisition_source.localeCompare(right.acquisition_source)
		);
}
