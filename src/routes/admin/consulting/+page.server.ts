// src/routes/admin/consulting/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Get overview stats in parallel
	const [
		{ count: totalClients },
		{ count: activeClients },
		{ count: pendingIntakes },
		{ data: upcomingSessions },
		{ data: recentWaitlist },
		{ data: existingClients },
		{ count: waitlistCount },
		{ data: clientsByStatus },
		{ data: clientsByType }
	] = await Promise.all([
		// Total clients
		supabase.from('consulting_clients').select('*', { count: 'exact', head: true }),
		// Active clients
		supabase
			.from('consulting_clients')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'active'),
		// Pending intakes
		supabase
			.from('consulting_intake_forms')
			.select('*', { count: 'exact', head: true })
			.in('status', ['pending', 'sent']),
		// Upcoming sessions (next 7 days)
		supabase
			.from('consulting_sessions')
			.select(
				`
				*,
				client:consulting_clients(id, name, email, enneagram_type, trust_layer)
			`
			)
			.gte('scheduled_at', new Date().toISOString())
			.lte('scheduled_at', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
			.in('status', ['scheduled', 'confirmed'])
			.order('scheduled_at', { ascending: true })
			.limit(5),
		// Recent waitlist entries
		supabase
			.from('coaching_waitlist')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(10),
		// Get existing clients to check which waitlist entries have been converted
		supabase.from('consulting_clients').select('email, id, waitlist_id'),
		// Total waitlist count
		supabase.from('coaching_waitlist').select('*', { count: 'exact', head: true }),
		// Clients by status for pipeline view
		supabase.from('consulting_clients').select('status'),
		// Clients by type for distribution
		supabase.from('consulting_clients').select('enneagram_type')
	]);

	// Process status counts
	const statusCounts = (clientsByStatus || []).reduce(
		(acc: Record<string, number>, client: { status: string }) => {
			acc[client.status] = (acc[client.status] || 0) + 1;
			return acc;
		},
		{}
	);

	// Process type distribution
	const typeDistribution = (clientsByType || []).reduce(
		(acc: Record<number, number>, client: { enneagram_type: number | null }) => {
			if (client.enneagram_type) {
				acc[client.enneagram_type] = (acc[client.enneagram_type] || 0) + 1;
			}
			return acc;
		},
		{}
	);

	// Create lookup maps for converted clients
	const clientsByEmail = new Map(
		(existingClients || []).map((c: { email: string; id: string }) => [c.email, c.id])
	);
	const clientsByWaitlistId = new Map(
		(existingClients || [])
			.filter((c: { waitlist_id: string | null }) => c.waitlist_id)
			.map((c: { waitlist_id: string; id: string }) => [c.waitlist_id, c.id])
	);

	// Enrich waitlist entries with conversion status
	const enrichedWaitlist = (recentWaitlist || []).map((entry: { id: number; email: string }) => {
		const clientId =
			clientsByWaitlistId.get(String(entry.id)) || clientsByEmail.get(entry.email) || null;
		return {
			...entry,
			isConverted: !!clientId,
			clientId
		};
	});

	return {
		stats: {
			totalClients: totalClients || 0,
			activeClients: activeClients || 0,
			pendingIntakes: pendingIntakes || 0,
			waitlistCount: waitlistCount || 0
		},
		upcomingSessions: upcomingSessions || [],
		recentWaitlist: enrichedWaitlist,
		statusCounts,
		typeDistribution
	};
};

export const actions: Actions = {
	// Promote waitlist entry to client
	promoteToClient: async ({ request, locals }) => {
		const formData = await request.formData();
		const waitlistId = formData.get('waitlistId')?.toString();

		if (!waitlistId) {
			return fail(400, { error: 'Waitlist ID required' });
		}

		const supabase = locals.supabase;

		// Get waitlist entry (use id as-is, could be integer or UUID)
		const { data: waitlistEntry, error: waitlistError } = await supabase
			.from('coaching_waitlist')
			.select('*, metadata:coaching_waitlist_metadata(*)')
			.eq('id', waitlistId)
			.single();

		if (waitlistError || !waitlistEntry) {
			return fail(404, { error: 'Waitlist entry not found' });
		}

		// Check if client already exists with this email
		const { data: existingClient } = await supabase
			.from('consulting_clients')
			.select('id')
			.eq('email', waitlistEntry.email)
			.single();

		if (existingClient) {
			return fail(400, { error: 'Client with this email already exists' });
		}

		// Parse enneagram type safely
		let enneagramType = null;
		if (waitlistEntry.enneagram_type) {
			const parsed = parseInt(waitlistEntry.enneagram_type);
			if (!isNaN(parsed) && parsed >= 1 && parsed <= 9) {
				enneagramType = parsed;
			}
		}

		// Create new client (store waitlist_id as TEXT for flexibility)
		const { data: newClient, error: clientError } = await supabase
			.from('consulting_clients')
			.insert({
				waitlist_id: String(waitlistEntry.id),
				name: waitlistEntry.name,
				email: waitlistEntry.email,
				enneagram_type: enneagramType,
				initial_goal: waitlistEntry.session_goal,
				source: waitlistEntry.metadata?.[0]?.source || 'waitlist',
				status: 'prospect'
			})
			.select()
			.single();

		if (clientError) {
			console.error('Error creating client:', clientError);
			return fail(500, { error: 'Failed to create client' });
		}

		return { success: true, clientId: newClient.id };
	}
};
