// src/routes/admin/questions/hierarchy/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { loadRouteDemoTime } from '$lib/server/demoTime';
import { mapDemoValues } from '../../../../utils/demo';

type DistinctTagRow = { tag_id: number };
type QuestionTagRow = { removed?: boolean | null; [key: string]: unknown };

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const supabase = event.locals.supabase;
		const db = supabase as any;
		// Same cached switch the admin layout reads, so the queries need not wait on it.
		const demo_time = await loadRouteDemoTime(supabase);

		// The layout guard (parent) runs alongside the independent reads below.
		const [
			,
			{ data: uniquetags, error: tagsError },
			{ data: questionsAndTags, error: findQuestionsError },
			{ data: questionSubcategories, error: questionSubcategoriesError },
			{ data: categories, error: categoriesError }
		] = await Promise.all([
			event.parent(),
			// Only a success/failure guard below: one row is enough to tell.
			db
				.from(demo_time === true ? 'distinct_question_tags_demo' : 'distinct_question_tags')
				.select('tag_id')
				.limit(1) as Promise<{ data: DistinctTagRow[] | null; error: unknown }>,
			db.rpc('get_10_question_tags') as Promise<{
				data: QuestionTagRow[] | null;
				error: unknown;
			}>,
			supabase
				.from('question_subcategories')
				.select(`*, question_subcategories(*, question_subcategories(*))`),
			demo_time === true
				? Promise.resolve({ data: undefined, error: null })
				: db.rpc('get_category_hierarchy')
		]);

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

		if (findQuestionsError) {
			console.log(findQuestionsError);
		}

		if (questionSubcategoriesError) {
			console.log(questionSubcategoriesError);
		}

		if (demo_time === true) {
			return {
				questionSubcategories,
				questionsAndTags: (mapDemoValues(questionsAndTags) ?? []).filter((q) => !q.removed)
			};
		}

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
