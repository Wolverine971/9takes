// src/routes/intake/[token]/+page.server.ts
// Public client-facing intake form - no auth required

import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { adminSupabase } from '$lib/supabase';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;

	// Validate token format (should be a UUID)
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!uuidRegex.test(token)) {
		throw error(404, 'Invalid intake form link');
	}

	// Fetch the intake form and associated client
	const { data: intake, error: intakeError } = await adminSupabase
		.from('consulting_intake_forms')
		.select(
			`
			id,
			client_id,
			status,
			sent_at,
			completed_at,
			client:consulting_clients!consulting_intake_forms_client_id_fkey (
				id,
				name,
				email,
				enneagram_type
			)
		`
		)
		.eq('id', token)
		.single();

	if (intakeError || !intake) {
		throw error(404, 'Intake form not found or has expired');
	}

	// Check if already completed
	if (intake.status === 'completed' || intake.status === 'reviewed') {
		return {
			intake,
			completed: true
		};
	}

	// Return intake data for the form
	return {
		intake: {
			id: intake.id,
			status: intake.status,
			clientName: (intake.client as any)?.name?.split(' ')[0] || 'there',
			clientType: (intake.client as any)?.enneagram_type || null
		},
		completed: false
	};
};

export const actions: Actions = {
	submit: async ({ request, params }) => {
		const { token } = params;
		const formData = await request.formData();

		// Extract all form fields
		const intakeData = {
			// Section 1: Background
			age_range: formData.get('age_range') as string,
			occupation: formData.get('occupation') as string,
			relationship_status: formData.get('relationship_status') as string,
			living_situation: formData.get('living_situation') as string,

			// Section 2: Current Situation
			current_challenges: formData.get('current_challenges') as string,
			desired_outcome: formData.get('desired_outcome') as string,
			previous_attempts: formData.get('previous_attempts') as string,
			urgency_level: formData.get('urgency_level') as string,

			// Section 3: Personality Assessment
			suspected_type: formData.get('suspected_type')
				? parseInt(formData.get('suspected_type') as string)
				: null,
			why_this_type: formData.get('why_this_type') as string,
			core_fear: formData.get('core_fear') as string,
			core_desire: formData.get('core_desire') as string,
			childhood_message: formData.get('childhood_message') as string,

			// Section 4: Emotional Patterns
			primary_emotion: formData.get('primary_emotion') as string,
			emotion_expression: formData.get('emotion_expression') as string,
			stress_response: formData.get('stress_response') as string,
			comfort_response: formData.get('comfort_response') as string,

			// Section 5: Relationships
			relationship_patterns: formData.get('relationship_patterns') as string,
			communication_style: formData.get('communication_style') as string,
			conflict_style: formData.get('conflict_style') as string,

			// Section 6: Goals
			short_term_goals: formData.get('short_term_goals') as string,
			long_term_goals: formData.get('long_term_goals') as string,
			specific_scenarios: formData.get('specific_scenarios') as string,

			// Section 7: Logistics
			preferred_session_time: formData.get('preferred_session_time') as string,
			timezone: formData.get('timezone') as string,
			how_heard_about_us: formData.get('how_heard_about_us') as string,

			// Status update
			status: 'completed',
			completed_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		// Validate required fields
		if (!intakeData.current_challenges || !intakeData.desired_outcome) {
			return fail(400, {
				error: 'Please fill in the required fields (Current Challenges and Desired Outcome)'
			});
		}

		// Update the intake form
		const { error: updateError } = await adminSupabase
			.from('consulting_intake_forms')
			.update(intakeData)
			.eq('id', token);

		if (updateError) {
			console.error('Failed to save intake:', updateError);
			return fail(500, { error: 'Failed to save your responses. Please try again.' });
		}

		// Get the client_id to update their status
		const { data: intake } = await adminSupabase
			.from('consulting_intake_forms')
			.select('client_id')
			.eq('id', token)
			.single();

		if (intake?.client_id) {
			// Update client status to intake_completed
			await adminSupabase
				.from('consulting_clients')
				.update({
					status: 'intake_completed',
					updated_at: new Date().toISOString()
				})
				.eq('id', intake.client_id);
		}

		// Redirect to thank you page (same page will show completion message)
		return { success: true };
	}
};
