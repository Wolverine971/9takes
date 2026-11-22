// src/routes/api/superlatives/vote/+server.ts
//
// Votes from the "Which Enneagram type is the most…" hub
// (/enneagram-corner/enneagram-type-rankings): "This is me" and "Wrong pick?".
// Answers with that trait's fresh results so the card can reveal them right
// after the vote (answer before the crowd).
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import { isLikelyCrawlerUserAgent } from '$lib/server/giveFirstFunnel';
import { looksLikeBotUserAgent } from '$lib/server/talkNotes';
import {
	emptyTraitResults,
	loadSuperlativeSummary,
	recordSuperlativeVote,
	superlativeVoteSchema
} from '$lib/server/superlativeVotes';
import { readVisitorFingerprint } from '$lib/server/visitorFingerprint';
import { logger } from '$lib/utils/logger';

const noStore = { 'Cache-Control': 'private, no-store' };

export const POST: RequestHandler = async ({ request, locals, cookies, getClientAddress }) => {
	const parsed = superlativeVoteSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return json({ error: 'invalid_request' }, { status: 400, headers: noStore });

	const userAgent = request.headers.get('user-agent') ?? '';
	if (looksLikeBotUserAgent(userAgent) || isLikelyCrawlerUserAgent(userAgent)) {
		return json({ error: 'not_allowed' }, { status: 403, headers: noStore });
	}

	// The browser sets this cookie (visitorIdentity.ts) before it votes; it is
	// what keeps one vote per visitor, trait and kind.
	const fingerprint = readVisitorFingerprint(cookies);
	if (!fingerprint) return json({ error: 'missing_identity' }, { status: 400, headers: noStore });
	const userId = locals.user?.id ?? locals.session?.user?.id ?? null;

	const rateLimit = await consumeApiRateLimit({
		bucket: 'superlative_vote',
		subject: resolveRateLimitSubject({ userId, clientAddress: getClientAddress() })
	});
	if (!rateLimit.allowed) {
		return json(
			{ error: 'rate_limited' },
			{
				status: 429,
				headers: { ...noStore, 'Retry-After': String(rateLimit.retryAfterSeconds) }
			}
		);
	}

	try {
		await recordSuperlativeVote(parsed.data, { fingerprint, userId });
	} catch (error) {
		logger.error('Superlative vote failed', error as Error, { trait: parsed.data.trait });
		return json({ error: 'save_failed' }, { status: 503, headers: noStore });
	}

	// The vote is saved; fresh results are a bonus, so a read failure isn't an error.
	let results = emptyTraitResults();
	try {
		results = (await loadSuperlativeSummary())[parsed.data.trait] ?? results;
	} catch (error) {
		logger.warn('Superlative results unavailable after vote', { error });
	}

	return json({ ok: true, trait: parsed.data.trait, results }, { headers: noStore });
};
