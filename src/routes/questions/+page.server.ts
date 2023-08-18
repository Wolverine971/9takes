import { supabase } from '$lib/supabase';
// import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { PostgrestResponse } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { elasticClient } from '$lib/elasticSearch';

import { PRIVATE_DEMO } from '$env/static/private';

import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<{ questions: any; count: number | null }> => {
	try {
		const {
			data: questions,
			error: findQuestionsError,
			count
		} = await supabase
			.from(PRIVATE_DEMO ? 'questions_demo' : 'questions')
			.select('*', { count: 'estimated' })
			.order('created_at', { ascending: false })
			.limit(20);

		if (findQuestionsError) {
			throw error(500, {
				message: 'Error finding questions'
			});
		}
		return {
			questions,
			count
		};
	} catch (e) {
		console.log(e);
		throw error(500, {
			message: 'Error finding questions'
		});
	}
};

export const actions: Actions = {
	search: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;

			const { data: questions, error: findQuestionsError } = await supabase
				.from(PRIVATE_DEMO ? 'questions_demo' : 'questions')
				.select('*')
				.textSearch('question', `${questionString.split(' ').join(' | ')}`, {
					type: 'websearch',
					config: 'english'
				});

			return questions;
		} catch (e) {
			console.log(e);
			throw error(500, {
				message: 'Error finding questions'
			});
		}
	},
	typeahead: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;

			const {
				hits: { hits: elasticHits }
			} = await elasticClient.search({
				index: 'question',
				body: {
					query: {
						match_phrase_prefix: {
							['question']: {
								query: questionString
							}
						}
					}
				}
			});

			return elasticHits;
		} catch (e) {
			console.log(e);
			return [];
		}
	},
	sortComments: async ({ request }): Promise<Comment[]> => {
		try {
			const body = Object.fromEntries(await request.formData());

			const enneagramTypes = (body.enneagramTypes as string).split(',');
			const questionId = parseInt(body.questionId as string);

			const { data: comments, error: findCommentsError } = await supabase
				.from(PRIVATE_DEMO ? 'comments_demo' : 'comments')

				.select(`*, profiles!inner (enneagram, id)`, { count: 'exact' })
				.eq('parent_type', 'question')
				.eq('parent_id', questionId)
				.in('profiles.enneagram', enneagramTypes);
			if (comments) {
				return comments as Comment[];
			} else {
				throw error(500, {
					message: 'Error finding comments'
				});
			}
		} catch (e) {
			console.log(e);
			return [];
		}
	},
	getMoreQuestions: async ({ request }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const count = parseInt(body.count as string);

			const { data: moreQuestions, error: moreQuestionsError } = await supabase
				.from(PRIVATE_DEMO ? 'questions_demo' : 'questions')
				.select(`*`, { count: 'estimated' })
				.order('created_at', { ascending: false })
				.range(count, count + 10);

			if (!moreQuestionsError) {
				return moreQuestions;
			} else {
				console.log(moreQuestionsError);
				throw error(500, {
					message: 'Error finding comments'
				});
			}
		} catch (e) {
			console.log(e);
			return [];
		}
	}
};

interface Comment {
	id: number;
	created_at: string;
	comment: string;
	author_id: string;
	ip: string;
	comment_count: number;
	parent_type: string;
	es_id: string;
	parent_id: number;
	like_count: number;
	profiles: Profiles;
}

interface Profiles {
	enneagram: string;
	id: string;
}
