// src/routes/test-solo-leveling-v2/+page.server.ts
import type { PageServerLoad } from './$types';
import { famousTypes } from '$lib/components/molecules/famousTypes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: top9Questions, error: top9QuestionsError } = await locals.supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.eq('removed', false)
		.neq('id', 168)
		.limit(9);

	if (top9QuestionsError) {
		// Handle error
	}

	const today = new Date();
	const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
	const questionIndex = daysSinceEpoch % 9;

	const questionOfTheDay =
		top9Questions && top9Questions.length > 0 ? top9Questions[questionIndex] : null;

	let images: Array<{ img_url: string; img_alt: string }> = [];

	const { data: famousPeople, error: famousPeopleError } = await locals.supabase
		.from('blogs_famous_people')
		.select('*')
		.order('lastmod', { ascending: false })
		.eq('published', true)
		.limit(5);

	if (famousPeopleError) {
		throw error(404, { message: `Error finding famous people` });
	}

	let gridSize = 9;
	Object.keys(famousTypes).forEach((keyStr, i) => {
		if (i < gridSize) {
			const key = Number(keyStr);
			let group = famousTypes[key]
				.filter((person) => person.hasImage && person.link)
				.sort(() => Math.random() - 0.5);
			if (group.length < 9) {
				group.push(
					...famousTypes[key]
						.filter((person) => person.hasImage && !person.link)
						.slice(0, 9 - group.length)
				);
			}
			const slicedGroup = group.slice(0, gridSize);
			slicedGroup.forEach((person) => {
				let info = { ...person, type: key, url: person.link };
				images.push(info);
			});
		}
	});

	return {
		images,
		top9Questions,
		famousPeople,
		questionOfTheDay
	};
};
