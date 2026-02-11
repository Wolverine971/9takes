// src/routes/admin/questions/+page.server.ts
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { tagQuestion } from '../../../utils/server/openai';
import { mapDemoValues } from '../../../utils/demo';
import type { Database } from '../../../../database.types';

// Helper functions to reduce repetition
type AdminProfile = Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'admin' | 'external_id'>;
type QuestionKeywordRow = Database['public']['Tables']['question_keywords']['Row'];

async function validateAdmin(
	session: App.Locals['session'],
	demoTime: boolean | null | undefined,
	supabase: App.Locals['supabase']
): Promise<AdminProfile> {
	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const db = supabase as any;
	const { data: user, error: findUserError } = (await db
		.from(demoTime ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session.user.id)
		.single()) as { data: AdminProfile | null; error: unknown };

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
		const supabase = event.locals.supabase;
		const { demo_time } = await event.parent();
		const db = supabase as any;

		// Validate user is an admin
		const user = await validateAdmin(session, demo_time, supabase);

		// Get questions with related data
		const { data: questions, error: questionsError } = await db
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
		const questionKeywordsMap = (questionKeywords ?? []).reduce(
			(map: Record<number, QuestionKeywordRow>, content) => {
				if (content.question_id !== null) {
					map[content.question_id] = content;
				}
				return map;
			},
			{}
		);

		const questionsWithKeywords = (questions ?? []).map((question: any) => {
			const keywordRow = questionKeywordsMap[question.id];
			if (keywordRow) {
				return {
					...question,
					keywords: (keywordRow.keywords ?? '').split(',').filter(Boolean)
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
		if (err && typeof err === 'object' && 'status' in err) throw err;

		console.error('Unexpected error in load function:', err);
		throw error(500, { message: 'An unexpected error occurred' });
	}
};

export const actions: Actions = {
	// Classify a single question
	classifyQuestion: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);

			// Validate user is an admin
			await validateAdmin(session, demo_time, supabase);

			// Get question data from form
			const body = Object.fromEntries(await request.formData());
			const questionId = Number.parseInt(String(body.questionId ?? '0'), 10);
			const questionText = String(body.questionText ?? '');

			// Process question tagging
			await tagQuestion(supabase, questionText, questionId);

			return { success: true };
		} catch (e) {
			console.error('Failed to classify question:', e);
			throw error(500, 'Failed to classify question');
		}
	},

	// Classify all untagged questions
	classifyAllUntaggedQuestions: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);

			// Validate user is an admin
			await validateAdmin(session, demo_time, supabase);

			// Get question data from form
			const body = Object.fromEntries(await request.formData());
			const questionId = Number.parseInt(String(body.questionId ?? '0'), 10);
			const questionText = String(body.questionText ?? '');

			// Process question tagging
			await tagQuestion(supabase, questionText, questionId);

			return { success: true };
		} catch (e) {
			console.error('Failed to classify all questions:', e);
			throw error(500, 'Failed to classify questions');
		}
	},

	// Update user account details
	updateUserAccount: async ({ request, locals }) => {
		try {
			const session = locals?.session;
			const supabase = locals.supabase;
			const demo_time = await checkDemoTime(supabase);
			const db = supabase as any;

			// Validate user is an admin
			await validateAdmin(session, demo_time, supabase);

			// Get user data from form
			const body = Object.fromEntries(await request.formData());
			const userData = {
				first_name: String(body.firstName ?? ''),
				last_name: String(body.lastName ?? ''),
				enneagram: String(body.enneagram ?? '')
			};
			const email = String(body.email ?? '');

			// Update user in database
			const { error: updateUserError } = await db
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
				message: `Failed to update user: ${e instanceof Error ? e.message : 'Unknown error'}`
			});
		}
	}
};
