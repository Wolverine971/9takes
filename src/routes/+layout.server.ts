// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { logger } from '$lib/utils/logger';

type ParentCategory = { id: number; category_name: string; level: number };

export const load: LayoutServerLoad = async (event) => {
	const { data: adminSettings, error: adminSettingsError } = await event.locals.supabase
		.from('admin_settings')
		.select('*');

	if (adminSettingsError) {
		logger.warn('Failed to load admin_settings in layout', adminSettingsError);
	}

	let parents: ParentCategory[] = [];
	if (event.url.pathname.includes('/categories')) {
		const slug = event.url.pathname.split('/').pop();

		const slugName = slug ? slug.split('-').join(' ') : null;

		if (slugName) {
			const { data: parentsCats, error: parentsError } = await event.locals.supabase.rpc(
				'get_category_parent_structure',
				{ input_category_name: slugName }
			);

			if (parentsError) {
				logger.warn('Failed to fetch category parents', { error: parentsError, slug });
			} else if (Array.isArray(parentsCats)) {
				parents = parentsCats as ParentCategory[];
			}
		}
	}

	const demo_time = adminSettings?.filter((setting) => setting.type === 'demo_time')[0]?.value;
	const session = event.locals.session;
	const user = event.locals.user;

	return {
		demo_time,
		parents,
		session,
		user
	};
};
