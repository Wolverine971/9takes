// src/routes/admin/+page.server.ts
import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';
import {
	createESQuestion,
	bulkIndexQuestions,
	bulkIndexBlogs,
	indexWithRetry,
	recreateIndex,
	getQuestionIndexMapping,
	getBlogIndexMapping
} from '$lib/elasticSearch';
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

			console.log('Starting comprehensive reindexing...');

			const results = {
				questions: { indexed: 0, failed: 0, total: 0, errors: [] as any[] },
				blogs: { indexed: 0, failed: 0, total: 0, errors: [] as any[] }
			};

			// Step 1: Delete and recreate indices with proper mappings
			console.log('Deleting and recreating Elasticsearch indices...');
			try {
				// Recreate question index
				await recreateIndex('question', getQuestionIndexMapping());
				console.log('Question index recreated successfully');

				// Recreate blog index
				await recreateIndex('blog', getBlogIndexMapping());
				console.log('Blog index recreated successfully');

				// Wait a moment for indices to be fully ready
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} catch (indexError) {
				console.error('Failed to recreate indices:', indexError);
				throw error(500, {
					message: `Failed to recreate Elasticsearch indices: ${indexError instanceof Error ? indexError.message : 'Unknown error'}`
				});
			}

			// Step 2: Reindex Questions with batch processing
			console.log('Reindexing questions...');
			const QUESTION_BATCH_SIZE = 100; // Reduced for safety
			let questionOffset = 0;
			let hasMoreQuestions = true;

			// First, get total count
			const { count: totalQuestions } = await supabase
				.from('questions')
				.select('*', { count: 'exact', head: true });

			results.questions.total = totalQuestions || 0;

			while (hasMoreQuestions) {
				// Fetch batch with author information
				const { data: questionBatch } = await supabase
					.from('questions')
					.select('*')
					.order('created_at', { ascending: false })
					.range(questionOffset, questionOffset + QUESTION_BATCH_SIZE - 1);

				if (!questionBatch || questionBatch.length === 0) {
					hasMoreQuestions = false;
					break;
				}

				// Prepare questions for indexing (using existing data)
				const enrichedQuestions = questionBatch.map((q) => ({
					...q,
					author_enneagram: '', // Will be enriched in future update
					author_name: '' // Will be enriched in future update
				}));

				// Use bulk indexing with retry
				const indexResult = await indexWithRetry(
					() => bulkIndexQuestions(enrichedQuestions),
					3,
					1000
				);

				results.questions.indexed += indexResult.indexed;
				results.questions.failed += indexResult.failed;
				results.questions.errors.push(...indexResult.errors);

				// Update Supabase with ES IDs for successfully indexed questions
				const successfulQuestions = enrichedQuestions.filter(
					(_, i) => !indexResult.errors.find((e) => e.questionId === enrichedQuestions[i].id)
				);

				if (successfulQuestions.length > 0) {
					// Batch update es_id in Supabase
					for (const q of successfulQuestions) {
						await supabase
							.from('questions')
							.update({ es_id: q.es_id || `question_${q.id}` })
							.eq('id', q.id);
					}
				}

				console.log(
					`Processed questions ${questionOffset} to ${questionOffset + questionBatch.length}`
				);

				if (questionBatch.length < QUESTION_BATCH_SIZE) {
					hasMoreQuestions = false;
				}
				questionOffset += QUESTION_BATCH_SIZE;
			}

			// Step 3: Reindex Blog Posts
			console.log('Reindexing blog posts...');
			const BLOG_BATCH_SIZE = 20; // Much smaller batch size for blogs due to large content
			let blogOffset = 0;
			let hasMoreBlogs = true;

			// Get total blog count
			const { count: totalBlogs } = await supabase
				.from('blogs_famous_people')
				.select('*', { count: 'exact', head: true })
				.eq('published', true);

			results.blogs.total = totalBlogs || 0;

			while (hasMoreBlogs) {
				const { data: blogBatch } = await supabase
					.from('blogs_famous_people')
					.select('*')
					.eq('published', true)
					.order('created_at', { ascending: false })
					.range(blogOffset, blogOffset + BLOG_BATCH_SIZE - 1);

				if (!blogBatch || blogBatch.length === 0) {
					hasMoreBlogs = false;
					break;
				}

				// Truncate large content fields to prevent 413 errors
				const processedBlogs = blogBatch.map((blog: any) => ({
					...blog,
					content: blog.content ? String(blog.content).substring(0, 10000) : '', // Limit to 10k chars
					description: blog.description ? String(blog.description).substring(0, 1000) : '' // Limit to 1k chars
				}));

				// Use bulk indexing for blogs
				const blogIndexResult = await indexWithRetry(() => bulkIndexBlogs(processedBlogs), 3, 1000);

				results.blogs.indexed += blogIndexResult.indexed;
				results.blogs.failed += blogIndexResult.failed;
				results.blogs.errors.push(...blogIndexResult.errors);

				console.log(`Processed blogs ${blogOffset} to ${blogOffset + blogBatch.length}`);

				if (blogBatch.length < BLOG_BATCH_SIZE) {
					hasMoreBlogs = false;
				}
				blogOffset += BLOG_BATCH_SIZE;
			}

			// Prepare summary
			const totalIndexed = results.questions.indexed + results.blogs.indexed;
			const totalFailed = results.questions.failed + results.blogs.failed;
			const totalDocuments = results.questions.total + results.blogs.total;

			const successMessage =
				totalFailed === 0
					? `Successfully reindexed all ${totalIndexed} documents (${results.questions.indexed} questions, ${results.blogs.indexed} blogs).`
					: `Reindexing completed with errors. Successfully indexed ${totalIndexed} out of ${totalDocuments} documents.`;

			console.log('Reindexing complete:', {
				questions: results.questions,
				blogs: results.blogs
			});

			return {
				success: totalFailed === 0,
				message: successMessage,
				details: {
					questions: {
						indexed: results.questions.indexed,
						failed: results.questions.failed,
						total: results.questions.total,
						errors: results.questions.errors.slice(0, 5) // First 5 errors
					},
					blogs: {
						indexed: results.blogs.indexed,
						failed: results.blogs.failed,
						total: results.blogs.total,
						errors: results.blogs.errors.slice(0, 5) // First 5 errors
					}
				},
				indexed: totalIndexed,
				failed: totalFailed,
				total: totalDocuments
			};
		} catch (e) {
			console.error('Reindexing failed:', e);
			throw error(500, {
				message: `Failed to reindex: ${e instanceof Error ? e.message : 'Unknown error'}`
			});
		}
	}
};
