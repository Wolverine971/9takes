// src/lib/admin/dashboardFormat.ts
// Compact date and label formatting for the admin dashboard (desktop and mobile).
// Dates use Eastern time explicitly so SSR (UTC on Vercel) and the browser print the
// same text, and the weekly numbers' Monday-Sunday buckets line up with the lists.

const TIME_ZONE = 'America/New_York';

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });
export const timeFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	hour: 'numeric',
	minute: '2-digit'
});
const dayFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	month: 'short',
	day: 'numeric'
});
const dayYearFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	month: 'short',
	day: 'numeric',
	year: 'numeric'
});

function toDate(value: string | null | undefined): Date | null {
	if (!value) return null;
	// Date-only strings are calendar days; pin them to midday so no zone shifts the day.
	const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value);
	return Number.isNaN(date.getTime()) ? null : date;
}

/** "3:14 PM" today, "Oct 3" this year, "Oct 3, 2025" before that. */
export function shortDate(value: string | null | undefined, now = new Date()): string {
	const date = toDate(value);
	if (!date) return '—';
	const day = dayKeyFormat.format(date);
	const today = dayKeyFormat.format(now);
	if (day === today) return timeFormat.format(date);
	return day.slice(0, 4) === today.slice(0, 4)
		? dayFormat.format(date)
		: dayYearFormat.format(date);
}

/** "Oct 3, 2026, 3:14 PM" for tooltips. */
export function fullDate(value: string | null | undefined): string {
	const date = toDate(value);
	return date ? `${dayYearFormat.format(date)}, ${timeFormat.format(date)}` : '';
}

// email_unsubscribes.reason holds machine codes; show the short human version.
const UNSUBSCRIBE_REASONS: Array<[RegExp, string]> = [
	[/^bot_submitted_quarantine/, 'Bot quarantine'],
	[/^reactivation_completed_no_response/, 'No reply to reactivation'],
	[/^reactivation_repermission_no/, 'Declined re-permission'],
	[/^hard_bounce/, 'Hard bounce'],
	[/^tracking_unsubscribe/, 'Clicked unsubscribe']
];

export function unsubscribeReasonLabel(reason: string | null | undefined): string {
	if (!reason) return '';
	const known = UNSUBSCRIBE_REASONS.find(([pattern]) => pattern.test(reason));
	if (known) return known[1];
	return reason.replace(/_\d{4}-\d{2}-\d{2}$/, '').replaceAll('_', ' ');
}
