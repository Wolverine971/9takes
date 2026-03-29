// src/routes/admin/categories/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { requireAdmin } from '$lib/server/adminAuth';
import {
	buildQuestionCategoryIntroContext,
	renderQuestionCategoryIntroMarkdown
} from '$lib/server/questionCategoryIntro';

export const load: PageServerLoad = async ({ params, locals }) => {
	const categoryId = Number(params.id);
	if (!Number.isFinite(categoryId)) {
		throw error(400, 'Invalid category id');
	}

	await requireAdmin(locals);
	const supabase = locals.supabase as any;

	const [{ category, treeNode, context }, { data: runs, error: runsError }] = await Promise.all([
		buildQuestionCategoryIntroContext(supabase, categoryId, 'questions'),
		supabase
			.from('question_category_intro_runs')
			.select('*')
			.eq('category_id', categoryId)
			.order('created_at', { ascending: false })
			.limit(10)
	]);

	if (runsError) {
		console.log(runsError);
	}

	return {
		category,
		context,
		childCategories: treeNode?.children ?? [],
		renderedIntroHtml: renderQuestionCategoryIntroMarkdown(category.intro_markdown),
		recentRuns: runs ?? [],
		publicHref: `/questions/categories/${category.category_name.split(' ').join('-')}`
	};
};
