import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

import { famousTypes } from '$lib/components/molecules/famousTypes'; // adjust path as needed
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const { data: top9Questions, error: top9QuestionsError } = await supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.eq('removed', false)
		.limit(9);

	if (top9QuestionsError) {
		console.log(top9QuestionsError);
	}

	let images = [];

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
				// console.log(key);
				group.push(...famousTypes[key].filter((person) => !person.link).slice(0, 3));
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
		famousPeople
	};
};
