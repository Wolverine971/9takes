// src/routes/questions/categories/[slug]/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import {
	buildQuestionCategoryPathRows,
	buildVisibleQuestionCategoryTree,
	findQuestionCategoryNodeById,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow,
	type QuestionCategoryTreeNode
} from '$lib/server/questionCategoryTree';
import {
	buildQuestionCategoryPath,
	buildQuestionCategorySlug
} from '$lib/utils/questionCategorySlug';
import { hasSubstantiveQuestionCategoryIntro } from '$lib/utils/questionCategorySeo.js';
import type { PageServerLoad } from './$types';
import {
	buildQuestionCategoryIntroDescription,
	renderQuestionCategoryIntroMarkdown
} from '$lib/server/questionCategoryIntro';
import legacyCategoryRedirects from '$lib/data/questionCategoryRedirects.json';

type ActiveQuestionRow = { id: number };

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const supabase = event.locals.supabase as any;
	const session = event.locals.session;
	const [{ demo_time }, { data: categories, error: categoriesError }] = await Promise.all([
		event.parent(),
		supabase
			.from('question_categories')
			.select(
				'id, category_name, slug, parent_id, level, intro_markdown, intro_description, intro_status, intro_source, intro_generated_at, intro_updated_at, intro_reviewed_at'
			)
			.order('id', { ascending: true })
	]);
	const questionTable = demo_time === true ? 'questions_demo' : 'questions';

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

	const recentQuestionsPromise = session?.user?.id
		? supabase
				.from(questionTable)
				.select('id')
				.eq('author_id', session.user.id)
				.eq('removed', false)
				.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
				.limit(10)
		: Promise.resolve({ data: null, error: null });

	const [
		{ data: categoryTags, error: categoryTagsError },
		{ data: activeQuestions, error: activeQuestionsError },
		{ data: recentQuestions, error: recentQuestionsError }
	] = await Promise.all([
		supabase.from('question_category_tags').select('question_id, tag_id'),
		supabase.from(questionTable).select('id').eq('removed', false).not('flagged', 'is', true),
		recentQuestionsPromise
	]);

	if (categoryTagsError || activeQuestionsError) {
		console.log({
			categoryTagsError,
			activeQuestionsError
		});
		throw error(500, 'Failed to load category tree');
	}
	if (recentQuestionsError) {
		console.log(recentQuestionsError);
	}
	const canAskQuestion = Boolean(
		session?.user?.id && recentQuestions && recentQuestions.length <= 10
	);
	const categoryTagRows = (categoryTags as QuestionCategoryTagRow[] | null) ?? [];
	const activeQuestionIds = new Set(
		(activeQuestions as ActiveQuestionRow[] | null)?.map((question) => question.id) ?? []
	);
	const categoryTree = buildVisibleQuestionCategoryTree(
		categoryRows,
		categoryTagRows,
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
		// A retired category whose questions moved into the topic directory sends
		// readers to the topic that replaced it.
		const replacementPath = await findReplacementCategoryPath(
			supabase,
			canonicalSlug,
			categoryRows,
			categoryTree
		);
		if (replacementPath) {
			throw redirect(301, replacementPath);
		}
		throw error(404, 'No category with live questions found');
	}

	// A topic page lists every question filed under it or under one of its niches,
	// once each.
	const questionCategories = await getCategoryQuestions(
		supabase,
		questionTable,
		collectCategoryIds(currentCategoryNode),
		categoryTagRows
	);

	return {
		parents,
		childCategories: currentCategoryNode.children,
		isIndexable: hasSubstantiveQuestionCategoryIntro(questionTag.intro_markdown),
		currentCategory: {
			directQuestionCount: currentCategoryNode.directQuestionCount,
			subtreeQuestionCount: currentCategoryNode.subtreeQuestionCount
		},
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

function collectCategoryIds(node: QuestionCategoryTreeNode, ids = new Set<number>()): Set<number> {
	ids.add(node.id);
	for (const child of node.children) collectCategoryIds(child, ids);
	return ids;
}

/**
 * Where a retired category's readers should land: the topic mapped in
 * questionCategoryRedirects.json, or its nearest ancestor that has live questions.
 */
async function findReplacementCategoryPath(
	supabase: any,
	legacySlug: string,
	categories: QuestionCategoryRow[],
	categoryTree: QuestionCategoryTreeNode[]
): Promise<string | null> {
	const topicKey = (legacyCategoryRedirects as Record<string, string>)[legacySlug];
	if (!topicKey) return null;

	const { data: topic, error: topicError } = await supabase
		.from('question_categories')
		.select('id')
		.eq('topic_key', topicKey)
		.maybeSingle();
	if (topicError || !topic) return null;

	const path = buildQuestionCategoryPathRows(categories, topic.id);
	for (let index = path.length - 1; index >= 0; index--) {
		const candidate = path[index];
		if (candidate.slug && findQuestionCategoryNodeById(categoryTree, candidate.id)) {
			return buildQuestionCategoryPath(candidate.slug);
		}
	}
	return '/questions/categories';
}

async function getCategoryQuestions(
	supabase: any,
	questionTable: string,
	categoryIds: Set<number>,
	categoryTags: QuestionCategoryTagRow[]
) {
	const questionIds = Array.from(
		new Set(
			categoryTags
				.filter((row) => categoryIds.has(row.tag_id))
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
		.not('flagged', 'is', true)
		.order('updated_at', { ascending: false })
		.order('created_at', { ascending: false });

	if (questionsError) {
		console.log(questionsError);
		throw error(500, "couldn't find questions");
	}

	return questions ?? [];
}
