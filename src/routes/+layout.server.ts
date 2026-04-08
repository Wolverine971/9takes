// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import {
	buildQuestionCategoryPathRows,
	type QuestionCategoryRow
} from '$lib/server/questionCategoryTree';
import { buildQuestionCategorySlug } from '$lib/utils/questionCategorySlug';
import { logger } from '$lib/utils/logger';

type ParentCategory = Pick<QuestionCategoryRow, 'id' | 'category_name' | 'slug' | 'level'>;

export const load: LayoutServerLoad = async (event) => {
	const { data: demoSetting, error: adminSettingsError } = await event.locals.supabase
		.from('admin_settings')
		.select('value')
		.eq('type', 'demo_time')
		.limit(1)
		.maybeSingle();

	if (adminSettingsError) {
		logger.warn('Failed to load admin_settings in layout', adminSettingsError);
	}

	let parents: ParentCategory[] = [];
	if (event.url.pathname.startsWith('/questions/categories/')) {
		const rawSlug = event.url.pathname.split('/').pop();
		const normalizedSlug = buildQuestionCategorySlug(rawSlug);

		if (normalizedSlug) {
			const { data: categories, error: categoriesError } = await event.locals.supabase
				.from('question_categories')
				.select('id, category_name, slug, parent_id, level')
				.order('id', { ascending: true });

			if (categoriesError) {
				logger.warn('Failed to fetch category parents', {
					error: categoriesError,
					slug: rawSlug
				});
			} else {
				const categoryRows = (categories ?? []) as QuestionCategoryRow[];
				const currentCategory = categoryRows.find((category) => category.slug === normalizedSlug);

				if (currentCategory) {
					parents = buildQuestionCategoryPathRows(categoryRows, currentCategory.id).map(
						(category) => ({
							id: category.id,
							category_name: category.category_name,
							slug: category.slug,
							level: category.level
						})
					);
				}
			}
		}
	}

	const demo_time = demoSetting?.value;
	const session = event.locals.session;
	let user = event.locals.user;

	if (user?.id) {
		const { data: profile, error: profileError } = await event.locals.supabase
			.from('profiles')
			.select('admin')
			.eq('id', user.id)
			.maybeSingle();

		if (profileError) {
			logger.warn('Failed to load user admin flag in layout', profileError);
		} else {
			user = {
				...user,
				admin: Boolean(profile?.admin)
			};
		}
	}

	return {
		demo_time,
		parents,
		session,
		user
	};
};
