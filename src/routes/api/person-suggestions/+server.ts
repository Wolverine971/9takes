// src/routes/api/person-suggestions/+server.ts
// Public POST endpoint for famous-person suggestions. Replaces the legacy
// /email?/submitFamousPerson form action. Returns { ok: true } |
// { ok: false, code, message }.
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { consumeApiRateLimit } from '$lib/server/apiRateLimit';
import { verifyPersonSuggestionToken } from '$lib/server/personSuggestionVerification';
import { emailSubmissionSchema } from '$lib/validation/schemas';
import { logger } from '$lib/utils/logger';

async function readBody(request: Request): Promise<Record<string, unknown>> {
	const contentType = request.headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		const body: unknown = await request.json();
		if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
		return body as Record<string, unknown>;
	}
	const form = await request.formData();
	return Object.fromEntries(form);
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	let body: Record<string, unknown>;
	try {
		body = await readBody(request);
	} catch {
		return json(
			{ ok: false, code: 'invalid_input', message: 'Invalid input data' },
			{ status: 400 }
		);
	}
	if (typeof body.form_extra === 'string' && body.form_extra.trim()) {
		return json({ ok: true });
	}
	// Old clients and direct bot posts must not reach the database or send email.
	const token = body['cf-turnstile-response'];
	if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
		return json(
			{
				ok: false,
				code: 'verification_failed',
				message: 'Please complete the verification and try again.'
			},
			{ status: 400 }
		);
	}
	const clientAddress = getClientAddress();
	const rate = await consumeApiRateLimit({
		bucket: 'person_suggestion',
		subject: `ip:${clientAddress}`
	});
	if (!rate.allowed)
		return json(
			{ ok: false, code: 'rate_limited', message: 'Please try again later.' },
			{ status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } }
		);

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
	const verification = await verifyPersonSuggestionToken(token, clientAddress);
	if (verification !== 'verified') {
		return json(
			{
				ok: false,
				code: verification === 'unavailable' ? 'unavailable' : 'verification_failed',
				message:
					verification === 'unavailable'
						? 'Verification is temporarily unavailable. Please try again.'
						: 'Please complete the verification and try again.'
			},
			{ status: verification === 'unavailable' ? 503 : 400 }
		);
	}
	const db = getSupabaseAdminClient() as any;

	// Server-side rate limiting: max 3 suggestions per email per 24 hours
	const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
	const { count, error: countError } = await db
		.from('person_suggestions')
		.select('*', { count: 'exact', head: true })
		.eq('email', normalizedEmail)
		.gte('created_at', twentyFourHoursAgo);

	if (countError) {
		logger.error('Failed to check rate limit', countError, { email: normalizedEmail });
		return json(
			{ ok: false, code: 'unavailable', message: 'Please try again later.' },
			{ status: 503 }
		);
	} else if (count !== null && count >= 3) {
		logger.warn('Rate limit exceeded for person suggestion', { email: normalizedEmail, count });
		return json(
			{ ok: false, code: 'rate_limited', message: 'Too many suggestions. Try again in 24 hours.' },
			{ status: 429 }
		);
	}

	const { error: insertError } = await db
		.from('person_suggestions')
		.insert([{ email: normalizedEmail, person_name: suggestedPerson.trim() }]);

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

	// The on-page receipt is enough. Never email an unverified, caller-supplied
	// address: bots used this form to send unsolicited confirmations and bounces.
	return json({ ok: true });
};
