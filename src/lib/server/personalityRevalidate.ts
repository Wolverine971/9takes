// src/lib/server/personalityRevalidate.ts
import { env } from '$env/dynamic/private';
import { logger } from '$lib/utils/logger';
import { buildPersonalityAnalysisPath } from '$lib/utils/personalityAnalysis';

/**
 * Personality pages are served from Vercel's ISR cache, so an edit in the admin
 * UI is invisible until that stored copy is replaced. Vercel regenerates a path
 * when it receives a GET/HEAD carrying the bypass token.
 *
 * Best-effort by design: a failed refresh only means the page keeps serving its
 * previous copy until `expiration` elapses, which must never fail an edit.
 */
const REVALIDATE_TIMEOUT_MS = 10_000;

export type RevalidateResult = {
	ok: boolean;
	reason?: 'missing_token' | 'request_failed' | 'bad_status';
	status?: number;
};

export async function revalidatePersonalityPage(
	slug: string,
	origin: string
): Promise<RevalidateResult> {
	const token = env.BYPASS_TOKEN;

	if (!token) {
		// Expected on local/dev and on any deploy where the token isn't set yet.
		logger.warn('Skipping personality revalidation: BYPASS_TOKEN is not set', { slug });
		return { ok: false, reason: 'missing_token' };
	}

	const url = `${origin}${buildPersonalityAnalysisPath(slug)}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'x-prerender-revalidate': token,
				// Skip the SvelteKit HTML payload; only the cache entry matters.
				Accept: 'text/html'
			},
			signal: AbortSignal.timeout(REVALIDATE_TIMEOUT_MS)
		});

		if (!response.ok) {
			logger.warn('Personality revalidation returned a non-OK status', {
				slug,
				status: response.status
			});
			return { ok: false, reason: 'bad_status', status: response.status };
		}

		return { ok: true, status: response.status };
	} catch (revalidateError) {
		logger.warn('Personality revalidation request failed', { slug, error: revalidateError });
		return { ok: false, reason: 'request_failed' };
	}
}
