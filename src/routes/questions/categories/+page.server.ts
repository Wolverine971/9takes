// src/routes/questions/categories/+page.server.ts
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { mapDemoValues } from '../../../utils/demo';

type DistinctTagRow = { tag_id: number };

export const load: PageServerLoad = async (event) => {
	try {
		const supabase = event.locals.supabase;
		const db = supabase as any;
		const { demo_time } = await event.parent();

		const { data: uniquetags, error: tagsError } = (await db
			.from(demo_time === true ? 'distinct_question_tags_demo' : 'distinct_question_tags')
			.select()) as { data: DistinctTagRow[] | null; error: unknown };

		if (tagsError) {
			console.log(tagsError);
		}

		const tags = uniquetags?.map((t) => t.tag_id);
		if (!tags) {
			return {
				subcategoryTags: [],
				// questionsAndTags: [],
				rootCategories: [],
				categories: []
			};
		}

		const { data: rootCategories, error: rootCategoriesError } = await supabase
			.from('question_subcategories')
			.select(`*`);
		if (rootCategoriesError) {
			console.log(rootCategoriesError);
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

		const { data: categories, error: categoriesErrors } = await supabase.rpc('get_categories');

		if (categoriesErrors) {
			console.log(categoriesErrors);
		}
		// const { data: questionsAndTags, error: findQuestionsError } = await supabase
		// 	.from(demo_time === true ? 'question_tags_demo' : 'question_tags')
		// 	.select(`${demo_time === true ? 'questions_demo' : 'questions'}(*), question_tag(*, question_subcategories(*))`, {
		// 		count: 'estimated'
		// 	})
		// 	.in('tag_id', tags);

		// if (findQuestionsError) {
		// 	console.log(findQuestionsError);
		// }

		// });
		if (demo_time === true) {
			return {
				subcategoryTags,
				categories,
				rootCategories: mapDemoValues(rootCategories) ?? []
				// questionsAndTags: mapDemoValues(questionsAndTags)
			};
		}
		return {
			subcategoryTags,
			categories,
			rootCategories: mapDemoValues(rootCategories) ?? []
			// questionsAndTags: (questionsAndTags || []).filter((q) => {
			// 	return !q.questions.removed;
			// })
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};
