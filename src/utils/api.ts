// utils/api.ts
import { supabase } from '$lib/supabase';

export const checkDemoTime = async () => {
	const { data: demoTime } = await supabase
		.from('admin_settings')
		.select('value')
		.eq('type', 'demo_time')
		.single();

	const demo_time = demoTime?.value;
	return demo_time;
};
