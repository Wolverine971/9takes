/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '$lib/supabase';

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
		questionCategories,
		canAskQuestion
	};
}
