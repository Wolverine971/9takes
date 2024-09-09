import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { tagQuestion } from '../../../utils/openai';
import { mapDemoValues } from '../../../utils/demo';

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

	const { data: questions, error: questionsError } = await supabase
		.from(demo_time === true ? 'questions_demo' : 'questions')
		.select(
			`*, question_tag(*), ${demo_time === true ? 'profiles_demo' : 'profiles'
			} ( external_id, enneagram)`
		)
		.order('created_at', { ascending: false })
		.limit(100);

	const { data: tags, error: tagsError } = await supabase
		.from('question_tag')
		.select(`*, question_subcategories(*, question_subcategories(*))`);

	if (tagsError) {
		console.log(tagsError);
	}

	if (questionsError) {
		console.log(questionsError);
	}


	const { data: questionKeywords, error: questionKeywordsError } = await supabase
		.from(`question_keywords`)
		.select('*');

	if (questionKeywordsError) {
		console.log(questionKeywordsError);
	}

	const questionKeywordsMap = {};
	questionKeywords.forEach((content) => {
		questionKeywordsMap[content.question_id] = content;
	});

	const questionsAndKeywords = questions.map((question) => {

		if (questionKeywordsMap[question.id]) {
			const newQuestion = question;
			newQuestion.keywords = questionKeywordsMap[question.id].keywords.split(',');
			return newQuestion
		}
		return question;

	})

	if (!findUserError) {
		return {
			session,
			user: mapDemoValues(user),
			questions: mapDemoValues(questionsAndKeywords),
			demoTime: demo_time,
			tags
		};
	} else {
		throw error(404, {
			message: `Error searching for user`
		});
	}
};

export const actions: Actions = {
	classifyQuestion: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw error(400, 'unauthorized');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			await tagQuestion(questionText, parseInt(questionId));
		} catch (e) {
			throw error(400, {
				message: `Failed to classify question ${JSON.stringify(e)}`
			});
		}
	},

	classifyAllUntaggedQuestions: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const questionId = body.questionId as string;
			const questionText = body.questionText as string;

			await tagQuestion(questionText, parseInt(questionId));
		} catch (e) {
			throw error(400, {
				message: `Failed to classify question ${JSON.stringify(e)}`
			});
		}
	},

	updateUserAccount: async ({ request, locals }) => {
		try {
			const session = locals?.session;

			if (!session?.user?.id) {
				throw error(400, 'unauthorized');
			}

			const demo_time = await checkDemoTime();

			const { data: user, error: findUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.select('id, admin, external_id')
				.eq('id', session?.user?.id)
				.single();

			if (findUserError) {
				console.log(findUserError);
			}

			if (!user?.admin) {
				throw redirect(307, '/questions');
			}

			const body = Object.fromEntries(await request.formData());
			const first_name = body.firstName as string;
			const last_name = body.lastName as string;
			const enneagram = body.enneagram as string;
			const email = body.email as string;
			const { error: updateUserError } = await supabase
				.from(demo_time === true ? 'profiles_demo' : 'profiles')
				.update({ first_name, last_name, enneagram })
				.eq('email', email);
			if (updateUserError) {
				throw error(500, {
					message: `Failed to update user ${JSON.stringify(updateUserError)}`
				});
			}
			return { success: true };
		} catch (e) {
			throw error(400, {
				message: `Failed to update user ${JSON.stringify(e)}`
			});
		}
	}
};
