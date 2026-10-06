// src/routes/api/cta-event/+server.ts
//
// The browser reports call-to-action impressions and taps here, for copy
// experiments (cta_experiment_events). Personality pages come from the ISR
// cache, so their server can't see who's reading; the card reports instead.
// Only `viewed` and `opened` come from the browser. `submitted` is written by
// the signup endpoint itself, once the server has really saved the signup.
// Second experiment: taps on the situation doors on /book-session
// (talkSituations.ts). Its `submitted` is written by the note action.
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { recordCtaExperimentEvent } from '$lib/server/ctaExperiments';
import { isLikelyCrawlerUserAgent } from '$lib/server/giveFirstFunnel';
import { looksLikeBotUserAgent } from '$lib/server/talkNotes';
import { BETA_CARD_EXPERIMENT, isBetaCardVariantId } from '$lib/utils/betaCardCopy';
import { BETA_PLACEMENTS, BETA_SURFACES } from '$lib/utils/betaInvite';
import { isTalkSituationId, TALK_SITUATIONS_EXPERIMENT } from '$lib/utils/talkSituations';

const sourcePath = z
	.string()
	.max(300)
	.regex(/^\/[A-Za-z0-9\-._~/%]*$/, 'invalid path')
	.nullish();

const requestSchema = z.discriminatedUnion('experiment', [
	z.object({
		experiment: z.literal(BETA_CARD_EXPERIMENT),
		variant: z.string().refine(isBetaCardVariantId, 'unknown variant'),
		event: z.enum(['viewed', 'opened']),
		surface: z.enum(BETA_SURFACES),
		placement: z.enum(BETA_PLACEMENTS),
		sourcePath
	}),
	z.object({
		experiment: z.literal(TALK_SITUATIONS_EXPERIMENT),
		variant: z.string().refine(isTalkSituationId, 'unknown situation'),
		event: z.literal('opened'),
		surface: z.literal('book_session'),
		placement: z.literal('door'),
		sourcePath
	})
]);

const noContent = () =>
	new Response(null, { status: 204, headers: { 'Cache-Control': 'private, no-store' } });

export const POST: RequestHandler = async ({ request, cookies }) => {
	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return new Response(null, { status: 400, headers: { 'Cache-Control': 'private, no-store' } });
	}

	const userAgent = request.headers.get('user-agent') ?? '';
	if (looksLikeBotUserAgent(userAgent) || isLikelyCrawlerUserAgent(userAgent)) return noContent();

	await recordCtaExperimentEvent({
		experiment: parsed.data.experiment,
		variant: parsed.data.variant,
		event: parsed.data.event,
		surface: parsed.data.surface,
		placement: parsed.data.placement,
		path: parsed.data.sourcePath ?? null,
		fingerprint: cookies.get('9tfingerprint') ?? null
	});

	return noContent();
};
