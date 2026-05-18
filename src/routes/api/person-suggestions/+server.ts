// src/routes/api/person-suggestions/+server.ts
// Public POST endpoint for famous-person suggestions. Replaces the legacy
// /email?/submitFamousPerson form action. Returns { ok: true } |
// { ok: false, code, message }.
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { personSuggestionEmail } from '../../../emails';
import { sendEmail as sendManagedEmail } from '$lib/email/sender';
import { supabase } from '$lib/supabase';
import { emailSubmissionSchema } from '$lib/validation/schemas';
import { logger } from '$lib/utils/logger';

const db = supabase as any;

async function readBody(request: Request): Promise<Record<string, unknown>> {
	const contentType = request.headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		return ((await request.json().catch(() => ({}))) as Record<string, unknown>) || {};
	}
	const form = await request.formData();
	return Object.fromEntries(form);
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await readBody(request);

	let validatedData;
	try {
		validatedData = emailSubmissionSchema.parse(body);
	} catch (e) {
		if (e instanceof z.ZodError) {
			logger.warn('Person suggestion validation failed', { errors: e.errors });
			return json(
				{ ok: false, code: 'invalid_input', message: 'Invalid input data' },
				{ status: 400 }
			);
		}
		throw e;
	}

	const { email, suggestedPerson } = validatedData;
	const normalizedEmail = email.toLowerCase().trim();

	// Server-side rate limiting: max 3 suggestions per email per 24 hours
	const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
	const { count, error: countError } = await db
		.from('person_suggestions')
		.select('*', { count: 'exact', head: true })
		.eq('email', normalizedEmail)
		.gte('created_at', twentyFourHoursAgo);

	if (countError) {
		logger.error('Failed to check rate limit', countError, { email: normalizedEmail });
		// Continue with submission if rate limit check fails
	} else if (count !== null && count >= 3) {
		logger.warn('Rate limit exceeded for person suggestion', { email: normalizedEmail, count });
		return json(
			{ ok: false, code: 'rate_limited', message: 'Too many suggestions. Try again in 24 hours.' },
			{ status: 429 }
		);
	}

	const { error: insertError } = await db
		.from('person_suggestions')
		.insert([{ email: normalizedEmail, person_name: suggestedPerson }]);

	if (insertError) {
		logger.error('Failed to insert person suggestion', insertError, {
			email,
			suggestedPerson
		});
		return json(
			{ ok: false, code: 'server_error', message: 'Failed to save suggestion' },
			{ status: 500 }
		);
	}

	try {
		const result = await sendManagedEmail({
			to: email,
			subject: `Thanks for suggesting ${suggestedPerson}`,
			htmlContent: personSuggestionEmail(),
			includeFooter: false
		});
		if (!result.success) {
			throw new Error(result.error || 'Failed to send confirmation email');
		}
		logger.info('Person suggestion submitted', { email, suggestedPerson });
	} catch (e) {
		logger.error('Error sending confirmation email', e as Error, { email });
		// Still report success - suggestion was saved
	}

	return json({ ok: true });
};
