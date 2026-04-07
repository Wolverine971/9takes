// src/routes/questions/categories/+page.server.ts
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import {
	buildVisibleQuestionCategoryTree,
	countVisibleQuestionCategories,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';

type ActiveQuestionRow = { id: number };

export const load: PageServerLoad = async (event) => {
	try {
		const supabase = event.locals.supabase as any;
		const { demo_time } = await event.parent();
		const questionTable = demo_time === true ? 'questions_demo' : 'questions';

		const [
			{ data: categories, error: categoriesError },
			{ data: categoryTags, error: categoryTagsError },
			{ data: activeQuestions, error: activeQuestionsError }
		] = await Promise.all([
			supabase
				.from('question_categories')
				.select('id, category_name, slug, parent_id, level')
				.order('id', { ascending: true }),
			supabase.from('question_category_tags').select('question_id, tag_id'),
			supabase.from(questionTable).select('id').eq('removed', false)
		]);

		if (categoriesError || categoryTagsError || activeQuestionsError) {
			console.log({
				categoriesError,
				categoryTagsError,
				activeQuestionsError
			});
			throw error(500, {
				message: 'Error finding questions'
			});
		}

		const activeQuestionIds = new Set(
			(activeQuestions as ActiveQuestionRow[] | null)?.map((q) => q.id) ?? []
		);
		const categoryTree = buildVisibleQuestionCategoryTree(
			(categories as QuestionCategoryRow[] | null) ?? [],
			(categoryTags as QuestionCategoryTagRow[] | null) ?? [],
			activeQuestionIds
		);

		return {
			categoryTree,
			totalVisibleCategories: countVisibleQuestionCategories(categoryTree),
			totalVisibleRoots: categoryTree.length
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};
