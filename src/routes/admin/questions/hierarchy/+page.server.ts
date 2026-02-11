// src/routes/admin/questions/hierarchy/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mapDemoValues } from '../../../../utils/demo';

type DistinctTagRow = { tag_id: number };
type QuestionTagRow = { removed?: boolean | null; [key: string]: unknown };

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const { demo_time } = await event.parent();
		const supabase = event.locals.supabase;
		const db = supabase as any;

		const { data: uniquetags, error: tagsError } = (await db
			.from(demo_time === true ? 'distinct_question_tags_demo' : 'distinct_question_tags')
			.select()) as { data: DistinctTagRow[] | null; error: unknown };

		if (tagsError) {
			console.log(tagsError);
		}

		const tags = uniquetags?.map((t) => t.tag_id);
		if (!tags) {
			return {
				questionSubcategories: [],
				questionsAndTags: []
			};
		}

		const { data: questionsAndTags, error: findQuestionsError } = (await db.rpc(
			'get_10_question_tags'
		)) as { data: QuestionTagRow[] | null; error: unknown };

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
				questionsAndTags: (mapDemoValues(questionsAndTags) ?? []).filter((q) => !q.removed)
			};
		}

		const { data: categories, error: categoriesError } = await db.rpc('get_category_hierarchy');
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
