// src/routes/questions/categories/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	buildVisibleQuestionCategoryTree,
	findQuestionCategoryNodeById,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';
import {
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown
} from '$lib/server/questionCategoryIntro';

type ActiveQuestionRow = { id: number };

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const supabase = event.locals.supabase as any;
	const slug = event.params.slug ? event.params.slug.split('-').join(' ') : '';
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

	const [
		{ data: questionCategories, error: questionCategoriesErrors },
		{ data: parents, error: parentsError },
		{ data: questionTag, error: questionTagError },
		{ data: categories, error: categoriesError },
		{ data: categoryTags, error: categoryTagsError },
		{ data: activeQuestions, error: activeQuestionsError }
	] = await Promise.all([
		supabase.rpc('get_category_questions', { slug }),
		supabase.rpc('get_category_parent_structure', {
			input_category_name: slug
		}),
		supabase
			.from('question_categories')
			.select(
				'id, category_name, parent_id, level, intro_markdown, intro_description, intro_status, intro_source, intro_generated_at, intro_updated_at, intro_reviewed_at'
			)
			.eq('category_name', slug)
			.maybeSingle(),
		supabase
			.from('question_categories')
			.select('id, category_name, parent_id, level')
			.order('id', { ascending: true }),
		supabase.from('question_category_tags').select('question_id, tag_id'),
		supabase.from(questionTable).select('id').eq('removed', false)
	]);

	if (questionCategoriesErrors) {
		console.log(questionCategoriesErrors);
		throw error(500, "couldn't find questions");
	}

	if (parentsError) {
		console.error(parentsError);
	}

	if (questionTagError || !questionTag) {
		console.log(questionTagError);
		throw error(404, 'Category not found');
	}

	if (categoriesError || categoryTagsError || activeQuestionsError) {
		console.log({
			categoriesError,
			categoryTagsError,
			activeQuestionsError
		});
		throw error(500, 'Failed to load category tree');
	}

	const activeQuestionIds = new Set(
		(activeQuestions as ActiveQuestionRow[] | null)?.map((question) => question.id) ?? []
	);
	const categoryTree = buildVisibleQuestionCategoryTree(
		(categories as QuestionCategoryRow[] | null) ?? [],
		(categoryTags as QuestionCategoryTagRow[] | null) ?? [],
		activeQuestionIds
	);
	const currentCategoryNode = findQuestionCategoryNodeById(categoryTree, questionTag.id);

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
