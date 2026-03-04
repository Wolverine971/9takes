// src/routes/api/admin/email-dashboard/unsubscribes/+server.ts
// Fetch unsubscribed recipients for admin visibility

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	const pageParam = Number.parseInt(url.searchParams.get('page') || '1', 10);
	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

	const limitParam = Number.parseInt(url.searchParams.get('limit') || '50', 10);
	const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

	const offset = (page - 1) * limit;
	const searchQuery = url.searchParams.get('search')?.trim();
	const search = searchQuery ? searchQuery.slice(0, 200) : null;

	try {
		let query = supabase
			.from('email_unsubscribes')
			.select('*', { count: 'exact' })
			.order('unsubscribed_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (search) {
			const escaped = search
				.replace(/%/g, '\\%')
				.replace(/_/g, '\\_')
				.replace(/[(),'"]/g, ' ');
			query = query.or(
				`email.ilike.%${escaped}%,source.ilike.%${escaped}%,reason.ilike.%${escaped}%`
			);
		}

		const { data: unsubscribes, error: unsubscribesError, count } = await query;

		if (unsubscribesError) {
			console.error('Error fetching unsubscribes:', unsubscribesError);
			throw error(500, 'Failed to fetch unsubscribes');
		}

		return json({
			unsubscribes: unsubscribes || [],
			pagination: {
				total: count || 0,
				page,
				limit,
				totalPages: Math.ceil((count || 0) / limit)
			}
		});
	} catch (e) {
		console.error('Error in unsubscribes GET:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
