// src/routes/api/nine/impression/+server.ts
//
// Give-first gate impression for the NineChorus on personality pages.
//
// Those pages are served from the ISR cache, so their server load can never see
// the visitor (no cookie, no user agent) and cannot record gate_shown the way
// /questions/[slug] does. The browser reports the impression here instead, once
// the Chorus has actually been on screen. Crawler user agents are dropped by
// recordStrategicQuestionImpression ($lib/server/giveFirstFunnel), and the
// funnel RPC keeps one row per visitor per question, so repeats are harmless.
// The matching `contribution` event is written by /api/nine/mirror with the
// same fingerprint and path.
//
// (A form action on the page itself would not work: Vercel strips the
// `?/action` query from requests to the ISR function, so it 404s.)
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import {
	isLikelyCrawlerUserAgent,
	recordStrategicQuestionImpression
} from '$lib/server/giveFirstFunnel';
import { PROVEN_CHORUS_QUESTION_URLS } from '$lib/server/provenChorusQuestions';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { CONTENT_GUARD_CACHE_CONTROL } from '$lib/server/contentAccessGuard';
import { logger } from '$lib/utils/logger';

const SOURCE_PATH_PATTERN = /^\/personality-analysis\/([a-z0-9-]+)$/;

const requestSchema = z.object({
	questionUrl: z
		.string()
		.min(1)
		.max(160)
		.regex(/^[a-z0-9-]+$/i, 'invalid question'),
	sourcePath: z.string().max(300).regex(SOURCE_PATH_PATTERN, 'invalid path'),
	fingerprint: z.string().trim().min(1).max(100).optional()
});

const noContent = () =>
	new Response(null, { status: 204, headers: { 'Cache-Control': CONTENT_GUARD_CACHE_CONTROL } });

/**
 * Only the question a personality page can actually show is recordable: a
 * proven fallback question, or that person's own chorus question. Anything else
 * would let a caller pin gate impressions on arbitrary questions and paths.
 */
async function isQuestionShownOnPage(questionUrl: string, sourcePath: string): Promise<boolean> {
	if (PROVEN_CHORUS_QUESTION_URLS.includes(questionUrl)) return true;

	const slug = normalizePersonalitySlug(sourcePath.match(SOURCE_PATH_PATTERN)?.[1] ?? '');
	if (!slug) return false;

	const { data, error } = await getSupabaseAdminClient()
		.from('blogs_famous_people')
		.select('chorus_question_url')
		.eq('person', slug)
		.eq('published', true)
		.limit(1)
		.maybeSingle();

	if (error) {
		logger.warn('Chorus impression page lookup failed', { sourcePath, error: error.message });
		return false;
	}
	return data?.chorus_question_url?.trim() === questionUrl;
}

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const parsed = requestSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return json(
			{ error: 'invalid_request' },
			{ status: 400, headers: { 'Cache-Control': CONTENT_GUARD_CACHE_CONTROL } }
		);
	}

	const userAgent = request.headers.get('user-agent');
	// Checked again inside the recorder; this just skips the lookups for bots.
	if (isLikelyCrawlerUserAgent(userAgent)) return noContent();

	const { questionUrl, sourcePath } = parsed.data;
	const fingerprint = cookies.get('9tfingerprint') ?? parsed.data.fingerprint ?? null;
	if (!fingerprint) return noContent();

	try {
		if (!(await isQuestionShownOnPage(questionUrl, sourcePath))) return noContent();

		await recordStrategicQuestionImpression({
			questionUrl,
			fingerprint,
			path: sourcePath,
			userId: locals.session?.user?.id ?? null,
			userAgent
		});
	} catch (error) {
		// Instrumentation must never surface as an error to the reader.
		logger.warn('Chorus impression not recorded', { sourcePath, error: String(error) });
	}

	return noContent();
};
