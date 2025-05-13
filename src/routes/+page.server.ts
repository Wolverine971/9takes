import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';
import { famousTypes } from '$lib/components/molecules/famousTypes'; // adjust path as needed
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// Fetch top questions
	const { data: top9Questions, error: top9QuestionsError } = await supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.eq('removed', false)
		.neq('id', 168)
		.limit(9);

	if (top9QuestionsError) {
		console.log(top9QuestionsError);
	}

	// Calculate which question to display based on current date
	// This will rotate through questions every 9 days
	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const questionIndex = daysSinceEpoch % 9; // Rotate through 9 questions (0-8)

	// Select the question of the day
	const questionOfTheDay = top9Questions && top9Questions.length > 0
		? top9Questions[questionIndex]
		: null;

	// Rest of your existing code
	let images: any[] = [];

	const { data: famousPeople, error: famousPeopleError } = await supabase
		.from('blogs_famous_people')
		.select('*')
		.order('lastmod', { ascending: false })
		.eq('published', true)

		.limit(5);

	if (famousPeopleError) {
		throw error(404, {
			message: `Error finding famous people`
		});
	}

	let gridSize = 9;
	Object.keys(famousTypes).forEach((keyStr, i) => {
		if (i < gridSize) {
			const key = Number(keyStr);
			let group = famousTypes[key].filter((person) => person.link);
			if (group.length < 9) {
				group.push(...famousTypes[key].filter((person) => !person.link).slice(0, 3));
			}

			const slicedGroup = group.slice(0, gridSize);
			slicedGroup.forEach((person) => {
				let info = { ...person, type: key };
				images.push(info);
			});
		}
	});

	return {
		images,
		top9Questions,
		famousPeople,
		questionOfTheDay  // Add the question of the day to the returned data
	};
};