// src/routes/admin/categories/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	buildVisibleQuestionCategoryTree,
	buildQuestionCategoryPathRows,
	countQuestionCategoriesEligibleForIntro,
	countVisibleQuestionCategories,
	flattenQuestionCategoryTree,
	MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';
import { requireAdmin } from '$lib/server/adminAuth';

type ActiveQuestionRow = { id: number };
type CategoryRollupRow = {
	id: number;
	category_name: string;
	slug: string | null;
	parent_id: number | null;
	level: number | null;
	intro_status: string | null;
	intro_source: string | null;
	intro_generated_at: string | null;
	intro_reviewed_at: string | null;
	intro_updated_at: string | null;
	direct_question_count: number;
	subtree_question_count: number;
};

function isMissingCategoryRollupRpc(caughtError: unknown): boolean {
	const message =
		typeof caughtError === 'object' && caughtError !== null && 'message' in caughtError
			? String((caughtError as { message?: unknown }).message ?? '')
			: '';
	return message.includes('get_admin_question_category_rollup');
}

export const load: PageServerLoad = async (event) => {
	try {
		const { supabase } = await requireAdmin(event.locals);
		const questionTable = 'questions';
		const rollupResult = await supabase.rpc('get_admin_question_category_rollup');

		if (!rollupResult.error) {
			const rollupRows = (rollupResult.data ?? []) as CategoryRollupRow[];
			const visibleCategoryIds = new Set(rollupRows.map((category) => category.id));
			const categoriesFlat = rollupRows
				.map((category) => ({
					id: category.id,
					category_name: category.category_name,
					slug: category.slug,
					parent_id: category.parent_id,
					level: category.level ?? 0,
					directQuestionCount: Number(category.direct_question_count),
					subtreeQuestionCount: Number(category.subtree_question_count),
					hasDirectQuestions: Number(category.direct_question_count) > 0,
					children: [],
					path: buildQuestionCategoryPathRows(rollupRows, category.id).map(
						(pathCategory) => pathCategory.category_name
					),
					isEligibleForIntro:
						Number(category.subtree_question_count) >= MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
					intro_status: category.intro_status ?? 'missing',
					intro_source: category.intro_source ?? 'ai',
					intro_generated_at: category.intro_generated_at,
					intro_reviewed_at: category.intro_reviewed_at,
					intro_updated_at: category.intro_updated_at
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
			const eligibleCategoryCount = categoriesFlat.filter(
				(category) => category.isEligibleForIntro
			).length;

			return {
				minimumQuestionCountForIntro: MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
				totalVisibleCategories: categoriesFlat.length,
				eligibleCategoryCount,
				belowThresholdCategoryCount: categoriesFlat.length - eligibleCategoryCount,
				totalVisibleRoots: rollupRows.filter(
					(category) => category.parent_id === null || !visibleCategoryIds.has(category.parent_id)
				).length,
				categories: categoriesFlat
			};
		}

		if (!isMissingCategoryRollupRpc(rollupResult.error)) {
			throw rollupResult.error;
		}

		console.warn('Category rollup RPC is not deployed; using the legacy in-memory fallback.');

		const [
			{ data: categories, error: categoriesError },
			{ data: categoryTags, error: categoryTagsError },
			{ data: activeQuestions, error: activeQuestionsError }
		] = await Promise.all([
			supabase
				.from('question_categories')
				.select(
					'id, category_name, slug, parent_id, level, intro_status, intro_source, intro_generated_at, intro_reviewed_at, intro_updated_at'
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
		if (caughtError && typeof caughtError === 'object' && 'status' in caughtError) {
			throw caughtError;
		}
		console.error('Failed to load category admin view', caughtError);
		throw error(500, 'Failed to load category admin view');
	}
};
