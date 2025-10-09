// src/routes/email/+page.server.ts
import { PRIVATE_gmail_private_key } from '$env/static/private';

import type { PageServerLoad } from './$types';

import { google } from 'googleapis';
import {
	emailSubmissionSchema,
	emailTemplateSchema,
	customEmailSchema
} from '$lib/validation/schemas';
import { z } from 'zod';
import { logger } from '$lib/utils/logger';

export const load: PageServerLoad = async (event) => {
	const session = event.locals.session;

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

import type { Actions } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import {
	forgotPass,
	joinEmail,
	joinEmail2,
	personSuggestionEmail,
	signupEmail
} from '../../emails';
import { error, redirect } from '@sveltejs/kit';
import { checkDemoTime } from '../../utils/api';

export const actions: Actions = {
	submitFamousPerson: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());

		// Validate input
		let validatedData;
		try {
			validatedData = emailSubmissionSchema.parse(body);
		} catch (e) {
			if (e instanceof z.ZodError) {
				logger.warn('Person suggestion validation failed', { errors: e.errors });
				throw error(400, {
					message: 'Invalid input data',
					details: e.errors
				});
			}
			throw e;
		}

		const { email, suggestedPerson } = validatedData;

		const { error: insertError } = await supabase
			.from('person_suggestions')
			.insert([{ email: email, person_name: suggestedPerson }]);

		if (insertError) {
			logger.error('Failed to insert person suggestion', insertError, { email, suggestedPerson });
			throw error(500, 'Failed to save suggestion');
		}

		try {
			const sent = await sendEmail({
				to: email,
				subject: `Thanks for suggesting ${suggestedPerson}`,
				body: personSuggestionEmail()
			});

			if (!sent) {
				logger.error('Failed to send confirmation email', { email });
				// Don't fail the request if email fails - suggestion was saved
			}

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

		const demo_time = await checkDemoTime();

		const { data: user, error: findUserError } = await supabase
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
				throw error(400, {
					message: 'Invalid input data',
					details: e.errors
				});
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
			const sent = await sendEmail({
				to: email,
				subject,
				body: emailTypeToSend
			});

			if (!sent) {
				logger.error('Failed to send test email', { email, emailType });
				throw error(500, 'Failed to send test email');
			}

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

		const demo_time = await checkDemoTime();

		const { data: user, error: findUserError } = await supabase
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

		if (!email) {
			throw error(404, {
				message: 'no email'
			});
		}

		try {
			const sent = await sendEmail({
				to: body.email.toString(),
				subject,
				body: emailToSend
			});
			if (sent) {
				return { success: true };
			} else {
				throw error(404, {
					message: `Failed to test email, no error available`
				});
			}
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

		const demo_time = await checkDemoTime();

		const { data: user, error: findUserError } = await supabase
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

		const { data: signups, error: signupsError } = await supabase.from('signups').select('*');

		if (signupsError) {
			throw error(404, {
				message: `Failed to get signups, ${JSON.stringify(signupsError)}`
			});
		}

		try {
			for (const signup of signups) {
				const sent = await sendEmail({
					to: signup.email.toString(),
					subject,
					body: emailToSend
				});
				if (sent) {
					console.log(`sent to ${signup.email.toString()}`);
				} else {
					throw error(404, {
						message: `Failed to test email, no error available`
					});
				}
			}
		} catch (e) {
			throw error(404, {
				message: `Failed to send email, ${JSON.stringify(e)}`
			});
		}
	}
};

const makeBody = ({
	toEmails,
	fromEmail,
	subject,
	message
}: {
	toEmails: string[];
	fromEmail: string;
	subject: string;
	message: string;
}) => {
	const str = [
		'Content-Type: text/html; charset="UTF-8"\n',
		'MIME-Version: 1.0\n',
		'Content-Transfer-Encoding: 7bit\n',
		`to: ${toEmails.join(',')}\n`,
		`from: ${fromEmail}\n`,
		`subject: ${subject}\n\n`,
		message
	].join('');

	return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
};

const sendEmail = async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
	try {
		const { privateKey } = JSON.parse(PRIVATE_gmail_private_key);
		const authClient = new google.auth.JWT(
			'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
			'',
			privateKey,
			['https://www.googleapis.com/auth/gmail.send'],
			'usersup@9takes.com'
		);
		const gmail = google.gmail({
			auth: authClient,
			version: 'v1'
		});

		return await gmail.users.messages.send({
			requestBody: {
				raw: makeBody({ toEmails: [to], fromEmail: 'usersup@9takes.com', subject, message: body })
			},
			userId: 'me'
		});
	} catch (e) {
		throw error(404, {
			message: `Failed send email, ${JSON.stringify(e)}`
		});
	}
};
