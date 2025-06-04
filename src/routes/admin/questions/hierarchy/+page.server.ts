// routes/admin/questions/hierarchy/+page.server.ts
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mapDemoValues } from '../../../../utils/demo';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
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
				questionSubcategories: [],
				questionsAndTags: []
			};
		}

		const { data: questionsAndTags, error: findQuestionsError } = await supabase.rpc(
			'get_10_question_tags',
			{}
		);

		if (findQuestionsError) {
			console.log(findQuestionsError);
		}

		const { data: questionSubcategories, error: questionSubcategoriesError } = await supabase
			.from('question_subcategories')
			.select(`*, question_subcategories(*, question_subcategories(*))`);

		if (questionSubcategoriesError) {
			console.log(questionSubcategoriesError);
		}

		if (demo_time === true) {
			return {
				questionSubcategories,
				questionsAndTags: mapDemoValues(questionsAndTags).filter((q) => {
					return !q.removed;
				})
			};
		}

		const { data: categories, error: categoriesError } = await supabase.rpc(
			'get_category_hierarchy',
			{}
		);
		if (categoriesError) console.error('Error fetching categories:', categoriesError);

		return {
			categories,
			questionSubcategories,
			questionsAndTags: (questionsAndTags || []).filter((q) => {
				return !q.removed;
			})
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};
