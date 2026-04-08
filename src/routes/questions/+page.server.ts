// src/routes/questions/+page.server.ts
import { error, isRedirect, redirect } from '@sveltejs/kit';
import {
	buildQuestionCategoryPath,
	buildQuestionCategorySlug
} from '$lib/utils/questionCategorySlug';
import {
	buildVisibleQuestionCategoryTree,
	listQuestionCategoriesWithDirectQuestions,
	type QuestionCategoryRow,
	type QuestionCategoryTagRow
} from '$lib/server/questionCategoryTree';
import { searchQuestionsTypeahead } from '$lib/server/questionSearch';
import { z } from 'zod';

import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';
import { replaceQuestionTags } from '../../utils/server/openai';

const QUESTIONS_PER_PAGE = 20;

type ActiveQuestionRow = { id: number };

// Type for the RPC response
interface QuestionsPageData {
	canAskQuestion: boolean;
	categories: Array<{ id: number; category_name: string; slug?: string | null }>;
	questions: Array<{
		id: number;
		url: string;
		question: string;
		question_formatted?: string;
		comment_count: number;
		created_at: string;
		tag_id?: number;
		tag_name?: string;
	}>;
	totalQuestions: number;
	totalAnswers: number;
}

// Validation schemas for admin actions
const removeQuestionSchema = z.object({
	questionId: z.string().regex(/^\d+$/, 'Invalid question ID')
});

const updateQuestionSchema = z.object({
	questionId: z.string().regex(/^\d+$/, 'Invalid question ID'),
	removed: z.enum(['true', 'false']),
	flagged: z.enum(['true', 'false']),
	question_formatted: z.string().min(1).max(500).trim(),
	tags: z
		.string()
		.transform((val) => {
			try {
				const parsed = JSON.parse(val);
				if (!Array.isArray(parsed)) throw new Error('Tags must be an array');
				return Array.from(
					new Map(
						(parsed as { tag_id: number }[])
							.filter((tag) => Number.isFinite(tag?.tag_id))
							.map((tag) => [tag.tag_id, tag])
					).values()
				);
			} catch {
				throw new Error('Invalid tags JSON');
			}
		})
		.refine((tags) => tags.length <= 5, 'Questions can have at most 5 tags')
});

