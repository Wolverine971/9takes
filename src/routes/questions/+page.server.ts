// src/routes/questions/+page.server.ts
import { error } from '@sveltejs/kit';
import { deleteESQuestion, elasticClient } from '$lib/elasticSearch';
import { supabase } from '$lib/supabase';

import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { checkDemoTime } from '../../utils/api';
import { mapDemoValues } from '../../utils/demo';

const QUESTIONS_PER_PAGE = 20;

export const load: PageServerLoad = async (event) => {
	try {
		const { demo_time } = await event.parent();
		const session = event.locals.session;
		const page = Number(event.url.searchParams.get('page')) || 1;
		const categoryId = event.url.searchParams.get('category');

		// Use optimized RPC function that combines all queries
		const { data: pageData, error: pageDataError } = await supabase.rpc('get_questions_page_data', {
			p_user_id: session?.user?.id || null,
			p_limit: QUESTIONS_PER_PAGE,
			p_offset: (page - 1) * QUESTIONS_PER_PAGE,
			p_category_id: categoryId ? parseInt(categoryId) : null
		});

		if (pageDataError) {
			// Error('Error fetching page data:', pageDataError);
			throw error(500, {
				message: 'Error loading questions'
			});
		}

		// Process the data
		const processedData = {
			user: session?.user,
			canAskQuestion: pageData?.canAskQuestion || false,
			subcategoryTags: pageData?.categories || [],
			questionsAndTags: demo_time
				? mapDemoValues(pageData?.questions || [])
				: pageData?.questions || [],
			totalQuestions: pageData?.totalQuestions || 0,
			totalAnswers: pageData?.totalAnswers || 0,
			currentPage: page,
			hasMore: (pageData?.questions || []).length === QUESTIONS_PER_PAGE,
			selectedCategory: categoryId
		};

		return processedData;
	} catch (e) {
		// Error('Page load error:', e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};

export const actions: Actions = {
	// Optimized search with single ES query
	typeahead: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;

			if (!questionString || questionString.length < 2) {
				return [];
			}

			// Single optimized Elasticsearch query
			const {
				hits: { hits }
			} = await elasticClient.search({
				index: 'question',
				body: {
					query: {
						bool: {
							should: [
								{
									match_phrase_prefix: {
										question: {
											query: questionString,
											boost: 2
										}
									}
								},
								{
									match: {
										question: {
											query: questionString,
											fuzziness: 'AUTO',
											boost: 1
										}
									}
								}
							]
						}
					},
					highlight: {
						fields: {
							question: {
								fragment_size: 150,
								number_of_fragments: 1
							}
						}
					},
					size: 10,
					_source: ['question', 'url', 'id', 'comment_count']
				}
			});

			// Simplify the response structure to avoid complex serialization
			const results = hits.map((hit) => ({
				_source: {
					question: hit._source.question,
					url: hit._source.url,
					id: hit._source.id,
					comment_count: hit._source.comment_count,
					highlighted: hit.highlight?.question?.[0] || hit._source.question
				}
			}));

			return results;
		} catch (e) {
			// Error('Search error:', e);
			return [];
		}
	},

	// Load more questions (for infinite scroll)
	loadMore: async ({ request, locals }) => {
		try {
			const demo_time = await checkDemoTime();
			const body = Object.fromEntries(await request.formData());
			const page = parseInt(body.page as string) || 2;
			const categoryId = body.categoryId ? parseInt(body.categoryId as string) : null;

			const { data: pageData, error: loadError } = await supabase.rpc('get_questions_page_data', {
				p_user_id: locals.session?.user?.id || null,
				p_limit: QUESTIONS_PER_PAGE,
				p_offset: (page - 1) * QUESTIONS_PER_PAGE,
				p_category_id: categoryId
			});

			if (loadError) {
				// Error('Load more error:', loadError);
				return { questions: [], hasMore: false };
			}

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
	filterByCategory: async ({ request }) => {
		try {
			const demo_time = await checkDemoTime();
			const body = Object.fromEntries(await request.formData());
			const categoryId = parseInt(body.categoryId as string);

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

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError || !user?.admin) {
				throw error(403, 'Not authorized');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = parseInt(body.questionId as string);

			const { error: removeQuestionError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.update({ removed: true })
				.eq('id', questionId);

			if (!removeQuestionError) {
				const { data: question } = await supabase
					.from(demo_time === true ? 'questions_demo' : 'questions')
					.select('es_id')
					.eq('id', questionId)
					.single();

				if (question?.es_id) {
					await deleteESQuestion({ questionId: question.es_id.toString() });
				}

				return { success: true };
			} else {
				throw error(500, 'Error removing question');
			}
		} catch (e) {
			// Error('Remove error:', e);
			return { success: false };
		}
	},

	update: async ({ request, locals }) => {
		try {
			const session = locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError || !user?.admin) {
				throw error(403, 'Not authorized');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = parseInt(body.questionId as string);
			const removed = body.removed === 'true';
			const flagged = body.flagged === 'true';
			const question_formatted = body.question_formatted as string;
			const tags = JSON.parse(body.tags as string);

			// Update question
			const { error: updateError } = await supabase
				.from(demo_time === true ? 'questions_demo' : 'questions')
				.update({ question_formatted, removed, flagged })
				.eq('id', questionId);

			if (updateError) {
				throw error(500, 'Error updating question');
			}

			// Update tags if provided
			if (tags.length > 0) {
				// Remove existing tags
				await supabase
					.from(demo_time === true ? 'question_tags_demo' : 'question_tags')
					.delete()
					.eq('question_id', questionId);

				// Add new tags
				const tagInserts = tags.map((tag: any) => ({
					question_id: questionId,
					tag_id: tag.tag_id
				}));

				await supabase
					.from(demo_time === true ? 'question_tags_demo' : 'question_tags')
					.insert(tagInserts);
			}

			return { success: true };
		} catch (e) {
			// Error('Update error:', e);
			return { success: false };
		}
	}
};
