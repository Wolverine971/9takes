// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { famousTypes } from '$lib/components/molecules/famousTypes';

export interface FamousPerson {
	name: string;
	type: number;
	hasImage: boolean;
	hasLink: boolean;
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

	// Build images array for 9 types grid (one per type)
	const typeRepresentatives: FamousPerson[] = [];
	const gridSize = 9;

	Object.keys(famousTypes).forEach((keyStr, i) => {
		if (i < gridSize) {
			const key = Number(keyStr);
			// Prioritize people with links (published profiles)
			const group = famousTypes[key]
				.filter((person) => person.hasImage && person.link)
				.sort(() => Math.random() - 0.5);

			if (group.length > 0) {
				const person = group[0];
				typeRepresentatives.push({
					name: person.name,
					type: key,
					hasImage: person.hasImage,
					hasLink: person.link
				});
			} else {
				// Fallback to anyone with an image
				const fallback = famousTypes[key].find((p) => p.hasImage);
				if (fallback) {
					typeRepresentatives.push({
						name: fallback.name,
						type: key,
						hasImage: fallback.hasImage,
						hasLink: fallback.link
					});
				}
			}
		}
	});

	return {
		user: session?.user ?? null,
		typeRepresentatives,
		featuredPeople: (featuredPeople ?? []) as unknown as FamousBlogPerson[],
		questionOfTheDay,
		top9Questions
	};
};
