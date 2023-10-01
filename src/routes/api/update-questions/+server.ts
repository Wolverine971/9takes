import { error, json } from '@sveltejs/kit';
import { PRIVATE_WEBHOOK_AUTH } from '$env/static/private';

import { tagQuestions } from '../../../utils/openai';

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
		throw error(400, {
			message: `encountered error`
		});
	}
}
