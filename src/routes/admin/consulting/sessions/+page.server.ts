// src/routes/admin/consulting/sessions/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Get filter params
	const view = url.searchParams.get('view') || 'upcoming';
	const clientId = url.searchParams.get('client') || null;

	// Base query
	let query = supabase
		.from('consulting_sessions')
		.select(
			`
			*,
			client:consulting_clients(id, name, email, enneagram_type, trust_layer)
		`
		)
		.order('scheduled_at', { ascending: view === 'upcoming' });

	// Filter by view
	const now = new Date().toISOString();
	if (view === 'upcoming') {
		query = query.gte('scheduled_at', now).in('status', ['scheduled', 'confirmed']);
	} else if (view === 'past') {
		query = query.lt('scheduled_at', now);
	} else if (view === 'today') {
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const todayEnd = new Date();
		todayEnd.setHours(23, 59, 59, 999);
		query = query
			.gte('scheduled_at', todayStart.toISOString())
			.lte('scheduled_at', todayEnd.toISOString());
	}

	// Filter by client
	if (clientId) {
		query = query.eq('client_id', clientId);
	}

	const { data: sessions, error } = await query;

	if (error) {
		console.error('Error fetching sessions:', error);
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
				.gte('scheduled_at', now)
				.in('status', ['scheduled', 'confirmed']),
			supabase
				.from('consulting_sessions')
				.select('*', { count: 'exact', head: true })
				.gte('scheduled_at', new Date().setHours(0, 0, 0, 0))
				.lte('scheduled_at', new Date().setHours(23, 59, 59, 999)),
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
		}
	};
};
