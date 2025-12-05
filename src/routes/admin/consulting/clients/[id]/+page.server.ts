// src/routes/admin/consulting/clients/[id]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const clientId = params.id;

	// Fetch client with related data
	const { data: client, error: clientError } = await supabase
		.from('consulting_clients')
		.select(
			`
			*,
			intake:consulting_intake_forms(*),
			sessions:consulting_sessions(*, notes:consulting_client_notes(*)),
			notes:consulting_client_notes(*),
			deliverables:consulting_deliverables(*)
		`
		)
		.eq('id', clientId)
		.single();

	if (clientError || !client) {
		throw error(404, 'Client not found');
	}

	// Get waitlist data if linked (waitlist_id is stored as TEXT)
	let waitlistData = null;
	if (client.waitlist_id) {
		const { data } = await supabase
			.from('coaching_waitlist')
			.select('*, metadata:coaching_waitlist_metadata(*)')
			.eq('id', client.waitlist_id)
			.single();
		waitlistData = data;
	}

	// Get available templates for deliverables
	const { data: templates } = await supabase
		.from('consulting_templates')
		.select('*')
		.eq('is_active', true)
		.or(`enneagram_type.is.null,enneagram_type.eq.${client.enneagram_type || 0}`);

	return {
		client,
		waitlistData,
		templates: templates || []
	};
};

export const actions: Actions = {
	// Update client info
	updateClient: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const supabase = locals.supabase;

		const updates: Record<string, any> = {
			updated_at: new Date().toISOString()
		};

		// Collect all fields that were submitted
		const fields = [
			'name',
			'email',
			'phone',
			'status',
			'trust_layer',
			'enneagram_type',
			'enneagram_wing',
			'tritype',
			'instinctual_variant',
			'notes',
			'initial_goal'
		];

		for (const field of fields) {
			const value = formData.get(field);
			if (value !== null) {
				if (field === 'enneagram_type' || field === 'enneagram_wing') {
					updates[field] = value ? parseInt(value.toString()) : null;
				} else {
					updates[field] = value.toString() || null;
				}
			}
		}

		const enneagramConfirmed = formData.get('enneagram_confirmed');
		if (enneagramConfirmed !== null) {
			updates.enneagram_confirmed = enneagramConfirmed === 'true';
		}

		const { error: updateError } = await supabase
			.from('consulting_clients')
			.update(updates)
			.eq('id', params.id);

		if (updateError) {
			return fail(500, { error: 'Failed to update client' });
		}

		return { success: true };
	},

	// Add a note
	addNote: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const supabase = locals.supabase;

		const title = formData.get('title')?.toString() || null;
		const content = formData.get('content')?.toString();
		const noteType = formData.get('noteType')?.toString() || 'observation';
		const sessionId = formData.get('sessionId')?.toString() || null;

		if (!content) {
			return fail(400, { error: 'Note content is required' });
		}

		const { error: noteError } = await supabase.from('consulting_client_notes').insert({
			client_id: params.id,
			session_id: sessionId,
			title,
			content,
			note_type: noteType
		});

		if (noteError) {
			return fail(500, { error: 'Failed to add note' });
		}

		return { success: true };
	},

	// Create intake form
	createIntake: async ({ params, locals }) => {
		const supabase = locals.supabase;

		// Check if intake already exists
		const { data: existing } = await supabase
			.from('consulting_intake_forms')
			.select('id')
			.eq('client_id', params.id)
			.single();

		if (existing) {
			return fail(400, { error: 'Intake form already exists for this client' });
		}

		const { error: intakeError } = await supabase.from('consulting_intake_forms').insert({
			client_id: params.id,
			status: 'pending'
		});

		if (intakeError) {
			return fail(500, { error: 'Failed to create intake form' });
		}

		// Update client status
		await supabase
			.from('consulting_clients')
			.update({ status: 'intake_sent', updated_at: new Date().toISOString() })
			.eq('id', params.id);

		return { success: true };
	},

	// Schedule a session
	scheduleSession: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const supabase = locals.supabase;

		const scheduledAt = formData.get('scheduledAt')?.toString();
		const sessionType = formData.get('sessionType')?.toString() || 'discovery';
		const duration = formData.get('duration')?.toString() || '60';
		const meetingLink = formData.get('meetingLink')?.toString() || null;

		if (!scheduledAt) {
			return fail(400, { error: 'Scheduled date/time is required' });
		}

		// Get session count for numbering
		const { count } = await supabase
			.from('consulting_sessions')
			.select('*', { count: 'exact', head: true })
			.eq('client_id', params.id);

		const { data: session, error: sessionError } = await supabase
			.from('consulting_sessions')
			.insert({
				client_id: params.id,
				session_number: (count || 0) + 1,
				session_type: sessionType,
				duration_minutes: parseInt(duration),
				scheduled_at: new Date(scheduledAt).toISOString(),
				meeting_link: meetingLink,
				status: 'scheduled'
			})
			.select()
			.single();

		if (sessionError) {
			return fail(500, { error: 'Failed to schedule session' });
		}

		return { success: true, sessionId: session.id };
	},

	// Delete client
	deleteClient: async ({ params, locals }) => {
		const { error: deleteError } = await locals.supabase
			.from('consulting_clients')
			.delete()
			.eq('id', params.id);

		if (deleteError) {
			return fail(500, { error: 'Failed to delete client' });
		}

		throw redirect(303, '/admin/consulting/clients');
	},

	// Create or get intake form and return link for sending
	getIntakeLink: async ({ params, locals, url }) => {
		const supabase = locals.supabase;

		// Check if intake already exists
		let { data: intake } = await supabase
			.from('consulting_intake_forms')
			.select('id, status')
			.eq('client_id', params.id)
			.single();

		// Create intake form if it doesn't exist
		if (!intake) {
			const { data: newIntake, error: intakeError } = await supabase
				.from('consulting_intake_forms')
				.insert({
					client_id: params.id,
					status: 'pending'
				})
				.select('id')
				.single();

			if (intakeError || !newIntake) {
				return fail(500, { error: 'Failed to create intake form' });
			}

			intake = { id: newIntake.id, status: 'pending' };
		}

		// Update intake status to sent and client status
		await supabase
			.from('consulting_intake_forms')
			.update({
				status: 'sent',
				sent_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', intake.id);

		await supabase
			.from('consulting_clients')
			.update({
				status: 'intake_sent',
				updated_at: new Date().toISOString()
			})
			.eq('id', params.id);

		// Generate the intake form URL
		const baseUrl = url.origin;
		const intakeUrl = `${baseUrl}/intake/${intake.id}`;

		return { success: true, intakeUrl };
	}
};
