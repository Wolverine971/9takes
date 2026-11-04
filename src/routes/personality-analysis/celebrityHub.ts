// src/routes/personality-analysis/celebrityHub.ts
// "Enneagram celebrities by type": the nine portrait rows of the
// /personality-analysis index. For each type it returns how many published
// profiles carry that type, the type's share of the corpus, and the
// best-known people, ranked exactly like the type hubs (Wikipedia pageview
// snapshot first, newest first for anyone without fame data).
// buildJustAdded feeds the "Just added" strip above the rows.
import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';
import { sortPeopleByFame, type FameViews } from './type/[slug]/typeHubOrder';

export const ENNEAGRAM_TYPE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Portraits shown per type on the index. The type hub carries the full roster. */
export const CELEBRITY_HUB_NAMES_PER_TYPE = 12;

/** Portraits in the "Just added" strip. */
export const JUST_ADDED_COUNT = 8;

export type CelebrityHubPerson = {
	slug: string;
	name: string;
	personaTitle: string | null;
};

export type JustAddedPerson = CelebrityHubPerson & {
	/** "1".."9" */
	enneagram: string;
	/** Publish date (falls back to lastmod), ISO string. */
	addedAt: string | null;
};

export type CelebrityHubType = {
	/** "1".."9" */
	type: string;
	/** Published profiles of this type. */
	count: number;
	/** count / corpus total, one decimal: "18.0%". */
	sharePct: string;
	/** Best-known first, at most CELEBRITY_HUB_NAMES_PER_TYPE. */
	people: CelebrityHubPerson[];
};

type HubPost = {
	slug: string;
	enneagram: string | null;
	persona_title?: string | null;
	date?: string | null;
	lastmod?: string | null;
};

type BuildOptions = {
	/**
	 * Per-type counts to report instead of counting `posts`. The index passes
	 * corpus-stats.json counts when the live query failed and `posts` is the
	 * small hardcoded fallback list, so the section never claims "1 Type 3".
	 */
	counts?: Record<string, number>;
	namesPerType?: number;
};

function formatSharePct(count: number, total: number): string {
	if (total <= 0) return '0.0%';
	return `${((count / total) * 100).toFixed(1)}%`;
}

export function buildCelebrityHub(
	posts: HubPost[],
	views: FameViews,
	{ counts, namesPerType = CELEBRITY_HUB_NAMES_PER_TYPE }: BuildOptions = {}
): CelebrityHubType[] {
	const postsByType = new Map<string, HubPost[]>(ENNEAGRAM_TYPE_KEYS.map((key) => [key, []]));

	for (const post of posts) {
		const type = post.enneagram?.trim() ?? '';
		if (post.slug && postsByType.has(type)) {
			postsByType.get(type)!.push(post);
		}
	}

	const countFor = (type: string) =>
		counts ? Math.max(0, counts[type] ?? 0) : (postsByType.get(type)?.length ?? 0);
	const total = ENNEAGRAM_TYPE_KEYS.reduce((sum, type) => sum + countFor(type), 0);

	return ENNEAGRAM_TYPE_KEYS.map((type) => {
		const count = countFor(type);
		const people = sortPeopleByFame(postsByType.get(type) ?? [], views)
			.slice(0, namesPerType)
			.map((post) => ({
				slug: post.slug,
				name: formatPersonalityDisplayName(post.slug),
				personaTitle: post.persona_title?.trim() || null
			}))
			.filter((person) => person.name);

		return { type, count, sharePct: formatSharePct(count, total), people };
	});
}

function timeOf(value: string | null | undefined): number {
	const time = value ? new Date(value).getTime() : NaN;
	return Number.isFinite(time) ? time : 0;
}

/**
 * Newest profiles by publish date (lastmod only when there is no date), so a
 * refresh of an old page doesn't read as "just added".
 */
export function buildJustAdded(posts: HubPost[], limit = JUST_ADDED_COUNT): JustAddedPerson[] {
	return posts
		.filter((post) => post.slug && ENNEAGRAM_TYPE_KEYS.includes(post.enneagram?.trim() as never))
		.map((post) => ({ post, addedAt: post.date ?? post.lastmod ?? null }))
		.sort((a, b) => timeOf(b.addedAt) - timeOf(a.addedAt))
		.slice(0, limit)
		.map(({ post, addedAt }) => ({
			slug: post.slug,
			name: formatPersonalityDisplayName(post.slug),
			personaTitle: post.persona_title?.trim() || null,
			enneagram: post.enneagram!.trim(),
			addedAt
		}))
		.filter((person) => person.name);
}
