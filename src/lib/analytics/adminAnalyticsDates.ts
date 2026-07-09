export const ADMIN_ANALYTICS_TIME_ZONE = 'UTC' as const;

export function toUtcDateString(date: Date): string {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function startOfUtcWeek(date: Date): Date {
	const result = new Date(date);
	const day = result.getUTCDay();
	const mondayOffset = day === 0 ? -6 : 1 - day;
	result.setUTCDate(result.getUTCDate() + mondayOffset);
	result.setUTCHours(0, 0, 0, 0);
	return result;
}

export function startOfUtcMonth(date: Date): Date {
	const result = new Date(date);
	result.setUTCDate(1);
	result.setUTCHours(0, 0, 0, 0);
	return result;
}

export function endOfUtcDay(date: string): Date {
	return new Date(`${date}T23:59:59.999Z`);
}

export function getCompletedUtcWeeksRange(
	anchorDate: Date,
	weeks: number
): { from: string; to: string } {
	const to = startOfUtcWeek(anchorDate);
	to.setUTCDate(to.getUTCDate() - 1);

	const from = new Date(to);
	from.setUTCDate(from.getUTCDate() - (weeks * 7 - 1));

	return {
		from: toUtcDateString(from),
		to: toUtcDateString(to)
	};
}
