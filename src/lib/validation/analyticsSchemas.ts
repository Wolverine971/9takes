// src/lib/validation/analyticsSchemas.ts
import { z } from 'zod';
import { ANALYTICS_SCOPES } from '$lib/analytics/pageAnalytics';

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
	referrer_host: z.string().max(255).nullable().optional()
});

export const pagePingSchema = z.object({
	visit_key: z.string().uuid(),
	engaged_ms_delta: z.number().int().min(0).max(15_000).default(0),
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
