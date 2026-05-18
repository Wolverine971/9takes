// src/routes/api/signups/+server.ts
// Public POST endpoint for waitlist/email signups. Replaces the legacy
// /email?/submit form action. Accepts FormData or JSON; returns clean JSON
// shaped as { ok: true } | { ok: false, code, message }.
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { EmailRecipient } from '$lib/types/email';
import { signupWelcomeEmail } from '../../../emails';
import { sendEmailWithTracking } from '$lib/email/sender';
import { normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { logger } from '$lib/utils/logger';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function toRecipient(email: string, sourceId: string): EmailRecipient {
	const normalized = normalizeEmail(email);
	return {
		id: sourceId,
		email,
		source: 'signups',
		source_id: sourceId || normalized || email
	};
}

async function readEmail(request: Request): Promise<string> {
	const contentType = request.headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		const body = (await request.json().catch(() => ({}))) as { email?: unknown };
		return typeof body.email === 'string' ? body.email : '';
	}
	const form = await request.formData();
	const raw = form.get('email');
	return typeof raw === 'string' ? raw : '';
}

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const dbLocal = locals.supabase as any;
	const rawEmail = await readEmail(request);
	const normalizedEmail = rawEmail ? normalizeEmail(rawEmail) : '';

	if (!normalizedEmail || !EMAIL_RE.test(normalizedEmail)) {
		return json(
			{ ok: false, code: 'invalid_email', message: 'Invalid email address' },
			{ status: 400 }
		);
	}

	const { data: existing } = await dbLocal
		.from('signups')
		.select('id')
		.eq('email', normalizedEmail)
		.single();

	if (existing) {
		return json({ ok: false, code: 'already_exists', message: 'Email already exists' });
	}

	const { data: insertedSignup, error: insertError } = await dbLocal
		.from('signups')
		.insert([{ email: normalizedEmail }])
		.select('id')
		.single();

	if (insertError) {
		logger.error('Failed to insert signup', insertError, { email: normalizedEmail });
		return json(
			{ ok: false, code: 'server_error', message: 'Failed to save signup' },
			{ status: 500 }
		);
	}

	try {
		const fingerprint = cookies.get('9tfingerprint');
		if (fingerprint && insertedSignup?.id) {
			const { error: attachError } = await dbLocal.rpc('attach_signup_first_touch', {
				p_signup_id: insertedSignup.id,
				p_fingerprint: fingerprint
			});
			if (attachError) {
				logger.warn('Failed to attach first-touch metadata to signup', {
					email: normalizedEmail,
					signupId: insertedSignup.id,
					error: attachError
				});
			}
		}
	} catch (attachError) {
		logger.warn('Unexpected error attaching first-touch metadata to signup', {
			email: normalizedEmail,
			error: attachError
		});
	}

	try {
		const adminSupabase = getSupabaseAdminClient() as any;
		const result = await sendEmailWithTracking(adminSupabase, {
			recipient: toRecipient(normalizedEmail, String(insertedSignup.id)),
			subject: 'You are in for 9takes updates',
			preheader: 'A practical place to start: answer before reading the room.',
			htmlContent: signupWelcomeEmail(),
			sentBy: null,
			includeFooter: true
		});

		if (!result.success) {
			throw new Error(result.error || 'Failed to send signup welcome email');
		}
	} catch (e) {
		logger.warn('Failed to send signup welcome email', { email: normalizedEmail, error: e });
		// Don't fail the request - signup was saved
	}

	logger.info('New signup submitted', { email: normalizedEmail });
	return json({ ok: true });
};
