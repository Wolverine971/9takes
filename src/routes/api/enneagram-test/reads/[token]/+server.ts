// src/routes/api/enneagram-test/reads/[token]/+server.ts
//
// A friend's read on someone's Enneagram test ("ask someone who knows you").
// The friend answers first; only then does the response reveal what the
// test-taker picked. If the test-taker opted in, they get one email per read.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import { friendReadInputSchema, isReadToken, submitFriendRead } from '$lib/server/enneagramTest';
import { isLikelyCrawlerUserAgent } from '$lib/server/giveFirstFunnel';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { looksLikeBotUserAgent } from '$lib/server/talkNotes';
import { logger } from '$lib/utils/logger';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export const POST: RequestHandler = async ({ params, request, getClientAddress, locals }) => {
	if (!isReadToken(params.token)) {
		return json(
			{ ok: false, message: 'This link isn’t valid.' },
			{ status: 404, headers: NO_STORE }
		);
	}

	const parsed = friendReadInputSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json(
			{ ok: false, message: 'Names can be up to 40 characters and notes up to 280.' },
			{ status: 400, headers: NO_STORE }
		);
	}

	const userAgent = request.headers.get('user-agent') ?? '';
	if (looksLikeBotUserAgent(userAgent) || isLikelyCrawlerUserAgent(userAgent)) {
		return json({ ok: false, message: 'Not available.' }, { status: 403, headers: NO_STORE });
	}

	const decision = await consumeApiRateLimit({
		bucket: 'enneagram_test_read',
		subject: resolveRateLimitSubject({
			userId: locals.session?.user?.id,
			clientAddress: getClientAddress()
		})
	});
	if (!decision.allowed) {
		return json(
			{ ok: false, message: 'You’ve sent a lot of reads in the last hour. Try again later.' },
			{ status: 429, headers: NO_STORE }
		);
	}

	try {
		const outcome = await submitFriendRead(getSupabaseAdminClient(), params.token, parsed.data);
		if (!outcome) {
			return json(
				{ ok: false, message: 'This link isn’t valid.' },
				{ status: 404, headers: NO_STORE }
			);
		}
		return json(
			{ ok: true, types: outcome.types, displayName: outcome.displayName },
			{ headers: NO_STORE }
		);
	} catch (error) {
		logger.error('Failed to save Enneagram test friend read', error as Error);
		return json(
			{ ok: false, message: 'We couldn’t save your read. Please try again.' },
			{ status: 500, headers: NO_STORE }
		);
	}
};
