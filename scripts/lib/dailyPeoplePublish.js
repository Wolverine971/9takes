// scripts/lib/dailyPeoplePublish.js
export const PUBLISH_TIME_ZONE = 'America/New_York';
export const DAILY_PEOPLE_LIMIT = 2;

export function pageIncludesQuestion(html, question) {
	const decoded = html
		.replace(/&#(?:39|x27);|&apos;/gi, "'")
		.replace(/&#(?:34|x22);|&quot;/gi, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
	return Boolean(question?.trim()) && decoded.includes(question);
}

export function publishingDay(value = new Date()) {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: PUBLISH_TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date(value));
}

export function dailyReleaseState(events, now = new Date()) {
	const day = publishingDay(now);
	const published = [
		...new Set(
			events
				.filter(
					(event) =>
						event.content_type === 'people' &&
						event.event_type === 'published' &&
						publishingDay(event.event_at) === day
				)
				.map((event) => event.content_slug.toLowerCase())
		)
	];
	return { day, published, remaining: Math.max(0, DAILY_PEOPLE_LIMIT - published.length) };
}

export function rankPublishCandidates(candidates) {
	return candidates
		.filter((c) => !c.dbPublished && c.blockers.length === 0)
		.sort(
			(a, b) =>
				(b.qualityOverall ?? 0) - (a.qualityOverall ?? 0) ||
				new Date(b.entry.lastmod || b.entry.date || 0).getTime() -
					new Date(a.entry.lastmod || a.entry.date || 0).getTime() ||
				a.entry.person.localeCompare(b.entry.person)
		);
}

export function validNineTakes(row) {
	return (
		Array.isArray(row?.takes) &&
		row.takes.length === 9 &&
		new Set(row.takes.map((t) => t.type)).size === 9 &&
		row.takes.every(
			(t) =>
				Number.isInteger(t.type) &&
				t.type >= 1 &&
				t.type <= 9 &&
				typeof t.take === 'string' &&
				t.take.trim()
		)
	);
}
