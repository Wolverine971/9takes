// src/routes/api/enneagram-test/results/[token]/+server.ts
//
// Updates a saved Enneagram test result: the name friends see on the link,
// the opt-in email ("email me this result" and "tell me when someone answers"),
// and, for a signed-in test-taker, copying the type onto their profile. The
// result token is the credential; it only ever appears in the test-taker's own URL.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import {
	getTestResultTypes,
	isResultToken,
	sendTestResultEmail,
	testResultUpdateSchema,
	updateTestResult,
	type ResultEmailOutcome
} from '$lib/server/enneagramTest';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export const PATCH: RequestHandler = async ({ params, request, getClientAddress, locals }) => {
	if (!isResultToken(params.token)) {
		return json({ ok: false, message: 'Result not found.' }, { status: 404, headers: NO_STORE });
	}

	const parsed = testResultUpdateSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		const emailIssue = parsed.error.issues.some((issue) => issue.path[0] === 'notifyEmail');
		return json(
			{
				ok: false,
				message: emailIssue
					? 'Enter an email address like you@example.com.'
					: 'Names can be up to 40 characters.'
			},
			{ status: 400, headers: NO_STORE }
		);
	}

	const decision = await consumeApiRateLimit({
		bucket: 'enneagram_test_update',
		subject: resolveRateLimitSubject({
			userId: locals.session?.user?.id,
			clientAddress: getClientAddress()
		})
	});
	if (!decision.allowed) {
		return json(
			{ ok: false, message: 'Too many changes in a short time. Try again later.' },
			{ status: 429, headers: NO_STORE }
		);
	}

	try {
		const db = getSupabaseAdminClient();
		const update = parsed.data;

		if (update.displayName !== undefined || update.notifyEmail !== undefined) {
			const found = await updateTestResult(db, params.token, update);
			if (!found) {
				return json(
					{ ok: false, message: 'Result not found.' },
					{ status: 404, headers: NO_STORE }
				);
			}
		}

		let resultEmail: ResultEmailOutcome | undefined;
		if (update.sendResult && update.notifyEmail) {
			resultEmail = await sendTestResultEmail(db, params.token);
		}

		let savedToProfile: boolean | undefined;
		if (update.saveToProfile) {
			const userId = locals.session?.user?.id;
			if (!userId) {
				return json(
					{ ok: false, message: 'Sign in to save your type to your profile.' },
					{ status: 401, headers: NO_STORE }
				);
			}
			const types = await getTestResultTypes(db, params.token);
			if (!types) {
				return json(
					{ ok: false, message: 'Result not found.' },
					{ status: 404, headers: NO_STORE }
				);
			}
			if (types.length !== 1) {
				return json(
					{ ok: false, message: 'Pick one type first, then save it to your profile.' },
					{ status: 400, headers: NO_STORE }
				);
			}
			// As the signed-in user (RLS), the same write the account page makes.
			const { error: profileError } = await locals.supabase
				.from('profiles')
				.update({ enneagram: String(types[0]) })
				.eq('id', userId);
			if (profileError) throw new Error(profileError.message);
			savedToProfile = true;
		}

		return json({ ok: true, resultEmail, savedToProfile }, { headers: NO_STORE });
	} catch (error) {
		logger.error('Failed to update Enneagram test result', error as Error);
		return json(
			{ ok: false, message: 'We couldn’t save that. Please try again.' },
			{ status: 500, headers: NO_STORE }
		);
	}
};
