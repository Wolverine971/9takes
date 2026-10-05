// src/routes/api/beta-signup/+server.ts
//
// The beta card's email form ("Want to try experimental therapy, 9takes
// style?"). Personality pages are served from the ISR cache, where Vercel drops
// `?/action` form posts, so the card posts JSON here instead.
//
// Bot filtering mirrors Talk to DJ: honeypot, minimum fill time, user agent,
// per-visitor rate limit. Obvious bots get a fake success so they learn
// nothing. Nothing is emailed to the address; DJ is alerted and writes back by
// hand ($lib/server/betaSignups).
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import {
	BETA_PLACEMENTS,
	BETA_SIGNUP_MIN_FORM_MS,
	BETA_SURFACES,
	createBetaSignup
} from '$lib/server/betaSignups';
import { recordCtaExperimentEvent } from '$lib/server/ctaExperiments';
import { isLikelyCrawlerUserAgent } from '$lib/server/giveFirstFunnel';
import { looksLikeBotUserAgent } from '$lib/server/talkNotes';
import { BETA_CARD_EXPERIMENT, isBetaCardVariantId } from '$lib/utils/betaCardCopy';
import { isHoneypotTriggered } from '$lib/utils/recaptcha';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

const requestSchema = z.object({
	email: z.string().trim().min(3).max(254),
	surface: z.enum(BETA_SURFACES),
	placement: z.enum(BETA_PLACEMENTS),
	sourcePath: z
		.string()
		.max(300)
		.regex(/^\/[A-Za-z0-9\-._~/%]*$/, 'invalid path')
		.nullish(),
	variant: z.string().refine(isBetaCardVariantId, 'unknown variant').nullish(),
	form_extra: z.string().max(500).optional(),
	_timeToken: z.number().int().nonnegative().optional()
});

const accepted = () => json({ ok: true }, { headers: NO_STORE });

export const POST: RequestHandler = async ({ request, getClientAddress, locals, cookies }) => {
	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json(
			{ ok: false, message: 'Something went wrong. Please try again.' },
			{ status: 400, headers: NO_STORE }
		);
	}

	const input = parsed.data;
	const userAgent = request.headers.get('user-agent') ?? '';

	if (isHoneypotTriggered(input.form_extra)) return accepted();
	if (input._timeToken !== undefined && input._timeToken < BETA_SIGNUP_MIN_FORM_MS) {
		return accepted();
	}
	if (looksLikeBotUserAgent(userAgent) || isLikelyCrawlerUserAgent(userAgent)) return accepted();

	const clientAddress = getClientAddress();
	const decision = await consumeApiRateLimit({
		bucket: 'beta_signup',
		subject: resolveRateLimitSubject({ userId: locals.session?.user?.id, clientAddress })
	});
	if (!decision.allowed) {
		return json(
			{ ok: false, message: 'You’ve tried a few times already. Give it a little while.' },
			{ status: 429, headers: NO_STORE }
		);
	}

	const result = await createBetaSignup({
		email: input.email,
		surface: input.surface,
		placement: input.placement,
		sourcePath: input.sourcePath ?? null,
		variant: input.variant ?? null,
		userAgent,
		clientAddress
	});

	if (!result.ok) {
		return json(
			{ ok: false, message: result.message },
			{ status: result.status, headers: NO_STORE }
		);
	}
	if (result.recorded && input.variant) {
		await recordCtaExperimentEvent({
			experiment: BETA_CARD_EXPERIMENT,
			variant: input.variant,
			event: 'submitted',
			surface: input.surface,
			placement: input.placement,
			path: input.sourcePath ?? null,
			fingerprint: cookies.get('9tfingerprint') ?? null
		});
	}
	return accepted();
};
