// src/routes/email/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import type { EmailRecipient } from '$lib/types/email';
import { error, redirect } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';
import {
	forgotPass,
	joinEmail,
	joinEmail2,
	personSuggestionEmail,
	signupEmail,
	signupWelcomeEmail
} from '../../emails';
import { supabase } from '$lib/supabase';
import {
	sendBatchEmails,
	sendEmail as sendManagedEmail,
	sendEmailWithTracking
} from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { logger } from '$lib/utils/logger';
import { emailSubmissionSchema, emailTemplateSchema } from '$lib/validation/schemas';
import { z } from 'zod';

const db = supabase as any;

function toLegacyRecipient(
	email: string,
	source: EmailRecipient['source'] = 'signups',
	sourceId?: string,
	name?: string | null
): EmailRecipient {
	const normalizedEmail = normalizeEmail(email);
	const resolvedSourceId = sourceId || normalizedEmail || email;
	return {
		id: resolvedSourceId,
		email,
		name: name || undefined,
		source,
		source_id: resolvedSourceId
	};
}

async function sendUntrackedLegacyEmail(options: {
	to: string;
	subject: string;
	body: string;
	includeFooter?: boolean;
}) {
	const { to, subject, body, includeFooter = false } = options;
	const result = await sendManagedEmail({
		to,
		subject,
		htmlContent: body,
		includeFooter
	});
	if (!result.success) {
		throw new Error(result.error || 'Failed to send email');
	}
}

async function sendTrackedLegacyEmail(options: {
	supabaseClient: any;
	recipient: EmailRecipient;
	subject: string;
	body: string;
	sentBy: string;
	includeFooter?: boolean;
}) {
	const { supabaseClient, recipient, subject, body, sentBy, includeFooter = true } = options;
	const result = await sendEmailWithTracking(supabaseClient, {
		recipient,
		subject,
		htmlContent: body,
		sentBy,
		includeFooter
	});
	if (!result.success) {
		throw new Error(result.error || `Failed to send email to ${recipient.email}`);
	}
}

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;
	const supabase = event.locals.supabase as any;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { demo_time } = await event.parent();

	const { data: user, error: findUserError } = await supabase
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', session?.user?.id)
		.single();

	if (!user?.admin) {
		throw redirect(307, '/questions');
	}

	if (findUserError) {
		// Handle find user error
	}

	return {
		session
	};
};

