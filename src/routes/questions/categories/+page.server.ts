/* eslint-disable @typescript-eslint/no-explicit-any */
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { mapDemoValues } from '../../../utils/demo';

export const load: PageServerLoad = async (
	event
): Promise<{
	session: any;
	subcategoryTags: any;
	questionsAndTags: any;
	categories: any;
}> => {
	try {
		const { demo_time } = await event.parent();
		const session = event.locals.session;

		const { data: uniquetags, error: tagsError } = await supabase
			.from(demo_time === true ? 'distinct_question_tags_demo' : 'distinct_question_tags')
			.select();

		if (tagsError) {
			console.log(tagsError);
		}

		const tags = uniquetags?.map((t) => {
			return t.tag_id;
		});
		if (!tags) {
			return {
				session,
				subcategoryTags: [],
				questionsAndTags: [],
				categories: []
			};
		}

		const { data: subcategoryTags, error: subcategoryTagsError } = await supabase
			.from('question_tag')
			.select(`*, question_subcategories(*, question_subcategories(*))`)
			.in('tag_id', tags);

		if (subcategoryTagsError) {
			throw error(500, {
				message: 'Error finding questions'
			});
		}

		const { data: categories, error: categoriesErrors } = await supabase.rpc('getcategories');

		if (categoriesErrors) {
			console.log(categoriesErrors);
		}
		const { data: questionsAndTags, error: findQuestionsError } = await supabase
			.from(demo_time === true ? 'question_tags_demo' : 'question_tags')
			.select(`${demo_time === true ? 'questions_demo' : 'questions'}(*), question_tag(*)`, {
				count: 'estimated'
			})
			.in('tag_id', tags);

		if (findQuestionsError) {
			console.log(findQuestionsError);
		}

		// });
		if (demo_time === true) {
			return {
				session,
				subcategoryTags,
				categories,
				questionsAndTags: mapDemoValues(questionsAndTags)
			};
		}
		return {
			session,
			subcategoryTags,
			categories,
			questionsAndTags: (questionsAndTags || []).filter((q) => {
				return !q.questions.removed;
			})
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};
