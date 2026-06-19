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
import {
	getNewsletterSignupProtectionState,
	recordNewsletterSignupSecurityEvent,
	type NewsletterSignupOutcome
} from '$lib/server/newsletterSignupProtection';
import { logger } from '$lib/utils/logger';

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const MIN_FORM_TIME_MS = 2500;
const BOT_USER_AGENT_PATTERNS = [
	/bot/i,
	/crawl/i,
	/spider/i,
	/scraper/i,
	/curl/i,
	/wget/i,
	/python-requests/i,
	/axios/i,
	/node-fetch/i,
	/headless/i,
	/phantom/i,
	/selenium/i,
	/puppeteer/i,
	/playwright/i
];

type SignupPayload = {
	email: string;
	honeypot: string;
	timeToken: number | null;
};

function toRecipient(email: string, sourceId: string): EmailRecipient {
	const normalized = normalizeEmail(email);
	return {
		id: sourceId,
		email,
		source: 'signups',
		source_id: sourceId || normalized || email
	};
}

async function readSignupPayload(request: Request): Promise<SignupPayload> {
	const contentType = request.headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		const body = (await request.json().catch(() => ({}))) as {
			email?: unknown;
			form_extra?: unknown;
			_timeToken?: unknown;
		};
		return {
			email: typeof body.email === 'string' ? body.email : '',
			honeypot: typeof body.form_extra === 'string' ? body.form_extra : '',
			timeToken:
				typeof body._timeToken === 'number'
					? body._timeToken
					: typeof body._timeToken === 'string'
						? parseInt(body._timeToken, 10)
						: null
		};
	}
	const form = await request.formData();
	const raw = form.get('email');
	const honeypot = form.get('form_extra');
	const timeTokenRaw = form.get('_timeToken');
	const timeToken =
		typeof timeTokenRaw === 'string' && timeTokenRaw.trim() ? parseInt(timeTokenRaw, 10) : null;

	return {
		email: typeof raw === 'string' ? raw : '',
		honeypot: typeof honeypot === 'string' ? honeypot : '',
		timeToken: Number.isFinite(timeToken) ? timeToken : null
	};
}

function isHoneypotTriggered(value: string): boolean {
	return value.trim().length > 0;
}

function hasBlockedEmailPattern(email: string): boolean {
	const [localPart] = email.split('@');
	if (!localPart) return true;
	return localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..');
}

