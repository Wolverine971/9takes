// src/routes/api/admin/question-categories/[id]/review/+server.ts
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	buildQuestionCategoryIntroContext,
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown,
	reviewQuestionCategoryIntro
} from '$lib/server/questionCategoryIntro';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		const categoryId = Number(params.id);
		if (!Number.isFinite(categoryId)) {
			throw error(400, 'Invalid category id');
		}

		const { supabase, profile } = await requireAdmin(locals);
		const category = await reviewQuestionCategoryIntro(supabase, categoryId, profile.id);
		const { context, treeNode } = await buildQuestionCategoryIntroContext(
			supabase,
			categoryId,
			'questions'
		);

		return json({
			success: true,
			category,
			context,
			childCategories: treeNode?.children ?? [],
			renderedIntroHtml: renderQuestionCategoryIntroMarkdown(category.intro_markdown),
			derivedDescription: buildQuestionCategoryIntroDescription(
				category.intro_markdown,
				category.intro_description
			)
		});
	} catch (caughtError) {
		const message =
			caughtError instanceof Error ? caughtError.message : 'Failed to review category intro';
		return json({ success: false, message }, { status: 400 });
	}
};
