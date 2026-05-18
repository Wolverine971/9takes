// src/routes/admin/transactional-emails/+page.server.ts
// Admin-only test-send + custom-compose endpoints for the transactional-emails
// admin page. Auth + admin gating is handled by /admin/+layout.server.ts for
// the page load; inline admin checks defend the form actions against direct
// POSTs from non-admins.
import type { Actions } from './$types';
import type { EmailRecipient } from '$lib/types/email';
import { error } from '@sveltejs/kit';
import { checkDemoTime } from '../../../utils/api';
import { forgotPass, joinEmail, joinEmail2, signupEmail } from '../../../emails';
import { sendBatchEmails, sendEmailWithTracking } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { logger } from '$lib/utils/logger';
import { emailTemplateSchema } from '$lib/validation/schemas';
import { z } from 'zod';

function toLegacyRecipient(email: string, sourceId?: string, name?: string | null): EmailRecipient {
	const normalizedEmail = normalizeEmail(email);
	const resolvedSourceId = sourceId || normalizedEmail || email;
	return {
		id: resolvedSourceId,
		email,
		name: name || undefined,
		source: 'signups',
		source_id: resolvedSourceId
	};
}

async function assertAdmin(locals: App.Locals): Promise<void> {
	if (!locals?.session?.user?.id) {
		throw error(401, 'unauthorized');
	}
	const demo_time = await checkDemoTime(locals.supabase);
	const dbLocal = locals.supabase as any;
	const { data: user, error: findUserError } = await dbLocal
		.from(demo_time === true ? 'profiles_demo' : 'profiles')
		.select('id, admin, external_id')
		.eq('id', locals.session.user.id)
		.single();
	if (findUserError || !user?.admin) {
		throw error(403, 'unauthorized');
	}
}

export const actions: Actions = {
	emailTemplate: async ({ request, locals }) => {
		await assertAdmin(locals);
		const dbLocal = locals.supabase as any;
		const body = Object.fromEntries(await request.formData());

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

		let emailTypeToSend = '';
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
				emailTypeToSend = forgotPass('https://9takes.com/reset-password?token=sample');
				break;
			default:
				emailTypeToSend = joinEmail();
				break;
		}

		try {
			const result = await sendEmailWithTracking(dbLocal, {
				recipient: toLegacyRecipient(email, normalizeEmail(email)),
				subject,
				htmlContent: emailTypeToSend,
				sentBy: locals.session!.user.id,
				includeFooter: false
			});
			if (!result.success) {
				throw new Error(result.error || 'Failed to send test email');
			}
			logger.info('Test email sent', {
				email,
				emailType,
				adminId: locals.session!.user.id
			});
			return { success: true };
		} catch (e) {
			logger.error('Error sending test email', e as Error, { email, emailType });
			throw error(500, 'Failed to send test email');
		}
	},

	singleCustomEmail: async ({ request, locals }) => {
		await assertAdmin(locals);
		const dbLocal = locals.supabase as any;
		const body = Object.fromEntries(await request.formData());
		const email = body.email.toString();
		const emailToSend = body.emailToSend.toString();
		const subject = body.subject ? body.subject.toString() : 'TEST EMAIL for 9takes';
		const normalizedEmail = normalizeEmail(email);

		if (!email) {
			throw error(404, { message: 'no email' });
		}

		const suppressedSet = await getSuppressedEmailSet(dbLocal, [normalizedEmail]);
		if (suppressedSet.has(normalizedEmail)) {
			throw error(400, { message: 'Recipient has unsubscribed and is suppressed' });
		}

		try {
			const result = await sendEmailWithTracking(dbLocal, {
				recipient: toLegacyRecipient(email, normalizedEmail),
				subject,
				htmlContent: emailToSend,
				sentBy: locals.session!.user.id,
				includeFooter: true
			});
			if (!result.success) {
				throw new Error(result.error || `Failed to send email to ${email}`);
			}
			return { success: true };
		} catch (e) {
			throw error(404, { message: `Failed to send email, ${JSON.stringify(e)}` });
		}
	},

	sendCustomEmailToEveryone: async ({ request, locals }) => {
		await assertAdmin(locals);
		const dbLocal = locals.supabase as any;
		const body = Object.fromEntries(await request.formData());
		const subject = body.subject ? body.subject.toString() : 'TEST EMAIL for 9takes';
		const emailToSend = body.emailToSend.toString();

		if (!emailToSend) {
			throw error(404, { message: 'no email' });
		}

		const { data: signups, error: signupsError } = await dbLocal
			.from('signups')
			.select('id, email, name');

		if (signupsError) {
			throw error(404, { message: `Failed to get signups, ${JSON.stringify(signupsError)}` });
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
				sentBy: locals.session!.user.id,
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
			throw error(404, { message: `Failed to send email, ${JSON.stringify(e)}` });
		}
	}
};
