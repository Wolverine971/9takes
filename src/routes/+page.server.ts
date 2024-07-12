import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: PageServerLoad = async () => {
	const { data: top5Questions, error: top5QuestionsError } = await supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.limit(5);

	if (top5QuestionsError) {
		console.log(top5QuestionsError);
	}

	return {
		top5Questions
	};
};
