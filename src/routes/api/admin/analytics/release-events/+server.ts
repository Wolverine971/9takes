// src/routes/api/admin/analytics/release-events/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';

interface ReleaseEventImpactRow {
	id: number;
	content_type: string;
	content_slug: string;
	path: string | null;
	event_type: string;
	event_at: string;
	source: string | null;
	metadata: Record<string, unknown>;
	days_before: number;
	days_after: number;
	views_before: number;
	views_after: number;
	unique_before: number;
	unique_after: number;
	avg_daily_before: number;
	avg_daily_after: number;
	lift_views: number;
	lift_pct: number | null;
}

const releaseEventTypes = [
	'published',
	'republished',
	'sitemap_generated',
	'indexed',
	'newsletter_sent',
	'social_posted',
	'internal_links_added',
	'major_update',
	'title_meta_updated',
	'manual_note'
] as const;

const getQuerySchema = z.object({
	slug: z.string().trim().min(1).max(200),
	daysBefore: z.coerce.number().int().min(1).max(30).default(7),
	daysAfter: z.coerce.number().int().min(1).max(30).default(7)
});

const postSchema = z.object({
	slug: z.string().trim().min(1).max(200),
	eventType: z.enum(releaseEventTypes),
	eventAt: z.string().datetime().optional(),
	source: z.string().trim().max(120).optional().nullable(),
	path: z.string().trim().max(500).optional().nullable(),
	metadata: z.record(z.string(), z.unknown()).optional()
});

function normalizeRows(rows: ReleaseEventImpactRow[]) {
	return rows.map((row) => ({
		id: Number(row.id || 0),
		content_type: String(row.content_type ?? 'people'),
		content_slug: String(row.content_slug ?? ''),
		path: row.path ? String(row.path) : null,
		event_type: String(row.event_type ?? 'manual_note'),
		event_at: String(row.event_at ?? ''),
		source: row.source ? String(row.source) : null,
		metadata: (row.metadata ?? {}) as Record<string, unknown>,
		days_before: Number(row.days_before || 0),
		days_after: Number(row.days_after || 0),
		views_before: Number(row.views_before || 0),
		views_after: Number(row.views_after || 0),
		unique_before: Number(row.unique_before || 0),
		unique_after: Number(row.unique_after || 0),
		avg_daily_before: Number(row.avg_daily_before || 0),
		avg_daily_after: Number(row.avg_daily_after || 0),
		lift_views: Number(row.lift_views || 0),
		lift_pct: row.lift_pct === null || row.lift_pct === undefined ? null : Number(row.lift_pct)
	}));
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const { supabase } = await requireAdmin(locals);
	const parsedQuery = getQuerySchema.safeParse({
		slug: url.searchParams.get('slug') ?? '',
		daysBefore: url.searchParams.get('daysBefore') ?? '7',
		daysAfter: url.searchParams.get('daysAfter') ?? '7'
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid release event query parameters');
	}

	const supabaseAny = supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('get_content_release_event_impact', {
		p_slug: parsedQuery.data.slug,
		p_days_before: parsedQuery.data.daysBefore,
		p_days_after: parsedQuery.data.daysAfter
	});

	if (rpcError) {
		console.error('Failed to fetch release event impact:', rpcError);
		throw error(500, 'Failed to fetch release event impact');
	}

	return json({
		slug: parsedQuery.data.slug,
		rows: normalizeRows((data ?? []) as ReleaseEventImpactRow[])
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { supabase } = await requireAdmin(locals);
	const payload = postSchema.safeParse(await request.json().catch(() => ({})));

	if (!payload.success) {
		return json(
			{
				success: false,
				message: payload.error.issues[0]?.message ?? 'Invalid release event payload'
			},
			{ status: 400 }
		);
	}

	const slug = payload.data.slug;
	const supabaseAny = supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('record_content_release_event', {
		p_content_type: 'people',
		p_content_slug: slug,
		p_event_type: payload.data.eventType,
		p_event_at: payload.data.eventAt ?? new Date().toISOString(),
		p_source: payload.data.source || null,
		p_path: payload.data.path || `/personality-analysis/${slug}`,
		p_metadata: payload.data.metadata ?? {}
	});

	if (rpcError) {
		console.error('Failed to record release event:', rpcError);
		return json(
			{ success: false, message: rpcError.message || 'Failed to record release event' },
			{ status: 400 }
		);
	}

	return json({
		success: true,
		id: Number(data || 0)
	});
};
