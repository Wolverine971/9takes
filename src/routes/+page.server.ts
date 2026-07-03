// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import corpusStats from '$lib/data/corpus-stats.json';

export interface FamousPerson {
	name: string;
	type: number;
	hasImage: boolean;
	hasLink: boolean;
	personaTitle: string | null;
}

export interface HomepageCorpusStats {
	published: number;
	inDraft: number;
	publishedLast30Days: number;
	avgNewPerMonth: number;
}

interface TopQuestion {
	url: string | null;
	question_formatted: string | null;
	comment_count: number | null;
}

interface RecentPerson {
	person: string;
	enneagram: string | number;
	persona_title: string | null;
}

const HOMEPAGE_DB_TIMEOUT_MS = 1800;

const LOCKED_TYPE_REPRESENTATIVES = new Map<number, FamousPerson>([
	[
		3,
		{
			name: 'alex-hormozi',
			type: 3,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Acquisition Architect'
		}
	],
	[
		7,
		{
			name: 'shaan-puri',
			type: 7,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Restless Showman'
		}
	],
	[
		8,
		{
			name: 'sam-parr',
			type: 8,
			hasImage: true,
			hasLink: true,
			personaTitle: "Media's Brute-Force Builder"
		}
	]
]);

const FALLBACK_TYPE_REPRESENTATIVES = new Map<number, FamousPerson>([
	[
		1,
		{
			name: 'tim-ferriss',
			type: 1,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Methodical Optimizer'
		}
	],
	[
		2,
		{
			name: 'oprah-winfrey',
			type: 2,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Empathic Broadcaster'
		}
	],
	[
		4,
		{
			name: 'anya-taylor-joy',
			type: 4,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Haunted Original'
		}
	],
	[
		5,
		{
			name: 'elon-musk',
			type: 5,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Systems Engineer'
		}
	],
	[
		6,
		{
			name: 'zendaya',
			type: 6,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Composed Sentinel'
		}
	],
	[
		9,
		{
			name: 'barack-obama',
			type: 9,
			hasImage: true,
			hasLink: true,
			personaTitle: 'The Consensus Architect'
		}
	]
]);

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	if (typeof error === 'object' && error && 'message' in error) {
		return String(error.message);
	}

	return String(error);
}

function isAbortLikeError(error: unknown): boolean {
	const message = getErrorMessage(error).toLowerCase();
	const code =
		typeof error === 'object' && error && 'code' in error ? String(error.code) : undefined;

	return (
		(error instanceof Error && error.name === 'AbortError') ||
		message.includes('aborterror') ||
		message.includes('aborted') ||
		code === '20'
	);
}

async function runTimedHomepageQuery<T>(
	label: string,
	query: (signal: AbortSignal) => Promise<{ data: T | null; error: unknown }>
): Promise<T | null> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), HOMEPAGE_DB_TIMEOUT_MS);

	try {
		const { data, error } = await query(controller.signal);
		if (error) {
			if (isAbortLikeError(error)) {
				console.warn(`Timed out fetching homepage ${label}`);
			} else {
				console.error(`Error fetching homepage ${label}:`, error);
			}
			return null;
		}

		return data;
	} catch (error) {
		if (isAbortLikeError(error)) {
			console.warn(`Timed out fetching homepage ${label}`);
		} else {
			console.error(`Error fetching homepage ${label}:`, error);
		}
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	const [topQuestions, recentByType] = await Promise.all([
		runTimedHomepageQuery<TopQuestion[]>('top questions', async (signal) => {
			const { data, error } = await locals.supabase
				.from('questions')
				.select('url,question_formatted,comment_count')
				.order('comment_count', { ascending: false })
				.eq('removed', false)
				.neq('id', 168)
				.limit(9)
				.abortSignal(signal);

			return { data: (data ?? null) as TopQuestion[] | null, error };
		}),
		runTimedHomepageQuery<RecentPerson[]>('recent people by type', async (signal) => {
			const { data, error } = await locals.supabase
				.rpc('get_recent_people_by_type', { people_per_type: 6 })
				.abortSignal(signal);

			return { data: (data ?? null) as RecentPerson[] | null, error };
		})
	]);

	// Rotate question of the day based on date
	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const typedTopQuestions = (topQuestions ?? []) as TopQuestion[];
	const questionIndex =
		typedTopQuestions.length > 0 ? daysSinceEpoch % typedTopQuestions.length : 0;
	const questionOfTheDay = typedTopQuestions.length > 0 ? typedTopQuestions[questionIndex] : null;

	// Group by type and pick one random person from each type's recent 6
	const typeRepresentatives: FamousPerson[] = [];
	const peopleByType: Map<string, RecentPerson[]> = new Map();

	// Group the RPC results by enneagram type
	if (recentByType) {
		for (const person of recentByType) {
			const typeKey = String(person.enneagram);
			if (!peopleByType.has(typeKey)) {
				peopleByType.set(typeKey, []);
			}
			peopleByType.get(typeKey)!.push(person);
		}
	}

	// Pick one random person from each type's recent 6
	for (let type = 1; type <= 9; type++) {
		const lockedRepresentative = LOCKED_TYPE_REPRESENTATIVES.get(type);
		if (lockedRepresentative) {
			typeRepresentatives.push(lockedRepresentative);
			continue;
		}

		const typeKey = String(type);
		const group = peopleByType.get(typeKey) || [];
		if (group.length > 0) {
			const randomIndex = Math.floor(Math.random() * group.length);
			const person = group[randomIndex];
			typeRepresentatives.push({
				name: person.person,
				type: Number(person.enneagram),
				hasImage: true,
				hasLink: true,
				personaTitle: person.persona_title ?? null
			});
		} else {
			const fallback = FALLBACK_TYPE_REPRESENTATIVES.get(type);
			if (fallback) {
				typeRepresentatives.push(fallback);
			}
		}
	}

	// typeRepresentatives.push({
	// 	name: 'leila-hormozi',
	// 	type: 3,
	// 	hasImage: true,
	// 	hasLink: true,
	// 	personaTitle: "Business's Worthiness Machine"
	// });

	const homepageCorpusStats: HomepageCorpusStats = {
		published: corpusStats.totals.published,
		inDraft: corpusStats.totals.unpublished_drafts,
		publishedLast30Days: corpusStats.pipeline.published_last_30_days,
		avgNewPerMonth: corpusStats.pipeline.avg_new_per_month
	};

	return {
		user: session?.user ?? null,
		typeRepresentatives,
		questionOfTheDay,
		corpusStats: homepageCorpusStats
	};
};
