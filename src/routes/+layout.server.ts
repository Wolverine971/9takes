import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async (event) => {
	const { data: adminSettings, error: adminSettingsError } = await supabase
		.from('admin_settings')
		.select('*');

	if (adminSettingsError) {
		console.log(adminSettingsError);
	}

	const demo_time = adminSettings?.filter((setting) => setting.type === 'demo_time')[0]?.value;
	const session = event.locals.session

	return {
		demo_time,
		session
	};
};
