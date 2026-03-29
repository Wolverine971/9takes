// src/routes/api/admin/question-categories/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	buildQuestionCategoryIntroContext,
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown,
	saveQuestionCategoryIntro
} from '$lib/server/questionCategoryIntro';

const updateCategoryIntroSchema = z.object({
	intro_markdown: z.string().max(8000),
	intro_description: z.string().max(300).optional().nullable()
});

export const GET: RequestHandler = async ({ params, locals }) => {
	const categoryId = Number(params.id);
	if (!Number.isFinite(categoryId)) {
		throw error(400, 'Invalid category id');
	}

	const { supabase } = await requireAdmin(locals);
	const { category, treeNode, context } = await buildQuestionCategoryIntroContext(
		supabase,
		categoryId,
		'questions'
	);

	return json({
		category,
		context,
		childCategories: treeNode?.children ?? [],
		renderedIntroHtml: renderQuestionCategoryIntroMarkdown(category.intro_markdown),
		derivedDescription: buildQuestionCategoryIntroDescription(
			category.intro_markdown,
			category.intro_description
		)
	});
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		const categoryId = Number(params.id);
		if (!Number.isFinite(categoryId)) {
			throw error(400, 'Invalid category id');
		}

		const { supabase, profile } = await requireAdmin(locals);
		const payload = updateCategoryIntroSchema.parse(await request.json());
		const category = await saveQuestionCategoryIntro(
			supabase,
			categoryId,
			profile.id,
			payload.intro_markdown,
			payload.intro_description
		);
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
			caughtError instanceof Error ? caughtError.message : 'Failed to save category intro';
		return json({ success: false, message }, { status: 400 });
	}
};
