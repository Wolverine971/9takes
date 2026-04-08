// src/routes/test-homepage-v1/+page.server.ts
// Test landing page experimenting with a "Do you know the Enneagram?" decision fork.
// Loads the same data as the main homepage so we can reuse the question-of-the-day
// card and the 9-person random famous-people grid.
import type { PageServerLoad } from './$types';

export interface FamousPerson {
	name: string;
	type: number;
	hasImage: boolean;
	hasLink: boolean;
	personaTitle: string | null;
}

interface TopQuestion {
	url: string | null;
	question_formatted: string | null;
	comment_count: number | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	// Top questions for daily quest rotation (mirrors src/routes/+page.server.ts)
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

	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const typedTopQuestions = (topQuestions ?? []) as TopQuestion[];
	const questionIndex =
		typedTopQuestions.length > 0 ? daysSinceEpoch % typedTopQuestions.length : 0;
	const questionOfTheDay = typedTopQuestions.length > 0 ? typedTopQuestions[questionIndex] : null;

	// Recent people per type via the same RPC the homepage uses
	const { data: recentByType, error: recentByTypeError } = await locals.supabase.rpc(
		'get_recent_people_by_type',
		{ people_per_type: 6 }
	);

	if (recentByTypeError) {
		console.error('Error fetching recent people by type:', recentByTypeError);
	}

	const typeRepresentatives: FamousPerson[] = [];
	const peopleByType: Map<string, typeof recentByType> = new Map();

	if (recentByType) {
		for (const person of recentByType) {
			if (!peopleByType.has(person.enneagram)) {
				peopleByType.set(person.enneagram, []);
			}
			peopleByType.get(person.enneagram)!.push(person);
		}
	}

	for (let type = 1; type <= 9; type++) {
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

	return {
		user: session?.user ?? null,
		typeRepresentatives,
		questionOfTheDay
	};
};
