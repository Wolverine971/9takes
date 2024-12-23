/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const slug = event.params.slug ? event.params.slug.split('-').join(' ') : '';
	const { demo_time } = await event.parent();
	const session = event.locals.session;

	let canAskQuestion = false;

	if (session?.user?.id) {
		const { data: questions, error: questionsError } = await supabase
			.from(demo_time === true ? 'questions_demo' : 'questions')
			.select('*')
			.eq('author_id', session?.user?.id)
			.eq('removed', false)
			.gte('created_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString())
			.limit(10);

		if (questionsError) {
			console.log(questionsError);
		}
		if (questions && questions?.length <= 10) {
			canAskQuestion = true;
		}
	}

	const { data: questionCategories, error: questionCategoriesErrors } = await supabase.rpc(
		'get_category_questions',
		{ slug }
	);

	if (questionCategoriesErrors) {
		console.log(questionCategoriesErrors);
		throw error(500, "couldn't find questions");
	}

	const { data: parents, error: parentsError } = await supabase.rpc(
		'get_category_parent_structure',
		{ input_category_name: slug }
	);

	if (parentsError) console.error(parentsError);

	const { data: children, error: childrenError } = await supabase.rpc(
		'get_category_children_structure',
		{ input_category_name: slug }
	);

	if (childrenError) console.error(childrenError);

	const { data: questionTag, error: questionTagError } = await supabase
		.from('question_categories')
		.select(`*`)
		.eq('category_name', slug)
		.single();

	if (questionTagError) {
		console.log(questionTagError);
	}

	return {
		parents,
		children,
		questionTag,
		questionCategories,
		canAskQuestion
	};
}

// // category tree balancing

// const { category_info, last_id } = data;
//   const { category_name, category_level } = category_info;

//   // Generate the prompt for the LLM
//   const prompt = `
// I have question categories and I want you to break down the following category into subcategories: ${category_name}.
// In my database the question_categories table has the following structure: id, category_name, parent_id, level.

// The last category id is ${last_id}. The level of "${category_name}" is ${category_level}.
// Please create new subcategories for this and return it in JSON form following this structure:
// [{id: ${last_id + 1}, category_name: 'Sub Category Name', parent_id: ${category_info.category_id}, level: ${category_level + 1}}]

// Create at least 5 subcategories, but no more than 10. Ensure that the subcategories are diverse and cover different aspects of the main category.
//   `;
