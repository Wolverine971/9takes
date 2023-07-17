import { supabase } from '$lib/supabase';
// import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { PostgrestResponse } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { elasticClient } from '$lib/elasticSearch';

import type { Actions } from './$types';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async (): Promise<{ questions: any; count: number | null }> => {
	try {
		const {
			data: questions,
			error: findQuestionsError,
			count
		} = await supabase.from('questions').select('*', { count: 'estimated' }).order('created_at', { ascending: false }).limit(20)

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
	search: async ({ request, getClientAddress }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;

			const { data: questions, error: findQuestionsError } = await supabase
				.from('questions')
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
	typeahead: async ({ request, getClientAddress }) => {
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
	}
};
