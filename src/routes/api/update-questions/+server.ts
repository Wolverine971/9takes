import { error, json } from '@sveltejs/kit';
import { PRIVATE_WEBHOOK_AUTH } from '$env/static/private';

import { tagQuestion, tagQuestions } from '../../../utils/openai';
import { supabase } from '$lib/supabase';
import { checkDemoTime } from '../../../utils/api';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	try {
		const { headers } = request;

		const auth = headers.get('auth') ?? '';

		if (auth !== PRIVATE_WEBHOOK_AUTH) {
			throw error(400, {
				message: `Failed to update questions: ${JSON.stringify('bad auth')}`
			});
		}

		// await TESTtagQuestions();
		await tagQuestions();
		return json('lets goo');
	} catch (e) {
		console.log(e);
		throw error(400, {
			message: `encountered error`
		});
	}
}

export async function POST({ request, locals }) {
	try {
		// update-question api endpoint
		const session = locals.session;

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

		const body = Object.fromEntries(await request.formData());
		const questionId = body.questionId as string;
		const questionText = body.questionText as string;

		console.log(questionId, questionText);
		await tagQuestion(questionText, parseInt(questionId));

		return json({ data: { success: true } });
	} catch (e) {
		console.log(e);
		throw error(400, {
			message: `encountered error`
		});
	}
}
