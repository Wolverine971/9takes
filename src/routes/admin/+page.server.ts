// src/routes/admin/+page.server.ts
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

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	if (findUserError) {
		throw error(404, {
			message: `Error searching for user`
		});
	}

	const { data: dailyVisitors, error: dailyVisitorsErrors } = await supabase.rpc(
		'visitors_last_30_days',
		{}
	);
	if (dailyVisitorsErrors) {
		// Handle daily visitors error
	}

	const { data: dailyComments, error: dailyCommentsErrors } = await supabase.rpc(
		'comments_last_30_days',
		{}
	);
	if (dailyCommentsErrors) {
		// Handle daily comments error
	}

	const { data: dailyQuestions, error: dailyQuestionsErrors } = await supabase.rpc(
		'daily_questions_stats',
		{}
	);
	if (dailyQuestionsErrors) {
		// Handle daily questions error
	}

	// Get total users count
	const { count: totalUsers } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('*', { count: 'exact', head: true });

	// Get new users in last 30 days
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const { count: newUsersMonth } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('*', { count: 'exact', head: true })
		.gte('created_at', thirtyDaysAgo.toISOString());

	// Get new users today
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const { count: newUsersToday } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('*', { count: 'exact', head: true })
		.gte('created_at', today.toISOString());

	// Get coaching waitlist signups
	const { count: coachingWaitlist } = await supabase
		.from('coaching_waitlist')
		.select('*', { count: 'exact', head: true });

	// Get total questions count
	const { count: totalQuestions } = await supabase
		.from('questions')
		.select('*', { count: 'exact', head: true });

	// Get total comments count
	const { count: totalComments } = await supabase
		.from('comments')
		.select('*', { count: 'exact', head: true });

	// Get active users (users who commented in last 7 days)
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	const { data: activeUsersData } = await supabase
		.from('comments')
		.select('author_id')
		.gte('created_at', sevenDaysAgo.toISOString());
	const activeUsers = new Set(activeUsersData?.map((c) => c.author_id) || []).size;

	// Get users by enneagram type
	const { data: usersByType } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('enneagram');
	const enneagramDistribution = usersByType?.reduce((acc: any, user: any) => {
		if (user.enneagram) {
			acc[user.enneagram] = (acc[user.enneagram] || 0) + 1;
		}
		return acc;
	}, {});

	// Get recent signups (last 10)
	const { data: recentSignups } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, email, enneagram, created_at, external_id')
		.order('created_at', { ascending: false })
		.limit(10);

	// Get questions created today
	const { count: questionsToday } = await supabase
		.from('questions')
		.select('*', { count: 'exact', head: true })
		.gte('created_at', today.toISOString());

	// Get comments created today
	const { count: commentsToday } = await supabase
		.from('comments')
		.select('*', { count: 'exact', head: true })
		.gte('created_at', today.toISOString());

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	return {
		user: mapDemoValues(user),
		demoTime: demo_time,
		dailyVisitors,
		dailyComments,
		dailyQuestions,
		totalUsers: totalUsers || 0,
		newUsersMonth: newUsersMonth || 0,
		newUsersToday: newUsersToday || 0,
		coachingWaitlist: coachingWaitlist || 0,
		totalQuestions: totalQuestions || 0,
		totalComments: totalComments || 0,
		activeUsers,
		enneagramDistribution: enneagramDistribution || {},
		recentSignups: recentSignups || [],
		questionsToday: questionsToday || 0,
		commentsToday: commentsToday || 0
	};
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
				throw error(400, 'unauthorized');
			}

			const { data: questions } = await supabase.from('questions').select('*');
			
			if (!questions?.length) {
				return { 
					success: false,
					message: 'No questions found to reindex',
					indexed: 0,
					failed: 0,
					total: 0
				};
			}

			let successCount = 0;
			let failureCount = 0;
			const failedQuestions: string[] = [];

			for (const question of questions) {
				try {
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
							console.error(`Failed to update es_id for question ${question.id}:`, updateQuestionError);
							failureCount++;
							failedQuestions.push(question.url);
						} else {
							successCount++;
						}
					} else {
						failureCount++;
						failedQuestions.push(question.url);
					}
				} catch (indexError) {
					console.error(`Failed to index question ${question.id}:`, indexError);
					failureCount++;
					failedQuestions.push(question.url);
				}
			}

			return { 
				success: failureCount === 0,
				message: failureCount > 0 
					? `Reindexing completed with errors. Successfully indexed ${successCount} out of ${questions.length} questions.`
					: `Successfully reindexed all ${successCount} questions.`,
				indexed: successCount,
				failed: failureCount,
				total: questions.length,
				failedQuestions: failureCount > 0 ? failedQuestions.slice(0, 10) : undefined // Return first 10 failed questions
			};
		} catch (e) {
			console.error('Reindexing failed:', e);
			throw error(500, {
				message: `Failed to reindex questions: ${e instanceof Error ? e.message : 'Unknown error'}`
			});
		}
	}
};