function hasSuspiciousUserAgent(userAgent: string): boolean {
	if (!userAgent || userAgent.length < 20) return true;
	return BOT_USER_AGENT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function fakeSuccess() {
	return json({ ok: true });
}

async function recordSignupEvent(
	adminSupabase: any,
	outcome: NewsletterSignupOutcome,
	context: {
		ipAddress: string;
		email?: string | null;
		fingerprint?: string | null;
		userAgent?: string | null;
		details?: Record<string, unknown>;
	}
) {
	await recordNewsletterSignupSecurityEvent({
		supabase: adminSupabase,
		outcome,
		ipAddress: context.ipAddress,
		identifier: context.email,
		fingerprint: context.fingerprint,
		userAgent: context.userAgent,
		context: context.details
	});
}

export const POST: RequestHandler = async ({ request, cookies, getClientAddress }) => {
	const payload = await readSignupPayload(request);
	const rawEmail = payload.email;
	const normalizedEmail = rawEmail ? normalizeEmail(rawEmail) : '';
	const ipAddress = getClientAddress();
	const fingerprint = cookies.get('9tfingerprint') ?? null;
	const userAgent = request.headers.get('user-agent') || '';
	const adminSupabase = getSupabaseAdminClient() as any;

	if (!normalizedEmail || !EMAIL_RE.test(normalizedEmail)) {
		await recordSignupEvent(adminSupabase, 'invalid_email', {
			ipAddress,
			email: normalizedEmail || null,
			fingerprint,
			userAgent
		});
		return json(
			{ ok: false, code: 'invalid_email', message: 'Invalid email address' },
			{ status: 400 }
		);
	}

	if (hasBlockedEmailPattern(normalizedEmail)) {
		await recordSignupEvent(adminSupabase, 'blocked_email_pattern', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent
		});
		return json(
			{ ok: false, code: 'invalid_email', message: 'Invalid email address' },
			{ status: 400 }
		);
	}

	if (isHoneypotTriggered(payload.honeypot)) {
		await recordSignupEvent(adminSupabase, 'honeypot', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent
		});
		logger.warn('Newsletter signup honeypot triggered', { email: normalizedEmail });
		return fakeSuccess();
	}

	if (payload.timeToken !== null && payload.timeToken > 0 && payload.timeToken < MIN_FORM_TIME_MS) {
		await recordSignupEvent(adminSupabase, 'too_fast', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent,
			details: { timeToken: payload.timeToken }
		});
		logger.warn('Newsletter signup submitted too fast', {
			email: normalizedEmail,
			timeToken: payload.timeToken
		});
		return fakeSuccess();
	}

	if (hasSuspiciousUserAgent(userAgent)) {
		await recordSignupEvent(adminSupabase, 'bot_user_agent', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent
		});
		logger.warn('Newsletter signup suspicious user agent blocked', { email: normalizedEmail });
		return fakeSuccess();
	}

	const protectionState = await getNewsletterSignupProtectionState({
		supabase: adminSupabase,
		ipAddress,
		identifier: normalizedEmail
	});

	if (protectionState.authAbuse) {
		await recordSignupEvent(adminSupabase, 'auth_abuse', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent,
			details: { reason: protectionState.reason }
		});
		logger.warn('Newsletter signup blocked after recent auth abuse', {
			email: normalizedEmail,
			reason: protectionState.reason
		});
		return fakeSuccess();
	}

	if (protectionState.rateLimited) {
		await recordSignupEvent(adminSupabase, 'rate_limited', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent,
			details: { reason: protectionState.reason }
		});
		logger.warn('Newsletter signup rate limited', {
			email: normalizedEmail,
			reason: protectionState.reason
		});
		return fakeSuccess();
	}

	const { data: existing, error: existingError } = await adminSupabase
		.from('signups')
		.select('id')
		.eq('email', normalizedEmail)
		.maybeSingle();

	if (existingError) {
		logger.error('Failed to check existing signup', existingError, { email: normalizedEmail });
		return json(
			{ ok: false, code: 'server_error', message: 'Failed to save signup' },
			{ status: 500 }
		);
	}

	if (existing) {
		await recordSignupEvent(adminSupabase, 'already_exists', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent
		});
		return json({ ok: false, code: 'already_exists', message: 'Email already exists' });
	}

	const { data: insertedSignup, error: insertError } = await adminSupabase
		.from('signups')
		.insert([{ email: normalizedEmail }])
		.select('id')
		.single();

	if (insertError) {
		await recordSignupEvent(adminSupabase, 'failed', {
			ipAddress,
			email: normalizedEmail,
			fingerprint,
			userAgent,
			details: { phase: 'insert' }
		});
		logger.error('Failed to insert signup', insertError, { email: normalizedEmail });
		return json(
			{ ok: false, code: 'server_error', message: 'Failed to save signup' },
			{ status: 500 }
		);
	}

	try {
		if (fingerprint && insertedSignup?.id) {
			// Admin client: the RPC is granted to `authenticated` only, but signups
			// come from anonymous visitors — the anon role would fail silently here.
			const { error: attachError } = await adminSupabase.rpc('attach_signup_first_touch', {
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

	await recordSignupEvent(adminSupabase, 'success', {
		ipAddress,
		email: normalizedEmail,
		fingerprint,
		userAgent
	});

	logger.info('New signup submitted', { email: normalizedEmail });
	return json({ ok: true });
};
