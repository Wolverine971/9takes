// src/routes/admin/categories/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	buildVisibleQuestionCategoryTree,
	countQuestionCategoriesEligibleForIntro,
	countVisibleQuestionCategories,
	flattenQuestionCategoryTree,
	MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';
import { requireAdmin } from '$lib/server/adminAuth';

type ActiveQuestionRow = { id: number };

export const load: PageServerLoad = async (event) => {
	try {
		const { supabase } = await requireAdmin(event.locals);
		const questionTable = 'questions';

		const [
			{ data: categories, error: categoriesError },
			{ data: categoryTags, error: categoryTagsError },
			{ data: activeQuestions, error: activeQuestionsError }
		] = await Promise.all([
			supabase
				.from('question_categories')
				.select(
					'id, category_name, parent_id, level, intro_status, intro_source, intro_generated_at, intro_reviewed_at, intro_updated_at'
				)
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
			throw error(500, 'Failed to load question categories');
		}

		const activeQuestionIds = new Set(
			(activeQuestions as ActiveQuestionRow[] | null)?.map((question) => question.id) ?? []
		);
		const categoryTree = buildVisibleQuestionCategoryTree(
			(categories as QuestionCategoryRow[] | null) ?? [],
			(categoryTags as QuestionCategoryTagRow[] | null) ?? [],
			activeQuestionIds
		);
		const categoryMetadataById = new Map(
			(
				(categories as Array<{
					id: number;
					intro_status: string | null;
					intro_source: string | null;
					intro_generated_at: string | null;
					intro_reviewed_at: string | null;
					intro_updated_at: string | null;
				}> | null) ?? []
			).map((category) => [category.id, category])
		);
		const categoriesFlat = flattenQuestionCategoryTree(
			categoryTree,
			MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO
		)
			.map((category) => ({
				...category,
				intro_status: categoryMetadataById.get(category.id)?.intro_status ?? 'missing',
				intro_source: categoryMetadataById.get(category.id)?.intro_source ?? 'ai',
				intro_generated_at: categoryMetadataById.get(category.id)?.intro_generated_at ?? null,
				intro_reviewed_at: categoryMetadataById.get(category.id)?.intro_reviewed_at ?? null,
				intro_updated_at: categoryMetadataById.get(category.id)?.intro_updated_at ?? null
			}))
			.sort((a, b) => {
				if (a.isEligibleForIntro !== b.isEligibleForIntro) {
					return Number(b.isEligibleForIntro) - Number(a.isEligibleForIntro);
				}

				if (a.subtreeQuestionCount !== b.subtreeQuestionCount) {
					return b.subtreeQuestionCount - a.subtreeQuestionCount;
				}

				return a.path.join(' > ').localeCompare(b.path.join(' > '));
			});

		const totalVisibleCategories = countVisibleQuestionCategories(categoryTree);
		const eligibleCategoryCount = countQuestionCategoriesEligibleForIntro(
			categoryTree,
			MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO
		);

		return {
			minimumQuestionCountForIntro: MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
			totalVisibleCategories,
			eligibleCategoryCount,
			belowThresholdCategoryCount: totalVisibleCategories - eligibleCategoryCount,
			totalVisibleRoots: categoryTree.length,
			categories: categoriesFlat
		};
	} catch (caughtError) {
		console.log(caughtError);
		throw error(500, 'Failed to load category admin view');
	}
};