export const actions: Actions = {
	submit: async ({ request, locals, cookies }) => {
		const dbLocal = locals.supabase as any;
		const body = Object.fromEntries(await request.formData());
		const email = body.email?.toString()?.trim();
		const normalizedEmail = email ? normalizeEmail(email) : '';

		if (!normalizedEmail || !/\S+@\S+\.\S+/.test(normalizedEmail)) {
			return { data: null, error: { message: 'Invalid email address' } };
		}

		// Check if email already exists
		const { data: existing } = await dbLocal
			.from('signups')
			.select('id')
			.eq('email', normalizedEmail)
			.single();

		if (existing) {
			return { data: null, error: { message: 'Email already exists' } };
		}

		// Insert new signup
		const { data: insertedSignup, error: insertError } = await dbLocal
			.from('signups')
			.insert([{ email: normalizedEmail }])
			.select('id')
			.single();

		if (insertError) {
			logger.error('Failed to insert signup', insertError, { email: normalizedEmail });
			return { data: null, error: { message: 'Failed to save signup' } };
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

		// Send welcome email
		try {
			await sendUntrackedLegacyEmail({
				to: normalizedEmail,
				subject: 'You are in for 9takes updates',
				body: signupWelcomeEmail()
			});
		} catch (e) {
			logger.warn('Failed to send signup welcome email', { email: normalizedEmail, error: e });
			// Don't fail - signup was saved
		}

		logger.info('New signup submitted', { email: normalizedEmail });
		return { data: { success: true }, error: null };
	},

	submitFamousPerson: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());

		// Validate input
		let validatedData;
		try {
			validatedData = emailSubmissionSchema.parse(body);
		} catch (e) {
			if (e instanceof z.ZodError) {
				logger.warn('Person suggestion validation failed', { errors: e.errors });
				throw error(400, 'Invalid input data');
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
			throw error(429, 'Too many suggestions. Please try again in 24 hours.');
		}

		const { error: insertError } = await db
			.from('person_suggestions')
			.insert([{ email: normalizedEmail, person_name: suggestedPerson }]);

		if (insertError) {
			logger.error('Failed to insert person suggestion', insertError, { email, suggestedPerson });
			throw error(500, 'Failed to save suggestion');
		}

		try {
			await sendUntrackedLegacyEmail({
				to: email,
				subject: `Thanks for suggesting ${suggestedPerson}`,
				body: personSuggestionEmail()
			});

			logger.info('Person suggestion submitted', { email, suggestedPerson });
			return { success: true };
		} catch (e) {
			logger.error('Error sending confirmation email', e as Error, { email });
			// Still return success since suggestion was saved
			return { success: true };
		}
	},

	emailTemplate: async ({ request, locals }) => {
		if (!locals?.session?.user?.id) {
			throw error(400, 'unauthorized');
		}

		const demo_time = await checkDemoTime(locals.supabase);
		const dbLocal = locals.supabase as any;

		const { data: user, error: findUserError } = await dbLocal
			.from(demo_time === true ? 'profiles_demo' : 'profiles')
			.select('id, admin, external_id')
			.eq('id', locals?.session?.user?.id)
			.single();

		if (!user?.admin) {
			throw error(400, 'unauthorized');
		}
		if (findUserError) {
			throw error(400, 'unauthorized');
		}

		const body = Object.fromEntries(await request.formData());

		// Validate input
		let validatedData;
		try {
			validatedData = emailTemplateSchema.parse({
				...body,
				subject: body.subject || 'TEST EMAIL for 9takes'
			});
		} catch (e) {
			if (e instanceof z.ZodError) {
				logger.warn('Email template validation failed', { errors: e.errors });
				throw error(400, 'Invalid input data');
			}
			throw e;
		}

		const { email, subject, emailType } = validatedData;

		let emailTypeToSend: string = '';

		switch (emailType) {
			case 'joinEmail':
				emailTypeToSend = joinEmail();
				break;
			case 'joinEmail2':
				emailTypeToSend = joinEmail2();
				break;

			case 'signupEmail':
				emailTypeToSend = signupEmail();
				break;

			case 'forgotPass':
				emailTypeToSend = forgotPass('test');
				break;

			default:
				emailTypeToSend = joinEmail();
				break;
		}

		try {
			await sendTrackedLegacyEmail({
				supabaseClient: dbLocal,
				recipient: toLegacyRecipient(email, 'signups', normalizeEmail(email)),
				subject,
				body: emailTypeToSend,
				sentBy: locals.session.user.id,
				includeFooter: false
			});

			logger.info('Test email sent', { email, emailType, adminId: locals.session.user.id });
			return { success: true };
		} catch (e) {
			logger.error('Error sending test email', e as Error, { email, emailType });
			throw error(500, 'Failed to send test email');
		}
	},
	singleCustomEmail: async ({ request, locals }) => {
		if (!locals?.session?.user?.id) {
			throw error(400, 'unauthorized');
		}

		const demo_time = await checkDemoTime(locals.supabase);
		const dbLocal = locals.supabase as any;

		const { data: user, error: findUserError } = await dbLocal
			.from(demo_time === true ? 'profiles_demo' : 'profiles')
			.select('id, admin, external_id')
			.eq('id', locals?.session?.user?.id)
			.single();

		if (!user?.admin) {
			throw error(400, 'unauthorized');
		}
		if (findUserError) {
			throw error(400, 'unauthorized');
		}

		const body = Object.fromEntries(await request.formData());
		const email = body.email.toString();
		const emailToSend = body.emailToSend.toString();
		const subject = body.subject ? body.subject.toString() : 'TEST EMAIL for 9takes';
		const normalizedEmail = normalizeEmail(email);

		if (!email) {
			throw error(404, {
				message: 'no email'
			});
		}

		const suppressedSet = await getSuppressedEmailSet(dbLocal, [normalizedEmail]);
		if (suppressedSet.has(normalizedEmail)) {
			throw error(400, {
				message: 'Recipient has unsubscribed and is suppressed'
			});
		}

		try {
			await sendTrackedLegacyEmail({
				supabaseClient: dbLocal,
				recipient: toLegacyRecipient(email, 'signups', normalizedEmail),
				subject,
				body: emailToSend,
				sentBy: locals.session.user.id,
				includeFooter: true
			});
			return { success: true };
		} catch (e) {
			throw error(404, {
				message: `Failed to send email, ${JSON.stringify(e)}`
			});
		}
	},
	sendCustomEmailToEveryone: async ({ request, locals }) => {
		if (!locals?.session?.user?.id) {
			throw error(400, 'unauthorized');
		}

		const demo_time = await checkDemoTime(locals.supabase);
		const dbLocal = locals.supabase as any;

		const { data: user, error: findUserError } = await dbLocal
			.from(demo_time === true ? 'profiles_demo' : 'profiles')
			.select('id, admin, external_id')
			.eq('id', locals?.session?.user?.id)
			.single();

		if (!user?.admin) {
			throw error(400, 'unauthorized');
		}
		if (findUserError) {
			throw error(400, 'unauthorized');
		}

		const body = Object.fromEntries(await request.formData());
		const subject = body.subject ? body.subject.toString() : 'TEST EMAIL for 9takes';
		const emailToSend = body.emailToSend.toString();

		if (!emailToSend) {
			throw error(404, {
				message: 'no email'
			});
		}

		const { data: signups, error: signupsError } = await dbLocal.from('signups').select('*');

		if (signupsError) {
			throw error(404, {
				message: `Failed to get signups, ${JSON.stringify(signupsError)}`
			});
		}

		const signupRows = signups || [];
		const suppressedSet = await getSuppressedEmailSet(
			dbLocal,
			signupRows.map((signup: { email?: string | null }) => signup.email)
		);
		const eligibleSignups = signupRows.filter(
			(signup: { email?: string | null }) => !suppressedSet.has(normalizeEmail(signup.email))
		);

		try {
			const recipients = eligibleSignups
				.map(
					(signup: {
						id?: string | number | null;
						email?: string | null;
						name?: string | null;
					}) => {
						const recipientEmail = String(signup.email || '').trim();
						if (!recipientEmail) return null;
						return toLegacyRecipient(
							recipientEmail,
							'signups',
							signup.id ? String(signup.id) : normalizeEmail(recipientEmail),
							signup.name
						);
					}
				)
				.filter((recipient: EmailRecipient | null): recipient is EmailRecipient =>
					Boolean(recipient)
				);

			if (recipients.length === 0) {
				return {
					success: true,
					sent: 0,
					failed: 0,
					skipped_suppressed: signupRows.length - eligibleSignups.length
				};
			}

			const result = await sendBatchEmails(dbLocal, {
				recipients,
				subject,
				htmlContent: emailToSend,
				sentBy: locals.session.user.id,
				delayMs: 100,
				includeFooter: true
			});

			return {
				success: result.sent > 0 || recipients.length === 0,
				sent: result.sent,
				failed: result.failed,
				skipped_suppressed: signupRows.length - eligibleSignups.length,
				results: result.results
			};
		} catch (e) {
			throw error(404, {
				message: `Failed to send email, ${JSON.stringify(e)}`
			});
		}
	}
};
