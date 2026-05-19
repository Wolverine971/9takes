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

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	// Get top questions for daily quest rotation
	const { data: topQuestions, error: topQuestionsError } = await locals.supabase
		.from('questions')
		.select('url,question_formatted,comment_count')
		.order('comment_count', { ascending: false })
		.eq('removed', false)
		.neq('id', 168)
		.limit(9);

	if (topQuestionsError) {
		console.error('Error fetching questions:', topQuestionsError);
	}

	// Rotate question of the day based on date
	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const typedTopQuestions = (topQuestions ?? []) as TopQuestion[];
	const questionIndex =
		typedTopQuestions.length > 0 ? daysSinceEpoch % typedTopQuestions.length : 0;
	const questionOfTheDay = typedTopQuestions.length > 0 ? typedTopQuestions[questionIndex] : null;

	// Get the 6 most recently modified people per type using RPC (efficient window function)
	const { data: recentByType, error: recentByTypeError } = await locals.supabase.rpc(
		'get_recent_people_by_type',
		{ people_per_type: 6 }
	);

	if (recentByTypeError) {
		console.error('Error fetching recent people by type:', recentByTypeError);
	}

	// Group by type and pick one random person from each type's recent 6
	const typeRepresentatives: FamousPerson[] = [];
	const peopleByType: Map<string, typeof recentByType> = new Map();

	// Group the RPC results by enneagram type
	if (recentByType) {
		for (const person of recentByType) {
			if (!peopleByType.has(person.enneagram)) {
				peopleByType.set(person.enneagram, []);
			}
			peopleByType.get(person.enneagram)!.push(person);
		}
	}

	// Pick one random person from each type's recent 6
	for (let type = 1; type <= 9; type++) {
		if (type === 3) {
			typeRepresentatives.push({
				name: 'alex-hormozi',
				type: 3,
				hasImage: true,
				hasLink: true,
				personaTitle: 'The Acquisition Architect'
			});
			continue;
		}

		if (type === 7) {
			typeRepresentatives.push({
				name: 'shaan-puri',
				type: 7,
				hasImage: true,
				hasLink: true,
				personaTitle: 'The Restless Showman'
			});
			continue;
		}

		if (type === 8) {
			typeRepresentatives.push({
				name: 'sam-parr',
				type: 8,
				hasImage: true,
				hasLink: true,
				personaTitle: "Media's Brute-Force Builder"
			});
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
