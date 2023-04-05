import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import { PRIVATE_gmail_private_key } from '$env/static/private';

import type { PageServerLoad } from './$types';

import { google } from 'googleapis';

export const load: PageServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	};
};

import type { Actions, RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import { joinEmail2 } from '../../emails';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { data: emailExists } = await supabase
			.from('signups')
			.select('*')
			.eq('email', body.email);
		if (emailExists) {
			throw error(404, {
				message: 'Email already exists'
			});
		}
		const { error: insertError } = await supabase.from('signups').insert([{ email: body.email }]);

		if (!insertError) {
			console.log('woot');
			const sent: any = await sendEmail({
				to: body.email.toString(),
				subject: 'Welcome to the Waitlist for 9takes',
				body: joinEmail2()
			});
			return { success: true };
		} else {
			console.log(error);
			throw error(404, {
				message: 'Failed to insert email'
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
		const authClient = new google.auth.JWT(
			'id-takes-gmail-service-account@smart-mark-302504.iam.gserviceaccount.com',
			null,
			PRIVATE_gmail_private_key,
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
		console.log(e);
		return false;
	}
};
