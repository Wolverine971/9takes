// src/routes/admin/consulting/clients/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Get filter params
	const statusFilter = url.searchParams.get('status') || 'all';
	const typeFilter = url.searchParams.get('type') || 'all';
	const searchQuery = url.searchParams.get('q') || '';

	// Build query
	let query = supabase
		.from('consulting_clients')
		.select(
			`
			*,
			sessions:consulting_sessions(count),
			intake:consulting_intake_forms(status)
		`
		)
		.order('created_at', { ascending: false });

	// Apply filters
	if (statusFilter !== 'all') {
		query = query.eq('status', statusFilter);
	}

	if (typeFilter !== 'all') {
		query = query.eq('enneagram_type', parseInt(typeFilter));
	}

	if (searchQuery) {
		query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
	}

	const { data: clients, error } = await query;

	if (error) {
		console.error('Error fetching clients:', error);
	}

	// Get counts for filters
	const { data: allClients } = await supabase
		.from('consulting_clients')
		.select('status, enneagram_type');

	const statusCounts = (allClients || []).reduce(
		(acc: Record<string, number>, c: { status: string }) => {
			acc[c.status] = (acc[c.status] || 0) + 1;
			return acc;
		},
		{}
	);

	return {
		clients: clients || [],
		filters: {
			status: statusFilter,
			type: typeFilter,
			search: searchQuery
		},
		statusCounts,
		totalClients: allClients?.length || 0
	};
};

export const actions: Actions = {
	// Create a new client
	createClient: async ({ request, locals }) => {
		const formData = await request.formData();
		const supabase = locals.supabase;

		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const phone = formData.get('phone')?.toString() || null;
		const enneagramType = formData.get('enneagramType')?.toString();
		const source = formData.get('source')?.toString() || null;
		const initialGoal = formData.get('initialGoal')?.toString() || null;

		if (!name || !email) {
			return fail(400, { error: 'Name and email are required' });
		}

		// Check if client already exists
		const { data: existingClient } = await supabase
			.from('consulting_clients')
			.select('id')
			.eq('email', email)
			.single();

		if (existingClient) {
			return fail(400, { error: 'A client with this email already exists' });
		}

		const { data: newClient, error } = await supabase
			.from('consulting_clients')
			.insert({
				name,
				email,
				phone,
				enneagram_type: enneagramType ? parseInt(enneagramType) : null,
				source,
				initial_goal: initialGoal,
				status: 'prospect'
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating client:', error);
			return fail(500, { error: 'Failed to create client' });
		}

		return { success: true, clientId: newClient.id };
	},

	// Update client status
	updateStatus: async ({ request, locals }) => {
		const formData = await request.formData();
		const clientId = formData.get('clientId')?.toString();
		const newStatus = formData.get('status')?.toString();

		if (!clientId || !newStatus) {
			return fail(400, { error: 'Client ID and status required' });
		}

		const { error } = await locals.supabase
			.from('consulting_clients')
			.update({ status: newStatus, updated_at: new Date().toISOString() })
			.eq('id', clientId);

		if (error) {
			return fail(500, { error: 'Failed to update status' });
		}

		return { success: true };
	},

	// Delete client
	deleteClient: async ({ request, locals }) => {
		const formData = await request.formData();
		const clientId = formData.get('clientId')?.toString();

		if (!clientId) {
			return fail(400, { error: 'Client ID required' });
		}

		const { error } = await locals.supabase.from('consulting_clients').delete().eq('id', clientId);

		if (error) {
			return fail(500, { error: 'Failed to delete client' });
		}

		return { success: true };
	}
};
