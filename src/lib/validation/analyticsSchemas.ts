// src/lib/validation/analyticsSchemas.ts
import { z } from 'zod';
import { ANALYTICS_MAX_DELTA_MS, ANALYTICS_SCOPES } from '$lib/analytics/pageAnalytics';

export const analyticsScopeSchema = z.enum(ANALYTICS_SCOPES);

export const pageViewSchema = z.object({
	visit_key: z.string().uuid(),
	session_key: z.string().min(1).max(120),
	fingerprint: z.string().min(1).max(100),
	path: z.string().min(1).max(500),
	route_id: z.string().max(200).nullable().optional(),
	path_group: z.string().min(1).max(500),
	content_type: z.string().max(50).nullable().optional(),
	content_slug: z.string().max(200).nullable().optional(),
	referrer_host: z.string().max(255).nullable().optional(),
	landing_query: z.string().max(2000).nullable().optional(),
	utm_source: z.string().max(255).nullable().optional(),
	utm_medium: z.string().max(255).nullable().optional(),
	utm_campaign: z.string().max(255).nullable().optional(),
	utm_term: z.string().max(255).nullable().optional(),
	utm_content: z.string().max(255).nullable().optional(),
	click_id_type: z.string().max(50).nullable().optional(),
	click_id_value: z.string().max(255).nullable().optional()
});

export const pagePingSchema = z.object({
	visit_key: z.string().uuid(),
	engaged_ms_delta: z.number().int().min(0).max(ANALYTICS_MAX_DELTA_MS).default(0),
	max_scroll_pct: z.number().int().min(0).max(100).optional().default(0)
});

export const pageExitSchema = pagePingSchema.extend({
	ended_at: z.string().datetime().optional(),
	is_exit: z.boolean().optional().default(true)
});

export const analyticsDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.optional();
