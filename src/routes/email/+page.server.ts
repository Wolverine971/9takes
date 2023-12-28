import { PRIVATE_gmail_private_key } from '$env/static/private';

import type { PageServerLoad } from './$types';

import { google } from 'googleapis';

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
		console.log(findUserError);
	}

	return {
		session
	};
};

import type { Actions } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { forgotPass, joinEmail, joinEmail2, signupEmail } from '../../emails';
import { error, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	submit: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());

		const email = body.email.toString();

		const { data: emailExists, error: emailError } = await supabase
			.from('signups')
			.select('*')
			.eq('email', email)

		if (emailError) {
			console.log(emailError)
			throw error(404, {
				message: 'Email already exists'
			});
		}

		if (emailExists?.length > 0) {
			console.log(emailExists)
			throw error(404, {
				message: 'Email already exists'
			});
		}
		const { error: insertError } = await supabase
			.from('signups')
			.insert([{ email: body.email, name: '' }]);

		if (!insertError) {
			try {
				const sent = await sendEmail({
					to: body.email.toString(),
					subject: 'Welcome to the Waitlist for 9takes',
					body: joinEmail2()
				});
				if (sent) {
					return { success: true };
				} else {
					throw error(404, {
						message: `Failed to insert email, no error available`
					});
				}
			} catch (e) {
				throw error(404, {
					message: `Failed to insert email, ${JSON.stringify(e)}`
				});
			}
		} else {
			throw error(404, {
				message: `Failed to insert email, ${JSON.stringify(insertError)}`
			});
		}
	},
	emailTest: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
		const email = body.email.toString();
		const subject = body.subject ? body.subject.toString() : 'TEST EMAIL for 9takes';
		const emailType = body.emailType.toString();

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

		if (!email) {
			throw error(404, {
				message: 'no email'
			});
		}

		try {
			const sent = await sendEmail({
				to: body.email.toString(),
				subject,
				body: emailTypeToSend
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
