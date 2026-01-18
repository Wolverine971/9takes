// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';

export interface FamousPerson {
	name: string;
	type: number;
	hasImage: boolean;
	hasLink: boolean;
	personaTitle: string | null;
}

export interface FamousBlogPerson {
	person: string;
	enneagram: number;
	description?: string | null;
	lastmod?: string | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();

	// Get top questions for daily quest rotation
	const { data: top9Questions, error: top9QuestionsError } = await locals.supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.eq('removed', false)
		.neq('id', 168)
		.limit(9);

	if (top9QuestionsError) {
		console.error('Error fetching questions:', top9QuestionsError);
	}

	// Rotate question of the day based on date
	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const questionIndex = daysSinceEpoch % 9;
	const questionOfTheDay =
		top9Questions && top9Questions.length > 0 ? top9Questions[questionIndex] : null;

	// Get recent celebrity analyses for featured section
	const { data: featuredPeople, error: featuredPeopleError } = await locals.supabase
		.from('blogs_famous_people')
		.select('person, enneagram, description, lastmod')
		.order('lastmod', { ascending: false })
		.eq('published', true)
		.limit(6);

	if (featuredPeopleError) {
		console.error('Error fetching featured people:', featuredPeopleError);
	}

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
		featuredPeople: (featuredPeople ?? []) as unknown as FamousBlogPerson[],
		questionOfTheDay,
		top9Questions
	};
};
