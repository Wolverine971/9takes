import { supabase } from '$lib/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// import type { PostgrestResponse } from '@supabase/supabase-js';
import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { elasticClient } from '$lib/elasticSearch';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	const session = await getServerSession(event);
	let {
		data: questions,
		error: findQuestionsError,
		count
	} = await supabase.from('questions').select('*', { count: 'estimated' }).limit(20);

	if (findQuestionsError) {
		throw error(500, {
			message: 'Error finding questions'
		});
	}
	return {
		questions,
		count,
		session
	};
}

export const actions: Actions = {
	search: async ({ request, getClientAddress }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;
			console.log(body);
			let { data: questions, error: findQuestionsError } = await supabase
				.from('questions')
				.select('*')
				.textSearch('question', `${questionString.split(' ').join(' | ')}`, {
					type: 'websearch',
					config: 'english'
				});
			// .limit(10);

			return questions;
		} catch (e) {
			console.log(e);
		}
	},
	typeahead: async ({ request, getClientAddress }) => {
		try {
			const body = Object.fromEntries(await request.formData());
			const questionString = body.searchString as string;
			console.log(body);
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
		}
	}
};
