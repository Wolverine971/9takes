// src/routes/personality-analysis/type/[slug]/typeHubOrder.ts
// Ordering for the type hub list. Best-known people lead, ranked by the
// Wikipedia pageview snapshot in $lib/generated/personalityFame.json
// (`pnpm gen:personality-fame`). People with no fame data (no article, or
// published after the snapshot) follow, newest first.

export type FameViews = Record<string, number>;

type Orderable = {
	slug: string;
	date?: string | null;
	lastmod?: string | null;
};

function timestamp(person: Orderable): number {
	const value = new Date(person.date ?? person.lastmod ?? 0).getTime();
	return Number.isFinite(value) ? value : 0;
}

function fameOf(person: Orderable, views: FameViews): number {
	const value = views[person.slug];
	return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

/** Returns a new array: fame descending, then date descending, then slug. */
export function sortPeopleByFame<T extends Orderable>(people: T[], views: FameViews): T[] {
	return [...people].sort((a, b) => {
		const fameA = fameOf(a, views);
		const fameB = fameOf(b, views);
		if (fameA !== fameB) return fameB - fameA;
		const dateDiff = timestamp(b) - timestamp(a);
		if (dateDiff !== 0) return dateDiff;
		return a.slug.localeCompare(b.slug);
	});
}
