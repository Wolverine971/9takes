// src/routes/intake/[token]/+page.server.ts
// Public client-facing intake form - no auth required.
//
// The consulting tables are admin-only for signed-in and anonymous clients, so
// this page reads and writes through the service-role client. Every query is
// scoped to the one intake form named by the token in the URL.

import { error, fail } from '@sveltejs/kit';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';
import { intakeSubmissionSchema, intakeTokenSchema } from '$lib/validation/intakeSchemas';
import type { Actions, PageServerLoad } from './$types';

const SUBMITTED_STATUSES = ['completed', 'reviewed'];
// A client only moves forward to "intake completed" from these states.
const CLIENT_STATUSES_AWAITING_INTAKE = ['prospect', 'intake_sent'];

/** The intake id from the URL, or a 404 when it is not a UUID. */
function requireIntakeToken(token: string): string {
	const parsed = intakeTokenSchema.safeParse(token);
	if (!parsed.success) {
		throw error(404, 'Invalid intake form link');
	}
	return parsed.data;
}

export const load: PageServerLoad = async ({ params }) => {
	const token = requireIntakeToken(params.token);
	const supabase = getSupabaseAdminClient();

	// Fetch the intake form and the client's first name for the greeting
	const { data: intake, error: intakeError } = await supabase
		.from('consulting_intake_forms')
		.select(
			`
			id,
			status,
			client:consulting_clients!consulting_intake_forms_client_id_fkey (
				name,
				enneagram_type
			)
		`
		)
		.eq('id', token)
		.maybeSingle();

	if (intakeError) {
		logger.error('Failed to load intake form', intakeError as unknown as Error);
		throw error(500, 'We could not load this form. Please try again.');
	}

	if (!intake) {
		throw error(404, 'Intake form not found or has expired');
	}

	// Extract client name for personalization
	const clientName = (intake.client as any)?.name?.split(' ')[0] || 'there';
	const clientType = (intake.client as any)?.enneagram_type || null;

	return {
		intake: {
			id: intake.id,
			status: intake.status,
			clientName,
			clientType
		},
		completed: SUBMITTED_STATUSES.includes(intake.status ?? '')
	};
};

export const actions: Actions = {
	submit: async ({ request, params }) => {
		const token = requireIntakeToken(params.token);
		const supabase = getSupabaseAdminClient();

		const parsed = intakeSubmissionSchema.safeParse(Object.fromEntries(await request.formData()));
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message ?? 'Please check your answers and try again.'
			});
		}

		const { data: intake, error: intakeError } = await supabase
			.from('consulting_intake_forms')
			.select('id, client_id, status')
			.eq('id', token)
			.maybeSingle();

		if (intakeError) {
			logger.error('Failed to load intake form before saving', intakeError as unknown as Error);
			return fail(500, { error: 'Failed to save your responses. Please try again.' });
		}

		if (!intake) {
			throw error(404, 'Intake form not found or has expired');
		}

		// A submitted form is final; later posts to the same link change nothing.
		if (SUBMITTED_STATUSES.includes(intake.status ?? '')) {
			return fail(409, { error: 'This form has already been submitted.' });
		}

		const submittedAt = new Date().toISOString();

		// Only the answer columns and the completion markers are written. The status
		// filter repeats the check above so two simultaneous posts cannot both save.
		const { data: saved, error: updateError } = await supabase
			.from('consulting_intake_forms')
			.update({
				...parsed.data,
				status: 'completed',
				completed_at: submittedAt,
				updated_at: submittedAt
			})
			.eq('id', token)
			.or('status.is.null,status.in.(pending,sent)')
			.select('id');

		if (updateError) {
			logger.error('Failed to save intake form', updateError as unknown as Error);
			return fail(500, { error: 'Failed to save your responses. Please try again.' });
		}

		if (!saved?.length) {
			return fail(409, { error: 'This form has already been submitted.' });
		}

		if (intake.client_id) {
			const { error: clientError } = await supabase
				.from('consulting_clients')
				.update({ status: 'intake_completed', updated_at: submittedAt })
				.eq('id', intake.client_id)
				.or(`status.is.null,status.in.(${CLIENT_STATUSES_AWAITING_INTAKE.join(',')})`);

			if (clientError) {
				logger.error('Failed to mark client intake as completed', clientError as unknown as Error);
			}
		}

		// The same page shows the completion message.
		return { success: true };
	}
};
