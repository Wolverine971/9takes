/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '$lib/supabase';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const slug = event.params.slug ? event.params.slug.split('-').join(' ') : '';

	const { data: questionCategories, error: questionCategoriesErrors } = await supabase.rpc(
		'get_category_questions',
		{ slug }
	);

	if (questionCategoriesErrors) {
		console.log(questionCategoriesErrors);
	}

	const { data: questionTag, error: questionTagError } = await supabase
		.from('question_tag')
		.select(`*`)
		.eq('tag_name', slug)
		.single();

	if (questionTagError) {
		console.log(questionTagError);
	}

	return {
		questionTag,
		questionCategories
	};
}
