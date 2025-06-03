import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutServerLoad = async (event) => {
	const { data: adminSettings, error: adminSettingsError } = await supabase
		.from('admin_settings')
		.select('*');

	if (adminSettingsError) {
		console.log(adminSettingsError);
	}

	let parents: any = [];
	if (event.url.pathname.includes('/categories')) {
		const slug = event.url.pathname.split('/').pop();

		const { data: parentsCats, error: parentsError } = await supabase.rpc(
			'get_category_parent_structure',
			{ input_category_name: slug?.split('-').join(' ') }
		);

		if (parentsError) console.error(parentsError);
		parents = parentsCats;
	}

	const demo_time = adminSettings?.filter((setting) => setting.type === 'demo_time')[0]?.value;

	return {
		demo_time,
		parents
	};
};
