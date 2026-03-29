// src/routes/api/admin/question-categories/generate/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	buildVisibleQuestionCategoryTree,
	flattenQuestionCategoryTree,
	MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';
import { generateQuestionCategoryIntro } from '$lib/server/questionCategoryIntro';

type ActiveQuestionRow = { id: number };

const batchGenerateSchema = z.object({
	mode: z.enum(['missing', 'stale']).default('missing'),
	limit: z.number().int().min(1).max(25).default(5)
});

type CategoryMetadataRow = QuestionCategoryRow & {
	intro_status: string | null;
	intro_source: string | null;
	intro_generated_at: string | null;
	intro_reviewed_at: string | null;
	intro_updated_at: string | null;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { supabase, profile } = await requireAdmin(locals);
		const payload = batchGenerateSchema.parse(await request.json().catch(() => ({})));

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
			supabase.from('questions').select('id').eq('removed', false)
		]);

		if (categoriesError || categoryTagsError || activeQuestionsError) {
			console.log({
				categoriesError,
				categoryTagsError,
				activeQuestionsError
			});
			throw error(500, 'Failed to load category intro queue');
		}

		const categoryRows = (categories as CategoryMetadataRow[] | null) ?? [];
		const activeQuestionIds = new Set(
			(activeQuestions as ActiveQuestionRow[] | null)?.map((question) => question.id) ?? []
		);
		const categoryTree = buildVisibleQuestionCategoryTree(
			categoryRows,
			(categoryTags as QuestionCategoryTagRow[] | null) ?? [],
			activeQuestionIds
		);
		const categoryMetadataById = new Map(categoryRows.map((category) => [category.id, category]));
		const targetStatuses =
			payload.mode === 'stale' ? new Set(['stale']) : new Set(['missing', 'failed']);
		const targets = flattenQuestionCategoryTree(categoryTree, MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO)
			.filter((category) => category.isEligibleForIntro)
			.filter((category) => {
				const metadata = categoryMetadataById.get(category.id);
				const introStatus = metadata?.intro_status ?? 'missing';
				const introSource = metadata?.intro_source ?? 'ai';
				if (payload.mode === 'stale' && (introSource === 'manual' || introSource === 'ai_edited')) {
					return false;
				}
				return targetStatuses.has(introStatus);
			})
			.sort((a, b) => {
				if (a.subtreeQuestionCount !== b.subtreeQuestionCount) {
					return b.subtreeQuestionCount - a.subtreeQuestionCount;
				}

				return a.path.join(' > ').localeCompare(b.path.join(' > '));
			})
			.slice(0, payload.limit);

		const successes: Array<{
			id: number;
			intro_status: string | null;
			intro_source: string | null;
			intro_generated_at: string | null;
			intro_reviewed_at: string | null;
			intro_updated_at: string | null;
		}> = [];
		const failures: Array<{ id: number; message: string }> = [];

		for (const target of targets) {
			try {
				const result = await generateQuestionCategoryIntro(supabase, target.id, profile.id);
				successes.push({
					id: result.category.id,
					intro_status: result.category.intro_status,
					intro_source: result.category.intro_source,
					intro_generated_at: result.category.intro_generated_at,
					intro_reviewed_at: result.category.intro_reviewed_at,
					intro_updated_at: result.category.intro_updated_at
				});
			} catch (caughtError) {
				failures.push({
					id: target.id,
					message:
						caughtError instanceof Error ? caughtError.message : 'Failed to generate category intro'
				});
			}
		}

		return json({
			success: true,
			mode: payload.mode,
			processedCount: targets.length,
			successCount: successes.length,
			failureCount: failures.length,
			updatedCategories: successes,
			failures
		});
	} catch (caughtError) {
		const message =
			caughtError instanceof Error ? caughtError.message : 'Failed to run batch generation';
		return json({ success: false, message }, { status: 400 });
	}
};
