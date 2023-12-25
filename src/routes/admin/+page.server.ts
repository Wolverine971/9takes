import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';
import { createESQuestion } from '$lib/elasticSearch';
import { mapDemoValues } from '../../utils/demo';

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}
	const { demo_time } = await event.parent();
	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	const { data: dailyVisitors, error: dailyVisitorsErrors } = await supabase.rpc(
		'visitors_last_30_days',
		{}
	);
	if (dailyVisitorsErrors) {
		console.log(dailyVisitorsErrors);
	}

	const { data: dailyComments, error: dailyCommentsErrors } = await supabase.rpc(
		'comments_last_30_days',
		{}
	);
	if (dailyCommentsErrors) {
		console.log(dailyCommentsErrors);
	}

	const { data: dailyQuestions, error: dailyQuestionsErrors } = await supabase.rpc(
		'daily_questions_stats',
		{}
	);
	if (dailyQuestionsErrors) {
		console.log(dailyQuestionsErrors);
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	if (!findUserError) {
		return {
			session,
			user: mapDemoValues(user),
			demoTime: demo_time,
			dailyVisitors,
			dailyComments,
			dailyQuestions
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	toggleDemo: async (event) => {
		try {
			const session = event.locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}
			const demo_time = await checkDemoTime();

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				throw error(400, 'unauthorized');
			}

			const newDemoTime = !demo_time;
			const { error: updateDemoError } = await supabase
				.from('admin_settings')
				.update({ value: newDemoTime })
				.eq('id', 2)
				.select();
			// insert(userData);
			if (!updateDemoError) {
				return { success: true };
			} else {
				throw error(500, {
					message: `Failed to update demo ${JSON.stringify(updateDemoError)}`
				});
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to update demo ${JSON.stringify(e)}`
			});
		}
	},

	reindexEverything: async (event) => {
		try {
			const session = event.locals.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (!user?.admin) {
				// throw redirect(307, '/questions');
				throw error(400, 'unauthorized');
			}

			const { data: questions } = await supabase.from('questions').select('*');
			if (questions?.length) {
				for await (const question of questions) {
					const resp: any = await createESQuestion({
						question: question.question,
						author_id: question.author_id,
						context: question.context,
						url: question.url,
						img_url: question.img_url
					});

					if (resp?._id) {
						const esId = resp._id;

						const { error: updateQuestionError } = await supabase
							.from('questions')
							.update({ es_id: esId })
							.eq('id', question.id);

						if (updateQuestionError) {
							console.log(updateQuestionError);
						}
					}
				}
				return { success: true };
			}
		} catch (e) {
			throw error(400, {
				message: `Failed to update demo ${JSON.stringify(e)}`
			});
		}
	}
};