export const load: PageServerLoad = async (event) => {
	try {
		const { demo_time } = await event.parent();
		const session = event.locals.session;
		const supabase = event.locals.supabase;
		const page = Number(event.url.searchParams.get('page')) || 1;
		const categoryParam = event.url.searchParams.get('category');

		if (categoryParam) {
			const parsed = Number(categoryParam);
			if (Number.isFinite(parsed)) {
				const { data: category } = await supabase
					.from('question_categories')
					.select('category_name, slug')
					.eq('id', parsed)
					.maybeSingle();

				if (category?.category_name) {
					throw redirect(301, buildQuestionCategoryPath(category.slug || category.category_name));
				}
			} else {
				const normalizedCategorySlug = buildQuestionCategorySlug(categoryParam);
				const { data: category } = await supabase
					.from('question_categories')
					.select('category_name, slug')
					.eq('slug', normalizedCategorySlug)
					.maybeSingle();
				if (category?.category_name) {
					throw redirect(301, buildQuestionCategoryPath(category.slug || category.category_name));
				}
			}
		}

		const modernBrowseCategoriesPromise =
			demo_time === true
				? Promise.resolve<QuestionsPageData['categories'] | null>(null)
				: Promise.all([
						supabase
							.from('question_categories')
							.select('id, category_name, slug, parent_id, level')
							.order('id', { ascending: true }),
						supabase.from('question_category_tags').select('question_id, tag_id'),
						supabase.from('questions').select('id').eq('removed', false)
					]).then(([categoriesResult, categoryTagsResult, activeQuestionsResult]) => {
						if (categoriesResult.error || categoryTagsResult.error || activeQuestionsResult.error) {
							console.log({
								categoriesError: categoriesResult.error,
								categoryTagsError: categoryTagsResult.error,
								activeQuestionsError: activeQuestionsResult.error
							});
							return null;
						}

						const activeQuestionIds = new Set(
							(activeQuestionsResult.data as ActiveQuestionRow[] | null)?.map(
								(question) => question.id
							) ?? []
						);
						const categoryTree = buildVisibleQuestionCategoryTree(
							(categoriesResult.data as QuestionCategoryRow[] | null) ?? [],
							(categoryTagsResult.data as QuestionCategoryTagRow[] | null) ?? [],
							activeQuestionIds
						);

						return listQuestionCategoriesWithDirectQuestions(categoryTree)
							.map((category) => ({
								id: category.id,
								category_name: category.category_name,
								slug: category.slug ?? null
							}))
							.sort((a, b) => a.category_name.localeCompare(b.category_name));
					});

		const [pageDataResult, modernBrowseCategories] = await Promise.all([
			// Use optimized RPC function that combines all queries
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(supabase.rpc as any)('get_questions_page_data', {
				p_user_id: session?.user?.id ?? undefined,
				p_limit: QUESTIONS_PER_PAGE,
				p_offset: (page - 1) * QUESTIONS_PER_PAGE,
				p_category_id: undefined
			}),
			modernBrowseCategoriesPromise
		]);

		const { data: rawPageData, error: pageDataError } = pageDataResult;

		if (pageDataError) {
			// Error('Error fetching page data:', pageDataError);
			throw error(500, {
				message: 'Error loading questions'
			});
		}

		const pageData = rawPageData as QuestionsPageData | null;
		const visibleBrowseCategories = modernBrowseCategories ?? pageData?.categories ?? [];

		// Process the data
		const processedData = {
			user: session?.user,
			canAskQuestion: pageData?.canAskQuestion || false,
			subcategoryTags: visibleBrowseCategories,
			questionsAndTags: demo_time
				? mapDemoValues(pageData?.questions || [])
				: pageData?.questions || [],
			totalQuestions: pageData?.totalQuestions || 0,
			totalAnswers: pageData?.totalAnswers || 0,
			currentPage: page,
			hasMore: (pageData?.questions || []).length === QUESTIONS_PER_PAGE,
			selectedCategory: null
		};

		return processedData;
	} catch (e) {
		if (isRedirect(e)) {
			throw e;
		}

		// Error('Page load error:', e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};

export const actions: Actions = {
	typeahead: async ({ request, locals }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = (body.searchString as string) || '';

			if (!questionString || questionString.length < 2) {
				return [];
			}

			const results = await searchQuestionsTypeahead(locals.supabase, questionString, 10);

			return results.map((result) => {
				return {
					_source: {
						question: result.question,
						url: result.url,
						id: result.id,
						comment_count: result.comment_count,
						highlighted: result.highlighted
					}
				};
			});
		} catch (e) {
			console.error('Question typeahead action failed:', e);
			return [];
		}
	},

	// Load more questions (for infinite scroll)
	loadMore: async ({ request, locals }) => {
		try {
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);
			const body = Object.fromEntries(await request.formData());
			const page = parseInt(body.page as string) || 2;
			const categoryId = body.categoryId ? parseInt(body.categoryId as string) : null;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { data: rawPageData, error: loadError } = await (supabase.rpc as any)(
				'get_questions_page_data',
				{
					p_user_id: locals.session?.user?.id ?? undefined,
					p_limit: QUESTIONS_PER_PAGE,
					p_offset: (page - 1) * QUESTIONS_PER_PAGE,
					p_category_id: categoryId ?? undefined
				}
			);

			if (loadError) {
				// Error('Load more error:', loadError);
				return { questions: [], hasMore: false };
			}

			const pageData = rawPageData as QuestionsPageData | null;

			return {
				questions: demo_time ? mapDemoValues(pageData?.questions || []) : pageData?.questions || [],
				hasMore: (pageData?.questions || []).length === QUESTIONS_PER_PAGE,
				page
			};
		} catch (e) {
			// Load more error
			return { questions: [], hasMore: false };
		}
	},

	// Optimized comment filtering
	filterByCategory: async ({ request, locals }) => {
		try {
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);
			const body = Object.fromEntries(await request.formData());
			const categoryId = parseInt(body.categoryId as string);
			if (!Number.isFinite(categoryId)) {
				return { questions: [], category: null };
			}

			const { data: questions, error: filterError } = await supabase.rpc(
				'get_questions_by_category',
				{
					p_category_id: categoryId,
					p_limit: QUESTIONS_PER_PAGE,
					p_offset: 0
				}
			);

			if (filterError) {
				// Error('Filter error:', filterError);
				return { questions: [], category: null };
			}

			return {
				questions: demo_time ? mapDemoValues(questions || []) : questions || [],
				category: categoryId
			};
		} catch (e) {
			// Error('Filter error:', e);
			return { questions: [], category: null };
		}
	},

	remove: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const supabase = locals.supabase;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError || !user?.admin) {
				throw error(403, 'Not authorized');
			}

			// Validate input
			const body = Object.fromEntries(await request.formData());
			const validatedData = removeQuestionSchema.parse(body);
			const questionId = parseInt(validatedData.questionId);

			const { error: removeQuestionError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.update({ removed: true })
				.eq('id', questionId);

			if (!removeQuestionError) {
				return { success: true };
			} else {
				throw error(500, 'Error removing question');
			}
		} catch (e) {
			if (e instanceof z.ZodError) {
				throw error(400, { message: 'Invalid question ID' });
			}
			// Re-throw HTTP errors
			if ((e as any).status) {
				throw e;
			}
			return { success: false };
		}
	},

	update: async ({ request, locals }) => {
		try {
			const session = locals.session;
			const supabase = locals.supabase;
			const db = supabase as any;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime(supabase);

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError || !user?.admin) {
				throw error(403, 'Not authorized');
			}

			// Validate input
			const body = Object.fromEntries(await request.formData());
			const validatedData = updateQuestionSchema.parse(body);
			const questionId = parseInt(validatedData.questionId);
			const removed = validatedData.removed === 'true';
			const flagged = validatedData.flagged === 'true';
			const question_formatted = validatedData.question_formatted;
			const tags = validatedData.tags;
			const questionsTable = demo_time === true ? 'questions_demo' : 'questions';

			const { data: existingQuestion, error: existingQuestionError } = await db
				.from(questionsTable)
				.select('tagged')
				.eq('id', questionId)
				.maybeSingle();

			if (existingQuestionError || !existingQuestion) {
				throw error(404, 'Question not found');
			}

			const nextTagged = Boolean(existingQuestion.tagged) || tags.length > 0 || flagged;
			const updatedAt = new Date().toISOString();

			// Update question
			const { error: updateError } = await db
				.from(questionsTable)
				.update({
					question_formatted,
					removed,
					flagged,
					tagged: nextTagged,
					updated_at: updatedAt
				})
				.eq('id', questionId);

			if (updateError) {
				throw error(500, 'Error updating question');
			}

			await replaceQuestionTags(
				supabase,
				questionId,
				tags.map((tag) => tag.tag_id),
				demo_time === true
			);

			return {
				success: true,
				question: {
					id: questionId,
					tagged: nextTagged,
					flagged,
					removed,
					question_formatted,
					updated_at: updatedAt,
					question_tag: tags
				}
			};
		} catch (e) {
			if (e instanceof z.ZodError) {
				throw error(400, { message: 'Invalid input data' });
			}
			// Re-throw HTTP errors
			if ((e as any).status) {
				throw e;
			}
			return { success: false };
		}
	}
};
