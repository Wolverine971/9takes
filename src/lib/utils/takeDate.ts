// src/lib/utils/takeDate.ts

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function parse(timestamp: string | null | undefined): Date | null {
	if (!timestamp) return null;
	const date = new Date(timestamp);
	return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * The short date shown beside a take's author: "just now", "12m ago", "5h ago",
 * "3d ago" for the first week, then "Nov 7" in the current year and "Jul 2023"
 * before it. Null when the timestamp is missing or unreadable.
 *
 * `timeZone` defaults to the runtime's zone (the reader's, in the browser).
 */
export function formatTakeDate(
	timestamp: string | null | undefined,
	now: Date = new Date(),
	timeZone?: string
): string | null {
	const date = parse(timestamp);
	if (!date) return null;

	// A reader's clock running behind the server puts a new take in the "future".
	const age = Math.max(0, now.getTime() - date.getTime());
	if (age < MINUTE) return 'just now';
	if (age < HOUR) return `${Math.floor(age / MINUTE)}m ago`;
	if (age < DAY) return `${Math.floor(age / HOUR)}h ago`;
	if (age < 7 * DAY) return `${Math.floor(age / DAY)}d ago`;

	const year = (value: Date) => value.toLocaleDateString('en-US', { year: 'numeric', timeZone });
	return year(date) === year(now)
		? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone })
		: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone });
}

/** The exact moment, for the hover title: "Nov 7, 2026, 1:36 PM". */
export function formatTakeDateFull(
	timestamp: string | null | undefined,
	timeZone?: string
): string | null {
	const date = parse(timestamp);
	if (!date) return null;
	return date.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		timeZone
	});
}
