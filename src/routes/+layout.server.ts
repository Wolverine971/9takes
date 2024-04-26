import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async (event) => {
	const { data: adminSettings, error: adminSettingsError } = await supabase
		.from('admin_settings')
		.select('*');

	if (adminSettingsError) {
		console.log(adminSettingsError);
	}

	const { data: top5Questions, error: top5QuestionsError } = await supabase
		.from('questions')
		.select('*')
		.order('comment_count', { ascending: false })
		.limit(5);

	if (top5QuestionsError) {
		console.log(top5QuestionsError);
	}

	const demo_time = adminSettings?.filter((setting) => setting.type === 'demo_time')[0]?.value;
	const session = event.locals.session;

	return {
		demo_time,
		session,
		top5Questions
	};
};
