// src/routes/api/enneagram-test/results/+server.ts
//
// Saves a finished Enneagram test (T-42) and returns the private result token
// plus the friend-link token. Anonymous: no session or identity is stored.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import { createTestResult, testResultInputSchema } from '$lib/server/enneagramTest';
import { isLikelyCrawlerUserAgent } from '$lib/server/giveFirstFunnel';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { looksLikeBotUserAgent } from '$lib/server/talkNotes';
import { logger } from '$lib/utils/logger';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export const POST: RequestHandler = async ({ request, getClientAddress, locals }) => {
	const parsed = testResultInputSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json(
			{ ok: false, message: 'That result didn’t look right. Please try again.' },
			{ status: 400, headers: NO_STORE }
		);
	}

	const userAgent = request.headers.get('user-agent') ?? '';
	if (looksLikeBotUserAgent(userAgent) || isLikelyCrawlerUserAgent(userAgent)) {
		return json({ ok: false, message: 'Not available.' }, { status: 403, headers: NO_STORE });
	}

	const decision = await consumeApiRateLimit({
		bucket: 'enneagram_test_result',
		subject: resolveRateLimitSubject({
			userId: locals.session?.user?.id,
			clientAddress: getClientAddress()
		})
	});
	if (!decision.allowed) {
		return json(
			{ ok: false, message: 'You’ve taken the test a lot in the last hour. Try again later.' },
			{
				status: 429,
				headers: { ...NO_STORE, 'Retry-After': String(decision.retryAfterSeconds) }
			}
		);
	}

	try {
		const tokens = await createTestResult(getSupabaseAdminClient(), parsed.data);
		return json({ ok: true, ...tokens }, { headers: NO_STORE });
	} catch (error) {
		logger.error('Failed to save Enneagram test result', error as Error);
		return json(
			{ ok: false, message: 'We couldn’t save your result. Please try again.' },
			{ status: 500, headers: NO_STORE }
		);
	}
};
