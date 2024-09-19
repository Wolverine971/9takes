import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async () => {
	const { data: top8Questions, error: top8QuestionsError } = await supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.limit(8);

	if (top8QuestionsError) {
		console.log(top8QuestionsError);
	}

	return {
		top8Questions
	};
};
