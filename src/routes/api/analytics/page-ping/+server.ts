// src/routes/api/analytics/page-ping/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { logger, withApiLogging } from '$lib/utils/logger';
import { pagePingSchema } from '$lib/validation/analyticsSchemas';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';

export const POST = withApiLogging(async (event) => {
	const { request, locals } = event;

	try {
		const body = await request.json();
		const validated = pagePingSchema.parse(body);
		const supabaseAny = locals.supabase as any;

		runBestEffortTelemetry(
			event,
			(async () => {
				const { error: trackingError } = await supabaseAny.rpc('record_page_analytics_ping', {
					p_visit_key: validated.visit_key,
					p_engaged_ms_delta: validated.engaged_ms_delta,
					p_max_scroll_pct: validated.max_scroll_pct,
					p_ended_at: null,
					p_is_exit: false
				});

				if (trackingError) {
					throw trackingError;
				}
			})(),
			(telemetryError) => {
				logBestEffortTelemetryFailure('Failed to record analytics ping', telemetryError, {
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
			logger.warn('Invalid analytics page-ping payload', { errors: e.errors });
			throw error(400, 'Invalid page-ping payload');
		}
		if ((e as any)?.status) {
			throw e;
		}
		logger.error('Error in POST /api/analytics/page-ping', e as Error);
		throw error(500, 'Internal server error');
	}
});
