// src/lib/components/questions/sealedTakes.ts
// The locked question page's view of the takes it can't show yet: who answered (by
// self-picked type) and when. Give-first: types and timestamps only, never take text.

/** Sealed rows the locked question page shows. */
export const SEALED_ROWS = 6;

export type SealedTake = {
	/** Self-picked Enneagram type 1-9, or null when the author skipped it or posted anonymously. */
	type: number | null;
	/** ISO timestamp the take was posted. */
	at: string;
};

export type SealedTakes = {
	/** Typed takes first, then untyped, each newest first; at most SEALED_ROWS. */
	rows: SealedTake[];
	/** Distinct types (1-9) with at least one take, ascending. */
	answered: number[];
	/** ISO timestamp of the newest take, or null when there are none. */
	newestAt: string | null;
	/** Server clock when this was read, so relative times render the same on server and client. */
	now: string;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "now", "5m", "3h", "4d", "2w", "5mo", "1y" */
export function relativeAge(at: string, now: string): string {
	const elapsed = Date.parse(now) - Date.parse(at);
	if (!Number.isFinite(elapsed) || elapsed < MINUTE) return 'now';
	if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
	if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;
	if (elapsed < 14 * DAY) return `${Math.floor(elapsed / DAY)}d`;
	if (elapsed < 60 * DAY) return `${Math.floor(elapsed / (7 * DAY))}w`;
	if (elapsed < 365 * DAY) return `${Math.floor(elapsed / (30 * DAY))}mo`;
	return `${Math.floor(elapsed / (365 * DAY))}y`;
}

/** "Oct 21", in the site's home time zone so server and client agree. */
export function shortDate(at: string | null): string {
	if (!at) return '';
	const date = new Date(at);
	if (Number.isNaN(date.getTime())) return '';
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		timeZone: 'America/New_York'
	});
}
