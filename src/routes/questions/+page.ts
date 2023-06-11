// import { supabase } from '$lib/supabase';
// import { getServerSession } from '@supabase/auth-helpers-sveltekit';
// // import type { PostgrestResponse } from '@supabase/supabase-js';
// import type { Actions, PageLoad } from './$types';
// import { error } from '@sveltejs/kit';
// import { elasticClient } from '$lib/elasticSearch';

// export const load: PageLoad = async (event): Promise<{ questions: any; count: number }> => {
// 	try {
// 		// export async function load(event: any): Promise<{ questions: any; count: number }> {
// 		const {
// 			data: questions,
// 			error: findQuestionsError,
// 			count
// 		} = await supabase.from('questions').select('*', { count: 'estimated' }).limit(20);

// 		if (findQuestionsError) {
// 			throw error(500, {
// 				message: 'Error finding questions'
// 			});
// 		}
// 		return {
// 			questions,
// 			count
// 		};
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
