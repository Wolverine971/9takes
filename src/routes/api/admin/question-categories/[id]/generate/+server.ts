// src/routes/api/admin/question-categories/[id]/generate/+server.ts
import { error, json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { generateQuestionCategoryIntro } from '$lib/server/questionCategoryIntro';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		const categoryId = Number(params.id);
		if (!Number.isFinite(categoryId)) {
			throw error(400, 'Invalid category id');
		}

		const { supabase, profile } = await requireAdmin(locals);
		const result = await generateQuestionCategoryIntro(supabase, categoryId, profile.id);
		return json({
			success: true,
			category: result.category,
			context: result.context,
			run: result.run,
			renderedIntroHtml: result.renderedIntroHtml
		});
	} catch (caughtError) {
		const message =
			caughtError instanceof Error ? caughtError.message : 'Failed to generate category intro';
		return json({ success: false, message }, { status: 400 });
	}
};
