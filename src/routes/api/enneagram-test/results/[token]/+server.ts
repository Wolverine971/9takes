// src/routes/api/enneagram-test/results/[token]/+server.ts
//
// Updates a saved Enneagram test result: the name friends see on the link,
// and the opt-in email for "tell me when someone answers". The result token
// is the credential; it only ever appears in the test-taker's own URL.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import { isResultToken, testResultUpdateSchema, updateTestResult } from '$lib/server/enneagramTest';
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
		const found = await updateTestResult(getSupabaseAdminClient(), params.token, parsed.data);
		if (!found) {
			return json({ ok: false, message: 'Result not found.' }, { status: 404, headers: NO_STORE });
		}
		return json({ ok: true }, { headers: NO_STORE });
	} catch (error) {
		logger.error('Failed to update Enneagram test result', error as Error);
		return json(
			{ ok: false, message: 'We couldn’t save that. Please try again.' },
			{ status: 500, headers: NO_STORE }
		);
	}
};
