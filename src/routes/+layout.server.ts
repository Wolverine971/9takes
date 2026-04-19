// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import {
	buildQuestionCategoryPathRows,
	type QuestionCategoryRow
} from '$lib/server/questionCategoryTree';
import { buildQuestionCategorySlug } from '$lib/utils/questionCategorySlug';
import { logger } from '$lib/utils/logger';
import { checkDemoTime } from '../utils/api';

type ParentCategory = Pick<QuestionCategoryRow, 'id' | 'category_name' | 'slug' | 'level'>;

export const load: LayoutServerLoad = async (event) => {
	let demoTimeValue: unknown = undefined;
	try {
		demoTimeValue = await checkDemoTime(event.locals.supabase);
	} catch (adminSettingsError) {
		logger.warn('Failed to load admin_settings in layout', {
			error:
				adminSettingsError instanceof Error
					? adminSettingsError.message
					: String(adminSettingsError)
		});
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

	const demo_time = demoTimeValue;
	const session = event.locals.session;
	let user = event.locals.user;

	if (user?.id) {
		const { data: profile, error: profileError } = await event.locals.supabase
			.from('profiles')
			.select('admin, first_visit_at')
			.eq('id', user.id)
			.maybeSingle();

		if (profileError) {
			logger.warn('Failed to load user admin flag in layout', profileError);
		} else {
			const fingerprint = event.cookies.get('9tfingerprint');
			const typedProfile = profile as {
				admin?: boolean | null;
				first_visit_at?: string | null;
			} | null;

			if (fingerprint && typedProfile && !typedProfile.first_visit_at) {
				const { error: attachError } = await (event.locals.supabase as any).rpc(
					'attach_profile_first_touch',
					{
						p_profile_id: user.id,
						p_fingerprint: fingerprint
					}
				);

				if (attachError) {
					logger.warn('Failed to attach first-touch metadata to profile in layout', {
						userId: user.id,
						error: attachError
					});
				}
			}

			user = {
				...user,
				admin: Boolean(typedProfile?.admin)
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
