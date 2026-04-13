// src/routes/api/admin/analytics/release-growth/+server.ts
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

interface ReleaseGrowthRow {
	day_number: number;
	day_date: string;
	visits: number;
	unique_visitors: number;
	cumulative_visits: number;
	cumulative_unique_visitors: number;
}

const querySchema = z.object({
	slug: z.string().min(1).max(200),
	days: z.coerce.number().int().min(0).max(90).default(30)
});

async function assertAdmin(locals: App.Locals): Promise<void> {
	const session = locals.session;
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await locals.supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}
}

export const GET: RequestHandler = async ({ url, locals }) => {
	await assertAdmin(locals);

	const parsedQuery = querySchema.safeParse({
		slug: url.searchParams.get('slug') ?? '',
		days: url.searchParams.get('days') ?? '30'
	});

	if (!parsedQuery.success) {
		throw error(400, 'Invalid release growth query parameters');
	}

	const supabaseAny = locals.supabase as any;
	const { data, error: rpcError } = await supabaseAny.rpc('get_content_release_growth_curve', {
		p_slug: parsedQuery.data.slug,
		p_days: parsedQuery.data.days
	});

	if (rpcError) {
		console.error('Failed to fetch release growth analytics:', rpcError);
		throw error(500, 'Failed to fetch release growth analytics');
	}

	const points = ((data ?? []) as ReleaseGrowthRow[]).map((row) => ({
		day_number: Number(row.day_number || 0),
		day_date: String(row.day_date ?? ''),
		visits: Number(row.visits || 0),
		unique_visitors: Number(row.unique_visitors || 0),
		cumulative_visits: Number(row.cumulative_visits || 0),
		cumulative_unique_visitors: Number(row.cumulative_unique_visitors || 0)
	}));

	return json({
		slug: parsedQuery.data.slug,
		points
	});
};
