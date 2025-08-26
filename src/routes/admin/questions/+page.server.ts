// src/routes/admin/questions/+page.server.ts
import { supabase } from '$lib/supabase';

import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { tagQuestion } from '../../../utils/openai';
import { mapDemoValues } from '../../../utils/demo';

// Helper functions to reduce repetition
async function validateAdmin(session, demoTime) {
	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { data: user, error: findUserError } = await supabase
		.from(demoTime ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single();

	if (findUserError) {
		console.error('Error finding user:', findUserError);
		throw error(404, { message: 'Error searching for user' });
	}

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	return user;
}

/** @type {import('./$types').PageLoad} */
export const load: PageServerLoad = async (event) => {
	try {
		const session = event.locals.session;
		const { demo_time } = await event.parent();

		// Validate user is an admin
		const user = await validateAdmin(session, demo_time);

		// Get questions with related data
		const { data: questions, error: questionsError } = await supabase
			.from(demo_time ? 'questions_demo' : 'questions')
			.select(
				`*, question_tag(*), ${demo_time ? 'profiles_demo' : 'profiles'} ( external_id, enneagram)`
			)
			.order('created_at', { ascending: false })
			.limit(100);

		if (questionsError) {
			console.error('Error fetching questions:', questionsError);
			throw error(500, { message: 'Failed to load questions' });
		}

		// Get question tags and categories
		const { data: tags, error: tagsError } = await supabase
			.from('question_tag')
			.select(`*, question_subcategories(*, question_subcategories(*))`);

		if (tagsError) {
			console.error('Error fetching tags:', tagsError);
		}

		// Get keywords for questions
		const { data: questionKeywords, error: questionKeywordsError } = await supabase
			.from(`question_keywords`)
			.select('*');

		if (questionKeywordsError) {
			console.error('Error fetching keywords:', questionKeywordsError);
		}

		// Map keywords to questions
		const questionKeywordsMap = questionKeywords.reduce((map, content) => {
			map[content.question_id] = content;
			return map;
		}, {});

		const questionsWithKeywords = questions.map((question) => {
			if (questionKeywordsMap[question.id]) {
				return {
					...question,
					keywords: questionKeywordsMap[question.id].keywords.split(',')
				};
			}
			return question;
		});

		return {
			user: mapDemoValues(user),
			questions: mapDemoValues(questionsWithKeywords),
			demoTime: demo_time,
			tags
		};
	} catch (err) {
		// Pass through redirects and errors
		if (err.status) throw err;

		console.error('Unexpected error in load function:', err);
		throw error(500, { message: 'An unexpected error occurred' });
	}
};

export const actions: Actions = {
	// Classify a single question
	classifyQuestion: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const demo_time = await checkDemoTime();

			// Validate user is an admin
			await validateAdmin(session, demo_time);

			// Get question data from form
			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			// Process question tagging
			await tagQuestion(questionText, parseInt(questionId));

			return { success: true };
		} catch (e) {
			console.error('Failed to classify question:', e);
			throw error(400, {
				message: `Failed to classify question: ${e.message || 'Unknown error'}`
			});
		}
	},

	// Classify all untagged questions
	classifyAllUntaggedQuestions: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const demo_time = await checkDemoTime();

			// Validate user is an admin
			await validateAdmin(session, demo_time);

			// Get question data from form
			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			// Process question tagging
			await tagQuestion(questionText, parseInt(questionId));

			return { success: true };
		} catch (e) {
			console.error('Failed to classify all questions:', e);
			throw error(400, {
				message: `Failed to classify questions: ${e.message || 'Unknown error'}`
			});
		}
	},

	// Update user account details
	updateUserAccount: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const demo_time = await checkDemoTime();

			// Validate user is an admin
			await validateAdmin(session, demo_time);

			// Get user data from form
			const body = Object.fromEntries(await request.formData());
			const userData = {
				first_name: body.firstName as string,
				last_name: body.lastName as string,
				enneagram: body.enneagram as string
			};
			const email = body.email as string;

			// Update user in database
			const { error: updateUserError } = await supabase
				.from(demo_time ? 'profiles_demo' : 'profiles')
				.update(userData)
				.eq('email', email);

			if (updateUserError) {
				console.error('Failed to update user:', updateUserError);
				throw error(500, {
					message: `Database error: ${updateUserError.message}`
				});
			}

			return { success: true };
		} catch (e) {
			console.error('Failed to update user:', e);
			throw error(400, {
				message: `Failed to update user: ${e.message || 'Unknown error'}`
			});
		}
	}
};
