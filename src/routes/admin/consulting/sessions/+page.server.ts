// src/routes/admin/consulting/sessions/+page.server.ts
import type { PageServerLoad } from './$types';
import { error as httpError } from '@sveltejs/kit';

const SESSION_PAGE_SIZE = 100;

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Get filter params
	const view = url.searchParams.get('view') || 'upcoming';
	const clientId = url.searchParams.get('client') || null;
	const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
	const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
	const offset = (page - 1) * SESSION_PAGE_SIZE;

	// Base query
	let query = supabase
		.from('consulting_sessions')
		.select(
			`
			id, client_id, scheduled_at, session_type, status, duration_minutes, meeting_link,
			client:consulting_clients(id, name, email, enneagram_type, trust_layer)
		`,
			{ count: 'exact' }
		)
		.order('scheduled_at', { ascending: view === 'upcoming' })
		.range(offset, offset + SESSION_PAGE_SIZE - 1);

	const now = new Date();
	const isoNow = now.toISOString();
	const todayStart = new Date(now);
	todayStart.setHours(0, 0, 0, 0);
	const todayEnd = new Date(now);
	todayEnd.setHours(23, 59, 59, 999);

	// Filter by view
	if (view === 'upcoming') {
		query = query.gte('scheduled_at', isoNow).in('status', ['scheduled', 'confirmed']);
	} else if (view === 'past') {
		query = query.lt('scheduled_at', isoNow);
	} else if (view === 'today') {
		query = query
			.gte('scheduled_at', todayStart.toISOString())
			.lte('scheduled_at', todayEnd.toISOString());
	}

	// Filter by client
	if (clientId) {
		query = query.eq('client_id', clientId);
	}

	const { data: sessions, error, count: filteredSessionCount } = await query;

	if (error) {
		console.error('Error fetching sessions:', error);
		throw httpError(500, 'Failed to load consulting sessions');
	}

	// Get clients for filter dropdown
	const { data: clients } = await supabase
		.from('consulting_clients')
		.select('id, name')
		.order('name');

	// Get session stats
	const [{ count: totalUpcoming }, { count: totalToday }, { count: totalCompleted }] =
		await Promise.all([
			supabase
				.from('consulting_sessions')
				.select('*', { count: 'exact', head: true })
				.gte('scheduled_at', isoNow)
				.in('status', ['scheduled', 'confirmed']),
			supabase
				.from('consulting_sessions')
				.select('*', { count: 'exact', head: true })
				.gte('scheduled_at', todayStart.toISOString())
				.lte('scheduled_at', todayEnd.toISOString()),
			supabase
				.from('consulting_sessions')
				.select('*', { count: 'exact', head: true })
				.eq('status', 'completed')
		]);

	return {
		sessions: sessions || [],
		clients: clients || [],
		filters: {
			view,
			clientId
		},
		stats: {
			upcoming: totalUpcoming || 0,
			today: totalToday || 0,
			completed: totalCompleted || 0
		},
		pagination: {
			page,
			limit: SESSION_PAGE_SIZE,
			total: filteredSessionCount ?? 0,
			totalPages: Math.max(1, Math.ceil((filteredSessionCount ?? 0) / SESSION_PAGE_SIZE))
		}
	};
};
