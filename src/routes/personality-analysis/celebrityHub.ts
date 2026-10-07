// src/routes/personality-analysis/celebrityHub.ts
// "Enneagram celebrities by type": the all-nine-types section of the
// /personality-analysis index. For each type it returns how many published
// profiles carry that type, the type's share of the corpus, and the
// best-known names, ranked exactly like the type hubs (Wikipedia pageview
// snapshot first, newest first for anyone without fame data).
import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';
import { sortPeopleByFame, type FameViews } from './type/[slug]/typeHubOrder';

export const ENNEAGRAM_TYPE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Names shown per type on the index. The type hub carries the full roster. */
export const CELEBRITY_HUB_NAMES_PER_TYPE = 10;

export type CelebrityHubPerson = {
	slug: string;
	name: string;
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
				name: formatPersonalityDisplayName(post.slug)
			}))
			.filter((person) => person.name);

		return { type, count, sharePct: formatSharePct(count, total), people };
	});
}
