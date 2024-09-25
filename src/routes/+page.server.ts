import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async () => {
	const { data: top9Questions, error: top9QuestionsError } = await supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.limit(9);

	if (top9QuestionsError) {
		console.log(top9QuestionsError);
	}

	return {
		top9Questions
	};
};
