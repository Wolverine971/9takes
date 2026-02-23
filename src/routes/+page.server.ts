// src/routes/+page.server.ts
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
