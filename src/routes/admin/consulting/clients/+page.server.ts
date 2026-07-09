// src/routes/admin/consulting/clients/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { error as httpError, fail } from '@sveltejs/kit';
import { guardAdminActions } from '$lib/server/adminAuth';
import type { Database } from '../../../../../database.types';

type ClientStatus = Pick<Database['public']['Tables']['consulting_clients']['Row'], 'status'>;
const CLIENT_PAGE_SIZE = 100;

export const load: PageServerLoad = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Get filter params
	const statusFilter = url.searchParams.get('status') || 'all';
	const typeFilter = url.searchParams.get('type') || 'all';
	const searchQuery = url.searchParams.get('q') || '';
	const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
	const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
	const offset = (page - 1) * CLIENT_PAGE_SIZE;

	// Build query
	let query = supabase
		.from('consulting_clients')
		.select(
			`
			*,
			sessions:consulting_sessions(count),
			intake:consulting_intake_forms(status)
		`,
			{ count: 'exact' }
		)
		.order('created_at', { ascending: false })
		.range(offset, offset + CLIENT_PAGE_SIZE - 1);

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

	const { data: clients, error, count: filteredClientCount } = await query;

	if (error) {
		console.error('Error fetching clients:', error);
		throw httpError(500, 'Failed to load consulting clients');
	}

	// Reuse the dashboard aggregate instead of transferring every client for filter counts.
	const { data: summaryRows, error: summaryError } = await supabase.rpc(
		'get_admin_consulting_dashboard_summary'
	);
	let totalClients = summaryRows?.[0]?.total_clients ?? 0;
	let statusCounts =
		summaryRows?.[0]?.status_counts && typeof summaryRows[0].status_counts === 'object'
			? (summaryRows[0].status_counts as Record<string, number>)
			: {};

	if (summaryError) {
		console.error('Consulting summary RPC unavailable; using count fallback', summaryError);
		const { data: allClients, error: fallbackError } = await supabase
			.from('consulting_clients')
			.select('status');
		if (fallbackError) {
			console.error('Error loading consulting status counts:', fallbackError);
			throw httpError(500, 'Failed to load consulting client totals');
		} else {
			totalClients = allClients?.length ?? 0;
			statusCounts = (allClients || []).reduce(
				(acc: Record<string, number>, client: ClientStatus) => {
					const status = client.status ?? 'unknown';
					acc[status] = (acc[status] || 0) + 1;
					return acc;
				},
				{}
			);
		}
	}

	return {
		clients: clients || [],
		filters: {
			status: statusFilter,
			type: typeFilter,
			search: searchQuery
		},
		statusCounts,
		totalClients,
		pagination: {
			page,
			limit: CLIENT_PAGE_SIZE,
			total: filteredClientCount ?? 0,
			totalPages: Math.max(1, Math.ceil((filteredClientCount ?? 0) / CLIENT_PAGE_SIZE))
		}
	};
};

export const actions: Actions = guardAdminActions({
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
});
