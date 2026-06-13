// src/routes/api/analytics/page-exit/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { logger, withApiLogging } from '$lib/utils/logger';
import { pageExitSchema } from '$lib/validation/analyticsSchemas';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';

export const POST = withApiLogging(async (event) => {
	const { request, locals } = event;

	try {
		const body = await request.json();
		const validated = pageExitSchema.parse(body);
		const supabaseAny = locals.supabase as any;

		const endedAt = validated.ended_at ? new Date(validated.ended_at).toISOString() : null;

		runBestEffortTelemetry(
			event,
			(async () => {
				const { error: trackingError } = await supabaseAny.rpc('record_page_analytics_ping', {
					p_visit_key: validated.visit_key,
					p_engaged_ms_delta: validated.engaged_ms_delta,
					p_max_scroll_pct: validated.max_scroll_pct,
					p_ended_at: endedAt,
					p_is_exit: validated.is_exit
				});

				if (trackingError) {
					throw trackingError;
				}
			})(),
			(telemetryError) => {
				logBestEffortTelemetryFailure('Failed to record analytics exit', telemetryError, {
					visitKey: validated.visit_key
				});
			}
		);

		return json({
			ok: true,
			queued: true,
			tracked: null
		});
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Invalid analytics page-exit payload', { errors: e.errors });
			throw error(400, 'Invalid page-exit payload');
		}
		if ((e as any)?.status) {
			throw e;
		}
		logger.error('Error in POST /api/analytics/page-exit', e as Error);
		throw error(500, 'Internal server error');
	}
});
