// src/routes/api/admin/email-dashboard/users/+server.ts
// Fetch users from all sources (profiles, signups, coaching_waitlist)

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { FetchUsersResponse, EmailRecipient } from '$lib/types/email';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = locals.session;
	const supabase = locals.supabase;

	// Check authentication
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	// Check admin status
	const { data: user } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}

	// Parse query parameters
	const sourceParam = url.searchParams.get('source') || 'all';
	const source =
		sourceParam === 'profiles' || sourceParam === 'signups' || sourceParam === 'coaching_waitlist'
			? sourceParam
			: 'all';

	const searchQuery = url.searchParams.get('search')?.trim();
	const search = searchQuery ? searchQuery.slice(0, 200) : undefined;

	const pageParam = Number.parseInt(url.searchParams.get('page') || '1', 10);
	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

	const limitParam = Number.parseInt(url.searchParams.get('limit') || '50', 10);
	const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

	const offset = (page - 1) * limit;

	try {
		// Use the database function to get users
		const { data: users, error: usersError } = await supabase.rpc('get_email_dashboard_users', {
			p_source: source,
			p_search: search,
			p_limit: limit,
			p_offset: offset
		});

		if (usersError) {
			console.error('Error fetching users:', usersError);
			throw error(500, 'Failed to fetch users');
		}

		// Get total count
		const { data: totalCount, error: countError } = await supabase.rpc(
			'count_email_dashboard_users',
			{
				p_source: source,
				p_search: search
			}
		);

		if (countError) {
			console.error('Error counting users:', countError);
			throw error(500, 'Failed to count users');
		}

		// Transform to EmailRecipient format
		const transformedUsers: EmailRecipient[] = (users || []).map(
			(u: {
				id: string;
				email: string;
				name: string;
				source: string;
				created_at: string;
				enneagram: string | null;
				unsubscribed: boolean;
			}) => ({
				id: u.id,
				email: u.email,
				name: u.name || undefined,
				source: u.source as EmailRecipient['source'],
				source_id: u.id,
				enneagram: u.enneagram || undefined,
				unsubscribed: u.unsubscribed,
				created_at: u.created_at
			})
		);

		const response: FetchUsersResponse = {
			users: transformedUsers,
			pagination: {
				total: totalCount || 0,
				page,
				limit,
				totalPages: Math.ceil((totalCount || 0) / limit)
			}
		};

		return json(response);
	} catch (e) {
		console.error('Error in email-dashboard/users:', e);
		if (e instanceof Error && 'status' in e) {
			throw e;
		}
		throw error(500, 'Internal server error');
	}
};
