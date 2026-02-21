// src/routes/api/analytics/page-view/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { logger, withApiLogging } from '$lib/utils/logger';
import { pageViewSchema } from '$lib/validation/analyticsSchemas';
import { classifyPath, shouldTrackPath } from '$lib/analytics/pageAnalytics';

function getReferrerHost(request: Request, bodyHost: string | null | undefined): string | null {
	const candidate = bodyHost?.trim();
	if (candidate) {
		return candidate.slice(0, 255);
	}

	const referer = request.headers.get('referer');
	if (!referer) return null;

	try {
		return new URL(referer).host.slice(0, 255);
	} catch {
		return null;
	}
}

export const POST = withApiLogging(async ({ request, locals }) => {
	try {
		const body = await request.json();
		const validated = pageViewSchema.parse(body);
		const classified = classifyPath(validated.path, validated.route_id ?? null);

		if (!shouldTrackPath(classified.path)) {
			return json({ ok: true, skipped: true });
		}

		const supabaseAny = locals.supabase as any;
		const userId = locals.session?.user?.id ?? null;
		const referrerHost = getReferrerHost(request, validated.referrer_host);

		const { data: rpcData, error: rpcError } = await supabaseAny.rpc(
			'upsert_page_analytics_visit',
			{
				p_visit_key: validated.visit_key,
				p_session_key: validated.session_key,
				p_fingerprint: validated.fingerprint,
				p_user_id: userId,
				p_path: classified.path,
				p_route_id: classified.routeId,
				p_path_group: classified.pathGroup,
				p_content_type: classified.contentType,
				p_content_slug: classified.contentSlug,
				p_referrer_host: referrerHost
			}
		);

		if (rpcError) {
			logger.error('Failed to upsert page analytics visit', rpcError, {
				path: classified.path
			});
			throw error(500, 'Failed to track page view');
		}

		const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;

		return json({
			ok: true,
			session_id: row?.session_id ?? null,
			visit_id: row?.visit_id ?? null
		});
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid analytics page-view payload', { errors: e.errors });
			throw error(400, 'Invalid page-view payload');
		}
		if ((e as any)?.status) {
			throw e;
		}
		logger.error('Error in POST /api/analytics/page-view', e as Error);
		throw error(500, 'Internal server error');
	}
});
