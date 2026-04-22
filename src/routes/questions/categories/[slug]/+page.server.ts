// src/routes/questions/categories/[slug]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import {
	buildQuestionCategoryPathRows,
	buildVisibleQuestionCategoryTree,
	findQuestionCategoryNodeById,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';
import {
	buildQuestionCategoryPath,
	buildQuestionCategorySlug
} from '$lib/utils/questionCategorySlug';
import type { PageServerLoad } from './$types';
import {
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown
} from '$lib/server/questionCategoryIntro';

type ActiveQuestionRow = { id: number };

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const supabase = event.locals.supabase as any;
	const { demo_time } = await event.parent();
	const session = event.locals.session;
	const questionTable = demo_time === true ? 'questions_demo' : 'questions';

	let canAskQuestion = false;

	if (session?.user?.id) {
		const { data: questions, error: questionsError } = await supabase
			.from(questionTable)
			.select('id')
			.eq('author_id', session?.user?.id)
			.eq('removed', false)
			.gte('created_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString())
			.limit(10);

		if (questionsError) {
			console.log(questionsError);
		}
		if (questions && questions.length <= 10) {
			canAskQuestion = true;
		}
	}

	const { data: categories, error: categoriesError } = await supabase
		.from('question_categories')
		.select(
			'id, category_name, slug, parent_id, level, intro_markdown, intro_description, intro_status, intro_source, intro_generated_at, intro_updated_at, intro_reviewed_at'
		)
		.order('id', { ascending: true });

	if (categoriesError || !categories) {
		console.log(categoriesError);
		throw error(500, 'Failed to load category tree');
	}
	const categoryRows = categories as QuestionCategoryRow[];

	const normalizedRequestedSlug = buildQuestionCategorySlug(event.params.slug);
	const questionTag =
		categoryRows.find((category) => category.slug === normalizedRequestedSlug) ?? null;

	if (!questionTag) {
		throw error(404, 'Category not found');
	}

	const canonicalSlug = questionTag.slug || buildQuestionCategorySlug(questionTag.category_name);
	if (event.params.slug !== canonicalSlug) {
		throw redirect(301, buildQuestionCategoryPath(canonicalSlug));
	}

	const [
		questionCategories,
		{ data: categoryTags, error: categoryTagsError },
		{ data: activeQuestions, error: activeQuestionsError }
	] = await Promise.all([
		getCategoryQuestions(supabase, questionTable, questionTag.id),
		supabase.from('question_category_tags').select('question_id, tag_id'),
		supabase.from(questionTable).select('id').eq('removed', false)
	]);

	if (categoryTagsError || activeQuestionsError) {
		console.log({
			categoryTagsError,
			activeQuestionsError
		});
		throw error(500, 'Failed to load category tree');
	}

	const activeQuestionIds = new Set(
		(activeQuestions as ActiveQuestionRow[] | null)?.map((question) => question.id) ?? []
	);
	const categoryTree = buildVisibleQuestionCategoryTree(
		categoryRows,
		(categoryTags as QuestionCategoryTagRow[] | null) ?? [],
		activeQuestionIds
	);
	const currentCategoryNode = findQuestionCategoryNodeById(categoryTree, questionTag.id);
	const parents = buildQuestionCategoryPathRows(categoryRows, questionTag.id).map((category) => ({
		id: category.id,
		category_name: category.category_name,
		slug: category.slug,
		level: category.level ?? 0
	}));

	if (!currentCategoryNode) {
		throw error(404, 'No category with live questions found');
	}

	return {
		parents,
		childCategories: currentCategoryNode.children,
		categoryIntroDescription: buildQuestionCategoryIntroDescription(
			questionTag.intro_markdown,
			questionTag.intro_description
		),
		categoryIntroHtml: renderQuestionCategoryIntroMarkdown(questionTag.intro_markdown),
		questionTag,
		questionCategories,
		canAskQuestion
	};
};

async function getCategoryQuestions(supabase: any, questionTable: string, categoryId: number) {
	const { data: questionTagRows, error: questionTagRowsError } = await supabase
		.from('question_category_tags')
		.select('question_id')
		.eq('tag_id', categoryId);

	if (questionTagRowsError) {
		console.log(questionTagRowsError);
		throw error(500, "couldn't find questions");
	}

	const questionIds = Array.from(
		new Set(
			(questionTagRows ?? [])
				.map((row: { question_id: number | null }) => row.question_id)
				.filter((questionId: number | null): questionId is number => Number.isFinite(questionId))
		)
	);

	if (!questionIds.length) {
		return [];
	}

	const { data: questions, error: questionsError } = await supabase
		.from(questionTable)
		.select(
			'id, author_id, comment_count, created_at, updated_at, es_id, img_url, question, question_formatted, url'
		)
		.in('id', questionIds)
		.eq('removed', false)
		.order('updated_at', { ascending: false })
		.order('created_at', { ascending: false });

	if (questionsError) {
		console.log(questionsError);
		throw error(500, "couldn't find questions");
	}

	return questions ?? [];
}
